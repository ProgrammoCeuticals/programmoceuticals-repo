/**
 * Unit tests — DomainToXmlMapper blocks on missing config
 * User requirement: do not produce placeholder production XML.
 *
 * Tests:
 *   - throws SenderIdentityMissingError when OID not configured
 *   - throws InteractionIdMissingError when IG config absent
 *   - throws RegulatoryConfigMissingError when moodCode absent
 *   + maps correctly when all config is present
 */

import {
  DomainToXmlMapper,
  SenderIdentityMissingError,
  InteractionIdMissingError,
  RegulatoryConfigMissingError,
  type DomainSnapshot,
} from "../../../packages/ectd-xml/src/mapper/domain-to-xml.mapper";

// ── Helpers ───────────────────────────────────────────────────────────────

function withSenderOid(oid: string | undefined, fn: () => void): void {
  const prev = process.env["ECTD_SENDER_OID"];
  try {
    if (oid === undefined) delete process.env["ECTD_SENDER_OID"];
    else process.env["ECTD_SENDER_OID"] = oid;
    fn();
  } finally {
    if (prev === undefined) delete process.env["ECTD_SENDER_OID"];
    else process.env["ECTD_SENDER_OID"] = prev;
  }
}

function makeFullSnapshot(): DomainSnapshot {
  return {
    submissionUnitUuid: "su-uuid-001",
    sequenceNumber: 1,
    creationTime: "2024-06-15T12:00:00.000Z",
    contextsOfUse: [],
    submissions: [],
    application: { uuid: "app-001", keywordDefinitions: [] },
    igPackageConfig: {
      interactionIdRoot: "2.16.840.1.113883.1.6",
      interactionIdExtension: "PORX_IN000001UV01",
      controlActProcessMoodCode: "EVN",
    },
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────

describe("DomainToXmlMapper — blocks on missing config", () => {
  const mapper = new DomainToXmlMapper();

  describe("sender identity required", () => {
    it("should throw SenderIdentityMissingError when ECTD_SENDER_OID is not set", () => {
      withSenderOid(undefined, () => {
        expect(() => mapper.map(makeFullSnapshot())).toThrow(
          SenderIdentityMissingError,
        );
      });
    });

    it("error message should mention ECTD_SENDER_OID", () => {
      withSenderOid(undefined, () => {
        try {
          mapper.map(makeFullSnapshot());
          fail("Expected to throw");
        } catch (err) {
          expect(String(err)).toMatch(/ECTD_SENDER_OID/);
        }
      });
    });
  });

  describe("interactionId required", () => {
    it("should throw InteractionIdMissingError when igPackageConfig is null", () => {
      withSenderOid("2.16.840.1.999.1", () => {
        const snapshot = { ...makeFullSnapshot(), igPackageConfig: null };
        expect(() => mapper.map(snapshot)).toThrow(InteractionIdMissingError);
      });
    });

    it("should throw when interactionIdRoot is missing", () => {
      withSenderOid("2.16.840.1.999.1", () => {
        const snapshot = {
          ...makeFullSnapshot(),
          igPackageConfig: {
            interactionIdRoot: "",
            interactionIdExtension: "PORX_IN000001UV01",
            controlActProcessMoodCode: "EVN",
          },
        };
        expect(() => mapper.map(snapshot)).toThrow(InteractionIdMissingError);
      });
    });
  });

  describe("moodCode required", () => {
    it("should throw RegulatoryConfigMissingError when moodCode is missing", () => {
      withSenderOid("2.16.840.1.999.1", () => {
        const snapshot = {
          ...makeFullSnapshot(),
          igPackageConfig: {
            interactionIdRoot: "2.16.840.1.113883.1.6",
            interactionIdExtension: "PORX_IN000001UV01",
            controlActProcessMoodCode: "",
          },
        };
        expect(() => mapper.map(snapshot)).toThrow(
          RegulatoryConfigMissingError,
        );
      });
    });

    it("error code should be IG_CONFIG_MISSING", () => {
      withSenderOid("2.16.840.1.999.1", () => {
        const snapshot = {
          ...makeFullSnapshot(),
          igPackageConfig: {
            interactionIdRoot: "2.16.840.1.113883.1.6",
            interactionIdExtension: "PORX_IN000001UV01",
            controlActProcessMoodCode: "",
          },
        };
        try {
          mapper.map(snapshot);
          fail("Expected to throw");
        } catch (err) {
          expect(err instanceof RegulatoryConfigMissingError).toBe(true);
          if (err instanceof RegulatoryConfigMissingError) {
            expect(err.code).toBe("IG_CONFIG_MISSING");
          }
        }
      });
    });
  });

  describe("successful mapping when all config present", () => {
    it("should produce an EctdMessageXml when sender OID and IG config are set", () => {
      withSenderOid("2.16.840.1.999.1", () => {
        const message = mapper.map(makeFullSnapshot());
        expect(message.id.root).toBe("su-uuid-001");
        expect(message.header.sender.id.root).toBe("2.16.840.1.999.1");
        expect(message.interactionId.codeSystem).toBe("2.16.840.1.113883.1.6");
        expect(message.controlActProcess.moodCode).toBe("EVN");
      });
    });
  });
});
