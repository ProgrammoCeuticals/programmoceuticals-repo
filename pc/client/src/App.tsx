import { useState } from "react";
import { extractReportSections } from "./api/reportApi";
import { DeficienciesCard } from "./components/DeficienciesCard";
import { DocumentSidebar } from "./components/DocumentSidebar";
import { InspectedSiteCard } from "./components/InspectedSiteCard";
import { PharmaRegistryCard } from "./components/PharmaRegistryCard";
import { SummaryCard } from "./components/SummaryCard";
import { UploadForm } from "./components/UploadForm";
import {
  GMP_CATEGORIES,
  type CategoryDeficiency,
  type DocumentReviewState,
  type ExtractReportResponse,
  type GmpCategory
} from "./types/report.types";
import { exportToExcel } from "./utils/exportToExcel";

function emptyCategories(): Record<GmpCategory, CategoryDeficiency> {
  return Object.fromEntries(
    GMP_CATEGORIES.map((cat) => [cat, { critical: "", major: "", others: "" }])
  ) as Record<GmpCategory, CategoryDeficiency>;
}

export default function App() {
  const [result, setResult] = useState<ExtractReportResponse | null>(null);
  const [selectedReportId, setSelectedReportId] = useState("");
  const [reviews, setReviews] = useState<Record<string, DocumentReviewState>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [skippedCount, setSkippedCount] = useState(0);

  async function handleSubmit(reports: File[]) {
    setLoading(true);
    setError("");

    try {
      const response = await extractReportSections(reports);
      const pharmaReports = response.reports.filter(
        (r) => r.classification.likelyType === "Pharmaceutical GMP"
      );
      const filtered = { ...response, reports: pharmaReports };
      setResult(filtered);
      setSelectedReportId(pharmaReports[0]?.id ?? "");
      const skipped = response.reports.length - pharmaReports.length;
      setSkippedCount(skipped);
      setReviews(
        Object.fromEntries(
          pharmaReports.map((report) => [
            report.id,
            {
              finalClassification: report.classification.likelyType,
              facilityName: report.inspectedSite.facilityName,
              address: report.inspectedSite.address,
              inspectionDate: report.inspectionDate,
              categoryDeficiencies: emptyCategories(),
              finalRemark: ""
            }
          ])
        )
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to extract report sections.");
    } finally {
      setLoading(false);
    }
  }

  const selectedReport = result?.reports.find((r) => r.id === selectedReportId) ?? null;
  const selectedReview = selectedReport ? reviews[selectedReport.id] : null;

  function updateSelectedReview(patch: Partial<DocumentReviewState>) {
    if (!selectedReport) return;
    setReviews((current) => ({
      ...current,
      [selectedReport.id]: { ...current[selectedReport.id], ...patch }
    }));
  }

  function handleExport() {
    if (!result) return;
    const reviewList = result.reports.map((r) => reviews[r.id]).filter(Boolean);
    const fileNames = result.reports.map((r) => r.fileName);
    exportToExcel(reviewList, fileNames);
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="shrink-0 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">ProgrammoCeuticals</p>
              <h1 className="text-sm font-bold text-ink">GMP Report Review</h1>
            </div>
          </div>
          {result && (
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
                {result.reports.length} document{result.reports.length === 1 ? "" : "s"} loaded
              </span>
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Export to Excel
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-8">
        {!result && (
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-ink">Upload GMP Reports</h2>
              <p className="mt-2 text-sm text-slate-500">Upload one or more inspection reports in .doc, .docx or .pdf format to begin review.</p>
            </div>
            <UploadForm loading={loading} onSubmit={handleSubmit} />
          </div>
        )}

        {result && (
          <div className="mb-6 flex items-center justify-between">
            <UploadForm loading={loading} onSubmit={handleSubmit} compact />
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm font-medium text-danger">
            {error}
          </div>
        )}

        {skippedCount > 0 && (
          <div className="mb-6 rounded-xl border border-warning/30 bg-warning-light px-4 py-3 text-sm font-medium text-warning">
            {skippedCount} file{skippedCount === 1 ? " was" : "s were"} excluded — not classified as Pharmaceutical GMP.
          </div>
        )}

        {result && selectedReport && selectedReview && (
          <div className="grid min-h-0 gap-6 lg:grid-cols-[280px_1fr]">
            <DocumentSidebar
              reports={result.reports}
              selectedId={selectedReportId}
              onSelect={setSelectedReportId}
            />

            <div className="grid gap-5">
              <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Selected document</p>
                <h2 className="mt-1 break-words text-lg font-bold text-ink">{selectedReport.fileName}</h2>
              </div>

              {selectedReport.warnings.length > 0 && (
                <div className="rounded-xl border border-warning/30 bg-warning-light px-4 py-3">
                  {selectedReport.warnings.map((w) => (
                    <p key={w} className="text-sm font-medium text-warning">{w}</p>
                  ))}
                </div>
              )}

              <PharmaRegistryCard match={selectedReport.pharmaRegistryMatch} />
              <InspectedSiteCard
                section={selectedReport.sections.inspectedSite}
                facilityName={selectedReview.facilityName}
                address={selectedReview.address}
                inspectionDate={selectedReview.inspectionDate}
                onFacilityNameChange={(v) => updateSelectedReview({ facilityName: v })}
                onAddressChange={(v) => updateSelectedReview({ address: v })}
                onInspectionDateChange={(v) => updateSelectedReview({ inspectionDate: v })}
              />
              <DeficienciesCard
                section={selectedReport.sections.deficiencies}
                categoryDeficiencies={selectedReview.categoryDeficiencies}
                onChange={(category, patch) =>
                  updateSelectedReview({
                    categoryDeficiencies: {
                      ...selectedReview.categoryDeficiencies,
                      [category]: { ...selectedReview.categoryDeficiencies[category], ...patch }
                    }
                  })
                }
              />
              <SummaryCard
                section={selectedReport.sections.summaryAndConclusions}
                finalRemark={selectedReview.finalRemark}
                onFinalRemarkChange={(v) => updateSelectedReview({ finalRemark: v })}
              />
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
