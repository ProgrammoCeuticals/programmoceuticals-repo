import type { AxiosInstance } from 'axios';
import type { ApiResponse, PaginatedResult } from '../types';

export interface ResearchProject {
  id: string;
  title: string;
  description: string | null;
  status: string;
  startDate: string | null;
  endDate: string | null;
  tenantId: string;
  leadId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchProjectMember {
  id: string;
  projectId: string;
  employeeId: string;
  role: string | null;
  joinedAt: string;
}

export interface ResearchProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchProjectStatusUpdate {
  id: string;
  projectId: string;
  content: string;
  authorId: string;
  createdAt: string;
}

export interface GetResearchProjectsParams {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
}

export interface CreateResearchProjectData {
  title: string;
  description?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  leadId?: string;
}

export interface UpdateResearchProjectData {
  title?: string;
  description?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  leadId?: string;
}

export interface AddResearchProjectMemberData {
  employeeId: string;
  role?: string;
}

export interface AddResearchProjectMilestoneData {
  title: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateResearchProjectMilestoneData {
  title?: string;
  description?: string;
  dueDate?: string;
  completedAt?: string | null;
}

export interface AddResearchProjectStatusUpdateData {
  content: string;
}

export const getResearchProjects = (
  client: AxiosInstance,
  params?: GetResearchProjectsParams,
) =>
  client
    .get<PaginatedResult<ResearchProject>>('/research/projects', { params })
    .then((r) => r.data);

export const createResearchProject = (
  client: AxiosInstance,
  data: CreateResearchProjectData,
) =>
  client
    .post<ApiResponse<ResearchProject>>('/research/projects', data)
    .then((r) => r.data);

export const getResearchProject = (client: AxiosInstance, id: string) =>
  client
    .get<ApiResponse<ResearchProject>>(`/research/projects/${id}`)
    .then((r) => r.data);

export const updateResearchProject = (
  client: AxiosInstance,
  id: string,
  data: UpdateResearchProjectData,
) =>
  client
    .patch<ApiResponse<ResearchProject>>(`/research/projects/${id}`, data)
    .then((r) => r.data);

export const addResearchProjectMember = (
  client: AxiosInstance,
  projectId: string,
  data: AddResearchProjectMemberData,
) =>
  client
    .post<ApiResponse<ResearchProjectMember>>(
      `/research/projects/${projectId}/members`,
      data,
    )
    .then((r) => r.data);

export const removeResearchProjectMember = (
  client: AxiosInstance,
  projectId: string,
  employeeId: string,
) =>
  client
    .delete<ApiResponse<void>>(
      `/research/projects/${projectId}/members/${employeeId}`,
    )
    .then((r) => r.data);

export const addResearchProjectMilestone = (
  client: AxiosInstance,
  projectId: string,
  data: AddResearchProjectMilestoneData,
) =>
  client
    .post<ApiResponse<ResearchProjectMilestone>>(
      `/research/projects/${projectId}/milestones`,
      data,
    )
    .then((r) => r.data);

export const updateResearchProjectMilestone = (
  client: AxiosInstance,
  projectId: string,
  milestoneId: string,
  data: UpdateResearchProjectMilestoneData,
) =>
  client
    .patch<ApiResponse<ResearchProjectMilestone>>(
      `/research/projects/${projectId}/milestones/${milestoneId}`,
      data,
    )
    .then((r) => r.data);

export const addResearchProjectStatusUpdate = (
  client: AxiosInstance,
  projectId: string,
  data: AddResearchProjectStatusUpdateData,
) =>
  client
    .post<ApiResponse<ResearchProjectStatusUpdate>>(
      `/research/projects/${projectId}/status-updates`,
      data,
    )
    .then((r) => r.data);
