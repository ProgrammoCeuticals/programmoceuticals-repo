/**
 * Explicit permission codes.
 * Source: ECTD_BACKEND_IMPLEMENTATION.md §§ 6A.2, 40, 41
 *
 * These are application-level codes — not regulatory vocabulary.
 * Authorization checks must always be performed server-side.
 */
export const PERMISSIONS = {
  // Applications
  APPLICATION_VIEW: "APPLICATION_VIEW",
  APPLICATION_EDIT: "APPLICATION_EDIT",

  // Documents
  DOCUMENT_VIEW: "DOCUMENT_VIEW",
  DOCUMENT_UPLOAD: "DOCUMENT_UPLOAD",
  DOCUMENT_EDIT: "DOCUMENT_EDIT",

  // Submissions
  SUBMISSION_VIEW: "SUBMISSION_VIEW",
  SUBMISSION_EDIT: "SUBMISSION_EDIT",

  // Regulatory lifecycle / publishing
  LIFECYCLE_MANAGE: "LIFECYCLE_MANAGE",
  VALIDATION_RUN: "VALIDATION_RUN",
  XML_GENERATE: "XML_GENERATE",
  PUBLISH: "PUBLISH",

  // Audit
  AUDIT_VIEW: "AUDIT_VIEW",

  // Administration
  REGULATORY_ADMIN: "REGULATORY_ADMIN",
  ORGANIZATION_ADMIN: "ORGANIZATION_ADMIN",
  USER_ADMIN: "USER_ADMIN",
  ROLE_ADMIN: "ROLE_ADMIN",
  SYSTEM_CONFIG_ADMIN: "SYSTEM_CONFIG_ADMIN",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
