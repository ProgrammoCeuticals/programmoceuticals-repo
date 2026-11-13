import type { AxiosInstance } from 'axios';
import type { ApiResponse, PaginatedResponse } from '../types';

export interface Notification {
  id: string;
  tenantId: string;
  userId: string;
  channel: string;
  status: string;
  title: string;
  body: string | null;
  resourceType: string | null;
  resourceId: string | null;
  actionUrl: string | null;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationPreference {
  id: string;
  userId: string;
  tenantId: string;
  eventType: string;
  inAppEnabled: boolean;
  emailEnabled: boolean;
}

export const getNotifications = (
  client: AxiosInstance,
  params?: { status?: string; page?: number; pageSize?: number },
) =>
  client.get<PaginatedResponse<Notification>>('/notifications', { params }).then((r) => r.data);

export const getUnreadCount = (client: AxiosInstance) =>
  client.get<ApiResponse<{ count: number }>>('/notifications/unread-count').then((r) => r.data);

export const markRead = (client: AxiosInstance, id: string) =>
  client.post<ApiResponse<Notification>>(`/notifications/${id}/read`).then((r) => r.data);

export const markAllRead = (client: AxiosInstance) =>
  client.post<ApiResponse<{ updated: number }>>('/notifications/read-all').then((r) => r.data);

export const dismissNotification = (client: AxiosInstance, id: string) =>
  client.post<ApiResponse<Notification>>(`/notifications/${id}/dismiss`).then((r) => r.data);

export const getNotificationPreferences = (client: AxiosInstance) =>
  client.get<ApiResponse<NotificationPreference[]>>('/notifications/preferences').then((r) => r.data);

export const updateNotificationPreference = (
  client: AxiosInstance,
  payload: { eventType: string; inAppEnabled: boolean; emailEnabled: boolean },
) =>
  client.patch<ApiResponse<NotificationPreference>>('/notifications/preferences', payload).then((r) => r.data);
