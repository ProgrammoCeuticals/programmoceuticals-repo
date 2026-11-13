/**
 * ValidationEngine interface — spec §24-28, §57 Rule 15
 *
 * Validation is divided into dependency-aware phases (spec §27):
 *   1. Package integrity
 *   2. File format
 *   3. XML schema
 *   4. Controlled vocabulary
 *   5. ICH business rules
 *   6. Regional rules
 *
 * The engine asks the selected ValidationProfile whether a result is
 * BLOCKING rather than globally assuming every warning blocks publication.
 * (spec §25 — FDA distinguishes High Error vs Warning)
 */

export type ValidationSeverity = "ERROR" | "WARNING" | "INFO";
export type ValidationResultStatus = "PASS" | "FAIL" | "SKIP";
export type ValidationRuleSource = "ICH" | "REGIONAL" | "INTERNAL";

export interface ValidationFinding {
  ruleCode: string;
  severity: ValidationSeverity;
  status: ValidationResultStatus;
  message: string;
  entityType?: string;
  entityId?: string;
  location?: string;
  evidence?: Record<string, unknown>;
  remediation?: string;
  /** Source must be declared — never present INTERNAL as ICH/REGIONAL */
  source: ValidationRuleSource;
}

export interface ValidationRunResult {
  validationRunId: string;
  submissionUnitId: string;
  profileId: string;
  /** Backward-compatible 3-value status */
  status: "PASSED" | "FAILED" | "PASSED_WITH_WARNINGS";
  /**
   * Precise 5-value completion status — user requirement.
   * Use this rather than status for display and gate decisions.
   *
   *   VALID                         — all layers ran, no issues
   *   VALID_WITH_WARNINGS           — all layers ran, warnings only
   *   INVALID                       — blocking errors found
   *   INCOMPLETE_REGULATORY_VALIDATION — layers skipped due to missing packages
   *   REGULATORY_GAP                — REGULATORY_GAP findings present
   */
  completionStatus?: import("../profile/validation-status").ValidationCompletionStatus;
  findings: ValidationFinding[];
  hasBlockingErrors: boolean;
  completedAt: Date;
}

export interface ValidationEngine {
  /**
   * Run validation against a frozen Submission Unit snapshot.
   * Must use the exact regulatory profile pinned to the snapshot —
   * never silently upgrade to a newer package.
   */
  validate(
    submissionUnitId: string,
    snapshotId: string,
    validationProfileId: string,
  ): Promise<ValidationRunResult>;

  /**
   * Ask whether a specific finding severity is blocking for a given profile.
   * The answer comes from the profile, not from a global assumption.
   */
  isBlocking(
    severity: ValidationSeverity,
    validationProfileId: string,
  ): Promise<boolean>;
}

export const VALIDATION_ENGINE = Symbol("VALIDATION_ENGINE");
