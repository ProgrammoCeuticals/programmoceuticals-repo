/**
 * eCTD Reference value object — spec §12
 *
 * Maintains separate concepts:
 *   - internal database id
 *   - regulatory UUID
 *   - OID / code-system identifier
 *   - legacy v3.2.2 leaf reference
 *
 * Do NOT use an internal PostgreSQL ID as a substitute for a regulatory UUID.
 *
 * The v3.2.2 forward-compatibility representation must follow the exact
 * authoritative v4.0 specification rather than an invented mapping.
 * REGULATORY_GAP: v3.2.2 forward compatibility mapping — must be verified
 * against ICH eCTD v4.0 Implementation Guide v1.7 before implementing.
 */

export type EctdReference =
  | { readonly type: "UUID"; readonly root: string }
  | {
      readonly type: "V3_LEAF";
      readonly root: string;
      readonly extension: string;
    };

export function makeUuidReference(root: string): EctdReference {
  if (!root || root.trim().length === 0) {
    throw new Error("EctdReference: root UUID must not be empty");
  }
  return { type: "UUID", root: root.trim() };
}

export function makeV3LeafReference(
  root: string,
  extension: string,
): EctdReference {
  if (!root || !extension) {
    throw new Error(
      "EctdReference: root and extension are required for V3_LEAF",
    );
  }
  return { type: "V3_LEAF", root, extension };
}
