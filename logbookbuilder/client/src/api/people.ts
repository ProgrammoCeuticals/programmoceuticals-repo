import api from './client'
import type { User, Personnel, PaginatedResult } from '../types'

export const usersApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<{ data: PaginatedResult<User> }>('/users', { params }).then((r) => r.data.data),

  get: (id: string) =>
    api.get<{ data: User }>(`/users/${id}`).then((r) => r.data.data),

  create: (body: { name: string; email: string; password: string }) =>
    api.post<{ data: User }>('/users', body).then((r) => r.data.data),

  update: (id: string, body: { name?: string; status?: string }) =>
    api.patch<{ data: User }>(`/users/${id}`, body).then((r) => r.data.data),

  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    api.post('/users/me/change-password', body),
}

export const personnelApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<{ data: PaginatedResult<Personnel> }>('/personnel', { params }).then((r) => r.data.data),

  get: (id: string) =>
    api.get<{ data: Personnel }>(`/personnel/${id}`).then((r) => r.data.data),

  create: (body: unknown) =>
    api.post<{ data: Personnel }>('/personnel', body).then((r) => r.data.data),

  update: (id: string, body: unknown) =>
    api.patch<{ data: Personnel }>(`/personnel/${id}`, body).then((r) => r.data.data),
}
