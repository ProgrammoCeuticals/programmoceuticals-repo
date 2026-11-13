# Critical Transaction Rules
**Platform:** Pharmacy Internship Marketplace & Management Platform  
**Last updated:** 2026-10-17

These are the invariants that must be protected by database transactions and backend logic. No client-side check is sufficient. Every rule here must have a corresponding integration or unit test.

---

## §1 — Offer acceptance (most critical)

**Trigger:** `POST /offers/:id/accept`

### Pre-conditions (validate inside transaction)

1. Offer exists and its current status is `ISSUED`.
2. `offer.acceptance_deadline >= NOW()` — offer has not expired.
3. The applicant making the request is the offer's `applicant_user_id`.
4. The applicant has no other placement in a status of `OFFER_ACCEPTED`, `AWAITING_RESUMPTION`, `ACTIVE`, or `INTERRUPTED` for any other organisation.
5. The linked vacancy's `reserved_positions >= 1` (this offer holds a reservation).
6. The idempotency key has not been used before for this offer.

### Transaction steps (all-or-nothing)

```
BEGIN TRANSACTION

1. SELECT offer FOR UPDATE WHERE id = :offerId
   → Validate pre-conditions (all six above)

2. SELECT vacancy FOR UPDATE WHERE id = offer.vacancy_id
   → Re-validate reserved_positions >= 1

3. UPDATE offer SET status = 'ACCEPTED', decided_at = NOW(), decided_by_user_id = :applicantUserId

4. UPDATE vacancy SET
     reserved_positions = reserved_positions - 1,
     confirmed_positions = confirmed_positions + 1
   → Database CHECK constraint prevents reserved + confirmed > total_positions

5. INSERT placement (
     offer_id, application_id, applicant_user_id,
     organisation_id, location_id, vacancy_id,
     status = 'OFFER_ACCEPTED',
     reporting_date = offer.reporting_date
   )

6. UPDATE application (linked to this offer) SET status = 'ACCEPTED'

7. FOR EACH other ISSUED offer for this applicant:
   a. SELECT offer FOR UPDATE
   b. UPDATE offer SET status = 'DECLINED', decided_at = NOW()
   c. SELECT vacancy FOR UPDATE WHERE id = that_offer.vacancy_id
   d. UPDATE vacancy SET reserved_positions = reserved_positions - 1
   e. UPDATE linked application SET status = 'CLOSED_OTHER_OFFER_ACCEPTED'

8. FOR EACH other active application for this applicant
   (status IN DRAFT, SUBMITTED, UNDER_REVIEW, SHORTLISTED, INTERVIEWING, WAITLISTED)
   that does NOT have an ISSUED offer (already handled in step 7):
   a. UPDATE application SET status = 'CLOSED_OTHER_OFFER_ACCEPTED'

9. INSERT audit_event (
     event_type = 'OFFER_ACCEPTED',
     actor_user_id = :applicantUserId,
     entity_type = 'offers', entity_id = :offerId,
     payload = { placementId, closedApplicationIds, declinedOfferIds }
   )

10. INSERT INTO notification_outbox (one record per recipient):
    - Applicant: offer acceptance confirmation + placement details
    - Accepting employer: offer accepted
    - Each affected employer (steps 7): their offer was declined / their application was closed
    - Each notification record gets a unique idempotency_key

COMMIT
```

### Post-commit (async, NOT part of transaction)

- Worker processes `notification_outbox` records: sends emails, creates in-app notifications, sends push notifications.
- WebSocket server broadcasts `vacancy.counts.updated` for each affected vacancy.

### Failure rules

- If ANY pre-condition fails, ROLLBACK. Return appropriate error code.
- If the commit fails (e.g. deadlock), return 409/503. The client may retry with the same idempotency key.
- Notification delivery failures after commit do NOT trigger a rollback. The outbox retries until delivered.
- A duplicate request (same idempotency key) returns the previously committed result without re-executing.

### Concurrency protection

- `SELECT ... FOR UPDATE` on both the offer and the vacancy prevents two simultaneous acceptance requests from interfering.
- `SELECT ... FOR UPDATE SKIP LOCKED` is used by the offer expiry worker to avoid conflicting with an in-flight acceptance.
- The database `CHECK (reserved_positions + confirmed_positions <= total_positions)` is the last line of defence.

---

## §2 — Offer issuance (capacity reservation)

**Trigger:** `POST /offers/:id/issue`

### Transaction steps

```
BEGIN TRANSACTION

1. SELECT vacancy FOR UPDATE WHERE id = :vacancyId
2. VALIDATE vacancy.status = 'PUBLISHED'
3. VALIDATE vacancy.application_deadline >= TODAY (or NULL)
4. VALIDATE available_positions (total - reserved - confirmed) > 0
5. VALIDATE organisation is APPROVED
6. VALIDATE applicant's application is in a state that allows an offer (SHORTLISTED, INTERVIEWING)
7. VALIDATE no existing ISSUED or ACCEPTED offer exists for this (applicant, vacancy) combination
8. UPDATE vacancy SET reserved_positions = reserved_positions + 1
9. UPDATE offer SET status = 'ISSUED', issued_at = NOW(), issued_by_user_id = :userId
   (or INSERT offer with status = 'ISSUED' if creating at issuance)
10. INSERT audit_event
11. INSERT notification_outbox (notify applicant of offer received)

COMMIT
```

### Failure rules

- If no capacity (`available_positions = 0`), return 409 `NO_CAPACITY`. The employer may waitlist the candidate but cannot issue an offer.
- If vacancy is not PUBLISHED, return 409 `INVALID_TRANSITION`.
- Idempotency key check prevents duplicate offer issuance.

---

## §3 — Offer expiry

**Trigger:** Background worker (scheduled every 5 minutes or configurable)

```
SELECT id, vacancy_id FROM offers
WHERE status = 'ISSUED' AND acceptance_deadline < NOW()
FOR UPDATE SKIP LOCKED
LIMIT 50  -- process in batches

FOR EACH expired_offer:
  BEGIN TRANSACTION
  1. SELECT offer FOR UPDATE WHERE id = expired_offer.id
     → Re-check status = 'ISSUED' (race condition guard: might have been accepted)
  2. If status != 'ISSUED', ROLLBACK and continue to next
  3. UPDATE offer SET status = 'EXPIRED'
  4. SELECT vacancy FOR UPDATE WHERE id = expired_offer.vacancy_id
  5. UPDATE vacancy SET reserved_positions = reserved_positions - 1
  6. INSERT audit_event
  7. INSERT notification_outbox (notify applicant + employer)
  COMMIT
```

**Synchronous check:** The `POST /offers/:id/accept` endpoint also validates `acceptance_deadline >= NOW()` inside its own transaction, so expiry is caught even if the background worker has not run yet.

**Rule:** A reservation is released exactly once. The `SELECT FOR UPDATE` + status check ensures this.

---

## §4 — Offer decline or employer withdrawal

**Trigger:** `POST /offers/:id/decline` (applicant) or `POST /offers/:id/withdraw` (employer)

```
BEGIN TRANSACTION
1. SELECT offer FOR UPDATE
2. VALIDATE offer.status = 'ISSUED'
3. VALIDATE actor is authorised (applicant for DECLINED; employer staff for WITHDRAWN_BY_EMPLOYER)
4. UPDATE offer SET status = 'DECLINED' | 'WITHDRAWN_BY_EMPLOYER', decided_at = NOW()
5. SELECT vacancy FOR UPDATE WHERE id = offer.vacancy_id
6. UPDATE vacancy SET reserved_positions = reserved_positions - 1
7. INSERT audit_event
8. INSERT notification_outbox
COMMIT
```

---

## §5 — Vacancy capacity reduction

**Trigger:** `PATCH /vacancies/:id` when `total_positions` is reduced

```
BEGIN TRANSACTION
1. SELECT vacancy FOR UPDATE
2. Compute new_available = new_total - reserved_positions - confirmed_positions
3. IF new_available < 0:
   ROLLBACK
   Return 409 CONFLICT {
     "code": "CAPACITY_CONFLICT",
     "message": "Cannot reduce positions: N positions are reserved or confirmed",
     "reserved": X,
     "confirmed": Y,
     "minimum_allowed": X + Y
   }
4. UPDATE vacancy SET total_positions = new_total
5. INSERT audit_event
COMMIT
```

The database CHECK constraint is also present as a safety net, but the application-level check provides a clearer error message.

---

## §6 — Application submission snapshot

**Trigger:** `POST /applications/:id/submit` or `POST /applications` (with `isDraft: false`)

```
BEGIN TRANSACTION
1. SELECT vacancy FOR UPDATE (confirm status is PUBLISHED and deadline not passed)
2. Validate all required questions are answered (server-side)
3. Validate all required documents are uploaded
4. UPDATE application SET status = 'SUBMITTED', submitted_at = NOW(),
   form_version_snapshot = vacancy.form_version
5. INSERT application_snapshot {
     answers_json: current answers,
     documents_json: current document references,
     questions_snapshot: current vacancy_questions at form_version
   }
   -- This snapshot is immutable; later employer edits to the form do not change it
6. INSERT audit_event
7. INSERT notification_outbox (notify employer of new application)
COMMIT
```

---

## §7 — No partial state changes

This is a meta-rule. Every multi-step operation listed above must be wrapped in a single database transaction. If any step fails:
- The transaction is rolled back.
- No partial writes survive.
- The API returns a clear error.
- The client may safely retry (using the idempotency key where applicable).

Operations that must never leave partial state:
- Offer acceptance (§1)
- Offer issuance / reservation (§2)
- Offer expiry (§3)
- Offer decline / withdrawal (§4)
- Vacancy capacity reduction (§5)
- Application submission snapshot (§6)

---

## §8 — Notification delivery must not block business transactions

The transactional outbox pattern decouples notification delivery from business logic:

1. Notification records are inserted into `notification_outbox` inside the business transaction.
2. The transaction commits (or rolls back) independently of whether emails are sent.
3. A background worker reads `notification_outbox` records with `status = 'PENDING'` and delivers them.
4. Delivery failures increment `attempts` and schedule a retry (exponential backoff, max 5 attempts or configurable).
5. `SKIP LOCKED` in the worker query prevents duplicate processing.
6. Deduplication key (`idempotency_key`) prevents duplicate emails on retried jobs.
7. Email failure at delivery time does NOT trigger any database rollback.

---

## §9 — Idempotency enforcement

For `POST /offers/:id/accept`, `POST /offers/:id/issue`, and `POST /applications`:
1. Client supplies `Idempotency-Key: <uuid>` header.
2. Before executing the transaction, check an idempotency store (Redis or database) for the key.
3. If key exists: return the cached response immediately without re-executing.
4. If key is new: execute the transaction, cache the response, return it.
5. Cache TTL: 24 hours.

This prevents duplicate placements, duplicate offers, and duplicate applications from concurrent retries or accidental double-clicks.

---

## §10 — Tests that must pass before production

Every rule in this document must have a corresponding automated test. Critical tests:

| Test | Scenario |
|---|---|
| T-001 | Applicant cannot accept two offers concurrently (use parallel requests) |
| T-002 | Accepting offer auto-declines other ISSUED offers |
| T-003 | Accepting offer auto-closes other active applications (CLOSED_OTHER_OFFER_ACCEPTED) |
| T-004 | Accepted offer's reservation converts to confirmed position |
| T-005 | Declined/expired offers release reservation exactly once |
| T-006 | Two simultaneous acceptance requests for the last position: only one succeeds |
| T-007 | Duplicate acceptance request returns same placement (idempotency) |
| T-008 | Expired offer cannot be accepted |
| T-009 | ISSUED offer reserves capacity; vacancy available_positions decreases by 1 |
| T-010 | Capacity reduction rejected when reserved + confirmed >= new total |
| T-011 | Offer cannot be issued when available_positions = 0 |
| T-012 | Failed transaction leaves no partial state changes |
| T-013 | Notification failure does not roll back a committed offer acceptance |
| T-014 | Unapproved organisation cannot publish a vacancy |
| T-015 | Uploading a licence alone does not approve an organisation |
| T-016 | Internal employer notes not returned by any applicant-scoped endpoint |
| T-017 | Application snapshot is immutable after submission (employer form edits do not alter it) |
| T-018 | Placement not auto-completed when expected end date passes |
| T-019 | Applicant cannot submit application to closed/paused/filled vacancy |
| T-020 | One organisation cannot access another's applications or documents |
