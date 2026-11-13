/**
 * Publishing pipeline types — spec §30.
 *
 * The 14-step pipeline:
 *   1.  FREEZE_SNAPSHOT
 *   2.  RESOLVE_REGULATORY_PROFILE
 *   3.  FULL_VALIDATION
 *   4.  PUBLISH_GATE
 *   5.  GENERATE_XML
 *   6.  XSD_VALIDATION
 *   7.  RESOLVE_DOCUMENT_DISPOSITIONS
 *   8.  VERIFY_FILE_CHECKSUMS
 *   9.  CONSTRUCT_STAGING_PACKAGE
 *   10. VALIDATE_PACKAGE
 *   11. CALCULATE_INTEGRITY_VALUES
 *   12. FINALIZE_ATOMICALLY
 *   13. CREATE_SUBMISSION_PACKAGE
 *   14. AUDIT
 *
 * A generated package is not the same as a transmitted submission — spec §32.
 * The pipeline stops at READY_FOR_TRANSMISSION.
 */

export const PUBLISHING_STEPS = {
  FREEZE_SNAPSHOT: "01_FREEZE_SNAPSHOT",
  RESOLVE_REGULATORY_PROFILE: "02_RESOLVE_REGULATORY_PROFILE",
  FULL_VALIDATION: "03_FULL_VALIDATION",
  PUBLISH_GATE: "04_PUBLISH_GATE",
  GENERATE_XML: "05_GENERATE_XML",
  XSD_VALIDATION: "06_XSD_VALIDATION",
  RESOLVE_DOCUMENT_DISPOSITIONS: "07_RESOLVE_DOCUMENT_DISPOSITIONS",
  VERIFY_FILE_CHECKSUMS: "08_VERIFY_FILE_CHECKSUMS",
  CONSTRUCT_STAGING_PACKAGE: "09_CONSTRUCT_STAGING_PACKAGE",
  VALIDATE_PACKAGE: "10_VALIDATE_PACKAGE",
  CALCULATE_INTEGRITY_VALUES: "11_CALCULATE_INTEGRITY_VALUES",
  FINALIZE_ATOMICALLY: "12_FINALIZE_ATOMICALLY",
  CREATE_SUBMISSION_PACKAGE: "13_CREATE_SUBMISSION_PACKAGE",
  AUDIT: "14_AUDIT",
} as const;

export type PublishingStepName =
  (typeof PUBLISHING_STEPS)[keyof typeof PUBLISHING_STEPS];

export type StepStatus =
  | "PENDING"
  | "RUNNING"
  | "PASSED"
  | "FAILED"
  | "SKIPPED";

export interface PublishingStep {
  name: PublishingStepName;
  status: StepStatus;
  message?: string | undefined;
  durationMs?: number | undefined;
}

export type PublishingOutcome = "SUCCESS" | "FAILED" | "GATE_BLOCKED";

/**
 * SubmissionPackage status values — spec §31.
 */
export type SubmissionPackageStatus =
  | "STAGING"
  | "BUILDING"
  | "VALIDATING"
  | "READY"
  | "FINALIZED"
  | "FAILED"
  | "INVALIDATED";

export interface PublishingPipelineResult {
  outcome: PublishingOutcome;
  packageId?: string | undefined;
  packageStatus?: SubmissionPackageStatus | undefined;
  steps: PublishingStep[];
  errorMessage?: string | undefined;
  /** Issues that blocked the publish gate */
  gateIssues?: string[] | undefined;
  /**
   * READY_FOR_TRANSMISSION is the terminal success state — spec §32.
   * The package is not "submitted" until a transmission service confirms it.
   */
  readyForTransmission: boolean;
}
