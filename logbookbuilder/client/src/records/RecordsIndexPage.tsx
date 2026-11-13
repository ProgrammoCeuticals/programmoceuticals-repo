import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, FileText } from "lucide-react";
import { logsApi } from "../api/logs";
import type { LogDefinition } from "../types";

export function RecordsIndexPage() {
  const [logs, setLogs] = useState<LogDefinition[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    logsApi
      .list({ search, limit: 100 })
      .then((r) => setLogs(r.items.filter((l) => l.status !== "archived")))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Records</h1>
          <p className="page-subtitle">
            Select a log to view or enter records.
          </p>
        </div>
      </div>

      <div className="search-wrap">
        <Search size={13} className="search-icon" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search logs…"
          className="inp"
        />
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div className="loading">Loading…</div>
        ) : logs.length === 0 ? (
          <div className="empty">
            <FileText size={36} className="empty-icon" />
            <p className="empty-title">No logs available</p>
            <p style={{ fontSize: "0.8rem" }}>
              <Link to="/templates/new" style={{ color: "var(--navy)", fontWeight: 600 }}>
                Create a template first
              </Link>
              .
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="drt-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}>#</th>
                  <th>Log Name</th>
                  <th style={{ width: 80 }}>Columns</th>
                  <th style={{ width: 80 }}>Status</th>
                  <th style={{ width: 120 }}></th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, idx) => (
                  <tr
                    key={log.id}
                    className="clickable"
                    onClick={() => window.location.assign(`/records/${log.id}`)}
                  >
                    <td style={{ color: "var(--text-faint)", fontFamily: "monospace", fontSize: 11 }}>
                      {idx + 1}
                    </td>
                    <td style={{ fontWeight: 700, color: "var(--text-dark)" }}>{log.name}</td>
                    <td style={{ textAlign: "center" }}>
                      <span className="badge badge-gray">{log.columns.length}</span>
                    </td>
                    <td>
                      <StatusBadge status={log.status} />
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <Link
                        to={`/records/${log.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        Open →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = { active: "badge-green", draft: "badge-amber", archived: "badge-gray" };
  return <span className={`badge ${map[status] ?? "badge-gray"}`}>{status}</span>;
}
