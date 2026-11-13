// All lifecycle enums — keep in sync with prisma/schema.prisma

export enum UserRole {
  APPLICANT = 'APPLICANT',
  EMPLOYER_STAFF = 'EMPLOYER_STAFF',
  PLATFORM_ADMIN = 'PLATFORM_ADMIN',
}

export enum OrgMemberRole {
  ORGANISATION_OWNER = 'ORGANISATION_OWNER',
  RECRUITER_HR = 'RECRUITER_HR',
  INTERNSHIP_COORDINATOR = 'INTERNSHIP_COORDINATOR',
  PRECEPTOR_SUPERVISOR = 'PRECEPTOR_SUPERVISOR',
  FINANCE_ADMIN = 'FINANCE_ADMIN',
  READ_ONLY = 'READ_ONLY',
}

export enum VerificationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  MEETING_REQUIRED = 'MEETING_REQUIRED',
  MEETING_SCHEDULED = 'MEETING_SCHEDULED',
  ADDITIONAL_INFORMATION_REQUIRED = 'ADDITIONAL_INFORMATION_REQUIRED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
  REVERIFICATION_REQUIRED = 'REVERIFICATION_REQUIRED',
  EXPIRED = 'EXPIRED',
}

export enum VacancyStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  PAUSED = 'PAUSED',
  CLOSED = 'CLOSED',
  FILLED = 'FILLED',
  ARCHIVED = 'ARCHIVED',
}

export enum AccommodationStatus {
  NOT_PROVIDED = 'NOT_PROVIDED',
  PROVIDED = 'PROVIDED',
  CONDITIONAL = 'CONDITIONAL',
  UNKNOWN = 'UNKNOWN',
}

export enum ApplicationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  SHORTLISTED = 'SHORTLISTED',
  INTERVIEWING = 'INTERVIEWING',
  WAITLISTED = 'WAITLISTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
  OFFERED = 'OFFERED',
  ACCEPTED = 'ACCEPTED',
  CLOSED_OTHER_OFFER_ACCEPTED = 'CLOSED_OTHER_OFFER_ACCEPTED',
  CLOSED_VACANCY = 'CLOSED_VACANCY',
  EXPIRED = 'EXPIRED',
}

export enum OfferStatus {
  DRAFT = 'DRAFT',
  ISSUED = 'ISSUED',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED',
  WITHDRAWN_BY_EMPLOYER = 'WITHDRAWN_BY_EMPLOYER',
  CANCELLED = 'CANCELLED',
}

export enum PlacementStatus {
  OFFER_ACCEPTED = 'OFFER_ACCEPTED',
  AWAITING_RESUMPTION = 'AWAITING_RESUMPTION',
  ACTIVE = 'ACTIVE',
  INTERRUPTED = 'INTERRUPTED',
  WITHDRAWAL_REQUESTED = 'WITHDRAWAL_REQUESTED',
  TERMINATED = 'TERMINATED',
  COMPLETED = 'COMPLETED',
}

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  IN_APP = 'IN_APP',
  PUSH = 'PUSH',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
}

export enum DocumentScanStatus {
  PENDING = 'PENDING',
  CLEAN = 'CLEAN',
  FLAGGED = 'FLAGGED',
}

export enum InterviewStageType {
  VERBAL_INTERVIEW = 'VERBAL_INTERVIEW',
  WRITTEN_ASSESSMENT = 'WRITTEN_ASSESSMENT',
  ADDITIONAL_STAGE = 'ADDITIONAL_STAGE',
  OTHER = 'OTHER',
}

export enum InterviewEventStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED',
  NO_SHOW = 'NO_SHOW',
}

/** Allowed transitions — enforced on the backend; included here for documentation */
export const APPLICATION_TRANSITIONS: Partial<Record<ApplicationStatus, ApplicationStatus[]>> = {
  [ApplicationStatus.DRAFT]: [ApplicationStatus.SUBMITTED, ApplicationStatus.WITHDRAWN],
  [ApplicationStatus.SUBMITTED]: [
    ApplicationStatus.UNDER_REVIEW,
    ApplicationStatus.WITHDRAWN,
    ApplicationStatus.CLOSED_VACANCY,
    ApplicationStatus.CLOSED_OTHER_OFFER_ACCEPTED,
    ApplicationStatus.EXPIRED,
  ],
  [ApplicationStatus.UNDER_REVIEW]: [
    ApplicationStatus.SHORTLISTED,
    ApplicationStatus.WAITLISTED,
    ApplicationStatus.REJECTED,
    ApplicationStatus.WITHDRAWN,
    ApplicationStatus.CLOSED_VACANCY,
    ApplicationStatus.CLOSED_OTHER_OFFER_ACCEPTED,
  ],
  [ApplicationStatus.SHORTLISTED]: [
    ApplicationStatus.INTERVIEWING,
    ApplicationStatus.WAITLISTED,
    ApplicationStatus.REJECTED,
    ApplicationStatus.OFFERED,
    ApplicationStatus.WITHDRAWN,
    ApplicationStatus.CLOSED_VACANCY,
    ApplicationStatus.CLOSED_OTHER_OFFER_ACCEPTED,
  ],
  [ApplicationStatus.INTERVIEWING]: [
    ApplicationStatus.SHORTLISTED,
    ApplicationStatus.WAITLISTED,
    ApplicationStatus.REJECTED,
    ApplicationStatus.OFFERED,
    ApplicationStatus.WITHDRAWN,
    ApplicationStatus.CLOSED_VACANCY,
    ApplicationStatus.CLOSED_OTHER_OFFER_ACCEPTED,
  ],
  [ApplicationStatus.OFFERED]: [
    ApplicationStatus.ACCEPTED,
    ApplicationStatus.WITHDRAWN,
    ApplicationStatus.CLOSED_OTHER_OFFER_ACCEPTED,
    ApplicationStatus.EXPIRED,
  ],
};
