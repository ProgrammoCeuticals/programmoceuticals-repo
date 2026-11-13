export type UserRole = 'applicant' | 'assessor' | 'admin' | 'super_admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  activeAssignmentCount?: number;
}

export type ApplicationStatus =
  | 'draft' | 'submitted' | 'under_admin_screening'
  | 'compliance_directive_issued' | 'resubmitted_after_compliance_directive'
  | 'classified' | 'assigned_first_assessor' | 'first_assessment_ongoing'
  | 'first_assessment_reverted' | 'assigned_second_assessor'
  | 'second_assessment_ongoing' | 'second_assessment_reverted'
  | 'awaiting_final_decision' | 'finalized' | 'archived';

export type ReviewStatus = 'Pending' | 'Ongoing' | 'Completed';
export type FinalDecision = 'CD' | 'Approved' | 'Rejected';

export interface Application {
  id: string;
  applicantUserId: string;
  applicantProfileId?: string;
  applicationNo: string;
  productName: string;
  strength?: string;
  dosageForm?: string;
  strengthAndDosageForm?: string;
  currentStatus: ApplicationStatus;
  reviewStatus: ReviewStatus;
  finalDecision?: FinalDecision;
  finalDecisionDate?: string;
  finalDecisionNote?: string;
  finalDecisionBy?: string;
  submittedAt?: string;
  resubmittedAt?: string;
  finalizedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BEChecklist {
  id: string;
  applicationId: string;
  hasReadGeneralInstructions: boolean;
  certifiedInformationIsTrue: boolean;
  signedOnBehalfOf?: string;
  signatoryNameAndTitle?: string;
  certificationDate?: string;
  studyProtocolNumber?: string;
  studyTitle?: string;
  bioanalyticalStudyStartDate?: string;
  bioanalyticalStudyEndDate?: string;
  clinicalStudySiteName?: string;
  clinicalStudySiteAddress?: string;
  bioanalyticalStudySiteName?: string;
  bioanalyticalStudySiteAddress?: string;
  ethicsCommitteeName?: string;
  ethicsCommitteeAddress?: string;
  studyProtocolApprovalDate?: string;
  approvedStudyProtocolNumberAndVersion?: string;
  informedConsentApprovalDate?: string;
  testProductName?: string;
  testProductStrength?: string;
  testProductSameStrengthAsRegistrationProduct?: boolean;
  testProductSameStrengthComment?: string;
  testProductDosageForm?: string;
  testProductBatchNumber?: string;
  testProductBatchSize?: string;
  testProductManufactureDate?: string;
  testProductExpiryDate?: string;
  apiManufacturingSiteNameAndAddress?: string;
  testProductManufacturingSiteNameAndAddress?: string;
  testProductSameCompositionAsRegistrationProduct?: boolean;
  testProductSameCompositionComment?: string;
  referenceProductName?: string;
  referenceProductStrength?: string;
  referenceProductDosageForm?: string;
  referenceProductBatchNumber?: string;
  referenceProductExpiryDate?: string;
  referenceProductSourceCountry?: string;
  referenceProductManufacturingSiteNameAndAddress?: string;
  referenceProductSameAsWhoComparator?: boolean;
  referenceProductComparatorComment?: string;
  biowaiverOfAdditionalStrengthApplicable?: boolean;
}

export interface BEStudyPeriod {
  id: string;
  checklistId: string;
  applicationId: string;
  periodLabel: string;
  startDate?: string;
  endDate?: string;
  sortOrder: number;
}

export interface BESummaryResult {
  id: string;
  checklistId: string;
  applicationId: string;
  parameter: string;
  logarithmicTransformedData?: string;
  testGeometricMean?: string;
  referenceGeometricMean?: string;
  percentageRatioGeometricMeans?: string;
  confidenceIntervalLower?: string;
  confidenceIntervalUpper?: string;
  intraSubjectCoefficientVariationIscv?: string;
  sortOrder: number;
}

export interface SectionBDocumentReference {
  id: string;
  checklistId: string;
  applicationId: string;
  itemNumber: number;
  documentTitle: string;
  nameOfDocumentAndLocation?: string;
  isApplicable: boolean;
  applicantRemark?: string;
  sortOrder: number;
}

export interface ComplianceDirective {
  id: string;
  applicationId: string;
  directiveNumber: string;
  title: string;
  issuedByUserId: string;
  issuedToUserId: string;
  affectedSections: string[];
  directiveMessage: string;
  requiredCorrections?: string;
  dueDate?: string;
  status: 'open' | 'responded' | 'closed' | 'cancelled';
  issuedAt: string;
  closedAt?: string;
}

export interface ProductClassification {
  id: string;
  applicationId: string;
  therapeuticIndexClass?: string;
  bcsClass?: string;
  pharmacologicalClass?: string;
  localOrForeign?: string;
  productCategory?: string;
  biowaiverRelevance?: string;
  classificationSource?: string;
  classificationNote?: string;
  classifiedByUserId?: string;
  classifiedAt?: string;
}

export interface AssessorAssignment {
  id: string;
  applicationId: string;
  assessorUserId: string;
  assessmentStage: 'first_assessment' | 'second_assessment';
  assignedByUserId: string;
  assignedAt: string;
  dueDate?: string;
  assignmentNote?: string;
  reasonForSecondAssessment?: string;
  status: 'assigned' | 'ongoing' | 'reverted' | 'completed' | 'cancelled' | 'reassigned';
  startedAt?: string;
  revertedAt?: string;
  completedAt?: string;
}

export interface AssessorReport {
  id: string;
  applicationId: string;
  assessorAssignmentId: string;
  assessorUserId: string;
  assessmentStage: string;
  reportTitle: string;
  fileName: string;
  fileUrl: string;
  fileMimeType?: string;
  fileSize?: number;
  uploadedAt: string;
}

export interface AssessorComment {
  id: string;
  applicationId: string;
  assessorAssignmentId: string;
  assessorUserId: string;
  assessmentStage: string;
  recommendation: string;
  comment: string;
  submittedAt: string;
}

export interface Notification {
  id: string;
  applicationId?: string;
  userId: string;
  title: string;
  message: string;
  readAt?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  applicationId?: string;
  actorUserId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface LookupItem {
  id: string;
  type: string;
  label: string;
  value: string;
  description?: string;
  metadata: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
}
