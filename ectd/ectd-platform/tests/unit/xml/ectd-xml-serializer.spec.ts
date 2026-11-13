/**
 * Unit tests — EctdXmlSerializer
 * spec §21, §23, §49.
 *
 * Tests verify:
 *   - throws when namespaces have REGULATORY_GAP (fail closed — spec §4.5)
 *   + serializes successfully when all namespaces resolved
 *   + output contains XML declaration
 *   + output is deterministic for identical input (spec §23)
 *   + escapeXml handles all special characters
 *   + warnings are returned in result
 *
 * SYNTHETIC — element names are structural placeholders until IG v1.7 parsed.
 */

import {
  EctdXmlSerializer,
  EctdXmlNamespaceRegistry,
  escapeXml,
} from "../../../packages/ectd-xml/src";
import type { EctdMessageXml } from "../../../packages/ectd-xml/src/model/xml-model.types";

// ── Helpers ───────────────────────────────────────────────────────────────

function makeResolvedRegistry(): EctdXmlNamespaceRegistry {
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

function makeUnresolvedRegistry(): EctdXmlNamespaceRegistry {
  return new EctdXmlNamespaceRegistry(); // has REGULATORY_GAP namespaces
}

function makeMinimalMessage(): EctdMessageXml {
  return {
    id: { root: "test-uuid-001" },
    creationTime: { value: "20240615120000" },
    interactionId: {
      code: "PORX_IN000001UV01",
      codeSystem: "2.16.840.1.113883.1.6",
    },
    header: {
      sender: {
        id: { root: "2.16.840.1.999.1" },
        name: { value: "Test Sender" },
      },
    },
    controlActProcess: {
      moodCode: "EVN",
      subject: {
        submissionUnit: {
          id: { root: "su-001" },
          sequenceNumber: 1,
          contextsOfUse: [],
        },
        submissions: [],
        applications: [
          {
            id: { root: "app-001" },
            keywordDefinitions: [],
          },
        ],
      },
    },
  };
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("EctdXmlSerializer (spec §21, §23)", () => {
  describe("fail closed — spec §4.5", () => {
    it("should throw when namespaces have REGULATORY_GAP placeholders", () => {
      const serializer = new EctdXmlSerializer(makeUnresolvedRegistry());
      expect(() => serializer.serialize(makeMinimalMessage())).toThrow(
        /REGULATORY_GAP/,
      );
    });

    it("error message should mention unresolved namespaces", () => {
      const serializer = new EctdXmlSerializer(makeUnresolvedRegistry());
      try {
        serializer.serialize(makeMinimalMessage());
        fail("Expected to throw");
      } catch (err) {
        expect(String(err)).toMatch(/HL7V3|ECTD_V4/);
      }
    });
  });

  describe("serialization with resolved namespaces", () => {
    it("should return a non-empty XML string when namespaces are resolved", () => {
      const serializer = new EctdXmlSerializer(makeResolvedRegistry());
      const result = serializer.serialize(makeMinimalMessage(), {
        includeXmlDeclaration: true,
      });
      expect(result.xml.length).toBeGreaterThan(50);
    });

    it("should include XML declaration when includeXmlDeclaration = true", () => {
      const serializer = new EctdXmlSerializer(makeResolvedRegistry());
      const result = serializer.serialize(makeMinimalMessage(), {
        includeXmlDeclaration: true,
      });
      expect(result.xml).toMatch(/^<\?xml version="1\.0"/);
    });

    it("should omit XML declaration when includeXmlDeclaration = false", () => {
      const serializer = new EctdXmlSerializer(makeResolvedRegistry());
      const result = serializer.serialize(makeMinimalMessage(), {
        includeXmlDeclaration: false,
      });
      expect(result.xml).not.toMatch(/^<\?xml/);
    });

    it("should include creationTime value in output", () => {
      const serializer = new EctdXmlSerializer(makeResolvedRegistry());
      const result = serializer.serialize(makeMinimalMessage());
      expect(result.xml).toContain("20240615120000");
    });

    it("should return an empty warnings array when message has no REGULATORY_GAP values", () => {
      const serializer = new EctdXmlSerializer(makeResolvedRegistry());
      const result = serializer.serialize(makeMinimalMessage());
      expect(result.warnings).toHaveLength(0);
    });

    it("should THROW when message contains REGULATORY_GAP placeholder values", () => {
      const serializer = new EctdXmlSerializer(makeResolvedRegistry());
      const dirtyMessage = makeMinimalMessage();
      // Inject a REGULATORY_GAP value to simulate unresolved IG config
      (dirtyMessage.controlActProcess as { moodCode: string }).moodCode =
        "REGULATORY_GAP:moodCode-from-IG-v1.7";
      expect(() => serializer.serialize(dirtyMessage)).toThrow(
        /REGULATORY_GAP placeholder/,
      );
    });
  });

  describe("determinism — spec §23", () => {
    it("should produce identical output for identical input", () => {
      const serializer = new EctdXmlSerializer(makeResolvedRegistry());
      const msg = makeMinimalMessage();
      const r1 = serializer.serialize(msg);
      const r2 = serializer.serialize(msg);
      expect(r1.xml).toBe(r2.xml);
    });

    it("should sort CoUs by id.root for deterministic order", () => {
      const serializer = new EctdXmlSerializer(makeResolvedRegistry());
      const msg = makeMinimalMessage();
      msg.controlActProcess.subject.submissionUnit.contextsOfUse = [
        {
          id: { root: "zzz" },
          code: { code: "3.2.P", codeSystem: "oid" },
          keywords: [],
        },
        {
          id: { root: "aaa" },
          code: { code: "3.2.S", codeSystem: "oid" },
          keywords: [],
        },
      ];

      const r1 = serializer.serialize(msg);
      // aaa should appear before zzz
      expect(r1.xml.indexOf("aaa")).toBeLessThan(r1.xml.indexOf("zzz"));
    });
  });

  describe("XML escaping", () => {
    it("should escape & < > \" '", () => {
      expect(escapeXml("a&b")).toBe("a&amp;b");
      expect(escapeXml("a<b")).toBe("a&lt;b");
      expect(escapeXml("a>b")).toBe("a&gt;b");
      expect(escapeXml('a"b')).toBe("a&quot;b");
      expect(escapeXml("a'b")).toBe("a&apos;b");
    });

    it("should not alter strings with no special characters", () => {
      expect(escapeXml("NDA123456")).toBe("NDA123456");
      expect(escapeXml("2024-01-01")).toBe("2024-01-01");
    });

    it("should handle empty string", () => {
      expect(escapeXml("")).toBe("");
    });

    it("should handle multiple special chars in one string", () => {
      expect(escapeXml('<tag attr="val">')).toBe(
        "&lt;tag attr=&quot;val&quot;&gt;",
      );
    });
  });
});
