import registry from "../data/pharma-companies.json" with { type: "json" };
import type { PharmaRegistryEntry, PharmaRegistryMatch } from "../types/report.types.js";
import { normalizeCompanyName, tokenSimilarity } from "./companyNormalize.service.js";

const entries = registry as PharmaRegistryEntry[];

export function lookupPharmaCompany(companyName: string): PharmaRegistryMatch {
  const normalized = normalizeCompanyName(companyName);
  if (!normalized) {
    return {
      isKnownPharmaCompany: false,
      confidence: "Low",
      reason: "No facility name was extracted for registry lookup."
    };
  }

  const exactMatch = entries.find((entry) => entry.normalizedCompanyName === normalized);
  if (exactMatch) return toMatch(exactMatch, "High", "Facility name exactly matched the pharma registry.");

  const containsMatch = entries.find((entry) => {
    return entry.normalizedCompanyName.includes(normalized) || normalized.includes(entry.normalizedCompanyName);
  });
  if (containsMatch) return toMatch(containsMatch, "High", "Facility name strongly matched the pharma registry.");

  const scored = entries
    .map((entry) => ({ entry, score: tokenSimilarity(companyName, entry.companyName) }))
    .sort((left, right) => right.score - left.score)[0];

  if (scored && scored.score >= 0.75) {
    return toMatch(scored.entry, "Medium", "Facility name partially matched the pharma registry.");
  }

  return {
    isKnownPharmaCompany: false,
    confidence: "Low",
    reason: "No matching company was found in the pharma registry."
  };
}

export function findPharmaCompanyInText(text: string): PharmaRegistryMatch {
  const normalizedText = normalizeCompanyName(text);
  if (!normalizedText) {
    return {
      isKnownPharmaCompany: false,
      confidence: "Low",
      reason: "No report text was available for registry scan."
    };
  }

  const matches = entries
    .map((entry) => {
      const score = scoreTextMatch(normalizedText, entry);
      return { entry, score };
    })
    .filter((match) => match.score >= 0.72)
    .sort((left, right) => right.score - left.score);

  const best = matches[0];
  if (!best) {
    return {
      isKnownPharmaCompany: false,
      confidence: "Low",
      reason: "No company from the pharma registry was found in the report text."
    };
  }

  return toMatch(
    best.entry,
    best.score >= 0.95 ? "High" : "Medium",
    "Facility name was found by scanning the full report text against the pharma registry."
  );
}

function toMatch(entry: PharmaRegistryEntry, confidence: PharmaRegistryMatch["confidence"], reason: string): PharmaRegistryMatch {
  return {
    isKnownPharmaCompany: true,
    confidence,
    matchedCompany: entry.companyName,
    matchedAddress: entry.address,
    country: entry.country,
    productLines: entry.productLines,
    gmpStatus: entry.gmpStatus,
    sourceSheet: entry.sourceSheet,
    reason
  };
}

function scoreTextMatch(normalizedText: string, entry: PharmaRegistryEntry): number {
  const company = entry.normalizedCompanyName;
  if (!company) return 0;
  if (normalizedText.includes(company)) return 1;

  const companyTokens = company.split(/\s+/).filter((token) => token.length > 2);
  if (!companyTokens.length) return 0;

  const matchedTokens = companyTokens.filter((token) => normalizedText.includes(token));
  return matchedTokens.length / companyTokens.length;
}
