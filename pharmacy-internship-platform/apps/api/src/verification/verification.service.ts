import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import {
  SubmitVerificationDto,
  RecordVerificationMeetingDto,
  DecideVerificationDto,
  UpdateVerificationStatusDto,
} from './dto/verification.dto';
import { NotificationChannel } from '@pharmintern/shared-types';

// Allowed forward transitions — enforced on backend
const ALLOWED_ADMIN_TRANSITIONS: Record<string, string[]> = {
  SUBMITTED:                        ['UNDER_REVIEW'],
  UNDER_REVIEW:                     ['MEETING_REQUIRED', 'ADDITIONAL_INFORMATION_REQUIRED', 'APPROVED', 'REJECTED'],
  MEETING_REQUIRED:                 ['MEETING_SCHEDULED'],
  MEETING_SCHEDULED:                ['UNDER_REVIEW'],
  ADDITIONAL_INFORMATION_REQUIRED:  ['UNDER_REVIEW'],
  APPROVED:                         ['SUSPENDED', 'REVERIFICATION_REQUIRED'],
  SUSPENDED:                        ['UNDER_REVIEW'],
  REVERIFICATION_REQUIRED:          ['SUBMITTED'],
};

@Injectable()
export class VerificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  // ── Employer-facing ───────────────────────────────────────────────────────

  async getMyCase(organisationId: string) {
    return this.prisma.verificationCase.findFirst({
      where: { organisationId, locationId: null },
      include: {
        documents: { orderBy: { uploadedAt: 'desc' } },
        meetings: { orderBy: { scheduledAt: 'desc' } },
        checklistType: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async submit(organisationId: string, userId: string, dto: SubmitVerificationDto) {
    const org = await this.prisma.organisation.findUnique({ where: { id: organisationId } });
    if (!org) throw new NotFoundException('Organisation not found');

    const allowedStatuses = ['DRAFT', 'REVERIFICATION_REQUIRED', 'ADDITIONAL_INFORMATION_REQUIRED'];
    if (!allowedStatuses.includes(org.verificationStatus)) {
      throw new BadRequestException(
        `Cannot submit verification when organisation status is ${org.verificationStatus}`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.organisation.update({
        where: { id: organisationId },
        data: { verificationStatus: 'SUBMITTED' },
      });

      const verCase = await tx.verificationCase.create({
        data: {
          organisationId,
          locationId: dto.locationId ?? null,
          status: 'SUBMITTED',
        },
      });

      await tx.auditEvent.create({
        data: {
          eventType: 'VERIFICATION_SUBMITTED',
          actorUserId: userId,
          entityType: 'verification_cases',
          entityId: verCase.id,
          payload: { organisationId },
        },
      });

      return verCase;
    });
  }

  async addDocument(
    verificationCaseId: string,
    userId: string,
    documentType: string,
    storageKey: string,
    originalFilename?: string,
    fileSizeBytes?: bigint,
    mimeType?: string,
  ) {
    // Verify the case belongs to the user's organisation (checked by controller via membership)
    const verCase = await this.prisma.verificationCase.findUnique({
      where: { id: verificationCaseId },
    });
    if (!verCase) throw new NotFoundException('Verification case not found');

    return this.prisma.verificationDocument.create({
      data: {
        verificationCaseId,
        documentType,
        storageKey,
        originalFilename,
        fileSizeBytes,
        mimeType,
        uploadedByUserId: userId,
        scanStatus: 'PENDING',
      },
    });
  }

  // ── Admin-facing ──────────────────────────────────────────────────────────

  async listQueue(query: {
    status?: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = query.page ?? 1;
    const pageSize = Math.min(query.pageSize ?? 20, 100);

    const where: Record<string, unknown> = {};
    if (query.status) where['status'] = query.status;

    const [items, total] = await Promise.all([
      this.prisma.verificationCase.findMany({
        where,
        include: {
          organisation: { select: { id: true, name: true, verificationStatus: true } },
          currentReviewer: { select: { id: true, email: true } },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.verificationCase.count({ where }),
    ]);

    return {
      data: items,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async getCaseFull(caseId: string) {
    const verCase = await this.prisma.verificationCase.findUnique({
      where: { id: caseId },
      include: {
        organisation: true,
        location: true,
        documents: { orderBy: { uploadedAt: 'desc' } },
        meetings: { orderBy: { scheduledAt: 'desc' } },
        openedByUser: { select: { id: true, email: true } },
        currentReviewer: { select: { id: true, email: true } },
        decidedByUser: { select: { id: true, email: true } },
        checklistType: true,
      },
    });
    if (!verCase) throw new NotFoundException('Verification case not found');
    return verCase;
  }

  async assignReviewer(caseId: string, reviewerUserId: string, adminUserId: string) {
    const verCase = await this.prisma.verificationCase.findUnique({ where: { id: caseId } });
    if (!verCase) throw new NotFoundException('Verification case not found');

    return this.prisma.verificationCase.update({
      where: { id: caseId },
      data: {
        currentReviewerUserId: reviewerUserId,
        openedByUserId: adminUserId,
      },
    });
  }

  async updateStatus(caseId: string, dto: UpdateVerificationStatusDto, adminUserId: string) {
    const verCase = await this.prisma.verificationCase.findUnique({
      where: { id: caseId },
    });
    if (!verCase) throw new NotFoundException('Verification case not found');

    const allowed = ALLOWED_ADMIN_TRANSITIONS[verCase.status] ?? [];
    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(
        `Cannot transition from ${verCase.status} to ${dto.status}`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.verificationCase.update({
        where: { id: caseId },
        data: { status: dto.status as never },
      });

      // Mirror status on organisation for quick lookups
      const orgStatus = dto.status;
      if (['UNDER_REVIEW', 'MEETING_REQUIRED', 'MEETING_SCHEDULED', 'ADDITIONAL_INFORMATION_REQUIRED'].includes(orgStatus)) {
        await tx.organisation.update({
          where: { id: verCase.organisationId },
          data: { verificationStatus: orgStatus as never },
        });
      }

      await tx.auditEvent.create({
        data: {
          eventType: 'VERIFICATION_STATUS_UPDATED',
          actorUserId: adminUserId,
          entityType: 'verification_cases',
          entityId: caseId,
          payload: { from: verCase.status, to: dto.status, note: dto.note },
        },
      });

      // Notify org contact
      const org = await tx.organisation.findUnique({ where: { id: verCase.organisationId } });
      if (org?.contactEmail) {
        const membership = await tx.organisationMembership.findFirst({
          where: { organisationId: org.id, isOwner: true },
        });
        if (membership) {
          await this.notifications.enqueue(tx, {
            recipientUserId: membership.userId,
            channel: NotificationChannel.IN_APP,
            eventType: 'VERIFICATION_STATUS_CHANGED',
            payload: { orgId: org.id, newStatus: dto.status, note: dto.note ?? '' },
          });
        }
      }

      return updated;
    });
  }

  async scheduleMeeting(caseId: string, dto: RecordVerificationMeetingDto, adminUserId: string) {
    const verCase = await this.prisma.verificationCase.findUnique({ where: { id: caseId } });
    if (!verCase) throw new NotFoundException('Verification case not found');
    if (verCase.status !== 'MEETING_REQUIRED' && verCase.status !== 'MEETING_SCHEDULED') {
      throw new BadRequestException('Case must be in MEETING_REQUIRED or MEETING_SCHEDULED status');
    }

    return this.prisma.$transaction(async (tx) => {
      const meeting = await tx.verificationMeeting.create({
        data: {
          verificationCaseId: caseId,
          scheduledAt: new Date(dto.scheduledAt),
          heldAt: dto.heldAt ? new Date(dto.heldAt) : null,
          participants: dto.participants ?? [],
          checklistResponses: dto.checklistResponses ?? null,
          notes: dto.notes,
          outcome: dto.outcome ?? null,
          recordedByUserId: adminUserId,
        },
      });

      await tx.verificationCase.update({
        where: { id: caseId },
        data: { status: 'MEETING_SCHEDULED' },
      });

      await tx.auditEvent.create({
        data: {
          eventType: 'VERIFICATION_MEETING_SCHEDULED',
          actorUserId: adminUserId,
          entityType: 'verification_meetings',
          entityId: meeting.id,
          payload: { caseId, scheduledAt: dto.scheduledAt },
        },
      });

      return meeting;
    });
  }

  async recordMeetingOutcome(
    caseId: string,
    meetingId: string,
    dto: RecordVerificationMeetingDto,
    adminUserId: string,
  ) {
    const meeting = await this.prisma.verificationMeeting.findFirst({
      where: { id: meetingId, verificationCaseId: caseId },
    });
    if (!meeting) throw new NotFoundException('Meeting not found');

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.verificationMeeting.update({
        where: { id: meetingId },
        data: {
          heldAt: dto.heldAt ? new Date(dto.heldAt) : null,
          participants: dto.participants ?? [],
          checklistResponses: dto.checklistResponses ?? null,
          notes: dto.notes,
          outcome: dto.outcome ?? null,
          recordedByUserId: adminUserId,
        },
      });

      // Move case back to UNDER_REVIEW for the admin to make a decision
      await tx.verificationCase.update({
        where: { id: caseId },
        data: { status: 'UNDER_REVIEW' },
      });

      await tx.auditEvent.create({
        data: {
          eventType: 'VERIFICATION_MEETING_OUTCOME_RECORDED',
          actorUserId: adminUserId,
          entityType: 'verification_meetings',
          entityId: meetingId,
          payload: { outcome: dto.outcome, caseId },
        },
      });

      return updated;
    });
  }

  async decide(caseId: string, dto: DecideVerificationDto, adminUserId: string) {
    const verCase = await this.prisma.verificationCase.findUnique({
      where: { id: caseId },
      include: { organisation: true },
    });
    if (!verCase) throw new NotFoundException('Verification case not found');

    // Can only decide from UNDER_REVIEW or APPROVED (for suspension)
    const allowed = verCase.status === 'APPROVED'
      ? ['SUSPENDED']
      : ['APPROVED', 'REJECTED'];

    if (!allowed.includes(dto.decision)) {
      throw new BadRequestException(
        `Cannot make decision ${dto.decision} from current status ${verCase.status}`,
      );
    }

    if ((dto.decision === 'REJECTED' || dto.decision === 'SUSPENDED') && !dto.reason?.trim()) {
      throw new BadRequestException('A reason is required for REJECTED or SUSPENDED decisions');
    }

    return this.prisma.$transaction(async (tx) => {
      const now = new Date();

      await tx.verificationCase.update({
        where: { id: caseId },
        data: {
          status: dto.decision,
          decision: dto.decision as never,
          decisionReason: dto.reason,
          decidedAt: now,
          decidedByUserId: adminUserId,
        },
      });

      // Update organisation verification status
      await tx.organisation.update({
        where: { id: verCase.organisationId },
        data: {
          verificationStatus: dto.decision as never,
          approvedAt: dto.decision === 'APPROVED' ? now : undefined,
          suspendedAt: dto.decision === 'SUSPENDED' ? now : undefined,
        },
      });

      await tx.auditEvent.create({
        data: {
          eventType: `VERIFICATION_${dto.decision}`,
          actorUserId: adminUserId,
          entityType: 'verification_cases',
          entityId: caseId,
          payload: {
            decision: dto.decision,
            reason: dto.reason,
            organisationId: verCase.organisationId,
          },
        },
      });

      // Notify organisation owner
      const membership = await tx.organisationMembership.findFirst({
        where: { organisationId: verCase.organisationId, isOwner: true },
      });
      if (membership) {
        await this.notifications.enqueue(tx, {
          recipientUserId: membership.userId,
          channel: NotificationChannel.IN_APP,
          eventType: `VERIFICATION_${dto.decision}`,
          payload: {
            orgId: verCase.organisationId,
            decision: dto.decision,
            reason: dto.reason,
          },
          idempotencyKey: `ver-decision-${caseId}-${dto.decision}`,
        });

        await this.notifications.enqueue(tx, {
          recipientUserId: membership.userId,
          channel: NotificationChannel.EMAIL,
          eventType: `VERIFICATION_${dto.decision}`,
          payload: {
            email: verCase.organisation.contactEmail ?? '',
            orgName: verCase.organisation.name,
            decision: dto.decision,
            reason: dto.reason,
          },
          idempotencyKey: `ver-decision-email-${caseId}-${dto.decision}`,
        });
      }

      return { caseId, decision: dto.decision, decidedAt: now };
    });
  }
}
