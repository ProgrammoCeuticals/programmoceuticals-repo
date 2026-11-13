export interface WorksheetInfo {
  name: string;
  rowCount: number;
  columnCount: number;
}

export interface LoadedWorkbook {
  fileName: string;
  worksheets: WorksheetInfo[];
  file: File;
}
