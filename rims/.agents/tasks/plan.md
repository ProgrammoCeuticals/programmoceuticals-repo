# RIMS Implementation Plan — Phase 0 & Phase 1

**Project:** Research Institute Management System (RIMS) by ProgrammoCeuticals  
**Monorepo root:** `/Users/macbookpro/Desktop/ProgrammoCeuticals/rims/`  
**Package manager:** pnpm workspaces + Turborepo  
**Build approach:** Follows the pattern of `pharmacy-internship-platform` and `ectd/ectd-platform`

---

## Architecture Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Monorepo tooling | pnpm + Turborepo | Matches the two reference monorepos already in this workspace (`pharmacy-internship-platform`, `ectd/ectd-platform`) |
| API framework | NestJS 10 + TypeScript strict | All ProgrammoCeuticals backend projects use NestJS; Argon2 (not bcrypt) required by spec |
| Frontend | React 19 + Vite + TypeScript + Tailwind | Specified explicitly; avoids Next.js SSR overhead for a SPA admin tool |
| State / data | Zustand (auth context) + TanStack Query | Matches `ectd/ectd-platform/apps/web` dependencies |
| ORM | Prisma 5 with PostgreSQL 15 | All multi-tenant ProgrammoCeuticals projects use Prisma |
| Multi-tenancy | Row-Level Security in Postgres + `current_setting('app.current_tenant_id')` | Spec requires RLS; stronger than app-layer filtering |
| Auth tokens | JWT access (15 min) + HttpOnly refresh cookie (7 d, rotate-on-use) | Required by spec; sessions table enables revocation |
| Password hashing | Argon2id via `argon2` npm package | Spec-required; ectd-platform already uses `argon2@0.41.1` |
| Job queues | BullMQ + Redis | Used in pharmacy-internship and ectd platforms |
| Test runner | Jest (API) + Vitest (web) | Matches pattern: Jest in NestJS apps, Vitest in Vite apps |

---

## Implementation Order

### PHASE 0 — Infrastructure & Scaffold

- [ ] 1. **Create monorepo root scaffold**
      Create the directory tree: `apps/web`, `apps/api`, `apps/worker`, `packages/shared-types`, `packages/validation`, `packages/api-client`, `packages/ui`, `packages/config`, `prisma/`, `docs/`, `infra/docker/`, `infra/nginx/`.
      Files: `rims/package.json`, `rims/pnpm-workspace.yaml`, `rims/turbo.json`, `rims/.gitignore`, `rims/.nvmrc`, `rims/README.md`
      Verify: `pnpm install` from `rims/` resolves without errors; `pnpm turbo run build --dry` lists all workspaces.

- [ ] 2. **Configure `packages/config` — shared tsconfig bases and ESLint/Prettier**
      Create `tsconfig.base.json` (strict mode, ES2022, composite, decorators, `emitDecoratorMetadata`). Create `tsconfig.nestjs.json` (extends base, adds `commonjs` module). Create `tsconfig.vite.json` (extends base, `ESNext` module, `bundler` resolution). Root `.eslintrc.js` with `@typescript-eslint/recommended` + `import` plugin. Root `.prettierrc` (single quotes, 2 spaces, trailing commas). `packages/config/package.json`.
      Files: `packages/config/tsconfig.base.json`, `packages/config/tsconfig.nestjs.json`, `packages/config/tsconfig.vite.json`, `packages/config/.eslintrc.js`, `.eslintrc.js` (root), `.prettierrc` (root), `packages/config/package.json`
      Verify: `pnpm lint` from root runs without errors on empty workspaces.

- [ ] 3. **Bootstrap `packages/shared-types`**
      Define all shared enums and TypeScript interfaces: `UserStatus`, `TenantStatus`, `EmployeeStatus`, `SubscriptionStatus`, `InvitationStatus`, `PermissionScope`, `AuditOutcome`, pagination types (`PaginatedResult<T>`), API envelope types (`ApiResponse<T>`, `ApiError`), JWT payload type.
      Files: `packages/shared-types/src/index.ts`, `packages/shared-types/src/enums.ts`, `packages/shared-types/src/types.ts`, `packages/shared-types/package.json`, `packages/shared-types/tsconfig.json`
      Verify: `pnpm --filter @rims/shared-types build` exits 0; `tsc --noEmit` passes.

- [ ] 4. **Bootstrap `packages/validation`**
      Create Zod schemas for all shared validation: login, pagination query, invitation, user create/update, department, employee. Re-export types inferred from schemas.
      Files: `packages/validation/src/index.ts`, `packages/validation/src/auth.schemas.ts`, `packages/validation/src/user.schemas.ts`, `packages/validation/src/organization.schemas.ts`, `packages/validation/src/employee.schemas.ts`, `packages/validation/package.json`, `packages/validation/tsconfig.json`
      Verify: `pnpm --filter @rims/validation build` exits 0.

- [ ] 5. **Write Prisma schema**
      Full schema with all tables specified. Every model uses UUID PK (`@id @default(uuid())`), `@@map` for snake_case table names, `@map` for snake_case column names, `createdAt`/`updatedAt`/`createdBy`/`updatedBy` where specified. Indexes on `tenantId`, `status`, FK columns. Tables:
        - `tenants`, `tenant_domains`, `tenant_settings`, `tenant_module_entitlements`
        - `subscription_plans`, `subscriptions`
        - `users`, `user_tenant_memberships`, `sessions`
        - `roles`, `permissions`, `role_permissions`, `user_role_assignments`
        - `invitations`
        - `institutions`, `departments`, `teams`, `positions`
        - `employees`, `employee_qualifications`, `employee_skills`, `employment_records`
        - `audit_events`
      Files: `prisma/schema.prisma`
      Verify: `pnpm prisma validate --schema=prisma/schema.prisma` exits 0.

- [ ] 6. **Set up Docker Compose for local dev**
      PostgreSQL 15-alpine (`rims_dev` DB, `rims_dev` user), Redis 7-alpine, Adminer (port 8080). Health checks on all services. Named volumes.
      Files: `docker-compose.yml`, `infra/docker/postgres/init.sql` (creates app_role and migration_role, sets search_path)
      Verify: `docker compose up -d` starts all three containers healthy; `docker compose ps` shows `(healthy)` for postgres and redis.

- [ ] 7. **Write PostgreSQL RLS migration**
      Raw SQL migration creating: `app_role` (cannot bypass RLS), `migration_role` (bypasses RLS via `BYPASSRLS`). Enable RLS on all tenant-owned tables. Create policies: `SELECT/INSERT/UPDATE/DELETE` using `current_setting('app.current_tenant_id', true)::uuid`. Add helper function `set_tenant_context(tenant_id uuid)`. Migration role used only by Prisma `migrate deploy`.
      Files: `prisma/migrations/0001_rls_policies/migration.sql`
      Verify: After `pnpm prisma migrate dev`, connect as `app_role` and confirm `SELECT` without setting context returns 0 rows on any tenant-owned table.

- [ ] 8. **Bootstrap `apps/api` — NestJS application**
      Create NestJS app with: `ConfigModule` (Joi env validation), `PrismaModule` (global, using `PrismaService` pattern from `pharmacy-internship-platform`), `ThrottlerModule` (global rate limit 100 req/15s), `HelmetModule`. `main.ts`: global prefix `/api/v1`, `ValidationPipe` (whitelist, forbidNonWhitelisted, transform), `HttpExceptionFilter`, correlation ID middleware (sets `x-request-id` header + stores on `AsyncLocalStorage`), Swagger at `/api/docs`, CORS (configured from env), cookie-parser. `GET /api/v1/health` → `{ status: 'ok', uptime: ..., timestamp: ... }`. Environment variables validated on startup (throw if missing required vars).
      Files: `apps/api/src/main.ts`, `apps/api/src/app.module.ts`, `apps/api/src/modules/health/health.controller.ts`, `apps/api/src/common/filters/http-exception.filter.ts`, `apps/api/src/common/middleware/correlation-id.middleware.ts`, `apps/api/src/common/middleware/tenant.middleware.ts` (stub), `apps/api/src/config/env.validation.ts`, `apps/api/src/modules/prisma/prisma.module.ts`, `apps/api/src/modules/prisma/prisma.service.ts`, `apps/api/package.json`, `apps/api/tsconfig.json`, `apps/api/nest-cli.json`
      Verify: `pnpm --filter @rims/api dev` starts; `curl http://localhost:3000/api/v1/health` returns `{"status":"ok",...}`; `curl http://localhost:3000/api/docs` returns HTML.

- [ ] 9. **Bootstrap `apps/web` — React + Vite frontend**
      Vite 6 + React 19 + TypeScript. Tailwind CSS 4 (using `@tailwindcss/vite` plugin, per `logbookbuilder` pattern). React Router v6 with `createBrowserRouter`, lazy-loaded route modules. TanStack Query v5 provider at root. Zustand auth store stub. App shell layout (sidebar + topbar + outlet), auth context, `/login` route, a health-check status page at `/`, a catch-all 404 page. Proxy `/api` → `http://localhost:3000` in `vite.config.ts`.
      Files: `apps/web/src/main.tsx`, `apps/web/src/App.tsx`, `apps/web/src/router.tsx`, `apps/web/src/layouts/AppShell.tsx`, `apps/web/src/layouts/AuthLayout.tsx`, `apps/web/src/pages/LoginPage.tsx` (stub), `apps/web/src/pages/StatusPage.tsx`, `apps/web/src/store/auth.store.ts`, `apps/web/src/lib/query-client.ts`, `apps/web/index.html`, `apps/web/vite.config.ts`, `apps/web/tailwind.config.ts`, `apps/web/tsconfig.json`, `apps/web/package.json`
      Verify: `pnpm --filter @rims/web dev` starts on port 5173; `GET /` renders status page; `GET /login` renders login stub.

- [ ] 10. **Bootstrap `apps/worker` — BullMQ worker process**
       Minimal NestJS worker app. Two queue workers: `email` queue (process email send jobs, log but do not send in dev), `notifications` queue (stub). BullMQ connected to Redis via env var. Graceful shutdown on SIGTERM.
       Files: `apps/worker/src/main.ts`, `apps/worker/src/app.module.ts`, `apps/worker/src/workers/email.worker.ts`, `apps/worker/src/workers/notifications.worker.ts`, `apps/worker/package.json`, `apps/worker/tsconfig.json`
       Verify: `pnpm --filter @rims/worker dev` starts without crashing; Redis connection established.

- [ ] 11. **Write `.env.example` and document all variables**
       Every environment variable with description, example value, and whether required or optional. Groups: Database, Redis, JWT, API, Web, Feature flags.
       Files: `.env.example`
       Verify: Manual review confirms all variables referenced in `env.validation.ts` are present in `.env.example`.

- [ ] 12. **Write Phase 0 documentation**
       Files: `docs/PRODUCT_REQUIREMENTS.md`, `docs/ARCHITECTURE.md`, `docs/DATABASE_DESIGN.md`, `docs/IMPLEMENTATION_PLAN.md`, `docs/OPEN_DECISIONS.md`, `docs/decisions/ADR-001-monorepo.md`, `docs/decisions/ADR-002-modular-monolith.md`, `docs/decisions/ADR-003-tenant-isolation.md`, updated `README.md`.
       Verify: All files exist and are non-empty; `README.md` contains quick-start instructions.

---

### PHASE 1 — Backend Modules

*Dependencies: Phase 0 complete, Prisma schema migrated, Docker Compose running.*

- [ ] 13. **Implement `packages/api-client`**
        Typed axios-based client generated from OpenAPI or handwritten. Exports functions for every API endpoint added in Phase 1. Used by the frontend — not by the API itself. `axios` instance with interceptors: attach `Authorization: Bearer <token>` from Zustand store, handle 401 → refresh flow, handle 403.
        Files: `packages/api-client/src/index.ts`, `packages/api-client/src/client.ts`, `packages/api-client/src/endpoints/*.ts`, `packages/api-client/package.json`, `packages/api-client/tsconfig.json`
        Verify: `pnpm --filter @rims/api-client build` exits 0; TypeScript strict mode passes.

- [ ] 14. **Implement Auth module — backend**
        `apps/api/src/modules/auth/`. Endpoints: `POST /login`, `POST /refresh`, `POST /logout`, `POST /forgot-password`, `POST /reset-password`, `POST /accept-invitation`.
        Implementation details:
        - Argon2id via `argon2` package (already used in ectd-platform)
        - Access token: JWT, 15 min, signed with `JWT_ACCESS_SECRET`
        - Refresh token: opaque random bytes, stored hashed (SHA-256) in `sessions` table, set as `HttpOnly; SameSite=Strict; Secure` cookie, 7 d TTL, rotated on each `/refresh` call
        - `/forgot-password`: create single-use token (32 random bytes, hashed, stored in `invitations` table with `type=PASSWORD_RESET`), enqueue email job on `email` BullMQ queue; never confirm or deny whether email exists (return 200 always)
        - `/reset-password`: verify token hash, check not expired (1 h), hash new password with Argon2id, invalidate all sessions for user, delete token
        - `/accept-invitation`: verify invitation token, set password, activate user membership
        - Rate limiting: `@nestjs/throttler` short limit (5/min) on all auth endpoints
        - Never log passwords, tokens, or hashes
        - All responses wrapped in `{ data: {}, meta: { requestId } }` envelope
        Tests: unit tests for `AuthService` (mock Prisma), integration test for `POST /login` success + wrong-password 401 + rate-limit 429
        Files: `apps/api/src/modules/auth/auth.module.ts`, `auth.controller.ts`, `auth.service.ts`, `auth.guard.ts` (JwtAuthGuard), `jwt.strategy.ts`, `refresh-token.strategy.ts`, `dtos/*.ts`
        Verify: `pnpm --filter @rims/api test` passes all auth tests; `curl POST /api/v1/auth/login` with valid credentials returns access token and sets cookie.

- [ ] 15. **Implement TenantModule + guards**
        Middleware: resolve tenant from JWT claim `tenantId` OR from `Host` header matched against `tenant_domains` table. Store resolved tenant on request. Set `app.current_tenant_id` via `prisma.$executeRaw('SELECT set_config(...)')` on every request (enables RLS).
        `TenantGuard`: throw 403 if no tenant resolved. `JwtAuthGuard`: validate JWT, attach user. `PermissionsGuard`: check `user_role_assignments` → `role_permissions` → `permissions.code`. `@RequirePermissions(...codes)` decorator.
        Files: `apps/api/src/modules/tenant/tenant.module.ts`, `tenant.middleware.ts`, `apps/api/src/common/guards/tenant.guard.ts`, `jwt-auth.guard.ts`, `permissions.guard.ts`, `apps/api/src/common/decorators/require-permissions.decorator.ts`, `current-tenant.decorator.ts`, `current-user.decorator.ts`
        Verify: `pnpm --filter @rims/api test` — guard unit tests pass; integration test: request without tenant header returns 403; request with valid JWT but wrong tenant returns 403.

- [ ] 16. **Implement AuditModule — backend**
        `AuditService.log(event: CreateAuditEventDto)`: append-only insert to `audit_events`. Never throw — if audit write fails, log to stderr but do not interrupt the main operation. `GET /api/v1/audit-events`: paginated, filtered by `resourceType`, `actorId`, `dateFrom`/`dateTo`. Enforce `audit.view` permission. No UPDATE or DELETE endpoints.
        Fields recorded: `actorId`, `tenantId`, `action`, `resourceType`, `resourceId`, `timestamp`, `outcome`, `beforeState` (JSON, no secrets), `afterState` (JSON, no secrets), `ipAddress`, `userAgent`, `requestId`.
        Files: `apps/api/src/modules/audit/audit.module.ts`, `audit.service.ts`, `audit.controller.ts`, `dtos/create-audit-event.dto.ts`, `dtos/query-audit-events.dto.ts`
        Verify: `pnpm --filter @rims/api test` — audit service unit tests pass; integration test confirms `GET /audit-events` returns paginated results.

- [ ] 17. **Implement UsersModule — backend**
        Endpoints: `GET /api/v1/me`, `GET /api/v1/users` (paginated, filter by status/role/department), `POST /api/v1/users/invitations`, `PATCH /api/v1/users/:id`.
        - All queries scoped to `tenantId` (set via RLS)
        - `POST /invitations`: create `invitations` record, enqueue `invitation-email` job, return 201
        - `PATCH /:id` supports: activate, suspend, deactivate (status transitions); update profile fields; assign/remove department
        - Permissions: `users.view`, `users.invite`, `users.update`
        - Emit audit event on every write operation via `AuditService`
        Tests: unit tests for `UsersService`; integration tests for `GET /users`, `POST /invitations`, `PATCH /:id`
        Files: `apps/api/src/modules/users/users.module.ts`, `users.controller.ts`, `users.service.ts`, `dtos/*.ts`
        Verify: `pnpm --filter @rims/api test` passes; `GET /api/v1/users` returns `{ data: [], meta: { total, page, pageSize, totalPages, requestId } }`.

- [ ] 18. **Implement RolesModule — backend + seed default roles**
        Endpoints: `GET /roles`, `POST /roles`, `PATCH /roles/:id`, `GET /permissions`, `POST /roles/:id/permissions`, `POST /users/:id/roles`.
        `TenantProvisioningService`: called on new tenant creation, seeds 13 default roles (Platform Super Admin, Institution Admin, Executive Director, Research Director, HR Manager, Department Head, Team Lead, Project Manager, Principal Investigator, Researcher, Finance Officer, QA Officer, Auditor) and all system permissions, links them per a hardcoded default role-permission matrix.
        Dev/demo seed script (`prisma/seed.ts`) creates one demo tenant with all default roles.
        Files: `apps/api/src/modules/roles/roles.module.ts`, `roles.controller.ts`, `roles.service.ts`, `permissions.service.ts`, `tenant-provisioning.service.ts`, `dtos/*.ts`, `prisma/seed.ts`, `prisma/seed-data/default-permissions.ts`, `prisma/seed-data/default-role-permissions.ts`
        Verify: `pnpm prisma:seed` runs without error; `GET /roles` returns the 13 seeded roles for the demo tenant.

- [ ] 19. **Implement TenantsModule — backend**
        `GET /api/v1/tenants/current`: return current tenant profile + active subscription + module entitlements.
        `TenantProvisioningService.provision(dto)`: creates tenant record, seeds default roles (calls step 18 service), creates owner user membership, sets default settings. Called from a future super-admin endpoint (stubbed here as a direct service method with a dev-only HTTP endpoint guarded by `NODE_ENV !== 'production'`).
        Files: `apps/api/src/modules/tenants/tenants.module.ts`, `tenants.controller.ts`, `tenants.service.ts`, `dtos/*.ts`
        Verify: `GET /api/v1/tenants/current` returns tenant data; provisioning service unit tests pass.

- [ ] 20. **Implement InstitutionModule — backend**
        `GET /api/v1/institution`, `PATCH /api/v1/institution`. One institution record per tenant (created during provisioning). Enforce `institution.view`, `institution.update` permissions. Emit audit events on update.
        Files: `apps/api/src/modules/institution/institution.module.ts`, `institution.controller.ts`, `institution.service.ts`, `dtos/*.ts`
        Verify: `pnpm --filter @rims/api test` passes; `PATCH /institution` without permission returns 403.

- [ ] 21. **Implement DepartmentsModule — backend**
        `GET /departments` (returns tree structure — recursive CTE via Prisma `$queryRaw`), `POST /departments`, `GET /departments/:id`, `PATCH /departments/:id`, `POST /departments/:id/archive`.
        Parent-child via `parentId` FK (self-referential). Archive = soft-delete (`archivedAt` timestamp + `status = 'ARCHIVED'`). Cannot archive department with active employees — return 409.
        Files: `apps/api/src/modules/departments/departments.module.ts`, `departments.controller.ts`, `departments.service.ts`, `dtos/*.ts`
        Verify: `pnpm --filter @rims/api test` passes; tree query returns nested structure.

- [ ] 22. **Implement TeamsModule — backend**
        `GET /teams`, `POST /teams`, `PATCH /teams/:id`, `POST /teams/:id/members`.
        Teams belong to a department. Members are employees linked via `team_memberships` join (add this join table to Prisma schema if not already present). Enforce `teams.view`, `teams.create`, `teams.update` permissions.
        Files: `apps/api/src/modules/teams/teams.module.ts`, `teams.controller.ts`, `teams.service.ts`, `dtos/*.ts`
        Verify: Tests pass; `POST /teams/:id/members` creates membership record.

- [ ] 23. **Implement EmployeesModule — backend**
        `GET /employees` (paginated, filter by department/status/search), `POST /employees`, `GET /employees/:id`, `PATCH /employees/:id`.
        Employee and User are separate entities. `Employee.userId` is nullable FK to `users` — link when user accepts invitation. `PATCH` supports archive (soft-delete, set `status = 'ARCHIVED'`, `archivedAt`). Prisma transaction for multi-step operations (e.g., creating employee + linking user). Enforce `employees.view`, `employees.create`, `employees.update`, `employees.archive` permissions. Emit audit events.
        Tests: unit tests for `EmployeesService`; integration test for `GET /employees` pagination + filtering.
        Files: `apps/api/src/modules/employees/employees.module.ts`, `employees.controller.ts`, `employees.service.ts`, `dtos/*.ts`
        Verify: Tests pass; `GET /employees?page=1&pageSize=10` returns paginated envelope.

---

### PHASE 1 — Frontend Modules

*Dependencies: Phase 0 frontend scaffold complete, Phase 1 backend modules complete through step 14 (auth).*

- [ ] 24. **Design system tokens + base components (`packages/ui`)**
        ProgrammoCeuticals color palette: primary blue (`#1E40AF`), navy (`#1E3A5F`), neutral grey, teal/emerald accents. Tailwind config extending base palette. Components: `Button` (variants: primary/secondary/ghost/danger), `Input`, `Select`, `Textarea`, `Badge` (status variants: active=green, suspended=amber, inactive/archived=grey, pending=blue), `Modal` (accessible focus-trap via `@radix-ui/react-dialog`), `Toast` notification (via `@radix-ui/react-toast`), `DataTable` (sortable columns, pagination controls), `Spinner`, `Skeleton`, `Card`, `EmptyState`. WCAG 2.2 AA: `aria-*` attributes, keyboard navigation, focus-visible rings, sufficient contrast.
        Files: `packages/ui/src/index.ts`, `packages/ui/src/components/*.tsx`, `packages/ui/tailwind.config.ts`, `packages/ui/package.json`, `packages/ui/tsconfig.json`
        Verify: `pnpm --filter @rims/ui build` exits 0; Vitest snapshot tests pass for each component.

- [ ] 25. **Auth pages — frontend**
        `/login`: email+password form (React Hook Form + Zod from `@rims/validation`), calls `POST /api/v1/auth/login`, stores access token in Zustand, redirects to `/dashboard`. Show API error messages in form. `/forgot-password`: email input, submit queues reset email. `/reset-password/:token`: new password + confirm, validates match. `/accept-invitation/:token`: name + password + confirm. 'RIMS' wordmark in header. 'A ProgrammoCeuticals Product' in footer.
        Files: `apps/web/src/pages/auth/LoginPage.tsx`, `ForgotPasswordPage.tsx`, `ResetPasswordPage.tsx`, `AcceptInvitationPage.tsx`, `apps/web/src/store/auth.store.ts` (full implementation)
        Verify: Manual test — login with seeded demo credentials succeeds, redirects to `/dashboard`; wrong password shows inline error; Vitest tests for form validation pass.

- [ ] 26. **App shell — frontend**
        Persistent sidebar: module navigation links (`Dashboard`, `Users & Roles`, `Institution`, `Departments`, `Teams`, `Employees`, `Audit Log`). Show only items the authenticated user has permission to see (role-aware via permission list from JWT or `/api/v1/me`). Responsive collapse on mobile (hamburger). Topbar: RIMS wordmark, tenant name, user avatar + profile dropdown (profile link, logout). Breadcrumbs component (path-based). Loading skeleton states. `PrivateRoute` wrapper: redirect to `/login` if not authenticated.
        Files: `apps/web/src/layouts/AppShell.tsx` (full implementation), `apps/web/src/components/nav/Sidebar.tsx`, `apps/web/src/components/nav/Topbar.tsx`, `apps/web/src/components/nav/Breadcrumbs.tsx`, `apps/web/src/components/common/PrivateRoute.tsx`
        Verify: Login → app shell renders; sidebar collapses on mobile viewport; logout clears auth store and redirects.

- [ ] 27. **Dashboard page**
        `/dashboard`: KPI cards fetched from real API data: total employees, active departments, active research projects (0 until project module exists — show empty state), pending approvals (invitations pending), recent audit activity (last 5 events). TanStack Query for all data fetching. Skeleton loading states while queries are pending. Empty states when data is absent. Role-aware: show only widgets the user has permission to see.
        Files: `apps/web/src/pages/dashboard/DashboardPage.tsx`, `apps/web/src/pages/dashboard/components/KpiCard.tsx`, `apps/web/src/pages/dashboard/components/RecentActivity.tsx`
        Verify: `GET /dashboard` renders KPI cards; skeleton shows while loading; empty state shown for projects.

- [ ] 28. **Users & Roles pages — frontend**
        Users list page (`/users`): sortable `DataTable` with columns (name, email, status badge, department, roles, actions), filter bar (status dropdown, role dropdown, department dropdown, search input), pagination. Invite user modal: email + role + department select, submits `POST /api/v1/users/invitations`, shows success toast. User detail/edit page (`/users/:id`): profile form, status change actions (suspend/activate/deactivate) with confirmation modal.
        Roles list page (`/roles`): table of roles. Role detail page (`/roles/:id`): name, description, list of assigned permissions with toggle checkboxes, save button (calls `POST /roles/:id/permissions`).
        Files: `apps/web/src/pages/users/UsersPage.tsx`, `UserDetailPage.tsx`, `InviteUserModal.tsx`, `apps/web/src/pages/roles/RolesPage.tsx`, `RoleDetailPage.tsx`
        Verify: Users list renders with data from API; invite modal submits and shows toast; role permissions editor saves.

- [ ] 29. **Institution settings page — frontend**
        `/institution`: form for institution profile (name, type, address, contact email, phone, website, logo URL). Pre-populated from `GET /api/v1/institution`. Submit calls `PATCH /api/v1/institution`. Show success/error toast. Enforce `institution.update` permission (hide/disable form if not permitted).
        Files: `apps/web/src/pages/institution/InstitutionPage.tsx`
        Verify: Form pre-populates; save updates record; 403 from API shows error toast.

- [ ] 30. **Departments page — frontend**
        `/departments`: toggle between tree view and flat list view. Tree view renders hierarchy using recursive component. Create/edit modal with parent department select. Archive action with confirmation modal ("This will archive the department and remove it from active use"). Status badge per department. Create calls `POST /departments`; edit calls `PATCH /departments/:id`; archive calls `POST /departments/:id/archive`.
        Files: `apps/web/src/pages/departments/DepartmentsPage.tsx`, `DepartmentTree.tsx`, `CreateEditDepartmentModal.tsx`
        Verify: Tree renders nested departments; create modal submits; archive shows confirmation.

- [ ] 31. **Employees page — frontend**
        `/employees`: `DataTable` with department filter, status filter, search, pagination. Status badges (active=green, suspended=amber, archived=grey). Create employee form (slide-over or full page): fields from `employees` schema. Employee detail page (`/employees/:id`): profile, employment history, qualifications, link to user account (if linked). `PATCH` for update/archive.
        Files: `apps/web/src/pages/employees/EmployeesPage.tsx`, `EmployeeDetailPage.tsx`, `CreateEmployeeForm.tsx`
        Verify: List renders; create submits; detail page loads from API.

---

## Test Plan Summary

| Module | Unit Tests | Integration Tests |
|---|---|---|
| AuthService | Argon2 verify, JWT sign, refresh rotation, token expiry | `POST /login` (success, wrong password, rate limit), `POST /refresh`, `POST /logout` |
| TenantMiddleware | Tenant resolution from JWT claim, from Host header | 403 on missing tenant |
| PermissionsGuard | Allow with correct permission, deny without | 403 on missing permission |
| AuditService | Log appended, no throw on error | `GET /audit-events` pagination |
| UsersService | Invite, update status, paginate | `GET /users`, `POST /invitations` |
| RolesService | Seed default roles, assign permission, assign role to user | `GET /roles`, `POST /roles/:id/permissions` |
| EmployeesService | Create, update, archive, paginate with filters | `GET /employees?department=...` |
| DepartmentsService | Tree query, archive blocks on active employees | `POST /departments/:id/archive` (conflict case) |
| Frontend (Vitest) | Auth form validation, DataTable rendering, KPI card | — |

---

## Risks and Complexity Notes

1. **RLS + Prisma**: Prisma does not natively support setting session-local Postgres variables per transaction. The tenant middleware must call `prisma.$executeRaw("SELECT set_config('app.current_tenant_id', $1, true)", tenantId)` inside the same connection. Use Prisma's `$transaction` or a request-scoped PrismaService that wraps each request in a transaction. *Risk: connection pool management.* Mitigation: Use `$executeRawUnsafe` with parameterized input inside an `AsyncLocalStorage`-aware interceptor.

2. **Refresh token rotation**: Each `/refresh` call must atomically delete the old session row and create a new one. Use `prisma.transaction()` to prevent race conditions on concurrent refresh calls. Issue the new cookie before releasing the transaction.

3. **Department tree query**: PostgreSQL recursive CTEs are not directly supported by Prisma's query builder. Use `prisma.$queryRaw` with a handwritten CTE. Parameterize `tenantId` to keep it RLS-safe.

4. **pnpm workspace + Turborepo**: `workspace:*` protocol requires all packages to build before consumers can import them. Turborepo's `dependsOn: ["^build"]` handles this. Ensure `packages/config` is in `turbo.json` outputs so downstream packages pick up changes without a full rebuild.

5. **Argon2 native module**: `argon2` requires a C++ build toolchain. If the CI/CD environment lacks it, switch to `argon2-browser` polyfill or add a Dockerfile build step. Document this in `OPEN_DECISIONS.md`.

6. **CSRF on cookie-based refresh**: `SameSite=Strict` on the refresh cookie mitigates CSRF for same-site requests. If cross-origin refresh is needed in the future, add a CSRF token header (double-submit cookie pattern). Record as open decision.

---

## Verification Checkpoints

| After step | Checkpoint |
|---|---|
| Step 1–4 | `pnpm install` + `pnpm turbo run build --dry` lists all 8 workspaces |
| Step 5 | `pnpm prisma validate` exits 0 |
| Step 6 | `docker compose ps` shows all healthy |
| Step 7 | RLS blocks cross-tenant data access in SQL client |
| Step 8 | `GET /api/v1/health` returns 200 |
| Step 9 | `GET http://localhost:5173/` renders |
| Step 14 | Auth login/refresh/logout round-trip works end-to-end |
| Step 15 | Tenant isolation confirmed: user A cannot read user B's data |
| Step 18 | Seed script produces 13 roles per tenant |
| Step 23 | All API endpoints return correct envelope format |
| Step 31 | Frontend features complete; manual smoke test of full user flow |
