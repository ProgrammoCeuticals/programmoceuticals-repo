# RIMS — Database Design

## Tenancy Model

RIMS uses a **shared-schema, shared-database** multi-tenancy model with **PostgreSQL Row Level Security (RLS)** for isolation. Every tenant-owned table carries a `tenant_id` UUID column. Before any query executes, the application calls:

```sql
SELECT set_tenant_context('<tenant-uuid>'::uuid);
```

This sets the session-local config variable `app.current_tenant_id`. RLS policies on every tenant table enforce:

```sql
USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid)
```

The superuser (`rims_dev`) and `migration_role` (used only during `prisma migrate deploy`) have `BYPASSRLS`. The application runtime user (`app_role`) never has bypass rights.

---

## Entity Descriptions

### Tenants & Settings

| Table                         | Purpose                                              |
|-------------------------------|------------------------------------------------------|
| `tenants`                     | Top-level tenant record — name, slug, status         |
| `tenant_domains`              | Allowed email domains per tenant                     |
| `tenant_settings`             | MFA policy, locale, timezone, session timeout        |
| `tenant_module_entitlements`  | Which modules (feature flags) each tenant has access to |

### Billing

| Table               | Purpose                                             |
|---------------------|-----------------------------------------------------|
| `subscription_plans` | Plan definitions (price, max users, features JSON) |
| `subscriptions`     | Active subscription per tenant, with status + dates |

### Users & Auth

| Table                    | Purpose                                              |
|--------------------------|------------------------------------------------------|
| `users`                  | Platform user accounts — email, passwordHash, status |
| `user_tenant_memberships`| Records which users belong to which tenants          |
| `sessions`               | Refresh token sessions (tokenHash, expiry, revocation)|

### RBAC

| Table                  | Purpose                                               |
|------------------------|-------------------------------------------------------|
| `roles`                | Named roles per tenant (system or custom)             |
| `permissions`          | Atomic permission codes (e.g. `employees:write`)      |
| `role_permissions`     | M:M join — which permissions belong to which role     |
| `user_role_assignments`| M:M join — which roles are assigned to which user     |

### Invitations

| Table         | Purpose                                                        |
|---------------|----------------------------------------------------------------|
| `invitations` | Time-limited invite tokens — type (STAFF/ADMIN/EMPLOYEE), status |

### Organisation

| Table          | Purpose                                                    |
|----------------|------------------------------------------------------------|
| `institutions` | One-to-one with tenant — physical institution details      |
| `departments`  | Recursive tree — supports unlimited nesting via `parent_id`|
| `teams`        | Flat groupings within a department                         |
| `positions`    | Job titles/grades catalogue per tenant                     |

### Employees

| Table                    | Purpose                                          |
|--------------------------|--------------------------------------------------|
| `employees`              | Employee records — may or may not have a user account |
| `employee_qualifications`| Academic or professional credentials             |
| `employee_skills`        | Free-form skill tags with optional level         |
| `employment_records`     | Immutable event log: hire, transfer, promotion, termination |

### Audit

| Table         | Purpose                                                          |
|---------------|------------------------------------------------------------------|
| `audit_events`| Append-only audit trail — actor, action, before/after JSON state|

---

## Key Relationships

```
Tenant (1) ──── (N) User
Tenant (1) ──── (1) Institution
Institution (1) ──── (N) Department
Department (1) ──── (N) Department (self-ref parent/children)
Department (1) ──── (N) Team
Team (1) ──── (N) Employee
Employee (N) ──── (1) User (optional — not all employees have accounts)
Role (N) ──── (M) Permission  (via role_permissions)
User (N) ──── (M) Role        (via user_role_assignments)
```

---

## Index Strategy

All indexes are chosen to support the most common query patterns:

| Table        | Index columns                       | Query pattern                     |
|--------------|-------------------------------------|-----------------------------------|
| `users`      | `(tenant_id, status)`               | List users by status              |
| `employees`  | `(tenant_id, status, department_id)`| Filter employees by dept/status   |
| `departments`| `(tenant_id, status)`               | List active departments           |
| `roles`      | `(tenant_id)`                       | List tenant roles                 |
| `invitations`| `(tenant_id, type)`                 | List invitations by type          |
| `sessions`   | `(token_hash)`                      | Lookup session by token           |
| `audit_events`| `(tenant_id, resource_type, created_at)` | Audit search with date range |

---

## RLS Approach

The `set_tenant_context()` function is defined as `SECURITY DEFINER` to prevent tenant ID spoofing from the application layer. The application can only call the function — it cannot directly write to `app.current_tenant_id` via `SET LOCAL`.

Tables that lack a direct `tenant_id` column (e.g. `employee_qualifications`) use a sub-select RLS policy that joins back through `employees.tenant_id`. This ensures isolation even for deeply nested records.

---

## Constraints Not Expressible in Prisma DSL

The following constraints must be added via raw SQL after migration:

```sql
-- Prevent department hierarchy cycles
-- (enforced at application layer in DepartmentService — DB-level cycle check
--  is deferred to a future migration using a recursive CTE trigger)
```

These are documented as open decisions. See `docs/OPEN_DECISIONS.md`.
