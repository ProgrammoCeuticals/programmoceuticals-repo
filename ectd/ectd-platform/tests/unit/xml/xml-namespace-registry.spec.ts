/**
 * Unit tests — EctdXmlNamespaceRegistry
 * spec §22, §49.
 *
 * Tests verify:
 *   + get() returns the registered URI
 *   - get() throws for unknown namespace
 *   + allResolved() returns false while any namespace has REGULATORY_GAP
 *   + getUnresolvedNamespaces() lists gap namespaces
 *   + resolve() updates a namespace and clears its gap flag
 *   + after resolving all, allResolved() returns true
 *   + XSI (W3C standard) is already resolved without the ICH package
 */

import { EctdXmlNamespaceRegistry } from "../../../packages/ectd-xml/src/namespace/xml-namespace-registry";

describe("EctdXmlNamespaceRegistry (spec §22)", () => {
  // Create a fresh instance for each test to avoid mutation side-effects
  function makeRegistry(): EctdXmlNamespaceRegistry {
    return new EctdXmlNamespaceRegistry();
  }

  describe("get()", () => {
    it("should return the URI for a registered namespace", () => {
      const reg = makeRegistry();
      const uri = reg.get("XSI");
      expect(uri).toBe("http://www.w3.org/2001/XMLSchema-instance");
    });

    it("should throw for an unknown namespace", () => {
      const reg = makeRegistry();
      expect(() => reg.get("UNKNOWN_NS")).toThrow(/Unknown namespace/);
    });
  });

  describe("REGULATORY_GAP state", () => {
    it("should report allResolved() = false when ICH namespaces have gaps", () => {
      const reg = makeRegistry();
      expect(reg.allResolved()).toBe(false);
    });

    it("should list HL7V3 and ECTD_V4 as unresolved", () => {
      const reg = makeRegistry();
      const unresolved = reg.getUnresolvedNamespaces();
      expect(unresolved).toContain("HL7V3");
      expect(unresolved).toContain("ECTD_V4");
    });

    it("should NOT list XSI as unresolved (it is a W3C standard)", () => {
      const reg = makeRegistry();
      const unresolved = reg.getUnresolvedNamespaces();
      expect(unresolved).not.toContain("XSI");
    });
  });

  describe("resolve()", () => {
    it("should update a namespace URI and clear its gap flag", () => {
      const reg = makeRegistry();
      reg.resolve("HL7V3", "urn:hl7-org:v3", "urn:hl7-org:v3 hl7v3.xsd");
      expect(reg.get("HL7V3")).toBe("urn:hl7-org:v3");
      expect(reg.getUnresolvedNamespaces()).not.toContain("HL7V3");
    });

    it("should report allResolved() = true after all gaps are resolved", () => {
      const reg = makeRegistry();
      reg.resolve("HL7V3", "urn:hl7-org:v3", "urn:hl7-org:v3 v3.xsd");
      reg.resolve(
        "ECTD_V4",
        "urn:hl7-org:ectd:v4",
        "urn:hl7-org:ectd:v4 ectd.xsd",
      );
      expect(reg.allResolved()).toBe(true);
    });

    it("should throw when resolving an unknown namespace", () => {
      const reg = makeRegistry();
      expect(() => reg.resolve("NONEXISTENT", "urn:test", "")).toThrow(
        /Cannot resolve unknown namespace/,
      );
    });
  });
});
