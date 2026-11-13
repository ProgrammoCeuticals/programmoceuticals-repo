# ADR-002: Modular Monolith API Architecture (NestJS)

**Status:** Accepted

---

## Context

RIMS needs a backend API that can serve multiple institutional clients with strict data isolation, a complex permission model, and a growing set of features over time. Architectural options:

1. **Microservices** — independent deployable services per domain (auth, employees, tenants). Maximum isolation, but high operational overhead: separate deployments, inter-service communication, distributed tracing, network failures.
2. **Modular monolith** — one deployable process, internally decomposed into modules with well-defined boundaries. Lower operational complexity; can be split into services later if needed.
3. **Flat monolith** — no internal modularity. Fast initially but becomes hard to maintain as the codebase grows.

---

## Decision

Use a **NestJS modular monolith** deployed as a single `apps/api` process.

Internal structure:
- Each domain is a NestJS module (`AuthModule`, `TenantsModule`, `UsersModule`, `RolesModule`, `EmployeesModule`, `DepartmentsModule`, `AuditModule`).
- Modules communicate through injected services, never through HTTP.
- `PrismaModule` is global; tenant context is set by middleware before any controller is reached.
- A separate `apps/worker` process handles background jobs over BullMQ/Redis. This is already a service boundary and can be scaled independently.

---

## Consequences

**Positive:**
- Single deployment unit — simpler CI/CD, no service mesh needed in Phase 0-2.
- NestJS's DI container enforces explicit module boundaries.
- Easy refactoring: extract a module to a microservice later by replacing the injected service with an HTTP or gRPC client.
- Database transactions span multiple modules without distributed transaction complexity.

**Negative:**
- All modules share a process; a memory leak in one module affects all.
- Cannot independently scale (e.g., only scale the employees module). Mitigation: the worker runs separately.
- As the codebase grows, module boundaries must be actively maintained to prevent circular dependencies.
