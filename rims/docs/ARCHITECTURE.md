# RIMS — Architecture

## System Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Browser / Mobile                           │
│                        React 19 SPA (Vite 6)                        │
│                          apps/web  :5173                            │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ HTTPS / REST
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      NestJS API  apps/api  :3000                    │
│  prefix: /api/v1          Swagger: /api/docs                        │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ AuthModule   │  │ UsersModule  │  │ EmployeesModule          │  │
│  │ JWT strategy │  │ InviteFlow   │  │ CRUD + History           │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ TenantsModule│  │ RBACModule   │  │ AuditModule              │  │
│  │ Onboarding   │  │ Roles/Perms  │  │ Event logging            │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                     PrismaService                           │    │
│  │  extends PrismaClient, sets tenant context before queries   │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
            ┌─────────────────────┴──────────────────┐
            │                                        │
            ▼                                        ▼
┌─────────────────────┐                 ┌────────────────────────────┐
│  PostgreSQL 15      │                 │  Redis 7                   │
│  RLS enabled        │                 │  Session cache             │
│  UUID PKs           │                 │  BullMQ queues             │
└─────────────────────┘                 └────────────────────────────┘
                                                     │
                                                     ▼
                                        ┌────────────────────────────┐
                                        │  NestJS Worker  apps/worker│
                                        │  Email / notifications     │
                                        │  Background jobs           │
                                        └────────────────────────────┘
```

---

## Technology Choices

| Layer             | Technology                | Rationale                                          |
|-------------------|---------------------------|----------------------------------------------------|
| Language          | TypeScript 5.7 strict     | End-to-end type safety across all packages         |
| Build system      | pnpm 9 + Turborepo 2      | Fast, cache-aware monorepo builds                  |
| API framework     | NestJS 10                 | DI, modular architecture, first-class decorators   |
| ORM               | Prisma 5                  | Type-safe queries, easy migrations, RLS compatible |
| Database          | PostgreSQL 15             | RLS, UUID support, JSONB, reliable                 |
| Auth hashing      | argon2id (argon2@0.41.1)  | OWASP-recommended, PHC standard                    |
| Tokens            | JWT (access 15m + refresh 7d) | Stateless access, revocable refresh           |
| Queue             | BullMQ + Redis            | Reliable job processing, retries, delays           |
| Frontend          | React 19 + Vite 6         | Modern, fast HMR, tree-shaking                     |
| State             | Zustand 5                 | Lightweight, minimal boilerplate                   |
| Data fetching     | TanStack Query v5         | Cache, stale-while-revalidate, optimistic updates  |
| Forms             | React Hook Form v7 + Zod  | Performant validation, schema-first                |
| Styling           | Tailwind CSS 4            | Utility-first, JIT, design tokens                  |
| Validation        | Zod 3                     | Runtime + compile-time, shared between API and web |

---

## Monorepo Structure

```
rims/
├── apps/
│   ├── api/          NestJS API (port 3000)
│   ├── web/          React SPA (port 5173)
│   └── worker/       BullMQ Worker
├── packages/
│   ├── config/       tsconfig bases, ESLint, Prettier
│   ├── shared-types/ Enums + interfaces (no runtime deps)
│   ├── validation/   Zod schemas (shared between API and web)
│   ├── api-client/   Typed Axios HTTP client
│   └── ui/           React component library
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── docs/
│   └── decisions/    Architecture Decision Records
├── infra/
│   └── docker/
├── docker-compose.yml
├── .env.example
└── turbo.json
```

---

## Request Lifecycle with RLS

```
HTTP Request
    │
    ▼
NestJS Guard (JwtAuthGuard)
    │  ← validates JWT, extracts { sub, tenantId, permissions }
    ▼
TenantContextMiddleware
    │  ← calls prisma.$executeRaw`SELECT set_tenant_context(${tenantId}::uuid)`
    ▼
Controller → Service
    │  ← all Prisma queries now filtered by RLS policy (tenant_id = current_setting)
    ▼
PrismaService (PostgreSQL)
    │  ← RLS policy: tenant_id = current_setting('app.current_tenant_id', true)::uuid
    ▼
Response: { data: {}, meta: { requestId } }
```

No Prisma query can return data from a tenant other than the one set in the session context. The `migration_role` (used only during `prisma migrate deploy`) has `BYPASSRLS` and is never available to the application at runtime.

---

## Error Response Format

All API errors follow the envelope:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request body failed validation",
    "details": [{ "field": "email", "message": "Invalid email" }],
    "requestId": "01HX..."
  }
}
```

Stack traces are never exposed to clients.
