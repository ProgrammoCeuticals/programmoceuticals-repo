import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { OrganisationsService } from '../organisations/organisations.service';
import {
  CreateInterviewStageDto,
  ScheduleInterviewEventDto,
  UpdateInterviewEventDto,
  RecordInterviewOutcomeDto,
} from './dto/interview.dto';
import { NotificationChannel, OrgMemberRole } from '@pharmintern/shared-types';

const EMPLOYER_WRITE_ROLES = [OrgMemberRole.ORGANISATION_OWNER, OrgMemberRole.RECRUITER_HR];

@Injectable()
export class InterviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly orgsService: OrganisationsService,
  ) {}

  // ── Stages ────────────────────────────────────────────────────────────────

  async createStage(vacancyId: string, orgId: string, userId: string, dto: CreateInterviewStageDto) {
    await this.orgsService.assertRole(orgId, userId, EMPLOYER_WRITE_ROLES);
    await this.assertOrgOwnsVacancy(vacancyId, orgId);

    return this.prisma.interviewStage.create({
      data: {
        vacancyId,
        name: dto.name,
        stageType: dto.stageType,
        stageOrder: dto.stageOrder ?? 0,
        description: dto.description,
      },
    });
  }

  async listStages(vacancyId: string) {
    return this.prisma.interviewStage.findMany({
      where: { vacancyId },
      orderBy: { stageOrder: 'asc' },
    });
  }

  // ── Events ────────────────────────────────────────────────────────────────

  async scheduleEvent(
    applicationId: string,
    orgId: string,
    userId: string,
    dto: ScheduleInterviewEventDto,
  ) {
    await this.orgsService.assertRole(orgId, userId, EMPLOYER_WRITE_ROLES);
    const { app, vacancy } = await this.assertOrgOwnsApplication(applicationId, orgId);

    if (!['SHORTLISTED', 'INTERVIEWING'].includes(app.status)) {
      throw new BadRequestException(
        'Application must be SHORTLISTED or INTERVIEWING to schedule an interview',
      );
    }

    const stage = await this.prisma.interviewStage.findFirst({
      where: { id: dto.stageId, vacancyId: app.vacancyId },
    });
    if (!stage) throw new NotFoundException('Interview stage not found for this vacancy');

    return this.prisma.$transaction(async (tx) => {
      const event = await tx.interviewEvent.create({
        data: {
          applicationId,
          stageId: dto.stageId,
          scheduledAt: new Date(dto.scheduledAt),
          timezone: dto.timezone ?? 'Africa/Lagos',
          format: dto.format,
          locationOrLink: dto.locationOrLink,
          candidateInstructions: dto.candidateInstructions,
          status: 'SCHEDULED',
          scheduledByUserId: userId,
        },
      });

      // Move application to INTERVIEWING if not already
      if (app.status === 'SHORTLISTED') {
        await tx.application.update({
          where: { id: applicationId },
          data: { status: 'INTERVIEWING' },
        });
      }

      await tx.auditEvent.create({
        data: {
          eventType: 'INTERVIEW_SCHEDULED',
          actorUserId: userId,
          entityType: 'interview_events',
          entityId: event.id,
          payload: { applicationId, stageId: dto.stageId, scheduledAt: dto.scheduledAt },
        },
      });

      // Notify applicant
      await this.notifications.enqueue(tx, {
        recipientUserId: app.applicantUserId,
        channel: NotificationChannel.IN_APP,
        eventType: 'INTERVIEW_INVITATION',
        payload: {
          applicationId,
          interviewEventId: event.id,
          vacancyTitle: vacancy.title,
          scheduledAt: dto.scheduledAt,
          format: dto.format ?? '',
          locationOrLink: dto.locationOrLink ?? '',
          candidateInstructions: dto.candidateInstructions ?? '',
        },
      });

      return event;
    });
  }

  async updateEvent(
    applicationId: string,
    eventId: string,
    orgId: string,
    userId: string,
    dto: UpdateInterviewEventDto,
  ) {
    await this.orgsService.assertRole(orgId, userId, EMPLOYER_WRITE_ROLES);
    const { app, vacancy } = await this.assertOrgOwnsApplication(applicationId, orgId);

    const event = await this.prisma.interviewEvent.findFirst({
      where: { id: eventId, applicationId },
    });
    if (!event) throw new NotFoundException('Interview event not found');

    const isReschedule = dto.scheduledAt && dto.scheduledAt !== event.scheduledAt.toISOString();
    const isCancel = dto.status === 'CANCELLED';

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.interviewEvent.update({
        where: { id: eventId },
        data: {
          status: dto.status ?? (isReschedule ? 'RESCHEDULED' : undefined),
          scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
          locationOrLink: dto.locationOrLink,
          candidateInstructions: dto.candidateInstructions,
        },
      });

      await tx.auditEvent.create({
        data: {
          eventType: isCancel ? 'INTERVIEW_CANCELLED' : isReschedule ? 'INTERVIEW_RESCHEDULED' : 'INTERVIEW_UPDATED',
          actorUserId: userId,
          entityType: 'interview_events',
          entityId: eventId,
          payload: { applicationId, reason: dto.rescheduleReason },
        },
      });

      // Notify applicant of reschedule or cancellation
      if (isCancel || isReschedule) {
        await this.notifications.enqueue(tx, {
          recipientUserId: app.applicantUserId,
          channel: NotificationChannel.IN_APP,
          eventType: isCancel ? 'INTERVIEW_CANCELLED' : 'INTERVIEW_RESCHEDULED',
          payload: {
            applicationId,
            interviewEventId: eventId,
            vacancyTitle: vacancy.title,
            reason: dto.rescheduleReason ?? '',
          },
        });
      }

      return updated;
    });
  }

  async recordOutcome(
    applicationId: string,
    eventId: string,
    orgId: string,
    userId: string,
    dto: RecordInterviewOutcomeDto,
  ) {
    await this.orgsService.assertRole(orgId, userId, EMPLOYER_WRITE_ROLES);
    await this.assertOrgOwnsApplication(applicationId, orgId);

    const event = await this.prisma.interviewEvent.findFirst({
      where: { id: eventId, applicationId },
    });
    if (!event) throw new NotFoundException('Interview event not found');

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.interviewEvent.update({
        where: { id: eventId },
        data: {
          status: 'COMPLETED',
          outcome: dto.outcome,
          outcomeNotes: dto.outcomeNotes ?? null,
        },
      });

      await tx.auditEvent.create({
        data: {
          eventType: 'INTERVIEW_OUTCOME_RECORDED',
          actorUserId: userId,
          entityType: 'interview_events',
          entityId: eventId,
          payload: { outcome: dto.outcome, applicationId },
        },
      });

      return updated;
    });
  }

  async listForApplication(applicationId: string, requestingUserId: string, isEmployer: boolean, orgId?: string) {
    if (isEmployer && orgId) {
      await this.orgsService.assertRole(orgId, requestingUserId, [
        OrgMemberRole.ORGANISATION_OWNER, OrgMemberRole.RECRUITER_HR,
        OrgMemberRole.INTERNSHIP_COORDINATOR,
      ]);
    } else {
      // Applicant — verify it's their application
      const app = await this.prisma.application.findUnique({ where: { id: applicationId } });
      if (!app || app.applicantUserId !== requestingUserId) {
        throw new NotFoundException('Application not found');
      }
    }

    const events = await this.prisma.interviewEvent.findMany({
      where: { applicationId },
      include: { stage: true },
      orderBy: { scheduledAt: 'asc' },
    });

    // Strip internal outcome notes from applicant view
    if (!isEmployer) {
      return events.map((e) => ({ ...e, outcomeNotes: undefined }));
    }

    return events;
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private async assertOrgOwnsVacancy(vacancyId: string, orgId: string) {
    const v = await this.prisma.vacancy.findFirst({ where: { id: vacancyId, organisationId: orgId } });
    if (!v) throw new NotFoundException('Vacancy not found');
    return v;
  }

  private async assertOrgOwnsApplication(applicationId: string, orgId: string) {
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { vacancy: { select: { organisationId: true, title: true } } },
    });
    if (!app || app.vacancy.organisationId !== orgId) throw new NotFoundException('Application not found');
    return { app, vacancy: app.vacancy };
  }
}
