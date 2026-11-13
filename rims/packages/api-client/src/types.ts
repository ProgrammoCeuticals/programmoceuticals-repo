export type { PaginatedResult, ApiResponse, ApiPaginatedResponse } from '@rims/shared-types';
export {
  UserStatus,
  TenantStatus,
  EmployeeStatus,
  InvitationStatus,
  InvitationType,
  AuditOutcome,
  DepartmentStatus,
  TeamStatus,
  RoleScope,
  PermissionScope,
} from '@rims/shared-types';

// Alias for api-client consumers
export type PaginatedResponse<T> = import('@rims/shared-types').PaginatedResult<T>;

export interface User {
  id: string;
  email: string;
  name: string | null;
  status: import('@rims/shared-types').UserStatus;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  scope: import('@rims/shared-types').RoleScope;
  tenantId: string | null;
  permissions?: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  code: string;
  name: string;
  description: string | null;
  scope: import('@rims/shared-types').PermissionScope;
  resource: string;
  action: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string | null;
  status: import('@rims/shared-types').DepartmentStatus;
  tenantId: string;
  parentId: string | null;
  headId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  description: string | null;
  status: import('@rims/shared-types').TeamStatus;
  tenantId: string;
  departmentId: string | null;
  leadId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  employeeNumber: string;
  title: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  status: import('@rims/shared-types').EmployeeStatus;
  tenantId: string;
  departmentId: string | null;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Institution {
  id: string;
  name: string;
  legalName: string | null;
  registrationNumber: string | null;
  taxId: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditEvent {
  id: string;
  tenantId: string;
  actorId: string | null;
  action: string;
  resourceType: string;
  resourceId: string | null;
  outcome: import('@rims/shared-types').AuditOutcome;
  beforeState: unknown;
  afterState: unknown;
  ipAddress: string | null;
  userAgent: string | null;
  requestId: string | null;
  createdAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: import('@rims/shared-types').TenantStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Invitation {
  id: string;
  email: string;
  status: import('@rims/shared-types').InvitationStatus;
  type: import('@rims/shared-types').InvitationType;
  tenantId: string;
  invitedById: string;
  roleId: string | null;
  departmentId: string | null;
  expiresAt: string;
  createdAt: string;
}
