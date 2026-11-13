import api from './client'
import type { AuditEvent, PaginatedResult } from '../types'

export const auditApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<{ data: PaginatedResult<AuditEvent> }>('/audit', { params }).then((r) => r.data.data),

  get: (id: string) =>
    api.get<{ data: AuditEvent }>(`/audit/${id}`).then((r) => r.data.data),
}
