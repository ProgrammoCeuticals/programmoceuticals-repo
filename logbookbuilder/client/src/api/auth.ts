import api from './client'
import type { AuthTokens } from '../types'

export const authApi = {
  register: (body: { organizationName: string; name: string; email: string; password: string }) =>
    api.post<{ data: AuthTokens }>('/auth/register', body).then((r) => r.data.data),

  login: (body: { email: string; password: string }) =>
    api.post<{ data: AuthTokens }>('/auth/login', body).then((r) => r.data.data),

  refresh: (refreshToken: string) =>
    api.post<{ data: { accessToken: string; refreshToken: string } }>('/auth/refresh', { refreshToken }).then((r) => r.data.data),

  logout: () => api.post('/auth/logout'),

  me: () => api.get<{ data: AuthTokens['user'] }>('/auth/me').then((r) => r.data.data),
}
