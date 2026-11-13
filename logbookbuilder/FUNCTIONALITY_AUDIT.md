# LogbookBuilder — Functionality Audit

**Date:** 2025  
**Scope:** Full client + server source audit. Every file in `client/src/` and `server/src/` was read. No code was executed or modified.

---

## Executive Summary

The application is a well-structured GxP digital logbook platform with a clean architecture. The core CRUD flows (logs, records, personnel, users, audit, signatures, export) are all present and wired correctly end-to-end. However, there are **several functional bugs and missing features** that must be fixed before the platform can be used reliably:

| Severity | Issue | Area |
|----------|-------|------|
| 🔴 BROKEN | Synchronized field resolution reads `log.settings.linkedLogIds` (never set) — synced values always resolve to nothing | Server / Data flow |
| 🔴 BROKEN | Record number generation uses a `count(*)` query that is not race-condition safe — duplicate numbers will appear under concurrent inserts | Server |
| 🔴 BROKEN | Export routes send no `Authorization` header — requests arrive unauthenticated (opened via `<a href>` links, not `axios`) | Client |
| 🔴 BROKEN | `ClipboardListIcon` in DashboardPage is a local component wrapping `Clock` — the intended "clipboard-list" icon never renders | Client |
| 🟠 PARTIAL | `RelationshipsPage` is not wired into `App.tsx` — unreachable from the UI | Client |
| 🟠 PARTIAL | No debounce on any search input — every keystroke fires a network request | Client |
| 🟠 PARTIAL | `LogBuilderPage` save: no pre-save validation — empty labels, empty log name, empty column codes are sent to server | Client |
| 🟠 PARTIAL | `AuditPage` has no filter UI — event-type, date-range, and user filters exist on the server but are never exposed | Client |
| 🟠 PARTIAL | `RecordsPage` has no search or filter bar for records within a log | Client |
| 🟠 PARTIAL | `PersonnelPage` create-form has no `linkedUserId` field — the DB column for linking a personnel to a user account is never exposed | Client |
| 🟠 PARTIAL | `UsersPage` has no change-password form (the API endpoint and `changePassword` call exist but are unreachable from any UI) | Client |
| 🟠 PARTIAL | `RecordDetailPage` edit/correct mode: after `onSuccess`, `setRecord(r)` is called with the result and then `reload()` re-fetches — works but the double-update causes a transient stale render | Client |
| 🟠 PARTIAL | No `document.title` update on navigation — page title stays "LogbookBuilder" across all routes | Client |
| 🟠 PARTIAL | No toast/notification feedback on successful form submissions (create user, create personnel, create division, create record, etc.) | Client |
| 🟠 PARTIAL | File upload directory is not guaranteed to exist on first server boot | Server |
| 🟠 PARTIAL | `signaturesRouter` is mounted at **both** `/api/logs/:logId/records/:recordId/sign` and `/api/signatures` — the same router instance handles both prefixes. The verify/revoke routes (`GET /:signatureId/verify`, `POST /:signatureId/revoke`) use `req.params.signatureId` which only matches when the router is used under `/api/signatures`. When reached via the sign path the `signatureId` param is undefined. | Server |
| 🟡 INFO | `ReferencePicker` uses `linkedLogIds[0]` only — if a column is linked to multiple logs, only the first is queried | Client |
| 🟡 INFO | `LogsPage` (the legacy page) links to `/logs/:id/records` which redirect-maps correctly, but the page is never linked in the sidebar — only accessible via manual URL | Client |
| 🟡 INFO | `TemplateDetailPage` shows "Linked logs: N" by reading `log.settings.linkedLogIds` which is never populated; always shows 0 | Client |
| 🟡 INFO | Auth token stored in `localStorage` — no `httpOnly` cookie alternative; acceptable for SPA but documented here as a known trade-off | Client |
| 🟡 INFO | No `RelationshipsPage` route in the sidebar navigation; the page exists but cannot be reached | Client |

---

## Detailed Findings

### 1. Critical Bug — Synchronized Field Resolution Reads the Wrong Source

**Files:** `server/src/modules/records/records.service.ts` (function `resolveSynchronizedValues`, lines ~105–160)  
**Problem:**

```typescript
// server/src/modules/records/records.service.ts
const linkedLogIds = ((log?.settings as Record<string, unknown>)?.linkedLogIds as string[]) ?? [];
if (linkedLogIds.length === 0) return resolved;
```

The server reads `log.settings.linkedLogIds` to find linked log IDs. But **this field is never written**. Log settings are a generic JSONB blob; nothing in `logs.service.ts` (the create/update service), in `LogBuilderPage.tsx`, or anywhere else sets `settings.linkedLogIds`.

Relationships between logs are stored in the separate `logRelationships` table. The correct resolution path is:

1. Query `logRelationships` for rows where `sourceLogId = logId OR targetLogId = logId`.
2. From those rows, determine the "other" log ID.
3. Then find the linked record from the `links` map.

Because `linkedLogIds` is always `[]`, `resolveSynchronizedValues` returns an empty map on every call. Synchronized fields are never resolved — they will always render as `"— will be resolved automatically —"` in the UI and `null` in the database.

**Impact:** Core GxP feature (synchronized/linked record data) is completely non-functional.

---

### 2. Critical Bug — Record Number Race Condition

**File:** `server/src/lib/utils.ts` (`generateRecordNumber`)

```typescript
const result = await db
  .select({ count: sql<number>`count(*)::int` })
  .from(logRecords)
  .where(...);

const count = (result[0]?.count ?? 0) + 1;
return `${prefix}-${padded}`;
```

This counts existing records and adds 1. Under concurrent inserts (two requests arrive simultaneously) both see the same count and generate the same record number. The `uniqueIndex` on `(logDefinitionId, recordNumber)` will cause one insert to fail with a DB constraint error, crashing that request.

**Fix:** Use a `SELECT ... FOR UPDATE` advisory lock, a Postgres sequence, or `INSERT ... ON CONFLICT` with a retry loop.

---

### 3. Critical Bug — Export Links Send No Auth Token

**File:** `client/src/records/RecordsPage.tsx`

```tsx
<a
  href={`/api/logs/${logId}/export/${fmt}`}
  target={fmt === "pdf" ? "_blank" : undefined}
  rel="noreferrer"
>
```

These are plain anchor tags. The browser will follow them without an `Authorization: Bearer <token>` header. The export router requires `requireAuth` (applied via `router.use(requireAuth)`). The server will respond with `401 Unauthorized` for CSV, Excel, and PDF exports.

**Fix:** Call the export URLs via `axios` and use `URL.createObjectURL` to trigger download, or pass the token as a query parameter and accept it on the server (lower security), or implement server-side session cookies.

---

### 4. Broken Icon — `ClipboardListIcon` Is Just `Clock`

**File:** `client/src/dashboard/DashboardPage.tsx`

```typescript
function ClipboardListIcon(props: React.ComponentProps<typeof Clock>) {
  // Re-use Clock icon as stand-in; actual icon imported at top via lucide
  return <Clock {...props} />;
}
```

This local function wraps `Clock`. `lucide-react` does export `ClipboardList` (used in `AuditPage`), but it was never imported into `DashboardPage`. The comment says "actual icon imported at top" but the import list at the top of the file only brings in `BookOpen`, `FileText`, `Clock`, `Plus`, `TrendingUp` — no `ClipboardList`. The quick-action card for "Audit Trail" shows a clock icon instead of a clipboard.

---

### 5. Missing — RelationshipsPage Not Reachable

**File:** `client/src/App.tsx`

`RelationshipsPage` is imported by `client/src/logs/RelationshipsPage.tsx` but is **never registered in `App.tsx`** routes. It is also absent from the `NAV` array in `AppShell.tsx`. There is no route for `/relationships` or any other path. The page is dead code from the navigation perspective.

---

### 6. No Search Debounce on Any Input

**Files:** `TemplatesPage.tsx`, `RecordsIndexPage.tsx`, `UsersPage.tsx`, `PersonnelPage.tsx`, `DivisionsPage.tsx`, `LogsPage.tsx`

All search inputs use the pattern:

```tsx
useEffect(() => {
  reload();
}, [search]);

<input onChange={(e) => setSearch(e.target.value)} />
```

Every character typed triggers an API call immediately. There is no `setTimeout`/`clearTimeout` debounce or any rate-limiting. On a slow connection or large dataset, this will flood the server with requests.

---

### 7. LogBuilder — No Client-Side Validation Before Save

**File:** `client/src/builder/LogBuilderPage.tsx` (`handleSave`)

The save handler calls `logsApi.create()` / `logsApi.update()` without checking:

- `logName.trim()` is empty → server will accept if no unique constraint violation, or reject with a DB error
- Any column has an empty `label` (shows "Untitled column") → the column code auto-derived from an empty label would be `""`, which will fail the server schema
- Any column code is empty or collides with another column

The only error feedback is a catch block showing `err.response?.data?.message`. Client-side validation would give faster, friendlier feedback.

---

### 8. AuditPage — No Filter UI

**File:** `client/src/audit/AuditPage.tsx`

The page only supports pagination. The server's `listAuditEventsService` supports `eventType`, `entityType`, `entityId`, and `userId` query filters (reading from `req.query`). None of these filters are exposed in the UI — no date range filter, no event-type dropdown, no user picker. This makes the audit trail hard to use as records grow.

---

### 9. RecordsPage — No Record Search/Filter

**File:** `client/src/records/RecordsPage.tsx`

The record table shows all records with pagination but no search bar, no date range filter, and no status filter (only active records are shown by default). The server `listRecordsService` accepts a `status` query parameter but it's unused by the client. There's no way to filter by field value, date, or record number from the UI.

---

### 10. PersonnelPage — No User Linking

**Files:** `client/src/personnel/PersonnelPage.tsx`, `server/src/modules/personnel/personnel.service.ts`

The DB schema has `personnel.linkedUserId` to link a personnel record to a user account. The `updatePersonnelSchema` on the server accepts `linkedUserId`. However, `PersonnelForm` in the client has no field for `linkedUserId`, and no UI exists to link a personnel record to a user after creation. The personnel table also doesn't show a "linked user" column.

---

### 11. UsersPage — No Change-Password UI

**Files:** `client/src/personnel/UsersPage.tsx`, `client/src/api/people.ts`

`usersApi.changePassword` exists in the API layer and `POST /api/users/me/change-password` works on the server. But there is no UI in `UsersPage.tsx` (or anywhere else in the client) to call it. The user table only shows name, email, status, and last login — no action to change a password or deactivate a user.

---

### 12. RecordDetailPage — Redundant Double-Reload After Save

**File:** `client/src/records/RecordDetailPage.tsx`

```tsx
onSuccess={(r) => {
  setRecord(r);   // sets record to the returned value immediately
  setMode("view");
  reload();       // then re-fetches the same record
}}
```

`onSuccess` immediately sets `record` to `r` (the server's response to the save), then calls `reload()` which fetches the same record again. This causes a brief flash to the stale value before `reload()` re-sets it. The fix is to drop `setRecord(r)` and only call `reload()`.

---

### 13. No `document.title` Updates on Navigation

**Files:** All page components

No page component calls `document.title = "..."` or uses a `<Helmet>` equivalent. The browser tab always shows the default title from `index.html` regardless of which route the user is on. For a professional GxP tool, each page should set an informative title.

---

### 14. No Toast/Success Feedback After Submissions

**Files:** All form components (`UserForm`, `PersonnelForm`, `RecordEntryForm`, `DivisionsPage`, `RelationshipForm`, etc.)

Successful submissions either silently close a panel or navigate away. There is no toast notification library or inline success message for:
- Creating a record
- Saving the log builder
- Creating a user/personnel
- Creating a relationship
- Voiding/correcting a record

Errors are shown inline (`alert alert-error`) but successes give no visual confirmation. This violates basic UX standards for a form-heavy application.

---

### 15. Server — File Upload Directory Not Pre-Created

**File:** `server/src/modules/files/files.service.ts`

```typescript
const uploadDir = process.env.FILE_UPLOAD_DIR ?? "./uploads";

export const upload = multer({ dest: uploadDir, ... });
```

`multer` will fail on first upload if `uploadDir` does not exist. The signature service does call `fs.mkdir(uploadDir, { recursive: true })` before writing the signature PNG — but the regular file upload through `multer` does NOT. Multer's `dest` option requires the directory to exist.

**Fix:** Call `fs.mkdirSync(uploadDir, { recursive: true })` at module load time (or in an `app.ts` startup hook).

---

### 16. Signatures Router — Shared Instance Double-Mounting Issue

**File:** `server/src/app.ts`

```typescript
app.use("/api/logs/:logId/records/:recordId/sign", signaturesRouter);
app.use("/api/signatures", signaturesRouter);
```

The **same router instance** is mounted on two paths. This is unusual but works for Express. However, the verify/revoke sub-routes use `req.params.signatureId`:

- `GET /:signatureId/verify`
- `POST /:signatureId/revoke`

When reached via `/api/logs/:logId/records/:recordId/sign/:signatureId/verify`, Express would populate `signatureId` only if `mergeParams: true` is set on the router **and** the param is in that segment. Looking at the router definition: `const router = Router({ mergeParams: true })`. Since `mergeParams` is set, `req.params` will include `logId`, `recordId`, AND `signatureId` when the full path is used — so verify/revoke would technically work via either mount point. However, the intended use is:

- Sign: `POST /api/logs/:logId/records/:recordId/sign` → goes to `router.post("/")`
- Verify/Revoke: `GET/POST /api/signatures/:signatureId/verify|revoke` → goes to `router.get("/:signatureId/verify")`

Functionally this works, but if `router` is ever modified (e.g., adding an `/:id` route), both mount points will match it. It's a fragile design; better to split into two separate routers.

---

### 17. ReferencePicker — Uses Only First Linked Log

**File:** `client/src/records/RecordEntryForm.tsx` (`ReferencePicker`)

```typescript
useEffect(() => {
  if (linkedLogIds.length === 0) return;
  ...recordsApi.list(linkedLogIds[0], { limit: 100 })
```

When a column has `dataType: "reference"` and the log has multiple linked logs, the picker only loads records from `linkedLogIds[0]`. This is documented in the comment // TODO but is still a functional limitation.

---

### 18. Data Flow — `log.settings.linkedLogIds` vs `logRelationships` Table

This is the root disconnect also described in bug #1, but it affects **two more places** beyond just the server:

**a) `TemplateDetailPage.tsx`:**
```tsx
<InfoChip
  label="Linked logs"
  value={String(
    ((log.settings as Record<string, unknown>)?.linkedLogIds as string[] ?? []).length
  )}
/>
```
Always shows "0" because `linkedLogIds` is never stored in `log.settings`.

**b) `RecordEntryForm.tsx`:**
```typescript
// If linkedLogIds not passed as prop, derive from relationships
useEffect(() => {
  if (linkedLogIdsProp !== undefined) return;
  import("../api/relationships").then(({ relationshipsApi }) =>
    relationshipsApi.list().then((rels) => {
      const ids = rels
        .filter((r) => r.sourceLogId === log.id || r.targetLogId === log.id)
        .map((r) => (r.sourceLogId === log.id ? r.targetLogId : r.sourceLogId));
      setLinkedLogIds(ids);
    })
  )
}, [log.id]);
```

The **client** correctly derives linked log IDs from the `logRelationships` table. The **server** does not. This is the core mismatch: client sends data correctly, server ignores it because it looks in the wrong place.

---

### 19. Export Routes — Auth Header Gap Detail

Beyond the anchor-tag issue (#3), note the export router applies `router.use(requireAuth)` which checks `req.headers.authorization`. Since `<a href>` browser navigation never sends the JWT, **all three export formats (CSV, Excel, PDF) will return 401 in production**. This is a complete feature break for exports.

---

### 20. Server — `listRelationshipsService` Returns Array, Not Paginated

**File:** `server/src/modules/relationships/relationships.router.ts`

```typescript
router.get("/", async (req, res) => {
  const result = await listRelationshipsService(req.auth!);
  ok(res, result);    // returns plain array, not paginated
});
```

The client `relationshipsApi.list()` (`client/src/api/relationships.ts`) calls this and expects a plain array — so it currently works. But it fetches ALL relationships for the org with no pagination or limit. For organizations with many relationships this could be a performance problem.

---

## Route Coverage — Server vs Client

| Client API call | Server Route | Status |
|----------------|--------------|--------|
| `POST /api/auth/register` | ✅ `authRouter` |
| `POST /api/auth/login` | ✅ |
| `POST /api/auth/refresh` | ✅ |
| `POST /api/auth/logout` | ✅ |
| `GET /api/auth/me` | ✅ |
| `GET /api/logs` | ✅ |
| `GET /api/logs/:id` | ✅ |
| `POST /api/logs` | ✅ |
| `PATCH /api/logs/:id` | ✅ |
| `POST /api/logs/:id/columns` | ✅ |
| `PATCH /api/logs/:id/columns/:cid` | ✅ |
| `DELETE /api/logs/:id/columns/:cid` | ✅ |
| `PUT /api/logs/:id/columns/reorder` | ✅ (client method exists, not called from UI) |
| `GET /api/logs/:id/records` | ✅ |
| `GET /api/logs/:id/records/:rid` | ✅ |
| `GET /api/logs/:id/records/:rid/lineage` | ✅ (client method exists, not called from UI) |
| `GET /api/logs/:id/records/:rid/history` | ✅ |
| `POST /api/logs/:id/records` | ✅ |
| `PATCH /api/logs/:id/records/:rid` | ✅ |
| `POST /api/logs/:id/records/:rid/correct` | ✅ |
| `POST /api/logs/:id/records/:rid/void` | ✅ |
| `POST /api/logs/:lid/records/:rid/sign` | ✅ |
| `GET /api/signatures/:id/verify` | ✅ |
| `POST /api/signatures/:id/revoke` | ✅ |
| `GET /api/logs/:id/export/csv` | ✅ (but broken — no auth header) |
| `GET /api/logs/:id/export/excel` | ✅ (but broken — no auth header) |
| `GET /api/logs/:id/export/pdf` | ✅ (but broken — no auth header) |
| `GET /api/relationships` | ✅ |
| `POST /api/relationships` | ✅ |
| `DELETE /api/relationships/:id` | ✅ |
| `GET /api/audit` | ✅ |
| `GET /api/users` | ✅ |
| `POST /api/users` | ✅ |
| `POST /api/users/me/change-password` | ✅ (no UI) |
| `GET /api/personnel` | ✅ |
| `POST /api/personnel` | ✅ |
| `PATCH /api/personnel/:id` | ✅ (no UI to call it) |
| `GET /api/org` | ✅ (no client API call, no UI) |
| `PATCH /api/org` | ✅ (no client API call, no UI) |
| `POST /api/files` | ✅ (no UI — file upload placeholder shown) |
| `GET /api/files/:id` | ✅ |

**Missing client API calls:**
- `GET /api/org` / `PATCH /api/org` — server exists, no client API file or UI
- `PUT /api/logs/:id/columns/reorder` — server exists, client API method exists, no UI trigger

---

## Recommendations (Priority Order)

### P0 — Must Fix Before Any Real Use

1. **Fix `resolveSynchronizedValues`** to query `logRelationships` instead of `log.settings.linkedLogIds`. The correct query is: find all `logRelationships` where `sourceLogId = logId OR targetLogId = logId`, derive the other log ID, then proceed with the existing record-matching logic.

2. **Fix record number generation** to be race-condition safe. Use `SELECT count(*) + 1 ... FOR UPDATE` inside a transaction, or a Postgres sequence, or catch the unique constraint error and retry with the next number.

3. **Fix exports** to send auth headers. Replace the anchor-tag links with a JS download handler that uses `axios` with blob response type and `URL.createObjectURL`.

### P1 — Core Functionality Gaps

4. **Debounce search inputs** — add a 300ms debounce to all `onChange` handlers that trigger API calls.

5. **Add client-side validation to LogBuilder save** — check `logName.trim()`, check each column has a non-empty `label`, check `name` is non-empty and unique within the column list.

6. **Create uploads directory on server startup** — add `fs.mkdirSync(uploadDir, { recursive: true })` in `files.service.ts` at module load.

7. **Add `RelationshipsPage` route to `App.tsx`** and add a nav link in `AppShell.tsx`.

### P2 — Important UX/Completeness Gaps

8. **Add toast notifications** for successful saves (can be a simple global context with a small toast component, no library needed).

9. **Add `document.title` updates** — a shared `usePageTitle(title)` hook calling `document.effect(() => { document.title = ...; })`.

10. **Add filter UI to `AuditPage`** — event-type dropdown, date-range inputs, submit button.

11. **Add search/filter bar to `RecordsPage`** — at minimum a record-number search and a status filter toggle.

12. **Add `linkedUserId` field to `PersonnelForm`** — a user select dropdown to link a personnel record to a system user.

13. **Add change-password form** — either in `UsersPage` (for admins) or as a "My Account" modal triggered from the sidebar footer.

14. **Fix `ClipboardListIcon`** — import `ClipboardList` from `lucide-react` and remove the local wrapper.

15. **Fix `TemplateDetailPage` "Linked logs" count** — query `relationshipsApi.list()` and filter by log ID, same pattern used in `RecordsPage.tsx`.

### P3 — Design / Polish

16. **RecordDetailPage `onSuccess`** — remove `setRecord(r)` and rely solely on `reload()` to eliminate the double-render.

17. **ReferencePicker** — extend to support multiple linked logs (show a log selector first, then the record list).

18. **Split the signatures router** into a sign router (used at the record path) and a signatures router (used at `/api/signatures`) to eliminate the shared-instance ambiguity.
