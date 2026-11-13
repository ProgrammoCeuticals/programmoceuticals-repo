import { Controller, Logger, Post } from '@nestjs/common';
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';

@Processor('usage-metrics')
export class UsageMetricsWorkerProcessor extends WorkerHost {
  private readonly logger = new Logger(UsageMetricsWorkerProcessor.name);

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case 'record-all-tenant-metrics': {
        // In production this would connect to the DB or call the API.
        // For Phase 4, log a placeholder message.
        this.logger.log(
          '[USAGE] record-all-tenant-metrics job received. ' +
            'Configure API_URL or DB access for production metric recording.',
        );
        break;
      }
      default:
        this.logger.warn(
          `[USAGE] Unknown job type: ${job.name}`,
        );
    }
  }
}

/**
 * Dev-only HTTP endpoint to manually trigger the usage-metrics job.
 * Not protected — intended for local development and testing only.
 */
@Controller('worker/usage-metrics')
export class UsageMetricsTriggerController {
  private readonly logger = new Logger(UsageMetricsTriggerController.name);

  constructor(
    @InjectQueue('usage-metrics') private readonly usageQueue: Queue,
  ) {}

  @Post('trigger')
  async trigger() {
    await this.usageQueue.add('record-all-tenant-metrics', {});
    this.logger.log('[USAGE] Enqueued record-all-tenant-metrics job');
    return { queued: true };
  }
}
