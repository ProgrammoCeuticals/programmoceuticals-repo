import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Settings, FileText, CheckCircle, Archive } from "lucide-react";
import { logsApi } from "../api/logs";
import type { LogDefinition } from "../types";

export function TemplateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [log, setLog] = useState<LogDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    if (!id) return;
    logsApi.get(id).then(setLog).finally(() => setLoading(false));
  }, [id]);

  async function changeStatus(status: "active" | "archived") {
    if (!id) return;
    setTransitioning(true);
    setStatusError("");
    try {
      const updated = await logsApi.update(id, { status });
      setLog((prev) => prev ? { ...prev, status: updated.status } : prev);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setStatusError(msg ?? "Failed to update status");
    } finally {
      setTransitioning(false);
    }
  }

  if (loading) return <div className="loading">Loading…</div>;
  if (!log) return <div className="loading" style={{ color: "#721c24" }}>Template not found.</div>;

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/templates">Templates</Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{log.name}</span>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">{log.name}</h1>

        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <StatusBadge status={log.status} />
          {log.status === "draft" && (
            <button
              onClick={() => changeStatus("active")}
              disabled={transitioning}
              className="btn btn-primary"
              style={{ background: "#166534", borderColor: "#166534" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#14532d")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#166534")}
            >
              <CheckCircle size={13} /> Activate
            </button>
          )}
          {log.status === "active" && (
            <button
              onClick={() => changeStatus("archived")}
              disabled={transitioning}
              className="btn btn-secondary"
              style={{ color: "#92400e", borderColor: "#fde68a" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#fef3c7")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#ffffff")}
            >
              <Archive size={13} /> Archive
            </button>
          )}
          <Link to={`/templates/${log.id}/edit`} className="btn btn-secondary">
            <Settings size={13} />
            Edit Template
          </Link>
          <Link to={`/records/${log.id}`} className="btn btn-primary">
            <FileText size={13} />
            Open Records
          </Link>
        </div>
      </div>

      {statusError && (
        <div className="alert alert-error" style={{ marginBottom: "1rem" }}>{statusError}</div>
      )}

      {/* Summary row */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <InfoChip label="Columns" value={String(log.columns.length)} />
        <InfoChip label="Status" value={log.status} />
        <InfoChip
          label="Linked logs"
          value={String(
            ((log.settings as Record<string, unknown>)?.linkedLogIds as string[] ?? []).length
          )}
        />
      </div>

      {/* Columns table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div className="card-header">
          <span className="card-title">Column Definitions</span>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
            {log.columns.length} column{log.columns.length !== 1 ? "s" : ""}
          </span>
        </div>

        {log.columns.length === 0 ? (
          <div className="empty">
            <p className="empty-title">No columns defined</p>
            <p style={{ fontSize: "0.8rem" }}>
              <Link to={`/templates/${log.id}/edit`} style={{ color: "var(--navy)", fontWeight: 600 }}>
                Edit this template
              </Link>{" "}
              to add columns.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="drt-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}>#</th>
                  <th>Label</th>
                  <th>Internal Name</th>
                  <th>Data Type</th>
                  <th>Behavior</th>
                  <th>Flags</th>
                </tr>
              </thead>
              <tbody>
                {log.columns.map((col) => (
                  <tr key={col.id}>
                    <td style={{ color: "var(--text-faint)", fontFamily: "monospace", fontSize: 11 }}>
                      {col.displayOrder + 1}
                    </td>
                    <td style={{ fontWeight: 700, color: "var(--text-dark)" }}>{col.label}</td>
                    <td style={{ fontFamily: "monospace", fontSize: 11, color: "var(--text-muted)" }}>
                      {col.name}
                    </td>
                    <td>
                      <span className="badge badge-blue">{col.dataType}</span>
                    </td>
                    <td>
                      {col.behavior === "independent" ? (
                        <span style={{ color: "var(--text-faint)" }}>—</span>
                      ) : (
                        <BehaviorBadge behavior={col.behavior} />
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
                        {col.isRequired && <span className="badge badge-red">required</span>}
                        {col.isUnique && <span className="badge badge-gray">unique</span>}
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

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "#ffffff", border: "1px solid var(--border)", padding: "0.4rem 0.75rem" }}>
      <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-faint)", marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-dark)" }}>{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = { active: "badge-green", draft: "badge-amber", archived: "badge-gray" };
  return <span className={`badge ${map[status] ?? "badge-gray"}`}>{status}</span>;
}

function BehaviorBadge({ behavior }: { behavior: string }) {
  const map: Record<string, string> = {
    linked: "badge-purple",
    synchronized: "badge-teal",
    calculated: "badge-orange",
    signature: "badge-navy",
  };
  return <span className={`badge ${map[behavior] ?? "badge-gray"}`}>{behavior}</span>;
}
