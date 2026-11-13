import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Download,
  X,
  Search,
  Edit,
  CheckCircle,
  Ban,
  ShieldCheck,
  PenLine,
  GitBranch,
  Clock,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { recordsApi } from "../api/records";
import { logsApi } from "../api/logs";
import { useDebounce } from "../shared/hooks/useDebounce";
import { useToast } from "../shared/components/Toast";
import type {
  LogRecord,
  LogDefinition,
  RecordVersion,
  FieldValue,
} from "../types";
import { RecordEntryForm } from "./RecordEntryForm";
import { SignatureModal } from "./SignatureModal";

// ─── Panel cache entry ────────────────────────────────────────────────────────
interface PanelEntry {
  record: LogRecord;
  history: RecordVersion[];
}

export function RecordsPage() {
  const { id: logId } = useParams<{ id: string }>();
  const toast = useToast();

  const [log, setLog] = useState<LogDefinition | null>(null);
  const [records, setRecords] = useState<LogRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");

  // Inline detail panel state
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [panelCache, setPanelCache] = useState<Record<string, PanelEntry>>({});
  const [panelLoading, setPanelLoading] = useState<string | null>(null);
  const [panelTab, setPanelTab] = useState<"data" | "lineage" | "history">(
    "data",
  );
  const [panelMode, setPanelMode] = useState<"view" | "edit" | "correct">(
    "view",
  );
  const [sigColumn, setSigColumn] = useState<string | null>(null);
  const [voidModal, setVoidModal] = useState(false);
  const [voidReason, setVoidReason] = useState("");
  const [voidError, setVoidError] = useState("");

  const expandedRowRef = useRef<HTMLTableRowElement | null>(null);

  const debouncedSearch = useDebounce(search, 350);

  function loadRecords(p = page) {
    if (!logId) return;
    setLoading(true);
    recordsApi
      .list(logId, {
        page: p,
        limit: 25,
        status: status || undefined,
        search: debouncedSearch || undefined,
      })
      .then((r) => {
        setRecords(r.items);
        setTotal(r.total);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!logId) return;
    logsApi
      .get(logId)
      .then(setLog)
      .catch(() => {});
  }, [logId]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);
  useEffect(() => {
    loadRecords(page);
  }, [logId, page, debouncedSearch, status]);

  async function handleRowClick(recordId: string) {
    // Toggle
    if (expandedId === recordId) {
      setExpandedId(null);
      setPanelMode("view");
      return;
    }
    setExpandedId(recordId);
    setPanelTab("data");
    setPanelMode("view");

    // Already cached
    if (panelCache[recordId]) return;

    setPanelLoading(recordId);
    try {
      const [record, histResult] = await Promise.all([
        recordsApi.get(logId!, recordId),
        recordsApi.history(logId!, recordId),
      ]);
      setPanelCache((prev) => ({
        ...prev,
        [recordId]: { record, history: histResult.versions },
      }));
    } catch {
      // sentinel so we don't retry forever
      setPanelCache((prev) => ({
        ...prev,
        [recordId]: { record: null as unknown as LogRecord, history: [] },
      }));
    } finally {
      setPanelLoading(null);
    }
  }

  function evictAndReload(recordId: string) {
    setPanelCache((prev) => {
      const n = { ...prev };
      delete n[recordId];
      return n;
    });
    loadRecords(page);
    // Re-fetch
    setPanelLoading(recordId);
    Promise.all([
      recordsApi.get(logId!, recordId),
      recordsApi.history(logId!, recordId),
    ])
      .then(([record, histResult]) => {
        setPanelCache((prev) => ({
          ...prev,
          [recordId]: { record, history: histResult.versions },
        }));
      })
      .catch(() => {})
      .finally(() => setPanelLoading(null));
  }

  async function handleVoid() {
    if (!expandedId || !voidReason.trim()) {
      setVoidError("Reason is required");
      return;
    }
    try {
      await recordsApi.void(logId!, expandedId, { reason: voidReason });
      toast.success("Record voided");
      setVoidModal(false);
      setVoidReason("");
      setVoidError("");
      evictAndReload(expandedId);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setVoidError(msg ?? "Failed to void record");
    }
  }

  if (!log) return <div className="loading">Loading…</div>;

  const displayColumns = log.columns
    .filter(
      (c) =>
        c.behavior !== "calculated" &&
        c.dataType !== "signature" &&
        c.dataType !== "file" &&
        c.dataType !== "image",
    )
    .slice(0, 6);

  const totalPages = Math.ceil(total / 25);
  const colSpan = displayColumns.length + 4; // #, record#, ...cols, status, created

  const panelEntry = expandedId ? panelCache[expandedId] : null;

  return (
    <div className="page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to={`/logs/${logId}`}>{log.name}</Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">Records</span>
      </div>

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{log.name}</h1>
          <p className="page-subtitle">
            {total} record{total !== 1 ? "s" : ""}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {/* Export group */}
          <div
            style={{
              display: "flex",
              border: "1px solid var(--border-dark)",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                padding: "0.28rem 0.55rem",
                fontSize: 11,
                color: "var(--muted)",
                borderRight: "1px solid var(--border-dark)",
                background: "var(--bg-header)",
              }}
            >
              <Download size={11} /> Export
            </span>
            {(["csv", "excel", "pdf"] as const).map((fmt) => (
              <a
                key={fmt}
                href={`/api/logs/${logId}/export/${fmt}`}
                target={fmt === "pdf" ? "_blank" : undefined}
                rel="noreferrer"
                style={{
                  padding: "0.28rem 0.55rem",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--text-mid)",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  borderRight:
                    fmt !== "pdf" ? "1px solid var(--border-dark)" : "none",
                  background: "#fff",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.background =
                    "var(--bg-header)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.background =
                    "#fff")
                }
              >
                {fmt}
              </a>
            ))}
          </div>
          <button
            onClick={() => setShowNewForm((v) => !v)}
            className="btn btn-primary"
          >
            <Plus size={13} /> New Record
          </button>
        </div>
      </div>

      {/* New record form */}
      {showNewForm && (
        <div className="form-panel">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <p className="section-title" style={{ margin: 0 }}>
              New Record
            </p>
            <button
              onClick={() => setShowNewForm(false)}
              className="btn btn-ghost btn-sm"
              style={{ padding: "0.2rem" }}
            >
              <X size={14} />
            </button>
          </div>
          <RecordEntryForm
            log={log}
            columns={log.columns}
            mode="create"
            onSuccess={() => {
              setShowNewForm(false);
              toast.success("Record created");
              loadRecords(1);
              setPage(1);
            }}
            onCancel={() => setShowNewForm(false)}
          />
        </div>
      )}

      {/* Search + filter */}
      <div
        style={{
          display: "flex",
          gap: "0.65rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search
            size={13}
            style={{
              position: "absolute",
              left: "0.65rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-faint)",
              pointerEvents: "none",
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search record number or field values…"
            className="inp"
            style={{ paddingLeft: "2rem" }}
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="inp"
          style={{ width: "auto", minWidth: 140 }}
        >
          <option value="active">Active</option>
          <option value="corrected">Corrected</option>
          <option value="voided">Voided</option>
          <option value="archived">Archived</option>
          <option value="">All statuses</option>
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div className="loading">Loading…</div>
        ) : records.length === 0 ? (
          <div className="empty">
            <p className="empty-title">No records found</p>
            <p style={{ fontSize: "0.8rem" }}>
              {search ? (
                "Try a different search term."
              ) : (
                <button
                  onClick={() => setShowNewForm(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--accent)",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    padding: 0,
                    fontFamily: "inherit",
                  }}
                >
                  Add the first record
                </button>
              )}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="results-table">
              <thead>
                <tr>
                  <th className="pc-col-chevron"></th>
                  <th>Record #</th>
                  {displayColumns.map((col) => (
                    <th key={col.id}>{col.label}</th>
                  ))}
                  <th style={{ width: 80 }}>Status</th>
                  <th style={{ width: 90 }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => {
                  const isExpanded = expandedId === record.id;
                  const isLoading = panelLoading === record.id;
                  return (
                    <>
                      {/* ── Data row ── */}
                      <tr
                        key={record.id}
                        className="clickable"
                        style={{
                          background: isExpanded
                            ? "var(--brand-light)"
                            : undefined,
                          borderLeft: isExpanded
                            ? "3px solid var(--brand)"
                            : undefined,
                        }}
                        onClick={() => handleRowClick(record.id)}
                      >
                        <td className="pc-col-chevron" style={{ fontSize: 12 }}>
                          {isLoading ? "⟳" : isExpanded ? "▾" : "▸"}
                        </td>
                        <td>
                          <span
                            style={{
                              fontFamily: "monospace",
                              fontSize: 11,
                              fontWeight: 700,
                              color: "var(--accent)",
                            }}
                          >
                            {record.recordNumber}
                          </span>
                        </td>
                        {displayColumns.map((col) => (
                          <td
                            key={col.id}
                            style={{
                              maxWidth: 160,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatCellValue(record.data[col.name])}
                          </td>
                        ))}
                        <td>
                          <RecordStatusChip status={record.status} />
                        </td>
                        <td
                          style={{
                            fontSize: 11,
                            color: "var(--muted)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {new Date(record.createdAt).toLocaleDateString()}
                        </td>
                      </tr>

                      {/* ── Inline detail panel ── */}
                      {isExpanded && (
                        <tr className="detail-panel-row" ref={expandedRowRef}>
                          <td colSpan={colSpan}>
                            {isLoading || !panelEntry ? (
                              <div
                                style={{
                                  padding: "1.5rem",
                                  textAlign: "center",
                                  color: "var(--muted)",
                                  fontSize: 12,
                                }}
                              >
                                {isLoading
                                  ? "Loading record detail…"
                                  : "Failed to load record."}
                              </div>
                            ) : (
                              <InlineDetailPanel
                                log={log}
                                record={panelEntry.record}
                                history={panelEntry.history}
                                tab={panelTab}
                                mode={panelMode}
                                onTabChange={setPanelTab}
                                onModeChange={setPanelMode}
                                onClose={() => {
                                  setExpandedId(null);
                                  setPanelMode("view");
                                }}
                                onMutated={() => evictAndReload(record.id)}
                                onSigColumnChange={setSigColumn}
                                voidModal={voidModal}
                                voidReason={voidReason}
                                voidError={voidError}
                                onVoidModalChange={setVoidModal}
                                onVoidReasonChange={setVoidReason}
                                onVoidSubmit={handleVoid}
                              />
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <span>
              {page} / {totalPages} — {total} records
            </span>
            <div style={{ display: "flex", gap: "0.25rem" }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="pag-btn"
              >
                <ChevronLeft size={13} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="pag-btn"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Signature modal (portal-level, outside table) */}
      {sigColumn && expandedId && panelCache[expandedId]?.record && (
        <SignatureModal
          logId={logId!}
          recordId={expandedId}
          recordNumber={panelCache[expandedId].record.recordNumber}
          column={log.columns.find((c) => c.id === sigColumn)!}
          onSuccess={() => {
            setSigColumn(null);
            toast.success("Signature recorded");
            evictAndReload(expandedId);
          }}
          onClose={() => setSigColumn(null)}
        />
      )}
    </div>
  );
}

// ─── Inline detail panel ──────────────────────────────────────────────────────

function InlineDetailPanel({
  log,
  record,
  history,
  tab,
  mode,
  onTabChange,
  onModeChange,
  onClose,
  onMutated,
  onSigColumnChange,
  voidModal,
  voidReason,
  voidError,
  onVoidModalChange,
  onVoidReasonChange,
  onVoidSubmit,
}: {
  log: LogDefinition;
  record: LogRecord;
  history: RecordVersion[];
  tab: "data" | "lineage" | "history";
  mode: "view" | "edit" | "correct";
  onTabChange: (t: "data" | "lineage" | "history") => void;
  onModeChange: (m: "view" | "edit" | "correct") => void;
  onClose: () => void;
  onMutated: () => void;
  onSigColumnChange: (id: string | null) => void;
  voidModal: boolean;
  voidReason: string;
  voidError: string;
  onVoidModalChange: (v: boolean) => void;
  onVoidReasonChange: (v: string) => void;
  onVoidSubmit: () => void;
}) {
  const canEdit = record.status === "active";
  const sigColumns = log.columns.filter((c) => c.dataType === "signature");

  if (mode === "edit" || mode === "correct") {
    return (
      <div className="detail-panel">
        <div className="detail-panel-header">
          <span className="record-num">
            {record.recordNumber} —{" "}
            {mode === "correct" ? "Submit Correction" : "Edit Record"}
          </span>
          <button className="panel-close" onClick={() => onModeChange("view")}>
            <X size={13} />
          </button>
        </div>
        <div style={{ padding: "1rem" }}>
          <RecordEntryForm
            log={log}
            columns={log.columns}
            existingRecord={record}
            mode={mode}
            onSuccess={(_r) => {
              onModeChange("view");
              onMutated();
            }}
            onCancel={() => onModeChange("view")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="detail-panel">
      {/* Header */}
      <div className="detail-panel-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span className="record-num">{record.recordNumber}</span>
          <RecordStatusChip status={record.status} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>
            {new Date(record.createdAt).toLocaleString()}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          {canEdit && (
            <>
              <button
                onClick={() => onModeChange("edit")}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: 11 }}
              >
                <Edit size={11} /> Edit
              </button>
              <button
                onClick={() => onModeChange("correct")}
                className="btn btn-secondary btn-sm"
                style={{
                  fontSize: 11,
                  color: "var(--warn)",
                  borderColor: "#fde68a",
                }}
              >
                <CheckCircle size={11} /> Correct
              </button>
              <button
                onClick={() => onVoidModalChange(true)}
                className="btn btn-secondary btn-sm"
                style={{
                  fontSize: 11,
                  color: "var(--danger)",
                  borderColor: "#f8d7da",
                }}
              >
                <Ban size={11} /> Void
              </button>
            </>
          )}
          <button className="panel-close" onClick={onClose}>
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Status banners */}
      {record.status === "corrected" && (
        <div
          style={{
            margin: "0.75rem 1rem 0",
            padding: "0.5rem 0.75rem",
            background: "#d1ecf1",
            borderLeft: "4px solid #0c5460",
            color: "#0c5460",
            fontSize: 12,
            display: "flex",
            gap: "0.4rem",
          }}
        >
          <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>Corrected. Reason: {record.correctionReason}</span>
        </div>
      )}
      {record.status === "voided" && (
        <div
          style={{
            margin: "0.75rem 1rem 0",
            padding: "0.5rem 0.75rem",
            background: "#f8d7da",
            borderLeft: "4px solid #721c24",
            color: "#721c24",
            fontSize: 12,
            display: "flex",
            gap: "0.4rem",
          }}
        >
          <XCircle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>Voided. Reason: {record.voidReason}</span>
        </div>
      )}

      {/* Body */}
      <div className="detail-panel-body">
        {/* Left: field data */}
        <div>
          <div className="tab-bar">
            {(["data", "lineage", "history"] as const).map((t) => (
              <button
                key={t}
                onClick={() => onTabChange(t)}
                className={`tab-btn${tab === t ? " active" : ""}`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "data" && (
            <div className="detail-panel-fields">
              {log.columns
                .filter((c) => c.dataType !== "signature")
                .map((col) => {
                  const fv = record.fieldValues?.find(
                    (f: FieldValue) => f.columnId === col.id,
                  );
                  const displayValue = fv?.value ?? record.data[col.name];
                  return (
                    <div key={col.id} className="field-row">
                      <span className="fl">{col.label}</span>
                      <span className="fv">
                        {displayValue !== null && displayValue !== undefined ? (
                          String(displayValue)
                        ) : (
                          <em style={{ color: "var(--muted)" }}>—</em>
                        )}
                      </span>
                    </div>
                  );
                })}
            </div>
          )}

          {tab === "lineage" && <PanelLineageView record={record} />}
          {tab === "history" && <PanelHistoryView versions={history} />}
        </div>

        {/* Right: signatures + actions */}
        <div>
          {sigColumns.length > 0 && (
            <>
              <p className="section-title">Signatures</p>
              {sigColumns.map((col) => {
                const sig = (record as any).signatures?.find(
                  (s: any) => s.columnId === col.id && s.status === "signed",
                );
                return (
                  <div key={col.id} className="sig-row">
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--text)",
                        }}
                      >
                        {col.label}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 11,
                          color: "var(--muted)",
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
                            fontSize: 11,
                            color: "var(--ok)",
                            fontWeight: 700,
                          }}
                        >
                          ✓ Signed
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 11,
                            color: "var(--muted)",
                          }}
                        >
                          {new Date(sig.signedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ) : canEdit ? (
                      <button
                        onClick={() => onSigColumnChange(col.id)}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: 11 }}
                      >
                        <PenLine size={11} /> Sign
                      </button>
                    ) : (
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--muted)",
                          fontStyle: "italic",
                        }}
                      >
                        Unsigned
                      </span>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {sigColumns.length === 0 && (
            <div style={{ padding: "0.5rem 0" }}>
              <p className="section-title">Record Info</p>
              <div className="field-row">
                <span className="fl">Record #</span>
                <span className="fv" style={{ fontFamily: "monospace" }}>
                  {record.recordNumber}
                </span>
              </div>
              <div className="field-row">
                <span className="fl">Status</span>
                <span className="fv">
                  <RecordStatusChip status={record.status} />
                </span>
              </div>
              <div className="field-row">
                <span className="fl">Created</span>
                <span className="fv">
                  {new Date(record.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* ShieldCheck icon for reg context */}
          {sigColumns.length > 0 && (
            <div
              style={{
                marginTop: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                color: "var(--muted)",
                fontSize: 11,
              }}
            >
              <ShieldCheck size={12} />
              <span>Signatures are cryptographically hashed</span>
            </div>
          )}
        </div>
      </div>

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
            style={{
              background: "#fff",
              border: "1px solid var(--border)",
              width: "100%",
              maxWidth: 420,
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            }}
          >
            <div
              style={{
                background: "var(--brand)",
                padding: "0.75rem 1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>
                Void Record — {record.recordNumber}
              </span>
              <button
                onClick={() => onVoidModalChange(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.65)",
                  cursor: "pointer",
                  padding: "0.15rem",
                  display: "flex",
                  fontFamily: "inherit",
                }}
              >
                <X size={14} />
              </button>
            </div>
            <div style={{ padding: "1rem" }}>
              <p
                style={{
                  margin: "0 0 0.75rem",
                  fontSize: 12,
                  color: "var(--muted)",
                }}
              >
                The record is preserved but marked as voided. This cannot be
                undone.
              </p>
              <textarea
                value={voidReason}
                onChange={(e) => onVoidReasonChange(e.target.value)}
                rows={3}
                placeholder="Reason for voiding (required)"
                className="inp"
                style={{ resize: "none", marginBottom: "0.5rem" }}
              />
              {voidError && (
                <p
                  style={{
                    margin: "0 0 0.5rem",
                    fontSize: 12,
                    color: "var(--danger)",
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
                  onClick={() => onVoidModalChange(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button onClick={onVoidSubmit} className="btn btn-danger">
                  Void Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Panel lineage view ───────────────────────────────────────────────────────

function PanelLineageView({ record }: { record: LogRecord }) {
  const syncFields =
    record.fieldValues?.filter((fv: FieldValue) => fv.sourceRecordId) ?? [];
  if (syncFields.length === 0) {
    return (
      <div
        style={{
          padding: "1.5rem",
          textAlign: "center",
          color: "var(--muted)",
          fontSize: 12,
        }}
      >
        <GitBranch size={24} style={{ marginBottom: "0.4rem", opacity: 0.4 }} />
        <p style={{ margin: 0 }}>No synchronized fields in this record.</p>
      </div>
    );
  }
  return (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      {syncFields.map((fv: FieldValue) => (
        <div
          key={fv.id}
          style={{
            padding: "0.5rem",
            background: "var(--brand-light)",
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.3rem",
            }}
          >
            <span
              style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}
            >
              {fv.column?.label ?? fv.columnId}
            </span>
            <span
              style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}
            >
              {fv.value ?? "—"}
            </span>
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--muted)",
              display: "grid",
              gap: "0.15rem",
            }}
          >
            <span>
              Source record:{" "}
              <span style={{ fontFamily: "monospace", color: "var(--accent)" }}>
                {fv.sourceRecord?.recordNumber ?? fv.sourceRecordId}
              </span>
            </span>
            <span>Field: {fv.sourceColumn?.label ?? fv.sourceColumnId}</span>
            <span>Snapshot: {fv.snapshotValue ?? "—"}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Panel history view ───────────────────────────────────────────────────────

function PanelHistoryView({ versions }: { versions: RecordVersion[] }) {
  if (versions.length === 0) {
    return (
      <div
        style={{
          padding: "1.5rem",
          textAlign: "center",
          color: "var(--muted)",
          fontSize: 12,
        }}
      >
        <Clock size={24} style={{ marginBottom: "0.4rem", opacity: 0.4 }} />
        <p style={{ margin: 0 }}>No version history.</p>
      </div>
    );
  }
  return (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      {versions.map((v) => (
        <div key={v.id} style={{ border: "1px solid var(--border)" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.4rem 0.6rem",
              background: "var(--bg-header)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  fontWeight: 700,
                  background: "var(--brand)",
                  color: "#fff",
                  padding: "1px 5px",
                  borderRadius: 2,
                }}
              >
                v{v.version}
              </span>
              <span
                style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}
              >
                {v.changedBy?.name ?? "Unknown"}
              </span>
            </div>
            <span style={{ fontSize: 11, color: "var(--muted)" }}>
              {new Date(v.createdAt).toLocaleString()}
            </span>
          </div>
          {v.changeReason && (
            <p
              style={{
                margin: 0,
                padding: "0.35rem 0.6rem",
                fontSize: 11,
                color: "var(--muted)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {v.changeReason}
            </p>
          )}
          <pre
            style={{
              margin: 0,
              padding: "0.5rem 0.6rem",
              fontSize: 11,
              background: "#fff",
              overflowX: "auto",
              color: "var(--text-mid)",
              lineHeight: 1.5,
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

function formatCellValue(val: unknown): string {
  if (val === null || val === undefined) return "—";
  if (typeof val === "boolean") return val ? "Yes" : "No";
  if (Array.isArray(val)) return val.join(", ");
  return String(val);
}

function RecordStatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "flag-active",
    corrected: "flag-corrected",
    voided: "flag-voided",
    archived: "flag-archived",
  };
  return (
    <span className={`flag-chip ${map[status] ?? "flag-archived"}`}>
      {status}
    </span>
  );
}
