import type { Request, Response } from "express";
import { classifyReport } from "../services/reportClassifier.service.js";
import { extractInspectedSiteDetails, extractReportSections } from "../services/sectionExtractor.service.js";
import { findPharmaCompanyInText, lookupPharmaCompany } from "../services/pharmaRegistry.service.js";
import { extractInspectionMonthYear } from "../services/inspectionDate.service.js";
import { extractSiteDetailsFromText, mergeSiteDetails } from "../services/siteFallback.service.js";
import { detectReportFileType } from "../services/reportText.service.js";
import type { ExtractedReportDocument, ExtractReportResponse } from "../types/report.types.js";

interface AnalyzePayloadItem {
  fileName: string;
  text: string;
  html: string;
}

export async function analyzeReports(req: Request, res: Response): Promise<void> {
  const items: AnalyzePayloadItem[] = Array.isArray(req.body) ? req.body : [];

  if (items.length === 0) {
    res.status(400).json({ success: false, message: "No documents provided." });
    return;
  }

  const results: ExtractedReportDocument[] = items.map((item, index) =>
    analyzeDocument(item, index)
  );

  const response: ExtractReportResponse = { success: true, reports: results };
  res.json(response);
}

function analyzeDocument(item: AnalyzePayloadItem, index: number): ExtractedReportDocument {
  const { fileName, text, html } = item;
  const fileType = detectReportFileType(fileName);
  const classification = classifyReport(text);
  const { sections, warnings } = extractReportSections(text, html);
  const extractedSite = extractInspectedSiteDetails(sections.inspectedSite);
  const heuristicSite = extractSiteDetailsFromText(text);
  const registryFromExtracted = lookupPharmaCompany(extractedSite.facilityName || heuristicSite.facilityName);
  const registryMatch = registryFromExtracted.isKnownPharmaCompany
    ? registryFromExtracted
    : findPharmaCompanyInText(text);
  const inspectedSite = mergeSiteDetails(extractedSite, heuristicSite, registryMatch);

  return {
    id: `${index + 1}-${fileName}`,
    fileName,
    fileType,
    classification,
    inspectedSite,
    inspectionDate: extractInspectionMonthYear(text),
    pharmaRegistryMatch: registryMatch.isKnownPharmaCompany
      ? registryMatch
      : lookupPharmaCompany(inspectedSite.facilityName),
    sections,
    warnings
  };
}
