/**
 * Unit tests — SenderIdentity resolution
 * User requirement: do not invent OID; block publication when missing.
 *
 * Tests:
 *   - missing env var → not configured
 *   - empty env var → not configured
 *   - REGULATORY_GAP placeholder → not configured (guard against copy-paste)
 *   + valid OID → configured with correct value
 *   + name is optional
 */

import { resolveSenderIdentity } from "../../../packages/ectd-xml/src/config/sender-identity";

function withEnv(
  oid: string | undefined,
  name: string | undefined,
  fn: () => void,
): void {
  const prevOid = process.env["ECTD_SENDER_OID"];
  const prevName = process.env["ECTD_SENDER_NAME"];
  try {
    if (oid === undefined) delete process.env["ECTD_SENDER_OID"];
    else process.env["ECTD_SENDER_OID"] = oid;
    if (name === undefined) delete process.env["ECTD_SENDER_NAME"];
    else process.env["ECTD_SENDER_NAME"] = name;
    fn();
  } finally {
    if (prevOid === undefined) delete process.env["ECTD_SENDER_OID"];
    else process.env["ECTD_SENDER_OID"] = prevOid;
    if (prevName === undefined) delete process.env["ECTD_SENDER_NAME"];
    else process.env["ECTD_SENDER_NAME"] = prevName;
  }
}

describe("SenderIdentity resolution", () => {
  it("should return not-configured when ECTD_SENDER_OID is not set", () => {
    withEnv(undefined, undefined, () => {
      const result = resolveSenderIdentity();
      expect(result.configured).toBe(false);
      if (!result.configured) {
        expect(result.reason).toBe("SENDER_IDENTITY_NOT_CONFIGURED");
        expect(result.message).toMatch(/ECTD_SENDER_OID/i);
      }
    });
  });

  it("should return not-configured when ECTD_SENDER_OID is empty", () => {
    withEnv("", undefined, () => {
      const result = resolveSenderIdentity();
      expect(result.configured).toBe(false);
    });
  });

  it("should return not-configured when ECTD_SENDER_OID contains REGULATORY_GAP placeholder", () => {
    withEnv("REGULATORY_GAP:something", undefined, () => {
      const result = resolveSenderIdentity();
      expect(result.configured).toBe(false);
    });
  });

  it("should return configured with the correct OID", () => {
    withEnv("2.16.840.1.999.1.2", "Test Org", () => {
      const result = resolveSenderIdentity();
      expect(result.configured).toBe(true);
      if (result.configured) {
        expect(result.identity.oid).toBe("2.16.840.1.999.1.2");
        expect(result.identity.name).toBe("Test Org");
      }
    });
  });

  it("should return configured even without a name (name is optional)", () => {
    withEnv("2.16.840.1.999.1.2", undefined, () => {
      const result = resolveSenderIdentity();
      expect(result.configured).toBe(true);
      if (result.configured) {
        expect(result.identity.name).toBeUndefined();
      }
    });
  });
});
