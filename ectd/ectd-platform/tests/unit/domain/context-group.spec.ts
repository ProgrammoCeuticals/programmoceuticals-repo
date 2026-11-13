/**
 * Unit tests — ContextGroup normalization
 * spec §15, §49.
 *
 * Do not compare raw unordered JSON as the definition of context equality.
 * Normalize according to authoritative rules — spec §15.
 *
 * REGULATORY_GAP: The exact normalization algorithm must be confirmed
 * against ICH eCTD v4.0 IG v1.7 before production use.
 * These tests verify the normalization contract, not regulatory correctness.
 */

import {
  normalizeContextGroup,
  contextGroupsAreEqual,
  type ContextGroup,
} from "../../../packages/ectd-domain/src/context-of-use/context-group";

// ── Test fixtures — SYNTHETIC ─────────────────────────────────────────────

const groupA: ContextGroup = {
  contextCode: "3.2.P.1",
  codeSystem: "2.16.840.1.113883.3.26.1.1",
  keywords: [
    { code: "drugName", codeSystem: "local", value: "Amoxicillin" },
    { code: "strength", codeSystem: "local", value: "500mg" },
  ],
};

const groupA_reversed: ContextGroup = {
  contextCode: "3.2.P.1",
  codeSystem: "2.16.840.1.113883.3.26.1.1",
  keywords: [
    { code: "strength", codeSystem: "local", value: "500mg" },
    { code: "drugName", codeSystem: "local", value: "Amoxicillin" },
  ],
};

const groupB: ContextGroup = {
  contextCode: "3.2.S.1.1",
  codeSystem: "2.16.840.1.113883.3.26.1.1",
  keywords: [
    {
      code: "drugSubstance",
      codeSystem: "local",
      value: "AmoxicillinTrihydrate",
    },
  ],
};

const groupEmpty: ContextGroup = {
  contextCode: "3.2.P.1",
  codeSystem: "2.16.840.1.113883.3.26.1.1",
  keywords: [],
};

// ── Tests ─────────────────────────────────────────────────────────────────

describe("ContextGroup normalization (spec §15)", () => {
  describe("normalizeContextGroup", () => {
    it("should produce a string representation", () => {
      const n = normalizeContextGroup(groupA);
      expect(typeof n).toBe("string");
      expect(n.length).toBeGreaterThan(0);
    });

    it("should include contextCode, codeSystem, and all keyword fields", () => {
      const n = normalizeContextGroup(groupA);
      expect(n).toContain("3.2.P.1");
      expect(n).toContain("Amoxicillin");
      expect(n).toContain("500mg");
    });

    it("should produce the same result regardless of keyword order — spec §15", () => {
      const n1 = normalizeContextGroup(groupA);
      const n2 = normalizeContextGroup(groupA_reversed);
      expect(n1).toBe(n2);
    });

    it("should produce different results for different context codes", () => {
      const n1 = normalizeContextGroup(groupA);
      const n2 = normalizeContextGroup(groupB);
      expect(n1).not.toBe(n2);
    });

    it("should handle empty keywords array", () => {
      const n = normalizeContextGroup(groupEmpty);
      expect(n).toBeTruthy();
      expect(n).toContain("3.2.P.1");
    });
  });

  describe("contextGroupsAreEqual", () => {
    it("should return true for identical groups", () => {
      expect(contextGroupsAreEqual(groupA, groupA)).toBe(true);
    });

    it("should return true when keywords are in different order", () => {
      expect(contextGroupsAreEqual(groupA, groupA_reversed)).toBe(true);
    });

    it("should return false for groups with different context codes", () => {
      expect(contextGroupsAreEqual(groupA, groupB)).toBe(false);
    });

    it("should return false when one group has extra keywords", () => {
      const groupWithExtra: ContextGroup = {
        ...groupA,
        keywords: [
          ...groupA.keywords,
          { code: "extra", codeSystem: "local", value: "extra" },
        ],
      };
      expect(contextGroupsAreEqual(groupA, groupWithExtra)).toBe(false);
    });

    it("should return false when keyword value differs", () => {
      const groupDifferentValue: ContextGroup = {
        ...groupA,
        keywords: [
          { code: "drugName", codeSystem: "local", value: "DifferentDrug" },
          { code: "strength", codeSystem: "local", value: "500mg" },
        ],
      };
      expect(contextGroupsAreEqual(groupA, groupDifferentValue)).toBe(false);
    });

    it("should return false when code system differs", () => {
      const groupDiffSystem: ContextGroup = {
        ...groupA,
        codeSystem: "different.oid.here",
      };
      expect(contextGroupsAreEqual(groupA, groupDiffSystem)).toBe(false);
    });
  });
});
