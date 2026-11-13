import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CreateSubmissionDto, UpdateSubmissionDto } from "./dto/submission.dto";
import {
  paginate,
  type PaginatedResult,
} from "../../common/dto/pagination.dto";
import { v4 as uuidv4 } from "uuid";
import type { Submission } from "@prisma/client";

/**
 * SubmissionsService — spec §7.8.
 *
 * A Submission belongs to a RegulatoryApplication.
 * The Submission <-> SubmissionUnit relationship is many-to-many to support
 * regional/grouped submission semantics — spec §11.
 *
 * Tenant isolation: operations verify applicationId belongs to the org.
 */
@Injectable()
export class SubmissionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async create(
    applicationId: string,
    organizationId: string,
    dto: CreateSubmissionDto,
    actorId?: string | undefined,
  ): Promise<Submission> {
    // Verify application belongs to org
    const app = await this.prisma.regulatoryApplication.findFirst({
      where: { id: applicationId, organizationId },
      select: { id: true, status: true },
    });
    if (!app) {
      throw new NotFoundException(
        `Application ${applicationId} not found in this organization.`,
      );
    }

    const submission = await this.prisma.submission.create({
      data: {
        uuid: uuidv4(),
        applicationId,
        submissionType: dto.submissionType ?? null,
        description: dto.description ?? null,
        status: "DRAFT",
      },
    });

    await this.audit.record({
      organizationId,
      userId: actorId,
      eventType: "CREATE_SUBMISSION",
      entityType: "Submission",
      entityId: submission.id,
      newValue: {
        uuid: submission.uuid,
        submissionType: submission.submissionType,
        applicationId,
      },
    });

    return submission;
  }

  async findByApplication(
    applicationId: string,
    organizationId: string,
    page = 1,
    pageSize = 50,
  ): Promise<PaginatedResult<Submission>> {
    // Assert app belongs to org
    const app = await this.prisma.regulatoryApplication.findFirst({
      where: { id: applicationId, organizationId },
      select: { id: true },
    });
    if (!app) {
      throw new NotFoundException(
        `Application ${applicationId} not found in this organization.`,
      );
    }

    const where = { applicationId };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.submission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.submission.count({ where }),
    ]);
    return paginate(data, total, page, pageSize);
  }

  async findOne(id: string, organizationId: string): Promise<Submission> {
    // Join through application to enforce tenant scope
    const sub = await this.prisma.submission.findFirst({
      where: {
        id,
        application: { organizationId },
      },
      include: { application: { select: { organizationId: true } } },
    });
    if (!sub) throw new NotFoundException(`Submission ${id} not found.`);
    return sub;
  }

  async update(
    id: string,
    organizationId: string,
    dto: UpdateSubmissionDto,
    actorId?: string | undefined,
  ): Promise<Submission> {
    const existing = await this.findOne(id, organizationId);

    if (existing.status === "PUBLISHED") {
      throw new BadRequestException(
        "Published submissions cannot be modified.",
      );
    }

    return this.prisma.submission.update({
      where: { id },
      data: {
        ...(dto.submissionType !== undefined && {
          submissionType: dto.submissionType,
        }),
        ...(dto.description !== undefined && { description: dto.description }),
      },
    });
  }

  async getSubmissionUnits(
    id: string,
    organizationId: string,
    page = 1,
    pageSize = 50,
  ) {
    await this.findOne(id, organizationId);

    const where = { submissionId: id };
    const [links, total] = await this.prisma.$transaction([
      this.prisma.submissionSubmissionUnit.findMany({
        where,
        include: {
          submissionUnit: {
            include: {
              ectdStandard: { select: { name: true, version: true } },
              regionalSpecification: { select: { name: true, version: true } },
            },
          },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.submissionSubmissionUnit.count({ where }),
    ]);

    return paginate(
      links.map((l) => l.submissionUnit),
      total,
      page,
      pageSize,
    );
  }
}
