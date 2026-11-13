/**
 * System role names.
 * Source: ECTD_BACKEND_IMPLEMENTATION.md §§ 6A.3, 41
 *
 * SUPER_ADMIN is system-scoped and must NOT be treated as an organisation role.
 * Authorization must rely on permissions, not role names alone.
 */
export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ORGANIZATION_ADMIN: "ORGANIZATION_ADMIN",
  REGULATORY_MANAGER: "REGULATORY_MANAGER",
  AUTHOR: "AUTHOR",
  REVIEWER: "REVIEWER",
  VIEWER: "VIEWER",
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_SCOPES = {
  SYSTEM: "SYSTEM",
  ORGANIZATION: "ORGANIZATION",
} as const;

export type RoleScope = (typeof ROLE_SCOPES)[keyof typeof ROLE_SCOPES];
