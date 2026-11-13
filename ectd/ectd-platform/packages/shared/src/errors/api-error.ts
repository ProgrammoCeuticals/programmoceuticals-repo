/**
 * Standard API error envelope — spec §35
 *
 * All API errors must use this contract:
 * {
 *   "error": {
 *     "code": "ECTD_LIFECYCLE_INVALID_TRANSITION",
 *     "message": "The Context of Use cannot be reactivated.",
 *     "category": "DOMAIN",
 *     "details": {},
 *     "correlationId": "..."
 *   }
 * }
 */

export type ErrorCategory =
  | "DOMAIN"
  | "VALIDATION"
  | "AUTH"
  | "NOT_FOUND"
  | "CONFLICT"
  | "REGULATORY"
  | "INTERNAL";

export interface ApiErrorBody {
  code: string;
  message: string;
  category: ErrorCategory;
  details?: Record<string, unknown>;
  correlationId?: string;
}

export interface ApiErrorResponse {
  error: ApiErrorBody;
}

/** Well-known application error codes */
export const ErrorCodes = {
  // Generic
  INTERNAL_ERROR: "INTERNAL_ERROR",
  VALIDATION_FAILED: "VALIDATION_FAILED",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",

  // Domain — lifecycle
  LIFECYCLE_INVALID_TRANSITION: "ECTD_LIFECYCLE_INVALID_TRANSITION",
  LIFECYCLE_ALREADY_SUSPENDED: "ECTD_LIFECYCLE_ALREADY_SUSPENDED",
  LIFECYCLE_CANNOT_REACTIVATE: "ECTD_LIFECYCLE_CANNOT_REACTIVATE",
  LIFECYCLE_REPLACEMENT_INVALID: "ECTD_LIFECYCLE_REPLACEMENT_INVALID",

  // Domain — documents
  DOCUMENT_VERSION_IMMUTABLE: "ECTD_DOCUMENT_VERSION_IMMUTABLE",
  DOCUMENT_CHECKSUM_MISMATCH: "ECTD_DOCUMENT_CHECKSUM_MISMATCH",
  DOCUMENT_MIME_REJECTED: "ECTD_DOCUMENT_MIME_REJECTED",

  // Domain — submission unit
  SUBMISSION_UNIT_IMMUTABLE: "ECTD_SUBMISSION_UNIT_IMMUTABLE",
  SUBMISSION_UNIT_PUBLISH_GATE_FAILED: "ECTD_PUBLISH_GATE_FAILED",

  // Regulatory
  REGULATORY_PACKAGE_NOT_FOUND: "ECTD_REGULATORY_PACKAGE_NOT_FOUND",
  REGULATORY_PACKAGE_IMPORT_FAILED: "ECTD_REGULATORY_PACKAGE_IMPORT_FAILED",
  REGULATORY_VOCABULARY_INVALID: "ECTD_REGULATORY_VOCABULARY_INVALID",
  REGULATORY_GAP: "ECTD_REGULATORY_GAP",

  // XML
  XML_GENERATION_FAILED: "ECTD_XML_GENERATION_FAILED",
  XML_SCHEMA_VALIDATION_FAILED: "ECTD_XML_SCHEMA_VALIDATION_FAILED",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
