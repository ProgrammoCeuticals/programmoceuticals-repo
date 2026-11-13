# ProgrammoCeuticals LMS Rebuild Plan

## Objective
Rebuild the current school application into a standard, professional Learning Management System for a programming school. The result should support free self-paced learning, paid cohort training, paid certification, backend-managed content, learner progress, assessments, whiteboard notes, and admin operations from a clean product architecture.

This plan replaces the old cohort-school plan. The current app is now treated as source material, not as the final structure.

## Product Direction

### Core Product Rules
- Learning content remains free for self-paced learners.
- Registration is required for full learner access and progress persistence.
- Payment applies only to cohort training and certification.
- The LMS remains programming-school focused.
- Whiteboard notes stay as a core differentiator and remain persistent.
- Certificates remain available only after eligibility rules are met.

### Product Layers
1. Public marketing site
   - Homepage
   - Courses catalog
   - Course detail pages
   - About/contact
   - Cohort and certification CTA

2. Learner portal
   - My learning dashboard
   - Enrolled courses
   - Continue learning
   - Assessments
   - Notes and whiteboard
   - Notifications
   - Certificates

3. Learning experience
   - Course overview
   - Module list
   - Lesson player
   - Lesson resources
   - Assessments and submissions
   - Progress and completion state

4. Paid cohort experience
   - Cohort application
   - Cohort schedule
   - Cohort announcements
   - Cohort payment status
   - Cohort-specific learning support

5. Admin operations
   - Course management
   - Module and lesson management
   - Learner management
   - Cohort management
   - Payment management
   - Certificate management
   - Announcements and resources

## What We Keep vs Rebuild

### Keep and Reuse
- JWT auth flow and role handling
- Current backend/server structure
- Payment integration and callback handling
- Whiteboard persistence and export capabilities
- Certificate verification flow
- Notification pattern
- Existing course content and slide assets
- Existing admin and learner service layer patterns

### Rebuild or Refactor
- Frontend information architecture
- Routing model and screen ownership
- Backend LMS content model
- Student dashboard into a real learner dashboard
- Admin dashboard into a content and operations console
- Course delivery flow so backend becomes the source of truth
- Progress model to support modules, lessons, and assessments
- Enrollment model to represent real course participation instead of course interest

## Target Architecture

### Frontend
- React SPA remains acceptable for v1.
- Keep `client/src` but reorganize around product areas instead of mixed page/component patterns.
- Use backend-driven content for courses, modules, lessons, outlines, objectives, and resources.
- Keep whiteboard inside the lesson player.
- Reduce dependency on local hardcoded `slidesData` files over time by seeding them into backend-managed content.

### Backend
- Keep Express + MongoDB.
- Keep JWT auth and role-based access.
- Extend the current API rather than creating a second backend.
- Treat backend as the source of truth for:
  - courses
  - modules
  - lessons
  - learner enrollments
  - assessments
  - submissions
  - cohort applications
  - payments
  - certificates
  - notes

## Domain Model

### Core Models
- `User`
  - `role`: `student`, `admin`
  - profile fields
  - optional onboarding preferences

- `Course`
  - title
  - slug
  - description
  - level
  - category
  - objectives
  - outline
  - thumbnail/icon
  - preview policy
  - publication status

- `Module`
  - course reference
  - title
  - description
  - order index
  - completion rules

- `Lesson`
  - module reference
  - title
  - lesson type
  - content body or slide content reference
  - order index
  - estimated duration
  - resource attachments
  - published status

- `Enrollment`
  - user reference
  - course reference
  - access type: `self_paced`, `cohort`
  - status: `active`, `completed`, `archived`
  - enrollment date

- `LessonProgress`
  - user reference
  - course/module/lesson references
  - completion state
  - last position
  - timestamps

- `Assessment`
  - course/module/lesson reference
  - type: `quiz`, `assignment`
  - title
  - instructions
  - pass rule
  - visibility

- `Submission`
  - assessment reference
  - learner reference
  - answers or file/code submission payload
  - score
  - status
  - reviewed metadata

- `Cohort`
  - course reference
  - name
  - instructor
  - start/end dates
  - schedule
  - seat limit
  - status

- `CohortApplication`
  - learner identity
  - selected course/cohort
  - application status
  - payment status
  - admin notes

- `Payment`
  - payment type: `cohort_training`, `certification`
  - provider data
  - status
  - user reference
  - related cohort application or certification request

- `Certificate`
  - learner reference
  - course reference
  - certificate number
  - issue status
  - issued metadata

- `WhiteboardNote`
  - user reference
  - lesson reference
  - saved canvas snapshot
  - timestamps

### Model Decisions
- `interested_courses` stops being the main LMS record and becomes onboarding preference only.
- `Enrollment` becomes the source of truth for "My Learning".
- Current course progress by `courseId/slideIndex` must evolve into lesson-based progress.
- Whiteboard notes should move from `course_id + slide_index` to lesson-scoped persistence.

## User Flows

### Guest
- Visit public site
- View course catalog and course detail
- Preview limited lesson content
- Register to unlock full self-paced learning
- See paid upsell only for cohort training and certification

### Registered Learner
- Register and log in
- Enroll in self-paced courses
- Continue lessons from dashboard
- Save notes and whiteboard state
- Attempt quizzes and assignments
- Track completion
- Apply for cohorts
- Pay for cohort training or certification when needed

### Admin
- Create and manage courses
- Add modules and lessons
- Publish/unpublish content
- Manage learners and enrollments
- Manage cohorts and applications
- Review payments
- Issue certificates
- Send announcements

## Screen Map

### Public Screens
- Home
- Courses
- Course detail
- Course curriculum page
- Login
- Signup

### Learner Screens
- Dashboard
- My learning
- Course overview
- Lesson player
- Assessments
- Notifications
- Certificates
- Cohort area

### Admin Screens
- Overview
- Courses
- Course builder
- Modules and lessons
- Learners
- Cohorts
- Payments
- Certificates
- Announcements

## Content Strategy

### Immediate Rule
- Existing slide/course content is preserved.
- Existing frontend slide datasets are migrated into backend-managed course content.
- Until migration is complete, fallback support may remain temporarily, but the target state is backend-owned content only.

### Course Structure Standard
- Each course must have:
  - overview
  - objectives
  - outline
  - module structure
  - lessons
  - resources
  - optional assessments

### Whiteboard Rule
- Whiteboard remains available inside lessons.
- Notes persist per learner per lesson.
- Export stays supported.

## Payments and Access Rules

### Free Access
- Guest users can preview a defined percentage of each course.
- Registered learners can access full self-paced content once enrolled or granted access.

### Paid Access
- Cohort training requires payment and approved application state.
- Certification requires payment and completion eligibility.

### Access Decisions
- Self-paced learning and cohort participation must be separate states.
- Certificate issuance must require:
  - course completion
  - any required assessments completed
  - certification payment confirmed

## API Direction

### Keep
- `/auth`
- `/payments`
- `/certificates`
- notifications endpoints
- note persistence endpoints

### Refactor or Add
- `/courses`
  - return full LMS-ready course structures
- `/modules`
- `/lessons`
- `/enrollments`
- `/assessments`
- `/submissions`
- `/cohorts`
- `/admin/*` management endpoints for all LMS objects

### API Rules
- Backend responses should be normalized for frontend use.
- Frontend should stop merging backend data with hardcoded local course definitions in the long-term design.
- Public endpoints must support preview-safe content only.
- Protected endpoints must return learner-specific progress and access state.

## Implementation Phases

### Phase 1: Product Reset and Structure
- Freeze the current app as reference.
- Redefine the LMS domain model.
- Clean routing and screen ownership.
- Establish backend as the source of truth.
- Document data migration targets.

### Phase 2: Backend LMS Foundation
- Add models for modules, lessons, assessments, submissions, and LMS enrollments.
- Refactor existing progress and note persistence to lesson scope.
- Extend admin endpoints for content management.
- Seed existing course/slide content into backend-compatible structures.

### Phase 3: Public and Auth Experience
- Rebuild public homepage and course pages as a professional LMS front door.
- Keep clear separation between free learning and paid offerings.
- Refine login/signup/onboarding.

### Phase 4: Learner Experience
- Build learner dashboard and my learning pages.
- Build course overview and lesson player.
- Reconnect whiteboard, progress, resume state, and notifications.
- Add completion logic.

### Phase 5: Cohort and Certification Layer
- Refine cohort application flow.
- Improve payment workflow for cohort training and certification.
- Build learner-facing cohort status screens.
- Lock certificate eligibility and issuance rules.

### Phase 6: Assessments and Admin Control
- Add quiz and assignment flows.
- Add submission management.
- Upgrade admin dashboard into a full LMS operations console.

### Phase 7: Cleanup and Launch Readiness
- Remove duplicated frontend-only content logic.
- Clean warnings and accessibility issues.
- Validate refresh-safe routing and deployment config.
- Run end-to-end verification for learner, admin, payment, and certificate flows.

## Migration Strategy
- Preserve existing users, payments, certificates, and notes where possible.
- Migrate existing course content into course/module/lesson structures.
- Map legacy progress to the nearest lesson state where possible.
- Keep old identifiers only as temporary compatibility fields if needed during transition.

## Definition of Done
- Public users can discover and preview courses.
- Registered learners can enroll, learn, save notes, and resume progress.
- Cohort learners can apply, pay, and follow cohort workflows.
- Admins can manage content, learners, cohorts, payments, and certificates.
- Certificates can be issued and verified.
- Course content is backend-managed.
- Whiteboard notes persist reliably at lesson level.
- The app reads as one standard LMS product, not a patched school demo.

## Immediate Execution Order
1. Redesign the backend content model around course, module, lesson, enrollment, assessment, and submission.
2. Rebuild the frontend route map and page ownership around public, learner, and admin areas.
3. Migrate course data into backend-managed structures.
4. Rebuild learner dashboard and lesson player around the new model.
5. Reconnect whiteboard, progress, payments, and certificates.
6. Finish admin content management and launch polish.
