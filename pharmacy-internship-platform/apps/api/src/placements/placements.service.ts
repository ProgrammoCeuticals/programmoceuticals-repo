import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrganisationsService } from '../organisations/organisations.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationChannel, OrgMemberRole } from '@pharmintern/shared-types';

// Allowed status transitions — enforced on backend
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  OFFER_ACCEPTED:       ['AWAITING_RESUMPTION', 'ACTIVE'],
  AWAITING_RESUMPTION:  ['ACTIVE', 'WITHDRAWAL_REQUESTED', 'TERMINATED'],
  ACTIVE:               ['INTERRUPTED', 'WITHDRAWAL_REQUESTED', 'TERMINATED', 'COMPLETED'],
  INTERRUPTED:          ['ACTIVE', 'WITHDRAWAL_REQUESTED', 'TERMINATED'],
  WITHDRAWAL_REQUESTED: ['TERMINATED', 'ACTIVE'], // Active = request rescinded
};

// Only coordinator or admin can mark COMPLETED — see TRANSACTION_RULES.md §8
const COMPLETION_ROLES = [
  OrgMemberRole.ORGANISATION_OWNER,
  OrgMemberRole.INTERNSHIP_COORDINATOR,
];

const COORDINATOR_ROLES = [
  OrgMemberRole.ORGANISATION_OWNER,
  OrgMemberRole.INTERNSHIP_COORDINATOR,
];

@Injectable()
export class PlacementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orgsService: OrganisationsService,
    private readonly notifications: NotificationsService,
  ) {}

  // ── Applicant: view own placements ────────────────────────────────────────

  async listMine(applicantUserId: string, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.prisma.placement.findMany({
        where: { applicantUserId },
        include: {
          organisation: { select: { id: true, name: true } },
          location: { select: { id: true, name: true, city: true } },
          vacancy: { select: { id: true, title: true } },
        },
        skip, take: pageSize, orderBy: { createdAt: 'desc' },
      }),
      this.prisma.placement.count({ where: { applicantUserId } }),
    ]);
    return { data: items, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async getForApplicant(placementId: string, applicantUserId: string) {
    const placement = await this.prisma.placement.findUnique({
      where: { id: placementId },
      include: {
        organisation: { select: { id: true, name: true } },
        location: { select: { id: true, name: true } },
        vacancy: { select: { id: true, title: true } },
        offer: { select: { id: true, reportingDate: true, remunerationInfo: true, accommodationDetails: true } },
      },
    });
    if (!placement || placement.applicantUserId !== applicantUserId) {
      throw new NotFoundException('Placement not found');
    }
    return placement;
  }

  // ── Employer: list org placements ─────────────────────────────────────────

  async listForOrg(orgId: string, userId: string, query: { status?: string; page?: number; pageSize?: number }) {
    await this.orgsService.assertRole(orgId, userId, COORDINATOR_ROLES);

    const page = query.page ?? 1;
    const pageSize = Math.min(query.pageSize ?? 20, 100);
    const where: Record<string, unknown> = { organisationId: orgId };
    if (query.status) where['status'] = query.status;

    const [items, total] = await Promise.all([
      this.prisma.placement.findMany({
        where,
        include: {
          vacancy: { select: { id: true, title: true } },
          location: { select: { id: true, name: true } },
          supervisorAssignments: {
            where: { unassignedAt: null },
            include: { supervisorUser: { select: { id: true, email: true } } },
          },
        },
        skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' },
      }),
      this.prisma.placement.count({ where }),
    ]);
    return { data: items, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async getForEmployer(placementId: string, orgId: string, userId: string) {
    await this.orgsService.assertRole(orgId, userId, COORDINATOR_ROLES);
    const placement = await this.prisma.placement.findFirst({
      where: { id: placementId, organisationId: orgId },
      include: {
        offer: true,
        vacancy: true,
        location: true,
        supervisorAssignments: {
          include: { supervisorUser: { select: { id: true, email: true } } },
        },
      },
    });
    if (!placement) throw new NotFoundException('Placement not found');
    return placement;
  }

  // ── Status transitions ────────────────────────────────────────────────────

  async updateStatus(placementId: string, orgId: string, userId: string, newStatus: string, reason?: string) {
    await this.orgsService.assertRole(orgId, userId, COORDINATOR_ROLES);

    const placement = await this.prisma.placement.findFirst({
      where: { id: placementId, organisationId: orgId },
    });
    if (!placement) throw new NotFoundException('Placement not found');

    const allowed = ALLOWED_TRANSITIONS[placement.status] ?? [];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition placement from ${placement.status} to ${newStatus}`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.placement.update({
        where: { id: placementId },
        data: {
          status: newStatus as never,
          actualEndDate: ['TERMINATED', 'COMPLETED'].includes(newStatus) ? new Date() : undefined,
        },
      });

      await tx.auditEvent.create({
        data: {
          eventType: `PLACEMENT_${newStatus}`,
          actorUserId: userId,
          entityType: 'placements',
          entityId: placementId,
          payload: { from: placement.status, to: newStatus, reason },
        },
      });

      await this.notifications.enqueue(tx, {
        recipientUserId: placement.applicantUserId,
        channel: NotificationChannel.IN_APP,
        eventType: `PLACEMENT_${newStatus}`,
        payload: { placementId, status: newStatus },
        idempotencyKey: `placement-status-${placementId}-${newStatus}-${Date.now()}`,
      });

      return updated;
    });
  }

  // ── Mark COMPLETED — explicit employer action required (§8) ───────────────

  async complete(
    placementId: string,
    orgId: string,
    userId: string,
    completionData: {
      completionDate?: string;
      finalAssessmentNotes?: string;
    },
  ) {
    // TRANSACTION_RULES.md §8: only INTERNSHIP_COORDINATOR or ORG_OWNER may complete
    await this.orgsService.assertRole(orgId, userId, COMPLETION_ROLES);

    const placement = await this.prisma.placement.findFirst({
      where: { id: placementId, organisationId: orgId },
    });
    if (!placement) throw new NotFoundException('Placement not found');

    if (placement.status !== 'ACTIVE') {
      throw new BadRequestException('Only ACTIVE placements can be marked as completed');
    }

    const completionDate = completionData.completionDate
      ? new Date(completionData.completionDate)
      : new Date();

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.placement.update({
        where: { id: placementId },
        data: {
          status: 'COMPLETED',
          actualEndDate: completionDate,
        },
      });

      await tx.auditEvent.create({
        data: {
          eventType: 'PLACEMENT_COMPLETED',
          actorUserId: userId,
          entityType: 'placements',
          entityId: placementId,
          payload: {
            completionDate: completionDate.toISOString(),
            finalAssessmentNotes: completionData.finalAssessmentNotes ?? null,
            confirmedByUserId: userId,
          },
        },
      });

      await this.notifications.enqueue(tx, {
        recipientUserId: placement.applicantUserId,
        channel: NotificationChannel.IN_APP,
        eventType: 'PLACEMENT_COMPLETED',
        payload: { placementId, completionDate: completionDate.toISOString() },
        idempotencyKey: `placement-completed-inapp-${placementId}`,
      });

      return updated;
    });
  }

  // ── Supervisor assignment ─────────────────────────────────────────────────

  async assignSupervisor(placementId: string, orgId: string, userId: string, supervisorUserId: string) {
    await this.orgsService.assertRole(orgId, userId, COORDINATOR_ROLES);

    const placement = await this.prisma.placement.findFirst({
      where: { id: placementId, organisationId: orgId },
    });
    if (!placement) throw new NotFoundException('Placement not found');

    // Verify supervisor is a member of the org
    await this.orgsService.assertMember(orgId, supervisorUserId);

    return this.prisma.supervisorAssignment.create({
      data: {
        placementId,
        supervisorUserId,
        assignedByUserId: userId,
      },
    });
  }

  async unassignSupervisor(assignmentId: string, orgId: string, userId: string) {
    await this.orgsService.assertRole(orgId, userId, COORDINATOR_ROLES);

    return this.prisma.supervisorAssignment.updateMany({
      where: { id: assignmentId, placement: { organisationId: orgId } },
      data: { unassignedAt: new Date() },
    });
  }
}
