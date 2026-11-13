import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Settings, List, CheckCircle, Archive } from "lucide-react";
import { logsApi } from "../api/logs";
import { useToast } from "../shared/components/Toast";
import type { LogDefinition } from "../types";

export function LogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const [log, setLog] = useState<LogDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (!id) return;
    logsApi
      .get(id)
      .then(setLog)
      .finally(() => setLoading(false));
  }, [id]);

  async function changeStatus(status: "active" | "archived") {
    if (!id) return;
    setTransitioning(true);
    try {
      const updated = await logsApi.update(id, { status });
      setLog((prev) => (prev ? { ...prev, status: updated.status } : prev));
      toast.success(`Log ${status === "active" ? "published" : "archived"}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      toast.error(msg ?? "Failed to update status");
    } finally {
      setTransitioning(false);
    }
  }

  if (loading) return <div className="loading">Loading…</div>;
  if (!log)
    return (
      <div className="loading" style={{ color: "var(--danger)" }}>
        Log not found.
      </div>
    );

  return (
    <div className="page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/logs">Logs</Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{log.name}</span>
      </div>

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{log.name}</h1>
          {log.description && (
            <p className="page-subtitle">{log.description}</p>
          )}
        </div>
        <div
          style={{
            display: "flex",
            gap: "0.4rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <StatusChip status={log.status} />
          {log.status === "draft" && (
            <button
              onClick={() => changeStatus("active")}
              disabled={transitioning}
              className="btn btn-ok"
              style={{ fontSize: 11 }}
            >
              <CheckCircle size={11} /> Publish
            </button>
          )}
          {log.status === "active" && (
            <button
              onClick={() => changeStatus("archived")}
              disabled={transitioning}
              className="btn btn-secondary"
              style={{
                fontSize: 11,
                color: "var(--warn)",
                borderColor: "#fde68a",
              }}
            >
              <Archive size={11} /> Archive
            </button>
          )}
          <Link
            to={`/logs/${log.id}/edit`}
            className="btn btn-secondary"
            style={{ fontSize: 11 }}
          >
            <Settings size={11} /> Edit Log
          </Link>
          <Link
            to={`/logs/${log.id}/records`}
            className="btn btn-primary"
            style={{ fontSize: 11 }}
          >
            <List size={11} /> View Records
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "1.25rem",
          flexWrap: "wrap",
        }}
      >
        <InfoChip label="Columns" value={String(log.columns.length)} />
        <InfoChip label="Version" value={`v${log.version}`} />
        <InfoChip label="Status" value={log.status} />
      </div>

      {/* Columns table */}
      <p className="section-title">Column Definitions</p>
      <div className="card" style={{ overflow: "hidden" }}>
        {log.columns.length === 0 ? (
          <div className="empty">
            <p className="empty-title">No columns defined</p>
            <p style={{ fontSize: "0.8rem" }}>
              <Link
                to={`/logs/${log.id}/edit`}
                style={{ color: "var(--accent)", fontWeight: 700 }}
              >
                Edit this log
              </Link>{" "}
              to add columns.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="results-table">
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
                    <td
                      style={{
                        fontFamily: "monospace",
                        fontSize: 11,
                        color: "var(--muted)",
                      }}
                    >
                      {col.displayOrder + 1}
                    </td>
                    <td style={{ fontWeight: 700, color: "var(--text)" }}>
                      {col.label}
                    </td>
                    <td
                      style={{
                        fontFamily: "monospace",
                        fontSize: 11,
                        color: "var(--text-muted)",
                      }}
                    >
                      {col.name}
                    </td>
                    <td>
                      <span
                        className="flag-chip"
                        style={{ background: "#d1ecf1", color: "#0c5460" }}
                      >
                        {col.dataType}
                      </span>
                    </td>
                    <td>
                      {col.behavior === "independent" ? (
                        <span style={{ color: "var(--muted)", fontSize: 11 }}>
                          —
                        </span>
                      ) : (
                        <BehaviorChip behavior={col.behavior} />
                      )}
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.25rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {col.isRequired && (
                          <span className="flag-chip flag-voided">
                            required
                          </span>
                        )}
                        {col.isUnique && (
                          <span className="flag-chip flag-archived">
                            unique
                          </span>
                        )}
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
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--border)",
        padding: "0.4rem 0.75rem",
      }}
    >
      <div
        style={{
          fontSize: "0.62rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "var(--muted)",
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div
        style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text)" }}
      >
        {value}
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

function BehaviorChip({ behavior }: { behavior: string }) {
  const styles: Record<string, React.CSSProperties> = {
    linked: { background: "#e8daef", color: "#6c3483" },
    synchronized: { background: "#d1f2eb", color: "#0e6655" },
    calculated: { background: "#fdebd0", color: "#784212" },
    signature: { background: "var(--brand-light)", color: "var(--brand)" },
  };
  return (
    <span
      className="flag-chip"
      style={styles[behavior] ?? { background: "#e9ecef", color: "#495057" }}
    >
      {behavior}
    </span>
  );
}
