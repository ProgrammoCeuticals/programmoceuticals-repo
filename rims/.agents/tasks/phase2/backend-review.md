# Phase 2 Backend Review — RIMS

**Verdict:** CHANGES_REQUESTED  
**Build evidence:** Prior step reports "Build passed." Accepted as stated.

---

## Files Reviewed

| File | Status |
|------|--------|
| research.service.ts | Blocker |
| research.controller.ts | Pass |
| tasks.service.ts | Blocker |
| tasks.controller.ts | Pass |
| performance.controller.ts | Pass |
| kpi-results.service.ts | Blocker × 3 |
| reports.service.ts | Blocker |

Pattern reference: `employees.service.ts` / `employees.controller.ts`

---

## Checklist Results

### 1. Tenant-scoped queries ✅ (with exceptions noted below)
All `findFirst` / `findMany` / `count` calls include `tenantId` in the `where` clause. The `kpiResult.update` calls use the record's primary key after a prior tenant-checked `findFirst`, which is acceptable.

**Exception — research.service.ts `addStatusUpdate` (line ~280):**  
`prisma.projectStatusUpdate.create` does not include `tenantId` in the created record. The schema field exists (`researchProject` owns it), but if `ProjectStatusUpdate` has its own `tenantId` column the row will be created without it, breaking tenant isolation for any direct query on that table.

### 2. DTOs use class-validator decorators ✅
`SubmitKpiResultDto`, `ReviewKpiResultDto`, `ReturnKpiResultDto`, `CreateResearchProjectDto`, `AddMemberDto`, `CreateTaskDto`, `CreateKpiAssignmentDto` all use `class-validator` decorators correctly.

### 3. Controllers are thin ✅
No business logic in any controller. All controllers delegate to services. Pattern matches `employees.controller.ts`.

### 4. AuditService called on all writes — ❌ BLOCKER

- **`tasks.service.ts` — `addComment`:** Writes a `TaskComment` record but makes no `auditService.log` call. Every write must be audited per the established pattern (every `create`/`update`/`delete` in `employees.service.ts` has an audit call).  
  *File:* `tasks.service.ts`, `addComment` method (line ~135).  
  *Fix:* Add `await this.auditService.log(...)` after the `taskComment.create` call.

- **`research.service.ts` — `addMember`, `removeMember`, `addMilestone`, `updateMilestone`, `addStatusUpdate`:** None of these five write operations call `auditService.log`. Creating/removing project members and milestones are security-relevant writes that the pattern requires to be audited.  
  *File:* `research.service.ts`, lines covering each of the five methods.  
  *Fix:* Add `await this.auditService.log(...)` in each method. An `actorId` must be threaded through from the controller (currently absent for `addMilestone`, `addStatusUpdate`-already has `authorId`, `addMember`/`removeMember` have no actor param at all). The controller must also supply `user.sub` for those methods.

### 5. Prisma calls use explicit field assignments, not DTO spreads ✅
All Prisma `create` / `update` calls enumerate fields individually or via conditional spread of single fields. No raw `...dto` spread detected.

### 6. Status transition logic throws BadRequestException on invalid transitions ✅
`research.service.ts` uses `STATUS_TRANSITIONS` map; `performance-cycles.service.ts` uses `CYCLE_TRANSITIONS` map. Both throw `BadRequestException` correctly.

**Gap — `kpi-results.service.ts` `review()` and `approve()` — ❌ BLOCKER:**  
Neither `review()` (line ~134) nor `approve()` (line ~174) check the current `result.status` before applying the transition. A DRAFT result can be directly approved; an already-APPROVED result can be re-reviewed. The `submit()` method correctly guards `status !== DRAFT && status !== RETURNED`. The same guard pattern is absent in `review` and `approve`.  
*Consequence:* A caller with `performance.results.review` permission can approve a result that was never submitted, bypassing the submission workflow.  
*Fix:* In `review()`, assert `result.status === KpiResultStatus.SUBMITTED` before proceeding; throw `BadRequestException` otherwise. In `approve()`, assert `result.status === KpiResultStatus.SUBMITTED` (if approve is a separate step from review) or `KpiResultStatus.REVIEWED` depending on the intended workflow; throw `BadRequestException` otherwise. At minimum `approve()` should guard against DRAFT status.

### 7. NotFoundException thrown when resource not found or tenant mismatch ✅
All service `findOne`/`findFirst` calls that can return null throw `NotFoundException`. Tenant is always in the `where` clause so a cross-tenant hit returns the same `NotFoundException` as a missing record.

### 8. No hardcoded tenant-specific data ✅
No tenant IDs, names, or tenant-specific strings found in any service or controller.

### 9. ScoreResult interface properly typed ✅
`score-result.interface.ts` defines both `ScoreResult` and `KpiBreakdownItem` with explicit TypeScript types. `kpi-results.service.ts` imports and uses them correctly with `Promise<ScoreResult>` return type annotation.

### 10. Module imports complete ✅ (with note)
- `PrismaModule` is `@Global()`, so it is available to all modules without an explicit import — confirmed in `prisma.module.ts`.
- `AuditModule` is explicitly imported in `ResearchModule`, `TasksModule`, and `PerformanceModule`. ✅
- **`ReportsModule`** does not import `AuditModule` — but `ReportsService` does not call `AuditService`, so this is consistent and not a defect.  
  However, `ReportsService` has no audit calls for any operation. Since all report endpoints are read-only aggregations, this is acceptable under the approved scope.

---

## Blockers Summary

| # | File | Issue | Consequence |
|---|------|-------|-------------|
| B1 | `tasks.service.ts` — `addComment` | No `auditService.log` on write | Comment writes are unaudited, violates established pattern |
| B2 | `research.service.ts` — `addMember`, `removeMember`, `addMilestone`, `updateMilestone`, `addStatusUpdate` | No `auditService.log` on any of these five writes; `addMember`/`removeMember` also lack `actorId` parameter | Member/milestone/status mutations are unaudited; actor cannot be recorded |
| B3 | `kpi-results.service.ts` — `review()` | No status guard before applying review transition | DRAFT result can be reviewed/returned without submission |
| B4 | `kpi-results.service.ts` — `approve()` | No status guard before applying approval | DRAFT or RETURNED result can be directly approved |
| B5 | `research.service.ts` — `addStatusUpdate` | `ProjectStatusUpdate` created without `tenantId` field | Status updates may lack tenant isolation if model has its own `tenantId` column |

---

## Required Corrections

**B1 — `tasks.service.ts` `addComment`:**
```typescript
// After taskComment.create, add:
await this.auditService.log({
  tenantId,
  actorId: authorId,
  action: 'task.comment.added',
  resourceType: 'TaskComment',
  resourceId: comment.id,
  outcome: 'SUCCESS',
});
```

**B2 — `research.service.ts`:** Thread `actorId: string` into `addMember`, `removeMember`, `addMilestone`, `updateMilestone`, update callers in `research.controller.ts` to pass `user.sub`, and add `auditService.log` calls after each write.

**B3 — `kpi-results.service.ts` `review()`:**
```typescript
if (result.status !== KpiResultStatus.SUBMITTED) {
  throw new BadRequestException(
    `Cannot review a result with status ${result.status}`,
  );
}
```

**B4 — `kpi-results.service.ts` `approve()`:**
```typescript
if (result.status !== KpiResultStatus.SUBMITTED) {
  throw new BadRequestException(
    `Cannot approve a result with status ${result.status}`,
  );
}
```
(Adjust the allowed prior status to match the intended two-step review→approve workflow if applicable.)

**B5 — `research.service.ts` `addStatusUpdate`:**
```typescript
// In projectStatusUpdate.create, add tenantId:
data: {
  researchProjectId: projectId,
  content,
  authorId,
  tenantId,   // add this field
},
```
(Verify schema has `tenantId` on `ProjectStatusUpdate`; if not, this is a non-issue and B5 can be closed.)
