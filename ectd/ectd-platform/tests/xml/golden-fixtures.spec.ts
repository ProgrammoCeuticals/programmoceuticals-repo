/**
 * XML golden fixture tests — spec §50.
 *
 * For important message structures, retain expected XML fixtures.
 *
 * Test pattern:
 *   input domain state
 *     -> generate XML
 *     -> normalize where appropriate
 *     -> compare expected XML
 *     -> XSD validate
 *
 * REGULATORY_GAP: Full golden XML comparison is blocked until the official
 * ICH eCTD v4.0 IG v1.7 schema package is imported and namespaces are
 * resolved. The tests below verify structural determinism and escaping
 * using resolved test namespaces.
 *
 * Changes to golden fixtures require explicit review — spec §50.
 */

import {
  EctdXmlSerializer,
  EctdXmlNamespaceRegistry,
} from "@ectd/ectd-xml";
import type { EctdMessageXml } from "@ectd/ectd-xml";

// ── Resolved test registry (not production namespaces) ────────────────────
// REGULATORY_GAP: Replace with authoritative URIs from ICH IG v1.7 XSD files.

function makeTestRegistry(): EctdXmlNamespaceRegistry {
  const reg = new EctdXmlNamespaceRegistry();
  reg.resolve(
    "HL7V3",
    "urn:hl7-org:v3-placeholder",
    "urn:hl7-org:v3-placeholder v3.xsd",
  );
  reg.resolve(
    "ECTD_V4",
    "urn:hl7-org:ectd-placeholder",
    "urn:hl7-org:ectd-placeholder ectd.xsd",
  );
  return reg;
}

// ── Golden fixture helpers ────────────────────────────────────────────────

function normalizeXml(xml: string): string {
  // Normalize whitespace between tags for comparison
  return xml.replace(/>\s+</g, "><").trim();
}

// ── Minimal message fixture ───────────────────────────────────────────────

function makeMinimalMessage(): EctdMessageXml {
  return {
    id: { root: "golden-uuid-001" },
    creationTime: { value: "20240615120000" },
    interactionId: {
      code: "PORX_IN000001UV01",
      codeSystem: "2.16.840.1.113883.1.6",
    },
    header: {
      sender: {
        id: { root: "2.16.840.1.999.1" },
        name: { value: "Golden Test Sender" },
      },
    },
    controlActProcess: {
      moodCode: "EVN",
      subject: {
        submissionUnit: {
          id: { root: "su-golden-001" },
          sequenceNumber: 1,
          contextsOfUse: [],
        },
        submissions: [],
        applications: [
          {
            id: { root: "app-golden-001" },
            keywordDefinitions: [],
          },
        ],
      },
    },
  };
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("XML golden fixtures — spec §50", () => {
  const serializer = new EctdXmlSerializer(makeTestRegistry());

  describe("determinism — spec §23", () => {
    it("should produce identical output on repeated calls with identical input", () => {
      const msg = makeMinimalMessage();
      const r1 = serializer.serialize(msg, { includeXmlDeclaration: true });
      const r2 = serializer.serialize(msg, { includeXmlDeclaration: true });
      expect(r1.xml).toBe(r2.xml);
    });

    it("should produce identical normalized output regardless of call order", () => {
      const msg = makeMinimalMessage();
      const r1 = normalizeXml(serializer.serialize(msg).xml);
      const r2 = normalizeXml(serializer.serialize(msg).xml);
      expect(r1).toBe(r2);
    });
  });

  describe("structural invariants", () => {
    it("should include XML declaration when requested", () => {
      const result = serializer.serialize(makeMinimalMessage(), {
        includeXmlDeclaration: true,
      });
      expect(result.xml).toMatch(/^<\?xml version="1\.0"/);
    });

    it("should include the message id root in output", () => {
      const result = serializer.serialize(makeMinimalMessage());
      expect(result.xml).toContain("golden-uuid-001");
    });

    it("should include the creationTime value in output", () => {
      const result = serializer.serialize(makeMinimalMessage());
      expect(result.xml).toContain("20240615120000");
    });

    it("should include the sender id root in output", () => {
      const result = serializer.serialize(makeMinimalMessage());
      expect(result.xml).toContain("2.16.840.1.999.1");
    });

    it("should include the submission unit id root in output", () => {
      const result = serializer.serialize(makeMinimalMessage());
      expect(result.xml).toContain("su-golden-001");
    });

    it("should include the application id root in output", () => {
      const result = serializer.serialize(makeMinimalMessage());
      expect(result.xml).toContain("app-golden-001");
    });
  });

  describe("CoU ordering — determinism spec §23", () => {
    it("should sort CoUs by id.root alphabetically for deterministic output", () => {
      const msg = makeMinimalMessage();
      msg.controlActProcess.subject.submissionUnit.contextsOfUse = [
        { id: { root: "zzz-cou" }, code: { code: "3.2.P", codeSystem: "oid" }, keywords: [] },
        { id: { root: "aaa-cou" }, code: { code: "3.2.S", codeSystem: "oid" }, keywords: [] },
        { id: { root: "mmm-cou" }, code: { code: "3.2.A", codeSystem: "oid" }, keywords: [] },
      ];

      const result = serializer.serialize(msg);
      const aaaPos = result.xml.indexOf("aaa-cou");
      const mmmPos = result.xml.indexOf("mmm-cou");
      const zzzPos = result.xml.indexOf("zzz-cou");

      expect(aaaPos).toBeLessThan(mmmPos);
      expect(mmmPos).toBeLessThan(zzzPos);
    });
  });

  describe("REGULATORY_GAP — full golden comparison blocked", () => {
    it("documents that full golden XML comparison requires ICH IG v1.7 namespaces", () => {
      // This test documents the gap — it does not fail.
      // Once the official ICH IG v1.7 schema package is imported:
      //   1. Update makeTestRegistry() to use authoritative namespace URIs.
      //   2. Add golden fixture files to tests/xml/fixtures/.
      //   3. Replace this test with byte-level comparison against fixtures.
      //   4. Add XSD validation against the official schema.
      //
      // REGULATORY_GAP: Authoritative namespace URIs must come from the
      // official ICH eCTD v4.0 schema package (bundled with IG v1.7).
      // Do not invent or hard-code namespace URIs.
      const unresolved = makeTestRegistry().getUnresolvedNamespaces();
      // With test registry all resolved — in production registry they are not
      expect(unresolved).toHaveLength(0); // test registry is fully resolved
    });
  });
});
