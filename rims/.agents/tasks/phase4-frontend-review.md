# Phase 4 Frontend Review

**Commit:** `456ebe16` — feat: Phase 4 frontend — analytics, notifications, subscription, platform admin  
**Branch:** `feat/agro-pos-build`  
**Verdict:** APPROVED

---

## Verification Evidence

Build/type-check results recorded in commit message:
- `pnpm --filter @rims/api-client build` → exit 0
- `pnpm --filter @rims/ui build` → exit 0
- `pnpm --filter @rims/web type-check` → exit 0

---

## Requirement Checks

### 1. BarChart SVG component (`packages/ui/src/components/BarChart.tsx`)

- **viewBox** — `viewBox="0 0 600 300"` present on both render paths.
- **Accessibility** — `aria-label={title ?? 'Bar chart'}` and `role="img"` on both SVG elements. Per-bar tooltips via `<rect><title>label: value</title></rect>`.
- **Gridlines** — 5 Y-axis grid lines at 0%, 25%, 50%, 75%, 100% of `maxValue`. Y-axis and X-axis lines drawn.
- **Responsive wrapper** — `<div style={{ width: '100%' }}>` with `width="100%"` and `preserveAspectRatio="xMidYMid meet"` on the SVG.
- **Empty data** — `data.length === 0` guard is checked before any layout logic is used. `maxValue = Math.max(...[], 1)` evaluates safely to `1` (no spread exception in JavaScript). Empty path renders an SVG "No data available" text node.
- **Exported from index.ts** — `export * from "./components/BarChart"` present at `packages/ui/src/index.ts` line 15. ✓

### 2. API client endpoint files (`packages/api-client/src/endpoints/`)

All 6 files created and verified present:

| File | Key exports |
|------|-------------|
| `subscriptions.ts` | `getPlans`, `getCurrentSubscription`, `getEntitlements`, `enableModule`, `disableModule`, `provisionTenant` |
| `usage.ts` | `getUsageSummary`, `getUsageHistory` |
| `notifications.ts` | `getNotifications`, `getUnreadCount`, `markRead`, `markAllRead`, `dismissNotification`, `getNotificationPreferences`, `updateNotificationPreference` |
| `analytics.ts` | `getTrends`, `getWorkloadDistribution`, `getProjectRisks`, `getPublicationTrends` |
| `ai-reports.ts` | `generateExecutiveSummary` |
| `platform-admin.ts` | `listPlatformTenants`, `getPlatformTenantOverview`, `suspendTenant`, `activateTenant`, `getSystemHealth` |

All 6 exported from `packages/api-client/src/index.ts`. ✓

### 3. AppShell notification bell (`apps/web/src/layouts/AppShell.tsx`)

- **Unread count badge** — `displayCount` is `null` when `count === 0`, `"99+"` when `count > 99`, and `String(count)` otherwise. Badge only renders when `displayCount` is truthy. ✓
- **30s refetch** — `refetchInterval: 30000` on the `notifications-unread-count` query. ✓
- **Dropdown last 5 unread** — Second query uses `{ params: { status: "UNREAD", pageSize: 5 } }` with `enabled: open`. ✓
- **Mark-all-read** — `POST /notifications/read-all` mutation wired to "Mark all read" button; button disabled when `count === 0`. ✓
- **View-all link** — "View all notifications →" button navigates to `/notifications`. ✓
- **Authentication guard** — `NotificationBell` is rendered exclusively inside `AppShell`, which is wrapped by `PrivateRoute` in `router.tsx`. `PrivateRoute` redirects to `/login` when `isAuthenticated === false`. Therefore `NotificationBell` is never mounted for unauthenticated users. No API calls are possible before authentication. ✓

### 4. NotificationsPage (`apps/web/src/pages/notifications/NotificationsPage.tsx`)

- **Paginated list** — `page` state, `pageSize: 20`, pagination props forwarded to `DataTable`. ✓
- **Status filter** — Three tabs: All / Unread / Read; `statusFilter` drives query params. ✓
- **Bulk mark-all-read** — `POST /notifications/read-all` mutation, invalidates `notifications` and `notifications-unread-count` queries. ✓
- **Row click** — `handleRowAction` calls `markRead` if `status === "UNREAD"`, then navigates to `actionUrl` if present. ✓

### 5. NotificationPreferencesPage (`apps/web/src/pages/notifications/NotificationPreferencesPage.tsx`)

- **8 event types** — `EVENT_TYPES` array contains exactly 8 entries: `task-assigned`, `task-overdue`, `project-status-change`, `kpi-result-due`, `kpi-result-approved`, `performance-cycle-started`, `document-approved`, `invitation-sent`. ✓
- **Save via PATCH** — `saveMutation` issues `api.patch("/notifications/preferences", { eventType, inAppEnabled, emailEnabled })` for each event type via `Promise.all`. ✓
- **Local state merging** — `mergeWithSaved` applies server preferences over defaults; `useEffect` triggers on data load. ✓

### 6. SubscriptionPage (`apps/web/src/pages/settings/SubscriptionPage.tsx`)

- **Current plan card** — Displays plan name, status badge, start/end dates, max users. ✓
- **Usage summary cards** — 4 cards: Active Users, Employees, Projects, Documents from `/usage/summary`. ✓
- **Module entitlements with enable/disable** — DataTable with `rowActions` toggle buttons; only shown when `hasPermission("institution.settings.manage")`. Mutation calls `POST /subscriptions/modules/enable` or `/disable`. ✓

### 7. PlatformAdminPage (`apps/web/src/pages/platform/PlatformAdminPage.tsx`)

- **System health card** — Displays `tenantCount`, `activeSubscriptions`, `trialSubscriptions`, `uptime`, `dbStatus`, `cacheStatus`, `queueStatus` with status badges; 30s auto-refresh via `refetchInterval: 30000`. ✓
- **Tenant list with search/filter** — `Input` for search, `<select>` for status filter (ALL/ACTIVE/TRIAL/SUSPENDED/INACTIVE); both reset page to 1 on change. ✓
- **Suspend action with reason input** — Clicking "Suspend" sets `suspendTarget`; a modal renders with a labeled `<textarea>` for `suspendReason`; the Confirm "Suspend" button is `disabled={!suspendReason.trim() || suspendMutation.isPending}`. ✓
- **Activate action** — `window.confirm` prompt before calling `POST /platform/tenants/{id}/activate`. ✓

### 8. AnalyticsDashboardPage (`apps/web/src/pages/analytics/AnalyticsDashboardPage.tsx`)

- **BarChart panels** — Two `BarChart` panels: "Research Projects by Month" and "Tasks Completed by Week". Chart data is derived from `trends.labels` × `trends.series[0].data`. Passes empty array `[]` when API response is absent — BarChart empty-data path is triggered safely. ✓
- **Project risk table** — Filters projects where at least one risk flag is true; `DataTable` with badge columns. ✓
- **Workload distribution table** — Sorted descending by `openTaskCount`. ✓

### 9. AIReportPage (`apps/web/src/pages/analytics/AIReportPage.tsx`)

- **Date range picker** — Two `<input type="date">` fields defaulted to first of current month → today. ✓
- **POST to ai-reports/executive-summary** — `api.post("/ai-reports/executive-summary", { periodStart, periodEnd })`. ✓
- **AI / non-AI display paths** — Branched on `result.isAiGenerated`: AI path shows badge + quoted summary + disclaimer; non-AI path shows structured stat cards. ✓
- **AI disclaimer shown prominently** — A styled amber `border-amber-200 bg-amber-50` warning box is rendered unconditionally at the top of the page (before the date picker), containing bolded "Important:" text with explicit guidance against use as sole decision basis. ✓

### 10. Router — 6 new routes

All 6 Phase 4 routes are present inside the `PrivateRoute > AppShell` layout:

```
/notifications                    → NotificationsPage
/notifications/preferences        → NotificationPreferencesPage
/settings/subscription            → SubscriptionPage
/platform/admin                   → PlatformAdminPage
/analytics                        → AnalyticsDashboardPage
/analytics/ai-report              → AIReportPage
```

### 11. Sidebar nav items

4 new sidebar items confirmed in `NAV_ITEMS`:
- Analytics (`/analytics`, `reports.view`)
- Notifications (`/notifications`, `null` — visible to all authenticated users)
- Subscription (`/settings/subscription`, `institution.settings.manage`)
- Platform Admin (`/platform/admin`, guarded by `__platform_admin__` which requires `roles.create && finance.approve && audit.view`)

### 12. Lazy import names vs exported names

| Router import string | Actual export in file |
|---|---|
| `m.NotificationsPage` | `export function NotificationsPage` ✓ |
| `m.NotificationPreferencesPage` | `export function NotificationPreferencesPage` ✓ |
| `m.SubscriptionPage` | `export function SubscriptionPage` ✓ |
| `m.PlatformAdminPage` | `export function PlatformAdminPage` ✓ |
| `m.AnalyticsDashboardPage` | `export function AnalyticsDashboardPage` ✓ |
| `m.AIReportPage` | `export function AIReportPage` ✓ |

---

## Blockers

None.

---

## Notes (non-blocking)

- `NotificationsPage.handleRowAction` calls `markReadMutation.mutate(row.id)` and immediately calls `navigate(row.actionUrl)` without awaiting mutation. The navigation occurs before cache invalidation. The server write still completes; this is a minor UX inconsistency (badge count may not decrement immediately on the destination page) but does not constitute a data failure. It is not a blocker.
- BarChart's `viewBoxHeight` constant (300) is independent of the `height` prop. This is correct responsive SVG behaviour: `viewBox` defines the coordinate system, `height` sets the rendered pixel size with `preserveAspectRatio="xMidYMid meet"` handling the scaling.
