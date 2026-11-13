/**
 * Structural validation rules — spec §24, §27.
 *
 * Layer 1: STRUCTURAL — package integrity checks that do not require
 * the official ICH regulatory packages. These rules check that the
 * submission unit has the structural prerequisites required before any
 * regulatory validation can proceed.
 *
 * IMPORTANT: These are INTERNAL rules — they must NEVER be presented
 * as ICH or regional requirements — spec §24 (Rule source).
 *
 * Rule codes use the prefix "STRUCT_" to distinguish from regulatory rules.
 */

import type { ValidationFinding } from "../interfaces/validation-engine.interface";
import type { ValidationRuleDefinition } from "../profile/validation-profile.types";

// ── Rule definitions ──────────────────────────────────────────────────────

export const STRUCTURAL_RULE_DEFINITIONS: ValidationRuleDefinition[] = [
  {
    ruleCode: "STRUCT_001",
    name: "Submission Unit has frozen snapshot",
    description: "A frozen snapshot must exist before validation can proceed.",
    severity: "ERROR",
    scope: "SubmissionUnit",
    source: "INTERNAL",
    version: "1.0",
    layer: "STRUCTURAL",
    definition: { check: "hasSnapshot" },
  },
  {
    ruleCode: "STRUCT_002",
    name: "Submission Unit has at least one Context of Use",
    description:
      "A Submission Unit must have at least one Context of Use assigned.",
    severity: "ERROR",
    scope: "SubmissionUnit",
    source: "INTERNAL",
    version: "1.0",
    layer: "STRUCTURAL",
    definition: { check: "hasCou", minCount: 1 },
  },
  {
    ruleCode: "STRUCT_003",
    name: "Each Context of Use has a document assigned",
    description: "Every Context of Use must reference a Document.",
    severity: "ERROR",
    scope: "ContextOfUse",
    source: "INTERNAL",
    version: "1.0",
    layer: "STRUCTURAL",
    definition: { check: "couHasDocument" },
  },
  {
    ruleCode: "STRUCT_004",
    name: "Each referenced document has at least one version",
    description:
      "Documents assigned to Contexts of Use must have at least one version.",
    severity: "ERROR",
    scope: "Document",
    source: "INTERNAL",
    version: "1.0",
    layer: "STRUCTURAL",
    definition: { check: "documentHasVersion" },
  },
  {
    ruleCode: "STRUCT_005",
    name: "Submission Unit references an active EctdStandard",
    description:
      "The EctdStandard linked to the Submission Unit must be ACTIVE.",
    severity: "ERROR",
    scope: "SubmissionUnit",
    source: "INTERNAL",
    version: "1.0",
    layer: "STRUCTURAL",
    definition: { check: "standardIsActive" },
  },
  {
    ruleCode: "STRUCT_006",
    name: "No OBSOLETE Contexts of Use in active submission",
    description: "Active submission should not contain OBSOLETE CoUs.",
    severity: "WARNING",
    scope: "ContextOfUse",
    source: "INTERNAL",
    version: "1.0",
    layer: "STRUCTURAL",
    definition: { check: "noObsoleteCou" },
  },
];

// ── Structural state (passed by the engine) ───────────────────────────────

export interface StructuralCheckInput {
  submissionUnitId: string;
  hasSnapshot: boolean;
  couCount: number;
  cousMissingDocuments: string[]; // CoU ids with no document
  documentsWithNoVersions: string[]; // Document ids with no versions
  standardIsActive: boolean;
  obsoleteCouIds: string[];
}

// ── Rule executor ─────────────────────────────────────────────────────────

export function executeStructuralRule(
  rule: ValidationRuleDefinition,
  input: StructuralCheckInput,
): ValidationFinding[] {
  const findings: ValidationFinding[] = [];

  switch (rule.ruleCode) {
    case "STRUCT_001": {
      if (!input.hasSnapshot) {
        findings.push({
          ruleCode: rule.ruleCode,
          severity: rule.severity,
          status: "FAIL",
          message:
            "Submission Unit has no frozen snapshot. " +
            "Run POST /submission-units/:id/freeze before validation.",
          entityType: "SubmissionUnit",
          entityId: input.submissionUnitId,
          source: "INTERNAL",
          remediation:
            "Run the freeze command to create an immutable snapshot.",
        });
      } else {
        findings.push({
          ruleCode: rule.ruleCode,
          severity: rule.severity,
          status: "PASS",
          message: "Frozen snapshot exists.",
          source: "INTERNAL",
        });
      }
      break;
    }

    case "STRUCT_002": {
      if (input.couCount === 0) {
        findings.push({
          ruleCode: rule.ruleCode,
          severity: rule.severity,
          status: "FAIL",
          message: "Submission Unit has no Contexts of Use assigned.",
          entityType: "SubmissionUnit",
          entityId: input.submissionUnitId,
          source: "INTERNAL",
          remediation:
            "Assign at least one Context of Use via POST /submission-units/:id/contexts-of-use.",
        });
      } else {
        findings.push({
          ruleCode: rule.ruleCode,
          severity: rule.severity,
          status: "PASS",
          message: `${input.couCount} Context(s) of Use found.`,
          source: "INTERNAL",
        });
      }
      break;
    }

    case "STRUCT_003": {
      for (const couId of input.cousMissingDocuments) {
        findings.push({
          ruleCode: rule.ruleCode,
          severity: rule.severity,
          status: "FAIL",
          message: `Context of Use ${couId} has no document assigned.`,
          entityType: "ContextOfUse",
          entityId: couId,
          source: "INTERNAL",
          remediation: "Assign a document to this Context of Use.",
        });
      }
      if (input.cousMissingDocuments.length === 0) {
        findings.push({
          ruleCode: rule.ruleCode,
          severity: rule.severity,
          status: "PASS",
          message: "All Contexts of Use have documents assigned.",
          source: "INTERNAL",
        });
      }
      break;
    }

    case "STRUCT_004": {
      for (const docId of input.documentsWithNoVersions) {
        findings.push({
          ruleCode: rule.ruleCode,
          severity: rule.severity,
          status: "FAIL",
          message: `Document ${docId} has no uploaded versions.`,
          entityType: "Document",
          entityId: docId,
          source: "INTERNAL",
          remediation: "Upload at least one version for this document.",
        });
      }
      if (input.documentsWithNoVersions.length === 0) {
        findings.push({
          ruleCode: rule.ruleCode,
          severity: rule.severity,
          status: "PASS",
          message: "All referenced documents have at least one version.",
          source: "INTERNAL",
        });
      }
      break;
    }

    case "STRUCT_005": {
      if (!input.standardIsActive) {
        findings.push({
          ruleCode: rule.ruleCode,
          severity: rule.severity,
          status: "FAIL",
          message:
            "The EctdStandard linked to this Submission Unit is not ACTIVE.",
          entityType: "SubmissionUnit",
          entityId: input.submissionUnitId,
          source: "INTERNAL",
          remediation: "Ensure the EctdStandard is active before validating.",
        });
      } else {
        findings.push({
          ruleCode: rule.ruleCode,
          severity: rule.severity,
          status: "PASS",
          message: "EctdStandard is ACTIVE.",
          source: "INTERNAL",
        });
      }
      break;
    }

    case "STRUCT_006": {
      for (const couId of input.obsoleteCouIds) {
        findings.push({
          ruleCode: rule.ruleCode,
          severity: rule.severity,
          status: "FAIL",
          message: `Context of Use ${couId} has OBSOLETE status.`,
          entityType: "ContextOfUse",
          entityId: couId,
          source: "INTERNAL",
        });
      }
      if (input.obsoleteCouIds.length === 0) {
        findings.push({
          ruleCode: rule.ruleCode,
          severity: rule.severity,
          status: "PASS",
          message: "No OBSOLETE Contexts of Use found.",
          source: "INTERNAL",
        });
      }
      break;
    }
  }

  return findings;
}
