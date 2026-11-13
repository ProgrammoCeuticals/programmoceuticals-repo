/**
 * Unit tests — ValidationCompletionStatus derivation
 * User requirement: distinguish VALID/INVALID/INCOMPLETE/REGULATORY_GAP.
 *
 * Tests:
 *   + all layers ran, no issues → VALID
 *   + warnings only → VALID_WITH_WARNINGS
 *   + blocking errors → INVALID (trumps everything)
 *   + skipped layers due to missing packages → INCOMPLETE_REGULATORY_VALIDATION
 *   + REGULATORY_GAP findings → REGULATORY_GAP
 *   + INVALID trumps REGULATORY_GAP
 *   + REGULATORY_GAP trumps INCOMPLETE_REGULATORY_VALIDATION
 */

import { deriveCompletionStatus } from "../../../packages/ectd-validation/src/profile/validation-status";

describe("deriveCompletionStatus (user requirement)", () => {
  it("VALID — all layers ran, no issues", () => {
    expect(
      deriveCompletionStatus({
        hasBlockingErrors: false,
        hasWarnings: false,
        skippedLayersDueToMissingPackage: false,
        hasRegulatoryGapFindings: false,
      }),
    ).toBe("VALID");
  });

  it("VALID_WITH_WARNINGS — warnings but all layers ran", () => {
    expect(
      deriveCompletionStatus({
        hasBlockingErrors: false,
        hasWarnings: true,
        skippedLayersDueToMissingPackage: false,
        hasRegulatoryGapFindings: false,
      }),
    ).toBe("VALID_WITH_WARNINGS");
  });

  it("INVALID — blocking errors always trump other statuses", () => {
    expect(
      deriveCompletionStatus({
        hasBlockingErrors: true,
        hasWarnings: true,
        skippedLayersDueToMissingPackage: true,
        hasRegulatoryGapFindings: true,
      }),
    ).toBe("INVALID");
  });

  it("INVALID — even with no other issues, blocking error → INVALID", () => {
    expect(
      deriveCompletionStatus({
        hasBlockingErrors: true,
        hasWarnings: false,
        skippedLayersDueToMissingPackage: false,
        hasRegulatoryGapFindings: false,
      }),
    ).toBe("INVALID");
  });

  it("REGULATORY_GAP — gap findings trump INCOMPLETE", () => {
    expect(
      deriveCompletionStatus({
        hasBlockingErrors: false,
        hasWarnings: false,
        skippedLayersDueToMissingPackage: true,
        hasRegulatoryGapFindings: true,
      }),
    ).toBe("REGULATORY_GAP");
  });

  it("INCOMPLETE_REGULATORY_VALIDATION — layers skipped, no gap findings", () => {
    expect(
      deriveCompletionStatus({
        hasBlockingErrors: false,
        hasWarnings: false,
        skippedLayersDueToMissingPackage: true,
        hasRegulatoryGapFindings: false,
      }),
    ).toBe("INCOMPLETE_REGULATORY_VALIDATION");
  });

  it("REGULATORY_GAP — gap findings even without skipped layers", () => {
    expect(
      deriveCompletionStatus({
        hasBlockingErrors: false,
        hasWarnings: false,
        skippedLayersDueToMissingPackage: false,
        hasRegulatoryGapFindings: true,
      }),
    ).toBe("REGULATORY_GAP");
  });

  it("VALID_WITH_WARNINGS takes precedence over VALID when warnings present", () => {
    const result = deriveCompletionStatus({
      hasBlockingErrors: false,
      hasWarnings: true,
      skippedLayersDueToMissingPackage: false,
      hasRegulatoryGapFindings: false,
    });
    expect(result).toBe("VALID_WITH_WARNINGS");
    expect(result).not.toBe("VALID");
  });
});
