import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { VacancyGateway } from '../vacancies/vacancy.gateway';
import { OrganisationsService } from '../organisations/organisations.service';
import { CreateOfferDto, IssueOfferDto, DeclineOfferDto, WithdrawOfferDto } from './dto/offer.dto';
import { NotificationChannel, OrgMemberRole } from '@pharmintern/shared-types';

// Platform offer deadline limits (OD-002 default)
const OFFER_MIN_DAYS = 2;
const OFFER_MAX_DAYS = 30;

// Active placement statuses — an applicant may not hold two simultaneously
const ACTIVE_PLACEMENT_STATUSES = [
  'OFFER_ACCEPTED', 'AWAITING_RESUMPTION', 'ACTIVE', 'INTERRUPTED',
];

// Active application statuses that should be closed on competing offer acceptance
const CLOSEABLE_APPLICATION_STATUSES = [
  'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED',
  'INTERVIEWING', 'WAITLISTED', 'OFFERED',
];

const EMPLOYER_WRITE_ROLES = [OrgMemberRole.ORGANISATION_OWNER, OrgMemberRole.RECRUITER_HR];
const EMPLOYER_READ_ROLES = [
  OrgMemberRole.ORGANISATION_OWNER, OrgMemberRole.RECRUITER_HR, OrgMemberRole.INTERNSHIP_COORDINATOR,
];

@Injectable()
export class OffersService {
  private readonly logger = new Logger(OffersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly gateway: VacancyGateway,
    private readonly orgsService: OrganisationsService,
  ) {}

  // ── Create offer draft ────────────────────────────────────────────────────

  async create(orgId: string, userId: string, dto: CreateOfferDto) {
    await this.orgsService.assertRole(orgId, userId, EMPLOYER_WRITE_ROLES);

    const app = await this.prisma.application.findUnique({
      where: { id: dto.applicationId },
      include: { vacancy: true },
    });
    if (!app) throw new NotFoundException('Application not found');
    if (app.vacancy.organisationId !== orgId) throw new ForbiddenException();

    if (!['SHORTLISTED', 'INTERVIEWING'].includes(app.status)) {
      throw new BadRequestException(
        'Application must be in SHORTLISTED or INTERVIEWING status to create an offer',
      );
    }

    // One outstanding offer per application
    const existing = await this.prisma.offer.findFirst({
      where: { applicationId: dto.applicationId, status: { in: ['DRAFT', 'ISSUED'] } },
    });
    if (existing) {
      throw new ConflictException('An active offer already exists for this application');
    }

    return this.prisma.offer.create({
      data: {
        applicationId: dto.applicationId,
        vacancyId: app.vacancy.id,
        applicantUserId: app.applicantUserId,
        organisationId: orgId,
        status: 'DRAFT',
        reportingDate: dto.reportingDate ? new Date(dto.reportingDate) : null,
        termsAndConditions: dto.termsAndConditions,
        remunerationInfo: dto.remunerationInfo,
        accommodationDetails: dto.accommodationDetails,
        versionNumber: 1,
      },
    });
  }

  // ── Issue offer — reserves a vacancy position ─────────────────────────────

  async issue(offerId: string, orgId: string, userId: string, dto: IssueOfferDto, idempotencyKey: string) {
    await this.orgsService.assertRole(orgId, userId, EMPLOYER_WRITE_ROLES);

    // Validate deadline window
    const deadline = new Date(dto.acceptanceDeadline);
    const now = new Date();
    const minDeadline = new Date(now.getTime() + OFFER_MIN_DAYS * 24 * 60 * 60 * 1000);
    const maxDeadline = new Date(now.getTime() + OFFER_MAX_DAYS * 24 * 60 * 60 * 1000);

    if (deadline < minDeadline) {
      throw new BadRequestException(
        `Acceptance deadline must be at least ${OFFER_MIN_DAYS} days from now`,
      );
    }
    if (deadline > maxDeadline) {
      throw new BadRequestException(
        `Acceptance deadline cannot exceed ${OFFER_MAX_DAYS} days from now`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // Lock the offer row
      const offer = await tx.offer.findUnique({ where: { id: offerId } });
      if (!offer) throw new NotFoundException('Offer not found');
      if (offer.organisationId !== orgId) throw new ForbiddenException();
      if (offer.status !== 'DRAFT') {
        throw new BadRequestException(`Cannot issue offer in status ${offer.status}`);
      }

      // Idempotency check
      const existingIssued = await tx.offer.findFirst({
        where: { applicationId: offer.applicationId, status: 'ISSUED' },
      });
      if (existingIssued) return existingIssued;

      // Lock vacancy and check capacity — TRANSACTION_RULES.md §2
      const vacancy = await tx.vacancy.findUnique({ where: { id: offer.vacancyId } });
      if (!vacancy) throw new NotFoundException('Vacancy not found');
      if (vacancy.status !== 'PUBLISHED') {
        throw new BadRequestException('Vacancy is not currently published');
      }

      const available = vacancy.totalPositions - vacancy.reservedPositions - vacancy.confirmedPositions;
      if (available <= 0) {
        throw new ConflictException({
          code: 'NO_CAPACITY',
          message: 'No positions available. Candidate may be waitlisted.',
        });
      }

      // Reserve a position
      await tx.vacancy.update({
        where: { id: vacancy.id },
        data: { reservedPositions: { increment: 1 } },
      });

      const issued = await tx.offer.update({
        where: { id: offerId },
        data: {
          status: 'ISSUED',
          acceptanceDeadline: deadline,
          issuedAt: now,
          issuedByUserId: userId,
          idempotencyKey,
        },
      });

      // Move application to OFFERED state
      await tx.application.update({
        where: { id: offer.applicationId },
        data: { status: 'OFFERED' },
      });

      await tx.auditEvent.create({
        data: {
          eventType: 'OFFER_ISSUED',
          actorUserId: userId,
          entityType: 'offers',
          entityId: offerId,
          payload: { vacancyId: vacancy.id, applicantUserId: offer.applicantUserId, deadline: deadline.toISOString() },
        },
      });

      // Notify applicant — AFTER commit via outbox
      await this.notifications.enqueue(tx, {
        recipientUserId: offer.applicantUserId,
        channel: NotificationChannel.IN_APP,
        eventType: 'OFFER_ISSUED',
        payload: {
          offerId,
          vacancyTitle: vacancy.title,
          orgId,
          deadline: deadline.toISOString(),
        },
        idempotencyKey: `offer-issued-inapp-${offerId}`,
      });

      // Broadcast vacancy counts
      const updatedVacancy = await tx.vacancy.findUnique({ where: { id: vacancy.id } });
      if (updatedVacancy) this.gateway.broadcastCounts(updatedVacancy);

      return issued;
    });
  }

  // ── Accept offer — THE CRITICAL ATOMIC TRANSACTION ────────────────────────
  // Implements TRANSACTION_RULES.md §1 exactly.

  async accept(offerId: string, applicantUserId: string, idempotencyKey: string) {
    // Global idempotency check before entering transaction
    const alreadyProcessed = await this.prisma.offer.findFirst({
      where: { id: offerId, status: 'ACCEPTED', idempotencyKey },
    });
    if (alreadyProcessed) {
      const placement = await this.prisma.placement.findUnique({
        where: { offerId },
      });
      return { offerId, placementId: placement?.id, status: 'ACCEPTED', duplicate: true };
    }

    return this.prisma.$transaction(
      async (tx) => {
        // ── Step 1: Lock the offer ──────────────────────────────────────────
        const offer = await tx.offer.findUnique({ where: { id: offerId } });
        if (!offer) throw new NotFoundException('Offer not found');

        // ── Step 2: Pre-condition validations ──────────────────────────────

        // 2a. Offer must be ISSUED
        if (offer.status !== 'ISSUED') {
          throw new ConflictException({ code: 'INVALID_TRANSITION', message: `Offer is ${offer.status}` });
        }

        // 2b. Requesting user must be the offer's applicant
        if (offer.applicantUserId !== applicantUserId) {
          throw new ForbiddenException('This offer does not belong to you');
        }

        // 2c. Acceptance deadline must not have passed
        if (offer.acceptanceDeadline && offer.acceptanceDeadline < new Date()) {
          throw new ConflictException({ code: 'OFFER_EXPIRED', message: 'The acceptance deadline has passed' });
        }

        // 2d. Applicant must not already have an active placement
        const activePlacement = await tx.placement.findFirst({
          where: {
            applicantUserId,
            status: { in: ACTIVE_PLACEMENT_STATUSES as never[] },
          },
        });
        if (activePlacement) {
          throw new ConflictException({
            code: 'ALREADY_PLACED',
            message: 'You already have an active placement. Accept or manage that placement before accepting another offer.',
          });
        }

        // ── Step 3: Lock the vacancy and validate reservation ───────────────
        const vacancy = await tx.vacancy.findUnique({ where: { id: offer.vacancyId } });
        if (!vacancy) throw new NotFoundException('Vacancy not found');

        // The offer holds a reservation — reserved_positions must be >= 1
        if (vacancy.reservedPositions < 1) {
          throw new ConflictException({ code: 'NO_CAPACITY', message: 'Reservation integrity error' });
        }

        // ── Step 4: Accept the offer and convert reservation to confirmed ───
        await tx.offer.update({
          where: { id: offerId },
          data: {
            status: 'ACCEPTED',
            decidedAt: new Date(),
            decidedByUserId: applicantUserId,
            idempotencyKey,
          },
        });

        await tx.vacancy.update({
          where: { id: vacancy.id },
          data: {
            reservedPositions: { decrement: 1 },
            confirmedPositions: { increment: 1 },
          },
        });

        // ── Step 5: Create placement record ────────────────────────────────
        const placement = await tx.placement.create({
          data: {
            offerId,
            applicationId: offer.applicationId,
            applicantUserId,
            organisationId: offer.organisationId,
            vacancyId: offer.vacancyId,
            status: 'OFFER_ACCEPTED',
            reportingDate: offer.reportingDate,
          },
        });

        // ── Step 6: Mark accepted application as ACCEPTED ──────────────────
        await tx.application.update({
          where: { id: offer.applicationId },
          data: { status: 'ACCEPTED' },
        });

        // ── Step 7 & 8: Close all other active applications and offers ──────
        // Find all other ISSUED offers for this applicant
        const otherIssuedOffers = await tx.offer.findMany({
          where: {
            applicantUserId,
            id: { not: offerId },
            status: 'ISSUED',
          },
          select: { id: true, vacancyId: true, applicationId: true },
        });

        const closedApplicationIds: string[] = [];
        const declinedOfferIds: string[] = [];

        for (const otherOffer of otherIssuedOffers) {
          // Decline the competing offer
          await tx.offer.update({
            where: { id: otherOffer.id },
            data: { status: 'DECLINED', decidedAt: new Date() },
          });
          declinedOfferIds.push(otherOffer.id);

          // Release the reservation on the competing vacancy
          await tx.vacancy.update({
            where: { id: otherOffer.vacancyId },
            data: { reservedPositions: { decrement: 1 } },
          });

          // Close the associated application
          await tx.application.update({
            where: { id: otherOffer.applicationId },
            data: { status: 'CLOSED_OTHER_OFFER_ACCEPTED' },
          });
          closedApplicationIds.push(otherOffer.applicationId);
        }

        // Close all remaining active applications (no issued offer) for this applicant
        const otherActiveApps = await tx.application.findMany({
          where: {
            applicantUserId,
            id: { not: offer.applicationId },
            status: { in: CLOSEABLE_APPLICATION_STATUSES as never[] },
          },
          select: { id: true },
        });

        for (const otherApp of otherActiveApps) {
          if (!closedApplicationIds.includes(otherApp.id)) {
            await tx.application.update({
              where: { id: otherApp.id },
              data: { status: 'CLOSED_OTHER_OFFER_ACCEPTED' },
            });
            closedApplicationIds.push(otherApp.id);
          }
        }

        // ── Step 9: Write audit event ───────────────────────────────────────
        await tx.auditEvent.create({
          data: {
            eventType: 'OFFER_ACCEPTED',
            actorUserId: applicantUserId,
            entityType: 'offers',
            entityId: offerId,
            payload: {
              placementId: placement.id,
              vacancyId: offer.vacancyId,
              closedApplicationIds,
              declinedOfferIds,
            },
          },
        });

        // ── Step 10: Queue notifications via outbox (committed with transaction) ──
        // Notify applicant of acceptance
        await this.notifications.enqueue(tx, {
          recipientUserId: applicantUserId,
          channel: NotificationChannel.IN_APP,
          eventType: 'OFFER_ACCEPTED',
          payload: { offerId, placementId: placement.id, orgId: offer.organisationId },
          idempotencyKey: `offer-accepted-inapp-${offerId}`,
        });

        await this.notifications.enqueue(tx, {
          recipientUserId: applicantUserId,
          channel: NotificationChannel.EMAIL,
          eventType: 'OFFER_ACCEPTED',
          payload: { offerId, placementId: placement.id, orgId: offer.organisationId },
          idempotencyKey: `offer-accepted-email-${offerId}`,
        });

        // Notify accepting employer
        const acceptingMembership = await tx.organisationMembership.findFirst({
          where: { organisationId: offer.organisationId, isOwner: true },
        });
        if (acceptingMembership) {
          await this.notifications.enqueue(tx, {
            recipientUserId: acceptingMembership.userId,
            channel: NotificationChannel.IN_APP,
            eventType: 'OFFER_ACCEPTED_BY_APPLICANT',
            payload: { offerId, applicantUserId, vacancyId: offer.vacancyId },
            idempotencyKey: `offer-accepted-employer-inapp-${offerId}`,
          });
        }

        // Notify affected competing employers
        for (const declinedId of declinedOfferIds) {
          const declinedOffer = await tx.offer.findUnique({
            where: { id: declinedId },
            select: { organisationId: true },
          });
          if (declinedOffer) {
            const competingMembership = await tx.organisationMembership.findFirst({
              where: { organisationId: declinedOffer.organisationId, isOwner: true },
            });
            if (competingMembership) {
              await this.notifications.enqueue(tx, {
                recipientUserId: competingMembership.userId,
                channel: NotificationChannel.IN_APP,
                eventType: 'COMPETING_OFFER_DECLINED',
                payload: { declinedOfferId: declinedId },
                idempotencyKey: `competing-declined-inapp-${declinedId}-${offerId}`,
              });
            }
          }
        }

        // Fetch updated vacancy for WS broadcast
        const updatedVacancy = await tx.vacancy.findUnique({ where: { id: vacancy.id } });

        // Return result
        return {
          offerId,
          placementId: placement.id,
          status: 'ACCEPTED' as const,
          closedApplications: closedApplicationIds.map((id) => ({
            applicationId: id,
            reason: 'CLOSED_OTHER_OFFER_ACCEPTED',
          })),
          declinedOffers: declinedOfferIds.map((id) => ({ offerId: id })),
          _vacancyForBroadcast: updatedVacancy,
        };
      },
      {
        // Use Serializable isolation to prevent concurrent acceptance races
        isolationLevel: 'Serializable',
        timeout: 10000,
      },
    ).then((result) => {
      // Post-commit: broadcast vacancy counts (WS is outside the transaction)
      if (result._vacancyForBroadcast) {
        this.gateway.broadcastCounts(result._vacancyForBroadcast);
      }
      // Strip internal field before returning to client
      const { _vacancyForBroadcast: _, ...clientResult } = result;
      return clientResult;
    });
  }

  // ── Decline offer ─────────────────────────────────────────────────────────
  // TRANSACTION_RULES.md §4

  async decline(offerId: string, applicantUserId: string, dto: DeclineOfferDto) {
    return this.prisma.$transaction(async (tx) => {
      const offer = await tx.offer.findUnique({ where: { id: offerId } });
      if (!offer) throw new NotFoundException('Offer not found');
      if (offer.applicantUserId !== applicantUserId) throw new ForbiddenException();
      if (offer.status !== 'ISSUED') {
        throw new BadRequestException(`Cannot decline offer in status ${offer.status}`);
      }

      await tx.offer.update({
        where: { id: offerId },
        data: { status: 'DECLINED', decidedAt: new Date(), decidedByUserId: applicantUserId },
      });

      // Release reservation
      await tx.vacancy.update({
        where: { id: offer.vacancyId },
        data: { reservedPositions: { decrement: 1 } },
      });

      await tx.application.update({
        where: { id: offer.applicationId },
        data: { status: 'INTERVIEWING' }, // Return to interviewing state
      });

      await tx.auditEvent.create({
        data: {
          eventType: 'OFFER_DECLINED',
          actorUserId: applicantUserId,
          entityType: 'offers',
          entityId: offerId,
          payload: { reason: dto.reason, vacancyId: offer.vacancyId },
        },
      });

      await this.notifications.enqueue(tx, {
        recipientUserId: offer.applicantUserId,
        channel: NotificationChannel.IN_APP,
        eventType: 'OFFER_DECLINED_CONFIRMATION',
        payload: { offerId },
        idempotencyKey: `offer-declined-inapp-${offerId}`,
      });

      // Notify employer
      const membership = await tx.organisationMembership.findFirst({
        where: { organisationId: offer.organisationId, isOwner: true },
      });
      if (membership) {
        await this.notifications.enqueue(tx, {
          recipientUserId: membership.userId,
          channel: NotificationChannel.IN_APP,
          eventType: 'OFFER_DECLINED_BY_APPLICANT',
          payload: { offerId, vacancyId: offer.vacancyId },
          idempotencyKey: `offer-declined-employer-inapp-${offerId}`,
        });
      }

      const updatedVacancy = await tx.vacancy.findUnique({ where: { id: offer.vacancyId } });
      if (updatedVacancy) this.gateway.broadcastCounts(updatedVacancy);

      return { offerId, status: 'DECLINED' };
    });
  }

  // ── Withdraw offer (employer) ─────────────────────────────────────────────

  async withdraw(offerId: string, orgId: string, userId: string, dto: WithdrawOfferDto) {
    await this.orgsService.assertRole(orgId, userId, EMPLOYER_WRITE_ROLES);

    return this.prisma.$transaction(async (tx) => {
      const offer = await tx.offer.findUnique({ where: { id: offerId } });
      if (!offer) throw new NotFoundException('Offer not found');
      if (offer.organisationId !== orgId) throw new ForbiddenException();
      if (offer.status !== 'ISSUED') {
        throw new BadRequestException(`Cannot withdraw offer in status ${offer.status}`);
      }

      await tx.offer.update({
        where: { id: offerId },
        data: { status: 'WITHDRAWN_BY_EMPLOYER', decidedAt: new Date(), decidedByUserId: userId },
      });

      await tx.vacancy.update({
        where: { id: offer.vacancyId },
        data: { reservedPositions: { decrement: 1 } },
      });

      await tx.application.update({
        where: { id: offer.applicationId },
        data: { status: 'INTERVIEWING' },
      });

      await tx.auditEvent.create({
        data: {
          eventType: 'OFFER_WITHDRAWN',
          actorUserId: userId,
          entityType: 'offers',
          entityId: offerId,
          payload: { reason: dto.reason },
        },
      });

      await this.notifications.enqueue(tx, {
        recipientUserId: offer.applicantUserId,
        channel: NotificationChannel.IN_APP,
        eventType: 'OFFER_WITHDRAWN_BY_EMPLOYER',
        payload: { offerId, reason: dto.reason },
        idempotencyKey: `offer-withdrawn-inapp-${offerId}`,
      });

      const updatedVacancy = await tx.vacancy.findUnique({ where: { id: offer.vacancyId } });
      if (updatedVacancy) this.gateway.broadcastCounts(updatedVacancy);

      return { offerId, status: 'WITHDRAWN_BY_EMPLOYER' };
    });
  }

  // ── List offers ───────────────────────────────────────────────────────────

  async listMine(applicantUserId: string, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.prisma.offer.findMany({
        where: { applicantUserId },
        include: {
          vacancy: { select: { id: true, title: true } },
          organisation: { select: { id: true, name: true } },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.offer.count({ where: { applicantUserId } }),
    ]);
    return { data: items, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async getForApplicant(offerId: string, applicantUserId: string) {
    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId },
      include: {
        vacancy: { select: { id: true, title: true } },
        organisation: { select: { id: true, name: true } },
      },
    });
    if (!offer || offer.applicantUserId !== applicantUserId) {
      throw new NotFoundException('Offer not found');
    }
    return offer;
  }

  async listForVacancy(vacancyId: string, orgId: string, userId: string) {
    await this.orgsService.assertRole(orgId, userId, EMPLOYER_READ_ROLES);
    const vacancy = await this.prisma.vacancy.findFirst({ where: { id: vacancyId, organisationId: orgId } });
    if (!vacancy) throw new NotFoundException('Vacancy not found');

    return this.prisma.offer.findMany({
      where: { vacancyId },
      include: {
        application: { select: { id: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── Offer expiry background worker ────────────────────────────────────────
  // TRANSACTION_RULES.md §3

  @Cron(process.env['OFFER_EXPIRY_CRON'] ?? '*/5 * * * *')
  async processExpiredOffers() {
    const now = new Date();

    // Fetch in batches; SKIP LOCKED equivalent via unique processing
    const expiredOffers = await this.prisma.offer.findMany({
      where: {
        status: 'ISSUED',
        acceptanceDeadline: { lt: now },
      },
      select: { id: true, vacancyId: true, applicantUserId: true, organisationId: true, applicationId: true },
      take: 50,
    });

    for (const offer of expiredOffers) {
      try {
        await this.prisma.$transaction(async (tx) => {
          // Re-check inside transaction — acceptance may have raced
          const locked = await tx.offer.findUnique({ where: { id: offer.id } });
          if (!locked || locked.status !== 'ISSUED') return; // Already handled

          await tx.offer.update({
            where: { id: offer.id },
            data: { status: 'EXPIRED', decidedAt: now },
          });

          await tx.vacancy.update({
            where: { id: offer.vacancyId },
            data: { reservedPositions: { decrement: 1 } },
          });

          await tx.application.update({
            where: { id: offer.applicationId },
            data: { status: 'EXPIRED' },
          });

          await tx.auditEvent.create({
            data: {
              eventType: 'OFFER_EXPIRED',
              actorUserId: null,
              entityType: 'offers',
              entityId: offer.id,
              payload: { vacancyId: offer.vacancyId, applicantUserId: offer.applicantUserId },
            },
          });

          await this.notifications.enqueue(tx, {
            recipientUserId: offer.applicantUserId,
            channel: NotificationChannel.IN_APP,
            eventType: 'OFFER_EXPIRED',
            payload: { offerId: offer.id },
            idempotencyKey: `offer-expired-inapp-${offer.id}`,
          });

          const membership = await tx.organisationMembership.findFirst({
            where: { organisationId: offer.organisationId, isOwner: true },
          });
          if (membership) {
            await this.notifications.enqueue(tx, {
              recipientUserId: membership.userId,
              channel: NotificationChannel.IN_APP,
              eventType: 'OFFER_EXPIRED_EMPLOYER',
              payload: { offerId: offer.id, vacancyId: offer.vacancyId },
              idempotencyKey: `offer-expired-employer-inapp-${offer.id}`,
            });
          }

          const updatedVacancy = await tx.vacancy.findUnique({ where: { id: offer.vacancyId } });
          if (updatedVacancy) this.gateway.broadcastCounts(updatedVacancy);
        });
      } catch (err) {
        this.logger.error(`Failed to expire offer ${offer.id}`, err);
      }
    }

    if (expiredOffers.length > 0) {
      this.logger.log(`Expired ${expiredOffers.length} offer(s)`);
    }
  }
}
