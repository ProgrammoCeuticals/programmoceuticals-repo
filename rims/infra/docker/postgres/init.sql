-- ─────────────────────────────────────────────────────────────────────────────
-- RIMS PostgreSQL Initialisation Script
-- Runs once when the Postgres container is first created.
-- Creates the application user used at runtime (distinct from the superuser).
-- ─────────────────────────────────────────────────────────────────────────────

-- Application user — limited privileges, no superuser rights.
-- Actual table-level grants are applied by the RLS migration.
CREATE USER rims_app WITH PASSWORD 'rims_app_secret';

-- Grant connection rights on the primary database
GRANT ALL ON DATABASE rims_dev TO rims_app;
