import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Settings } from "lucide-react";
import { logsApi } from "../api/logs";
import { useDebounce } from "../shared/hooks/useDebounce";
import type { LogDefinition } from "../types";

export function LogsPage() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<LogDefinition[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 350);

  useEffect(() => {
    setLoading(true);
    logsApi
      .list({
        search: debouncedSearch || undefined,
        status: status || undefined,
        limit: 50,
      })
      .then((r) => setLogs(r.items))
      .finally(() => setLoading(false));
  }, [debouncedSearch, status]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Logs</h1>
          <p className="page-subtitle">
            All log definitions in your organisation
          </p>
        </div>
        <Link to="/logs/new" className="btn btn-primary">
          <Plus size={13} /> New Log
        </Link>
      </div>

      {/* Search + filter */}
      <div
        style={{
          display: "flex",
          gap: "0.65rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div
          className="search-wrap"
          style={{ flex: 1, minWidth: 200, marginBottom: 0 }}
        >
          <Search size={13} className="search-icon" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs…"
            className="inp"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="inp"
          style={{ width: "auto", minWidth: 140 }}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div className="loading">Loading…</div>
        ) : logs.length === 0 ? (
          <div className="empty">
            <p className="empty-title">No logs found</p>
            <p style={{ fontSize: "0.8rem" }}>
              {search || status ? (
                "Try clearing your filters."
              ) : (
                <>
                  <Link
                    to="/logs/new"
                    style={{ color: "var(--accent)", fontWeight: 700 }}
                  >
                    Create your first log
                  </Link>{" "}
                  to get started.
                </>
              )}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="results-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}>#</th>
                  <th>Log Name</th>
                  <th>Description</th>
                  <th style={{ width: 80 }}>Status</th>
                  <th style={{ width: 55, textAlign: "center" }}>Cols</th>
                  <th style={{ width: 90 }}>Created</th>
                  <th style={{ width: 36 }}></th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, idx) => (
                  <tr
                    key={log.id}
                    className="clickable"
                    onClick={() => navigate(`/logs/${log.id}/records`)}
                  >
                    <td
                      style={{
                        color: "var(--muted)",
                        fontFamily: "monospace",
                        fontSize: 11,
                      }}
                    >
                      {idx + 1}
                    </td>
                    <td style={{ fontWeight: 700, color: "var(--text)" }}>
                      {log.name}
                    </td>
                    <td
                      style={{
                        color: "var(--muted)",
                        maxWidth: 240,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {log.description ?? "—"}
                    </td>
                    <td>
                      <StatusChip status={log.status} />
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        fontFamily: "monospace",
                        color: "var(--muted)",
                      }}
                    >
                      {log.columns.length}
                    </td>
                    <td
                      style={{
                        fontSize: 11,
                        color: "var(--muted)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(log.createdAt).toLocaleDateString()}
                    </td>
                    <td
                      onClick={(e) => e.stopPropagation()}
                      style={{ textAlign: "center" }}
                    >
                      <Link
                        to={`/logs/${log.id}`}
                        className="btn btn-secondary btn-sm"
                        title="Log settings"
                        style={{ padding: "0.2rem 0.4rem" }}
                      >
                        <Settings size={12} />
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

function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "flag-active",
    draft: "flag-draft",
    archived: "flag-archived",
  };
  return (
    <span className={`flag-chip ${map[status] ?? "flag-archived"}`}>
      {status}
    </span>
  );
}
