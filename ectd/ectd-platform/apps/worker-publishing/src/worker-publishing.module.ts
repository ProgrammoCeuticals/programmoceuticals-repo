import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BullModule, BullWorkerHost, Processor, OnWorkerEvent } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { QUEUES } from "../../../api/src/modules/jobs/bullmq-job-queue.adapter";
import { XmlGenerationService } from "../../../api/src/modules/xml/xml-generation.service";
import { PrismaService } from "../../../api/src/modules/database/prisma.service";
import { AuditService } from "../../../api/src/modules/audit/audit.service";

/**
 * PublishingWorker — spec §39.
 *
 * Processes:
 *   - GENERATE_XML
 *   - BUILD_SUBMISSION_PACKAGE
 *   - VERIFY_PACKAGE
 *
 * Core engines are injected — this worker is a thin BullMQ adapter.
 * Retry policy: transient failures only — spec §38.
 */
@Processor(QUEUES.PUBLISHING)
@Injectable()
export class PublishingWorker extends BullWorkerHost {
  private readonly logger = new Logger(PublishingWorker.name);

  constructor(private readonly xmlService: XmlGenerationService) {
    super();
  }

  async process(job: Job): Promise<void> {
    this.logger.log({ event: "JOB_STARTED", jobType: job.name, jobId: job.id });

    switch (job.name) {
      case "GENERATE_XML":
        await this.handleGenerateXml(job);
        break;
      case "BUILD_SUBMISSION_PACKAGE":
        await this.handleBuildPackage(job);
        break;
      case "VERIFY_PACKAGE":
        await this.handleVerifyPackage(job);
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

  private async handleGenerateXml(job: Job): Promise<void> {
    const { submissionUnitId, organizationId, actorId } = job.data as {
      submissionUnitId: string;
      organizationId: string;
      actorId?: string;
    };
    this.logger.log({ event: "GENERATE_XML_RECEIVED", submissionUnitId });
    await this.xmlService.generateXml(submissionUnitId, organizationId, actorId);
  }

  private async handleBuildPackage(job: Job): Promise<void> {
    const { submissionUnitId } = job.data as { submissionUnitId: string };
    this.logger.log({ event: "BUILD_SUBMISSION_PACKAGE_RECEIVED", submissionUnitId });
    // TODO Phase 9+: inject PublishingEngineService and execute pipeline
  }

  private async handleVerifyPackage(job: Job): Promise<void> {
    const { packageId } = job.data as { packageId: string };
    this.logger.log({ event: "VERIFY_PACKAGE_RECEIVED", packageId });
    // TODO Phase 9+: verify package checksums and structure
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
    BullModule.registerQueue({ name: QUEUES.PUBLISHING }),
  ],
  providers: [PublishingWorker, XmlGenerationService, PrismaService, AuditService],
})
export class WorkerPublishingModule {}
