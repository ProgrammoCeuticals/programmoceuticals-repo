# Workflow and State Diagrams
**Platform:** Pharmacy Internship Marketplace & Management Platform  
**Last updated:** 2026-10-17  
**Format:** Mermaid state diagrams. Render with any Mermaid-compatible viewer.

---

## 1. Centre Verification State Machine

```mermaid
stateDiagram-v2
    [*] --> DRAFT : Organisation registers
    DRAFT --> SUBMITTED : Centre submits documents & licence
    SUBMITTED --> UNDER_REVIEW : Admin opens review
    UNDER_REVIEW --> ADDITIONAL_INFORMATION_REQUIRED : Admin requests more docs
    ADDITIONAL_INFORMATION_REQUIRED --> UNDER_REVIEW : Centre supplies additional info
    UNDER_REVIEW --> MEETING_REQUIRED : Admin determines meeting needed
    MEETING_REQUIRED --> MEETING_SCHEDULED : Admin schedules meeting
    MEETING_SCHEDULED --> UNDER_REVIEW : Meeting held; admin records outcome
    UNDER_REVIEW --> APPROVED : Admin records approval decision
    UNDER_REVIEW --> REJECTED : Admin records rejection decision
    APPROVED --> SUSPENDED : Admin suspends (policy violation / complaint)
    APPROVED --> REVERIFICATION_REQUIRED : Periodic review trigger / document expiry
    REVERIFICATION_REQUIRED --> SUBMITTED : Centre resubmits
    SUSPENDED --> UNDER_REVIEW : Admin opens reinstatement review
    REJECTED --> [*]

    note right of APPROVED : Centre may publish vacancies
    note right of SUBMITTED : No vacancy publishing until APPROVED
    note right of SUSPENDED : Existing vacancies paused per policy
```

**Rules:**
- Only an authorised platform admin may trigger state transitions.
- Every transition creates an immutable audit event (actor, timestamp, reason).
- Centre cannot publish vacancies in any state other than APPROVED.
- SUSPENDED state: platform policy determines treatment of existing vacancies and active placements (to be confirmed — OD-003 adjacent).
- EXPIRED state applies only where verification has a defined expiry date; omitted here pending OD-004 confirmation.

---

## 2. Vacancy State Machine

```mermaid
stateDiagram-v2
    [*] --> DRAFT : Employer creates vacancy
    DRAFT --> PUBLISHED : Employer publishes (org must be APPROVED)
    PUBLISHED --> PAUSED : Employer pauses recruitment
    PAUSED --> PUBLISHED : Employer resumes
    PUBLISHED --> CLOSED : Employer closes / deadline passes
    PUBLISHED --> FILLED : All positions confirmed
    CLOSED --> PUBLISHED : Employer explicitly reopens (authorised)
    FILLED --> ARCHIVED : Employer archives
    CLOSED --> ARCHIVED : Employer archives
    DRAFT --> ARCHIVED : Employer discards draft
    ARCHIVED --> [*]

    note right of PUBLISHED : Accepts new applications
    note right of PAUSED : No new applications accepted
    note right of CLOSED : No new applications accepted
    note right of FILLED : No new applications accepted
```

**Rules:**
- Only an approved organisation can transition to PUBLISHED.
- Application submission is blocked for PAUSED, CLOSED, FILLED, and ARCHIVED vacancies.
- Application submission is blocked when the vacancy deadline has passed (even if status is PUBLISHED).
- `available_positions = total_positions - reserved_positions - confirmed_positions`
- Database constraint prevents `reserved + confirmed > total_positions`.

---

## 3. Application State Machine

```mermaid
stateDiagram-v2
    [*] --> DRAFT : Applicant saves draft (optional)
    DRAFT --> SUBMITTED : Applicant submits
    [*] --> SUBMITTED : Applicant submits directly
    SUBMITTED --> UNDER_REVIEW : Employer opens application
    UNDER_REVIEW --> SHORTLISTED : Employer shortlists
    UNDER_REVIEW --> REJECTED : Employer rejects
    SHORTLISTED --> INTERVIEWING : Employer invites to interview
    SHORTLISTED --> WAITLISTED : Employer waitlists
    SHORTLISTED --> REJECTED : Employer rejects
    INTERVIEWING --> SHORTLISTED : Stage complete; still shortlisted
    INTERVIEWING --> WAITLISTED : Employer waitlists after interview
    INTERVIEWING --> REJECTED : Employer rejects after interview
    INTERVIEWING --> OFFERED : Employer issues offer
    SHORTLISTED --> OFFERED : Employer issues offer (skipping interview)
    OFFERED --> ACCEPTED : Applicant accepts offer
    OFFERED --> DECLINED : Applicant declines offer
    OFFERED --> EXPIRED : Offer deadline passes without decision
    OFFERED --> WITHDRAWN_BY_EMPLOYER : Employer withdraws offer
    ACCEPTED --> [*] : Placement created
    SUBMITTED --> WITHDRAWN : Applicant withdraws
    UNDER_REVIEW --> WITHDRAWN : Applicant withdraws
    SHORTLISTED --> WITHDRAWN : Applicant withdraws
    INTERVIEWING --> WITHDRAWN : Applicant withdraws
    OFFERED --> WITHDRAWN : Applicant withdraws before deciding

    SUBMITTED --> CLOSED_VACANCY : Vacancy closed/filled before review
    UNDER_REVIEW --> CLOSED_VACANCY : Vacancy closed
    SHORTLISTED --> CLOSED_VACANCY : Vacancy closed
    INTERVIEWING --> CLOSED_VACANCY : Vacancy closed
    OFFERED --> CLOSED_OTHER_OFFER_ACCEPTED : Applicant accepted a different offer
    SUBMITTED --> CLOSED_OTHER_OFFER_ACCEPTED : Competing acceptance
    UNDER_REVIEW --> CLOSED_OTHER_OFFER_ACCEPTED : Competing acceptance
    SHORTLISTED --> CLOSED_OTHER_OFFER_ACCEPTED : Competing acceptance
    INTERVIEWING --> CLOSED_OTHER_OFFER_ACCEPTED : Competing acceptance
    OFFERED --> EXPIRED : Deadline passes
    SUBMITTED --> EXPIRED : Vacancy deadline passed
```

**Rules:**
- State transitions are enforced on the backend; frontend cannot skip steps.
- `CLOSED_OTHER_OFFER_ACCEPTED` is set in the same transaction as the offer acceptance.
- Employer internal notes are never returned to applicant API endpoints.
- `DRAFT` applications do not count against vacancy capacity.
- Employer edits to a vacancy form after submission do not alter the submitted snapshot.

---

## 4. Offer State Machine

```mermaid
stateDiagram-v2
    [*] --> DRAFT : Employer drafts offer
    DRAFT --> ISSUED : Employer issues offer to candidate
    ISSUED --> ACCEPTED : Candidate accepts (transaction validates capacity + deadline + no active placement)
    ISSUED --> DECLINED : Candidate declines
    ISSUED --> EXPIRED : Acceptance deadline passes (background job + synchronous check)
    ISSUED --> WITHDRAWN_BY_EMPLOYER : Employer withdraws before candidate decides
    ACCEPTED --> CANCELLED : Authorised cancellation workflow (post-acceptance)
    DECLINED --> [*]
    EXPIRED --> [*]
    WITHDRAWN_BY_EMPLOYER --> [*]
    CANCELLED --> [*]
```

**Rules:**
- ISSUED state reserves a vacancy position (if capacity is available; else employer cannot issue).
- ACCEPTED triggers the atomic offer-acceptance transaction (see TRANSACTION_RULES.md §1).
- EXPIRED, DECLINED, and WITHDRAWN_BY_EMPLOYER all release the reservation exactly once.
- CANCELLED after ACCEPTED terminates the linked Placement through a separate controlled workflow.
- Only the applicant can ACCEPT or DECLINE; only the employer can WITHDRAW_BY_EMPLOYER.
- The platform sets EXPIRED automatically (background job + synchronous endpoint check).

---

## 5. Vacancy Reservation Flow

```mermaid
sequenceDiagram
    participant E as Employer
    participant API as Backend API
    participant DB as Database (transaction)
    participant WS as WebSocket broadcast

    E->>API: POST /offers (candidate_id, vacancy_id)
    API->>DB: BEGIN TRANSACTION
    DB->>DB: SELECT vacancy FOR UPDATE
    DB->>DB: CHECK reserved + confirmed < total_positions
    alt Capacity available
        DB->>DB: INSERT offer (status=ISSUED)
        DB->>DB: UPDATE vacancy SET reserved_positions = reserved_positions + 1
        DB->>DB: COMMIT
        API->>WS: Broadcast vacancy count update
        API-->>E: 201 Created {offer_id}
    else No capacity
        DB->>DB: ROLLBACK
        API-->>E: 409 Conflict {error: "No positions available"}
    end
```

---

## 6. Offer Acceptance — Atomic Transaction

```mermaid
sequenceDiagram
    participant A as Applicant
    participant API as Backend API
    participant DB as Database (transaction)
    participant Q as Job Queue (outbox)

    A->>API: POST /offers/:id/accept
    API->>DB: BEGIN TRANSACTION
    DB->>DB: SELECT offer FOR UPDATE
    DB->>DB: VALIDATE offer.status = ISSUED
    DB->>DB: VALIDATE offer.deadline >= now()
    DB->>DB: VALIDATE applicant has no active accepted placement
    DB->>DB: SELECT vacancy FOR UPDATE
    DB->>DB: VALIDATE reserved_positions >= 1 (this offer's reservation)
    alt All validations pass
        DB->>DB: UPDATE offer SET status = ACCEPTED
        DB->>DB: UPDATE vacancy: reserved_positions - 1, confirmed_positions + 1
        DB->>DB: INSERT placement record
        DB->>DB: UPDATE other ISSUED offers for this applicant → DECLINED
        DB->>DB: UPDATE other active applications for this applicant → CLOSED_OTHER_OFFER_ACCEPTED
        DB->>DB: UPDATE vacancy reserved_positions for each released offer (SELECT FOR UPDATE each)
        DB->>DB: INSERT audit_event (actor, timestamp, offer_id, placement_id)
        DB->>DB: INSERT notification_outbox records (candidate + affected employers)
        DB->>DB: COMMIT
        Q->>Q: Process notification_outbox (email + in-app) — async, retried
        API-->>A: 200 OK {placement_id}
    else Any validation fails
        DB->>DB: ROLLBACK
        API-->>A: 409 / 422 {error: reason}
    end
```

**Critical rules:**
- The transaction is all-or-nothing. No partial state changes.
- Notification failures do NOT roll back the transaction. The outbox pattern ensures delivery is retried independently.
- A duplicate request (idempotency key check) returns the existing placement without re-running the transaction.

---

## 7. Offer Expiry Flow

```mermaid
sequenceDiagram
    participant W as Worker (background job)
    participant DB as Database (transaction)
    participant Q as Job Queue (outbox)

    W->>DB: SELECT offers WHERE status=ISSUED AND deadline < now() FOR UPDATE SKIP LOCKED
    loop For each expired offer
        DB->>DB: BEGIN TRANSACTION
        DB->>DB: UPDATE offer SET status = EXPIRED
        DB->>DB: UPDATE vacancy SET reserved_positions = reserved_positions - 1
        DB->>DB: INSERT audit_event
        DB->>DB: INSERT notification_outbox (candidate, employer)
        DB->>DB: COMMIT
        Q->>Q: Send notifications async
    end
```

**Rules:**
- `SKIP LOCKED` prevents duplicate processing by concurrent workers.
- Offer acceptance endpoint also validates expiry synchronously to prevent races.
- Reservation is released exactly once (worker sets status to EXPIRED only if current status = ISSUED).

---

## 8. Placement State Machine

```mermaid
stateDiagram-v2
    [*] --> OFFER_ACCEPTED : Offer acceptance transaction creates placement
    OFFER_ACCEPTED --> AWAITING_RESUMPTION : Reporting date in the future
    AWAITING_RESUMPTION --> ACTIVE : Intern reports to duty (employer records)
    OFFER_ACCEPTED --> ACTIVE : Reporting date is immediate
    ACTIVE --> INTERRUPTED : Placement paused (illness, etc.)
    INTERRUPTED --> ACTIVE : Placement resumes
    ACTIVE --> WITHDRAWAL_REQUESTED : Candidate or employer requests exit
    WITHDRAWAL_REQUESTED --> TERMINATED : Authorised decision
    WITHDRAWAL_REQUESTED --> ACTIVE : Request rescinded
    ACTIVE --> TERMINATED : Employer terminates placement
    ACTIVE --> COMPLETED : Employer explicitly marks completion
    TERMINATED --> [*]
    COMPLETED --> [*]

    note right of COMPLETED : Only authorised employer staff can set this
    note right of ACTIVE : Passing expected end date does NOT auto-complete
```

**Rules:**
- Only authorised employer staff (Internship Coordinator or above) can transition ACTIVE → COMPLETED.
- A passing expected end date produces a notification/reminder but does not change status.
- Ending a placement does NOT automatically restore previously declined offers or closed applications.

---

## 9. Full Applicant Journey (happy path)

```mermaid
flowchart TD
    A[Applicant registers & verifies email] --> B[Creates / updates profile]
    B --> C[Searches and saves vacancies]
    C --> D[Applies to one or more vacancies]
    D --> E[Employer reviews application]
    E --> F[Invited to interview stages]
    F --> G[Employer issues offer letter]
    G --> H{Applicant decides}
    H -- Accepts --> I[Atomic acceptance transaction]
    I --> J[Placement created]
    I --> K[Other offers declined automatically]
    I --> L[Other active applications closed automatically]
    J --> M[Phase 2: Onboarding, rotations, assessments]
    M --> N[Completion confirmed by employer]
    H -- Declines --> O[Application → DECLINED; reservation released]
    H -- No response --> P[Offer expires; reservation released]
```
