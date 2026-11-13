# RIMS — Remediation Plan

**Audit date:** 2025  
**Audited against:** `RIMS_Product_Requirements_and_Architecture.md` + `RIMS_Institutional_Web_Presence_CMS_Specification.md`  
**Overall status:** Core platform is production-ready in structure. Gaps are in schema completeness, background jobs, file pipeline, missing docs, and tests.

---

## Priority 1 — Confirmed Blocker

### ~~F-001: `seedPlans` endpoint missing~~
**Status: ALREADY FIXED.** `apps/api/src/modules/subscriptions/subscriptions.controller.ts` has `POST subscriptions/plans/seed` at line 57. The phase4 review was written before the fix was applied. No action needed.

---

## Priority 2 — Schema Gaps (Missing Tables)

These are models required by the spec that are absent from `prisma/schema.prisma`. All should be batched into a single migration.

### S-001: `employee_certifications` table missing
**Spec ref:** Section 5.4 — "Qualifications, certifications and professional experience"  
**Current state:** Only `employee_qualifications` exists. Certifications (professional body memberships, licences, CPD) are a distinct concept from academic qualifications.  
**Fix:** Add `EmployeeCertification` model with fields: `id`, `employeeId`, `name`, `issuingBody?`, `licenceNumber?`, `issuedAt?`, `expiresAt?`, `documentRef?`, `createdAt`. Add relation to `Employee`.

### S-002: Reporting manager FK missing on `Employee`
**Spec ref:** Section 5.4 — "Reporting manager" + Section 10.1 — `reporting_relationships`  
**Current state:** `Employee` has no `reportingManagerId` field.  
**Fix:** Add `reportingManagerId String? @map("reporting_manager_id")` as a self-referential FK on `Employee` with a `reportingManager Employee?` relation.

### S-003: `performance_evaluations` table missing
**Spec ref:** Section 5.5 — "Evaluation: supervisor or authorised reviewer assessment"  
**Current state:** `KpiResult` has review/approve fields but no separate evaluation record with narrative assessment or scoring bands.  
**Fix:** Add `PerformanceEvaluation` model: `id`, `tenantId`, `cycleId`, `subjectType`, `subjectId`, `evaluatorId`, `overallScore?`, `scoringBand?`, `narrativeSummary?`, `status`, `createdAt`, `updatedAt`. Link to `PerformanceCycle`.

### S-004: `performance_evidence` table missing
**Spec ref:** Section 5.5 — "Evidence: supporting file, record, link or explanation"  
**Current state:** `KpiResult.evidenceRef` is a single string. The spec requires structured evidence records that can be files, links, or text.  
**Fix:** Add `PerformanceEvidence` model: `id`, `tenantId`, `kpiResultId`, `evidenceType` (FILE/LINK/TEXT enum), `description`, `fileKey?`, `url?`, `uploadedById`, `createdAt`. Relate to `KpiResult`.

### S-005: `improvement_plans` table missing
**Spec ref:** Section 5.5 — "Improvement plan: actions agreed where performance needs improvement"  
**Current state:** No model exists.  
**Fix:** Add `ImprovementPlan` model: `id`, `tenantId`, `employeeId`, `cycleId?`, `title`, `description?`, `status` (DRAFT/ACTIVE/COMPLETED/CLOSED enum), `ownerId?`, `dueDate?`, `closedAt?`, `createdById?`, `createdAt`, `updatedAt`.

### S-006: `project_deliverables` table missing
**Spec ref:** Section 5.7 — "Create milestones and deliverables"  
**Current state:** `ProjectMilestone` exists but deliverables are a distinct concept — a concrete output, not just a checkpoint.  
**Fix:** Add `ProjectDeliverable` model: `id`, `tenantId`, `researchProjectId`, `title`, `description?`, `dueDate?`, `deliveredAt?`, `status`, `ownerId?`, `createdAt`, `updatedAt`.

### S-007: `mfa_methods` table missing
**Spec ref:** Section 5.3 — "Support MFA for privileged accounts" + Section 15.1  
**Current state:** `TenantSettings.mfaRequired` field exists but no MFA storage model or implementation.  
**Fix (storage layer first):** Add `MfaMethod` model: `id`, `userId`, `tenantId`, `type` (TOTP enum), `secret` (store encrypted), `verified Boolean @default(false)`, `createdAt`. TOTP logic (using `otplib`) is a separate implementation task after the schema is in place.

### S-008: `strategic_objectives` table missing
**Spec ref:** Section 10.1 — `strategic_objectives`  
**Current state:** `PerformanceObjective` is cycle-scoped. Strategic objectives are institution-level, multi-year goals that objectives cascade from.  
**Fix:** Add `StrategicObjective` model: `id`, `tenantId`, `title`, `description?`, `startYear Int?`, `endYear Int?`, `status`, `createdById?`, `createdAt`, `updatedAt`. Add optional `strategicObjectiveId` FK to `PerformanceObjective`.

---

## Priority 3 — Background Jobs (Stubbed Features)

### J-001: DNS domain verification job
**Spec ref:** CMS Spec Section 12 — "RIMS verifies domain control"  
**Current state:** `DomainsService.verify()` immediately sets `verificationStatus = VERIFIED` with a comment "Stub: in production, this would check DNS TXT records".  
**Fix:** Add a BullMQ processor in `apps/worker/src/processors/` that:
1. Queries DNS TXT records for `_rims-verify.<hostname>` using Node's `dns.promises.resolveTxt()`
2. Compares against `verificationToken` stored on `WebsiteDomain`
3. Sets status to `VERIFIED` on match or `FAILED` after a configurable number of retries
4. Uses BullMQ `attempts` + `backoff` options for exponential retry
5. `DomainsService.verify()` should enqueue this job instead of immediately setting VERIFIED

### J-002: Scheduled page publishing cron job
**Spec ref:** CMS Spec Section 10.2 — "Scheduled publishing uses the institution's timezone"  
**Current state:** `WebsitePage.scheduledAt` field exists. No job fires to publish pages at their scheduled time.  
**Fix:** Add a `@Cron('* * * * *')` job in the API (using `@nestjs/schedule`) that queries for pages with `status = APPROVED` and `scheduledAt <= now()` and calls the existing publish logic. Must set tenant context before each update.

### J-003: Contact submission retention/cleanup job
**Spec ref:** CMS Spec Section 16.2 — "Define retention periods"  
**Current state:** `WebsiteContactSubmission.retentionExpiresAt` is never populated or acted on.  
**Fix:**
1. Populate `retentionExpiresAt = receivedAt + 90 days` on submission creation in `PublicApiService.submitContact`
2. Add a nightly cron job that hard-deletes submissions past their `retentionExpiresAt`

### J-004: Sitemap generation per institution
**Spec ref:** CMS Spec Section 15 — "XML sitemap per institution"  
**Current state:** Not implemented.  
**Fix:** Add `GET /api/v1/public/sites/current/sitemap.xml` in `PublicController` that queries all published pages, news, events, and opportunities for the resolved tenant and returns a valid XML sitemap. Cache with a 1-hour TTL. Regenerate on publish/unpublish.

---

## Priority 4 — File Upload Pipeline

### FU-001: S3 presigned URL upload not wired
**Spec ref:** Section 19 — "Use S3-compatible object storage. Generate short-lived signed URLs after permission checks."  
**Current state:** `MediaService.create` generates an internal `storageKey` but does not upload anything. `Document` model has `fileKey` but no upload mechanism exists.  
**Fix:**
1. Add `AWS_S3_BUCKET`, `AWS_S3_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` to `.env.example`
2. Install `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`
3. Create `apps/api/src/common/storage/storage.service.ts` wrapping presigned PUT and GET URL generation
4. Update `MediaService.create` to return a presigned upload URL alongside the created record
5. Update `DocumentsService` similarly for document uploads
6. Add `GET /documents/:id/download-url` endpoint that generates a short-lived presigned GET URL after permission check — never expose `fileKey` directly

---

## Priority 5 — Missing Documentation

**Spec ref:** Section 24.3 — Required project documentation

### D-001: `docs/API_SPECIFICATION.md` missing
Swagger is running at `/api/docs` but no static API spec document exists.  
**Fix:** Export the OpenAPI JSON from the running app (`GET /api/docs-json`) and save as `docs/openapi.json`. Add a note in README on how to regenerate it. Create `docs/API_SPECIFICATION.md` as a human-readable summary of endpoint groups, auth model, and pagination conventions.

### D-002: `docs/SECURITY.md` missing
**Fix:** Create `docs/SECURITY.md` covering: auth model (argon2id, JWT rotation), RLS implementation, CORS config, rate limiting, secrets management, known open security decisions (CSRF, MFA), and how to report vulnerabilities.

### D-003: `docs/TESTING_STRATEGY.md` missing
**Fix:** Create `docs/TESTING_STRATEGY.md` documenting: unit test approach (Jest for API, Vitest for web), integration test patterns, how to run tests, what is covered, what is not yet covered, and the E2E test plan (Playwright — see T-001).

---

## Priority 6 — Testing Gaps

### T-001: No E2E test suite (Playwright not set up)
**Spec ref:** Section 20.3 — 17-step E2E scenario  
**Current state:** Jest unit/integration tests exist for the API. No Playwright setup anywhere.  
**Fix:**
1. Add `@playwright/test` to `apps/web/package.json` devDependencies
2. Create `apps/web/e2e/playwright.config.ts`
3. Implement the 17-step scenario from spec section 20.3 as the baseline suite
4. Add `pnpm --filter @rims/web e2e` script and include in `turbo.json` pipeline

### T-002: No cross-tenant security tests
**Spec ref:** Section 20.4 — "Cross-tenant read attempts, cross-tenant write attempts, tenant ID tampering"  
**Current state:** `permissions.guard.spec.ts` and `audit.service.spec.ts` exist but no explicit cross-tenant isolation tests.  
**Fix:** Add integration tests in `apps/api/src/` that:
1. Provision two tenants with separate users via `provisionTrial`
2. Authenticate as Tenant A's user
3. Attempt to read/write Tenant B's employee, project, and document records directly
4. Assert 403 or 404 on all attempts

---

## Priority 7 — Minor Fixes (Low Risk)

### M-001: Swagger product name incorrect
**File:** `apps/api/src/main.ts` line 55  
**Current:** `"Regulatory Information Management System REST API"`  
**Fix:** Change to `"Research Institute Management System REST API"`

### M-002: Theme CSS variables not wired in `public-web`
**Current state:** `WebsiteThemeSelection` model exists. `apps/public-web` uses a single hardcoded Tailwind theme.  
**Fix:** Read `branding.primaryColor`, `branding.secondaryColor`, `branding.accentColor` from the site info API and inject as CSS custom properties (`--color-primary`, etc.) on the root `<html>` element in `apps/public-web/src/app/layout.tsx`.

### M-003: `robots.txt` per institution missing
**Spec ref:** CMS Spec Section 15 — "`robots.txt` per website"  
**Fix:** Add `GET /api/v1/public/sites/current/robots.txt` in `PublicController` returning a basic robots.txt that allows all crawlers and references the sitemap URL.

### M-004: `quality_templates` table missing
**Spec ref:** Section 5.11 — "Create review templates and checklists"  
**Current state:** `QualityReview` exists but has no template/checklist model.  
**Fix:** Add `QualityTemplate` model: `id`, `tenantId`, `name`, `reviewType`, `checklistJson Json`, `isActive Boolean @default(true)`, `createdAt`, `updatedAt`. Add optional `templateId` FK to `QualityReview`.

### M-005: `document_links` table missing
**Spec ref:** Section 10.1 — `document_links`  
**Current state:** Documents cannot be linked to projects, employees, manuscripts, or quality records.  
**Fix:** Add `DocumentLink` model: `id`, `tenantId`, `documentId`, `linkedResourceType String`, `linkedResourceId String`, `createdById?`, `createdAt`. Add relation to `Document`.

### M-006: `deployment_records` table missing
**Spec ref:** Section 10.1 — platform-level deployment metadata  
**Assessment:** Low priority for MVP. Only relevant when building dedicated deployment automation.  
**Fix:** Defer until Phase 4 dedicated deployment work begins.

---

## Summary Table

| ID | Area | Priority | Effort | Sprint |
|---|---|---|---|---|
| S-001 | `employee_certifications` schema | High | Small | 1 |
| S-002 | Reporting manager FK on `Employee` | High | Small | 1 |
| S-003 | `performance_evaluations` schema | High | Medium | 1 |
| S-004 | `performance_evidence` schema | High | Small | 1 |
| S-005 | `improvement_plans` schema | High | Small | 1 |
| S-006 | `project_deliverables` schema | Medium | Small | 1 |
| S-007 | `mfa_methods` schema + TOTP | Medium | Large | 3 |
| S-008 | `strategic_objectives` schema | Low | Small | 3 |
| T-002 | Cross-tenant security tests | High | Medium | 1 |
| M-001 | Swagger product name fix | Low | Trivial | 1 |
| FU-001 | S3 presigned URL upload pipeline | High | Large | 2 |
| J-001 | DNS domain verification job | High | Medium | 2 |
| J-002 | Scheduled page publishing cron | Medium | Small | 2 |
| J-003 | Contact submission retention job | Medium | Small | 2 |
| J-004 | Sitemap generation | Medium | Small | 2 |
| M-003 | `robots.txt` endpoint | Low | Small | 2 |
| D-001 | `docs/API_SPECIFICATION.md` | Medium | Small | 3 |
| D-002 | `docs/SECURITY.md` | Medium | Small | 3 |
| D-003 | `docs/TESTING_STRATEGY.md` | Medium | Small | 3 |
| T-001 | Playwright E2E suite | Medium | Large | 3 |
| M-002 | Theme CSS vars in `public-web` | Low | Small | 3 |
| M-004 | `quality_templates` schema | Low | Small | 3 |
| M-005 | `document_links` schema | Low | Small | 3 |
| M-006 | `deployment_records` schema | Low | Defer | — |

---

## Recommended Execution Order

### Sprint 1 — Schema + Security (foundation work, no external dependencies)
1. Batch S-001 through S-006 and S-008 into a single Prisma migration
2. T-002 — cross-tenant security tests (validates existing RLS before adding more surface area)
3. M-001 — Swagger name fix (trivial, do it while the API is open)

### Sprint 2 — File Pipeline + Background Jobs
4. FU-001 — S3 upload pipeline (unblocks document and media features end-to-end)
5. J-001 — DNS verification job (removes the most visible stub)
6. J-002 + J-003 — scheduled publishing + retention cleanup (both small, same cron setup)
7. J-004 + M-003 — sitemap + robots.txt (pair these, same public controller)

### Sprint 3 — Docs, Tests, Advanced Features
8. D-001, D-002, D-003 — missing documentation
9. T-001 — Playwright E2E suite
10. S-007 — MFA (large, needs careful crypto implementation)
11. M-002 — theme CSS vars in public-web
12. M-004, M-005 — quality templates + document links
