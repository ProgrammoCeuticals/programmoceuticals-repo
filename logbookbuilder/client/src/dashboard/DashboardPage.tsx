import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, GitBranch, ClipboardList, Plus } from "lucide-react";
import { logsApi } from "../api/logs";
import { auditApi } from "../api/audit";
import type { LogDefinition, AuditEvent } from "../types";

export function DashboardPage() {
  const [logs, setLogs] = useState<LogDefinition[]>([]);
  const [events, setEvents] = useState<AuditEvent[]>([]);

  useEffect(() => {
    logsApi
      .list({ limit: 8 })
      .then((r) => setLogs(r.items))
      .catch(() => {});
    auditApi
      .list({ limit: 10 })
      .then((r) => setEvents(r.items))
      .catch(() => {});
  }, []);

  const totalLogs = logs.length;
  const activeLogs = logs.filter((l) => l.status === "active").length;
  const draftLogs = logs.filter((l) => l.status === "draft").length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Your organisation's logbook workspace</p>
        </div>
        <Link to="/logs/new" className="btn btn-primary">
          <Plus size={13} /> New Log
        </Link>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        <StatCard value={totalLogs} label="Total Logs" modifier="accent" />
        <StatCard value={activeLogs} label="Active Logs" modifier="ok" />
        <StatCard value={draftLogs} label="Draft Logs" modifier="warn" />
        <StatCard
          value={logs.filter((l) => l.status === "archived").length}
          label="Archived"
          modifier="danger"
        />
      </div>

      <div className="pc-dash-panels">
        {/* Recent Logs */}
        <div>
          <p className="section-title">Recent Logs</p>
          <div className="card" style={{ overflow: "hidden" }}>
            {logs.length === 0 ? (
              <div className="empty">
                <BookOpen size={32} className="empty-icon" />
                <p className="empty-title">No logs yet</p>
                <p style={{ fontSize: "0.8rem" }}>
                  <Link
                    to="/logs/new"
                    style={{ color: "var(--accent)", fontWeight: 700 }}
                  >
                    Create your first log
                  </Link>
                </p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Log Name</th>
                      <th style={{ width: 70 }}>Status</th>
                      <th style={{ width: 60, textAlign: "center" }}>Cols</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.slice(0, 8).map((log) => (
                      <tr
                        key={log.id}
                        className="clickable"
                        onClick={() =>
                          window.location.assign(`/logs/${log.id}/records`)
                        }
                      >
                        <td style={{ fontWeight: 600, color: "var(--text)" }}>
                          {log.name}
                        </td>
                        <td>
                          <StatusChip status={log.status} />
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            color: "var(--muted)",
                            fontFamily: "monospace",
                          }}
                        >
                          {log.columns.length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div
              style={{
                padding: "0.45rem 0.75rem",
                borderTop: "1px solid var(--border)",
                background: "var(--bg-header)",
              }}
            >
              <Link
                to="/logs"
                style={{
                  fontSize: "0.75rem",
                  color: "var(--accent)",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                View all logs →
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <p className="section-title">Recent Activity</p>
          <div className="card" style={{ overflow: "hidden" }}>
            {events.length === 0 ? (
              <div className="empty">
                <ClipboardList size={32} className="empty-icon" />
                <p className="empty-title">No activity yet</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th style={{ width: 130 }}>Type</th>
                      <th style={{ width: 120 }}>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((e) => (
                      <tr key={e.id}>
                        <td
                          style={{
                            color: "var(--text)",
                            maxWidth: 200,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {e.summary}
                        </td>
                        <td>
                          <span
                            className="flag-chip"
                            style={{
                              background: "var(--brand-light)",
                              color: "var(--brand)",
                              fontFamily: "monospace",
                              textTransform: "none",
                              letterSpacing: 0,
                            }}
                          >
                            {e.eventType}
                          </span>
                        </td>
                        <td
                          style={{
                            fontSize: 11,
                            color: "var(--muted)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {new Date(e.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div
              style={{
                padding: "0.45rem 0.75rem",
                borderTop: "1px solid var(--border)",
                background: "var(--bg-header)",
              }}
            >
              <Link
                to="/audit"
                style={{
                  fontSize: "0.75rem",
                  color: "var(--accent)",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                View audit trail →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <p className="section-title">Quick Actions</p>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link to="/logs/new" className="btn btn-secondary">
          <Plus size={12} /> New Log
        </Link>
        <Link to="/relationships" className="btn btn-secondary">
          <GitBranch size={12} /> Manage Relationships
        </Link>
        <Link to="/audit" className="btn btn-secondary">
          <ClipboardList size={12} /> Audit Trail
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  value,
  label,
  modifier,
}: {
  value: number;
  label: string;
  modifier: string;
}) {
  return (
    <div className={`stat-card ${modifier}`}>
      <p className="stat-val">{value}</p>
      <p className="stat-lbl">{label}</p>
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
