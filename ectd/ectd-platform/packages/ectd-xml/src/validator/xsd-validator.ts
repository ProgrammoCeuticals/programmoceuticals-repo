/**
 * XsdValidator — spec §21, §24.
 *
 * Validates XML string against the official ICH eCTD v4.0 XSD schema.
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  REGULATORY_GAP                                                  ║
 * ║                                                                  ║
 * ║  XSD validation requires the official ICH eCTD v4.0 schema     ║
 * ║  package (bundled with IG v1.7) to be imported and activated    ║
 * ║  (Phase 2).                                                      ║
 * ║                                                                  ║
 * ║  Without the official schema, this validator CANNOT produce      ║
 * ║  authoritative validation results.                               ║
 * ║                                                                  ║
 * ║  To activate: import ICH IG v1.7 package, extract XSD files     ║
 * ║  to the regulatory package root, then pass schemaPath here.     ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Spec §24 validation layer 3: XML schema validation.
 * The validator must be provided the exact schema checksum to prevent
 * use of a stale or incorrect schema — spec §2 (version pinning).
 */

import type { XmlValidationResult, XmlSchemaValidator } from "@ectd/shared";

export class StubXsdValidator implements XmlSchemaValidator {
  /**
   * Stub implementation — always returns a REGULATORY_GAP result.
   *
   * Replace with a real libxml2/saxonica binding once the official
   * ICH XSD is available.
   */
  async validate(
    _xml: string,
    standardVersion: string,
    schemaPackageChecksum: string,
  ): Promise<XmlValidationResult> {
    return {
      valid: false,
      errors: [
        {
          severity: "ERROR",
          message:
            `REGULATORY_GAP: XSD validation against ICH eCTD v4.0 schema ` +
            `(standard: "${standardVersion}", checksum: "${schemaPackageChecksum.slice(0, 8)}...") ` +
            `is not implemented. The official ICH schema package (bundled with IG v1.7) ` +
            `must be imported and activated before XSD validation can be performed.`,
        },
      ],
    };
  }
}
