# Scoped RBAC for RIMS

The commit replaces the flat role-per-user model with a scoped assignment system: a user can hold the same role multiple times under different scopes (INSTITUTION, DEPARTMENT, TEAM, PROJECT), and the union of those scopes drives what each service query returns. The JWT now carries a `scopes` array alongside `permissions`, and five core services (Employees, Departments, Teams, Research, Tasks) each have a `ScopeContextService`-driven filter applied at the list and single-item level. The admin dashboard gains scope-contextual sections for department-heads, team-leads, and project-scoped users; `UserDetailPage` now exposes a full scoped assignment UI.

**Watch for:** confirmed — `buildProjectFilter` never returns `null`, meaning any authenticated user can list all projects they're a member of even if they hold no scope at all; this is intentional (membership-based fallback) but it means the `if (filter === null) return []` guard in `ResearchService.findAll` is dead code. Likely — the token refresh interceptor in `api.ts` manually mutates `localStorage` to update `accessToken` but does not update the `scopes` array; after a token rotation the client continues to use pre-refresh scope data from memory/state, so a role change between login and refresh won't be reflected until the user logs in again. Confirmed — `findOne` in both `DepartmentsService` and `EmployeesService` fetches the full record before checking scope, leaking resource existence via timing.

**Verdict**: NEEDS_CHANGES

---

## High-level view

`ScopeContextService` is a pure, injectable service with five `build*Filter` methods and a full unit-test suite. Each method returns a Prisma `where` object when any constraint applies, or `null` when no access is warranted. The institution-bypass (`hasInstitutionScope`) correctly short-circuits all five filters, so existing admin users are unaffected. The unique constraint on `UserRoleAssignment(userId, roleId)` has been replaced with an index, allowing the same role to be assigned multiple times under different scopes; a `findFirst`-then-`create` pattern replaces `upsert` throughout to prevent exact-duplicate assignments.

The JWT payload (both `loginFull` and `refreshFull`) now includes `scopes: ScopeAssignment[]`, and `JwtPayload` in `shared-types` is updated to match. All five controllers pass `user.scopes ?? []` to their service calls. The `?? []` fallback means that old JWTs already in the wild (issued before this deploy) default to an empty scopes array, which causes the institution-bypass to miss and routes non-admin users to null/empty results rather than the wrong data — a reasonable fail-closed degradation.

`buildProjectFilter` is intentionally asymmetric with the other four filter builders: it always returns a non-null filter even for empty scopes, by appending a member-based fallback (`{ members: { some: { employee: { userId } } } }`). This means any user who has no scope assignment can still see projects they're explicitly enrolled in as members. `ResearchService.findAll` treats `null` from `buildProjectFilter` as the "no access" case, but `buildProjectFilter` never returns `null`, so that early-return guard is dead code — not a bug, but it's misleading and could confuse a future maintainer.

The token refresh interceptor updates `accessToken` in `localStorage` directly but does not touch the `scopes` field. If an admin adds or removes a scope assignment, the next refresh cycle will issue a new JWT with the updated scopes, but the in-memory Zustand store retains the old `scopes` array until the user triggers a full re-login. The dashboard's scope-contextual sections (which read `scopes` directly from the store) and `UserDetailPage` will silently show stale scope data.

The `DashboardPage` scope-contextual cards are UI scaffolding with real structure and mostly placeholder values (`"—"`). The institution-bypass guard (`!isInstitutionWide`) is correct on all three cards.

---

<details>
<summary>Issues (5)</summary>

1. **Dead null-guard in ResearchService.findAll** — `buildProjectFilter` never returns `null` (it always adds the member-fallback condition), so the `if (filter === null) return []` guard is unreachable. Remove the guard or document the invariant to avoid future maintainers misreading the intent. (confirmed)

2. **Stale scopes after token refresh** — The `api.ts` refresh interceptor writes only `accessToken` back to localStorage, leaving `scopes` stale in the persisted store. After a scope change, the client's scope-aware UI (dashboard cards, UserDetailPage) won't reflect the change until next login. Update the interceptor to call `/auth/me` after a successful refresh and update `scopes` via `setAuth`, or switch to storing scopes in the JWT and re-parsing the new token. (likely)

3. **`findOne` access check fetches data before checking authorization** — `findOne` in both `DepartmentsService` and `EmployeesService` fetches the full record (with all includes) and then throws `ForbiddenException` if the scope check fails. This leaks resource existence via timing side-channel and wastes a round-trip. Apply the scope constraint in the `where` clause so a 404 is returned regardless of whether the resource exists. (confirmed)

4. **TeamsService has no single-item scope enforcement** — `TeamsService` correctly gates `findAll` via `buildTeamFilter`, but there is no scoped `findOne` / `findById` path. If a future route or service call fetches a single team by ID, there is no scope guard. Add a scope-aware lookup before those routes land. (likely)

5. **Scoped assignment form allows scopeId-less non-INSTITUTION submission** — In `UserDetailPage`, submitting the assign-role form with `scopeType=DEPARTMENT` (or TEAM/PROJECT) and no `scopeId` selected sends a request with `scopeId` omitted. The backend stores it with `scopeId: null`; `getDepartmentIds` filters these out, so it grants no access — but the orphan record is confusing. Add a client-side guard: disable the Assign button unless `scopeId` is selected when `scopeType !== "INSTITUTION"`. (confirmed)

</details>

---

<details>
<summary>Details</summary>

## Schema: `@@unique` → `@@index` and new fields

`UserRoleAssignment` gains `scopeType` (string, default `"INSTITUTION"`), `scopeId` (nullable string), and `assignedById` (nullable string). The `@@unique([userId, roleId])` constraint is replaced with `@@index([userId, roleId])`, enabling one user to hold the same role under different scopes. The schema uses a plain `String` for `scopeType` rather than a Prisma enum — this is consistent with the rest of the codebase's style but means typo protection lives only in the DTO's `@IsIn` validator and the TypeScript union type, not at the DB level.

The diff also adds several unrelated schema models in the same commit: `EmployeeCertification`, `ProjectTeam`, `ProjectTeamMember`, `ProjectDeliverable`, `PerformanceEvidence`, `PerformanceEvaluation`, `ImprovementPlan`, `StrategicObjective`, `MfaMethod`. These are legitimate schema evolution but represent substantial surface area bundled with the RBAC change, which makes the migration harder to reason about and roll back independently.

## ScopeContextService filter logic

`buildProjectFilter` departs from the pattern of the other four builders: it unconditionally appends `{ members: { some: { employee: { userId } } } }` before returning, so the method signature says `object | null` but it never returns `null`. The return type declaration is misleading and the spec test "always includes member fallback even with no explicit project scopes" confirms the asymmetry is intentional. The dead-guard consequence in `ResearchService.findAll` is noted in the Issues list.

No integration tests exist that exercise the full request→JWT decode→service filter path.

## `findOne` scope enforcement pattern

Employees, Departments, Research, and Tasks all follow the same pattern for single-item access: fetch the record first (with full includes), then apply a manual scope check. The fetch happens even when the user has no valid scope, which leaks the existence of the resource as a timing side-channel (the `findFirst` vs. `NotFoundException` latency differs from the `ForbiddenException` path). An attacker with valid credentials but limited scope could use timing to enumerate IDs.

The correct pattern is to include the scope constraint in the `where` clause so the ORM query itself enforces the scope, returning `null` → 404 regardless of whether the resource exists. This is the standard fail-consistent approach and avoids the fetch-then-check overhead.

## Token refresh and stale scopes

The refresh interceptor in `api.ts` calls `POST /auth/refresh`, extracts the new `accessToken`, and writes it back to `localStorage.rims-auth.state.accessToken`. It does not update `scopes`. Since scopes are stored in the Zustand persisted state rather than derived from the JWT on each request, any scope change made by an admin will only be visible to the affected user after they log out and back in. For the target use case (admin grants a department-head role) the user would need to re-authenticate before they see their new dashboard sections or receive their new filtering. The interceptor should call `/auth/me` after a successful refresh and re-sync via `setAuth`, or the client should derive scopes directly from the decoded JWT claims.

## Dashboard scope cards

The My Team and My Work cards show `"—"` for most metrics, which is explicitly placeholder state. The institution-bypass guard (`!isInstitutionWide && <scopeIds>.length > 0`) is correct on all three cards.

## Scoped role assignment UI in UserDetailPage

The form handles all four scope types with the correct conditional selects. The "Remove" action uses `assignmentId` (the `UserRoleAssignment.id`) rather than `roleId`, which is correct now that a user can have multiple assignments for the same role under different scopes. The scopeId is displayed as a truncated UUID, which is functional but not user-friendly — the name of the department/team/project would be more readable. This is cosmetic and doesn't affect correctness.

The form does not validate that a `scopeId` is selected when a non-INSTITUTION scope type is chosen. If the user submits with `scopeType=DEPARTMENT` and no `scopeId`, the backend receives `{ roleId, scopeType: "DEPARTMENT" }` without `scopeId`. `RolesService.assignRoleToUser` will store it with `scopeId: null`, creating a DEPARTMENT-typed assignment with no specific department. `ScopeContextService.getDepartmentIds` filters for `scopeType === 'DEPARTMENT' && s.scopeId`, so this orphan assignment would yield an empty `deptIds` array and effectively grant no additional access. It's not a privilege escalation, but it's a confusing no-op that the UI should prevent.

</details>

---

<details>
<summary>File map</summary>

| File                                                         | Change                                                                                                                                                                                                                                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `prisma/schema.prisma`                                       | `UserRoleAssignment`: replaced `@@unique` with `@@index`, added `scopeType`, `scopeId`, `assignedById`; added `ProjectTeam`, `ProjectTeamMember`, `ProjectDeliverable`, `PerformanceEvaluation`, `ImprovementPlan`, `StrategicObjective`, `MfaMethod`, `EmployeeCertification` |
| `prisma/seed.ts`                                             | Replaced `upsert` with `findFirst`+`create`; added `scopeType: "INSTITUTION"` and `assignedById` to admin assignment                                                                                                                                                           |
| `packages/shared-types/src/types.ts`                         | Added `ScopeAssignment` interface; added `scopes: ScopeAssignment[]` to `JwtPayload`                                                                                                                                                                                           |
| `apps/api/src/common/scope/scope-context.service.ts`         | New: five filter-builder methods + institution-bypass helper                                                                                                                                                                                                                   |
| `apps/api/src/common/scope/scope-context.service.spec.ts`    | New: full unit test suite for all filter builders                                                                                                                                                                                                                              |
| `apps/api/src/common/scope/scope.module.ts`                  | New: global module exporting `ScopeContextService`                                                                                                                                                                                                                             |
| `apps/api/src/app.module.ts`                                 | Registered `ScopeModule`; made BullMQ registration conditional on Redis availability                                                                                                                                                                                           |
| `apps/api/src/modules/auth/auth.service.ts`                  | `loginFull` and `refreshFull` now build and sign `scopes` into JWT; `@Optional()` on email queue                                                                                                                                                                               |
| `apps/api/src/modules/employees/employees.service.ts`        | `findAll` and `findOne` now accept and apply `ScopeAssignment[]`                                                                                                                                                                                                               |
| `apps/api/src/modules/employees/employees.controller.ts`     | Passes `user.scopes ?? []` to both service methods                                                                                                                                                                                                                             |
| `apps/api/src/modules/departments/departments.service.ts`    | `findAll` and `findOne` scope-filtered                                                                                                                                                                                                                                         |
| `apps/api/src/modules/departments/departments.controller.ts` | Passes `user.scopes ?? []`                                                                                                                                                                                                                                                     |
| `apps/api/src/modules/teams/teams.service.ts`                | `findAll` scope-filtered via `buildTeamFilter`                                                                                                                                                                                                                                 |
| `apps/api/src/modules/teams/teams.controller.ts`             | Passes `user.scopes ?? []`                                                                                                                                                                                                                                                     |
| `apps/api/src/modules/research/research.service.ts`          | `findAll` and `findOne` scope-filtered; added `ProjectTeam` CRUD methods                                                                                                                                                                                                       |
| `apps/api/src/modules/research/research.controller.ts`       | Passes `user.scopes` and `user.sub`; added `ProjectTeam` endpoints and `ResearchTeamsController`                                                                                                                                                                               |
| `apps/api/src/modules/tasks/tasks.service.ts`                | `findAll` and `findOne` scope-filtered; added `projectTeamId` and `startDate` to task CRUD                                                                                                                                                                                     |
| `apps/api/src/modules/tasks/tasks.controller.ts`             | Passes `user.scopes ?? []` and `user.sub`                                                                                                                                                                                                                                      |
| `apps/api/src/modules/roles/roles.service.ts`                | `assignRoleToUser` now accepts scoped DTO; added `removeRoleFromUser`                                                                                                                                                                                                          |
| `apps/api/src/modules/roles/roles.controller.ts`             | `POST /users/:id/roles` passes full DTO; added `DELETE /users/:id/roles/:assignmentId`                                                                                                                                                                                         |
| `apps/api/src/modules/roles/dtos/assign-role.dto.ts`         | Added `scopeType`, `scopeId`, `assignedById` optional fields                                                                                                                                                                                                                   |
| `apps/api/src/modules/users/users.service.ts`                | `findMe` returns enriched `roleAssignments`; added `findOne`; initial assignment in `inviteUser` upgraded to scoped pattern; `@Optional()` on email queue                                                                                                                      |
| `apps/web/src/store/auth.store.ts`                           | Added `scopes: ScopeAssignment[]` and four computed getters to auth store                                                                                                                                                                                                      |
| `apps/web/src/pages/auth/LoginPage.tsx`                      | Derives `scopes` from `/me` response and passes to `setAuth`                                                                                                                                                                                                                   |
| `apps/web/src/pages/dashboard/DashboardPage.tsx`             | Scope-contextual department/team/project cards                                                                                                                                                                                                                                 |
| `apps/web/src/pages/users/UserDetailPage.tsx`                | Full scoped role assignment + removal UI                                                                                                                                                                                                                                       |

Full diff: `git -C /Users/macbookpro/Desktop/ProgrammoCeuticals/rims diff HEAD~1...HEAD`

</details>
