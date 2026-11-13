import type { AxiosInstance } from 'axios';
import type { ApiResponse } from '../types';
import type { Tenant } from '../types';

export const getCurrentTenant = (client: AxiosInstance) =>
  client
    .get<ApiResponse<Tenant>>('/tenants/current')
    .then((r) => r.data);
