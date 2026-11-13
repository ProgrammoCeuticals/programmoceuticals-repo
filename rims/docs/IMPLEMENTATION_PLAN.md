# RIMS — Implementation Plan

## Overview

RIMS is implemented in a phased approach. Each phase builds on the last. Phase 0 establishes the monorepo scaffold, shared packages, database schema, and infrastructure. Phase 1 implements authentication, tenancy, RBAC, and employee record management.

---

## Phase 0 — Infrastructure & Scaffold (FEAT-001)

| Step | Description                                                       | Verification                                     |
| ---- | ----------------------------------------------------------------- | ------------------------------------------------ |
| 1    | Monorepo root scaffold (package.json, pnpm-workspace, turbo.json) | `pnpm install` exits 0                           |
| 2    | packages/config — tsconfig bases, ESLint, Prettier                | Files exist and referenced by all packages       |
| 3    | packages/shared-types — enums and interfaces                      | `pnpm --filter @rims/shared-types build` exits 0 |
| 4    | packages/validation — Zod schemas                                 | `pnpm --filter @rims/validation build` exits 0   |
| 5    | prisma/schema.prisma — all 20+ models                             | `pnpm prisma validate` exits 0                   |
| 6    | docker-compose.yml — Postgres 15, Redis 7, Adminer                | `docker compose up -d` all healthy               |
| 7    | RLS migration SQL — roles, policies, set_tenant_context           | RLS blocks cross-tenant access                   |
| 8    | .env.example — all variables documented                           | All vars present                                 |
| 9    | Documentation files + ADRs                                        | All files non-empty                              |

---

## Phase 1 — Authentication & Tenancy (FEAT-002)

| Step | Description                                                                    |
| ---- | ------------------------------------------------------------------------------ |
| 8    | NestJS API bootstrap — ConfigModule, PrismaModule, health endpoint             |
| 9    | React + Vite web app bootstrap — app shell, router, auth store                 |
| 10   | BullMQ worker bootstrap — email queue, Redis connection                        |
| 14   | Auth module — login, refresh, logout, forgot/reset password, accept invitation |
| 15   | Tenant middleware + JWT auth guard + permissions guard                         |
| 16   | Audit module — append-only event logging                                       |
| 17   | Users module — invite, list, update                                            |
| 18   | Roles module — seed default roles, permission assignment                       |
| 19   | Tenants module — provisioning service                                          |
| 20   | Institution module — profile management                                        |

---

## Phase 2 — HR Modules (FEAT-003/004/005)

| Step  | Description                                  |
| ----- | -------------------------------------------- |
| 21    | Departments module — recursive tree, archive |
| 22    | Teams module — member management             |
| 23    | Employees module — CRUD, employment history  |
| 24–31 | Frontend pages for all above modules         |

---

## Phase 3 — Research, Performance, Finance, Quality, Documents (FEAT-006–010)

| Step | Description                                                                      |
| ---- | -------------------------------------------------------------------------------- |
| 32   | Research module — projects, milestones, tasks, approvals                         |
| 33   | Tasks module — assignment, status transitions, comments                          |
| 34   | Performance module — cycles, KPI definitions, assignments, results               |
| 35   | Reports module — executive overview, research portfolio, workforce, publications |
| 36   | Publications module — manuscript lifecycle, author management                    |
| 37   | Finance module — funding sources, budgets, expenses                              |
| 38   | Quality module — reviews, findings, corrective actions                           |
| 39   | Documents module — folders, upload, versioning, approval, archive                |

---

## Phase 4 — Subscriptions, Usage, Notifications, Analytics, AI Reports, Platform Admin (FEAT-011) ✅ COMPLETE

| Step | Description                                                                                                                                      | Status |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| 1    | Schema additions — UsageRecord, IntegrationConnection, WebhookDelivery, Notification, NotificationPreference, AnalyticsSnapshot plus 5 new enums | ✅     |
| 2    | Subscriptions module — plan management, entitlements, tenant provisioning, module enable/disable                                                 | ✅     |
| 3    | Usage metering module — record metrics, query history, current summary                                                                           | ✅     |
| 4    | Notifications module — CRUD, mark-read, mark-all-read, dismiss, unread count, preferences                                                        | ✅     |
| 5    | Analytics module — trends, workload distribution, project risk indicators, publication trends, snapshots                                         | ✅     |
| 6    | AI-assisted reporting module — executive summary with optional OpenAI integration                                                                | ✅     |
| 7    | Platform admin module — tenant listing/overview, suspend/activate, system health, PlatformAdminGuard                                             | ✅     |
| 8    | BullMQ worker — full NestJS app with email, usage-metrics, notifications processors                                                              | ✅     |
| 9    | .env.example — AI_PROVIDER_API_KEY, AI_MODEL, PLATFORM_ADMIN_SECRET                                                                              | ✅     |
| 10   | Documentation updates                                                                                                                            | ✅     |

---

## Architecture Decisions

| Decision         | Choice                                          | Rationale                                               |
| ---------------- | ----------------------------------------------- | ------------------------------------------------------- |
| Monorepo tooling | pnpm + Turborepo                                | Matches reference monorepos in this workspace           |
| API framework    | NestJS 10                                       | All ProgrammoCeuticals backend projects use NestJS      |
| Frontend         | React 19 + Vite 6 + Tailwind 4                  | Specified explicitly                                    |
| State / data     | Zustand 5 + TanStack Query v5                   | Matches ectd-platform                                   |
| ORM              | Prisma 5 + PostgreSQL 15                        | All multi-tenant ProgrammoCeuticals projects use Prisma |
| Multi-tenancy    | PostgreSQL RLS + current_setting                | Stronger than app-layer filtering                       |
| Auth tokens      | JWT access (15m) + HttpOnly refresh cookie (7d) | Required by spec; sessions table enables revocation     |
| Password hashing | argon2id via `argon2@0.41.1`                    | OWASP-recommended; already used in ectd-platform        |
| Job queues       | BullMQ + Redis                                  | Used across ProgrammoCeuticals projects                 |
| Test runners     | Jest 29 (API) + Vitest 2 (web)                  | Matches NestJS/Vite ecosystem pattern                   |

---

## Risks

1. **RLS + Prisma connection pooling** — Prisma does not natively scope session-local config per connection. Mitigation: use `$executeRaw` with `set_config(..., true)` inside a transaction-wrapped interceptor.

2. **Argon2 native build** — `argon2` npm package requires C++ toolchain (node-gyp). Mitigation: documented in OPEN_DECISIONS.md; Dockerfile must include build-essential.

3. **Refresh token race condition** — concurrent `/refresh` calls could cause token reuse issues. Mitigation: atomic delete+create inside `prisma.$transaction()`.

4. **Department cycle prevention** — Prisma DSL cannot express cycle-check constraints. Mitigation: application-layer validation in DepartmentsService using recursive CTE check.
