import type { AxiosInstance } from 'axios';
import type { ApiResponse, PaginatedResult } from '../types';

export interface PerformanceCycle {
  id: string;
  name: string;
  description: string | null;
  status: string;
  startDate: string;
  endDate: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface KpiDefinition {
  id: string;
  name: string;
  description: string | null;
  unit: string | null;
  targetType: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface KpiAssignment {
  id: string;
  kpiDefinitionId: string;
  employeeId: string;
  cycleId: string;
  target: number | null;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface KpiResult {
  id: string;
  assignmentId: string;
  actual: number | null;
  status: string;
  comment: string | null;
  reviewedById: string | null;
  approvedById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceScore {
  employeeId: string;
  cycleId: string;
  score: number | null;
  grade: string | null;
}

export interface GetPerformanceCyclesParams {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
}

export interface CreatePerformanceCycleData {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
}

export interface UpdatePerformanceCycleData {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface GetKpiDefinitionsParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface CreateKpiDefinitionData {
  name: string;
  description?: string;
  unit?: string;
  targetType: string;
}

export interface UpdateKpiDefinitionData {
  name?: string;
  description?: string;
  unit?: string;
  targetType?: string;
}

export interface CreateKpiAssignmentData {
  kpiDefinitionId: string;
  employeeId: string;
  cycleId: string;
  target?: number;
}

export interface GetKpiAssignmentsParams {
  page?: number;
  pageSize?: number;
  cycleId?: string;
  employeeId?: string;
}

export interface SubmitKpiResultData {
  actual: number;
  comment?: string;
}

export interface ReviewKpiResultData {
  comment?: string;
  status?: string;
}

export interface ApproveKpiResultData {
  comment?: string;
}

export interface ReturnKpiResultData {
  comment: string;
}

export interface GetPerformanceScoreParams {
  employeeId: string;
  cycleId: string;
}

export const getPerformanceCycles = (
  client: AxiosInstance,
  params?: GetPerformanceCyclesParams,
) =>
  client
    .get<PaginatedResult<PerformanceCycle>>('/performance/cycles', { params })
    .then((r) => r.data);

export const createPerformanceCycle = (
  client: AxiosInstance,
  data: CreatePerformanceCycleData,
) =>
  client
    .post<ApiResponse<PerformanceCycle>>('/performance/cycles', data)
    .then((r) => r.data);

export const getPerformanceCycle = (client: AxiosInstance, id: string) =>
  client
    .get<ApiResponse<PerformanceCycle>>(`/performance/cycles/${id}`)
    .then((r) => r.data);

export const updatePerformanceCycle = (
  client: AxiosInstance,
  id: string,
  data: UpdatePerformanceCycleData,
) =>
  client
    .patch<ApiResponse<PerformanceCycle>>(`/performance/cycles/${id}`, data)
    .then((r) => r.data);

export const activatePerformanceCycle = (client: AxiosInstance, id: string) =>
  client
    .post<ApiResponse<PerformanceCycle>>(`/performance/cycles/${id}/activate`)
    .then((r) => r.data);

export const closePerformanceCycle = (client: AxiosInstance, id: string) =>
  client
    .post<ApiResponse<PerformanceCycle>>(`/performance/cycles/${id}/close`)
    .then((r) => r.data);

export const lockPerformanceCycle = (client: AxiosInstance, id: string) =>
  client
    .post<ApiResponse<PerformanceCycle>>(`/performance/cycles/${id}/lock`)
    .then((r) => r.data);

export const getKpiDefinitions = (
  client: AxiosInstance,
  params?: GetKpiDefinitionsParams,
) =>
  client
    .get<PaginatedResult<KpiDefinition>>('/performance/kpis', { params })
    .then((r) => r.data);

export const createKpiDefinition = (
  client: AxiosInstance,
  data: CreateKpiDefinitionData,
) =>
  client
    .post<ApiResponse<KpiDefinition>>('/performance/kpis', data)
    .then((r) => r.data);

export const updateKpiDefinition = (
  client: AxiosInstance,
  id: string,
  data: UpdateKpiDefinitionData,
) =>
  client
    .patch<ApiResponse<KpiDefinition>>(`/performance/kpis/${id}`, data)
    .then((r) => r.data);

export const createKpiAssignment = (
  client: AxiosInstance,
  data: CreateKpiAssignmentData,
) =>
  client
    .post<ApiResponse<KpiAssignment>>('/performance/assignments', data)
    .then((r) => r.data);

export const getKpiAssignments = (
  client: AxiosInstance,
  params?: GetKpiAssignmentsParams,
) =>
  client
    .get<PaginatedResult<KpiAssignment>>('/performance/assignments', { params })
    .then((r) => r.data);

export const getKpiResult = (client: AxiosInstance, assignmentId: string) =>
  client
    .get<ApiResponse<KpiResult>>(`/performance/results/${assignmentId}`)
    .then((r) => r.data);

export const submitKpiResult = (
  client: AxiosInstance,
  assignmentId: string,
  data: SubmitKpiResultData,
) =>
  client
    .post<ApiResponse<KpiResult>>(
      `/performance/results/${assignmentId}/submit`,
      data,
    )
    .then((r) => r.data);

export const reviewKpiResult = (
  client: AxiosInstance,
  id: string,
  data: ReviewKpiResultData,
) =>
  client
    .post<ApiResponse<KpiResult>>(`/performance/results/${id}/review`, data)
    .then((r) => r.data);

export const approveKpiResult = (
  client: AxiosInstance,
  id: string,
  data: ApproveKpiResultData,
) =>
  client
    .post<ApiResponse<KpiResult>>(`/performance/results/${id}/approve`, data)
    .then((r) => r.data);

export const returnKpiResult = (
  client: AxiosInstance,
  id: string,
  data: ReturnKpiResultData,
) =>
  client
    .post<ApiResponse<KpiResult>>(`/performance/results/${id}/return`, data)
    .then((r) => r.data);

export const getPerformanceScore = (
  client: AxiosInstance,
  params: GetPerformanceScoreParams,
) =>
  client
    .get<ApiResponse<PerformanceScore>>('/performance/score', { params })
    .then((r) => r.data);
