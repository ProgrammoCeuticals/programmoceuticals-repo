import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BullModule, BullWorkerHost, Processor, OnWorkerEvent } from "@nestjs/bullmq";
import { Job, Worker } from "bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { QUEUES } from "../../../api/src/modules/jobs/bullmq-job-queue.adapter";
import { ValidationDomainService } from "../../../api/src/modules/validation/validation-domain.service";
import { PrismaService } from "../../../api/src/modules/database/prisma.service";
import { AuditService } from "../../../api/src/modules/audit/audit.service";

/**
 * ValidationWorker — spec §39.
 *
 * Processes:
 *   - VALIDATE_SUBMISSION_UNIT
 *   - IMPORT_REGULATORY_PACKAGE
 *
 * Core engines are injected — this worker is a thin BullMQ adapter.
 * Retry policy: transient failures only — spec §38.
 */
@Processor(QUEUES.VALIDATION)
@Injectable()
export class ValidationWorker extends BullWorkerHost {
  private readonly logger = new Logger(ValidationWorker.name);

  constructor(private readonly validationService: ValidationDomainService) {
    super();
  }

  async process(job: Job): Promise<void> {
    this.logger.log({
      event: "JOB_STARTED",
      jobType: job.name,
      jobId: job.id,
    });

    switch (job.name) {
      case "VALIDATE_SUBMISSION_UNIT":
        await this.handleValidation(job);
        break;
      case "IMPORT_REGULATORY_PACKAGE":
        await this.handleRegulatoryImport(job);
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

  private async handleValidation(job: Job): Promise<void> {
    const { submissionUnitId, validationProfileId, runId, organizationId, actorId } = job.data as {
      submissionUnitId: string;
      validationProfileId: string;
      runId: string;
      organizationId: string;
      actorId?: string;
    };
    this.logger.log({ event: "VALIDATE_SUBMISSION_UNIT_RECEIVED", submissionUnitId, validationProfileId });
    await this.validationService.runValidation(
      submissionUnitId,
      runId,
      validationProfileId,
      organizationId,
      actorId,
    );
  }

  private async handleRegulatoryImport(job: Job): Promise<void> {
    const { artifactId, name, version } = job.data as {
      artifactId: string;
      name: string;
      version: string;
    };
    this.logger.log({
      event: "IMPORT_REGULATORY_PACKAGE_RECEIVED",
      artifactId,
      name,
      version,
    });
    // TODO Phase 2+: wire CodeListImporter and schema registry parsers here
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
    BullModule.registerQueue({ name: QUEUES.VALIDATION }),
  ],
  providers: [ValidationWorker, ValidationDomainService, PrismaService, AuditService],
})
export class WorkerValidationModule {}
