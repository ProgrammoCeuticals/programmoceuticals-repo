import ExcelJS from 'exceljs';
import type { LoadedWorkbook } from '../types/Workbook';

/** Read an Excel file and return worksheet metadata without processing data */
export async function readWorkbook(file: File): Promise<{ workbook: ExcelJS.Workbook; meta: LoadedWorkbook }> {
  const buffer = await file.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  if (workbook.worksheets.length === 0) {
    throw new Error('Workbook contains no worksheets.');
  }

  const worksheets = workbook.worksheets.map((ws) => {
    // Count only non-empty rows to exclude blanks from the display count
    let dataRows = 0;
    ws.eachRow((row, rowNum) => {
      if (rowNum === 1) return;
      const vals = (row.values as ExcelJS.CellValue[]).slice(1);
      if (vals.some((v) => v !== null && v !== undefined && String(v).trim() !== '')) dataRows++;
    });
    return { name: ws.name, rowCount: dataRows, columnCount: ws.columnCount };
  });

  return {
    workbook,
    meta: { fileName: file.name, worksheets, file },
  };
}
