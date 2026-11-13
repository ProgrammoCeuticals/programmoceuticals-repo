import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { UsageService } from '../usage/usage.service';

@Injectable()
export class PlatformAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly usageService: UsageService,
  ) {}

  async listTenants(query: {
    status?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }) {
    const { status, search, page = 1, pageSize = 20 } = query;

    const where: Prisma.TenantWhereInput = {};
    if (status) where.status = status as Prisma.EnumTenantStatusFilter;
    if (search) where.name = { contains: search, mode: 'insensitive' };

    const [total, tenants] = await Promise.all([
      this.prisma.tenant.count({ where }),
      this.prisma.tenant.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          createdAt: true,
          _count: { select: { users: true, employees: true } },
          subscriptions: {
            where: { status: { in: ['ACTIVE', 'TRIALING'] } },
            include: { plan: { select: { name: true } } },
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const data = tenants.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      status: t.status,
      createdAt: t.createdAt,
      userCount: t._count.users,
      employeeCount: t._count.employees,
      activePlanName: t.subscriptions[0]?.plan.name ?? null,
    }));

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

  async getTenantOverview(tenantId: string) {
    const [tenant, usageSummary] = await Promise.all([
      this.prisma.tenant.findUnique({
        where: { id: tenantId },
        include: {
          subscriptions: { include: { plan: true } },
          moduleEntitlements: true,
          settings: true,
        },
      }),
      this.usageService.getCurrentUsageSummary(tenantId),
    ]);

    return { tenant, usageSummary };
  }

  async suspendTenant(tenantId: string, reason: string, actorId: string) {
    const tenant = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { status: 'SUSPENDED' },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: 'TENANT_SUSPENDED',
      resourceType: 'Tenant',
      resourceId: tenantId,
      afterState: { reason },
    });

    return tenant;
  }

  async activateTenant(tenantId: string, actorId: string) {
    const tenant = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { status: 'ACTIVE' },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: 'TENANT_ACTIVATED',
      resourceType: 'Tenant',
      resourceId: tenantId,
    });

    return tenant;
  }

  async getSystemHealth(): Promise<{
    tenantCount: number;
    activeSubscriptions: number;
    trialSubscriptions: number;
    dbStatus: 'ok' | 'error';
    cacheStatus: 'ok' | 'error';
    queueStatus: 'ok' | 'error';
    uptime: number;
    timestamp: Date;
  }> {
    let dbStatus: 'ok' | 'error' = 'ok';

    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'error';
    }

    const [tenantCount, activeSubscriptions, trialSubscriptions] =
      await Promise.all([
        this.prisma.tenant.count(),
        this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
        this.prisma.subscription.count({ where: { status: 'TRIALING' } }),
      ]);

    return {
      tenantCount,
      activeSubscriptions,
      trialSubscriptions,
      dbStatus,
      cacheStatus: 'ok',
      queueStatus: 'ok',
      uptime: process.uptime(),
      timestamp: new Date(),
    };
  }
}
