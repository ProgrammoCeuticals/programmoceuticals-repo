import { useQuery } from "@tanstack/react-query";
import { PageHeader, Spinner } from "@rims/ui";
import api from "../../lib/api";

// ── Types ──────────────────────────────────────────────────────────────────

interface StatusCount {
  status: string;
  count: number;
}

interface ExecutiveOverview {
  totalActiveEmployees: number;
  activeDepartments: number;
  activeResearchProjects: number;
  totalTasks: number;
  overdueTasks: number;
  pendingInvitations: number;
  activePerformanceCycles: number;
  researchProjectsByStatus?: StatusCount[];
  generatedAt?: string;
  activeManuscripts?: number;
  pendingBudgetApprovals?: number;
  openQualityFindings?: number;
  pendingDocumentApprovals?: number;
}

// ── SummaryCard ────────────────────────────────────────────────────────────

interface SummaryCardProps {
  label: string;
  value: number | string;
}

function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-slate-800">{value}</p>
    </div>
  );
}

// ── ExecutiveOverviewReportPage ────────────────────────────────────────────

export function ExecutiveOverviewReportPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["report-executive-overview"],
    queryFn: () =>
      api
        .get<{ data: ExecutiveOverview }>("/reports/executive-overview")
        .then((r) => r.data),
  });

  const report: ExecutiveOverview | undefined = (
    data as { data?: ExecutiveOverview } | undefined
  )?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-8 text-center text-slate-500">
        Unable to load report data.
      </div>
    );
  }

  const statusBreakdown = report.researchProjectsByStatus ?? [];
  const maxCount = Math.max(...statusBreakdown.map((s) => s.count), 1);

  return (
    <div>
      <PageHeader title="Executive Overview" />

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard
          label="Total Active Employees"
          value={report.totalActiveEmployees}
        />
        <SummaryCard
          label="Active Departments"
          value={report.activeDepartments}
        />
        <SummaryCard
          label="Active Research Projects"
          value={report.activeResearchProjects}
        />
        <SummaryCard label="Total Tasks" value={report.totalTasks} />
        <SummaryCard label="Overdue Tasks" value={report.overdueTasks} />
        <SummaryCard
          label="Pending Invitations"
          value={report.pendingInvitations}
        />
        <SummaryCard
          label="Active Performance Cycles"
          value={report.activePerformanceCycles}
        />
        <SummaryCard
          label="Active Manuscripts"
          value={report.activeManuscripts ?? 0}
        />
        <SummaryCard
          label="Pending Budget Approvals"
          value={report.pendingBudgetApprovals ?? 0}
        />
        <SummaryCard
          label="Open Quality Findings"
          value={report.openQualityFindings ?? 0}
        />
        <SummaryCard
          label="Docs Pending Approval"
          value={report.pendingDocumentApprovals ?? 0}
        />
      </div>

      {/* Research projects status breakdown */}
      {statusBreakdown.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            Research Projects by Status
          </h2>
          <div className="space-y-3">
            {statusBreakdown.map(({ status, count }) => {
              const pct = Math.round((count / maxCount) * 100);
              return (
                <div key={status} className="flex items-center gap-2">
                  <span className="w-28 text-sm text-slate-600">{status}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-600">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="text-xs text-slate-400">
        Generated at{" "}
        {report.generatedAt
          ? new Date(report.generatedAt).toLocaleString()
          : new Date().toLocaleString()}{" "}
        | Data status: LIVE
      </p>
    </div>
  );
}
