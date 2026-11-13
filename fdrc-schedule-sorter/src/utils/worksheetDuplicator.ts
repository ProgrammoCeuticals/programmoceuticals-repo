import ExcelJS from 'exceljs';
import type { ClassifiedRow } from '../types/Classification';

/** Deep-copy all style properties from one cell to another */
function copyStyle(src: ExcelJS.Cell, dest: ExcelJS.Cell) {
  dest.style = JSON.parse(JSON.stringify(src.style));
}

/** Find the serial number column index (1-based) by scanning the header row */
function findSnCol(ws: ExcelJS.Worksheet, headerRowNum: number): number {
  const SN_ALIASES = ['s/n', 's.n', 'sn', 'serial', 'no.', 's/no', 'seq'];
  const headerRow = ws.getRow(headerRowNum);
  let snCol = -1;
  headerRow.eachCell((cell, colNum) => {
    const val = String(cell.value ?? '').trim().toLowerCase().replace(/\s+/g, '');
    if (SN_ALIASES.some((alias) => val === alias.replace(/\s+/g, ''))) snCol = colNum;
  });
  return snCol;
}

/**
 * Duplicate a worksheet keeping only rows in keepRows.
 * Renumbers the S/N column sequentially starting from 1.
 * Preserves: styles, merged cells, row heights, column widths, page setup, freeze panes, print area.
 */
export function duplicateWorksheet(
  workbook: ExcelJS.Workbook,
  sourceSheetName: string,
  newSheetName: string,
  keepRows: ClassifiedRow[],
  headerRowNum: number = 1
): ExcelJS.Worksheet {
  const src = workbook.getWorksheet(sourceSheetName)!;
  const dest = workbook.addWorksheet(newSheetName);

  // Copy column widths
  src.columns.forEach((col, i) => {
    const destCol = dest.getColumn(i + 1);
    destCol.width = col.width;
    destCol.hidden = col.hidden ?? false;
  });

  // Copy page setup, header/footer, views
  dest.pageSetup = { ...src.pageSetup };
  dest.headerFooter = { ...src.headerFooter };
  if (src.views && src.views.length > 0) {
    dest.views = JSON.parse(JSON.stringify(src.views));
  }

  const snCol = findSnCol(src, headerRowNum);
  const keepRowNumbers = new Set(keepRows.map((r) => r.rowNumber));

  let destRowNum = 1;
  let serialCounter = 1;
  const srcToDestRow: Map<number, number> = new Map();

  for (let r = 1; r <= src.rowCount; r++) {
    const isData = r > headerRowNum;
    if (isData && !keepRowNumbers.has(r)) continue;

    const srcRow = src.getRow(r);
    const destRow = dest.getRow(destRowNum);
    destRow.height = srcRow.height ?? 15;
    destRow.hidden = srcRow.hidden ?? false;
    srcToDestRow.set(r, destRowNum);

    srcRow.eachCell({ includeEmpty: true }, (cell, colNum) => {
      const destCell = destRow.getCell(colNum);
      try {
        destCell.value = cell.formula ? (cell.result ?? null) : cell.value;
      } catch {
        destCell.value = null;
      }
      copyStyle(cell, destCell);
    });

    // Renumber S/N column on data rows
    if (isData && snCol > 0) {
      const snCell = destRow.getCell(snCol);
      snCell.value = serialCounter++;
    }

    destRowNum++;
  }

  // Re-apply merged cells that fall within copied rows
  try {
    src.model.merges?.forEach((mergeRange: string) => {
      const match = mergeRange.match(/([A-Z]+)(\d+):([A-Z]+)(\d+)/);
      if (!match) return;
      const destStart = srcToDestRow.get(parseInt(match[2]));
      const destEnd = srcToDestRow.get(parseInt(match[4]));
      if (destStart !== undefined && destEnd !== undefined) {
        try { dest.mergeCells(`${match[1]}${destStart}:${match[3]}${destEnd}`); } catch { /* ignore */ }
      }
    });
  } catch { /* merges not available */ }

  return dest;
}
