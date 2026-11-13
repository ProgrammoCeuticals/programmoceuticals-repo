# ProgrammoCeuticals eCTD Application
## Comprehensive Frontend Build Specification
### Implementation Blueprint for Amazon Q / Codex

**Document status:** Build specification  
**Application:** Standalone eCTD application  
**Frontend:** Next.js + React + TypeScript  
**Backend alignment:** NestJS + PostgreSQL + Drizzle ORM  
**Date:** 2026-10-05

---

# 0. Purpose

This document is the implementation blueprint for the frontend of the ProgrammoCeuticals standalone eCTD application.

The application is a professional regulatory authoring, validation, review, snapshot, publishing, and traceability system. It must not be implemented as a generic PDF or file-management application.

The frontend must preserve this domain model:

```text
Organization
    ↓
Application
    ↓
Submission
    ↕
Submission Unit
    ↓
Context of Use
    ↓
Document Reference
    ↓
Document
    ↓
Document Version
    ↓
Physical File
```

The frontend must also preserve these distinctions:

```text
Document ≠ Document Version
Document ≠ Document Reference
Document ≠ Context of Use
Document ≠ Filename

Sequence ≠ UUID
Sequence ≠ Database primary key

Lifecycle ≠ Document versioning
Validation ≠ Human review
Review ≠ Publishing
Publishing ≠ Transmission
```

---

# 1. Regulatory and product principles

## 1.1 Backend authority

The backend is authoritative for:

- sequence assignment;
- lifecycle eligibility;
- Context of Use relationships;
- document identity;
- validation results;
- publishing readiness;
- permissions;
- regulatory package status;
- configuration;
- immutable state transitions.

The frontend presents and orchestrates workflows; it must not independently determine regulatory truth.

## 1.2 No fabricated regulatory intelligence

Do not hardcode or invent:

- controlled vocabularies;
- CTD/eCTD regulatory rules;
- XML namespaces;
- interaction identifiers;
- sender OIDs;
- regional rules;
- validation criteria;
- NAFDAC regional eCTD requirements.

Use authoritative regulatory packages/configuration supplied by the backend.

If required regulatory data is unavailable, show a **REGULATORY GAP**. Never turn missing rules into a green validation result.

## 1.3 Current regulatory baseline

As checked on 2026-10-05, ICH identifies eCTD v4.0 Implementation Guide **v1.7** and ICH Controlled Vocabulary Package **v1.0.3** as the latest versions. ICH also states that the harmonized package is used with applicable regional/Module 1 materials.

For FDA, the current eCTD v4.0 standards page lists the FDA Regional Module 1 Implementation Guide **v1.9**, FDA Regional CV package **v1.2**, and FDA eCTD v4.0 validation criteria **v1.6**. FDA states that CDER and CBER accept new regulatory applications in eCTD v4.0.

These are configuration references, not constants that should be embedded into React components.

**Sources:**
- ICH: https://admin.ich.org/page/ich-electronic-common-technical-document-ectd-v40
- FDA eCTD v4.0 standards: https://www.fda.gov/drugs/electronic-regulatory-submission-and-review/ectd-submission-standards-ectd-v40-and-regional-m1
- FDA eCTD v4.0 validation criteria: https://www.fda.gov/media/194434/download

## 1.4 NAFDAC

Do not fabricate a NAFDAC eCTD v4.0 regional specification. The product must support a future authoritative NAFDAC regional configuration through the regulatory-package architecture.

Until such material is supplied:

```text
NAFDAC configuration
    ↓
NOT CONFIGURED / REGULATORY GAP
```

---

# 2. End-to-end frontend information architecture

```text
Authentication
    ↓
Organization Context
    ↓
Application Dashboard
    ↓
Application Overview
    ↓
Submission Workspace
    ↓
CTD/eCTD Authoring
    ├── CTD Structure
    ├── Context of Use
    ├── Documents
    └── Lifecycle
    ↓
Validation
    ↓
Review
    ↓
Publishing
    ↓
Audit & Traceability
```

Inside an application:

```text
Application
├── Overview
├── Submissions
├── CTD Structure
├── Documents
├── Validation
├── Review
├── Publishing
└── Audit
```

---

# 3. Authentication, organization, and role-aware UI

## 3.1 Login

Professional, simple sign-in screen:

```text
ProgrammoCeuticals eCTD

Email
[________________________]

Password
[________________________]

[Sign In]

Forgot password?
```

Support secure session restoration, logout, access-token expiry, refresh flow, protected routes, and appropriate 401/403 handling.

Do not leak whether an account exists when credentials are invalid.

## 3.2 Organization context

The current context must be unambiguous:

```text
Current User
Current Organization
Current Application
Current Submission
Current Submission Unit
```

If a user belongs to multiple organizations, provide an organization switcher.

## 3.3 Roles

Backend roles already established:

```text
SUPER_ADMIN
ORG_ADMIN
REGULATORY_MANAGER
AUTHOR
REVIEWER
VIEWER
```

### SUPER_ADMIN

System-wide administration:

- organizations;
- users/roles;
- regulatory packages;
- system configuration;
- system audit.

### ORG_ADMIN

Organization administration and permitted organization resources.

### REGULATORY_MANAGER

Application/submission oversight, lifecycle, validation, review, and publishing according to explicit permissions.

### AUTHOR

Draft authoring, document management, eligible lifecycle actions, validation according to permissions.

### REVIEWER

Human review, comments, findings, comparisons, review decisions according to permissions.

### VIEWER

Read-only access to permitted resources.

## 3.4 Authorization invariant

Do not use the frontend as a security boundary.

Bad:

```ts
if (role === 'AUTHOR') allowReplace();
```

Correct model:

```text
Frontend capability visibility
        ↓
Backend authorization
        ↓
Authoritative response
```

Handle backend 403 responses cleanly.

---

# 4. Global application shell

The shell contains:

```text
Top Bar
Sidebar
Breadcrumbs
Workspace Header
Main Content
Notifications
User Menu
```

## 4.1 Sidebar

Outside an application:

```text
Applications
  Dashboard
  Applications

System
  Settings
```

Inside an application:

```text
ABC Tablets 500 mg

Overview
Submissions
CTD Structure
Documents
Validation
Review
Publishing
Audit
```

## 4.2 Top bar

```text
ProgrammoCeuticals eCTD        Notifications   Help   User
```

## 4.3 Breadcrumbs

Example:

```text
Applications / ABC Tablets 500 mg / Sequence 0003 / 3.2.P.8
```

Deep links are required throughout the product.

## 4.4 Reusable UI components

Build a reusable design system containing at least:

```text
AppShell
TopBar
Sidebar
Breadcrumbs
WorkspaceHeader
Tabs
DataTable
Tree
StatusBadge
LifecycleBadge
ValidationBadge
RegulatoryGapBanner
Alert
Toast
Drawer
Modal
ConfirmationDialog
Stepper
Timeline
DocumentViewer
MetadataPanel
EmptyState
ErrorState
LoadingSkeleton
AsyncJobProgress
SubmissionReadiness
PublishingPipeline
AuditEventDrawer
```

---

# 5. Application Dashboard

## Purpose

Answer:

> What applications exist, what is their state, and what needs attention?

## Layout

```text
Applications                                  [+ New Application]

Search applications...       Filter... Sort...

┌─────────────────────────────────────────────┐
│ ABC Tablets 500 mg                ACTIVE     │
│ Acme Pharmaceuticals Ltd.                  │
│ Application No.: 123456                    │
│ Latest Sequence: 0003                      │
│ Documents: 48                              │
│ Issues: 2                                  │
│ [Open Application]                           │
└─────────────────────────────────────────────┘
```

## Search

Support application name, applicant, application number, product, active ingredient.

## Filters

Backend/configuration-driven filters may include status, organization, application type, product, validation state, last updated.

## New Application

Use a guided workflow:

```text
Application Identity
    ↓
Applicant / Organization
    ↓
Product Information
    ↓
Regulatory Configuration
    ↓
Review & Create
```

Allow saving a draft.

## Empty state

```text
No applications yet
Create your first regulatory application to begin.
[Create Application]
```

---

# 6. Application Overview

## Purpose

Answer:

> What is this application, what submissions exist, and what is its current workflow state?

## Tabs

```text
Overview
Submissions
CTD Structure
Documents
Validation
Review
Publishing
Audit
```

## Summary

Display:

```text
Latest Sequence
Submission Units
Documents
Validation State
Regulatory Gaps
```

## Submission timeline

```text
0000 ───── 0001 ───── 0002 ───── 0003
Original   Update     Update     Current
```

Sequence numbers must be called **Sequence**, not generic version numbers.

## Current submission

```text
Sequence 0003
Status: DRAFT
[Continue Working]
```

## Application information

Use an expandable metadata panel for:

- product;
- applicant;
- application number;
- application type;
- regulatory authority/configuration;
- created/updated information.

---

# 7. Submission Workspace

## Purpose

Central working environment for a sequence and its Submission Unit(s).

## Three-pane layout

```text
┌────────────────┬───────────────────────────┬──────────────────┐
│ Submission     │ CTD Structure             │ Details          │
│ Units          │                           │                  │
│                │ Module 1                  │ Selected CoU     │
│ Unit 1         │ Module 2                  │ Document         │
│ Unit 2         │ Module 3                  │ Lifecycle        │
│                │   3.2.S                   │ Keywords         │
│                │   3.2.P                   │                  │
└────────────────┴───────────────────────────┴──────────────────┘
```

## Top controls

```text
[Save] [Validate] [Review] [More]
```

Save means draft persistence, not final submission.

## Submission Unit panel

Display human-readable unit names. Technical UUIDs belong in advanced details.

Never require users to type UUIDs.

---

# 8. CTD/eCTD Authoring Workspace

## Core principle

The CTD tree is a regulatory navigation model, not a folder browser.

Do not implement:

```text
3.2.P.8/stability.pdf
```

as the domain model.

Use:

```text
CTD Section
    ↓
Context of Use
    ↓
Document Reference
    ↓
Document
```

## Configuration-driven tree

The frontend must render the applicable CTD structure from configuration/backend data. Do not hardcode regulatory logic inside React components.

Example UI:

```text
▾ Module 1
▾ Module 2
▾ Module 3
   ▾ 3.2.S
   ▾ 3.2.P
      3.2.P.1
      3.2.P.2
      3.2.P.3
      3.2.P.4
      3.2.P.5
      3.2.P.6
      3.2.P.7
      3.2.P.8
      3.2.P.9
▾ Module 4
▾ Module 5
```

Actual headings/hierarchy must be driven by the applicable configuration.

## Tree indicators

```text
✓ Complete
○ Empty/not populated
⚠ Warning
✕ Error
ⓘ Regulatory Gap
```

Color must never be the only signal.

## CTD node selection

Selecting `3.2.P.8 — Stability` should open the CoU detail panel:

```text
3.2.P.8 — Stability
Status: ACTIVE
Lifecycle: REPLACE
Document: Stability Report v3
Document Reference: ...
Keywords: ...

[Add Document]
[Replace]
[Reuse]
[Suspend]
[View Lifecycle]
```

## Empty CTD section

```text
3.2.P.6 — Reference Standards
No Context of Use has been created.
[Add Document]
[Reuse Existing Document]
```

## Drag/drop rule

Do not silently create a regulatory relationship by dropping a file onto a CTD node. Drag/drop, where supported, must open a confirmation workflow that makes the CoU/reference action explicit.

---

# 9. Context of Use and lifecycle UX

## Core rule

Lifecycle belongs to the Context of Use.

Do not model lifecycle as `Document.previousDocumentId`.

Use an explicit lifecycle relationship, conceptually:

```text
ContextOfUseLifecycle
  sourceContextOfUseId
  targetContextOfUseId
  operation
  createdAt
```

Exact field names and relationship direction must follow the backend contract.

## Context details

```text
Context ID
CTD Section
Status
Current Sequence
Document
Document Reference
Keywords
Lifecycle Operation
Related Context of Use
```

## Context Group

Present Context Group conceptually as:

```text
Context Group
  ├── Context of Use
  └── Keywords
```

Controlled keyword values must come from the loaded regulatory vocabulary/configuration.

---

# 10. Document Management

## Purpose

Answer:

> What documents exist, what versions exist, and where are they used?

## Main table

```text
Document | Current Version | File Type | Status | References | CTD Usage | Last Updated
```

Prefer a table for comparison across many documents.

## Document details

Tabs:

```text
Overview
Versions
References
Regulatory Usage
Audit
```

## Document identity

Example:

```text
Title: Stability Report
Document ID: DOC-UUID
Current Version: v3
File: stability-report-v3.pdf
```

Filename is secondary metadata, not document identity.

## Version history

```text
v3 CURRENT
v2
v1
```

Older versions must not simply disappear if they are relevant to historical submissions/audit.

## References

Show all uses:

```text
Sequence 0002 / 3.2.P.8 / CoU-014
Sequence 0003 / 3.2.P.8 / CoU-028
```

## Upload workflow

```text
Select File
    ↓
Upload
    ↓
Security/Malware Scan
    ↓
Technical Metadata Extraction
    ↓
Regulatory Metadata
    ↓
Create Document/Version
    ↓
Available for regulatory reference
```

Upload must not automatically create a CoU.

## Security state

Show:

```text
Uploading
Scanning
Processing
Available
Rejected
```

Production document upload must use ClamAV or an equivalent malware-scanning service as provided by the backend architecture.

## Document preview

Support PDF preview, page navigation, zoom, metadata, references, audit, and controlled download.

---

# 11. Lifecycle Management Workspace

## Purpose

Answer:

> What happened to each Context of Use, what is currently active, and what lifecycle operation is proposed?

## Main view

```text
CTD Section | Context | Current Document | Status | Last Operation
```

## Lifecycle operations

```text
NEW
REPLACE
REUSE
SUSPEND
```

## Replace workflow

```text
Current CoU
    ↓
Upload or select replacement document
    ↓
Review proposed new CoU
    ↓
Backend lifecycle validation
    ↓
Commit
```

The UI language must be **Replace Context of Use**, not Replace PDF.

Display the relationship to the old CoU.

## Reuse workflow

```text
Existing Document
    ↓
Select Application
    ↓
Select Submission
    ↓
Select CTD Section
    ↓
Configure Context/Keywords
    ↓
Backend validation
    ↓
Create new reference/use
```

Reuse must not automatically create a new document version.

## Suspend workflow

```text
Select active CoU
    ↓
Reason where required
    ↓
Review
    ↓
Backend validation
    ↓
Commit
```

Suspending a CoU does not mean deleting the document.

## Review-before-commit

High-impact lifecycle actions must have a review step showing:

- current CoU;
- proposed CoU;
- operation;
- document(s);
- related CoU(s);
- context/keyword changes;
- impact;
- backend validation result.

## Lifecycle visualization

Support a timeline and, where necessary, a non-linear relationship graph.

Do not assume lifecycle is always a simple linear version chain.

---

# 12. Validation Workspace

## Purpose

Answer:

> What was validated, what passed, what failed, what was skipped, and why?

## Validation layers

```text
1. Package / Structural
2. File / Physical
3. XML / Schema
4. Controlled Vocabulary
5. ICH Business Rules
6. Regional Rules
```

## Validation run

Display:

```text
Run ID
Target submission/snapshot
Started/completed
Triggered by
Regulatory configuration
Result
```

## Run history

Keep previous validation runs. A page should not merely say “last validation passed”.

## Result states

Backend-driven states may include:

```text
NOT_RUN
RUNNING
PASSED
PASSED_WITH_WARNINGS
FAILED
INCOMPLETE
BLOCKED
```

## Regulatory gap rule

A missing required package is not a validation pass.

Example:

```text
Regional Rules
ⓘ NOT EXECUTED
Reason: required regional validation criteria unavailable
Impact: regional validation not completed
```

Never show full `VALID` when required layers were skipped.

## Findings

Findings should deep-link to their affected object where possible:

```text
Application
Submission
Submission Unit
CoU
Document Reference
Document
```

## Revalidation

Do not let a user merely click “Mark resolved” to turn an actual validation error green. Revalidate or use the backend's explicit resolution workflow.

## Regulatory configuration status

Show which required packages/configurations are available, missing, or active.

---

# 13. Review Workspace

## Purpose

Validation asks whether executable rules pass. Review asks whether a human has inspected and accepted the submission/change set.

## Tabs

```text
Summary
Changes
CTD Tree
Documents
Lifecycle
Findings
Audit
```

## Change summary

Group by:

```text
NEW
REPLACE
REUSE
SUSPEND
```

## Change detail

For Replace:

```text
Previous CoU
Previous Document

New CoU
New Document

Lifecycle: REPLACE

[Compare]
```

## Document comparison

Where feasible, provide side-by-side document viewing and textual comparison.

Keep this distinct from lifecycle comparison.

## Lifecycle comparison

Show:

```text
Previous Sequence
New Sequence
CTD Section
Context/keywords
Previous Document
New Document
Lifecycle Operation
Related CoU
```

## Review findings

Review findings are human review records and must remain distinct from machine validation findings.

Suggested review flow:

```text
NOT REVIEWED
    ↓
IN REVIEW
    ↓
APPROVED / REQUIRES ACTION
```

Exact states are backend-controlled.

## Comments

Comments should be attached to meaningful regulatory objects, not just browser/page state. Threaded replies may be supported.

## Complete Review

Before completion show:

```text
Changed items reviewed
Open findings
Validation state
Regulatory gaps
Next permitted stage
```

Backend determines eligibility.

---

# 14. Publishing Workspace

## Purpose

Controlled transformation of an immutable submission snapshot into a finalized regulatory package.

## Pipeline

```text
DRAFT
  ↓
FREEZE
  ↓
SNAPSHOT
  ↓
FULL VALIDATION
  ↓
XML GENERATION
  ↓
XSD VALIDATION
  ↓
DOCUMENT RESOLUTION
  ↓
PACKAGE CONSTRUCTION
  ↓
CHECKSUM
  ↓
FINALIZE
```

## Readiness gate

Display:

```text
✓ Review complete
✓ Required validation complete
✓ No blocking validation errors
✓ No unresolved regulatory gaps
✓ Required documents resolved
```

or the exact blockers.

Readiness itself comes from the backend.

## Freeze

Before freeze show:

```text
Sequence
Current state
Validation state
Review state
Consequences of immutability
```

After freeze, normal editing is disabled.

## Snapshot

Create an immutable snapshot that captures the consistent state used by the publishing pipeline, including applicable:

- submission data;
- CoUs;
- lifecycle relationships;
- document references;
- document versions;
- regulatory configuration identifiers.

## Pipeline progress

Use stage-based progress:

```text
✓ Freeze
✓ Snapshot
● Full Validation
○ XML Generation
○ XSD Validation
○ Document Resolution
○ Package Construction
○ Checksum
○ Finalize
```

Publishing and validation operations should be treated as asynchronous jobs where appropriate.

## XML generation

Generated XML is a technical regulatory artifact. Ordinary users must not manually edit generated XML.

Technical users may see read-only diagnostics.

Do not fabricate production XML when required schema/configuration is missing.

## XSD validation

If schema package is unavailable:

```text
PUBLISHING BLOCKED
Required schema package is unavailable.
```

## Document resolution

Show:

```text
Referenced
Resolved
Missing
Invalid
Checksum verified
```

## Package construction

Show the generated package as a read-only artifact/package explorer. Render backend-generated structure; do not invent package structure in the UI.

## Checksum

Display artifact checksum and identity.

## Finalize

Finalization requires explicit confirmation.

After finalization:

```text
FINALIZED
```

The finalized artifact cannot be modified in place.

## Publishing history

Keep previous attempts, including failures:

```text
Attempt #4 — FINALIZED
Attempt #3 — FAILED: XSD validation
Attempt #2 — FAILED: validation errors
```

## Transmission

Publishing is separate from transmission.

Never expose:

```text
Publish & Send to NAFDAC
```

unless an authoritative transmission integration has been explicitly implemented.

---

# 15. Audit & Traceability Workspace

## Purpose

Answer:

> Who did what, to which object, when, from what state to what state, and what result occurred?

## Auditable objects

At minimum, where applicable:

```text
Application
Submission
Submission Unit
Context of Use
Document
Document Version
Document Reference
Lifecycle Action
Validation Run
Review Finding
Review Decision
Snapshot
Publishing Attempt
Package
Regulatory Configuration
User/Organization administration
```

## Main table

```text
Date/Time | Actor | Action | Object | Result
```

## Event detail

Display:

```text
Action
Result
Actor
Timestamp
Application
Submission
Object
Previous state
New state
Related objects
```

## Failed actions

Rejected/failed attempts are still audit events.

Example:

```text
Action: REPLACE
Result: REJECTED
Reason: CoU not eligible
State changed: NO
```

## Immutable audit

No edit/delete audit event controls.

Corrections must be represented as new events under backend policy.

## Audit timeline

Show end-to-end sequences such as:

```text
Freeze
→ Snapshot
→ Validate
→ XML
→ XSD
→ Package
→ Checksum
→ Finalize
```

---

# 16. Global feedback, errors, jobs, and states

## 16.1 Toasts

Use for lightweight operations:

```text
✓ Changes saved
✓ Document uploaded
```

Critical state changes must also be reflected in persistent page state.

## 16.2 Alerts

Use separate components for:

```text
Regulatory Gap
System Error
Blocking Condition
Security State
Workflow Restriction
```

Do not mix regulatory findings with infrastructure errors.

## 16.3 Error classification

Distinguish:

```text
Network failure
Authentication failure
Authorization failure
Validation failure
Regulatory gap
Configuration failure
Server failure
File processing failure
Publishing failure
```

## 16.4 Long-running jobs

Conceptually:

```text
POST command
    ↓
jobId
    ↓
status/progress
    ↓
RUNNING
    ↓
COMPLETED / FAILED
```

The implementation may use polling, SSE, WebSocket, or another backend-supported approach.

Do not fake progress percentages.

---

# 17. State management

Keep three categories.

## Server state

```text
Applications
Submissions
Submission Units
CoUs
Documents
Validation Runs
Review Findings
Publishing Attempts
Audit Events
Regulatory Packages
```

## Local UI state

```text
Selected CTD node
Expanded tree nodes
Open drawer
Modal state
Filters
Sorting
Pagination
```

## Form/workflow state

```text
Create Application
Create Submission
Upload metadata
Proposed lifecycle action
Review decision
```

Avoid duplicating authoritative regulatory state throughout the client.

---

# 18. Routing

Suggested route model:

```text
/login

/applications
/applications/[applicationId]
/applications/[applicationId]/submissions
/applications/[applicationId]/submissions/[submissionId]
/applications/[applicationId]/submissions/[submissionId]/structure
/applications/[applicationId]/submissions/[submissionId]/lifecycle
/applications/[applicationId]/submissions/[submissionId]/validation
/applications/[applicationId]/submissions/[submissionId]/review
/applications/[applicationId]/submissions/[submissionId]/publishing
/applications/[applicationId]/audit

/applications/[applicationId]/documents
/applications/[applicationId]/documents/[documentId]

/admin
/admin/organizations
/admin/users
/admin/regulatory-packages
/admin/configuration
/admin/audit
```

Use deep links for validation findings, documents, CoUs, and audit events whenever possible.

---

# 19. API/domain command philosophy

The frontend should integrate with explicit domain operations where the backend supports them:

```text
CreateApplication
CreateSubmission
CreateSubmissionUnit
AddDocument
ReuseDocument
ReplaceContextOfUse
SuspendContextOfUse
RunValidation
FreezeSubmission
CreateSnapshot
GenerateXML
ValidateSchema
ResolveDocuments
BuildPackage
FinalizePackage
```

Avoid representing a regulatory action merely as a generic resource update.

Never invent endpoint names when an actual backend contract is available. The typed frontend API client must be generated/aligned to the real backend contract.

---

# 20. API response/error behavior

Prepare for:

```text
400 Invalid request
401 Unauthenticated
403 Unauthorized
404 Not found
409 Workflow/regulatory conflict
422 Domain/validation error
500 Server error
```

For 409/422, preserve workflow context when safe and display the authoritative backend reason.

Do not use optimistic regulatory mutations for:

```text
Replace
Reuse
Suspend
Freeze
Snapshot
Finalize
```

---

# 21. Accessibility

The application must be keyboard accessible.

For the CTD tree, use a semantic accessible tree pattern.

Recommended behavior:

```text
↑ / ↓    Move
→        Expand
←        Collapse
Enter    Select/Open
Space    Expand/Collapse
Escape   Close overlay
```

Requirements:

- visible focus states;
- ARIA semantics;
- accessible dialogs;
- accessible form labels;
- status communicated without color dependence;
- adequate contrast;
- reduced-motion support;
- screen-reader-friendly error/status messages.

---

# 22. Responsive behavior

This is a desktop-first professional application.

Desktop:

```text
Submission Unit | CTD Tree | Details
```

Tablet:

```text
CTD Tree
   ↓
Details
```

Mobile:

```text
Sections
   ↓
Selected Section
   ↓
Details
```

Do not attempt to preserve the entire desktop information density on mobile.

---

# 23. Document comparison and review rules

Keep these distinct:

```text
Content comparison
    ↓
Actual document differences

Lifecycle comparison
    ↓
Regulatory context differences

Metadata comparison
    ↓
CoU/document metadata differences
```

Never infer regulatory lifecycle from document version numbers alone.

---

# 24. Security requirements

The frontend must:

- protect authenticated routes;
- correctly handle expired sessions;
- respect organization context;
- never treat hidden UI controls as authorization;
- avoid secrets in source code;
- not expose regulatory-package administration to unauthorized users;
- sanitize user-rendered content;
- use secure backend-controlled file access;
- prevent unsafe execution of uploaded content;
- distinguish file-security failure from regulatory validation failure.

---

# 25. Testing strategy

## Unit tests

Cover:

- status badges;
- lifecycle display;
- permission presentation;
- validation-state rendering;
- regulatory-gap rendering;
- route helpers.

## Component tests

Cover:

- CTD tree;
- CoU detail panel;
- document table;
- lifecycle dialogs;
- validation findings;
- review panels;
- publishing pipeline;
- audit drawer.

## Integration tests

Test the complete domain chain:

```text
Application → Submission → CTD → CoU → Document Reference → Document
```

and:

```text
Validation → Review → Freeze → Snapshot → Publishing
```

## End-to-end scenarios

At minimum:

1. Create application → create submission → add document → create CoU.
2. Reuse an existing document in a new context.
3. Replace an existing CoU with a new document.
4. Suspend a CoU.
5. Validation failure blocks publishing.
6. Missing regulatory package creates a gap and blocks dependent publishing.
7. Review complete → freeze → snapshot → successful publishing → finalize.
8. Unauthorized action receives a backend `403` and does not mutate state.
9. Publishing failure leaves the immutable snapshot intact.
10. Finalized package traces back to snapshot, validation run, and audit history.

---

# 26. Implementation phases

## Phase 1 — Foundation

- Next.js;
- TypeScript strict mode;
- app shell;
- authentication;
- route protection;
- API client;
- state/query layer;
- design system;
- notifications.

## Phase 2 — Applications

- dashboard;
- overview;
- application creation.

## Phase 3 — Submissions

- submission workspace;
- Submission Units;
- configuration-driven CTD tree.

## Phase 4 — Documents

- document repository;
- upload;
- processing/security status;
- preview;
- versions;
- references.

## Phase 5 — Lifecycle

- CoU workspace;
- Replace;
- Reuse;
- Suspend;
- lifecycle timeline/graph.

## Phase 6 — Validation

- validation runs;
- stage results;
- findings;
- regulatory gaps;
- readiness.

## Phase 7 — Review

- change set;
- comparison;
- findings;
- comments;
- decision.

## Phase 8 — Publishing

- readiness;
- freeze;
- snapshot;
- XML;
- XSD;
- document resolution;
- package;
- checksum;
- finalize.

## Phase 9 — Audit/Admin

- audit workspace;
- organization administration;
- regulatory packages;
- system configuration.

---

# 27. Definition of Done

The frontend is ready for implementation handoff when:

1. All major workspaces exist.
2. High-impact workflows map to backend-authoritative commands.
3. CoU, Document, Document Reference, and Document Version are visually and technically distinct.
4. Lifecycle actions are explicit and auditable.
5. Regulatory gaps are visible and cannot become silent passes.
6. Publishing operates on an immutable snapshot.
7. Missing schema blocks production publishing.
8. Finalized artifacts are immutable.
9. Publishing is separate from transmission.
10. Audit is comprehensive and read-only.
11. Organization boundaries and permissions are respected.
12. The UI is accessible.
13. Critical workflows are covered by automated tests.
14. No regulatory requirement is fabricated in frontend code.
15. API integration is typed against the real backend contract.
16. Every major workspace has loading, empty, error, and blocked/gap states.

---

# 28. Hard implementation invariants

These must be preserved throughout the codebase:

```text
Document ≠ Document Version
Document ≠ Document Reference
Document ≠ Context of Use
Document ≠ Filename

Sequence ≠ UUID
Sequence ≠ Database ID

Lifecycle ≠ Document Versioning
Validation ≠ Review
Review ≠ Publishing
Publishing ≠ Transmission

Upload ≠ Create CoU
Replace ≠ Replace PDF
Suspend ≠ Delete Document
Reuse ≠ Duplicate Document

Frontend authorization ≠ Backend authorization
Validation warning ≠ Validation error
Validation gap ≠ Validation pass
Draft ≠ Frozen snapshot
Snapshot ≠ Finalized package
Finalized package ≠ Transmitted submission
```

---

# 29. Final implementation instruction to Amazon Q / Codex

Treat this document as the frontend product/architecture blueprint.

Do not generate pages independently with duplicated logic. Build the shared shell and design system first, then implement domain features in dependency order.

Do not invent regulatory rules, vocabularies, schema values, XML structure, NAFDAC requirements, or backend endpoints where authoritative material is missing.

If a backend contract or regulatory package is not available, implement the UI boundary and explicit loading/configuration/gap state rather than fabricating a result.

The frontend should make the eCTD model understandable to a regulatory user while retaining the exact domain distinctions required by the backend and regulatory implementation.

The final product should feel like a controlled regulatory authoring and publishing workspace, not a file manager with an eCTD folder tree.
