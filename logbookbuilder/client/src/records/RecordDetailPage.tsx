import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Clock,
  GitBranch,
  AlertTriangle,
  XCircle,
  PenLine,
  Edit,
  Ban,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import { recordsApi } from "../api/records";
import { logsApi } from "../api/logs";
import { useToast } from "../shared/components/Toast";
import type { LogRecord, LogDefinition, RecordVersion } from "../types";
import { RecordEntryForm } from "./RecordEntryForm";
import { SignatureModal } from "./SignatureModal";

export function RecordDetailPage() {
  const { logId, recordId } = useParams<{ logId: string; recordId: string }>();
  const toast = useToast();
  const [log, setLog] = useState<LogDefinition | null>(null);
  const [record, setRecord] = useState<LogRecord | null>(null);
  const [history, setHistory] = useState<RecordVersion[]>([]);
  const [tab, setTab] = useState<"data" | "lineage" | "history">("data");
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"view" | "edit" | "correct">("view");
  const [sigColumn, setSigColumn] = useState<string | null>(null);
  const [voidModal, setVoidModal] = useState(false);
  const [voidReason, setVoidReason] = useState("");
  const [voidError, setVoidError] = useState("");

  function reload() {
    if (!logId || !recordId) return;
    Promise.all([
      logsApi.get(logId),
      recordsApi.get(logId, recordId),
      recordsApi.history(logId, recordId),
    ])
      .then(([l, r, h]) => {
        setLog(l);
        setRecord(r);
        setHistory(h.versions);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    reload();
  }, [logId, recordId]);

  async function handleVoid() {
    if (!logId || !recordId || !voidReason.trim()) {
      setVoidError("Reason is required");
      return;
    }
    try {
      await recordsApi.void(logId, recordId, { reason: voidReason });
      toast.success("Record voided");
      reload();
      setVoidModal(false);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setVoidError(msg ?? "Failed to void record");
    }
  }

  if (loading) return <div className="pc-loading">Loading…</div>;
  if (!record || !log)
    return (
      <div className="pc-loading" style={{ color: "#b91c1c" }}>
        Record not found.
      </div>
    );

  const sigColumns = log.columns.filter((c) => c.dataType === "signature");
  const canEdit = record.status === "active";

  // ── Edit / Correct mode ───────────────────────────────────────────────────
  if (mode === "edit" || mode === "correct") {
    return (
      <div className="pc-page" style={{ maxWidth: 720 }}>
        <div className="pc-breadcrumb">
          <Link to={`/logs/${logId}/records`}>{log.name}</Link>
          <span className="pc-breadcrumb-sep">/</span>
          <span
            className="pc-breadcrumb-current"
            style={{ fontFamily: "monospace" }}
          >
            {record.recordNumber}
          </span>
          <span className="pc-breadcrumb-sep">/</span>
          <span className="pc-breadcrumb-current">
            {mode === "correct" ? "Correct" : "Edit"}
          </span>
        </div>
        <div className="pc-card" style={{ padding: "1.5rem" }}>
          <p
            style={{
              margin: "0 0 1.25rem",
              fontSize: "1rem",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            {mode === "correct" ? "Submit Correction" : "Edit Record"}
          </p>
          <RecordEntryForm
            log={log}
            columns={log.columns}
            existingRecord={record}
            mode={mode}
            onSuccess={(r) => {
              setRecord(r);
              setMode("view");
              toast.success(
                mode === "correct" ? "Correction submitted" : "Record updated",
              );
              reload();
            }}
            onCancel={() => setMode("view")}
          />
        </div>
      </div>
    );
  }

  // ── View mode ─────────────────────────────────────────────────────────────
  return (
    <div className="pc-page" style={{ maxWidth: 900 }}>
      {/* Breadcrumb */}
      <div className="pc-breadcrumb">
        <Link to={`/logs/${logId}/records`}>{log.name}</Link>
        <span className="pc-breadcrumb-sep">/</span>
        <span
          className="pc-breadcrumb-current"
          style={{ fontFamily: "monospace" }}
        >
          {record.recordNumber}
        </span>
      </div>

      {/* Header */}
      <div className="pc-page-header">
        <div>
          <h1
            className="pc-page-title"
            style={{ fontFamily: "monospace", letterSpacing: 0 }}
          >
            {record.recordNumber}
          </h1>
          <p className="pc-page-subtitle">
            Created {new Date(record.createdAt).toLocaleString()}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          {canEdit && (
            <>
              <button
                onClick={() => setMode("edit")}
                className="pc-btn pc-btn-secondary"
              >
                <Edit size={13} /> Edit
              </button>
              <button
                onClick={() => setMode("correct")}
                className="pc-btn pc-btn-secondary"
                style={{ color: "#d97706", borderColor: "#fde68a" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "#fef3c7")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "#ffffff")
                }
              >
                <CheckCircle size={13} /> Correct
              </button>
              <button
                onClick={() => setVoidModal(true)}
                className="pc-btn pc-btn-danger"
              >
                <Ban size={13} /> Void
              </button>
            </>
          )}
          <RecordStatusBadge status={record.status} />
        </div>
      </div>

      {/* Status banners */}
      {record.status === "corrected" && (
        <div
          className="pc-alert pc-alert-info"
          style={{ marginBottom: "1rem" }}
        >
          <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>
            This record was corrected. Reason: {record.correctionReason}
          </span>
        </div>
      )}
      {record.status === "voided" && (
        <div
          className="pc-alert pc-alert-error"
          style={{ marginBottom: "1rem" }}
        >
          <XCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>This record was voided. Reason: {record.voidReason}</span>
        </div>
      )}

      {/* Signatures panel */}
      {sigColumns.length > 0 && (
        <div
          className="pc-card"
          style={{ marginBottom: "1.25rem", padding: "1.1rem 1.25rem" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.85rem",
            }}
          >
            <ShieldCheck size={15} color="#0b5ed7" />
            <span
              style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              Signatures
            </span>
          </div>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {sigColumns.map((col) => {
              const sig = (record as any).signatures?.find(
                (s: any) => s.columnId === col.id && s.status === "signed",
              );
              return (
                <div
                  key={col.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.7rem 0.9rem",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "#0f172a",
                      }}
                    >
                      {col.label}
                    </p>
                    <p
                      style={{
                        margin: "0.15rem 0 0",
                        fontSize: "0.75rem",
                        color: "#64748b",
                      }}
                    >
                      {(col.typeConfig.intent as string) ?? ""}
                    </p>
                  </div>
                  {sig ? (
                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "#166534",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <CheckCircle size={13} /> Signed
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.72rem",
                          color: "#94a3b8",
                        }}
                      >
                        {new Date(sig.signedAt).toLocaleString()}
                      </p>
                    </div>
                  ) : canEdit ? (
                    <button
                      onClick={() => setSigColumn(col.id)}
                      className="pc-btn pc-btn-primary"
                      style={{ fontSize: "0.8rem", padding: "0.38rem 0.75rem" }}
                    >
                      <PenLine size={12} /> Sign
                    </button>
                  ) : (
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "#94a3b8",
                        fontStyle: "italic",
                      }}
                    >
                      Unsigned
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Segment tabs */}
      <div className="pc-seg-tabs">
        {(["data", "lineage", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pc-seg-tab${tab === t ? " active" : ""}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab: Data */}
      {tab === "data" && (
        <div className="pc-card" style={{ overflow: "hidden" }}>
          {log.columns
            .filter((c) => c.dataType !== "signature")
            .map((col) => {
              const fv = record.fieldValues?.find((f) => f.columnId === col.id);
              const displayValue = fv?.value ?? record.data[col.name];
              return (
                <div
                  key={col.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "1rem",
                    padding: "0.82rem 1.25rem",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "#334155",
                      }}
                    >
                      {col.label}
                    </p>
                    <p
                      style={{
                        margin: "0.1rem 0 0",
                        fontSize: "0.72rem",
                        color: "#94a3b8",
                      }}
                    >
                      {col.dataType}
                    </p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.875rem",
                        color: "#0f172a",
                      }}
                    >
                      {displayValue !== null && displayValue !== undefined ? (
                        String(displayValue)
                      ) : (
                        <span style={{ color: "#94a3b8", fontStyle: "italic" }}>
                          —
                        </span>
                      )}
                    </p>
                    {col.behavior !== "independent" && (
                      <span
                        className={`pc-badge ${behaviorBadgeClass(col.behavior)}`}
                        style={{ marginTop: "0.2rem" }}
                      >
                        {col.behavior}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Tab: Lineage */}
      {tab === "lineage" && <LineageView record={record} />}

      {/* Tab: History */}
      {tab === "history" && <HistoryView versions={history} />}

      {/* Void modal */}
      {voidModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(15,23,42,0.55)",
            padding: "1rem",
          }}
        >
          <div
            className="pc-card"
            style={{
              width: "100%",
              maxWidth: 420,
              padding: "1.5rem",
              boxShadow: "0 8px 32px rgba(15,23,42,0.18)",
            }}
          >
            <p
              style={{
                margin: "0 0 0.35rem",
                fontSize: "1rem",
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              Void Record
            </p>
            <p
              style={{
                margin: "0 0 1rem",
                fontSize: "0.875rem",
                color: "#64748b",
              }}
            >
              The record will be preserved but marked as voided. This cannot be
              undone.
            </p>
            <textarea
              value={voidReason}
              onChange={(e) => setVoidReason(e.target.value)}
              rows={3}
              placeholder="Reason for voiding (required)"
              className="pc-input"
              style={{ resize: "none", marginBottom: "0.5rem" }}
            />
            {voidError && (
              <p
                style={{
                  margin: "0 0 0.5rem",
                  fontSize: "0.82rem",
                  color: "#b91c1c",
                }}
              >
                {voidError}
              </p>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
              }}
            >
              <button
                onClick={() => setVoidModal(false)}
                className="pc-btn pc-btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleVoid}
                className="pc-btn"
                style={{
                  background: "#b91c1c",
                  color: "#fff",
                  borderColor: "#b91c1c",
                }}
              >
                Void Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signature modal */}
      {sigColumn && (
        <SignatureModal
          logId={logId!}
          recordId={recordId!}
          recordNumber={record.recordNumber}
          column={log.columns.find((c) => c.id === sigColumn)!}
          onSuccess={() => {
            setSigColumn(null);
            toast.success("Signature recorded");
            reload();
          }}
          onClose={() => setSigColumn(null)}
        />
      )}
    </div>
  );
}

// ─── Lineage view ─────────────────────────────────────────────────────────────

function LineageView({ record }: { record: LogRecord }) {
  const syncFields =
    record.fieldValues?.filter((fv) => fv.sourceRecordId) ?? [];
  if (syncFields.length === 0) {
    return (
      <div className="pc-card">
        <div className="pc-empty">
          <GitBranch size={32} className="pc-empty-icon" />
          <p className="pc-empty-title">No synchronized fields</p>
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      {syncFields.map((fv) => (
        <div
          key={fv.id}
          className="pc-card"
          style={{ padding: "1.1rem 1.25rem" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.75rem",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                {fv.column?.label ?? fv.columnId}
              </p>
              <p
                style={{
                  margin: "0.15rem 0 0",
                  fontSize: "0.75rem",
                  color: "#64748b",
                }}
              >
                Synchronized field
              </p>
            </div>
            <span
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#0f172a",
              }}
            >
              {fv.value ?? "—"}
            </span>
          </div>
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: "0.75rem",
              fontSize: "0.8rem",
              display: "grid",
              gap: "0.4rem",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.68rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "#94a3b8",
                marginBottom: "0.25rem",
              }}
            >
              Source
            </p>
            <p style={{ margin: 0 }}>
              <span style={{ color: "#94a3b8" }}>Record: </span>
              <span
                style={{
                  fontFamily: "monospace",
                  color: "#0b5ed7",
                  fontWeight: 600,
                }}
              >
                {fv.sourceRecord?.recordNumber ?? fv.sourceRecordId}
              </span>
            </p>
            <p style={{ margin: 0 }}>
              <span style={{ color: "#94a3b8" }}>Field: </span>
              {fv.sourceColumn?.label ?? fv.sourceColumnId}
            </p>
            <p style={{ margin: 0 }}>
              <span style={{ color: "#94a3b8" }}>Snapshot: </span>
              {fv.snapshotValue ?? "—"}
            </p>
            {fv.snapshotAt && (
              <p style={{ margin: 0 }}>
                <span style={{ color: "#94a3b8" }}>Captured: </span>
                {new Date(fv.snapshotAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── History view ─────────────────────────────────────────────────────────────

function HistoryView({ versions }: { versions: RecordVersion[] }) {
  if (versions.length === 0) {
    return (
      <div className="pc-card">
        <div className="pc-empty">
          <Clock size={32} className="pc-empty-icon" />
          <p className="pc-empty-title">No version history</p>
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      {versions.map((v) => (
        <div
          key={v.id}
          className="pc-card"
          style={{ padding: "1.1rem 1.25rem" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.6rem",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.72rem",
                  background: "#f1f5f9",
                  color: "#475569",
                  padding: "2px 7px",
                  borderRadius: 4,
                  fontWeight: 700,
                }}
              >
                v{v.version}
              </span>
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#0f172a",
                }}
              >
                {v.changedBy?.name ?? "Unknown"}
              </span>
            </div>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
              {new Date(v.createdAt).toLocaleString()}
            </span>
          </div>
          {v.changeReason && (
            <p
              style={{
                margin: "0 0 0.6rem",
                fontSize: "0.875rem",
                color: "#475569",
              }}
            >
              {v.changeReason}
            </p>
          )}
          <pre
            style={{
              margin: 0,
              fontSize: "0.75rem",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: "0.75rem",
              overflowX: "auto",
              color: "#334155",
              lineHeight: 1.6,
            }}
          >
            {JSON.stringify(v.data, null, 2)}
          </pre>
        </div>
      ))}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function RecordStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "pc-badge-green",
    corrected: "pc-badge-blue",
    voided: "pc-badge-red",
    archived: "pc-badge-gray",
  };
  return (
    <span className={`pc-badge ${map[status] ?? "pc-badge-gray"}`}>
      {status}
    </span>
  );
}

function behaviorBadgeClass(behavior: string): string {
  const map: Record<string, string> = {
    synchronized: "pc-badge-teal",
    calculated: "pc-badge-orange",
    linked: "pc-badge-purple",
  };
  return map[behavior] ?? "pc-badge-gray";
}
