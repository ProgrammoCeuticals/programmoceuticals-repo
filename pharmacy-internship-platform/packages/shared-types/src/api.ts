// Generic API response shapes matching the API_CONTRACTS.md spec

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  statusCode: number;
  error: string;
  message: string;
  code: ApiErrorCode;
}

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORISED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'OFFER_EXPIRED'
  | 'NO_CAPACITY'
  | 'ALREADY_PLACED'
  | 'INVALID_TRANSITION'
  | 'DUPLICATE_REQUEST'
  | 'INTERNAL_ERROR';

export interface VacancyCounts {
  vacancyId: string;
  totalPositions: number;
  reservedPositions: number;
  confirmedPositions: number;
  availablePositions: number;
  updatedAt: string; // ISO8601
}

export interface JwtPayload {
  sub: string;       // userId
  email: string;
  role: string;      // UserRole
  iat?: number;
  exp?: number;
}
