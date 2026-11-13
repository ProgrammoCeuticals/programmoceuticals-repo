/**
 * worker-publishing — spec §39, Phase 11.
 *
 * Handles:
 *   'publishing'  → GENERATE_XML
 *                → BUILD_SUBMISSION_PACKAGE
 *                → VERIFY_PACKAGE
 *
 * The publishing pipeline (PublishingPipeline) is synchronous in Phase 9.
 * Heavy packages can be moved here for async processing in a future phase.
 */

import { Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { PrismaClient } from "@prisma/client";

const SERVICE = "worker-publishing";
const REDIS_URL = process.env["REDIS_URL"] ?? "redis://localhost:6379";

const connection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

const prisma = new PrismaClient();

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

async function handleGenerateXml(job: Job): Promise<void> {
  const { submissionUnitId, organizationId, actorId } = job.data as {
    submissionUnitId: string;
    organizationId: string;
    actorId?: string;
  };
  log("info", "GENERATE_XML_JOB_STARTED", { submissionUnitId, jobId: job.id });
  await job.updateProgress(10);

  const { XmlGenerationService } = await import("../../api/src/modules/xml/xml-generation.service");
  const { AuditService } = await import("../../api/src/modules/audit/audit.service");
  const auditService = new AuditService(prisma as any);
  const xmlService = new XmlGenerationService(prisma as any, auditService);

  await xmlService.generateXml(submissionUnitId, organizationId, actorId);

  await job.updateProgress(100);
  log("info", "GENERATE_XML_JOB_COMPLETED", { submissionUnitId });
}

async function handleBuildPackage(job: Job): Promise<void> {
  const { submissionUnitId } = job.data as { submissionUnitId: string };
  log("info", "BUILD_PACKAGE_JOB_STARTED", { submissionUnitId, jobId: job.id });
  await job.updateProgress(100);
  // TODO: call PublishingEngineService.publish via DB-connected service instance
}

async function handleVerifyPackage(job: Job): Promise<void> {
  const { packageId } = job.data as { packageId: string };
  log("info", "VERIFY_PACKAGE_JOB_STARTED", { packageId, jobId: job.id });
  await job.updateProgress(100);
  // TODO: verify package checksums via storage + DB
}

const worker = new Worker(
  "publishing",
  async (job: Job) => {
    switch (job.name) {
      case "GENERATE_XML":
        return handleGenerateXml(job);
      case "BUILD_SUBMISSION_PACKAGE":
        return handleBuildPackage(job);
      case "VERIFY_PACKAGE":
        return handleVerifyPackage(job);
      default:
        throw Object.assign(new Error(`Unknown job: ${job.name}`), {
          deterministic: true,
        });
    }
  },
  { connection, concurrency: 1 }, // publishing is single-threaded per worker instance
);

worker.on("completed", (job) =>
  log("info", "JOB_COMPLETED", { jobId: job.id, jobType: job.name }),
);
worker.on("failed", (job, err) =>
  log("error", "JOB_FAILED", { jobId: job?.id, error: err.message }),
);
worker.on("error", (err) =>
  log("error", "WORKER_ERROR", { error: err.message }),
);

process.on("SIGTERM", async () => {
  await worker.close();
  await prisma.$disconnect();
  process.exit(0);
});

log("info", "WORKER_STARTED", { queue: "publishing", concurrency: 1 });
