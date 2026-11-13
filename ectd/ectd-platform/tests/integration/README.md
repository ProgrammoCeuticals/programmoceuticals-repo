# Integration Tests — spec §49

Integration tests use a real PostgreSQL instance (Testcontainers or a local test DB).

## What to test

- Repository FK behavior and constraint enforcement
- Prisma transactions and rollback
- Concurrency constraints (optimistic locking, row-level locking)
- Audit event persistence
- Lifecycle operation atomicity

## Running

```bash
# Requires a running PostgreSQL instance
DATABASE_URL=postgresql://ectd_user:ectd_dev_password@localhost:5432/ectd_test \
  npx jest --config jest.config.ts --testPathPattern=tests/integration
```

## Status

Integration test suite is pending implementation.

### Planned test files

| File | Covers |
|---|---|
| `organization.repository.spec.ts` | Org CRUD, FK restrict on delete |
| `submission-unit.lifecycle.spec.ts` | Freeze → validate → publish atomicity |
| `audit.persistence.spec.ts` | Audit events are append-only |
| `context-of-use.concurrency.spec.ts` | Concurrent suspend + replace |
| `regulatory-package.immutability.spec.ts` | Failed import never activates |
