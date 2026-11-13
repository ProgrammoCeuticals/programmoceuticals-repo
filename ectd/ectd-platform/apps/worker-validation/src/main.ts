/**
 * worker-validation — spec §39, §11 (Phase 11).
 *
 * Handles queues:
 *   'validation'  → VALIDATE_SUBMISSION_UNIT
 *                → IMPORT_REGULATORY_PACKAGE
 *
 * Retry policy — spec §38:
 *   - Transient failures (I/O, network): retry up to 3 times with exponential backoff.
 *   - Deterministic failures (regulatory gap, bad input): do NOT retry.
 *   - Dead-lettered jobs remain visible with structured error details.
 *
 * Core engines must NOT depend directly on BullMQ — spec §39.
 * This worker is the BullMQ adapter only.
 */

import { Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { PrismaClient } from "@prisma/client";

const SERVICE = "worker-validation";
const REDIS_URL = process.env["REDIS_URL"] ?? "redis://localhost:6379";
const ENGINE_VERSION = "0.1.0-phase11";

const connection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

const prisma = new PrismaClient();

// ── Structured logger ─────────────────────────────────────────────────────
function log(
  level: "info" | "warn" | "error",
  event: string,
  data?: Record<string, unknown>,
): void {
  process.stdout.write(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      service: SERVICE,
      engineVersion: ENGINE_VERSION,
      event,
      ...data,
    }) + "\n",
  );
}

// ── Job handlers ──────────────────────────────────────────────────────────

async function handleValidateSubmissionUnit(job: Job): Promise<void> {
  const { submissionUnitId, validationProfileId, runId, organizationId, actorId } =
    job.data as {
      submissionUnitId: string;
      validationProfileId: string;
      runId: string;
      organizationId: string;
      actorId?: string;
    };

  log("info", "VALIDATE_JOB_STARTED", { submissionUnitId, runId, jobId: job.id });
  await job.updateProgress(10);

  const { ValidationDomainService } = await import("../../api/src/modules/validation/validation-domain.service");
  const { AuditService } = await import("../../api/src/modules/audit/audit.service");
  const auditService = new AuditService(prisma as any);
  const validationService = new ValidationDomainService(prisma as any, auditService);

  await validationService.runValidation(
    submissionUnitId,
    runId,
    validationProfileId,
    organizationId,
    actorId,
  );

  await job.updateProgress(100);
  log("info", "VALIDATE_JOB_COMPLETED", { submissionUnitId, runId });
}

async function handleImportRegulatoryPackage(job: Job): Promise<void> {
  const { artifactId, packageType, name, version } = job.data as {
    artifactId: string;
    packageType: string;
    name: string;
    version: string;
  };

  log("info", "IMPORT_JOB_STARTED", {
    artifactId,
    packageType,
    name,
    version,
    jobId: job.id,
  });

  await job.updateProgress(10);
  // TODO Phase 2 full: parse schemas, code lists, Genericode
  // REGULATORY_GAP: Requires official ICH package files present
  await job.updateProgress(100);

  log("info", "IMPORT_JOB_COMPLETED", {
    artifactId,
    note: "Post-registration parsing stubs complete. Activate via POST /api/v1/regulatory/packages/:id/activate.",
  });
}

// ── Worker ────────────────────────────────────────────────────────────────

const worker = new Worker(
  "validation",
  async (job: Job) => {
    switch (job.name) {
      case "VALIDATE_SUBMISSION_UNIT":
        return handleValidateSubmissionUnit(job);
      case "IMPORT_REGULATORY_PACKAGE":
        return handleImportRegulatoryPackage(job);
      default:
        log("warn", "UNKNOWN_JOB_TYPE", { jobType: job.name, jobId: job.id });
        // Unknown job type — do not retry
        const err = new Error(`Unknown job type: ${job.name}`) as Error & {
          deterministic: boolean;
        };
        err.deterministic = true;
        throw err;
    }
  },
  {
    connection,
    concurrency: 2,
    limiter: { max: 10, duration: 1000 }, // max 10 jobs/sec
  },
);

worker.on("completed", (job) => {
  log("info", "JOB_COMPLETED", { jobId: job.id, jobType: job.name });
});

worker.on("failed", (job, err: Error & { deterministic?: boolean }) => {
  log("error", "JOB_FAILED", {
    jobId: job?.id,
    jobType: job?.name,
    error: err.message,
    deterministic: err.deterministic ?? false,
    willRetry: !err.deterministic,
  });
});

worker.on("error", (err) => {
  log("error", "WORKER_ERROR", { error: err.message });
});

process.on("SIGTERM", async () => {
  log("info", "WORKER_SHUTDOWN", { signal: "SIGTERM" });
  await worker.close();
  await prisma.$disconnect();
  process.exit(0);
});

log("info", "WORKER_STARTED", { queue: "validation", concurrency: 2 });
