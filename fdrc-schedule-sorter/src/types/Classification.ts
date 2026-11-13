export type Category = 'NF' | 'RNW' | 'VARIATIONS';

export interface ClassifiedRow {
  rowNumber: number;
  applicationNumber: string;
  brandName: string;
  applicant: string;
  dosageForm: string;
  strength: string;
  category: Category;
  rawValues: (string | number | boolean | null)[];
}

export interface ClassificationResult {
  sheetName: string;
  nf: ClassifiedRow[];
  rnw: ClassifiedRow[];
  variations: ClassifiedRow[];
  total: number;
}
