# ADR-003: Tenant Isolation via PostgreSQL Row Level Security

**Status:** Accepted

---

## Context

RIMS is a multi-tenant SaaS platform. Multiple institutions share the same database. A critical requirement is that no institution can read, write, or infer data belonging to another institution.

Isolation strategies considered:

1. **Separate databases per tenant** — maximum isolation, simplest reasoning about data. But: complex provisioning, high resource overhead, schema migrations must run N times, no cross-tenant analytics.
2. **Separate schemas per tenant** — good isolation, one database, but search_path management is complex with Prisma; migrations are non-trivial.
3. **Shared schema with application-layer filtering** — all tables have a `tenant_id` column; every query adds `WHERE tenant_id = :id`. Simple to implement, but one missed filter = data breach. High risk.
4. **Shared schema with PostgreSQL Row Level Security (RLS)** — `tenant_id` on every table; the database enforces filtering via policies. Even if application code omits a filter, the database will not return cross-tenant rows.

---

## Decision

Use **PostgreSQL Row Level Security (RLS)** on all tenant-owned tables.

Design:
- Every tenant-owned table carries a `tenant_id UUID NOT NULL` column with an index.
- Before any query, the application calls `SELECT set_tenant_context(:tenantId::uuid)` which sets the session-local config variable `app.current_tenant_id`.
- A single RLS policy on each table enforces: `USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid)`.
- The `app_role` (used at runtime) does not have `BYPASSRLS`.
- The `migration_role` (used only during `prisma migrate deploy`) has `BYPASSRLS` to allow schema migrations.
- The `set_tenant_context()` PL/pgSQL function is `SECURITY DEFINER` — it cannot be bypassed from the application layer.

---

## Consequences

**Positive:**
- Defence in depth: even a complete application-layer bug cannot return cross-tenant data.
- Centralised isolation logic in the database — one place to audit and test.
- No performance overhead for correctly scoped queries (index on tenant_id covers the policy check).
- Prisma migrations use the bypass role and are unaffected.

**Negative:**
- Prisma connection pool must ensure `set_tenant_context()` is called on the same connection before each query — requires careful async context management (see OD-005).
- Tables without a direct `tenant_id` (e.g. `employee_qualifications`) need sub-select policies, which are slightly more expensive.
- Cross-tenant superadmin queries (platform admin analytics) require switching to the `migration_role` — must be strictly controlled.
- RLS policies must be updated whenever a new tenant-owned table is added — documented as a required step in the table creation checklist.
