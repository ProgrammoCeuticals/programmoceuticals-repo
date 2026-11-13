import { useEffect, useState } from "react";
import { GitBranch, Plus, X, ArrowRight, Trash2 } from "lucide-react";
import { relationshipsApi } from "../api/relationships";
import { logsApi } from "../api/logs";
import { useToast } from "../shared/components/Toast";
import type { LogRelationship, LogDefinition } from "../types";

export function RelationshipsPage() {
  const toast = useToast();
  const [relationships, setRelationships] = useState<LogRelationship[]>([]);
  const [logs, setLogs] = useState<LogDefinition[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  function reload() {
    Promise.all([
      relationshipsApi.list(),
      logsApi.list({ limit: 100 }).then((r) => r.items),
    ])
      .then(([rels, ls]) => {
        setRelationships(rels);
        setLogs(ls);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    reload();
  }, []);

  async function handleDelete(id: string, name: string) {
    if (
      !confirm(
        `Delete relationship "${name}"? Existing record links will be removed.`,
      )
    )
      return;
    await relationshipsApi.delete(id);
    toast.success("Relationship deleted");
    reload();
  }

  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Relationships</h1>
          <p className="page-subtitle">
            Connect logs so records can reference and synchronise data
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          <Plus size={13} /> New Relationship
        </button>
      </div>

      {showForm && (
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
              New Relationship
            </p>
            <button
              onClick={() => setShowForm(false)}
              className="btn btn-ghost btn-sm"
              style={{ padding: "0.2rem" }}
            >
              <X size={14} />
            </button>
          </div>
          <RelationshipForm
            logs={logs}
            onSuccess={() => {
              setShowForm(false);
              reload();
              toast.success("Relationship created");
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div className="loading">Loading…</div>
        ) : relationships.length === 0 ? (
          <div className="empty">
            <GitBranch size={36} className="empty-icon" />
            <p className="empty-title">No relationships yet</p>
            <p style={{ fontSize: "0.8rem" }}>
              Connect two logs to enable reference and synchronisation fields.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="results-table">
              <thead>
                <tr>
                  <th className="pc-col-chevron"></th>
                  <th>Name</th>
                  <th>Source Log</th>
                  <th
                    style={{
                      width: 24,
                      textAlign: "center",
                      padding: "0.5rem 0.25rem",
                    }}
                  ></th>
                  <th>Target Log</th>
                  <th style={{ width: 100 }}>Type</th>
                  <th style={{ width: 70, textAlign: "center" }}>Mappings</th>
                  <th style={{ width: 36 }}></th>
                </tr>
              </thead>
              <tbody>
                {relationships.map((rel) => {
                  const isExpanded = expandedId === rel.id;
                  const mappingCount = rel.fieldMappings?.length ?? 0;
                  return (
                    <>
                      <tr
                        key={rel.id}
                        className="clickable"
                        style={{
                          background: isExpanded
                            ? "var(--brand-light)"
                            : undefined,
                        }}
                        onClick={() =>
                          setExpandedId(isExpanded ? null : rel.id)
                        }
                      >
                        <td className="pc-col-chevron" style={{ fontSize: 12 }}>
                          {isExpanded ? "▾" : "▸"}
                        </td>
                        <td style={{ fontWeight: 700, color: "var(--text)" }}>
                          {rel.name}
                        </td>
                        <td>
                          <span
                            className="flag-chip"
                            style={{
                              background: "var(--brand-light)",
                              color: "var(--brand)",
                            }}
                          >
                            {rel.sourceLog?.name ?? rel.sourceLogId}
                          </span>
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            padding: "0.5rem 0.25rem",
                          }}
                        >
                          <ArrowRight size={12} color="var(--muted)" />
                        </td>
                        <td>
                          <span
                            className="flag-chip"
                            style={{ background: "#e8daef", color: "#6c3483" }}
                          >
                            {rel.targetLog?.name ?? rel.targetLogId}
                          </span>
                        </td>
                        <td>
                          <span className="flag-chip flag-archived">
                            {rel.relationshipType}
                          </span>
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            fontFamily: "monospace",
                            color: "var(--muted)",
                          }}
                        >
                          {mappingCount}
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleDelete(rel.id, rel.name)}
                            className="btn btn-secondary btn-sm"
                            style={{
                              padding: "0.25rem 0.4rem",
                              color: "var(--danger)",
                              borderColor: "#f8d7da",
                            }}
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>

                      {/* Expand row */}
                      {isExpanded && (
                        <tr style={{ background: "var(--brand-light)" }}>
                          <td
                            colSpan={8}
                            style={{
                              padding: "0.75rem 1.25rem",
                              borderBottom: "2px solid var(--brand)",
                            }}
                          >
                            {rel.description && (
                              <p
                                style={{
                                  margin: "0 0 0.5rem",
                                  fontSize: 12,
                                  color: "var(--text-muted)",
                                }}
                              >
                                {rel.description}
                              </p>
                            )}
                            {mappingCount > 0 ? (
                              <>
                                <p
                                  className="section-title"
                                  style={{ marginBottom: "0.4rem" }}
                                >
                                  Synchronised Field Mappings
                                </p>
                                <div
                                  style={{ display: "grid", gap: "0.25rem" }}
                                >
                                  {rel.fieldMappings!.map((m) => (
                                    <div
                                      key={m.id}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.4rem",
                                        fontSize: 12,
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontFamily: "monospace",
                                          background: "#fff",
                                          border: "1px solid var(--border)",
                                          padding: "1px 6px",
                                        }}
                                      >
                                        {m.sourceColumn?.label ??
                                          m.sourceColumnId}
                                      </span>
                                      <ArrowRight
                                        size={11}
                                        color="var(--muted)"
                                      />
                                      <span
                                        style={{
                                          fontFamily: "monospace",
                                          background: "#fff",
                                          border: "1px solid var(--border)",
                                          padding: "1px 6px",
                                        }}
                                      >
                                        {m.targetColumn?.label ??
                                          m.targetColumnId}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: 12,
                                  color: "var(--muted)",
                                  fontStyle: "italic",
                                }}
                              >
                                No field mappings defined.
                              </p>
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
      </div>
    </div>
  );
}

// ─── Relationship form ────────────────────────────────────────────────────────

function RelationshipForm({
  logs,
  onSuccess,
  onCancel,
}: {
  logs: LogDefinition[];
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDesc] = useState("");
  const [sourceLogId, setSrc] = useState("");
  const [targetLogId, setTgt] = useState("");
  const [relType, setRelType] = useState<
    "many_to_one" | "one_to_many" | "one_to_one"
  >("many_to_one");
  const [refColId, setRefColId] = useState("");
  const [mappings, setMappings] = useState<
    Array<{ sourceColumnId: string; targetColumnId: string }>
  >([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const sourceLog = logs.find((l) => l.id === sourceLogId);
  const targetLog = logs.find((l) => l.id === targetLogId);
  const targetRefCols =
    targetLog?.columns.filter((c) => c.dataType === "reference") ?? [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !sourceLogId || !targetLogId) {
      setError("Name, source log, and target log are required");
      return;
    }
    if (sourceLogId === targetLogId) {
      setError("Source and target logs must be different");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await relationshipsApi.create({
        name,
        description: description || undefined,
        sourceLogId,
        targetLogId,
        referencingColumnId: refColId || undefined,
        relationshipType: relType,
        fieldMappings: mappings.filter(
          (m) => m.sourceColumnId && m.targetColumnId,
        ),
      });
      onSuccess();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg ?? "Failed to create relationship");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
      {error && <div className="pc-alert pc-alert-error">{error}</div>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.75rem",
        }}
      >
        <div style={{ gridColumn: "1 / -1" }}>
          <label className="field-label">
            Name <span style={{ color: "var(--danger)" }}>*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Packaging references Batch Manufacturing"
            className="inp"
          />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label className="field-label">Description</label>
          <input
            value={description}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Optional"
            className="inp"
          />
        </div>
        <div>
          <label className="field-label">
            Source Log (referenced){" "}
            <span style={{ color: "var(--danger)" }}>*</span>
          </label>
          <select
            value={sourceLogId}
            onChange={(e) => setSrc(e.target.value)}
            className="inp"
          >
            <option value="">— Select —</option>
            {logs.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label">
            Target Log (holds reference){" "}
            <span style={{ color: "var(--danger)" }}>*</span>
          </label>
          <select
            value={targetLogId}
            onChange={(e) => setTgt(e.target.value)}
            className="inp"
          >
            <option value="">— Select —</option>
            {logs
              .filter((l) => l.id !== sourceLogId)
              .map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="field-label">Type</label>
          <select
            value={relType}
            onChange={(e) => setRelType(e.target.value as typeof relType)}
            className="inp"
          >
            <option value="many_to_one">Many-to-one</option>
            <option value="one_to_many">One-to-many</option>
            <option value="one_to_one">One-to-one</option>
          </select>
        </div>
        {targetRefCols.length > 0 && (
          <div>
            <label className="field-label">Reference column in target</label>
            <select
              value={refColId}
              onChange={(e) => setRefColId(e.target.value)}
              className="inp"
            >
              <option value="">— Select —</option>
              {targetRefCols.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Field mappings */}
      {sourceLog && targetLog && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.4rem",
            }}
          >
            <p className="section-title" style={{ margin: 0 }}>
              Synchronised Field Mappings
            </p>
            <button
              type="button"
              onClick={() =>
                setMappings((m) => [
                  ...m,
                  { sourceColumnId: "", targetColumnId: "" },
                ])
              }
              className="btn btn-secondary btn-sm"
            >
              <Plus size={11} /> Add mapping
            </button>
          </div>
          <div style={{ display: "grid", gap: "0.4rem" }}>
            {mappings.map((m, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <select
                  value={m.sourceColumnId}
                  onChange={(e) =>
                    setMappings((ms) =>
                      ms.map((x, idx) =>
                        idx === i
                          ? { ...x, sourceColumnId: e.target.value }
                          : x,
                      ),
                    )
                  }
                  className="inp"
                  style={{ flex: 1 }}
                >
                  <option value="">Source column</option>
                  {sourceLog.columns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <ArrowRight
                  size={13}
                  color="var(--muted)"
                  style={{ flexShrink: 0 }}
                />
                <select
                  value={m.targetColumnId}
                  onChange={(e) =>
                    setMappings((ms) =>
                      ms.map((x, idx) =>
                        idx === i
                          ? { ...x, targetColumnId: e.target.value }
                          : x,
                      ),
                    )
                  }
                  className="inp"
                  style={{ flex: 1 }}
                >
                  <option value="">Target column</option>
                  {targetLog.columns
                    .filter((c) => c.behavior === "synchronized")
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  onClick={() =>
                    setMappings((ms) => ms.filter((_, idx) => idx !== i))
                  }
                  className="btn btn-secondary btn-sm"
                  style={{
                    padding: "0.25rem 0.4rem",
                    color: "var(--danger)",
                    borderColor: "#f8d7da",
                    flexShrink: 0,
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "0.5rem",
          paddingTop: "0.5rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="btn btn-primary">
          {saving ? "Saving…" : "Create Relationship"}
        </button>
      </div>
    </form>
  );
}
