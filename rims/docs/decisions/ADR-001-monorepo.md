# ADR-001: Monorepo with pnpm Workspaces and Turborepo

**Status:** Accepted

---

## Context

RIMS consists of multiple closely related deliverables: a NestJS REST API, a React SPA, a BullMQ background worker, shared TypeScript type definitions, shared Zod validation schemas, a typed HTTP client, and a React component library. These packages depend heavily on one another. They need a coherent build system, consistent TypeScript configuration, and the ability to develop all pieces simultaneously.

Options considered:
1. **Separate repositories** — maximum isolation, but painful cross-package changes; requires publishing each package to a registry.
2. **Single package** — simple, but forces a single tsconfig and build output; cannot cleanly separate concerns.
3. **pnpm workspaces + Turborepo** — monorepo with fast, cache-aware builds; matches the two existing ProgrammoCeuticals projects (`pharmacy-internship-platform`, `ectd-platform`) in this workspace.

---

## Decision

Use a **pnpm 9 workspace monorepo** with **Turborepo 2** as the build orchestrator.

- `pnpm-workspace.yaml` declares `apps/*` and `packages/*` as workspace members.
- `workspace:*` protocol for intra-monorepo dependencies ensures changes propagate without publishing.
- Turborepo's `dependsOn: ["^build"]` pipeline ensures packages build before their consumers.
- `packages/config` (tsconfig bases, ESLint, Prettier) is built first and referenced by all other packages.

---

## Consequences

**Positive:**
- Single `pnpm install` from the root resolves all dependencies in one lockfile.
- Turborepo's remote cache can share build artifacts across CI runs.
- TypeScript project references enable incremental compilation.
- Consistent lint and format rules across all packages.

**Negative:**
- Larger root `node_modules` compared to separate repositories.
- All packages use the same pnpm/node engine version range — some flexibility is lost.
- `workspace:*` requires local build before packages can be imported; must not skip the `^build` dependency in Turbo tasks.
