/**
 * Unit tests — ReuseValidator
 * spec §17, §49.
 *
 * Tests cover:
 *   + can reuse when all prerequisites met
 *   - blocked: no document version
 *   - blocked: physical file not available
 *   - blocked: target unit is PUBLISHED
 *   ~ warning: same submission unit (not a blocker)
 *   ~ warning: regional constraints always noted
 */

import { ReuseValidator } from "../../../packages/ectd-documents/src/reuse/reuse-validator";
import type { ReuseCheckInput } from "../../../packages/ectd-documents/src/reuse/reuse-validator";

function makeInput(overrides: Partial<ReuseCheckInput> = {}): ReuseCheckInput {
  return {
    documentId: "doc-001",
    documentHasVersion: true,
    documentVersionStorageKeyExists: true,
    targetSubmissionUnitStatus: "DRAFT",
    targetContextDefinitionId: "cd-001",
    sourceSubmissionUnitId: "unit-001",
    targetSubmissionUnitId: "unit-002",
    ...overrides,
  };
}

describe("ReuseValidator (spec §17)", () => {
  // ── Positive ────────────────────────────────────────────────────────
  describe("validate — can reuse", () => {
    it("should allow reuse when all prerequisites are met", () => {
      const validator = new ReuseValidator();
      const result = validator.validate(makeInput());
      expect(result.canReuse).toBe(true);

      const blockers = result.findings.filter((f) => f.severity === "BLOCKING");
      expect(blockers).toHaveLength(0);
    });
  });

  // ── Negative: no version ────────────────────────────────────────────
  describe("validate — no document version", () => {
    it("should block when document has no versions", () => {
      const validator = new ReuseValidator();
      const result = validator.validate(
        makeInput({ documentHasVersion: false }),
      );
      expect(result.canReuse).toBe(false);

      const finding = result.findings.find(
        (f) => f.code === "NO_DOCUMENT_VERSION",
      );
      expect(finding).toBeDefined();
      expect(finding!.severity).toBe("BLOCKING");
    });
  });

  // ── Negative: file not available ─────────────────────────────────────
  describe("validate — physical file unavailable", () => {
    it("should block when file is not in storage", () => {
      const validator = new ReuseValidator();
      const result = validator.validate(
        makeInput({ documentVersionStorageKeyExists: false }),
      );
      expect(result.canReuse).toBe(false);

      const finding = result.findings.find(
        (f) => f.code === "PHYSICAL_FILE_UNAVAILABLE",
      );
      expect(finding).toBeDefined();
      expect(finding!.severity).toBe("BLOCKING");
    });

    it("should not report PHYSICAL_FILE_UNAVAILABLE when document has no version at all", () => {
      // If there's no version, the storage check is skipped (no key to check)
      const validator = new ReuseValidator();
      const result = validator.validate(
        makeInput({
          documentHasVersion: false,
          documentVersionStorageKeyExists: false,
        }),
      );

      const storageFindings = result.findings.filter(
        (f) => f.code === "PHYSICAL_FILE_UNAVAILABLE",
      );
      expect(storageFindings).toHaveLength(0); // not reported when no version exists
    });
  });

  // ── Negative: target unit published ──────────────────────────────────
  describe("validate — target unit is PUBLISHED", () => {
    it("should block when target submission unit is PUBLISHED", () => {
      const validator = new ReuseValidator();
      const result = validator.validate(
        makeInput({ targetSubmissionUnitStatus: "PUBLISHED" }),
      );
      expect(result.canReuse).toBe(false);

      const finding = result.findings.find(
        (f) => f.code === "TARGET_UNIT_PUBLISHED",
      );
      expect(finding).toBeDefined();
      expect(finding!.severity).toBe("BLOCKING");
    });
  });

  // ── Warning: same unit ────────────────────────────────────────────────
  describe("validate — same source and target unit", () => {
    it("should produce a WARNING (not block) for same-unit reuse", () => {
      const validator = new ReuseValidator();
      const result = validator.validate(
        makeInput({
          sourceSubmissionUnitId: "unit-same",
          targetSubmissionUnitId: "unit-same",
        }),
      );
      expect(result.canReuse).toBe(true); // warnings don't block

      const warning = result.findings.find(
        (f) => f.code === "SAME_SUBMISSION_UNIT",
      );
      expect(warning).toBeDefined();
      expect(warning!.severity).toBe("WARNING");
    });
  });

  // ── Warning: regional constraints always noted ────────────────────────
  describe("validate — regional constraints gap", () => {
    it("should always include a REGULATORY_GAP warning about regional constraints", () => {
      const validator = new ReuseValidator();
      const result = validator.validate(makeInput());

      const gap = result.findings.find(
        (f) => f.code === "REGIONAL_CONSTRAINTS_NOT_VALIDATED",
      );
      expect(gap).toBeDefined();
      expect(gap!.severity).toBe("WARNING");
      expect(gap!.message).toMatch(/REGULATORY_GAP/);
    });
  });

  // ── Multiple blockers reported together ──────────────────────────────
  describe("validate — multiple blockers", () => {
    it("should report all blockers, not just the first", () => {
      const validator = new ReuseValidator();
      const result = validator.validate(
        makeInput({
          documentHasVersion: false,
          documentVersionStorageKeyExists: false,
          targetSubmissionUnitStatus: "PUBLISHED",
        }),
      );

      expect(result.canReuse).toBe(false);
      const blockers = result.findings.filter((f) => f.severity === "BLOCKING");
      // NO_DOCUMENT_VERSION + TARGET_UNIT_PUBLISHED (storage skip when no version)
      expect(blockers.length).toBeGreaterThanOrEqual(2);
    });
  });
});
