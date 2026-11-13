/**
 * User account status within the platform.
 */
export declare enum UserStatus {
    PENDING_VERIFICATION = "PENDING_VERIFICATION",
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED",
    DEACTIVATED = "DEACTIVATED"
}
/**
 * Tenant (institution/organisation) lifecycle status.
 */
export declare enum TenantStatus {
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED",
    TRIAL = "TRIAL",
    EXPIRED = "EXPIRED",
    ARCHIVED = "ARCHIVED"
}
/**
 * Employee record lifecycle status.
 */
export declare enum EmployeeStatus {
    ACTIVE = "ACTIVE",
    ON_LEAVE = "ON_LEAVE",
    SUSPENDED = "SUSPENDED",
    TERMINATED = "TERMINATED",
    ARCHIVED = "ARCHIVED"
}
/**
 * Subscription billing lifecycle.
 */
export declare enum SubscriptionStatus {
    ACTIVE = "ACTIVE",
    PAST_DUE = "PAST_DUE",
    CANCELLED = "CANCELLED",
    EXPIRED = "EXPIRED",
    TRIALING = "TRIALING"
}
/**
 * State of a user invitation.
 */
export declare enum InvitationStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    EXPIRED = "EXPIRED",
    REVOKED = "REVOKED"
}
/**
 * RBAC permission scope — system-wide vs tenant-scoped.
 */
export declare enum PermissionScope {
    SYSTEM = "SYSTEM",
    TENANT = "TENANT"
}
/**
 * Audit event outcome.
 */
export declare enum AuditOutcome {
    SUCCESS = "SUCCESS",
    FAILURE = "FAILURE",
    PARTIAL = "PARTIAL"
}
/**
 * Department lifecycle status.
 */
export declare enum DepartmentStatus {
    ACTIVE = "ACTIVE",
    ARCHIVED = "ARCHIVED"
}
/**
 * Team lifecycle status.
 */
export declare enum TeamStatus {
    ACTIVE = "ACTIVE",
    ARCHIVED = "ARCHIVED"
}
/**
 * RBAC role scope — system roles vs tenant-specific roles.
 */
export declare enum RoleScope {
    SYSTEM = "SYSTEM",
    TENANT = "TENANT"
}
/**
 * Type of user invitation.
 */
export declare enum InvitationType {
    STAFF = "STAFF",
    ADMIN = "ADMIN",
    EMPLOYEE = "EMPLOYEE"
}
//# sourceMappingURL=enums.d.ts.map