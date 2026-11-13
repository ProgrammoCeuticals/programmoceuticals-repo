/**
 * Relationship cardinality — spec §15.
 *
 * The spec states replacement must support:
 *   1:1  — one CoU replaces one CoU
 *   1:M  — one CoU replaces multiple CoUs
 *   M:1  — multiple CoUs replaced by one CoU
 *   M:M  — multiple CoUs replaced by multiple CoUs
 *
 * These are the structural cardinality types. Whether a specific
 * cardinality is permitted for a given context group is determined by
 * the applicable regulatory specification.
 *
 * REGULATORY_GAP: The exact cardinality rules for each context code
 * must be verified against the ICH eCTD v4.0 Implementation Guide v1.7.
 * The engine currently permits all four cardinality types.
 * A future cardinality policy per context code can be added when
 * the authoritative rules are available.
 */

export type RelationshipCardinality = "1:1" | "1:M" | "M:1" | "M:M";

export interface CardinalityContext {
  /** Number of CoUs being replaced (targets) */
  targetCount: number;
  /** Number of CoUs doing the replacing (sources) */
  sourceCount: number;
}

/**
 * Determine the cardinality from counts.
 */
export function inferCardinality(
  ctx: CardinalityContext,
): RelationshipCardinality {
  const { targetCount, sourceCount } = ctx;

  if (sourceCount === 1 && targetCount === 1) return "1:1";
  if (sourceCount === 1 && targetCount > 1) return "1:M";
  if (sourceCount > 1 && targetCount === 1) return "M:1";
  return "M:M";
}

/**
 * Validate cardinality.
 * Currently all cardinalities are permitted (spec does not restrict).
 *
 * REGULATORY_GAP: When authoritative cardinality restrictions are
 * available per context code, add a policy lookup here.
 */
export function validateCardinality(
  cardinality: RelationshipCardinality,
  _contextCode?: string,
): { valid: boolean; message?: string | undefined } {
  // All cardinalities permitted until authoritative restrictions are specified.
  // Record the gap for future enforcement.
  void cardinality;
  return {
    valid: true,
    message:
      cardinality !== "1:1"
        ? `REGULATORY_GAP: Cardinality "${cardinality}" permitted structurally. ` +
          "Verify against ICH eCTD v4.0 IG v1.7 for context-code-specific restrictions."
        : undefined,
  };
}
