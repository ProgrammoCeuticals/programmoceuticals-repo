import type { AxiosInstance } from 'axios';
import type { ApiResponse, PaginatedResponse } from '../types';

export interface DocumentFolder {
  id: string;
  tenantId: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  _count?: { documents: number; children: number };
}

export interface Document {
  id: string;
  tenantId: string;
  title: string;
  description: string | null;
  folderId: string | null;
  status: string;
  fileKey: string | null;
  fileName: string | null;
  mimeType: string | null;
  fileSizeBytes: number | null;
  currentVersion: number;
  uploadedById: string | null;
  approvedById: string | null;
  approvedAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  fileKey: string;
  fileName: string;
  fileSizeBytes: number | null;
  checksum: string | null;
  uploadedById: string | null;
  notes: string | null;
  createdAt: string;
}

export const listFolders = (client: AxiosInstance, parentId?: string) =>
  client
    .get<ApiResponse<DocumentFolder[]>>('/documents/folders', {
      params: parentId ? { parentId } : {},
    })
    .then((r) => r.data);

export const createFolder = (client: AxiosInstance, payload: { name: string; parentId?: string }) =>
  client.post<ApiResponse<DocumentFolder>>('/documents/folders', payload).then((r) => r.data);

export const listDocuments = (
  client: AxiosInstance,
  params?: {
    folderId?: string;
    status?: string;
    search?: string;
    mimeType?: string;
    page?: number;
    pageSize?: number;
  },
) =>
  client.get<PaginatedResponse<Document>>('/documents', { params }).then((r) => r.data);

export const createDocument = (
  client: AxiosInstance,
  payload: {
    title: string;
    description?: string;
    folderId?: string;
    fileKey?: string;
    fileName?: string;
    mimeType?: string;
    fileSizeBytes?: number;
    checksum?: string;
  },
) =>
  client.post<ApiResponse<Document>>('/documents', payload).then((r) => r.data);

export const getDocument = (client: AxiosInstance, id: string) =>
  client
    .get<ApiResponse<Document & { versions: DocumentVersion[] }>>(`/documents/${id}`)
    .then((r) => r.data);

export const updateDocument = (
  client: AxiosInstance,
  id: string,
  payload: Partial<{ title: string; description: string; folderId: string }>,
) =>
  client.patch<ApiResponse<Document>>(`/documents/${id}`, payload).then((r) => r.data);

export const approveDocument = (client: AxiosInstance, id: string) =>
  client.post<ApiResponse<Document>>(`/documents/${id}/approve`).then((r) => r.data);

export const archiveDocument = (client: AxiosInstance, id: string) =>
  client.post<ApiResponse<Document>>(`/documents/${id}/archive`).then((r) => r.data);

export const addDocumentVersion = (
  client: AxiosInstance,
  id: string,
  payload: {
    fileKey: string;
    fileName: string;
    fileSizeBytes?: number;
    checksum?: string;
    notes?: string;
  },
) =>
  client.post<ApiResponse<Document>>(`/documents/${id}/versions`, payload).then((r) => r.data);

export const getDocumentDownloadUrl = (client: AxiosInstance, id: string) =>
  client
    .get<ApiResponse<{ url: string; expiresAt: string; note?: string }>>(
      `/documents/${id}/download-url`,
    )
    .then((r) => r.data);
