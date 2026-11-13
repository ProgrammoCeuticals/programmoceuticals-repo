# Pharmacy Internship Marketplace & Management Platform

## Product Requirements and Implementation Brief for Amazon Q

**Document status:** Draft product specification for implementation
planning\
**Product scope:** Responsive website + Android/iOS mobile app\
**Initial market:** Nigeria\
**Primary users:** Pharmacy internship applicants, internship
centres/employers, and platform administrators\
**Working product name:** To be decided\
**Core principle:** The platform connects pharmacists seeking internship
placements with internship centres and provides tools to manage
recruitment and the internship lifecycle. It is an independent platform,
not an official PCN service.

------------------------------------------------------------------------

## 1. Instructions to Amazon Q

Use this document as the initial source of truth for product and
engineering decisions.

1.  Do not start by generating the entire application in one pass. First
    inspect the repository, report its current state, and propose a
    staged implementation plan.
2.  If the repository is empty, scaffold the monorepo described below.
    If an existing codebase is present, inspect it and propose a
    migration plan before making destructive changes.
3.  Before implementation, identify contradictions, missing decisions,
    security risks, and dependencies. Use the defaults and explicit
    assumptions in this document unless they conflict with a confirmed
    requirement.
4.  Do not invent legal or regulatory requirements. Mark uncertain
    Nigerian regulatory requirements for review by the product owner and
    qualified local advisers.
5.  Do not represent the platform as affiliated with, endorsed by, or
    operated by the Pharmacy Council of Nigeria (PCN) or another
    regulator.
6.  Implement business rules on the backend. Never rely on frontend-only
    checks for offer acceptance, vacancy counts, permissions,
    verification, or status transitions.
7.  Use migrations, automated tests, seed data, API documentation, and
    clear setup instructions.
8.  Never commit secrets, real applicant documents, production
    credentials, or personal data to the repository.
9.  Use synthetic seed data only. Keep all integrations configurable
    through environment variables.
10. At each phase, deliver working code, tests, documentation, and a
    concise report of completed work, known gaps, and next steps.

------------------------------------------------------------------------

## 2. Product vision

Build a trusted, practical platform that helps pharmacy graduates
discover and secure suitable internship placements in Nigeria, while
allowing verified internship centres to recruit candidates and manage
interns.

The product consists of three connected pillars:

1.  **Internship marketplace:** Discover centres and vacancies, compare
    opportunities, apply, interview, receive offers, and accept a
    placement.
2.  **Employer operations:** Verify organisations, manage vacancies and
    recruitment, and maintain staff and intern records.
3.  **Professional community:** Share internship experiences, review
    centres, discuss pharmacy careers, and allow centres to respond.

The product should reduce the friction of finding placements, make
vacancy availability more reliable, improve employer recruitment
administration, and help applicants make informed choices.

### Product principles

-   Applicant access should be easy.
-   Centre credibility and accurate representation are essential.
-   Employers control their own recruitment criteria and process.
-   Applicants can apply to multiple centres.
-   An applicant can hold only one accepted active placement at a time.
-   Acceptance of an offer automatically closes the applicant's other
    active applications and declines other outstanding offers.
-   Vacancy counts must be authoritative and update in real time across
    web and mobile.
-   Important decisions must be traceable.
-   The platform should support different types of internship centres
    without assuming every centre has identical operations.
-   Keep the first release focused; design for expansion without
    overbuilding.
-   Do not process intern salary payments in the initial release.

------------------------------------------------------------------------

## 3. Users and roles

### 3.1 Applicant / pharmacist

Any person may create an applicant account. The platform does not
pre-verify professional credentials before allowing registration or
applications. Employers are responsible for checking applicant documents
and credentials as part of recruitment.

Applicants can: - Create and manage a profile. - Search, filter,
compare, save, and view internship opportunities. - Review centre
information, location, accommodation, remuneration details supplied by
the centre, application requirements, deadlines, and selection stages. -
Apply to multiple centres. - Upload documents and answer
employer-defined questions. - Track applications and interview
invitations. - View interview schedules and instructions. - Receive and
respond to offer letters. - Accept one offer or decline offers. - See
that other active applications/offers are closed after accepting one
offer. - Access their placement information after acceptance. - View
their internship history and completion status. - Participate in
community discussions and submit centre reviews subject to community
rules. - Manage notification preferences and account security.

### 3.2 Employer organisation

An employer organisation must register and complete the platform's
verification process before publishing vacancies.

Approved employers can: - Manage their organisation profile. - Manage
one or more locations/branches where supported. - Invite staff and
assign permissions. - Create, edit, publish, pause, close, and archive
vacancies. - Define the number of positions, requirements, deadlines,
and recruitment stages. - Review applications and submitted documents. -
Record applicant credential checks. - Shortlist, reject, waitlist, and
progress applicants. - Schedule verbal interviews, written assessments,
and multiple interview stages. - Issue and manage offer letters. -
Manage accepted placements, onboarding details, intern records,
supervisors, attendance, rotations, assessments, and completion. -
Respond to reviews and report community content. - View relevant
analytics and audit history.

### 3.3 Employer staff roles

Implement role-based access control, with permissions scoped to an
organisation and, where relevant, a location.

Initial role suggestions: - **Organisation Owner:** Manages organisation
settings and staff access. - **Recruiter / HR:** Manages vacancies,
applications, interviews, and offers. - **Internship Coordinator:**
Manages active interns, onboarding, rotations, and completion. -
**Preceptor / Supervisor:** Views assigned interns and records permitted
assessments. - **Finance / Admin:** May view or maintain
non-payment-related administrative details as permitted; salary payment
processing is out of scope. - **Read-only Staff:** Can view explicitly
authorised records.

An organisation may assign more than one role to a staff member. Avoid
granting every staff member unrestricted access by default.

### 3.4 Platform administrators

Platform administrators work for the platform operator and are distinct
from employer users.

They can: - Review centre registrations and verification submissions. -
Review licence uploads and record verification meetings. - Approve,
reject, request further information, suspend, or re-review centres. -
Manage platform users and organisations. - Review reports, complaints,
appeals, and moderation queues. - Manage community moderation and
platform policies. - View platform-wide operational metrics. - Maintain
configuration and reference data. - Access audit logs and manage support
cases.

Use least-privilege permissions. High-impact actions such as centre
approval, suspension, or access to sensitive documents should be
permission-controlled and audited.

### 3.5 Public visitors

Visitors can browse public centre profiles and published vacancies
without an account where appropriate. Applying, saving opportunities, or
using personalised features requires an applicant account.

------------------------------------------------------------------------

## 4. Supported internship settings

The marketplace should support configurable practice areas, initially
including: - Community pharmacy - Hospital pharmacy - Industrial
pharmacy - Supply chain / distribution - Regulatory affairs - Other
configurable pharmacy-related settings

Do not hardcode these categories so deeply that administrators cannot
add or update categories later.

A centre may operate in more than one practice area and may publish
multiple vacancies for different roles, locations, or cohorts.

------------------------------------------------------------------------

## 5. Platform surfaces and architecture

### 5.1 Applications

-   **Website:** Public marketplace, applicant portal, employer portal,
    and platform admin portal.
-   **Mobile app:** Applicant experience for Android and iOS, with
    shared backend and account identity. Employer mobile capabilities
    may initially focus on notifications and essential actions; employer
    web dashboard remains the full-featured administrative interface.
-   **Backend API:** Single authoritative backend for web and mobile.
-   **Worker service:** Reliable scheduled jobs and asynchronous tasks.
-   **Database:** Central relational source of truth.
-   **Private document storage:** Store applicant and employer documents
    outside public web directories.

### 5.2 Proposed stack

Use the following as the proposed default unless repository constraints
require a documented alternative:

-   TypeScript throughout.
-   Website: Next.js.
-   Mobile: React Native with Expo.
-   Backend: NestJS.
-   Database: PostgreSQL.
-   ORM and migrations: Prisma.
-   Monorepo: pnpm workspaces and Turborepo.
-   UI: Tailwind CSS and a consistent accessible component system for
    the website.
-   API: REST with versioned routes, initially `/api/v1`.
-   Real-time updates: WebSockets/Socket.IO where useful, with
    API/database state remaining authoritative.
-   Background jobs: Redis + BullMQ or an equivalent reliable queue.
-   Email: Provider abstraction for transactional email.
-   Push notifications: Expo Notifications or an equivalent abstraction.
-   File storage: Private S3-compatible object storage.
-   Testing: Unit/integration tests and browser end-to-end tests
    (e.g. Jest and Playwright; use suitable React Native tests).
-   Deployment: Select vendors after considering cost, region,
    reliability, data protection, operational simplicity, and backups.

Do not assume that WebSockets alone make vacancy updates reliable. Every
critical change must be validated and committed by the backend and
database.

### 5.3 Suggested monorepo layout

``` text
pharmacy-internship-platform/
├── apps/
│   ├── web/                 # Next.js website and dashboards
│   ├── mobile/              # React Native + Expo
│   ├── api/                 # NestJS REST API
│   └── worker/              # Background jobs
├── packages/
│   ├── shared-types/
│   ├── validation/
│   ├── api-client/
│   ├── ui/                  # Only genuinely shareable UI
│   └── config/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── docs/
│   ├── product-requirements.md
│   ├── workflows.md
│   ├── data-model.md
│   ├── api-contracts.md
│   ├── security-and-privacy.md
│   └── deployment-runbook.md
├── .env.example
├── README.md
└── package.json
```

Adapt the layout if the repository already has a well-structured
alternative.

------------------------------------------------------------------------

## 6. Centre registration and verification

### 6.1 Registration

A centre can create an organisation account and submit: - Organisation
name and type. - Contact person and business contact information. -
Locations and addresses. - Practice areas offered. - PCN licence or
other applicable supporting licence/document as required for that centre
type. - Additional information requested during the verification
process.

Avoid assuming a single licence document proves all regulatory or
internship-training permissions.

### 6.2 Verification workflow

Suggested states: - `DRAFT` - `SUBMITTED` - `UNDER_REVIEW` -
`MEETING_REQUIRED` - `MEETING_SCHEDULED` -
`ADDITIONAL_INFORMATION_REQUIRED` - `APPROVED` - `REJECTED` -
`SUSPENDED` - `REVERIFICATION_REQUIRED` - `EXPIRED` (only where the
relevant verification has a defined expiry)

Workflow: 1. Centre registers. 2. Centre submits the required
information and licence documents. 3. Platform administrators review the
submission. 4. A verification meeting is arranged. 5. Administrator
records the meeting date, participants, assessment checklist, notes, and
outcome. 6. Administrator approves, rejects, or requests further
information. 7. Only an approved centre can publish vacancies. 8.
Verification status changes are audited and communicated to the centre.

### 6.3 Verification rules

-   Centre registration does not permit vacancy publishing.
-   Uploading a licence does not automatically approve a centre.
-   The verification meeting and recorded administrative decision are
    required.
-   The platform's own approval must be distinguished from official
    regulatory accreditation or authorisation.
-   Where applicable, verify official internship-training accreditation
    and the relevant physical location using authoritative sources and a
    process reviewed by the product owner.
-   Do not claim that the platform is a PCN service or that platform
    approval guarantees regulatory recognition.
-   Support requests for more information, re-review, suspension, and
    reinstatement.
-   Do not assume all centre types have identical regulatory
    requirements. Make verification checklists configurable by centre
    type.
-   Record the reviewer, decision, timestamp, and reason.
-   Restrict access to uploaded licences and sensitive verification
    records.

### 6.4 Branches and locations

Model the organisation separately from each physical location. Where
applicable, each location may require separate evidence or verification.
Do not automatically assume that approval of one branch applies to every
branch.

------------------------------------------------------------------------

## 7. Vacancy and marketplace requirements

### 7.1 Vacancy fields

A vacancy should support: - Title and description. - Organisation and
specific location. - Practice area(s). - Number of positions. -
Published / unpublished status. - Application opening date and
deadline. - Expected start/reporting date. - Application instructions. -
Employer-defined application questions. - Required and optional
documents. - Interview and selection stages. - Accommodation status and
conditions. - Remuneration or stipend information as supplied by the
employer (display information only; no salary payment management). -
Work/training environment and other relevant details. - Contact or query
channel within the platform. - Creation/update timestamps and
responsible employer user.

Allow employer-configurable fields where practical, but keep core
structured fields consistent enough for filtering and comparison.

### 7.2 Vacancy lifecycle

Suggested states: - `DRAFT` - `PUBLISHED` - `PAUSED` - `CLOSED` -
`FILLED` - `ARCHIVED`

Only approved centres can publish. Employers can pause or close
recruitment. A vacancy should not accept new applications when closed,
filled, paused, or past its deadline, unless an authorised employer
action explicitly reopens it.

### 7.3 Search and filtering

Applicants should be able to filter by: - Practice area. - State, city,
and location. - Accommodation availability. - Remuneration information
where supplied. - Application deadline. - Expected start date. - Centre
type. - Vacancy status. - Other useful structured criteria identified
during validation.

Support keyword search, sorting, pagination, and mobile-friendly
filters. Show the date information was last updated where useful.

### 7.4 Real-time vacancy counts

Track separately: - `total_positions` - `reserved_positions` -
`confirmed_positions` - `available_positions`

Derive or maintain `available_positions` using a transaction-safe rule:

`available_positions = total_positions - reserved_positions - confirmed_positions`

The database must prevent positions from being over-reserved or
over-confirmed. If the total capacity is reduced below the number
already reserved plus confirmed, reject the change or require an
explicit resolution workflow.

Application submission does not reserve a position. An offer reserves a
position only if the employer has capacity and the configured offer
policy permits it. An accepted offer converts a reservation into a
confirmed placement. Declined, cancelled, or expired offers release
their reservation. If no position is available, an employer may still
manage a candidate as waitlisted, but cannot issue an offer that
overbooks capacity.

The exact offer reservation policy and duration should be configurable
by the employer within platform limits.

### 7.5 Atomicity and concurrency

The backend must perform offer issuance, reservation, acceptance,
competing-offer closure, and vacancy counter changes in a transaction.
Use appropriate database locking or concurrency controls and idempotency
protections. If two requests compete for the last position, only a valid
request may succeed. Return a clear conflict response for the other
request.

WebSocket events should broadcast committed changes. Clients must be
able to refetch authoritative counts after reconnecting.

------------------------------------------------------------------------

## 8. Applicant account and profile

### 8.1 Registration

Any person may register as an applicant and begin exploring or applying,
subject to each vacancy's stated requirements. The platform does not
perform professional credential certification as a prerequisite for
account creation.

Recommended controls: - Email verification for account security. -
Secure password reset or supported passwordless flow. - Basic abuse
prevention and rate limiting. - Clear privacy information at
registration. - No unnecessary identity-document collection during
registration.

### 8.2 Profile

Possible fields: - Full name and contact details. - University and
graduation information. - Preferred practice areas. - Preferred
locations. - Optional accommodation needs/preferences. - CV and reusable
documents. - Short professional profile. - Application history and
placement history.

Only collect fields with a clear product purpose. Employers should only
access applicant information in accordance with the application workflow
and stated privacy rules.

### 8.3 Document handling

-   Applicants can upload files required by a vacancy.
-   Enforce allowed file types, size limits, malware scanning, and safe
    file handling.
-   Store documents in private object storage and use short-lived
    authorised download links.
-   Never expose private document URLs publicly.
-   Record who accessed sensitive documents where appropriate.
-   Allow employers to record credential checks without claiming that
    the platform independently verifies the credentials.
-   Where documents are updated after submission, retain a submission
    snapshot or version reference so the employer can identify what was
    submitted at the time.
-   Define retention and deletion rules before production.
-   Use synthetic documents in development and testing.

### 8.4 Application-specific requirements

Each employer controls requirements for each vacancy: - Required and
optional documents. - Questions and answers. - Mandatory fields. -
Application deadline. - Additional instructions.

Applicants should see requirements before applying. Validate required
fields server-side. Store the form version and submission snapshot with
the application so later employer edits do not silently rewrite an
already-submitted application.

------------------------------------------------------------------------

## 9. Applications and recruitment pipeline

### 9.1 Application lifecycle

Use a documented state machine. Suggested states: - `DRAFT` (optional if
draft applications are supported) - `SUBMITTED` - `UNDER_REVIEW` -
`SHORTLISTED` - `INTERVIEWING` - `WAITLISTED` - `REJECTED` -
`WITHDRAWN` - `OFFERED` - `ACCEPTED` - `CLOSED_OTHER_OFFER_ACCEPTED` -
`CLOSED_VACANCY` - `EXPIRED`

Not every transition is permitted from every state. Enforce allowed
transitions in the backend and test them.

### 9.2 Employer application management

Employers can: - View applications for their vacancies. - Filter and
sort candidates. - Review application answers and documents. - Record
credential-check status and notes. - Shortlist, reject, waitlist, and
progress candidates. - Invite candidates to interviews. - Maintain
internal notes and assessments with restricted access. - Send offers to
selected candidates. - View the complete event history for an
application.

Candidate-facing messages should be clear and respectful. Internal
interview notes must not be exposed to candidates unless an explicit
product policy permits it.

### 9.3 Multiple applications

Applicants may apply to multiple centres and can receive invitations or
offers from several centres simultaneously.

The system must not restrict multiple applications merely because the
applicant is interviewing elsewhere. The one-placement rule applies at
offer acceptance, as defined below.

------------------------------------------------------------------------

## 10. Interviews and assessments

Employers configure their own interview process per vacancy or
recruitment campaign.

Supported stage types should initially include: - Verbal interview. -
Written assessment. - Additional interview stage. - Other configurable
assessment type, with clear instructions.

Each stage may include: - Name and description. - Stage order. -
Format. - Date/time and time zone. - Location or meeting instructions. -
Interviewers or responsible staff. - Candidate instructions. - Required
documents or materials. - Outcome and decision notes. -
Reschedule/cancellation reason.

Support multiple stages and candidate-specific progression where
appropriate. The platform need not host video calls or administer
complex online exams in the initial release; it can provide scheduling
and instructions for external or in-person processes.

Notify candidates and relevant employer staff about invitations,
schedule changes, cancellations, and upcoming interviews. Keep a history
of changes.

------------------------------------------------------------------------

## 11. Offer letters and one-placement rule

### 11.1 Offer creation

Employers can create and issue a formal offer letter. The offer should
support: - Candidate and organisation details. - Vacancy and location. -
Reporting/resumption date. - Terms and conditions supplied by the
employer. - Accommodation details where applicable. - Remuneration
information where applicable. - Acceptance deadline. - Offer document or
generated PDF. - Version number and issue timestamp. - Status and
decision timestamp.

The product should support uploading an employer-provided letter or
generating a document from a reviewed template. Do not claim a generated
template is legally sufficient without local review.

### 11.2 Offer states

Suggested states: - `DRAFT` - `ISSUED` - `ACCEPTED` - `DECLINED` -
`EXPIRED` - `WITHDRAWN_BY_EMPLOYER` - `CANCELLED`

Every status transition must be authorised and audited.

### 11.3 Required acceptance behaviour

When a candidate accepts an offer: 1. Validate that the offer is still
open and the acceptance deadline has not passed. 2. Validate that the
candidate has no other accepted active placement. 3. Validate that the
relevant vacancy reservation/capacity is valid. 4. In a single database
transaction, mark the selected offer accepted, convert its reservation
into a confirmed placement, and create or activate the placement record.
5. Decline all other outstanding offers for that candidate. 6. Close all
other active applications for that candidate with a specific reason such
as `CLOSED_OTHER_OFFER_ACCEPTED`. 7. Release any reservations held by
those competing offers. 8. Recalculate affected vacancy counts. 9.
Record the action and timestamp in the audit/event history. 10. After
commit, send email and in-app notifications to the candidate and
affected employers, and broadcast vacancy updates.

The operation must be idempotent: duplicate requests must not create
multiple placements or send contradictory decisions. If any
transactional validation fails, do not partially apply the workflow.

### 11.4 Cancellation and withdrawal after acceptance

This is a policy decision not yet finalised. Implement a controlled
workflow rather than silently reopening every other application. Initial
recommended default: - Candidate cannot accept a second offer while an
accepted placement is active. - If a candidate or employer requests
cancellation after acceptance, record a cancellation request/reason and
route it through a clearly authorised decision process. - An authorised
cancellation may terminate the placement and release the confirmed
position, subject to platform policy and employer action. - Do not
automatically restore previously closed applications or declined offers.
Candidates may need to reapply or employers may need to reopen
recruitment. - All affected parties receive appropriate notifications.

Confirm this policy with the product owner before production.

### 11.5 Offer expiry and reservations

The platform needs an explicit offer deadline. Recommended default:
employers set a deadline when issuing an offer; offers expire
automatically at the deadline if no decision is recorded. The exact
maximum/minimum deadline and reservation duration should be configurable
and documented.

A background worker processes expirations, but all acceptance endpoints
must also validate expiry synchronously to avoid races. Offer expiry
must release any reservation exactly once.

------------------------------------------------------------------------

## 12. Internship lifecycle and employer operations

### 12.1 Placement record

An accepted offer creates a placement record linked to: - Applicant. -
Organisation. - Physical location. - Vacancy. - Accepted offer and its
version. - Reporting date. - Responsible coordinator and supervisor
where assigned. - Status and event history.

### 12.2 Placement states

Suggested states: - `OFFER_ACCEPTED` - `AWAITING_RESUMPTION` -
`ACTIVE` - `INTERRUPTED` - `WITHDRAWAL_REQUESTED` - `TERMINATED` -
`COMPLETED`

Define permitted transitions and permissions. Do not automatically mark
a placement complete just because an expected end date has passed. The
centre must explicitly mark completion.

### 12.3 Employer operations

Include configurable tools for: - Onboarding and document checklist. -
Intern records. - Supervisor/preceptor assignment. - Attendance. -
Department/unit rotations. - Periodic assessments and feedback. -
Placement progress and status. - Completion confirmation and final
assessment. - Staff records and role management.

These tools are intended as administrative records. They do not
independently establish official regulatory completion or professional
registration.

### 12.4 Completion

Only authorised employer personnel can mark an internship completed.
Record: - Completion date. - Staff member who confirmed completion. -
Optional final assessment. - Optional completion confirmation
document. - Audit event.

Preserve the application, offer, and placement history. Make clear that
an employer's internal completion status is not automatically an
official regulator-issued certificate.

### 12.5 Early exit and failed resumption

Support a recorded workflow for: - Candidate does not resume. -
Candidate requests withdrawal after acceptance. - Employer ends a
placement. - Placement is interrupted. - Placement is transferred only
if a separately defined and authorised transfer policy exists.

Do not automatically reopen competing applications after a placement
ends. Keep a traceable record and notify affected parties.

------------------------------------------------------------------------

## 13. Notifications

### 13.1 Initial channels

Use: - Email. - In-app notifications.

SMS and WhatsApp are not in initial scope.

### 13.2 Events

Notify the relevant people for: - Application received. - Application
status changed. - Interview invitation, reminder, reschedule, or
cancellation. - Offer issued, accepted, declined, withdrawn, or
expired. - Other applications closed after offer acceptance. - Vacancy
filled or closed where relevant. - Centre verification information
request, decision, suspension, or re-verification. - New placement,
reporting date, and placement status changes. - Completion of
internship. - Review response or moderation action where appropriate. -
Account security events.

### 13.3 Reliability

-   Use a transactional outbox or equivalent reliable event-delivery
    pattern for critical notifications.
-   Retry temporary failures with bounded backoff.
-   Record delivery status without logging sensitive message content
    unnecessarily.
-   Avoid duplicate emails on retried jobs.
-   Respect user notification preferences where possible, while
    retaining necessary transactional/security notices.
-   In-app notifications should link to the relevant record and show
    read/unread status.
-   Email failure must not roll back a valid offer acceptance; the
    business transaction remains committed and delivery is retried.

------------------------------------------------------------------------

## 14. Community, reviews, and moderation

### 14.1 Reviews

Applicants and pharmacists can share internship-centre experiences.
Reviews may cover: - Training quality. - Work environment. -
Supervision. - Remuneration/payment reliability as a reported experience
(the platform does not track salary payments in the initial release). -
Accommodation. - Professional development. - Other clearly defined
dimensions.

Design the data model so verified placement reviews can be distinguished
from unverified historical experiences. A placement completed or managed
through the platform is stronger evidence than a self-declared
experience; do not claim verification when it has not occurred.

### 14.2 Employer responses

Approved centres can post public responses to reviews and report
content. Employers cannot delete reviews merely because they disagree
with them.

### 14.3 Community discussions

Plan for posts, comments, and reporting. Reactions, attachments, direct
messaging, and other social features are optional and should be
evaluated before implementation.

### 14.4 Moderation

Implement: - Report-content workflow. - Moderation queue. - Report
reason and status. - Moderator notes and actions. - Appeal or review
path for consequential decisions. - Rules against harassment,
impersonation, spam, disclosure of patient information, confidential
data, and unlawful or abusive content. - A policy for removing or
restricting content, with an audit trail.

Do not make a review public solely because it exists. Apply spam/abuse
checks and allow moderation. Do not let employers suppress legitimate
criticism without a fair review process.

------------------------------------------------------------------------

## 15. Search, location, and accessibility

-   Store structured state, city, address, and optional coordinates for
    centres and vacancies.
-   Support location-based search without requiring applicants to
    disclose precise location.
-   Do not expose private home addresses or unnecessary personal
    location information.
-   Make accommodation details explicit and avoid implying accommodation
    is guaranteed when it is conditional.
-   Design mobile-first, accessible interfaces with keyboard support,
    readable contrast, clear form errors, and screen-reader labels.
-   Support slow or unreliable network conditions with sensible loading
    states, retries, and upload progress.
-   Use consistent Nigerian date/time display conventions and store
    timestamps safely in the database, rendering them in the user's
    relevant time zone.

------------------------------------------------------------------------

## 16. Data model: initial entity map

This is a conceptual starting point. Refine it after writing detailed
data-model and workflow documents.

Core entities: - `User` - `ApplicantProfile` - `Organisation` -
`OrganisationLocation` - `OrganisationMembership` - `Role` /
`Permission` or equivalent access model - `VerificationCase` -
`VerificationDocument` - `VerificationMeeting` -
`VerificationDecision` - `PracticeArea` - `Vacancy` -
`VacancyRequirement` - `Application` - `ApplicationAnswer` -
`ApplicationDocument` - `CredentialCheck` - `InterviewStage` -
`InterviewEvent` - `InterviewParticipant` - `InterviewAssessment` -
`Offer` - `OfferDocumentVersion` - `Placement` -
`SupervisorAssignment` - `AttendanceRecord` - `Rotation` -
`PerformanceAssessment` - `CompletionRecord` - `Notification` -
`NotificationDelivery` - `CommunityPost` - `Comment` - `CentreReview` -
`EmployerReviewResponse` - `ContentReport` - `ModerationAction` -
`AuditEvent` - `SupportCase` (optional for first release)

### Data design requirements

-   Use UUIDs or another safe, consistent identifier strategy.
-   Include `createdAt` and `updatedAt` on mutable entities.
-   Use explicit foreign keys and appropriate indexes.
-   Enforce unique constraints for email addresses and membership
    relationships as appropriate.
-   Use soft deletion only where justified; define actual retention and
    deletion behaviour.
-   Keep immutable event/audit records for consequential transitions.
-   Do not store sensitive documents as public URLs or raw database
    blobs without a clear reason.
-   Avoid duplicating derived counts without a consistency strategy.
-   Use database constraints and transactions for critical invariants.
-   Design for an organisation with multiple locations and multiple
    staff members.
-   Record the actor responsible for consequential changes.
-   Store offer document versions and application submission snapshots.
-   Use controlled enums or reference tables for lifecycle statuses and
    practice areas.

------------------------------------------------------------------------

## 17. API design

Use versioned REST endpoints, consistent error responses, input
validation, pagination, and documented authorisation rules.

Potential route groups: - `/api/v1/auth` - `/api/v1/users` -
`/api/v1/applicant-profile` - `/api/v1/organisations` -
`/api/v1/organisations/:id/locations` - `/api/v1/verification` -
`/api/v1/vacancies` - `/api/v1/applications` - `/api/v1/interviews` -
`/api/v1/offers` - `/api/v1/placements` - `/api/v1/attendance` -
`/api/v1/rotations` - `/api/v1/assessments` - `/api/v1/notifications` -
`/api/v1/reviews` - `/api/v1/community` - `/api/v1/reports` -
`/api/v1/admin` - `/api/v1/audit`

These are suggested route groups, not a final contract. Create OpenAPI
documentation and enforce DTO/schema validation.

### API security requirements

-   Authentication on private routes.
-   Authorisation on every object-level operation; do not rely only on
    role labels.
-   Prevent insecure direct object reference (IDOR) access.
-   Rate limiting for login, registration, uploads, application
    submissions, and content creation.
-   Safe pagination and query limits.
-   Validate uploaded files and ownership.
-   Return conflict errors for invalid state transitions or concurrency
    conflicts.
-   Avoid leaking private employer notes, documents, or other
    applicants' data.
-   Do not trust client-supplied organisation IDs or applicant IDs
    without verifying membership/ownership.
-   Make critical operations idempotent where retries may occur.

------------------------------------------------------------------------

## 18. Security, privacy, and Nigerian compliance

Before production: - Review applicable Nigerian data-protection
obligations with qualified advisers. - Publish clear privacy notices and
terms. - Establish lawful purposes and appropriate bases for
personal-data processing. - Define retention periods and processes for
access, correction, deletion, and other applicable data-subject
requests. - Apply least-privilege access and secure
authentication/session handling. - Encrypt traffic in transit and use
appropriate encryption at rest. - Store secrets in environment/secret
management systems, not in source control. - Use private object storage
and short-lived authorised document links. - Integrate malware scanning
for uploaded files before production. - Log administrative and
consequential actions without placing unnecessary personal or document
content in logs. - Establish backup, restore, incident-response, and
disaster-recovery procedures. - Protect against common web risks,
including injection, cross-site scripting, cross-site request forgery
where applicable, broken access control, brute force, and insecure file
uploads. - Define moderation and dispute procedures for reviews and
community posts. - Obtain legal review of offer-letter templates, terms,
and any claims about accreditation or completion.

The product owner must confirm regulatory requirements with
authoritative sources. Do not hardcode unverified claims about PCN
accreditation or centre eligibility.

------------------------------------------------------------------------

## 19. Business model and scope boundaries

The business model is not final. Candidate revenue options for later
validation: - Employer subscriptions for advanced recruitment and
management features. - Optional recruitment support services. - Advanced
reporting for larger institutions. - Clearly labelled sponsored
listings. - Professional development partnerships or courses.

Initial product principles: - Keep applicant registration, basic vacancy
discovery, and applications free unless validated business decisions
change this. - Do not charge applicants for access to essential
placement opportunities in the initial release. - Do not implement
salary disbursement, salary payment tracking, overdue-payment reminders,
payroll, or a wallet in the initial release. - Vacancy and offer letters
may display employer-provided remuneration terms; this is not payment
management. - Platform subscription billing is a separate future
decision and should not be confused with intern remuneration.

------------------------------------------------------------------------

## 20. Analytics and operational reporting

Provide a useful initial dashboard for platform administrators and
employers.

Platform metrics: - Registered applicants. - Active applicants. -
Registered and verified centres. - Centres awaiting verification. -
Published vacancies. - Total, reserved, confirmed, and available
positions. - Application volume and conversion rates. - Interview and
offer counts. - Offer acceptance rate. - Time from application to
offer/placement. - Vacancy fill rate. - Internship completion rate. -
Verification processing time. - Reports and moderation queue.

Employer metrics should be restricted to the employer's own organisation
and permitted locations. Avoid exposing other organisations' private
recruitment data.

Use aggregated metrics for reporting where possible. Define metric
calculations so different dashboards do not report inconsistent numbers.

------------------------------------------------------------------------

## 21. MVP and phased implementation

### Phase 0 --- Discovery and design

Deliver: - Repository inspection and architecture plan. - Confirmed
assumptions and open-decision register. - User journeys and state
diagrams. - Permission matrix. - Conceptual and relational data model. -
API contract outline. - Threat model and privacy checklist. - MVP scope
and acceptance criteria. - Development and deployment plan.

### Phase 1 --- Core marketplace and recruitment

Implement: - Authentication and applicant profiles. - Organisation
registration and verification workflow. - Organisation and location
profiles. - Vacancy creation, publication, search, and filtering. -
Employer-defined application forms and documents. - Application
pipeline. - Interview stages and scheduling. - Offer letters and
acceptance. - One-placement rule and automatic
competing-application/offer closure. - Transaction-safe vacancy
reservations and real-time counts. - Email and in-app notifications. -
Core admin tools, audit events, and basic reporting. - Responsive
website and core applicant mobile app.

### Phase 2 --- Internship operations

Implement: - Onboarding. - Intern records. - Staff and supervisor
assignments. - Attendance. - Rotations. - Assessments. - Completion
records. - Employer operations reporting.

### Phase 3 --- Community

Implement: - Centre reviews and employer responses. - Verified-placement
indicators. - Posts and comments. - Content reports and moderation. -
Community governance and appeals.

### Phase 4 --- Business expansion

Only after validating adoption: - Employer subscription billing. -
Advanced analytics. - More advanced institutional and multi-branch
workflows. - Additional notification channels. - Further integrations
requested by users and supported by clear requirements.

Do not treat the phased plan as permission to ignore foundational
security or data-model requirements in Phase 1.

------------------------------------------------------------------------

## 22. Testing and acceptance criteria

At minimum, write tests for the following:

### Verification

-   An unapproved centre cannot publish a vacancy.
-   Uploading a licence alone does not approve a centre.
-   Only authorised platform staff can approve or suspend a centre.
-   Every verification decision creates an audit record.
-   Suspension prevents new vacancy publishing and follows a defined
    policy for existing vacancies and placements.

### Applications

-   Applicants can apply to multiple centres.
-   Each vacancy enforces its own requirements.
-   Applicants cannot submit after a closed vacancy's deadline.
-   Employer edits to a form do not silently alter a previously
    submitted application.
-   Employer-only notes are never returned to applicant endpoints.

### Interviews

-   Multiple stages can be configured.
-   Only authorised employer staff can change interview schedules and
    outcomes.
-   Rescheduling/cancellation generates appropriate notifications.

### Offers and vacancy capacity

-   An applicant cannot accept two offers concurrently.
-   Accepting one offer declines other outstanding offers and closes
    other active applications.
-   The chosen offer's reservation becomes a confirmed placement.
-   Competing reservations are released.
-   Duplicate acceptance requests do not create duplicate placements.
-   Expired or declined offers release reservations exactly once.
-   Two simultaneous attempts to claim the last position cannot overfill
    the vacancy.
-   Vacancy capacity cannot be reduced below reserved plus confirmed
    positions without a resolution.
-   A failed transaction leaves no partial state changes.
-   Notification failures do not undo a successful offer acceptance.

### Placement lifecycle

-   Accepted offer creates a placement record.
-   Only authorised employer staff can mark completion.
-   Passing the expected end date does not automatically mark
    completion.
-   Cancellation or early exit is traceable.
-   Ending a placement does not silently restore previously declined
    offers or closed applications.

### Privacy and access

-   One organisation cannot access another organisation's private
    applications or documents.
-   Users cannot change records by guessing IDs.
-   Sensitive files are not publicly accessible.
-   Permission changes take effect correctly.
-   Administrative actions are logged.
-   User data retention/deletion workflows follow the approved policy.

### Community

-   Users can report content.
-   Moderators can record decisions.
-   Employers can respond to reviews but cannot directly delete
    criticism.
-   Verified and unverified experiences are clearly distinguished.

------------------------------------------------------------------------

## 23. Open decisions and recommended defaults

The following are not fully decided. Use these recommended defaults for
design and mark them for product-owner confirmation before production.

  -----------------------------------------------------------------------
  Decision                            Recommended default
  ----------------------------------- -----------------------------------
  Applicant account security          Verify email; do not require
                                      platform-level professional
                                      credential verification

  Centre approval                     Licence/document review plus
                                      recorded verification meeting and
                                      authorised approval

  Official accreditation              Separate from platform approval;
                                      validate using authoritative
                                      sources where applicable

  Offer expiry                        Employer specifies a deadline;
                                      system expires undecided offers at
                                      deadline

  Offer reservation                   Reserve a position when an offer is
                                      issued, subject to capacity;
                                      release on
                                      decline/expiry/cancellation

  Competing applications              Close active applications and
                                      decline outstanding offers after
                                      acceptance; do not restore
                                      automatically after later
                                      cancellation

  Cancellation after acceptance       Controlled request and authorised
                                      workflow; audit all decisions

  Vacancy capacity change             Reject changes below reserved plus
                                      confirmed capacity unless an
                                      explicit resolution is completed

  Reviews                             Distinguish platform-verified
                                      placement experiences from
                                      unverified historical experiences

  Employer mobile app                 Start with essential actions and
                                      notifications; full management
                                      remains on web

  Monetisation                        Validate employer willingness to
                                      pay; keep essential applicant
                                      discovery/application free
                                      initially

  Intern remuneration management      Out of scope for initial release

  Messaging                           Email and in-app notifications only
                                      in initial release

  Community direct messages           Out of scope until safety,
                                      moderation, and abuse controls are
                                      designed

  Formal PCN integration              Do not assume an API or partnership
                                      exists; confirm availability and
                                      permission first
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 24. Items the product owner must validate

Before production, validate: 1. Current PCN requirements for each
relevant centre type and location. 2. How official internship-training
accreditation is verified. 3. Whether the same licence/evidence
requirements apply to branches and different categories of centres. 4.
Appropriate offer-letter language and legal review. 5. Privacy, data
protection, document retention, and complaint handling. 6. Employer
demand, willingness to pay, and sustainable pricing. 7. Actual
recruitment exceptions, including cancellations, transfers, and
non-resumption. 8. Whether applicants should be able to review
historical placements they completed outside the platform, and how those
claims will be labelled. 9. Whether any formal regulator integration is
available and authorised. 10. Operational capacity for verification
meetings, moderation, and support.

Do not block early development on every future commercial decision, but
do not invent a regulatory rule or deploy a risky default without
review.

------------------------------------------------------------------------

## 25. First tasks for Amazon Q

Start by doing the following in order:

1.  Inspect the current repository and report whether it is empty or
    contains existing code.
2.  Summarise the architecture and identify any existing conventions
    that should be preserved.
3.  Create an `OPEN_DECISIONS.md` file from the unresolved decisions in
    this specification.
4.  Create a proposed phased implementation plan with dependencies and
    risks.
5.  Draft workflow/state diagrams for centre verification, applications,
    interviews, offers, vacancy reservations, and placement completion.
6.  Draft the relational data model and permission matrix.
7.  Identify the invariants that must be protected by database
    transactions.
8.  Propose the API contracts and security controls.
9.  Present the plan for approval before generating large amounts of
    application code.
10. Once approved, implement Phase 1 incrementally, with tests and
    documentation for each module.

### Definition of a good implementation

A good implementation is not merely a visually attractive website. It
must correctly enforce employer verification, applicant access,
recruitment workflows, offer acceptance, automatic closure of competing
applications, vacancy capacity, role permissions, privacy, auditability,
and consistent behaviour across website and mobile app.
