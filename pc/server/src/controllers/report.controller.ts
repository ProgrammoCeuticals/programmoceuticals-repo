import type { Request, Response } from "express";
import { cleanupFiles } from "../utils/fileCleanup.js";
import { classifyReport } from "../services/reportClassifier.service.js";
import { detectReportFileType, extractDocumentFromReport } from "../services/reportText.service.js";
import { extractInspectedSiteDetails, extractReportSections } from "../services/sectionExtractor.service.js";
import { findPharmaCompanyInText, lookupPharmaCompany } from "../services/pharmaRegistry.service.js";
import { extractInspectionMonthYear } from "../services/inspectionDate.service.js";
import { extractSiteDetailsFromText, mergeSiteDetails } from "../services/siteFallback.service.js";
import type { ExtractedReportDocument, ExtractReportResponse } from "../types/report.types.js";

export async function extractReport(req: Request, res: Response): Promise<void> {
  const files = Array.isArray(req.files) ? req.files : [];
  const reports = files.filter(isReportFile);
  const uploadedPaths = files.map((file) => file.path);

  try {
    if (reports.length === 0) {
      res.status(400).json({ success: false, message: "At least one report file is required." });
      return;
    }

    const extractedReports: ExtractedReportDocument[] = [];
    const batchSize = 10;
    for (let i = 0; i < reports.length; i += batchSize) {
      const batch = reports.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map((report, j) => processReport(report, i + j)));
      extractedReports.push(...batchResults);
    }

    const response: ExtractReportResponse = {
      success: true,
      reports: extractedReports
    };

    res.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to extract report sections.";
    res.status(400).json({ success: false, message });
  } finally {
    await cleanupFiles(uploadedPaths);
  }
}

function isReportFile(file: Express.Multer.File): boolean {
  const name = file.originalname.toLowerCase();
  return name.endsWith(".doc") || name.endsWith(".docx") || name.endsWith(".pdf");
}

async function processReport(report: Express.Multer.File, index: number): Promise<ExtractedReportDocument> {
  const fileType = detectReportFileType(report.originalname);
  const { text: reportText, html: reportHtml } = await extractDocumentFromReport(report.path, report.originalname);
  const classification = classifyReport(reportText);
  const { sections, warnings } = extractReportSections(reportText, reportHtml);
  const extractedSite = extractInspectedSiteDetails(sections.inspectedSite);
  const heuristicSite = extractSiteDetailsFromText(reportText);
  const registryFromExtracted = lookupPharmaCompany(extractedSite.facilityName || heuristicSite.facilityName);
  const registryMatch = registryFromExtracted.isKnownPharmaCompany
    ? registryFromExtracted
    : findPharmaCompanyInText(reportText);
  const inspectedSite = mergeSiteDetails(extractedSite, heuristicSite, registryMatch);

  return {
    id: `${index + 1}-${report.originalname}`,
    fileName: report.originalname,
    fileType,
    classification,
    inspectedSite,
    inspectionDate: extractInspectionMonthYear(reportText),
    pharmaRegistryMatch: registryMatch.isKnownPharmaCompany ? registryMatch : lookupPharmaCompany(inspectedSite.facilityName),
    sections,
    warnings
  };
}
