import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BullModule, BullWorkerHost, Processor, OnWorkerEvent } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { QUEUES } from "../../../api/src/modules/jobs/bullmq-job-queue.adapter";

/**
 * InspectionWorker — spec §39.
 *
 * Processes:
 *   - INSPECT_DOCUMENT
 *
 * Runs MIME validation, malware scanning, and file inspection
 * for uploaded documents.
 * Retry policy: transient failures only — spec §38.
 */
@Processor(QUEUES.INSPECTION)
@Injectable()
export class InspectionWorker extends BullWorkerHost {
  private readonly logger = new Logger(InspectionWorker.name);

  async process(job: Job): Promise<void> {
    this.logger.log({ event: "JOB_STARTED", jobType: job.name, jobId: job.id });

    switch (job.name) {
      case "INSPECT_DOCUMENT":
        await this.handleInspectDocument(job);
        break;
      default:
        this.logger.warn({ event: "UNKNOWN_JOB_TYPE", jobType: job.name });
    }
  }

  @OnWorkerEvent("completed")
  onCompleted(job: Job): void {
    this.logger.log({ event: "JOB_COMPLETED", jobType: job.name, jobId: job.id });
  }

  @OnWorkerEvent("failed")
  onFailed(job: Job | undefined, err: Error): void {
    this.logger.error({
      event: "JOB_FAILED",
      jobType: job?.name,
      jobId: job?.id,
      error: err.message,
    });
  }

  private async handleInspectDocument(job: Job): Promise<void> {
    const { documentVersionId, storageKey } = job.data as {
      documentVersionId: string;
      storageKey: string;
    };
    this.logger.log({
      event: "INSPECT_DOCUMENT_RECEIVED",
      documentVersionId,
      storageKey,
    });
    // TODO Phase 5+: inject DocumentUploadPipeline and run full inspection
    // Includes: MIME/magic-byte validation, malware scan (ClamAV), checksum verify
    // REGULATORY_GAP: Malware scanning requires ECTD_CLAMAV_URL to be configured.
    // Document upload is blocked until ClamAV is configured — spec §43.
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        connection: {
          url: config.get<string>("REDIS_URL", "redis://localhost:6379"),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({ name: QUEUES.INSPECTION }),
  ],
  providers: [InspectionWorker],
})
export class WorkerInspectionModule {}
