/**
 * Unit tests — ValidationLayerRunner
 * spec §25, §27, §49.
 *
 * Tests cover:
 *   + layers run in correct order (STRUCTURAL first)
 *   + subsequent layers skipped when previous layer has blocking errors (spec §27)
 *   + layers with no rules return SKIP/INFO finding (REGULATORY_GAP)
 *   + severity policy is profile-driven — WARNING only blocks if policy says so (spec §25)
 *   + non-blocking warnings don't stop subsequent layers
 */

import {
  runValidationLayers,
  type LayerInput,
  type RuleExecutor,
  type ValidationContext,
} from "../../../packages/ectd-validation/src/layers/validation-layer-runner";
import type { ValidationRuleDefinition } from "../../../packages/ectd-validation/src/profile/validation-profile.types";
import type { ValidationFinding } from "../../../packages/ectd-validation/src/interfaces/validation-engine.interface";
import { DEFAULT_SEVERITY_POLICY } from "../../../packages/ectd-validation/src/profile/validation-profile.types";

// ── Helpers ───────────────────────────────────────────────────────────────

function makeContext(
  overrides: Partial<ValidationContext> = {},
): ValidationContext {
  return {
    engineVersion: "0.1.0-test",
    profileVersion: "1.0",
    schemaPackageAvailable: false,
    cvPackageAvailable: false,
    ichRulesAvailable: false,
    regionalRulesAvailable: false,
    ...overrides,
  };
}

function makeRule(
  layer: ValidationRuleDefinition["layer"],
  ruleCode: string,
): ValidationRuleDefinition {
  return {
    ruleCode,
    name: `Test Rule ${ruleCode}`,
    severity: "ERROR",
    scope: "SubmissionUnit",
    source: "INTERNAL",
    version: "1.0",
    layer,
    definition: {},
  };
}

function makeLayerInput(
  rules: ValidationRuleDefinition[],
  context: ValidationContext,
  blockOnWarning = false,
): LayerInput {
  return {
    submissionUnitId: "unit-001",
    snapshotId: "snap-001",
    rules,
    severityPolicy: {
      ...DEFAULT_SEVERITY_POLICY,
      blockingOnWarning: blockOnWarning,
    },
    context,
  };
}

function makePassExecutor(): RuleExecutor {
  return {
    canExecute: () => true,
    execute: async (rule) => [
      {
        ruleCode: rule.ruleCode,
        severity: "ERROR",
        status: "PASS",
        message: "passed",
        source: "INTERNAL",
      },
    ],
  };
}

function makeFailExecutor(): RuleExecutor {
  return {
    canExecute: () => true,
    execute: async (rule) => [
      {
        ruleCode: rule.ruleCode,
        severity: "ERROR",
        status: "FAIL",
        message: "failed",
        source: "INTERNAL",
      },
    ],
  };
}

function makeWarningExecutor(): RuleExecutor {
  return {
    canExecute: () => true,
    execute: async (rule) => [
      {
        ruleCode: rule.ruleCode,
        severity: "WARNING",
        status: "FAIL",
        message: "warning",
        source: "INTERNAL",
      },
    ],
  };
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("ValidationLayerRunner (spec §27)", () => {
  describe("layer ordering", () => {
    it("should run STRUCTURAL layer first", async () => {
      const rules = [
        makeRule("STRUCTURAL", "STRUCT_TEST"),
        makeRule("XML_SCHEMA", "XML_TEST"),
      ];
      const executedLayers: string[] = [];
      const executor: RuleExecutor = {
        canExecute: (rule, ctx) => rule.layer === "STRUCTURAL",
        execute: async (rule) => {
          executedLayers.push(rule.layer);
          return [
            {
              ruleCode: rule.ruleCode,
              severity: "INFO",
              status: "PASS",
              message: "",
              source: "INTERNAL",
            },
          ];
        },
      };

      await runValidationLayers(makeLayerInput(rules, makeContext()), executor);
      expect(executedLayers[0]).toBe("STRUCTURAL");
    });

    it("should produce results for all 6 layers", async () => {
      const results = await runValidationLayers(
        makeLayerInput([], makeContext()),
        makePassExecutor(),
      );
      expect(results).toHaveLength(6);
    });
  });

  describe("blocking behaviour — spec §27", () => {
    it("should skip subsequent layers when STRUCTURAL layer has blocking errors", async () => {
      const rules = [makeRule("STRUCTURAL", "STRUCT_FAIL")];
      const results = await runValidationLayers(
        makeLayerInput(rules, makeContext()),
        makeFailExecutor(),
      );

      const structural = results.find((r) => r.layer === "STRUCTURAL");
      expect(structural?.hasBlockingErrors).toBe(true);

      // All subsequent layers must be skipped
      const skipped = results.filter(
        (r) => r.layer !== "STRUCTURAL" && r.skipped,
      );
      expect(skipped.length).toBe(5);
    });

    it("should NOT skip subsequent layers for non-blocking warnings — spec §25", async () => {
      const rules = [makeRule("STRUCTURAL", "STRUCT_WARN")];
      // WARNING with blockingOnWarning = false (default)
      const results = await runValidationLayers(
        makeLayerInput(rules, makeContext(), false), // don't block on warnings
        makeWarningExecutor(),
      );

      const structural = results.find((r) => r.layer === "STRUCTURAL");
      expect(structural?.hasBlockingErrors).toBe(false);

      // Subsequent layers should NOT be skipped (no blocking errors)
      // They will be skipped due to no rules/packages, but not due to blocking
      const blockedDueToError = results.filter(
        (r) =>
          r.layer !== "STRUCTURAL" &&
          r.skipped &&
          r.skipReason?.includes("blocking"),
      );
      expect(blockedDueToError).toHaveLength(0);
    });

    it("should block on WARNING when policy says blockingOnWarning = true — spec §25", async () => {
      const rules = [makeRule("STRUCTURAL", "STRUCT_WARN")];
      const results = await runValidationLayers(
        makeLayerInput(rules, makeContext(), true), // block on warnings
        makeWarningExecutor(),
      );

      const structural = results.find((r) => r.layer === "STRUCTURAL");
      expect(structural?.hasBlockingErrors).toBe(true);

      const skipped = results.filter(
        (r) => r.layer !== "STRUCTURAL" && r.skipped,
      );
      expect(skipped.length).toBe(5);
    });
  });

  describe("REGULATORY_GAP layers", () => {
    it("should mark layers with no rules as skipped with INFO finding", async () => {
      const results = await runValidationLayers(
        makeLayerInput([], makeContext()),
        makePassExecutor(),
      );

      for (const result of results) {
        expect(result.skipped).toBe(true);
        expect(result.findings.length).toBeGreaterThanOrEqual(1);
        // INFO severity for gap messages
        expect(result.findings[0]?.severity).toBe("INFO");
        expect(result.findings[0]?.status).toBe("SKIP");
      }
    });

    it("REGULATORY_GAP message should be in XML_SCHEMA layer when schema not available", async () => {
      const results = await runValidationLayers(
        makeLayerInput([], makeContext({ schemaPackageAvailable: false })),
        makePassExecutor(),
      );

      const xmlLayer = results.find((r) => r.layer === "XML_SCHEMA");
      expect(xmlLayer?.findings[0]?.message).toMatch(/REGULATORY_GAP/);
    });
  });
});

// ── Validation cache key ──────────────────────────────────────────────────

describe("buildCacheKey (spec §28)", () => {
  it("should include all three components", async () => {
    const { buildCacheKey } = await import(
      "../../../packages/ectd-validation/src/cache/validation-cache"
    );
    const key = buildCacheKey({
      fileChecksum: "abc123",
      engineVersion: "1.0",
      profileVersion: "2.0",
    });
    expect(key).toContain("abc123");
    expect(key).toContain("1.0");
    expect(key).toContain("2.0");
  });

  it("should produce different keys for different checksums", async () => {
    const { buildCacheKey } = await import(
      "../../../packages/ectd-validation/src/cache/validation-cache"
    );
    const k1 = buildCacheKey({
      fileChecksum: "aaa",
      engineVersion: "1.0",
      profileVersion: "1.0",
    });
    const k2 = buildCacheKey({
      fileChecksum: "bbb",
      engineVersion: "1.0",
      profileVersion: "1.0",
    });
    expect(k1).not.toBe(k2);
  });

  it("should produce different keys for different profile versions", async () => {
    const { buildCacheKey } = await import(
      "../../../packages/ectd-validation/src/cache/validation-cache"
    );
    const k1 = buildCacheKey({
      fileChecksum: "abc",
      engineVersion: "1.0",
      profileVersion: "1.0",
    });
    const k2 = buildCacheKey({
      fileChecksum: "abc",
      engineVersion: "1.0",
      profileVersion: "2.0",
    });
    expect(k1).not.toBe(k2);
  });
});
