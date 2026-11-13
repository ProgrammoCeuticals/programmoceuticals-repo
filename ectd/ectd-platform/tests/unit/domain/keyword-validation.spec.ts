/**
 * Unit tests — keyword value validation
 * spec §19, §49.
 *
 * Tests:
 *   + STRING type — any non-empty string is valid
 *   + CODE type — value must be in allowedValues
 *   + INTEGER type — must be a whole number
 *   + BOOLEAN type — must be "true" or "false"
 *   - empty value always invalid
 *   - CODE value not in allowed list
 *   - non-integer for INTEGER type
 */

import {
  validateKeywordValue,
  type KeywordDefinitionRecord,
} from "../../../packages/ectd-domain/src/keywords/keyword.types";

function makeDef(
  overrides: Partial<KeywordDefinitionRecord>,
): KeywordDefinitionRecord {
  return {
    id: "kd-001",
    applicationId: "app-001",
    code: "testKeyword",
    name: "Test Keyword",
    description: null,
    dataType: "STRING",
    allowedValues: null,
    ...overrides,
  };
}

describe("validateKeywordValue (spec §19)", () => {
  // ── STRING ───────────────────────────────────────────────────────────
  describe("STRING type", () => {
    it("should accept any non-empty string", () => {
      const result = validateKeywordValue(
        "Amoxicillin",
        makeDef({ dataType: "STRING" }),
      );
      expect(result.valid).toBe(true);
    });

    it("should reject empty string", () => {
      const result = validateKeywordValue("", makeDef({ dataType: "STRING" }));
      expect(result.valid).toBe(false);
    });

    it("should reject whitespace-only string", () => {
      const result = validateKeywordValue(
        "   ",
        makeDef({ dataType: "STRING" }),
      );
      expect(result.valid).toBe(false);
    });
  });

  // ── CODE ─────────────────────────────────────────────────────────────
  describe("CODE type", () => {
    const def = makeDef({
      dataType: "CODE",
      allowedValues: ["NDA", "ANDA", "BLA"],
    });

    it("should accept a value in the allowed list", () => {
      expect(validateKeywordValue("NDA", def).valid).toBe(true);
      expect(validateKeywordValue("BLA", def).valid).toBe(true);
    });

    it("should reject a value not in the allowed list", () => {
      const result = validateKeywordValue("MAA", def);
      expect(result.valid).toBe(false);
      expect(result.message).toMatch(/not in the allowed list/i);
    });

    it("should list allowed values in the error message", () => {
      const result = validateKeywordValue("INVALID", def);
      expect(result.message).toContain("NDA");
      expect(result.message).toContain("ANDA");
    });

    it("should accept any value when allowedValues is null (no restriction)", () => {
      const unrestrictedDef = makeDef({
        dataType: "CODE",
        allowedValues: null,
      });
      const result = validateKeywordValue("ANYTHING", unrestrictedDef);
      expect(result.valid).toBe(true);
    });
  });

  // ── INTEGER ──────────────────────────────────────────────────────────
  describe("INTEGER type", () => {
    const def = makeDef({ dataType: "INTEGER" });

    it("should accept a valid integer string", () => {
      expect(validateKeywordValue("42", def).valid).toBe(true);
      expect(validateKeywordValue("0", def).valid).toBe(true);
      expect(validateKeywordValue("-5", def).valid).toBe(true);
    });

    it("should reject a decimal number", () => {
      const result = validateKeywordValue("3.14", def);
      expect(result.valid).toBe(false);
      expect(result.message).toMatch(/integer/i);
    });

    it("should reject a non-numeric string", () => {
      expect(validateKeywordValue("abc", def).valid).toBe(false);
    });
  });

  // ── BOOLEAN ──────────────────────────────────────────────────────────
  describe("BOOLEAN type", () => {
    const def = makeDef({ dataType: "BOOLEAN" });

    it('should accept "true"', () => {
      expect(validateKeywordValue("true", def).valid).toBe(true);
    });

    it('should accept "false"', () => {
      expect(validateKeywordValue("false", def).valid).toBe(true);
    });

    it("should reject anything else", () => {
      expect(validateKeywordValue("yes", def).valid).toBe(false);
      expect(validateKeywordValue("1", def).valid).toBe(false);
      expect(validateKeywordValue("True", def).valid).toBe(false);
    });
  });

  // ── DATE — no special validation beyond non-empty ────────────────────
  describe("DATE type", () => {
    const def = makeDef({ dataType: "DATE" });

    it("should accept a non-empty string (format validation is Phase 8)", () => {
      expect(validateKeywordValue("2024-01-01", def).valid).toBe(true);
    });
  });
});
