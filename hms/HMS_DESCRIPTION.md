# Oluchukwu Specialist Hospital — Full Software Description

**Version:** 1.0.0  
**Client:** Oluchukwu Specialist Hospital and Endoscopy, Nnewi, Anambra State, Nigeria  
**Stack:** Angular 17 · Node.js/Express/TypeScript · PostgreSQL (Supabase) · Drizzle ORM  
**Deployment:**
- Public Site → Namecheap (`programmoceuticals.com`)
- HMS App → Namecheap (`hms.programmoceuticals.com`)
- Server → Render (`hms-api-8jad.onrender.com`)
- Database → Supabase
- File Storage → Cloudinary

---

## 1. Overview

The Oluchukwu Specialist Hospital system is a full-stack, web-based platform purpose-built for Oluchukwu Specialist Hospital and Endoscopy in Nnewi, Anambra State. It consists of three independent components:

1. **Public Website** (`programmoceuticals.com`) — the hospital's patient-facing website with blog, services, booking and contact
2. **Hospital Management System** (`hms.programmoceuticals.com`) — the internal clinical management platform for all hospital staff
3. **API Server** — a single Express.js server on Render that serves both applications

The system covers every stage of the patient journey from online appointment booking through to discharge and billing, and supports seven distinct user roles — each with a tailored interface and access controls.

---

## 2. Architecture

### 2.1 Technology Stack

| Layer | Technology |
|---|---|
| Public Frontend | Angular 17 (standalone app — `client-public`) |
| HMS Frontend | Angular 17 (standalone app — `client-hms`) |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL via Supabase |
| ORM | Drizzle ORM |
| File Storage | Cloudinary |
| Authentication | JWT (JSON Web Tokens) |
| Email | Nodemailer (SMTP) |
| Caching | Redis (optional, graceful fallback) |
| Payments | Paystack (webhook integration) |
| API Docs | Swagger/OpenAPI |

### 2.2 System Structure

```
hms/
├── client-public/          → programmoceuticals.com
│   ├── Public Website
│   │   ├── Home
│   │   ├── About
│   │   ├── Services
│   │   ├── Doctors
│   │   ├── Patient Info
│   │   ├── Contact
│   │   ├── Book Appointment
│   │   └── Blog
│   └── Public Admin (/admin)
│       ├── Login
│       ├── Dashboard
│       └── Blog Management
│
├── client-hms/             → hms.programmoceuticals.com
│   ├── Auth (Login, Forgot/Reset Password)
│   ├── Admin Panel
│   ├── Doctor Module
│   ├── Nurse Module
│   ├── Lab Technician Module
│   ├── Pharmacy Module
│   ├── Receptionist (Appointments + Patients)
│   ├── Admissions
│   ├── Payments
│   ├── Inventory
│   ├── Reports
│   └── Settings
│
└── server/                 → Render API
    └── Single Express server serving both apps
```

### 2.3 Why Two Separate Apps

The public website and HMS are completely independent Angular applications. This means:
- **Security** — patients visiting `programmoceuticals.com` never download any HMS code or have access to clinical routes
- **Performance** — public site bundle is ~572KB vs HMS ~2.4MB
- **Delegation** — a content manager can be given access to manage the public site without any HMS credentials
- **Independent deployment** — update the public site without touching the HMS and vice versa

### 2.4 Security Architecture

- **JWT Bearer token** authentication on all protected routes
- **Role-based access control (RBAC)** — 7 roles with granular permissions
- **Helmet.js** — HTTP security headers
- **CORS** — whitelist: `programmoceuticals.com`, `hms.programmoceuticals.com`, `localhost:4200`
- **Rate limiting** — per-route and global limits
- **XSS protection** — input sanitisation middleware
- **SQL injection prevention** — parameterised queries via Drizzle ORM
- **Audit logging** — all significant actions logged with user, timestamp and IP
- **HTTPS enforcement** — redirect middleware in production
- **Paystack webhook signature verification** — HMAC-SHA512

---

## 3. Public Website (`programmoceuticals.com`)

The public website is accessible to anyone without authentication. It serves as the hospital's digital front door.

### 3.1 Public Pages

#### Home (`/`)
- Emergency contact banner with direct call link
- Hero section with hospital tagline and call-to-action buttons
- Quick action cards (Book Appointment, Services, Find Us, Call)
- About preview with hospital mission
- Featured services grid (4 services)
- Why Choose Us section
- Latest blog posts preview (3 most recent published posts)
- CTA section with address and contact

#### About (`/about`)
- Hospital history and background
- Mission and vision statements
- Team and values

#### Services (`/services`, `/services/:slug`)
- Full list of specialist services with categories
- Individual service detail pages with indications, preparation and aftercare instructions
- Services: Upper GI Endoscopy, Colonoscopy, Laparoscopic Cholecystectomy, Laparoscopic Appendectomy, Comprehensive Surgical Services

#### Doctors (`/doctors`)
- List of specialist doctors with profiles

#### Patient Info (`/patient-info`)
- Information for patients about visiting the hospital

#### Contact (`/contact`)
- Contact form, Google Maps embed, address, phone, email

#### Book Appointment (`/booking`)
- Online appointment booking form for the public

#### Blog (`/blog`, `/blog/:slug`)
- Full blog with category filtering and pagination (9 per page)
- Individual post pages with rich HTML content, author info, related posts sidebar, appointment CTA
- Categories: Health Tips, Hospital News, Surgery, Endoscopy, Patient Stories, Medical Advice, Events, General

### 3.2 Navigation
- Responsive public navbar with mobile hamburger menu
- Links: Home · About · Services · Doctors · Patient Info · Contact · Blog · Emergency · Book Appointment
- Public footer with hospital details

---

## 4. Public Admin Panel (`programmoceuticals.com/admin`)

A separate, lightweight admin panel within the public site for managing website content. Completely isolated from the HMS — no access to patient data or clinical records.

### 4.1 Access
- Only `content_manager` and `admin` roles can log in
- Any other role (doctor, nurse, etc.) is rejected with "Access denied"
- Protected by `PublicAdminGuard`

### 4.2 Login (`/admin/login`)
- Email and password
- Role validation on login — non-content roles are blocked immediately
- Clean branded login page

### 4.3 Dashboard (`/admin/dashboard`)
- Stats: Total Posts, Published, Drafts
- Recent posts list with quick edit links

### 4.4 Blog Management (`/admin/blog`)
- List all posts with search and status filter
- **Create/Edit Post Form:**
  - Title
  - Category (Health Tips, Hospital News, Surgery, Endoscopy, Patient Stories, Medical Advice, Events, General)
  - Excerpt
  - Featured Image (Cloudinary upload — drag-and-drop)
  - Content (HTML-supported rich textarea)
  - Tags (comma-separated)
  - Status (Draft / Published)
- Publish/Unpublish toggle
- Delete with confirmation modal

---

## 5. Hospital Management System (`hms.programmoceuticals.com`)

The HMS is a protected, role-based clinical management platform accessible only to authenticated hospital staff.

### 5.1 Authentication

#### Login (`/auth/login`)
- Email and password authentication
- JWT token issued on success
- Role-based redirect: Admin → `/admin`, Doctor → `/dashboard`, others → `/dashboard`

#### Forgot Password (`/auth/forgot-password`)
- Staff enters email address
- Server generates a 1-hour JWT reset token
- Email sent with link to `/auth/reset-password?token=...`

#### Reset Password (`/auth/reset-password`)
- Token read from URL query parameter
- Password strength validation and confirmation match
- On success, redirects to login

---

## 6. Staff Roles and Modules

### 6.1 Admin

**Access:** Full system access  
**Dashboard:** `/admin`

The admin panel is a comprehensive single-page tabbed interface:

| Tab | Features |
|---|---|
| Dashboard | System stats, quick actions, admin alerts, module status |
| Hospital Setup | Edit hospital name, address, contact, mission, vision, website, opening hours |
| Departments & Services | Add/edit/delete departments and service pricing |
| Wards & Schedules | Ward management, doctor schedule management |
| Staff Management | Create/edit/deactivate staff accounts for all roles |
| Roles & Permissions | Create custom roles with granular permissions across 10 categories |
| Billing & Notifications | SMS/email provider settings, notification toggles |
| Reports | Quick links to all report types |
| Audit Logs | Full audit trail of all system actions |

> **Note:** Blog management has been moved to the Public Admin panel (`programmoceuticals.com/admin`) and is no longer accessible from the HMS admin.

---

### 6.2 Doctor

**Access:** Own patients, consultations, prescriptions, lab requests/results  
**Dashboard:** `/dashboard` → `/doctor/dashboard`

#### My Schedule (`/doctor/appointments`)
- Own appointments only, book/reschedule/cancel/no-show/complete
- Auto-assign doctor by slot availability

#### Consultations (`/doctor/consultations`)
- Full SOAP format: vitals, chief complaint, diagnosis, clinical notes, follow-up
- Three save actions: Save, Save & Prescribe, Save & Request Lab

#### Prescriptions (`/doctor/prescriptions`)
- FormArray for multiple medications with dosage, frequency, duration, quantity
- Clinical details view with print

#### Lab Results (`/doctor/lab-results`)
- Critical alert bar, colour-coded banner, large result value display
- Print with `@media print` styles

---

### 6.3 Nurse

**Access:** Ward patients, vitals, patient care  
**Dashboard:** `/nurse/dashboard`

#### Nurse Dashboard
- 4 stat cards: Currently Admitted, Admitted Today, Discharged Today, Vitals Recorded Today
- Ward patients list with click-through to patient care

#### Ward Patients (`/nurse/ward-patients`)
- All admitted patients with ward, bed, doctor, priority
- Per-row: Record Vitals, View Care

#### Vitals Entry (`/nurse/vitals-entry`)
- Patient search/select, 6-field form (BP, Temp, Pulse, Respiration, Weight, Height)
- Colour-coded status indicators, recent readings panel

#### Patient Care (`/nurse/patient-care/:patientId`)
- Patient banner with blood group, allergy alert bar
- Tabs: Vitals History · Active Medications · Allergies

---

### 6.4 Lab Technician

**Access:** Lab requests, results, worklist, patient history  
**Dashboard:** `/lab/dashboard`

#### Lab Dashboard
- 4 stat cards: Pending, In Progress, Completed Today, Critical Results
- 3-column layout: Pending queue · In Progress · Critical Results

#### Worklist (`/lab/worklist`)
- Tests grouped by category, STAT highlighted red
- TAT chip (green/amber/red), sample collection modal, enter result button

#### Test Requests (`/lab/requests`)
- Filter by status/priority, process → result entry

#### Results (`/lab/results`)
- Colour-coded status badges, critical results pulse red, print

#### Result Entry (`/lab/results/entry`)
- Request lookup, patient info card, result value/unit/status/report

#### Patient History (`/lab/patient-history`)
- Search patient, all past results grouped by test name

---

### 6.5 Pharmacist

**Access:** Prescriptions queue, dispensing, stock  
**Dashboard:** `/pharmacy/dashboard`

#### Pharmacy Dashboard
- 4 stat cards: Pending, Dispensed Today, Low Stock, Expiring (30 days)

#### Prescriptions (`/pharmacy/prescriptions`)
- Filter/search, dispense button on pending prescriptions

#### Dispensing (`/pharmacy/dispensing/:id`)
- Per-item quantity, batch selector, counselling checklist
- On completion: marks prescription `dispensed`, deducts inventory stock

#### Stock Check (`/pharmacy/stock-check`)
- Current inventory levels and low stock alerts

---

### 6.6 Receptionist

**Access:** Appointments, patient registration  
**Dashboard:** `/dashboard` → ReceptionistDashboardComponent

#### Appointments (`/appointments`)
- Book (auto-assign doctor), reschedule, cancel, no-show, complete

#### Patients (`/patients`)
- 5-step registration wizard, patient details with PDF export

---

## 7. Shared Clinical Modules

### 7.1 Admissions (`/admissions`)
- Admit patient (type, priority, ward, bed, doctor), discharge, transfer
- Inpatient consultations, room charges

### 7.2 Payments (`/payments`)
- Record payment (cash/transfer/card), receipts
- Paystack webhook: `POST /api/payments/webhook/paystack` — auto-confirms online payments

### 7.3 Inventory (`/inventory`)
- Item list, stock entry, expiry tracking, reorder alerts, stock batches, purchase orders, stock movements

### 7.4 Reports (`/reports`)
- 8 report types: Patient, Revenue, Financial, Lab, Pharmacy, Inventory, Operational, Analytics
- Date range filter, PDF and Excel export

### 7.5 Documents (`/documents`)
- Document upload, categorisation, permissions, preview, compliance tracking

---

## 8. File Upload System

`POST /api/upload?folder=blog|patients|lab|logos|documents|general`

- Accepts: JPEG, PNG, GIF, PDF (up to 5MB)
- Images auto-optimised: quality auto, format auto, max width 1200px
- Returns: `{ url, publicId, format, width, height, size }`
- Requires authentication (any role)

**`<app-image-upload>` component** — reusable, available in SharedModule of both apps:
- Drag-and-drop or click, instant local preview, spinner, clear button
- Used in: Blog management (featured image), Logo upload (onboarding)

---

## 9. Database Schema

45+ tables across all domains:

| Domain | Tables |
|---|---|
| Core | facilities, users, user_sessions, roles, module_configurations |
| Patients | patients, patient_allergies, patient_conditions, vitals |
| Clinical | appointments, consultations, prescriptions, prescription_items, prescription_refills |
| Laboratory | lab_requests, lab_results, test_catalog, lab_analytics, sample_tracking, equipment_calibration, quality_control, result_templates, external_lab_configs |
| Pharmacy | dispensations, drug_catalog, controlled_substances |
| Admissions | admissions, admission_charges, beds, wards, room_charges |
| Inventory | inventory_items, inventory_batches, stock_movements, purchase_orders |
| Finance | payments |
| Documents | documents |
| Notifications | notifications |
| Content | blog_posts, contact_submissions |
| Audit | activity_logs |
| Tenancy | tenants, tenant_subscriptions, module_catalog, module_packages, module_permissions, module_usage |

---

## 10. API Structure

All endpoints prefixed with `/api/`:

| Route | Description |
|---|---|
| `/auth` | Login, register, forgot/reset password, profile, change password |
| `/patients` | Patient CRUD, medical history, vitals, allergies, conditions |
| `/appointments` | Booking, reschedule, cancel, auto-assign, availability |
| `/doctors` | Doctor dashboard, appointments, consultations, prescriptions, lab results |
| `/nurse` | Dashboard, ward patients, vitals CRUD, patient care |
| `/lab` | Requests, results, worklist, sample collection, patient history, daily stats |
| `/pharmacy` | Prescriptions, dispensing, stock, drug interactions, dashboard |
| `/admissions` | Admit, discharge, transfer, inpatient consultations, room charges |
| `/payments` | Create, list, verify, receipt, Paystack webhook |
| `/inventory` | Items, batches, stock movements, low stock, expiring |
| `/wards` | Ward list, beds by ward |
| `/schedules` | Doctor schedules CRUD |
| `/reports` | Patient, financial, lab, pharmacy, inventory, operational, analytics |
| `/dashboard` | Role-based dashboard stats |
| `/admin` | System stats, facility settings, user management, roles, schedules, wards |
| `/blog` | Public posts, post by slug, categories, admin CRUD (admin + content_manager) |
| `/upload` | Cloudinary file upload and delete (any authenticated user) |
| `/public` | Public hospital info, services, contact form |
| `/notifications` | In-app notifications |
| `/settings` | Facility and notification settings |
| `/documents` | Document management |
| `/onboarding` | Hospital setup wizard |

---

## 11. Email Notifications

| Trigger | Recipient | Content |
|---|---|---|
| New staff account | Staff member | Welcome email |
| Forgot password | Staff member | Reset link (expires 1 hour) |
| Appointment confirmed | Patient | Doctor, date, time, instructions |
| Critical lab result | Attending doctor | Patient name, test, value — urgent alert |
| Lab results ready | Patient | List of completed tests |
| Prescription ready | Patient | Medication list, pickup instructions |
| Payment reminder | Patient | Amount due, due date |

---

## 12. User Credentials (Seed Data)

### HMS Staff (`hms.programmoceuticals.com`)

| Role | Email | Password |
|---|---|---|
| Admin | admin@oluchukwuspecialisthospital.com | Admin@123456 |
| Doctor | doctor@oluchukwuspecialisthospital.com | Doctor@123456 |
| Nurse | nurse@oluchukwuspecialisthospital.com | Nurse@123456 |
| Lab Tech | lab@oluchukwuspecialisthospital.com | Lab@123456 |
| Pharmacist | pharmacist@oluchukwuspecialisthospital.com | Pharma@123456 |
| Receptionist | reception@oluchukwuspecialisthospital.com | Recept@123456 |

### Public Site Content Manager (`programmoceuticals.com/admin`)

| Role | Email | Password |
|---|---|---|
| Content Manager | content@oluchukwuspecialisthospital.com | Content@123456 |

---

## 13. Deployment Configuration

### Public Site (`client-public`) → `programmoceuticals.com`
```bash
cd client-public
npx ng build
# Upload dist/public/ contents to Namecheap public_html/
```

### HMS App (`client-hms`) → `hms.programmoceuticals.com`
```bash
cd client-hms
npx ng build
# Upload dist/hms/ contents to Namecheap hms subdomain document root
```

Both require `.htaccess` for Angular routing:
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QR,L]
```

### Server → Render
- Build: `npm install` (postinstall runs `npx tsc` automatically)
- Start: `node dist/server.js`
- Root directory: `hms/server`

**Required environment variables on Render:**

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `DATABASE_URL` | Supabase connection string |
| `JWT_SECRET` | Secure random string |
| `JWT_EXPIRE` | `7d` |
| `CLIENT_URL` | `https://hms.programmoceuticals.com` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `EMAIL_HOST` | SMTP host |
| `EMAIL_PORT` | SMTP port (587) |
| `EMAIL_USER` | SMTP username |
| `EMAIL_PASS` | SMTP password |
| `PAYSTACK_SECRET_KEY` | Paystack secret key |

### Database → Supabase
- PostgreSQL hosted on Supabase
- Connection via `DATABASE_URL`
- Migrations in `server/src/drizzle/migrations/`

---

## 14. Known Limitations and Future Enhancements

### Current Limitations
- HMS layout is optimised for desktop — mobile responsiveness is limited for clinical staff views
- Documents module has the structure but most sub-components are stubs
- No real-time notifications (WebSocket service is a stub — notifications are email-only)
- No patient portal (patients cannot log in to view their own records)
- Paystack online payment requires webhook confirmation — no in-app card payment UI yet

### Recommended Future Enhancements
1. **Patient portal** — patients log in to view appointments, results, prescriptions
2. **Mobile app** — React Native or PWA for nurses and doctors on ward rounds
3. **Real-time notifications** — WebSocket for in-app alerts (critical lab results, new appointments)
4. **Telemedicine** — video consultation integration
5. **Questionnaires/surveys** — patient satisfaction and pre-consultation health screening
6. **Events management** — hospital events calendar with registration
7. **Advanced analytics** — charts and graphs for admin dashboard
8. **HMO integration** — direct claims submission to insurance providers
9. **Barcode/QR scanning** — for patient wristbands and sample tracking
10. **Multi-facility** — the tenancy infrastructure is already built; extend to support multiple hospital branches

---

*Document updated: May 2025*  
*Developed by: ProgrammoCeuticals*
