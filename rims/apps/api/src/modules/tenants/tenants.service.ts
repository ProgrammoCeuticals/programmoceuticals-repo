import { Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RolesService } from '../roles/roles.service';
import { ProvisionTenantDto } from './dtos/provision-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rolesService: RolesService,
  ) {}

  async getCurrent(tenantId: string) {
    try {
      return await this.prisma.tenant.findUniqueOrThrow({
        where: { id: tenantId },
        include: {
          settings: true,
          moduleEntitlements: true,
          institution: true,
          subscriptions: {
            where: { status: 'ACTIVE' },
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    } catch {
      throw new NotFoundException('Tenant not found');
    }
  }

  async provision(dto: ProvisionTenantDto) {
    // Steps 1-3 in a transaction: tenant, settings, institution
    const { tenant, institution } = await this.prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: { name: dto.name, slug: dto.slug, status: 'ACTIVE' },
      });

      await tx.tenantSettings.create({
        data: {
          tenantId: tenant.id,
          defaultLocale: 'en',
          defaultTimezone: 'UTC',
          mfaRequired: false,
          sessionTimeoutMinutes: 480,
          allowedIpRanges: [],
        },
      });

      const institution = await tx.institution.create({
        data: {
          tenantId: tenant.id,
          name: dto.institutionName ?? dto.name,
          type: 'UNIVERSITY',
        },
      });

      return { tenant, institution };
    });

    // Step 4: seed default roles (runs outside the transaction — has its own queries)
    await this.rolesService.seedDefaultRolesForTenant(tenant.id);

    // Steps 5-7 in a second transaction: admin user, membership, invitation
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const { adminUser } = await this.prisma.$transaction(async (tx) => {
      const adminUser = await tx.user.create({
        data: {
          email: dto.adminEmail,
          passwordHash: '',
          firstName: 'Admin',
          lastName: 'User',
          status: 'PENDING_VERIFICATION',
          tenantId: tenant.id,
        },
      });

      await tx.userTenantMembership.create({
        data: { userId: adminUser.id, tenantId: tenant.id },
      });

      await tx.invitation.create({
        data: {
          tenantId: tenant.id,
          email: dto.adminEmail,
          token: rawToken,
          tokenHash,
          type: 'ADMIN',
          status: 'PENDING',
          expiresAt,
          invitedByUserId: adminUser.id,
        },
      });

      return { adminUser };
    });

    return { tenant, institution, adminUser, invitationToken: rawToken };
  }
}
