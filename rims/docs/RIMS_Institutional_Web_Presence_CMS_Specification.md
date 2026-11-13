# RIMS Institutional Web Presence & Content Management System (CMS)

## Standalone Product Requirements and Technical Specification

**Product:** Research Institute Management System (RIMS)\
**Module:** Institutional Web Presence & Content Management System\
**Product owner and developer:** ProgrammoCeuticals\
**Document version:** 1.0\
**Status:** Proposed specification

------------------------------------------------------------------------

## 1. Executive Summary

The Institutional Web Presence & Content Management System is an
integrated RIMS module that enables every institution using RIMS to
create, configure, manage and publish its own public-facing website from
within its private RIMS dashboard.

Each tenant receives an independently branded website. Authorised
institutional staff manage its identity, pages, navigation,
publications, research highlights, vacancies, volunteer opportunities,
news, events, resources, contact information and other public content
without routine developer intervention.

The CMS integrates with relevant RIMS modules so approved records can be
published without duplicate data entry. A controlled publishing workflow
ensures that internal or confidential information is never exposed
merely because it exists in RIMS.

The module must support both shared SaaS and dedicated deployments using
the same RIMS codebase.

### 1.1 Product positioning

Institutional Web Presence is the public communications and publishing
layer of RIMS. It is not a separate website product or generic hosting
service. It connects an institution's public-facing communications to
its internal research and administrative operations.

### 1.2 Value proposition

-   Give every RIMS institution a professional public website.
-   Allow authorised staff to manage it without coding.
-   Centralise institutional content and publishing.
-   Publish approved information from existing RIMS modules.
-   Support institution-specific branding, layouts, domains and content.
-   Provide public visibility into research, publications, opportunities
    and activities.
-   Maintain governance over what becomes public.

## 2. Goals and Non-Goals

### 2.1 Goals

1.  Provide each RIMS tenant with an independently configurable public
    website.
2.  Provide an authenticated CMS inside the institution's RIMS
    workspace.
3.  Support professionally designed templates.
4.  Support configurable pages, navigation and reusable content
    sections.
5.  Integrate with Publications, HR/Recruitment, Volunteer Management,
    Research, Events and Document Management.
6.  Implement draft, review, approval, scheduling, publication and
    withdrawal workflows.
7.  Support RIMS-managed subdomains and institution-owned custom
    domains.
8.  Provide SEO, accessibility, responsive design and privacy-conscious
    analytics.
9.  Enforce tenant isolation and role-based publishing permissions.
10. Allow future expansion into an advanced visual page builder.

### 2.2 Non-goals for the initial release

-   An unrestricted drag-and-drop website design environment.
-   Arbitrary user-written JavaScript, server-side code or CSS
    injection.
-   A full e-commerce platform.
-   A replacement for a complete applicant tracking system.
-   A research participant data collection or clinical trial management
    system.
-   A public social network or discussion forum.
-   A full marketing automation platform.
-   A domain registrar or email hosting service.
-   A replacement for institutional legal, ethics or privacy review.

## 3. Product and System Context

The module has two connected experiences and one platform-level
administration responsibility.

### 3.1 Public institutional website

A visitor-facing website accessible without a RIMS account. It presents
only content explicitly approved for public publication.

### 3.2 Private website administration

An authenticated area within the institution's RIMS dashboard.
Authorised staff configure the website, create content, review
submissions, approve publication, manage domains and review analytics.

### 3.3 ProgrammoCeuticals platform administration

Platform administrators manage: - Website template catalogue and global
component versions. - Tenant website provisioning. - Domain and
deployment configuration. - Platform-wide limits and feature
entitlements. - Operational monitoring.

Platform administrators must not automatically receive unrestricted
access to institutional private content. Exceptional support access must
be authorised and audited.

## 4. Users, Roles and Permissions

Reuse RIMS identity, authentication, tenant and permission
infrastructure. Do not introduce a separate user directory.

### 4.1 Institutional roles

  -----------------------------------------------------------------------
  Role                                Typical responsibility
  ----------------------------------- -----------------------------------
  Institution Administrator           Full institution website
                                      configuration

  Website Administrator               Manage website settings, pages,
                                      navigation, media and publishing

  Website Editor                      Edit assigned website content

  Content Contributor                 Submit drafts for review

  Publication Manager                 Prepare publications for public
                                      display

  HR/Recruitment Manager              Publish approved vacancies

  Volunteer Coordinator               Manage volunteer calls

  Research Director                   Review designated research content

  Communications/PR Officer           Manage news, announcements and
                                      events

  Reviewer                            Review content and request changes

  Publisher                           Approve and publish within assigned
                                      scope

  Analyst                             View website analytics

  Auditor                             Read permitted records and audit
                                      history
  -----------------------------------------------------------------------

Roles are permission bundles, not automatic grants based on job title.
Institutions may assign multiple roles to a user.

### 4.2 Platform roles

-   Platform Super Admin.
-   Platform Operations Admin.
-   Template Administrator.
-   Support Operator with controlled, auditable access.

### 4.3 Permission model

Use permission-based RBAC with resource scope: - Platform. -
Institution. - Department, where applicable. - Content type. - Own or
assigned record.

Suggested permissions: - `website.view` - `website.settings.manage` -
`website.branding.manage` - `website.pages.create` -
`website.pages.edit` - `website.pages.delete` -
`website.navigation.manage` - `website.media.upload` -
`website.media.delete` - `website.content.submit` -
`website.content.review` - `website.content.approve` -
`website.content.publish` - `website.content.unpublish` -
`website.domains.manage` - `website.analytics.view` -
`website.audit.view` - `website.templates.manage` (platform scope)

The backend must enforce permissions. Hiding a frontend control is not
authorisation.

## 5. Public Website Information Architecture

Each institution receives configurable navigation. Recommended default
pages can be enabled, disabled, renamed and reordered.

### 5.1 Home

-   Hero headline, supporting text and call-to-action.
-   Institutional introduction.
-   Key statistics or impact metrics.
-   Featured research areas.
-   Featured publications.
-   Latest news and events.
-   Featured opportunities.
-   Partner or funder logos.
-   Contact call-to-action.

### 5.2 About the Institute

-   Overview, history and background.
-   Mission, vision and values.
-   Leadership and governance.
-   Institutional strategy.
-   Accreditation or affiliations, where applicable.

### 5.3 Research

-   Research areas and themes.
-   Research programmes.
-   Facilities and capabilities.
-   Approved public project summaries.
-   Collaborations and research impact.

### 5.4 Publications

-   Searchable publication catalogue.
-   Filters by year, author, topic, type and research area.
-   Publication detail pages.
-   DOI and external links.
-   Public PDF download only where distribution rights permit.

### 5.5 Opportunities

-   Vacancies.
-   Research assistant positions.
-   Internships and fellowships.
-   Graduate opportunities.
-   Calls for volunteers.
-   Other institutional opportunities.

Institutions may use separate Careers and Volunteer Opportunities pages.

### 5.6 News and Events

-   News articles and announcements.
-   Events, workshops, conferences and seminars.
-   Event details and registration links.

### 5.7 Our Team

-   Leadership and researcher profiles.
-   Staff profiles and research groups.
-   Visibility controlled by the institution and applicable consent
    requirements.

### 5.8 Partnerships

-   Collaborating institutions.
-   Funders and sponsors.
-   Academic and industry partners.
-   Approved logos and descriptions.

### 5.9 Resources

-   Annual reports.
-   Public policies and research reports.
-   Brochures and approved downloads.
-   Public datasets and other approved resources.

### 5.10 Contact

-   Official contact details.
-   Office address and map link.
-   Public email and telephone.
-   Contact form.
-   Social media links and optional office hours.

### 5.11 FAQs

Categorised, searchable questions and answers.

### 5.12 Navigation management

Administrators can create primary, footer and utility menus; add
internal and approved external links; create nested items; reorder,
rename, hide or show items; and preview changes. The system must warn
about broken links and support redirects or replacement links when a
published page URL changes.

## 6. Website Identity and Branding

Each institution has an independent public identity.

### 6.1 Configurable fields

-   Official institution name and public display name.
-   Short name or acronym.
-   Logo and optional dark-background logo.
-   Favicon.
-   Tagline.
-   Short and full institutional descriptions.
-   Mission, vision and values.
-   Primary, secondary and accent colours.
-   Approved typography preset.
-   Contact email and telephone.
-   Physical address.
-   Social media URLs.
-   Copyright statement.
-   Default language, timezone and date format.

### 6.2 Branding behaviour

-   Preview changes before publication.
-   Validate logo file type, size and dimensions.
-   Provide recommended image dimensions.
-   Preserve accessible colour contrast.
-   Do not permit arbitrary CSS or script injection in the MVP.
-   Keep all settings tenant-specific.

### 6.3 Brand presets

Provide controlled presets such as Modern Academic, Medical Research,
Scientific Foundation and Minimal Institutional. Presets define
typography, spacing, colour application and component appearance.
Institutions may customise supported values without breaking the design
system.

## 7. Templates and Page Builder

### 7.1 Template catalogue

Initial template families: 1. Medical Research Institute. 2. Academic
Research Centre. 3. Research Foundation. 4. Scientific Innovation
Organisation.

Templates must be responsive, accessible and built from reusable
components.

### 7.2 Template selection

During provisioning, an administrator can preview templates, select one,
apply it, configure branding, populate default pages and preview the
site before launch.

Changing a template must not silently destroy existing content. Preserve
content and provide a migration/preview process.

### 7.3 MVP structured page builder

Use a controlled block-based builder, not unrestricted free-form
editing.

Supported section types: - Hero. - Rich text. - Image and text. - Image
gallery. - Approved video embed. - Statistics and impact metrics. -
Call-to-action. - Featured publications and publication listing. -
Research area cards. - Project highlights. - News cards and event
listings. - Opportunity listings. - Team profiles. - Partner logos. -
Approved testimonials or quotes. - Downloadable resources. - Contact
information and contact form. - FAQ accordion. - Divider or spacer.

Each section must have a defined, versioned schema. Render validated
structured data; do not execute arbitrary markup or code.

### 7.4 Page editing

Authorised users can create, edit, duplicate and archive pages; set
title, slug and page type; add, remove and reorder sections; configure
content and appearance; edit SEO metadata; save drafts; preview desktop,
tablet and mobile; submit for review; and publish, schedule or unpublish
according to permissions.

### 7.5 Future advanced builder

A later phase may add more flexible layout controls, reusable section
presets, additional theme customisation and institution-specific page
layouts. Arbitrary code injection must not become a page-building
feature.

## 8. Content Management

### 8.1 General pages

Support: - Internal and public title. - URL slug and page type. -
Summary or excerpt. - Structured sections. - Featured image. - SEO title
and description. - Social sharing image. - Visibility and workflow
status. - Author, owner, reviewer and approver. - Created, updated and
publication timestamps. - Scheduled publication date. - Revision
history.

### 8.2 News and announcements

Fields include headline, slug, summary, body, featured image, category,
tags, author, publication date, optional event/project association, SEO
metadata and workflow status.

Features include draft/review, featured article, scheduled publication,
archive, related articles, search and filtering.

### 8.3 Events

Fields include title, summary, description, category, start/end date and
time, timezone, venue or online information, registration
URL/instructions, featured image, public contact channel and publication
status. Distinguish event time from publication time.

### 8.4 Team and leadership profiles

Fields include display name, role, department/research group, biography,
profile photograph, approved qualifications and professional links, sort
order and visibility. Never expose private HR fields or personal contact
details through public profile APIs.

### 8.5 Partnerships

Fields include partner name, approved logo, description, website URL,
partnership type, optional dates, display order and publication status.

### 8.6 FAQs

Support question, answer, category, display order and publication
status.

### 8.7 Resources and downloads

Support title, description, file reference, category, publication date,
file type/size, public download permission, related page/topic and
publication status. Scan and validate files before public delivery.

## 9. Integration with RIMS Modules

Avoid duplicate data entry. Use application services or domain events,
not direct cross-module database manipulation.

### 9.1 Publications Management

Publications remain canonical records in Publications Management. A
record must be explicitly marked eligible for public display and
approved before publication.

Potential public fields: - Title and authors. - Abstract or public
summary. - Journal/publisher and publication type. - Publication date. -
DOI and external URL. - Research area. - Associated public project. -
Public PDF only where distribution rights permit.

Never expose unpublished manuscripts, peer-review comments, internal
notes, confidential correspondence or restricted files.

### 9.2 HR and Recruitment

Approved vacancies may appear on Careers or Opportunities pages. Public
fields include title, department, location/remote status, employment
type, summary, responsibilities, qualifications, eligibility,
application instructions, opening/closing dates, public application link
and status.

Applications may be handled in RIMS or through an approved external URL.
Never expose internal hiring notes, candidate records or reviewer
comments.

### 9.3 Volunteer Management

Approved calls may appear publicly. Public fields include title,
purpose, summary, eligibility, expected commitment, location/remote
status, opening/closing dates, application instructions, public contact
and approved information/consent documents.

Applications route to an approved internal workflow or external form.
Closed calls disappear from active listings but remain in the internal
record history.

Research participant recruitment requires applicable ethics approval,
informed consent, data protection and institutional review. The CMS must
not expose participant identities or confidential study data.

### 9.4 Research Management

Only approved public-facing project summaries may be displayed. Possible
fields include title, public summary, research area, approved PI
profile, collaborators, public project status, outputs and authorised
dates/milestones.

Never expose protocols, restricted datasets, confidential proposals,
internal risk assessments or sensitive human-subject information.

### 9.5 Events Management

Approved events managed in RIMS should appear on the public website
without creating a second event record.

### 9.6 Document Management

Reference files stored in RIMS Document Management. Public download
permission must be explicit and checked at delivery time.

### 9.7 Institutional Administration

Use the institutional profile as the canonical source for official
identity and contact information where appropriate. Website-specific
display overrides must not corrupt legal or administrative profile data.

### 9.8 Integration events

Suggested events: - `publication.public_visibility_approved` -
`publication.public_visibility_revoked` -
`recruitment.vacancy_approved_for_publication` -
`recruitment.vacancy_closed` -
`volunteer.call_approved_for_publication` - `volunteer.call_closed` -
`research.project_public_summary_approved` -
`event.approved_for_publication` -
`document.approved_for_public_download`

Events must carry tenant context and source record identifiers.
Consumers must be idempotent and prevent duplicate publication.

## 10. Publishing, Review and Visibility

### 10.1 Lifecycle

`Draft → Submitted for Review → Changes Requested / Approved → Scheduled / Published → Unpublished / Archived`

State transitions must be explicit and backend-validated.

### 10.2 Workflow requirements

-   Contributors can create and submit content.
-   Reviewers can approve or request changes.
-   Publishers can publish when authorised.
-   Self-approval should be disallowed by default where separation of
    duties is required.
-   Institutions may configure supported workflow rules.
-   All transitions are audited.
-   Scheduled publishing uses the institution's timezone.
-   Failed jobs are safely retried and reported.
-   Unpublishing removes content from public delivery and invalidates
    caches.
-   Use archival or soft deletion where retention and audit requirements
    apply.

### 10.3 Visibility levels

-   **Private:** authorised users and services only.
-   **Internal:** permitted institution members.
-   **Public:** approved for public website delivery.
-   **Restricted:** specifically authorised access or controlled
    sharing.

Visibility is enforced at API and storage layers, not only in the UI. A
record's existence in RIMS never implies permission to publish.

## 11. Media Library

### 11.1 Supported assets

PNG, JPEG, WebP, PDF and approved video embeds. SVG should be allowed
only after robust sanitisation; it may be disabled in the first release.
Other file types require explicit platform approval.

### 11.2 Features

-   Single and multi-file upload.
-   Folders or collections.
-   Search and filtering.
-   Title, description, alternative text, caption and credit.
-   Usage references.
-   Safe replacement preserving references where possible.
-   Archive/delete unused assets.
-   Image optimisation and responsive variants.
-   File size/type validation.
-   Malware scanning where applicable.

### 11.3 Security

Store files privately by default. Public delivery requires approved
status and controlled URLs. Validate file signatures, not only
extensions or client MIME types. Apply upload limits, rate limits and
safe filename handling. Sanitise or disallow SVG. Use short-lived signed
URLs for private files. Never expose private storage keys.

## 12. Domains and Hosting

### 12.1 Domain options

-   RIMS-managed subdomain, e.g. `institution.rims.app`.
-   Institution-owned domain, e.g. `researchinstitute.org`.
-   Institution-owned subdomain, e.g. `research.institution.org`.

Examples are illustrative; domain ownership and availability must be
verified.

### 12.2 Domain onboarding

1.  Administrator enters a domain.
2.  RIMS displays required DNS records.
3.  Institution configures DNS.
4.  RIMS verifies domain control.
5.  Platform provisions/configures TLS.
6.  Domain is mapped to the tenant website.
7.  Administrator selects the primary domain.
8.  Optional redirects route alternate domains to the primary domain.

### 12.3 Requirements

-   Verified, unique domain-to-tenant mapping.
-   HTTPS mandatory in production.
-   Certificate provisioning and renewal monitoring.
-   Host-header spoofing protection.
-   Safe handling of unknown domains.
-   Tenant-safe domain removal.
-   Audited domain changes.

Support shared SaaS and dedicated deployments using the same codebase.
The public renderer may initially run within the RIMS application, with
separate presentation/API boundaries.

## 13. Public Rendering and API Design

### 13.1 Tenant resolution

For a public request: 1. Read the hostname. 2. Resolve it against
verified domain mappings. 3. Resolve the tenant. 4. Load that tenant's
published website configuration. 5. Resolve the requested page/content
route within that tenant. 6. Return only published public content.

Never trust a client-supplied `tenant_id` for public tenant resolution.

### 13.2 Public API principles

-   Return published public content only.
-   Resolve tenant from verified hostname or controlled public tenant
    route.
-   Avoid unnecessary internal identifiers and metadata.
-   Apply pagination and bounded filtering.
-   Rate-limit forms and search.
-   Validate query parameters.
-   Avoid leaking the existence of private records.
-   Use tenant-specific cache keys.
-   Return safe errors.

### 13.3 Illustrative public routes

Under `/api/v1/public`: - `GET /sites/current` -
`GET /sites/current/navigation` - `GET /sites/current/pages/:slug` -
`GET /sites/current/news` - `GET /sites/current/news/:slug` -
`GET /sites/current/events` - `GET /sites/current/events/:slug` -
`GET /sites/current/publications` -
`GET /sites/current/publications/:slug` -
`GET /sites/current/opportunities` -
`GET /sites/current/opportunities/:slug` -
`GET /sites/current/volunteer-calls` - `GET /sites/current/research` -
`GET /sites/current/team` - `GET /sites/current/partners` -
`GET /sites/current/resources` -
`POST /sites/current/contact-submissions`

Never return all tenant records and rely on frontend filtering.

### 13.4 Illustrative authenticated CMS routes

Under `/api/v1/institutional-web`: - `GET/PATCH /settings` -
`GET /themes` - `POST /theme-selection` - `GET/POST /pages` -
`GET/PATCH /pages/:id` - `POST /pages/:id/duplicate` -
`POST /pages/:id/submit` - `POST /pages/:id/review` -
`POST /pages/:id/approve` - `POST /pages/:id/publish` -
`POST /pages/:id/unpublish` - `GET/PUT /navigation` -
`GET/POST /media` - `DELETE /media/:id` - `GET/POST /news` -
`GET/POST /domains` - `POST /domains/:id/verify` -
`GET /analytics/overview` - `GET /audit`

Final contracts must be documented in OpenAPI. Authenticated endpoints
must derive tenant context from the authenticated session and
server-side membership, enforce RBAC/scope and audit sensitive
operations.

## 14. Conceptual Data Model

Adapt these entities to the existing RIMS schema and naming conventions.
Every tenant-owned record must be tenant-scoped directly or through a
tenant-scoped parent. Enforce tenant-safe relationships with constraints
and application checks.

### 14.1 Core entities

**`InstitutionWebsite`** - `id`, `tenant_id`, `name`, `status`
(setup/draft/published/suspended), `primary_domain_id`,
`default_locale`, `timezone`, timestamps.

**`WebsiteBranding`** - `id`, `tenant_id`, `website_id`, logo/media
references, tagline, descriptions, colours, typography preset, contact
details, address, social links, copyright, updater and timestamp.

**`WebsiteTheme`** - `id`, `key`, `name`, `description`, preview image,
version, active status, configuration schema and timestamps. Global
theme definitions are platform-managed; tenant selections/customisations
are tenant-scoped.

**`WebsitePage`** - `id`, `tenant_id`, `website_id`, title, public
title, slug, page type, summary, featured media, status, visibility, SEO
metadata, social image, author/updater/publisher, publication/schedule
timestamps and archive timestamp. - Enforce active slug uniqueness
within a website.

**`WebsitePageRevision`** - `id`, `tenant_id`, `page_id`, revision
number, immutable content snapshot, change summary, creator and
timestamp.

**`WebsitePageSection`** - `id`, `tenant_id`, `page_id`, section type,
sort order, configuration JSON and timestamps. - Validate configuration
against a versioned schema for its section type.

**`WebsiteNavigation`** - `id`, `tenant_id`, `website_id`, name,
location (primary/footer/utility), timestamps.

**`WebsiteNavigationItem`** - `id`, `tenant_id`, `navigation_id`, parent
ID, label, link type, internal page reference or external URL, sort
order and visibility.

**`WebsiteContent`** - Optional common abstraction for CMS-native
content. Prefer typed domain tables for records owned by other RIMS
modules. - Fields may include ID, tenant, website, type, title, slug,
summary, body, status, visibility, publication timestamps and
authorship.

**`WebsiteMedia`** - `id`, `tenant_id`, `website_id`, storage key,
original filename, MIME type, file size, dimensions, alt text, caption,
credit, scan status, visibility, uploader and timestamp.

**`WebsiteDomain`** - `id`, `tenant_id`, `website_id`, hostname,
verification status, verification-token hash, primary flag, TLS status,
verification timestamp and timestamps.

**`WebsiteContactSubmission`** - `id`, `tenant_id`, `website_id`, name,
email, subject, message, consent record, spam status, processing status,
received timestamp and retention expiry. - Contains personal data and
requires access and retention controls.

**`WebsitePublicationLink`** - `id`, `tenant_id`, `website_id`,
canonical publication ID, optional public summary override, visibility,
approver, approval timestamp and publication timestamp.

**`WebsiteOpportunityLink`** - `id`, `tenant_id`, `website_id`, source
type, source record ID, visibility, approver, approval timestamp and
publication timestamp.

**Analytics records** - Tenant, website, event type, page path, content
reference, referrer category, timestamp and privacy-minimised technical
metadata.

Use the RIMS central audit system where available. Audit records should
identify tenant, website, actor, action, resource, timestamp, relevant
change summary and correlation ID.

### 14.2 Data integrity rules

-   Tenant IDs are server-derived.
-   Tenant-owned foreign keys cannot cross tenants.
-   Use database constraints and referential integrity.
-   Use transactions for publishing and source synchronisation.
-   Do not place private file contents in public content JSON.
-   Validate structured section data.
-   Keep revisions immutable.
-   Preserve publication history.

## 15. SEO and Discoverability

### Page-level SEO

-   Editable meta title and description.
-   Canonical URL.
-   Social sharing title, description and image.
-   Human-readable slug.
-   Robots indexing control.
-   Valid structured data where appropriate.

### Technical SEO

-   XML sitemap per institution.
-   `robots.txt` per website.
-   Canonical host redirects.
-   Correct HTTP status codes.
-   Crawlable public content through SSR or an equivalent suitable
    rendering strategy.
-   Semantic HTML and descriptive image alt text.
-   Breadcrumbs where appropriate.
-   Structured metadata for articles, events and publications where
    valid.
-   Never index drafts, previews, admin pages or private resources.

SEO settings must never override privacy or publication controls.

## 16. Contact Forms and Public Submissions

### 16.1 Contact form requirements

-   Configurable fields from a controlled set.
-   Standard name, email, subject and message fields.
-   Optional topic/category.
-   Consent notice where appropriate.
-   Spam prevention and rate limiting.
-   Input validation and output encoding.
-   Notifications to designated institutional recipients.
-   Submission status and assignment in the private dashboard.

### 16.2 Data protection

Collect only necessary information. Display an appropriate privacy
notice. Define retention periods. Restrict access. Protect data in
transit and at rest. Never expose submissions through public APIs.
Provide deletion/anonymisation processes consistent with retention
obligations.

### 16.3 Applications and volunteer submissions

Internal applications must route to the appropriate HR or volunteer
workflow. Do not store sensitive application information in generic CMS
content tables. Provide clear privacy and consent information and apply
the relevant retention schedule.

## 17. Website Analytics

Initial metrics: - Page views. - Privacy-safe visit estimates where
configured. - Most viewed pages and publications. - Most viewed
opportunities. - Contact submissions. - Application-link clicks. -
Traffic trends. - Referrer categories. - Device category where
appropriate.

Tenant administrators can see only their institution's analytics.
Platform aggregate reporting must be authorised and appropriately
minimised. Avoid unnecessary full IP collection, fingerprinting or
sensitive browsing data. Support consent configuration where required
and define retention/aggregation policies.

Analytics must not become an employee performance surveillance system.

## 18. Security, Privacy and Compliance

### 18.1 Tenant isolation

-   Enforce tenant context on every authenticated CMS request.
-   Resolve public tenant context from a verified hostname or controlled
    route.
-   Use PostgreSQL Row-Level Security if adopted by the wider RIMS
    architecture.
-   Establish tenant context securely for each database transaction.
-   Never trust browser-supplied tenant IDs.
-   Apply tenant-scoped object storage access.
-   Include tenant context in jobs and events.
-   Test cross-tenant access.

### 18.2 Authentication and authorisation

Reuse RIMS authentication. Enforce permissions on every write and
sensitive read. Apply least privilege. Support MFA according to RIMS
policy. Revoke access when membership/roles are removed. Audit
privileged publishing and domain operations.

### 18.3 Application security

Validate and sanitise inputs; encode output; prevent XSS and CSRF where
applicable; rate-limit public endpoints; protect against SSRF in URL
previews/media fetching; restrict embeds to an allowlist; validate and
scan uploads; protect secrets; use TLS and secure headers; scan
dependencies/containers; and avoid leaking internal errors.

### 18.4 Public content protection

-   Private content cannot be accessed by guessing an ID or slug.
-   Preview URLs require authentication or short-lived, revocable
    tokens.
-   Search indexes include public content only.
-   Cache keys include tenant and content version.
-   Unpublishing invalidates caches.
-   Public file URLs do not reveal private object paths.
-   Sitemaps contain published pages only.

### 18.5 Research ethics and participant privacy

Public research participant calls require applicable ethics and
institutional approvals. The CMS records approval status or references
where required but does not grant ethics approval. Never publish
participant identities, confidential screening information, medical
records or subject-level research data.

### 18.6 Audit events

Audit branding and template changes; page creation/edit/archive;
navigation changes; content review/approval/publication/unpublication;
domain operations; media publication/removal; permission changes; and
contact-submission access where policy requires it.

## 19. Non-Functional Requirements

### Performance

-   Fast public delivery on typical mobile networks.
-   Image optimisation and responsive variants.
-   Safe caching of published content.
-   Pagination and bounded queries.
-   Avoid N+1 queries.
-   Cache invalidation after publication.
-   Define and load-test measurable targets during implementation.

### Availability and resilience

-   Public delivery must not depend on an administrator being logged in.
-   Analytics failures must not block public pages.
-   Publishing jobs must be retryable and idempotent.
-   Monitor domain/TLS failures.
-   Back up website configuration and content.
-   Test recovery procedures.

### Accessibility

Target WCAG 2.2 AA where practical: - Keyboard navigation and visible
focus. - Semantic headings. - Accessible forms and errors. - Sufficient
contrast. - Alternative text. - Captions/transcripts where relevant. -
Responsive zoom and reflow. - Accessible navigation and interactive
components.

### Responsive design

Public templates support phones, tablets, laptops and desktops. CMS
interfaces should support routine administration on mobile/tablet;
advanced editing may be desktop-optimised.

### Internationalisation readiness

Store timestamps consistently (preferably UTC); display using
institution timezone/locale; externalise interface strings; support
Unicode; and avoid hardcoded language assumptions.

## 20. Recommended Technical Architecture

Align with the wider RIMS stack: - Frontend: React, TypeScript, Vite. -
UI: Tailwind CSS and RIMS design system. - Backend: NestJS. - Database:
PostgreSQL. - ORM: Prisma, if selected for the main RIMS application. -
Cache/jobs: Redis and BullMQ. - Storage: S3-compatible object storage. -
API: REST under `/api/v1`. - Documentation: OpenAPI/Swagger. -
Deployment: Docker and Nginx or approved ingress. - Tests: Jest and
Playwright.

Do not introduce a separate framework or database solely for this module
without an explicit architecture decision.

### 20.1 Suggested backend structure

``` text
modules/
  institutional-web/
    website/
    settings/
    branding/
    themes/
    pages/
    page-sections/
    navigation/
    content/
    publications/
    opportunities/
    volunteer-calls/
    news/
    events/
    team-profiles/
    partners/
    resources/
    media-library/
    contact-forms/
    domains/
    seo/
    analytics/
    publishing/
    public-api/
    audit/
```

Reuse RIMS shared modules for authentication, authorisation, tenants,
audit, files, notifications and jobs.

### 20.2 Suggested frontend structure

``` text
apps/
  institutional-dashboard/
    features/institutional-web/
      overview/
      branding/
      themes/
      pages/
      page-builder/
      navigation/
      publications/
      opportunities/
      volunteer-calls/
      news/
      events/
      media-library/
      contact-forms/
      domains/
      seo/
      analytics/
      settings/

  public-site/
    tenant-resolution/
    theme-renderer/
    layouts/
    components/
    pages/
    content/
    seo/
```

The public renderer may be deployed with the main application or as a
separate frontend package. It must share validated content contracts and
tenant-resolution rules.

### 20.3 Rendering strategy

Choose SSR or static generation with controlled revalidation, or another
crawlable approach. It must support per-domain tenant resolution,
dynamic published content, correct metadata/canonical URLs, safe preview
mode, cache invalidation and custom domains. Do not assume a client-only
SPA is sufficient for SEO.

### 20.4 Background jobs

Use shared RIMS queues for scheduled publishing/expiry, sitemap
generation, image processing, malware scanning, domain/TLS checks,
analytics aggregation, source-module synchronisation and notifications.
Jobs must be idempotent, tenant-aware and observable.

## 21. User Experience Requirements

### Website overview

Show publication status, selected template, primary domain and
verification, pending reviews, recent and scheduled content, recent
enquiries, basic analytics and setup warnings.

### Branding

Provide logo/favicon upload, colour selection with contrast feedback,
typography presets, institutional description, contact/social fields and
live preview.

### Page editor

Provide page list and filters, page creation, structured section editor,
section reordering, responsive preview, draft saving, revision history
and permission-aware review/publish actions.

### Publishing interface

Show status, owner, reviewer/approver, review comments,
publication/scheduled dates, visibility, and source module/source record
where integrated.

### Design principles

Professional institutional design; clear separation of editing and
publishing; unsaved-change feedback; safe confirmation for
public/destructive actions; and previews that closely resemble the
public website. Saving a draft must never silently publish it.

## 22. Subscription and Commercial Considerations

Use RIMS subscription entitlements rather than hardcoded plan names or
prices. Possible entitlements: - Number of websites per tenant. -
Available templates. - Custom domain support. - Storage allocation. -
CMS administrator seats. - Advanced page builder. - Analytics
retention/reporting depth. - Additional language support. - Custom theme
services. - Dedicated hosting.

Dedicated deployments use the same codebase and entitlement model,
subject to contract.

## 23. Implementation Roadmap

### Phase 1 --- Website foundation and CMS MVP

-   Website provisioning per tenant.
-   Default template catalogue.
-   Tenant-specific branding.
-   Default page generation.
-   Basic page editor and structured sections.
-   Navigation management.
-   Draft/review/approve/publish workflow.
-   Public website renderer and public APIs.
-   RIMS-managed subdomains.
-   Basic SEO metadata.
-   Audit logging and access controls.
-   Tenant-isolation tests.

**Outcome:** Each institution can launch and manage a professional
public website using a predefined template.

### Phase 2 --- RIMS content integrations

-   Publications.
-   HR/recruitment vacancies.
-   Volunteer opportunities.
-   Research summaries.
-   Events.
-   Documents/resources.
-   Media library improvements.
-   Contact forms and internal enquiry handling.
-   Scheduled publication/expiry.
-   Sitemap and structured metadata.

**Outcome:** The public website becomes a publishing layer for
institutional RIMS operations.

### Phase 3 --- Custom domains and analytics

-   Custom domain onboarding and DNS verification.
-   TLS provisioning and monitoring.
-   Primary domain and redirect management.
-   Analytics dashboard.
-   Privacy and retention controls.
-   Performance and caching improvements.

**Outcome:** Institutions can use their own domains and monitor public
engagement.

### Phase 4 --- Advanced page builder

-   Expanded layout controls.
-   Reusable section presets.
-   Advanced theme customisation.
-   Additional templates.
-   Multi-language support if required.
-   Advanced workflow configuration.
-   Further accessibility and SEO tooling.

**Outcome:** More presentation flexibility without compromising
stability.

## 24. MVP Acceptance Criteria

### Tenant and provisioning

-   [ ] Platform administrator can provision a tenant website.
-   [ ] Website settings and content are tenant-isolated.
-   [ ] Tenant administrators access CMS through RIMS.
-   [ ] Website resolves through its assigned RIMS subdomain.

### Branding and templates

-   [ ] Administrator can select a template.
-   [ ] Administrator can upload/configure logo.
-   [ ] Administrator can configure supported colours and typography.
-   [ ] Changes can be previewed.
-   [ ] One tenant's branding cannot affect another.

### Pages and navigation

-   [ ] Authorised users can create, edit, duplicate and archive pages.
-   [ ] Pages support multiple section types and section reordering.
-   [ ] Pages support drafts and revisions.
-   [ ] Navigation can be created, edited, reordered and hidden.
-   [ ] Public routes expose published pages only.

### Publishing

-   [ ] Contributor can submit content for review.
-   [ ] Reviewer can approve or request changes.
-   [ ] Authorised publisher can publish approved content.
-   [ ] Publishing/unpublishing is audited.
-   [ ] Scheduled publication is timezone-aware when enabled.
-   [ ] Caches and sitemap update after publication changes.

### Public website

-   [ ] Public visitors can access published pages without signing in.
-   [ ] Draft/private content is inaccessible publicly.
-   [ ] Website works on mobile, tablet and desktop.
-   [ ] Metadata and canonical URLs are correct.
-   [ ] Navigation and internal links work.

### Security

-   [ ] Cross-tenant access tests pass.
-   [ ] Unauthorised publishing is rejected by backend.
-   [ ] Public APIs return public content only.
-   [ ] Private media is not accessible through guessed URLs.
-   [ ] Critical operations generate audit events.

## 25. Testing Strategy

### Unit tests

Tenant resolution, permission evaluation, content state transitions,
section schema validation, slug uniqueness, publication eligibility and
domain verification.

### Integration tests

CMS CRUD, page publishing/unpublishing, public API filtering, module
integrations, media upload/delivery, contact processing, background jobs
and cache invalidation.

### Security tests

Cross-tenant records/files, unauthorised approval/publishing, public
draft access, host-header/domain attacks, XSS handling, malicious
uploads, rate limits and preview-token expiry/revocation.

### End-to-end tests

Provision a website; select template; configure branding; create and
publish a page; verify public rendering; approve a publication; publish
a vacancy; submit a contact form; unpublish a page and verify public
removal.

## 26. Risks and Mitigations

  -----------------------------------------------------------------------
  Risk                                Mitigation
  ----------------------------------- -----------------------------------
  Confidential research exposed       Explicit public visibility,
                                      approval workflow, public API
                                      allowlisting and tests

  Cross-tenant leakage                Server-derived tenant context,
                                      constraints, RLS where used and
                                      isolation tests

  Poor output from unrestricted       Controlled templates and structured
  editing                             sections

  Duplicate records                   Canonical source records and
                                      integration events

  Broken links                        Redirect support and link
                                      validation

  Domain misconfiguration             Verification, monitoring and clear
                                      DNS guidance

  Unsafe uploads                      Validation, scanning, private
                                      storage and controlled delivery

  Slow websites                       Image optimisation, caching,
                                      pagination and performance tests

  Personal data exposure              Data minimisation, access control,
                                      retention and privacy notices

  Publishing bottlenecks              Reviewer assignment and
                                      pending-review dashboard
  -----------------------------------------------------------------------

## 27. Open Product Decisions

Confirm during implementation: 1. Whether one tenant can operate
multiple public websites. 2. Whether MVP supports multiple active
languages. 3. Whether contact submissions can create RIMS tasks or
remain in an enquiry inbox. 4. Whether applications are internal,
external-link-based or configurable per opportunity. 5. Analytics
provider and consent model. 6. Whether custom domains are MVP or a
higher subscription tier. 7. Public calendar versus event listings. 8.
Which templates launch first.

Recommended defaults: - One website per tenant initially. -
Internationalisation-ready, one active language in MVP. - Dedicated
enquiry inbox; task creation can follow. - Application handling
configurable per opportunity. - Privacy-conscious basic analytics. -
RIMS subdomains in MVP; custom domains in a subsequent phase. - Event
listings first. - Medical Research Institute and Academic Research
Centre templates first.

## 28. Instructions for Kiro / Engineering

Build this as an integrated RIMS module, not a disconnected website
product.

Before coding: 1. Inspect the current RIMS repository and architecture.
2. Identify existing tenant, user, authentication, permission, audit,
notification, file, subscription and deployment implementations. 3.
Reuse shared infrastructure. 4. Inspect Publications, HR/Recruitment,
Research, Events and Document Management before defining integrations.
5. Produce an implementation plan and schema dependency map. 6. Confirm
database migration strategy. 7. Define OpenAPI contracts. 8. Define
versioned page-section schemas and template strategy. 9. Define tenant
resolution and domain verification. 10. Document security/privacy risks
before exposing public endpoints.

Implementation rules: - Do not create a second user or tenant system. -
Do not duplicate canonical records owned by other modules. - Do not
trust client-provided tenant identifiers. - Do not expose internal
records through public APIs. - Do not permit arbitrary HTML/JS/CSS
injection in MVP. - Do not publish content merely because it was
saved. - Do not require an authenticated administrator session for
public delivery. - Do not introduce microservices without an explicit
architecture decision. - Use migrations and preserve referential
integrity. - Document endpoints in OpenAPI. - Include unit, integration,
end-to-end and tenant-isolation tests. - Support shared SaaS and
dedicated deployments with the same codebase.

### Definition of Done

A feature is complete only when backend logic and permission enforcement
are implemented; frontend workflows work; tenant isolation is verified;
validation and error handling exist; audit requirements are met;
relevant tests pass; API documentation is updated; behaviour is
documented; and no private or unapproved content is exposed publicly.

## 29. Final Product Definition

The RIMS Institutional Web Presence & Content Management System gives
every participating research institution the ability to manage its
public digital identity and institutional communications from the same
platform used to manage internal operations.

It combines: - A tenant-specific public website. - A configurable
institutional CMS. - Template-based website design. - Structured page
building. - Controlled content publishing. - Integrated publications and
opportunities. - Institutional news, events and resources. - Domain and
SEO management. - Public enquiry handling. - Website analytics. - Tenant
isolation, security and auditability.

**Product owner:** ProgrammoCeuticals\
**Parent platform:** RIMS --- Research Institute Management System\
**Module:** Institutional Web Presence & Content Management System\
**Product principle:** One RIMS platform, independently managed
institutional websites, and controlled publishing from a shared
operational system.
