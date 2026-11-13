import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { QueryReviewsDto } from "./dtos/query-reviews.dto";
import { CreateQualityReviewDto } from "./dtos/create-review.dto";
import { UpdateQualityReviewDto } from "./dtos/update-review.dto";
import { CreateFindingDto } from "./dtos/create-finding.dto";
import { UpdateFindingDto } from "./dtos/update-finding.dto";
import { CreateCorrectiveActionDto } from "./dtos/create-corrective-action.dto";
import { UpdateCorrectiveActionDto } from "./dtos/update-corrective-action.dto";

@Injectable()
export class QualityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async findReviews(tenantId: string, query: QueryReviewsDto) {
    const { status, departmentId, dateFrom, dateTo, page = 1, pageSize = 20 } =
      query;

    const where: Prisma.QualityReviewWhereInput = {
      tenantId,
      ...(status && { status: status as any }),
      ...(departmentId && { departmentId }),
    };

    if (dateFrom ?? dateTo) {
      where.scheduledDate = {};
      if (dateFrom) {
        where.scheduledDate.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.scheduledDate.lte = new Date(dateTo);
      }
    }

    const [total, data] = await Promise.all([
      this.prisma.qualityReview.count({ where }),
      this.prisma.qualityReview.findMany({
        where,
        include: {
          _count: { select: { findings: true } },
        },
        orderBy: { createdAt: "desc" },
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

  async createReview(dto: CreateQualityReviewDto, tenantId: string) {
    const review = await this.prisma.qualityReview.create({
      data: {
        tenantId,
        title: dto.title,
        reviewType: dto.reviewType,
        ...(dto.scheduledDate !== undefined
          ? { scheduledDate: new Date(dto.scheduledDate) }
          : {}),
        ...(dto.departmentId !== undefined
          ? { departmentId: dto.departmentId }
          : {}),
        ...(dto.leadReviewerId !== undefined
          ? { leadReviewerId: dto.leadReviewerId }
          : {}),
        ...(dto.summary !== undefined ? { summary: dto.summary } : {}),
      },
    });

    await this.auditService.log({
      tenantId,
      action: "quality_review.created",
      resourceType: "QualityReview",
      resourceId: review.id,
      outcome: "SUCCESS",
    });

    return review;
  }

  async findReview(id: string, tenantId: string) {
    const review = await this.prisma.qualityReview.findFirst({
      where: { id, tenantId },
      include: {
        findings: {
          include: { correctiveActions: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!review) {
      throw new NotFoundException("Quality review not found");
    }

    return review;
  }

  async updateReview(
    id: string,
    dto: UpdateQualityReviewDto,
    tenantId: string,
    actorId: string,
  ) {
    const existing = await this.prisma.qualityReview.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException("Quality review not found");
    }

    const data: Prisma.QualityReviewUncheckedUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.reviewType !== undefined) data.reviewType = dto.reviewType;
    if (dto.status !== undefined) data.status = dto.status as any;
    if (dto.scheduledDate !== undefined)
      data.scheduledDate = new Date(dto.scheduledDate);
    if (dto.departmentId !== undefined) data.departmentId = dto.departmentId;
    if (dto.leadReviewerId !== undefined)
      data.leadReviewerId = dto.leadReviewerId;
    if (dto.summary !== undefined) data.summary = dto.summary;
    if (dto.status === "COMPLETED") {
      data.completedAt = new Date();
    }

    const updated = await this.prisma.qualityReview.update({
      where: { id },
      data,
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "quality_review.updated",
      resourceType: "QualityReview",
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }

  async createFinding(
    reviewId: string,
    dto: CreateFindingDto,
    tenantId: string,
  ) {
    const review = await this.prisma.qualityReview.findFirst({
      where: { id: reviewId, tenantId },
    });

    if (!review) {
      throw new NotFoundException("Quality review not found");
    }

    const finding = await this.prisma.qualityFinding.create({
      data: {
        tenantId,
        reviewId,
        title: dto.title,
        ...(dto.description !== undefined
          ? { description: dto.description }
          : {}),
        ...(dto.severity !== undefined ? { severity: dto.severity } : {}),
      },
    });

    await this.auditService.log({
      tenantId,
      action: "quality_finding.created",
      resourceType: "QualityFinding",
      resourceId: finding.id,
      outcome: "SUCCESS",
    });

    return finding;
  }

  async updateFinding(
    id: string,
    dto: UpdateFindingDto,
    tenantId: string,
    actorId: string,
  ) {
    const finding = await this.prisma.qualityFinding.findFirst({
      where: { id, tenantId },
    });

    if (!finding) {
      throw new NotFoundException("Quality finding not found");
    }

    const data: Prisma.QualityFindingUncheckedUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.severity !== undefined) data.severity = dto.severity;
    if (dto.status !== undefined) data.status = dto.status as any;
    if (dto.status === "CLOSED") {
      data.closedAt = new Date();
    }

    const updated = await this.prisma.qualityFinding.update({
      where: { id },
      data,
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "quality_finding.updated",
      resourceType: "QualityFinding",
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }

  async createCorrectiveAction(
    findingId: string,
    dto: CreateCorrectiveActionDto,
    tenantId: string,
  ) {
    const finding = await this.prisma.qualityFinding.findFirst({
      where: { id: findingId, tenantId },
    });

    if (!finding) {
      throw new NotFoundException("Quality finding not found");
    }

    const action = await this.prisma.correctiveAction.create({
      data: {
        tenantId,
        findingId,
        title: dto.title,
        ...(dto.description !== undefined
          ? { description: dto.description }
          : {}),
        ...(dto.ownerId !== undefined ? { ownerId: dto.ownerId } : {}),
        ...(dto.dueDate !== undefined
          ? { dueDate: new Date(dto.dueDate) }
          : {}),
        ...(dto.evidenceRef !== undefined
          ? { evidenceRef: dto.evidenceRef }
          : {}),
      },
    });

    await this.auditService.log({
      tenantId,
      action: "corrective_action.created",
      resourceType: "CorrectiveAction",
      resourceId: action.id,
      outcome: "SUCCESS",
    });

    return action;
  }

  async updateCorrectiveAction(
    id: string,
    dto: UpdateCorrectiveActionDto,
    tenantId: string,
    actorId: string,
  ) {
    const action = await this.prisma.correctiveAction.findFirst({
      where: { id, tenantId },
    });

    if (!action) {
      throw new NotFoundException("Corrective action not found");
    }

    const data: Prisma.CorrectiveActionUncheckedUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.ownerId !== undefined) data.ownerId = dto.ownerId;
    if (dto.evidenceRef !== undefined) data.evidenceRef = dto.evidenceRef;
    if (dto.dueDate !== undefined) data.dueDate = new Date(dto.dueDate);
    if (dto.status !== undefined) data.status = dto.status as any;
    if (dto.status === "CLOSED") {
      data.closedAt = new Date();
    }

    // Auto-set OVERDUE if past due date, no explicit status override,
    // and current status is not already terminal
    const resolvedDueDate = dto.dueDate
      ? new Date(dto.dueDate)
      : action.dueDate;
    const resolvedStatus = dto.status ?? (action.status as string);
    const terminalStatuses = ["CLOSED", "PENDING_VERIFICATION"];
    if (
      dto.status === undefined &&
      resolvedDueDate !== null &&
      resolvedDueDate < new Date() &&
      !terminalStatuses.includes(resolvedStatus)
    ) {
      data.status = "OVERDUE" as any;
    }

    const updated = await this.prisma.correctiveAction.update({
      where: { id },
      data,
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "corrective_action.updated",
      resourceType: "CorrectiveAction",
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }
}
