import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { NotificationsService } from './notifications.service';
import { OutboxProcessor } from './outbox.processor';

@Module({
  providers: [EmailService, NotificationsService, OutboxProcessor],
  exports: [EmailService, NotificationsService],
})
export class NotificationsModule {}
