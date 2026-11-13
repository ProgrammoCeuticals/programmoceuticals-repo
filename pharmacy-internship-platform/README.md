# PharmIntern NG

Pharmacy Internship Marketplace & Management Platform

> **Note:** This platform is independent and not affiliated with, endorsed by,
> or operated by the Pharmacy Council of Nigeria (PCN) or any regulatory body.

## Structure

```
pharmacy-internship-platform/
├── apps/
│   ├── api/          NestJS REST API  (port 3001)
│   ├── web/          Next.js website  (port 3000)
│   ├── mobile/       React Native + Expo (scaffold)
│   └── worker/       BullMQ background jobs (scaffold)
├── packages/
│   ├── shared-types/ TypeScript enums, DTOs, entity interfaces
│   └── ...
├── prisma/
│   └── schema.prisma Full relational schema
├── docs/             Phase 0 design documents
└── docker-compose.yml  PostgreSQL 15 + Redis 7
```

## Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9
- Docker (for local Postgres + Redis)

## Quick start

```bash
# 1. Copy and fill environment variables
cp .env.example .env
# Edit .env — set DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET at minimum

# 2. Start database and Redis
docker compose up -d

# 3. Install dependencies
pnpm install

# 4. Generate Prisma client
pnpm prisma:generate

# 5. Run migrations
pnpm prisma:migrate:dev --name init

# 6. Apply the positions check constraint (not expressible in Prisma DSL):
#    Run in psql or via a raw migration:
#    ALTER TABLE vacancies ADD CONSTRAINT chk_positions
#      CHECK (reserved_positions + confirmed_positions <= total_positions);

# 7. Start API (dev)
pnpm --filter @pharmintern/api dev

# 8. Start web (dev — separate terminal)
pnpm --filter @pharmintern/web dev
```

API docs available at http://localhost:3001/api/docs (dev only).

## Key commands

| Command | Description |
|---|---|
| `pnpm build` | Build all apps |
| `pnpm test` | Run all tests |
| `pnpm lint` | Lint all packages |
| `pnpm type-check` | TypeScript check |
| `pnpm prisma:validate` | Validate Prisma schema |
| `pnpm prisma:migrate:dev` | Create and apply migration |
| `pnpm prisma:studio` | Open Prisma Studio |

## Phase status

| Phase | Status |
|---|---|
| Phase 0 — Design documents | ✅ Complete (`docs/`) |
| Phase 1.1 — Monorepo scaffold | ✅ Complete |
| Phase 1.2 — Auth (register, login, JWT, refresh) | ✅ Core complete |
| Phase 1.3 — Prisma schema (all entities) | ✅ Complete |
| Phase 1.4 — Organisations & verification | 🔜 Next |
| Phase 1.5 — Vacancies & search | 🔜 Next |
| Phase 1.6 — Applications & pipeline | 🔜 Next |
| Phase 1.7 — Interviews | 🔜 Next |
| Phase 1.8 — Offers & one-placement rule (critical) | 🔜 Next |
| Phase 1.9 — Admin tools & reporting | 🔜 Next |
| Phase 2 — Internship operations | ⏳ Future |
| Phase 3 — Community | ⏳ Future |
| Phase 4 — Business expansion | ⏳ Future |

## Security notes

- JWT access tokens expire in 15 minutes. Refresh tokens (7 days) are stored as
  bcrypt hashes in Redis and rotated on every use.
- All private documents are stored in S3-compatible object storage with
  short-lived signed URLs. Never expose raw storage keys.
- The `notification_outbox` pattern ensures notification delivery failures never
  roll back committed business operations.
- The `vacancies` table has a database-level CHECK constraint:
  `reserved + confirmed <= total_positions`
- Offer acceptance runs in a single atomic transaction with `SELECT FOR UPDATE`
  on both the offer and the vacancy row.
- See `docs/TRANSACTION_RULES.md` for all critical invariants.

## Documentation

All Phase 0 design documents are in `docs/`:

- `REPOSITORY_INSPECTION_REPORT.md`
- `OPEN_DECISIONS.md`
- `PHASED_IMPLEMENTATION_PLAN.md`
- `WORKFLOW_DIAGRAMS.md`
- `DATA_MODEL.md`
- `PERMISSION_MATRIX.md`
- `API_CONTRACTS.md`
- `TRANSACTION_RULES.md`
