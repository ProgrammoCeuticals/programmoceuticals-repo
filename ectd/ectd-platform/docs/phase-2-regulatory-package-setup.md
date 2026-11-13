# Phase 2 — Regulatory Package Setup Guide

## Overview

This document describes how to import, verify, and activate the official ICH eCTD v4.0 regulatory packages after the initial seed.

The system enforces the following invariants (spec §3):

- A **failed import never partially activates**.
- Once imported, **source files are immutable**.
- Old packages remain available for **historical validation and reproducibility**.
- Activation is always a **separate explicit command** after successful import.

---

## Prerequisites

1. The application is running and seeded (`pnpm db:seed`).
2. Docker Compose services are up (postgres + redis + api).
3. You have a Super Admin JWT token (login via `POST /api/v1/auth/login`).
4. You have downloaded the official packages from the authoritative sources listed below.

---

## Authoritative Package Sources

| Package                             | Authority | URL                                                                                                                      | Current Version (Sep 2026) |
| ----------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------- |
| ICH eCTD v4.0 Implementation Guide  | ICH       | https://admin.ich.org/page/ich-electronic-common-technical-document-ectd-v40                                             | v1.7                       |
| ICH eCTD v4.0 Controlled Vocabulary | ICH       | https://admin.ich.org/page/ich-electronic-common-technical-document-ectd-v40                                             | v1.0.3                     |
| FDA Regional M1 IG                  | FDA       | https://www.fda.gov/drugs/electronic-regulatory-submission-and-review/ectd-submission-standards-ectd-v40-and-regional-m1 | See FDA page               |
| FDA Regional CV                     | FDA       | Same as above                                                                                                            | Updated Aug 28, 2026       |
| FDA Validation Criteria             | FDA       | https://www.fda.gov/media/194434/download                                                                                | v1.6 (Aug 28, 2026)        |

**NAFDAC**: Do not create a NAFDAC regional specification until an authoritative NAFDAC eCTD v4.0 specification is published — spec §62.

---

## Step 1 — Upload archive to storage

Place the ZIP archive in the storage root before calling the import API.

```bash
# Development (local storage)
cp ICH_eCTD_v40_IG_v1.7.zip /tmp/ectd-storage/regulatory/ICH_IG_v1.7.zip

# Compute SHA-256 checksum (required for import verification)
shasum -a 256 ICH_eCTD_v40_IG_v1.7.zip
```

---

## Step 2 — Import the Implementation Guide

```http
POST /api/v1/regulatory/packages/import
Authorization: Bearer <super-admin-token>
Content-Type: application/json

{
  "expectedChecksum": "<sha256-hex-from-step-1>",
  "storageKey": "regulatory/ICH_IG_v1.7.zip",
  "sourceFilename": "ICH_eCTD_v40_IG_v1.7.zip",
  "packageType": "IMPLEMENTATION_GUIDE",
  "name": "ICH eCTD v4.0 Implementation Guide",
  "version": "1.7",
  "sourceUri": "https://admin.ich.org/page/ich-electronic-common-technical-document-ectd-v40",
  "authority": "ICH",
  "region": "ICH",
  "effectiveDate": "2024-01-01",
  "idempotencyKey": "ich-ig-v1.7-import-001"
}
```

**Expected response (success):**

```json
{
  "outcome": "SUCCESS",
  "artifactId": "<uuid>",
  "verifiedChecksum": "<sha256>",
  "steps": [
    { "name": "VERIFY_CHECKSUM", "status": "PASSED" },
    { "name": "VALIDATE_STRUCTURE", "status": "PASSED" },
    { "name": "PARSE_METADATA", "status": "PASSED" },
    { "name": "IMPORT_SCHEMAS", "status": "SKIPPED" },
    { "name": "IMPORT_CODE_LISTS", "status": "SKIPPED" },
    { "name": "IMPORT_CONFIGURATION", "status": "SKIPPED" },
    { "name": "CONSISTENCY_CHECKS", "status": "PASSED" },
    { "name": "REGISTER_PACKAGE", "status": "PASSED" }
  ]
}
```

Note: IMPORT_SCHEMAS, IMPORT_CODE_LISTS, IMPORT_CONFIGURATION are "SKIPPED" in Phase 2 (see REGULATORY_GAP notes in worker). They are completed once the post-registration parsers are fully implemented.

---

## Step 3 — Activate the Implementation Guide

```http
POST /api/v1/regulatory/packages/<artifactId>/activate
Authorization: Bearer <super-admin-token>
Content-Type: application/json

{
  "reason": "ICH eCTD v4.0 IG v1.7 — initial activation"
}
```

---

## Step 4 — Link IG to the ICH eCTD v4.0 Standard

Get the standard ID first:

```http
GET /api/v1/regulatory/standards
```

Then link:

```http
POST /api/v1/regulatory/standards/<standardId>/link-implementation-guide
Authorization: Bearer <super-admin-token>
Content-Type: application/json

{
  "artifactId": "<ig-artifact-id>"
}
```

---

## Step 5 — Import and activate the Controlled Vocabulary

Repeat steps 1–3 for the CV package (`packageType: "CONTROLLED_VOCABULARY"`), then:

```http
POST /api/v1/regulatory/standards/<standardId>/link-controlled-vocabulary
Authorization: Bearer <super-admin-token>
Content-Type: application/json

{
  "artifactId": "<cv-artifact-id>"
}
```

---

## Step 6 — Register FDA Regional Specification (US submissions)

```http
POST /api/v1/regulatory/specifications
Authorization: Bearer <super-admin-token>
Content-Type: application/json

{
  "name": "FDA eCTD v4.0 Regional Module 1",
  "version": "2.6",
  "regionId": "<us-region-id>",
  "authorityId": "<fda-authority-id>",
  "ectdStandardId": "<ich-standard-id>",
  "effectiveFrom": "2024-01-01"
}
```

Region and authority IDs are available from:

- `GET /api/v1/regulatory/regions`
- `GET /api/v1/regulatory/authorities`

---

## Step 7 — Verify profile resolution

Once packages are linked, verify that a Submission Unit can resolve its regulatory profile:

```http
GET /api/v1/regulatory/resolve-profile/<submissionUnitId>
```

This endpoint uses the same resolution logic as the validation and XML engines. If it succeeds, the submission unit is ready for Phase 7 (XML) and Phase 8 (Validation).

---

## Superseding older package versions

When a new version is released (e.g., FDA updates their validation criteria):

1. Import and activate the new package (steps 1–3).
2. Supersede the old one:

```http
POST /api/v1/regulatory/packages/<old-artifact-id>/supersede
Authorization: Bearer <super-admin-token>
Content-Type: application/json

{
  "reason": "Superseded by FDA Validation Criteria v1.7 (released YYYY-MM-DD)"
}
```

The old package is **never deleted** — it remains available for historical Submission Unit validation — spec §3, §8.

---

## REGULATORY_GAP Summary for Phase 2

| Gap                               | Blocked Implementation                         | Required Source                              |
| --------------------------------- | ---------------------------------------------- | -------------------------------------------- |
| IMPORT_SCHEMAS not implemented    | XSD schema registry for Phase 7 XML validation | Official ICH schema package files            |
| IMPORT_CODE_LISTS not implemented | CV lookup in validation engine (Phase 8)       | Official ICH Genericode files                |
| NAFDAC regional spec              | NAFDAC-specific Submission Units               | Authoritative NAFDAC eCTD v4.0 specification |
| CTD Structure package             | ContextDefinition seeding                      | ICH CTD table-of-contents package            |

All gaps are documented with `REGULATORY_GAP:` comments in source code and must not be worked around by invention.
