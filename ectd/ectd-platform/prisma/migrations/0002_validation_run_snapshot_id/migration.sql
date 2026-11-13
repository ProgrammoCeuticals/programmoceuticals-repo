-- spec §26: Every validation run must preserve exact regulatory provenance.
-- snapshotId links the run to the frozen SubmissionUnitSnapshot it validated.
ALTER TABLE "ValidationRun" ADD COLUMN "snapshotId" TEXT;

-- Index for snapshot-based lookups
CREATE INDEX "ValidationRun_snapshotId_idx" ON "ValidationRun"("snapshotId");
