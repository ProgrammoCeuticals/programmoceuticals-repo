// Lightweight entity DTOs for use in web/mobile clients.
// These match the shapes returned by the API, not full Prisma models.

import {
  UserRole,
  OrgMemberRole,
  VerificationStatus,
  VacancyStatus,
  AccommodationStatus,
  ApplicationStatus,
  OfferStatus,
  PlacementStatus,
} from './enums';

export interface UserDto {
  id: string;
  email: string;
  role: UserRole;
  emailVerifiedAt: string | null;
  createdAt: string;
}

export interface ApplicantProfileDto {
  id: string;
  userId: string;
  fullName: string;
  phone: string | null;
  university: string | null;
  graduationYear: number | null;
  shortBio: string | null;
  accommodationPref: string | null;
  updatedAt: string;
}

export interface OrganisationDto {
  id: string;
  name: string;
  typeId: string | null;
  website: string | null;
  contactName: string | null;
  contactEmail: string | null;
  verificationStatus: VerificationStatus;
  approvedAt: string | null;
  createdAt: string;
}

export interface OrganisationLocationDto {
  id: string;
  organisationId: string;
  name: string;
  addressLine1: string | null;
  city: string | null;
  stateId: string | null;
  isPrimary: boolean;
  verificationStatus: VerificationStatus;
}

export interface OrgMemberDto {
  id: string;
  userId: string;
  email: string;
  fullName: string | null;
  roles: OrgMemberRole[];
  isOwner: boolean;
  locationId: string | null;
  acceptedAt: string | null;
}

export interface VacancyDto {
  id: string;
  organisationId: string;
  locationId: string | null;
  title: string;
  description: string | null;
  status: VacancyStatus;
  totalPositions: number;
  availablePositions: number;
  applicationOpenDate: string | null;
  applicationDeadline: string | null;
  expectedStartDate: string | null;
  accommodationStatus: AccommodationStatus;
  accommodationDetails: string | null;
  remunerationInfo: string | null;
  practiceAreas: PracticeAreaDto[];
  formVersion: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PracticeAreaDto {
  id: string;
  name: string;
  displayOrder: number;
}

export interface ApplicationDto {
  id: string;
  vacancyId: string;
  applicantUserId: string;
  status: ApplicationStatus;
  submittedAt: string | null;
  formVersionSnapshot: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface OfferDto {
  id: string;
  applicationId: string;
  vacancyId: string;
  organisationId: string;
  status: OfferStatus;
  reportingDate: string | null;
  acceptanceDeadline: string | null;
  remunerationInfo: string | null;
  accommodationDetails: string | null;
  versionNumber: number;
  issuedAt: string | null;
  decidedAt: string | null;
  createdAt: string;
}

export interface PlacementDto {
  id: string;
  offerId: string;
  applicationId: string;
  applicantUserId: string;
  organisationId: string;
  locationId: string | null;
  vacancyId: string;
  status: PlacementStatus;
  reportingDate: string | null;
  expectedEndDate: string | null;
  actualEndDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InAppNotificationDto {
  id: string;
  eventType: string;
  title: string | null;
  body: string | null;
  linkUrl: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

// ─── WebSocket event payloads ─────────────────────────────────────────────────

export interface WsVacancyCountsEvent {
  event: 'vacancy.counts.updated';
  data: {
    vacancyId: string;
    totalPositions: number;
    reservedPositions: number;
    confirmedPositions: number;
    availablePositions: number;
  };
}

export interface WsApplicationStatusEvent {
  event: 'application.status.updated';
  data: {
    applicationId: string;
    status: ApplicationStatus;
  };
}

export interface WsOfferStatusEvent {
  event: 'offer.status.updated';
  data: {
    offerId: string;
    status: OfferStatus;
  };
}

export interface WsNewNotificationEvent {
  event: 'notification.new';
  data: {
    notificationId: string;
    title: string | null;
    eventType: string;
  };
}
