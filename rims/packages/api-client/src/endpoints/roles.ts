import type { AxiosInstance } from 'axios';
import type { ApiResponse } from '../types';
import type { Role, Permission } from '../types';

export interface CreateRoleData {
  name: string;
  description?: string;
  scope?: string;
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
}

export const getRoles = (client: AxiosInstance) =>
  client.get<ApiResponse<Role[]>>('/roles').then((r) => r.data);

export const createRole = (client: AxiosInstance, data: CreateRoleData) =>
  client.post<ApiResponse<Role>>('/roles', data).then((r) => r.data);

export const updateRole = (
  client: AxiosInstance,
  id: string,
  data: UpdateRoleData,
) =>
  client.patch<ApiResponse<Role>>(`/roles/${id}`, data).then((r) => r.data);

export const getPermissions = (client: AxiosInstance) =>
  client
    .get<ApiResponse<Permission[]>>('/permissions')
    .then((r) => r.data);

export const setRolePermissions = (
  client: AxiosInstance,
  roleId: string,
  permissionCodes: string[],
) =>
  client
    .post<ApiResponse<Role>>(`/roles/${roleId}/permissions`, {
      permissionCodes,
    })
    .then((r) => r.data);

export const assignRole = (
  client: AxiosInstance,
  userId: string,
  roleId: string,
) =>
  client
    .post<ApiResponse<{ message: string }>>(`/users/${userId}/roles`, {
      roleId,
    })
    .then((r) => r.data);
