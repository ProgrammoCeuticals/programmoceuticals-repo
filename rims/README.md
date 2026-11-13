# RIMS — Regulatory Information Management System

A multi-tenant SaaS platform for managing employee records, organisational hierarchy, and regulatory compliance within pharmaceutical and healthcare institutions.

## Architecture

- **`apps/api`** — NestJS 10 REST API (port 3000, prefix `/api/v1`)
- **`apps/web`** — React 19 + Vite 6 SPA (port 5173)
- **`apps/worker`** — NestJS BullMQ background worker
- **`packages/shared-types`** — TypeScript enums and interfaces
- **`packages/validation`** — Zod validation schemas
- **`packages/api-client`** — Typed Axios HTTP client
- **`packages/ui`** — Shared React component library
- **`packages/config`** — tsconfig bases, ESLint, Prettier configs

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose

### 1. Install dependencies

```
cd rims
pnpm install
```

### 2. Configure environment

```
cp .env.example .env
# Edit .env — set DATABASE_URL, REDIS_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
```

### 3. Start local services

```
docker compose up -d
```

### 4. Run database migrations

```
pnpm prisma migrate dev --schema=prisma/schema.prisma
```

### 5. Seed demo data

```
pnpm prisma db seed --schema=prisma/schema.prisma
```

### 6. Start the API

```
pnpm --filter @rims/api dev
```

### 7. Start the frontend

```
pnpm --filter @rims/web dev
```

### Demo credentials

- URL: http://localhost:5173
- Email: admin@demo.rims.local
- Password: DemoAdmin123!
- Note: Demo data only — not for production use

### Run tests

```
pnpm --filter @rims/api test
```

## Tenancy Model

Every tenant is fully isolated using PostgreSQL Row Level Security (RLS). The application sets `app.current_tenant_id` on each database connection before executing queries. Data from different tenants can never mix.

## Development Workflow

```bash
# Run all tests
pnpm test

# Type-check all packages
pnpm type-check

# Lint all packages
pnpm lint

# Build a single package
pnpm --filter @rims/shared-types build

# Prisma operations
pnpm prisma:generate
pnpm prisma:migrate:dev
pnpm prisma:studio
```

## Phase 4 Features

- **Subscriptions & Entitlements** — plan catalogue, current subscription, per-tenant module on/off, trial provisioning endpoint
- **Usage Metering** — daily snapshots of active users, employees, projects, documents; history query; current summary
- **Notifications** — in-app notification CRUD, mark-read, mark-all-read, dismiss, unread count, per-event preferences
- **Analytics** — research trends by month, task completion by week, publication trends, KPI completion by cycle, workload distribution, project risk indicators, analytics snapshots
- **AI-Assisted Reporting** — executive summary generation via OpenAI (optional; falls back gracefully when no API key is set)
- **Platform Admin** — tenant listing/overview, suspend/activate tenants, system health endpoint, `PlatformAdminGuard` (Platform Super Admin role required)
- **BullMQ Worker** — full NestJS application with `email`, `usage-metrics`, and `notifications` queue processors

## Documentation

- [Product Requirements](docs/PRODUCT_REQUIREMENTS.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Database Design](docs/DATABASE_DESIGN.md)
- [Implementation Plan](docs/IMPLEMENTATION_PLAN.md)
- [Open Decisions](docs/OPEN_DECISIONS.md)
- [Architecture Decision Records](docs/decisions/)
