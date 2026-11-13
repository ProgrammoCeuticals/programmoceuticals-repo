# RIMS Institutional Web Presence — Open Decisions

> Decisions deferred from the specification with the recommended defaults applied.
> Update this document when a decision is made and record the rationale.

---

## 1. Multi-tenancy: subdomain vs. custom domain routing

**Status:** Default applied.

**Decision:** Custom domain as primary resolution mechanism. Each tenant registers a
hostname via the Domains API; the public site resolves by matching the incoming `Host`
header against `WebsiteDomain` records with `verificationStatus = VERIFIED`.

The `X-Site-Hostname` request header is also supported for programmatic access from the
public-web Next.js app (server-to-server, with hostname injected via env var
`SITE_HOSTNAME`).

**To change:** Switch the resolution in `PublicApiService.resolveTenantFromHostname` to
read a subdomain pattern instead. Subdomain-based routing can be added alongside custom
domain support.

---

## 2. Rich-text / block editor

**Status:** Deferred — not yet decided.

**Options:**

- **A.** Plain HTML textarea stored in `body` fields (current default — no frontend editor)
- **B.** Integrate Tiptap or Lexical in the CMS page editor
- **C.** Use a headless CMS approach (Notion-like blocks stored in `configJson`)

**Recommendation:** Start with option A for MVP; migrate to option B when the editing
UX is a priority.

---

## 3. Media upload pipeline

**Status:** Deferred — stub only.

**Current behaviour:** `MediaService.create` generates an internal `storageKey` but does
not upload anything to object storage.

**To complete:** Wire up S3 (or compatible) presigned URL generation. The `storageKey`
field in `WebsiteMedia` is the intended object store path. The frontend should:

1. Call `POST /institutional-web/media` to register the record.
2. Receive a presigned upload URL.
3. Upload directly from the browser.

---

## 4. Domain verification via DNS TXT record

**Status:** Deferred — stub only.

**Current behaviour:** `DomainsService.verify` immediately sets status `VERIFIED`.
No DNS check is performed.

**To complete:** Run a background job that queries the DNS TXT record
`_rims-verify.<hostname>` and compares it to `verificationToken`. Mark the domain
`VERIFIED` on match or `FAILED` after a configurable number of retries.

---

## 5. Public-website SSR vs. static generation

**Status:** Default applied — ISR with 60-second revalidation.

**Decision:** The `apps/public-web` Next.js app uses Incremental Static Regeneration
(`next: { revalidate: 60 }`) on all `apiFetch` calls. This balances freshness against
load on the RIMS API.

**To change:** Set `revalidate: 0` for fully dynamic, or `revalidate: false` for fully
static. Fine-grained per-page control is possible via Next.js `generateStaticParams`.

---

## 6. Contact form rate limiting

**Status:** Default applied — framework throttle only.

**Decision:** The NestJS `ThrottlerModule` is applied globally (100 requests/60 s per
IP). The `/api/contact` Next.js route handler and the public API `POST /contact` endpoint
both rely on this global guard.

**To complete for production:** Apply a stricter per-route throttle (e.g. 5/min) on
`PublicController.submitContact` using `@Throttle(5, 60)` from `@nestjs/throttler`, and
add per-email deduplication in `PublicApiService.submitContact`.

---

## 7. Contact submission data retention

**Status:** Deferred.

**Decision:** The `WebsiteContactSubmission.retentionExpiresAt` field exists but is not
yet populated by any background job.

**To complete:** Add a scheduled job (`@nestjs/schedule`) that sets
`retentionExpiresAt = receivedAt + configured days` on creation, and a nightly cleaner
that hard-deletes records past their expiry.

---

## 8. Analytics / page view tracking

**Status:** Deferred.

**The `website.analytics.view` permission is provisioned but no analytics model or
service is implemented yet.** Integration with a self-hosted analytics service (e.g.
Plausible, Umami) or a server-side event collector is recommended over third-party
tracking to preserve privacy.

---

## 9. Theme selection

**Status:** Partial — model and permission exist.

**The `WebsiteThemeSelection` model and `themeKey` concept are in place.** The actual
theme rendering (CSS variables, component variants) in `apps/public-web` is not yet
wired up. Currently the Next.js app uses a single hardcoded Tailwind theme.

**To complete:** Read `themeKey` from the site info API and apply it to the root layout
(e.g. set CSS custom property `--primary-color` from branding). Add a theme selector UI
in `WebsiteBrandingPage`.

---

## 10. Scheduled page publishing

**Status:** Deferred.

**The `WebsitePage.scheduledAt` field exists** but no job fires to publish pages at
their scheduled time. Add a `@Cron` job in `PagesService` that polls for pages with
`status = APPROVED` and `scheduledAt <= now()` and calls `publish`.

---

## 11. Spam filtering for contact submissions

**Status:** Deferred — field provisioned only.

**The `WebsiteContactSubmission.spamStatus` field exists** but no spam filter runs on
submission. Consider integrating Akismet or a simple honeypot field in the contact form
to set `spamStatus = SPAM` on suspected submissions.
