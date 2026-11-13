/**
 * XmlSerializer interface — spec §21, §23.
 *
 * The serializer converts the XML object model into a string.
 * It must:
 *   1. Verify namespaces are resolved before serializing.
 *   2. Produce deterministic output for identical input — spec §23.
 *   3. Never expose internal Prisma model fields directly.
 *
 * REGULATORY_GAP: Exact serialization rules (attribute ordering, namespace
 * prefix assignment, canonical form) must come from ICH IG v1.7.
 */

import type { EctdMessageXml } from "../model/xml-model.types";

export interface SerializationOptions {
  /** If true, produce indented/pretty-printed XML (for development only) */
  pretty?: boolean | undefined;
  /** XML declaration inclusion */
  includeXmlDeclaration?: boolean | undefined;
  /** Encoding to declare in the XML declaration */
  encoding?: string | undefined;
}

export interface SerializationResult {
  xml: string;
  /** Warnings produced during serialization (e.g. REGULATORY_GAP items) */
  warnings: string[];
}

export interface XmlSerializer {
  /**
   * Serialize an EctdMessage XML object model to XML string.
   * Must refuse to serialize if namespaces have unresolved REGULATORY_GAP
   * placeholders (spec §4.5: fail closed).
   */
  serialize(
    message: EctdMessageXml,
    options?: SerializationOptions,
  ): SerializationResult;
}

export const XML_SERIALIZER = Symbol("XML_SERIALIZER");
