# Permission Matrix
**Platform:** Pharmacy Internship Marketplace & Management Platform  
**Last updated:** 2026-10-17

---

## Role definitions

| Role | Scope | Description |
|---|---|---|
| `PUBLIC_VISITOR` | Platform | Unauthenticated user |
| `APPLICANT` | Platform | Authenticated applicant user |
| `ORG_OWNER` | Organisation | Manages org settings and staff access |
| `RECRUITER_HR` | Organisation (+ optional location) | Manages vacancies, applications, interviews, offers |
| `INTERNSHIP_COORDINATOR` | Organisation (+ optional location) | Manages active interns, onboarding, rotations, completion |
| `PRECEPTOR_SUPERVISOR` | Organisation / location | Views assigned interns; records permitted assessments |
| `FINANCE_ADMIN` | Organisation | Views non-payment administrative details |
| `READ_ONLY_STAFF` | Organisation (+ optional location) | Views explicitly authorised records |
| `PLATFORM_ADMIN` | Platform | Full platform administrative access |
| `PLATFORM_MODERATOR` | Platform | Community moderation access (Phase 3) |
| `PLATFORM_SUPPORT` | Platform | Support case access only |

**Important:** Employer staff roles are scoped to their organisation and, where location_id is set, to that location. An `ORG_OWNER` of Organisation A cannot access Organisation B.

---

## Organisations and verification

| Action | PUBLIC_VISITOR | APPLICANT | ORG_OWNER | RECRUITER_HR | INTERNSHIP_COORDINATOR | PLATFORM_ADMIN |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| View public organisation profile (APPROVED only) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View own organisation full profile | — | — | ✅ | ✅ | ✅ | ✅ |
| View other org's private profile/documents | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Create organisation registration | — | ✅¹ | — | — | — | ✅ |
| Edit own organisation profile | — | — | ✅ | — | — | ✅ |
| Submit organisation for verification | — | — | ✅ | — | — | ✅ |
| Upload verification documents | — | — | ✅ | — | — | ✅ |
| Open/assign verification case | — | — | — | — | — | ✅ |
| Update verification status | — | — | — | — | — | ✅ |
| Approve/reject/suspend organisation | — | — | — | — | — | ✅ |
| Record verification meeting | — | — | — | — | — | ✅ |
| View verification documents (own org) | — | — | ✅ | — | — | ✅ |
| Invite staff to organisation | — | — | ✅ | — | — | ✅ |
| Assign/revoke staff roles | — | — | ✅ | — | — | ✅ |

¹ A user registers an organisation and becomes its first ORG_OWNER.

---

## Vacancies

| Action | PUBLIC_VISITOR | APPLICANT | ORG_OWNER | RECRUITER_HR | INTERNSHIP_COORDINATOR | PRECEPTOR_SUPERVISOR | PLATFORM_ADMIN |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Browse published vacancies | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View vacancy details (published) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View own org's draft/paused/closed vacancies | — | — | ✅ | ✅ | 🔍² | — | ✅ |
| Create vacancy draft | — | — | ✅ | ✅ | — | — | — |
| Edit vacancy | — | — | ✅ | ✅ | — | — | ✅ |
| Publish vacancy (org must be APPROVED) | — | — | ✅ | ✅ | — | — | — |
| Pause/close vacancy | — | — | ✅ | ✅ | — | — | ✅ |
| Archive vacancy | — | — | ✅ | ✅ | — | — | ✅ |
| Reduce total_positions below reserved+confirmed | — | — | ❌³ | ❌³ | — | — | ❌³ |

² Read-only view if granted.  
³ Rejected by backend regardless of role; requires explicit resolution workflow first.

---

## Applications

| Action | PUBLIC_VISITOR | APPLICANT (own) | APPLICANT (other) | RECRUITER_HR (own org) | INTERNSHIP_COORDINATOR | PLATFORM_ADMIN |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Submit application | — | ✅ | — | — | — | — |
| View own applications | — | ✅ | — | — | — | ✅ |
| View other applicants' applications | — | ❌ | ❌ | ✅ | 🔍⁴ | ✅ |
| Withdraw own application | — | ✅ | — | — | — | — |
| View employer internal notes | — | ❌ | ❌ | ✅ | ✅ | ✅ |
| Add internal notes | — | — | — | ✅ | — | — |
| Shortlist / reject / waitlist / progress | — | — | — | ✅ | — | ✅ |
| Record credential check | — | — | — | ✅ | — | ✅ |
| View application documents (own) | — | ✅ | — | ✅ | — | ✅ |
| View application documents (another applicant) | — | ❌ | ❌ | ✅⁵ | — | ✅ |

⁴ View-only for applications related to their placements.  
⁵ Only for applications to the employer's own vacancies.

---

## Interviews

| Action | APPLICANT (own) | RECRUITER_HR (own org) | PLATFORM_ADMIN |
|---|:---:|:---:|:---:|
| View own interview invitations | ✅ | — | ✅ |
| Schedule interview event | — | ✅ | — |
| Reschedule/cancel interview | — | ✅ | — |
| Record interview outcome/notes | — | ✅ | — |
| View outcome notes (own) | ❌⁶ | ✅ | ✅ |

⁶ Internal interview outcome notes are never returned to applicant API endpoints.

---

## Offers

| Action | APPLICANT (own) | RECRUITER_HR (own org) | ORG_OWNER (own org) | PLATFORM_ADMIN |
|---|:---:|:---:|:---:|:---:|
| View own offers | ✅ | — | — | ✅ |
| Create/draft offer | — | ✅ | ✅ | — |
| Issue offer | — | ✅ | ✅ | — |
| Withdraw offer (before acceptance) | — | ✅ | ✅ | — |
| Accept offer | ✅ | — | — | — |
| Decline offer | ✅ | — | — | — |
| View other applicants' offers | ❌ | ✅⁷ | ✅⁷ | ✅ |

⁷ Only for their own organisation's offers.

---

## Placements

| Action | APPLICANT (own) | RECRUITER_HR | INTERNSHIP_COORDINATOR | PRECEPTOR_SUPERVISOR | PLATFORM_ADMIN |
|---|:---:|:---:|:---:|:---:|:---:|
| View own placement | ✅ | — | ✅ | ✅ | ✅ |
| View own org's placements | — | 🔍 | ✅ | 🔍⁸ | ✅ |
| Update placement status (active, interrupted, etc.) | — | — | ✅ | — | ✅ |
| Mark placement COMPLETED | — | — | ✅ | — | ✅ |
| Assign supervisor | — | — | ✅ | — | ✅ |
| Record assessments | — | — | ✅ | ✅⁹ | ✅ |
| Initiate withdrawal/termination | ✅¹⁰ | — | ✅ | — | ✅ |
| Authorise withdrawal/termination | — | — | ✅ | — | ✅ |

⁸ Only assigned interns.  
⁹ Only assessments they are permitted to record per their assignment.  
¹⁰ Applicant can request withdrawal; coordinator must authorise.

---

## Platform administration

| Action | PLATFORM_ADMIN | PLATFORM_MODERATOR | PLATFORM_SUPPORT |
|---|:---:|:---:|:---:|
| Review and approve/reject organisations | ✅ | — | — |
| Suspend/reinstate organisations | ✅ | — | — |
| Manage platform users | ✅ | — | — |
| View all audit logs | ✅ | — | — |
| View platform-wide metrics | ✅ | — | — |
| Manage community content reports | ✅ | ✅ | — |
| Resolve moderation cases | ✅ | ✅ | — |
| View support cases | ✅ | — | ✅ |
| Manage configuration/reference data | ✅ | — | — |
| Grant/revoke platform admin roles | ✅¹¹ | — | — |

¹¹ High-impact; requires a second authorised admin for critical changes (recommended; confirm with product owner).

---

## Object-level access rules (IDOR protection)

All backend controllers must enforce these rules in addition to role checks:

1. **Organisation scope:** An employer staff user can only access resources belonging to their organisation (and their location if scope is location-level). Verify membership on every request.
2. **Applicant scope:** An applicant can only access their own applications, offers, placements, and profile.
3. **Document access:** Generating a signed download URL for a private document requires verifying that the requesting user is authorised to access that specific document (owns the application/is employer with access to the application/is platform admin).
4. **Internal notes:** Employer internal notes must never be included in any response returned to an applicant-scoped endpoint, regardless of query parameters.
5. **Vacancy counts:** Available positions are always computed server-side; clients cannot submit a count.
6. **State transitions:** Verify both role permission AND that the current state allows the requested transition before applying any change.
