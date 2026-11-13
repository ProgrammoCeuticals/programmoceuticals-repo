import type { AxiosInstance } from 'axios';
import type { ApiResponse, PaginatedResult } from '../types';
import type { User } from '../types';

export interface GetUsersParams {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
  departmentId?: string;
}

export interface InviteUserData {
  email: string;
  roleId?: string;
  departmentId?: string;
}

export interface UpdateUserData {
  name?: string;
  status?: string;
  [key: string]: unknown;
}

export const getMe = (client: AxiosInstance) =>
  client.get<ApiResponse<User>>('/me').then((r) => r.data);

export const getUsers = (client: AxiosInstance, params?: GetUsersParams) =>
  client
    .get<PaginatedResult<User>>('/users', { params })
    .then((r) => r.data);

export const inviteUser = (client: AxiosInstance, data: InviteUserData) =>
  client
    .post<ApiResponse<{ message: string }>>('/users/invitations', data)
    .then((r) => r.data);

export const updateUser = (
  client: AxiosInstance,
  id: string,
  data: UpdateUserData,
) =>
  client
    .patch<ApiResponse<User>>(`/users/${id}`, data)
    .then((r) => r.data);
