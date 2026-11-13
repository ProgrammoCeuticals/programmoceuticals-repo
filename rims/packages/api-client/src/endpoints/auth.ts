import type { AxiosInstance } from 'axios';
import type { ApiResponse } from '../types';
import type { User } from '../types';

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export const login = (
  client: AxiosInstance,
  email: string,
  password: string,
) =>
  client
    .post<ApiResponse<LoginResponse>>('/auth/login', { email, password })
    .then((r) => r.data);

export const logout = (client: AxiosInstance) =>
  client.post<void>('/auth/logout').then((r) => r.data);

export const refresh = (client: AxiosInstance) =>
  client
    .post<ApiResponse<{ accessToken: string }>>('/auth/refresh')
    .then((r) => r.data);

export const forgotPassword = (client: AxiosInstance, email: string) =>
  client
    .post<ApiResponse<{ message: string }>>('/auth/forgot-password', { email })
    .then((r) => r.data);

export const resetPassword = (
  client: AxiosInstance,
  token: string,
  newPassword: string,
) =>
  client
    .post<ApiResponse<{ message: string }>>('/auth/reset-password', {
      token,
      newPassword,
    })
    .then((r) => r.data);

export const acceptInvitation = (
  client: AxiosInstance,
  token: string,
  name: string,
  password: string,
) =>
  client
    .post<ApiResponse<LoginResponse>>('/auth/accept-invitation', {
      token,
      name,
      password,
    })
    .then((r) => r.data);
