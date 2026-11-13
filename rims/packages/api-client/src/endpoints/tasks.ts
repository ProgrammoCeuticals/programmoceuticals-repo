import type { AxiosInstance } from 'axios';
import type { ApiResponse, PaginatedResult } from '../types';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string | null;
  dueDate: string | null;
  assigneeId: string | null;
  tenantId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetTasksParams {
  page?: number;
  pageSize?: number;
  status?: string;
  assigneeId?: string;
  priority?: string;
  search?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  assigneeId?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  assigneeId?: string;
}

export interface AddTaskCommentData {
  content: string;
}

export const getTasks = (
  client: AxiosInstance,
  params?: GetTasksParams,
) =>
  client
    .get<PaginatedResult<Task>>('/tasks', { params })
    .then((r) => r.data);

export const createTask = (
  client: AxiosInstance,
  data: CreateTaskData,
) =>
  client
    .post<ApiResponse<Task>>('/tasks', data)
    .then((r) => r.data);

export const getTask = (client: AxiosInstance, id: string) =>
  client
    .get<ApiResponse<Task>>(`/tasks/${id}`)
    .then((r) => r.data);

export const updateTask = (
  client: AxiosInstance,
  id: string,
  data: UpdateTaskData,
) =>
  client
    .patch<ApiResponse<Task>>(`/tasks/${id}`, data)
    .then((r) => r.data);

export const addTaskComment = (
  client: AxiosInstance,
  taskId: string,
  data: AddTaskCommentData,
) =>
  client
    .post<ApiResponse<TaskComment>>(`/tasks/${taskId}/comments`, data)
    .then((r) => r.data);
