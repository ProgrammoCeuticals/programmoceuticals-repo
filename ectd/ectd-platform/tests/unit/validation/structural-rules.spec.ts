/**
 * Unit tests — Structural validation rules (Layer 1)
 * spec §24, §27, §49.
 *
 * Tests cover every INTERNAL structural rule:
 *   STRUCT_001: snapshot required
 *   STRUCT_002: at least one CoU required
 *   STRUCT_003: each CoU has a document
 *   STRUCT_004: each document has a version
 *   STRUCT_005: standard is ACTIVE
 *   STRUCT_006: no OBSOLETE CoUs (WARNING)
 *
 * Rule source must be 'INTERNAL' — never presented as ICH/REGIONAL.
 */

import {
  STRUCTURAL_RULE_DEFINITIONS,
  executeStructuralRule,
  type StructuralCheckInput,
} from "../../../packages/ectd-validation/src/rules/structural-rules";

function makeInput(
  overrides: Partial<StructuralCheckInput> = {},
): StructuralCheckInput {
  return {
    submissionUnitId: "unit-001",
    hasSnapshot: true,
    couCount: 2,
    cousMissingDocuments: [],
    documentsWithNoVersions: [],
    standardIsActive: true,
    obsoleteCouIds: [],
    ...overrides,
  };
}

describe("Structural validation rules — Layer 1 (spec §24)", () => {
  describe("rule sources", () => {
    it("all structural rules must have source INTERNAL — spec §24", () => {
      for (const rule of STRUCTURAL_RULE_DEFINITIONS) {
        expect(rule.source).toBe("INTERNAL");
      }
    });

    it("all structural rules must be in the STRUCTURAL layer", () => {
      for (const rule of STRUCTURAL_RULE_DEFINITIONS) {
        expect(rule.layer).toBe("STRUCTURAL");
      }
    });
  });

  describe("STRUCT_001 — snapshot required", () => {
    const rule = STRUCTURAL_RULE_DEFINITIONS.find(
      (r) => r.ruleCode === "STRUCT_001",
    )!;

    it("should PASS when snapshot exists", () => {
      const findings = executeStructuralRule(
        rule,
        makeInput({ hasSnapshot: true }),
      );
      expect(findings[0]?.status).toBe("PASS");
    });

    it("should FAIL when no snapshot exists", () => {
      const findings = executeStructuralRule(
        rule,
        makeInput({ hasSnapshot: false }),
      );
      expect(findings[0]?.status).toBe("FAIL");
      expect(findings[0]?.severity).toBe("ERROR");
    });

    it("FAIL message mentions freeze command", () => {
      const findings = executeStructuralRule(
        rule,
        makeInput({ hasSnapshot: false }),
      );
      expect(findings[0]?.message).toMatch(/freeze/i);
    });
  });

  describe("STRUCT_002 — at least one CoU", () => {
    const rule = STRUCTURAL_RULE_DEFINITIONS.find(
      (r) => r.ruleCode === "STRUCT_002",
    )!;

    it("should PASS when couCount > 0", () => {
      const findings = executeStructuralRule(rule, makeInput({ couCount: 3 }));
      expect(findings[0]?.status).toBe("PASS");
    });

    it("should FAIL when no CoUs", () => {
      const findings = executeStructuralRule(rule, makeInput({ couCount: 0 }));
      expect(findings[0]?.status).toBe("FAIL");
      expect(findings[0]?.severity).toBe("ERROR");
    });
  });

  describe("STRUCT_003 — CoUs must have documents", () => {
    const rule = STRUCTURAL_RULE_DEFINITIONS.find(
      (r) => r.ruleCode === "STRUCT_003",
    )!;

    it("should PASS when all CoUs have documents", () => {
      const findings = executeStructuralRule(
        rule,
        makeInput({ cousMissingDocuments: [] }),
      );
      expect(findings[0]?.status).toBe("PASS");
    });

    it("should produce one FAIL per CoU missing a document", () => {
      const findings = executeStructuralRule(
        rule,
        makeInput({ cousMissingDocuments: ["cou-a", "cou-b"] }),
      );
      const fails = findings.filter((f) => f.status === "FAIL");
      expect(fails).toHaveLength(2);
      expect(fails[0]?.entityId).toBe("cou-a");
      expect(fails[1]?.entityId).toBe("cou-b");
    });
  });

  describe("STRUCT_004 — documents must have versions", () => {
    const rule = STRUCTURAL_RULE_DEFINITIONS.find(
      (r) => r.ruleCode === "STRUCT_004",
    )!;

    it("should PASS when all documents have versions", () => {
      const findings = executeStructuralRule(
        rule,
        makeInput({ documentsWithNoVersions: [] }),
      );
      expect(findings[0]?.status).toBe("PASS");
    });

    it("should FAIL for each document without versions", () => {
      const findings = executeStructuralRule(
        rule,
        makeInput({ documentsWithNoVersions: ["doc-1"] }),
      );
      expect(findings[0]?.status).toBe("FAIL");
      expect(findings[0]?.entityId).toBe("doc-1");
      expect(findings[0]?.remediation).toBeTruthy();
    });
  });

  describe("STRUCT_005 — standard must be ACTIVE", () => {
    const rule = STRUCTURAL_RULE_DEFINITIONS.find(
      (r) => r.ruleCode === "STRUCT_005",
    )!;

    it("should PASS when standard is ACTIVE", () => {
      const findings = executeStructuralRule(
        rule,
        makeInput({ standardIsActive: true }),
      );
      expect(findings[0]?.status).toBe("PASS");
    });

    it("should FAIL when standard is not ACTIVE", () => {
      const findings = executeStructuralRule(
        rule,
        makeInput({ standardIsActive: false }),
      );
      expect(findings[0]?.status).toBe("FAIL");
      expect(findings[0]?.severity).toBe("ERROR");
    });
  });

  describe("STRUCT_006 — no OBSOLETE CoUs (WARNING)", () => {
    const rule = STRUCTURAL_RULE_DEFINITIONS.find(
      (r) => r.ruleCode === "STRUCT_006",
    )!;

    it("should PASS when no OBSOLETE CoUs", () => {
      const findings = executeStructuralRule(
        rule,
        makeInput({ obsoleteCouIds: [] }),
      );
      expect(findings[0]?.status).toBe("PASS");
    });

    it("should FAIL with WARNING severity for each OBSOLETE CoU", () => {
      const findings = executeStructuralRule(
        rule,
        makeInput({ obsoleteCouIds: ["cou-obs-1"] }),
      );
      expect(findings[0]?.status).toBe("FAIL");
      expect(findings[0]?.severity).toBe("WARNING");
      expect(findings[0]?.entityId).toBe("cou-obs-1");
    });
  });
});
