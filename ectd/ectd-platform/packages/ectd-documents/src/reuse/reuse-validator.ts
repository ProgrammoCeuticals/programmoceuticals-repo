/**
 * ReuseValidator — spec §17.
 *
 * Document reuse is distinct from lifecycle replacement.
 * A document may be reused across Submission Units by referencing its
 * regulatory identity where the applicable rules permit.
 *
 * The reuse validator must consider (spec §17):
 *   - document resolution (document exists and has a version)
 *   - physical availability (version storageKey exists)
 *   - target Submission Unit (unit exists and is in DRAFT/ACTIVE state)
 *   - target CoU context compatibility
 *   - references and hyperlinks (Phase 5+)
 *   - regional constraints (Phase 6+)
 *
 * The system must not blindly duplicate a physical document merely because
 * a document is reused — spec §17.
 *
 * REGULATORY_GAP: Full regional constraint validation requires the regional
 * specification and Phase 6 lifecycle engine. The checks here cover the
 * structural prerequisites only.
 */

export interface ReuseCheckInput {
  documentId: string;
  documentHasVersion: boolean;
  documentVersionStorageKeyExists: boolean;
  targetSubmissionUnitStatus: string;
  targetContextDefinitionId: string;
  sourceSubmissionUnitId: string;
  targetSubmissionUnitId: string;
}

export type ReuseCheckSeverity = "BLOCKING" | "WARNING";

export interface ReuseCheckFinding {
  code: string;
  severity: ReuseCheckSeverity;
  message: string;
}

export interface ReuseValidationResult {
  canReuse: boolean;
  findings: ReuseCheckFinding[];
}

export class ReuseValidator {
  /**
   * Validate whether a document can be reused in the target context.
   * Fail closed on blocking issues — spec §4.5.
   */
  validate(input: ReuseCheckInput): ReuseValidationResult {
    const findings: ReuseCheckFinding[] = [];

    // ── Document must have at least one version ──────────────────────────
    if (!input.documentHasVersion) {
      findings.push({
        code: "NO_DOCUMENT_VERSION",
        severity: "BLOCKING",
        message:
          `Document ${input.documentId} has no versions. ` +
          "Upload a document version before reusing.",
      });
    }

    // ── Physical file must be available ─────────────────────────────────
    if (input.documentHasVersion && !input.documentVersionStorageKeyExists) {
      findings.push({
        code: "PHYSICAL_FILE_UNAVAILABLE",
        severity: "BLOCKING",
        message:
          `Physical file for document ${input.documentId} is not available in storage. ` +
          "The file must be physically accessible for reuse.",
      });
    }

    // ── Target submission unit must be mutable ───────────────────────────
    if (input.targetSubmissionUnitStatus === "PUBLISHED") {
      findings.push({
        code: "TARGET_UNIT_PUBLISHED",
        severity: "BLOCKING",
        message:
          `Target SubmissionUnit ${input.targetSubmissionUnitId} is PUBLISHED and immutable. ` +
          "Create a new Submission Unit to reuse documents in a new sequence.",
      });
    }

    // ── Self-reuse within same submission unit is a warning ──────────────
    if (input.sourceSubmissionUnitId === input.targetSubmissionUnitId) {
      findings.push({
        code: "SAME_SUBMISSION_UNIT",
        severity: "WARNING",
        message:
          "Source and target Submission Units are the same. " +
          "Document reuse across units is the typical use case — spec §17.",
      });
    }

    // ── Regional constraints warning ─────────────────────────────────────
    findings.push({
      code: "REGIONAL_CONSTRAINTS_NOT_VALIDATED",
      severity: "WARNING",
      message:
        "REGULATORY_GAP: Regional reuse constraints are validated in Phase 6. " +
        "Ensure reuse is permitted under the applicable regional specification.",
    });

    const hasBlockers = findings.some((f) => f.severity === "BLOCKING");
    return { canReuse: !hasBlockers, findings };
  }
}
