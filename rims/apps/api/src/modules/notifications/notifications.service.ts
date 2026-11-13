import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
// NOTE: Using this.prisma.notification (lowercase accessor) to avoid conflicts
// with NestJS's own Notification type from @nestjs/common.
import { PrismaService } from "../prisma/prisma.service";

export interface CreateNotificationInput {
  tenantId: string;
  userId: string;
  title: string;
  body: string;
  resourceType?: string;
  resourceId?: string;
  actionUrl?: string;
}

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNotificationInput) {
    return this.prisma.notification.create({
      data: {
        tenantId: dto.tenantId,
        userId: dto.userId,
        title: dto.title,
        body: dto.body,
        channel: "IN_APP",
        status: "UNREAD",
        ...(dto.resourceType !== undefined
          ? { resourceType: dto.resourceType }
          : {}),
        ...(dto.resourceId !== undefined ? { resourceId: dto.resourceId } : {}),
        ...(dto.actionUrl !== undefined ? { actionUrl: dto.actionUrl } : {}),
      },
    });
  }

  async findForUser(
    userId: string,
    tenantId: string,
    query: { status?: string; page?: number; pageSize?: number },
  ) {
    const { status, page = 1, pageSize = 20 } = query;

    type WhereInput = {
      userId: string;
      tenantId: string;
      status?: "UNREAD" | "READ" | "DISMISSED";
    };

    const where: WhereInput = { userId, tenantId };

    if (status) {
      where.status = status as "UNREAD" | "READ" | "DISMISSED";
    }

    const [total, data] = await Promise.all([
      this.prisma.notification.count({ where }),
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async markRead(id: string, userId: string, tenantId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, tenantId },
    });

    if (!notification) {
      throw new NotFoundException("Notification not found");
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException("Access denied");
    }

    return this.prisma.notification.update({
      where: { id },
      data: { status: "READ", readAt: new Date() },
    });
  }

  async markAllRead(userId: string, tenantId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, tenantId, status: "UNREAD" },
      data: { status: "READ", readAt: new Date() },
    });

    return { count: result.count };
  }

  async dismiss(id: string, userId: string, tenantId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, tenantId },
    });

    if (!notification) {
      throw new NotFoundException("Notification not found");
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException("Access denied");
    }

    return this.prisma.notification.update({
      where: { id },
      data: { status: "DISMISSED" },
    });
  }

  async getUnreadCount(userId: string, tenantId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, tenantId, status: "UNREAD" },
    });

    return { count };
  }

  async getPreferences(userId: string, tenantId: string) {
    return this.prisma.notificationPreference.findMany({
      where: { userId, tenantId },
    });
  }

  async updatePreference(
    userId: string,
    tenantId: string,
    eventType: string,
    inAppEnabled: boolean,
    emailEnabled: boolean,
  ) {
    return this.prisma.notificationPreference.upsert({
      where: { userId_tenantId_eventType: { userId, tenantId, eventType } },
      update: { inAppEnabled, emailEnabled },
      create: { userId, tenantId, eventType, inAppEnabled, emailEnabled },
    });
  }
}
