import { Injectable, Optional } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import * as crypto from "crypto";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { RolesService } from "../roles/roles.service";
import { ProvisionTenantDto } from "./dtos/provision-tenant.dto";

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly rolesService: RolesService,
    @Optional() @InjectQueue("email") private readonly emailQueue: Queue | null,
  ) {}

  // ── Plans ──────────────────────────────────────────────────────────────────

  async getPlans() : Promise<unknown> {
    return this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });
  }

  // ── Current subscription for tenant ───────────────────────────────────────

  async getCurrentSubscription(tenantId: string) : Promise<unknown> {
    return this.prisma.subscription.findFirst({
      where: {
        tenantId,
        status: { in: ["ACTIVE", "TRIALING"] },
      },
      include: { plan: true },
    });
  }

  // ── Module entitlements ────────────────────────────────────────────────────

  async getEntitlements(tenantId: string) : Promise<unknown> {
    return this.prisma.tenantModuleEntitlement.findMany({
      where: { tenantId },
      orderBy: { moduleCode: "asc" },
    });
  }

  async enableModule(tenantId: string, moduleCode: string, actorId: string) : Promise<unknown> {
    const entitlement = await this.prisma.tenantModuleEntitlement.upsert({
      where: { tenantId_moduleCode: { tenantId, moduleCode } },
      update: { enabled: true },
      create: {
        tenantId,
        moduleCode,
        enabled: true,
        enabledAt: new Date(),
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "MODULE_ENABLED",
      resourceType: "TenantModuleEntitlement",
      resourceId: moduleCode,
    });

    return entitlement;
  }

  async disableModule(tenantId: string, moduleCode: string, actorId: string) : Promise<unknown> {
    const entitlement = await this.prisma.tenantModuleEntitlement.update({
      where: { tenantId_moduleCode: { tenantId, moduleCode } },
      data: { enabled: false },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "MODULE_DISABLED",
      resourceType: "TenantModuleEntitlement",
      resourceId: moduleCode,
    });

    return entitlement;
  }

  // ── Tenant provisioning ────────────────────────────────────────────────────

  async provisionTrial(
    dto: ProvisionTenantDto,
    requestedBy?: string,
  ): Promise<{
    tenantId: string;
    tenantSlug: string;
    invitationToken: string;
  }> {
    // Generate invitation token before transaction
    const invitationToken = crypto.randomBytes(32).toString("hex");
    const invitationTokenHash = crypto
      .createHash("sha256")
      .update(invitationToken)
      .digest("hex");

    const { tenant, user } = await this.prisma.$transaction(async (tx) => {
      // 1. Create Tenant
      const tenant = await tx.tenant.create({
        data: {
          name: dto.tenantName,
          slug: dto.tenantSlug,
          status: "TRIAL",
        },
      });

      // 2. Create TenantSettings
      await tx.tenantSettings.create({
        data: {
          tenantId: tenant.id,
          defaultLocale: "en",
          defaultTimezone: "UTC",
          sessionTimeoutMinutes: 480,
          allowedIpRanges: [],
        },
      });

      // 3. Create Institution
      await tx.institution.create({
        data: {
          tenantId: tenant.id,
          name: dto.institutionName,
        },
      });

      // 5. Upsert Trial subscription plan
      const trialPlan = await tx.subscriptionPlan.upsert({
        where: { name: "Trial" },
        update: {},
        create: {
          name: "Trial",
          maxUsers: 10,
          isActive: true,
          priceMonthly: 0,
        },
      });

      // 6. Create Subscription
      const now = new Date();
      const trialEnd = new Date(now);
      trialEnd.setDate(trialEnd.getDate() + 30);

      await tx.subscription.create({
        data: {
          tenantId: tenant.id,
          planId: trialPlan.id,
          status: "TRIALING",
          startDate: now,
          endDate: trialEnd,
        },
      });

      // 7. Create User
      const user = await tx.user.create({
        data: {
          email: dto.adminEmail,
          passwordHash: "PENDING",
          firstName: dto.adminFirstName,
          lastName: dto.adminLastName,
          status: "PENDING_VERIFICATION",
          tenantId: tenant.id,
        },
      });

      // 8. Create UserTenantMembership
      await tx.userTenantMembership.create({
        data: {
          userId: user.id,
          tenantId: tenant.id,
        },
      });

      // 9. Create Invitation
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 48);

      await tx.invitation.create({
        data: {
          tenantId: tenant.id,
          email: dto.adminEmail,
          token: invitationToken,
          tokenHash: invitationTokenHash,
          type: "ADMIN",
          status: "PENDING",
          expiresAt,
          invitedByUserId: user.id,
        },
      });

      return { tenant, user };
    });

    // 4. Seed default roles (outside tx — runs its own transactions internally)
    await this.rolesService.seedDefaultRolesForTenant(tenant.id);

    // 10. Enable default modules
    const defaultModules = ["core", "research", "performance", "reports"];
    for (const moduleCode of defaultModules) {
      await this.enableModule(tenant.id, moduleCode, user.id);
    }

    // 11. Enqueue invitation email
    await this.emailQueue?.add("invitation-email", {
      to: dto.adminEmail,
      token: invitationToken,
      tenantName: dto.tenantName,
    });

    // 12. Emit audit event
    await this.auditService.log({
      tenantId: tenant.id,
      ...(requestedBy !== undefined ? { actorId: requestedBy } : {}),
      action: "TENANT_PROVISIONED",
      resourceType: "Tenant",
      resourceId: tenant.id,
    });

    return {
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      invitationToken,
    };
  }

  // ── Seed subscription plans ────────────────────────────────────────────────

  async seedPlans(): Promise<void> {
    const plans = [
      {
        name: "Trial",
        maxUsers: 10,
        isActive: true,
        priceMonthly: 0,
        description: "30-day free trial",
      },
      {
        name: "Starter",
        maxUsers: 50,
        isActive: true,
        priceMonthly: 49.99,
        description: "Up to 50 users",
      },
      {
        name: "Professional",
        maxUsers: 200,
        isActive: true,
        priceMonthly: 199.99,
        description: "Up to 200 users",
      },
      {
        name: "Enterprise",
        maxUsers: null,
        isActive: true,
        priceMonthly: null,
        description: "Unlimited users, contact for pricing",
      },
    ] as const;

    for (const plan of plans) {
      await this.prisma.subscriptionPlan.upsert({
        where: { name: plan.name },
        update: {
          maxUsers: plan.maxUsers ?? null,
          isActive: plan.isActive,
          priceMonthly: plan.priceMonthly ?? null,
          description: plan.description,
        },
        create: {
          name: plan.name,
          maxUsers: plan.maxUsers ?? null,
          isActive: plan.isActive,
          priceMonthly: plan.priceMonthly ?? null,
          description: plan.description,
        },
      });
    }
  }
}
