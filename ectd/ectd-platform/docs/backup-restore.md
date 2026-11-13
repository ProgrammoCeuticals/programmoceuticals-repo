# Backup and Recovery Guide

## spec §48 Requirements

Back up:

- PostgreSQL database
- Document storage (STORAGE_ROOT)
- Published submission packages
- Regulatory package artifacts
- Critical configuration

Recovery must verify:

- Database integrity
- Storage integrity
- Checksums
- Regulatory package availability
- Application health

A backup is not considered validated until restoration testing has been performed.

---

## PostgreSQL Backup

```bash
# Full backup
pg_dump \
  --host=localhost \
  --port=5432 \
  --username=ectd_user \
  --format=custom \
  --file="backup-$(date +%Y%m%d-%H%M%S).pgdump" \
  ectd_prod

# Restore
pg_restore \
  --host=localhost \
  --port=5432 \
  --username=ectd_user \
  --dbname=ectd_prod \
  --no-owner \
  backup-YYYYMMDD-HHMMSS.pgdump
```

## Storage Backup

```bash
# Sync STORAGE_ROOT to backup location
rsync -av --checksum /var/ectd-storage/ /backup/ectd-storage-$(date +%Y%m%d)/

# Verify integrity: checksums must match DB records
# Run: GET /api/v1/health → verify no storage failures reported
```

## Regulatory Packages

Regulatory package archives stored in REGULATORY_PACKAGE_ROOT must be
backed up and treated as immutable. Their SHA-256 checksums are stored
in the database — verify after restore:

```bash
# Check all ACTIVE artifacts have accessible storage keys
# Run: GET /api/v1/regulatory/artifacts?status=ACTIVE
# For each artifact: verify storageKey exists in STORAGE_ROOT
```

## Recovery Verification Checklist

After restoring:

1. `GET /api/v1/health/ready` → database connected
2. `GET /api/v1/health/regulatory` → active standards present
3. `GET /api/v1/regulatory/artifacts?status=ACTIVE` → artifacts accessible
4. `GET /api/v1/health` → all metrics non-zero where expected
5. Run a test validation on a known-good Submission Unit

**A backup is not validated until this checklist passes on a restored environment.**
