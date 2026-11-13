import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Select, Input, Button, Spinner } from "@rims/ui";
import api from "../../lib/api";

// ── Types ──────────────────────────────────────────────────────────────────

interface Department {
  id: string;
  name: string;
}

interface StatusCount {
  status: string;
  count: number;
}

interface OverdueMilestone {
  id: string;
  title: string;
  dueDate: string;
  projectTitle?: string;
}

interface ResearchPortfolioReport {
  projectsByStatus?: StatusCount[];
  overdueMilestones?: OverdueMilestone[];
  generatedAt?: string;
}

// ── ResearchPortfolioReportPage ────────────────────────────────────────────

export function ResearchPortfolioReportPage() {
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [applied, setApplied] = useState(false);

  const { data: depData } = useQuery({
    queryKey: ["departments-list"],
    queryFn: () =>
      api
        .get<{ data: Department[] }>("/departments?pageSize=200")
        .then((r) => r.data),
  });
  const departments: Department[] =
    (depData as { data?: Department[] } | undefined)?.data ?? [];

  const params = new URLSearchParams();
  if (departmentFilter) params.set("departmentId", departmentFilter);
  if (statusFilter) params.set("status", statusFilter);
  if (dateFrom) params.set("dateFrom", dateFrom);
  if (dateTo) params.set("dateTo", dateTo);

  const { data: reportData, isLoading } = useQuery({
    queryKey: [
      "report-research",
      departmentFilter,
      statusFilter,
      dateFrom,
      dateTo,
      applied,
    ],
    queryFn: () =>
      api
        .get<{ data: ResearchPortfolioReport }>(
          `/reports/research?${params.toString()}`,
        )
        .then((r) => r.data),
  });

  const report: ResearchPortfolioReport | undefined = (
    reportData as { data?: ResearchPortfolioReport } | undefined
  )?.data;

  const statusBreakdown = report?.projectsByStatus ?? [];
  const maxCount = Math.max(...statusBreakdown.map((s) => s.count), 1);

  return (
    <div>
      <PageHeader title="Research Portfolio Report" />

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          options={[
            { value: "", label: "All Departments" },
            ...departments.map((d) => ({ value: d.id, label: d.name })),
          ]}
          className="w-48"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: "", label: "All Statuses" },
            { value: "DRAFT", label: "Draft" },
            { value: "PENDING_APPROVAL", label: "Pending Approval" },
            { value: "ACTIVE", label: "Active" },
            { value: "ON_HOLD", label: "On Hold" },
            { value: "COMPLETED", label: "Completed" },
            { value: "CANCELLED", label: "Cancelled" },
          ]}
          className="w-48"
        />
        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="w-40"
        />
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="w-40"
        />
        <Button onClick={() => setApplied((v) => !v)}>Apply Filters</Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Projects by status */}
          {statusBreakdown.length > 0 && (
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-sm font-semibold text-slate-700 mb-4">
                Projects by Status
              </h2>
              <div className="space-y-3">
                {statusBreakdown.map(({ status, count }) => {
                  const pct = Math.round((count / maxCount) * 100);
                  return (
                    <div key={status} className="flex items-center gap-2">
                      <span className="w-28 text-sm text-slate-600">
                        {status}
                      </span>
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

          {/* Overdue milestones */}
          {(report?.overdueMilestones ?? []).length > 0 && (
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-sm font-semibold text-slate-700 mb-4">
                Overdue Milestones
              </h2>
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500 uppercase">
                      Title
                    </th>
                    <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500 uppercase">
                      Project
                    </th>
                    <th className="text-left py-2 text-xs font-medium text-slate-500 uppercase">
                      Due Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(report?.overdueMilestones ?? []).map((m) => (
                    <tr key={m.id}>
                      <td className="py-2 pr-4 text-slate-700">{m.title}</td>
                      <td className="py-2 pr-4 text-slate-700">
                        {m.projectTitle ?? "—"}
                      </td>
                      <td className="py-2 text-slate-700">
                        {new Date(m.dueDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!report && (
            <p className="text-sm text-slate-500">No report data available.</p>
          )}
        </div>
      )}
    </div>
  );
}
