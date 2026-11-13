import type { AxiosInstance } from 'axios';
import type { ApiResponse, PaginatedResponse } from '../types';

export interface UsageSummary {
  activeUsers: number;
  totalEmployees: number;
  totalProjects: number;
  totalDocuments: number;
  asOf: string | null;
}

export interface UsageRecord {
  id: string;
  tenantId: string;
  metricType: string;
  value: number;
  recordedAt: string;
  periodStart: string;
  periodEnd: string;
}

export const getUsageSummary = (client: AxiosInstance) =>
  client.get<ApiResponse<UsageSummary>>('/usage/summary').then((r) => r.data);

export const getUsageHistory = (
  client: AxiosInstance,
  params?: { metricType?: string; dateFrom?: string; dateTo?: string },
) =>
  client.get<PaginatedResponse<UsageRecord>>('/usage/history', { params }).then((r) => r.data);
