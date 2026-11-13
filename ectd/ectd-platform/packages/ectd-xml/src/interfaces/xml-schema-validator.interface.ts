/**
 * XmlSchemaValidator interface — spec §21, §57 Rule 15
 *
 * The XML engine is a compiler, not a controller utility.
 * Pipeline: frozen domain snapshot -> regulatory resolver -> eCTD XML model
 *           -> serializer -> submissionunit.xml -> XSD validation
 *
 * The official ICH schema package is authoritative for namespaces and schema locations.
 * Do NOT infer element names, namespaces, or attributes from secondary articles.
 *
 * REGULATORY_GAP: Exact XML message structure (element names, namespaces,
 * attributes, cardinalities, message type, fixed values, schema locations)
 * must come from the official ICH eCTD v4.0 Implementation Guide v1.7
 * and schema package before this interface is implemented.
 */

export interface XmlSchemaValidationResult {
  valid: boolean;
  errors: Array<{
    line?: number;
    column?: number;
    message: string;
  }>;
  schemaVersion: string;
  schemaChecksum: string;
}

export interface XmlSchemaValidator {
  /**
   * Validate XML content against the XSD for a given regulatory profile.
   * Must use the exact schema version pinned to the submission unit.
   */
  validate(
    xmlContent: string,
    schemaPackageChecksum: string,
  ): Promise<XmlSchemaValidationResult>;
}

export const XML_SCHEMA_VALIDATOR = Symbol("XML_SCHEMA_VALIDATOR");
