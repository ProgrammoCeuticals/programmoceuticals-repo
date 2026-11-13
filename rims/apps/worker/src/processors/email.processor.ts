import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import { EmailService } from '../email.service';

@Processor('email')
export class EmailWorkerProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailWorkerProcessor.name);
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
      case 'invitation-email': {
        await this.emailService.sendInvitation(
          job.data.to as string,
          job.data.token as string,
          this.appUrl,
        );
        break;
      }
      case 'password-reset': {
        await this.emailService.sendPasswordReset(
          job.data.to as string,
          job.data.token as string,
          this.appUrl,
        );
        break;
      }
      case 'workflow-notification': {
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
        this.logger.warn(`[EMAIL] Unknown job type: ${job.name}`);
    }
  }
}
