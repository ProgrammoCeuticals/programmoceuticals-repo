/**
 * Standard pagination types.
 * Source: ECTD_BACKEND_IMPLEMENTATION.md § 37
 *
 * MVP query shape: ?page=1&pageSize=50
 * Sort/filter fields must be whitelisted — no arbitrary SQL fragments.
 */
export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
