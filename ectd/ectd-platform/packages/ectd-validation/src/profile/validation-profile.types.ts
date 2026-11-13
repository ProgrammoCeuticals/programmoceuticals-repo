/**
 * ValidationProfile types — spec §24, §25.
 *
 * A profile binds: eCTD standard, IG, schema package, CV package,
 * CTD package, regional specification, regional vocabulary,
 * validation ruleset, and file-format specification.
 *
 * The engine asks the selected profile whether a result is blocking —
 * never a global assumption — spec §25.
 *
 * REGULATORY_GAP: The severity mapping for each profile must be
 * configured from the authoritative validation criteria document.
 * Example: FDA v4.0 validation criteria v1.6 (Aug 28, 2026) defines
 * "High Error" as blocking and "Warning" as non-blocking.
 * Do not assume every authority uses the same severity semantics.
 */

import type { ValidationSeverity } from "../interfaces/validation-engine.interface";

export type RuleSource = "ICH" | "REGIONAL" | "INTERNAL";

export interface ValidationRuleDefinition {
  ruleCode: string;
  name: string;
  description?: string | undefined;
  severity: ValidationSeverity;
  scope: string;
  source: RuleSource;
  version: string;
  /** The layer this rule belongs to — controls execution order */
  layer: ValidationLayer;
  /** JSON definition used by the rule executor */
  definition: Record<string, unknown>;
  sourceDocument?: string | undefined;
  sourceDocumentVersion?: string | undefined;
  sectionReference?: string | undefined;
}

/**
 * Validation layers — spec §27 (dependency-aware sequencing).
 * Rules run in this order. A layer is skipped if the previous layer
 * produced blocking errors.
 */
export type ValidationLayer =
  | "STRUCTURAL" // Layer 1: package integrity
  | "FILE_FORMAT" // Layer 2: file format
  | "XML_SCHEMA" // Layer 3: XML schema (XSD)
  | "CONTROLLED_VOCAB" // Layer 4: controlled vocabulary
  | "ICH_BUSINESS_RULES" // Layer 5: ICH business rules
  | "REGIONAL"; // Layer 6: regional rules

export const VALIDATION_LAYER_ORDER: ValidationLayer[] = [
  "STRUCTURAL",
  "FILE_FORMAT",
  "XML_SCHEMA",
  "CONTROLLED_VOCAB",
  "ICH_BUSINESS_RULES",
  "REGIONAL",
];

/**
 * SeverityPolicy — defines which severities are blocking for a specific profile.
 *
 * REGULATORY_GAP: The severity policy for each profile must be loaded
 * from the authoritative validation criteria. The defaults here are
 * conservative (ERROR is always blocking).
 */
export interface SeverityPolicy {
  blockingOnError: boolean;
  blockingOnWarning: boolean;
  /** Authority-specific blocking level name (e.g. "High Error" for FDA) */
  authorityBlockingLevelName?: string | undefined;
}

export const DEFAULT_SEVERITY_POLICY: SeverityPolicy = {
  blockingOnError: true,
  blockingOnWarning: false,
};

export interface ResolvedValidationProfile {
  id: string;
  name: string;
  version: string;
  rulesetVersion: string;
  ectdStandardId: string;
  regionalSpecificationId?: string | undefined;
  rules: ValidationRuleDefinition[];
  severityPolicy: SeverityPolicy;
}
