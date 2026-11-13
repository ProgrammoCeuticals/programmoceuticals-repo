# PharmaCare — Pharmacy Patient Management System

A secure, longitudinal patient record system for pharmacy staff.

## Stack
- **Backend:** Node.js + Express + TypeScript + Drizzle ORM + PostgreSQL
- **Frontend:** Angular 17 + Tailwind CSS

---

## Setup

### 1. Database
```bash
createdb pharmacare
psql -d pharmacare -f server/drizzle/migrations/0001_full_schema.sql
```

### 2. Backend
```bash
cd server
cp .env.example .env   # set DATABASE_URL and JWT_SECRET
npm install
npm run dev            # → http://localhost:4000
```

### 3. Frontend
```bash
cd client
npm install
npm start              # → http://localhost:4200
```

---

## Default Login
| Email | Password | Role |
|-------|----------|------|
| admin@pharmacare.local | Admin@123 | Admin |

> Change this password immediately before any real use.

---

## Implemented Features (Phase Status)

| Phase | Status | Notes |
|-------|--------|-------|
| 0 — Inspection | ✅ | Existing stack preserved (Angular + Express) |
| 1 — Foundation | ✅ | Auth, RBAC, audit log, Zod validation, `/api/v1/` |
| 2 — Patient registration | ✅ | Duplicate detection, contacts table, archive |
| 3 — Medical history / allergies | ✅ | Structured allergy status model, conditions, family/social history |
| 4 — Medication history | ✅ | Immutable change history, medication reviews |
| 5 — Encounters / observations | ✅ | Flexible observations, assessments, care plans, interventions, amendments |
| 6 — Follow-ups | ✅ | Full lifecycle, overdue queue |
| 7 — Test orders / results | ✅ | Amendment chain via previousResultId |
| 8 — Timeline / summary | ✅ | Chronological timeline, patient summary |
| 9 — Hardening | ⚠ TODO | Security review, indexes, backup/restore, E2E tests |

---

## API Endpoints (`/api/v1/`)

```
POST   /auth/login
POST   /auth/register              (admin only)
GET    /auth/me

GET    /patients
POST   /patients
GET    /patients/:id
PUT    /patients/:id
DELETE /patients/:id               (archive)

GET/POST  /patients/:id/medical-conditions
PUT       /patients/:id/medical-conditions/:id
GET/POST  /patients/:id/allergies
PUT       /patients/:id/allergies/:id
PUT       /patients/:id/allergy-status
GET/POST  /patients/:id/family-history
GET/POST  /patients/:id/social-history
GET/POST  /patients/:id/procedures
GET/POST  /patients/:id/hospitalisations

GET/POST  /patients/:id/medications
PUT       /patients/:id/medications/:id/change
GET       /patients/:id/medications/:id/history
GET/POST  /patients/:id/medication-reviews

GET/POST  /patients/:id/encounters
GET       /patients/:id/test-orders
POST      /patients/:id/test-orders
GET/POST  /patients/:id/test-results
GET/POST  /patients/:id/follow-ups

GET       /patients/:id/timeline
GET       /patients/:id/summary

GET/PUT   /encounters/:id
POST      /encounters/:id/amend
POST      /encounters/:id/observations
POST      /encounters/:id/assessments
POST      /encounters/:id/care-plans
POST      /encounters/:id/interventions

GET       /follow-ups/queue
PUT       /follow-ups/:id

GET       /dashboard
GET       /health
```

---

## Key Clinical Safety Properties

- Allergy status is explicit: `not_assessed` | `unknown` | `no_known_allergies` | `allergies_present` — a blank list never means "no allergies"
- Medication changes write an immutable `medication_changes` row before updating — previous values are never lost
- Encounters have draft (`in_progress`) and completed states — amendments preserve the original and record author + reason
- Every clinical write is recorded in `audit_logs`
- RBAC is enforced server-side on every route — frontend role checks are UI-only

---

## Production Readiness Checklist

Before real patient data is entered, complete Section 18 of the specification:
- [ ] Change default admin password and remove seed user
- [ ] Set strong `JWT_SECRET` in environment
- [ ] Enable HTTPS
- [ ] Confirm database is not publicly exposed
- [ ] Test backup and restore
- [ ] Run security dependency audit (`npm audit`)
- [ ] Clinical lead approves observation types and allergy/alert workflows
- [ ] Privacy/retention obligations reviewed for deployment jurisdiction
