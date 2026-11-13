/**
 * Unit tests — PublishGate
 * spec §30, §49.
 *
 * Tests cover:
 *   + gate passes when all prerequisites met
 *   - already PUBLISHED blocks immediately
 *   - no snapshot blocks
 *   - no passed validation blocks
 *   - no XML run blocks
 *   - no IG linked blocks
 *   - no CoUs blocks
 *   - documents without versions block (one per document)
 *   + all issues reported together (not short-circuit on first failure)
 */

import {
  runPublishGate,
  type PublishGateInput,
} from "../../../packages/ectd-publishing/src/gate/publish-gate";

function makeInput(
  overrides: Partial<PublishGateInput> = {},
): PublishGateInput {
  return {
    submissionUnitId: "unit-001",
    unitStatus: "DRAFT",
    hasSnapshot: true,
    hasPassedValidation: true,
    validationCompletionStatus: "VALID",
    hasSucceededXmlRun: true,
    standardHasImplementationGuide: true,
    documentsWithNoVersions: [],
    couCount: 2,
    senderIdentityConfigured: true,
    ...overrides,
  };
}

describe("PublishGate (spec §30)", () => {
  describe("gate passes", () => {
    it("should pass when all prerequisites are met", () => {
      const result = runPublishGate(makeInput());
      expect(result.passed).toBe(true);
      expect(result.issues).toHaveLength(0);
    });
  });

  describe("blocking conditions", () => {
    it("should block and return immediately if already PUBLISHED", () => {
      const result = runPublishGate(makeInput({ unitStatus: "PUBLISHED" }));
      expect(result.passed).toBe(false);
      expect(result.issues[0]).toMatch(/already PUBLISHED/i);
      // Should short-circuit — no other issues checked
      expect(result.issues).toHaveLength(1);
    });

    it("should block if no snapshot exists", () => {
      const result = runPublishGate(makeInput({ hasSnapshot: false }));
      expect(result.passed).toBe(false);
      expect(result.issues.some((i) => /snapshot/i.test(i))).toBe(true);
    });

    it("should block if no passed validation run", () => {
      const result = runPublishGate(makeInput({ hasPassedValidation: false }));
      expect(result.passed).toBe(false);
      expect(result.issues.some((i) => /validation/i.test(i))).toBe(true);
    });

    it("should block if no succeeded XML generation run", () => {
      const result = runPublishGate(makeInput({ hasSucceededXmlRun: false }));
      expect(result.passed).toBe(false);
      expect(result.issues.some((i) => /xml/i.test(i))).toBe(true);
    });

    it("should block if no Implementation Guide linked", () => {
      const result = runPublishGate(
        makeInput({ standardHasImplementationGuide: false }),
      );
      expect(result.passed).toBe(false);
      expect(result.issues.some((i) => /Implementation Guide/i.test(i))).toBe(
        true,
      );
    });

    it("should block if sender identity is not configured", () => {
      const result = runPublishGate(
        makeInput({ senderIdentityConfigured: false }),
      );
      expect(result.passed).toBe(false);
      expect(
        result.issues.some((i) => /SENDER_IDENTITY_NOT_CONFIGURED/i.test(i)),
      ).toBe(true);
    });

    it("should block if validation completionStatus is INCOMPLETE_REGULATORY_VALIDATION", () => {
      const result = runPublishGate(
        makeInput({
          hasPassedValidation: true,
          validationCompletionStatus: "INCOMPLETE_REGULATORY_VALIDATION",
        }),
      );
      expect(result.passed).toBe(false);
      expect(
        result.issues.some((i) => /INCOMPLETE_REGULATORY_VALIDATION/i.test(i)),
      ).toBe(true);
    });

    it("should block if validation completionStatus is REGULATORY_GAP", () => {
      const result = runPublishGate(
        makeInput({
          hasPassedValidation: true,
          validationCompletionStatus: "REGULATORY_GAP",
        }),
      );
      expect(result.passed).toBe(false);
      expect(result.issues.some((i) => /REGULATORY_GAP/i.test(i))).toBe(true);
    });

    it("should NOT block for VALID_WITH_WARNINGS validation status", () => {
      const result = runPublishGate(
        makeInput({
          hasPassedValidation: true,
          validationCompletionStatus: "VALID_WITH_WARNINGS",
        }),
      );
      // warnings don't block (profile-driven — spec §25)
      const validationIssues = result.issues.filter((i) =>
        /INCOMPLETE|REGULATORY_GAP/i.test(i),
      );
      expect(validationIssues).toHaveLength(0);
    });

    it("should block if no Contexts of Use", () => {
      const result = runPublishGate(makeInput({ couCount: 0 }));
      expect(result.passed).toBe(false);
      expect(result.issues.some((i) => /Contexts of Use/i.test(i))).toBe(true);
    });

    it("should block for each document without versions", () => {
      const result = runPublishGate(
        makeInput({ documentsWithNoVersions: ["doc-1", "doc-2"] }),
      );
      expect(result.passed).toBe(false);
      const docIssues = result.issues.filter(
        (i) => i.includes("doc-1") || i.includes("doc-2"),
      );
      expect(docIssues).toHaveLength(2);
    });
  });

  describe("all issues reported together", () => {
    it("should return all blocking issues, not just the first", () => {
      const result = runPublishGate(
        makeInput({
          hasSnapshot: false,
          hasPassedValidation: false,
          hasSucceededXmlRun: false,
          standardHasImplementationGuide: false,
          couCount: 0,
          documentsWithNoVersions: ["doc-x"],
        }),
      );
      expect(result.passed).toBe(false);
      expect(result.issues.length).toBeGreaterThanOrEqual(5);
    });
  });
});
