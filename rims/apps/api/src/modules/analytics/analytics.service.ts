import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getISOWeek(date: Date): string {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTrends(
    tenantId: string,
    query: {
      metric: string;
      periodStart: string;
      periodEnd: string;
      interval: string;
    },
  ): Promise<{
    labels: string[];
    series: { name: string; data: number[] }[];
    generatedAt: Date;
  }> {
    const start = new Date(query.periodStart);
    const end = new Date(query.periodEnd);

    switch (query.metric) {
      case "research_projects_by_month": {
        const projects = await this.prisma.researchProject.findMany({
          where: {
            tenantId,
            status: { notIn: ["CANCELLED", "ARCHIVED"] },
            createdAt: { gte: start, lte: end },
          },
          select: { createdAt: true },
        });

        const grouped = new Map<string, number>();
        for (const p of projects) {
          const key = `${p.createdAt.getUTCFullYear()}-${MONTH_NAMES[p.createdAt.getUTCMonth()]}`;
          grouped.set(key, (grouped.get(key) ?? 0) + 1);
        }

        const labels = Array.from(grouped.keys()).sort();
        const data = labels.map((l) => grouped.get(l) ?? 0);

        return {
          labels,
          series: [{ name: "Projects Created", data }],
          generatedAt: new Date(),
        };
      }

      case "tasks_completed_by_week": {
        const tasks = await this.prisma.projectTask.findMany({
          where: {
            tenantId,
            status: "COMPLETED",
            completedAt: { gte: start, lte: end },
          },
          select: { completedAt: true },
        });

        const grouped = new Map<string, number>();
        for (const t of tasks) {
          if (!t.completedAt) continue;
          const key = getISOWeek(t.completedAt);
          grouped.set(key, (grouped.get(key) ?? 0) + 1);
        }

        const labels = Array.from(grouped.keys()).sort();
        const data = labels.map((l) => grouped.get(l) ?? 0);

        return {
          labels,
          series: [{ name: "Tasks Completed", data }],
          generatedAt: new Date(),
        };
      }

      case "publications_by_month": {
        const manuscripts = await this.prisma.manuscript.findMany({
          where: {
            tenantId,
            publishedAt: { not: null, gte: start, lte: end },
          },
          select: { publishedAt: true },
        });

        const grouped = new Map<string, number>();
        for (const m of manuscripts) {
          if (!m.publishedAt) continue;
          const key = `${m.publishedAt.getUTCFullYear()}-${MONTH_NAMES[m.publishedAt.getUTCMonth()]}`;
          grouped.set(key, (grouped.get(key) ?? 0) + 1);
        }

        const labels = Array.from(grouped.keys()).sort();
        const data = labels.map((l) => grouped.get(l) ?? 0);

        return {
          labels,
          series: [{ name: "Publications", data }],
          generatedAt: new Date(),
        };
      }

      case "kpi_completion_by_cycle": {
        const cycles = await this.prisma.performanceCycle.findMany({
          where: { tenantId },
          include: {
            kpiAssignments: {
              include: { results: { select: { status: true } } },
            },
          },
          orderBy: { startDate: "asc" },
        });

        const labels: string[] = [];
        const data: number[] = [];

        for (const cycle of cycles) {
          const total = cycle.kpiAssignments.length;
          if (total === 0) {
            labels.push(cycle.name);
            data.push(0);
            continue;
          }
          const approved = cycle.kpiAssignments.reduce((acc: number, a: { results: { status: string }[] }) => {
            const approvedCount = a.results.filter((r: { status: string }) => r.status === "APPROVED").length;
            return acc + approvedCount;
          }, 0);
          labels.push(cycle.name);
          data.push(Math.round((approved / total) * 100));
        }

        return {
          labels,
          series: [{ name: "Completion %", data }],
          generatedAt: new Date(),
        };
      }

      default:
        throw new BadRequestException(`Unrecognised metric: ${query.metric}`);
    }
  }

  async getWorkloadDistribution(tenantId: string) {
    const departments = await this.prisma.department.findMany({
      where: { tenantId, status: "ACTIVE" },
      select: { id: true, name: true },
    });

    const result = await Promise.all(
      departments.map(async (dept: { id: string; name: string }) => {
        const [employeeCount, projectMembershipCount, openTaskCount] =
          await Promise.all([
            this.prisma.employee.count({
              where: { tenantId, departmentId: dept.id, status: "ACTIVE" },
            }),
            this.prisma.researchProjectMember.count({
              where: { employee: { departmentId: dept.id, tenantId } },
            }),
            this.prisma.projectTask.count({
              where: {
                tenantId,
                status: { notIn: ["COMPLETED", "CANCELLED"] },
                assignee: { departmentId: dept.id },
              },
            }),
          ]);

        return {
          departmentId: dept.id,
          departmentName: dept.name,
          employeeCount,
          projectMembershipCount,
          openTaskCount,
        };
      }),
    );

    return result.sort((a, b) => b.openTaskCount - a.openTaskCount);
  }

  async getProjectRiskIndicators(tenantId: string) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const fourteenDaysFromNow = new Date(
      now.getTime() + 14 * 24 * 60 * 60 * 1000,
    );

    const projects = await this.prisma.researchProject.findMany({
      where: { tenantId, status: "ACTIVE" },
      include: {
        milestones: {
          where: {
            dueDate: { lt: now },
            status: { not: "COMPLETED" },
          },
          select: { id: true },
          take: 1,
        },
      },
    });

    const riskProjects = projects
      .map((p) => {
        const hasOverdueMilestone = p.milestones.length > 0;
        const noRecentUpdate = p.updatedAt < thirtyDaysAgo;
        const approachingDeadline =
          p.endDate !== null &&
          p.endDate <= fourteenDaysFromNow &&
          p.status === "ACTIVE";

        return {
          projectId: p.id,
          title: p.title,
          hasOverdueMilestone,
          noRecentUpdate,
          approachingDeadline,
        };
      })
      .filter(
        (p) =>
          p.hasOverdueMilestone || p.noRecentUpdate || p.approachingDeadline,
      );

    return riskProjects;
  }

  async getPublicationTrends(
    tenantId: string,
    year?: number,
  ): Promise<{
    year: number;
    byStatus: Record<string, number>;
    monthlySubmissions: number[];
    monthlyAcceptances: number[];
    monthlyPublications: number[];
  }> {
    const targetYear = year ?? new Date().getUTCFullYear();
    const yearStart = new Date(Date.UTC(targetYear, 0, 1));
    const yearEnd = new Date(Date.UTC(targetYear, 11, 31, 23, 59, 59, 999));

    const [byStatusRaw, manuscripts] = await Promise.all([
      this.prisma.manuscript.groupBy({
        by: ["status"],
        where: { tenantId },
        _count: { id: true },
      }),
      this.prisma.manuscript.findMany({
        where: {
          tenantId,
          OR: [
            { submittedAt: { gte: yearStart, lte: yearEnd } },
            { acceptedAt: { gte: yearStart, lte: yearEnd } },
            { publishedAt: { gte: yearStart, lte: yearEnd } },
          ],
        },
        select: { submittedAt: true, acceptedAt: true, publishedAt: true },
      }),
    ]);

    const byStatus = byStatusRaw.reduce<Record<string, number>>((acc, row) => {
      acc[row.status] = row._count.id;
      return acc;
    }, {});

    const monthlySubmissions = Array(12).fill(0) as number[];
    const monthlyAcceptances = Array(12).fill(0) as number[];
    const monthlyPublications = Array(12).fill(0) as number[];

    for (const m of manuscripts) {
      if (
        m.submittedAt &&
        m.submittedAt >= yearStart &&
        m.submittedAt <= yearEnd
      ) {
        const idx = m.submittedAt.getUTCMonth();
        monthlySubmissions[idx] = (monthlySubmissions[idx] ?? 0) + 1;
      }
      if (
        m.acceptedAt &&
        m.acceptedAt >= yearStart &&
        m.acceptedAt <= yearEnd
      ) {
        const idx = m.acceptedAt.getUTCMonth();
        monthlyAcceptances[idx] = (monthlyAcceptances[idx] ?? 0) + 1;
      }
      if (
        m.publishedAt &&
        m.publishedAt >= yearStart &&
        m.publishedAt <= yearEnd
      ) {
        const idx = m.publishedAt.getUTCMonth();
        monthlyPublications[idx] = (monthlyPublications[idx] ?? 0) + 1;
      }
    }

    return {
      year: targetYear,
      byStatus,
      monthlySubmissions,
      monthlyAcceptances,
      monthlyPublications,
    };
  }

  async saveSnapshot(
    tenantId: string,
    snapshotType: string,
    periodStart: Date,
    periodEnd: Date,
    data: Record<string, unknown>,
  ) {
    return this.prisma.analyticsSnapshot.create({
      data: {
        tenantId,
        snapshotType,
        periodStart,
        periodEnd,
        dataJson: data as Prisma.InputJsonValue,
      },
    });
  }
}
