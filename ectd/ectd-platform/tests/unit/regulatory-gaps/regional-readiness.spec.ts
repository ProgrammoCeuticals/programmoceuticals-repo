/**
 * Unit tests — RegionalReadiness
 * User requirement: NAFDAC NOT_CONFIGURED; no invented specs.
 *
 * Tests:
 *   + Nigeria/NAFDAC is NOT_CONFIGURED with correct message
 *   + NAFDAC is not productionReady
 *   + assertRegionalReadiness throws for NAFDAC
 *   + US/FDA is NOT_CONFIGURED (package not yet imported)
 *   + unknown region returns NOT_CONFIGURED
 *   + message never claims fabricated requirements
 */

import {
  getRegionalReadiness,
  assertRegionalReadiness,
} from "../../../packages/ectd-standards/src/regulatory-package/regional-readiness";

describe("RegionalReadiness — NAFDAC / Nigeria", () => {
  it("should have status NOT_CONFIGURED for Nigeria/NAFDAC", () => {
    const result = getRegionalReadiness("NG", "NAFDAC");
    expect(result.status).toBe("NOT_CONFIGURED");
  });

  it("should not be productionReady for NAFDAC", () => {
    const result = getRegionalReadiness("NG", "NAFDAC");
    expect(result.productionReady).toBe(false);
  });

  it("message should explicitly state eCTD v4.0 spec not published", () => {
    const result = getRegionalReadiness("NG", "NAFDAC");
    expect(result.message).toMatch(/not.*published|not have.*published/i);
  });

  it("message should say do not fabricate requirements", () => {
    const result = getRegionalReadiness("NG", "NAFDAC");
    expect(result.message).toMatch(/fabricate|invent/i);
  });

  it("assertRegionalReadiness should throw for NAFDAC", () => {
    expect(() => assertRegionalReadiness("NG", "NAFDAC")).toThrow(
      /REGULATORY_GAP/,
    );
  });

  it("error message should include NOT_CONFIGURED status", () => {
    try {
      assertRegionalReadiness("NG", "NAFDAC");
      fail("Expected to throw");
    } catch (err) {
      expect(String(err)).toMatch(/NOT_CONFIGURED/);
    }
  });
});

describe("RegionalReadiness — US/FDA", () => {
  it("should have status NOT_CONFIGURED until package is imported", () => {
    const result = getRegionalReadiness("US", "FDA");
    expect(result.status).toBe("NOT_CONFIGURED");
    expect(result.productionReady).toBe(false);
  });

  it("message should mention importing the FDA package", () => {
    const result = getRegionalReadiness("US", "FDA");
    expect(result.message).toMatch(/import/i);
  });
});

describe("RegionalReadiness — unknown region", () => {
  it("should return NOT_CONFIGURED for an unregistered region/authority", () => {
    const result = getRegionalReadiness("XX", "UNKNOWN_AUTHORITY");
    expect(result.status).toBe("NOT_CONFIGURED");
    expect(result.productionReady).toBe(false);
  });
});
