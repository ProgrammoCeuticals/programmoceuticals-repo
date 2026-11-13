import type { AxiosInstance } from "axios";
import type { ApiResponse } from "../types";

export interface ExecutiveOverviewReport {
  totalEmployees: number;
  totalDepartments: number;
  activeResearchProjects: number;
  openTasks: number;
  performanceSummary: Record<string, unknown>;
}

export interface PerformanceReport {
  cycleId: string;
  cycleName: string;
  totalAssignments: number;
  submitted: number;
  approved: number;
  averageScore: number | null;
  data: Record<string, unknown>[];
}

export interface ResearchPortfolioReport {
  totalProjects: number;
  byStatus: Record<string, number>;
  projects: Record<string, unknown>[];
}

export interface WorkforceReport {
  totalEmployees: number;
  byDepartment: Record<string, number>;
  byStatus: Record<string, number>;
  data: Record<string, unknown>[];
}

export interface GetResearchPortfolioReportParams {
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface GetWorkforceReportParams {
  departmentId?: string;
  status?: string;
}

export const getExecutiveOverviewReport = (client: AxiosInstance) =>
  client
    .get<ApiResponse<ExecutiveOverviewReport>>("/reports/executive-overview")
    .then((r) => r.data);

export const getPerformanceReport = (client: AxiosInstance, cycleId: string) =>
  client
    .get<ApiResponse<PerformanceReport>>("/reports/performance", {
      params: { cycleId },
    })
    .then((r) => r.data);

export const getResearchPortfolioReport = (
  client: AxiosInstance,
  params?: GetResearchPortfolioReportParams,
) =>
  client
    .get<ApiResponse<ResearchPortfolioReport>>("/reports/research", { params })
    .then((r) => r.data);

export const getWorkforceReport = (
  client: AxiosInstance,
  params?: GetWorkforceReportParams,
) =>
  client
    .get<ApiResponse<WorkforceReport>>("/reports/workforce", { params })
    .then((r) => r.data);

export interface PublicationsReport {
  byStatus: Record<string, number>;
  byResearchProject: Array<{
    projectId: string | null;
    projectTitle: string;
    count: number;
  }>;
  recentPublications: Array<{
    id: string;
    title: string;
    targetJournal: string | null;
    publishedAt: Date | null;
  }>;
}

export const getPublicationsReport = (client: AxiosInstance) =>
  client
    .get<ApiResponse<PublicationsReport>>("/reports/publications")
    .then((r) => r.data);
