# Pharmacy Patient Management System (PMS)
## Product Requirements and Implementation Specification for Amazon Q

**Document type:** Product requirements, technical design, data model and implementation instructions  
**Version:** 1.0  
**Status:** Initial build specification  
**Audience:** Amazon Q, developers, pharmacy owner and clinical lead

---

## 1. Purpose

Build a secure Pharmacy Patient Management System (PMS) that enables authorised pharmacy staff to maintain longitudinal patient records, document consultations and check-ups, manage medication history, record relevant observations, plan follow-ups, and understand how a patient's health and care change over time.

The system is a **patient record and pharmacy care-support application**. It must not independently diagnose patients, replace a prescriber, automatically prescribe or change medicines, or imply that a clinical decision is safe solely because software has not raised a warning.

The central product model is:

> **Patient → Encounter → Longitudinal clinical history**

A patient's identity stays stable. Every consultation, check-up or pharmacy service is a separate encounter. Medical history, medication changes, observations, care plans, tests and follow-up outcomes are linked to the patient and, where applicable, to the encounter that created them.

## 2. Instructions to Amazon Q

1. Inspect the existing repository, framework, file structure, current features, environment configuration and tests before changing code.
2. If the repository is empty, initialise it using the proposed stack in Section 5. If there is already a sound stack, preserve it unless there is a compelling technical reason to change it; explain any proposed replacement before doing so.
3. Implement the project in the phases in Section 15. Do not build every module in one enormous change.
4. Before each phase, briefly state the modules/files to be created or modified, implement that phase, then run its tests and report results.
5. Do not create fake pharmacy details, fake clinical reference ranges, fake drug-interaction rules, fake production credentials or real patient data. Development/demo fixtures must be clearly fictional.
6. For unknown clinical or operational decisions, use a safe neutral default or a clearly documented TODO requiring owner approval. Do not silently invent requirements.
7. Keep secrets in environment variables. Include `.env.example` with placeholder values only.
8. Include database migrations, automated tests, setup instructions and a useful README.
9. A UI screen alone does not make a feature complete. Its API, persistence, permissions, validation, errors and tests must also work.
10. Do not describe the system as production-ready until the checklist in Section 18 has been reviewed.
11. Document significant deviations in `docs/decisions/` and update this specification if the approved scope changes.

## 3. Product goals

The application should allow authorised staff to:

- Register patients and retrieve the correct record.
- Review current and past conditions.
- Record allergies, adverse drug reactions and unknown allergy status.
- Record current and historical medicines without losing previous regimens.
- Create a new record for each consultation, check-up, screening or follow-up.
- Capture relevant vital signs and other observations with units and timestamps.
- Record clinical assessments, counselling, interventions, referrals and plans.
- Schedule and track follow-ups, including missed and rescheduled visits.
- Link relevant test results and documents to a patient and an encounter.
- See a chronological timeline of the patient's care.
- Restrict access to confidential information by role.
- Preserve an audit trail for important record creation, changes, access and status transitions.
- Generate a patient summary only for authorised users.

## 4. Non-goals for the initial release

Do not treat the following as approved MVP requirements:

- Autonomous diagnosis or treatment recommendations.
- Automatic prescribing or authorisation of prescription changes.
- A drug-interaction engine using invented rules.
- A patient portal or mobile app.
- Telemedicine.
- Insurance claims, billing, point-of-sale or stock management.
- Full electronic prescribing.
- External hospital, laboratory, national health-system or third-party integrations.
- Automated SMS/WhatsApp messaging before channel, consent, provider and cost are approved.
- Multi-tenant SaaS functionality unless explicitly required.
- Importing legacy patient data before a migration plan and data mapping are approved.

Keep the architecture extensible, but do not let speculative features delay the core patient-record workflow.

## 5. Recommended technology stack

Use this stack for a new build unless the existing repository already has a suitable implementation:

### Frontend
- React with TypeScript.
- Next.js for the web application and routing.
- An accessible, consistent component system.
- React Hook Form and Zod, or equivalent supported tools, for form handling and validation.
- A server-state/data-fetching library where useful.
- Responsive desktop, tablet and mobile layouts.

### Backend
- Node.js and TypeScript.
- NestJS with separated modules, services and controllers.
- REST API under `/api/v1`.
- Request DTO/schema validation at the API boundary.
- OpenAPI/Swagger documentation.

### Database
- PostgreSQL.
- Drizzle ORM and version-controlled SQL migrations.
- Foreign keys, constraints, transactions and indexes.
- UUID primary identifiers unless the existing project has a justified alternative.
- Store timestamps in UTC and display in the configured pharmacy timezone.
- Never use patient name, phone number or date of birth as the primary key.

### Supporting infrastructure
- Private object storage for clinical documents in production.
- Structured application logs that do not unnecessarily include patient details or full clinical notes.
- Automated tests.
- A documented backup and restore procedure.
- Environment-based configuration.

A modular monolith is appropriate for the first release. Do not introduce microservices unless there is a clear operational reason.

Suggested structure:

```text
pharmacy-pms/
  apps/
    web/
    api/
  packages/
    shared/
  db/
    migrations/
    seeds/
  docs/
    architecture/
    decisions/
    operations/
  .env.example
  README.md
```

Adapt this structure to an existing repository rather than forcing an unnecessary migration.

## 6. User roles and permissions

Implement server-side role-based access control (RBAC). Hiding a button in the frontend is not security; every protected API action must enforce permissions.

### Initial roles

**Administrator**
- Manage staff accounts, role assignments and approved application settings.
- View audit and operational information.
- Cannot silently rewrite or erase clinical history.
- Clinical-record access must follow least privilege and be explicitly configured.

**Pharmacist**
- Register/update patient details as authorised.
- View relevant patient history.
- Create encounters, medication reviews, observations, plans and follow-ups.
- Record assessments, medication-related concerns, interventions and referrals within their authorised scope.
- Correct clinical records through an auditable amendment workflow.

**Pharmacy assistant / receptionist**
- Register patients and update approved demographic/contact fields.
- Manage appointment and follow-up scheduling.
- Access only the clinical information necessary for assigned duties.
- Cannot independently amend pharmacist assessments, medication decisions or restricted clinical notes.

**Read-only reviewer (optional)**
- View specifically authorised records.
- Cannot change clinical records or configuration.
- Sensitive access and exports remain auditable.

Do not create patient login accounts in the MVP.

### Permission rules
- Default deny: new roles have no permissions until explicitly granted.
- Enforce least privilege in the API/service layer.
- Users cannot raise their own privileges.
- Only authorised administrators can manage roles.
- Record the acting user for every clinical action.
- Error messages must not leak clinical data.
- Add emergency/break-glass access only if approved; if implemented, require a reason and audit the access.

Assume one pharmacy for the MVP. Keep optional branch support in mind if the owner confirms multiple branches are needed. Do not allow cross-organisation access without an explicit requirement.

## 7. Functional modules and requirements

### 7.1 Authentication and staff management

- Staff sign-in/sign-out.
- Secure password hashing using a recognised modern algorithm/library.
- Session or token strategy with expiration and revocation.
- Password reset through a verified channel and single-use, expiring token.
- Account activation/deactivation.
- Role assignment and permission enforcement.
- Audit account creation, role changes and deactivation.
- Inactive users cannot authenticate.
- Rate-limit login and password-reset attempts.
- Avoid revealing whether a particular username/email exists in public auth errors.
- Recommend MFA for privileged accounts.

### 7.2 Patient registration and demographics

Capture:
- System-generated patient ID/number.
- First name, last name, optional middle name.
- Date of birth, if known.
- Sex, where clinically relevant and according to the pharmacy's approved workflow.
- Phone number and optional email.
- Address where needed.
- Emergency contact name, relationship and phone, where needed.
- Preferred contact channel.
- Registration date/time (system-generated).
- Registration source, if useful: walk-in, referral, outreach or other.
- Patient status: active, inactive or archived.
- Optional notes restricted to appropriate staff.

Validation and behaviour:
- Do not make every field mandatory by default. Require core identity information and collect optional details only where justified.
- Support unknown/not-provided values rather than assuming.
- Calculate displayed age from date of birth; do not store static age as a substitute for DOB.
- Detect likely duplicate records using configurable matches such as name, DOB and phone.
- Warn about possible duplicates; do not automatically merge records.
- Never use name or phone number as the patient ID.
- Use an auditable merge process if record merging is added later.

### 7.3 Medical history

Support multiple condition records per patient. Each condition should capture:
- Condition/diagnosis name.
- Clinical code system/code if configured; clearly identify free-text entries.
- Status: current, resolved, in remission, historical or uncertain.
- Onset/diagnosis date, if known.
- Resolution date, when applicable.
- Severity/stage, where applicable.
- Source: patient-reported, clinician document, imported record or other.
- Verification status: unverified, reviewed or confirmed according to the approved workflow.
- Relevant notes.
- Author and timestamps.

Do not present a patient-reported condition as an independently confirmed diagnosis. Preserve the source and verification status.

### 7.4 Allergies and adverse drug reactions

Each allergy/reaction record should capture:
- Substance or medicine.
- Reaction description.
- Classification: suspected allergy, confirmed allergy, intolerance, adverse reaction or unknown classification.
- Severity, if assessed.
- First-reaction date, if known.
- Source and verification status.
- Status: active, resolved, ruled out or unresolved.
- Clinical notes and actions taken.
- Author and timestamps.

Support distinct patient-level states:
- Known allergy/reaction recorded.
- No known allergies explicitly recorded after an authorised assessment.
- Allergy status unknown/not assessed.

A blank allergy list must never automatically mean “no known allergies.” Show active allergy and reaction information prominently during medication reviews and encounters. Do not rely on colour alone for warnings.

### 7.5 Family, social, surgical and hospitalisation history

**Family history**
- Relationship to patient.
- Condition.
- Approximate diagnosis age/date, if known.
- Relevant notes.
- Source and author.

**Social history**
- Tobacco use.
- Alcohol use.
- Other substance use where relevant.
- Diet, physical activity and other lifestyle factors where relevant.
- Occupational health exposure, where relevant.
- Source, date and notes.

**Surgery/procedure history**
- Procedure.
- Date or approximate year.
- Reason and facility, if known.
- Relevant complications and notes.

**Hospitalisation history**
- Admission/discharge dates, if known.
- Facility.
- Reason.
- Relevant discharge information and linked document.

These are optional and should be collected according to the pharmacy's clinical workflow. Do not require sensitive details without a documented purpose.

### 7.6 Medication history

Keep these concepts separate:
1. Medicine reference/master data, if maintained.
2. Patient-specific medication regimen.
3. Auditable regimen-change history.
4. Prescriptions, if later integrated.
5. Dispensing records, if later integrated.

For a patient's regimen, capture:
- Medicine name; generic and brand where known.
- Strength and dosage form.
- Dose amount and unit.
- Route.
- Frequency/schedule.
- Indication.
- Start date and end date, if known.
- Status: active, discontinued, completed, held or uncertain.
- Prescriber, where applicable.
- Source: prescription, patient report, discharge summary or other.
- Patient-reported adherence and notes.
- Reported side effects/adverse reactions.
- Last-reviewed date and reviewing user.
- Relevant instructions.

History rules:
- Never erase the previous dose, frequency or status when a regimen changes.
- A change creates a history/event record with prior and new values, timestamp, author, reason and source.
- Distinguish patient-reported use from a prescription or verified medication list.
- Allow multiple concurrent medicines.
- Show historical medicines as historical/inactive; do not make them appear current.
- A medication-history entry is not a dispensing transaction.
- Do not infer adherence from an active medication record.
- Allow unresolved medicine details where strength or regimen is unknown.

**Medication review fields**
- Review date and pharmacist.
- Reconciliation status: complete, partial or not completed.
- Medication-related problem type and description.
- Suspected interaction/duplication/contraindication, where identified by an authorised user or verified resource.
- Adherence barrier.
- Action taken.
- Prescriber contact/referral, if applicable.
- Outcome and follow-up plan.

Do not implement a home-grown interaction checker with guessed rules. Any future clinical decision-support feature must use an approved maintained source, disclose scope/limitations and be clinically reviewed and tested.

### 7.7 Encounters, consultations and check-ups

Each patient visit/service creates a separate encounter. Never overwrite a previous encounter to represent a new visit.

Capture:
- Encounter ID.
- Patient ID.
- Date/time.
- Type: initial consultation, routine check-up, medication review, screening, follow-up, counselling or configurable alternative.
- Status: scheduled, in progress, completed, cancelled, missed or rescheduled as applicable.
- Reason for visit.
- Assigned pharmacist/staff member.
- Referral source, if relevant.
- Presenting complaint in the patient's own words.
- Symptoms and relevant history.
- Clinical notes.
- Assessment.
- Care plan.
- Counselling/interventions.
- Referral/escalation.
- Follow-up plan.
- Author and timestamps.

Workflow:
1. Select an existing patient or register a new one.
2. Display relevant safety-critical information, especially allergy status and active medicines.
3. Choose the encounter type and reason.
4. Capture relevant symptoms, history and observations.
5. Record assessment and plan according to user permissions.
6. Record interventions/referrals and a follow-up when needed.
7. Save as draft or complete.
8. Display the encounter on the patient timeline.
9. Preserve the original record; corrections must be auditable.

Draft encounters must be clearly marked and must not appear as completed/verified encounters.

### 7.8 Observations and vital signs

Use a flexible observation model rather than a fixed column for every measurement.

Examples:
- Blood pressure: systolic/diastolic values, unit, position and time.
- Pulse/heart rate: value, unit and time.
- Respiratory rate: value, unit and time.
- Temperature: value, unit and time.
- Oxygen saturation: percentage and time, where relevant.
- Weight and height with units.
- BMI calculated from valid height/weight measurements, showing calculation context.
- Blood glucose: result, unit, fasting/random/other context and time.
- Pain score: value, scale and time, where relevant.
- Other types only when approved/configured.

Each observation stores:
- Patient ID.
- Encounter ID, when applicable.
- Observation type.
- Numeric or structured value.
- Unit.
- Measurement date/time.
- Method/context where relevant.
- Recorded by.
- Source/verification status where relevant.
- Notes.

Validation rules:
- Store units explicitly.
- Validate value and unit against the observation type.
- Do not apply one generic range to all measurement types.
- Clinical thresholds/warnings must come from an approved clinical configuration/reference.
- Do not diagnose from one reading.
- Trends must display timestamps and units.
- Never silently compare incompatible units or contexts.

### 7.9 Assessment, care plan and interventions

Capture:
- Assessment summary.
- Concern/condition addressed.
- Medication-related problem, where relevant.
- Findings supporting the assessment.
- Counselling/advice.
- Intervention and rationale.
- Referral/escalation advice and destination.
- Patient response/agreement, where relevant.
- Responsible user and time.
- Follow-up instructions and planned date.

Keep a suspicion distinct from a confirmed diagnosis. Store assessment, intervention, referral and outcome as distinct records/concepts.

### 7.10 Follow-ups and appointments

Capture:
- Follow-up ID.
- Patient ID.
- Related encounter.
- Reason/objective.
- Due date/time.
- Status: scheduled, due, completed, missed, rescheduled, cancelled or unable to contact.
- Assigned staff member.
- Contact attempts/outcomes, if used.
- Patient response.
- Relevant follow-up measurements.
- Outcome notes.
- Next action/date.

Required behaviour:
- Show upcoming, due and overdue follow-ups.
- Allow rescheduling with a reason.
- Do not mark a follow-up complete merely because a reminder was sent.
- Distinguish the appointment from the encounter that occurs when a patient is assessed.
- External reminders require approved providers and consent rules.
- Avoid exposing diagnoses or medicine details in message previews.

### 7.11 Test orders and results

For tests conducted by the pharmacy or results received from an external source, capture:

**Test order**
- Patient and encounter.
- Test name.
- Requesting user, where applicable.
- Date requested.
- Intended facility/source.
- Status: requested, collected, in progress, result available, cancelled or another defined state.
- Notes.

**Test result**
- Linked test order, patient and encounter.
- Test name.
- Result value/text.
- Unit/reference range, if supplied.
- Specimen type, where relevant.
- Collection date/time, where relevant.
- Result date/time.
- Laboratory/facility and source.
- Status: preliminary, final, amended, reviewed or other defined state.
- Reviewer and review time.
- Follow-up action.

Do not invent reference ranges. If the source did not provide one, leave it blank. Amended results must be traceable rather than silently overwriting previous results. External integration is out of scope for MVP.

### 7.12 Clinical document storage

Allow authorised users to attach laboratory reports, prescriptions/medicine lists, discharge summaries, referral letters and other relevant records.

For each document, capture:
- Document ID.
- Patient ID.
- Linked encounter/test/referral, where relevant.
- Original filename and display name.
- Document category.
- Upload date/time and user.
- Source/document date, if known.
- Private storage key/path (not a public URL).
- Content type and file size.
- Checksum/hash if supported.
- Security scan status.
- Version/amendment metadata where applicable.

Security:
- Restrict file types and size.
- Do not trust a filename or browser-supplied MIME type alone.
- Store files privately.
- Check permissions on every view/download.
- Protect against path traversal and unsafe file execution.
- Integrate malware scanning before production uploads, or clearly block production uploads until it exists.
- Do not expose permanent public links.
- Audit document access/download according to approved policy.

### 7.13 Consent and privacy preferences

Where appropriate, record:
- Consent type/purpose.
- Status: granted, denied, withdrawn, expired or not recorded.
- Timestamp and method/source.
- Person who recorded it.
- Privacy notice version shown.
- Scope and expiry/review date, if relevant.
- Withdrawal time/reason, if supplied.

Consent for one activity does not automatically authorise all uses. For example, reminders consent is not identical to consent to share records with a third party.

Confirm the privacy notice, lawful processing basis, retention periods and patient-rights process for the actual deployment and applicable jurisdiction before production.

### 7.14 Audit log

Audit logging is core functionality. Record relevant events such as:
- Sign-in outcomes, using safe logging practices.
- Patient record creation and demographic changes.
- Medical history, allergy and medication changes.
- Encounter creation/completion/amendment.
- Observation, assessment, care plan and follow-up changes.
- Document upload/view/download according to approved policy.
- Consent changes.
- User, role and permission changes.
- Patient summary export/print.
- Sensitive access denial or approved emergency access.

Audit fields:
- Event ID.
- Actor user/system.
- Action/event type.
- Entity type and entity ID.
- Timestamp.
- Outcome.
- Reason where required.
- Request/correlation ID where available.
- Minimal safe metadata.

Do not log passwords, tokens, secrets or full clinical notes unnecessarily. Normal users cannot modify/delete audit events through the usual UI. Define retention and audit access rules before deployment.

### 7.15 Patient summary, search and timeline

**Search**
- Patient number and approved demographic fields.
- Paginated results and maximum page size.
- No full clinical record returned in search results.
- Appropriate permission checks.

**Timeline**
- Encounters, medication changes, observations, results, referrals and follow-up outcomes in chronological order.
- Filter by event type/date range.
- Show source, author, timestamp and status.
- Clearly distinguish unverified, historical, draft and completed records.

**Patient summary**
- Identity and relevant demographics.
- Allergy status and active allergy/reaction alerts.
- Current conditions.
- Current medicines and last medication review/reconciliation.
- Recent observations/trends.
- Recent consultations.
- Outstanding results/follow-ups.
- Relevant documents and referrals.

Only authorised users may print/export summaries. Include generation date/time and enough metadata to distinguish the export from the live electronic record.

## 8. Suggested database model

Use a normalised relational model with foreign keys, timestamps, constraints and indexes. Names are suggestions; follow existing repository conventions where applicable.

### 8.1 Identity and history

**`users`**
- `id`, `email`/`username`, `password_hash`, `first_name`, `last_name`, `is_active`, `last_login_at`, `created_at`, `updated_at`.

**`roles`**, **`permissions`**, **`user_roles`**, **`role_permissions`**
- Explicit role/permission relationships; authorisation must not live only in frontend code.

**`pharmacies`** / optional **`branches`**
- Pharmacy identity and approved configuration. Do not seed fictional production details.

**`patients`**
- `id`, unique system-generated `patient_number`, `first_name`, nullable `middle_name`, `last_name`, nullable `date_of_birth`, nullable/configurable `sex`, `status`, nullable `registration_source`, `registered_at`, `created_by`, `created_at`, `updated_at`, nullable `archived_at`, optional `pharmacy_id`/`branch_id`.

**`patient_contacts`**
- `id`, `patient_id`, `contact_type`, `value`, `is_primary`, `is_verified`, `preferred_channel`, timestamps.

**`emergency_contacts`**
- `id`, `patient_id`, `name`, `relationship`, `phone`, nullable `notes`.

**`medical_conditions`**
- `id`, `patient_id`, `condition_name`, nullable `code_system`/`code`, `status`, nullable `onset_date`/`resolved_date`/`severity`, `source`, `verification_status`, nullable `notes`, `recorded_by`, timestamps, nullable `archived_at`.

**`patient_allergies`**
- `id`, `patient_id`, `substance`, `classification`, `reaction`, nullable `severity`/`first_reaction_date`, `status`, `source`, `verification_status`, nullable `notes`, `recorded_by`, timestamps.

Use a clear patient-level allergy-status model to distinguish `not_assessed`, `unknown`, `no_known_allergies_recorded`, and `allergy_records_present`.

**`family_history`**
- `id`, `patient_id`, `relationship`, `condition`, nullable approximate onset/date, notes, source, author and timestamps.

**`social_history`**
- `id`, `patient_id`, `category`, structured value fields as appropriate, nullable effective date, source, notes, author and timestamps.

**`procedures`** and/or **`hospitalisations`**
- Patient link, procedure/admission dates, reason, facility, outcome/complications where known, source and author.

### 8.2 Encounters and clinical records

**`encounters`**
- `id`, `patient_id`, optional human-readable `encounter_number`, `encounter_type`, `status`, `reason`, nullable `presenting_complaint`, nullable `clinical_notes`, nullable `assessment_summary`/`plan_summary`, `assigned_user_id`, `started_at`, nullable `completed_at`, `created_by`, timestamps, nullable `amended_at`/`amendment_reason`.

**`observations`**
- `id`, `patient_id`, nullable `encounter_id`, `observation_type`, nullable `value_numeric`/`value_text`/`value_json`, nullable `unit`, nullable `context`, `measured_at`, `source`, `recorded_by`, timestamps.
- Define controlled observation types with valid value/unit rules. Do not store all observations in one untyped JSON field.

**`assessments`**
- `id`, `patient_id`, `encounter_id`, `assessment_type`, `description`, `status`, evidence/source notes, `recorded_by`, timestamps.

**`care_plans`**
- `id`, `patient_id`, `encounter_id`, `goal_or_problem`, `action`, nullable `rationale`/`responsible_user_id`/`due_at`, `status`, nullable `outcome`, `created_by`, timestamps.

**`encounter_interventions`**
- `id`, `encounter_id`, `intervention_type`, `description`, nullable `rationale`/`outcome`, `recorded_by`, `created_at`.

**`follow_ups`**
- `id`, `patient_id`, nullable `related_encounter_id`, `reason`, `due_at`, `status`, nullable `assigned_user_id`/`completed_at`/`outcome_notes`/`next_follow_up_at`, `created_by`, timestamps.

### 8.3 Medication records

**Optional `medicines` catalogue**
- `id`, `generic_name`, nullable `brand_name`/`strength`/`dosage_form`/`standard_code`, `is_active`, timestamps.

**`patient_medications`**
- `id`, `patient_id`, nullable `medicine_id`, `medicine_name_snapshot`, nullable strength/form snapshots, nullable `dose_amount`/`dose_unit`/`route`/`frequency`/`instructions`/`indication`, nullable start/end dates, `status`, nullable `prescriber_name`, `source`, nullable `adherence_status`/`side_effects_notes`, `recorded_by`, timestamps.

**`medication_changes`**
- `id`, `patient_medication_id`, `patient_id`, nullable `encounter_id`, `change_type`, structured previous/new values, `reason`, `source`, `changed_by`, `changed_at`.

Use validated snapshots, not an unchecked free-form JSON history alone, for important values.

**`medication_reviews`**
- `id`, `patient_id`, `encounter_id`, `reviewed_by`, `reviewed_at`, `reconciliation_status`, `problems_identified`, `actions_taken`, nullable `referral_details`/`outcome`/`follow_up_at`.

### 8.4 Tests, referrals and documents

Create **`test_orders`**, **`test_results`**, **`referrals`** and **`clinical_documents`**. Link each to the patient and, where applicable, an encounter. Store source, status, timestamps, author/reviewer and outcomes. Clinical files live in private object storage, not a publicly accessible directory. Preserve document versions and result amendments.

### 8.5 Consent, notifications and audit

**`consents`**
- `id`, `patient_id`, `purpose`, `status`, `method`, `notice_version`, `recorded_by`, `recorded_at`, nullable `withdrawn_at`/`notes`.

**`notifications`**
- `id`, `patient_id`, nullable `follow_up_id`, `channel`, `purpose`, `status`, `scheduled_at`, nullable `sent_at`/`provider_reference`/sanitised `failure_reason`, `created_at`.
- Actual message delivery is out of scope until a provider and consent workflow are approved.

**`audit_logs`**
- `id`, nullable `actor_user_id`, `action`, `entity_type`, `entity_id`, `occurred_at`, `outcome`, nullable `reason`/`correlation_id`/`safe_metadata`.
- Append-oriented; normal application users must not update/delete logs.

### 8.6 Database-wide rules

- Use foreign keys and appropriate delete/update behaviour.
- Use transactions for multi-record clinical workflows.
- Index patient number, appropriate search fields, patient/encounter foreign keys, encounter date, active medication status, due follow-ups and result status.
- Enforce unique patient number and staff login identifiers.
- Avoid hard-deleting clinical records through ordinary UI.
- Use archival/deactivation and auditable amendment flows.
- Do not make patient name or phone globally unique; families may share contact information.
- Keep personally identifiable details out of logs/analytics by default.
- Version and test migrations.

## 9. API outline

Use versioned REST endpoints. Every endpoint must enforce authentication, authorisation, validation, pagination where appropriate and audit requirements.

```text
/api/v1/auth
/api/v1/users
/api/v1/roles
/api/v1/permissions
/api/v1/patients
/api/v1/patients/:patientId/medical-conditions
/api/v1/patients/:patientId/allergies
/api/v1/patients/:patientId/family-history
/api/v1/patients/:patientId/social-history
/api/v1/patients/:patientId/procedures
/api/v1/patients/:patientId/medications
/api/v1/patients/:patientId/medication-history
/api/v1/patients/:patientId/encounters
/api/v1/encounters/:encounterId
/api/v1/encounters/:encounterId/observations
/api/v1/encounters/:encounterId/assessments
/api/v1/encounters/:encounterId/care-plans
/api/v1/encounters/:encounterId/interventions
/api/v1/follow-ups
/api/v1/test-orders
/api/v1/test-results
/api/v1/referrals
/api/v1/clinical-documents
/api/v1/patients/:patientId/timeline
/api/v1/patients/:patientId/summary
/api/v1/consents
/api/v1/notifications
/api/v1/audit-logs
/api/v1/health
```

API conventions:
- Consistent error responses and meaningful HTTP status codes.
- Validate path parameters, query strings and request bodies.
- Paginate lists and set maximum page sizes.
- Use transactions for operations that must succeed/fail together.
- Reject unauthorised or unexpected fields; never trust client-supplied `created_by`, permissions or audit fields.
- Derive acting user from authenticated context, not request body.
- Use idempotency protection for operations where duplicate submission would cause problems, where practical.
- Use concurrency/version checks for sensitive edits where practical.
- Return only fields the caller is authorised to see.
- Maintain OpenAPI documentation.
- Never include stack traces, secrets or full health notes in client-facing errors.

Amazon Q may refine request/response schemas during implementation, but must keep the API documentation in sync.

## 10. Frontend screens and navigation

Suggested main navigation:
1. Dashboard.
2. Patients.
3. Encounters.
4. Follow-ups.
5. Test results (if enabled).
6. Documents (if enabled).
7. Staff/settings (authorised roles only).
8. Audit/activity (authorised roles only).

**Dashboard**
- Today's scheduled encounters/follow-ups.
- Upcoming and overdue follow-ups.
- Tasks awaiting review.
- Operational counts only where useful and privacy appropriate.
- No fabricated statistics in production.

**Patient list**
- Search/filter and pagination.
- New patient action.
- Duplicate warning.
- Restricted fields in table.
- Clear loading, empty and error states.

**Patient detail**
- Overview.
- Medical history.
- Allergies.
- Medicines.
- Encounters.
- Observations.
- Follow-ups.
- Tests/documents where enabled.
- Timeline.
- Audit/history view for authorised users.

**New encounter guided workflow**
1. Encounter details.
2. Complaint/symptoms.
3. Relevant history and medication review.
4. Observations.
5. Assessment.
6. Plan/interventions/referral.
7. Follow-up.
8. Review and save.

Allow drafts where permitted, identify required fields and prevent a draft being confused with a completed encounter.

**Follow-up work queue**
- Upcoming, due, overdue, missed, completed and rescheduled filters.
- Show only the patient information needed to identify the work.
- Record contact attempt/outcome if that is part of the approved workflow.
- Create an encounter when the patient is actually assessed.

UI quality:
- Responsive and keyboard accessible.
- Visible focus states and accessible labels.
- Unsaved-changes warnings.
- Confirmation for potentially destructive actions.
- No success toast until the server confirms success.
- Do not use colour alone to indicate status.
- Display local timezone consistently.
- Distinguish unknown, not assessed, unverified and no-known-allergy states.

## 11. Security, privacy and patient safety

Treat all patient data as highly sensitive.

### Security controls
- HTTPS/TLS in production.
- Strong authentication and password hashing.
- RBAC and least privilege.
- Secure HTTP-only/same-site cookies if cookie sessions are used.
- CSRF protection where relevant to the selected auth strategy.
- Rate limiting and abuse protection for authentication/sensitive endpoints.
- Input validation, output encoding and protection against SQL injection/XSS.
- Secure CORS configuration and security headers.
- Secrets in environment variables or a secrets manager.
- Encryption at rest for databases, backups and document storage where supported.
- Session expiry/revocation.
- Safe error handling.
- Dependency vulnerability checks and timely updates.
- Encrypted backups and restricted backup access.
- No real patient data in development fixtures, demos, screenshots, logs or public issue trackers.

### Privacy controls
- Collect only information needed for defined purposes.
- Restrict clinical notes, allergies, medication history, documents and exports by role.
- Confirm applicable privacy, retention, consent and patient-rights obligations for the actual deployment before production.
- Do not expose patient data to third-party analytics by default.
- Treat PDF/CSV exports as confidential.
- Establish incident response and breach-handling processes.

### Clinical safety
- Prominently show allergy and relevant medicine information during encounters and medication reviews.
- Display observations with value, unit, time and context.
- Do not compare incompatible units or contexts.
- Do not invent diagnosis, interaction or dosing rules.
- Do not auto-prescribe or silently change a medicine regimen.
- Attribute clinical records to a user and timestamp.
- Preserve original content and record reason, author and time for amendments.
- Provide a clear referral/escalation workflow.
- Use clinical alerts/thresholds only when configured from an approved source and reviewed by the responsible clinical lead.

## 12. Validation and data quality

Implement form-level, service-level and database-level validation.

Examples:
- Patient number unique.
- Date of birth is not in the future.
- Contacts validated where supplied, without requiring every patient to have both phone and email.
- End date does not precede start date unless a documented correction flow applies.
- Completed encounter includes its configured required fields.
- Completed follow-up has completion time and outcome/status.
- Numeric observations have valid values and units for their type.
- Medicine fields are required according to the record's purpose; unknown values can be explicitly recorded where acceptable.
- Upload size and file types are enforced server-side.
- Linked users/patients/encounters must exist and be accessible to the caller.
- Do not trust client-supplied actors, timestamps or role claims.
- Validate state transitions and reject invalid status changes.
- Prevent routine hard deletion where clinical/audit retention applies.

Errors should help staff correct a form without revealing sensitive information to unauthorised users.

## 13. Search, reporting and exports

MVP search:
- Patient number.
- Patient name.
- Approved demographic identifiers such as phone, with access control.
- Encounter date/status.
- Follow-up status and due date.

Possible reports:
- Upcoming/overdue follow-ups.
- Encounters by date/type/status.
- Medication review completion.
- Patients on an approved monitoring plan who are due for review.

Do not create clinical risk scores or quality claims without approved definitions and clinical governance.

For CSV/PDF exports:
- Restrict by role and stated purpose.
- Export only necessary fields.
- Protect against spreadsheet formula injection in CSV.
- Log export activity.
- Warn users that files are confidential.
- Stream/paginate large exports and avoid unbounded queries.

## 14. Testing requirements

Build tests alongside each phase.

**Unit tests**
- Validation schemas.
- Patient-number generation.
- Medication history event creation.
- Observation validation.
- Encounter/follow-up status transitions.
- Permission checks.

**Integration tests**
- Database migrations and constraints.
- Patient create/retrieve/update.
- Duplicate warnings.
- Allergy-state behaviour.
- Medication changes preserve history.
- Encounter and observation/care-plan transaction behaviour.
- Follow-up create/reschedule/complete lifecycle.
- Document permissions.
- Audit events.
- Role-based API restrictions.

**End-to-end tests**
- Staff sign in.
- Register patient.
- Add medical history and allergy.
- Add a current medicine.
- Create/complete encounter.
- Record observations.
- Create follow-up.
- Confirm patient timeline.
- Confirm receptionist cannot view/change restricted clinical notes.
- Confirm unauthenticated users cannot access patient data.
- Confirm inactive users cannot sign in.
- Confirm server failures are not presented as successful actions.

**Security/resilience tests**
- Auth rate limits.
- Invalid/unauthorised IDs.
- File upload restrictions.
- Expired/revoked sessions.
- Concurrent edits where supported.
- Backup restore in a non-production environment.

All test fixtures must be fictional.

## 15. Implementation phases

### Phase 0 — Repository inspection and decisions
- Inspect existing code, packages, routing, styling, API, database and tests.
- Identify current gaps.
- Confirm stack and deployment assumptions.
- Create/update README, `.env.example` and architecture notes.
- List unresolved pharmacy-specific decisions.

**Exit criteria:** Architecture/plan documented; no destructive replacement of working code without justification.

### Phase 1 — Foundation
- Frontend, backend and PostgreSQL setup.
- Drizzle schema, migrations and test database.
- Authentication/staff management.
- Roles and server-side permission guards.
- Health-check endpoint.
- Structured errors, request validation and baseline audit logging.

**Exit criteria:** Sign-in works, unauthorised access is denied, migrations and tests pass.

### Phase 2 — Patient registration/profile
- Patient create, search, list, update and detail screens.
- Unique patient numbers.
- Duplicate warnings.
- Contacts and emergency contacts.
- Archive instead of routine hard delete.
- Patient audit events.

**Exit criteria:** Patient registration/retrieval works and permissions/duplicate handling are tested.

### Phase 3 — Medical history/allergies
- Conditions, allergies/adverse reactions, allergy status, family/social history, procedures/hospitalisations.
- Patient history views.

**Exit criteria:** Multiple records work; provenance is shown; unknown allergy status is not treated as no allergies.

### Phase 4 — Medication history
- Current medicine list, historical medicine records, medication review and regimen-change history.

**Exit criteria:** Changing a regimen preserves previous values; tests and audit behaviour pass.

### Phase 5 — Encounters/observations
- Encounter workflow, symptoms/notes, observations, assessment, interventions, care plan, referral, draft/completed states and auditable amendments.

**Exit criteria:** Every visit is a separate encounter and linked records appear correctly in the timeline.

### Phase 6 — Follow-ups
- Schedule, reschedule, cancel, complete and mark missed.
- Due/overdue work queue and outcomes.
- Reminder-ready structure but no external messages before approval.

**Exit criteria:** Follow-up lifecycle works and is distinct from reminder delivery.

### Phase 7 — Documents and test results
- Private upload, permission-checked view/download.
- Test orders/results where in scope.
- Audited access/change.
- Malware scanning integration or documented production blocker.

**Exit criteria:** Unauthorised users cannot retrieve documents; uploads are validated and private.

### Phase 8 — Timeline, summary and reports
- Patient timeline/summary.
- Follow-up and encounter work queues.
- Approved basic reports and secure exports.

**Exit criteria:** Event order, source, author, status and timestamps are accurate; exports are audited.

### Phase 9 — Hardening and deployment
- Security and accessibility review.
- Dependency scan and performance checks.
- Database indexes and query review.
- Backup/restore verification.
- Production configuration and operations runbook.
- Staff guidance and clinical owner review.

**Exit criteria:** Readiness checklist approved with no unresolved critical security/clinical safety blockers.

## 16. Configuration and decisions to confirm

Make these configurable or document an explicit decision; do not invent them:
- Pharmacy name, address and contact information.
- Timezone/date display format.
- Branch support.
- Exact staff roles and permissions.
- Required fields by encounter type.
- Observation types and approved validation/alert rules.
- Approved clinical thresholds and sources.
- Follow-up types/default intervals.
- Document types and size limits.
- Notification channels/providers.
- Consent wording and contact preferences.
- Data-retention/archive policy.
- Backup schedule and retention.
- Clinical terminology/coding and medicine catalogue source.
- Appointment scheduling in MVP or later.
- Prescription/dispensing integration.
- Test-result entry scope.
- Offline operation.

Unless offline operation is explicitly required, build an online application. Offline clinical data introduces sync, conflict-resolution and device-security challenges that require a separate specification.

## 17. Required developer deliverables

Provide:
- Project overview and implemented-feature list.
- Architecture description/diagram.
- Prerequisites and local setup instructions.
- `.env.example` with placeholders.
- Database setup and migration commands.
- Development-only seed instructions using fictional data.
- Test/lint/type-check/build commands and outcomes.
- API documentation instructions.
- Deployment and secrets checklist.
- Backup and restore instructions.
- Known limitations/unresolved decisions.
- Security/privacy notes.
- Phase status stating what is and is not implemented.

A feature is complete only when its UI, API, persistence, permissions, errors and tests work together.

## 18. Production readiness checklist

Before real patient information is entered, verify:

- [ ] Pharmacy owner/clinical lead approved workflows and required fields.
- [ ] Applicable privacy, retention and patient-rights obligations have been reviewed.
- [ ] Roles and least-privilege permissions have been tested.
- [ ] Authentication, password reset, session expiry and deactivation work.
- [ ] Database is not publicly exposed and production secrets are secured.
- [ ] HTTPS is enforced.
- [ ] Backups work and restore has been tested.
- [ ] Patient records and documents are access-controlled.
- [ ] Audit logs are protected against normal-user modification/deletion.
- [ ] Clinical amendments preserve the original and record author, time and reason.
- [ ] Upload security/malware scanning works or production uploads remain blocked.
- [ ] No demo patients, default passwords or real patient data remain in fixtures/logs.
- [ ] Contact channels/reminders cannot leak sensitive information.
- [ ] Retention, archive and export/deletion processes are documented.
- [ ] Critical workflows and authorisation are tested.
- [ ] Clinical configurations/alerts are approved by the clinical lead.
- [ ] Users are trained and support/incident procedures exist.
- [ ] No unresolved critical/high-risk security issues remain.

## 19. Acceptance criteria for the initial usable release

1. An authorised user can sign in and server-side permissions are enforced.
2. An authorised staff member can register a patient and receive a unique patient number.
3. The system warns of likely duplicates without automatically merging records.
4. Staff can record conditions, allergies and explicit allergy status.
5. Known allergies, explicit no-known-allergy status and unknown/not-assessed status remain distinct.
6. Staff can record current medicines and preserve previous regimens when changes occur.
7. An authorised pharmacist can create a separate encounter and record relevant observations, assessment, interventions and plan.
8. Observations store value, unit, timestamp and context.
9. Staff can plan, reschedule and complete follow-ups while preserving event history.
10. Patient profile shows a correct chronological timeline.
11. Sensitive clinical actions are attributable to a user and included in the audit trail.
12. Unauthenticated users cannot retrieve patient records; unauthorised roles cannot access restricted clinical data.
13. UI success/error states reflect actual server responses.
14. Automated tests, lint and type checks pass.
15. Setup, migration, testing and deployment instructions are documented.

## 20. Final direction to Amazon Q

Build a dependable clinical record system, not merely a set of forms. Prioritise correct relationships, longitudinal history, provenance, server-side permissions, auditable changes and secure handling of confidential health data.

Core principles:
1. Patient identity is stable; encounters are separate events.
2. Clinical and medication history is never silently overwritten.
3. Unknown, unverified, historical and confirmed information remain distinguishable.
4. Sensitive operations are authorised and appropriately audited.
5. No clinical rule, threshold, interaction, service or business detail is invented.
6. A feature is not complete until the UI, API, database, validation, permission checks, errors and tests work together.

**Start with Phase 0:** inspect the repository, report its current state, list unresolved decisions, and proceed phase by phase.
