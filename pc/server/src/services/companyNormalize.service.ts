const companySuffixes = [
  "limited",
  "ltd",
  "private",
  "pvt",
  "company",
  "co",
  "corporation",
  "corp",
  "inc",
  "incorporated",
  "plc",
  "pharmaceutical",
  "pharmaceuticals",
  "laboratories",
  "laboratory",
  "industries",
  "industry"
];

export function normalizeCompanyName(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => !companySuffixes.includes(token))
    .join(" ")
    .trim();
}

export function tokenSimilarity(left: string, right: string): number {
  const leftTokens = new Set(normalizeCompanyName(left).split(/\s+/).filter(Boolean));
  const rightTokens = new Set(normalizeCompanyName(right).split(/\s+/).filter(Boolean));
  if (!leftTokens.size || !rightTokens.size) return 0;

  const intersection = [...leftTokens].filter((token) => rightTokens.has(token)).length;
  return intersection / Math.max(leftTokens.size, rightTokens.size);
}
