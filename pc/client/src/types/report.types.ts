export interface ExtractedSection {
  title: string;
  found: boolean;
  text: string;
  html: string;
  startHeading?: string;
  endHeading?: string;
}

export interface DeficiencySection {
  title: string;
  found: boolean;
  text: string;
  html: string;
  rawText: string;
  deficiencyHtml: string;
  critical: string;
  major: string;
  others: string;
  startHeading?: string;
  endHeading?: string;
}

export interface InspectedSiteDetails {
  facilityName: string;
  address: string;
}

export interface PharmaRegistryMatch {
  isKnownPharmaCompany: boolean;
  confidence: "High" | "Medium" | "Low";
  matchedCompany?: string;
  matchedAddress?: string;
  country?: string;
  productLines?: string;
  gmpStatus?: string;
  sourceSheet?: string;
  reason: string;
}

export interface ExtractedReportSections {
  inspectedSite: ExtractedSection;
  deficiencies: DeficiencySection;
  summaryAndConclusions: ExtractedSection;
}

export interface ReportClassification {
  likelyType: "Pharmaceutical GMP" | "Medical Device/IVD GMP" | "Unknown / Needs Review";
  confidence: "High" | "Medium" | "Low";
  matchedSignals: string[];
}

export interface ExtractReportResponse {
  success: boolean;
  reports: ExtractedReportDocument[];
}

export interface ExtractedReportDocument {
  id: string;
  fileName: string;
  fileType: "docx" | "pdf";
  classification: ReportClassification;
  inspectedSite: InspectedSiteDetails;
  inspectionDate: string;
  pharmaRegistryMatch: PharmaRegistryMatch;
  sections: ExtractedReportSections;
  warnings: string[];
}

export interface ReviewedSummaryData {
  documentName: string;
  finalClassification: string;
  inspectedSite: {
    facilityName: string;
    address: string;
  };
  deficiencies: {
    criticalCount: string;
    majorCount: string;
    otherCount: string;
    notes: string;
  };
  finalRemark: string;
  reviewerNotes: string;
}

export const GMP_CATEGORIES = [
  "Pharmaceutical Quality System",
  "Personnel",
  "Premises & Equipment",
  "Qualification and Validation",
  "Documentation",
  "Production",
  "Material Management",
  "Quality Control",
  "Contract Manufacture & Analysis",
  "Complaints & Product Recall",
  "Self Inspection"
] as const;

export type GmpCategory = typeof GMP_CATEGORIES[number];

export interface CategoryDeficiency {
  critical: string;
  major: string;
  others: string;
}

export interface DocumentReviewState {
  finalClassification: string;
  facilityName: string;
  address: string;
  inspectionDate: string;
  categoryDeficiencies: Record<GmpCategory, CategoryDeficiency>;
  finalRemark: string;
}
