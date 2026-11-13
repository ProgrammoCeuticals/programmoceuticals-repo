/**
 * worker-inspection — spec §39, Phase 11.
 *
 * Handles:
 *   'inspection'  → INSPECT_DOCUMENT
 *
 * Document inspection pipeline (spec §16):
 *   upload → quarantine → MIME/magic-byte validation → file inspection
 *   → malware/security scan → checksum → store immutable version
 *
 * The MimeValidator and ChecksumService (packages/ectd-documents) are
 * implemented. Full malware scanning requires external scanner integration.
 */

import { Worker, Job } from "bullmq";
import IORedis from "ioredis";

const SERVICE = "worker-inspection";
const REDIS_URL = process.env["REDIS_URL"] ?? "redis://localhost:6379";

const connection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

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
      event,
      ...data,
    }) + "\n",
  );
}

async function handleInspectDocument(job: Job): Promise<void> {
  const { documentVersionId, storageKey, checksum, mimeType } = job.data as {
    documentVersionId: string;
    storageKey: string;
    checksum: string;
    mimeType: string;
  };

  log("info", "INSPECT_DOCUMENT_JOB_STARTED", {
    documentVersionId,
    storageKey,
    jobId: job.id,
  });
  await job.updateProgress(10);

  // TODO: read file from storage, run MimeValidator, verify checksum
  // MimeValidator + computeChecksum are in packages/ectd-documents
  // Malware scan: integrate ClamAV or equivalent — spec §16
  await job.updateProgress(80);

  log("warn", "INSPECT_MALWARE_SCAN_SKIPPED", {
    documentVersionId,
    message:
      "Malware scanning not configured. Integrate external scanner before production — spec §16.",
  });

  await job.updateProgress(100);
  log("info", "INSPECT_DOCUMENT_JOB_COMPLETED", { documentVersionId });
}

const worker = new Worker(
  "inspection",
  async (job: Job) => {
    if (job.name === "INSPECT_DOCUMENT") return handleInspectDocument(job);
    throw Object.assign(new Error(`Unknown job: ${job.name}`), {
      deterministic: true,
    });
  },
  { connection, concurrency: 4 }, // inspection is CPU-light, higher concurrency OK
);

worker.on("completed", (job) =>
  log("info", "JOB_COMPLETED", { jobId: job.id }),
);
worker.on("failed", (job, err) =>
  log("error", "JOB_FAILED", { jobId: job?.id, error: err.message }),
);
worker.on("error", (err) =>
  log("error", "WORKER_ERROR", { error: err.message }),
);

process.on("SIGTERM", async () => {
  await worker.close();
  process.exit(0);
});

log("info", "WORKER_STARTED", { queue: "inspection", concurrency: 4 });
