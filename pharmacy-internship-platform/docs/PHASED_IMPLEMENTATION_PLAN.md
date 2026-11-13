# Phased Implementation Plan
**Platform:** Pharmacy Internship Marketplace & Management Platform  
**Last updated:** 2026-10-17

---

## Phase 0 — Discovery and Design (current phase)

**Goal:** Produce the artefacts that let Phase 1 begin without surprises.

### Deliverables
- [x] Repository inspection report (this document set)
- [x] Open-decision register (`OPEN_DECISIONS.md`)
- [x] Phased implementation plan (this document)
- [x] Workflow / state diagrams (`WORKFLOW_DIAGRAMS.md`)
- [x] Relational data model (`DATA_MODEL.md`)
- [x] Permission matrix (`PERMISSION_MATRIX.md`)
- [x] API contracts (`API_CONTRACTS.md`)
- [x] Critical transaction rules (`TRANSACTION_RULES.md`)
- [ ] Threat model and privacy checklist (to be drafted)
- [ ] Deployment options shortlist (to be drafted)
- [ ] Resolve blocking open decisions (OD-001, 002, 003, 004, 008, 011, 015, 017)

### Gate criteria before Phase 1 starts
1. Product name confirmed (OD-001).
2. Offer expiry and reservation policy confirmed (OD-002).
3. Cancellation-after-acceptance workflow confirmed (OD-003).
4. Centre verification checklist requirements per centre type confirmed (OD-004).
5. File type and size limits confirmed (OD-015).
6. Data retention approach confirmed with legal advice (OD-011).
7. Monorepo scaffolding reviewed and approved.

---

## Phase 1 — Core Marketplace and Recruitment

**Goal:** A working, secure, and tested platform covering the full journey from registration to offer acceptance.

### 1.1 Monorepo scaffold and infrastructure
- pnpm workspaces + Turborepo
- `apps/api` (NestJS), `apps/web` (Next.js), `apps/mobile` (Expo), `apps/worker` (BullMQ)
- `packages/shared-types`, `packages/validation`, `packages/api-client`, `packages/ui`, `packages/config`
- `prisma/` at root with schema and migration setup
- `.env.example` with all required keys documented
- CI pipeline (lint, type-check, test, build)
- Local Docker Compose for Postgres + Redis

### 1.2 Authentication and user management
- Applicant registration with email verification
- Secure password handling (bcrypt; minimum complexity enforced server-side)
- JWT access + refresh token strategy
- Password reset flow
- Rate limiting on auth endpoints
- Session invalidation
- MFA groundwork for admin roles (OD-014 default: required for admins)
- Audit events for login, password change, account actions

### 1.3 Applicant profile
- Profile creation and update
- CV and reusable document upload (private S3-compatible storage)
- Document versioning (retain upload snapshots)
- University, graduation, preferred practice areas and locations
- Malware scanning integration point (stubbed until production)

### 1.4 Organisation registration and verification workflow
- Organisation + location data model
- Multi-step registration form
- Document and licence upload (private storage, access-controlled)
- Verification case state machine: DRAFT → SUBMITTED → UNDER_REVIEW → MEETING_REQUIRED → MEETING_SCHEDULED → ADDITIONAL_INFORMATION_REQUIRED → APPROVED / REJECTED / SUSPENDED / REVERIFICATION_REQUIRED
- Admin verification meeting record (date, participants, checklist, notes, outcome)
- Configurable checklists per centre type
- Audit events for every state transition
- Email notifications for status changes
- Centre profile (public view only when APPROVED)

### 1.5 Vacancy management
- Vacancy CRUD with all required fields
- Vacancy state machine: DRAFT → PUBLISHED → PAUSED → CLOSED → FILLED → ARCHIVED
- Only approved organisations can publish
- Employer-defined application questions and required documents
- Snapshot of vacancy/form version at time of application submission
- Real-time available_positions counter (transactional, with database constraints)
- Search and filter: practice area, location, accommodation, deadline, etc.
- Keyword search, sorting, pagination (mobile-friendly)
- WebSocket broadcast of committed vacancy count changes

### 1.6 Application pipeline
- Application submission with server-side validation of all employer-defined requirements
- Application state machine enforced on backend
- Draft application support (OD-009 default: retain 30 days)
- Employer application management: filter, sort, review, shortlist, reject, waitlist, progress
- Credential check record (employer-side note; platform does not certify)
- Application submission snapshots (form version pinned at submission)
- Employer internal notes (never returned to applicant endpoints)
- Audit events for all state transitions

### 1.7 Interview stages
- Configurable stages per vacancy (verbal, written, multi-stage)
- Candidate invitation with date/time/instructions
- Reschedule/cancellation with reason
- Notification to candidate and relevant staff
- Interview history

### 1.8 Offer letters and one-placement rule
- Offer creation (employer upload or platform template — OD-016 default: both)
- Offer state machine: DRAFT → ISSUED → ACCEPTED / DECLINED / EXPIRED / WITHDRAWN_BY_EMPLOYER / CANCELLED
- Offer capacity check (transaction-safe reservation)
- Atomic acceptance transaction (see TRANSACTION_RULES.md)
- Automatic decline of competing offers
- Automatic closure of competing applications (CLOSED_OTHER_OFFER_ACCEPTED)
- Offer expiry background job + synchronous validation
- Idempotency protection on acceptance

### 1.9 Notifications
- Email (transactional outbox pattern)
- In-app notifications with read/unread and link to record
- Retry with bounded backoff
- Notification preferences (transactional notices cannot be turned off)
- No duplicate emails on retry

### 1.10 Admin tools
- Platform admin panel (web only)
- Centre verification queue and workflow
- User and organisation management
- Audit log viewer
- Basic platform metrics dashboard
- Role and permission management

### 1.11 Mobile app (applicant)
- React Native + Expo
- Shared backend and account identity with web
- Browse and search vacancies
- View centre profiles
- Apply and track applications
- Receive and respond to offers
- Push notifications (Expo Notifications)
- Core navigation and profile management

### 1.12 Testing
- Unit tests: business rules, state machines, transaction logic
- Integration tests: API endpoints, auth flows
- E2E tests: critical user journeys (application → offer acceptance; verification workflow)
- Transaction concurrency tests (race condition simulation for offer acceptance)

**Estimated effort:** 12–16 weeks for a small team (3–4 engineers)

**Dependencies:** Phase 0 gates must be resolved. Deployment environment selected.

**Risks:**
- Transactional concurrency for offer acceptance is the highest-risk backend feature; allocate extra time.
- Malware scanning integration requires a vendor decision before production.
- Real-time vacancy counts via WebSocket + database consistency must be tested under concurrent load.
- Email deliverability in Nigeria may require a local or well-configured regional provider.

---

## Phase 2 — Internship Operations

**Goal:** Tools for employers to manage active interns from onboarding through completion.

### Scope
- Onboarding checklist and document collection
- Intern records
- Supervisor/preceptor assignment
- Attendance recording
- Department/unit rotations
- Periodic assessments and feedback
- Placement progress and status management
- Completion confirmation (explicit employer action required)
- Final assessment and optional completion document
- Early exit, withdrawal, and failed resumption workflows
- Employer operations reporting

**Dependencies:** Phase 1 placement record and placement state machine.

**Estimated effort:** 6–8 weeks

---

## Phase 3 — Community

**Goal:** Reviews, discussions, and moderation.

### Scope
- Centre reviews (verified placement vs. unverified historical)
- Review dimensions (training quality, environment, supervision, etc.)
- Employer responses to reviews
- Community discussion posts and comments
- Content reporting workflow
- Moderation queue with decision records
- Appeal path for consequential moderation decisions
- Policy enforcement for harassment, spam, impersonation, patient data disclosure

**Dependencies:** Phase 1 placement records (for verified review badge). Phase 2 completion records.

**Estimated effort:** 6–8 weeks

---

## Phase 4 — Business Expansion

**Goal:** Revenue and scale features, after validating adoption.

### Scope (subject to product validation)
- Employer subscription billing
- Advanced analytics and reporting
- Multi-branch and institutional workflow enhancements
- Additional notification channels (SMS, WhatsApp — if validated)
- Community direct messaging (after safety/moderation controls designed)
- Further integrations (if available and authorised)
- Sponsored/featured listings

**Dependencies:** Phase 3. Business model validated (OD-007).

---

## Cross-cutting requirements (all phases)

These are not deferred to a later phase — they apply from Phase 1:

- All critical business rules enforced on the backend (never frontend-only)
- Input validation on every endpoint (DTO/schema validation)
- Object-level authorisation (no IDOR)
- Rate limiting on sensitive endpoints
- Private document storage with short-lived signed URLs
- Audit events for consequential actions
- No secrets, real documents, or PII in the repository
- Synthetic seed data only in development
- Migration-based schema changes (no ad-hoc ALTER TABLE in production)
- API versioning (`/api/v1/`)
- OpenAPI documentation
- Consistent error responses
- Accessibility (WCAG 2.1 AA target on web)
- Nigerian date/time display conventions; UTC storage

---

## Known risks (Phase 1)

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Concurrent offer acceptance race condition | Medium | Critical | Database-level row locking + idempotency key |
| WebSocket message vs. database state divergence | Medium | High | WS broadcasts committed state only; clients refetch on reconnect |
| File upload security (malicious content) | High | High | Validate MIME type server-side; integrate malware scan before production |
| Email deliverability in Nigeria | Medium | Medium | Use transactional email provider with Nigerian routing; test early |
| Admin token authentication in existing pharmapool code | N/A (separate project) | — | New project uses JWT, not static tokens |
| PCN regulatory requirements unclear | High | Medium | Make verification configurable; do not hardcode requirements |
| Data protection compliance | Medium | High | Engage legal adviser before production; build in data deletion hooks |
| Over-engineering early phases | Medium | Medium | Phase gate discipline; do not build Phase 2–4 features in Phase 1 |
