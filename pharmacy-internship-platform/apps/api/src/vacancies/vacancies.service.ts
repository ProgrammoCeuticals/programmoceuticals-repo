import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrganisationsService } from '../organisations/organisations.service';
import { VacancyGateway } from './vacancy.gateway';
import { CreateVacancyDto, UpdateVacancyDto, VacancySearchQueryDto } from './dto/vacancy.dto';
import { OrgMemberRole } from '@pharmintern/shared-types';

const EMPLOYER_WRITE_ROLES = [OrgMemberRole.ORGANISATION_OWNER, OrgMemberRole.RECRUITER_HR];

@Injectable()
export class VacanciesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orgsService: OrganisationsService,
    private readonly gateway: VacancyGateway,
  ) {}

  // ── Public search ─────────────────────────────────────────────────────────

  async search(query: VacancySearchQueryDto) {
    const page = query.page ?? 1;
    const pageSize = Math.min(query.pageSize ?? 20, 100);
    const skip = (page - 1) * pageSize;
    const today = new Date();

    const where: Record<string, unknown> = {
      status: 'PUBLISHED',
      OR: [
        { applicationDeadline: null },
        { applicationDeadline: { gte: today } },
      ],
    };

    if (query.keyword) {
      where['title'] = { contains: query.keyword, mode: 'insensitive' };
    }

    if (query.accommodation) {
      where['accommodationStatus'] = query.accommodation;
    }

    if (query.deadlineAfter) {
      where['applicationDeadline'] = { gte: new Date(query.deadlineAfter) };
    }

    if (query.startAfter) {
      where['expectedStartDate'] = { gte: new Date(query.startAfter) };
    }

    if (query.practiceAreaId) {
      where['practiceAreas'] = {
        some: { practiceAreaId: query.practiceAreaId },
      };
    }

    if (query.stateId || query.city) {
      where['location'] = {
        ...(query.stateId && { stateId: query.stateId }),
        ...(query.city && { city: { contains: query.city, mode: 'insensitive' } }),
      };
    }

    const orderBy =
      query.sort === 'deadline_asc'
        ? { applicationDeadline: 'asc' as const }
        : { publishedAt: 'desc' as const };

    const [items, total] = await Promise.all([
      this.prisma.vacancy.findMany({
        where,
        include: {
          organisation: { select: { id: true, name: true } },
          location: { select: { id: true, name: true, city: true, state: { select: { name: true } } } },
          practiceAreas: { include: { practiceArea: { select: { id: true, name: true } } } },
        },
        skip,
        take: pageSize,
        orderBy,
      }),
      this.prisma.vacancy.count({ where }),
    ]);

    return {
      data: items.map(this.toPublicDto),
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async findPublicById(id: string) {
    const vacancy = await this.prisma.vacancy.findFirst({
      where: { id, status: 'PUBLISHED' },
      include: {
        organisation: { select: { id: true, name: true } },
        location: { include: { state: true } },
        practiceAreas: { include: { practiceArea: true } },
        questions: { where: { formVersion: this.prisma.vacancy.fields.formVersion as never }, orderBy: { displayOrder: 'asc' } },
        requiredDocuments: { orderBy: { createdAt: 'asc' } },
        interviewStages: { orderBy: { stageOrder: 'asc' } },
      },
    });
    if (!vacancy) throw new NotFoundException('Vacancy not found');
    return vacancy;
  }

  async getPublicById(id: string) {
    const vacancy = await this.prisma.vacancy.findUnique({
      where: { id },
      include: {
        organisation: { select: { id: true, name: true } },
        location: { include: { state: true } },
        practiceAreas: { include: { practiceArea: true } },
        questions: { orderBy: { displayOrder: 'asc' } },
        requiredDocuments: { orderBy: { createdAt: 'asc' } },
        interviewStages: { orderBy: { stageOrder: 'asc' } },
      },
    });
    if (!vacancy || !['PUBLISHED', 'PAUSED', 'CLOSED', 'FILLED'].includes(vacancy.status)) {
      throw new NotFoundException('Vacancy not found');
    }
    return vacancy;
  }

  getCounts(id: string) {
    return this.prisma.vacancy.findUnique({
      where: { id },
      select: {
        id: true,
        totalPositions: true,
        reservedPositions: true,
        confirmedPositions: true,
        updatedAt: true,
      },
    }).then((v) => {
      if (!v) throw new NotFoundException('Vacancy not found');
      return {
        vacancyId: v.id,
        totalPositions: v.totalPositions,
        reservedPositions: v.reservedPositions,
        confirmedPositions: v.confirmedPositions,
        availablePositions: v.totalPositions - v.reservedPositions - v.confirmedPositions,
        updatedAt: v.updatedAt.toISOString(),
      };
    });
  }

  // ── Employer CRUD ─────────────────────────────────────────────────────────

  async create(orgId: string, userId: string, dto: CreateVacancyDto) {
    await this.orgsService.assertRole(orgId, userId, EMPLOYER_WRITE_ROLES);

    return this.prisma.$transaction(async (tx) => {
      const vacancy = await tx.vacancy.create({
        data: {
          organisationId: orgId,
          locationId: dto.locationId ?? null,
          title: dto.title,
          description: dto.description,
          totalPositions: dto.totalPositions,
          accommodationStatus: dto.accommodationStatus ?? 'UNKNOWN',
          accommodationDetails: dto.accommodationDetails,
          remunerationInfo: dto.remunerationInfo,
          applicationInstructions: dto.applicationInstructions,
          applicationOpenDate: dto.applicationOpenDate ? new Date(dto.applicationOpenDate) : null,
          applicationDeadline: dto.applicationDeadline ? new Date(dto.applicationDeadline) : null,
          expectedStartDate: dto.expectedStartDate ? new Date(dto.expectedStartDate) : null,
          status: 'DRAFT',
          formVersion: 1,
          createdByUserId: userId,
        },
      });

      if (dto.practiceAreaIds?.length) {
        await tx.vacancyPracticeArea.createMany({
          data: dto.practiceAreaIds.map((id) => ({ vacancyId: vacancy.id, practiceAreaId: id })),
        });
      }

      if (dto.questions?.length) {
        await tx.vacancyQuestion.createMany({
          data: dto.questions.map((q, i) => ({
            vacancyId: vacancy.id,
            questionText: q.questionText,
            questionType: q.questionType,
            options: q.options ?? null,
            isRequired: q.isRequired ?? true,
            displayOrder: q.displayOrder ?? i,
            formVersion: 1,
          })),
        });
      }

      if (dto.requiredDocuments?.length) {
        await tx.vacancyRequiredDocument.createMany({
          data: dto.requiredDocuments.map((d) => ({
            vacancyId: vacancy.id,
            documentLabel: d.documentLabel,
            isRequired: d.isRequired ?? true,
            formVersion: 1,
          })),
        });
      }

      await tx.auditEvent.create({
        data: {
          eventType: 'VACANCY_CREATED',
          actorUserId: userId,
          entityType: 'vacancies',
          entityId: vacancy.id,
          payload: { orgId, title: vacancy.title },
        },
      });

      return vacancy;
    });
  }

  async update(id: string, orgId: string, userId: string, dto: UpdateVacancyDto) {
    await this.orgsService.assertRole(orgId, userId, EMPLOYER_WRITE_ROLES);
    const vacancy = await this.assertOwnVacancy(id, orgId);

    const hasFormChanges =
      dto.questions !== undefined || dto.requiredDocuments !== undefined;
    const newFormVersion = hasFormChanges ? vacancy.formVersion + 1 : vacancy.formVersion;

    // Capacity reduction guard — see TRANSACTION_RULES.md §5
    if (dto.totalPositions !== undefined && dto.totalPositions < vacancy.totalPositions) {
      const minAllowed = vacancy.reservedPositions + vacancy.confirmedPositions;
      if (dto.totalPositions < minAllowed) {
        throw new ConflictException({
          code: 'CAPACITY_CONFLICT',
          message: `Cannot reduce positions: ${minAllowed} positions are already reserved or confirmed`,
          reserved: vacancy.reservedPositions,
          confirmed: vacancy.confirmedPositions,
          minimumAllowed: minAllowed,
        });
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.vacancy.update({
        where: { id },
        data: {
          title: dto.title,
          description: dto.description,
          locationId: dto.locationId,
          totalPositions: dto.totalPositions,
          accommodationStatus: dto.accommodationStatus,
          accommodationDetails: dto.accommodationDetails,
          remunerationInfo: dto.remunerationInfo,
          applicationInstructions: dto.applicationInstructions,
          applicationOpenDate: dto.applicationOpenDate ? new Date(dto.applicationOpenDate) : undefined,
          applicationDeadline: dto.applicationDeadline ? new Date(dto.applicationDeadline) : undefined,
          expectedStartDate: dto.expectedStartDate ? new Date(dto.expectedStartDate) : undefined,
          formVersion: newFormVersion,
        },
      });

      if (dto.practiceAreaIds !== undefined) {
        await tx.vacancyPracticeArea.deleteMany({ where: { vacancyId: id } });
        if (dto.practiceAreaIds.length) {
          await tx.vacancyPracticeArea.createMany({
            data: dto.practiceAreaIds.map((pid) => ({ vacancyId: id, practiceAreaId: pid })),
          });
        }
      }

      if (dto.questions !== undefined) {
        await tx.vacancyQuestion.deleteMany({ where: { vacancyId: id, formVersion: { lt: newFormVersion } } });
        if (dto.questions.length) {
          await tx.vacancyQuestion.createMany({
            data: dto.questions.map((q, i) => ({
              vacancyId: id,
              questionText: q.questionText,
              questionType: q.questionType,
              options: q.options ?? null,
              isRequired: q.isRequired ?? true,
              displayOrder: q.displayOrder ?? i,
              formVersion: newFormVersion,
            })),
          });
        }
      }

      if (dto.requiredDocuments !== undefined) {
        await tx.vacancyRequiredDocument.deleteMany({ where: { vacancyId: id, formVersion: { lt: newFormVersion } } });
        if (dto.requiredDocuments.length) {
          await tx.vacancyRequiredDocument.createMany({
            data: dto.requiredDocuments.map((d) => ({
              vacancyId: id,
              documentLabel: d.documentLabel,
              isRequired: d.isRequired ?? true,
              formVersion: newFormVersion,
            })),
          });
        }
      }

      await tx.auditEvent.create({
        data: {
          eventType: 'VACANCY_UPDATED',
          actorUserId: userId,
          entityType: 'vacancies',
          entityId: id,
          payload: { formVersionBumped: hasFormChanges },
        },
      });

      return updated;
    });
  }

  async publish(id: string, orgId: string, userId: string) {
    await this.orgsService.assertRole(orgId, userId, EMPLOYER_WRITE_ROLES);
    await this.orgsService.assertApproved(orgId);
    const vacancy = await this.assertOwnVacancy(id, orgId);

    if (!['DRAFT', 'PAUSED', 'CLOSED'].includes(vacancy.status)) {
      throw new BadRequestException(`Cannot publish vacancy in status ${vacancy.status}`);
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.vacancy.update({
        where: { id },
        data: { status: 'PUBLISHED', publishedAt: new Date() },
      });

      await tx.auditEvent.create({
        data: { eventType: 'VACANCY_PUBLISHED', actorUserId: userId, entityType: 'vacancies', entityId: id },
      });

      this.gateway.broadcastCounts(updated);
      return updated;
    });
  }

  async pause(id: string, orgId: string, userId: string) {
    await this.orgsService.assertRole(orgId, userId, EMPLOYER_WRITE_ROLES);
    const vacancy = await this.assertOwnVacancy(id, orgId);
    if (vacancy.status !== 'PUBLISHED') throw new BadRequestException('Only PUBLISHED vacancies can be paused');

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.vacancy.update({ where: { id }, data: { status: 'PAUSED' } });
      await tx.auditEvent.create({
        data: { eventType: 'VACANCY_PAUSED', actorUserId: userId, entityType: 'vacancies', entityId: id },
      });
      this.gateway.broadcastCounts(updated);
      return updated;
    });
  }

  async close(id: string, orgId: string, userId: string) {
    await this.orgsService.assertRole(orgId, userId, EMPLOYER_WRITE_ROLES);
    const vacancy = await this.assertOwnVacancy(id, orgId);
    if (!['PUBLISHED', 'PAUSED'].includes(vacancy.status)) {
      throw new BadRequestException(`Cannot close vacancy in status ${vacancy.status}`);
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.vacancy.update({
        where: { id },
        data: { status: 'CLOSED', closedAt: new Date() },
      });
      await tx.auditEvent.create({
        data: { eventType: 'VACANCY_CLOSED', actorUserId: userId, entityType: 'vacancies', entityId: id },
      });
      this.gateway.broadcastCounts(updated);
      return updated;
    });
  }

  async archive(id: string, orgId: string, userId: string) {
    await this.orgsService.assertRole(orgId, userId, EMPLOYER_WRITE_ROLES);
    const vacancy = await this.assertOwnVacancy(id, orgId);
    if (!['CLOSED', 'FILLED', 'DRAFT'].includes(vacancy.status)) {
      throw new BadRequestException(`Cannot archive vacancy in status ${vacancy.status}`);
    }

    await this.prisma.vacancy.update({ where: { id }, data: { status: 'ARCHIVED' } });
    return { message: 'Vacancy archived' };
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private async assertOwnVacancy(id: string, orgId: string) {
    const vacancy = await this.prisma.vacancy.findFirst({
      where: { id, organisationId: orgId },
    });
    if (!vacancy) throw new NotFoundException('Vacancy not found');
    return vacancy;
  }

  private toPublicDto(v: ReturnType<typeof Object.assign>) {
    return {
      ...v,
      availablePositions: v.totalPositions - v.reservedPositions - v.confirmedPositions,
      // Never expose reservedPositions / confirmedPositions breakdown publicly
      reservedPositions: undefined,
      confirmedPositions: undefined,
    };
  }
}
