/**
 * Application-controlled status enums.
 * Source: ECTD_BACKEND_IMPLEMENTATION.md §§ 3, 31
 *
 * IMPORTANT: These are application statuses — not regulatory XML status codes.
 * XML representation must be derived from the applicable eCTD specification,
 * never from these strings directly.
 */

export const REGULATORY_PACKAGE_STATUS = {
  IMPORTING: "IMPORTING",
  ACTIVE: "ACTIVE",
  SUPERSEDED: "SUPERSEDED",
  RETIRED: "RETIRED",
  FAILED: "FAILED",
} as const;

export const SUBMISSION_UNIT_STATUS = {
  DRAFT: "DRAFT",
  FROZEN: "FROZEN",
  VALIDATING: "VALIDATING",
  VALIDATED: "VALIDATED",
  PUBLISHING: "PUBLISHING",
  PUBLISHED: "PUBLISHED",
  FAILED: "FAILED",
} as const;

export const CONTEXT_OF_USE_STATUS = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  OBSOLETE: "OBSOLETE",
} as const;

export const SUBMISSION_PACKAGE_STATUS = {
  STAGING: "STAGING",
  BUILDING: "BUILDING",
  VALIDATING: "VALIDATING",
  READY: "READY",
  FINALIZED: "FINALIZED",
  FAILED: "FAILED",
  INVALIDATED: "INVALIDATED",
} as const;

export const JOB_STATUS = {
  QUEUED: "QUEUED",
  RUNNING: "RUNNING",
  SUCCEEDED: "SUCCEEDED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
} as const;

export const DOCUMENT_LINK_STATUS = {
  UNVALIDATED: "UNVALIDATED",
  VALID: "VALID",
  BROKEN: "BROKEN",
} as const;

export type RegulatoryPackageStatus =
  (typeof REGULATORY_PACKAGE_STATUS)[keyof typeof REGULATORY_PACKAGE_STATUS];
export type SubmissionUnitStatus =
  (typeof SUBMISSION_UNIT_STATUS)[keyof typeof SUBMISSION_UNIT_STATUS];
export type ContextOfUseStatus =
  (typeof CONTEXT_OF_USE_STATUS)[keyof typeof CONTEXT_OF_USE_STATUS];
export type SubmissionPackageStatus =
  (typeof SUBMISSION_PACKAGE_STATUS)[keyof typeof SUBMISSION_PACKAGE_STATUS];
export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];
