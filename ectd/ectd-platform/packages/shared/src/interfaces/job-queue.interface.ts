/**
 * JobQueue interface — spec §39, §57 Rule 15.
 *
 * Core engines must NOT depend directly on BullMQ.
 * Use this abstraction so engines remain testable and decoupled from
 * the queue implementation.
 *
 * Job types (spec §38):
 *   IMPORT_REGULATORY_PACKAGE
 *   INSPECT_DOCUMENT
 *   VALIDATE_SUBMISSION_UNIT
 *   GENERATE_XML
 *   BUILD_SUBMISSION_PACKAGE
 *   VERIFY_PACKAGE
 */

export interface JobOptions {
  /** Idempotency key — spec §36 */
  idempotencyKey?: string;
  /** Correlation ID for tracing */
  correlationId?: string;
  /** Delay in milliseconds before job becomes active */
  delay?: number;
  /** Number of retry attempts for transient failures — spec §38 */
  attempts?: number;
}

export interface JobReference {
  jobId: string;
  queue: string;
  status: "QUEUED" | "RUNNING" | "SUCCEEDED" | "FAILED" | "CANCELLED";
}

export interface JobQueue {
  /**
   * Enqueue a job. Returns immediately with a reference.
   * For idempotent operations, supply an idempotencyKey — spec §36.
   */
  enqueue<T extends Record<string, unknown>>(
    jobType: string,
    payload: T,
    options?: JobOptions,
  ): Promise<JobReference>;

  /**
   * Get the current status of a job.
   */
  getStatus(jobId: string, queue: string): Promise<JobReference | null>;
}
