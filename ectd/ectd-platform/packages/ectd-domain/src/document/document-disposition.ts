/**
 * Document disposition for publishing — spec §30
 *
 * The resolver must determine whether content should be:
 *   INCLUDE | REFERENCE | EXCLUDE
 * according to the applicable specification.
 *
 * Do not include every historical Document blindly.
 *
 * REGULATORY_GAP: Exact disposition rules must come from the applicable
 * ICH eCTD v4.0 Implementation Guide v1.7 and regional specification.
 * Do not invent disposition logic.
 */
export const DocumentDisposition = {
  INCLUDE: "INCLUDE",
  REFERENCE: "REFERENCE",
  EXCLUDE: "EXCLUDE",
} as const;

export type DocumentDisposition =
  (typeof DocumentDisposition)[keyof typeof DocumentDisposition];
