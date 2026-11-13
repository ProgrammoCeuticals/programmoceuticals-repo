import { Queue, QueueOptions } from "bullmq";
import IORedis from "ioredis";
import type { JobQueue, JobOptions, JobReference } from "@ectd/shared";

/**
 * BullMqJobQueue — spec §39.
 *
 * Implements the JobQueue interface using BullMQ.
 * Core engines never import from this file directly — they use the
 * JobQueue interface injected via JOB_QUEUE token.
 *
 * Queue names map directly to worker queue names:
 *   'validation'  → worker-validation
 *   'publishing'  → worker-publishing
 *   'inspection'  → worker-inspection
 *
 * Retry policy (spec §38):
 *   - Retry only transient failures.
 *   - Do not retry deterministic regulatory validation failures.
 *   - Dead-lettered jobs remain visible with structured error details.
 */

// Queue name constants — shared with workers
export const QUEUES = {
  VALIDATION: "validation",
  PUBLISHING: "publishing",
  INSPECTION: "inspection",
} as const;

// Job type to queue mapping
const JOB_TYPE_QUEUE_MAP: Record<string, string> = {
  VALIDATE_SUBMISSION_UNIT: QUEUES.VALIDATION,
  IMPORT_REGULATORY_PACKAGE: QUEUES.VALIDATION, // regulatory import runs in validation worker
  INSPECT_DOCUMENT: QUEUES.INSPECTION,
  GENERATE_XML: QUEUES.PUBLISHING,
  BUILD_SUBMISSION_PACKAGE: QUEUES.PUBLISHING,
  VERIFY_PACKAGE: QUEUES.PUBLISHING,
};

export class BullMqJobQueue implements JobQueue {
  private readonly connection: IORedis;
  private readonly queues: Map<string, Queue> = new Map();

  constructor(private readonly redisUrl: string) {
    this.connection = new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
  }

  async enqueue<T extends Record<string, unknown>>(
    jobType: string,
    payload: T,
    options?: JobOptions | undefined,
  ): Promise<JobReference> {
    const queueName = JOB_TYPE_QUEUE_MAP[jobType] ?? jobType;
    const queue = this.getOrCreateQueue(queueName);

    const job = await queue.add(jobType, payload, {
      ...(options?.idempotencyKey ? { jobId: options.idempotencyKey } : {}),
      ...(options?.delay !== undefined ? { delay: options.delay } : {}),
      attempts: options?.attempts ?? 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: { count: 1000 },
      removeOnFail: { count: 5000 },
    });

    return {
      jobId: job.id ?? "unknown",
      queue: queueName,
      status: "QUEUED",
    };
  }

  async getStatus(
    jobId: string,
    queueName: string,
  ): Promise<JobReference | null> {
    const queue = this.getOrCreateQueue(queueName);
    const job = await queue.getJob(jobId);
    if (!job) return null;

    const state = await job.getState();
    const status = this.mapState(state);

    return { jobId, queue: queueName, status };
  }

  private getOrCreateQueue(name: string): Queue {
    if (!this.queues.has(name)) {
      this.queues.set(name, new Queue(name, { connection: this.connection }));
    }
    return this.queues.get(name)!;
  }

  private mapState(state: string): JobReference["status"] {
    switch (state) {
      case "waiting":
      case "delayed":
        return "QUEUED";
      case "active":
        return "RUNNING";
      case "completed":
        return "SUCCEEDED";
      case "failed":
        return "FAILED";
      default:
        return "QUEUED";
    }
  }
}
