import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import ExcelJS from "exceljs";
import type { PharmaRegistryEntry } from "../types/report.types.js";
import { normalizeCompanyName } from "../services/companyNormalize.service.js";

const workbookPath = process.argv[2];

if (!workbookPath) {
  console.error("Usage: npm run import:pharma-db -- <path-to-workbook.xlsx>");
  process.exit(1);
}

const preferredSheetName = "Collated for Upload (2023-2026)";
const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile(resolve(workbookPath));

const entries = workbook.worksheets.flatMap((worksheet) => {
  if (worksheet.name !== preferredSheetName && !/^\d{4}$/.test(worksheet.name)) return [];
  return extractEntriesFromSheet(worksheet);
});

const deduped = dedupeEntries(entries);
const outputPath = resolve("src/data/pharma-companies.json");
await writeFile(outputPath, `${JSON.stringify(deduped, null, 2)}\n`);

console.log(`Imported ${deduped.length} pharma company records into ${outputPath}`);

function extractEntriesFromSheet(worksheet: ExcelJS.Worksheet): PharmaRegistryEntry[] {
  const headerRowNumber = findHeaderRow(worksheet);
  if (!headerRowNumber) return [];

  const headers = readRow(worksheet.getRow(headerRowNumber)).map((header) => header.toLowerCase().trim());
  const column = {
    serial: findColumn(headers, ["s/n", "sn"]),
    company: findColumn(headers, ["name of company"]),
    address: findColumn(headers, ["address of company"]),
    productLines: findColumn(headers, ["product lines inspected"]),
    inspectionDate: findColumn(headers, ["date of inspection", "date_of_inspection"]),
    validTill: findColumn(headers, ["valid till"]),
    gmpStatus: findColumn(headers, ["gmp status"])
  };

  if (!column.company) return [];
  const companyColumn = column.company;

  const records: PharmaRegistryEntry[] = [];
  let currentCountry = "";

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber <= headerRowNumber) return;

    const values = readRow(row);
    const companyName = cleanText(values[companyColumn - 1] ?? "");
    const serial = column.serial ? cleanText(values[column.serial - 1] ?? "") : "";

    if (!serial && companyName && values.filter(Boolean).length <= 3) {
      currentCountry = companyName;
      return;
    }

    if (!companyName || !/\d/.test(serial)) return;

    const normalizedCompanyName = normalizeCompanyName(companyName);
    if (!normalizedCompanyName) return;

    records.push({
      id: `${worksheet.name}-${serial}-${normalizedCompanyName}`,
      companyName,
      normalizedCompanyName,
      address: cleanText(values[(column.address ?? 0) - 1] ?? ""),
      country: currentCountry,
      productLines: cleanText(values[(column.productLines ?? 0) - 1] ?? ""),
      gmpStatus: cleanText(values[(column.gmpStatus ?? 0) - 1] ?? ""),
      sourceSheet: worksheet.name,
      inspectionDate: cleanText(values[(column.inspectionDate ?? 0) - 1] ?? ""),
      validTill: cleanText(values[(column.validTill ?? 0) - 1] ?? "")
    });
  });

  return records;
}

function findHeaderRow(worksheet: ExcelJS.Worksheet): number | null {
  for (let rowNumber = 1; rowNumber <= Math.min(20, worksheet.rowCount); rowNumber += 1) {
    const values = readRow(worksheet.getRow(rowNumber)).map((value) => value.toLowerCase());
    if (values.some((value) => value.includes("name of company"))) return rowNumber;
  }
  return null;
}

function findColumn(headers: string[], candidates: string[]): number | null {
  const index = headers.findIndex((header) => candidates.some((candidate) => header.includes(candidate)));
  return index === -1 ? null : index + 1;
}

function readRow(row: ExcelJS.Row): string[] {
  const values = row.values;
  if (!Array.isArray(values)) return [];
  return values.slice(1).map(cellToString);
}

function cellToString(value: ExcelJS.CellValue): string {
  if (value == null) return "";
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object") {
    if ("text" in value && typeof value.text === "string") return value.text;
    if ("richText" in value && Array.isArray(value.richText)) {
      return value.richText.map((part) => part.text).join("");
    }
    if ("result" in value) return String(value.result ?? "");
    if ("hyperlink" in value && "text" in value) return String(value.text ?? "");
  }
  return String(value);
}

function cleanText(value: string): string {
  return value
    .replace(/\r/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function dedupeEntries(records: PharmaRegistryEntry[]): PharmaRegistryEntry[] {
  const byKey = new Map<string, PharmaRegistryEntry>();
  for (const record of records) {
    const key = `${record.normalizedCompanyName}|${normalizeCompanyName(record.address)}`;
    const existing = byKey.get(key);
    if (!existing || record.sourceSheet === preferredSheetName) {
      byKey.set(key, record);
    }
  }
  return [...byKey.values()].sort((left, right) => left.companyName.localeCompare(right.companyName));
}
