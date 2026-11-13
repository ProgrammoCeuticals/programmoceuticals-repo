import api from './client'
import type { Division } from '../types'

export const divisionsApi = {
  list: () =>
    api.get<{ data: Division[] }>('/divisions').then((r) => r.data.data),

  create: (body: { name: string }) =>
    api.post<{ data: Division }>('/divisions', body).then((r) => r.data.data),

  update: (id: string, body: { name?: string; isActive?: boolean }) =>
    api.patch<{ data: Division }>(`/divisions/${id}`, body).then((r) => r.data.data),

  delete: (id: string) =>
    api.delete(`/divisions/${id}`),

  assignUser: (userId: string, divisionId: string | null) =>
    api.post('/divisions/assign', { userId, divisionId }).then((r) => r.data),
}
