/**
 * Standard paginated result container.
 */
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    requestId: string;
  };
}

/**
 * Standard API success response envelope.
 */
export interface ApiResponse<T> {
  data: T;
  meta: {
    requestId: string;
  };
}

/**
 * Standard API error shape returned to clients.
 * Stack traces are never included.
 */
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
    requestId: string;
  };
}

/**
 * Paginated API response — combines ApiResponse envelope with PaginatedResult.
 */
export interface ApiPaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    requestId: string;
  };
}

/**
 * Scope assignment embedded in the JWT — describes which scope a role is
 * valid for (institution-wide vs a specific department / team / project).
 */
export interface ScopeAssignment {
  roleId: string;
  roleName: string;
  scopeType: "INSTITUTION" | "DEPARTMENT" | "TEAM" | "PROJECT";
  scopeId: string | null;
}

/**
 * JWT payload shape for access and refresh tokens.
 * sub — user UUID
 * email — user email
 * tenantId — currently active tenant UUID
 * permissions — array of permission codes granted to this user
 * scopes — per-role scope assignments
 * iat / exp — standard JWT claims (added by JWT library)
 */
export interface JwtPayload {
  sub: string;
  email: string;
  tenantId: string;
  permissions: string[];
  scopes: ScopeAssignment[];
  iat?: number;
  exp?: number;
}
