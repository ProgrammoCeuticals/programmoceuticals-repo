# Phase 4 Backend Review

## Evidence

Build verification per commit message: `pnpm prisma validate → ok`, `pnpm prisma generate → ok`, `pnpm --filter @rims/api build → exit 0`.

---

## Checklist Results

### 1. Prisma schema enums and models
All 5 enums (`UsageMetricType`, `IntegrationStatus`, `WebhookDeliveryStatus`, `NotificationChannel`, `NotificationStatus`) and all 6 models (`UsageRecord`, `IntegrationConnection`, `WebhookDelivery`, `Notification`, `NotificationPreference`, `AnalyticsSnapshot`) are present in `prisma/schema.prisma`. Back-relations are correctly added to `Tenant` and `User`. **Pass.**

### 2. SubscriptionsModule — provisionTrial transaction
`subscriptions.service.ts` lines 107–201: `prisma.$transaction` wraps tenant creation, settings, institution, trial plan upsert, subscription, user, membership, and invitation (steps 1–3, 5–9). Email queue and audit log are correctly placed after the transaction. **Pass.**

`seedPlans` service method exists (`subscriptions.service.ts` line 236) but **no controller endpoint exposes it**. The task requires `seedPlans` as a callable endpoint. The `SubscriptionsController` has no handler that calls `this.subscriptionsService.seedPlans()`. **Blocker — see finding F-001.**

### 3. UsageModule — BigInt cast
`usage.service.ts`: `getUsage` casts via `.map((r) => ({ ...r, value: Number(r.value) }))`. `getCurrentUsageSummary` casts all four fields with `Number(...)`. **Pass.**

### 4. NotificationsModule — lowercase accessor
`notifications.service.ts`: uses `this.prisma.notification` (Prisma-generated lowercase accessor) throughout, avoiding collision with NestJS's own `Notification` type. Comment at line 7 confirms the intent. **Pass.**

Pagination and ownership checks present in `findForUser`, `markRead`, `dismiss`. **Pass.**

### 5. AnalyticsModule
`getTrends` (4 metrics), `getWorkloadDistribution`, `getProjectRiskIndicators`, `getPublicationTrends` all implemented. `saveSnapshot` wires to `analyticsSnapshot.create`. **Pass.**

### 6. AiReportsModule — API key never logged
`ai-reports.service.ts` line 66: only `(err as Error).message` is logged, not the `apiKey` variable. Graceful degradation returns `summary: null, isAiGenerated: false` when key absent. Disclaimer always returned at line 78. **Pass.**

### 7. PlatformAdminModule — guard
`platform-admin.guard.ts`: async `canActivate`, checks `userRoleAssignment` for `role.name === 'Platform Super Admin'` and `isSystem: true`. Controller applies `@UseGuards(JwtAuthGuard, PlatformAdminGuard)` at class level. `PrismaModule` is `@Global()` so `PrismaService` injection resolves. **Pass.**

### 8. All new modules registered in app.module.ts
`app.module.ts` imports: `SubscriptionsModule`, `UsageModule`, `NotificationsModule`, `AnalyticsModule`, `AiReportsModule`, `PlatformAdminModule` — all present. **Pass.**

### 9. Worker — full NestJS BullMQ processors
`worker-app.module.ts` registers three queues and three processor providers. Each processor extends `WorkerHost` with `@Processor` decorator. `UsageMetricsTriggerController` wires `@InjectQueue`. **Pass.**

---

## Blockers

### F-001 — `seedPlans` endpoint missing from SubscriptionsController

**File:** `apps/api/src/modules/subscriptions/subscriptions.controller.ts`

**Evidence:** The task requires `seedPlans` as a deliverable endpoint of `SubscriptionsModule`. The service method `seedPlans()` exists at `subscriptions.service.ts:236` but `subscriptions.controller.ts` contains no handler that calls it. A grep across the entire module confirms no route is wired to it.

**Consequence:** Subscription plans cannot be seeded through the API. Any tenant provisioning that relies on the named plans (Starter, Professional, Enterprise) returning from `GET subscriptions/plans` will return an empty list until plans are manually inserted in the database. The `provisionTrial` flow itself upserts the Trial plan inline, but the three paid plans are only reachable via `seedPlans`.

**Correction:** Add a POST endpoint (e.g. `POST subscriptions/plans/seed`) in `SubscriptionsController` that calls `this.subscriptionsService.seedPlans()` and restrict it with an appropriate guard (e.g. `@RequirePermissions('institution.settings.manage')` or behind `PlatformAdminGuard`).
