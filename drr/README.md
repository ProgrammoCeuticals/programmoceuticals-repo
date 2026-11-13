# Office Mail Tracking System MVP

Full-stack MVP for tracking regulatory office mail from mail room registration through directorial routing, divisional assignment, desk review, HOD/HOU review, and closure.

## Stack

- Frontend: Angular, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL with Drizzle ORM
- Auth: JWT role-based login
- Package manager: npm

## Setup

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
```

Update `DATABASE_URL` in `.env`, then run:

```bash
npm run db:migrate
npm run seed
npm run dev
```

The API runs at `http://localhost:4000`.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

The Angular dev server runs at `http://localhost:4200`.

## Seed Users

All seeded users use password `Password123!`.

| Role | Email |
| --- | --- |
| ADMIN | admin@example.com |
| MAIL_ROOM | mailroom@example.com |
| SECRETARY | secretary@example.com |
| DD | dd.clinical@example.com |
| DESK_OFFICER | desk.clinical@example.com |
| HOD_HOU | hod.clinical@example.com |

## Workflow

1. MAIL_ROOM registers a mail with code, company/applicant, and subject.
2. SECRETARY records the director minute/directive and target division.
3. MAIL_ROOM dispatches the routed mail to the division.
4. DD records division receipt and assigns desk officer and HOD/HOU.
5. DESK_OFFICER records work note and completes review.
6. HOD_HOU records final remark.
7. HOD_HOU or ADMIN closes the mail.

Each action creates a `MailTimeline` record and status transitions are enforced by the API.

## Useful Commands

```bash
cd server && npm run build
cd client && npm run build
```
