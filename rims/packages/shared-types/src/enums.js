"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationType = exports.RoleScope = exports.TeamStatus = exports.DepartmentStatus = exports.AuditOutcome = exports.PermissionScope = exports.InvitationStatus = exports.SubscriptionStatus = exports.EmployeeStatus = exports.TenantStatus = exports.UserStatus = void 0;
/**
 * User account status within the platform.
 */
var UserStatus;
(function (UserStatus) {
    UserStatus["PENDING_VERIFICATION"] = "PENDING_VERIFICATION";
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["SUSPENDED"] = "SUSPENDED";
    UserStatus["DEACTIVATED"] = "DEACTIVATED";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
/**
 * Tenant (institution/organisation) lifecycle status.
 */
var TenantStatus;
(function (TenantStatus) {
    TenantStatus["ACTIVE"] = "ACTIVE";
    TenantStatus["SUSPENDED"] = "SUSPENDED";
    TenantStatus["TRIAL"] = "TRIAL";
    TenantStatus["EXPIRED"] = "EXPIRED";
    TenantStatus["ARCHIVED"] = "ARCHIVED";
})(TenantStatus || (exports.TenantStatus = TenantStatus = {}));
/**
 * Employee record lifecycle status.
 */
var EmployeeStatus;
(function (EmployeeStatus) {
    EmployeeStatus["ACTIVE"] = "ACTIVE";
    EmployeeStatus["ON_LEAVE"] = "ON_LEAVE";
    EmployeeStatus["SUSPENDED"] = "SUSPENDED";
    EmployeeStatus["TERMINATED"] = "TERMINATED";
    EmployeeStatus["ARCHIVED"] = "ARCHIVED";
})(EmployeeStatus || (exports.EmployeeStatus = EmployeeStatus = {}));
/**
 * Subscription billing lifecycle.
 */
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "ACTIVE";
    SubscriptionStatus["PAST_DUE"] = "PAST_DUE";
    SubscriptionStatus["CANCELLED"] = "CANCELLED";
    SubscriptionStatus["EXPIRED"] = "EXPIRED";
    SubscriptionStatus["TRIALING"] = "TRIALING";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
/**
 * State of a user invitation.
 */
var InvitationStatus;
(function (InvitationStatus) {
    InvitationStatus["PENDING"] = "PENDING";
    InvitationStatus["ACCEPTED"] = "ACCEPTED";
    InvitationStatus["EXPIRED"] = "EXPIRED";
    InvitationStatus["REVOKED"] = "REVOKED";
})(InvitationStatus || (exports.InvitationStatus = InvitationStatus = {}));
/**
 * RBAC permission scope — system-wide vs tenant-scoped.
 */
var PermissionScope;
(function (PermissionScope) {
    PermissionScope["SYSTEM"] = "SYSTEM";
    PermissionScope["TENANT"] = "TENANT";
})(PermissionScope || (exports.PermissionScope = PermissionScope = {}));
/**
 * Audit event outcome.
 */
var AuditOutcome;
(function (AuditOutcome) {
    AuditOutcome["SUCCESS"] = "SUCCESS";
    AuditOutcome["FAILURE"] = "FAILURE";
    AuditOutcome["PARTIAL"] = "PARTIAL";
})(AuditOutcome || (exports.AuditOutcome = AuditOutcome = {}));
/**
 * Department lifecycle status.
 */
var DepartmentStatus;
(function (DepartmentStatus) {
    DepartmentStatus["ACTIVE"] = "ACTIVE";
    DepartmentStatus["ARCHIVED"] = "ARCHIVED";
})(DepartmentStatus || (exports.DepartmentStatus = DepartmentStatus = {}));
/**
 * Team lifecycle status.
 */
var TeamStatus;
(function (TeamStatus) {
    TeamStatus["ACTIVE"] = "ACTIVE";
    TeamStatus["ARCHIVED"] = "ARCHIVED";
})(TeamStatus || (exports.TeamStatus = TeamStatus = {}));
/**
 * RBAC role scope — system roles vs tenant-specific roles.
 */
var RoleScope;
(function (RoleScope) {
    RoleScope["SYSTEM"] = "SYSTEM";
    RoleScope["TENANT"] = "TENANT";
})(RoleScope || (exports.RoleScope = RoleScope = {}));
/**
 * Type of user invitation.
 */
var InvitationType;
(function (InvitationType) {
    InvitationType["STAFF"] = "STAFF";
    InvitationType["ADMIN"] = "ADMIN";
    InvitationType["EMPLOYEE"] = "EMPLOYEE";
})(InvitationType || (exports.InvitationType = InvitationType = {}));
//# sourceMappingURL=enums.js.map