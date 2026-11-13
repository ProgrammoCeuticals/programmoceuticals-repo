import type { AxiosInstance } from 'axios';
import type { ApiResponse, PaginatedResult } from '../types';
import type { Employee } from '../types';

export interface GetEmployeesParams {
  page?: number;
  pageSize?: number;
  departmentId?: string;
  status?: string;
  search?: string;
}

export interface CreateEmployeeData {
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  title?: string;
  phone?: string;
  departmentId?: string;
  userId?: string;
}

export interface UpdateEmployeeData {
  firstName?: string;
  lastName?: string;
  email?: string;
  title?: string;
  phone?: string;
  status?: string;
  departmentId?: string;
}

export const getEmployees = (
  client: AxiosInstance,
  params?: GetEmployeesParams,
) =>
  client
    .get<PaginatedResult<Employee>>('/employees', { params })
    .then((r) => r.data);

export const createEmployee = (
  client: AxiosInstance,
  data: CreateEmployeeData,
) =>
  client
    .post<ApiResponse<Employee>>('/employees', data)
    .then((r) => r.data);

export const getEmployee = (client: AxiosInstance, id: string) =>
  client
    .get<ApiResponse<Employee>>(`/employees/${id}`)
    .then((r) => r.data);

export const updateEmployee = (
  client: AxiosInstance,
  id: string,
  data: UpdateEmployeeData,
) =>
  client
    .patch<ApiResponse<Employee>>(`/employees/${id}`, data)
    .then((r) => r.data);
