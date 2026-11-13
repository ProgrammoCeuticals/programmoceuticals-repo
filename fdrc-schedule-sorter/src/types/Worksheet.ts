export interface WorksheetRow {
  rowNumber: number;
  applicationNumber: string;
  brandName: string;
  applicant: string;
  dosageForm: string;
  strength: string;
  rawValues: (string | number | boolean | null)[];
}

export interface AnalysedWorksheet {
  sheetName: string;
  headers: string[];
  appNumberColIndex: number;
  headerRowNum: number;
  rows: WorksheetRow[];
  blankAppNumbers: number[];
  duplicateAppNumbers: string[];
}
