import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { PrismaService } from "../prisma/prisma.service";
import { NotificationChannel } from "@pharmintern/shared-types";
import { Prisma } from "@prisma/client";

/**
 * NotificationsService
 *
 * Writes records to the notification_outbox table inside the caller's transaction.
 * The outbox worker (OutboxProcessor) processes them asynchronously.
 *
 * IMPORTANT: Never call send methods from this service inside a transaction and
 * await the result — always use the outbox pattern so that notification failures
 * do not roll back committed business operations.
 */
@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Enqueue a notification record within an existing transaction.
   * The caller must pass the Prisma transaction client (tx).
   */
  async enqueue(
    tx: Prisma.TransactionClient,
    options: {
      recipientUserId: string;
      channel: NotificationChannel;
      eventType: string;
      payload: Record<string, unknown>;
      idempotencyKey?: string;
    },
  ): Promise<void> {
    const key = options.idempotencyKey ?? uuidv4();
    await tx.notificationOutbox.create({
      data: {
        recipientUserId: options.recipientUserId,
        channel: options.channel,
        eventType: options.eventType,
        payload: options.payload,
        idempotencyKey: key,
      },
    });
  }

  /**
   * Mark an in-app notification as read.
   */
  async markRead(userId: string, notificationId: string): Promise<void> {
    await this.prisma.inAppNotification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  /**
   * Mark all in-app notifications as read for a user.
   */
  async markAllRead(userId: string): Promise<void> {
    await this.prisma.inAppNotification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  /**
   * List unread in-app notifications for a user.
   */
  async listForUser(userId: string, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.prisma.inAppNotification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      this.prisma.inAppNotification.count({ where: { userId } }),
    ]);
    return {
      data: items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}
