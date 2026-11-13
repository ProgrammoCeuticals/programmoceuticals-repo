/**
 * Unit tests — InteractionId resolution
 * User requirement: do not hard-code interactionId; block XML when missing.
 *
 * Tests:
 *   - null IG config → not available
 *   - empty IG config → not available
 *   - missing root or extension → not available
 *   + both present → available with correct values
 */

import { resolveInteractionId } from "../../../packages/ectd-xml/src/config/interaction-id";

describe("InteractionId resolution", () => {
  it("should return not available when igConfig is null", () => {
    const result = resolveInteractionId(null);
    expect(result.available).toBe(false);
    if (!result.available) {
      expect(result.reason).toBe("INTERACTION_ID_NOT_CONFIGURED");
      expect(result.message).toMatch(/ICH IG v1\.7/i);
    }
  });

  it("should return not available when igConfig is undefined", () => {
    const result = resolveInteractionId(undefined);
    expect(result.available).toBe(false);
  });

  it("should return not available when interactionIdRoot is missing", () => {
    const result = resolveInteractionId({
      interactionIdExtension: "PORX_TEST",
    });
    expect(result.available).toBe(false);
  });

  it("should return not available when interactionIdExtension is missing", () => {
    const result = resolveInteractionId({
      interactionIdRoot: "2.16.840.1.999",
    });
    expect(result.available).toBe(false);
  });

  it("should return available with correct values when both fields are present", () => {
    const result = resolveInteractionId({
      interactionIdRoot: "2.16.840.1.113883.1.6",
      interactionIdExtension: "PORX_IN000001UV01",
    });
    expect(result.available).toBe(true);
    if (result.available) {
      expect(result.config.root).toBe("2.16.840.1.113883.1.6");
      expect(result.config.extension).toBe("PORX_IN000001UV01");
    }
  });

  it("message should indicate the authoritative source", () => {
    const result = resolveInteractionId(null);
    if (!result.available) {
      expect(result.message).toMatch(/authoritative/i);
      expect(result.message).not.toMatch(/PORX_IN000001UV01/); // must not suggest a value
    }
  });
});
