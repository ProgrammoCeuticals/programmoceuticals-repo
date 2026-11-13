import api from './client'
import type { LogDefinition, LogColumn, PaginatedResult } from '../types'

export const logsApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<{ data: PaginatedResult<LogDefinition> }>('/logs', { params }).then((r) => r.data.data),

  get: (id: string) =>
    api.get<{ data: LogDefinition }>(`/logs/${id}`).then((r) => r.data.data),

  create: (body: unknown) =>
    api.post<{ data: LogDefinition }>('/logs', body).then((r) => r.data.data),

  update: (id: string, body: unknown) =>
    api.patch<{ data: LogDefinition }>(`/logs/${id}`, body).then((r) => r.data.data),

  addColumn: (logId: string, body: unknown) =>
    api.post<{ data: LogColumn }>(`/logs/${logId}/columns`, body).then((r) => r.data.data),

  updateColumn: (logId: string, columnId: string, body: unknown) =>
    api.patch<{ data: LogColumn }>(`/logs/${logId}/columns/${columnId}`, body).then((r) => r.data.data),

  removeColumn: (logId: string, columnId: string) =>
    api.delete(`/logs/${logId}/columns/${columnId}`),

  reorderColumns: (logId: string, order: Array<{ id: string; displayOrder: number }>) =>
    api.put(`/logs/${logId}/columns/reorder`, { order }),
}
