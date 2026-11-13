# ProgrammoCeuticals LMS API Contract

## Purpose
This document defines the API contract the frontend should use for the ProgrammoCeuticals LMS.

It covers:
- implemented backend endpoints and their real request/response shapes
- current inconsistencies the frontend must account for
- target LMS endpoints still required to complete the frontend
- canonical frontend DTOs so the UI can be developed cleanly

This file should be used together with:
- [frontend-spec.md](/Users/macbookpro/Desktop/ProgrammoCeuticals/school/frontend-spec.md:1)
- [plan.md](/Users/macbookpro/Desktop/ProgrammoCeuticals/school/plan.md:1)

## Base URL

Frontend env:

```env
REACT_APP_API_URL=http://localhost:5000
```

Backend route namespaces:

- `/auth`
- `/courses`
- `/cohorts`
- `/student`
- `/certificates`
- `/admin`

Health check:

```http
GET /
```

Response:

```json
{
  "message": "Cohort School API is running"
}
```

## Auth Rules

Protected endpoints require:

```http
Authorization: Bearer <jwt>
```

JWT user roles:
- `student`
- `admin`

Common auth errors:

```json
{ "message": "Access denied. No token provided." }
```

```json
{ "message": "Invalid token." }
```

Admin-only error:

```json
{ "message": "Access denied. Admin required." }
```

## Response and Error Conventions

### Common current pattern
Most endpoints return:

```json
{
  "message": "Human readable message",
  "error": "optional low-level error"
}
```

### Important inconsistency
The API is not fully normalized yet:

- public course endpoints are mostly normalized for frontend use
- learner LMS endpoints are mostly normalized
- admin endpoints often return raw Mongo-style fields such as `duration_weeks`, `preview_percent`, `is_published`
- some legacy student endpoints return raw documents

Frontend rule:
- build API adapters in the client
- do not let raw backend field naming leak throughout UI components

## Canonical Frontend DTOs

The frontend should internally normalize backend responses into the following shapes.

### SessionUser

```ts
type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  interestedCourses: string[];
};
```

### CourseSummary

```ts
type CourseSummary = {
  id: string;           // slug
  slug: string;
  mongoId?: string;     // _id when available
  name: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  durationWeeks: number;
  objectives: string[];
  outline: string[];
  color: string;
  iconKey: string;
  moduleCount: number;
  lessonCount: number;
  nextCohortStartDate: string | null;
  access: {
    previewPercent: number;
    fullAccessRequiresAuth: boolean;
    hasFullAccess: boolean;
  };
  payment: {
    learning: "free";
    certification: "paid";
    cohortTraining: "paid";
  };
};
```

### ModuleSummary

```ts
type ModuleSummary = {
  id: string;
  title: string;
  slug: string;
  description: string;
  orderIndex: number;
  lessonCount: number;
  estimatedMinutes: number;
  lessons: LessonSummary[];
};
```

### LessonSummary

```ts
type LessonSummary = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  lessonType: string;
  orderIndex: number;
  lessonNumber: number;
  estimatedDurationMinutes: number;
  slideCount: number;
  sourceSlideId: number | null;
  isLocked: boolean;
};
```

### LessonDetailResponse

```ts
type LessonDetailResponse = {
  course: CourseSummary;
  module: {
    id: string;
    title: string;
    slug: string;
    orderIndex: number;
  };
  lesson: {
    id: string;
    title: string;
    slug: string;
    lessonType: string;
    summary: string;
    orderIndex: number;
    lessonNumber: number;
    estimatedDurationMinutes: number;
    sourceSlideId: number | null;
    content: Record<string, unknown>;
  };
  navigation: {
    previousLessonSlug: string | null;
    nextLessonSlug: string | null;
  };
  access: {
    isPreviewMode: boolean;
    hasFullAccess: boolean;
    previewPercent: number;
    totalLessons: number;
    accessibleLessons: number;
  };
  contentSource: "database" | "generated";
};
```

### SelfPacedEnrollment

```ts
type SelfPacedEnrollment = {
  id: string;
  accessType: "self_paced";
  status: "active" | "completed" | "archived" | "dropped";
  createdAt: string;
  updatedAt: string;
  course: {
    id: string;
    title: string;
    slug: string;
    description: string;
    level: string;
    category: string;
  } | null;
};
```

### LessonProgress

```ts
type LessonProgress = {
  id: string;
  status: "not_started" | "in_progress" | "completed";
  percentComplete: number;
  lastPosition: Record<string, unknown>;
  startedAt: string;
  completedAt: string | null;
  updatedAt: string;
  lesson: {
    id: string;
    title: string;
    slug: string;
    moduleId: string;
    courseId: string;
  } | null;
  module: {
    id: string;
    title: string;
  } | null;
  course: {
    id: string;
    title: string;
    slug: string;
  } | null;
};
```

### WhiteboardSnapshot

```ts
type WhiteboardSnapshot = {
  objects: unknown[];
  stageScale: number;
  stagePosition: {
    x: number;
    y: number;
  };
};
```

### WhiteboardNote

```ts
type WhiteboardNote = {
  id: string;
  lessonId?: string | null;
  courseId?: string;
  slideIndex?: number | null;
  snapshot: WhiteboardSnapshot;
  updatedAt: string;
};
```

### CohortApplication

```ts
type CohortApplication = {
  id: string;
  type: "cohort_training" | "certification";
  status: "new" | "contacted" | "admitted" | "closed";
  paymentStatus: "pending" | "confirmed" | "waived";
  fullName: string;
  email: string;
  phone: string;
  notes: string;
  adminNotes: string;
  preferredStartDate: string | null;
  source: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  course: {
    id: string | null;
    slug: string;
    title: string;
  };
  cohort: {
    id: string | null;
    name: string;
  };
};
```

### PaymentRecord

```ts
type PaymentRecord = {
  id: string;
  type: "cohort_training" | "certification";
  amount: number;
  currency: string;
  reference: string;
  status: "initiated" | "pending_review" | "confirmed" | "failed" | "refunded";
  method: "bank_transfer" | "card" | "cash" | "other";
  provider: "manual" | "paystack";
  providerStatus: string;
  authorizationUrl: string;
  accessCode: string;
  failureReason: string;
  paidAt: string | null;
  verifiedAt: string | null;
  proofReference: string;
  proofNote: string;
  proofSubmittedAt: string | null;
  confirmedAt: string | null;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
  application: {
    id: string;
    status: string;
    paymentStatus: string;
    courseTitle: string;
    courseSlug: string;
    cohortName: string;
  } | null;
  enrollment: {
    id: string;
    status: string;
  } | null;
};
```

### NotificationItem

```ts
type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  readAt: string | null;
  meta: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};
```

### CertificateRecord

```ts
type CertificateRecord = {
  id?: string;
  certificateNumber: string;
  status?: "issued" | "revoked";
  issuedAt: string;
  course: {
    id?: string;
    title: string;
    slug: string;
  } | null;
  cohort: {
    id?: string;
    name: string;
  } | null;
  student?: {
    name: string;
    email: string;
  } | null;
};
```

## Current Endpoint Inventory

### Status Key
- `implemented`: safe to consume now
- `legacy`: available but transitional; avoid for final LMS where possible
- `planned`: not implemented yet; frontend may mock against these

---

## 1. Auth Endpoints

### POST `/auth/signup`
Status: `implemented`

Request:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "strong-password",
  "interestedCourses": ["python", "javascript"]
}
```

Success `201`:

```json
{
  "token": "jwt-token",
  "user": {
    "id": "661111111111111111111111",
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "role": "student",
    "interestedCourses": ["python", "javascript"]
  }
}
```

Error `400`:

```json
{ "message": "User already exists" }
```

### POST `/auth/login`
Status: `implemented`

Request:

```json
{
  "email": "ada@example.com",
  "password": "strong-password"
}
```

Success `200`:

```json
{
  "token": "jwt-token",
  "user": {
    "id": "661111111111111111111111",
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "role": "student",
    "interestedCourses": ["python", "javascript"]
  }
}
```

Error `400`:

```json
{ "message": "Invalid credentials" }
```

### GET `/auth/verify`
Status: `implemented`
Auth: required

Success `200`:

```json
{
  "user": {
    "id": "661111111111111111111111",
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "role": "student",
    "interestedCourses": ["python", "javascript"]
  }
}
```

---

## 2. Public Course Endpoints

### GET `/courses`
Status: `implemented`
Auth: optional

Important:
- this endpoint returns an array, not an object wrapper
- if a valid token is provided, `course.access.hasFullAccess` becomes `true`

Success `200`:

```json
[
  {
    "_id": "662222222222222222222222",
    "id": "python",
    "slug": "python",
    "name": "Python Programming",
    "title": "Python Programming",
    "description": "Master Python fundamentals and advanced concepts.",
    "category": "Programming Languages",
    "level": "Beginner",
    "duration": "12 weeks",
    "durationWeeks": 12,
    "objectives": ["Write clean Python programs with confidence"],
    "outline": ["Python syntax and variables"],
    "color": "#3776ab",
    "iconKey": "python",
    "nextCohortStartDate": "2026-05-05T00:00:00.000Z",
    "moduleCount": 0,
    "lessonCount": 0,
    "access": {
      "previewPercent": 20,
      "fullAccessRequiresAuth": true,
      "hasFullAccess": false
    },
    "payment": {
      "learning": "free",
      "certification": "paid",
      "cohortTraining": "paid"
    }
  }
]
```

### GET `/courses/slug/:slug`
Status: `implemented`
Auth: optional

Success `200`:

```json
{
  "_id": "662222222222222222222222",
  "id": "python",
  "slug": "python",
  "name": "Python Programming",
  "title": "Python Programming",
  "description": "Master Python fundamentals and advanced concepts.",
  "category": "Programming Languages",
  "level": "Beginner",
  "duration": "12 weeks",
  "durationWeeks": 12,
  "objectives": ["Write clean Python programs with confidence"],
  "outline": ["Python syntax and variables"],
  "color": "#3776ab",
  "iconKey": "python",
  "nextCohortStartDate": "2026-05-05T00:00:00.000Z",
  "moduleCount": 4,
  "lessonCount": 18,
  "access": {
    "previewPercent": 20,
    "fullAccessRequiresAuth": true,
    "hasFullAccess": false
  },
  "payment": {
    "learning": "free",
    "certification": "paid",
    "cohortTraining": "paid"
  }
}
```

### GET `/courses/slug/:slug/content`
Status: `implemented`
Auth: optional

Purpose:
- use this for the course overview page

Success `200`:

```json
{
  "course": {
    "_id": "662222222222222222222222",
    "id": "python",
    "slug": "python",
    "name": "Python Programming",
    "title": "Python Programming",
    "description": "Master Python fundamentals and advanced concepts.",
    "category": "Programming Languages",
    "level": "Beginner",
    "duration": "12 weeks",
    "durationWeeks": 12,
    "objectives": ["Write clean Python programs with confidence"],
    "outline": ["Python syntax and variables"],
    "color": "#3776ab",
    "iconKey": "python",
    "nextCohortStartDate": "2026-05-05T00:00:00.000Z",
    "moduleCount": 4,
    "lessonCount": 18,
    "access": {
      "previewPercent": 20,
      "fullAccessRequiresAuth": true,
      "hasFullAccess": false
    },
    "payment": {
      "learning": "free",
      "certification": "paid",
      "cohortTraining": "paid"
    }
  },
  "modules": [
    {
      "id": "663333333333333333333331",
      "title": "Python Basics",
      "slug": "module-1-python-basics",
      "description": "",
      "orderIndex": 1,
      "lessonCount": 5,
      "estimatedMinutes": 25,
      "lessons": [
        {
          "id": "664444444444444444444441",
          "title": "Introduction to Python",
          "slug": "introduction-to-python-1",
          "summary": "Getting started with Python",
          "lessonType": "hero",
          "orderIndex": 1,
          "estimatedDurationMinutes": 5,
          "slideCount": 1,
          "sourceSlideId": 1,
          "isLocked": false,
          "lessonNumber": 1
        }
      ]
    }
  ],
  "access": {
    "isPreviewMode": true,
    "hasFullAccess": false,
    "previewPercent": 20,
    "totalLessons": 18,
    "accessibleLessons": 4
  },
  "contentSource": "database"
}
```

### GET `/courses/slug/:slug/lessons/:lessonSlug`
Status: `implemented`
Auth: optional

Purpose:
- use this for the lesson player

Success `200`:

```json
{
  "course": {
    "_id": "662222222222222222222222",
    "id": "python",
    "slug": "python",
    "name": "Python Programming",
    "title": "Python Programming",
    "description": "Master Python fundamentals and advanced concepts.",
    "category": "Programming Languages",
    "level": "Beginner",
    "duration": "12 weeks",
    "durationWeeks": 12,
    "objectives": [],
    "outline": [],
    "color": "#3776ab",
    "iconKey": "python",
    "nextCohortStartDate": null,
    "moduleCount": 4,
    "lessonCount": 18,
    "access": {
      "previewPercent": 20,
      "fullAccessRequiresAuth": true,
      "hasFullAccess": false
    },
    "payment": {
      "learning": "free",
      "certification": "paid",
      "cohortTraining": "paid"
    }
  },
  "module": {
    "id": "663333333333333333333331",
    "title": "Python Basics",
    "slug": "module-1-python-basics",
    "orderIndex": 1
  },
  "lesson": {
    "id": "664444444444444444444441",
    "title": "Introduction to Python",
    "slug": "introduction-to-python-1",
    "lessonType": "hero",
    "summary": "Getting started with Python",
    "orderIndex": 1,
    "lessonNumber": 1,
    "estimatedDurationMinutes": 5,
    "sourceSlideId": 1,
    "content": {
      "id": 1,
      "moduleId": 1,
      "moduleTitle": "Python Basics",
      "title": "Introduction to Python",
      "type": "hero",
      "content": {}
    }
  },
  "navigation": {
    "previousLessonSlug": null,
    "nextLessonSlug": "python-installation-2"
  },
  "access": {
    "isPreviewMode": true,
    "hasFullAccess": false,
    "previewPercent": 20,
    "totalLessons": 18,
    "accessibleLessons": 4
  },
  "contentSource": "database"
}
```

Locked preview response `403`:

```json
{
  "message": "This lesson is locked in preview mode.",
  "access": {
    "isPreviewMode": true,
    "hasFullAccess": false,
    "previewPercent": 20,
    "totalLessons": 18,
    "accessibleLessons": 4
  }
}
```

### GET `/courses/slug/:slug/slides`
Status: `legacy`
Auth: optional

Purpose:
- old slide viewer
- do not use for final LMS unless supporting the old `Course.js`

Response:

```json
{
  "course": { "...": "same normalized course object" },
  "slides": [
    {
      "id": 1,
      "moduleId": 1,
      "moduleTitle": "Python Basics",
      "title": "Introduction to Python",
      "type": "hero",
      "content": {}
    }
  ],
  "access": {
    "isPreviewMode": true,
    "hasFullAccess": false,
    "previewPercent": 20,
    "totalSlides": 30,
    "accessibleSlides": 6
  }
}
```

---

## 3. Cohort Endpoints

### GET `/cohorts/course/:courseId`
Status: `implemented`
Auth: not required

Important:
- `courseId` here is the Mongo `_id`, not the course slug
- response shape is closer to raw cohort documents with added counts

Success `200`:

```json
{
  "cohorts": [
    {
      "_id": "665555555555555555555551",
      "course_id": {
        "_id": "662222222222222222222222",
        "title": "Python Programming"
      },
      "name": "Python May 2026 Cohort",
      "start_date": "2026-05-05T00:00:00.000Z",
      "end_date": "2026-07-28T00:00:00.000Z",
      "max_students": 25,
      "duration_weeks": 12,
      "instructor": "ProgrammoCeuticals Faculty",
      "schedule": {
        "days_per_week": 3,
        "hours_per_session": 2,
        "time_slot": "6:00 PM WAT"
      },
      "status": "upcoming",
      "enrollment_count": 10,
      "available_slots": 15
    }
  ]
}
```

### POST `/cohorts/applications`
Status: `implemented`
Auth: optional

Request:

```json
{
  "applicationType": "cohort_training",
  "fullName": "Ada Lovelace",
  "email": "ada@example.com",
  "phone": "+2348000000000",
  "preferredStartDate": "2026-05-05",
  "notes": "Interested in the evening cohort.",
  "sourcePage": "#/course-outline/python",
  "courseSlug": "python",
  "cohortId": "665555555555555555555551"
}
```

Success `201`:

```json
{
  "application": {
    "id": "666666666666666666666661",
    "type": "cohort_training",
    "status": "new",
    "paymentStatus": "pending",
    "fullName": "Ada Lovelace",
    "email": "ada@example.com",
    "phone": "+2348000000000",
    "notes": "Interested in the evening cohort.",
    "adminNotes": "",
    "preferredStartDate": "2026-05-05T00:00:00.000Z",
    "source": "#/course-outline/python",
    "createdAt": "2026-04-16T10:00:00.000Z",
    "updatedAt": "2026-04-16T10:00:00.000Z",
    "user": null,
    "course": {
      "id": "662222222222222222222222",
      "slug": "python",
      "title": "Python Programming"
    },
    "cohort": {
      "id": "665555555555555555555551",
      "name": "Python May 2026 Cohort"
    }
  }
}
```

### GET `/cohorts/applications/my`
Status: `implemented`
Auth: required

Success `200`:

```json
{
  "applications": [
    {
      "id": "666666666666666666666661",
      "type": "cohort_training",
      "status": "new",
      "paymentStatus": "pending",
      "fullName": "Ada Lovelace",
      "email": "ada@example.com",
      "phone": "+2348000000000",
      "notes": "Interested in the evening cohort.",
      "adminNotes": "",
      "preferredStartDate": "2026-05-05T00:00:00.000Z",
      "source": "#/course-outline/python",
      "createdAt": "2026-04-16T10:00:00.000Z",
      "updatedAt": "2026-04-16T10:00:00.000Z",
      "user": {
        "id": "661111111111111111111111",
        "name": "Ada Lovelace",
        "email": "ada@example.com"
      },
      "course": {
        "id": "662222222222222222222222",
        "slug": "python",
        "title": "Python Programming"
      },
      "cohort": {
        "id": "665555555555555555555551",
        "name": "Python May 2026 Cohort"
      }
    }
  ]
}
```

### POST `/cohorts/:cohortId/enroll`
Status: `implemented`
Auth: required

Purpose:
- learner self-enrollment into a cohort
- still basic

Success `201`:

```json
{
  "message": "Successfully enrolled in cohort",
  "enrollment": {
    "_id": "667777777777777777777771",
    "user_id": "661111111111111111111111",
    "cohort_id": "665555555555555555555551",
    "createdAt": "2026-04-16T10:00:00.000Z",
    "updatedAt": "2026-04-16T10:00:00.000Z"
  }
}
```

---

## 4. Learner Endpoints

### GET `/student/enrollments/self-paced`
Status: `implemented`
Auth: required

Success `200`:

```json
{
  "enrollments": [
    {
      "id": "668888888888888888888881",
      "accessType": "self_paced",
      "status": "active",
      "createdAt": "2026-04-16T10:00:00.000Z",
      "updatedAt": "2026-04-16T10:00:00.000Z",
      "course": {
        "id": "662222222222222222222222",
        "title": "Python Programming",
        "slug": "python",
        "description": "Master Python fundamentals and advanced concepts.",
        "level": "Beginner",
        "category": "programming"
      }
    }
  ]
}
```

Note:
- `course.category` here is raw database category, usually `programming` or `basic`
- frontend should normalize labels for display

### POST `/student/enrollments/self-paced`
Status: `implemented`
Auth: required

Request:

```json
{
  "courseSlug": "python"
}
```

Alternative:

```json
{
  "courseId": "662222222222222222222222"
}
```

Success `201`:

```json
{
  "enrollment": {
    "id": "668888888888888888888881",
    "accessType": "self_paced",
    "status": "active",
    "createdAt": "2026-04-16T10:00:00.000Z",
    "updatedAt": "2026-04-16T10:00:00.000Z",
    "course": {
      "id": "662222222222222222222222",
      "title": "Python Programming",
      "slug": "python",
      "description": "Master Python fundamentals and advanced concepts.",
      "level": "Beginner",
      "category": "programming"
    }
  }
}
```

Already enrolled success `200`:

```json
{
  "enrollment": {
    "id": "668888888888888888888881",
    "accessType": "self_paced",
    "status": "active",
    "createdAt": "2026-04-16T10:00:00.000Z",
    "updatedAt": "2026-04-16T10:00:00.000Z",
    "course": {
      "id": "662222222222222222222222",
      "title": "Python Programming",
      "slug": "python",
      "description": "Master Python fundamentals and advanced concepts.",
      "level": "Beginner",
      "category": "programming"
    }
  },
  "alreadyEnrolled": true
}
```

### GET `/student/lesson-progress/course/:courseSlug`
Status: `implemented`
Auth: required

Success `200`:

```json
{
  "course": {
    "id": "662222222222222222222222",
    "title": "Python Programming",
    "slug": "python"
  },
  "progress": [
    {
      "id": "669999999999999999999991",
      "status": "in_progress",
      "percentComplete": 30,
      "lastPosition": {
        "openedAt": "2026-04-16T10:00:00.000Z",
        "viewed": true
      },
      "startedAt": "2026-04-16T10:00:00.000Z",
      "completedAt": null,
      "updatedAt": "2026-04-16T10:00:00.000Z",
      "lesson": {
        "id": "664444444444444444444441",
        "title": "Introduction to Python",
        "slug": "introduction-to-python-1",
        "moduleId": "663333333333333333333331",
        "courseId": "662222222222222222222222"
      },
      "module": {
        "id": "663333333333333333333331",
        "title": "Python Basics"
      },
      "course": {
        "id": "662222222222222222222222",
        "title": "Python Programming",
        "slug": "python"
      }
    }
  ]
}
```

### GET `/student/lesson-progress/lesson/:lessonId`
Status: `implemented`
Auth: required

Success `200`:

```json
{
  "progress": {
    "id": "669999999999999999999991",
    "status": "in_progress",
    "percentComplete": 30,
    "lastPosition": {
      "openedAt": "2026-04-16T10:00:00.000Z",
      "viewed": true
    },
    "startedAt": "2026-04-16T10:00:00.000Z",
    "completedAt": null,
    "updatedAt": "2026-04-16T10:00:00.000Z",
    "lesson": {
      "id": "664444444444444444444441",
      "title": "Introduction to Python",
      "slug": "introduction-to-python-1",
      "moduleId": "663333333333333333333331",
      "courseId": "662222222222222222222222"
    },
    "module": {
      "id": "663333333333333333333331",
      "title": "Python Basics"
    },
    "course": {
      "id": "662222222222222222222222",
      "title": "Python Programming",
      "slug": "python"
    }
  }
}
```

If no record exists:

```json
{
  "progress": null
}
```

### PUT `/student/lesson-progress/lesson/:lessonId`
Status: `implemented`
Auth: required

Request:

```json
{
  "status": "completed",
  "percentComplete": 100,
  "lastPosition": {
    "viewed": true,
    "completedAt": "2026-04-16T10:00:00.000Z"
  }
}
```

Allowed statuses:
- `not_started`
- `in_progress`
- `completed`

Success `200`:

```json
{
  "progress": {
    "id": "669999999999999999999991",
    "status": "completed",
    "percentComplete": 100,
    "lastPosition": {
      "viewed": true,
      "completedAt": "2026-04-16T10:00:00.000Z"
    },
    "startedAt": "2026-04-16T10:00:00.000Z",
    "completedAt": "2026-04-16T10:05:00.000Z",
    "updatedAt": "2026-04-16T10:05:00.000Z",
    "lesson": {
      "id": "664444444444444444444441",
      "title": "Introduction to Python",
      "slug": "introduction-to-python-1",
      "moduleId": "663333333333333333333331",
      "courseId": "662222222222222222222222"
    },
    "module": {
      "id": "663333333333333333333331",
      "title": "Python Basics"
    },
    "course": {
      "id": "662222222222222222222222",
      "title": "Python Programming",
      "slug": "python"
    }
  }
}
```

### GET `/student/whiteboard/lesson/:lessonId`
Status: `implemented`
Auth: required

Success `200`:

```json
{
  "note": {
    "id": "66aaaaaaaaaaaaaaaaaaaaa1",
    "lessonId": "664444444444444444444441",
    "snapshot": {
      "objects": [],
      "stageScale": 0.75,
      "stagePosition": {
        "x": 60,
        "y": 40
      }
    },
    "updatedAt": "2026-04-16T10:00:00.000Z"
  }
}
```

If no note exists:

```json
{
  "note": null
}
```

### PUT `/student/whiteboard/lesson/:lessonId`
Status: `implemented`
Auth: required

Request:

```json
{
  "snapshot": {
    "objects": [],
    "stageScale": 1,
    "stagePosition": {
      "x": 100,
      "y": 80
    }
  }
}
```

Success `200`:

```json
{
  "note": {
    "id": "66aaaaaaaaaaaaaaaaaaaaa1",
    "lessonId": "664444444444444444444441",
    "snapshot": {
      "objects": [],
      "stageScale": 1,
      "stagePosition": {
        "x": 100,
        "y": 80
      }
    },
    "updatedAt": "2026-04-16T10:10:00.000Z"
  }
}
```

### GET `/student/notifications?limit=30`
Status: `implemented`
Auth: required

Success `200`:

```json
{
  "notifications": [
    {
      "id": "66bbbbbbbbbbbbbbbbbbbbb1",
      "type": "payment",
      "title": "Payment initiated",
      "message": "Your payment request has been created.",
      "isRead": false,
      "readAt": null,
      "meta": {
        "paymentId": "66ccccccccccccccccccccc1"
      },
      "createdAt": "2026-04-16T10:00:00.000Z",
      "updatedAt": "2026-04-16T10:00:00.000Z"
    }
  ],
  "unreadCount": 3
}
```

### PATCH `/student/notifications/:id/read`
Status: `implemented`
Auth: required

Success `200`:

```json
{
  "notification": {
    "id": "66bbbbbbbbbbbbbbbbbbbbb1",
    "type": "payment",
    "title": "Payment initiated",
    "message": "Your payment request has been created.",
    "isRead": true,
    "readAt": "2026-04-16T10:05:00.000Z",
    "meta": {},
    "createdAt": "2026-04-16T10:00:00.000Z",
    "updatedAt": "2026-04-16T10:05:00.000Z"
  }
}
```

### PATCH `/student/notifications/read-all`
Status: `implemented`
Auth: required

Success `200`:

```json
{
  "message": "Notifications marked as read."
}
```

### GET `/student/certificates`
Status: `implemented`
Auth: required

Success `200`:

```json
{
  "certificates": [
    {
      "id": "66ddddddddddddddddddddd1",
      "certificateNumber": "PC-2026-123456-ABCDEF",
      "issuedAt": "2026-04-16T10:00:00.000Z",
      "course": {
        "id": "662222222222222222222222",
        "title": "Python Programming",
        "slug": "python"
      },
      "cohort": {
        "id": "665555555555555555555551",
        "name": "Python May 2026 Cohort"
      }
    }
  ]
}
```

### PATCH `/student/interests`
Status: `implemented`
Auth: required

Request:

```json
{
  "interestedCourses": ["python", "javascript"]
}
```

Success `200`:

```json
{
  "user": {
    "id": "661111111111111111111111",
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "role": "student",
    "interestedCourses": ["python", "javascript"]
  }
}
```

### GET `/student/payments`
Status: `implemented`
Auth: required

Optional query:
- `type=cohort_training`
- `type=certification`

Success `200`:

```json
{
  "payments": [
    {
      "id": "66ccccccccccccccccccccc1",
      "type": "cohort_training",
      "amount": 100000,
      "currency": "NGN",
      "reference": "PCP-COH-12345678-ABCDE",
      "status": "initiated",
      "method": "bank_transfer",
      "provider": "manual",
      "providerStatus": "",
      "authorizationUrl": "",
      "accessCode": "",
      "failureReason": "",
      "paidAt": null,
      "verifiedAt": null,
      "proofReference": "",
      "proofNote": "",
      "proofSubmittedAt": null,
      "confirmedAt": null,
      "adminNotes": "",
      "createdAt": "2026-04-16T10:00:00.000Z",
      "updatedAt": "2026-04-16T10:00:00.000Z",
      "application": {
        "id": "666666666666666666666661",
        "status": "new",
        "paymentStatus": "pending",
        "courseTitle": "Python Programming",
        "courseSlug": "python",
        "cohortName": "Python May 2026 Cohort"
      },
      "enrollment": null
    }
  ],
  "pricing": {
    "cohort_training": 100000,
    "certification": 50000
  },
  "instructions": {
    "bankName": "ProgrammoCeuticals Bank",
    "accountName": "ProgrammoCeuticals Ltd",
    "accountNumber": "0001234567",
    "currency": "NGN",
    "note": "Use your payment reference as transfer narration."
  }
}
```

### POST `/student/payments/initiate`
Status: `implemented`
Auth: required

#### Cohort training request

```json
{
  "type": "cohort_training",
  "method": "bank_transfer",
  "provider": "manual",
  "applicationId": "666666666666666666666661"
}
```

#### Certification request

```json
{
  "type": "certification",
  "method": "card",
  "provider": "paystack",
  "enrollmentId": "667777777777777777777771"
}
```

Success `201` or `200 if existing`:

```json
{
  "payment": {
    "id": "66ccccccccccccccccccccc1",
    "type": "cohort_training",
    "amount": 100000,
    "currency": "NGN",
    "reference": "PCP-COH-12345678-ABCDE",
    "status": "initiated",
    "method": "bank_transfer",
    "provider": "manual",
    "providerStatus": "",
    "authorizationUrl": "",
    "accessCode": "",
    "failureReason": "",
    "paidAt": null,
    "verifiedAt": null,
    "proofReference": "",
    "proofNote": "",
    "proofSubmittedAt": null,
    "confirmedAt": null,
    "adminNotes": "",
    "createdAt": "2026-04-16T10:00:00.000Z",
    "updatedAt": "2026-04-16T10:00:00.000Z",
    "application": {
      "id": "666666666666666666666661",
      "status": "new",
      "paymentStatus": "pending",
      "courseTitle": "Python Programming",
      "courseSlug": "python",
      "cohortName": "Python May 2026 Cohort"
    },
    "enrollment": null
  },
  "existing": false,
  "authorization_url": "https://checkout.paystack.com/...",
  "access_code": "paystack-code",
  "instructions": {
    "bankName": "ProgrammoCeuticals Bank",
    "accountName": "ProgrammoCeuticals Ltd",
    "accountNumber": "0001234567",
    "currency": "NGN",
    "note": "Use your payment reference as transfer narration."
  },
  "pricing": {
    "cohort_training": 100000,
    "certification": 50000
  }
}
```

### GET `/student/payments/verify/:reference`
Status: `implemented`
Auth: required

Purpose:
- verify paystack payments only

Success `200`:

```json
{
  "verified": true,
  "payment": {
    "id": "66ccccccccccccccccccccc1",
    "type": "cohort_training",
    "amount": 100000,
    "currency": "NGN",
    "reference": "PCP-COH-12345678-ABCDE",
    "status": "confirmed",
    "method": "card",
    "provider": "paystack",
    "providerStatus": "success",
    "authorizationUrl": "https://checkout.paystack.com/...",
    "accessCode": "paystack-code",
    "failureReason": "",
    "paidAt": "2026-04-16T10:05:00.000Z",
    "verifiedAt": "2026-04-16T10:06:00.000Z",
    "proofReference": "",
    "proofNote": "",
    "proofSubmittedAt": "2026-04-16T10:06:00.000Z",
    "confirmedAt": "2026-04-16T10:06:00.000Z",
    "adminNotes": "",
    "createdAt": "2026-04-16T10:00:00.000Z",
    "updatedAt": "2026-04-16T10:06:00.000Z",
    "application": {
      "id": "666666666666666666666661",
      "status": "new",
      "paymentStatus": "confirmed",
      "courseTitle": "Python Programming",
      "courseSlug": "python",
      "cohortName": "Python May 2026 Cohort"
    },
    "enrollment": null
  }
}
```

Failure `400`:

```json
{
  "verified": false,
  "message": "Payment not successful.",
  "payment": {
    "id": "66ccccccccccccccccccccc1",
    "status": "failed",
    "reference": "PCP-COH-12345678-ABCDE"
  }
}
```

### PATCH `/student/payments/:paymentId/proof`
Status: `implemented`
Auth: required

Request:

```json
{
  "method": "bank_transfer",
  "transactionReference": "TRX123456789",
  "note": "Paid from GTBank mobile app"
}
```

Success `200`:

```json
{
  "payment": {
    "id": "66ccccccccccccccccccccc1",
    "type": "cohort_training",
    "amount": 100000,
    "currency": "NGN",
    "reference": "PCP-COH-12345678-ABCDE",
    "status": "pending_review",
    "method": "bank_transfer",
    "provider": "manual",
    "providerStatus": "",
    "authorizationUrl": "",
    "accessCode": "",
    "failureReason": "",
    "paidAt": null,
    "verifiedAt": null,
    "proofReference": "TRX123456789",
    "proofNote": "Paid from GTBank mobile app",
    "proofSubmittedAt": "2026-04-16T10:05:00.000Z",
    "confirmedAt": null,
    "adminNotes": "",
    "createdAt": "2026-04-16T10:00:00.000Z",
    "updatedAt": "2026-04-16T10:05:00.000Z",
    "application": {
      "id": "666666666666666666666661",
      "status": "new",
      "paymentStatus": "pending",
      "courseTitle": "Python Programming",
      "courseSlug": "python",
      "cohortName": "Python May 2026 Cohort"
    },
    "enrollment": null
  }
}
```

### GET `/student/enrollments`
Status: `implemented`
Auth: required
Type: `legacy but still used for cohorts`

Important:
- this returns raw enrollment documents with populated `cohort_id` and nested `course_id`
- use for current cohort displays only

### GET `/student/dashboard`
Status: `legacy`
Auth: required

Important:
- cohort-centric
- not suitable as final LMS dashboard

### GET `/student/schedule`
Status: `legacy`
Auth: required

### GET `/student/materials`
Status: `legacy`
Auth: required

### GET `/student/progress`
Status: `legacy`
Auth: required

### GET `/student/progress/:courseId`
Status: `legacy`
Auth: required

### POST `/student/progress`
Status: `legacy`
Auth: required

### GET `/student/whiteboard/:courseId/:slideIndex`
Status: `legacy`
Auth: required

### PUT `/student/whiteboard/:courseId/:slideIndex`
Status: `legacy`
Auth: required

---

## 5. Certificate Verification Endpoints

### GET `/certificates/verify/:certificateNumber`
Status: `implemented`

### GET `/certificates/verify?number=...`
Status: `implemented`

Success `200`:

```json
{
  "verified": true,
  "message": "Certificate is valid.",
  "certificate": {
    "certificateNumber": "PC-2026-123456-ABCDEF",
    "status": "issued",
    "issuedAt": "2026-04-16T10:00:00.000Z",
    "student": {
      "name": "Ada Lovelace",
      "email": "ada@example.com"
    },
    "course": {
      "title": "Python Programming",
      "slug": "python"
    },
    "cohort": {
      "name": "Python May 2026 Cohort"
    }
  }
}
```

Not found `404`:

```json
{
  "verified": false,
  "message": "Certificate record not found."
}
```

Inactive `200`:

```json
{
  "verified": false,
  "message": "Certificate record exists but is not active.",
  "certificate": {
    "certificateNumber": "PC-2026-123456-ABCDEF",
    "status": "revoked",
    "issuedAt": "2026-04-16T10:00:00.000Z",
    "student": {
      "name": "Ada Lovelace",
      "email": "ada@example.com"
    },
    "course": {
      "title": "Python Programming",
      "slug": "python"
    },
    "cohort": {
      "name": "Python May 2026 Cohort"
    }
  }
}
```

---

## 6. Admin Endpoints

## Important Admin Contract Note
Most admin endpoints are implemented now but are not fully normalized. They often return raw Mongo field names like:

- `duration_weeks`
- `preview_percent`
- `is_published`
- `course_id`

Frontend rule:
- create admin adapters in the API layer
- map raw fields to stable frontend types

### GET `/admin/overview`
Status: `implemented`
Auth: admin

Success `200`:

```json
{
  "overview": {
    "totalStudents": 140,
    "totalCourses": 15,
    "publishedCourses": 15,
    "cohorts": {
      "upcoming": 4,
      "active": 2,
      "completed": 12
    },
    "totalEnrollments": 210,
    "cohortApplications": {
      "open": 8
    },
    "payments": {
      "pendingReview": 3
    }
  }
}
```

### GET `/admin/students`
Status: `implemented`
Auth: admin

Success `200`:

```json
{
  "students": [
    {
      "_id": "661111111111111111111111",
      "id": "661111111111111111111111",
      "name": "Ada Lovelace",
      "email": "ada@example.com",
      "interestedCourses": ["python", "javascript"],
      "createdAt": "2026-04-16T10:00:00.000Z",
      "enrollments": {
        "total": 3,
        "active": 2,
        "completed": 1
      }
    }
  ]
}
```

### GET `/admin/courses`
Status: `implemented`
Auth: admin

Current response:

```json
{
  "courses": [
    {
      "_id": "662222222222222222222222",
      "title": "Python Programming",
      "category": "programming",
      "level": "Beginner",
      "description": "Master Python fundamentals and advanced concepts.",
      "slug": "python",
      "duration_weeks": 12,
      "objectives": ["Write clean Python programs with confidence"],
      "outline": ["Python syntax and variables"],
      "color": "#3776ab",
      "icon_key": "python",
      "preview_percent": 20,
      "sort_order": 100,
      "is_published": true,
      "price": 0,
      "created_at": "2026-04-16T10:00:00.000Z"
    }
  ]
}
```

### POST `/admin/courses`
Status: `implemented`
Auth: admin

Request:

```json
{
  "title": "Python Programming",
  "slug": "python",
  "category": "programming",
  "level": "Beginner",
  "description": "Master Python fundamentals and advanced concepts.",
  "durationWeeks": 12,
  "objectives": ["Write clean Python programs with confidence"],
  "outline": ["Python syntax and variables"],
  "color": "#3776ab",
  "iconKey": "python",
  "previewPercent": 20,
  "sortOrder": 100,
  "isPublished": true
}
```

Success `201`:

```json
{
  "course": {
    "_id": "662222222222222222222222",
    "title": "Python Programming",
    "category": "programming",
    "level": "Beginner",
    "description": "Master Python fundamentals and advanced concepts.",
    "slug": "python",
    "duration_weeks": 12,
    "objectives": ["Write clean Python programs with confidence"],
    "outline": ["Python syntax and variables"],
    "color": "#3776ab",
    "icon_key": "python",
    "preview_percent": 20,
    "sort_order": 100,
    "is_published": true
  }
}
```

### PATCH `/admin/courses/:id`
Status: `implemented`
Auth: admin

Request:

```json
{
  "description": "Updated description",
  "previewPercent": 25,
  "isPublished": true
}
```

Success `200`:

```json
{
  "course": {
    "_id": "662222222222222222222222",
    "title": "Python Programming",
    "slug": "python",
    "description": "Updated description",
    "preview_percent": 25,
    "is_published": true
  }
}
```

### DELETE `/admin/courses/:id`
Status: `implemented`
Auth: admin
Behavior: soft unpublish

Success `200`:

```json
{
  "message": "Course unpublished successfully.",
  "course": {
    "_id": "662222222222222222222222",
    "is_published": false
  }
}
```

### POST `/admin/courses/:id/publish`
Status: `implemented`
Auth: admin

Success `200`:

```json
{
  "course": {
    "_id": "662222222222222222222222",
    "is_published": true
  }
}
```

### GET `/admin/cohorts`
Status: `implemented`
Auth: admin

Success `200`:

```json
{
  "cohorts": [
    {
      "_id": "665555555555555555555551",
      "course_id": {
        "_id": "662222222222222222222222",
        "title": "Python Programming",
        "slug": "python",
        "category": "programming",
        "level": "Beginner"
      },
      "name": "Python May 2026 Cohort",
      "start_date": "2026-05-05T00:00:00.000Z",
      "end_date": "2026-07-28T00:00:00.000Z",
      "duration_weeks": 12,
      "max_students": 25,
      "instructor": "ProgrammoCeuticals Faculty",
      "schedule": {
        "days_per_week": 3,
        "hours_per_session": 2,
        "time_slot": "6:00 PM WAT"
      },
      "status": "upcoming",
      "enrollment_count": 10,
      "available_slots": 15,
      "enrollments": [
        {
          "_id": "667777777777777777777771",
          "status": "active",
          "createdAt": "2026-04-16T10:00:00.000Z",
          "user": {
            "_id": "661111111111111111111111",
            "id": "661111111111111111111111",
            "name": "Ada Lovelace",
            "email": "ada@example.com"
          }
        }
      ],
      "enrolled_students": [
        {
          "_id": "661111111111111111111111",
          "id": "661111111111111111111111",
          "name": "Ada Lovelace",
          "email": "ada@example.com"
        }
      ]
    }
  ]
}
```

### POST `/admin/cohorts`
Status: `implemented`
Auth: admin

Request:

```json
{
  "courseId": "662222222222222222222222",
  "name": "Python May 2026 Cohort",
  "startDate": "2026-05-05",
  "durationWeeks": 12,
  "maxStudents": 25,
  "instructor": "ProgrammoCeuticals Faculty",
  "daysPerWeek": 3,
  "hoursPerSession": 2,
  "timeSlot": "6:00 PM WAT",
  "status": "upcoming"
}
```

Success `201`:

```json
{
  "cohort": {
    "_id": "665555555555555555555551",
    "name": "Python May 2026 Cohort",
    "status": "upcoming",
    "enrollment_count": 0,
    "available_slots": 25
  }
}
```

### PATCH `/admin/cohorts/:id`
Status: `implemented`
Auth: admin

Request:

```json
{
  "status": "active",
  "timeSlot": "7:00 PM WAT"
}
```

Success `200`:

```json
{
  "cohort": {
    "_id": "665555555555555555555551",
    "status": "active",
    "schedule": {
      "days_per_week": 3,
      "hours_per_session": 2,
      "time_slot": "7:00 PM WAT"
    }
  }
}
```

### POST `/admin/cohorts/:id/enroll`
Status: `implemented`
Auth: admin

Request:

```json
{
  "userId": "661111111111111111111111",
  "status": "active"
}
```

Success `201`:

```json
{
  "enrollment": {
    "_id": "667777777777777777777771",
    "status": "active",
    "createdAt": "2026-04-16T10:00:00.000Z",
    "user": {
      "_id": "661111111111111111111111",
      "id": "661111111111111111111111",
      "name": "Ada Lovelace",
      "email": "ada@example.com"
    }
  }
}
```

### PATCH `/admin/enrollments/:id`
Status: `implemented`
Auth: admin

Request:

```json
{
  "status": "completed"
}
```

Success `200`:

```json
{
  "enrollment": {
    "_id": "667777777777777777777771",
    "status": "completed",
    "createdAt": "2026-04-16T10:00:00.000Z",
    "user": {
      "_id": "661111111111111111111111",
      "id": "661111111111111111111111",
      "name": "Ada Lovelace",
      "email": "ada@example.com"
    }
  }
}
```

### GET `/admin/certificates`
Status: `implemented`
Auth: admin

Success `200`:

```json
{
  "certificates": [
    {
      "_id": "66ddddddddddddddddddddd1",
      "certificateNumber": "PC-2026-123456-ABCDEF",
      "status": "issued",
      "issuedAt": "2026-04-16T10:00:00.000Z",
      "enrollmentId": "667777777777777777777771",
      "student": {
        "_id": "661111111111111111111111",
        "id": "661111111111111111111111",
        "name": "Ada Lovelace",
        "email": "ada@example.com"
      },
      "cohort": {
        "_id": "665555555555555555555551",
        "id": "665555555555555555555551",
        "name": "Python May 2026 Cohort"
      },
      "course": {
        "_id": "662222222222222222222222",
        "id": "662222222222222222222222",
        "title": "Python Programming",
        "slug": "python"
      }
    }
  ]
}
```

### POST `/admin/certificates`
Status: `implemented`
Auth: admin

Request:

```json
{
  "enrollmentId": "667777777777777777777771"
}
```

Success `201`:

```json
{
  "certificate": {
    "_id": "66ddddddddddddddddddddd1",
    "certificateNumber": "PC-2026-123456-ABCDEF",
    "status": "issued",
    "issuedAt": "2026-04-16T10:00:00.000Z",
    "enrollmentId": "667777777777777777777771",
    "student": {
      "_id": "661111111111111111111111",
      "id": "661111111111111111111111",
      "name": "Ada Lovelace",
      "email": "ada@example.com"
    },
    "cohort": {
      "_id": "665555555555555555555551",
      "id": "665555555555555555555551",
      "name": "Python May 2026 Cohort"
    },
    "course": {
      "_id": "662222222222222222222222",
      "id": "662222222222222222222222",
      "title": "Python Programming",
      "slug": "python"
    }
  },
  "alreadyIssued": false
}
```

### GET `/admin/payments`
Status: `implemented`
Auth: admin

Success `200`:

```json
{
  "payments": [
    {
      "_id": "66ccccccccccccccccccccc1",
      "id": "66ccccccccccccccccccccc1",
      "type": "cohort_training",
      "amount": 100000,
      "currency": "NGN",
      "reference": "PCP-COH-12345678-ABCDE",
      "status": "pending_review",
      "method": "bank_transfer",
      "provider": "manual",
      "providerStatus": "",
      "authorizationUrl": "",
      "accessCode": "",
      "failureReason": "",
      "paidAt": null,
      "verifiedAt": null,
      "proofReference": "TRX123456789",
      "proofNote": "Paid from GTBank mobile app",
      "proofSubmittedAt": "2026-04-16T10:05:00.000Z",
      "adminNotes": "",
      "confirmedAt": null,
      "createdAt": "2026-04-16T10:00:00.000Z",
      "updatedAt": "2026-04-16T10:05:00.000Z",
      "user": {
        "_id": "661111111111111111111111",
        "id": "661111111111111111111111",
        "name": "Ada Lovelace",
        "email": "ada@example.com"
      },
      "application": {
        "_id": "666666666666666666666661",
        "id": "666666666666666666666661",
        "status": "new",
        "paymentStatus": "pending",
        "courseTitle": "Python Programming",
        "courseSlug": "python",
        "cohortName": "Python May 2026 Cohort"
      },
      "confirmedBy": null
    }
  ]
}
```

### PATCH `/admin/payments/:id`
Status: `implemented`
Auth: admin

Request:

```json
{
  "status": "confirmed",
  "adminNotes": "Payment confirmed after bank reconciliation."
}
```

Allowed statuses:
- `initiated`
- `pending_review`
- `confirmed`
- `failed`
- `refunded`

Success `200`:

```json
{
  "payment": {
    "id": "66ccccccccccccccccccccc1",
    "status": "confirmed",
    "adminNotes": "Payment confirmed after bank reconciliation.",
    "confirmedAt": "2026-04-16T10:10:00.000Z"
  }
}
```

### GET `/admin/cohort-applications`
Status: `implemented`
Auth: admin

Success `200`:

```json
{
  "applications": [
    {
      "_id": "666666666666666666666661",
      "id": "666666666666666666666661",
      "type": "cohort_training",
      "status": "new",
      "paymentStatus": "pending",
      "fullName": "Ada Lovelace",
      "email": "ada@example.com",
      "phone": "+2348000000000",
      "notes": "Interested in the evening cohort.",
      "adminNotes": "",
      "preferredStartDate": "2026-05-05T00:00:00.000Z",
      "source": "#/course-outline/python",
      "createdAt": "2026-04-16T10:00:00.000Z",
      "updatedAt": "2026-04-16T10:00:00.000Z",
      "user": {
        "_id": "661111111111111111111111",
        "id": "661111111111111111111111",
        "name": "Ada Lovelace",
        "email": "ada@example.com"
      },
      "course": {
        "_id": "662222222222222222222222",
        "id": "662222222222222222222222",
        "title": "Python Programming",
        "slug": "python"
      },
      "cohort": {
        "_id": "665555555555555555555551",
        "id": "665555555555555555555551",
        "name": "Python May 2026 Cohort"
      }
    }
  ]
}
```

### PATCH `/admin/cohort-applications/:id`
Status: `implemented`
Auth: admin

Request:

```json
{
  "status": "admitted",
  "paymentStatus": "confirmed",
  "adminNotes": "Payment cleared. Seat reserved."
}
```

Allowed `status` values:
- `new`
- `contacted`
- `admitted`
- `closed`

Allowed `paymentStatus` values:
- `pending`
- `confirmed`
- `waived`

Success `200`:

```json
{
  "application": {
    "id": "666666666666666666666661",
    "status": "admitted",
    "paymentStatus": "confirmed",
    "adminNotes": "Payment cleared. Seat reserved."
  }
}
```

### POST `/admin/announcements`
Status: `implemented`
Auth: admin

Request:

```json
{
  "cohort_id": "665555555555555555555551",
  "message": "Class starts next week."
}
```

Response:
- raw announcement document

### POST `/admin/materials`
Status: `implemented`
Auth: admin

Request:

```json
{
  "course_id": "662222222222222222222222",
  "title": "Python Starter Kit",
  "type": "pdf",
  "url": "https://example.com/python.pdf"
}
```

Response:
- raw material document

---

## 7. Planned Endpoints Required For Frontend Completion

The frontend can be built against these target contracts now, even if the backend still needs implementation.

## 7.1 Admin Modules

### GET `/admin/courses/:courseId/modules`
Status: `planned`
Auth: admin

Response:

```json
{
  "modules": [
    {
      "id": "663333333333333333333331",
      "courseId": "662222222222222222222222",
      "title": "Python Basics",
      "slug": "module-1-python-basics",
      "description": "",
      "orderIndex": 1,
      "lessonCount": 5,
      "estimatedMinutes": 25,
      "isPublished": true,
      "createdAt": "2026-04-16T10:00:00.000Z",
      "updatedAt": "2026-04-16T10:00:00.000Z"
    }
  ]
}
```

### POST `/admin/courses/:courseId/modules`
Status: `planned`
Auth: admin

Request:

```json
{
  "title": "Python Basics",
  "slug": "module-1-python-basics",
  "description": "",
  "orderIndex": 1,
  "isPublished": true
}
```

Response:

```json
{
  "module": {
    "id": "663333333333333333333331",
    "courseId": "662222222222222222222222",
    "title": "Python Basics",
    "slug": "module-1-python-basics",
    "description": "",
    "orderIndex": 1,
    "lessonCount": 0,
    "estimatedMinutes": 0,
    "isPublished": true
  }
}
```

### PATCH `/admin/modules/:moduleId`
Status: `planned`
Auth: admin

### DELETE `/admin/modules/:moduleId`
Status: `planned`
Auth: admin
Behavior: soft unpublish or delete

## 7.2 Admin Lessons

### GET `/admin/modules/:moduleId/lessons`
Status: `planned`
Auth: admin

Response:

```json
{
  "lessons": [
    {
      "id": "664444444444444444444441",
      "courseId": "662222222222222222222222",
      "moduleId": "663333333333333333333331",
      "title": "Introduction to Python",
      "slug": "introduction-to-python-1",
      "lessonType": "hero",
      "summary": "Getting started with Python",
      "orderIndex": 1,
      "estimatedDurationMinutes": 5,
      "slideCount": 1,
      "content": {},
      "isPublished": true,
      "createdAt": "2026-04-16T10:00:00.000Z",
      "updatedAt": "2026-04-16T10:00:00.000Z"
    }
  ]
}
```

### POST `/admin/modules/:moduleId/lessons`
Status: `planned`
Auth: admin

Request:

```json
{
  "title": "Introduction to Python",
  "slug": "introduction-to-python-1",
  "lessonType": "hero",
  "summary": "Getting started with Python",
  "orderIndex": 1,
  "estimatedDurationMinutes": 5,
  "slideCount": 1,
  "content": {
    "id": 1,
    "moduleId": 1,
    "moduleTitle": "Python Basics",
    "title": "Introduction to Python",
    "type": "hero",
    "content": {}
  },
  "isPublished": true
}
```

### GET `/admin/lessons/:lessonId`
Status: `planned`
Auth: admin

### PATCH `/admin/lessons/:lessonId`
Status: `planned`
Auth: admin

### DELETE `/admin/lessons/:lessonId`
Status: `planned`
Auth: admin
Behavior: soft unpublish or delete

## 7.3 Assessments

### Canonical Assessment DTO

```ts
type AssessmentRecord = {
  id: string;
  courseId: string;
  moduleId: string | null;
  lessonId: string | null;
  title: string;
  slug: string;
  type: "quiz" | "assignment";
  instructions: string;
  questions: unknown[];
  passScore: number;
  maxAttempts: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};
```

### GET `/admin/courses/:courseId/assessments`
Status: `planned`
Auth: admin

### POST `/admin/courses/:courseId/assessments`
Status: `planned`
Auth: admin

Request:

```json
{
  "moduleId": "663333333333333333333331",
  "lessonId": "664444444444444444444441",
  "title": "Python Basics Quiz",
  "slug": "python-basics-quiz",
  "type": "quiz",
  "instructions": "Answer all questions.",
  "questions": [],
  "passScore": 70,
  "maxAttempts": 3,
  "isPublished": true
}
```

### PATCH `/admin/assessments/:assessmentId`
Status: `planned`
Auth: admin

### DELETE `/admin/assessments/:assessmentId`
Status: `planned`
Auth: admin

### GET `/student/courses/:courseSlug/assessments`
Status: `planned`
Auth: required

Response:

```json
{
  "assessments": [
    {
      "id": "66eeeeeeeeeeeeeeeeeeeee1",
      "courseId": "662222222222222222222222",
      "moduleId": "663333333333333333333331",
      "lessonId": "664444444444444444444441",
      "title": "Python Basics Quiz",
      "slug": "python-basics-quiz",
      "type": "quiz",
      "instructions": "Answer all questions.",
      "questions": [],
      "passScore": 70,
      "maxAttempts": 3,
      "isPublished": true
    }
  ]
}
```

## 7.4 Submissions

### Canonical Submission DTO

```ts
type SubmissionRecord = {
  id: string;
  assessmentId: string;
  userId: string;
  answers: unknown;
  score: number | null;
  status: "draft" | "submitted" | "graded" | "returned";
  feedback: string;
  attemptNumber: number;
  reviewedBy: string | null;
  submittedAt: string;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
```

### POST `/student/assessments/:assessmentId/submissions`
Status: `planned`
Auth: required

Request:

```json
{
  "answers": {
    "q1": "Python is interpreted",
    "q2": "def"
  }
}
```

Response:

```json
{
  "submission": {
    "id": "66fffffffffffffffffffff1",
    "assessmentId": "66eeeeeeeeeeeeeeeeeeeee1",
    "userId": "661111111111111111111111",
    "answers": {
      "q1": "Python is interpreted",
      "q2": "def"
    },
    "score": null,
    "status": "submitted",
    "feedback": "",
    "attemptNumber": 1,
    "reviewedBy": null,
    "submittedAt": "2026-04-16T10:00:00.000Z",
    "reviewedAt": null,
    "createdAt": "2026-04-16T10:00:00.000Z",
    "updatedAt": "2026-04-16T10:00:00.000Z"
  }
}
```

### GET `/student/submissions`
Status: `planned`
Auth: required

### GET `/admin/assessments/:assessmentId/submissions`
Status: `planned`
Auth: admin

### PATCH `/admin/submissions/:submissionId`
Status: `planned`
Auth: admin

Request:

```json
{
  "status": "graded",
  "score": 85,
  "feedback": "Good work. Improve naming and comments."
}
```

## 7.5 Announcements and Materials

### GET `/admin/announcements`
Status: `planned`
Auth: admin

### PATCH `/admin/announcements/:announcementId`
Status: `planned`
Auth: admin

### DELETE `/admin/announcements/:announcementId`
Status: `planned`
Auth: admin

### GET `/admin/materials`
Status: `planned`
Auth: admin

### PATCH `/admin/materials/:materialId`
Status: `planned`
Auth: admin

### DELETE `/admin/materials/:materialId`
Status: `planned`
Auth: admin

### GET `/student/materials/course/:courseSlug`
Status: `planned`
Auth: required

Purpose:
- final LMS resource delivery
- preferred over the current legacy cohort-only materials endpoint

## Frontend Integration Rules

### Use these endpoints now
- auth
- public courses and lesson content
- self-paced enrollments
- lesson progress
- lesson whiteboard
- notifications
- payments
- certificate verification
- current admin overview, courses, cohorts, payments, certificates, applications

### Treat these as legacy
- `/student/dashboard`
- `/student/schedule`
- `/student/materials`
- `/student/progress*`
- `/student/whiteboard/:courseId/:slideIndex`
- `/courses/slug/:slug/slides`

### Build adapters for these inconsistencies
- course categories: `programming/basic` vs `Programming Languages/Basic Skills`
- admin course fields: `preview_percent`, `duration_weeks`, `is_published`
- public course fields: normalized camelCase plus `_id`
- cohort responses: raw nested `course_id`

## What Amazon Q Should Assume
- The frontend should be built against the canonical DTOs in this file.
- Where the current backend already exists, implement adapters from real responses.
- Where endpoints are marked `planned`, build service stubs or mocked adapters to those target contracts.
- Do not design the UI around raw Mongo documents.
- Normalize at the service layer, then build UI components against stable frontend models.
