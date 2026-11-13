import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Settings } from "lucide-react";
import { logsApi } from "../api/logs";
import type { LogDefinition } from "../types";

export function TemplatesPage() {
  const [logs, setLogs] = useState<LogDefinition[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    logsApi
      .list({ search, limit: 100 })
      .then((r) => setLogs(r.items))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Log Templates</h1>
          <p className="page-subtitle">
            Define and manage log structures. Templates are the design — go to Records to fill data.
          </p>
        </div>
        <Link to="/templates/new" className="btn btn-primary">
          <Plus size={14} />
          New Template
        </Link>
      </div>

      <div className="search-wrap">
        <Search size={13} className="search-icon" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search templates…"
          className="inp"
        />
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div className="loading">Loading…</div>
        ) : logs.length === 0 ? (
          <div className="empty">
            <p className="empty-title">No templates found</p>
            <p style={{ fontSize: "0.8rem" }}>
              <Link to="/templates/new" style={{ color: "var(--navy)", fontWeight: 600 }}>
                Create your first template
              </Link>{" "}
              to get started.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="drt-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}>#</th>
                  <th>Template Name</th>

                  <th style={{ width: 80 }}>Columns</th>
                  <th style={{ width: 80 }}>Status</th>
                  <th style={{ width: 100 }}></th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, idx) => (
                  <tr key={log.id}>
                    <td style={{ color: "var(--text-faint)", fontFamily: "monospace", fontSize: 11 }}>
                      {idx + 1}
                    </td>
                    <td>
                      <Link
                        to={`/templates/${log.id}`}
                        style={{ fontWeight: 700, color: "var(--navy)", textDecoration: "none" }}
                        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                      >
                        {log.name}
                      </Link>
                    </td>

                    <td style={{ textAlign: "center" }}>
                      <span className="badge badge-gray">{log.columns.length}</span>
                    </td>
                    <td>
                      <StatusBadge status={log.status} />
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <Link
                          to={`/records/${log.id}`}
                          className="btn btn-blue btn-sm"
                          title="Open records"
                        >
                          Records
                        </Link>
                        <Link
                          to={`/templates/${log.id}/edit`}
                          className="btn btn-secondary btn-sm"
                          title="Edit template"
                        >
                          <Settings size={12} />
                        </Link>
                      </div>
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
  const map: Record<string, string> = {
    active: "badge-green",
    draft: "badge-amber",
    archived: "badge-gray",
  };
  return <span className={`badge ${map[status] ?? "badge-gray"}`}>{status}</span>;
}
