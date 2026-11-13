import type { ColumnDataType, ColumnBehavior } from "../db/schema.js";

// ─── Auth context attached to every authenticated request ─────────────────────

export interface AuthContext {
  userId: string;
  organizationId: string;
  divisionId: string | null;
  isAdmin: boolean;
  email: string;
  name: string;
}

// ─── Standard API response envelope ──────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Column type configs (stored in typeConfig JSONB) ─────────────────────────

export interface DropdownTypeConfig {
  options: Array<{ value: string; label: string; color?: string }>;
  allowCustom?: boolean;
}

export interface MultiSelectTypeConfig {
  options: Array<{ value: string; label: string; color?: string }>;
  maxSelections?: number;
}

export interface DecimalTypeConfig {
  decimalPlaces: number;
  min?: number;
  max?: number;
  unit?: string;
}

export interface IntegerTypeConfig {
  min?: number;
  max?: number;
  unit?: string;
}

export interface TextTypeConfig {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface DateTypeConfig {
  minDate?: string;
  maxDate?: string;
  format?: string;
}

export interface FileTypeConfig {
  allowedMimeTypes?: string[];
  maxSizeMb?: number;
}

export interface SignatureTypeConfig {
  intent: string;           // The declared meaning, e.g. "I certify the above is correct"
  requireReauth: boolean;   // Whether signer must re-enter password
}

export interface ReferenceTypeConfig {
  sourceLogId: string;
  displayColumnId?: string; // Which column to show in the reference picker
}

export interface CalculatedTypeConfig {
  expression: string;       // e.g. "{quantity_received} - {quantity_rejected}"
  outputType: "integer" | "decimal";
  decimalPlaces?: number;
}

export type ColumnTypeConfig =
  | DropdownTypeConfig
  | MultiSelectTypeConfig
  | DecimalTypeConfig
  | IntegerTypeConfig
  | TextTypeConfig
  | DateTypeConfig
  | FileTypeConfig
  | SignatureTypeConfig
  | ReferenceTypeConfig
  | CalculatedTypeConfig
  | Record<string, unknown>;

// ─── Column behavior configs (stored in behaviorConfig JSONB) ─────────────────

export interface SynchronizedBehaviorConfig {
  relationshipId: string;
  sourceColumnId: string;
}

export interface LinkedBehaviorConfig {
  relationshipId: string;
}

export type ColumnBehaviorConfig =
  | SynchronizedBehaviorConfig
  | LinkedBehaviorConfig
  | Record<string, unknown>;

// ─── Validation rules (stored in validationRules JSONB) ───────────────────────

export interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
  decimalPlaces?: number;
  allowedValues?: string[];
  minDate?: string;
  maxDate?: string;
  custom?: string;
}

// ─── Column with typed configs ────────────────────────────────────────────────

export interface TypedColumn {
  id: string;
  logDefinitionId: string;
  organizationId: string;
  name: string;
  label: string;
  description: string | null;
  dataType: ColumnDataType;
  behavior: ColumnBehavior;
  isRequired: boolean;
  isUnique: boolean;
  displayOrder: number;
  defaultValue: string | null;
  typeConfig: ColumnTypeConfig;
  behaviorConfig: ColumnBehaviorConfig;
  validationRules: ValidationRules;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Record data payload ──────────────────────────────────────────────────────

export type RecordData = Record<string, unknown>;

// ─── Data lineage for a single field ─────────────────────────────────────────

export interface FieldLineage {
  columnId: string;
  columnLabel: string;
  value: unknown;
  behavior: ColumnBehavior;
  source?: {
    logId: string;
    logName: string;
    recordId: string;
    recordNumber: string;
    columnId: string;
    columnLabel: string;
    snapshotValue: string | null;
    snapshotAt: Date | null;
  };
}
