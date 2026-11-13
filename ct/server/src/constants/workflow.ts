export const USER_ROLES = ["applicant", "assessor", "admin", "super_admin"] as const;

export const APPLICATION_STATUSES = [
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

export const REVIEW_STATUSES = ["Pending", "Ongoing", "Completed"] as const;
export const FINAL_DECISIONS = ["CD", "Approved", "Rejected"] as const;
export const DIRECTIVE_STATUSES = ["open", "responded", "closed", "cancelled"] as const;
export const ASSESSMENT_STAGES = ["first_assessment", "second_assessment"] as const;
export const ASSIGNMENT_STATUSES = ["assigned", "ongoing", "reverted", "completed", "cancelled", "reassigned"] as const;
export const THERAPEUTIC_INDEX_CLASSES = ["NTI", "Non-NTI", "Mixed", "Unknown"] as const;
export const BCS_CLASSES = ["Class I", "Class II", "Class III", "Class IV", "Unknown", "Not Applicable"] as const;
export const ASSESSOR_RECOMMENDATIONS = [
  "recommend_approval",
  "recommend_compliance_directive",
  "recommend_rejection",
  "requires_second_assessment",
  "requires_admin_action",
  "assessment_completed",
] as const;

export const LOOKUP_TYPES = [
  "nti_drug",
  "bcs_class",
  "assessor_reference",
  "pharmacological_class",
  "dosage_form",
  "final_decision",
  "review_status",
  "local_foreign",
  "product_classification_reference",
  "manufacturer",
] as const;
