import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async executiveOverview(tenantId: string) {
    const [
      totalActiveEmployees,
      totalActiveDepartments,
      researchProjectsRaw,
      totalTasks,
      overdueTasks,
      pendingInvitations,
      activePerformanceCycles,
      activeManuscripts,
      pendingBudgetApprovals,
      openQualityFindings,
      pendingDocumentApprovals,
    ] = await Promise.all([
      this.prisma.employee.count({ where: { tenantId, status: "ACTIVE" } }),
      this.prisma.department.count({ where: { tenantId, status: "ACTIVE" } }),
      this.prisma.researchProject.groupBy({
        by: ["status"],
        where: { tenantId },
        _count: { id: true },
      }),
      this.prisma.projectTask.count({ where: { tenantId } }),
      this.prisma.projectTask.count({
        where: {
          tenantId,
          dueDate: { lt: new Date() },
          status: { notIn: ["COMPLETED", "CANCELLED"] },
        },
      }),
      this.prisma.user.count({
        where: { tenantId, status: "PENDING_VERIFICATION" },
      }),
      this.prisma.performanceCycle.count({
        where: { tenantId, status: "ACTIVE" },
      }),
      this.prisma.manuscript.count({
        where: { tenantId, status: { notIn: ["WITHDRAWN", "REJECTED"] } },
      }),
      this.prisma.projectBudget.count({
        where: { tenantId, approvalStatus: "PENDING" },
      }),
      this.prisma.qualityFinding.count({
        where: { tenantId, status: { in: ["OPEN", "IN_PROGRESS"] } },
      }),
      this.prisma.document.count({
        where: { tenantId, status: "UNDER_REVIEW" },
      }),
    ]);

    const researchProjectsByStatus = researchProjectsRaw.reduce<
      Record<string, number>
    >((acc, row) => {
      acc[row.status] = row._count.id;
      return acc;
    }, {});

    return {
      generatedAt: new Date(),
      dataStatus: "LIVE",
      reportingPeriod: null,
      data: {
        totalActiveEmployees,
        totalActiveDepartments,
        researchProjectsByStatus,
        totalTasks,
        overdueTasks,
        pendingInvitations,
        activePerformanceCycles,
        activeManuscripts,
        pendingBudgetApprovals,
        openQualityFindings,
        pendingDocumentApprovals,
      },
    };
  }

  async performanceSummary(tenantId: string, cycleId: string) {
    const cycle = await this.prisma.performanceCycle.findFirst({
      where: { id: cycleId, tenantId },
      include: {
        kpiAssignments: {
          include: { results: true },
        },
      },
    });

    if (!cycle) {
      return {
        generatedAt: new Date(),
        dataStatus: "LIVE",
        reportingPeriod: null,
        data: null,
        error: "Performance cycle not found",
      };
    }

    const assignments = cycle.kpiAssignments;
    const totalAssignments = assignments.length;

    const assignmentsBySubjectType: Record<string, number> = {};
    const resultsByStatus: Record<string, number> = {
      DRAFT: 0,
      SUBMITTED: 0,
      RETURNED: 0,
      APPROVED: 0,
      LOCKED: 0,
    };

    let approvedCount = 0;

    for (const assignment of assignments) {
      const sType = assignment.subjectType;
      assignmentsBySubjectType[sType] =
        (assignmentsBySubjectType[sType] ?? 0) + 1;

      const result = assignment.results[0];
      if (result) {
        const s = result.status as string;
        resultsByStatus[s] = (resultsByStatus[s] ?? 0) + 1;
        if (s === "APPROVED") approvedCount++;
      } else {
        resultsByStatus["DRAFT"] = (resultsByStatus["DRAFT"] ?? 0) + 1;
      }
    }

    const completionPercentage =
      totalAssignments > 0
        ? Math.round((approvedCount / totalAssignments) * 100)
        : 0;

    return {
      generatedAt: new Date(),
      dataStatus: "LIVE",
      reportingPeriod: { startDate: cycle.startDate, endDate: cycle.endDate },
      data: {
        cycleId: cycle.id,
        cycleName: cycle.name,
        cycleStatus: cycle.status,
        totalAssignments,
        assignmentsBySubjectType,
        resultsByStatus,
        completionPercentage,
      },
    };
  }

  async researchPortfolio(
    tenantId: string,
    query: {
      departmentId?: string;
      status?: string;
      dateFrom?: string;
      dateTo?: string;
    },
  ) {
    const { departmentId, status, dateFrom, dateTo } = query;

    const projectWhere: Prisma.ResearchProjectWhereInput = { tenantId };
    if (departmentId) projectWhere.departmentId = departmentId;
    if (status)
      projectWhere.status = status as Prisma.EnumResearchProjectStatusFilter;
    if (dateFrom || dateTo) {
      const createdAt: Prisma.DateTimeFilter = {};
      if (dateFrom) createdAt.gte = new Date(dateFrom);
      if (dateTo) createdAt.lte = new Date(dateTo);
      projectWhere.createdAt = createdAt;
    }

    const milestoneProjectWhere: Prisma.ResearchProjectWhereInput = {
      tenantId,
    };
    if (departmentId) milestoneProjectWhere.departmentId = departmentId;

    const [projectsByStatusRaw, overdueMilestones, tasksByStatusRaw] =
      await Promise.all([
        this.prisma.researchProject.groupBy({
          by: ["status"],
          where: projectWhere,
          _count: { id: true },
        }),
        this.prisma.projectMilestone.findMany({
          where: {
            tenantId,
            dueDate: { lt: new Date() },
            status: { not: "COMPLETED" },
            researchProject: milestoneProjectWhere,
          },
          include: {
            researchProject: { select: { title: true } },
          },
          orderBy: { dueDate: "asc" },
          take: 20,
        }),
        this.prisma.projectTask.groupBy({
          by: ["status"],
          where: {
            tenantId,
            ...(departmentId ? { researchProject: { departmentId } } : {}),
          },
          _count: { id: true },
        }),
      ]);

    const projectsByStatus = projectsByStatusRaw.reduce<Record<string, number>>(
      (acc, row) => {
        acc[row.status] = row._count.id;
        return acc;
      },
      {},
    );

    const tasksByStatus = tasksByStatusRaw.reduce<Record<string, number>>(
      (acc, row) => {
        acc[row.status] = row._count.id;
        return acc;
      },
      {},
    );

    return {
      generatedAt: new Date(),
      dataStatus: "LIVE",
      reportingPeriod: null,
      filters: query,
      data: {
        projectsByStatus,
        overdueMilestones,
        tasksByStatus,
      },
    };
  }

  async workforceReport(tenantId: string, query: { departmentId?: string }) {
    const { departmentId } = query;

    const baseWhere: Prisma.EmployeeWhereInput = { tenantId };
    if (departmentId) baseWhere.departmentId = departmentId;

    const [
      employeesByDepartmentRaw,
      employeesByStatusRaw,
      employeesByPositionRaw,
      departments,
      positions,
    ] = await Promise.all([
      this.prisma.employee.groupBy({
        by: ["departmentId"],
        where: baseWhere,
        _count: { id: true },
      }),
      this.prisma.employee.groupBy({
        by: ["status"],
        where: baseWhere,
        _count: { id: true },
      }),
      this.prisma.employee.groupBy({
        by: ["positionId"],
        where: baseWhere,
        _count: { id: true },
      }),
      this.prisma.department.findMany({
        where: { tenantId },
        select: { id: true, name: true },
      }),
      this.prisma.position.findMany({
        where: { tenantId },
        select: { id: true, title: true },
      }),
    ]);

    const deptMap = new Map(departments.map((d) => [d.id, d.name]));
    const posMap = new Map(positions.map((p) => [p.id, p.title]));

    const byDepartment = employeesByDepartmentRaw.map((row) => ({
      departmentId: row.departmentId,
      departmentName: row.departmentId
        ? (deptMap.get(row.departmentId) ?? null)
        : null,
      count: row._count.id,
    }));

    const byStatus = employeesByStatusRaw.map((row) => ({
      status: row.status,
      count: row._count.id,
    }));

    const byPosition = employeesByPositionRaw.map((row) => ({
      positionId: row.positionId,
      positionTitle: row.positionId
        ? (posMap.get(row.positionId) ?? null)
        : null,
      count: row._count.id,
    }));

    return {
      generatedAt: new Date(),
      dataStatus: "LIVE",
      reportingPeriod: null,
      filters: query,
      data: {
        byDepartment,
        byStatus,
        byPosition,
      },
    };
  }

  async publicationsSummary(tenantId: string) {
    const [byStatusRaw, recentPublications] = await Promise.all([
      this.prisma.manuscript.groupBy({
        by: ["status"],
        where: { tenantId },
        _count: { id: true },
      }),
      this.prisma.manuscript.findMany({
        where: { tenantId, status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          targetJournal: true,
          publishedAt: true,
        },
      }),
    ]);

    const byStatus = byStatusRaw.reduce<Record<string, number>>((acc, row) => {
      acc[row.status] = row._count.id;
      return acc;
    }, {});

    // Top 5 projects by manuscript count
    const byProjectRaw = await this.prisma.manuscript.groupBy({
      by: ["researchProjectId"],
      where: { tenantId, researchProjectId: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    });

    const projectIds = byProjectRaw
      .map((r) => r.researchProjectId)
      .filter((id): id is string => id !== null);

    const projects = await this.prisma.researchProject.findMany({
      where: { id: { in: projectIds } },
      select: { id: true, title: true },
    });

    const byResearchProject = byProjectRaw.map((r) => ({
      projectId: r.researchProjectId,
      projectTitle:
        projects.find((p) => p.id === r.researchProjectId)?.title ?? "Unknown",
      count: r._count.id,
    }));

    return {
      generatedAt: new Date(),
      data: { byStatus, byResearchProject, recentPublications },
    };
  }
}
