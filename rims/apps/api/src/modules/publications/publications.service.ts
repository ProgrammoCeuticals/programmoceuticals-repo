import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma, ManuscriptStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { QueryManuscriptsDto } from './dtos/query-manuscripts.dto';
import { CreateManuscriptDto } from './dtos/create-manuscript.dto';
import { UpdateManuscriptDto } from './dtos/update-manuscript.dto';
import { AddAuthorDto } from './dtos/add-author.dto';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';

// Valid status transitions for Manuscript
const MANUSCRIPT_STATUS_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ['INTERNAL_REVIEW', 'WITHDRAWN'],
  INTERNAL_REVIEW: ['DRAFT', 'READY_FOR_SUBMISSION', 'WITHDRAWN'],
  READY_FOR_SUBMISSION: ['INTERNAL_REVIEW', 'SUBMITTED', 'WITHDRAWN'],
  SUBMITTED: ['UNDER_REVIEW', 'WITHDRAWN'],
  UNDER_REVIEW: ['REVISION_REQUIRED', 'ACCEPTED', 'REJECTED'],
  REVISION_REQUIRED: ['INTERNAL_REVIEW', 'SUBMITTED', 'WITHDRAWN'],
  ACCEPTED: ['PUBLISHED', 'WITHDRAWN'],
  REJECTED: ['DRAFT', 'WITHDRAWN'],
  PUBLISHED: ['WITHDRAWN'],
  WITHDRAWN: [],
};

@Injectable()
export class PublicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async findAll(tenantId: string, query: QueryManuscriptsDto) {
    const {
      status,
      researchProjectId,
      search,
      page = 1,
      pageSize = 20,
    } = query;

    const where: Prisma.ManuscriptWhereInput = {
      tenantId,
      ...(status && { status: status as ManuscriptStatus }),
      ...(researchProjectId && { researchProjectId }),
    };

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    const [total, data] = await Promise.all([
      this.prisma.manuscript.count({ where }),
      this.prisma.manuscript.findMany({
        where,
        include: {
          _count: { select: { authors: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async create(
    dto: CreateManuscriptDto,
    tenantId: string,
    createdById: string,
  ) {
    const manuscript = await this.prisma.manuscript.create({
      data: {
        title: dto.title,
        tenantId,
        createdById,
        ...(dto.abstract !== undefined ? { abstract: dto.abstract } : {}),
        ...(dto.keywords !== undefined ? { keywords: dto.keywords } : {}),
        ...(dto.researchProjectId !== undefined
          ? { researchProjectId: dto.researchProjectId }
          : {}),
        ...(dto.targetJournal !== undefined
          ? { targetJournal: dto.targetJournal }
          : {}),
        ...(dto.publisher !== undefined ? { publisher: dto.publisher } : {}),
        ...(dto.doi !== undefined ? { doi: dto.doi } : {}),
        ...(dto.url !== undefined ? { url: dto.url } : {}),
      },
    });

    await this.auditService.log({
      tenantId,
      actorId: createdById,
      action: 'manuscript.created',
      resourceType: 'Manuscript',
      resourceId: manuscript.id,
      outcome: 'SUCCESS',
    });

    return manuscript;
  }

  async findOne(id: string, tenantId: string) {
    const manuscript = await this.prisma.manuscript.findFirst({
      where: { id, tenantId },
      include: {
        authors: {
          include: {
            employee: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
        reviews: {
          orderBy: { round: 'asc' },
        },
      },
    });

    if (!manuscript) {
      throw new NotFoundException('Manuscript not found');
    }

    return manuscript;
  }

  async update(
    id: string,
    dto: UpdateManuscriptDto,
    tenantId: string,
    actorId: string,
  ) {
    const existing = await this.prisma.manuscript.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Manuscript not found');
    }

    const data: Prisma.ManuscriptUncheckedUpdateInput = {};

    if (dto.status !== undefined) {
      const currentStatus = existing.status as string;
      const allowedNextStatuses =
        MANUSCRIPT_STATUS_TRANSITIONS[currentStatus] ?? [];
      if (!allowedNextStatuses.includes(dto.status)) {
        throw new BadRequestException(
          `Invalid status transition from ${currentStatus} to ${dto.status}`,
        );
      }

      data.status = dto.status as ManuscriptStatus;

      switch (dto.status) {
        case 'SUBMITTED':
          data.submittedAt = new Date();
          break;
        case 'ACCEPTED':
          data.acceptedAt = new Date();
          break;
        case 'REJECTED':
          data.rejectedAt = new Date();
          break;
        case 'PUBLISHED':
          if (!dto.doi && !dto.url && !existing.doi && !existing.url) {
            throw new BadRequestException(
              'doi or url required for PUBLISHED status',
            );
          }
          data.publishedAt = new Date();
          break;
        case 'WITHDRAWN':
          data.withdrawnAt = new Date();
          break;
      }
    }

    if (dto.title !== undefined) data.title = dto.title;
    if (dto.abstract !== undefined) data.abstract = dto.abstract;
    if (dto.keywords !== undefined) data.keywords = dto.keywords;
    if (dto.researchProjectId !== undefined)
      data.researchProjectId = dto.researchProjectId;
    if (dto.targetJournal !== undefined) data.targetJournal = dto.targetJournal;
    if (dto.publisher !== undefined) data.publisher = dto.publisher;
    if (dto.doi !== undefined) data.doi = dto.doi;
    if (dto.volume !== undefined) data.volume = dto.volume;
    if (dto.issue !== undefined) data.issue = dto.issue;
    if (dto.pages !== undefined) data.pages = dto.pages;
    if (dto.url !== undefined) data.url = dto.url;

    const updated = await this.prisma.manuscript.update({
      where: { id },
      data,
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: 'manuscript.updated',
      resourceType: 'Manuscript',
      resourceId: id,
      outcome: 'SUCCESS',
    });

    return updated;
  }

  async addAuthor(
    manuscriptId: string,
    dto: AddAuthorDto,
    tenantId: string,
  ) {
    const manuscript = await this.prisma.manuscript.findFirst({
      where: { id: manuscriptId, tenantId },
    });

    if (!manuscript) {
      throw new NotFoundException('Manuscript not found');
    }

    return this.prisma.manuscriptAuthor.create({
      data: {
        manuscriptId,
        employeeId: dto.employeeId,
        ...(dto.contributionRole !== undefined
          ? { contributionRole: dto.contributionRole }
          : {}),
        ...(dto.authorOrder !== undefined
          ? { authorOrder: dto.authorOrder }
          : {}),
        ...(dto.isCorresponding !== undefined
          ? { isCorresponding: dto.isCorresponding }
          : {}),
      },
    });
  }

  async removeAuthor(
    manuscriptId: string,
    employeeId: string,
    tenantId: string,
  ) {
    const manuscript = await this.prisma.manuscript.findFirst({
      where: { id: manuscriptId, tenantId },
    });

    if (!manuscript) {
      throw new NotFoundException('Manuscript not found');
    }

    return this.prisma.manuscriptAuthor.delete({
      where: {
        manuscriptId_employeeId: {
          manuscriptId,
          employeeId,
        },
      },
    });
  }

  async addReview(
    manuscriptId: string,
    dto: CreateReviewDto,
    tenantId: string,
  ) {
    const manuscript = await this.prisma.manuscript.findFirst({
      where: { id: manuscriptId, tenantId },
    });

    if (!manuscript) {
      throw new NotFoundException('Manuscript not found');
    }

    return this.prisma.manuscriptReview.create({
      data: {
        manuscriptId,
        ...(dto.round !== undefined ? { round: dto.round } : {}),
        ...(dto.deadline !== undefined
          ? { deadline: new Date(dto.deadline) }
          : {}),
        ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
      },
    });
  }

  async updateReview(
    manuscriptId: string,
    reviewId: string,
    dto: UpdateReviewDto,
    tenantId: string,
  ) {
    const manuscript = await this.prisma.manuscript.findFirst({
      where: { id: manuscriptId, tenantId },
    });

    if (!manuscript) {
      throw new NotFoundException('Manuscript not found');
    }

    const data: Prisma.ManuscriptReviewUncheckedUpdateInput = {};
    if (dto.outcome !== undefined) data.outcome = dto.outcome;
    if (dto.notes !== undefined) data.notes = dto.notes;
    if (dto.submittedAt !== undefined)
      data.submittedAt = new Date(dto.submittedAt);
    if (dto.deadline !== undefined) data.deadline = new Date(dto.deadline);

    return this.prisma.manuscriptReview.update({
      where: { id: reviewId },
      data,
    });
  }
}
