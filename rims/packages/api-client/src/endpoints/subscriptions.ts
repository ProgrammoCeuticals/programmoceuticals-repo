import type { AxiosInstance } from 'axios';
import type { ApiResponse } from '../types';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  priceMonthly: number;
  priceAnnual: number;
  maxUsers: number;
  isActive: boolean;
  createdAt: string;
}

export interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  status: string;
  startDate: string;
  endDate: string | null;
  renewsAt: string | null;
  plan: SubscriptionPlan;
}

export interface ModuleEntitlement {
  id: string;
  tenantId: string;
  moduleCode: string;
  enabled: boolean;
  enabledAt: string | null;
}

export const getPlans = (client: AxiosInstance) =>
  client.get<ApiResponse<SubscriptionPlan[]>>('/subscriptions/plans').then((r) => r.data);

export const getCurrentSubscription = (client: AxiosInstance) =>
  client.get<ApiResponse<Subscription>>('/subscriptions/current').then((r) => r.data);

export const getEntitlements = (client: AxiosInstance) =>
  client.get<ApiResponse<ModuleEntitlement[]>>('/subscriptions/entitlements').then((r) => r.data);

export const enableModule = (client: AxiosInstance, moduleCode: string) =>
  client.post<ApiResponse<ModuleEntitlement>>('/subscriptions/modules/enable', { moduleCode }).then((r) => r.data);

export const disableModule = (client: AxiosInstance, moduleCode: string) =>
  client.post<ApiResponse<ModuleEntitlement>>('/subscriptions/modules/disable', { moduleCode }).then((r) => r.data);

export const provisionTenant = (
  client: AxiosInstance,
  payload: {
    tenantSlug: string;
    tenantName: string;
    adminEmail: string;
    adminFirstName: string;
    adminLastName: string;
    institutionName: string;
  },
) =>
  client.post<ApiResponse<{ tenantId: string; userId: string }>>('/platform/tenants/provision', payload).then((r) => r.data);
