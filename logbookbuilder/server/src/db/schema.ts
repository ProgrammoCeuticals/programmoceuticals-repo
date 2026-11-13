import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID());

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

// ─── Enums ────────────────────────────────────────────────────────────────────

export const columnDataTypeEnum = pgEnum("column_data_type", [
  "text",
  "long_text",
  "integer",
  "decimal",
  "date",
  "time",
  "datetime",
  "boolean",
  "dropdown",
  "multi_select",
  "user",
  "person",
  "reference",
  "calculated",
  "file",
  "image",
  "signature",
]);

export const columnBehaviorEnum = pgEnum("column_behavior", [
  "independent",
  "linked",
  "synchronized",
  "calculated",
]);

export const logStatusEnum = pgEnum("log_status", [
  "draft",
  "active",
  "archived",
]);

export const recordStatusEnum = pgEnum("record_status", [
  "active",
  "corrected",
  "voided",
  "archived",
]);

export const auditEventTypeEnum = pgEnum("audit_event_type", [
  // Auth
  "user_registered",
  "user_login",
  "user_logout",
  "user_login_failed",
  "token_refreshed",
  // Organization
  "org_created",
  "org_updated",
  // User management
  "user_created",
  "user_updated",
  "user_deactivated",
  // Personnel
  "personnel_created",
  "personnel_updated",
  "personnel_deactivated",
  // Log definition
  "log_created",
  "log_updated",
  "log_published",
  "log_archived",
  // Log column
  "column_added",
  "column_updated",
  "column_removed",
  "columns_reordered",
  // Relationship
  "relationship_created",
  "relationship_updated",
  "relationship_deleted",
  // Record
  "record_created",
  "record_updated",
  "record_corrected",
  "record_voided",
  "record_archived",
  // Signature
  "record_signed",
  // File
  "file_uploaded",
  "file_deleted",
  // Export
  "log_exported",
  // Config
  "config_changed",
]);

export const userStatusEnum = pgEnum("user_status", ["active", "inactive", "suspended"]);

export const relationshipTypeEnum = pgEnum("relationship_type", [
  "one_to_many",
  "many_to_one",
  "one_to_one",
]);

export const signatureStatusEnum = pgEnum("signature_status", [
  "pending",
  "signed",
  "revoked",
]);

// ─── Divisions ───────────────────────────────────────────────────────────────

export const divisions = pgTable("divisions", {
  id: id(),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  ...timestamps,
}, (t) => ({
  orgIdx: index("divisions_org_idx").on(t.organizationId),
  orgNameIdx: uniqueIndex("divisions_org_name_idx").on(t.organizationId, t.name),
}));

// ─── Organizations ────────────────────────────────────────────────────────────

export const organizations = pgTable("organizations", {
  id: id(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  isActive: boolean("is_active").notNull().default(true),
  settings: jsonb("settings").notNull().default({}),
  ...timestamps,
}, (t) => ({
  slugIdx: uniqueIndex("organizations_slug_idx").on(t.slug),
}));

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: id(),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  divisionId: text("division_id").references(() => divisions.id, { onDelete: "set null" }),
  isAdmin: boolean("is_admin").notNull().default(false),
  name: text("name").notNull(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  status: userStatusEnum("status").notNull().default("active"),
  refreshTokenHash: text("refresh_token_hash"),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  ...timestamps,
}, (t) => ({
  emailIdx: uniqueIndex("users_email_idx").on(t.email),
  orgIdx: index("users_org_idx").on(t.organizationId),
}));

// ─── Personnel ────────────────────────────────────────────────────────────────
// People referenced in logs who may not have login credentials.

export const personnel = pgTable("personnel", {
  id: id(),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  identifier: text("identifier"),       // employee ID, staff number, etc.
  role: text("role"),                   // job title / role description
  department: text("department"),
  email: text("email"),
  phone: text("phone"),
  isActive: boolean("is_active").notNull().default(true),
  linkedUserId: text("linked_user_id").references(() => users.id, { onDelete: "set null" }),
  metadata: jsonb("metadata").notNull().default({}),
  ...timestamps,
}, (t) => ({
  orgIdx: index("personnel_org_idx").on(t.organizationId),
}));

// ─── Log Definitions ─────────────────────────────────────────────────────────

export const logDefinitions = pgTable("log_definitions", {
  id: id(),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  divisionId: text("division_id").references(() => divisions.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  description: text("description"),
  status: logStatusEnum("status").notNull().default("draft"),
  version: integer("version").notNull().default(1),
  icon: text("icon"),
  color: text("color"),
  settings: jsonb("settings").notNull().default({}),
  createdById: text("created_by_id").notNull().references(() => users.id),
  updatedById: text("updated_by_id").references(() => users.id),
  ...timestamps,
}, (t) => ({
  orgIdx: index("log_definitions_org_idx").on(t.organizationId),
  orgNameIdx: uniqueIndex("log_definitions_org_name_idx").on(t.organizationId, t.name),
}));

// ─── Log Columns ─────────────────────────────────────────────────────────────

export const logColumns = pgTable("log_columns", {
  id: id(),
  logDefinitionId: text("log_definition_id").notNull().references(() => logDefinitions.id, { onDelete: "cascade" }),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),           // internal key, e.g. "batch_number"
  label: text("label").notNull(),         // display label, e.g. "Batch Number"
  description: text("description"),
  dataType: columnDataTypeEnum("data_type").notNull(),
  behavior: columnBehaviorEnum("behavior").notNull().default("independent"),
  isRequired: boolean("is_required").notNull().default(false),
  isUnique: boolean("is_unique").notNull().default(false),
  displayOrder: integer("display_order").notNull().default(0),
  defaultValue: text("default_value"),
  // Type-specific config: dropdown options, decimal precision, min/max, regex, etc.
  typeConfig: jsonb("type_config").notNull().default({}),
  // Behavior-specific config: source log, source column, expression, etc.
  behaviorConfig: jsonb("behavior_config").notNull().default({}),
  // Validation rules: minLength, maxLength, pattern, min, max, etc.
  validationRules: jsonb("validation_rules").notNull().default({}),
  isSystem: boolean("is_system").notNull().default(false), // system-managed columns
  createdById: text("created_by_id").notNull().references(() => users.id),
  updatedById: text("updated_by_id").references(() => users.id),
  ...timestamps,
}, (t) => ({
  logIdx: index("log_columns_log_idx").on(t.logDefinitionId),
  orderIdx: index("log_columns_order_idx").on(t.logDefinitionId, t.displayOrder),
}));

// ─── Log Relationships ────────────────────────────────────────────────────────
// Declares that a target log can reference records from a source log.

export const logRelationships = pgTable("log_relationships", {
  id: id(),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  sourceLogId: text("source_log_id").notNull().references(() => logDefinitions.id, { onDelete: "cascade" }),
  targetLogId: text("target_log_id").notNull().references(() => logDefinitions.id, { onDelete: "cascade" }),
  // The column in the target log that holds the reference (type: "reference")
  referencingColumnId: text("referencing_column_id").references(() => logColumns.id, { onDelete: "set null" }),
  relationshipType: relationshipTypeEnum("relationship_type").notNull().default("many_to_one"),
  isActive: boolean("is_active").notNull().default(true),
  createdById: text("created_by_id").notNull().references(() => users.id),
  ...timestamps,
}, (t) => ({
  orgIdx: index("log_relationships_org_idx").on(t.organizationId),
  sourceTargetIdx: index("log_relationships_source_target_idx").on(t.sourceLogId, t.targetLogId),
}));

// ─── Relationship Field Mappings ──────────────────────────────────────────────
// Maps which target columns synchronize from which source columns.

export const relationshipFieldMappings = pgTable("relationship_field_mappings", {
  id: id(),
  relationshipId: text("relationship_id").notNull().references(() => logRelationships.id, { onDelete: "cascade" }),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  sourceColumnId: text("source_column_id").notNull().references(() => logColumns.id, { onDelete: "cascade" }),
  targetColumnId: text("target_column_id").notNull().references(() => logColumns.id, { onDelete: "cascade" }),
  ...timestamps,
}, (t) => ({
  relIdx: index("rfm_relationship_idx").on(t.relationshipId),
}));

// ─── Log Records ──────────────────────────────────────────────────────────────

export const logRecords = pgTable("log_records", {
  id: id(),
  logDefinitionId: text("log_definition_id").notNull().references(() => logDefinitions.id, { onDelete: "cascade" }),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  // Human-readable sequential reference, e.g. "BMR-00001"
  recordNumber: text("record_number").notNull(),
  status: recordStatusEnum("status").notNull().default("active"),
  // All independent field values stored as JSONB: { columnId: value, ... }
  data: jsonb("data").notNull().default({}),
  // Correction metadata
  correctedFromId: text("corrected_from_id"),
  correctionReason: text("correction_reason"),
  correctedAt: timestamp("corrected_at", { withTimezone: true }),
  correctedById: text("corrected_by_id").references(() => users.id),
  // Void metadata
  voidedAt: timestamp("voided_at", { withTimezone: true }),
  voidedById: text("voided_by_id").references(() => users.id),
  voidReason: text("void_reason"),
  createdById: text("created_by_id").notNull().references(() => users.id),
  updatedById: text("updated_by_id").references(() => users.id),
  ...timestamps,
}, (t) => ({
  logIdx: index("log_records_log_idx").on(t.logDefinitionId),
  orgIdx: index("log_records_org_idx").on(t.organizationId),
  statusIdx: index("log_records_status_idx").on(t.status),
  recordNumberIdx: uniqueIndex("log_records_number_idx").on(t.logDefinitionId, t.recordNumber),
}));

// ─── Field Values ─────────────────────────────────────────────────────────────
// Explicit rows for linked, synchronized, calculated, file, and signature fields.
// These need individual auditability, relationship tracking, and lineage.

export const fieldValues = pgTable("field_values", {
  id: id(),
  recordId: text("record_id").notNull().references(() => logRecords.id, { onDelete: "cascade" }),
  columnId: text("column_id").notNull().references(() => logColumns.id, { onDelete: "cascade" }),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  // The resolved/stored value
  value: text("value"),
  // For synchronized fields: the source of truth
  sourceLogId: text("source_log_id").references(() => logDefinitions.id, { onDelete: "set null" }),
  sourceRecordId: text("source_record_id").references(() => logRecords.id, { onDelete: "set null" }),
  sourceColumnId: text("source_column_id").references(() => logColumns.id, { onDelete: "set null" }),
  // Snapshot of the source value at the time this record was created/updated.
  // Preserved for auditability even if the source changes later.
  snapshotValue: text("snapshot_value"),
  snapshotAt: timestamp("snapshot_at", { withTimezone: true }),
  // For calculated fields: the expression result metadata
  calculationMeta: jsonb("calculation_meta").notNull().default({}),
  createdById: text("created_by_id").notNull().references(() => users.id),
  updatedById: text("updated_by_id").references(() => users.id),
  ...timestamps,
}, (t) => ({
  recordIdx: index("field_values_record_idx").on(t.recordId),
  columnIdx: index("field_values_column_idx").on(t.columnId),
  sourceRecordIdx: index("field_values_source_record_idx").on(t.sourceRecordId),
  recordColumnIdx: uniqueIndex("field_values_record_column_idx").on(t.recordId, t.columnId),
}));

// ─── Record Links ─────────────────────────────────────────────────────────────
// Runtime instance of a relationship: "this record references that record".

export const recordLinks = pgTable("record_links", {
  id: id(),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  relationshipId: text("relationship_id").notNull().references(() => logRelationships.id, { onDelete: "cascade" }),
  // The record that holds the reference (in the target log)
  referencingRecordId: text("referencing_record_id").notNull().references(() => logRecords.id, { onDelete: "cascade" }),
  // The record being referenced (in the source log)
  referencedRecordId: text("referenced_record_id").notNull().references(() => logRecords.id, { onDelete: "cascade" }),
  createdById: text("created_by_id").notNull().references(() => users.id),
  ...timestamps,
}, (t) => ({
  referencingIdx: index("record_links_referencing_idx").on(t.referencingRecordId),
  referencedIdx: index("record_links_referenced_idx").on(t.referencedRecordId),
  uniqueLinkIdx: uniqueIndex("record_links_unique_idx").on(t.relationshipId, t.referencingRecordId),
}));

// ─── Record Versions ──────────────────────────────────────────────────────────
// Full snapshot of record data at each change point.

export const recordVersions = pgTable("record_versions", {
  id: id(),
  recordId: text("record_id").notNull().references(() => logRecords.id, { onDelete: "cascade" }),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  version: integer("version").notNull(),
  // Full snapshot of data JSONB at this version
  data: jsonb("data").notNull().default({}),
  // Snapshot of all field_values for this record at this version
  fieldValuesSnapshot: jsonb("field_values_snapshot").notNull().default({}),
  changedById: text("changed_by_id").notNull().references(() => users.id),
  changeReason: text("change_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  recordIdx: index("record_versions_record_idx").on(t.recordId),
  versionIdx: uniqueIndex("record_versions_record_version_idx").on(t.recordId, t.version),
}));

// ─── File Attachments ─────────────────────────────────────────────────────────

export const fileAttachments = pgTable("file_attachments", {
  id: id(),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  recordId: text("record_id").references(() => logRecords.id, { onDelete: "cascade" }),
  columnId: text("column_id").references(() => logColumns.id, { onDelete: "set null" }),
  originalName: text("original_name").notNull(),
  storagePath: text("storage_path").notNull(),   // path in object storage / local
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  isDeleted: boolean("is_deleted").notNull().default(false),
  uploadedById: text("uploaded_by_id").notNull().references(() => users.id),
  ...timestamps,
}, (t) => ({
  recordIdx: index("file_attachments_record_idx").on(t.recordId),
  orgIdx: index("file_attachments_org_idx").on(t.organizationId),
}));

// ─── Signatures ───────────────────────────────────────────────────────────────

export const signatures = pgTable("signatures", {
  id: id(),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  recordId: text("record_id").notNull().references(() => logRecords.id, { onDelete: "cascade" }),
  columnId: text("column_id").notNull().references(() => logColumns.id, { onDelete: "cascade" }),
  // Signer — must be a system user (re-authenticated at signing time)
  signedById: text("signed_by_id").notNull().references(() => users.id),
  // Optional personnel link if the signer is also a personnel record
  personnelId: text("personnel_id").references(() => personnel.id, { onDelete: "set null" }),
  // The declared intent/meaning of the signature
  intent: text("intent").notNull(),
  // Server-assigned timestamp — never client-supplied
  signedAt: timestamp("signed_at", { withTimezone: true }).notNull().defaultNow(),
  // SHA-256 of (recordId + userId + signedAt.toISOString() + intent)
  integrityHash: text("integrity_hash").notNull(),
  // Base64 PNG of drawn signature, stored as file attachment
  signatureImageId: text("signature_image_id").references(() => fileAttachments.id, { onDelete: "set null" }),
  status: signatureStatusEnum("status").notNull().default("signed"),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  revokedById: text("revoked_by_id").references(() => users.id),
  revocationReason: text("revocation_reason"),
  ...timestamps,
}, (t) => ({
  recordIdx: index("signatures_record_idx").on(t.recordId),
  signerIdx: index("signatures_signer_idx").on(t.signedById),
}));

// ─── Audit Events ─────────────────────────────────────────────────────────────
// Append-only. Never updated or deleted.

export const auditEvents = pgTable("audit_events", {
  id: id(),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  eventType: auditEventTypeEnum("event_type").notNull(),
  entityType: text("entity_type").notNull(),   // "log_definition", "log_record", "user", etc.
  entityId: text("entity_id"),
  // Human-readable summary
  summary: text("summary").notNull(),
  // Previous state snapshot (for updates/corrections)
  previousState: jsonb("previous_state"),
  // New state snapshot
  newState: jsonb("new_state"),
  // Additional context: IP address, user agent, request ID, etc.
  metadata: jsonb("metadata").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  orgIdx: index("audit_events_org_idx").on(t.organizationId),
  userIdx: index("audit_events_user_idx").on(t.userId),
  entityIdx: index("audit_events_entity_idx").on(t.entityType, t.entityId),
  createdAtIdx: index("audit_events_created_at_idx").on(t.createdAt),
  eventTypeIdx: index("audit_events_event_type_idx").on(t.eventType),
}));

// ─── Relations ────────────────────────────────────────────────────────────────

export const divisionsRelations = relations(divisions, ({ one, many }) => ({
  organization: one(organizations, { fields: [divisions.organizationId], references: [organizations.id] }),
  users: many(users),
  logDefinitions: many(logDefinitions),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  personnel: many(personnel),
  logDefinitions: many(logDefinitions),
  divisions: many(divisions),
  logRecords: many(logRecords),
  auditEvents: many(auditEvents),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, { fields: [users.organizationId], references: [organizations.id] }),
  division: one(divisions, { fields: [users.divisionId], references: [divisions.id] }),
  personnel: many(personnel),
  createdLogs: many(logDefinitions, { relationName: "createdLogs" }),
}));

export const personnelRelations = relations(personnel, ({ one }) => ({
  organization: one(organizations, { fields: [personnel.organizationId], references: [organizations.id] }),
  linkedUser: one(users, { fields: [personnel.linkedUserId], references: [users.id] }),
}));

export const logDefinitionsRelations = relations(logDefinitions, ({ one, many }) => ({
  organization: one(organizations, { fields: [logDefinitions.organizationId], references: [organizations.id] }),
  division: one(divisions, { fields: [logDefinitions.divisionId], references: [divisions.id] }),
  createdBy: one(users, { fields: [logDefinitions.createdById], references: [users.id], relationName: "createdLogs" }),
  columns: many(logColumns),
  records: many(logRecords),
  sourceRelationships: many(logRelationships, { relationName: "sourceLog" }),
  targetRelationships: many(logRelationships, { relationName: "targetLog" }),
}));

export const logColumnsRelations = relations(logColumns, ({ one, many }) => ({
  logDefinition: one(logDefinitions, { fields: [logColumns.logDefinitionId], references: [logDefinitions.id] }),
  organization: one(organizations, { fields: [logColumns.organizationId], references: [organizations.id] }),
  sourceMappings: many(relationshipFieldMappings, { relationName: "rfmSourceColumn" }),
  targetMappings: many(relationshipFieldMappings, { relationName: "rfmTargetColumn" }),
  fieldValues: many(fieldValues, { relationName: "fieldValueColumn" }),
  sourceFieldValues: many(fieldValues, { relationName: "sourceFieldValueColumn" }),
}));

export const logRelationshipsRelations = relations(logRelationships, ({ one, many }) => ({
  organization: one(organizations, { fields: [logRelationships.organizationId], references: [organizations.id] }),
  sourceLog: one(logDefinitions, { fields: [logRelationships.sourceLogId], references: [logDefinitions.id], relationName: "sourceLog" }),
  targetLog: one(logDefinitions, { fields: [logRelationships.targetLogId], references: [logDefinitions.id], relationName: "targetLog" }),
  fieldMappings: many(relationshipFieldMappings, { relationName: "relationshipMappings" }),
}));

export const relationshipFieldMappingsRelations = relations(relationshipFieldMappings, ({ one }) => ({
  relationship: one(logRelationships, { fields: [relationshipFieldMappings.relationshipId], references: [logRelationships.id], relationName: "relationshipMappings" }),
  organization: one(organizations, { fields: [relationshipFieldMappings.organizationId], references: [organizations.id] }),
  sourceColumn: one(logColumns, { fields: [relationshipFieldMappings.sourceColumnId], references: [logColumns.id], relationName: "rfmSourceColumn" }),
  targetColumn: one(logColumns, { fields: [relationshipFieldMappings.targetColumnId], references: [logColumns.id], relationName: "rfmTargetColumn" }),
}));

export const logRecordsRelations = relations(logRecords, ({ one, many }) => ({
  logDefinition: one(logDefinitions, { fields: [logRecords.logDefinitionId], references: [logDefinitions.id] }),
  organization: one(organizations, { fields: [logRecords.organizationId], references: [organizations.id] }),
  createdBy: one(users, { fields: [logRecords.createdById], references: [users.id] }),
  fieldValues: many(fieldValues, { relationName: "recordFieldValues" }),
  versions: many(recordVersions),
  outgoingLinks: many(recordLinks, { relationName: "referencingRecord" }),
  incomingLinks: many(recordLinks, { relationName: "referencedRecord" }),
  signatures: many(signatures, { relationName: "recordSignatures" }),
  files: many(fileAttachments, { relationName: "recordFiles" }),
}));

export const fieldValuesRelations = relations(fieldValues, ({ one }) => ({
  record: one(logRecords, { fields: [fieldValues.recordId], references: [logRecords.id], relationName: "recordFieldValues" }),
  column: one(logColumns, { fields: [fieldValues.columnId], references: [logColumns.id], relationName: "fieldValueColumn" }),
  sourceLog: one(logDefinitions, { fields: [fieldValues.sourceLogId], references: [logDefinitions.id] }),
  sourceRecord: one(logRecords, { fields: [fieldValues.sourceRecordId], references: [logRecords.id], relationName: "sourceRecordFieldValues" }),
  sourceColumn: one(logColumns, { fields: [fieldValues.sourceColumnId], references: [logColumns.id], relationName: "sourceFieldValueColumn" }),
}));

export const recordLinksRelations = relations(recordLinks, ({ one }) => ({
  relationship: one(logRelationships, { fields: [recordLinks.relationshipId], references: [logRelationships.id] }),
  referencingRecord: one(logRecords, { fields: [recordLinks.referencingRecordId], references: [logRecords.id], relationName: "referencingRecord" }),
  referencedRecord: one(logRecords, { fields: [recordLinks.referencedRecordId], references: [logRecords.id], relationName: "referencedRecord" }),
}));

export const auditEventsRelations = relations(auditEvents, ({ one }) => ({
  organization: one(organizations, { fields: [auditEvents.organizationId], references: [organizations.id] }),
  user: one(users, { fields: [auditEvents.userId], references: [users.id] }),
}));

export const fileAttachmentsRelations = relations(fileAttachments, ({ one, many }) => ({
  organization: one(organizations, { fields: [fileAttachments.organizationId], references: [organizations.id] }),
  record: one(logRecords, { fields: [fileAttachments.recordId], references: [logRecords.id], relationName: "recordFiles" }),
  column: one(logColumns, { fields: [fileAttachments.columnId], references: [logColumns.id] }),
  uploadedBy: one(users, { fields: [fileAttachments.uploadedById], references: [users.id] }),
  signatures: many(signatures, { relationName: "signatureImage" }),
}));

export const signaturesRelations = relations(signatures, ({ one }) => ({
  organization: one(organizations, { fields: [signatures.organizationId], references: [organizations.id] }),
  record: one(logRecords, { fields: [signatures.recordId], references: [logRecords.id], relationName: "recordSignatures" }),
  column: one(logColumns, { fields: [signatures.columnId], references: [logColumns.id] }),
  signedBy: one(users, { fields: [signatures.signedById], references: [users.id] }),
  personnel: one(personnel, { fields: [signatures.personnelId], references: [personnel.id] }),
  signatureImage: one(fileAttachments, { fields: [signatures.signatureImageId], references: [fileAttachments.id], relationName: "signatureImage" }),
}));

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type Division = typeof divisions.$inferSelect;
export type NewDivision = typeof divisions.$inferInsert;

export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Personnel = typeof personnel.$inferSelect;
export type NewPersonnel = typeof personnel.$inferInsert;

export type LogDefinition = typeof logDefinitions.$inferSelect;
export type NewLogDefinition = typeof logDefinitions.$inferInsert;

export type LogColumn = typeof logColumns.$inferSelect;
export type NewLogColumn = typeof logColumns.$inferInsert;

export type LogRelationship = typeof logRelationships.$inferSelect;
export type NewLogRelationship = typeof logRelationships.$inferInsert;

export type RelationshipFieldMapping = typeof relationshipFieldMappings.$inferSelect;

export type LogRecord = typeof logRecords.$inferSelect;
export type NewLogRecord = typeof logRecords.$inferInsert;

export type FieldValue = typeof fieldValues.$inferSelect;
export type NewFieldValue = typeof fieldValues.$inferInsert;

export type RecordLink = typeof recordLinks.$inferSelect;

export type RecordVersion = typeof recordVersions.$inferSelect;

export type FileAttachment = typeof fileAttachments.$inferSelect;

export type Signature = typeof signatures.$inferSelect;

export type AuditEvent = typeof auditEvents.$inferSelect;
export type NewAuditEvent = typeof auditEvents.$inferInsert;

export type ColumnDataType = typeof columnDataTypeEnum.enumValues[number];
export type ColumnBehavior = typeof columnBehaviorEnum.enumValues[number];
export type LogStatus = typeof logStatusEnum.enumValues[number];
export type RecordStatus = typeof recordStatusEnum.enumValues[number];
export type AuditEventType = typeof auditEventTypeEnum.enumValues[number];
export type UserStatus = typeof userStatusEnum.enumValues[number];
export type RelationshipType = typeof relationshipTypeEnum.enumValues[number];
export type SignatureStatus = typeof signatureStatusEnum.enumValues[number];
