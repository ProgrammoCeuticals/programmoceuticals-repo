/**
 * Unit tests — DomainToXmlMapper
 * spec §21, §23, §49.
 *
 * All tests set ECTD_SENDER_OID and provide igPackageConfig.
 * The mapper throws if either is missing — user requirement.
 *
 * Tests verify:
 *   + mapper produces a well-structured EctdMessageXml from a snapshot
 *   + determinism: same input → same output (spec §23)
 *   + CoUs sorted by UUID for determinism
 *   + keywords sorted by code for determinism
 *   + replacement relationship mapped correctly
 *   + suspended status mapped to statusCode
 *   + timestamp normalized to HL7 format
 *   + empty collections handled safely
 *   - throws SenderIdentityMissingError when OID not set
 *   - throws InteractionIdMissingError when igPackageConfig absent
 *
 * SYNTHETIC — not based on real ICH XML structure.
 */

import {
  DomainToXmlMapper,
  SenderIdentityMissingError,
  InteractionIdMissingError,
  normalizeTimestamp,
  type DomainSnapshot,
} from "../../../packages/ectd-xml/src/mapper/domain-to-xml.mapper";

// ── Helpers ───────────────────────────────────────────────────────────────

const VALID_OID = "2.16.840.1.999.1.2";
const VALID_IG_CONFIG = {
  interactionIdRoot: "2.16.840.1.113883.1.6",
  interactionIdExtension: "PORX_IN000001UV01_TEST",
  controlActProcessMoodCode: "EVN",
};

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

function makeSnapshot(overrides: Partial<DomainSnapshot> = {}): DomainSnapshot {
  return {
    submissionUnitUuid: "su-uuid-001",
    sequenceNumber: 1,
    creationTime: "2024-06-15T12:00:00.000Z",
    contextsOfUse: [],
    submissions: [],
    application: { uuid: "app-uuid-001", keywordDefinitions: [] },
    igPackageConfig: VALID_IG_CONFIG,
    ...overrides,
  };
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("DomainToXmlMapper (spec §21)", () => {
  const mapper = new DomainToXmlMapper();

  describe("basic structure", () => {
    it("should produce a message with id, creationTime, header, and controlActProcess", () => {
      withSenderOid(VALID_OID, () => {
        const msg = mapper.map(makeSnapshot());
        expect(msg.id.root).toBe("su-uuid-001");
        expect(msg.creationTime.value).toBeTruthy();
        expect(msg.header.sender.id.root).toBe(VALID_OID);
        expect(msg.controlActProcess).toBeDefined();
      });
    });

    it("should place the submission unit inside controlActProcess.subject", () => {
      withSenderOid(VALID_OID, () => {
        const msg = mapper.map(makeSnapshot());
        expect(msg.controlActProcess.subject.submissionUnit.id.root).toBe(
          "su-uuid-001",
        );
        expect(
          msg.controlActProcess.subject.submissionUnit.sequenceNumber,
        ).toBe(1);
      });
    });

    it("should map priorityNumber when present", () => {
      withSenderOid(VALID_OID, () => {
        const msg = mapper.map(makeSnapshot({ priorityNumber: 5 }));
        expect(
          msg.controlActProcess.subject.submissionUnit.priorityNumber,
        ).toBe(5);
      });
    });

    it("should omit priorityNumber when not set", () => {
      withSenderOid(VALID_OID, () => {
        const msg = mapper.map(makeSnapshot({ priorityNumber: undefined }));
        expect(
          msg.controlActProcess.subject.submissionUnit.priorityNumber,
        ).toBeUndefined();
      });
    });

    it("moodCode comes from igPackageConfig, not a hard-coded value", () => {
      withSenderOid(VALID_OID, () => {
        const msg = mapper.map(makeSnapshot());
        expect(msg.controlActProcess.moodCode).toBe("EVN");
      });
    });

    it("interactionId comes from igPackageConfig, not a hard-coded value", () => {
      withSenderOid(VALID_OID, () => {
        const msg = mapper.map(makeSnapshot());
        expect(msg.interactionId.code).toBe("PORX_IN000001UV01_TEST");
        expect(msg.interactionId.codeSystem).toBe("2.16.840.1.113883.1.6");
      });
    });
  });

  describe("determinism — spec §23", () => {
    it("should produce identical output for identical input", () => {
      withSenderOid(VALID_OID, () => {
        const snapshot = makeSnapshot({
          contextsOfUse: [
            {
              uuid: "cou-b",
              contextCode: "3.2.S",
              contextCodeSystem: "oid1",
              status: "ACTIVE",
              keywords: [],
            },
            {
              uuid: "cou-a",
              contextCode: "3.2.P",
              contextCodeSystem: "oid1",
              status: "ACTIVE",
              keywords: [],
            },
          ],
        });
        const r1 = mapper.map(snapshot);
        const r2 = mapper.map(snapshot);
        expect(
          r1.controlActProcess.subject.submissionUnit.contextsOfUse[0]?.id.root,
        ).toBe(
          r2.controlActProcess.subject.submissionUnit.contextsOfUse[0]?.id.root,
        );
      });
    });

    it("should sort CoUs by UUID regardless of input order", () => {
      withSenderOid(VALID_OID, () => {
        const snapshot = makeSnapshot({
          contextsOfUse: [
            {
              uuid: "zzz-cou",
              contextCode: "3.2.P",
              contextCodeSystem: "oid1",
              status: "ACTIVE",
              keywords: [],
            },
            {
              uuid: "aaa-cou",
              contextCode: "3.2.S",
              contextCodeSystem: "oid1",
              status: "ACTIVE",
              keywords: [],
            },
          ],
        });
        const msg = mapper.map(snapshot);
        const cous = msg.controlActProcess.subject.submissionUnit.contextsOfUse;
        expect(cous[0]?.id.root).toBe("aaa-cou");
        expect(cous[1]?.id.root).toBe("zzz-cou");
      });
    });

    it("should sort keywords by code for determinism", () => {
      withSenderOid(VALID_OID, () => {
        const snapshot = makeSnapshot({
          contextsOfUse: [
            {
              uuid: "cou-1",
              contextCode: "3.2.P.1",
              contextCodeSystem: "oid1",
              status: "ACTIVE",
              keywords: [
                { code: "zz-kw", codeSystem: "oid", value: "z" },
                { code: "aa-kw", codeSystem: "oid", value: "a" },
              ],
            },
          ],
        });
        const msg = mapper.map(snapshot);
        const kws =
          msg.controlActProcess.subject.submissionUnit.contextsOfUse[0]
            ?.keywords ?? [];
        expect(kws[0]?.code.code).toBe("aa-kw");
        expect(kws[1]?.code.code).toBe("zz-kw");
      });
    });
  });

  describe("replacement mapping", () => {
    it("should map replacesContextUuid to replacementOf element", () => {
      withSenderOid(VALID_OID, () => {
        const snapshot = makeSnapshot({
          contextsOfUse: [
            {
              uuid: "cou-new",
              contextCode: "3.2.P.1",
              contextCodeSystem: "oid",
              status: "ACTIVE",
              keywords: [],
              replacesContextUuid: "cou-old",
            },
          ],
        });
        const msg = mapper.map(snapshot);
        const cou =
          msg.controlActProcess.subject.submissionUnit.contextsOfUse[0];
        expect(cou?.replacementOf?.contextOfUse.id.root).toBe("cou-old");
      });
    });

    it("should omit replacementOf when not a replacement", () => {
      withSenderOid(VALID_OID, () => {
        const snapshot = makeSnapshot({
          contextsOfUse: [
            {
              uuid: "cou-1",
              contextCode: "3.2.P.1",
              contextCodeSystem: "oid",
              status: "ACTIVE",
              keywords: [],
            },
          ],
        });
        const msg = mapper.map(snapshot);
        expect(
          msg.controlActProcess.subject.submissionUnit.contextsOfUse[0]
            ?.replacementOf,
        ).toBeUndefined();
      });
    });
  });

  describe("suspension status", () => {
    it("should set statusCode for SUSPENDED CoU", () => {
      withSenderOid(VALID_OID, () => {
        const snapshot = makeSnapshot({
          contextsOfUse: [
            {
              uuid: "cou-sus",
              contextCode: "3.2.P.1",
              contextCodeSystem: "oid",
              status: "SUSPENDED",
              keywords: [],
            },
          ],
        });
        const msg = mapper.map(snapshot);
        const cou =
          msg.controlActProcess.subject.submissionUnit.contextsOfUse[0];
        expect(cou?.statusCode).toBeDefined();
        expect(cou?.statusCode?.code).toBe("suspended");
        // The codeSystem must be marked as REGULATORY_GAP until IG v1.7 is parsed
        expect(cou?.statusCode?.codeSystem).toContain("REGULATORY_GAP");
      });
    });

    it("should NOT set statusCode for ACTIVE CoU", () => {
      withSenderOid(VALID_OID, () => {
        const snapshot = makeSnapshot({
          contextsOfUse: [
            {
              uuid: "cou-act",
              contextCode: "3.2.P.1",
              contextCodeSystem: "oid",
              status: "ACTIVE",
              keywords: [],
            },
          ],
        });
        const msg = mapper.map(snapshot);
        expect(
          msg.controlActProcess.subject.submissionUnit.contextsOfUse[0]
            ?.statusCode,
        ).toBeUndefined();
      });
    });
  });

  describe("application and submissions", () => {
    it("should map application with applicationNumber", () => {
      withSenderOid(VALID_OID, () => {
        const snapshot = makeSnapshot({
          application: {
            uuid: "app-001",
            applicationNumber: "NDA123456",
            keywordDefinitions: [],
          },
        });
        const msg = mapper.map(snapshot);
        expect(msg.controlActProcess.subject.applications[0]?.id.root).toBe(
          "app-001",
        );
        expect(
          msg.controlActProcess.subject.applications[0]?.applicationNumber
            ?.value,
        ).toBe("NDA123456");
      });
    });

    it("should map submissions", () => {
      withSenderOid(VALID_OID, () => {
        const snapshot = makeSnapshot({
          submissions: [
            {
              uuid: "sub-001",
              submissionTypeCode: "ORIGINAL",
              submissionTypeCodeSystem: "oid",
            },
          ],
        });
        const msg = mapper.map(snapshot);
        expect(msg.controlActProcess.subject.submissions).toHaveLength(1);
        expect(msg.controlActProcess.subject.submissions[0]?.id.root).toBe(
          "sub-001",
        );
      });
    });

    it("should handle empty submissions list", () => {
      withSenderOid(VALID_OID, () => {
        const msg = mapper.map(makeSnapshot({ submissions: [] }));
        expect(msg.controlActProcess.subject.submissions).toHaveLength(0);
      });
    });
  });

  describe("blocks on missing config", () => {
    it("should throw SenderIdentityMissingError when OID not set", () => {
      withSenderOid(undefined, () => {
        expect(() => mapper.map(makeSnapshot())).toThrow(
          SenderIdentityMissingError,
        );
      });
    });

    it("should throw InteractionIdMissingError when igPackageConfig is null", () => {
      withSenderOid(VALID_OID, () => {
        expect(() =>
          mapper.map(makeSnapshot({ igPackageConfig: null })),
        ).toThrow(InteractionIdMissingError);
      });
    });
  });
});

// ── normalizeTimestamp ─────────────────────────────────────────────────────

describe("normalizeTimestamp", () => {
  it("should convert ISO 8601 to HL7 yyyyMMddHHmmss", () => {
    expect(normalizeTimestamp("2024-06-15T12:30:45.000Z")).toBe(
      "20240615123045",
    );
  });

  it("should pad single-digit month/day/hour/min/sec", () => {
    expect(normalizeTimestamp("2024-01-05T09:03:07.000Z")).toBe(
      "20240105090307",
    );
  });

  it("should pass through unparseable strings unchanged", () => {
    expect(normalizeTimestamp("not-a-date")).toBe("not-a-date");
  });
});
