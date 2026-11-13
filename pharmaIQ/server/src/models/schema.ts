import {
  pgTable, uuid, varchar, text, integer, decimal,
  boolean, timestamp, pgEnum, date, jsonb
} from 'drizzle-orm/pg-core';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum('user_role', ['admin', 'pharmacist', 'assistant', 'reviewer']);
export const genderEnum = pgEnum('gender', ['male', 'female', 'other', 'unknown']);
export const patientStatusEnum = pgEnum('patient_status', ['active', 'inactive', 'archived']);
export const registrationSourceEnum = pgEnum('registration_source', ['walk_in', 'referral', 'outreach', 'other']);

export const allergyClassificationEnum = pgEnum('allergy_classification', [
  'suspected_allergy', 'confirmed_allergy', 'intolerance', 'adverse_reaction', 'unknown'
]);
export const allergyStatusEnum = pgEnum('allergy_status', ['active', 'resolved', 'ruled_out', 'unresolved']);
export const patientAllergyStatusEnum = pgEnum('patient_allergy_status', [
  'not_assessed', 'unknown', 'no_known_allergies', 'allergies_present'
]);

export const conditionStatusEnum = pgEnum('condition_status', [
  'current', 'resolved', 'in_remission', 'historical', 'uncertain'
]);
export const verificationStatusEnum = pgEnum('verification_status', ['unverified', 'reviewed', 'confirmed']);
export const recordSourceEnum = pgEnum('record_source', [
  'patient_reported', 'clinician_document', 'imported', 'other'
]);

export const medicationStatusEnum = pgEnum('medication_status', [
  'active', 'discontinued', 'completed', 'held', 'uncertain'
]);
export const medicationChangeTypeEnum = pgEnum('medication_change_type', [
  'started', 'dose_changed', 'frequency_changed', 'discontinued', 'held', 'resumed', 'completed', 'other'
]);
export const reconciliationStatusEnum = pgEnum('reconciliation_status', [
  'complete', 'partial', 'not_completed'
]);

export const encounterTypeEnum = pgEnum('encounter_type', [
  'initial_consultation', 'routine_checkup', 'medication_review',
  'screening', 'follow_up', 'counselling', 'other'
]);
export const encounterStatusEnum = pgEnum('encounter_status', [
  'scheduled', 'in_progress', 'completed', 'cancelled', 'missed', 'rescheduled'
]);

export const followUpStatusEnum = pgEnum('follow_up_status', [
  'scheduled', 'due', 'completed', 'missed', 'rescheduled', 'cancelled', 'unable_to_contact'
]);

export const testOrderStatusEnum = pgEnum('test_order_status', [
  'requested', 'collected', 'in_progress', 'result_available', 'cancelled'
]);
export const testResultStatusEnum = pgEnum('test_result_status', [
  'preliminary', 'final', 'amended', 'reviewed'
]);

export const documentCategoryEnum = pgEnum('document_category', [
  'lab_report', 'prescription', 'discharge_summary', 'referral_letter', 'other'
]);

export const consentStatusEnum = pgEnum('consent_status', [
  'granted', 'denied', 'withdrawn', 'expired', 'not_recorded'
]);

// ─── Users & RBAC ─────────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull().default('assistant'),
  isActive: boolean('is_active').notNull().default(true),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ─── Patients ─────────────────────────────────────────────────────────────────

export const patients = pgTable('patients', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientNumber: varchar('patient_number', { length: 20 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  middleName: varchar('middle_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  dateOfBirth: date('date_of_birth'),
  gender: genderEnum('gender'),
  status: patientStatusEnum('status').notNull().default('active'),
  registrationSource: registrationSourceEnum('registration_source'),
  allergyStatus: patientAllergyStatusEnum('allergy_status').notNull().default('not_assessed'),
  address: text('address'),
  notes: text('notes'),
  registeredAt: timestamp('registered_at').defaultNow(),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  archivedAt: timestamp('archived_at'),
});

export const patientContacts = pgTable('patient_contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  contactType: varchar('contact_type', { length: 20 }).notNull(), // phone, email
  value: varchar('value', { length: 255 }).notNull(),
  isPrimary: boolean('is_primary').notNull().default(false),
  isVerified: boolean('is_verified').notNull().default(false),
  preferredChannel: boolean('preferred_channel').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const emergencyContacts = pgTable('emergency_contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  name: varchar('name', { length: 100 }).notNull(),
  relationship: varchar('relationship', { length: 100 }),
  phone: varchar('phone', { length: 20 }).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ─── Medical History ───────────────────────────────────────────────────────────

export const medicalConditions = pgTable('medical_conditions', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  conditionName: varchar('condition_name', { length: 255 }).notNull(),
  codeSystem: varchar('code_system', { length: 50 }),
  code: varchar('code', { length: 50 }),
  status: conditionStatusEnum('status').notNull().default('current'),
  onsetDate: date('onset_date'),
  resolvedDate: date('resolved_date'),
  severity: varchar('severity', { length: 100 }),
  source: recordSourceEnum('source').notNull().default('patient_reported'),
  verificationStatus: verificationStatusEnum('verification_status').notNull().default('unverified'),
  notes: text('notes'),
  recordedBy: uuid('recorded_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  archivedAt: timestamp('archived_at'),
});

export const patientAllergies = pgTable('patient_allergies', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  substance: varchar('substance', { length: 255 }).notNull(),
  classification: allergyClassificationEnum('classification').notNull().default('unknown'),
  reaction: text('reaction'),
  severity: varchar('severity', { length: 100 }),
  firstReactionDate: date('first_reaction_date'),
  status: allergyStatusEnum('status').notNull().default('active'),
  source: recordSourceEnum('source').notNull().default('patient_reported'),
  verificationStatus: verificationStatusEnum('verification_status').notNull().default('unverified'),
  notes: text('notes'),
  recordedBy: uuid('recorded_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const familyHistory = pgTable('family_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  relationship: varchar('relationship', { length: 100 }).notNull(),
  condition: varchar('condition', { length: 255 }).notNull(),
  approximateOnset: varchar('approximate_onset', { length: 100 }),
  notes: text('notes'),
  source: recordSourceEnum('source').notNull().default('patient_reported'),
  recordedBy: uuid('recorded_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const socialHistory = pgTable('social_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  category: varchar('category', { length: 100 }).notNull(), // tobacco, alcohol, diet, etc.
  value: text('value').notNull(),
  effectiveDate: date('effective_date'),
  source: recordSourceEnum('source').notNull().default('patient_reported'),
  notes: text('notes'),
  recordedBy: uuid('recorded_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const procedures = pgTable('procedures', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  procedureName: varchar('procedure_name', { length: 255 }).notNull(),
  procedureDate: date('procedure_date'),
  approximateYear: integer('approximate_year'),
  reason: text('reason'),
  facility: varchar('facility', { length: 255 }),
  complications: text('complications'),
  notes: text('notes'),
  source: recordSourceEnum('source').notNull().default('patient_reported'),
  recordedBy: uuid('recorded_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const hospitalisations = pgTable('hospitalisations', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  admissionDate: date('admission_date'),
  dischargeDate: date('discharge_date'),
  facility: varchar('facility', { length: 255 }),
  reason: text('reason'),
  dischargeNotes: text('discharge_notes'),
  source: recordSourceEnum('source').notNull().default('patient_reported'),
  recordedBy: uuid('recorded_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// ─── Medications ──────────────────────────────────────────────────────────────

export const patientMedications = pgTable('patient_medications', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  medicineNameSnapshot: varchar('medicine_name_snapshot', { length: 255 }).notNull(),
  genericNameSnapshot: varchar('generic_name_snapshot', { length: 255 }),
  strengthSnapshot: varchar('strength_snapshot', { length: 100 }),
  dosageFormSnapshot: varchar('dosage_form_snapshot', { length: 100 }),
  doseAmount: varchar('dose_amount', { length: 100 }),
  doseUnit: varchar('dose_unit', { length: 50 }),
  route: varchar('route', { length: 100 }),
  frequency: varchar('frequency', { length: 100 }),
  instructions: text('instructions'),
  indication: text('indication'),
  startDate: date('start_date'),
  endDate: date('end_date'),
  status: medicationStatusEnum('status').notNull().default('active'),
  prescriberName: varchar('prescriber_name', { length: 255 }),
  source: recordSourceEnum('source').notNull().default('patient_reported'),
  adherenceStatus: varchar('adherence_status', { length: 100 }),
  sideEffectsNotes: text('side_effects_notes'),
  lastReviewedAt: timestamp('last_reviewed_at'),
  lastReviewedBy: uuid('last_reviewed_by').references(() => users.id),
  recordedBy: uuid('recorded_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const medicationChanges = pgTable('medication_changes', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientMedicationId: uuid('patient_medication_id').notNull().references(() => patientMedications.id),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  encounterId: uuid('encounter_id'), // FK added after encounters table
  changeType: medicationChangeTypeEnum('change_type').notNull(),
  previousValues: jsonb('previous_values'),
  newValues: jsonb('new_values'),
  reason: text('reason'),
  source: recordSourceEnum('source').notNull().default('patient_reported'),
  changedBy: uuid('changed_by').notNull().references(() => users.id),
  changedAt: timestamp('changed_at').defaultNow(),
});

export const medicationReviews = pgTable('medication_reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  encounterId: uuid('encounter_id').notNull(),
  reviewedBy: uuid('reviewed_by').notNull().references(() => users.id),
  reviewedAt: timestamp('reviewed_at').defaultNow(),
  reconciliationStatus: reconciliationStatusEnum('reconciliation_status').notNull().default('not_completed'),
  problemsIdentified: text('problems_identified'),
  actionsTaken: text('actions_taken'),
  referralDetails: text('referral_details'),
  outcome: text('outcome'),
  followUpAt: date('follow_up_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ─── Encounters ───────────────────────────────────────────────────────────────

export const encounters = pgTable('encounters', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  encounterNumber: varchar('encounter_number', { length: 20 }),
  encounterType: encounterTypeEnum('encounter_type').notNull().default('routine_checkup'),
  status: encounterStatusEnum('status').notNull().default('in_progress'),
  reason: text('reason'),
  presentingComplaint: text('presenting_complaint'),
  symptoms: text('symptoms'),
  clinicalNotes: text('clinical_notes'),
  assessmentSummary: text('assessment_summary'),
  planSummary: text('plan_summary'),
  referralDetails: text('referral_details'),
  assignedUserId: uuid('assigned_user_id').references(() => users.id),
  startedAt: timestamp('started_at').defaultNow(),
  completedAt: timestamp('completed_at'),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  amendedAt: timestamp('amended_at'),
  amendmentReason: text('amendment_reason'),
});

export const observations = pgTable('observations', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  encounterId: uuid('encounter_id').references(() => encounters.id),
  observationType: varchar('observation_type', { length: 100 }).notNull(),
  valueNumeric: decimal('value_numeric', { precision: 10, scale: 4 }),
  valueText: text('value_text'),
  valueJson: jsonb('value_json'),
  unit: varchar('unit', { length: 50 }),
  context: varchar('context', { length: 255 }),
  measuredAt: timestamp('measured_at').defaultNow(),
  source: recordSourceEnum('source').notNull().default('patient_reported'),
  recordedBy: uuid('recorded_by').notNull().references(() => users.id),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const assessments = pgTable('assessments', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  encounterId: uuid('encounter_id').notNull().references(() => encounters.id),
  assessmentType: varchar('assessment_type', { length: 100 }).notNull(),
  description: text('description').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  evidenceNotes: text('evidence_notes'),
  recordedBy: uuid('recorded_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const carePlans = pgTable('care_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  encounterId: uuid('encounter_id').notNull().references(() => encounters.id),
  goalOrProblem: text('goal_or_problem').notNull(),
  action: text('action').notNull(),
  rationale: text('rationale'),
  responsibleUserId: uuid('responsible_user_id').references(() => users.id),
  dueAt: date('due_at'),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  outcome: text('outcome'),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const encounterInterventions = pgTable('encounter_interventions', {
  id: uuid('id').primaryKey().defaultRandom(),
  encounterId: uuid('encounter_id').notNull().references(() => encounters.id),
  interventionType: varchar('intervention_type', { length: 100 }).notNull(),
  description: text('description').notNull(),
  rationale: text('rationale'),
  outcome: text('outcome'),
  recordedBy: uuid('recorded_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// ─── Follow-ups ───────────────────────────────────────────────────────────────

export const followUps = pgTable('follow_ups', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  relatedEncounterId: uuid('related_encounter_id').references(() => encounters.id),
  reason: text('reason').notNull(),
  dueAt: timestamp('due_at').notNull(),
  status: followUpStatusEnum('status').notNull().default('scheduled'),
  assignedUserId: uuid('assigned_user_id').references(() => users.id),
  completedAt: timestamp('completed_at'),
  outcomeNotes: text('outcome_notes'),
  nextFollowUpAt: timestamp('next_follow_up_at'),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ─── Test Orders & Results ────────────────────────────────────────────────────

export const testOrders = pgTable('test_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  encounterId: uuid('encounter_id').references(() => encounters.id),
  testName: varchar('test_name', { length: 255 }).notNull(),
  requestedBy: uuid('requested_by').notNull().references(() => users.id),
  requestedAt: timestamp('requested_at').defaultNow(),
  facility: varchar('facility', { length: 255 }),
  status: testOrderStatusEnum('status').notNull().default('requested'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const testResults = pgTable('test_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  testOrderId: uuid('test_order_id').references(() => testOrders.id),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  encounterId: uuid('encounter_id').references(() => encounters.id),
  testName: varchar('test_name', { length: 255 }).notNull(),
  resultValue: text('result_value'),
  unit: varchar('unit', { length: 100 }),
  referenceRange: varchar('reference_range', { length: 255 }),
  specimenType: varchar('specimen_type', { length: 100 }),
  collectedAt: timestamp('collected_at'),
  resultAt: timestamp('result_at'),
  facility: varchar('facility', { length: 255 }),
  status: testResultStatusEnum('status').notNull().default('preliminary'),
  reviewedBy: uuid('reviewed_by').references(() => users.id),
  reviewedAt: timestamp('reviewed_at'),
  followUpAction: text('follow_up_action'),
  previousResultId: uuid('previous_result_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ─── Clinical Documents ───────────────────────────────────────────────────────

export const clinicalDocuments = pgTable('clinical_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  encounterId: uuid('encounter_id').references(() => encounters.id),
  originalFilename: varchar('original_filename', { length: 255 }).notNull(),
  displayName: varchar('display_name', { length: 255 }).notNull(),
  category: documentCategoryEnum('category').notNull().default('other'),
  storageKey: varchar('storage_key', { length: 500 }).notNull(),
  contentType: varchar('content_type', { length: 100 }).notNull(),
  fileSizeBytes: integer('file_size_bytes').notNull(),
  checksum: varchar('checksum', { length: 64 }),
  sourceDate: date('source_date'),
  uploadedBy: uuid('uploaded_by').notNull().references(() => users.id),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// ─── Consent ──────────────────────────────────────────────────────────────────

export const consents = pgTable('consents', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  purpose: varchar('purpose', { length: 255 }).notNull(),
  status: consentStatusEnum('status').notNull().default('not_recorded'),
  method: varchar('method', { length: 100 }),
  noticeVersion: varchar('notice_version', { length: 50 }),
  scope: text('scope'),
  expiryDate: date('expiry_date'),
  recordedBy: uuid('recorded_by').notNull().references(() => users.id),
  recordedAt: timestamp('recorded_at').defaultNow(),
  withdrawnAt: timestamp('withdrawn_at'),
  notes: text('notes'),
});

// ─── Audit Log ────────────────────────────────────────────────────────────────

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  actorUserId: uuid('actor_user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 100 }).notNull(),
  entityId: varchar('entity_id', { length: 255 }),
  outcome: varchar('outcome', { length: 20 }).notNull().default('success'), // success | failure
  reason: text('reason'),
  correlationId: varchar('correlation_id', { length: 100 }),
  safeMetadata: jsonb('safe_metadata'),
  occurredAt: timestamp('occurred_at').defaultNow(),
});
