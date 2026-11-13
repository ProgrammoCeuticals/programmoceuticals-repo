import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import {
  Prisma,
  KpiResultStatus,
  PerformanceCycleStatus,
  KpiMeasurementType,
} from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { NotificationDispatcher } from "../notifications/notification-dispatcher";
import { SubmitKpiResultDto } from "./dtos/submit-kpi-result.dto";
import { ReviewKpiResultDto } from "./dtos/review-kpi-result.dto";
import {
  ScoreResult,
  KpiBreakdownItem,
} from "./interfaces/score-result.interface";

@Injectable()
export class KpiResultsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly dispatcher: NotificationDispatcher,
  ) {}

  async findOne(assignmentId: string, tenantId: string) {
    const result = await this.prisma.kpiResult.findFirst({
      where: { assignmentId, tenantId },
    });

    if (!result) {
      // Return a virtual DRAFT object without creating a DB record
      return {
        assignmentId,
        status: "DRAFT",
        value: null,
        notes: null,
        evidenceRef: null,
        submittedById: null,
        submittedAt: null,
        reviewedById: null,
        reviewedAt: null,
        reviewNotes: null,
        approvedById: null,
        approvedAt: null,
      };
    }

    return result;
  }

  async submit(
    assignmentId: string,
    dto: SubmitKpiResultDto,
    tenantId: string,
    submittedById: string,
  ) {
    // Verify assignment belongs to tenant
    const assignment = await this.prisma.kpiAssignment.findFirst({
      where: { id: assignmentId, tenantId },
      include: { cycle: true },
    });

    if (!assignment) {
      throw new NotFoundException("KPI assignment not found");
    }

    if (assignment.cycle.status !== PerformanceCycleStatus.ACTIVE) {
      throw new BadRequestException(
        "Results can only be submitted for ACTIVE performance cycles",
      );
    }

    // Check for existing result
    const existing = await this.prisma.kpiResult.findUnique({
      where: { assignmentId },
    });

    if (
      existing &&
      existing.status !== KpiResultStatus.DRAFT &&
      existing.status !== KpiResultStatus.RETURNED
    ) {
      throw new BadRequestException(
        `Cannot submit a result with status ${existing.status}`,
      );
    }

    const data:
      | Prisma.KpiResultUncheckedCreateInput
      | Prisma.KpiResultUncheckedUpdateInput = {
      tenantId,
      assignmentId,
      status: KpiResultStatus.SUBMITTED,
      value: dto.value,
      submittedById,
      submittedAt: new Date(),
      ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
      ...(dto.evidenceRef !== undefined
        ? { evidenceRef: dto.evidenceRef }
        : {}),
    };

    let result;
    if (existing) {
      result = await this.prisma.kpiResult.update({
        where: { assignmentId },
        data: {
          status: KpiResultStatus.SUBMITTED,
          value: dto.value,
          submittedById,
          submittedAt: new Date(),
          ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
          ...(dto.evidenceRef !== undefined
            ? { evidenceRef: dto.evidenceRef }
            : {}),
        },
      });
    } else {
      result = await this.prisma.kpiResult.create({
        data: {
          tenantId,
          assignmentId,
          status: KpiResultStatus.SUBMITTED,
          value: dto.value,
          submittedById,
          submittedAt: new Date(),
          ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
          ...(dto.evidenceRef !== undefined
            ? { evidenceRef: dto.evidenceRef }
            : {}),
        },
      });
    }

    await this.auditService.log({
      tenantId,
      actorId: submittedById,
      action: "performance.result.submitted",
      resourceType: "KpiResult",
      resourceId: result.id,
      outcome: "SUCCESS",
    });

    // Notify cycle owner / users with performance.results.review permission
    await this.dispatcher.dispatchToPermission(
      "performance.result.submitted",
      "performance.results.review",
      {
        tenantId,
        title: "KPI result submitted for review",
        body: `A KPI result has been submitted and is awaiting review.`,
        resourceType: "KpiResult",
        resourceId: result.id,
        actionUrl: `/performance/cycles/${assignment.cycleId}`,
      },
    );

    return result;
  }

  async review(
    resultId: string,
    dto: ReviewKpiResultDto,
    tenantId: string,
    reviewedById: string,
  ) {
    const result = await this.prisma.kpiResult.findFirst({
      where: { id: resultId, tenantId },
    });

    if (!result) {
      throw new NotFoundException("KPI result not found");
    }

    if (result.status !== KpiResultStatus.SUBMITTED) {
      throw new BadRequestException(
        `Cannot review a result with status ${result.status}`,
      );
    }

    const newStatus = dto.approved
      ? KpiResultStatus.APPROVED
      : KpiResultStatus.RETURNED;

    const data: Prisma.KpiResultUncheckedUpdateInput = {
      status: newStatus,
      reviewedById,
      reviewedAt: new Date(),
      ...(dto.reviewNotes !== undefined
        ? { reviewNotes: dto.reviewNotes }
        : {}),
    };

    const updated = await this.prisma.kpiResult.update({
      where: { id: resultId },
      data,
    });

    await this.auditService.log({
      tenantId,
      actorId: reviewedById,
      action: dto.approved
        ? "performance.result.approved"
        : "performance.result.returned",
      resourceType: "KpiResult",
      resourceId: resultId,
      outcome: "SUCCESS",
    });

    return updated;
  }

  async approve(
    resultId: string,
    dto: { approvalNotes?: string },
    tenantId: string,
    approvedById: string,
  ) {
    const result = await this.prisma.kpiResult.findFirst({
      where: { id: resultId, tenantId },
    });

    if (!result) {
      throw new NotFoundException("KPI result not found");
    }

    if (result.status !== KpiResultStatus.SUBMITTED) {
      throw new BadRequestException(
        `Cannot approve a result with status ${result.status}`,
      );
    }

    const updated = await this.prisma.kpiResult.update({
      where: { id: resultId },
      data: {
        status: KpiResultStatus.APPROVED,
        approvedById,
        approvedAt: new Date(),
        ...(dto.approvalNotes !== undefined
          ? { reviewNotes: dto.approvalNotes }
          : {}),
      },
    });

    await this.auditService.log({
      tenantId,
      actorId: approvedById,
      action: "performance.result.approved",
      resourceType: "KpiResult",
      resourceId: resultId,
      outcome: "SUCCESS",
    });

    return updated;
  }

  async returnResult(
    resultId: string,
    reviewNotes: string,
    tenantId: string,
    reviewedById: string,
  ) {
    const result = await this.prisma.kpiResult.findFirst({
      where: { id: resultId, tenantId },
    });

    if (!result) {
      throw new NotFoundException("KPI result not found");
    }

    const updated = await this.prisma.kpiResult.update({
      where: { id: resultId },
      data: {
        status: KpiResultStatus.RETURNED,
        reviewedById,
        reviewedAt: new Date(),
        reviewNotes,
      },
    });

    await this.auditService.log({
      tenantId,
      actorId: reviewedById,
      action: "performance.result.returned",
      resourceType: "KpiResult",
      resourceId: resultId,
      outcome: "SUCCESS",
    });

    return updated;
  }

  async calculateScore(
    cycleId: string,
    subjectType: string,
    subjectId: string,
    tenantId: string,
  ): Promise<ScoreResult> {
    const assignments = await this.prisma.kpiAssignment.findMany({
      where: { cycleId, subjectType, subjectId, tenantId },
      include: {
        kpi: true,
        results: true,
      },
    });

    let totalWeight = 0;
    let assessedWeight = 0;
    let score = 0;
    const breakdown: KpiBreakdownItem[] = [];

    for (const assignment of assignments) {
      const weight = Number(assignment.weight);
      totalWeight += weight;

      const approvedResult = assignment.results.find(
        (r) => r.status === KpiResultStatus.APPROVED,
      );

      if (!approvedResult || approvedResult.value === null) {
        // Not assessed — exclude from assessedWeight
        breakdown.push({
          kpiName: assignment.kpi.name,
          weight,
          targetValue: assignment.targetValue ?? null,
          actualValue: null,
          contribution: 0,
          status: "NOT_ASSESSED",
        });
        continue;
      }

      assessedWeight += weight;
      const value = approvedResult.value;
      const target = assignment.targetValue ?? assignment.kpi.targetValue;
      const measurementType = assignment.kpi.measurementType;

      let contribution = 0;

      if (
        measurementType === KpiMeasurementType.NUMERIC ||
        measurementType === KpiMeasurementType.PERCENTAGE
      ) {
        if (target !== null && target !== undefined && target !== "") {
          contribution =
            Math.min(parseFloat(value) / parseFloat(target), 1) * weight;
        } else {
          contribution = weight; // Full credit when no target
        }
      } else if (measurementType === KpiMeasurementType.BOOLEAN) {
        contribution = value === "true" ? weight : 0;
      } else if (measurementType === KpiMeasurementType.MILESTONE) {
        contribution = value === "COMPLETED" ? weight : 0;
      } else if (measurementType === KpiMeasurementType.RATING_SCALE) {
        contribution = (parseFloat(value) / 10) * weight;
      } else {
        contribution = 0;
      }

      score += contribution;

      breakdown.push({
        kpiName: assignment.kpi.name,
        weight,
        targetValue: target ?? null,
        actualValue: value,
        contribution,
        status: approvedResult.status,
      });
    }

    const percentage = assessedWeight > 0 ? (score / assessedWeight) * 100 : 0;

    return {
      totalWeight,
      assessedWeight,
      score,
      percentage,
      breakdown,
    };
  }
}
