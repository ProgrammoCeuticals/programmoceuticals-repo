# RIMS --- Research Institute Management System

## Product Requirements, Architecture and Engineering Kickoff Specification

**Document version:** 1.0\
**Status:** Engineering baseline --- proposed product\
**Product owner / presenting company:** ProgrammoCeuticals\
**Prospective pilot institution:** Mega Harvest Research Institute\
**Commercial model:** Hybrid SaaS\
**Product category:** Multi-tenant research-institute management
platform\
**Document purpose:** Give Kiro a sufficiently detailed,
implementation-oriented baseline to scaffold and begin building RIMS.

------------------------------------------------------------------------

# 1. Executive Summary

RIMS (Research Institute Management System) is a configurable
institutional management platform for research organisations. It is
intended to help institutions manage their people, organisational
structure, research portfolio, projects, tasks, performance,
publications, budgets, quality processes, documents, reports and
operational workflows through one integrated system.

RIMS is a **commercial product developed and presented by
ProgrammoCeuticals**. Mega Harvest Research Institute is the proposed
first pilot institution and prospective customer. RIMS must not be
hardcoded around Mega Harvest's structure, terminology, staff, workflows
or policies. It must be configurable so that other research institutes
can adopt the same product with their own organisational structures and
operating practices.

The commercial model is **hybrid**:

1.  **Shared SaaS:** multiple institutions use the same application
    deployment, with strong tenant isolation and independent
    institutional workspaces.
2.  **Dedicated deployment:** an institution can receive a separately
    deployed environment, database and storage configuration while using
    the same product codebase and release process.

The first implementation should be a secure, maintainable **modular
monolith**, not microservices. The initial release should prioritise the
platform foundation, institutional administration, identity and access
management, departments and teams, employee records, research/project
operations, configurable performance management, dashboards, reporting
and auditability. Additional modules should be introduced in later
phases.

This document is an engineering baseline. It contains product
requirements, functional scope, domain concepts, architecture, data
model guidance, API conventions, security requirements, user journeys,
acceptance criteria and a phased implementation plan. Where a detail is
not yet decided, it is explicitly marked as an assumption or open
decision. Kiro should not silently invent business policies or claim
that proposed functionality is already deployed.

------------------------------------------------------------------------

# 2. Product Identity and Positioning

## 2.1 Product identity

-   **Product name:** RIMS
-   **Full name:** Research Institute Management System
-   **Tagline:** One Platform. Complete Institutional Visibility.
-   **Product owner / presenting company:** ProgrammoCeuticals
-   **Prospective pilot:** Mega Harvest Research Institute
-   **Product type:** Configurable institutional management platform for
    research organisations.

Use the wording **"A ProgrammoCeuticals Product"** in product branding
and application mock-ups where appropriate.

## 2.2 Positioning

RIMS is not merely a research project tracker. It is an institutional
operations and performance management platform that connects:

-   People and organisational structure.
-   Research projects and research activities.
-   Projects, tasks, milestones and deliverables.
-   Individual, team, departmental and institutional performance.
-   Publications and research outputs.
-   Budgets and resource oversight.
-   Quality assurance and controlled documentation.
-   Management reporting and operational intelligence.

## 2.3 Product vision

Enable research institutions to operate in a more coordinated,
accountable and data-informed manner by providing a configurable digital
environment for managing institutional activities and measuring
outcomes.

## 2.4 Core product principles

1.  **Configurable, not bespoke:** institutions configure structures and
    policies without requiring a custom code fork.
2.  **Tenant isolation by design:** one institution must never access
    another institution's data.
3.  **Evidence-based performance:** metrics must be traceable to
    submitted and approved evidence.
4.  **Role-appropriate visibility:** users see the information necessary
    for their responsibilities.
5.  **Modular capability:** modules can be enabled or disabled by
    subscription and institutional configuration.
6.  **Auditability:** important changes and approvals must be traceable.
7.  **Human oversight:** automated calculations and AI-assisted
    summaries must not replace accountable human decisions.
8.  **Incremental delivery:** each release must provide usable
    functionality.
9.  **Product consistency:** shared SaaS and dedicated deployments use
    the same codebase.
10. **Data portability:** institutions should be able to export their
    records in documented formats, subject to permissions and
    contractual terms.

------------------------------------------------------------------------

# 3. Goals, Non-Goals and Success Measures

## 3.1 Product goals

RIMS should:

-   Centralise core institutional records and operations.
-   Provide visibility into institutional, departmental, team and
    individual performance.
-   Manage research projects from proposal/registration through
    execution and closure.
-   Track project responsibilities, milestones, tasks, risks and
    deliverables.
-   Support configurable KPI definitions, targets, weightings and review
    cycles.
-   Reduce manual consolidation of institutional reports.
-   Support publication and research-output tracking.
-   Provide institutional budget oversight without initially replacing a
    full accounting system.
-   Support quality reviews, findings, corrective actions and controlled
    documents.
-   Support shared SaaS and dedicated deployment models.
-   Provide a foundation for future integrations and advanced analytics.

## 3.2 Non-goals for the first release

Do not attempt to build these as part of the first MVP:

-   Full Laboratory Information Management System (LIMS).
-   Electronic Data Capture (EDC) for clinical trials.
-   Full electronic health records system.
-   Full accounting ERP or statutory accounting package.
-   Full journal publishing platform.
-   Full reference-management product.
-   Scientific word processor or AI scientific-writing engine.
-   Native iOS and Android applications.
-   Predictive AI scoring of employees.
-   Automated regulatory or ethics approval.
-   A claim of compliance with a particular regulatory framework without
    a separate assessment.

These may be considered as later integrations or product extensions.

## 3.3 Product success measures

The pilot should establish baseline measurements before claiming
improvements. Candidate measures include:

-   Percentage of departments onboarded.
-   Percentage of active users completing onboarding.
-   Monthly active users by role.
-   Percentage of projects with current status updates.
-   Percentage of tasks completed by their due dates.
-   Percentage of performance reviews completed on schedule.
-   Time required to prepare a monthly institutional report.
-   Percentage of research projects with current milestone records.
-   Percentage of documents with correct ownership and access controls.
-   Number of unresolved critical security or data-isolation defects.

Do not invent target values. Establish baselines and agree targets with
the pilot institution.

------------------------------------------------------------------------

# 4. Target Customers and Stakeholders

## 4.1 Target customer segments

-   Independent research institutes.
-   Medical and public-health research organisations.
-   University research centres.
-   Pharmaceutical and biomedical research organisations.
-   Public-sector research institutions.
-   Research-focused NGOs and foundations.
-   Contract research and research-support organisations.

## 4.2 Stakeholders

  -----------------------------------------------------------------------
  Stakeholder                         Primary interest
  ----------------------------------- -----------------------------------
  Executive Director / CEO            Institutional overview, strategic
                                      objectives, risks and outcomes

  Research Director                   Research portfolio, project
                                      progress and research outputs

  Department Head                     Departmental objectives, staff,
                                      workload and delivery

  Principal Investigator              Research protocol, team, milestones
                                      and deliverables

  Project Manager / Coordinator       Project execution, tasks,
                                      dependencies and risks

  Researcher / Analyst                Assigned work, project records,
                                      deadlines and submissions

  HR Manager                          Employee records, recruitment and
                                      employment administration

  Finance Officer                     Budgets, funding and expenditure
                                      oversight

  Quality Officer                     Reviews, findings, corrective
                                      actions and document control

  Institution Administrator           Workspace configuration, users,
                                      roles and settings

  Platform Administrator              SaaS tenants, plans, entitlements
                                      and deployment administration

  Auditor                             Permitted read-only access to
                                      relevant records and audit evidence
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 5. Product Scope and Module Catalogue

RIMS is organised into the following proposed modules. The initial
implementation must not attempt to deliver every module at once.

## 5.1 Platform Foundation

Includes:

-   Tenant provisioning and resolution.
-   Institution profile and settings.
-   Authentication and session management.
-   User invitations and lifecycle.
-   Role-based access control (RBAC).
-   Permission and scope management.
-   Department and team configuration.
-   Audit events.
-   Module entitlements.
-   System health and operational configuration.

## 5.2 Institutional Administration

Requirements:

-   Create and update institution profile.
-   Configure institutional name, logo, contact details, timezone,
    locale and reporting period.
-   Configure organisational units, departments, research centres,
    laboratories and teams.
-   Support parent-child organisational structures.
-   Configure job titles, positions and designations.
-   Assign users/employees to organisational units.
-   Define reporting relationships.
-   Configure working days and institutional settings.
-   Archive rather than hard-delete organisational records that have
    historical references.
-   Support configurable labels where terminology differs between
    institutions.

A tenant may have one or more institutions or campuses in a future
release. The first release may implement one primary institution per
tenant while keeping the schema extensible.

## 5.3 User and Access Management

Requirements:

-   Invite users by email.
-   Accept invitation and set credentials.
-   Activate, suspend and deactivate users.
-   Support multiple roles per user where permitted.
-   Support role assignment at institution, department, team or project
    scope.
-   Support custom roles and permission assignment.
-   Support own-record, team, department and institution scopes.
-   Support password reset.
-   Support MFA for privileged accounts.
-   Support session revocation and logout from all sessions.
-   Record relevant authentication and administrative events.
-   Never rely on frontend visibility alone for access control.

## 5.4 Human Resource Management

Proposed requirements:

-   Employee profile and employee number.
-   Contact and emergency contact details, subject to institution
    policy.
-   Employment status and employment type.
-   Department and position.
-   Reporting manager.
-   Qualifications, certifications and professional experience.
-   Skills and areas of expertise.
-   Employment history.
-   Contract metadata and review/expiry dates.
-   Leave and absence records in a later phase.
-   Recruitment pipeline, candidate records and interview evaluations in
    a later phase.
-   Onboarding and offboarding checklists in a later phase.

Sensitive personal information must be minimised, protected and visible
only to authorised roles. Do not collect sensitive information without a
defined business need and retention policy.

## 5.5 Performance Management

This is a key differentiating module.

### Performance levels

-   Institutional.
-   Departmental.
-   Team.
-   Individual.

### Core concepts

-   Performance cycle: a defined review period, such as quarterly or
    annually.
-   Objective: a desired outcome aligned to a higher-level objective.
-   KPI: a measurable indicator used to assess an objective.
-   KPI assignment: an indicator assigned to a person, team or
    department for a cycle.
-   Target: expected value or state.
-   Actual result: submitted result for a period.
-   Evidence: supporting file, record, link or explanation.
-   Evaluation: supervisor or authorised reviewer assessment.
-   Improvement plan: actions agreed where performance needs
    improvement.

### KPI measurement types

Support at least:

1.  Numeric value.
2.  Percentage.
3.  Boolean / yes-no.
4.  Milestone completion.
5.  Rating scale.
6.  Date / time-based.
7.  Quality assessment.
8.  Custom measurement type as a later extension.

### KPI configuration

A KPI definition should include:

-   Name.
-   Description.
-   Category.
-   Measurement type.
-   Unit.
-   Calculation method where applicable.
-   Directionality: higher-is-better, lower-is-better, target-range or
    completion.
-   Default weight.
-   Optional target.
-   Evidence requirement.
-   Applicable organisational scope.
-   Active/inactive status.

### Performance cycle workflow

1.  Institution creates a performance cycle.
2.  Institution or department defines objectives.
3.  KPI definitions are selected or created.
4.  KPIs are assigned to employees, teams or departments.
5.  Targets and weights are configured.
6.  Employees submit results and supporting evidence.
7.  Supervisor reviews and comments.
8.  Authorised reviewer approves, rejects or requests revision.
9.  System calculates the configured score.
10. Results become available in permitted dashboards and reports.
11. Improvement plans may be recorded where appropriate.

### Performance calculation principles

-   KPI weights within a scorecard should total 100% or be explicitly
    normalised by a documented rule.
-   Missing results must not silently count as zero unless the
    institution's approved policy explicitly says so.
-   A KPI with no applicable result should be marked not assessed or
    incomplete, not silently treated as failure.
-   Scores must show their calculation method and source data.
-   Manual overrides require a reason, authorisation and audit event.
-   Institutions must configure scoring bands; do not hardcode universal
    labels such as "excellent" or "poor".
-   Performance data must account for role, workload, complexity,
    quality and timeliness. Avoid reducing employee value to raw task
    volume.
-   The application must distinguish draft, submitted, returned,
    approved and locked results.

Illustrative scorecard only:

  Indicator                    Weight
  -------------------------- --------
  Deliverable completion          30%
  Quality of work                 30%
  Timeliness                      20%
  Collaboration                   10%
  Professional development        10%
  Total                          100%

These are sample values, not a prescribed Mega Harvest policy.

## 5.6 Research Management

Requirements:

-   Register research proposals and projects.
-   Categorise by research area, discipline and methodology.
-   Record title, abstract/summary, objectives and research questions.
-   Assign principal investigator and co-investigators.
-   Assign research team members and roles.
-   Record protocols and supporting documents.
-   Record ethics approval status and reference metadata where
    applicable.
-   Record other required approvals as configurable fields.
-   Define milestones, deliverables and reporting dates.
-   Record progress updates and supporting evidence.
-   Track project status and closure.
-   Record outputs, manuscripts and publications.
-   Maintain an audit trail of significant changes.

Possible methodology categories include systematic review, scoping
review, meta-analysis, Delphi study, retrospective cohort,
cross-sectional, experimental, qualitative and mixed-methods research.
These must be configurable, not hardcoded as an exhaustive list.

RIMS is not an ethics committee system and must not imply that recording
an approval constitutes approval.

## 5.7 Project and Task Management

Requirements:

-   Create projects with owner, sponsor/funder metadata, start/end dates
    and status.
-   Assign team members and roles.
-   Create tasks and subtasks.
-   Assign one or more responsible users where appropriate.
-   Set priority, status, start date, due date and estimate.
-   Support task dependencies in a later iteration.
-   Create milestones and deliverables.
-   Support list and Kanban views initially.
-   Record comments and activity.
-   Attach permitted documents.
-   Track progress and overdue status.
-   Support project risks and issues in a later iteration.
-   Close or archive projects with closure summary.

Task status should be configurable at institution level, with sensible
defaults: Not Started, In Progress, Blocked, In Review, Completed and
Cancelled.

## 5.8 Department and Team Management

Requirements:

-   Create departments and teams.
-   Assign department heads and team leads.
-   Define membership and reporting relationships.
-   Define departmental objectives.
-   Aggregate permitted departmental KPIs.
-   View team workload and project allocation.
-   Submit departmental reports.
-   Compare departments only where the user has permission and the
    comparison is meaningful.

## 5.9 Publication and Manuscript Management

Later phase requirements:

-   Register manuscripts.
-   Record title, abstract, keywords and research project link.
-   Manage authors and contribution roles.
-   Record target journal and publisher.
-   Track submission date and manuscript status.
-   Track peer-review rounds and revision deadlines.
-   Record acceptance, rejection and publication dates.
-   Store DOI, URL, volume, issue and citation metadata.
-   Report publication outputs by department, researcher, project and
    period.

Suggested status flow: Draft, Internal Review, Ready for Submission,
Submitted, Under Review, Revision Required, Accepted, Rejected,
Published and Withdrawn. Institutions may configure additional statuses.

## 5.10 Finance and Budget Management

Later phase requirements:

-   Create funding sources and grants.
-   Allocate budgets to research projects.
-   Define budget categories.
-   Record approved budget and revisions.
-   Record expenditure entries.
-   Record transaction date, category, amount, currency, reference and
    supporting documents.
-   Calculate committed, spent and remaining amounts where the required
    data exists.
-   Support budget approval workflows.
-   Generate budget utilisation reports.

Scope boundary: this module provides project budget oversight and should
not be represented as a replacement for a full general ledger, payroll
or statutory accounting system in the initial release.

## 5.11 Quality Assurance and Compliance

Later phase requirements:

-   Create review templates and checklists.
-   Schedule internal reviews.
-   Record findings and non-conformances.
-   Assign corrective and preventive actions (CAPA).
-   Assign owners and due dates.
-   Track action status and evidence.
-   Record review and approval history.
-   Link findings to projects, documents or departments.
-   Generate quality reports.

Do not claim that the product automatically makes an institution
compliant with a law, standard or accreditation framework.

## 5.12 Document Management

Later phase requirements:

-   Upload and organise documents.
-   Support folders, categories, tags and metadata.
-   Link documents to projects, employees, manuscripts and quality
    records.
-   Apply access permissions.
-   Maintain document versions.
-   Record uploader, timestamps and version notes.
-   Support review and approval.
-   Support download and preview for approved file types.
-   Support retention and archival policies.
-   Scan uploaded files for malware before making them available.
-   Store files in object storage, not as database blobs by default.

## 5.13 Reports and Analytics

Requirements:

-   Executive overview.
-   Workforce reports.
-   Departmental performance reports.
-   KPI and performance-cycle reports.
-   Research portfolio reports.
-   Project progress reports.
-   Task and milestone reports.
-   Publication reports.
-   Budget reports in the relevant phase.
-   Quality reports in the relevant phase.
-   Date filters and organisational filters.
-   Permission-aware drill-down.
-   Export to CSV/XLSX and PDF as supported.
-   Clearly identify reporting period, data status and generation time.
-   Distinguish approved data from draft or unverified submissions.

## 5.14 Notifications and Workflow Automation

Requirements:

-   In-app notifications.
-   Email notifications.
-   Invitation notifications.
-   Assignment notifications.
-   Due-date reminders.
-   Overdue alerts.
-   Review and approval notifications.
-   Performance-cycle reminders.
-   Contract expiry alerts in the HR phase.
-   User notification preferences.
-   Configurable templates.
-   Background processing and retry handling.
-   Notification delivery status where feasible.

------------------------------------------------------------------------

# 6. Roles, Permissions and Access Scopes

## 6.1 Default role templates

-   Platform Super Administrator.
-   Institution Administrator.
-   Executive Director.
-   Research Director.
-   HR Manager.
-   Department Head.
-   Team Lead.
-   Project Manager.
-   Principal Investigator.
-   Researcher.
-   Finance Officer.
-   Quality Assurance Officer.
-   Auditor / Read-only Reviewer.

Institutions must be able to create custom roles.

## 6.2 Permission naming convention

Use resource-action permission keys, for example:

``` text
institution.view
institution.update
institution.settings.manage

users.view
users.invite
users.update
users.suspend

roles.view
roles.create
roles.update
roles.assign

departments.view
departments.create
departments.update
departments.archive

employees.view
employees.create
employees.update
employees.archive

performance.cycles.view
performance.cycles.manage
performance.kpis.configure
performance.results.submit
performance.results.review
performance.results.approve
performance.reports.view

research.projects.view
research.projects.create
research.projects.update
research.projects.approve
research.projects.close

projects.view
projects.create
projects.update
projects.assign
projects.close

tasks.view
tasks.create
tasks.update
tasks.assign
tasks.complete

reports.view
reports.export

audit.view
```

## 6.3 Access scopes

Permissions should be evaluated with scope:

-   Platform.
-   Institution.
-   Department.
-   Team.
-   Project.
-   Own record.

A role name alone must never be the sole authorisation mechanism.
Backend guards/policies must verify the requested action and resource
scope.

## 6.4 Separation of platform and tenant administration

Platform administrators manage the SaaS platform, tenant provisioning,
subscription entitlements and deployment metadata. They should not
automatically have unrestricted access to tenant business content during
ordinary operations.

Tenant administrators manage their own institution's users, roles,
settings and modules. They must never administer another tenant.

Any exceptional support access to tenant data should be explicitly
authorised, time-bound where possible, reason-recorded and audited.

------------------------------------------------------------------------

# 7. Hybrid SaaS and Deployment Architecture

## 7.1 Shared SaaS model

-   One application deployment serves multiple tenants.
-   Each tenant has a unique immutable tenant identifier.
-   Tenant-owned records are scoped to the tenant.
-   PostgreSQL is the primary relational database.
-   PostgreSQL Row-Level Security (RLS) is an additional isolation
    layer.
-   Application-level tenant resolution and authorisation are mandatory.
-   Tenant-specific configuration, branding and module entitlements are
    stored independently.
-   Shared application updates are centrally managed.

## 7.2 Dedicated deployment model

-   Separate application environment.
-   Separate database instance or cluster.
-   Separate object-storage bucket/account or equivalent isolation.
-   Dedicated domain and TLS configuration.
-   Institution-specific configuration and integrations.
-   Independent backup and recovery policy.
-   Same product codebase and release process.

## 7.3 Architecture constraint

Do not maintain separate codebases for SaaS and dedicated deployments.
Use environment configuration, deployment profiles and tenant/deployment
configuration.

## 7.4 Tenant resolution

For SaaS, resolve the tenant using a verified mechanism such as the
authenticated user's tenant membership and a validated
hostname/subdomain mapping. Never trust a raw `tenant_id` supplied by
the browser as proof of access.

For every request:

1.  Authenticate the user.
2.  Resolve the tenant context.
3.  Verify the user's membership in that tenant.
4.  Authorise the requested action and resource scope.
5.  Execute tenant-scoped data access.
6.  Record relevant audit events.

Background jobs must carry an explicit, verified tenant context. Never
run a tenant-owned job without its tenant identity.

------------------------------------------------------------------------

# 8. Recommended Technical Stack

Use the following baseline unless a repository constraint requires a
documented change.

  Layer                   Recommendation
  ----------------------- -----------------------------------------------------
  Frontend                React + TypeScript
  Build tool              Vite
  Styling                 Tailwind CSS
  Component primitives    Accessible, reusable component library
  Forms                   React Hook Form + schema validation
  Client data fetching    TanStack Query
  Backend                 NestJS + TypeScript
  API style               REST, versioned under `/api/v1`
  Database                PostgreSQL
  ORM                     Prisma
  Cache / queue backend   Redis
  Background jobs         BullMQ
  File storage            S3-compatible object storage
  API documentation       OpenAPI / Swagger
  Unit tests              Jest or Vitest as appropriate
  API integration tests   Jest / Supertest
  Browser E2E tests       Playwright
  Containers              Docker
  Reverse proxy           Nginx or managed ingress
  Monitoring              Structured logs and error monitoring
  CI                      Automated lint, type-check, test and build pipeline

Do not add technologies merely for fashion. Keep the initial
architecture operationally simple.

## 8.1 Architectural style

Use a **modular monolith**:

-   One deployable backend application initially.
-   Clear domain modules.
-   Explicit module boundaries.
-   Shared infrastructure services.
-   Domain/application services for cross-module use cases.
-   Database transactions for consistency.
-   Domain events or an internal event bus for decoupled side effects.
-   Background workers for asynchronous tasks.
-   No direct cross-module database manipulation where a module service
    or defined interface should be used.

Microservices may be considered only when demonstrated scaling,
ownership or deployment needs justify the operational complexity.

------------------------------------------------------------------------

# 9. Proposed Repository Structure

A monorepo is recommended for coordinated frontend and backend
development.

``` text
rims/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── modules/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── stores/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   └── ...
│   ├── api/
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── tenants/
│   │   │   │   ├── institutions/
│   │   │   │   ├── users/
│   │   │   │   ├── roles/
│   │   │   │   ├── permissions/
│   │   │   │   ├── departments/
│   │   │   │   ├── teams/
│   │   │   │   ├── employees/
│   │   │   │   ├── performance/
│   │   │   │   ├── research/
│   │   │   │   ├── projects/
│   │   │   │   ├── tasks/
│   │   │   │   ├── reports/
│   │   │   │   ├── notifications/
│   │   │   │   ├── audit/
│   │   │   │   └── subscriptions/
│   │   │   ├── common/
│   │   │   ├── database/
│   │   │   ├── config/
│   │   │   └── main.ts
│   │   └── ...
│   └── worker/
│       └── src/
├── packages/
│   ├── shared-types/
│   ├── validation/
│   ├── api-client/
│   ├── ui/
│   └── config/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed/
├── docs/
│   ├── product/
│   ├── architecture/
│   ├── api/
│   ├── database/
│   ├── security/
│   └── decisions/
├── infra/
│   ├── docker/
│   ├── nginx/
│   └── deployment/
├── .env.example
├── docker-compose.yml
├── package.json
└── README.md
```

This is a proposed structure. Kiro should inspect the existing workspace
before creating or overwriting files. If a repository already exists,
preserve valid conventions and document deviations.

------------------------------------------------------------------------

# 10. Database Design Baseline

The database is PostgreSQL. Use UUID primary keys unless there is a
documented reason otherwise. Use UTC timestamps in storage and render in
the institution's configured timezone.

All tenant-owned records must include `tenant_id` directly or have an
enforceable tenant relationship through their parent. For high-risk or
frequently queried tenant-owned tables, prefer a direct `tenant_id`
column to make isolation and indexing explicit.

## 10.1 Core entities

### Tenancy and commercial platform

-   `tenants`
-   `tenant_domains`
-   `tenant_settings`
-   `tenant_module_entitlements`
-   `subscription_plans`
-   `subscriptions`
-   `deployment_records` (platform-level metadata; do not expose
    secrets)

### Identity and access

-   `users`
-   `user_tenant_memberships`
-   `sessions` or refresh-token records
-   `roles`
-   `permissions`
-   `role_permissions`
-   `user_role_assignments`
-   `invitations`
-   `mfa_methods` (where implemented)

### Institution and organisation

-   `institutions`
-   `departments`
-   `teams`
-   `positions`
-   `employee_department_assignments`
-   `reporting_relationships`

### Human resources

-   `employees`
-   `employee_qualifications`
-   `employee_certifications`
-   `employee_skills`
-   `employment_records`
-   `recruitment_candidates` (later phase)
-   `interviews` (later phase)

### Performance

-   `performance_cycles`
-   `strategic_objectives`
-   `performance_objectives`
-   `kpi_definitions`
-   `kpi_assignments`
-   `kpi_results`
-   `performance_evaluations`
-   `performance_evidence`
-   `improvement_plans`

### Research and projects

-   `research_projects`
-   `research_project_members`
-   `research_protocols`
-   `research_approvals`
-   `project_milestones`
-   `project_deliverables`
-   `project_tasks`
-   `task_assignments`
-   `task_comments`
-   `project_status_updates`
-   `project_risks` (later phase)

### Publications

-   `manuscripts`
-   `manuscript_authors`
-   `manuscript_reviews`
-   `publications`

### Finance

-   `funding_sources`
-   `project_budgets`
-   `budget_categories`
-   `expenses`
-   `budget_approvals`

### Quality

-   `quality_templates`
-   `quality_reviews`
-   `quality_findings`
-   `corrective_actions`

### Documents

-   `documents`
-   `document_versions`
-   `document_folders`
-   `document_permissions`
-   `document_links`

### Reporting and platform operations

-   `report_definitions`
-   `report_runs`
-   `notifications`
-   `notification_preferences`
-   `workflow_definitions`
-   `workflow_instances`
-   `audit_events`
-   `integration_connections` (future)
-   `webhook_deliveries` (future)

## 10.2 Key relationships

-   A tenant has one or more institution records, with one primary
    institution for the MVP.
-   A tenant has users through tenant memberships.
-   A user can belong to more than one tenant in future, but each
    request must resolve one active tenant context.
-   An institution has departments.
-   Departments can have parent departments and teams.
-   Employees are linked to user accounts where the employee requires
    system access; an employee record may exist without a login.
-   Users receive roles through scoped role assignments.
-   Roles contain permissions.
-   Research projects belong to a tenant and institution and can have
    many members, milestones, tasks, documents and outputs.
-   KPI assignments link a KPI definition to a target subject (employee,
    team, department or institution) and performance cycle.
-   KPI results belong to an assignment and include value, evidence and
    review status.
-   Manuscripts may be linked to research projects and authors.
-   Project budgets have expense records.
-   Documents can be linked to multiple domain records through a
    controlled linking model.

## 10.3 Database implementation requirements

-   Define foreign keys and referential actions intentionally.
-   Add indexes for tenant ID, status, date, owner and common filter
    combinations.
-   Add unique constraints scoped to tenant where appropriate, such as
    employee number or department code.
-   Use soft archive/deactivation where historical references must
    remain.
-   Avoid storing calculated aggregates as the only source of truth.
-   Store money as decimal/numeric, never floating point.
-   Store currency code with monetary values.
-   Store dates/times with clear semantics; use `timestamptz` for
    instants and `date` for calendar dates.
-   Use explicit status enums or validated lookup/configuration tables
    based on whether values need institution-level customisation.
-   Record created/updated metadata.
-   Add `created_by` and `updated_by` where useful for accountability.
-   Use optimistic concurrency/version fields for important records
    where concurrent edits are possible.
-   Do not use a generic untyped JSON blob as a substitute for core
    relational entities.
-   JSONB may be used for extensible configuration and snapshots with
    schema validation.

## 10.4 Tenant isolation

Implement multiple layers:

1.  Authenticated tenant membership.
2.  Server-side tenant context.
3.  Tenant-scoped service/repository queries.
4.  PostgreSQL RLS policies for tenant-owned tables.
5.  Tenant-aware background jobs.
6.  Cross-tenant negative tests.
7.  Separate database credentials/instances for dedicated deployments.

For RLS, use a transaction-scoped tenant setting and ensure
connection-pool behaviour cannot leak tenant context between requests.
Application roles must not have a bypass-RLS privilege. Migration/owner
roles must be separate from runtime roles. Document how administrative
jobs operate safely.

------------------------------------------------------------------------

# 11. API Architecture and Conventions

Use REST APIs under `/api/v1`.

## 11.1 Proposed endpoint groups

``` text
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password

GET    /api/v1/me
GET    /api/v1/tenants/current

GET    /api/v1/institution
PATCH  /api/v1/institution

GET    /api/v1/departments
POST   /api/v1/departments
GET    /api/v1/departments/:id
PATCH  /api/v1/departments/:id
POST   /api/v1/departments/:id/archive

GET    /api/v1/teams
POST   /api/v1/teams

GET    /api/v1/users
POST   /api/v1/users/invitations
GET    /api/v1/roles
POST   /api/v1/roles
PATCH  /api/v1/roles/:id

GET    /api/v1/employees
POST   /api/v1/employees
GET    /api/v1/employees/:id
PATCH  /api/v1/employees/:id

GET    /api/v1/performance/cycles
POST   /api/v1/performance/cycles
GET    /api/v1/performance/kpis
POST   /api/v1/performance/kpis
POST   /api/v1/performance/assignments
POST   /api/v1/performance/results
POST   /api/v1/performance/results/:id/submit
POST   /api/v1/performance/results/:id/review
POST   /api/v1/performance/results/:id/approve

GET    /api/v1/research/projects
POST   /api/v1/research/projects
GET    /api/v1/research/projects/:id
PATCH  /api/v1/research/projects/:id

GET    /api/v1/projects
POST   /api/v1/projects
GET    /api/v1/projects/:id
PATCH  /api/v1/projects/:id

GET    /api/v1/tasks
POST   /api/v1/tasks
PATCH  /api/v1/tasks/:id

GET    /api/v1/reports/executive-overview
GET    /api/v1/reports/performance
GET    /api/v1/reports/research
GET    /api/v1/audit-events
```

This is an endpoint baseline, not a demand to implement all routes in
the first sprint.

## 11.2 API conventions

-   Use DTOs and schema validation.
-   Use consistent response and error envelopes.
-   Support pagination, sorting and filtering.
-   Enforce permissions on every protected route.
-   Resolve tenant context on the server.
-   Do not accept a client tenant ID as an authorisation decision.
-   Document all endpoints with OpenAPI.
-   Use idempotency keys for operations where duplicate submission could
    cause harm.
-   Use transactions for multi-record state changes.
-   Use consistent status codes.
-   Avoid leaking internal exception details.
-   Version breaking API changes.
-   Provide request correlation IDs.

Suggested success response:

``` json
{
  "data": {},
  "meta": {
    "requestId": "request-id"
  }
}
```

Suggested error response:

``` json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The submitted data is invalid.",
    "details": [],
    "requestId": "request-id"
  }
}
```

Do not expose secrets, stack traces or cross-tenant existence
information in errors.

------------------------------------------------------------------------

# 12. Core Workflows

## 12.1 Institution onboarding

1.  Platform administrator provisions a tenant or an authorised
    self-service registration is completed.
2.  Institution profile and primary administrator are created.
3.  Tenant domain/subdomain is configured and verified.
4.  Default roles and permission templates are installed.
5.  Institution administrator configures departments, teams and
    positions.
6.  Administrator invites users.
7.  Users accept invitations and complete account setup.
8.  Institution enables subscribed modules.
9.  Administrator completes onboarding checklist.
10. Institution is ready for operational use.

## 12.2 Employee onboarding

1.  HR or authorised administrator creates an employee record.
2.  Employee is assigned to a department and position.
3.  Reporting manager is assigned.
4.  Relevant employment metadata is recorded.
5.  If system access is required, a user invitation is created.
6.  User accepts invitation and receives scoped permissions.
7.  Employee becomes available for project and performance assignments.

Employee record creation and user account creation must be separate
operations because not every employee necessarily needs platform access.

## 12.3 Research project workflow

1.  Research proposal/project is registered.
2.  Project owner and principal investigator are assigned.
3.  Required internal and ethics approval metadata is recorded.
4.  Project is approved by the institution's configured process.
5.  Team members are assigned.
6.  Milestones and deliverables are defined.
7.  Tasks are created and assigned.
8.  Team submits progress updates and evidence.
9.  Project manager/reviewer checks progress.
10. Risks, delays and changes are recorded.
11. Deliverables are reviewed.
12. Project is closed and outputs are recorded.

## 12.4 Performance workflow

1.  Institution creates a performance cycle.
2.  Objectives and KPI definitions are configured.
3.  KPI assignments and weights are created.
4.  Targets are agreed and published.
5.  Employees submit actual results and evidence.
6.  Supervisors review results.
7.  Results are approved, returned or rejected with reasons.
8.  Scores are calculated using configured rules.
9.  Authorised management views aggregated results.
10. Improvement plans and follow-up reviews are recorded where needed.
11. Cycle is locked after authorised approval.

## 12.5 Reporting workflow

1.  Source modules maintain operational records.
2.  Records are submitted and reviewed as required.
3.  Reporting services query authorised and appropriately validated
    data.
4.  Reports identify date range and data status.
5.  Users drill down only within their access scope.
6.  Export actions are permission-checked and audited.
7.  Scheduled reports are generated by background workers in a
    tenant-aware context.

------------------------------------------------------------------------

# 13. Dashboard Requirements

## 13.1 Executive dashboard

Proposed widgets:

-   Total employees.
-   Active departments.
-   Active research projects.
-   Projects by status.
-   Institutional KPI achievement.
-   Departmental performance comparison.
-   Projects approaching deadlines.
-   Overdue tasks.
-   Recent research outputs.
-   Pending approvals.
-   Key alerts and exceptions.

All widgets must be permission-aware and must show the relevant
reporting period.

## 13.2 Department head dashboard

-   Department headcount.
-   Team assignments.
-   Department objectives and KPI progress.
-   Active projects.
-   Task completion and overdue work.
-   Pending reviews.
-   Upcoming milestones.
-   Recent departmental activity.

## 13.3 Research director dashboard

-   Research portfolio by status.
-   Projects by methodology or research area.
-   Project milestone progress.
-   Ethics/approval status metadata.
-   Research deliverables.
-   Manuscript and publication pipeline.
-   Projects at risk.
-   Research team allocation.

## 13.4 Researcher dashboard

-   Assigned projects.
-   Assigned tasks.
-   Upcoming deadlines.
-   Milestones and deliverables.
-   Requests for review or revision.
-   Performance-cycle status.
-   Recent notifications.

## 13.5 Dashboard data rules

-   Label sample data as illustrative in prototypes.
-   Do not show invented institutional statistics as real.
-   Show empty states where no records exist.
-   Do not interpret missing data as zero performance.
-   Identify whether data is draft, submitted, approved or verified.
-   Support date-range filtering.
-   Respect tenant, department, team and project access scopes.

------------------------------------------------------------------------

# 14. UX and Design System Requirements

## 14.1 Brand

-   Product: RIMS.
-   Product signature: A ProgrammoCeuticals Product.
-   Presenting company: ProgrammoCeuticals.
-   Proposed pilot: Mega Harvest Research Institute.

Use a professional enterprise software aesthetic. The visual direction
may use ProgrammoCeuticals' blue-and-white brand foundation, supported
by navy, neutral grey and restrained teal/emerald accents. Do not invent
or alter an official logo asset. If no approved logo is supplied, use a
clean text-based wordmark placeholder that can be replaced.

## 14.2 UX principles

-   Role-oriented navigation.
-   Clear module boundaries.
-   Consistent page layouts.
-   Search, filters and pagination for large tables.
-   Accessible forms with useful validation.
-   Helpful empty states and onboarding guidance.
-   Confirmation for destructive or high-impact actions.
-   Clear status labels.
-   Responsive desktop and tablet layouts; mobile-friendly core tasks.
-   WCAG 2.2 AA as a design target.
-   Avoid overwhelming researchers with administrative controls they do
    not need.

## 14.3 Main application navigation

Proposed primary navigation:

-   Overview
-   Organisation
-   People
-   Research
-   Projects & Tasks
-   Performance
-   Publications
-   Finance
-   Quality
-   Documents
-   Reports & Analytics
-   Notifications
-   Administration / Settings

Only show modules enabled for the tenant and permitted for the user.

## 14.4 Required shared UI components

-   Application shell and sidebar.
-   Top navigation and tenant switcher where applicable.
-   Breadcrumbs.
-   KPI cards.
-   Data tables.
-   Search and filter controls.
-   Status badges.
-   Date-range controls.
-   Charts.
-   Profile and avatar components.
-   Forms and validation.
-   Modal and confirmation dialogs.
-   File upload component.
-   Activity timeline.
-   Approval action panel.
-   Empty, loading and error states.
-   Notification centre.

------------------------------------------------------------------------

# 15. Security, Privacy and Audit Requirements

Security must be implemented from the beginning, not deferred until
deployment.

## 15.1 Authentication

-   Use Argon2id for password hashing.
-   Use short-lived access tokens and secure refresh-token rotation, or
    a secure server-side session architecture.
-   Store refresh credentials in secure, HttpOnly, SameSite cookies
    where compatible with the chosen deployment.
-   Apply CSRF protection when cookie-based authentication requires it.
-   Rate-limit login, password reset and invitation endpoints.
-   Provide secure password reset tokens with expiry and single-use
    semantics.
-   Support MFA for privileged roles.
-   Allow session revocation.
-   Never log passwords, access tokens, refresh tokens or secrets.

## 15.2 Authorisation

-   Enforce RBAC and scope checks in the backend.
-   Use deny-by-default policy.
-   Validate tenant membership on every request.
-   Validate access to the specific resource, not merely the route.
-   Protect exports and file downloads.
-   Protect background jobs and scheduled reports.
-   Test horizontal and vertical privilege escalation.

## 15.3 Tenant isolation

-   Apply application-level tenant scoping.
-   Apply PostgreSQL RLS to tenant-owned tables.
-   Use a safe transaction-scoped tenant setting.
-   Ensure pooled connections do not retain tenant state.
-   Ensure runtime database roles cannot bypass RLS.
-   Add automated tests attempting cross-tenant reads and writes.
-   Keep platform support access separate and audited.
-   Never expose tenant identifiers or records through predictable
    public references without authorisation.

## 15.4 Data protection

-   TLS in transit.
-   Encryption at rest for database backups and object storage.
-   Secrets stored in a secret manager or protected environment
    configuration.
-   Data minimisation.
-   Configurable retention and archival.
-   Documented export and deletion procedures.
-   Access restrictions for employment, financial and research records.
-   Backup restoration testing.
-   Incident response procedure.

## 15.5 Audit events

Audit important actions, including:

-   Login and failed login events where appropriate.
-   User invitation, activation and suspension.
-   Role and permission changes.
-   Employee record changes.
-   Project creation, status changes and closure.
-   KPI assignment and target changes.
-   Performance result submission, review and approval.
-   Budget and expense changes.
-   Document upload, version and access changes.
-   Administrative settings changes.
-   Export of sensitive records.
-   Exceptional support access.

Audit records should include actor, tenant, action, resource type,
resource ID, timestamp, outcome and appropriate before/after metadata.
Do not store secrets or unnecessary sensitive values in audit payloads.
Audit events should be append-only to ordinary application users.

------------------------------------------------------------------------

# 16. Non-Functional Requirements

  -----------------------------------------------------------------------
  Area                                Baseline requirement
  ----------------------------------- -----------------------------------
  Availability                        Initial target 99.5% monthly for
                                      production SaaS, subject to hosting
                                      and support agreement

  API performance                     Common read/write operations target
                                      under 500 ms at p95 under normal
                                      expected load, excluding large
                                      exports and external services

  Scalability                         Stateless application processes
                                      where possible; horizontal scaling
                                      supported

  Security                            Secure development practices and
                                      OWASP-aligned testing

  Tenant isolation                    No cross-tenant data access

  Accessibility                       WCAG 2.2 AA target

  Browser support                     Current major desktop and mobile
                                      browsers

  Observability                       Structured logs, metrics, traces
                                      where feasible, correlation IDs

  Backup                              Automated encrypted backups with
                                      documented retention

  Recovery                            Defined RPO/RTO agreed before
                                      production launch

  Maintainability                     Modular architecture, automated
                                      tests, documented decisions

  Portability                         Documented export mechanisms

  Internationalisation                Timezone, locale and currency
                                      configuration per institution where
                                      applicable
  -----------------------------------------------------------------------

The availability and performance figures are initial engineering
targets, not guarantees until infrastructure and load testing validate
them.

------------------------------------------------------------------------

# 17. Reporting and KPI Calculation Design

## 17.1 Data provenance

Every reported result should be traceable to:

-   Source module.
-   Reporting period.
-   Record status.
-   Submission author.
-   Reviewer/approver where applicable.
-   Calculation method.
-   Generation timestamp.

## 17.2 Aggregation rules

-   Do not aggregate draft results into approved institutional scores
    unless the report explicitly labels them as draft.
-   Exclude non-applicable KPIs from denominators according to
    documented rules.
-   Handle missing values explicitly.
-   Support configurable weighting.
-   Store or reproduce the calculation version used for historical
    results.
-   Preserve historical scorecards when KPI definitions change.
-   Make manual adjustments auditable.
-   Avoid comparing departments with materially different KPI
    definitions without explaining the limitation.

## 17.3 Future analytics

Possible future capabilities:

-   Historical trends.
-   Workload distribution.
-   Project risk indicators.
-   Publication trends.
-   Budget variance.
-   Forecasting.
-   AI-assisted narrative summaries.

AI-generated summaries must cite the underlying platform data and
indicate uncertainty. AI must not make employment, disciplinary, funding
or scientific decisions autonomously.

------------------------------------------------------------------------

# 18. Notifications and Background Processing

Use Redis and BullMQ or an equivalent supported queue.

Background tasks may include:

-   Sending invitations.
-   Sending password-reset messages.
-   Sending due-date reminders.
-   Sending approval notifications.
-   Generating reports.
-   Processing uploaded files.
-   Malware scanning.
-   Scheduled performance-cycle reminders.
-   Scheduled contract expiry notifications.
-   Retrying transient delivery failures.

Requirements:

-   Jobs must be idempotent where possible.
-   Jobs must carry tenant context.
-   Retries must use bounded backoff.
-   Failed jobs must be observable.
-   Sensitive job payloads must not contain unnecessary personal data or
    credentials.
-   Email delivery provider should be configurable.
-   Do not make the entire application dependent on an email provider
    being available.

------------------------------------------------------------------------

# 19. File Storage and Document Handling

Use S3-compatible object storage.

-   Store object key and metadata in PostgreSQL.
-   Use private buckets by default.
-   Generate short-lived signed URLs after permission checks.
-   Validate file extension, MIME type and actual content where
    feasible.
-   Enforce configurable file-size limits.
-   Scan uploads for malware before making them available.
-   Store file checksum and size.
-   Record tenant and uploader.
-   Version documents rather than overwriting important records.
-   Avoid public object URLs for confidential files.
-   Define retention and deletion behaviour.

------------------------------------------------------------------------

# 20. Testing Strategy

Testing must be built into each phase.

## 20.1 Unit tests

Test:

-   KPI calculation rules.
-   Permission evaluation.
-   Tenant resolution.
-   Workflow transitions.
-   Validation rules.
-   Date and timezone handling.
-   Budget calculations.
-   Status transitions.

## 20.2 Integration tests

Test:

-   Authentication and refresh.
-   Tenant-aware database access.
-   RLS policies.
-   Role assignment.
-   Department and employee operations.
-   Project and task workflows.
-   Performance submission and approval.
-   Report data aggregation.
-   File permissions.
-   Background job tenant context.

## 20.3 End-to-end tests

At minimum:

1.  Institution administrator signs in.
2.  Administrator configures institution.
3.  Administrator creates department and team.
4.  Administrator invites a user.
5.  User accepts invitation.
6.  Administrator assigns a role.
7.  Manager creates a research project.
8.  Manager assigns project members.
9.  Manager creates milestones and tasks.
10. Researcher updates an assigned task.
11. Administrator configures a KPI.
12. Manager assigns KPI to an employee.
13. Employee submits a result and evidence.
14. Supervisor reviews and approves the result.
15. Executive dashboard displays the approved result.
16. Authorised user exports a report.
17. A user from a different tenant attempts access and is denied.

## 20.4 Security tests

Explicitly test:

-   Cross-tenant read attempts.
-   Cross-tenant write attempts.
-   Tenant ID tampering.
-   IDOR / insecure direct object reference.
-   Privilege escalation.
-   Role assignment abuse.
-   File URL access without permission.
-   Expired and revoked sessions.
-   CSRF where applicable.
-   Rate limiting.
-   SQL injection and unsafe query construction.
-   Sensitive data leakage through logs and errors.

## 20.5 Quality gates

A feature is not complete until:

-   Type checking passes.
-   Linting passes.
-   Relevant unit and integration tests pass.
-   Permission checks are tested.
-   Tenant isolation is tested for tenant-owned records.
-   API documentation is updated.
-   UI loading, empty and error states exist.
-   Audit events are added where required.
-   Acceptance criteria are met.

------------------------------------------------------------------------

# 21. Phased Delivery Roadmap

## Phase 0 --- Repository and Architecture Foundation

Deliverables:

-   Inspect and document current workspace.
-   Establish monorepo structure.
-   Configure TypeScript and linting.
-   Configure frontend and backend applications.
-   Configure local Docker development environment.
-   Configure PostgreSQL and Redis.
-   Configure Prisma and migration workflow.
-   Add environment validation.
-   Add health checks.
-   Add OpenAPI.
-   Add CI checks.
-   Record architecture decisions.

Exit criteria:

-   A developer can clone the repository, configure environment
    variables and run the application locally using documented steps.
-   Frontend and backend communicate successfully.
-   Database migrations run.
-   Automated checks run in CI.

## Phase 1 --- Platform Foundation and Institutional Administration

Deliverables:

-   Tenant model and tenant resolution.
-   Institution profile and settings.
-   Authentication and session management.
-   User invitations.
-   User memberships.
-   Roles and permissions.
-   Scope-aware authorisation.
-   Departments and teams.
-   Employee basic records.
-   Audit events.
-   Initial role-aware application shell.
-   Initial executive dashboard with real data and clear empty states.

Exit criteria:

-   Institution can be provisioned.
-   Institution administrator can configure departments and users.
-   Users see role-appropriate navigation.
-   Tenant-isolation tests pass.
-   Sensitive actions are audited.

## Phase 2 --- Core Operations and Performance

Deliverables:

-   Research project registration.
-   Project teams.
-   Milestones and deliverables.
-   Tasks and assignments.
-   Project progress updates.
-   KPI definitions.
-   Performance cycles.
-   KPI assignments.
-   Results and evidence.
-   Review and approval workflow.
-   Performance scorecards.
-   Departmental and executive reporting.
-   Notifications.

Exit criteria:

-   A complete research project workflow can be demonstrated.
-   A performance cycle can be configured and completed.
-   Approved data appears correctly in dashboards.
-   Calculations are reproducible and auditable.

## Phase 3 --- Institutional Operations Expansion

Deliverables:

-   Recruitment and onboarding.
-   Publication and manuscript management.
-   Finance and project budgets.
-   Quality reviews and CAPA.
-   Document management and versioning.
-   More advanced workflow configuration.
-   Additional reporting and exports.

## Phase 4 --- Commercialisation and Intelligence

Deliverables:

-   Subscription plans and entitlements.
-   Tenant provisioning automation.
-   Dedicated deployment automation and documentation.
-   Usage metering.
-   Advanced analytics.
-   AI-assisted reporting with source traceability.
-   Integration framework.
-   Operational monitoring and support tooling.
-   Data export and tenant offboarding processes.

------------------------------------------------------------------------

# 22. MVP Acceptance Criteria

The first usable institutional MVP must satisfy all critical criteria
below.

  -----------------------------------------------------------------------
  ID                                  Acceptance criterion
  ----------------------------------- -----------------------------------
  RIMS-001                            An authorised platform
                                      administrator can provision an
                                      institution tenant.

  RIMS-002                            An institution has its own profile,
                                      settings and workspace.

  RIMS-003                            An institution administrator can
                                      invite users.

  RIMS-004                            Users can authenticate and securely
                                      manage sessions.

  RIMS-005                            Institution administrators can
                                      create departments and teams.

  RIMS-006                            Users can receive roles and scoped
                                      permissions.

  RIMS-007                            Backend routes enforce permissions
                                      independently of frontend controls.

  RIMS-008                            Tenant A cannot read or modify
                                      Tenant B's records.

  RIMS-009                            Employee records can be created and
                                      assigned to departments.

  RIMS-010                            A manager can create a research
                                      project.

  RIMS-011                            Project members, milestones and
                                      deliverables can be managed.

  RIMS-012                            Tasks can be assigned and updated.

  RIMS-013                            An institution can configure a
                                      performance cycle.

  RIMS-014                            KPI definitions and assignments can
                                      be created.

  RIMS-015                            Employees can submit results and
                                      evidence.

  RIMS-016                            Supervisors can review and approve
                                      or return results.

  RIMS-017                            KPI scores follow configured
                                      calculation rules.

  RIMS-018                            Executive and departmental
                                      dashboards use authorised data.

  RIMS-019                            Reports can be filtered and
                                      exported by authorised users.

  RIMS-020                            Important actions are recorded in
                                      audit events.

  RIMS-021                            The application has usable loading,
                                      empty and error states.

  RIMS-022                            Setup, configuration, migration and
                                      deployment instructions are
                                      documented.
  -----------------------------------------------------------------------

A production pilot must additionally pass a security review, backup
restoration test and operational readiness review.

------------------------------------------------------------------------

# 23. Open Decisions and Assumptions

Kiro must not silently make irreversible product decisions for the
following items.

  --------------------------------------------------------------------------
  Topic                   Baseline assumption        Decision still required
  ----------------------- -------------------------- -----------------------
  Tenant structure        One primary institution    Whether multi-campus
                          per tenant in MVP          support is required at
                                                     launch

  Tenant identification   Verified                   Final domain strategy
                          hostname/subdomain plus    
                          membership                 

  Authentication          Email/password with secure Whether SSO is required
                          sessions                   for pilot

  Email                   Configurable provider      Provider and sender
                                                     domain

  File storage            S3-compatible              Provider and region

  Currency                Institution-configurable   Default currency for
                                                     pilot

  Timezone                Institution-configurable   Pilot timezone

  KPI scoring             Configurable weighted      Approved scoring policy
                          scoring                    

  Performance cycles      Configurable               Monthly, quarterly or
                                                     annual pilot cycle

  Research approvals      Store approval metadata    Exact approval workflow

  Data residency          Deployment-dependent       Pilot hosting
                                                     jurisdiction

  Retention               Configurable policy        Institutional retention
                                                     schedule

  Dedicated deployment    Separate infrastructure    Whether needed for
                                                     first pilot

  Subscription billing    Plans and entitlements     Payment provider and
                          model                      commercial pricing

  Branding                ProgrammoCeuticals product Final approved logo and
                          identity                   brand assets
  --------------------------------------------------------------------------

For the pilot, Nigeria-based timezone and currency settings may be
configured if confirmed by the institution. Do not hardcode them as
global product defaults.

------------------------------------------------------------------------

# 24. Kiro Implementation Instructions

You are acting as the senior engineer implementing RIMS from this
specification.

## 24.1 First actions

Before writing substantial code:

1.  Inspect the existing workspace and identify whether a project
    already exists.
2.  Read existing README files, package manifests, configuration and
    source code.
3.  Do not overwrite working code or configuration without understanding
    it.
4.  Create or update a concise implementation plan.
5.  Identify missing business decisions and record them in
    `docs/OPEN_DECISIONS.md`.
6.  Create architecture decision records in `docs/decisions/`.
7.  Establish the development environment and automated quality gates.
8.  Start with Phase 0, then Phase 1.

## 24.2 Engineering rules

-   Use TypeScript consistently.
-   Use strict type checking.
-   Keep controllers thin.
-   Put business rules in application/domain services.
-   Validate all external input.
-   Use database transactions for multi-step state changes.
-   Enforce tenant scope in the backend and database.
-   Do not trust client-supplied tenant IDs.
-   Do not rely on frontend hiding for security.
-   Do not hardcode Mega Harvest-specific departments, users, KPIs or
    workflows.
-   Do not create fake institutional metrics.
-   Use seed data only for clearly labelled local development/demo
    environments.
-   Never commit secrets.
-   Keep `.env.example` current.
-   Document schema and API decisions.
-   Use migrations for database changes.
-   Do not use destructive database resets against a shared or
    production database.
-   Add tests as features are implemented.
-   Do not claim a feature is complete unless it is implemented and
    tested.

## 24.3 Required project documentation

Maintain these files:

``` text
README.md
docs/PRODUCT_REQUIREMENTS.md
docs/ARCHITECTURE.md
docs/DATABASE_DESIGN.md
docs/API_SPECIFICATION.md
docs/SECURITY.md
docs/IMPLEMENTATION_PLAN.md
docs/OPEN_DECISIONS.md
docs/TESTING_STRATEGY.md
docs/decisions/
```

This specification should be saved as `docs/PRODUCT_REQUIREMENTS.md` or
retained as the master project brief, with the other documents created
and maintained as implementation progresses.

## 24.4 First implementation milestone

Implement a working foundation that includes:

-   React + TypeScript frontend.
-   NestJS + TypeScript API.
-   PostgreSQL and Prisma.
-   Redis connection and queue foundation where needed.
-   Docker Compose for local services.
-   Tenant and institution models.
-   Authentication.
-   User membership.
-   Roles and permissions.
-   Tenant-aware request context.
-   Department and team management.
-   Basic employee records.
-   Audit event foundation.
-   Responsive application shell.
-   Role-aware navigation.
-   Automated tests.

Do not start all 12 modules at once.

## 24.5 Required demonstration scenario

The first milestone should support this demonstration:

1.  ProgrammoCeuticals platform administrator provisions a demo
    institution.
2.  Institution administrator signs in.
3.  Institution administrator creates departments.
4.  Institution administrator invites a department head.
5.  Department head signs in and sees only authorised institutional
    information.
6.  Department head creates a research project.
7.  Department head assigns researchers and tasks.
8.  A researcher signs in and sees assigned work.
9.  Researcher updates task progress.
10. The project progress is visible to authorised management.
11. A second demo tenant is created.
12. A user from the first tenant attempts to access the second tenant's
    record and is denied.

Use fictional demo data with obvious labels. Do not represent demo data
as Mega Harvest's actual records.

------------------------------------------------------------------------

# 25. Definition of Done

A work item is complete only when:

-   The requirement is implemented.
-   Data validation is in place.
-   Permission checks are enforced server-side.
-   Tenant isolation is enforced and tested.
-   Relevant audit events are recorded.
-   Unit/integration tests pass.
-   UI loading, empty and error states are implemented where applicable.
-   API documentation is updated.
-   Database migrations are included.
-   User-facing labels and help text are understandable.
-   The feature is documented.
-   No known critical security defect remains.

------------------------------------------------------------------------

# 26. Final Product Direction

RIMS must be developed as a reusable commercial product by
ProgrammoCeuticals.

Mega Harvest Research Institute is the proposed pilot institution
through which the product can be demonstrated, evaluated and refined.
The long-term objective is to make RIMS suitable for adoption by
different research institutes without building a separate application
for each customer.

The first priority is not to build the largest possible feature set. It
is to establish a secure, configurable and reliable institutional
foundation, then progressively add research operations, performance
management, reporting and institutional intelligence.

**RIMS --- One Platform. Complete Institutional Visibility.**

**A ProgrammoCeuticals Product.**
