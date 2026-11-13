import type { AxiosInstance } from 'axios';
import type { ApiResponse, PaginatedResponse } from '../types';

export interface PlatformTenant {
  id: string;
  name: string;
  slug: string;
  status: string;
  createdAt: string;
  _count?: { users: number; employees: number };
  subscription?: { planName: string };
}

export interface SystemHealth {
  tenantCount: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  dbStatus: string;
  cacheStatus: string;
  queueStatus: string;
  uptime: number;
  timestamp: string;
}

export const listPlatformTenants = (
  client: AxiosInstance,
  params?: { status?: string; search?: string; page?: number; pageSize?: number },
) =>
  client.get<PaginatedResponse<PlatformTenant>>('/platform/tenants', { params }).then((r) => r.data);

export const getPlatformTenantOverview = (client: AxiosInstance, id: string) =>
  client.get<ApiResponse<PlatformTenant>>(`/platform/tenants/${id}`).then((r) => r.data);

export const suspendTenant = (client: AxiosInstance, id: string, reason: string) =>
  client
    .post<ApiResponse<PlatformTenant>>(`/platform/tenants/${id}/suspend`, { reason })
    .then((r) => r.data);

export const activateTenant = (client: AxiosInstance, id: string) =>
  client.post<ApiResponse<PlatformTenant>>(`/platform/tenants/${id}/activate`).then((r) => r.data);

export const getSystemHealth = (client: AxiosInstance) =>
  client.get<ApiResponse<SystemHealth>>('/platform/system/health').then((r) => r.data);
