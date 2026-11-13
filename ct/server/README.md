# BE Assessment Server

Express + TypeScript API for the Bioequivalence Submission Screening, Compliance Directive, Assessment, and Tracking System.

## Stack

- Express.js
- PostgreSQL
- Drizzle ORM
- Drizzle Kit migrations
- JWT authentication
- Role-based authorization
- Cloudinary raw uploads for assessor Word reports

## Setup

```bash
cp .env.example .env
npm install
npm run db:generate
npm run db:migrate
npm run seed
npm run dev
```

`npm run seed` currently creates the initial Super Admin and base lookup options. Workbook-specific imports from `BE_Assessment_Tracking_Template.xlsx` are intentionally left for the next server pass so the first dependency set stays vulnerability-free.

Development uses `nodemon` with `tsx`, so `npm run dev` restarts the API when files under `src` change.

The API base path is:

```txt
/api/v1
```

Initial implemented routes:

```txt
POST /api/v1/auth/register-applicant
POST /api/v1/auth/login
GET  /api/v1/auth/me
POST /api/v1/auth/logout

POST /api/v1/applications
GET  /api/v1/applications/my
GET  /api/v1/applications/:applicationId
PATCH /api/v1/applications/:applicationId
POST /api/v1/applications/:applicationId/submit
GET  /api/v1/applications/:applicationId/checklist
PATCH /api/v1/applications/:applicationId/checklist
GET  /api/v1/applications/:applicationId/checklist/document-references
PUT  /api/v1/applications/:applicationId/checklist/document-references
```
