/**
 * eCTD reference abstraction.
 * Source: ECTD_BACKEND_IMPLEMENTATION.md § 12
 *
 * Maintain separate concepts:
 *   - internal database id
 *   - regulatory UUID
 *   - OID/code-system identifier
 *   - legacy v3.2.2 leaf reference
 *
 * The v3.2.2 forward-compatibility representation must follow the exact
 * authoritative v4.0 specification — not an invented mapping.
 */
export type EctdReference =
  | { type: "UUID"; root: string }
  | { type: "V3_LEAF"; root: string; extension: string };

/**
 * Context group value object.
 * Source: ECTD_BACKEND_IMPLEMENTATION.md § 15
 *
 * Do NOT compare raw unordered JSON as the definition of context equality.
 * Normalize according to authoritative rules before comparing.
 */
export interface ContextGroup {
  contextCode: string;
  codeSystem: string;
  keywords: KeywordIdentity[];
}

export interface KeywordIdentity {
  code: string;
  codeSystem: string;
  value: string;
}
