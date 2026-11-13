import type { ExtractedReportDocument } from "../types/report.types";

export function DocumentSidebar({
  reports,
  selectedId,
  onSelect
}: {
  reports: ExtractedReportDocument[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="rounded-xl border border-slate-200 bg-white shadow-card lg:sticky lg:top-8 lg:self-start">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Documents</h2>
        <p className="mt-0.5 text-sm text-slate-400">{reports.length} report{reports.length === 1 ? "" : "s"} processed</p>
      </div>
      <div className="max-h-[calc(100vh-220px)] overflow-auto p-2">
        {reports.map((report) => {
          const selected = report.id === selectedId;
          return (
            <button
              key={report.id}
              type="button"
              onClick={() => onSelect(report.id)}
              className={`w-full rounded-lg px-4 py-3 text-left transition ${
                selected
                  ? "bg-blue-800 text-white"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="block truncate text-sm font-semibold leading-snug">{report.fileName}</span>
              {report.warnings.length > 0 && (
                <span className={`mt-1 block text-xs ${selected ? "text-blue-200" : "text-warning"}`}>
                  {report.warnings.length} warning{report.warnings.length === 1 ? "" : "s"}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
