import ExcelJS from 'exceljs';
import type { AnalysedWorksheet, WorksheetRow } from '../types/Worksheet';
import { classify } from './classification';
import type { ClassifiedRow, ClassificationResult } from '../types/Classification';

const APP_NUMBER_ALIASES = [
  'application number', 'app number', 'application no', 'app no',
  'appl. number', 'appl number', 'appl no', 'appl. no', 'applic. number',
  'app. no', 'app. number', 'application num', 'appl num',
];

/** Find the APPLICATION NUMBER column index (0-based) by scanning the header row */
function findAppNumberCol(headers: string[]): number {
  return headers.findIndex((h) =>
    APP_NUMBER_ALIASES.some((alias) => h.trim().toLowerCase().includes(alias))
  );
}

/** Find a column index by partial name match (0-based) */
function findCol(headers: string[], ...terms: string[]): number {
  return headers.findIndex((h) =>
    terms.some((t) => h.trim().toLowerCase().includes(t))
  );
}

/** Get cell value as string */
function cellStr(cell: ExcelJS.Cell): string {
  if (cell.value === null || cell.value === undefined) return '';
  if (typeof cell.value === 'object' && 'richText' in (cell.value as object)) {
    return (cell.value as ExcelJS.CellRichTextValue).richText.map((r) => r.text).join('');
  }
  if (typeof cell.value === 'object' && 'result' in (cell.value as object)) {
    return String((cell.value as ExcelJS.CellFormulaValue).result ?? '');
  }
  return String(cell.value);
}

/** Analyse a worksheet: find headers, extract rows, detect blanks and duplicates */
export function analyseWorksheet(ws: ExcelJS.Worksheet): AnalysedWorksheet {
  // Find the header row: skip title rows (single merged cell repeated across columns, or only 1 unique value)
  let headerRowNum = 1;
  for (let r = 1; r <= Math.min(20, ws.rowCount); r++) {
    const row = ws.getRow(r);
    const vals = (row.values as ExcelJS.CellValue[]).slice(1);
    const nonEmpty = vals
      .map((v) => (v !== null && v !== undefined ? String(v).trim() : ''))
      .filter((v) => v !== '');
    if (nonEmpty.length < 3) continue;
    // If all non-empty values are the same it's a merged title row — skip it
    const unique = new Set(nonEmpty);
    if (unique.size === 1) continue;
    headerRowNum = r;
    break;
  }

  const headerRow = ws.getRow(headerRowNum);
  const headers: string[] = (headerRow.values as ExcelJS.CellValue[])
    .slice(1)
    .map((v) => (v ? String(v) : ''));

  // Debug: log headers to console so we can see what was read
  console.log(`[${ws.name}] Header row: ${headerRowNum}`);
  console.log(`[${ws.name}] Headers:`, headers);

  const appNumberColIndex = findAppNumberCol(headers);
  if (appNumberColIndex === -1) {
    throw new Error(`APPLICATION NUMBER column not found in worksheet "${ws.name}".`);
  }

  const brandCol = findCol(headers, 'brand name', 'brand');
  const applicantCol = findCol(headers, 'applicant', 'company');
  const dosageCol = findCol(headers, 'dosage form', 'dosage');
  const strengthCol = findCol(headers, 'strength');

  const rows: WorksheetRow[] = [];
  const blankAppNumbers: number[] = [];
  const seenAppNumbers = new Set<string>();
  const duplicateAppNumbers: string[] = [];

  for (let r = headerRowNum + 1; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const rawValues = (row.values as ExcelJS.CellValue[]).slice(1).map((v) => {
      if (v === null || v === undefined) return null;
      if (typeof v === 'object' && 'richText' in (v as object))
        return (v as ExcelJS.CellRichTextValue).richText.map((rt) => rt.text).join('');
      if (typeof v === 'object' && 'result' in (v as object))
        return String((v as ExcelJS.CellFormulaValue).result ?? '');
      return v as string | number | boolean;
    });

    // Skip rows where every cell is empty or whitespace-only
    if (rawValues.every((v) => v === null || v === undefined || String(v).trim() === '')) continue;

    const appNumber = cellStr(row.getCell(appNumberColIndex + 1)).trim();
    if (!appNumber) { blankAppNumbers.push(r); continue; }

    // Keep only the first occurrence of each application number
    if (seenAppNumbers.has(appNumber)) {
      if (!duplicateAppNumbers.includes(appNumber)) duplicateAppNumbers.push(appNumber);
      continue;
    }
    seenAppNumbers.add(appNumber);

    rows.push({
      rowNumber: r,
      applicationNumber: appNumber,
      brandName: brandCol >= 0 ? cellStr(row.getCell(brandCol + 1)) : '',
      applicant: applicantCol >= 0 ? cellStr(row.getCell(applicantCol + 1)) : '',
      dosageForm: dosageCol >= 0 ? cellStr(row.getCell(dosageCol + 1)) : '',
      strength: strengthCol >= 0 ? cellStr(row.getCell(strengthCol + 1)) : '',
      rawValues,
    });
  }

  return { sheetName: ws.name, headers, appNumberColIndex, headerRowNum, rows, blankAppNumbers, duplicateAppNumbers };
}

/** Classify all rows in an analysed worksheet */
export function classifyWorksheet(analysed: AnalysedWorksheet): ClassificationResult {
  const classified: ClassifiedRow[] = analysed.rows.map((row) => ({
    ...row,
    category: classify(row.applicationNumber),
  }));

  return {
    sheetName: analysed.sheetName,
    nf: classified.filter((r) => r.category === 'NF'),
    rnw: classified.filter((r) => r.category === 'RNW'),
    variations: classified.filter((r) => r.category === 'VARIATIONS'),
    total: classified.length,
  };
}
