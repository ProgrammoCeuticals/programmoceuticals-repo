-- Sprint 1 schema additions
-- S-001: employee_certifications
-- S-002: reporting_manager_id on employees
-- S-003: performance_evaluations
-- S-004: performance_evidence
-- S-005: improvement_plans
-- S-006: project_deliverables
-- S-007: mfa_methods
-- S-008: strategic_objectives

-- Enums
CREATE TYPE "mfa_method_type" AS ENUM ('TOTP');
CREATE TYPE "performance_evidence_type" AS ENUM ('FILE', 'LINK', 'TEXT');
CREATE TYPE "performance_evaluation_status" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'LOCKED');
CREATE TYPE "improvement_plan_status" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'CLOSED');
CREATE TYPE "strategic_objective_status" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED');

-- S-002: reporting manager self-reference on employees
ALTER TABLE "employees" ADD COLUMN IF NOT EXISTS "reporting_manager_id" TEXT;
ALTER TABLE "employees" ADD CONSTRAINT "employees_reporting_manager_id_fkey"
  FOREIGN KEY ("reporting_manager_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- S-001: employee_certifications
CREATE TABLE "employee_certifications" (
  "id"             TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "employee_id"    TEXT NOT NULL,
  "name"           TEXT NOT NULL,
  "issuing_body"   TEXT,
  "licence_number" TEXT,
  "issued_at"      DATE,
  "expires_at"     DATE,
  "document_ref"   TEXT,
  "created_at"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "employee_certifications_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "employee_certifications_employee_id_idx" ON "employee_certifications"("employee_id");
ALTER TABLE "employee_certifications" ADD CONSTRAINT "employee_certifications_employee_id_fkey"
  FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- S-008: strategic_objectives
CREATE TABLE "strategic_objectives" (
  "id"            TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "tenant_id"     TEXT NOT NULL,
  "title"         TEXT NOT NULL,
  "description"   TEXT,
  "start_year"    INTEGER,
  "end_year"      INTEGER,
  "status"        "strategic_objective_status" NOT NULL DEFAULT 'ACTIVE',
  "created_by_id" TEXT,
  "created_at"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "strategic_objectives_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "strategic_objectives_tenant_id_status_idx" ON "strategic_objectives"("tenant_id", "status");
ALTER TABLE "strategic_objectives" ADD CONSTRAINT "strategic_objectives_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add strategic_objective_id to performance_objectives
ALTER TABLE "performance_objectives" ADD COLUMN IF NOT EXISTS "strategic_objective_id" TEXT;
ALTER TABLE "performance_objectives" ADD CONSTRAINT "performance_objectives_strategic_objective_id_fkey"
  FOREIGN KEY ("strategic_objective_id") REFERENCES "strategic_objectives"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- S-004: performance_evidence
CREATE TABLE "performance_evidence" (
  "id"             TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "tenant_id"      TEXT NOT NULL,
  "kpi_result_id"  TEXT NOT NULL,
  "evidence_type"  "performance_evidence_type" NOT NULL,
  "description"    TEXT NOT NULL,
  "file_key"       TEXT,
  "url"            TEXT,
  "uploaded_by_id" TEXT,
  "created_at"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "performance_evidence_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "performance_evidence_tenant_id_kpi_result_id_idx" ON "performance_evidence"("tenant_id", "kpi_result_id");
ALTER TABLE "performance_evidence" ADD CONSTRAINT "performance_evidence_kpi_result_id_fkey"
  FOREIGN KEY ("kpi_result_id") REFERENCES "kpi_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- S-003: performance_evaluations
CREATE TABLE "performance_evaluations" (
  "id"                TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "tenant_id"         TEXT NOT NULL,
  "cycle_id"          TEXT NOT NULL,
  "subject_type"      TEXT NOT NULL,
  "subject_id"        TEXT NOT NULL,
  "evaluator_id"      TEXT,
  "overall_score"     DECIMAL(5,2),
  "scoring_band"      TEXT,
  "narrative_summary" TEXT,
  "status"            "performance_evaluation_status" NOT NULL DEFAULT 'DRAFT',
  "created_at"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "performance_evaluations_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "performance_evaluations_tenant_id_cycle_id_subject_id_idx"
  ON "performance_evaluations"("tenant_id", "cycle_id", "subject_id");
ALTER TABLE "performance_evaluations" ADD CONSTRAINT "performance_evaluations_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "performance_evaluations" ADD CONSTRAINT "performance_evaluations_cycle_id_fkey"
  FOREIGN KEY ("cycle_id") REFERENCES "performance_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- S-005: improvement_plans
CREATE TABLE "improvement_plans" (
  "id"            TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "tenant_id"     TEXT NOT NULL,
  "employee_id"   TEXT NOT NULL,
  "cycle_id"      TEXT,
  "title"         TEXT NOT NULL,
  "description"   TEXT,
  "status"        "improvement_plan_status" NOT NULL DEFAULT 'DRAFT',
  "owner_id"      TEXT,
  "due_date"      DATE,
  "closed_at"     TIMESTAMP(3),
  "created_by_id" TEXT,
  "created_at"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "improvement_plans_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "improvement_plans_tenant_id_employee_id_status_idx"
  ON "improvement_plans"("tenant_id", "employee_id", "status");
ALTER TABLE "improvement_plans" ADD CONSTRAINT "improvement_plans_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "improvement_plans" ADD CONSTRAINT "improvement_plans_employee_id_fkey"
  FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "improvement_plans" ADD CONSTRAINT "improvement_plans_cycle_id_fkey"
  FOREIGN KEY ("cycle_id") REFERENCES "performance_cycles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- S-006: project_deliverables
CREATE TABLE "project_deliverables" (
  "id"                  TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "tenant_id"           TEXT NOT NULL,
  "research_project_id" TEXT NOT NULL,
  "title"               TEXT NOT NULL,
  "description"         TEXT,
  "due_date"            DATE,
  "delivered_at"        TIMESTAMP(3),
  "status"              TEXT NOT NULL DEFAULT 'PENDING',
  "owner_id"            TEXT,
  "created_at"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "project_deliverables_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "project_deliverables_tenant_id_research_project_id_idx"
  ON "project_deliverables"("tenant_id", "research_project_id");
ALTER TABLE "project_deliverables" ADD CONSTRAINT "project_deliverables_research_project_id_fkey"
  FOREIGN KEY ("research_project_id") REFERENCES "research_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- S-007: mfa_methods
CREATE TABLE "mfa_methods" (
  "id"         TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "user_id"    TEXT NOT NULL,
  "tenant_id"  TEXT NOT NULL,
  "type"       "mfa_method_type" NOT NULL DEFAULT 'TOTP',
  "secret"     TEXT NOT NULL,
  "verified"   BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "mfa_methods_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "mfa_methods_user_id_type_key" UNIQUE ("user_id", "type")
);
CREATE INDEX "mfa_methods_tenant_id_idx" ON "mfa_methods"("tenant_id");
ALTER TABLE "mfa_methods" ADD CONSTRAINT "mfa_methods_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "mfa_methods" ADD CONSTRAINT "mfa_methods_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RLS policies for new tenant-owned tables
ALTER TABLE "employee_certifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "strategic_objectives" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "performance_evidence" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "performance_evaluations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "improvement_plans" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "project_deliverables" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "mfa_methods" ENABLE ROW LEVEL SECURITY;

-- employee_certifications: join through employees (tenant_id is text)
CREATE POLICY "tenant_isolation_employee_certifications"
  ON "employee_certifications"
  USING (
    "employee_id" IN (
      SELECT id FROM employees
      WHERE tenant_id = current_setting('app.current_tenant_id', true)
    )
  );

CREATE POLICY "tenant_isolation_strategic_objectives"
  ON "strategic_objectives"
  USING ("tenant_id" = current_setting('app.current_tenant_id', true));

CREATE POLICY "tenant_isolation_performance_evidence"
  ON "performance_evidence"
  USING ("tenant_id" = current_setting('app.current_tenant_id', true));

CREATE POLICY "tenant_isolation_performance_evaluations"
  ON "performance_evaluations"
  USING ("tenant_id" = current_setting('app.current_tenant_id', true));

CREATE POLICY "tenant_isolation_improvement_plans"
  ON "improvement_plans"
  USING ("tenant_id" = current_setting('app.current_tenant_id', true));

CREATE POLICY "tenant_isolation_project_deliverables"
  ON "project_deliverables"
  USING ("tenant_id" = current_setting('app.current_tenant_id', true));

CREATE POLICY "tenant_isolation_mfa_methods"
  ON "mfa_methods"
  USING ("tenant_id" = current_setting('app.current_tenant_id', true));
