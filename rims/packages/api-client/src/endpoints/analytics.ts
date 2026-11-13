import type { AxiosInstance } from 'axios';
import type { ApiResponse } from '../types';

export interface TrendsResult {
  labels: string[];
  series: { name: string; data: number[] }[];
  generatedAt: string;
}

export interface WorkloadItem {
  departmentId: string;
  departmentName: string;
  employeeCount: number;
  projectMembershipCount: number;
  openTaskCount: number;
}

export interface RiskProject {
  projectId: string;
  title: string;
  hasOverdueMilestone: boolean;
  noRecentUpdate: boolean;
  approachingDeadline: boolean;
}

export interface PublicationTrends {
  year: number;
  byStatus: Record<string, number>;
  monthlySubmissions: number[];
  monthlyAcceptances: number[];
  monthlyPublications: number[];
}

export const getTrends = (
  client: AxiosInstance,
  params: { metric: string; periodStart: string; periodEnd: string; interval: string },
) =>
  client.get<ApiResponse<TrendsResult>>('/analytics/trends', { params }).then((r) => r.data);

export const getWorkloadDistribution = (client: AxiosInstance) =>
  client.get<ApiResponse<WorkloadItem[]>>('/analytics/workload').then((r) => r.data);

export const getProjectRisks = (client: AxiosInstance) =>
  client.get<ApiResponse<RiskProject[]>>('/analytics/project-risks').then((r) => r.data);

export const getPublicationTrends = (client: AxiosInstance, params?: { year?: number }) =>
  client.get<ApiResponse<PublicationTrends>>('/analytics/publication-trends', { params }).then((r) => r.data);
