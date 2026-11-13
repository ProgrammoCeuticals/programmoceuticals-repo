-- ─────────────────────────────────────────────────────────────────────────────
-- RIMS Migration: RLS Setup
-- Runs after the initial schema migration.
-- Sets up DB roles, Row Level Security, and the tenant context helper.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Roles ───────────────────────────────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_role') THEN
    CREATE ROLE app_role LOGIN PASSWORD 'app_role_change_in_prod' NOINHERIT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'migration_role') THEN
    CREATE ROLE migration_role BYPASSRLS;
  END IF;
END $$;

GRANT migration_role TO app_role;
GRANT CONNECT ON DATABASE rims_dev TO app_role;
GRANT USAGE ON SCHEMA public TO app_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_role;

-- ─── Tenant Context Helper ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_tenant_context(p_tenant_id uuid)
  RETURNS void LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  PERFORM set_config('app.current_tenant_id', p_tenant_id::text, true);
END;
$$;

GRANT EXECUTE ON FUNCTION set_tenant_context(uuid) TO app_role;

-- ─── Enable RLS on all tenant-owned tables ────────────────────────────────────
ALTER TABLE tenants                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_domains             ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_settings            ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_module_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions              ENABLE ROW LEVEL SECURITY;
ALTER TABLE users                      ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tenant_memberships    ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles                      ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_role_assignments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations                ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutions               ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments                ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams                      ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_qualifications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_skills            ENABLE ROW LEVEL SECURITY;
ALTER TABLE employment_records         ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events               ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_projects          ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_cycles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_definitions            ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_assignments            ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_results                ENABLE ROW LEVEL SECURITY;
ALTER TABLE manuscripts                ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_budgets            ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_reviews            ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_findings           ENABLE ROW LEVEL SECURITY;
ALTER TABLE corrective_actions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications              ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records              ENABLE ROW LEVEL SECURITY;

-- ─── RLS Policies ─────────────────────────────────────────────────────────────
CREATE POLICY tenant_isolation ON tenants
  USING (id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON tenant_domains
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON tenant_settings
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON tenant_module_entitlements
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON subscriptions
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON users
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON user_tenant_memberships
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON sessions
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON roles
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON user_role_assignments
  USING (role_id IN (SELECT id FROM roles WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid));
CREATE POLICY tenant_isolation ON invitations
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON institutions
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON departments
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON teams
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON employees
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON employee_qualifications
  USING (employee_id IN (SELECT id FROM employees WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid));
CREATE POLICY tenant_isolation ON employee_skills
  USING (employee_id IN (SELECT id FROM employees WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid));
CREATE POLICY tenant_isolation ON employment_records
  USING (employee_id IN (SELECT id FROM employees WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid));
CREATE POLICY tenant_isolation ON audit_events
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON research_projects
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON performance_cycles
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON kpi_definitions
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON kpi_assignments
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON kpi_results
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON manuscripts
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON project_budgets
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON expenses
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON quality_reviews
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON quality_findings
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON corrective_actions
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON documents
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON notifications
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
CREATE POLICY tenant_isolation ON usage_records
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
