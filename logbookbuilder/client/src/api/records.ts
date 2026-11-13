import api from './client'
import type { LogRecord, RecordVersion, PaginatedResult } from '../types'

export const recordsApi = {
  list: (logId: string, params?: Record<string, unknown>) =>
    api.get<{ data: PaginatedResult<LogRecord> }>(`/logs/${logId}/records`, { params }).then((r) => r.data.data),

  get: (logId: string, recordId: string) =>
    api.get<{ data: LogRecord }>(`/logs/${logId}/records/${recordId}`).then((r) => r.data.data),

  lineage: (logId: string, recordId: string) =>
    api.get<{ data: unknown }>(`/logs/${logId}/records/${recordId}/lineage`).then((r) => r.data.data),

  history: (logId: string, recordId: string) =>
    api.get<{ data: { record: LogRecord; versions: RecordVersion[] } }>(`/logs/${logId}/records/${recordId}/history`).then((r) => r.data.data),

  create: (logId: string, body: { data: Record<string, unknown>; links?: Record<string, string> }) =>
    api.post<{ data: LogRecord }>(`/logs/${logId}/records`, body).then((r) => r.data.data),

  update: (logId: string, recordId: string, body: { data: Record<string, unknown>; links?: Record<string, string> }) =>
    api.patch<{ data: LogRecord }>(`/logs/${logId}/records/${recordId}`, body).then((r) => r.data.data),

  correct: (logId: string, recordId: string, body: { data: Record<string, unknown>; links?: Record<string, string>; reason: string }) =>
    api.post<{ data: LogRecord }>(`/logs/${logId}/records/${recordId}/correct`, body).then((r) => r.data.data),

  void: (logId: string, recordId: string, body: { reason: string }) =>
    api.post<{ data: LogRecord }>(`/logs/${logId}/records/${recordId}/void`, body).then((r) => r.data.data),
}
