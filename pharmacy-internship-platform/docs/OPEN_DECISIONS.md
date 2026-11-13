# Open Decisions Register
**Platform:** Pharmacy Internship Marketplace & Management Platform  
**Last updated:** 2026-10-17  
**Status key:** 🔴 Blocking (must resolve before Phase 1 production) · 🟡 Important (resolve before launch) · 🟢 Deferrable

---

## OD-001 — Product name  
**Status:** 🔴 Blocking  
**Question:** What is the working name displayed to users on the website, mobile app, and in communications?  
**Recommended default:** Use a placeholder (e.g. "PharmIntern NG") in development; replace before any public launch.  
**Owner:** Product owner  
**Decision:**

---

## OD-002 — Offer reservation duration / expiry window  
**Status:** 🔴 Blocking  
**Question:** What is the maximum number of days an employer may set as the acceptance deadline for an offer? What is the minimum? What happens when an employer does not specify a deadline — does the system apply a platform default?  
**Recommended default:** Employer must specify a deadline. Platform minimum: 2 days. Platform maximum: 30 days. If deadline is omitted or invalid, the system rejects the offer creation request rather than silently defaulting.  
**Owner:** Product owner  
**Decision:**

---

## OD-003 — Cancellation/withdrawal after placement acceptance  
**Status:** 🔴 Blocking  
**Question:** If an accepted intern (or the employer) needs to cancel after acceptance, what is the process? Who may initiate? Who must approve? Is the placement record deleted or archived? Are previously closed applications ever reopened?  
**Recommended default (from spec §11.4):** Cancellation requires a recorded request and authorised decision. Previously closed applications and declined offers are NOT automatically restored. Candidates must reapply or employers must reopen recruitment. All parties receive notifications.  
**Owner:** Product owner + legal adviser  
**Decision:**

---

## OD-004 — PCN licence / verification requirements by centre type  
**Status:** 🔴 Blocking  
**Question:** Which documents, checks, and accreditations are required for each centre type (community pharmacy, hospital, industrial, etc.)? Are requirements the same for branches?  
**Recommended default:** Verification checklist is configurable by centre type by the platform admin. The platform does not hardcode regulatory requirements. Centre types have separate configurable checklists.  
**Owner:** Product owner + qualified local adviser  
**Note:** Do not claim official PCN integration or regulatory endorsement.  
**Decision:**

---

## OD-005 — Whether applicants may review placements completed outside the platform  
**Status:** 🟡 Important  
**Question:** Can a pharmacist submit a review for an internship that was not managed through this platform? If yes, how are these "unverified" reviews displayed and labelled to avoid misrepresentation?  
**Recommended default:** Allow unverified historical reviews but display a clear label ("Self-declared experience — not verified through this platform"). Verified placements (managed through the platform) display a different badge.  
**Owner:** Product owner  
**Decision:**

---

## OD-006 — Employer mobile app scope  
**Status:** 🟡 Important  
**Question:** Which employer features appear in the mobile app for Phase 1? The spec says "essential actions and notifications" — what does that include specifically?  
**Recommended default:** Employer mobile Phase 1 scope = push notifications for new applications and offers, view-only candidate pipeline, ability to shortlist/reject, view interview schedule. Full management stays on web.  
**Owner:** Product owner  
**Decision:**

---

## OD-007 — Monetisation and employer subscription model  
**Status:** 🟢 Deferrable  
**Question:** Will employers pay a subscription? What features are gated? When does billing begin?  
**Recommended default:** Essential applicant discovery and application are free. Subscription billing is deferred to Phase 4. No billing infrastructure is built in Phase 1.  
**Owner:** Product owner  
**Decision:**

---

## OD-008 — Vacancy capacity change resolution workflow  
**Status:** 🔴 Blocking  
**Question:** If an employer tries to reduce `total_positions` below `reserved + confirmed`, should the system: (a) reject the change with an error, (b) require the employer to manually resolve the conflict first (e.g. withdraw offers), or (c) offer a wizard to assist resolution?  
**Recommended default:** (a) Reject the change and return a clear error explaining why, listing the blocking offers/placements. Option (b) can be built in Phase 2.  
**Owner:** Product owner  
**Decision:**

---

## OD-009 — Whether draft applications are supported  
**Status:** 🟡 Important  
**Question:** Can applicants save a partial application as a draft before submitting? If yes, how long are drafts retained before automatic expiry?  
**Recommended default:** Draft applications are supported. Auto-expire drafts after 30 days or when the vacancy closes, whichever is earlier. Do not count drafts as active applications for capacity purposes.  
**Owner:** Product owner  
**Decision:**

---

## OD-010 — Formal PCN API or integration  
**Status:** 🟢 Deferrable  
**Question:** Is any official PCN API or data feed available for licence verification or accreditation status?  
**Recommended default:** No API assumed. Platform performs its own document-based verification. If an integration becomes available, it is additive. Do not represent platform approval as regulatory certification.  
**Owner:** Product owner + PCN (if applicable)  
**Decision:**

---

## OD-011 — Data retention and deletion policy  
**Status:** 🔴 Blocking (before production)  
**Question:** How long are applicant profiles, application records, offer documents, and audit logs retained? What happens when a user requests deletion? What records must be retained despite a deletion request (e.g. audit trail)?  
**Recommended default:** Align with NDPR/applicable Nigerian data-protection law after review by qualified adviser. Pending that review: retain placement and audit records for 5 years; allow user profile deletion subject to anonymisation of historical records.  
**Owner:** Product owner + legal adviser  
**Decision:**

---

## OD-012 — Employer brand / profile visibility before approval  
**Status:** 🟡 Important  
**Question:** While a centre is under review, can its profile page be visible to the public? Should it be able to receive expressions of interest even before publishing vacancies?  
**Recommended default:** Centre profile is not publicly visible until `APPROVED`. No applications or vacancies are possible before approval.  
**Owner:** Product owner  
**Decision:**

---

## OD-013 — Placement transfer policy  
**Status:** 🟢 Deferrable  
**Question:** Can a confirmed placement be transferred from one organisation branch to another? What is the process?  
**Recommended default:** Placement transfer is out of scope for Phase 1. If needed in the future, it requires a separately defined and authorised transfer policy.  
**Owner:** Product owner  
**Decision:**

---

## OD-014 — Multi-factor authentication  
**Status:** 🟡 Important  
**Question:** Is MFA required or optional for applicants? For employer staff? For platform admins?  
**Recommended default:** MFA is required for platform admins and recommended (optional) for employer organisation owners. MFA is optional for applicants in Phase 1.  
**Owner:** Product owner  
**Decision:**

---

## OD-015 — File types and size limits for document uploads  
**Status:** 🔴 Blocking  
**Question:** Which file types are allowed for CV, academic transcript, licence, and other documents? What is the maximum file size?  
**Recommended default:** Allowed: PDF, JPEG, PNG, DOCX. Maximum per file: 10 MB. Maximum per application submission: 50 MB. Enforce server-side; do not rely on frontend-only validation.  
**Owner:** Product owner  
**Decision:**

---

## OD-016 — Offer letter generation vs. upload  
**Status:** 🟡 Important  
**Question:** Should the platform generate a PDF offer letter from a template, or should employers upload their own letter? Both?  
**Recommended default:** Both options supported. Employer may upload their own letter (PDF) or complete a platform template. Template-generated letters are clearly labelled as drafted by the platform and must be reviewed by the employer before issuance. Legal review of template language is required before production use.  
**Owner:** Product owner + legal adviser  
**Decision:**

---

## OD-017 — Nigerian tax/employment classification  
**Status:** 🔴 Blocking (before production)  
**Question:** What is the legal classification of an intern placement for Nigerian employment law purposes? Does this affect anything the platform records or displays?  
**Recommended default:** The platform records employer-provided remuneration information for display only. The platform does not manage salary disbursement, tax deductions, or employment contracts. All relevant disclosures must be reviewed by qualified advisers.  
**Owner:** Product owner + legal adviser  
**Decision:**
