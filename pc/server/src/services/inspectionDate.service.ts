const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const monthAliases: Record<string, string> = {
  jan: "January",
  january: "January",
  feb: "February",
  february: "February",
  mar: "March",
  march: "March",
  apr: "April",
  april: "April",
  may: "May",
  jun: "June",
  june: "June",
  jul: "July",
  july: "July",
  aug: "August",
  august: "August",
  sep: "September",
  sept: "September",
  september: "September",
  oct: "October",
  october: "October",
  nov: "November",
  november: "November",
  dec: "December",
  december: "December"
};

const monthPattern = Object.keys(monthAliases).join("|");

export function extractInspectionMonthYear(text: string): string {
  const candidates = findDateCandidates(text);

  for (const candidate of candidates) {
    const normalized = normalizeInspectionDate(candidate);
    if (normalized) return normalized;
  }

  return "";
}

function findDateCandidates(text: string): string[] {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const candidates: string[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (/^date\s+of\s+inspection\b/i.test(line)) {
      candidates.push(line);
      if (lines[index + 1]) candidates.push(lines[index + 1]);
    }
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (/^audit\s+date\b/i.test(line)) {
      candidates.push(line);
      if (lines[index + 1]) candidates.push(lines[index + 1]);
    }
  }

  const scopedText = lines.slice(0, 380).join("\n");
  const sentenceMatches = scopedText.match(
    new RegExp(`.{0,80}\\b(${monthPattern})\\.?\\s*,?\\s*(20\\d{2}|19\\d{2}).{0,40}`, "gi")
  );
  if (sentenceMatches) candidates.push(...sentenceMatches);

  return candidates;
}

export function normalizeInspectionDate(value: string): string {
  const cleaned = value
    .replace(/date\s+of\s+inspection/gi, " ")
    .replace(/audit\s+date/gi, " ")
    .replace(/inspection\s+date/gi, " ")
    .replace(/[:–—-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const monthYear = cleaned.match(new RegExp(`\\b(${monthPattern})\\.?\\b\\s*,?\\s*(20\\d{2}|19\\d{2})`, "i"));
  if (monthYear) {
    return `${monthAliases[monthYear[1].toLowerCase().replace(".", "")]}, ${monthYear[2]}`;
  }

  const numericDate = cleaned.match(/\b(?:\d{1,2}[\/.-]){2}(20\d{2}|19\d{2})\b/);
  if (numericDate) {
    const parts = numericDate[0].split(/[\/.-]/).map(Number);
    const month = parts[1];
    const year = parts[2];
    if (month >= 1 && month <= 12) return `${monthNames[month - 1]}, ${year}`;
  }

  return "";
}
