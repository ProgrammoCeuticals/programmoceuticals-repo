import type { AxiosInstance } from 'axios';
import type { ApiResponse, PaginatedResult } from '../types';
import type { Department } from '../types';

export interface CreateDepartmentData {
  name: string;
  code: string;
  description?: string;
  parentId?: string;
  headId?: string;
}

export interface UpdateDepartmentData {
  name?: string;
  code?: string;
  description?: string;
  parentId?: string;
  headId?: string;
}

export const getDepartments = (client: AxiosInstance) =>
  client
    .get<ApiResponse<Department[]>>('/departments')
    .then((r) => r.data);

export const createDepartment = (
  client: AxiosInstance,
  data: CreateDepartmentData,
) =>
  client
    .post<ApiResponse<Department>>('/departments', data)
    .then((r) => r.data);

export const getDepartment = (client: AxiosInstance, id: string) =>
  client
    .get<ApiResponse<Department>>(`/departments/${id}`)
    .then((r) => r.data);

export const updateDepartment = (
  client: AxiosInstance,
  id: string,
  data: UpdateDepartmentData,
) =>
  client
    .patch<ApiResponse<Department>>(`/departments/${id}`, data)
    .then((r) => r.data);

export const archiveDepartment = (client: AxiosInstance, id: string) =>
  client
    .post<ApiResponse<Department>>(`/departments/${id}/archive`)
    .then((r) => r.data);
