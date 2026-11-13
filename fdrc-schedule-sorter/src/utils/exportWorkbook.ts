import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type { ClassificationResult } from '../types/Classification';
import type { AnalysedWorksheet } from '../types/Worksheet';
import { duplicateWorksheet } from './worksheetDuplicator';

export interface ExportConfig {
  workbook: ExcelJS.Workbook;
  originalFileName: string;
  importedResult: ClassificationResult | null;
  nigerianResult: ClassificationResult | null;
  importedAnalysed: AnalysedWorksheet | null;
  nigerianAnalysed: AnalysedWorksheet | null;
  onProgress: (msg: string) => void;
}

/** Generate the processed workbook and trigger download */
export async function exportWorkbook(config: ExportConfig): Promise<void> {
  const { workbook, originalFileName, importedResult, nigerianResult,
    importedAnalysed, nigerianAnalysed, onProgress } = config;

  onProgress('Generating Workbook...');

  if (importedResult && importedAnalysed) {
    const headerRowNum = importedAnalysed.headerRowNum ?? 1;
    duplicateWorksheet(workbook, importedResult.sheetName, 'Imported NF', importedResult.nf, headerRowNum);
    duplicateWorksheet(workbook, importedResult.sheetName, 'Imported RNW', importedResult.rnw, headerRowNum);
    duplicateWorksheet(workbook, importedResult.sheetName, 'Imported Variations', importedResult.variations, headerRowNum);
  }

  if (nigerianResult && nigerianAnalysed) {
    const headerRowNum = nigerianAnalysed.headerRowNum ?? 1;
    duplicateWorksheet(workbook, nigerianResult.sheetName, 'Nigerian NF', nigerianResult.nf, headerRowNum);
    duplicateWorksheet(workbook, nigerianResult.sheetName, 'Nigerian RNW', nigerianResult.rnw, headerRowNum);
    duplicateWorksheet(workbook, nigerianResult.sheetName, 'Nigerian Variations', nigerianResult.variations, headerRowNum);
  }

  onProgress('Preparing Download...');

  const buffer = await workbook.xlsx.writeBuffer();
  const baseName = originalFileName.replace(/\.(xlsx|xlsm)$/i, '');
  saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    `${baseName}_Processed.xlsx`);
}
