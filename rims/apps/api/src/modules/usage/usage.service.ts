import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsageService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Record usage metrics for a tenant for today's date.
   * Returns the number of records inserted.
   */
  async recordMetrics(tenantId: string): Promise<number> {
    const today = new Date();
    // Strip time to get a date-only value for periodStart / periodEnd
    const periodDate = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
    );

    const [activeUsers, totalEmployees, totalProjects, totalDocuments] =
      await Promise.all([
        this.prisma.user.count({ where: { tenantId, status: "ACTIVE" } }),
        this.prisma.employee.count({
          where: { tenantId, status: { notIn: ["ARCHIVED"] } },
        }),
        this.prisma.researchProject.count({
          where: {
            tenantId,
            status: { notIn: ["CANCELLED", "ARCHIVED"] },
          },
        }),
        this.prisma.document.count({
          where: { tenantId, status: { not: "ARCHIVED" } },
        }),
      ]);

    await this.prisma.usageRecord.createMany({
      data: [
        {
          tenantId,
          metricType: "ACTIVE_USERS",
          value: BigInt(activeUsers),
          periodStart: periodDate,
          periodEnd: periodDate,
        },
        {
          tenantId,
          metricType: "TOTAL_EMPLOYEES",
          value: BigInt(totalEmployees),
          periodStart: periodDate,
          periodEnd: periodDate,
        },
        {
          tenantId,
          metricType: "TOTAL_PROJECTS",
          value: BigInt(totalProjects),
          periodStart: periodDate,
          periodEnd: periodDate,
        },
        {
          tenantId,
          metricType: "TOTAL_DOCUMENTS",
          value: BigInt(totalDocuments),
          periodStart: periodDate,
          periodEnd: periodDate,
        },
      ],
    });

    return 4;
  }

  /**
   * Query usage records with optional filters.
   * BigInt value is cast to Number for JSON serialisation.
   */
  async getUsage(
    tenantId: string,
    metricType?: string,
    periodStart?: string,
    periodEnd?: string,
  ) {
    const records = await this.prisma.usageRecord.findMany({
      where: {
        tenantId,
        ...(metricType ? { metricType: metricType as any } : {}),
        ...(periodStart ? { periodStart: { gte: new Date(periodStart) } } : {}),
        ...(periodEnd ? { periodEnd: { lte: new Date(periodEnd) } } : {}),
      },
      orderBy: { recordedAt: "desc" },
    });

    return records.map((r) => ({ ...r, value: Number(r.value) }));
  }

  /**
   * Returns the most recent metric values for each type as a summary.
   */
  async getCurrentUsageSummary(tenantId: string): Promise<{
    activeUsers: number;
    totalEmployees: number;
    totalProjects: number;
    totalDocuments: number;
    asOf: Date | null;
  }> {
    const metricTypes = [
      "ACTIVE_USERS",
      "TOTAL_EMPLOYEES",
      "TOTAL_PROJECTS",
      "TOTAL_DOCUMENTS",
    ] as const;

    const latestRecords = await Promise.all(
      metricTypes.map((mt) =>
        this.prisma.usageRecord.findFirst({
          where: { tenantId, metricType: mt },
          orderBy: { recordedAt: "desc" },
        }),
      ),
    );

    const [
      activeUsersRec,
      totalEmployeesRec,
      totalProjectsRec,
      totalDocumentsRec,
    ] = latestRecords;

    const asOf =
      activeUsersRec?.recordedAt ??
      totalEmployeesRec?.recordedAt ??
      totalProjectsRec?.recordedAt ??
      totalDocumentsRec?.recordedAt ??
      null;

    return {
      activeUsers: activeUsersRec ? Number(activeUsersRec.value) : 0,
      totalEmployees: totalEmployeesRec ? Number(totalEmployeesRec.value) : 0,
      totalProjects: totalProjectsRec ? Number(totalProjectsRec.value) : 0,
      totalDocuments: totalDocumentsRec ? Number(totalDocumentsRec.value) : 0,
      asOf,
    };
  }
}
