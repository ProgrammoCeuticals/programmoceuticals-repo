import type { AxiosInstance } from 'axios';
import type { PaginatedResult } from '../types';
import type { AuditEvent } from '../types';

export interface GetAuditEventsParams {
  page?: number;
  pageSize?: number;
  resourceType?: string;
  actorId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const getAuditEvents = (
  client: AxiosInstance,
  params?: GetAuditEventsParams,
) =>
  client
    .get<PaginatedResult<AuditEvent>>('/audit-events', { params })
    .then((r) => r.data);
