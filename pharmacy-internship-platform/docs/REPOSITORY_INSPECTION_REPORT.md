# Repository Inspection Report
**Platform:** Pharmacy Internship Marketplace & Management Platform  
**Date:** 2026-10-17

---

## 1. Workspace overview

The workspace `/Users/macbookpro/Desktop/ProgrammoCeuticals` is a **ProgrammoCeuticals** monorepo containing multiple unrelated projects, including:

| Directory | Description |
|---|---|
| `agro_management/` | Agricultural management system (NestJS API + Next.js frontend) |
| `compiler/` | Code compiler/IDE tool (Express + React) |
| `pharmapool/` | **Conference registration platform** (see below) |
| `osfng/` | Website capture/content |
| `pc/`, `hms/`, `labville/`, etc. | Other unrelated product projects |
| `pharmacy_internship_platform_amazon_q.md` | The PRD for this new platform |

There is **no existing code** for the pharmacy internship marketplace platform. The project must be scaffolded from scratch.

---

## 2. The `pharmapool/` project — what it is and is NOT

`pharmapool/` is a conference registration system for the "Pharmapool Conference on Health-Related Research" (July 1–2, 2026). It is **not** related to the internship marketplace and must not be used as a starting point.

### pharmapool stack
| Layer | Technology |
|---|---|
| Backend | Node.js + Express (plain JS, not TypeScript) |
| Database | MongoDB + Mongoose |
| Frontend | React 19 (Create React App, plain JS) |
| Storage | Cloudinary (image upload) |
| Email | Nodemailer (stubbed — logs only) |
| Auth | Static hardcoded token (`ADMIN_TOKEN`) |
| Hosting | Vercel |

### pharmapool scope
- Single-entity registration form (name, institution, payment type)
- Manual payment proof upload
- Admin dashboard with static-token authentication to approve/reject registrations
- Email service (stubbed; does not send real email)

### Why pharmapool is unsuitable as a base

1. **JavaScript, not TypeScript** — PRD specifies TypeScript throughout.
2. **MongoDB, not PostgreSQL** — PRD specifies relational database (Prisma + PostgreSQL). The internship platform requires relational integrity, check constraints, and atomic multi-table transactions — all critical for vacancy capacity management and offer acceptance.
3. **Static admin token** — Extremely insecure. The PRD requires JWT-based authentication with role-based access control and MFA for admins.
4. **Hardcoded admin password** in source code — would fail any security review.
5. **No monorepo structure** — PRD specifies pnpm workspaces + Turborepo with web, mobile, API, and worker apps.
6. **No state machines** — The internship platform requires rigorous state machines for verification, applications, offers, and placements.
7. **No real-time features** — No WebSocket or event-driven architecture.
8. **No tests** — PRD requires unit, integration, and E2E tests.
9. **Different domain entirely** — Conference registration vs. internship marketplace.

**Recommendation:** Leave `pharmapool/` entirely unchanged. Create the internship platform as a new directory: `pharmacy-internship-platform/` at the workspace root.

---

## 3. Relevant brand guidance

`brand.md` defines the ProgrammoCeuticals brand (blue `#0B5ED7`, white, Inter font, clean/minimal style). The internship platform is a ProgrammoCeuticals product, so it should follow these guidelines unless the product owner establishes a separate sub-brand. This does not affect architecture.

---

## 4. Technology choice assessment

The PRD stack is appropriate and consistent with other ProgrammoCeuticals projects:

| Decision | PRD Spec | Assessment |
|---|---|---|
| TypeScript | Yes | Correct choice; `agro_management/farm-api` uses NestJS + TypeScript already — pattern exists |
| NestJS backend | Yes | Already used in the org; good precedent |
| Next.js frontend | Yes | Used in `agro_management/pffms`; good precedent |
| Prisma + PostgreSQL | Yes | Used in `agro_management/farm-api`; good precedent |
| pnpm + Turborepo | Yes | Not yet used; appropriate for this scale |
| React Native + Expo | Yes | No mobile precedent in the org; appropriate choice |
| Redis + BullMQ | Yes | Not currently used; standard pairing for NestJS |
| Socket.IO | Yes | Not currently used; appropriate for real-time counts |

No architectural conflicts with existing projects.

---

## 5. Contradictions identified in the PRD

| # | Contradiction | Location | Resolution |
|---|---|---|---|
| C-001 | Section 7.4 says "Application submission does not reserve a position" but also says "An offer reserves a position only if the employer has capacity". This is consistent but leaves unclear: when does the application count for capacity? | §7.4 | **Resolution:** Application submission never affects capacity. Only an ISSUED offer reserves a position. Available positions = total − reserved − confirmed. |
| C-002 | Section 9.1 lists `OFFERED` as an application state, but §11.2 lists offer states separately. An application in `OFFERED` state should map 1:1 to an `ISSUED` offer. | §9.1, §11.2 | **Resolution:** Application transitions to `OFFERED` state when its linked offer moves to `ISSUED`. They are separate records; the application state reflects the pipeline stage. |
| C-003 | Section 11.4 says "Candidate cannot accept a second offer while an accepted placement is active" — but also says that after cancellation, "previously closed applications" should not be automatically restored. This implies the applicant must find a new placement through a new application cycle. This is sound logic but is not made explicit. | §11.4 | **Resolution:** Confirmed policy default. Document in OPEN_DECISIONS.md (OD-003). |
| C-004 | Section 21 (Phase 1) includes "Responsive website and core applicant mobile app" but section 3.2 (employer mobile) says "Employer mobile capabilities may initially focus on notifications and essential actions." Phase 1 lists only "core applicant mobile app" — employer mobile appears deferred but is not stated explicitly as Phase 2. | §21, §3.2 | **Resolution:** Employer mobile is Phase 1 with limited scope (OD-006 default). Confirm with product owner. |

---

## 6. Missing decisions (see OPEN_DECISIONS.md)

The following are not resolvable from the PRD alone and require product-owner input before Phase 1 production:

- Product name (OD-001) — **blocking**
- Offer expiry window (OD-002) — **blocking**
- Post-acceptance cancellation workflow (OD-003) — **blocking**
- PCN/regulatory requirements per centre type (OD-004) — **blocking**
- Data retention and deletion policy (OD-011) — **blocking before production**
- File types and size limits (OD-015) — **blocking**
- Nigerian employment law classification (OD-017) — **blocking before production**

---

## 7. Technical risks

| Risk | Severity | Mitigation |
|---|---|---|
| Concurrent offer acceptance (race condition for last position) | Critical | `SELECT FOR UPDATE` + database check constraint + idempotency key |
| WebSocket message vs. database state divergence | High | WS only broadcasts committed state; clients refetch on reconnect |
| File upload security | High | Server-side MIME validation; private S3; malware scan before production |
| Email deliverability in Nigeria | Medium | Use transactional email provider; test early; do not rely on Nodemailer directly in production |
| Regulatory/compliance gap (NDPR data protection) | High | Engage legal adviser; build deletion/retention hooks from Phase 1 |
| PCN claims | Medium | Platform must not claim PCN affiliation or that approval = regulatory certification |
| Admin authentication security | High | JWT + MFA; no static tokens; audit all admin actions |
| Offer template legal validity | Medium | Legal review of any generated offer letter template before production use |

---

## 8. Proposed monorepo location

```
/Users/macbookpro/Desktop/ProgrammoCeuticals/pharmacy-internship-platform/
├── apps/
│   ├── web/          # Next.js
│   ├── mobile/       # React Native + Expo
│   ├── api/          # NestJS
│   └── worker/       # BullMQ
├── packages/
│   ├── shared-types/
│   ├── validation/
│   ├── api-client/
│   ├── ui/
│   └── config/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── docs/             # Phase 0 deliverables (this document set)
├── .env.example
├── package.json      # pnpm workspace root
├── turbo.json
└── README.md
```

---

## 9. Summary and recommended next action

**Status:** No conflicting existing code. The internship platform is a greenfield project.

**Recommended next steps:**
1. Product owner reviews and resolves blocking open decisions (OD-001, 002, 003, 004, 008, 011, 015, 017).
2. Phase 0 deliverables reviewed and approved.
3. Scaffold the monorepo and Prisma schema as Phase 1 step 1.1.
4. Implement Phase 1 incrementally, module by module, with tests.

**The `pharmapool/` project is unrelated and must not be modified.**
