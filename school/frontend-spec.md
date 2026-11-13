# ProgrammoCeuticals LMS Frontend Specification

## Purpose
This document is the frontend implementation brief for the ProgrammoCeuticals school application. It describes what the frontend should be when the product is rebuilt as a standard, professional programming-school LMS.

This spec is intended to be handed to Amazon Q or any implementation agent as the source of truth for the frontend.

Use this together with:
- [api-contract.md](/Users/macbookpro/Desktop/ProgrammoCeuticals/school/api-contract.md:1)
- [plan.md](/Users/macbookpro/Desktop/ProgrammoCeuticals/school/plan.md:1)

## Product Summary
Build a professional LMS frontend for a programming school with these rules:

- Learning content is free.
- Guests can preview only part of a course.
- Registered learners can access full self-paced learning.
- Payment is only for cohort training and certification.
- The app must feel like a real LMS, not a patched school demo.
- The whiteboard and lesson notes are a core differentiator and must remain first-class.
- Course content should be driven by the backend, not by frontend hardcoded data in the long term.

## Core Frontend Goals
- Present the school as a serious programming academy.
- Make course discovery, learning, and cohort upgrade paths clear.
- Give learners a proper dashboard and lesson workspace.
- Give admins a professional operations console.
- Support deep linking, refresh-safe pages, and mobile responsiveness.
- Use clean, custom UI patterns. Do not rely on browser `alert`, `prompt`, or `confirm`.

## Non-Negotiable Product Rules
- Public users can browse courses and preview only a limited portion of each course.
- Registered users can enroll in self-paced learning and access all lessons in those courses.
- Cohort training is separate from self-paced learning.
- Certification is separate from learning access.
- Whiteboard notes persist per learner per lesson.
- Whiteboard notes must support export to PDF.
- Each course must have a course overview, objectives, outline, modules, and lessons.
- Every course should use its real logo or icon, not emoji placeholders.

## Frontend Architecture
Use a React SPA for v1. A modern route-based structure is required.

Recommended stack:
- React 18+
- React Router for route ownership
- TanStack Query or equivalent for server-state fetching/caching
- Context or lightweight store for auth and app-level UI state
- Reusable design tokens for colors, spacing, radius, shadows, typography
- Custom modals, drawers, and empty states

Implementation rules:
- All pages must support direct refresh without dumping the user back to the homepage.
- Every route change should reset scroll position to the top.
- All protected routes must handle unauthenticated users cleanly.
- Use loading skeletons or polished loading states instead of plain text when possible.
- Avoid mixing page logic and data shaping deeply inside presentational components.

## Information Architecture
The frontend should be organized into three product areas:

1. Public marketing and discovery
2. Learner portal
3. Admin console

## Global Navigation

### Public Navigation
Top navbar should contain:
- Home
- Courses
- Timetable or Schedule
- Certificate Verification
- Login / Signup or Dashboard if authenticated

### Learner Navigation
Learner shell should expose:
- Dashboard
- My Learning
- Cohorts
- Notifications
- Certificates
- Profile or Account

### Admin Navigation
Admin shell should expose:
- Overview
- Courses
- Course Builder
- Learners
- Cohorts
- Payments
- Certificates
- Announcements

## Route Map
Use clear frontend route ownership. Suggested route map:

### Public
- `/`
- `/courses`
- `/course/:courseSlug`
- `/course/:courseSlug/lesson/:lessonSlug`
- `/login`
- `/signup`
- `/timetable`
- `/certificate-verify`
- `/certificate-verify/:certificateNumber`

### Learner
- `/dashboard`
- `/my-learning`
- `/my-learning/:courseSlug`
- `/my-learning/:courseSlug/lesson/:lessonSlug`
- `/cohorts`
- `/notifications`
- `/certificates`
- `/account`

### Admin
- `/admin`
- `/admin/courses`
- `/admin/courses/:courseId`
- `/admin/courses/:courseId/modules/:moduleId`
- `/admin/learners`
- `/admin/cohorts`
- `/admin/payments`
- `/admin/certificates`
- `/admin/announcements`

Note:
- If the current hosting setup requires hash routes, preserve deep-link behavior with `#/...`.
- If a proper history-based router is used, hosting config must support fallback routing.

## Public Frontend Requirements

### 1. Homepage
The homepage should look like a real programming-school landing page.

Required sections:
- Hero section
- Trust or value proposition section
- Featured learning model section
- Featured courses section
- Free self-paced vs paid cohort explanation
- Certification explanation
- Final CTA section

Hero requirements:
- Strong headline focused on practical programming education
- Subheadline clarifying that learning is free, cohort training and certification are paid
- Primary CTA: browse courses
- Secondary CTA: sign up or view dashboard

Featured courses section:
- Show real course logos
- Show course name, short description, duration, level, and category
- No price tags on general course cards
- CTA should be `View Course Outline` or `View Course`
- Secondary cohort CTA may open a custom modal

Content tone:
- Professional
- Modern
- Technical
- Not playful
- Not childish
- No emoji-driven design

### 2. Courses Catalog
This page is the public course directory.

Required features:
- Responsive grid
- Desktop: 3 courses per row
- Tablet: 2 courses per row
- Mobile: 1 course per row
- Filter by category
- Filter by level
- Clean results count

Each course card must show:
- Logo/icon
- Course title
- Short description
- Duration
- Level
- Category
- Free self-paced note
- Primary CTA: view course outline
- Secondary CTA: join paid cohort

### 3. Course Overview Page
This is the public and learner-facing course landing page.

Required sections:
- Breadcrumb
- Course hero
- Course metadata
- Learning objectives
- Access model explanation
- Course outline
- Module list
- Lesson list
- Paid cohort CTA

Course hero must include:
- Course logo
- Course title
- Description
- Duration
- Module count
- Lesson count
- Level
- Category
- Free learning badge

Access model block must state:
- Guests get preview access only
- Registered learners get full self-paced access
- Cohort training is paid
- Certification is paid

Module and lesson list requirements:
- Render modules from backend data
- Render lessons under each module
- Show locked vs available state
- Show lesson duration and lesson type
- Show completion status for logged-in learners when available
- Each available lesson should have `Open Lesson` or `Preview Lesson`

Primary CTA behavior:
- Guest user: open first accessible preview lesson
- Logged-in user: enroll in self-paced learning if needed, then open first accessible lesson
- If learner has progress, CTA should become `Continue Learning`

Secondary CTA behavior:
- Open a custom cohort modal, not a browser popup

### 4. Login and Signup
Auth pages should be simple, professional, and conversion-friendly.

Requirements:
- Clean card-based forms
- No clutter
- Clear distinction between login and signup
- Signup should allow users to select courses of interest
- Interest selection is preference data, not the main source of enrollment

Required form fields for signup:
- Full name
- Email
- Password
- Interested courses

After successful signup:
- Save auth state
- Redirect to learner dashboard or my learning

### 5. Certificate Verification Page
Public page where anyone can verify a certificate.

Requirements:
- Search form for certificate number
- Clean verified / not found states
- Verified state should show:
  - learner name
  - course
  - certificate number
  - issue date
  - cohort if applicable

## Learner Frontend Requirements

### 1. Learner Dashboard
This is the main post-login home for students.

It should contain:
- Welcome header
- My Learning summary
- Cohort summary
- Notifications summary
- Certificates summary
- Payment summary if relevant

Primary sections:
- My Learning
- My Cohorts
- Saved Interests
- Recent Notifications
- Certificates
- Stats

My Learning should show:
- Self-paced enrollments
- Course title
- Enrollment status
- Continue button

My Cohorts should show:
- Cohort name
- Linked course
- Instructor
- Start date
- Access course button

Saved Interests should show:
- Course interests selected during onboarding or later updates
- Easy transition from interest to actual learning

### 2. My Learning Page
This page is a more detailed learner course hub.

Required sections:
- Self-paced learning
- Paid cohort applications
- Enrolled cohorts
- Cohort calendar
- Saved interests

Required behaviors:
- Let learners manage course interests
- Show self-paced enrollments separately from paid cohort records
- Show cohort application and payment status
- Allow learners to continue learning from enrolled courses

Important rule:
- `My Learning` is based on real enrollments, not just interests

### 3. Lesson Player
This is the core learning screen.

It must be a true lesson workspace, not just a raw slide viewer.

Required layout:
- Lesson header
- Breadcrumb
- Course and module context
- Lesson content stage
- Previous / next lesson navigation
- Sidebar or meta panel
- Whiteboard area

Lesson header should show:
- Course name
- Module name
- Lesson title
- Lesson number
- Duration
- Status
- Access state

Lesson stage should:
- Render backend lesson content
- Support different content types such as hero, code, two-column, infographic, steps, and other structured lesson blocks
- Look like a professional learning presentation, not a debug screen

Progress behaviors:
- Logged-in learners should automatically move to `in progress` on lesson open
- Learners should be able to mark a lesson complete
- Progress state should persist via backend

Navigation behaviors:
- Previous lesson button
- Next lesson button
- Disabled state when navigation target does not exist

### 4. Whiteboard and Notes Workspace
This is a major product differentiator and must be preserved and improved.

The whiteboard should live inside the lesson player and should be lesson-specific.

Required capabilities:
- Large whiteboard canvas
- Pan and zoom
- Free drawing
- Highlighting
- Text objects
- Shapes
- Lines and arrows
- Code blocks
- Select and move objects
- Resize code blocks
- Color choices for writing and highlighting
- Persistent lesson-scoped save
- Export to PDF

Text and note behavior:
- Clicking the whiteboard in text mode should let the user start typing directly
- Do not use default browser popups for text or code entry
- Use custom inline editors

Highlighting behavior:
- At least 5 highlight colors
- Highlight color must visibly affect written text or drawn objects

Code block behavior:
- Add code blocks anywhere on the whiteboard
- Code blocks must be movable
- Code blocks must be resizable from edges
- Code blocks must support JavaScript and Python
- Code blocks must show output inside the code block area
- Running code should never depend on browser popups

Python support:
- Browser-based Python execution is acceptable for frontend v1 if implemented safely
- If Python execution is not fully local yet, the UI should still be designed to support it cleanly

Persistence rules:
- Whiteboard state is saved per learner per lesson
- Whiteboard must survive refresh and route changes
- If backend save fails, the frontend should still preserve local state and show sync status

### 5. Notifications Page
Required features:
- Notification list
- Read / unread state
- Mark one as read
- Mark all as read
- Empty state

### 6. Certificates Page
Required features:
- List issued certificates
- Print or download action if available
- Verify link
- Certificate eligibility messaging for courses not yet completed

### 7. Cohort Area
Required features:
- View cohort applications
- View payment status
- View approved or active cohorts
- View instructor, schedule, and start date
- Access linked course from cohort card

### 8. Account Page
Recommended for completeness:
- Name
- Email
- Course interests
- Password change
- Notification preferences if supported later

## Admin Frontend Requirements

### 1. Admin Overview
Must show high-level operational stats:
- Total learners
- Published courses
- Active cohorts
- Pending applications
- Pending payments
- Issued certificates

### 2. Courses Management
Admin must be able to:
- View all courses
- Create a course
- Edit course metadata
- Publish / unpublish a course
- View module and lesson counts

Course fields:
- Title
- Slug
- Description
- Level
- Category
- Objectives
- Outline
- Duration
- Logo or icon
- Preview percentage
- Published state

### 3. Course Builder
Admin needs a real content management flow.

Must support:
- Create modules
- Edit modules
- Reorder modules
- Create lessons inside modules
- Edit lesson metadata
- Reorder lessons
- Publish / unpublish lessons

Lesson fields:
- Title
- Slug
- Summary
- Type
- Estimated duration
- Structured content payload
- Resource attachments
- Published state

### 4. Learner Management
Admin should be able to:
- View learners
- Search learners
- View enrollments
- View cohort membership
- View progress summaries

### 5. Cohort Management
Admin should be able to:
- Create cohorts
- Assign course
- Set instructor
- Set schedule
- Set date range
- Review applications
- Approve or reject applications

### 6. Payment Management
Admin should be able to:
- View payment attempts
- View payment type
- Confirm or reject proof-based payments
- Review transaction references
- See which learner and course/cohort the payment belongs to

### 7. Certificate Management
Admin should be able to:
- View certificates
- Issue certificates
- Reissue or inspect certificate records
- Check learner eligibility

### 8. Announcements
Admin should be able to:
- Create announcement
- Target learners or cohorts if supported
- Publish announcement
- View announcement history

## Shared UI Components
The frontend should use a reusable component system.

Required shared components:
- Navbar
- Sidebar
- Breadcrumb
- Page hero
- Card
- Table
- Tabs
- Modal
- Drawer
- Empty state
- Loading skeleton
- Error state
- Status badge
- Progress bar
- Course card
- Module card
- Lesson row
- Notification item
- Payment status pill
- Cohort card
- Certificate card
- Whiteboard toolbar

## Visual Design Direction
The design should feel like a modern technical learning platform.

Visual rules:
- Clean and professional
- Strong typography
- Balanced whitespace
- Real course logos
- No emoji icons for courses
- Neutral base palette with a strong but controlled accent color
- Light mode first is acceptable for v1
- Subtle gradients and surfaces are fine
- Avoid generic purple-heavy AI-looking visuals

Suggested visual tone:
- Academic but modern
- Technical, not corporate-dry
- Premium enough to justify paid cohorts
- Serious enough for certificates and operations

## Responsive Requirements

### Desktop
- Full nav visible
- Course catalog at 3 columns
- Lesson player in multi-column layout
- Whiteboard large and comfortable

### Tablet
- Course catalog at 2 columns
- Some panels may stack
- Lesson player may switch to a vertical layout

### Mobile
- Course catalog at 1 column
- Nav collapses to menu
- Lesson layout stacks vertically
- Whiteboard remains usable
- Buttons and controls must remain touch-friendly

## Accessibility Requirements
- All interactive controls must be keyboard accessible
- Buttons should be buttons, links should be links
- No fake anchors with invalid `href`
- Modals must trap focus
- Forms must have labels
- Sufficient color contrast is required

## API Integration Expectations
The frontend should be built against backend-driven LMS data.

Current important endpoint groups:

### Public and Course Content
- `GET /courses`
- `GET /courses/slug/:slug`
- `GET /courses/slug/:slug/content`
- `GET /courses/slug/:slug/lessons/:lessonSlug`

### Auth
- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/verify`

### Learner
- `GET /student/enrollments`
- `GET /student/enrollments/self-paced`
- `POST /student/enrollments/self-paced`
- `GET /student/lesson-progress/course/:courseSlug`
- `GET /student/lesson-progress/lesson/:lessonId`
- `PUT /student/lesson-progress/lesson/:lessonId`
- `GET /student/whiteboard/lesson/:lessonId`
- `PUT /student/whiteboard/lesson/:lessonId`
- `GET /student/notifications`
- `PATCH /student/notifications/:notificationId/read`
- `PATCH /student/notifications/read-all`
- `GET /student/certificates`
- `GET /student/payments`

### Cohorts
- `GET /cohorts/course/:courseId`
- `POST /cohorts/applications`
- `GET /cohorts/applications/my`
- `POST /cohorts/:cohortId/enroll`

### Certificates
- `GET /certificates/verify/:certificateNumber`

### Admin
- `GET /admin/overview`
- `GET /admin/students`
- `GET /admin/courses`
- `POST /admin/courses`
- `PATCH /admin/courses/:courseId`
- `DELETE /admin/courses/:courseId`
- `POST /admin/courses/:courseId/publish`
- `GET /admin/cohorts`
- `GET /admin/cohort-applications`
- `PATCH /admin/cohort-applications/:applicationId`
- `GET /admin/payments`
- `PATCH /admin/payments/:paymentId`
- additional admin content-management routes should be added for modules and lessons

## Access Control Rules
- Guests can access public pages and preview lessons only.
- Logged-in learners can access learner routes.
- Admin users can access admin routes only.
- If a guest opens a locked lesson directly, show a clean locked-preview state with CTA to sign up.
- If a non-admin opens an admin route, redirect or show unauthorized state.

## Required States Per Page
Every major page must have:
- loading state
- empty state
- error state
- success state where relevant
- unauthorized or locked state where relevant
- not found state where relevant

## Behavior Requirements
- Refreshing a course or lesson page must keep the user on that page.
- The app should not bounce users back to the homepage on refresh.
- Route changes must scroll to top.
- Learner actions must feel explicit and polished.
- Payment steps should happen in custom UI flows, not through abrupt browser dialogs.
- Any confirmation UI should use custom modals.

## What Should Be Removed from the Old Frontend
- Price tags on general course cards
- Emoji course icons
- School-demo behavior where route handling is inconsistent
- Old direct raw-slide access as the primary learning flow
- Frontend-only hardcoded content logic as the long-term solution

## Target Frontend Folder Direction
Recommended organization:

```text
src/
  app/
  routes/
  layouts/
  features/
    public/
    auth/
    learner/
    admin/
    whiteboard/
    courses/
    payments/
    certificates/
  components/
  services/
  hooks/
  styles/
  utils/
```

## Acceptance Criteria
The frontend is considered complete when:

- A public visitor can browse courses and preview lesson content.
- A learner can sign up, select interests, enroll in self-paced learning, and continue lessons.
- Course overview pages show objectives, outline, modules, and lessons from backend data.
- Lesson pages support progress tracking and lesson-scoped whiteboard persistence.
- The whiteboard supports drawing, text, highlighting, code blocks, movement, resizing, and export.
- Cohort applications and payment states are visible to learners.
- Certificate verification works publicly.
- Admins can manage courses, cohorts, payments, and certificates from the frontend.
- The app is responsive across desktop, tablet, and mobile.
- The UI looks like a professional programming-school LMS.

## Suggested Build Order for Amazon Q
1. Build the route structure and layouts.
2. Build public pages: Home, Courses, Course Overview, Login, Signup, Certificate Verify.
3. Build learner shell: Dashboard, My Learning, Course Overview, Lesson Player.
4. Integrate backend content endpoints.
5. Reconnect lesson progress.
6. Reconnect lesson-scoped whiteboard.
7. Build cohort, notification, and certificate pages.
8. Build admin console pages.
9. Refine responsive behavior and states.
10. Polish design and accessibility.

## Final Instruction to the Builder
Do not build this as a generic online-course template. Build it as a professional programming-school LMS with a strong lesson workspace, clear free-vs-paid access model, backend-driven course structure, and a polished learner/admin experience.
