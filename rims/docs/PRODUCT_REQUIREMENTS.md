# RIMS — Product Requirements

## Overview

RIMS (Regulatory Information Management System) is a multi-tenant SaaS platform designed for pharmaceutical and healthcare institutions. It provides secure employee record management, organisational hierarchy, RBAC-based access control, and regulatory compliance tracking — all with strict per-tenant data isolation enforced at the database level.

---

## User Personas

### 1. Super Admin (Platform Level)
- Manages tenants, billing plans, and system-wide configuration.
- Can impersonate any tenant for support purposes (with full audit trail).
- Has access to the platform admin dashboard, not the tenant SPA.

### 2. Institution Admin (Tenant Level)
- Manages the institution profile, departments, teams, and positions.
- Invites and manages staff users; assigns roles.
- Views audit logs scoped to their tenant.

### 3. HR Manager
- Creates and manages employee records (hire, transfer, archive).
- Manages employee qualifications, skills, and employment history.
- Runs employee status reports.

### 4. Department Manager
- Views employees within their department.
- Can request personnel actions (subject to approval workflow in later phases).

### 5. Regular Staff / Employee
- Can view their own profile and employment record.
- Cannot see other employees' data.

---

## Core Modules

### Phase 0 — Foundation (FEAT-001)
- Monorepo scaffold (pnpm + Turborepo)
- Shared packages (types, validation, config)
- Prisma schema with all data models
- PostgreSQL RLS setup
- Docker Compose infrastructure
- Documentation

### Phase 1 — Authentication & Tenancy (FEAT-002)
- Tenant registration and onboarding
- Email/password authentication with argon2
- JWT access + refresh token pairs
- Session management (revocation, expiry)
- User invitation flow (email → token → accept)
- Multi-factor authentication (TOTP)

### Phase 2 — RBAC & Permissions (FEAT-003)
- System roles: SUPER_ADMIN, TENANT_ADMIN, HR_MANAGER, DEPT_MANAGER, STAFF
- Custom tenant roles with permission sets
- Permission code registry (e.g. `employees:read`, `employees:write`)
- Role assignment to users
- Permission guard on all API endpoints

### Phase 3 — Employee Records (FEAT-004)
- CRUD for employees, qualifications, skills
- Employment event history (hire, transfer, promotion, termination)
- Department and team assignment
- Employee ↔ User account linking
- Pagination, filtering, search

### Phase 4 — Organisation Hierarchy
- Institution profile management
- Department tree (recursive parent-child with loop prevention)
- Teams within departments
- Position/grade catalogue

### Phase 5 — Reporting & Audit
- Immutable audit event log for all CUD operations
- Tenant-scoped audit search (actor, resource, date range)
- Staff roster export (CSV/PDF)

---

## Non-Functional Requirements

| Requirement        | Target                                      |
|--------------------|---------------------------------------------|
| Tenancy isolation  | PostgreSQL RLS — zero cross-tenant data leakage |
| Auth               | argon2id password hashing, JWT RS256 tokens |
| API response       | < 200ms p95 for list endpoints (cached)     |
| Availability       | 99.5% monthly uptime target                 |
| Data retention     | Audit events never deleted                  |
| Security           | OWASP Top-10 mitigations in place           |
| Accessibility      | WCAG 2.1 AA for all web UI                  |
