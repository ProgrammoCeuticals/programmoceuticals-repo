import { matchRestrictionEntry, isAuthoritative } from "./ingredientMatcher.js";
import directivesIndex from "../data/regulatory/directives/directives-index.json";
import affectedProducts from "../data/regulatory/directives/directive-affected-products.json";
import sources from "../data/regulatory/sources.json";

const sourceMap = Object.fromEntries(sources.map((s) => [s.id, s]));
const directiveMap = Object.fromEntries(directivesIndex.map((d) => [d.id, d]));

// Only product-specific and product-class-specific directives participate in default product matching
const PRODUCT_DIRECTIVES = new Set([
  "product_specific",
  "product_class_specific",
]);

/**
 * Match query ingredients against all directive affected products.
 * General regulatory obligations are excluded from default product matching.
 *
 * Returns array of directive result objects.
 */
export function matchDirectives(queryIngredients) {
  const results = [];

  for (const entity of affectedProducts) {
    // Verification queue entries (no directiveId) are never authoritative
    if (!entity.directiveId) {
      const match = matchRestrictionEntry(entity, queryIngredients);
      if (match) {
        results.push({
          entity,
          directive: null,
          source: null,
          tier: "possible_fuzzy_match",
          matchedBy: match.matchedBy,
          verificationStatus: "verification_required",
          isAuthoritative: false,
          note:
            entity.evidence ||
            "Verification queue — source attribution pending.",
        });
      }
      continue;
    }

    const directive = directiveMap[entity.directiveId];
    if (!directive) continue;

    // Skip general obligations from product matching
    if (!PRODUCT_DIRECTIVES.has(directive.category)) continue;

    const match = matchRestrictionEntry(entity, queryIngredients);
    if (!match) continue;

    const source = sourceMap[directive.sourceId] || null;
    const auth = isAuthoritative(match.tier) && !match.partial;

    results.push({
      entity,
      directive,
      source,
      tier: match.partial ? "possible_fuzzy_match" : match.tier,
      matchedBy: match.matchedBy,
      partial: match.partial,
      verificationStatus: entity.verificationStatus || "verification_required",
      isAuthoritative: auth,
      // Partial FDC matches get an explanatory note so the user knows to add the other ingredients
      note: match.partial
        ? `Partial match — ${entity.subjectName} requires all ingredients to be searched for an authoritative result.`
        : null,
    });
  }

  return results;
}

/**
 * Returns all general regulatory obligation directives (for the index/footer display).
 */
export function getGeneralDirectives() {
  return directivesIndex
    .filter((d) => d.category === "general_regulatory_obligation")
    .map((d) => ({ directive: d, source: sourceMap[d.sourceId] || null }));
}
