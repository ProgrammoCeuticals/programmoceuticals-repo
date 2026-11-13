import type { AxiosInstance } from 'axios';
import type { ApiResponse, PaginatedResponse } from '../types';

export interface Manuscript {
  id: string;
  tenantId: string;
  title: string;
  abstract: string | null;
  keywords: string[];
  status: string;
  researchProjectId: string | null;
  targetJournal: string | null;
  publisher: string | null;
  submittedAt: string | null;
  acceptedAt: string | null;
  rejectedAt: string | null;
  publishedAt: string | null;
  withdrawnAt: string | null;
  doi: string | null;
  volume: string | null;
  issue: string | null;
  pages: string | null;
  url: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ManuscriptAuthor {
  id: string;
  manuscriptId: string;
  employeeId: string;
  contributionRole: string | null;
  authorOrder: number;
  isCorresponding: boolean;
  employee?: { id: string; firstName: string; lastName: string };
}

export interface ManuscriptReview {
  id: string;
  manuscriptId: string;
  round: number;
  submittedAt: string | null;
  deadline: string | null;
  outcome: string | null;
  notes: string | null;
  createdAt: string;
}

export interface QueryManuscriptsParams {
  page?: number;
  pageSize?: number;
  status?: string;
  researchProjectId?: string;
  search?: string;
}

export interface CreateManuscriptPayload {
  title: string;
  abstract?: string;
  keywords?: string[];
  researchProjectId?: string;
  targetJournal?: string;
  publisher?: string;
  doi?: string;
  url?: string;
}

export interface UpdateManuscriptPayload {
  title?: string;
  abstract?: string;
  keywords?: string[];
  status?: string;
  researchProjectId?: string;
  targetJournal?: string;
  publisher?: string;
  doi?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  url?: string;
}

export interface AddAuthorPayload {
  employeeId: string;
  contributionRole?: string;
  authorOrder?: number;
  isCorresponding?: boolean;
}

export const listManuscripts = (client: AxiosInstance, params?: QueryManuscriptsParams) =>
  client.get<PaginatedResponse<Manuscript>>('/publications', { params }).then((r) => r.data);

export const createManuscript = (client: AxiosInstance, payload: CreateManuscriptPayload) =>
  client.post<ApiResponse<Manuscript>>('/publications', payload).then((r) => r.data);

export const getManuscript = (client: AxiosInstance, id: string) =>
  client
    .get<ApiResponse<Manuscript & { authors: ManuscriptAuthor[]; reviews: ManuscriptReview[] }>>(
      `/publications/${id}`,
    )
    .then((r) => r.data);

export const updateManuscript = (client: AxiosInstance, id: string, payload: UpdateManuscriptPayload) =>
  client.patch<ApiResponse<Manuscript>>(`/publications/${id}`, payload).then((r) => r.data);

export const addManuscriptAuthor = (client: AxiosInstance, manuscriptId: string, payload: AddAuthorPayload) =>
  client
    .post<ApiResponse<ManuscriptAuthor>>(`/publications/${manuscriptId}/authors`, payload)
    .then((r) => r.data);

export const removeManuscriptAuthor = (client: AxiosInstance, manuscriptId: string, employeeId: string) =>
  client
    .delete<ApiResponse<void>>(`/publications/${manuscriptId}/authors/${employeeId}`)
    .then((r) => r.data);

export const addManuscriptReview = (
  client: AxiosInstance,
  manuscriptId: string,
  payload: { round?: number; deadline?: string; notes?: string },
) =>
  client
    .post<ApiResponse<ManuscriptReview>>(`/publications/${manuscriptId}/reviews`, payload)
    .then((r) => r.data);

export const updateManuscriptReview = (
  client: AxiosInstance,
  manuscriptId: string,
  reviewId: string,
  payload: { outcome?: string; notes?: string; submittedAt?: string; deadline?: string },
) =>
  client
    .patch<ApiResponse<ManuscriptReview>>(`/publications/${manuscriptId}/reviews/${reviewId}`, payload)
    .then((r) => r.data);
