import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Select, Spinner } from "@rims/ui";
import api from "../../lib/api";

// ── Types ──────────────────────────────────────────────────────────────────

interface Cycle {
  id: string;
  name: string;
}

interface SubjectTypeRow {
  subjectType: string;
  count: number;
}

interface ResultStatusRow {
  status: string;
  count: number;
}

interface PerformanceReport {
  cycleId: string;
  cycleName?: string;
  assignmentsBySubjectType?: SubjectTypeRow[];
  resultsByStatus?: ResultStatusRow[];
  completionPercentage?: number;
}

// ── PerformanceReportPage ──────────────────────────────────────────────────

export function PerformanceReportPage() {
  const [cycleId, setCycleId] = useState("");

  const { data: cyclesData, isLoading: cyclesLoading } = useQuery({
    queryKey: ["performance-cycles-list"],
    queryFn: () =>
      api
        .get<{ data: Cycle[] }>("/performance/cycles?pageSize=100")
        .then((r) => r.data),
  });

  const cycles: Cycle[] =
    (cyclesData as { data?: Cycle[] } | undefined)?.data ?? [];

  const { data: reportData, isLoading: reportLoading } = useQuery({
    queryKey: ["report-performance", cycleId],
    queryFn: () =>
      api
        .get<{ data: PerformanceReport }>(
          `/reports/performance?cycleId=${cycleId}`,
        )
        .then((r) => r.data),
    enabled: !!cycleId,
  });

  const report: PerformanceReport | undefined = (
    reportData as { data?: PerformanceReport } | undefined
  )?.data;

  return (
    <div>
      <PageHeader title="Performance Report" />

      {/* Cycle selector */}
      <div className="mb-6">
        {cyclesLoading ? (
          <Spinner size="sm" />
        ) : (
          <Select
            value={cycleId}
            onChange={(e) => setCycleId(e.target.value)}
            options={[
              { value: "", label: "Select a cycle…" },
              ...cycles.map((c) => ({ value: c.id, label: c.name })),
            ]}
            className="w-64"
          />
        )}
      </div>

      {cycleId && reportLoading && (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      )}

      {report && (
        <div className="space-y-6">
          {/* Assignments by subject type */}
          {(report.assignmentsBySubjectType ?? []).length > 0 && (
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-sm font-semibold text-slate-700 mb-4">
                Assignments by Subject Type
              </h2>
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500 uppercase">
                      Subject Type
                    </th>
                    <th className="text-left py-2 text-xs font-medium text-slate-500 uppercase">
                      Count
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(report.assignmentsBySubjectType ?? []).map((row) => (
                    <tr key={row.subjectType}>
                      <td className="py-2 pr-4 text-slate-700">
                        {row.subjectType}
                      </td>
                      <td className="py-2 text-slate-700">{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Results by status */}
          {(report.resultsByStatus ?? []).length > 0 && (
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-sm font-semibold text-slate-700 mb-4">
                Results by Status
              </h2>
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500 uppercase">
                      Status
                    </th>
                    <th className="text-left py-2 text-xs font-medium text-slate-500 uppercase">
                      Count
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(report.resultsByStatus ?? []).map((row) => (
                    <tr key={row.status}>
                      <td className="py-2 pr-4 text-slate-700">{row.status}</td>
                      <td className="py-2 text-slate-700">{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Completion percentage */}
          {report.completionPercentage != null && (
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-sm font-semibold text-slate-700 mb-4">
                Completion
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-100 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{ width: `${report.completionPercentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-700 w-10 text-right">
                  {report.completionPercentage}%
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {cycleId && !reportLoading && !report && (
        <p className="text-sm text-slate-500">No report data available for this cycle.</p>
      )}
    </div>
  );
}
