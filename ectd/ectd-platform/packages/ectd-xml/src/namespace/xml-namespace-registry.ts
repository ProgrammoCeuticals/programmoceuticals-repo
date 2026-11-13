/**
 * XmlNamespaceRegistry implementation — spec §22.
 *
 * Do NOT duplicate namespace strings throughout the codebase.
 * All namespace URIs and schema locations come from here.
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  REGULATORY_GAP — CRITICAL                                      ║
 * ║                                                                  ║
 * ║  The namespace URIs and schema locations below are STRUCTURAL   ║
 * ║  PLACEHOLDERS ONLY.                                             ║
 * ║                                                                  ║
 * ║  The authoritative values MUST be taken from the official ICH  ║
 * ║  eCTD v4.0 schema package (bundled with IG v1.7).              ║
 * ║                                                                  ║
 * ║  Until the official schema package is imported and its XSD     ║
 * ║  namespace declarations are read, these values MUST NOT be     ║
 * ║  used to generate regulatory submission XML.                    ║
 * ║                                                                  ║
 * ║  To activate: import the ICH IG v1.7 package, then update     ║
 * ║  the NAMESPACE_ENTRIES table below from the XSD declarations.  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Spec §22 interface:
 *   get(name: string): string           — returns the namespace URI
 *   getSchemaLocation(name: string): string — returns the xsi:schemaLocation value
 */

import type { XmlNamespaceRegistry } from "../interfaces/xml-namespace-registry.interface";

/**
 * Named namespaces used in eCTD v4.0 XML.
 *
 * REGULATORY_GAP: Every URI below must be verified against the official
 * ICH eCTD v4.0 schema package before production use.
 * Placeholder values are used to allow the type system and serializer to
 * be built without the official package in hand.
 *
 * Source when available: ICH IG v1.7 XSD files.
 */
const NAMESPACE_ENTRIES: Record<
  string,
  { uri: string; schemaLocation: string; gap: boolean }
> = {
  /**
   * HL7 v3 core — REGULATORY_GAP: verify URI from ICH schema package.
   * HL7 v3 namespace is typically "urn:hl7-org:v3" but must be confirmed
   * from the official ICH XSD files.
   */
  HL7V3: {
    uri: "REGULATORY_GAP:hl7v3-uri-must-come-from-official-ICH-schema-package",
    schemaLocation:
      "REGULATORY_GAP:hl7v3-schema-location-must-come-from-official-ICH-schema-package",
    gap: true,
  },

  /**
   * XML Schema Instance — standard W3C namespace.
   * This one is a W3C standard, not ICH-specific.
   */
  XSI: {
    uri: "http://www.w3.org/2001/XMLSchema-instance",
    schemaLocation: "",
    gap: false,
  },

  /**
   * eCTD v4.0 application-specific namespace.
   * REGULATORY_GAP: Exact URI from ICH schema package.
   */
  ECTD_V4: {
    uri: "REGULATORY_GAP:ectd-v4-uri-must-come-from-official-ICH-schema-package",
    schemaLocation:
      "REGULATORY_GAP:ectd-v4-schema-location-must-come-from-official-ICH-schema-package",
    gap: true,
  },
};

export class EctdXmlNamespaceRegistry implements XmlNamespaceRegistry {
  /**
   * Get the namespace URI for a named namespace.
   * Throws if the namespace is not registered.
   * Returns the REGULATORY_GAP placeholder if the namespace has not been
   * resolved from the official package — the caller must not use
   * placeholder values in regulatory XML output.
   */
  get(name: string): string {
    const entry = NAMESPACE_ENTRIES[name];
    if (!entry) {
      throw new Error(
        `XmlNamespaceRegistry: Unknown namespace "${name}". ` +
          "Register it with the URI from the official ICH schema package.",
      );
    }
    return entry.uri;
  }

  getSchemaLocation(name: string): string {
    const entry = NAMESPACE_ENTRIES[name];
    if (!entry) {
      throw new Error(`XmlNamespaceRegistry: Unknown namespace "${name}".`);
    }
    return entry.schemaLocation;
  }

  /**
   * Check whether all namespaces have been resolved from the official package.
   * The serializer must call this before generating any regulatory XML.
   */
  allResolved(): boolean {
    return Object.values(NAMESPACE_ENTRIES).every((e) => !e.gap);
  }

  /**
   * Return the list of namespaces that still have REGULATORY_GAP placeholders.
   * Used for error reporting and the regulatory verification matrix.
   */
  getUnresolvedNamespaces(): string[] {
    return Object.entries(NAMESPACE_ENTRIES)
      .filter(([, e]) => e.gap)
      .map(([name]) => name);
  }

  /**
   * Update a namespace URI from the official schema package.
   * Called during the Phase 2 regulatory package import pipeline
   * after the ICH IG v1.7 schema files are parsed.
   */
  resolve(name: string, uri: string, schemaLocation: string): void {
    if (!NAMESPACE_ENTRIES[name]) {
      throw new Error(
        `XmlNamespaceRegistry: Cannot resolve unknown namespace "${name}".`,
      );
    }
    NAMESPACE_ENTRIES[name] = { uri, schemaLocation, gap: false };
  }
}

/** Singleton instance — spec §22: do not duplicate namespace strings. */
export const ectdNamespaceRegistry = new EctdXmlNamespaceRegistry();
