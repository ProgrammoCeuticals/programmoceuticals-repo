/**
 * ContextGroup value object — spec §15
 *
 * Do not compare raw unordered JSON as the definition of context equality.
 * Normalize according to authoritative rules.
 *
 * The exact normalization algorithm must come from the ICH eCTD v4.0
 * Implementation Guide v1.7.
 * REGULATORY_GAP: Exact context group equality/normalization rules —
 * must be verified against ICH eCTD v4.0 IG v1.7 before finalizing comparison logic.
 */

export interface KeywordIdentity {
  readonly code: string;
  readonly codeSystem: string;
  readonly value: string;
}

export interface ContextGroup {
  readonly contextCode: string;
  readonly codeSystem: string;
  readonly keywords: readonly KeywordIdentity[];
}

/**
 * Normalize a ContextGroup for comparison.
 * Keywords are sorted deterministically by code+codeSystem to eliminate
 * ordering differences.
 *
 * REGULATORY_GAP: Confirm this normalization matches the authoritative
 * ICH eCTD v4.0 context group identity rules before using in validation.
 */
export function normalizeContextGroup(group: ContextGroup): string {
  const sortedKeywords = [...group.keywords].sort((a, b) => {
    const aKey = `${a.codeSystem}:${a.code}`;
    const bKey = `${b.codeSystem}:${b.code}`;
    return aKey.localeCompare(bKey);
  });

  return JSON.stringify({
    contextCode: group.contextCode,
    codeSystem: group.codeSystem,
    keywords: sortedKeywords,
  });
}

export function contextGroupsAreEqual(
  a: ContextGroup,
  b: ContextGroup,
): boolean {
  return normalizeContextGroup(a) === normalizeContextGroup(b);
}
