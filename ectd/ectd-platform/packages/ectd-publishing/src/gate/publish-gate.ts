/**
 * PublishGate — spec §30.
 *
 * "Publish gate" check runs before any destructive pipeline steps.
 * Returns a list of blocking issues. An empty list means the gate passes.
 *
 * Gate checks (structural prerequisites):
 *   1. Submission Unit must have a frozen snapshot.
 *   2. At least one successful (non-blocking) validation run must exist.
 *   3. At least one successful XML generation run must exist.
 *   4. EctdStandard must have a linked Implementation Guide.
 *   5. All referenced documents must have at least one version.
 *   6. Unit must not already be PUBLISHED (immutability — spec §4.4).
 *
 * REGULATORY_GAP: Additional gate conditions tied to specific authority
 * requirements (e.g. FDA sequence number rules, required document sets)
 * require regional validation criteria to be imported (Phase 2).
 */

export interface PublishGateInput {
  submissionUnitId: string;
  unitStatus: string;
  hasSnapshot: boolean;
  hasPassedValidation: boolean;
  /** Must be VALID or VALID_WITH_WARNINGS — not INCOMPLETE_REGULATORY_VALIDATION or REGULATORY_GAP */
  validationCompletionStatus?: string | undefined;
  hasSucceededXmlRun: boolean;
  standardHasImplementationGuide: boolean;
  documentsWithNoVersions: string[];
  couCount: number;
  /** SENDER_IDENTITY_NOT_CONFIGURED if sender OID is missing */
  senderIdentityConfigured: boolean;
  /** Region code for readiness check */
  regionCode?: string | undefined;
  /** Authority code for readiness check */
  authorityCode?: string | undefined;
}

export interface GateResult {
  passed: boolean;
  issues: string[];
}

export function runPublishGate(input: PublishGateInput): GateResult {
  const issues: string[] = [];

  // Already published
  if (input.unitStatus === "PUBLISHED") {
    issues.push(
      "Submission Unit is already PUBLISHED and immutable. " +
        "Create a new Submission Unit for a new sequence.",
    );
    return { passed: false, issues };
  }

  // Snapshot required
  if (!input.hasSnapshot) {
    issues.push(
      "No frozen snapshot found. Run POST /submission-units/:id/freeze.",
    );
  }

  // Sender identity required for XML
  if (!input.senderIdentityConfigured) {
    issues.push(
      "SENDER_IDENTITY_NOT_CONFIGURED: Set ECTD_SENDER_OID to your " +
        "organization's ICH-assigned OID before publishing.",
    );
  }

  // Passed validation required — and must not be INCOMPLETE or REGULATORY_GAP
  if (!input.hasPassedValidation) {
    issues.push(
      "No successful validation run found. " +
        "Run POST /submission-units/:id/validate and wait for success.",
    );
  } else if (
    input.validationCompletionStatus === "INCOMPLETE_REGULATORY_VALIDATION" ||
    input.validationCompletionStatus === "REGULATORY_GAP"
  ) {
    issues.push(
      `Validation status is ${input.validationCompletionStatus}. ` +
        "Publishing is blocked — required regulatory validation layers were " +
        "skipped due to missing authoritative packages. Import and activate " +
        "the required ICH/regional packages before publishing.",
    );
  }

  // Successful XML generation required
  if (!input.hasSucceededXmlRun) {
    issues.push(
      "No successful XML generation run found. " +
        "Run POST /submission-units/:id/generate-xml and wait for success.",
    );
  }

  // IG must be linked
  if (!input.standardHasImplementationGuide) {
    issues.push(
      "EctdStandard has no linked Implementation Guide. " +
        "Import and activate the ICH IG v1.7 package first (Phase 2).",
    );
  }

  // Minimum CoU count
  if (input.couCount === 0) {
    issues.push(
      "Submission Unit has no Contexts of Use. " +
        "Assign at least one Context of Use before publishing.",
    );
  }

  // Document versions required
  for (const docId of input.documentsWithNoVersions) {
    issues.push(
      `Document ${docId} has no uploaded versions. Upload a file before publishing.`,
    );
  }

  // Regional readiness check
  if (input.regionCode && input.authorityCode) {
    const key = `${input.regionCode}:${input.authorityCode}`;
    // Known NOT_CONFIGURED regions
    const NOT_CONFIGURED_REGIONS = ["NG:NAFDAC", "US:FDA", "EU:EMA"];
    if (NOT_CONFIGURED_REGIONS.includes(key)) {
      issues.push(
        `REGIONAL_GAP: Region "${input.regionCode}" / Authority "${input.authorityCode}" ` +
          `is NOT_CONFIGURED for eCTD v4.0. Import the authoritative regional ` +
          `package before publishing submissions targeting this authority.`,
      );
    }
  }

  return { passed: issues.length === 0, issues };
}
