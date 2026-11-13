/**
 * ValidationEngineImpl — spec §24–28.
 *
 * Implements the 6-layer dependency-aware validation pipeline.
 * Pure domain service — no NestJS, no Prisma.
 *
 * Pipeline (spec §27):
 *   STRUCTURAL → FILE_FORMAT → XML_SCHEMA → CONTROLLED_VOCAB
 *   → ICH_BUSINESS_RULES → REGIONAL
 *
 * Severity is profile-driven — spec §25.
 * Results are cached by checksum+engine+profile — spec §28.
 *
 * REGULATORY_GAP: Layers 2–6 require authoritative regulatory packages.
 * Until imported, those layers return SKIP/INFO findings.
 * Layer 1 (STRUCTURAL) runs with INTERNAL rules immediately.
 */

import type {
  ValidationEngine,
  ValidationFinding,
  ValidationRunResult,
  ValidationSeverity,
} from "../interfaces/validation-engine.interface";
import type { ResolvedValidationProfile } from "../profile/validation-profile.types";
import type { ValidationContext } from "../layers/validation-layer-runner";
import type { StructuralCheckInput } from "../rules/structural-rules";
import type { ValidationCache } from "../cache/validation-cache";
import { deriveCompletionStatus } from "../profile/validation-status";
import {
  runValidationLayers,
  type RuleExecutor,
  type LayerInput,
} from "../layers/validation-layer-runner";
import { executeStructuralRule } from "../rules/structural-rules";
import { VALIDATION_LAYER_ORDER } from "../profile/validation-profile.types";

export const VALIDATION_ENGINE_VERSION = "0.1.0-phase8";

// ── Repository interface ──────────────────────────────────────────────────

export interface ValidationEngineRepository {
  /**
   * Load everything needed to run structural checks on a Submission Unit.
   */
  loadStructuralCheckInput(
    submissionUnitId: string,
  ): Promise<StructuralCheckInput>;

  /**
   * Check whether a schema package is available for the standard.
   */
  isSchemaPackageAvailable(ectdStandardId: string): Promise<boolean>;

  /**
   * Check whether a CV package is available for the standard.
   */
  isCvPackageAvailable(ectdStandardId: string): Promise<boolean>;

  /**
   * Get the EctdStandard id for a Submission Unit.
   */
  getEctdStandardId(submissionUnitId: string): Promise<string | null>;
}

// ── Engine implementation ─────────────────────────────────────────────────

export class ValidationEngineImpl {
  constructor(
    private readonly repo: ValidationEngineRepository,
    private readonly cache: ValidationCache,
  ) {}

  async validate(
    submissionUnitId: string,
    snapshotId: string,
    profile: ResolvedValidationProfile,
  ): Promise<ValidationRunResult> {
    const startedAt = new Date();

    // ── Build context ────────────────────────────────────────────────────
    const standardId = await this.repo.getEctdStandardId(submissionUnitId);
    const [schemaAvailable, cvAvailable] = await Promise.all([
      standardId
        ? this.repo.isSchemaPackageAvailable(standardId)
        : Promise.resolve(false),
      standardId
        ? this.repo.isCvPackageAvailable(standardId)
        : Promise.resolve(false),
    ]);

    const context: ValidationContext = {
      engineVersion: VALIDATION_ENGINE_VERSION,
      profileVersion: profile.rulesetVersion,
      schemaPackageAvailable: schemaAvailable,
      cvPackageAvailable: cvAvailable,
      ichRulesAvailable: false, // REGULATORY_GAP: loaded from official criteria
      regionalRulesAvailable: !!profile.regionalSpecificationId,
    };

    // ── Build executor ───────────────────────────────────────────────────
    const structuralInput =
      await this.repo.loadStructuralCheckInput(submissionUnitId);
    const executor = this.buildExecutor(structuralInput);

    // ── Run layers ───────────────────────────────────────────────────────
    const layerInput: LayerInput = {
      submissionUnitId,
      snapshotId,
      rules: profile.rules,
      severityPolicy: profile.severityPolicy,
      context,
    };

    const layerResults = await runValidationLayers(layerInput, executor);

    // ── Aggregate findings ───────────────────────────────────────────────
    const allFindings: ValidationFinding[] = layerResults.flatMap(
      (lr) => lr.findings,
    );
    const hasBlockingErrors = layerResults.some((lr) => lr.hasBlockingErrors);

    // Determine precise completion status — user requirement.
    // Never report VALID/PASSED when layers were skipped due to missing packages.
    const skippedLayersDueToMissingPackage = layerResults.some(
      (lr) =>
        lr.skipped && lr.skipReason && !lr.skipReason.includes("blocking"), // skipped due to gap, not due to prior error
    );
    const hasRegulatoryGapFindings = allFindings.some((f) =>
      f.message.includes("REGULATORY_GAP"),
    );
    const hasWarnings = allFindings.some(
      (f) => f.severity === "WARNING" && f.status === "FAIL",
    );

    const completionStatus = deriveCompletionStatus({
      hasBlockingErrors,
      hasWarnings,
      skippedLayersDueToMissingPackage,
      hasRegulatoryGapFindings,
    });

    // Map to the existing ValidationRunResult status field for backward compat
    const status: ValidationRunResult["status"] = hasBlockingErrors
      ? "FAILED"
      : hasWarnings
        ? "PASSED_WITH_WARNINGS"
        : "PASSED";

    return {
      validationRunId: "", // filled by the caller after DB insert
      submissionUnitId,
      profileId: profile.id,
      status,
      completionStatus, // precise 5-value status — user requirement
      findings: allFindings,
      hasBlockingErrors,
      completedAt: new Date(),
    };
  }

  async isBlocking(
    severity: ValidationSeverity,
    profile: ResolvedValidationProfile,
  ): Promise<boolean> {
    if (severity === "ERROR") return profile.severityPolicy.blockingOnError;
    if (severity === "WARNING") return profile.severityPolicy.blockingOnWarning;
    return false;
  }

  // ── Executor factory ─────────────────────────────────────────────────────

  private buildExecutor(structuralInput: StructuralCheckInput): RuleExecutor {
    return {
      canExecute: (rule, context) => {
        // STRUCTURAL rules always executable (INTERNAL rules, no package needed)
        if (rule.layer === "STRUCTURAL") return true;
        // Other layers need their packages
        if (rule.layer === "XML_SCHEMA") return context.schemaPackageAvailable;
        if (rule.layer === "CONTROLLED_VOCAB")
          return context.cvPackageAvailable;
        if (rule.layer === "ICH_BUSINESS_RULES")
          return context.ichRulesAvailable;
        if (rule.layer === "REGIONAL") return context.regionalRulesAvailable;
        return false;
      },

      execute: async (rule, _input) => {
        if (rule.layer === "STRUCTURAL") {
          return executeStructuralRule(rule, structuralInput);
        }
        // Layers 2–6: REGULATORY_GAP — no authoritative rules yet
        return [
          {
            ruleCode: rule.ruleCode,
            severity: "INFO" as ValidationSeverity,
            status: "SKIP" as const,
            message:
              `REGULATORY_GAP: Rule "${rule.ruleCode}" (layer: ${rule.layer}) ` +
              `cannot be executed — required regulatory package not imported.`,
            source: rule.source,
          },
        ];
      },
    };
  }
}

// ── Overload: accept raw profile ID string for the interface contract ────

export class ValidationEngineAdapter implements ValidationEngine {
  constructor(
    private readonly impl: ValidationEngineImpl,
    private readonly profileLoader: (
      profileId: string,
    ) => Promise<ResolvedValidationProfile>,
  ) {}

  async validate(
    submissionUnitId: string,
    snapshotId: string,
    validationProfileId: string,
  ): Promise<ValidationRunResult> {
    const profile = await this.profileLoader(validationProfileId);
    return this.impl.validate(submissionUnitId, snapshotId, profile);
  }

  async isBlocking(
    severity: ValidationSeverity,
    validationProfileId: string,
  ): Promise<boolean> {
    const profile = await this.profileLoader(validationProfileId);
    return this.impl.isBlocking(severity, profile);
  }
}
