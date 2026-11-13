import { normalize, expandName, isCombinationInput } from "./normalization.js";
import { matchRestrictionEntry, isAuthoritative } from "./ingredientMatcher.js";
import { matchDirectives } from "./directiveMatcher.js";

import ceilingList from "../data/regulatory/ceiling-list.json";
import fivePlusFive from "../data/regulatory/five-plus-five.json";
import importProhibition from "../data/regulatory/import-prohibition.json";
import ntiReference from "../data/regulatory/nti-reference.json";
import sources from "../data/regulatory/sources.json";
import affectedProducts from "../data/regulatory/directives/directive-affected-products.json";

const sourceMap = Object.fromEntries(sources.map((s) => [s.id, s]));

// Pre-index FDC combinations for fast related-combination lookups
const FDC_COMBINATIONS = affectedProducts.filter(
  (e) =>
    e.directiveId === "nafdac-rdd-030-00" && e.subjectType === "combination",
);

const DOSAGE_FORM_PATTERN =
  /\b(tablet|tablets|capsule|capsules|syrup|suspension|injection|cream|ointment|drops|solution|powder|gel|suppository|ampoule|vial|dosage|strength|mg|mcg|g|ml|iu|%|release)\b/i;
const INVALID_CHAR_PATTERN = /[^a-z0-9,\s+\-\/()]/i;

export function parseInput(rawInput) {
  const trimmed = rawInput.trim();

  if (!trimmed)
    return { valid: false, error: "Enter at least one generic name." };
  if (INVALID_CHAR_PATTERN.test(trimmed)) {
    return {
      valid: false,
      error:
        "Use letters, numbers, commas, spaces, +, -, /, and parentheses only.",
    };
  }
  if (DOSAGE_FORM_PATTERN.test(trimmed)) {
    return {
      valid: false,
      error: "Generic names only — remove dosage form or strength terms.",
    };
  }

  const ingredients = trimmed
    .split(/,|\+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i);

  if (!ingredients.length)
    return { valid: false, error: "No valid generic names detected." };

  return { valid: true, ingredients, raw: trimmed };
}

function runListCheck(list, queryIngredients, stripDosageForms = false) {
  const matches = [];
  for (const entry of list) {
    // Source conflict entries are never authoritative
    if (entry.verificationStatus === "source_conflict") {
      const match = matchRestrictionEntry(
        entry,
        queryIngredients,
        stripDosageForms,
      );
      if (match) {
        matches.push({
          entry,
          source: sourceMap[entry.sourceId] || null,
          tier: "source_conflict",
          matchedBy: match.matchedBy,
          isAuthoritative: false,
          verificationStatus: "source_conflict",
        });
      }
      continue;
    }

    const match = matchRestrictionEntry(
      entry,
      queryIngredients,
      stripDosageForms,
    );
    if (!match) continue;

    matches.push({
      entry,
      source: sourceMap[entry.sourceId] || null,
      tier: match.tier,
      matchedBy: match.matchedBy,
      partial: match.partial,
      isAuthoritative: isAuthoritative(match.tier) && !match.partial,
      verificationStatus: entry.verificationStatus,
    });
  }
  return matches;
}

function deriveOverall(ceiling, fpp, prohibition, nti, directives) {
  const hasProhibition = prohibition.some((m) => m.isAuthoritative);
  const hasBanDirective = directives.some(
    (m) =>
      m.isAuthoritative && m.directive?.action?.toLowerCase().includes("ban"),
  );
  const hasSourceConflict =
    ceiling.some((m) => m.verificationStatus === "source_conflict") ||
    fpp.some((m) => m.verificationStatus === "source_conflict") ||
    prohibition.some((m) => m.verificationStatus === "source_conflict") ||
    nti.some((m) => m.verificationStatus === "source_conflict");
  const hasVerificationRequired =
    nti.some((m) => m.verificationStatus === "verification_required") ||
    directives.some((m) => m.verificationStatus === "verification_required");

  const hasCeiling = ceiling.some((m) => m.isAuthoritative);
  const hasFpp = fpp.some((m) => m.isAuthoritative);
  const hasDirective = directives.some((m) => m.isAuthoritative);

  if (hasSourceConflict) {
    return {
      level: "verification_required",
      headline:
        "Source conflict detected — verification required before regulatory determination.",
      reasons: [
        "One or more sources disagree on this entry. Consult official documents.",
      ],
    };
  }

  if (hasProhibition || hasBanDirective) {
    return {
      level: "prohibited",
      headline: "Import prohibition or ban directive applies.",
      reasons: [
        hasProhibition && "Found on NCS Import Prohibition List.",
        hasBanDirective && "Applicable ban directive found.",
      ].filter(Boolean),
    };
  }

  if (hasCeiling || hasFpp || hasDirective) {
    return {
      level: "restricted",
      headline: "Regulatory restriction applies.",
      reasons: [
        hasCeiling &&
          "Found on NAFDAC Ceiling List (local-manufacturing/registration restriction).",
        hasFpp && "5+5 local manufacturing policy applies.",
        hasDirective && "Applicable regulatory directive found.",
      ].filter(Boolean),
    };
  }

  if (hasVerificationRequired) {
    return {
      level: "verification_required",
      headline: "Possible match found — verification required.",
      reasons: [
        "One or more matches are from unverified legacy reference data.",
      ],
    };
  }

  const hasFuzzy = [
    ...ceiling,
    ...fpp,
    ...prohibition,
    ...nti,
    ...directives,
  ].some((m) => m.tier === "possible_fuzzy_match");

  if (hasFuzzy) {
    return {
      level: "review",
      headline:
        "Possible match — advisory only. Verify against source documents.",
      reasons: ["Fuzzy match found. Not authoritative."],
    };
  }

  return {
    level: "clear",
    headline: "No regulatory restrictions found in screened lists.",
    reasons: [],
  };
}

/**
 * Build a "related FDC combinations" hint for single-ingredient queries.
 *
 * Since the new matching rules suppress combination entries when searching a
 * single ingredient, we do a targeted containment scan here to find FDC
 * entries that contain the searched ingredient — shown as clickable chips
 * so the user can search the full combination.
 *
 * Uses normalized substring matching (not the strict matcher) because the
 * intent here is discovery, not regulatory determination. Capped at 12.
 */
function buildRelatedCombinations(queryIngredients) {
  if (queryIngredients.length > 1) return [];

  const needle = normalize(queryIngredients[0]);
  const expanded = new Set(
    expandName(queryIngredients[0])
      .map((t) => t.replace(/[^a-z0-9]+/g, " ").trim())
      .filter((t) => t.length > 2),
  );

  const hits = [];
  for (const entry of FDC_COMBINATIONS) {
    if (hits.length >= 12) break;
    const haystack = normalize(entry.subjectName);
    const terms = haystack.split(/[^a-z0-9]+/);
    const found = [...expanded].some((nt) =>
      terms.some((t) => t === nt || t.startsWith(nt)),
    );
    if (found) hits.push(entry.subjectName);
  }
  return hits;
}

/**
 * Main entry point. Returns a full typed assessment object.
 */
export function runRegulatoryCheck(queryIngredients) {
  const ceilingMatches = runListCheck(ceilingList, queryIngredients);
  const fppMatches = runListCheck(fivePlusFive, queryIngredients);
  const prohibitionMatches = runListCheck(
    importProhibition,
    queryIngredients,
    true,
  );
  const ntiMatches = runListCheck(ntiReference, queryIngredients);
  const directiveMatches = matchDirectives(queryIngredients);

  const overall = deriveOverall(
    ceilingMatches,
    fppMatches,
    prohibitionMatches,
    ntiMatches,
    directiveMatches,
  );

  const relatedCombinations = buildRelatedCombinations(queryIngredients);

  return {
    productQuery: { ingredients: queryIngredients },
    restrictions: {
      ceiling: {
        matches: ceilingMatches,
        source: sourceMap["nafdac-ceiling-list-2024"],
      },
      fivePlusFive: {
        matches: fppMatches,
        source: sourceMap["nafdac-five-plus-five-2024"],
      },
      importProhibition: {
        matches: prohibitionMatches,
        source: sourceMap["ncs-import-prohibition-2026"],
      },
      nti: { matches: ntiMatches, source: sourceMap["nti-legacy-reference"] },
    },
    directives: directiveMatches,
    relatedCombinations,
    overall,
    checkedAt: new Date().toISOString(),
  };
}
