# Regulatory Verification Matrix — Current Status

Last updated: implementation completion pass.

| Area | Authoritative source required | Status |
|---|---|---|
| ICH eCTD v4.0 core | ICH Implementation Guide v1.7 | Baseline identified — EctdStandard seeded |
| ICH v4.0 schema | Official ICH schema package | REGULATORY_GAP: Must import via POST /regulatory/packages/import |
| ICH controlled vocabulary | ICH CV Package v1.0.3 | REGULATORY_GAP: Must import and link via regulatory API |
| Genericode | Official ICH CV package | REGULATORY_GAP: CodeListImporter implemented, awaiting official files |
| CTD headings/hierarchy | Applicable current package/authority | REGULATORY_GAP: CtdStructurePackage table exists, no data loaded |
| ICH validation | Current authoritative validation criteria | REGULATORY_GAP: ValidationRule table exists, no ICH rules loaded |
| File format rules | Current applicable specification | REGULATORY_GAP: Must import/verify |
| Regional Module 1 | Target-region authority | REGULATORY_GAP: Required per profile — not yet imported |
| Regional CV | Target-region authority | REGULATORY_GAP: Required per profile — not yet imported |
| Regional validation | Target-region authority | REGULATORY_GAP: Required per profile — not yet imported |
| Transmission | Target-regulator authority | Separate subsystem — not in MVP scope |
| v3.2.2 forward compatibility | Current v4.0 + regional guidance | REGULATORY_GAP: Must verify before implementation |
| Nigeria/NAFDAC v4.0 profile | Authoritative NAFDAC material | REGULATORY_GAP: No published spec — do not invent |
| XML namespaces | ICH IG v1.7 XSD files | REGULATORY_GAP: Placeholders in registry — blocked until IG imported |
| Sender OID | ICH-assigned OID via authority registration | REGULATORY_GAP: Set ECTD_SENDER_OID env var — do not invent |
| InteractionId | ICH IG v1.7 | REGULATORY_GAP: Must be extracted from installed IG package metadata |

## Implementation completion status

### Done in this pass

| Phase | Item | File(s) |
|---|---|---|
| A1 | PublishingService fully implemented | `apps/api/src/modules/publishing/publishing.service.ts` |
| A1 | PublishingModule registers PublishingService | `apps/api/src/modules/publishing/publishing.module.ts` |
| A2 | worker-validation wired with BullMQ processor | `apps/worker-validation/src/worker-validation.module.ts` |
| A2 | worker-publishing wired with BullMQ processor | `apps/worker-publishing/src/worker-publishing.module.ts` |
| A2 | worker-inspection wired with BullMQ processor | `apps/worker-inspection/src/worker-inspection.module.ts` |
| B1 | Integration test: audit persistence | `tests/integration/audit.persistence.spec.ts` |
| B1 | Integration test: regulatory package immutability | `tests/integration/regulatory-package.immutability.spec.ts` |
| B2 | E2E smoke test: full submission flow | `tests/e2e/smoke.spec.ts` |
| B3 | Contract test: OpenAPI spec validity | `tests/contract/openapi.spec.ts` |
| B4 | XML golden fixture tests | `tests/xml/golden-fixtures.spec.ts` |
| D | /health/regulatory enhanced with IG/CV/namespace/sender checks | `apps/api/src/modules/health/health.controller.ts` |
| D4 | CI: xml-tests and contract-tests jobs added | `.github/workflows/ci.yml` |
| D4 | CI: lint and build `|| true` bypasses removed | `.github/workflows/ci.yml` |
| D4 | CI: concurrency cancellation added | `.github/workflows/ci.yml` |

### Remaining gaps (require authoritative regulatory files)

| Gap | Blocked implementation | Required source |
|---|---|---|
| IMPORT_SCHEMAS not implemented in worker | XSD schema registry for XML validation | Official ICH schema package files |
| IMPORT_CODE_LISTS not implemented in worker | CV lookup in validation engine | Official ICH Genericode files |
| NAFDAC regional spec | NAFDAC-specific Submission Units | Authoritative NAFDAC eCTD v4.0 specification |
| CTD Structure package data | ContextDefinition seeding | ICH CTD table-of-contents package |
| ICH validation rules | ValidationRule population | ICH validation criteria v1.6+ |
| XML namespaces | Production XML generation | ICH IG v1.7 XSD files |
| Sender OID | XML generation + publishing | ICH-assigned OID from authority |
| InteractionId | XML generation | ICH IG v1.7 package metadata |
| Malware scanning (ClamAV) | Document upload pipeline | ECTD_CLAMAV_URL configured |
| Integration tests against real DB | Full FK/transaction coverage | Running PostgreSQL test instance |
| E2E tests | Full flow verification | Running API + seeded DB |
