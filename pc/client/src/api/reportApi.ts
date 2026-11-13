import { canExtractClientSide, extractDocument } from "../services/documentExtractor";
import type { ExtractReportResponse } from "../types/report.types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

export async function extractReportSections(files: File[]): Promise<ExtractReportResponse> {
  const clientSideFiles = files.filter(canExtractClientSide);
  const serverSideFiles = files.filter((f) => !canExtractClientSide(f));

  const [clientResult, serverResult] = await Promise.all([
    clientSideFiles.length > 0 ? analyzeClientExtracted(clientSideFiles) : null,
    serverSideFiles.length > 0 ? uploadForExtraction(serverSideFiles) : null
  ]);

  const reports = [
    ...(clientResult?.reports ?? []),
    ...(serverResult?.reports ?? [])
  ];

  return { success: true, reports };
}

async function analyzeClientExtracted(files: File[]): Promise<ExtractReportResponse> {
  const extracted = await Promise.all(
    files.map(async (file) => {
      const { text, html } = await extractDocument(file);
      return { fileName: file.name, text, html };
    })
  );

  const response = await fetch(`${API_BASE_URL}/api/reports/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(extracted)
  });

  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message ?? "Report analysis failed.");
  return payload;
}

async function uploadForExtraction(files: File[]): Promise<ExtractReportResponse> {
  const formData = new FormData();
  files.forEach((file) => formData.append("report", file));

  const response = await fetch(`${API_BASE_URL}/api/reports/extract`, {
    method: "POST",
    body: formData
  });

  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message ?? "Report extraction failed.");
  return payload;
}
