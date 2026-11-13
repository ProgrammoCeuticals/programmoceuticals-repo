/**
 * User account status within the platform.
 */
export enum UserStatus {
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DEACTIVATED = 'DEACTIVATED',
}

/**
 * Tenant (institution/organisation) lifecycle status.
 */
export enum TenantStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  TRIAL = 'TRIAL',
  EXPIRED = 'EXPIRED',
  ARCHIVED = 'ARCHIVED',
}

/**
 * Employee record lifecycle status.
 */
export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  SUSPENDED = 'SUSPENDED',
  TERMINATED = 'TERMINATED',
  ARCHIVED = 'ARCHIVED',
}

/**
 * Subscription billing lifecycle.
 */
export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  TRIALING = 'TRIALING',
}

/**
 * State of a user invitation.
 */
export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
}

/**
 * RBAC permission scope — system-wide vs tenant-scoped.
 */
export enum PermissionScope {
  SYSTEM = 'SYSTEM',
  TENANT = 'TENANT',
}

/**
 * Audit event outcome.
 */
export enum AuditOutcome {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  PARTIAL = 'PARTIAL',
}

/**
 * Department lifecycle status.
 */
export enum DepartmentStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

/**
 * Team lifecycle status.
 */
export enum TeamStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

/**
 * RBAC role scope — system roles vs tenant-specific roles.
 */
export enum RoleScope {
  SYSTEM = 'SYSTEM',
  TENANT = 'TENANT',
}

/**
 * Type of user invitation.
 */
export enum InvitationType {
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}
