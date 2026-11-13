import type { AxiosInstance } from 'axios';
import type { ApiResponse } from '../types';
import type { Institution } from '../types';

export interface UpdateInstitutionData {
  name?: string;
  legalName?: string;
  registrationNumber?: string;
  taxId?: string;
  website?: string;
  phone?: string;
  email?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export const getInstitution = (client: AxiosInstance) =>
  client
    .get<ApiResponse<Institution>>('/institution')
    .then((r) => r.data);

export const updateInstitution = (
  client: AxiosInstance,
  data: UpdateInstitutionData,
) =>
  client
    .patch<ApiResponse<Institution>>('/institution', data)
    .then((r) => r.data);
