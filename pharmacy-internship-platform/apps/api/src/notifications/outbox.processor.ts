import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';
import { NotificationChannel } from '@pharmintern/shared-types';

const MAX_ATTEMPTS = 5;
const BATCH_SIZE = 50;

/**
 * OutboxProcessor
 *
 * Reads pending notification_outbox records and delivers them.
 * Implements the transactional outbox pattern:
 *   - Notification records are inserted in the same DB transaction as the business operation
 *   - This processor delivers them asynchronously, retrying on failure
 *   - Notification delivery failure NEVER affects committed business operations
 *
 * Uses @Cron to run every minute. For production, consider using BullMQ for
 * more precise scheduling and distributed locking.
 */
@Injectable()
export class OutboxProcessor {
  private readonly logger = new Logger(OutboxProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
  ) {}

  @Cron('* * * * *') // Every minute
  async processPendingNotifications(): Promise<void> {
    const pending = await this.prisma.notificationOutbox.findMany({
      where: {
        status: 'PENDING',
        attempts: { lt: MAX_ATTEMPTS },
      },
      take: BATCH_SIZE,
      orderBy: { createdAt: 'asc' },
    });

    for (const record of pending) {
      try {
        await this.deliver(record);

        await this.prisma.notificationOutbox.update({
          where: { id: record.id },
          data: { status: 'SENT', sentAt: new Date(), attempts: record.attempts + 1 },
        });

        // Create in-app notification for IN_APP channel
        if (record.channel === NotificationChannel.IN_APP) {
          const payload = record.payload as Record<string, unknown>;
          await this.prisma.inAppNotification.create({
            data: {
              userId: record.recipientUserId,
              outboxId: record.id,
              eventType: record.eventType,
              title: (payload['title'] as string) ?? null,
              body: (payload['body'] as string) ?? null,
              linkUrl: (payload['linkUrl'] as string) ?? null,
            },
          });
        }
      } catch (err) {
        const newAttempts = record.attempts + 1;
        const newStatus = newAttempts >= MAX_ATTEMPTS ? 'FAILED' : 'PENDING';
        await this.prisma.notificationOutbox.update({
          where: { id: record.id },
          data: {
            status: newStatus,
            attempts: newAttempts,
            lastAttemptedAt: new Date(),
          },
        });

        this.logger.warn(
          `Notification ${record.id} delivery failed (attempt ${newAttempts}/${MAX_ATTEMPTS})`,
          err,
        );
      }
    }
  }

  private async deliver(record: { channel: string; eventType: string; payload: unknown; recipientUserId: string }): Promise<void> {
    const payload = record.payload as Record<string, unknown>;
    const recipientEmail = payload['email'] as string | undefined;

    switch (record.channel) {
      case NotificationChannel.EMAIL:
        if (!recipientEmail) {
          throw new Error(`No email in payload for notification ${record.eventType}`);
        }
        await this.email.sendApplicationStatusChanged(recipientEmail, payload);
        break;

      case NotificationChannel.IN_APP:
        // Handled after success above
        break;

      case NotificationChannel.PUSH:
        // TODO: integrate Expo push notifications
        this.logger.debug(`PUSH not yet implemented: ${record.eventType}`);
        break;

      default:
        this.logger.warn(`Unknown notification channel: ${record.channel}`);
    }
  }
}
