# Hospital Management System Completion Plan

## Current Status

The app has a substantial Angular client and TypeScript/Express server, but it is not complete or deployable yet.

- Server build currently fails with TypeScript and Drizzle schema mismatches.
- Client build mostly bundles, but final index generation fails because Angular tries to fetch Google Material Icons from the internet.
- Several production features are still mocked or partially implemented, including SMS, email, payment processing, external pharmacy integration, monitoring, and report export.
- The `Hospital Management System/` folder is currently untracked in git.
- `server/.env` contains real-looking credentials and API keys. Rotate these before deployment.

## Completion Definition

The system is complete when:

- Server and client both build successfully.
- Database migrations run from a clean database.
- Seed data creates usable admin, doctor, nurse, pharmacist, lab, receptionist, and patient test accounts.
- Core workflows work end to end through the UI and API.
- Mock services are either replaced with real integrations or clearly disabled behind configuration.
- Authentication, authorization, tenant/facility isolation, and role permissions are verified.
- Production configuration, Docker deployment, and environment documentation are accurate.
- A smoke test checklist passes for all core modules.

## Phase 1: Stabilize The Server Build

Priority: Critical

- Run `npm run build` in `Hospital Management System/server`.
- Fix all TypeScript errors before adding new features.
- Standardize the Express request user type so `req.user` is consistent everywhere.
- Replace old `req.userId` usage with `req.user.id` or add a typed middleware adapter.
- Fix imports for auth middleware in users, roles, vitals, and SMS routes.
- Fix route handlers that are calling controller methods incorrectly.
- Add missing dependencies or remove unused services, especially `socket.io` usage in realtime dashboard services.
- Fix `notificationService` and `mailService` singleton exports or update callers to instantiate service classes consistently.
- Fix logger usage such as unsupported `logger.critical`.
- Remove or correct Drizzle imports that do not exist in the installed version, such as direct `count`, `sum`, and `avg` imports if unsupported.

## Phase 2: Align Database Schema, Models, And Services

Priority: Critical

- Audit `server/src/drizzle/schema.ts`, `server/src/models/*.ts`, migrations, services, and controllers.
- Choose one source of truth for database schema.
- Fix mismatches where code references fields that do not exist.
- Confirm or add required fields for:
  - Users: password hash, email, role, facility ID, active status.
  - Patients: patient code, date of birth, contact details, facility/tenant ownership.
  - Prescriptions: doctor ID, patient ID, consultation ID, status, timestamps.
  - Vitals: recorded date/time, recorded by, patient ID.
  - Documents: patient ID, document type, category, file metadata.
  - Activity logs: facility ID, entity type, timestamp, user ID.
  - Payments: facility ID, patient ID, transaction ID, status.
  - Module subscriptions: tenant ID, plan name, subscription type.
  - Inventory batches: item ID, expiry date, quantity, prices.
- Update migrations to match final schema.
- Run migrations against a clean local database.
- Add a database reset/setup command that works from documentation.

## Phase 3: Authentication, Authorization, And Tenancy

Priority: Critical

- Verify register, login, refresh token, logout, forgot password, and reset password.
- Ensure password fields use `passwordHash` consistently.
- Verify JWT payload includes required fields: user ID, email, role, facility ID, tenant ID if applicable.
- Confirm auth middleware attaches the same user object shape everywhere.
- Verify admin, doctor, nurse, pharmacist, lab tech, receptionist, and patient role guards.
- Verify module access middleware does not block core modules incorrectly.
- Confirm tenant/facility context is applied consistently on protected routes.
- Add smoke tests for unauthorized, forbidden, and authorized API calls.

## Phase 4: Complete Core Server APIs

Priority: High

- Patients:
  - Create, list, search, view, edit, archive/deactivate.
  - Vitals, allergies, conditions, medical history.
- Appointments:
  - Create, availability, reschedule, cancel, status updates, upcoming appointments.
  - Conflict prevention and recurring appointment handling.
- Doctor workflow:
  - Dashboard, queue, consultations, prescriptions, lab requests, vitals, patient history.
- Lab:
  - Test catalog, requests, sample tracking, result entry, result upload, result verification.
  - Quality control and equipment calibration if kept in scope.
- Pharmacy:
  - Prescription queue, dispensing, stock checks, drug catalog, controlled substances.
  - Allergy and drug interaction warnings.
- Inventory:
  - Items, batches, stock entries, movements, reorder alerts, expiry tracking, purchase orders.
- Admissions:
  - Admit patient, bed/ward assignment, charges, discharge, patient flow analytics.
- Payments:
  - Create payment, verify payment, receipt, refunds, reports.
- Documents:
  - Upload, preview, categorization, access control, retention, audit trail.
- Reports:
  - Financial, operational, inventory, lab, pharmacy, analytics exports.
- Settings:
  - Facility profile, users, roles, notification settings, security settings.
- Admin:
  - User management, role management, audit logs, module management, dashboard.

## Phase 5: Replace Or Gate Mock Integrations

Priority: High

- SMS:
  - Decide provider: Twilio, AWS SNS, or disabled.
  - Remove silent mock sending in production.
- Email:
  - Configure SMTP or provider-backed email.
  - Disable mock email in production.
- Payments:
  - Complete Paystack integration.
  - Verify webhook handling and transaction integrity.
  - Add refund workflow.
- External pharmacy integration:
  - Replace mock CVS/Walgreens style providers with real configured providers or remove from production scope.
- FHIR:
  - Decide if FHIR is required for launch.
  - If required, validate server URL, authentication, and error handling.
- Cloudinary/file storage:
  - Confirm upload, optimization, deletion, and secure URLs.
- Redis:
  - Confirm whether cache/session features require Redis.
  - Make Redis optional in local development and required in production only if needed.

## Phase 6: Stabilize The Client Build

Priority: Critical

- Run `npm run build` in `Hospital Management System/client`.
- Remove remote Google font/icon fetching from production build.
- Self-host Material Icons or replace with bundled/icon-library assets.
- Confirm Angular 17 build runs on Node 18 or Node 20 LTS.
- Fix any template/type errors after the font issue is resolved.
- Remove duplicate or abandoned nested component folders if they are not used.
- Ensure all lazy-loaded routes point to declared components.
- Add route guards where needed for protected modules.
- Confirm environment files point to the correct API URLs for development, staging, and production.

## Phase 7: Complete Client Feature Screens

Priority: High

- Authentication:
  - Login, register, forgot password, reset password, MFA, email verification.
  - Proper loading, validation, and error states.
- Dashboard:
  - Role-specific dashboard data.
  - Replace chart placeholders with real data or remove placeholders.
- Patients:
  - Search, pagination, details, edit form, vitals, allergies, conditions, history.
  - Replace "bulk edit coming soon" with working behavior or remove the action.
- Appointments/booking:
  - Public booking flow if required.
  - Staff appointment scheduler with availability and conflict feedback.
- Doctor module:
  - Queue, consultation form, SOAP notes, prescription form, lab request flow.
  - Prescription print/PDF should generate real output.
- Lab module:
  - Request list, result entry, upload, analytics, quality control.
  - Ensure advanced screens are connected to APIs.
- Pharmacy module:
  - Prescription queue, details, dispensing, drug catalog, stock check, controlled substances.
  - Interaction and allergy warnings connected to real data.
- Inventory module:
  - Item list, stock entry, batches, movements, reorder alerts, purchase orders, expiry tracking.
- Admissions:
  - Admission form/list/details, discharge form, charges, patient flow dashboard.
- Payments:
  - Payment form/list, receipt generation, verification, gateway selector, refund flow.
- Documents:
  - Upload, list, preview, categories, permissions, notifications, retention/compliance.
- Reports:
  - Report filters, export buttons, PDF/Excel generation, analytics views.
- Settings/admin:
  - Profile, facility settings, users, roles, permissions, audit logs, security settings.
- Public pages:
  - Home, about, contact, booking should use facility branding from onboarding/settings.

## Phase 8: UX, Responsiveness, And Accessibility

Priority: Medium

- Test desktop, tablet, and mobile layouts.
- Fix overlapping text, cramped forms, and tables that do not scroll properly.
- Standardize loading, empty, error, and success states.
- Add confirmation dialogs for destructive actions.
- Improve form validation messages.
- Verify keyboard navigation for common workflows.
- Check color contrast and focus states.
- Make large tables searchable, filterable, paginated, and exportable.

## Phase 9: Security And Compliance

Priority: High

- Rotate all exposed credentials from `server/.env`.
- Move secrets to environment variables or a secret manager.
- Verify CORS configuration for production domains.
- Verify CSRF behavior does not break API clients.
- Confirm rate limits are appropriate for auth and API routes.
- Ensure uploaded files are type-checked, size-limited, and scanned if required.
- Verify XSS/input sanitization does not corrupt clinical notes.
- Add audit logs for sensitive actions.
- Verify role-based field permissions for medical and financial data.
- Add data retention policy behavior or remove unfinished controls.
- Document HIPAA/data protection assumptions if the app handles real patient data.

## Phase 10: Testing

Priority: High

- Server:
  - Unit tests for services.
  - Integration tests for auth, patients, appointments, doctor, lab, pharmacy, inventory, payments, reports.
  - Middleware tests for auth, tenant context, roles, validation, rate limits.
- Client:
  - Component smoke tests for key pages.
  - Route guard tests.
  - Service tests for API methods and error handling.
- End to end:
  - Login as each role.
  - Register patient.
  - Book appointment.
  - Doctor consultation.
  - Create prescription.
  - Dispense medication.
  - Create lab request.
  - Enter lab result.
  - Receive payment and print receipt.
  - Upload document.
  - Generate report.
- Add a single command or documented sequence for local verification.

## Phase 11: DevOps And Deployment

Priority: Medium

- Confirm Dockerfile builds the full app correctly.
- Fix `docker-compose.yml` port and database naming inconsistencies.
- Ensure server port, API docs, README, and Docker config agree.
- Add production environment example without secrets.
- Add migration command to deployment process.
- Add seed command for demo/staging only.
- Add health checks for server, database, Redis, and external dependencies.
- Configure nginx for client routing and API proxy if used.
- Add backup and restore documentation.
- Add logging and error monitoring configuration.

## Phase 12: Documentation

Priority: Medium

- Update `README.md` with accurate setup instructions.
- Update API documentation to match actual implemented routes and port.
- Add environment variable reference.
- Add role/account guide for testing.
- Add deployment guide.
- Add admin user manual.
- Add clinical workflow guide for reception, doctor, lab, pharmacy, inventory, and billing.
- Add known limitations section for anything intentionally deferred.

## Immediate Execution Order

Use this order to move fastest:

1. Fix server `npm run build`.
2. Fix database schema/service mismatches.
3. Fix client `npm run build`.
4. Run migrations and seed database.
5. Start server and client locally.
6. Smoke-test the main workflow: login, patient, appointment, consultation, prescription, pharmacy dispense, lab request/result, payment, report.
7. Replace or disable mock integrations.
8. Harden security and rotate secrets.
9. Finish tests and deployment docs.

## Launch Scope Decision

Decide which launch target is required:

- Demo launch:
  - Builds pass.
  - Local database works.
  - Main workflows work with seeded data.
  - External integrations can stay disabled or mocked with clear labels.

- Production launch:
  - All demo launch items.
  - Real email/SMS/payment integrations.
  - Real secrets management.
  - Secure file uploads.
  - Audit logging.
  - Role and tenant isolation verified.
  - Backup/restore.
  - Error monitoring.
  - Full smoke test and critical integration tests passing.

