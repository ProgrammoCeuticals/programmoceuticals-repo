import {
  normalize,
  expandName,
  tokenize,
  splitCompound,
} from "./normalization.js";

// Jaccard similarity between two token sets
const jaccard = (a, b) => {
  if (!a.size || !b.size) return 0;
  let n = 0;
  for (const t of a) if (b.has(t)) n++;
  return n / (a.size + b.size - n);
};

/**
 * Attempt to match a single search term against a single entry part.
 * Returns the match tier string or null.
 */
function matchTier(searchTerm, entryPart, stripDosageForms = false) {
  const normSearch = normalize(searchTerm);
  const normEntry = normalize(entryPart);

  if (!normSearch || !normEntry) return null;

  // Exact normalized match
  if (normSearch === normEntry) return "normalized_exact";

  // Expand both with synonyms
  const searchTerms = new Set(expandName(searchTerm));
  const entryTerms = new Set(expandName(entryPart));

  // Canonical alias match
  // Strategy: check whether any search synonym equals any entry synonym,
  // or whether any search synonym appears as a complete set of words inside
  // the entry (handles multi-synonym entry names like
  // "Analgin (Metamizole) / Novalgin (Dipyrone)" where each word is a key).
  const entryWords = new Set(normEntry.split(/\s+/));
  for (const s of searchTerms) {
    // 1. Direct equality with any expanded entry term
    for (const e of entryTerms) {
      if (s === e) return "canonical_alias";
    }
    // 2. All words of this search synonym appear in the entry's word set
    const sWords = s.split(/\s+/).filter(Boolean);
    if (sWords.length > 0 && sWords.every((sw) => entryWords.has(sw))) {
      return "canonical_alias";
    }
  }
  // Reverse: any expanded entry term's words all appear in the search word set
  const searchWords = new Set(normSearch.split(/\s+/));
  for (const e of entryTerms) {
    const eWords = e.split(/\s+/).filter(Boolean);
    if (eWords.length > 0 && eWords.every((ew) => searchWords.has(ew))) {
      return "canonical_alias";
    }
  }

  // Token-level match
  const entryTokens = new Set(tokenize(entryPart, stripDosageForms));
  for (const s of searchTerms) {
    const searchTokens = new Set(tokenize(s));
    if (!searchTokens.size || !entryTokens.size) continue;

    if (searchTokens.size === 1) {
      const [tok] = searchTokens;
      if (entryTokens.has(tok)) return "scope_match";
      continue;
    }

    const j = jaccard(searchTokens, entryTokens);
    if (j >= 0.8) return "scope_match";
    if (j >= 0.5) return "possible_fuzzy_match";
  }

  return null;
}

/**
 * Match a list of query ingredient names against a restriction entry.
 *
 * SEARCH INTENT RULES
 * ───────────────────
 * Single-ingredient search (queryIngredients.length === 1):
 *   • A single-ingredient or product-class entry that directly matches → return it.
 *   • A combination entry that merely contains the ingredient → return null.
 *     (These appear instead as the "related combinations" hint in the UI.)
 *
 * Combination search (queryIngredients.length > 1):
 *   • An entry is returned ONLY when every query ingredient matches some part of
 *     the entry AND every entry part is matched by at least one query ingredient
 *     (symmetric match — no leftovers on either side).
 *   • A single-ingredient entry that matches one query term → return it if
 *     the match is authoritative (that single ingredient IS one of the searched
 *     ingredients). Fuzzy-only → suppress.
 *   • Combination entries where only a subset of parts match → suppress entirely.
 *
 * Returns { tier, matchedBy, partial } or null.
 * Only 'normalized_exact', 'canonical_alias', 'scope_match' are authoritative.
 */
export function matchRestrictionEntry(
  entry,
  queryIngredients,
  stripDosageForms = false,
) {
  const entryParts = splitCompound(entry.subjectName);
  const isComboEntry =
    entry.subjectType === "combination" || entryParts.length > 1;
  const isComboQuery = queryIngredients.length > 1;

  // ── Rule 1: Single-ingredient query vs combination entry ──────────────────
  // Suppress entirely — combinations that merely contain the ingredient should
  // not appear as results; they surface via the relatedCombinations hint.
  if (!isComboQuery && isComboEntry) return null;

  const tierRank = {
    normalized_exact: 4,
    canonical_alias: 3,
    scope_match: 2,
    possible_fuzzy_match: 1,
  };

  // ── Build per-query-ingredient best tier against any entry part ───────────
  const matchedBy = [];
  let bestTier = null;

  for (const ingredient of queryIngredients) {
    let ingredientBestTier = null;
    for (const part of entryParts) {
      const tier = matchTier(ingredient, part, stripDosageForms);
      if (
        tier &&
        (!ingredientBestTier || tierRank[tier] > tierRank[ingredientBestTier])
      ) {
        ingredientBestTier = tier;
      }
    }
    if (ingredientBestTier) {
      matchedBy.push({ ingredient, tier: ingredientBestTier });
      if (!bestTier || tierRank[ingredientBestTier] > tierRank[bestTier]) {
        bestTier = ingredientBestTier;
      }
    }
  }

  if (!matchedBy.length) return null;

  // ── Rule 2: Combination query vs combination entry — strict symmetric match
  if (isComboQuery && isComboEntry) {
    // Every query ingredient must match some entry part
    if (matchedBy.length < queryIngredients.length) return null;

    // Every entry part must be matched by at least one query ingredient
    const matchedEntryParts = new Set();
    for (const part of entryParts) {
      for (const { ingredient } of matchedBy) {
        const tier = matchTier(ingredient, part, stripDosageForms);
        if (tier) matchedEntryParts.add(normalize(part));
      }
    }
    const significantParts = entryParts.filter((p) => normalize(p).length > 0);
    if (matchedEntryParts.size < significantParts.length) return null;

    return { tier: bestTier, matchedBy, partial: false };
  }

  // ── Rule 3: Combination query vs single-ingredient entry ──────────────────
  // Each searched ingredient can still hit its own standalone entry (e.g. ceiling
  // list entry "CIPROFLOXACIN" when searching "ciprofloxacin + phenazopyridine").
  // Only return if the match is authoritative — suppress fuzzy noise.
  if (isComboQuery && !isComboEntry) {
    if (!isAuthoritative(bestTier)) return null;
    return { tier: bestTier, matchedBy, partial: false };
  }

  // ── Rule 4: Single query vs single-ingredient entry (normal case) ─────────
  return { tier: bestTier, matchedBy, partial: false };
}

export const AUTHORITATIVE_TIERS = new Set([
  "exact",
  "normalized_exact",
  "canonical_alias",
  "combination_exact",
  "combination_normalized",
  "scope_match",
]);

export const isAuthoritative = (tier) => AUTHORITATIVE_TIERS.has(tier);
