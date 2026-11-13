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
 * JWT payload shape for access and refresh tokens.
 * sub — user UUID
 * email — user email
 * tenantId — currently active tenant UUID
 * permissions — array of permission codes granted to this user
 * iat / exp — standard JWT claims (added by JWT library)
 */
export interface JwtPayload {
    sub: string;
    email: string;
    tenantId: string;
    permissions: string[];
    iat?: number;
    exp?: number;
}
//# sourceMappingURL=types.d.ts.map