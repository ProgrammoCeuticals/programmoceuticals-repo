import type { ColumnDataType, ColumnBehavior, LogStatus, RecordStatus } from './schema'

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  userId: string
  organizationId: string
  divisionId: string | null
  isAdmin: boolean
  email: string
  name: string
  organizationName?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

// ─── Organization ─────────────────────────────────────────────────────────────

export interface Organization {
  id: string
  name: string
  slug: string
  description: string | null
  logoUrl: string | null
  isActive: boolean
  settings: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

// ─── Division ─────────────────────────────────────────────────────────────────

export interface Division {
  id: string
  organizationId: string
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  users?: Pick<User, 'id' | 'name' | 'email' | 'status'>[] & { divisionId: string | null; isAdmin: boolean }[]
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  organizationId: string
  divisionId: string | null
  isAdmin: boolean
  name: string
  email: string
  status: 'active' | 'inactive' | 'suspended'
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

// ─── Personnel ────────────────────────────────────────────────────────────────

export interface Personnel {
  id: string
  organizationId: string
  name: string
  identifier: string | null
  role: string | null
  department: string | null
  email: string | null
  phone: string | null
  isActive: boolean
  linkedUserId: string | null
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

// ─── Log Column ───────────────────────────────────────────────────────────────

export interface LogColumn {
  id: string
  logDefinitionId: string
  organizationId: string
  name: string
  label: string
  description: string | null
  dataType: ColumnDataType
  behavior: ColumnBehavior
  isRequired: boolean
  isUnique: boolean
  displayOrder: number
  defaultValue: string | null
  typeConfig: Record<string, unknown>
  behaviorConfig: Record<string, unknown>
  validationRules: Record<string, unknown>
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

// ─── Log Definition ───────────────────────────────────────────────────────────

export interface LogDefinition {
  id: string
  organizationId: string
  name: string
  description: string | null
  status: LogStatus
  version: number
  icon: string | null
  color: string | null
  settings: Record<string, unknown>
  createdById: string
  updatedById: string | null
  createdAt: string
  updatedAt: string
  columns: LogColumn[]
}

// ─── Log Record ───────────────────────────────────────────────────────────────

export interface FieldValue {
  id: string
  recordId: string
  columnId: string
  value: string | null
  sourceLogId: string | null
  sourceRecordId: string | null
  sourceColumnId: string | null
  snapshotValue: string | null
  snapshotAt: string | null
  column?: LogColumn
  sourceRecord?: LogRecord
  sourceColumn?: LogColumn
}

export interface LogRecord {
  id: string
  logDefinitionId: string
  organizationId: string
  recordNumber: string
  status: RecordStatus
  data: Record<string, unknown>
  correctedFromId: string | null
  correctionReason: string | null
  correctedAt: string | null
  voidedAt: string | null
  voidReason: string | null
  createdById: string
  createdAt: string
  updatedAt: string
  fieldValues?: FieldValue[]
  createdBy?: User
}

// ─── Record Version ───────────────────────────────────────────────────────────

export interface RecordVersion {
  id: string
  recordId: string
  version: number
  data: Record<string, unknown>
  fieldValuesSnapshot: Record<string, unknown>
  changedById: string
  changeReason: string | null
  createdAt: string
  changedBy?: User
}

// ─── Relationship ─────────────────────────────────────────────────────────────

export interface FieldMapping {
  id: string
  relationshipId: string
  sourceColumnId: string
  targetColumnId: string
  sourceColumn?: LogColumn
  targetColumn?: LogColumn
}

export interface LogRelationship {
  id: string
  organizationId: string
  name: string
  description: string | null
  sourceLogId: string
  targetLogId: string
  referencingColumnId: string | null
  relationshipType: 'one_to_many' | 'many_to_one' | 'one_to_one'
  isActive: boolean
  createdAt: string
  updatedAt: string
  sourceLog?: LogDefinition
  targetLog?: LogDefinition
  fieldMappings?: FieldMapping[]
}

// ─── Audit ────────────────────────────────────────────────────────────────────

export interface AuditEvent {
  id: string
  organizationId: string
  userId: string | null
  eventType: string
  entityType: string
  entityId: string | null
  summary: string
  previousState: unknown
  newState: unknown
  metadata: Record<string, unknown>
  createdAt: string
  user?: User
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
