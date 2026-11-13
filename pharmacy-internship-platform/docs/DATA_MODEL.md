# Relational Data Model
**Platform:** Pharmacy Internship Marketplace & Management Platform  
**Last updated:** 2026-10-17  
**Format:** Annotated entity definitions. Final schema lives in `prisma/schema.prisma`.

---

## Design principles

- UUIDs for all primary keys (prevents enumeration attacks).
- `created_at` / `updated_at` on every mutable table.
- Explicit foreign keys with appropriate ON DELETE behaviour.
- Soft-delete (`deleted_at`) only where justified; otherwise hard-delete with audit event.
- Immutable `audit_events` and `notification_outbox` records; never update or delete these.
- Controlled enums implemented as PostgreSQL ENUMs or reference tables — configurable ones (practice areas, centre types) use reference tables so admins can add values without a code deployment.
- Vacancy counters maintained by the database (check constraints + transactional updates).
- Separate `application_snapshots` to preserve what was submitted, insulated from later employer edits.

---

## Entities

### users
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| email | TEXT UNIQUE NOT NULL | Lowercase normalised |
| email_verified_at | TIMESTAMPTZ | NULL until verified |
| password_hash | TEXT | bcrypt |
| role | ENUM(APPLICANT, EMPLOYER_STAFF, PLATFORM_ADMIN) | Top-level role |
| is_active | BOOLEAN DEFAULT true | |
| mfa_enabled | BOOLEAN DEFAULT false | |
| mfa_secret | TEXT | Encrypted at rest |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |
| deleted_at | TIMESTAMPTZ | Soft-delete (account deactivation) |

**Indexes:** `email`, `role`, `deleted_at`

---

### applicant_profiles
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| user_id | UUID FK → users.id UNIQUE | 1:1 |
| full_name | TEXT NOT NULL | |
| phone | TEXT | |
| university | TEXT | |
| graduation_year | SMALLINT | |
| short_bio | TEXT | |
| preferred_practice_area_ids | UUID[] | FK → practice_areas |
| preferred_state_ids | UUID[] | FK → states |
| accommodation_preference | TEXT | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

---

### organisations
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| name | TEXT NOT NULL | |
| type_id | UUID FK → organisation_types.id | Community pharmacy, hospital, etc. |
| website | TEXT | |
| contact_name | TEXT | |
| contact_email | TEXT | |
| contact_phone | TEXT | |
| verification_status | ENUM(DRAFT,SUBMITTED,UNDER_REVIEW,MEETING_REQUIRED,MEETING_SCHEDULED,ADDITIONAL_INFORMATION_REQUIRED,APPROVED,REJECTED,SUSPENDED,REVERIFICATION_REQUIRED,EXPIRED) | |
| approved_at | TIMESTAMPTZ | |
| suspended_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |
| created_by_user_id | UUID FK → users.id | |

**Note:** `EXPIRED` status is reserved for future use once OD-004 is confirmed.

---

### organisation_locations
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| organisation_id | UUID FK → organisations.id | |
| name | TEXT NOT NULL | e.g. "Abuja Branch" |
| address_line1 | TEXT | |
| address_line2 | TEXT | |
| city | TEXT | |
| state_id | UUID FK → states.id | |
| coordinates | POINT | Optional; for map display |
| is_primary | BOOLEAN DEFAULT false | |
| verification_status | ENUM(same as organisations) | Separate per-location verification |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

---

### organisation_memberships
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| organisation_id | UUID FK → organisations.id | |
| user_id | UUID FK → users.id | |
| location_id | UUID FK → organisation_locations.id NULL | NULL = org-wide access |
| is_owner | BOOLEAN DEFAULT false | |
| invited_by_user_id | UUID FK → users.id | |
| accepted_at | TIMESTAMPTZ | NULL = pending invite |
| revoked_at | TIMESTAMPTZ | NULL = active |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

**Unique constraint:** `(organisation_id, user_id)` — one membership record per user per org.

---

### membership_roles
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| membership_id | UUID FK → organisation_memberships.id | |
| role | ENUM(ORGANISATION_OWNER,RECRUITER_HR,INTERNSHIP_COORDINATOR,PRECEPTOR_SUPERVISOR,FINANCE_ADMIN,READ_ONLY) | |
| created_at | TIMESTAMPTZ | |

**Note:** A member may have multiple roles. Permissions are the union of their role grants.

---

### verification_cases
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| organisation_id | UUID FK → organisations.id | |
| location_id | UUID FK → organisation_locations.id NULL | NULL = organisation-level |
| status | ENUM (see verification workflow) | |
| checklist_type_id | UUID FK → verification_checklist_types.id | Per centre type |
| opened_by_user_id | UUID FK → users.id | Admin who opened review |
| current_reviewer_user_id | UUID FK → users.id NULL | |
| decision | ENUM(APPROVED,REJECTED,SUSPENDED,NULL) | |
| decision_reason | TEXT | |
| decided_at | TIMESTAMPTZ | |
| decided_by_user_id | UUID FK → users.id NULL | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

---

### verification_documents
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| verification_case_id | UUID FK → verification_cases.id | |
| document_type | TEXT | e.g. "PCN_LICENCE", "PREMISES_CERTIFICATE" |
| storage_key | TEXT NOT NULL | Private S3 key; never a public URL |
| original_filename | TEXT | |
| file_size_bytes | BIGINT | |
| mime_type | TEXT | |
| uploaded_by_user_id | UUID FK → users.id | |
| uploaded_at | TIMESTAMPTZ | |
| scan_status | ENUM(PENDING,CLEAN,FLAGGED) | Malware scan result |

---

### verification_meetings
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| verification_case_id | UUID FK → verification_cases.id | |
| scheduled_at | TIMESTAMPTZ | |
| held_at | TIMESTAMPTZ NULL | |
| participants | TEXT[] | Names/roles of attendees |
| checklist_responses | JSONB | Configurable checklist items + outcomes |
| notes | TEXT | |
| outcome | ENUM(PASSED,FAILED,INCONCLUSIVE,NULL) | |
| recorded_by_user_id | UUID FK → users.id | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

---

### practice_areas (reference table — admin-configurable)
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| name | TEXT UNIQUE NOT NULL | e.g. "Community Pharmacy" |
| is_active | BOOLEAN DEFAULT true | |
| display_order | SMALLINT | |
| created_at | TIMESTAMPTZ | |

---

### vacancies
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| organisation_id | UUID FK → organisations.id | |
| location_id | UUID FK → organisation_locations.id NULL | NULL = no specific location |
| title | TEXT NOT NULL | |
| description | TEXT | |
| status | ENUM(DRAFT,PUBLISHED,PAUSED,CLOSED,FILLED,ARCHIVED) | |
| total_positions | SMALLINT NOT NULL CHECK (total_positions > 0) | |
| reserved_positions | SMALLINT NOT NULL DEFAULT 0 CHECK (reserved_positions >= 0) | |
| confirmed_positions | SMALLINT NOT NULL DEFAULT 0 CHECK (confirmed_positions >= 0) | |
| application_open_date | DATE | |
| application_deadline | DATE | |
| expected_start_date | DATE | |
| accommodation_status | ENUM(NOT_PROVIDED,PROVIDED,CONDITIONAL,UNKNOWN) | |
| accommodation_details | TEXT | |
| remuneration_info | TEXT | Display only; not payment management |
| application_instructions | TEXT | |
| created_by_user_id | UUID FK → users.id | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |
| published_at | TIMESTAMPTZ NULL | |
| closed_at | TIMESTAMPTZ NULL | |
| form_version | INTEGER NOT NULL DEFAULT 1 | Incremented when employer edits questions |

**Database check constraint:**
```sql
CHECK (reserved_positions + confirmed_positions <= total_positions)
```

---

### vacancy_practice_areas
| Column | Type | Notes |
|---|---|---|
| vacancy_id | UUID FK → vacancies.id | |
| practice_area_id | UUID FK → practice_areas.id | |
| PRIMARY KEY | (vacancy_id, practice_area_id) | |

---

### vacancy_questions (employer-defined application questions)
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| vacancy_id | UUID FK → vacancies.id | |
| question_text | TEXT NOT NULL | |
| question_type | ENUM(TEXT,TEXTAREA,BOOLEAN,SELECT,FILE) | |
| options | JSONB NULL | For SELECT type |
| is_required | BOOLEAN DEFAULT true | |
| display_order | SMALLINT | |
| form_version | INTEGER NOT NULL | Which version of the form this question belongs to |
| created_at | TIMESTAMPTZ | |

---

### vacancy_required_documents
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| vacancy_id | UUID FK → vacancies.id | |
| document_label | TEXT NOT NULL | e.g. "University Certificate" |
| is_required | BOOLEAN DEFAULT true | |
| form_version | INTEGER NOT NULL | |
| created_at | TIMESTAMPTZ | |

---

### applications
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| vacancy_id | UUID FK → vacancies.id | |
| applicant_user_id | UUID FK → users.id | |
| status | ENUM(DRAFT,SUBMITTED,UNDER_REVIEW,SHORTLISTED,INTERVIEWING,WAITLISTED,REJECTED,WITHDRAWN,OFFERED,ACCEPTED,CLOSED_OTHER_OFFER_ACCEPTED,CLOSED_VACANCY,EXPIRED) | |
| submitted_at | TIMESTAMPTZ NULL | |
| form_version_snapshot | INTEGER NOT NULL | Captured at submission |
| idempotency_key | TEXT UNIQUE | Client-supplied for duplicate protection |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

**Unique constraint:** Consider `(vacancy_id, applicant_user_id)` with partial index WHERE `status != 'WITHDRAWN'` — one active application per applicant per vacancy.

---

### application_snapshots
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| application_id | UUID FK → applications.id UNIQUE | 1:1 snapshot at submission |
| answers_json | JSONB | All answers at time of submission |
| documents_json | JSONB | Document references at time of submission |
| questions_snapshot | JSONB | Full question set at form_version |
| captured_at | TIMESTAMPTZ NOT NULL | |

---

### application_answers
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| application_id | UUID FK → applications.id | |
| question_id | UUID FK → vacancy_questions.id | |
| answer_text | TEXT NULL | |
| answer_boolean | BOOLEAN NULL | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

---

### application_documents
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| application_id | UUID FK → applications.id | |
| requirement_id | UUID FK → vacancy_required_documents.id NULL | NULL = additional doc |
| storage_key | TEXT NOT NULL | Private S3 key |
| original_filename | TEXT | |
| file_size_bytes | BIGINT | |
| mime_type | TEXT | |
| uploaded_at | TIMESTAMPTZ | |
| scan_status | ENUM(PENDING,CLEAN,FLAGGED) | |

---

### credential_checks (employer-side record only)
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| application_id | UUID FK → applications.id | |
| checked_by_user_id | UUID FK → users.id | |
| document_type | TEXT | |
| outcome | ENUM(SATISFACTORY,UNSATISFACTORY,PENDING,NOT_CHECKED) | |
| notes | TEXT | Internal; never exposed to applicant |
| checked_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | |

---

### interview_stages
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| vacancy_id | UUID FK → vacancies.id | |
| name | TEXT NOT NULL | |
| stage_type | ENUM(VERBAL_INTERVIEW,WRITTEN_ASSESSMENT,ADDITIONAL_STAGE,OTHER) | |
| stage_order | SMALLINT | |
| description | TEXT | |
| created_at | TIMESTAMPTZ | |

---

### interview_events (specific scheduled instances for a candidate)
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| application_id | UUID FK → applications.id | |
| stage_id | UUID FK → interview_stages.id | |
| scheduled_at | TIMESTAMPTZ | |
| timezone | TEXT NOT NULL | e.g. "Africa/Lagos" |
| format | TEXT | e.g. "In-person", "Video call" |
| location_or_link | TEXT | |
| candidate_instructions | TEXT | |
| status | ENUM(SCHEDULED,COMPLETED,CANCELLED,RESCHEDULED,NO_SHOW) | |
| outcome | ENUM(PASSED,FAILED,DEFERRED,NULL) | |
| outcome_notes | TEXT | Internal |
| scheduled_by_user_id | UUID FK → users.id | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

---

### offers
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| application_id | UUID FK → applications.id | |
| vacancy_id | UUID FK → vacancies.id | Denormalised for easier queries |
| applicant_user_id | UUID FK → users.id | Denormalised |
| organisation_id | UUID FK → organisations.id | Denormalised |
| status | ENUM(DRAFT,ISSUED,ACCEPTED,DECLINED,EXPIRED,WITHDRAWN_BY_EMPLOYER,CANCELLED) | |
| reporting_date | DATE | |
| acceptance_deadline | TIMESTAMPTZ NOT NULL | Must be provided when ISSUED |
| terms_and_conditions | TEXT | Employer-provided |
| remuneration_info | TEXT | Display only |
| accommodation_details | TEXT | |
| offer_document_storage_key | TEXT NULL | Employer-uploaded letter |
| generated_from_template | BOOLEAN DEFAULT false | |
| template_version | TEXT NULL | |
| version_number | INTEGER NOT NULL DEFAULT 1 | Incremented on re-issue |
| issued_at | TIMESTAMPTZ NULL | |
| issued_by_user_id | UUID FK → users.id NULL | |
| decided_at | TIMESTAMPTZ NULL | Acceptance, decline, or withdrawal timestamp |
| decided_by_user_id | UUID FK → users.id NULL | |
| idempotency_key | TEXT UNIQUE | Prevents duplicate issuance |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

---

### placements
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| offer_id | UUID FK → offers.id UNIQUE | 1:1 |
| application_id | UUID FK → applications.id UNIQUE | 1:1 |
| applicant_user_id | UUID FK → users.id | |
| organisation_id | UUID FK → organisations.id | |
| location_id | UUID FK → organisation_locations.id NULL | |
| vacancy_id | UUID FK → vacancies.id | |
| status | ENUM(OFFER_ACCEPTED,AWAITING_RESUMPTION,ACTIVE,INTERRUPTED,WITHDRAWAL_REQUESTED,TERMINATED,COMPLETED) | |
| reporting_date | DATE | |
| expected_end_date | DATE NULL | |
| actual_end_date | DATE NULL | |
| coordinator_user_id | UUID FK → users.id NULL | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

---

### supervisor_assignments
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| placement_id | UUID FK → placements.id | |
| supervisor_user_id | UUID FK → users.id | |
| assigned_at | TIMESTAMPTZ | |
| unassigned_at | TIMESTAMPTZ NULL | |
| assigned_by_user_id | UUID FK → users.id | |

---

### audit_events (immutable log)
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| event_type | TEXT NOT NULL | e.g. "OFFER_ACCEPTED", "CENTRE_APPROVED" |
| actor_user_id | UUID FK → users.id NULL | NULL for system-generated events |
| entity_type | TEXT NOT NULL | e.g. "offers", "organisations" |
| entity_id | UUID NOT NULL | |
| payload | JSONB | Relevant before/after or contextual data |
| ip_address | INET NULL | |
| created_at | TIMESTAMPTZ NOT NULL | |

**Never update or delete audit_events.**

---

### notification_outbox (transactional outbox pattern)
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| recipient_user_id | UUID FK → users.id | |
| channel | ENUM(EMAIL,IN_APP,PUSH) | |
| event_type | TEXT NOT NULL | |
| payload | JSONB | Template variables; no sensitive content in logs |
| status | ENUM(PENDING,SENT,FAILED,SKIPPED) | |
| attempts | SMALLINT DEFAULT 0 | |
| last_attempted_at | TIMESTAMPTZ NULL | |
| sent_at | TIMESTAMPTZ NULL | |
| idempotency_key | TEXT UNIQUE | Prevents duplicate sends |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

---

### in_app_notifications
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| user_id | UUID FK → users.id | |
| outbox_id | UUID FK → notification_outbox.id NULL | |
| event_type | TEXT NOT NULL | |
| title | TEXT | |
| body | TEXT | |
| link_url | TEXT | Route to relevant record |
| is_read | BOOLEAN DEFAULT false | |
| read_at | TIMESTAMPTZ NULL | |
| created_at | TIMESTAMPTZ | |

---

### states / lgas (reference tables)
Nigerian states and local government areas. Admin-configurable.

| Column | Type |
|---|---|
| id | UUID PK |
| name | TEXT UNIQUE NOT NULL |
| country_code | CHAR(2) DEFAULT 'NG' |
| is_active | BOOLEAN DEFAULT true |

---

## Entity Relationship Summary (abbreviated)

```
users ──< applicant_profiles (1:1)
users ──< organisation_memberships >── organisations
organisations ──< organisation_locations
organisations ──< verification_cases ──< verification_documents
organisations ──< vacancies ──< vacancy_questions
                              ──< vacancy_required_documents
                              ──< applications ──< application_snapshots (1:1)
                                               ──< application_answers
                                               ──< application_documents
                                               ──< credential_checks
                                               ──< interview_events >── interview_stages
                                               ──< offers (1:1) ──< placements (1:1)
audit_events (polymorphic references to any entity)
notification_outbox ──< in_app_notifications
```

---

## Critical database constraints

1. `CHECK (reserved_positions + confirmed_positions <= total_positions)` on `vacancies`
2. `UNIQUE (vacancy_id, applicant_user_id)` partial index (WHERE status != 'WITHDRAWN') on `applications`
3. `UNIQUE` on `offers.idempotency_key`
4. `UNIQUE` on `notification_outbox.idempotency_key`
5. Foreign key ON DELETE RESTRICT on `offers → vacancies` (cannot delete a vacancy with active offers)
6. Foreign key ON DELETE RESTRICT on `placements → offers` (cannot delete an accepted offer)
