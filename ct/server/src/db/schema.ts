import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const USER_ROLES = ["applicant", "assessor", "admin", "super_admin"] as const;
const APPLICATION_STATUSES = [
  "draft",
  "submitted",
  "under_admin_screening",
  "compliance_directive_issued",
  "resubmitted_after_compliance_directive",
  "classified",
  "assigned_first_assessor",
  "first_assessment_ongoing",
  "first_assessment_reverted",
  "assigned_second_assessor",
  "second_assessment_ongoing",
  "second_assessment_reverted",
  "awaiting_final_decision",
  "finalized",
  "archived",
] as const;
const REVIEW_STATUSES = ["Pending", "Ongoing", "Completed"] as const;
const FINAL_DECISIONS = ["CD", "Approved", "Rejected"] as const;
const DIRECTIVE_STATUSES = ["open", "responded", "closed", "cancelled"] as const;
const ASSESSMENT_STAGES = ["first_assessment", "second_assessment"] as const;
const ASSIGNMENT_STATUSES = ["assigned", "ongoing", "reverted", "completed", "cancelled", "reassigned"] as const;
const THERAPEUTIC_INDEX_CLASSES = ["NTI", "Non-NTI", "Mixed", "Unknown"] as const;
const BCS_CLASSES = ["Class I", "Class II", "Class III", "Class IV", "Unknown", "Not Applicable"] as const;
const ASSESSOR_RECOMMENDATIONS = [
  "recommend_approval",
  "recommend_compliance_directive",
  "recommend_rejection",
  "requires_second_assessment",
  "requires_admin_action",
  "assessment_completed",
] as const;

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const userRoleEnum = pgEnum("user_role", USER_ROLES);
export const applicationStatusEnum = pgEnum("application_status", APPLICATION_STATUSES);
export const reviewStatusEnum = pgEnum("review_status", REVIEW_STATUSES);
export const finalDecisionEnum = pgEnum("final_decision_option", FINAL_DECISIONS);
export const directiveStatusEnum = pgEnum("directive_status", DIRECTIVE_STATUSES);
export const assessmentStageEnum = pgEnum("assessment_stage", ASSESSMENT_STAGES);
export const assignmentStatusEnum = pgEnum("assignment_status", ASSIGNMENT_STATUSES);
export const therapeuticIndexClassEnum = pgEnum("therapeutic_index_class", THERAPEUTIC_INDEX_CLASSES);
export const bcsClassEnum = pgEnum("bcs_class", BCS_CLASSES);
export const assessorRecommendationEnum = pgEnum("assessor_recommendation", ASSESSOR_RECOMMENDATIONS);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fullName: varchar("full_name", { length: 200 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 50 }),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
    roleIdx: index("users_role_idx").on(table.role),
  }),
);

export const applicantProfiles = pgTable("applicant_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  contactPersonName: varchar("contact_person_name", { length: 200 }),
  contactPersonTitle: varchar("contact_person_title", { length: 150 }),
  companyEmail: varchar("company_email", { length: 255 }),
  companyPhone: varchar("company_phone", { length: 50 }),
  companyAddress: text("company_address"),
  rcNumber: varchar("rc_number", { length: 100 }),
  marketAuthorisationHolder: varchar("market_authorisation_holder", { length: 255 }),
  ...timestamps,
});

export const applications = pgTable(
  "applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    applicantUserId: uuid("applicant_user_id").notNull().references(() => users.id),
    applicantProfileId: uuid("applicant_profile_id").references(() => applicantProfiles.id),
    applicationNo: varchar("application_no", { length: 80 }).notNull(),
    productName: varchar("product_name", { length: 255 }).notNull(),
    strength: varchar("strength", { length: 120 }),
    dosageForm: varchar("dosage_form", { length: 120 }),
    strengthAndDosageForm: varchar("strength_and_dosage_form", { length: 255 }),
    currentStatus: applicationStatusEnum("current_status").notNull().default("draft"),
    reviewStatus: reviewStatusEnum("review_status").notNull().default("Pending"),
    finalDecision: finalDecisionEnum("final_decision"),
    finalDecisionDate: date("final_decision_date"),
    finalDecisionNote: text("final_decision_note"),
    finalDecisionBy: uuid("final_decision_by").references(() => users.id),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    resubmittedAt: timestamp("resubmitted_at", { withTimezone: true }),
    finalizedAt: timestamp("finalized_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => ({
    applicationNoIdx: uniqueIndex("applications_application_no_idx").on(table.applicationNo),
    applicantIdx: index("applications_applicant_idx").on(table.applicantUserId),
    statusIdx: index("applications_status_idx").on(table.currentStatus),
  }),
);

export const beChecklists = pgTable("be_checklists", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
  hasReadGeneralInstructions: boolean("has_read_general_instructions").notNull().default(false),
  certifiedInformationIsTrue: boolean("certified_information_is_true").notNull().default(false),
  signedOnBehalfOf: varchar("signed_on_behalf_of", { length: 255 }),
  signatoryNameAndTitle: varchar("signatory_name_and_title", { length: 255 }),
  certificationDate: date("certification_date"),
  studyProtocolNumber: varchar("study_protocol_number", { length: 150 }),
  studyTitle: text("study_title"),
  bioanalyticalStudyStartDate: date("bioanalytical_study_start_date"),
  bioanalyticalStudyEndDate: date("bioanalytical_study_end_date"),
  clinicalStudySiteName: varchar("clinical_study_site_name", { length: 255 }),
  clinicalStudySiteAddress: text("clinical_study_site_address"),
  bioanalyticalStudySiteName: varchar("bioanalytical_study_site_name", { length: 255 }),
  bioanalyticalStudySiteAddress: text("bioanalytical_study_site_address"),
  ethicsCommitteeName: varchar("ethics_committee_name", { length: 255 }),
  ethicsCommitteeAddress: text("ethics_committee_address"),
  studyProtocolApprovalDate: date("study_protocol_approval_date"),
  approvedStudyProtocolNumberAndVersion: varchar("approved_study_protocol_number_and_version", { length: 255 }),
  informedConsentApprovalDate: date("informed_consent_approval_date"),
  testProductName: varchar("test_product_name", { length: 255 }),
  testProductStrength: varchar("test_product_strength", { length: 120 }),
  testProductSameStrengthAsRegistrationProduct: boolean("test_product_same_strength_as_registration_product"),
  testProductSameStrengthComment: text("test_product_same_strength_comment"),
  testProductDosageForm: varchar("test_product_dosage_form", { length: 120 }),
  testProductBatchNumber: varchar("test_product_batch_number", { length: 150 }),
  testProductBatchSize: varchar("test_product_batch_size", { length: 150 }),
  testProductManufactureDate: date("test_product_manufacture_date"),
  testProductExpiryDate: date("test_product_expiry_date"),
  apiManufacturingSiteNameAndAddress: text("api_manufacturing_site_name_and_address"),
  testProductManufacturingSiteNameAndAddress: text("test_product_manufacturing_site_name_and_address"),
  testProductSameCompositionAsRegistrationProduct: boolean("test_product_same_composition_as_registration_product"),
  testProductSameCompositionComment: text("test_product_same_composition_comment"),
  referenceProductName: varchar("reference_product_name", { length: 255 }),
  referenceProductStrength: varchar("reference_product_strength", { length: 120 }),
  referenceProductDosageForm: varchar("reference_product_dosage_form", { length: 120 }),
  referenceProductBatchNumber: varchar("reference_product_batch_number", { length: 150 }),
  referenceProductExpiryDate: date("reference_product_expiry_date"),
  referenceProductSourceCountry: varchar("reference_product_source_country", { length: 120 }),
  referenceProductManufacturingSiteNameAndAddress: text("reference_product_manufacturing_site_name_and_address"),
  referenceProductSameAsWhoComparator: boolean("reference_product_same_as_who_comparator"),
  referenceProductComparatorComment: text("reference_product_comparator_comment"),
  biowaiverOfAdditionalStrengthApplicable: boolean("biowaiver_of_additional_strength_applicable"),
  ...timestamps,
});

export const beStudyPeriods = pgTable("be_study_periods", {
  id: uuid("id").primaryKey().defaultRandom(),
  checklistId: uuid("checklist_id").notNull().references(() => beChecklists.id, { onDelete: "cascade" }),
  applicationId: uuid("application_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
  periodLabel: varchar("period_label", { length: 100 }).notNull(),
  startDate: date("start_date"),
  endDate: date("end_date"),
  sortOrder: integer("sort_order").notNull(),
  ...timestamps,
});

export const beSummaryResults = pgTable("be_summary_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  checklistId: uuid("checklist_id").notNull().references(() => beChecklists.id, { onDelete: "cascade" }),
  applicationId: uuid("application_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
  parameter: varchar("parameter", { length: 80 }).notNull(),
  logarithmicTransformedData: text("logarithmic_transformed_data"),
  testGeometricMean: varchar("test_geometric_mean", { length: 80 }),
  referenceGeometricMean: varchar("reference_geometric_mean", { length: 80 }),
  percentageRatioGeometricMeans: varchar("percentage_ratio_geometric_means", { length: 80 }),
  confidenceIntervalLower: varchar("confidence_interval_lower", { length: 80 }),
  confidenceIntervalUpper: varchar("confidence_interval_upper", { length: 80 }),
  intraSubjectCoefficientVariationIscv: varchar("intra_subject_coefficient_variation_iscv", { length: 80 }),
  sortOrder: integer("sort_order").notNull(),
  ...timestamps,
});

export const sectionBDocumentReferences = pgTable("section_b_document_references", {
  id: uuid("id").primaryKey().defaultRandom(),
  checklistId: uuid("checklist_id").notNull().references(() => beChecklists.id, { onDelete: "cascade" }),
  applicationId: uuid("application_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
  itemNumber: integer("item_number").notNull(),
  documentTitle: text("document_title").notNull(),
  nameOfDocumentAndLocation: text("name_of_document_and_location"),
  isApplicable: boolean("is_applicable").notNull().default(true),
  applicantRemark: text("applicant_remark"),
  sortOrder: integer("sort_order").notNull(),
  ...timestamps,
});

export const complianceDirectives = pgTable("compliance_directives", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
  directiveNumber: varchar("directive_number", { length: 80 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  issuedByUserId: uuid("issued_by_user_id").notNull().references(() => users.id),
  issuedToUserId: uuid("issued_to_user_id").notNull().references(() => users.id),
  affectedSections: jsonb("affected_sections").$type<string[]>().notNull().default([]),
  directiveMessage: text("directive_message").notNull(),
  requiredCorrections: text("required_corrections"),
  dueDate: date("due_date"),
  status: directiveStatusEnum("status").notNull().default("open"),
  issuedAt: timestamp("issued_at", { withTimezone: true }).notNull().defaultNow(),
  closedAt: timestamp("closed_at", { withTimezone: true }),
  ...timestamps,
});

export const complianceDirectiveResponses = pgTable("compliance_directive_responses", {
  id: uuid("id").primaryKey().defaultRandom(),
  complianceDirectiveId: uuid("compliance_directive_id").notNull().references(() => complianceDirectives.id, { onDelete: "cascade" }),
  applicationId: uuid("application_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
  applicantUserId: uuid("applicant_user_id").notNull().references(() => users.id),
  responseMessage: text("response_message").notNull(),
  correctedSections: jsonb("corrected_sections").$type<string[]>().notNull().default([]),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
  ...timestamps,
});

export const productClassifications = pgTable("product_classifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
  therapeuticIndexClass: therapeuticIndexClassEnum("therapeutic_index_class").notNull().default("Unknown"),
  bcsClass: bcsClassEnum("bcs_class").notNull().default("Unknown"),
  pharmacologicalClass: varchar("pharmacological_class", { length: 255 }),
  localOrForeign: varchar("local_or_foreign", { length: 80 }),
  productCategory: varchar("product_category", { length: 150 }),
  biowaiverRelevance: text("biowaiver_relevance"),
  classificationSource: varchar("classification_source", { length: 255 }),
  classificationNote: text("classification_note"),
  classifiedByUserId: uuid("classified_by_user_id").references(() => users.id),
  classifiedAt: timestamp("classified_at", { withTimezone: true }),
  ...timestamps,
});

export const assessorAssignments = pgTable("assessor_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
  assessorUserId: uuid("assessor_user_id").notNull().references(() => users.id),
  assessmentStage: assessmentStageEnum("assessment_stage").notNull(),
  assignedByUserId: uuid("assigned_by_user_id").notNull().references(() => users.id),
  assignedAt: timestamp("assigned_at", { withTimezone: true }).notNull().defaultNow(),
  dueDate: date("due_date"),
  assignmentNote: text("assignment_note"),
  reasonForSecondAssessment: text("reason_for_second_assessment"),
  status: assignmentStatusEnum("status").notNull().default("assigned"),
  startedAt: timestamp("started_at", { withTimezone: true }),
  revertedAt: timestamp("reverted_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  ...timestamps,
});

export const assessorReports = pgTable("assessor_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
  assessorAssignmentId: uuid("assessor_assignment_id").notNull().references(() => assessorAssignments.id, { onDelete: "cascade" }),
  assessorUserId: uuid("assessor_user_id").notNull().references(() => users.id),
  assessmentStage: assessmentStageEnum("assessment_stage").notNull(),
  reportTitle: varchar("report_title", { length: 255 }).notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileUrl: text("file_url").notNull(),
  cloudinaryPublicId: varchar("cloudinary_public_id", { length: 255 }).notNull(),
  fileMimeType: varchar("file_mime_type", { length: 120 }),
  fileSize: integer("file_size"),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow(),
  ...timestamps,
});

export const assessorComments = pgTable("assessor_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
  assessorAssignmentId: uuid("assessor_assignment_id").notNull().references(() => assessorAssignments.id, { onDelete: "cascade" }),
  assessorUserId: uuid("assessor_user_id").notNull().references(() => users.id),
  assessmentStage: assessmentStageEnum("assessment_stage").notNull(),
  recommendation: assessorRecommendationEnum("recommendation").notNull(),
  comment: text("comment").notNull(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
  ...timestamps,
});

export const internalNotes = pgTable("internal_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
  authorUserId: uuid("author_user_id").notNull().references(() => users.id),
  note: text("note").notNull(),
  ...timestamps,
});

export const finalDecisions = pgTable("final_decisions", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
  decision: finalDecisionEnum("decision").notNull(),
  decisionNote: text("decision_note"),
  decidedByUserId: uuid("decided_by_user_id").notNull().references(() => users.id),
  decidedAt: timestamp("decided_at", { withTimezone: true }).notNull().defaultNow(),
  ...timestamps,
});

export const lookupItems = pgTable(
  "lookup_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: varchar("type", { length: 100 }).notNull(),
    label: varchar("label", { length: 255 }).notNull(),
    value: varchar("value", { length: 255 }).notNull(),
    description: text("description"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    isActive: boolean("is_active").notNull().default(true),
    createdByUserId: uuid("created_by_user_id").references(() => users.id),
    ...timestamps,
  },
  (table) => ({
    typeValueIdx: uniqueIndex("lookup_items_type_value_idx").on(table.type, table.value),
  }),
);

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id").references(() => applications.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  readAt: timestamp("read_at", { withTimezone: true }),
  ...timestamps,
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id").references(() => applications.id, { onDelete: "cascade" }),
  actorUserId: uuid("actor_user_id").references(() => users.id),
  action: varchar("action", { length: 150 }).notNull(),
  entityType: varchar("entity_type", { length: 100 }),
  entityId: uuid("entity_id"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
