# BE Assessment Management System — Codex Build Specification

## 1. Project Overview

Build a web-based **Bioequivalence Submission Screening, Compliance Directive, Assessment, and Tracking System**.

The system digitizes the current manual workflow where applicants fill a NAFDAC Bioequivalence Study Report Submission Checklist in Word, officers track applications in Excel, admins assign assessors, assessors submit Word reports, and final decisions are recorded manually.

The application must allow applicants to fill the BE checklist online, while preserving the official checklist arrangement strictly. Applicants do **not** upload dossier documents. They only state the **name and location** of required documents/information in the submitted dossier.

Internal users will screen submissions, issue compliance directives, classify products, assign assessors, receive assessor Word reports, record assessor comments, make final decisions, and generate Excel-like tracking reports.

The applicant checklist must follow the uploaded **NAFDAC Bioequivalence Study Report Submission Checklist** structure strictly, including field order, grouping, numbering, and Section B document reference table.

The system should also support lookup/dropdown/search lists from the tracking Excel workbook and the BE classification reference document, including therapeutic index class, pharmacological class, local/foreign status, BCS class, NTI list, and assessor lists. The classification reference document contains fields such as manufacturer, product, therapeutic index class, pharmacological class, and local/foreign category.

---

## 2. Chosen Stack

Use this stack:

```txt
Frontend: Angular
Backend: Express.js
Database: PostgreSQL
ORM: Prisma
File Storage: Cloudinary
Authentication: JWT
Authorization: Role-Based Access Control
```

Cloudinary is only for assessor report uploads and any future generated files. Applicants must not upload dossier files.

For assessor Word reports, use Cloudinary raw upload:

```txt
resource_type: raw
Allowed file types: .doc, .docx
```

---

## 3. User Roles

The system must support four roles:

```txt
Applicant
Assessor
Admin
Super Admin
```

### Applicant

Can:

- register/login
- create BE checklist draft
- fill checklist digitally
- fill Section B document location references
- submit application
- view compliance directives
- correct affected sections after compliance directive
- resubmit correction
- view basic status of own applications

Cannot:

- upload dossier documents
- view assessor reports
- view internal notes
- view assessor comments
- classify products
- assign assessors
- enter final decisions

### Assessor

Can:

- login
- view only assigned applications
- view applicant checklist
- view Section B document references
- view product classification
- upload Word assessment report
- write typed assessor comment
- submit recommendation
- revert assessment to admin

Cannot:

- edit applicant checklist
- issue compliance directive directly to applicant
- classify product officially
- assign assessors
- make final decision
- view unrelated applications

### Admin

Can:

- view submitted applications
- screen checklist
- issue compliance directives
- review applicant corrections
- classify product
- assign first assessor
- assign second assessor
- view assessor reports/comments
- enter final decision
- view registry table
- export reports

### Super Admin

Can do everything Admin can, plus:

- manage users
- manage lookup lists
- import lookup data
- view audit trail
- reopen finalized application with reason
- override assignments
- archive/restore records

---

## 4. Core Workflow

The system workflow is:

```txt
Applicant creates draft
→ Applicant fills digital BE checklist
→ Applicant submits
→ Admin screens submission
→ Admin issues Compliance Directive if information is unsatisfactory
→ Applicant receives notification
→ Applicant corrects affected sections and resubmits
→ Admin accepts correction
→ Admin classifies product
→ Admin assigns first assessor
→ First assessor reviews, uploads Word report, writes typed comment, submits recommendation
→ Admin assigns second assessor if needed
→ Second assessor reviews, uploads Word report, writes typed comment, submits recommendation
→ Admin/Super Admin records final decision
→ Application is finalized and becomes read-only
```

---

## 5. Application Statuses

Use these internal statuses:

```js
const APPLICATION_STATUSES = [
  "draft",
  "submitted",
  "under_admin_screening",
  "compliance_directive_issued",
  "resubmitted_after_compliance_directive",
  "classified",
  "assigned_first_assessor",
  "first_assessment_ongoing",
  "first_assessment_reverted",
  "assigned_second_assessor",
  "second_assessment_ongoing",
  "second_assessment_reverted",
  "awaiting_final_decision",
  "finalized",
  "archived",
];
```

Use these simplified review statuses for the Excel-like registry:

```js
const REVIEW_STATUSES = ["Pending", "Ongoing", "Completed"];
```

Use these final decision options:

```js
const FINAL_DECISIONS = ["CD", "Approved", "Rejected"];
```

Important distinction:

```txt
Compliance Directive = correction instruction issued to applicant.
CD = final decision option.
```

Do not confuse both.

---

## 6. Applicant Checklist Rule

The applicant-facing checklist must reproduce the standard checklist structure.

Do not rearrange the fields into a new UX order.

Allowed enhancements:

- autosave
- validation
- progress indicator
- section navigation
- conditional required fields
- preview
- export as PDF/Word
- print

Not allowed:

- changing the official grouping
- renaming standard sections casually
- merging unrelated checklist sections
- replacing Section B with file upload

---

## 7. Checklist Structure

Build the digital checklist in this exact order:

```txt
General Instructions
Certification
A. Bioequivalence Study Information
  1. Study number / study protocol number
  2. Study title
  3. Start and end dates for each period of the clinical study
  4. Start and end date for bioanalytical study
  5. Clinical Study facility
  6. Bio-analytical facility
  7. Institutional Review Board / Independent Ethical Committee
  8. Relevant information on the test product used in the BE study
  9. Relevant information on the reference product used in the BE study
  10. Summary results of the study
B. Documents to be submitted
Final Review and Submit
```

---

## 8. Section B Rule

Applicants do **not** upload documents.

Section B must be a table:

```txt
No. | Documents | Name of document and location
```

Applicants only fill:

```txt
Name of document and location
```

This should capture the dossier location, file/folder name, module/section, appendix number, and page range if available.

Seed these 16 Section B rows for every new checklist:

```js
[
  {
    item_number: 1,
    document_title: "Certificate of analysis (COA) of BE test product",
  },
  {
    item_number: 2,
    document_title: "Certificate of analysis (COA) of reference product",
  },
  {
    item_number: 3,
    document_title:
      "Outer packaging and prescribing information sheet or SmPC of BE reference product. The document should contain the information of the batch number, expiry date, name and address of manufacturer",
  },
  {
    item_number: 4,
    document_title:
      "(i) Dissolution study report for comparative dissolution profile (CDP) conducted between test product and reference product in pH 1.2, 4.5, 6.8 and quality control media (if applicable). (ii) Dissolution study protocol. The dissolution study report should be dated and signed by analyst or relevant personnel.",
  },
  {
    item_number: 5,
    document_title:
      "Justifications and bridging data if BE reference product is not the same as WHO comparator product (i.e. same strength and manufacturing site as registered in Nigeria). (i) Dissolution study report for comparative dissolution profile (CDP) conducted between BE reference product in pH 1.2, 4.5, 6.8 and quality control media (if applicable). (ii) Dissolution study protocol. The dissolution study report should be dated and signed by analyst or relevant personnel.",
  },
  {
    item_number: 6,
    document_title:
      "Application form for a biowaiver of additional strength (if applicable), together with justification and documents for biowaiver request. (i) All strengths are manufactured by the same manufacturing process. (ii) Qualitative and quantitative composition of the different strengths (all). (iii) Dissolution study report for comparative dissolution profile (CDP) conducted between test product and other proposed additional strengths in pH 1.2, 4.5, 6.8 and quality control media (if applicable). (iv) Dissolution study protocol. The dissolution study report should be dated and signed by analyst or relevant personnel.",
  },
  {
    item_number: 7,
    document_title: "Clinical study report",
  },
  {
    item_number: 8,
    document_title: "Pharmacokinetic and statistical analysis report",
  },
  {
    item_number: 9,
    document_title:
      "Bioanalytical method validation report and relevant addendum(s)",
  },
  {
    item_number: 10,
    document_title: "Bioanalytical study report",
  },
  {
    item_number: 11,
    document_title: "Quality assurance statement",
  },
  {
    item_number: 12,
    document_title:
      "Letter of approval of Institutional Review Board / Independent Ethical Committee (IEC)",
  },
  {
    item_number: 13,
    document_title:
      "Study protocol approved by Independent Ethical Committee (IEC)",
  },
  {
    item_number: 14,
    document_title: "Informed consent form",
  },
  {
    item_number: 15,
    document_title:
      "Bioequivalence Trial Information Form, BTIF (in MS Word and pdf)",
  },
  {
    item_number: 16,
    document_title: "Literature references (if applicable)",
  },
];
```

---

## 9. Main Database Models

Implement these Prisma models:

```txt
User
ApplicantProfile
Application
BEChecklist
BEStudyPeriod
BESummaryResult
SectionBDocumentReference
ComplianceDirective
ComplianceDirectiveResponse
ProductClassification
AssessorAssignment
AssessorReport
AssessorComment
InternalNote
FinalDecision
LookupItem
Notification
AuditLog
```

### Key Relationships

```txt
User 1──1 ApplicantProfile
User 1──many Applications as applicant

Application 1──1 BEChecklist
BEChecklist 1──many BEStudyPeriods
BEChecklist 1──many BESummaryResults
BEChecklist 1──many SectionBDocumentReferences

Application 1──many ComplianceDirectives
ComplianceDirective 1──many ComplianceDirectiveResponses

Application 1──1 ProductClassification

Application 1──many AssessorAssignments
AssessorAssignment 1──many AssessorReports
AssessorAssignment 1──many AssessorComments

Application 1──many InternalNotes
Application 1──0/1 FinalDecision
Application 1──many Notifications
Application 1──many AuditLogs
```

---

## 10. Essential Model Fields

### User

```js
{
  id,
    full_name,
    email,
    phone,
    password_hash,
    role,
    is_active,
    last_login_at,
    created_at,
    updated_at;
}
```

Role enum:

```txt
applicant | assessor | admin | super_admin
```

### ApplicantProfile

```js
{
  id,
    user_id,
    company_name,
    contact_person_name,
    contact_person_title,
    company_email,
    company_phone,
    company_address,
    rc_number,
    market_authorisation_holder,
    created_at,
    updated_at;
}
```

### Application

```js
{
  id,
    applicant_user_id,
    applicant_profile_id,
    application_no,
    product_name,
    strength,
    dosage_form,
    strength_and_dosage_form,
    current_status,
    review_status,
    final_decision,
    final_decision_date,
    final_decision_note,
    final_decision_by,
    submitted_at,
    resubmitted_at,
    finalized_at,
    created_at,
    updated_at;
}
```

### BEChecklist

Store fields from the official checklist:

```js
{
  id,
    application_id,
    has_read_general_instructions,
    certified_information_is_true,
    signed_on_behalf_of,
    signatory_name_and_title,
    certification_date,
    study_protocol_number,
    study_title,
    bioanalytical_study_start_date,
    bioanalytical_study_end_date,
    clinical_study_site_name,
    clinical_study_site_address,
    bioanalytical_study_site_name,
    bioanalytical_study_site_address,
    ethics_committee_name,
    ethics_committee_address,
    study_protocol_approval_date,
    approved_study_protocol_number_and_version,
    informed_consent_approval_date,
    test_product_name,
    test_product_strength,
    test_product_same_strength_as_registration_product,
    test_product_same_strength_comment,
    test_product_dosage_form,
    test_product_batch_number,
    test_product_batch_size,
    test_product_manufacture_date,
    test_product_expiry_date,
    api_manufacturing_site_name_and_address,
    test_product_manufacturing_site_name_and_address,
    test_product_same_composition_as_registration_product,
    test_product_same_composition_comment,
    reference_product_name,
    reference_product_strength,
    reference_product_dosage_form,
    reference_product_batch_number,
    reference_product_expiry_date,
    reference_product_source_country,
    reference_product_manufacturing_site_name_and_address,
    reference_product_same_as_who_comparator,
    reference_product_comparator_comment,
    biowaiver_of_additional_strength_applicable,
    created_at,
    updated_at;
}
```

### BEStudyPeriod

```js
{
  id,
    checklist_id,
    application_id,
    period_label,
    start_date,
    end_date,
    sort_order,
    created_at,
    updated_at;
}
```

Create default rows:

```txt
Period 1
Period 2
```

### BESummaryResult

```js
{
  id,
    checklist_id,
    application_id,
    parameter,
    logarithmic_transformed_data,
    test_geometric_mean,
    reference_geometric_mean,
    percentage_ratio_geometric_means,
    confidence_interval_lower,
    confidence_interval_upper,
    intra_subject_coefficient_variation_iscv,
    sort_order,
    created_at,
    updated_at;
}
```

Create default rows:

```txt
AUC0-t
AUC0-∞
Cmax
```

### SectionBDocumentReference

```js
{
  id,
    checklist_id,
    application_id,
    item_number,
    document_title,
    name_of_document_and_location,
    is_applicable,
    applicant_remark,
    sort_order,
    created_at,
    updated_at;
}
```

### ComplianceDirective

```js
{
  id,
    application_id,
    directive_number,
    title,
    issued_by_user_id,
    issued_to_user_id,
    affected_sections,
    directive_message,
    required_corrections,
    due_date,
    status,
    issued_at,
    closed_at,
    created_at,
    updated_at;
}
```

Directive status:

```txt
open | responded | closed | cancelled
```

### ComplianceDirectiveResponse

```js
{
  id,
    compliance_directive_id,
    application_id,
    applicant_user_id,
    response_message,
    corrected_sections,
    submitted_at,
    created_at,
    updated_at;
}
```

### ProductClassification

```js
{
  id,
    application_id,
    therapeutic_index_class,
    bcs_class,
    pharmacological_class,
    local_or_foreign,
    product_category,
    biowaiver_relevance,
    classification_source,
    classification_note,
    classified_by_user_id,
    classified_at,
    created_at,
    updated_at;
}
```

Therapeutic index options:

```txt
NTI | Non-NTI | Mixed | Unknown
```

BCS class options:

```txt
Class I | Class II | Class III | Class IV | Unknown | Not Applicable
```

### AssessorAssignment

```js
{
  id,
    application_id,
    assessor_user_id,
    assessment_stage,
    assigned_by_user_id,
    assigned_at,
    due_date,
    assignment_note,
    reason_for_second_assessment,
    status,
    started_at,
    reverted_at,
    completed_at,
    created_at,
    updated_at;
}
```

Assessment stage:

```txt
first_assessment | second_assessment
```

Assignment status:

```txt
assigned | ongoing | reverted | completed | cancelled | reassigned
```

### AssessorReport

```js
{
  id,
    application_id,
    assessor_assignment_id,
    assessor_user_id,
    assessment_stage,
    report_title,
    file_name,
    file_url,
    cloudinary_public_id,
    file_mime_type,
    file_size,
    uploaded_at,
    created_at,
    updated_at;
}
```

### AssessorComment

```js
{
  id,
    application_id,
    assessor_assignment_id,
    assessor_user_id,
    assessment_stage,
    recommendation,
    comment,
    submitted_at,
    created_at,
    updated_at;
}
```

Recommendations:

```txt
recommend_approval
recommend_compliance_directive
recommend_rejection
requires_second_assessment
requires_admin_action
assessment_completed
```

### LookupItem

Use this for dropdown/search data:

```js
{
  id,
    type,
    label,
    value,
    description,
    metadata,
    is_active,
    created_by_user_id,
    created_at,
    updated_at;
}
```

Lookup types:

```txt
nti_drug
bcs_class
assessor_reference
pharmacological_class
dosage_form
final_decision
review_status
local_foreign
product_classification_reference
manufacturer
```

---

## 11. Backend API Base Path

Use:

```txt
/api/v1
```

---

## 12. Required Backend Endpoints

### Auth

```http
POST /api/v1/auth/register-applicant
POST /api/v1/auth/login
GET /api/v1/auth/me
POST /api/v1/auth/logout
```

### Users

```http
POST /api/v1/users
GET /api/v1/users
GET /api/v1/users/:userId
PATCH /api/v1/users/:userId
PATCH /api/v1/users/:userId/deactivate
PATCH /api/v1/users/:userId/reactivate
```

### Applicant Applications

```http
POST /api/v1/applications
GET /api/v1/applications/my
GET /api/v1/applications/:applicationId
PATCH /api/v1/applications/:applicationId
POST /api/v1/applications/:applicationId/submit
```

### Checklist

```http
GET /api/v1/applications/:applicationId/checklist
PATCH /api/v1/applications/:applicationId/checklist

GET /api/v1/applications/:applicationId/checklist/study-periods
PUT /api/v1/applications/:applicationId/checklist/study-periods

GET /api/v1/applications/:applicationId/checklist/summary-results
PUT /api/v1/applications/:applicationId/checklist/summary-results

GET /api/v1/applications/:applicationId/checklist/document-references
PUT /api/v1/applications/:applicationId/checklist/document-references

GET /api/v1/applications/:applicationId/checklist/preview
GET /api/v1/applications/:applicationId/checklist/export/pdf
GET /api/v1/applications/:applicationId/checklist/export/docx
```

### Admin Screening

```http
GET /api/v1/admin/applications/submitted
POST /api/v1/admin/applications/:applicationId/start-screening
POST /api/v1/admin/applications/:applicationId/screening-notes
POST /api/v1/admin/applications/:applicationId/screening/mark-satisfactory
```

### Compliance Directives

```http
POST /api/v1/admin/applications/:applicationId/compliance-directives
GET /api/v1/applications/:applicationId/compliance-directives
GET /api/v1/compliance-directives/:directiveId
POST /api/v1/compliance-directives/:directiveId/respond
PATCH /api/v1/admin/compliance-directives/:directiveId/close
```

### Product Classification

```http
GET /api/v1/applications/:applicationId/classification
PUT /api/v1/admin/applications/:applicationId/classification
GET /api/v1/admin/classification-suggestions
```

### Assessor Assignment

```http
POST /api/v1/admin/applications/:applicationId/assignments/first-assessor
POST /api/v1/admin/applications/:applicationId/assignments/second-assessor
GET /api/v1/applications/:applicationId/assignments
PATCH /api/v1/admin/assignments/:assignmentId/reassign
PATCH /api/v1/admin/assignments/:assignmentId/cancel
```

### Assessor Review and Reports

```http
GET /api/v1/assessor/assignments
POST /api/v1/assessor/assignments/:assignmentId/start
POST /api/v1/assessor/assignments/:assignmentId/reports
DELETE /api/v1/assessor/reports/:reportId
POST /api/v1/assessor/assignments/:assignmentId/comments
POST /api/v1/assessor/assignments/:assignmentId/submit
GET /api/v1/applications/:applicationId/assessor-reports
GET /api/v1/applications/:applicationId/assessor-comments
```

### Final Decision

```http
GET /api/v1/applications/:applicationId/final-decision
POST /api/v1/admin/applications/:applicationId/final-decision
POST /api/v1/super-admin/applications/:applicationId/reopen
```

### Internal Notes

```http
POST /api/v1/applications/:applicationId/internal-notes
GET /api/v1/applications/:applicationId/internal-notes
```

### Lookups

```http
GET /api/v1/lookups
POST /api/v1/lookups
PATCH /api/v1/lookups/:lookupId
PATCH /api/v1/lookups/:lookupId/deactivate
POST /api/v1/super-admin/lookups/import
```

### Notifications

```http
GET /api/v1/notifications
PATCH /api/v1/notifications/:notificationId/read
PATCH /api/v1/notifications/read-all
```

### Audit Logs

```http
GET /api/v1/audit-logs
GET /api/v1/applications/:applicationId/timeline
```

### Reports and Export

```http
GET /api/v1/admin/applications/registry
GET /api/v1/admin/applications/registry/export/excel
GET /api/v1/admin/applications/registry/export/csv
GET /api/v1/admin/dashboard/stats
GET /api/v1/admin/reports/assessor-workload
GET /api/v1/admin/reports/compliance-directives
```

### Assessor Report File Access

```http
GET /api/v1/assessor-reports/:reportId/download
GET /api/v1/assessor-reports/:reportId
```

---

## 13. Registry Table

Build an Excel-like registry table for Admin and Super Admin.

Columns:

```txt
S/N
Applicant Name / Company
Product Name
Strength & Dosage Form
Application No.
First Assessor Assigned
Date Assigned
Date Reverted
2nd Assessor
Status of Review
Final Decision
Date of Final Decision
Comments / Notes
```

Additional useful columns:

```txt
Therapeutic Index Class
BCS Class
Pharmacological Class
Local / Foreign
Current Workflow Status
Compliance Directive Status
Last Updated
```

Filters:

```txt
Date range
Applicant/company
Product name
Application number
First assessor
Second assessor
Status of review
Final decision
NTI/Non-NTI
BCS class
Pharmacological class
Local/foreign
```

Export:

```txt
Excel
CSV
```

---

## 14. Frontend Angular Pages

### Public/Auth Pages

```txt
Login
Applicant Registration
Forgot Password, optional
```

### Applicant Pages

```txt
Applicant Dashboard
My Applications
New BE Submission
Digital BE Checklist Form
Checklist Preview
Compliance Directive View
Correction/Resubmission Page
Submission Status Page
```

### Admin Pages

```txt
Admin Dashboard
Submitted Applications Queue
Application Screening Page
Compliance Directive Composer
Resubmission Review Page
Product Classification Page
Assessor Assignment Page
Application Tracking Registry
Final Decision Page
```

### Assessor Pages

```txt
Assessor Dashboard
Assigned Applications
Assessor Review Page
Upload Word Report Section
Assessor Comment/Recommendation Section
Completed Assessments
```

### Super Admin Pages

```txt
Super Admin Dashboard
User Management
Assessor Management
Lookup List Management
Reports and Export
Audit Trail
Override/Reopen Application Page
```

### Shared Application Detail Page

Use tabs:

```txt
Overview
Applicant Checklist
Section B Document References
Screening
Classification
Compliance Directives
Assessor Assignments
Assessor Reports
Final Decision
Timeline / Audit Trail
```

Role-based visibility must apply to tabs.

---

## 15. Frontend UI Rules

Use Angular features properly:

```txt
Reactive Forms
Route Guards
HTTP Interceptors
Role-based navigation
Reusable table components
Reusable form field components
Reusable status badges
Reusable confirmation dialogs
Reusable file upload component for assessor reports
```

The applicant checklist should be sectioned but must preserve the checklist order.

Use clear status badges:

```txt
Draft
Submitted
Under Admin Screening
Compliance Directive Issued
Resubmitted
Classified
Assigned to First Assessor
First Assessment Ongoing
First Assessment Reverted
Assigned to Second Assessor
Second Assessment Ongoing
Second Assessment Reverted
Awaiting Final Decision
Finalized
Archived
```

---

## 16. Business Rules to Enforce

### Applicant

```txt
Can edit only draft submissions.
Can edit affected sections after compliance directive.
Cannot edit after final submission unless directive is issued.
Cannot upload dossier documents.
Must complete required checklist fields before submission.
Must complete certification before submission.
```

### Section B

```txt
Applicants fill only “Name of document and location”.
No dossier upload fields.
Item 5 is required if reference product is not same as WHO comparator.
Item 6 is required if biowaiver of additional strength is applicable.
Item 16 is optional unless literature references are used.
```

### Admin

```txt
Can issue compliance directive only during screening/resubmission review.
Cannot assign assessor while an open compliance directive exists.
Can classify product after satisfactory screening.
Can assign first assessor only after classification.
Can assign second assessor after first assessment is reverted.
Can enter final decision after assessment is reverted/completed.
```

### Assessor

```txt
Can only access assigned applications.
Must upload .doc or .docx report before submitting assessment.
Must write typed comment before submitting assessment.
Must select recommendation before submitting assessment.
Cannot directly issue compliance directive to applicant.
Cannot make final decision.
```

### Super Admin

```txt
Can manage users.
Can manage lookup lists.
Can reopen finalized application with reason.
All overrides must be audit logged.
```

---

## 17. Cloudinary Upload Rules

Use Cloudinary only for assessor report upload.

Allowed extensions:

```txt
.doc
.docx
```

Reject:

```txt
.pdf
.jpg
.png
.xlsx
.exe
.zip
```

unless later changed by requirement.

Store:

```txt
file_name
file_url
cloudinary_public_id
file_mime_type
file_size
uploaded_at
uploaded_by
assessment_stage
assessor_assignment_id
```

After assessor submits/reverts assessment, uploaded report should be locked.

Assessor may replace report before final submission.

---

## 18. Audit Trail

Log all major events:

```txt
Applicant registered
Checklist draft created
Checklist submitted
Checklist edited
Compliance directive issued
Applicant responded to directive
Screening started
Screening note added
Product classified
First assessor assigned
Second assessor assigned
Assessor started review
Assessor report uploaded
Assessor comment submitted
Assessment reverted/submitted
Final decision entered
Application finalized
Application reopened
Lookup item created/updated
User role changed
Application archived
```

Audit log should store:

```txt
user_id
user_role
action
entity_type
entity_id
old_value
new_value
ip_address
user_agent
created_at
```

---

## 19. Notifications

Implement in-app notifications.

Notify Applicant when:

```txt
Application submitted successfully
Compliance directive issued
Correction accepted
Final decision available, if allowed
```

Notify Admin when:

```txt
New application submitted
Applicant responds to compliance directive
Assessor submits report
Application is awaiting final decision
```

Notify Assessor when:

```txt
Application assigned
Due date approaches, optional
Assignment reassigned
```

---

## 20. Backend Folder Structure

Use this suggested Express structure:

```txt
server/
  src/
    app.js
    server.js

    config/
      cloudinary.js
      prisma.js

    middleware/
      auth.middleware.js
      role.middleware.js
      error.middleware.js
      upload.middleware.js
      audit.middleware.js

    modules/
      auth/
        auth.routes.js
        auth.controller.js
        auth.service.js
        auth.validation.js

      users/
        users.routes.js
        users.controller.js
        users.service.js

      applications/
        applications.routes.js
        applications.controller.js
        applications.service.js

      checklist/
        checklist.routes.js
        checklist.controller.js
        checklist.service.js

      complianceDirectives/
        compliance.routes.js
        compliance.controller.js
        compliance.service.js

      classification/
        classification.routes.js
        classification.controller.js
        classification.service.js

      assignments/
        assignments.routes.js
        assignments.controller.js
        assignments.service.js

      assessorReports/
        reports.routes.js
        reports.controller.js
        reports.service.js

      finalDecision/
        decision.routes.js
        decision.controller.js
        decision.service.js

      lookups/
        lookups.routes.js
        lookups.controller.js
        lookups.service.js

      notifications/
        notifications.routes.js
        notifications.controller.js
        notifications.service.js

      auditLogs/
        audit.routes.js
        audit.controller.js
        audit.service.js

      exports/
        exports.routes.js
        exports.controller.js
        exports.service.js

    prisma/
      schema.prisma
      seed.js
```

---

## 21. Required Middleware

Implement:

```txt
authenticateJWT
authorizeRoles(...roles)
validateRequest(schema)
checkApplicationAccess
checkAssignmentAccess
uploadWordReport
auditLogger
errorHandler
```

---

## 22. Environment Variables

Use:

```env
DATABASE_URL=

JWT_SECRET=
JWT_EXPIRES_IN=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

PORT=5000
NODE_ENV=development
```

---

## 23. Implementation Order

Build in this order:

```txt
1. Initialize Express server
2. Configure Prisma + PostgreSQL
3. Create Prisma schema and migrations
4. Implement auth and roles
5. Implement user management
6. Implement application draft creation
7. Implement checklist models and endpoints
8. Seed checklist default rows: study periods, BE summary rows, Section B rows
9. Implement applicant submission validation
10. Implement admin screening
11. Implement compliance directives and applicant response
12. Implement lookup model and seed/import system
13. Implement product classification
14. Implement assessor assignment
15. Implement Cloudinary raw upload for assessor Word reports
16. Implement assessor comments and recommendations
17. Implement final decision
18. Implement registry table
19. Implement reports/export
20. Implement notifications
21. Implement audit logs
22. Build Angular frontend pages by role
23. Connect frontend to backend
24. Add guards, interceptors, and role-based menus
25. Test complete workflow end-to-end
```

---

## 24. Critical Non-Negotiable Requirements

```txt
1. The applicant checklist must follow the official NAFDAC checklist structure strictly.
2. Applicants must not upload dossier documents.
3. Section B must capture only the name and location of documents in the dossier.
4. Compliance Directive must be distinct from final decision CD.
5. Assessors must upload Word reports in .doc or .docx format.
6. Assessors must also write typed comments inside the system.
7. First assessor and second assessor reports must be stored separately.
8. Product classification must use searchable lookup/dropdown lists.
9. The registry must reproduce the Excel tracking table.
10. All major workflow actions must be audit logged.
11. Role-based access control must be enforced on both frontend and backend.
12. Finalized applications must be read-only except when reopened by Super Admin with reason.
```

---

## 25. Recommended First Codex Task

Start with the backend first.

Ask Codex to build:

```txt
1. Express project setup
2. Prisma schema
3. PostgreSQL connection
4. Auth system
5. Role-based access middleware
6. Core application/checklist models
7. Checklist default seed logic
8. Applicant draft and submission endpoints
```

Do not start with the Angular frontend until the backend schema and core endpoints are stable.
