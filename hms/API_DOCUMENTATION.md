# Hospital Management System API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this standard format:
```json
{
  "success": boolean,
  "message": string,
  "data": object | array,
  "timestamp": string
}
```

## Error Response Format
```json
{
  "success": false,
  "message": string,
  "error": string,
  "timestamp": string
}
```

---

## 1. Authentication Endpoints

### POST /auth/register
Register a new user
- **Body**: `{ firstName, lastName, email, password, role, facilityId }`
- **Roles**: `admin`, `doctor`, `nurse`, `pharmacist`, `lab_tech`, `receptionist`
- **Response**: `201` - User registered with token

### POST /auth/login
Login user
- **Body**: `{ email, password }`
- **Response**: `200` - Login successful with token

### POST /auth/forgot-password
Request password reset
- **Body**: `{ email }`
- **Response**: `200` - Reset instructions sent

### POST /auth/reset-password
Reset password with token
- **Body**: `{ token, newPassword }`
- **Response**: `200` - Password reset successful

### GET /auth/csrf-token
Get CSRF token
- **Response**: `200` - CSRF token

### GET /auth/profile
Get user profile (Protected)
- **Response**: `200` - User profile data

### PUT /auth/profile
Update user profile (Protected)
- **Body**: `{ firstName?, lastName?, phone?, department? }`
- **Response**: `200` - Profile updated

### POST /auth/change-password
Change user password (Protected)
- **Body**: `{ currentPassword, newPassword }`
- **Response**: `200` - Password changed

### POST /auth/refresh-token
Refresh authentication token (Protected)
- **Response**: `200` - New token

### POST /auth/logout
Logout user (Protected)
- **Response**: `200` - Logged out successfully

---

## 2. Patient Management Endpoints

### POST /patients
Create a new patient (Protected)
- **Body**: `{ firstName, lastName, email?, phone?, dateOfBirth, gender }`
- **Response**: `201` - Patient created

### GET /patients
Get all patients (Protected)
- **Query**: `search?, limit?, offset?`
- **Response**: `200` - List of patients

### GET /patients/{id}
Get patient by ID (Protected)
- **Response**: `200` - Patient details

### PUT /patients/{id}
Update patient information (Protected)
- **Body**: `{ firstName?, lastName?, email?, phone? }`
- **Response**: `200` - Patient updated

### GET /patients/{id}/medical-history
Get patient medical history (Protected)
- **Response**: `200` - Medical history

### POST /patients/{id}/vitals
Add patient vitals (Protected)
- **Body**: `{ bloodPressureSystolic?, bloodPressureDiastolic?, heartRate?, temperature? }`
- **Response**: `201` - Vitals added

### POST /patients/{id}/allergies
Add patient allergy (Protected)
- **Body**: `{ allergen, severity }`
- **Response**: `201` - Allergy added

### POST /patients/{id}/conditions
Add patient condition (Protected)
- **Body**: `{ condition, diagnosedDate? }`
- **Response**: `201` - Condition added

### GET /patients/stats/overview
Get patient statistics (Protected)
- **Response**: `200` - Patient stats

---

## 3. Appointment Management Endpoints

### POST /appointments
Schedule a new appointment (Protected)
- **Body**: `{ patientId, doctorId, appointmentDate, appointmentTime, reason?, duration? }`
- **Response**: `201` - Appointment scheduled

### GET /appointments
Get appointments (Protected)
- **Query**: `doctorId?, patientId?, date?, status?`
- **Response**: `200` - List of appointments

### PUT /appointments/{id}/status
Update appointment status (Protected - Doctor/Nurse/Receptionist)
- **Body**: `{ status, notes? }`
- **Response**: `200` - Status updated

### GET /appointments/availability/{doctorId}/{date}
Get doctor availability (Protected)
- **Response**: `200` - Available time slots

### PUT /appointments/{id}/reschedule
Reschedule appointment (Protected - Doctor/Nurse/Receptionist)
- **Body**: `{ newDate, newTime, reason? }`
- **Response**: `200` - Appointment rescheduled

### PUT /appointments/{id}/cancel
Cancel appointment (Protected - Doctor/Nurse/Receptionist)
- **Body**: `{ reason? }`
- **Response**: `200` - Appointment cancelled

### GET /appointments/upcoming
Get upcoming appointments (Protected)
- **Response**: `200` - Upcoming appointments

### POST /appointments/reminders
Send appointment reminders (Protected - Admin/Receptionist)
- **Response**: `200` - Reminders sent

### POST /appointments/recurring
Create recurring appointments (Protected - Doctor/Nurse/Receptionist)
- **Response**: `201` - Recurring appointments created

### GET /appointments/slots
Get available appointment slots (Protected)
- **Response**: `200` - Available slots

### PUT /appointments/bulk-update
Bulk update appointments (Protected - Admin/Doctor/Receptionist)
- **Response**: `200` - Appointments updated

---

## 4. Doctor Endpoints

### GET /doctors/dashboard
Get doctor dashboard (Protected - Doctor)
- **Response**: `200` - Dashboard data

### GET /doctors/stats
Get doctor statistics (Protected - Doctor)
- **Response**: `200` - Doctor stats

### GET /doctors/schedule
Get doctor schedule (Protected - Doctor)
- **Response**: `200` - Schedule data

### POST /doctors/consultations
Create consultation (Protected - Doctor)
- **Body**: `{ patientId, chiefComplaint, diagnosis?, treatment?, followUpDate? }`
- **Response**: `201` - Consultation created

### GET /doctors/consultations
Get consultations (Protected - Doctor)
- **Query**: `patientId?, status?, date?`
- **Response**: `200` - List of consultations

### GET /doctors/consultations/{id}
Get consultation details (Protected - Doctor)
- **Response**: `200` - Consultation details

### PUT /doctors/consultations/{id}
Update consultation (Protected - Doctor)
- **Response**: `200` - Consultation updated

### POST /doctors/prescriptions
Create prescription (Protected - Doctor)
- **Body**: `{ consultationId, remarks?, items: [{ drugName, dosage, frequency, duration, quantityPrescribed }] }`
- **Response**: `201` - Prescription created

### GET /doctors/prescriptions
Get prescriptions (Protected - Doctor)
- **Query**: `patientId?, consultationId?`
- **Response**: `200` - List of prescriptions

### POST /doctors/vitals
Record patient vitals (Protected - Doctor/Nurse)
- **Body**: `{ patientId, bloodPressureSystolic?, bloodPressureDiastolic?, heartRate?, temperature?, respiratoryRate?, oxygenSaturation?, weight?, height? }`
- **Response**: `201` - Vitals recorded

### GET /doctors/vitals/{patientId}
Get patient vitals history (Protected)
- **Query**: `fromDate?, toDate?`
- **Response**: `200` - Vitals history

### GET /doctors/patients/{patientId}/history
Get patient history (Protected - Doctor)
- **Response**: `200` - Patient history

### POST /doctors/lab-requests
Create lab request from consultation (Protected - Doctor)
- **Response**: `201` - Lab request created

---

## 5. Laboratory Endpoints

### POST /lab/requests
Create lab test request (Protected - Doctor)
- **Body**: `{ patientId, testType, priority, notes? }`
- **Response**: `201` - Lab request created

### POST /lab/requests/bulk
Create multiple lab requests (Protected - Doctor)
- **Body**: `{ requests: [{ patientId, testType, priority }] }`
- **Response**: `201` - Bulk requests created

### GET /lab/requests
Get all lab requests (Protected)
- **Query**: `status?, priority?`
- **Response**: `200` - List of lab requests

### GET /lab/requests/{id}
Get lab request details (Protected)
- **Response**: `200` - Request details

### PUT /lab/requests/{id}/status
Update lab request status (Protected - Lab Tech/Admin)
- **Body**: `{ status, notes? }`
- **Response**: `200` - Status updated

### POST /lab/results
Upload lab test results (Protected - Lab Tech/Admin)
- **Body**: `{ requestId, results, notes?, isCritical? }`
- **Response**: `201` - Results uploaded

### GET /lab/results/{patientId}
Get lab results for patient (Protected)
- **Query**: `fromDate?, toDate?`
- **Response**: `200` - Lab results

### GET /lab/results/critical
Get critical lab results (Protected - Lab Tech/Doctor/Admin)
- **Response**: `200` - Critical results

### GET /lab/catalog
Get available lab tests catalog (Protected)
- **Response**: `200` - Test catalog

### POST /lab/catalog
Add new test to catalog (Protected - Admin)
- **Body**: `{ name, category, price, normalRange?, description? }`
- **Response**: `201` - Test added

### GET /lab/analytics/performance
Get lab performance metrics (Protected - Lab Tech/Admin/Doctor)
- **Query**: `period?, startDate?, endDate?`
- **Response**: `200` - Performance metrics

### GET /lab/analytics/turnaround
Get turnaround time analysis (Protected - Lab Tech/Admin/Doctor)
- **Response**: `200` - Turnaround analysis

### POST /lab/analytics/daily
Generate daily analytics (Protected - Admin)
- **Body**: `{ date? }`
- **Response**: `200` - Daily analytics

### GET /lab/quality-control/samples
Get sample tracking information (Protected - Lab Tech/Admin)
- **Response**: `200` - Sample tracking data

### GET /lab/quality-control/samples/{barcode}
Track specific sample by barcode (Protected - Lab Tech/Admin)
- **Response**: `200` - Sample details

### GET /lab/quality-control/equipment
Get equipment calibration status (Protected - Lab Tech/Admin)
- **Response**: `200` - Equipment calibration data

### POST /lab/quality-control/calibration
Record equipment calibration (Protected - Lab Tech/Admin)
- **Body**: `{ equipmentId, calibrationDate, nextDueDate, notes? }`
- **Response**: `201` - Calibration recorded

### POST /lab/quality-control/qa-checklist
Submit QA checklist (Protected - Lab Tech/Admin)
- **Response**: `201` - QA checklist submitted

### GET /lab/templates
Get result templates (Protected - Lab Tech/Admin)
- **Response**: `200` - Templates

### POST /lab/templates
Save result template (Protected - Lab Tech/Admin)
- **Response**: `201` - Template saved

### DELETE /lab/templates/{id}
Delete result template (Protected - Admin)
- **Response**: `200` - Template deleted

### GET /lab/external-labs/configurations
Get external lab configurations (Protected - Admin)
- **Response**: `200` - Configurations

### POST /lab/external-labs/configurations
Save external lab configuration (Protected - Admin)
- **Response**: `201` - Configuration saved

### POST /lab/external-labs/{labId}/test-connection
Test external lab connection (Protected - Admin)
- **Response**: `200` - Connection test result

### POST /lab/external-labs/send-orders
Send orders to external labs (Protected - Lab Tech/Admin)
- **Body**: `{ orders: [] }`
- **Response**: `200` - Orders sent

### POST /lab/external-labs/sync-results
Sync results from external labs (Protected - Lab Tech/Admin)
- **Response**: `200` - Results synced

### GET /lab/external-labs/status
Get external lab integration status (Protected - Lab Tech/Admin)
- **Response**: `200` - Integration status

---

## 6. Pharmacy Endpoints

### GET /pharmacy/prescriptions
Get pending prescriptions (Protected)
- **Response**: `200` - Pending prescriptions

### GET /pharmacy/prescriptions/{prescriptionId}/verify
Verify prescription (Protected - Pharmacist)
- **Response**: `200` - Prescription verified

### GET /pharmacy/prescriptions/{prescriptionId}/validate
Validate prescription (Protected)
- **Response**: `200` - Validation result

### GET /pharmacy/dispensations/partial
Get partial dispensations (Protected - Pharmacist)
- **Response**: `200` - Partial dispensations

### POST /pharmacy/dispense
Dispense medication (Protected - Pharmacist)
- **Body**: `{ prescriptionId, items: [{ drugName, quantityDispensed, batchNumber }] }`
- **Response**: `201` - Medication dispensed

### GET /pharmacy/dispensations
Get dispensation history (Protected - Pharmacist)
- **Response**: `200` - Dispensation history

### GET /pharmacy/dispensations/patient/{patientId}
Get dispensations by patient (Protected)
- **Response**: `200` - Patient dispensations

### POST /pharmacy/drugs/interactions
Check drug interactions (Protected)
- **Body**: `{ drugs: ["drug1", "drug2"] }`
- **Response**: `200` - Interaction check result

### GET /pharmacy/drugs/{drugName}/availability
Check drug availability (Protected)
- **Response**: `200` - Drug availability

### GET /pharmacy/drugs/expiring
Get expiring drugs (Protected)
- **Query**: `days?` (default: 30)
- **Response**: `200` - Expiring drugs

---

## 7. Dashboard Endpoints

### GET /dashboard/{role}
Get dashboard data by role (Protected)
- **Response**: `200` - Role-specific dashboard data

### GET /dashboard/stats/general
Get general statistics (Protected)
- **Response**: `200` - General stats

---

## 8. FHIR Endpoints

### GET /fhir/patients/{patientId}
Get patient as FHIR resource (Protected)
- **Response**: `200` - FHIR Patient resource

### GET /fhir/lab-results/{resultId}
Get lab result as FHIR Observation (Protected)
- **Response**: `200` - FHIR Observation resource

### POST /fhir/export/patient/{patientId}
Export patient to external FHIR server (Protected)
- **Response**: `200` - Export result

### POST /fhir/export/lab-results/{patientId}
Export lab results to external FHIR server (Protected)
- **Response**: `200` - Export results

### POST /fhir/import/patient/{fhirPatientId}
Import patient from external FHIR server (Protected)
- **Response**: `200` - Imported patient

### GET /fhir/search/{resourceType}
Search FHIR resources (Protected)
- **Query**: Various search parameters
- **Response**: `200` - Search results

### POST /fhir/validate
Validate FHIR resource (Protected)
- **Body**: FHIR resource object
- **Response**: `200` - Validation result

### GET /fhir/capability-statement
Get FHIR capability statement (Protected)
- **Response**: `200` - Capability statement

---

## 9. Onboarding Endpoints

### PUT /onboarding/hospital-info
Update hospital information (Protected)
- **Response**: `200` - Hospital info updated

### PUT /onboarding/about-content
Update about content (Protected)
- **Response**: `200` - About content updated

### PUT /onboarding/services
Update services (Protected)
- **Response**: `200` - Services updated

### PUT /onboarding/logo
Update logo (Protected)
- **Response**: `200` - Logo updated

### PUT /onboarding/social-media
Update social media links (Protected)
- **Response**: `200` - Social media updated

### PUT /onboarding/contact-details
Update contact details (Protected)
- **Response**: `200` - Contact details updated

### POST /onboarding/upload-logo
Upload logo file (Protected)
- **Body**: Form data with file
- **Response**: `200` - Logo uploaded

---

## 10. Public Endpoints

### GET /public/facilities/{facilityId}
Get public facility information
- **Response**: `200` - Facility info

### POST /public/contact
Submit contact form
- **Body**: `{ name, email, subject, message }`
- **Response**: `200` - Contact form submitted

---

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `500` - Internal Server Error

## Rate Limiting

- Authentication endpoints: 5 requests per minute
- General endpoints: 100 requests per minute per user
- File upload endpoints: 10 requests per minute

## Security Features

- JWT authentication
- CSRF protection
- Input validation and sanitization
- SQL injection protection
- XSS protection
- Rate limiting
- HIPAA compliance middleware
- Audit logging

## Data Models

### User
```json
{
  "id": "uuid",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "role": "admin|doctor|nurse|pharmacist|lab_tech|receptionist",
  "facilityId": "uuid",
  "isActive": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Patient
```json
{
  "id": "uuid",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "dateOfBirth": "date",
  "gender": "male|female|other",
  "address": "string",
  "facilityId": "uuid",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Appointment
```json
{
  "id": "uuid",
  "patientId": "uuid",
  "doctorId": "uuid",
  "appointmentDate": "date",
  "appointmentTime": "time",
  "status": "scheduled|completed|cancelled|no_show",
  "reason": "string",
  "duration": "string",
  "facilityId": "uuid",
  "createdAt": "datetime"
}
```

### Consultation
```json
{
  "id": "uuid",
  "patientId": "uuid",
  "doctorId": "uuid",
  "chiefComplaint": "string",
  "diagnosis": "string",
  "treatment": "string",
  "followUpDate": "date",
  "status": "scheduled|in_progress|completed|cancelled",
  "createdAt": "datetime"
}
```

### Prescription
```json
{
  "id": "uuid",
  "consultationId": "uuid",
  "patientId": "uuid",
  "doctorId": "uuid",
  "status": "pending|dispensed|cancelled",
  "remarks": "string",
  "createdAt": "datetime"
}
```

### Lab Request
```json
{
  "id": "uuid",
  "consultationId": "uuid",
  "patientId": "uuid",
  "testName": "string",
  "requestedBy": "uuid",
  "assignedLabId": "uuid",
  "priority": "routine|urgent|stat",
  "status": "pending|completed",
  "createdAt": "datetime"
}
```

This documentation covers the main API endpoints available in the Hospital Management System. Each endpoint includes the HTTP method, path, required authentication, request/response formats, and role-based access controls where applicable.