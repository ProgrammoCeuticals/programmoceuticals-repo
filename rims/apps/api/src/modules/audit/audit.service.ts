import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { PaginatedResult } from "@rims/shared-types";
import { Prisma, AuditOutcome } from "@prisma/client";

export interface CreateAuditEventDto {
  tenantId: string;
  actorId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  outcome?: AuditOutcome;
  beforeState?: unknown;
  afterState?: unknown;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
}

export interface AuditEventFilters {
  resourceType?: string;
  actorId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export type AuditEventRow = {
  id: string;
  tenantId: string;
  actorId: string | null;
  action: string;
  resourceType: string;
  resourceId: string | null;
  outcome: AuditOutcome;
  beforeState: Prisma.JsonValue;
  afterState: Prisma.JsonValue;
  ipAddress: string | null;
  userAgent: string | null;
  requestId: string | null;
  createdAt: Date;
};

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Append an audit event. Never throws — errors are only logged to stderr.
   * Audit logging must not break the business operation that triggered it.
   */
  async log(event: CreateAuditEventDto): Promise<void> {
    try {
      await this.prisma.auditEvent.create({
        data: {
          tenantId: event.tenantId,
          actorId: event.actorId ?? null,
          action: event.action,
          resourceType: event.resourceType,
          resourceId: event.resourceId ?? null,
          outcome: event.outcome ?? AuditOutcome.SUCCESS,
          beforeState: event.beforeState
            ? (event.beforeState as Prisma.InputJsonValue)
            : Prisma.JsonNull,
          afterState: event.afterState
            ? (event.afterState as Prisma.InputJsonValue)
            : Prisma.JsonNull,
          ipAddress: event.ipAddress ?? null,
          userAgent: event.userAgent ?? null,
          requestId: event.requestId ?? null,
        },
      });
    } catch (err) {
      // Audit failures must not propagate to callers
      this.logger.error(
        `AuditService.log failed: ${(err as Error).message}`,
        (err as Error).stack,
      );
    }
  }

  /**
   * Paginated list of audit events for a tenant.
   * Supports filtering by resourceType, actorId, and date range.
   */
  async list(
    tenantId: string,
    page: number,
    pageSize: number,
    filters: AuditEventFilters,
    requestId: string,
  ): Promise<PaginatedResult<AuditEventRow>> {
    const where: Prisma.AuditEventWhereInput = { tenantId };

    if (filters.resourceType) {
      where.resourceType = filters.resourceType;
    }
    if (filters.actorId) {
      where.actorId = filters.actorId;
    }
    if (filters.dateFrom ?? filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) {
        where.createdAt.gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        where.createdAt.lte = new Date(filters.dateTo);
      }
    }

    const [total, data] = await Promise.all([
      this.prisma.auditEvent.count({ where }),
      this.prisma.auditEvent.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      data: data as AuditEventRow[],
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        requestId,
      },
    };
  }
}
