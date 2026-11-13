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

export interface PharmaRegistryEntry {
  id: string;
  companyName: string;
  normalizedCompanyName: string;
  address: string;
  country: string;
  productLines: string;
  gmpStatus: string;
  sourceSheet: string;
  inspectionDate: string;
  validTill: string;
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
