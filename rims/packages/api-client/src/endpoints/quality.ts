import type { AxiosInstance } from 'axios';
import type { ApiResponse, PaginatedResponse } from '../types';

export interface QualityReview {
  id: string;
  tenantId: string;
  title: string;
  reviewType: string;
  status: string;
  scheduledDate: string | null;
  completedAt: string | null;
  departmentId: string | null;
  leadReviewerId: string | null;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface QualityFinding {
  id: string;
  tenantId: string;
  reviewId: string;
  title: string;
  description: string | null;
  severity: string;
  status: string;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
  correctiveActions?: CorrectiveAction[];
}

export interface CorrectiveAction {
  id: string;
  tenantId: string;
  findingId: string;
  title: string;
  description: string | null;
  status: string;
  ownerId: string | null;
  dueDate: string | null;
  closedAt: string | null;
  evidenceRef: string | null;
  createdAt: string;
  updatedAt: string;
}

export const listQualityReviews = (
  client: AxiosInstance,
  params?: {
    status?: string;
    departmentId?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    pageSize?: number;
  },
) =>
  client
    .get<PaginatedResponse<QualityReview>>('/quality/reviews', { params })
    .then((r) => r.data);

export const createQualityReview = (
  client: AxiosInstance,
  payload: {
    title: string;
    reviewType: string;
    scheduledDate?: string;
    departmentId?: string;
    leadReviewerId?: string;
    summary?: string;
  },
) =>
  client.post<ApiResponse<QualityReview>>('/quality/reviews', payload).then((r) => r.data);

export const getQualityReview = (client: AxiosInstance, id: string) =>
  client
    .get<ApiResponse<QualityReview & { findings: QualityFinding[] }>>(`/quality/reviews/${id}`)
    .then((r) => r.data);

export const updateQualityReview = (
  client: AxiosInstance,
  id: string,
  payload: Partial<{
    title: string;
    reviewType: string;
    status: string;
    scheduledDate: string;
    departmentId: string;
    leadReviewerId: string;
    summary: string;
  }>,
) =>
  client
    .patch<ApiResponse<QualityReview>>(`/quality/reviews/${id}`, payload)
    .then((r) => r.data);

export const createFinding = (
  client: AxiosInstance,
  reviewId: string,
  payload: { title: string; description?: string; severity?: string },
) =>
  client
    .post<ApiResponse<QualityFinding>>(`/quality/reviews/${reviewId}/findings`, payload)
    .then((r) => r.data);

export const updateFinding = (
  client: AxiosInstance,
  findingId: string,
  payload: Partial<{ title: string; description: string; severity: string; status: string }>,
) =>
  client
    .patch<ApiResponse<QualityFinding>>(`/quality/findings/${findingId}`, payload)
    .then((r) => r.data);

export const createCorrectiveAction = (
  client: AxiosInstance,
  findingId: string,
  payload: {
    title: string;
    description?: string;
    ownerId?: string;
    dueDate?: string;
    evidenceRef?: string;
  },
) =>
  client
    .post<ApiResponse<CorrectiveAction>>(`/quality/findings/${findingId}/actions`, payload)
    .then((r) => r.data);

export const updateCorrectiveAction = (
  client: AxiosInstance,
  actionId: string,
  payload: Partial<{
    title: string;
    description: string;
    status: string;
    ownerId: string;
    dueDate: string;
    evidenceRef: string;
  }>,
) =>
  client
    .patch<ApiResponse<CorrectiveAction>>(`/quality/actions/${actionId}`, payload)
    .then((r) => r.data);
