import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import { EmailService } from '../email.service';

@Processor('notifications')
export class NotificationsWorkerProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationsWorkerProcessor.name);
  private readonly appUrl: string;

  constructor(
    private readonly emailService: EmailService,
    private readonly config: ConfigService,
  ) {
    super();
    this.appUrl = this.config.get<string>('APP_URL', 'http://localhost:5173');
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case 'send-in-app': {
        // In-app notifications are written directly to DB by NotificationsService.
        // This job is a no-op in the worker — kept for future WebSocket push.
        this.logger.log(
          `[NOTIFICATION] In-app: "${job.data.title as string}" for user ${job.data.userId as string}`,
        );
        break;
      }
      case 'send-email': {
        await this.emailService.sendWorkflowNotification({
          to: job.data.to as string,
          title: job.data.title as string,
          body: job.data.body as string,
          actionUrl: job.data.actionUrl as string | undefined,
          appUrl: this.appUrl,
        });
        break;
      }
      default:
        this.logger.warn(`[NOTIFICATION] Unknown job type: ${job.name}`);
    }
  }
}
