/**
 * ValidationCompletionStatus — spec §24-28, user requirement.
 *
 * Do NOT report a Submission Unit as VALID when required regulatory
 * validation layers have been skipped because their authoritative
 * packages are missing.
 *
 * These five statuses must be returned by the engine and persisted
 * on ValidationRun records.
 */

export type ValidationCompletionStatus =
  | "VALID"
  | "VALID_WITH_WARNINGS"
  | "INVALID"
  | "INCOMPLETE_REGULATORY_VALIDATION"
  | "REGULATORY_GAP";

/**
 * Determine the correct completion status from a set of validation results.
 *
 * Rules:
 *   - Any BLOCKING error            → INVALID
 *   - All layers ran, warnings only → VALID_WITH_WARNINGS
 *   - All layers ran, no issues     → VALID
 *   - Any required layer was SKIPPED due to missing authoritative package
 *     → INCOMPLETE_REGULATORY_VALIDATION
 *   - Any layer returned a REGULATORY_GAP finding
 *     → REGULATORY_GAP (most severe incomplete state)
 *
 * REGULATORY_GAP takes precedence over INCOMPLETE_REGULATORY_VALIDATION.
 * INVALID takes precedence over everything else.
 */
export function deriveCompletionStatus(params: {
  hasBlockingErrors: boolean;
  hasWarnings: boolean;
  skippedLayersDueToMissingPackage: boolean;
  hasRegulatoryGapFindings: boolean;
}): ValidationCompletionStatus {
  if (params.hasBlockingErrors) return "INVALID";
  if (params.hasRegulatoryGapFindings) return "REGULATORY_GAP";
  if (params.skippedLayersDueToMissingPackage)
    return "INCOMPLETE_REGULATORY_VALIDATION";
  if (params.hasWarnings) return "VALID_WITH_WARNINGS";
  return "VALID";
}
