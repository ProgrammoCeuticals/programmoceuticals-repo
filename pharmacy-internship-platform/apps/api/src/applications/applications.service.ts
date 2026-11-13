import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { VacancyGateway } from '../vacancies/vacancy.gateway';
import { OrganisationsService } from '../organisations/organisations.service';
import { SubmitApplicationDto, UpdateApplicationStatusDto } from './dto/application.dto';
import { NotificationChannel, OrgMemberRole } from '@pharmintern/shared-types';

// States that are considered "active" — closed by competing offer acceptance
const ACTIVE_APPLICATION_STATUSES = [
  'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEWING', 'WAITLISTED',
];

// Allowed employer-initiated transitions
const EMPLOYER_TRANSITIONS: Record<string, string[]> = {
  SUBMITTED:    ['UNDER_REVIEW', 'REJECTED', 'CLOSED_VACANCY'],
  UNDER_REVIEW: ['SHORTLISTED', 'WAITLISTED', 'REJECTED'],
  SHORTLISTED:  ['INTERVIEWING', 'WAITLISTED', 'REJECTED', 'OFFERED'],
  INTERVIEWING: ['SHORTLISTED', 'WAITLISTED', 'REJECTED', 'OFFERED'],
  WAITLISTED:   ['SHORTLISTED', 'REJECTED'],
};

const EMPLOYER_READ_ROLES = [
  OrgMemberRole.ORGANISATION_OWNER,
  OrgMemberRole.RECRUITER_HR,
  OrgMemberRole.INTERNSHIP_COORDINATOR,
];
const EMPLOYER_WRITE_ROLES = [OrgMemberRole.ORGANISATION_OWNER, OrgMemberRole.RECRUITER_HR];

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly gateway: VacancyGateway,
    private readonly orgsService: OrganisationsService,
  ) {}

  // ── Applicant: submit ─────────────────────────────────────────────────────

  async submit(applicantUserId: string, dto: SubmitApplicationDto) {
    // Idempotency check
    if (dto.idempotencyKey) {
      const existing = await this.prisma.application.findUnique({
        where: { idempotencyKey: dto.idempotencyKey },
      });
      if (existing) return existing;
    }

    return this.prisma.$transaction(async (tx) => {
      // Lock the vacancy row
      const vacancy = await tx.vacancy.findUnique({ where: { id: dto.vacancyId } });
      if (!vacancy) throw new NotFoundException('Vacancy not found');

      if (vacancy.status !== 'PUBLISHED') {
        throw new BadRequestException('This vacancy is not currently accepting applications');
      }

      if (vacancy.applicationDeadline && vacancy.applicationDeadline < new Date()) {
        throw new BadRequestException('The application deadline for this vacancy has passed');
      }

      // One active application per applicant per vacancy
      const existingApp = await tx.application.findFirst({
        where: {
          vacancyId: dto.vacancyId,
          applicantUserId,
          status: { notIn: ['WITHDRAWN', 'REJECTED', 'EXPIRED', 'CLOSED_VACANCY', 'CLOSED_OTHER_OFFER_ACCEPTED'] },
        },
      });
      if (existingApp) {
        throw new ConflictException('You already have an active application for this vacancy');
      }

      const isDraft = dto.isDraft ?? false;
      const status = isDraft ? 'DRAFT' : 'SUBMITTED';

      const application = await tx.application.create({
        data: {
          vacancyId: dto.vacancyId,
          applicantUserId,
          status,
          submittedAt: isDraft ? null : new Date(),
          formVersionSnapshot: isDraft ? null : vacancy.formVersion,
          idempotencyKey: dto.idempotencyKey ?? uuidv4(),
        },
      });

      // Save answers
      if (dto.answers?.length) {
        await tx.applicationAnswer.createMany({
          data: dto.answers.map((a) => ({
            applicationId: application.id,
            questionId: a.questionId,
            answerText: a.answerText ?? null,
            answerBoolean: a.answerBoolean ?? null,
          })),
        });
      }

      // Validate required questions are answered (only on submit, not draft)
      if (!isDraft) {
        await this.validateRequiredFields(tx, dto.vacancyId, vacancy.formVersion, application.id, dto.answers ?? []);

        // Capture immutable submission snapshot — TRANSACTION_RULES.md §6
        const answers = await tx.applicationAnswer.findMany({ where: { applicationId: application.id } });
        const documents = await tx.applicationDocument.findMany({ where: { applicationId: application.id } });
        const questions = await tx.vacancyQuestion.findMany({
          where: { vacancyId: dto.vacancyId, formVersion: vacancy.formVersion },
        });
        const requiredDocs = await tx.vacancyRequiredDocument.findMany({
          where: { vacancyId: dto.vacancyId, formVersion: vacancy.formVersion },
        });

        await tx.applicationSnapshot.create({
          data: {
            applicationId: application.id,
            answersJson: answers,
            documentsJson: documents,
            questionsSnapshot: { questions, requiredDocuments: requiredDocs },
          },
        });

        // Notify employer members
        const membership = await tx.organisationMembership.findFirst({
          where: { organisationId: vacancy.organisationId, isOwner: true },
        });
        if (membership) {
          await this.notifications.enqueue(tx, {
            recipientUserId: membership.userId,
            channel: NotificationChannel.IN_APP,
            eventType: 'APPLICATION_RECEIVED',
            payload: { applicationId: application.id, vacancyTitle: vacancy.title },
          });
        }
      }

      await tx.auditEvent.create({
        data: {
          eventType: isDraft ? 'APPLICATION_DRAFT_SAVED' : 'APPLICATION_SUBMITTED',
          actorUserId: applicantUserId,
          entityType: 'applications',
          entityId: application.id,
          payload: { vacancyId: dto.vacancyId },
        },
      });

      return application;
    });
  }

  async withdraw(applicationId: string, applicantUserId: string) {
    const app = await this.prisma.application.findUnique({ where: { id: applicationId } });
    if (!app || app.applicantUserId !== applicantUserId) {
      throw new NotFoundException('Application not found');
    }

    const withdrawableStatuses = ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEWING', 'OFFERED', 'WAITLISTED'];
    if (!withdrawableStatuses.includes(app.status)) {
      throw new BadRequestException(`Cannot withdraw application in status ${app.status}`);
    }

    return this.prisma.$transaction(async (tx) => {
      // If there's an issued offer, release the reservation
      const issuedOffer = await tx.offer.findFirst({
        where: { applicationId, status: 'ISSUED' },
      });

      if (issuedOffer) {
        await tx.offer.update({ where: { id: issuedOffer.id }, data: { status: 'CANCELLED' } });
        await tx.vacancy.update({
          where: { id: issuedOffer.vacancyId },
          data: { reservedPositions: { decrement: 1 } },
        });
      }

      const updated = await tx.application.update({
        where: { id: applicationId },
        data: { status: 'WITHDRAWN' },
      });

      await tx.auditEvent.create({
        data: {
          eventType: 'APPLICATION_WITHDRAWN',
          actorUserId: applicantUserId,
          entityType: 'applications',
          entityId: applicationId,
        },
      });

      return updated;
    });
  }

  // ── Applicant: list own ───────────────────────────────────────────────────

  async listMine(applicantUserId: string, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.prisma.application.findMany({
        where: { applicantUserId },
        include: {
          vacancy: { select: { id: true, title: true, status: true, organisationId: true,
            organisation: { select: { id: true, name: true } } } },
        },
        skip,
        take: pageSize,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.application.count({ where: { applicantUserId } }),
    ]);
    return { data: items, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async getForApplicant(applicationId: string, applicantUserId: string) {
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        vacancy: { select: { id: true, title: true, organisationId: true } },
        answers: true,
        documents: { select: { id: true, originalFilename: true, mimeType: true, uploadedAt: true } },
      },
    });
    if (!app || app.applicantUserId !== applicantUserId) {
      throw new NotFoundException('Application not found');
    }
    // NEVER include employer internal notes in applicant response
    return app;
  }

  // ── Employer: manage pipeline ─────────────────────────────────────────────

  async listForVacancy(
    vacancyId: string,
    orgId: string,
    userId: string,
    query: { status?: string; page?: number; pageSize?: number },
  ) {
    await this.orgsService.assertRole(orgId, userId, EMPLOYER_READ_ROLES);
    await this.assertOrgOwnsVacancy(vacancyId, orgId);

    const page = query.page ?? 1;
    const pageSize = Math.min(query.pageSize ?? 20, 100);
    const where: Record<string, unknown> = { vacancyId };
    if (query.status) where['status'] = query.status;

    const [items, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        include: {
          answers: true,
          documents: { select: { id: true, originalFilename: true, mimeType: true, uploadedAt: true } },
          credentialChecks: { select: { id: true, documentType: true, outcome: true, notes: true } },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { submittedAt: 'desc' },
      }),
      this.prisma.application.count({ where }),
    ]);

    return { data: items, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async getForEmployer(applicationId: string, orgId: string, userId: string) {
    await this.orgsService.assertRole(orgId, userId, EMPLOYER_READ_ROLES);

    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        vacancy: { select: { id: true, title: true, organisationId: true } },
        answers: true,
        documents: true,
        credentialChecks: true,
        interviewEvents: { include: { stage: true }, orderBy: { scheduledAt: 'desc' } },
        snapshot: true,
      },
    });
    if (!app) throw new NotFoundException('Application not found');
    if (app.vacancy.organisationId !== orgId) throw new ForbiddenException();

    return app;
  }

  async updateStatus(
    applicationId: string,
    orgId: string,
    userId: string,
    dto: UpdateApplicationStatusDto,
  ) {
    await this.orgsService.assertRole(orgId, userId, EMPLOYER_WRITE_ROLES);

    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { vacancy: true },
    });
    if (!app) throw new NotFoundException('Application not found');
    if (app.vacancy.organisationId !== orgId) throw new ForbiddenException();

    const allowed = EMPLOYER_TRANSITIONS[app.status] ?? [];
    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(
        `Cannot transition application from ${app.status} to ${dto.status}`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.application.update({
        where: { id: applicationId },
        data: { status: dto.status as never },
      });

      await tx.auditEvent.create({
        data: {
          eventType: 'APPLICATION_STATUS_UPDATED',
          actorUserId: userId,
          entityType: 'applications',
          entityId: applicationId,
          payload: { from: app.status, to: dto.status, note: dto.note },
        },
      });

      // Notify applicant
      await this.notifications.enqueue(tx, {
        recipientUserId: app.applicantUserId,
        channel: NotificationChannel.IN_APP,
        eventType: 'APPLICATION_STATUS_CHANGED',
        payload: { applicationId, status: dto.status, vacancyTitle: app.vacancy.title },
      });

      this.gateway.broadcastApplicationStatus(applicationId, dto.status);
      return updated;
    });
  }

  async addNote(applicationId: string, orgId: string, userId: string, note: string) {
    await this.orgsService.assertRole(orgId, userId, EMPLOYER_WRITE_ROLES);

    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { vacancy: { select: { organisationId: true } } },
    });
    if (!app || app.vacancy.organisationId !== orgId) throw new NotFoundException('Application not found');

    // Internal notes stored as audit events with a specific type
    // They are NEVER returned to applicant endpoints
    return this.prisma.auditEvent.create({
      data: {
        eventType: 'APPLICATION_NOTE_ADDED',
        actorUserId: userId,
        entityType: 'applications',
        entityId: applicationId,
        payload: { note },
      },
    });
  }

  async getNotes(applicationId: string, orgId: string, userId: string) {
    await this.orgsService.assertRole(orgId, userId, EMPLOYER_READ_ROLES);

    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { vacancy: { select: { organisationId: true } } },
    });
    if (!app || app.vacancy.organisationId !== orgId) throw new NotFoundException();

    return this.prisma.auditEvent.findMany({
      where: { entityType: 'applications', entityId: applicationId, eventType: 'APPLICATION_NOTE_ADDED' },
      select: { id: true, payload: true, actorUserId: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private async validateRequiredFields(
    tx: Parameters<PrismaService['$transaction']>[0] extends (fn: infer F) => unknown ? (F extends (tx: infer T) => unknown ? T : never) : never,
    vacancyId: string,
    formVersion: number,
    applicationId: string,
    answers: Array<{ questionId: string; answerText?: string; answerBoolean?: boolean }>,
  ) {
    const requiredQuestions = await (tx as PrismaService).vacancyQuestion.findMany({
      where: { vacancyId, formVersion, isRequired: true },
    });

    const answeredIds = new Set(answers.map((a) => a.questionId));
    const missing = requiredQuestions.filter((q) => !answeredIds.has(q.id));

    if (missing.length > 0) {
      throw new BadRequestException(
        `Missing required answers for: ${missing.map((q) => q.questionText).join(', ')}`,
      );
    }

    const requiredDocs = await (tx as PrismaService).vacancyRequiredDocument.findMany({
      where: { vacancyId, formVersion, isRequired: true },
    });
    const uploadedDocRequirementIds = await (tx as PrismaService).applicationDocument.findMany({
      where: { applicationId, requirementId: { not: null } },
      select: { requirementId: true },
    });
    const uploadedIds = new Set(uploadedDocRequirementIds.map((d) => d.requirementId));
    const missingDocs = requiredDocs.filter((d) => !uploadedIds.has(d.id));

    if (missingDocs.length > 0) {
      throw new BadRequestException(
        `Missing required documents: ${missingDocs.map((d) => d.documentLabel).join(', ')}`,
      );
    }
  }

  private async assertOrgOwnsVacancy(vacancyId: string, orgId: string) {
    const vacancy = await this.prisma.vacancy.findFirst({
      where: { id: vacancyId, organisationId: orgId },
    });
    if (!vacancy) throw new NotFoundException('Vacancy not found for this organisation');
    return vacancy;
  }

  // Exported helper for use in OffersService
  async getActiveApplicationStatuses() {
    return ACTIVE_APPLICATION_STATUSES;
  }
}
