/**
 * XmlNamespaceRegistry — spec §22
 *
 * Implement an explicit namespace registry.
 * Do NOT duplicate namespace strings throughout the codebase.
 *
 * The official ICH schema package is authoritative for namespaces
 * and schema locations.
 */

export interface XmlNamespaceRegistry {
  get(name: string): string;
  getSchemaLocation(name: string): string;
}

export const XML_NAMESPACE_REGISTRY = Symbol("XML_NAMESPACE_REGISTRY");
