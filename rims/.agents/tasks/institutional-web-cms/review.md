# Review — RIMS Institutional Web Presence & CMS

**Verdict:** CHANGES_REQUESTED  
**Commits reviewed:** `e4faa920` (feat), `5a42448f` (fix/review-findings)  
**Build evidence:** All three build commands recorded as exit 0 in commit messages.

---

## Evidence Summary

### Critical checks — results

| Check                                                               | Result                                                                                                                                                                                                                          |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| All queries include `tenantId` filter                               | ✅ Every service uses `tenantId` in Prisma `where` clauses; child models also carry denormalised `tenantId`                                                                                                                     |
| Contact submissions never via public GET                            | ✅ `PublicController` has no GET for submissions; only `@Post('contact')` exists; authenticated `GET /contact-submissions` requires `website.content.review`                                                                    |
| `resolveTenantFromHostname` reads Host header                       | ⚠️ Controller's `getHostname()` accepts `X-Site-Hostname` header with priority over `Host` — deviates from plan wording but remains safe because the lookup is still constrained to `WebsiteDomain.verificationStatus=VERIFIED` |
| Draft content never returned by public API                          | ✅ All public API methods filter `status: 'PUBLISHED'` explicitly; `resolveTenantFromHostname` throws if website status ≠ PUBLISHED                                                                                             |
| `@Public()` on public controller class                              | ✅ `SetMetadata(IS_PUBLIC_KEY, true)` applied via class-level decorator                                                                                                                                                         |
| `@RequirePermissions(...)` on every CMS write handler               | ✅ Verified across all create/patch/post/delete handlers in `institutional-web.controller.ts`                                                                                                                                   |
| `AuditService.log()` on publish/unpublish/approve                   | ✅ Present in `pages.service.ts`, `content.service.ts`, `publication-links.service.ts`, `website.service.ts`, `domains.service.ts`, `navigation.service.ts`, `media.service.ts`                                                 |
| Status transitions server-side validated with `BadRequestException` | ✅ For pages: submit (DRAFT\|CHANGES_REQUESTED→SUBMITTED), approve (SUBMITTED\|CHANGES_REQUESTED→APPROVED). **BLOCKER: publish() allows DRAFT** — see finding F-001                                                             |
| `employeeId` stripped from public `WebsiteTeamProfile` responses    | ✅ `public-api.service.ts` `listTeamProfiles()` uses an explicit `select` that omits `employeeId`                                                                                                                               |
| SVG rejected in media upload                                        | ✅ `media.service.ts` `create()` throws `BadRequestException` if `mimeType === 'image/svg+xml'`; note: check is in service layer, not DTO                                                                                       |
| Build commands exit 0                                               | ✅ Recorded in commit message for `e4faa920` and confirmed fix build in `5a42448f`                                                                                                                                              |

---

## Blockers

### F-001 — `pages.service.ts` `publish()` permits DRAFT→PUBLISHED, bypassing approval workflow

**File:** `apps/api/src/modules/institutional-web/pages.service.ts`, lines 252–258

**Evidence:**

```typescript
if (existing.status !== "APPROVED" && existing.status !== "DRAFT") {
  throw new BadRequestException(
    `Cannot publish page with status ${existing.status}. Page must be APPROVED first.`,
  );
}
```

**Plan requirement (step 3.4):**

> `publish(id, tenantId, actorId)` — transition **APPROVED→PUBLISHED** …

**Spec requirement (Section 10.1):**

> `Draft → Submitted for Review → Changes Requested / Approved → … → Published`  
> State transitions must be explicit and backend-validated.

**Consequence:** Any user with `website.content.publish` can call `POST /institutional-web/pages/:id/publish` on a DRAFT page and immediately make it public, skipping the submit→review→approve governance that the spec mandates. This directly violates the controlled publishing workflow and the "never expose unapproved content" requirement.

**Correction:** Remove `"DRAFT"` from the allowed set:

```typescript
if (existing.status !== "APPROVED") {
  throw new BadRequestException(
    `Cannot publish page with status ${existing.status}. Page must be APPROVED first.`,
  );
}
```

---

## Non-blocking observations (for information only — not approval conditions)

1. **`X-Site-Hostname` header accepted as priority over `Host`** (`public.controller.ts` `getHostname()`): Plan says "Host header only." In practice this is safe (still constrained to `VERIFIED` domain lookup) and is needed for the `public-web` Next.js proxy which sends this header per plan section 5.5. The internal inconsistency in the plan text does not create a security risk.

2. **Contact route path is `/contact` not `/contact-submissions`**: Plan section 3.12 lists `POST /contact-submissions` but both the controller (`@Post('contact')`) and the `public-web` proxy call `/contact`. They match each other so the feature works end-to-end.

3. **SVG check is service-layer only**: The `CreateMediaDto` does not include an `@IsIn([...allowedMimeTypes])` or `@NotEquals('image/svg+xml')` validator; the check lives in `media.service.ts` `create()`. The service-layer guard is effective for all code paths that go through the service, which is the correct place for a security guard. No additional DTO check is required by the plan.
