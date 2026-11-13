/**
 * ValidationLayerRunner — spec §27.
 *
 * Runs validation layers in dependency-aware sequence:
 *   STRUCTURAL → FILE_FORMAT → XML_SCHEMA → CONTROLLED_VOCAB
 *   → ICH_BUSINESS_RULES → REGIONAL
 *
 * A layer is skipped if the previous layer produced blocking errors.
 * "Do not run a hyperlink-resolution rule before document/reference
 * resolution has succeeded." — spec §27.
 *
 * REGULATORY_GAP: Individual rule implementations within each layer
 * require the authoritative regulatory packages to be imported:
 *   - Layer 3 (XML schema): ICH IG v1.7 XSD
 *   - Layer 4 (CV): ICH CV Package v1.0.3
 *   - Layer 5 (ICH business rules): ICH validation criteria
 *   - Layer 6 (Regional): Authority-specific validation criteria
 *
 * Until these packages are imported, layers 3–6 return REGULATORY_GAP
 * findings with SKIP status rather than false positives.
 */

import type { ValidationFinding } from "../interfaces/validation-engine.interface";
import type {
  ValidationRuleDefinition,
  ValidationLayer,
  SeverityPolicy,
} from "../profile/validation-profile.types";
import { VALIDATION_LAYER_ORDER } from "../profile/validation-profile.types";

export interface LayerInput {
  submissionUnitId: string;
  snapshotId: string;
  rules: ValidationRuleDefinition[];
  severityPolicy: SeverityPolicy;
  /** Context provided to rule executors */
  context: ValidationContext;
}

export interface ValidationContext {
  /** The engine version — included in cache keys */
  engineVersion: string;
  /** Profile version — included in cache keys */
  profileVersion: string;
  /** Whether the official ICH schema package is available */
  schemaPackageAvailable: boolean;
  /** Whether the CV package is available */
  cvPackageAvailable: boolean;
  /** Whether the ICH business rules are loaded */
  ichRulesAvailable: boolean;
  /** Whether a regional spec is linked and its rules are loaded */
  regionalRulesAvailable: boolean;
}

export interface LayerResult {
  layer: ValidationLayer;
  findings: ValidationFinding[];
  skipped: boolean;
  skipReason?: string | undefined;
  hasBlockingErrors: boolean;
}

export interface RuleExecutor {
  canExecute(
    rule: ValidationRuleDefinition,
    context: ValidationContext,
  ): boolean;
  execute(
    rule: ValidationRuleDefinition,
    input: LayerInput,
  ): Promise<ValidationFinding[]>;
}

/**
 * Run all validation layers in sequence.
 * Skips a layer if the preceding layer had blocking errors.
 */
export async function runValidationLayers(
  input: LayerInput,
  executor: RuleExecutor,
): Promise<LayerResult[]> {
  const results: LayerResult[] = [];
  let previousHadBlockingErrors = false;

  for (const layer of VALIDATION_LAYER_ORDER) {
    const layerRules = input.rules.filter((r) => r.layer === layer);

    // Skip if previous layer blocked
    if (previousHadBlockingErrors) {
      results.push({
        layer,
        findings: [],
        skipped: true,
        skipReason: "Skipped — previous layer produced blocking errors.",
        hasBlockingErrors: false,
      });
      continue;
    }

    // Skip layer if it has no rules loaded (REGULATORY_GAP)
    if (layerRules.length === 0) {
      const gapMessage = getLayerGapMessage(layer, input.context);
      results.push({
        layer,
        findings: [
          {
            ruleCode: `${layer}_NO_RULES`,
            severity: "INFO",
            status: "SKIP",
            message: gapMessage,
            source: "INTERNAL",
          },
        ],
        skipped: true,
        skipReason: gapMessage,
        hasBlockingErrors: false,
      });
      continue;
    }

    // Execute rules for this layer
    const findings: ValidationFinding[] = [];
    for (const rule of layerRules) {
      if (!executor.canExecute(rule, input.context)) {
        findings.push({
          ruleCode: rule.ruleCode,
          severity: "INFO",
          status: "SKIP",
          message: `Rule "${rule.ruleCode}" skipped — required package not available.`,
          source: rule.source,
        });
        continue;
      }
      const rulefindings = await executor.execute(rule, input);
      findings.push(...rulefindings);
    }

    const hasBlockingErrors = findings.some((f) =>
      isBlocking(f, input.severityPolicy),
    );

    results.push({ layer, findings, skipped: false, hasBlockingErrors });
    previousHadBlockingErrors = hasBlockingErrors;
  }

  return results;
}

function isBlocking(
  finding: ValidationFinding,
  policy: SeverityPolicy,
): boolean {
  if (finding.status === "SKIP") return false;
  if (finding.severity === "ERROR" && policy.blockingOnError) return true;
  if (finding.severity === "WARNING" && policy.blockingOnWarning) return true;
  return false;
}

function getLayerGapMessage(
  layer: ValidationLayer,
  ctx: ValidationContext,
): string {
  switch (layer) {
    case "STRUCTURAL":
      return (
        "STRUCTURAL layer: No structural rules loaded. " +
        "Add rules via the ValidationProfile."
      );
    case "FILE_FORMAT":
      return (
        "FILE_FORMAT layer: No file format rules loaded. " +
        "File format specification must be imported (Phase 2)."
      );
    case "XML_SCHEMA":
      return ctx.schemaPackageAvailable
        ? "XML_SCHEMA layer: Schema available but no rules configured."
        : "REGULATORY_GAP: XML_SCHEMA layer requires the ICH IG v1.7 schema package " +
            "to be imported and activated (Phase 2).";
    case "CONTROLLED_VOCAB":
      return ctx.cvPackageAvailable
        ? "CONTROLLED_VOCAB layer: CV available but no rules configured."
        : "REGULATORY_GAP: CONTROLLED_VOCAB layer requires the ICH CV Package v1.0.3 " +
            "to be imported and activated (Phase 2).";
    case "ICH_BUSINESS_RULES":
      return ctx.ichRulesAvailable
        ? "ICH_BUSINESS_RULES layer: Rules available but none configured in profile."
        : "REGULATORY_GAP: ICH_BUSINESS_RULES layer requires authoritative ICH " +
            "validation criteria to be imported (Phase 2).";
    case "REGIONAL":
      return ctx.regionalRulesAvailable
        ? "REGIONAL layer: Regional rules available but none configured."
        : "REGULATORY_GAP: REGIONAL layer requires a regional specification and " +
            "its authoritative validation criteria to be imported.";
  }
}
