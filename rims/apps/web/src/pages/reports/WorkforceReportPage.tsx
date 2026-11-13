import { useQuery } from "@tanstack/react-query";
import { PageHeader, Spinner } from "@rims/ui";
import api from "../../lib/api";

// ── Types ──────────────────────────────────────────────────────────────────

interface DepartmentRow {
  department: string;
  count: number;
}

interface StatusRow {
  status: string;
  count: number;
}

interface WorkforceReport {
  employeesByDepartment?: DepartmentRow[];
  employeesByStatus?: StatusRow[];
  generatedAt?: string;
}

// ── WorkforceReportPage ────────────────────────────────────────────────────

export function WorkforceReportPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["report-workforce"],
    queryFn: () =>
      api
        .get<{ data: WorkforceReport }>("/reports/workforce")
        .then((r) => r.data),
  });

  const report: WorkforceReport | undefined = (
    data as { data?: WorkforceReport } | undefined
  )?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Workforce Report" />

      <div className="space-y-6">
        {/* Employees by department */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            Employees by Department
          </h2>
          {(report?.employeesByDepartment ?? []).length === 0 ? (
            <p className="text-sm text-slate-500">No data available.</p>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500 uppercase">
                    Department
                  </th>
                  <th className="text-left py-2 text-xs font-medium text-slate-500 uppercase">
                    Employees
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(report?.employeesByDepartment ?? []).map((row) => (
                  <tr key={row.department}>
                    <td className="py-2 pr-4 text-slate-700">
                      {row.department}
                    </td>
                    <td className="py-2 text-slate-700">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Employees by status */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            Employees by Status
          </h2>
          {(report?.employeesByStatus ?? []).length === 0 ? (
            <p className="text-sm text-slate-500">No data available.</p>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500 uppercase">
                    Status
                  </th>
                  <th className="text-left py-2 text-xs font-medium text-slate-500 uppercase">
                    Employees
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(report?.employeesByStatus ?? []).map((row) => (
                  <tr key={row.status}>
                    <td className="py-2 pr-4 text-slate-700">{row.status}</td>
                    <td className="py-2 text-slate-700">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {report?.generatedAt && (
          <p className="text-xs text-slate-400">
            Generated at {new Date(report.generatedAt).toLocaleString()} | Data
            status: LIVE
          </p>
        )}
      </div>
    </div>
  );
}
