/**
 * XmlSchemaValidator interface — spec §57 Rule 15, §21.
 *
 * XSD validation must use the official ICH schema package.
 * The exact schema locations come from the supplied Implementation Guide.
 * Do NOT infer schema locations from secondary articles — spec §21.
 *
 * REGULATORY_GAP: XSD validation requires the official ICH eCTD v4.0
 * schema package to be imported (Phase 2) and the XML engine
 * implemented (Phase 7).
 */

export interface XmlValidationResult {
  valid: boolean;
  errors: XmlValidationError[];
}

export interface XmlValidationError {
  line?: number;
  column?: number;
  message: string;
  severity: "ERROR" | "WARNING" | "INFO";
}

export interface XmlSchemaValidator {
  /**
   * Validate an XML string against the XSD for the given standard version.
   * The schemaPackageChecksum is used to pin the exact schema version.
   */
  validate(
    xml: string,
    standardVersion: string,
    schemaPackageChecksum: string,
  ): Promise<XmlValidationResult>;
}
