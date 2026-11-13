-- Migration 0001: Full PMS schema
-- Run after 0000_initial.sql (which created the old tables)
-- This migration drops the old simplified tables and rebuilds everything properly.

-- ─── Drop old tables (order matters for FK deps) ──────────────────────────────
DROP TABLE IF EXISTS visit_logs CASCADE;
DROP TABLE IF EXISTS medication_records CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ─── Drop old enums ───────────────────────────────────────────────────────────
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS gender CASCADE;
DROP TYPE IF EXISTS medication_status CASCADE;

-- ─── Extensions ───────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Enums ────────────────────────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('admin', 'pharmacist', 'assistant', 'reviewer');
CREATE TYPE gender AS ENUM ('male', 'female', 'other', 'unknown');
CREATE TYPE patient_status AS ENUM ('active', 'inactive', 'archived');
CREATE TYPE registration_source AS ENUM ('walk_in', 'referral', 'outreach', 'other');
CREATE TYPE allergy_classification AS ENUM ('suspected_allergy', 'confirmed_allergy', 'intolerance', 'adverse_reaction', 'unknown');
CREATE TYPE allergy_status AS ENUM ('active', 'resolved', 'ruled_out', 'unresolved');
CREATE TYPE patient_allergy_status AS ENUM ('not_assessed', 'unknown', 'no_known_allergies', 'allergies_present');
CREATE TYPE condition_status AS ENUM ('current', 'resolved', 'in_remission', 'historical', 'uncertain');
CREATE TYPE verification_status AS ENUM ('unverified', 'reviewed', 'confirmed');
CREATE TYPE record_source AS ENUM ('patient_reported', 'clinician_document', 'imported', 'other');
CREATE TYPE medication_status AS ENUM ('active', 'discontinued', 'completed', 'held', 'uncertain');
CREATE TYPE medication_change_type AS ENUM ('started', 'dose_changed', 'frequency_changed', 'discontinued', 'held', 'resumed', 'completed', 'other');
CREATE TYPE reconciliation_status AS ENUM ('complete', 'partial', 'not_completed');
CREATE TYPE encounter_type AS ENUM ('initial_consultation', 'routine_checkup', 'medication_review', 'screening', 'follow_up', 'counselling', 'other');
CREATE TYPE encounter_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled', 'missed', 'rescheduled');
CREATE TYPE follow_up_status AS ENUM ('scheduled', 'due', 'completed', 'missed', 'rescheduled', 'cancelled', 'unable_to_contact');
CREATE TYPE test_order_status AS ENUM ('requested', 'collected', 'in_progress', 'result_available', 'cancelled');
CREATE TYPE test_result_status AS ENUM ('preliminary', 'final', 'amended', 'reviewed');
CREATE TYPE document_category AS ENUM ('lab_report', 'prescription', 'discharge_summary', 'referral_letter', 'other');
CREATE TYPE consent_status AS ENUM ('granted', 'denied', 'withdrawn', 'expired', 'not_recorded');

-- ─── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'assistant',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ─── Patients ─────────────────────────────────────────────────────────────────
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_number VARCHAR(20) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  gender gender,
  status patient_status NOT NULL DEFAULT 'active',
  registration_source registration_source,
  allergy_status patient_allergy_status NOT NULL DEFAULT 'not_assessed',
  address TEXT,
  notes TEXT,
  registered_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  archived_at TIMESTAMP
);

CREATE INDEX idx_patients_patient_number ON patients(patient_number);
CREATE INDEX idx_patients_last_name ON patients(last_name);
CREATE INDEX idx_patients_status ON patients(status);

CREATE TABLE patient_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  contact_type VARCHAR(20) NOT NULL,
  value VARCHAR(255) NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  preferred_channel BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_patient_contacts_patient ON patient_contacts(patient_id);

CREATE TABLE emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  name VARCHAR(100) NOT NULL,
  relationship VARCHAR(100),
  phone VARCHAR(20) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ─── Medical History ──────────────────────────────────────────────────────────
CREATE TABLE medical_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  condition_name VARCHAR(255) NOT NULL,
  code_system VARCHAR(50),
  code VARCHAR(50),
  status condition_status NOT NULL DEFAULT 'current',
  onset_date DATE,
  resolved_date DATE,
  severity VARCHAR(100),
  source record_source NOT NULL DEFAULT 'patient_reported',
  verification_status verification_status NOT NULL DEFAULT 'unverified',
  notes TEXT,
  recorded_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  archived_at TIMESTAMP
);

CREATE INDEX idx_medical_conditions_patient ON medical_conditions(patient_id);

CREATE TABLE patient_allergies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  substance VARCHAR(255) NOT NULL,
  classification allergy_classification NOT NULL DEFAULT 'unknown',
  reaction TEXT,
  severity VARCHAR(100),
  first_reaction_date DATE,
  status allergy_status NOT NULL DEFAULT 'active',
  source record_source NOT NULL DEFAULT 'patient_reported',
  verification_status verification_status NOT NULL DEFAULT 'unverified',
  notes TEXT,
  recorded_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_patient_allergies_patient ON patient_allergies(patient_id);

CREATE TABLE family_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  relationship VARCHAR(100) NOT NULL,
  condition VARCHAR(255) NOT NULL,
  approximate_onset VARCHAR(100),
  notes TEXT,
  source record_source NOT NULL DEFAULT 'patient_reported',
  recorded_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE social_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  category VARCHAR(100) NOT NULL,
  value TEXT NOT NULL,
  effective_date DATE,
  source record_source NOT NULL DEFAULT 'patient_reported',
  notes TEXT,
  recorded_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  procedure_name VARCHAR(255) NOT NULL,
  procedure_date DATE,
  approximate_year INTEGER,
  reason TEXT,
  facility VARCHAR(255),
  complications TEXT,
  notes TEXT,
  source record_source NOT NULL DEFAULT 'patient_reported',
  recorded_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE hospitalisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  admission_date DATE,
  discharge_date DATE,
  facility VARCHAR(255),
  reason TEXT,
  discharge_notes TEXT,
  source record_source NOT NULL DEFAULT 'patient_reported',
  recorded_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ─── Medications ──────────────────────────────────────────────────────────────
CREATE TABLE patient_medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  medicine_name_snapshot VARCHAR(255) NOT NULL,
  generic_name_snapshot VARCHAR(255),
  strength_snapshot VARCHAR(100),
  dosage_form_snapshot VARCHAR(100),
  dose_amount VARCHAR(100),
  dose_unit VARCHAR(50),
  route VARCHAR(100),
  frequency VARCHAR(100),
  instructions TEXT,
  indication TEXT,
  start_date DATE,
  end_date DATE,
  status medication_status NOT NULL DEFAULT 'active',
  prescriber_name VARCHAR(255),
  source record_source NOT NULL DEFAULT 'patient_reported',
  adherence_status VARCHAR(100),
  side_effects_notes TEXT,
  last_reviewed_at TIMESTAMP,
  last_reviewed_by UUID REFERENCES users(id),
  recorded_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_patient_medications_patient ON patient_medications(patient_id);
CREATE INDEX idx_patient_medications_status ON patient_medications(status);

CREATE TABLE medication_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_medication_id UUID NOT NULL REFERENCES patient_medications(id),
  patient_id UUID NOT NULL REFERENCES patients(id),
  encounter_id UUID,
  change_type medication_change_type NOT NULL,
  previous_values JSONB,
  new_values JSONB,
  reason TEXT,
  source record_source NOT NULL DEFAULT 'patient_reported',
  changed_by UUID NOT NULL REFERENCES users(id),
  changed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_medication_changes_medication ON medication_changes(patient_medication_id);
CREATE INDEX idx_medication_changes_patient ON medication_changes(patient_id);

CREATE TABLE medication_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  encounter_id UUID NOT NULL,
  reviewed_by UUID NOT NULL REFERENCES users(id),
  reviewed_at TIMESTAMP DEFAULT NOW(),
  reconciliation_status reconciliation_status NOT NULL DEFAULT 'not_completed',
  problems_identified TEXT,
  actions_taken TEXT,
  referral_details TEXT,
  outcome TEXT,
  follow_up_at DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ─── Encounters ───────────────────────────────────────────────────────────────
CREATE TABLE encounters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  encounter_number VARCHAR(20),
  encounter_type encounter_type NOT NULL DEFAULT 'routine_checkup',
  status encounter_status NOT NULL DEFAULT 'in_progress',
  reason TEXT,
  presenting_complaint TEXT,
  symptoms TEXT,
  clinical_notes TEXT,
  assessment_summary TEXT,
  plan_summary TEXT,
  referral_details TEXT,
  assigned_user_id UUID REFERENCES users(id),
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  amended_at TIMESTAMP,
  amendment_reason TEXT
);

CREATE INDEX idx_encounters_patient ON encounters(patient_id);
CREATE INDEX idx_encounters_status ON encounters(status);
CREATE INDEX idx_encounters_started_at ON encounters(started_at);

-- Add FK from medication_changes to encounters now that encounters exists
ALTER TABLE medication_changes ADD CONSTRAINT fk_medication_changes_encounter
  FOREIGN KEY (encounter_id) REFERENCES encounters(id);

ALTER TABLE medication_reviews ADD CONSTRAINT fk_medication_reviews_encounter
  FOREIGN KEY (encounter_id) REFERENCES encounters(id);

CREATE TABLE observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  encounter_id UUID REFERENCES encounters(id),
  observation_type VARCHAR(100) NOT NULL,
  value_numeric DECIMAL(10,4),
  value_text TEXT,
  value_json JSONB,
  unit VARCHAR(50),
  context VARCHAR(255),
  measured_at TIMESTAMP DEFAULT NOW(),
  source record_source NOT NULL DEFAULT 'patient_reported',
  recorded_by UUID NOT NULL REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_observations_patient ON observations(patient_id);
CREATE INDEX idx_observations_encounter ON observations(encounter_id);
CREATE INDEX idx_observations_type ON observations(observation_type);

CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  encounter_id UUID NOT NULL REFERENCES encounters(id),
  assessment_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  evidence_notes TEXT,
  recorded_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE care_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  encounter_id UUID NOT NULL REFERENCES encounters(id),
  goal_or_problem TEXT NOT NULL,
  action TEXT NOT NULL,
  rationale TEXT,
  responsible_user_id UUID REFERENCES users(id),
  due_at DATE,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  outcome TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE encounter_interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encounter_id UUID NOT NULL REFERENCES encounters(id),
  intervention_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  rationale TEXT,
  outcome TEXT,
  recorded_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ─── Follow-ups ───────────────────────────────────────────────────────────────
CREATE TABLE follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  related_encounter_id UUID REFERENCES encounters(id),
  reason TEXT NOT NULL,
  due_at TIMESTAMP NOT NULL,
  status follow_up_status NOT NULL DEFAULT 'scheduled',
  assigned_user_id UUID REFERENCES users(id),
  completed_at TIMESTAMP,
  outcome_notes TEXT,
  next_follow_up_at TIMESTAMP,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_follow_ups_patient ON follow_ups(patient_id);
CREATE INDEX idx_follow_ups_status ON follow_ups(status);
CREATE INDEX idx_follow_ups_due_at ON follow_ups(due_at);

-- ─── Test Orders & Results ────────────────────────────────────────────────────
CREATE TABLE test_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  encounter_id UUID REFERENCES encounters(id),
  test_name VARCHAR(255) NOT NULL,
  requested_by UUID NOT NULL REFERENCES users(id),
  requested_at TIMESTAMP DEFAULT NOW(),
  facility VARCHAR(255),
  status test_order_status NOT NULL DEFAULT 'requested',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_order_id UUID REFERENCES test_orders(id),
  patient_id UUID NOT NULL REFERENCES patients(id),
  encounter_id UUID REFERENCES encounters(id),
  test_name VARCHAR(255) NOT NULL,
  result_value TEXT,
  unit VARCHAR(100),
  reference_range VARCHAR(255),
  specimen_type VARCHAR(100),
  collected_at TIMESTAMP,
  result_at TIMESTAMP,
  facility VARCHAR(255),
  status test_result_status NOT NULL DEFAULT 'preliminary',
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  follow_up_action TEXT,
  previous_result_id UUID REFERENCES test_results(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ─── Clinical Documents ───────────────────────────────────────────────────────
CREATE TABLE clinical_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  encounter_id UUID REFERENCES encounters(id),
  original_filename VARCHAR(255) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  category document_category NOT NULL DEFAULT 'other',
  storage_key VARCHAR(500) NOT NULL,
  content_type VARCHAR(100) NOT NULL,
  file_size_bytes INTEGER NOT NULL,
  checksum VARCHAR(64),
  source_date DATE,
  uploaded_by UUID NOT NULL REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_clinical_documents_patient ON clinical_documents(patient_id);

-- ─── Consent ──────────────────────────────────────────────────────────────────
CREATE TABLE consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  purpose VARCHAR(255) NOT NULL,
  status consent_status NOT NULL DEFAULT 'not_recorded',
  method VARCHAR(100),
  notice_version VARCHAR(50),
  scope TEXT,
  expiry_date DATE,
  recorded_by UUID NOT NULL REFERENCES users(id),
  recorded_at TIMESTAMP DEFAULT NOW(),
  withdrawn_at TIMESTAMP,
  notes TEXT
);

-- ─── Audit Log ────────────────────────────────────────────────────────────────
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(255),
  outcome VARCHAR(20) NOT NULL DEFAULT 'success',
  reason TEXT,
  correlation_id VARCHAR(100),
  safe_metadata JSONB,
  occurred_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_occurred_at ON audit_logs(occurred_at);

-- ─── Seed: default admin ──────────────────────────────────────────────────────
-- Password: Admin@123 (bcrypt hash — change before production)
INSERT INTO users (first_name, last_name, email, password_hash, role)
VALUES ('Admin', 'User', 'admin@pharmacare.local', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
