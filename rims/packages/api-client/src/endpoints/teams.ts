import type { AxiosInstance } from 'axios';
import type { ApiResponse, PaginatedResult } from '../types';
import type { Team } from '../types';

export interface GetTeamsParams {
  departmentId?: string;
}

export interface CreateTeamData {
  name: string;
  description?: string;
  departmentId?: string;
  leadId?: string;
}

export interface UpdateTeamData {
  name?: string;
  description?: string;
  departmentId?: string;
  leadId?: string;
}

export const getTeams = (client: AxiosInstance, params?: GetTeamsParams) =>
  client
    .get<ApiResponse<Team[]>>('/teams', { params })
    .then((r) => r.data);

export const createTeam = (client: AxiosInstance, data: CreateTeamData) =>
  client.post<ApiResponse<Team>>('/teams', data).then((r) => r.data);

export const updateTeam = (
  client: AxiosInstance,
  id: string,
  data: UpdateTeamData,
) =>
  client
    .patch<ApiResponse<Team>>(`/teams/${id}`, data)
    .then((r) => r.data);

export const addTeamMember = (
  client: AxiosInstance,
  teamId: string,
  employeeId: string,
) =>
  client
    .post<ApiResponse<{ message: string }>>(`/teams/${teamId}/members`, {
      employeeId,
    })
    .then((r) => r.data);

export const removeTeamMember = (
  client: AxiosInstance,
  teamId: string,
  employeeId: string,
) =>
  client
    .delete<ApiResponse<{ message: string }>>(
      `/teams/${teamId}/members/${employeeId}`,
    )
    .then((r) => r.data);
