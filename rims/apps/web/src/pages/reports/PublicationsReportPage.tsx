import { useQuery } from "@tanstack/react-query";
import { PageHeader, Spinner } from "@rims/ui";
import api from "../../lib/api";

// ── Types ──────────────────────────────────────────────────────────────────

interface ByStatus {
  [status: string]: number;
}

interface RecentPublication {
  id: string;
  title: string;
  targetJournal?: string;
  publishedAt?: string;
}

interface PublicationsReport {
  byStatus?: ByStatus;
  recentPublications?: RecentPublication[];
  generatedAt?: string;
}

// ── PublicationsReportPage ─────────────────────────────────────────────────

export function PublicationsReportPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["report-publications"],
    queryFn: () =>
      api
        .get<{ data: PublicationsReport }>("/reports/publications")
        .then((r) => r.data),
  });

  const report: PublicationsReport | undefined = (
    data as { data?: PublicationsReport } | undefined
  )?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const byStatus = report?.byStatus ?? {};
  const statusEntries = Object.entries(byStatus);
  const recentPublications = (report?.recentPublications ?? []).slice(0, 5);

  return (
    <div>
      <PageHeader title="Publications Report" />

      <div className="space-y-6">
        {/* Manuscripts by Status */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            Manuscripts by Status
          </h2>
          {statusEntries.length === 0 ? (
            <p className="text-sm text-slate-500">No data available.</p>
          ) : (
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
                {statusEntries.map(([status, count]) => (
                  <tr key={status}>
                    <td className="py-2 pr-4 text-slate-700">{status}</td>
                    <td className="py-2 text-slate-700">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Publications */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            Recent Publications
          </h2>
          {recentPublications.length === 0 ? (
            <p className="text-sm text-slate-500">No recent publications.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentPublications.map((pub) => (
                <li key={pub.id} className="py-3">
                  <p className="text-sm font-medium text-slate-800">
                    {pub.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {pub.targetJournal ?? "—"}
                    {pub.publishedAt && (
                      <>
                        {" "}
                        &middot;{" "}
                        {new Date(pub.publishedAt).toLocaleDateString()}
                      </>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <p className="text-xs text-slate-400">
          Generated at{" "}
          {report?.generatedAt
            ? new Date(report.generatedAt).toLocaleString()
            : new Date().toLocaleString()}{" "}
          | Data status: LIVE
        </p>
      </div>
    </div>
  );
}
