import { z } from 'zod';

/**
 * Standard query params for paginated list endpoints.
 * page — 1-indexed page number (default: 1)
 * pageSize — records per page (default: 20, max: 100)
 * search — optional free-text search string
 * sortBy — field to sort by
 * sortOrder — asc or desc (default: desc)
 */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(255).optional(),
  sortBy: z.string().max(100).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationQueryDto = z.infer<typeof paginationQuerySchema>;
