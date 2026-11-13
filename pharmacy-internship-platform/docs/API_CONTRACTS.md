# API Contracts
**Platform:** Pharmacy Internship Marketplace & Management Platform  
**Last updated:** 2026-10-17  
**Base path:** `/api/v1`  
**Format:** REST. Full OpenAPI spec to be generated from NestJS decorators.

---

## Conventions

### Authentication
- All private routes require `Authorization: Bearer <access_token>`
- Tokens are short-lived JWTs (15 min default). Refresh via `POST /auth/refresh`.
- Refresh tokens are HTTP-only cookies (or stored securely per platform policy).

### Errors
```json
{
  "statusCode": 422,
  "error": "Unprocessable Entity",
  "message": "Offer acceptance deadline has passed",
  "code": "OFFER_EXPIRED"
}
```
Standard codes: `VALIDATION_ERROR`, `UNAUTHORISED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `OFFER_EXPIRED`, `NO_CAPACITY`, `ALREADY_PLACED`, `INVALID_TRANSITION`

### Pagination
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 143,
    "totalPages": 8
  }
}
```

### Idempotency
For offer issuance and offer acceptance, clients must supply `Idempotency-Key: <uuid>` header. The server returns a cached response for duplicate keys within a 24-hour window.

---

## Route groups

---

### `/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register applicant account |
| POST | `/auth/verify-email` | Public | Verify email with token |
| POST | `/auth/login` | Public | Issue access + refresh tokens |
| POST | `/auth/refresh` | Public (cookie) | Rotate access token |
| POST | `/auth/logout` | Bearer | Invalidate refresh token |
| POST | `/auth/forgot-password` | Public | Trigger password reset email |
| POST | `/auth/reset-password` | Public | Apply new password via reset token |

**Rate limits:** `/auth/login` and `/auth/register` — 10 requests per 15 min per IP. `/auth/forgot-password` — 5 per hour per email.

**POST /auth/register**
```json
Request: { "email": "string", "password": "string (min 8, complexity enforced server-side)" }
Response 201: { "userId": "uuid", "message": "Verification email sent" }
```

**POST /auth/login**
```json
Request: { "email": "string", "password": "string" }
Response 200: { "accessToken": "string", "expiresIn": 900 }
// Refresh token set as HTTP-only cookie
```

---

### `/users`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/users/me` | Bearer | Get own user record |
| PATCH | `/users/me` | Bearer | Update own account (email change triggers re-verification) |
| DELETE | `/users/me` | Bearer | Request account deletion |

---

### `/applicant-profiles`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/applicant-profiles/me` | APPLICANT | Get own profile |
| PUT | `/applicant-profiles/me` | APPLICANT | Create or update profile |
| POST | `/applicant-profiles/me/documents` | APPLICANT | Upload reusable document (CV etc.) |
| GET | `/applicant-profiles/me/documents` | APPLICANT | List own reusable documents |
| DELETE | `/applicant-profiles/me/documents/:id` | APPLICANT | Remove own document |

---

### `/organisations`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/organisations` | Public | List approved organisations (paginated, filterable) |
| GET | `/organisations/:id` | Public | View approved org profile |
| POST | `/organisations` | APPLICANT / any auth | Register new organisation (creator becomes ORG_OWNER) |
| PATCH | `/organisations/:id` | ORG_OWNER | Update own organisation |
| GET | `/organisations/:id/locations` | Public (approved orgs) | List locations |
| POST | `/organisations/:id/locations` | ORG_OWNER | Add location |
| PATCH | `/organisations/:id/locations/:locId` | ORG_OWNER | Update location |
| GET | `/organisations/:id/staff` | ORG_OWNER | List staff memberships |
| POST | `/organisations/:id/staff/invite` | ORG_OWNER | Invite staff member |
| PATCH | `/organisations/:id/staff/:memberId/roles` | ORG_OWNER | Update staff roles |
| DELETE | `/organisations/:id/staff/:memberId` | ORG_OWNER | Revoke staff access |

**GET /organisations (public filters):**
`?practiceArea=uuid&state=uuid&city=text&accommodation=PROVIDED&status=PUBLISHED&page=1&pageSize=20`

---

### `/verification`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/verification/my-case` | ORG_OWNER | Get own organisation's verification case |
| POST | `/verification/submit` | ORG_OWNER | Submit organisation for verification |
| POST | `/verification/documents` | ORG_OWNER | Upload verification document |
| GET | `/verification/queue` | PLATFORM_ADMIN | List all verification cases (filterable) |
| GET | `/verification/cases/:id` | PLATFORM_ADMIN | Get full verification case detail |
| POST | `/verification/cases/:id/assign` | PLATFORM_ADMIN | Assign reviewer |
| POST | `/verification/cases/:id/status` | PLATFORM_ADMIN | Update status (e.g. move to UNDER_REVIEW) |
| POST | `/verification/cases/:id/request-info` | PLATFORM_ADMIN | Request additional information |
| POST | `/verification/cases/:id/schedule-meeting` | PLATFORM_ADMIN | Schedule verification meeting |
| POST | `/verification/cases/:id/record-meeting` | PLATFORM_ADMIN | Record meeting outcome |
| POST | `/verification/cases/:id/decide` | PLATFORM_ADMIN | Record APPROVED / REJECTED / SUSPENDED decision |

**POST /verification/cases/:id/decide**
```json
Request: { "decision": "APPROVED|REJECTED|SUSPENDED", "reason": "string (required for REJECTED/SUSPENDED)" }
Response 200: { "caseId": "uuid", "status": "APPROVED", "decidedAt": "ISO8601" }
// Side effects: org.verification_status updated, audit event created, notification sent
```

---

### `/vacancies`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/vacancies` | Public | Search/list published vacancies |
| GET | `/vacancies/:id` | Public | View vacancy details |
| POST | `/vacancies` | RECRUITER_HR / ORG_OWNER | Create vacancy draft |
| PATCH | `/vacancies/:id` | RECRUITER_HR / ORG_OWNER | Update vacancy (bumps form_version if questions change) |
| POST | `/vacancies/:id/publish` | RECRUITER_HR / ORG_OWNER | Publish (org must be APPROVED) |
| POST | `/vacancies/:id/pause` | RECRUITER_HR / ORG_OWNER | Pause |
| POST | `/vacancies/:id/close` | RECRUITER_HR / ORG_OWNER | Close |
| POST | `/vacancies/:id/archive` | RECRUITER_HR / ORG_OWNER | Archive |
| GET | `/vacancies/:id/counts` | Public (cached) | Real-time position counts |

**GET /vacancies (public filters):**
`?practiceArea=uuid&state=uuid&city=text&accommodation=PROVIDED&deadlineAfter=date&startAfter=date&keyword=text&sort=deadline_asc|posted_desc&page=1&pageSize=20`

**GET /vacancies/:id/counts — response:**
```json
{
  "vacancyId": "uuid",
  "totalPositions": 10,
  "reservedPositions": 2,
  "confirmedPositions": 3,
  "availablePositions": 5,
  "updatedAt": "ISO8601"
}
```
This is derived from the database; never trust client-supplied counts.

---

### `/applications`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/applications` | APPLICANT | Submit application (or create draft) |
| GET | `/applications/mine` | APPLICANT | List own applications |
| GET | `/applications/:id` | APPLICANT (own) / RECRUITER_HR (own org) | Get application detail |
| PATCH | `/applications/:id` | APPLICANT (DRAFT only) | Update draft application |
| POST | `/applications/:id/submit` | APPLICANT | Submit draft |
| POST | `/applications/:id/withdraw` | APPLICANT | Withdraw application |
| GET | `/applications/:id/documents/:docId/download` | APPLICANT (own) / RECRUITER_HR (own org) | Get signed download URL |
| GET | `/vacancies/:id/applications` | RECRUITER_HR / ORG_OWNER | List applications for a vacancy |
| POST | `/applications/:id/status` | RECRUITER_HR | Update status (shortlist, reject, etc.) |
| POST | `/applications/:id/notes` | RECRUITER_HR | Add internal note |
| GET | `/applications/:id/notes` | RECRUITER_HR / INTERNSHIP_COORDINATOR | Get internal notes (never in applicant response) |
| POST | `/applications/:id/credential-check` | RECRUITER_HR | Record credential check result |

**POST /applications**
```json
Request: {
  "vacancyId": "uuid",
  "isDraft": false,
  "answers": [{ "questionId": "uuid", "answerText": "string" }],
  "idempotencyKey": "uuid"
}
Response 201: { "applicationId": "uuid", "status": "SUBMITTED", "submittedAt": "ISO8601" }
```
Server validates all required questions, documents, deadline, and vacancy status.

---

### `/interviews`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/vacancies/:id/stages` | RECRUITER_HR / ORG_OWNER | List interview stages |
| POST | `/vacancies/:id/stages` | RECRUITER_HR | Create stage |
| PATCH | `/vacancies/:id/stages/:stageId` | RECRUITER_HR | Update stage |
| GET | `/applications/:id/interviews` | APPLICANT (own) / RECRUITER_HR (own org) | List interview events |
| POST | `/applications/:id/interviews` | RECRUITER_HR | Schedule interview event |
| PATCH | `/applications/:id/interviews/:eventId` | RECRUITER_HR | Reschedule / update |
| POST | `/applications/:id/interviews/:eventId/cancel` | RECRUITER_HR | Cancel event |
| POST | `/applications/:id/interviews/:eventId/outcome` | RECRUITER_HR | Record outcome (internal) |
| GET | `/applicant-profiles/me/interviews` | APPLICANT | List own upcoming/past interviews |

---

### `/offers`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/applicant-profiles/me/offers` | APPLICANT | List own offers |
| GET | `/offers/:id` | APPLICANT (own) / RECRUITER_HR (own org) | Get offer detail |
| POST | `/offers` | RECRUITER_HR / ORG_OWNER | Create offer draft |
| PATCH | `/offers/:id` | RECRUITER_HR / ORG_OWNER | Update draft offer |
| POST | `/offers/:id/issue` | RECRUITER_HR / ORG_OWNER | Issue offer to candidate |
| POST | `/offers/:id/accept` | APPLICANT | Accept offer (atomic transaction) |
| POST | `/offers/:id/decline` | APPLICANT | Decline offer |
| POST | `/offers/:id/withdraw` | RECRUITER_HR / ORG_OWNER | Withdraw offer (before acceptance) |
| GET | `/vacancies/:id/offers` | RECRUITER_HR / ORG_OWNER | List offers for a vacancy |

**POST /offers/:id/issue**
```json
Headers: { "Idempotency-Key": "uuid" }
Request: { "acceptanceDeadline": "ISO8601 datetime" }
// Backend validates: application status allows offer, capacity > 0, organisation approved
Response 201: { "offerId": "uuid", "status": "ISSUED", "acceptanceDeadline": "ISO8601" }
```

**POST /offers/:id/accept — CRITICAL ENDPOINT**
```json
Headers: { "Idempotency-Key": "uuid" }
Request: {} (no additional body needed; offer is identified by :id, applicant by JWT)
// Backend executes atomic transaction (see TRANSACTION_RULES.md §1)
Response 200: {
  "offerId": "uuid",
  "placementId": "uuid",
  "status": "ACCEPTED",
  "closedApplications": [{ "applicationId": "uuid", "reason": "CLOSED_OTHER_OFFER_ACCEPTED" }],
  "declinedOffers": [{ "offerId": "uuid" }]
}
Errors:
  409 OFFER_EXPIRED — acceptance deadline has passed
  409 ALREADY_PLACED — applicant already has an active accepted placement
  409 NO_CAPACITY — no positions available (should not happen if reservation was valid, but checked)
  409 INVALID_TRANSITION — offer is not in ISSUED state
```

---

### `/placements`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/placements/mine` | APPLICANT | Get own active/historical placements |
| GET | `/placements/:id` | APPLICANT (own) / INTERNSHIP_COORDINATOR (own org) / PLATFORM_ADMIN | Get placement detail |
| PATCH | `/placements/:id/status` | INTERNSHIP_COORDINATOR / PLATFORM_ADMIN | Update placement status |
| POST | `/placements/:id/complete` | INTERNSHIP_COORDINATOR | Mark placement completed |
| GET | `/organisations/:id/placements` | INTERNSHIP_COORDINATOR / ORG_OWNER | List org's placements |

---

### `/notifications`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/notifications` | Bearer | List own in-app notifications |
| POST | `/notifications/:id/read` | Bearer | Mark as read |
| POST | `/notifications/read-all` | Bearer | Mark all as read |
| GET | `/notifications/preferences` | Bearer | Get notification preferences |
| PATCH | `/notifications/preferences` | Bearer | Update preferences |

---

### `/admin`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/admin/metrics` | PLATFORM_ADMIN | Platform-wide dashboard metrics |
| GET | `/admin/users` | PLATFORM_ADMIN | List users |
| PATCH | `/admin/users/:id` | PLATFORM_ADMIN | Update user (deactivate, etc.) |
| GET | `/admin/audit-events` | PLATFORM_ADMIN | Query audit log |
| GET | `/admin/organisations` | PLATFORM_ADMIN | List all organisations |
| GET | `/admin/reference-data/practice-areas` | PLATFORM_ADMIN | List practice areas |
| POST | `/admin/reference-data/practice-areas` | PLATFORM_ADMIN | Add practice area |
| PATCH | `/admin/reference-data/practice-areas/:id` | PLATFORM_ADMIN | Update practice area |

---

### `/audit`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/audit/:entityType/:entityId` | PLATFORM_ADMIN / ORG_OWNER (own org) | Get audit history for entity |

---

## Real-time (WebSocket)

**Namespace:** `/ws/v1`

**Events emitted by server (after committed database changes):**
- `vacancy.counts.updated` — `{ vacancyId, totalPositions, reservedPositions, confirmedPositions, availablePositions }`
- `application.status.updated` — `{ applicationId, status }` (sent to applicant and employer rooms)
- `offer.status.updated` — `{ offerId, status }` (sent to applicant and employer rooms)
- `notification.new` — `{ notificationId, title, eventType }` (sent to user's room)

**Client rules:**
- On reconnect, refetch authoritative state from REST endpoints rather than relying on missed events.
- Do not apply WebSocket events to critical business decisions; they are UI hints only.

---

## Security controls summary

| Control | Implementation |
|---|---|
| Authentication | JWT Bearer; refresh token rotation |
| Authorisation | Decorator-enforced role + object-level membership check |
| IDOR prevention | Membership/ownership check on every object-level route |
| Input validation | DTO validation pipe on every endpoint (class-validator) |
| Rate limiting | Global + per-route (Throttler module) |
| File upload | MIME validation server-side; private S3; signed URLs; malware scan hook |
| Idempotency | `Idempotency-Key` header on mutating offer endpoints |
| Concurrency | `SELECT FOR UPDATE` in transactions for capacity changes |
| Secrets | Environment variables; never in source |
| Audit | `audit_events` written in same transaction as consequential changes |
| CORS | Configured allowlist; not wildcard in production |
| Helmet | HTTP security headers |
| Error leakage | No stack traces or internal details in production error responses |
