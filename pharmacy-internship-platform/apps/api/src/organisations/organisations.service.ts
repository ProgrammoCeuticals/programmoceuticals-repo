import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganisationDto, UpdateOrganisationDto } from './dto/create-organisation.dto';
import { CreateLocationDto, UpdateLocationDto } from './dto/create-location.dto';
import { InviteStaffDto, UpdateStaffRolesDto } from './dto/invite-staff.dto';
import { UserRole, OrgMemberRole, VerificationStatus } from '@pharmintern/shared-types';

@Injectable()
export class OrganisationsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Organisation CRUD ─────────────────────────────────────────────────────

  /**
   * Register a new organisation. The creating user becomes the org owner.
   */
  async create(userId: string, dto: CreateOrganisationDto) {
    return this.prisma.$transaction(async (tx) => {
      const org = await tx.organisation.create({
        data: {
          name: dto.name,
          typeId: dto.typeId,
          website: dto.website,
          contactName: dto.contactName,
          contactEmail: dto.contactEmail,
          contactPhone: dto.contactPhone,
          createdByUserId: userId,
          verificationStatus: 'DRAFT',
        },
      });

      // Ensure the creating user has EMPLOYER_STAFF role
      await tx.user.update({
        where: { id: userId },
        data: { role: UserRole.EMPLOYER_STAFF },
      });

      // Create membership and assign ORGANISATION_OWNER role
      const membership = await tx.organisationMembership.create({
        data: {
          organisationId: org.id,
          userId,
          isOwner: true,
          acceptedAt: new Date(),
        },
      });

      await tx.membershipRole.create({
        data: {
          membershipId: membership.id,
          role: OrgMemberRole.ORGANISATION_OWNER,
        },
      });

      await tx.auditEvent.create({
        data: {
          eventType: 'ORGANISATION_CREATED',
          actorUserId: userId,
          entityType: 'organisations',
          entityId: org.id,
          payload: { name: org.name },
        },
      });

      return org;
    });
  }

  async findPublic(query: {
    page?: number;
    pageSize?: number;
    stateId?: string;
    practiceAreaId?: string;
    keyword?: string;
  }) {
    const page = query.page ?? 1;
    const pageSize = Math.min(query.pageSize ?? 20, 100);
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {
      verificationStatus: VerificationStatus.APPROVED,
    };

    if (query.keyword) {
      where['name'] = { contains: query.keyword, mode: 'insensitive' };
    }

    const [items, total] = await Promise.all([
      this.prisma.organisation.findMany({
        where,
        include: {
          type: { select: { id: true, name: true } },
          locations: {
            where: { isPrimary: true },
            select: { id: true, name: true, city: true, state: { select: { id: true, name: true } } },
            take: 1,
          },
        },
        skip,
        take: pageSize,
        orderBy: { name: 'asc' },
      }),
      this.prisma.organisation.count({ where }),
    ]);

    return {
      data: items,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async findPublicById(id: string) {
    const org = await this.prisma.organisation.findFirst({
      where: { id, verificationStatus: VerificationStatus.APPROVED },
      include: {
        type: true,
        locations: {
          select: {
            id: true, name: true, addressLine1: true, city: true, isPrimary: true,
            state: { select: { id: true, name: true } },
          },
        },
      },
    });
    if (!org) throw new NotFoundException('Organisation not found');
    return org;
  }

  async findByIdForMember(id: string, userId: string) {
    await this.assertMember(id, userId);
    const org = await this.prisma.organisation.findUnique({
      where: { id },
      include: {
        type: true,
        locations: {
          include: { state: true },
        },
      },
    });
    if (!org) throw new NotFoundException('Organisation not found');
    return org;
  }

  async update(id: string, userId: string, dto: UpdateOrganisationDto) {
    await this.assertRole(id, userId, [OrgMemberRole.ORGANISATION_OWNER]);

    const org = await this.prisma.organisation.update({
      where: { id },
      data: {
        name: dto.name,
        typeId: dto.typeId,
        website: dto.website,
        contactName: dto.contactName,
        contactEmail: dto.contactEmail,
        contactPhone: dto.contactPhone,
      },
    });

    await this.prisma.auditEvent.create({
      data: {
        eventType: 'ORGANISATION_UPDATED',
        actorUserId: userId,
        entityType: 'organisations',
        entityId: id,
      },
    });

    return org;
  }

  // ── Locations ─────────────────────────────────────────────────────────────

  async addLocation(orgId: string, userId: string, dto: CreateLocationDto) {
    await this.assertRole(orgId, userId, [OrgMemberRole.ORGANISATION_OWNER]);

    const location = await this.prisma.organisationLocation.create({
      data: {
        organisationId: orgId,
        name: dto.name,
        addressLine1: dto.addressLine1,
        addressLine2: dto.addressLine2,
        city: dto.city,
        stateId: dto.stateId,
        latitude: dto.latitude,
        longitude: dto.longitude,
        isPrimary: dto.isPrimary ?? false,
        verificationStatus: 'DRAFT',
      },
    });

    await this.prisma.auditEvent.create({
      data: {
        eventType: 'LOCATION_CREATED',
        actorUserId: userId,
        entityType: 'organisation_locations',
        entityId: location.id,
        payload: { orgId, name: location.name },
      },
    });

    return location;
  }

  async updateLocation(orgId: string, locationId: string, userId: string, dto: UpdateLocationDto) {
    await this.assertRole(orgId, userId, [OrgMemberRole.ORGANISATION_OWNER]);
    const location = await this.prisma.organisationLocation.findFirst({
      where: { id: locationId, organisationId: orgId },
    });
    if (!location) throw new NotFoundException('Location not found');

    return this.prisma.organisationLocation.update({
      where: { id: locationId },
      data: {
        name: dto.name,
        addressLine1: dto.addressLine1,
        addressLine2: dto.addressLine2,
        city: dto.city,
        stateId: dto.stateId,
        latitude: dto.latitude,
        longitude: dto.longitude,
        isPrimary: dto.isPrimary,
      },
    });
  }

  async getLocations(orgId: string) {
    return this.prisma.organisationLocation.findMany({
      where: { organisationId: orgId },
      include: { state: { select: { id: true, name: true } } },
      orderBy: [{ isPrimary: 'desc' }, { name: 'asc' }],
    });
  }

  // ── Staff management ──────────────────────────────────────────────────────

  async inviteStaff(orgId: string, inviterUserId: string, dto: InviteStaffDto) {
    await this.assertRole(orgId, inviterUserId, [OrgMemberRole.ORGANISATION_OWNER]);

    // Find or surface the invited user (they must have an account)
    const invitedUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (!invitedUser) {
      throw new BadRequestException('No account found with that email address. The user must register first.');
    }

    const existing = await this.prisma.organisationMembership.findUnique({
      where: { organisationId_userId: { organisationId: orgId, userId: invitedUser.id } },
    });
    if (existing && !existing.revokedAt) {
      throw new ConflictException('User is already a member of this organisation');
    }

    return this.prisma.$transaction(async (tx) => {
      const membership = existing
        ? await tx.organisationMembership.update({
            where: { id: existing.id },
            data: { revokedAt: null, locationId: dto.locationId ?? null, invitedByUserId: inviterUserId },
          })
        : await tx.organisationMembership.create({
            data: {
              organisationId: orgId,
              userId: invitedUser.id,
              locationId: dto.locationId ?? null,
              isOwner: false,
              invitedByUserId: inviterUserId,
              // acceptedAt is null until user accepts the invite (for now auto-accept)
              acceptedAt: new Date(),
            },
          });

      // Assign roles (upsert)
      for (const role of dto.roles) {
        await tx.membershipRole.upsert({
          where: { membershipId_role: { membershipId: membership.id, role } },
          update: {},
          create: { membershipId: membership.id, role },
        });
      }

      // Ensure the user has EMPLOYER_STAFF platform role
      await tx.user.update({
        where: { id: invitedUser.id },
        data: { role: UserRole.EMPLOYER_STAFF },
      });

      await tx.auditEvent.create({
        data: {
          eventType: 'STAFF_INVITED',
          actorUserId: inviterUserId,
          entityType: 'organisation_memberships',
          entityId: membership.id,
          payload: { invitedEmail: dto.email, orgId, roles: dto.roles },
        },
      });

      return membership;
    });
  }

  async updateStaffRoles(orgId: string, memberId: string, actorUserId: string, dto: UpdateStaffRolesDto) {
    await this.assertRole(orgId, actorUserId, [OrgMemberRole.ORGANISATION_OWNER]);

    const membership = await this.prisma.organisationMembership.findFirst({
      where: { id: memberId, organisationId: orgId },
    });
    if (!membership) throw new NotFoundException('Staff member not found');
    if (membership.isOwner) throw new ForbiddenException('Cannot change roles of the organisation owner');

    return this.prisma.$transaction(async (tx) => {
      // Remove all existing roles and replace
      await tx.membershipRole.deleteMany({ where: { membershipId: memberId } });
      for (const role of dto.roles) {
        await tx.membershipRole.create({ data: { membershipId: memberId, role } });
      }

      await tx.auditEvent.create({
        data: {
          eventType: 'STAFF_ROLES_UPDATED',
          actorUserId,
          entityType: 'organisation_memberships',
          entityId: memberId,
          payload: { newRoles: dto.roles },
        },
      });

      return tx.organisationMembership.findUnique({ where: { id: memberId }, include: { roles: true } });
    });
  }

  async revokeStaff(orgId: string, memberId: string, actorUserId: string) {
    await this.assertRole(orgId, actorUserId, [OrgMemberRole.ORGANISATION_OWNER]);

    const membership = await this.prisma.organisationMembership.findFirst({
      where: { id: memberId, organisationId: orgId },
    });
    if (!membership) throw new NotFoundException('Staff member not found');
    if (membership.userId === actorUserId) throw new ForbiddenException('Cannot revoke yourself');
    if (membership.isOwner) throw new ForbiddenException('Cannot revoke the organisation owner');

    await this.prisma.organisationMembership.update({
      where: { id: memberId },
      data: { revokedAt: new Date() },
    });

    await this.prisma.auditEvent.create({
      data: {
        eventType: 'STAFF_REVOKED',
        actorUserId,
        entityType: 'organisation_memberships',
        entityId: memberId,
        payload: { orgId },
      },
    });
  }

  async listStaff(orgId: string, actorUserId: string) {
    await this.assertMember(orgId, actorUserId);
    return this.prisma.organisationMembership.findMany({
      where: { organisationId: orgId, revokedAt: null },
      include: {
        roles: true,
        user: { select: { id: true, email: true } },
        location: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  // ── Access helpers ─────────────────────────────────────────────────────────

  /**
   * Assert the user is an active member of the organisation.
   * Returns the membership record.
   */
  async assertMember(orgId: string, userId: string) {
    const membership = await this.prisma.organisationMembership.findFirst({
      where: { organisationId: orgId, userId, revokedAt: null, acceptedAt: { not: null } },
      include: { roles: true },
    });
    if (!membership) {
      throw new ForbiddenException('You are not a member of this organisation');
    }
    return membership;
  }

  /**
   * Assert the user holds at least one of the required org roles.
   */
  async assertRole(orgId: string, userId: string, requiredRoles: OrgMemberRole[]) {
    const membership = await this.assertMember(orgId, userId);
    const userRoles = membership.roles.map((r) => r.role as OrgMemberRole);
    const hasRole = requiredRoles.some((r) => userRoles.includes(r));
    if (!hasRole) {
      throw new ForbiddenException(
        `Insufficient permissions. Required: ${requiredRoles.join(' or ')}`,
      );
    }
    return membership;
  }

  /**
   * Check if the organisation is approved (for vacancy publishing).
   */
  async assertApproved(orgId: string) {
    const org = await this.prisma.organisation.findUnique({ where: { id: orgId } });
    if (!org) throw new NotFoundException('Organisation not found');
    if (org.verificationStatus !== 'APPROVED') {
      throw new ForbiddenException(
        'Organisation must be verified and approved before publishing vacancies',
      );
    }
    return org;
  }
}
