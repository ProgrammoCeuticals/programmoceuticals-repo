import api from './client'
import type { LogRelationship } from '../types'

export const relationshipsApi = {
  list: () =>
    api.get<{ data: LogRelationship[] }>('/relationships').then((r) => r.data.data),

  get: (id: string) =>
    api.get<{ data: LogRelationship }>(`/relationships/${id}`).then((r) => r.data.data),

  create: (body: unknown) =>
    api.post<{ data: LogRelationship }>('/relationships', body).then((r) => r.data.data),

  update: (id: string, body: unknown) =>
    api.patch<{ data: LogRelationship }>(`/relationships/${id}`, body).then((r) => r.data.data),

  delete: (id: string) =>
    api.delete(`/relationships/${id}`),
}
