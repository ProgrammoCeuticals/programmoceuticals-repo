import { Injectable, Logger, Optional } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';

export interface DispatchInput {
  tenantId: string;
  userId: string;
  userEmail: string;
  title: string;
  body: string;
  resourceType?: string;
  resourceId?: string;
  actionUrl?: string;
}

/**
 * NotificationDispatcher — single call-site for all workflow notifications.
 * Writes an in-app Notification record and enqueues an email job if the user
 * has emailEnabled for the given eventType (or no preference row exists yet,
 * defaulting to true).
 */
@Injectable()
export class NotificationDispatcher {
  private readonly logger = new Logger(NotificationDispatcher.name);

  constructor(
    private readonly prisma: PrismaService,
    @Optional() @InjectQueue('notifications') private readonly notifQueue: Queue | null,
    @Optional() @InjectQueue('email') private readonly emailQueue: Queue | null,
  ) {}

  async dispatch(eventType: string, input: DispatchInput): Promise<void> {
    // 1. Write in-app notification
    try {
      await this.prisma.notification.create({
        data: {
          tenantId: input.tenantId,
          userId: input.userId,
          channel: 'IN_APP',
          status: 'UNREAD',
          title: input.title,
          body: input.body,
          ...(input.resourceType ? { resourceType: input.resourceType } : {}),
          ...(input.resourceId ? { resourceId: input.resourceId } : {}),
          ...(input.actionUrl ? { actionUrl: input.actionUrl } : {}),
        },
      });
    } catch (err) {
      this.logger.warn(`Failed to write in-app notification: ${(err as Error).message}`);
    }

    // 2. Check email preference (default: enabled)
    let emailEnabled = true;
    try {
      const pref = await this.prisma.notificationPreference.findUnique({
        where: {
          userId_tenantId_eventType: {
            userId: input.userId,
            tenantId: input.tenantId,
            eventType,
          },
        },
      });
      if (pref) emailEnabled = pref.emailEnabled;
    } catch {
      // preference table miss — keep default true
    }

    // 3. Enqueue email job
    if (emailEnabled) {
      try {
        await this.emailQueue?.add('workflow-notification', {
          to: input.userEmail,
          title: input.title,
          body: input.body,
          actionUrl: input.actionUrl,
        });
      } catch (err) {
        this.logger.warn(`Failed to enqueue email notification: ${(err as Error).message}`);
      }
    }
  }

  /**
   * Dispatch to every user in the tenant that holds a given permission code.
   */
  async dispatchToPermission(
    eventType: string,
    permissionCode: string,
    input: Omit<DispatchInput, 'userId' | 'userEmail'>,
  ): Promise<void> {
    const users = await this.prisma.user.findMany({
      where: {
        tenantId: input.tenantId,
        status: 'ACTIVE',
        roleAssignments: {
          some: {
            role: {
              rolePermissions: {
                some: { permission: { code: permissionCode } },
              },
            },
          },
        },
      },
      select: { id: true, email: true },
    });

    await Promise.allSettled(
      users.map((u) =>
        this.dispatch(eventType, { ...input, userId: u.id, userEmail: u.email }),
      ),
    );
  }
}
