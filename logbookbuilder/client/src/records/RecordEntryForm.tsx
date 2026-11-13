import { useState, useEffect } from "react";
import type { LogColumn, LogRecord, LogDefinition } from "../types";
import type { ColumnDataType } from "../types/schema";
import { recordsApi } from "../api/records";

interface Props {
  log: LogDefinition;
  columns: LogColumn[];
  linkedLogIds?: string[];
  existingRecord?: LogRecord;
  onSuccess: (record: LogRecord) => void;
  onCancel: () => void;
  mode?: "create" | "edit" | "correct";
}

type FieldValues = Record<string, unknown>;
type LinkValues = Record<string, string>;

export function RecordEntryForm({
  log,
  columns,
  linkedLogIds: linkedLogIdsProp,
  existingRecord,
  onSuccess,
  onCancel,
  mode = "create",
}: Props) {
  const logId = log.id;
  const [data, setData] = useState<FieldValues>(() => {
    if (existingRecord) return existingRecord.data as FieldValues;
    const defaults: FieldValues = {};
    for (const col of columns) {
      if (col.defaultValue) defaults[col.name] = col.defaultValue;
    }
    return defaults;
  });
  const [links, setLinks] = useState<LinkValues>({});
  const [syncedValues, setSyncedValues] = useState<Record<string, string>>({});
  const [linkedLogIds, setLinkedLogIds] = useState<string[]>(linkedLogIdsProp ?? []);
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // If linkedLogIds not passed as prop, derive from relationships
  useEffect(() => {
    if (linkedLogIdsProp !== undefined) return;
    import("../api/relationships").then(({ relationshipsApi }) =>
      relationshipsApi.list().then((rels) => {
        const ids = rels
          .filter((r) => r.sourceLogId === log.id || r.targetLogId === log.id)
          .map((r) => (r.sourceLogId === log.id ? r.targetLogId : r.sourceLogId));
        setLinkedLogIds(ids);
      })
    ).catch(() => {});
  }, [log.id]);

  function setField(name: string, value: unknown) {
    setData((d) => ({ ...d, [name]: value }));
    setErrors((e) => {
      const n = { ...e };
      delete n[name];
      return n;
    });
  }

  function setLink(columnIdOrLogId: string, recordId: string) {
    setLinks((l) => ({ ...l, [columnIdOrLogId]: recordId }));
    if (!recordId) return;
    const syncCols = columns.filter((c) => c.behavior === "synchronized");
    if (syncCols.length === 0) return;
    Promise.all(
      linkedLogIds.map((lId) =>
        import("../api/records").then(({ recordsApi }) =>
          recordsApi.get(lId, recordId).catch(() => null),
        ),
      ),
    )
      .then((results) => {
        const rec = results.find((r) => r !== null);
        if (!rec) return;
        const updates: Record<string, string> = {};
        for (const sc of syncCols) {
          const val = (rec.data as Record<string, unknown>)[sc.name];
          if (val !== undefined && val !== null) updates[sc.id] = String(val);
        }
        setSyncedValues((prev) => ({ ...prev, ...updates }));
      })
      .catch(() => {});
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    for (const col of columns) {
      if (!col.isRequired) continue;
      if (col.behavior === "synchronized" || col.behavior === "calculated") continue;
      if (col.dataType === "signature") continue;
      const val = data[col.name];
      if (val === null || val === undefined || val === "")
        errs[col.name] = `${col.label} is required`;
    }
    if (mode === "correct" && !reason.trim())
      errs["_reason"] = "Correction reason is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError("");
    try {
      let record: LogRecord;
      if (mode === "create") {
        record = await recordsApi.create(logId, { data, links });
      } else if (mode === "edit" && existingRecord) {
        record = await recordsApi.update(logId, existingRecord.id, { data, links });
      } else if (mode === "correct" && existingRecord) {
        record = await recordsApi.correct(logId, existingRecord.id, { data, links, reason });
      } else {
        throw new Error("Invalid form mode");
      }
      onSuccess(record);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setServerError(msg ?? "Failed to save record");
    } finally {
      setSubmitting(false);
    }
  }

  const entryColumns = columns.filter((c) => c.dataType !== "signature");

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.1rem" }}>
      {serverError && <div className="alert alert-error">{serverError}</div>}

      {linkedLogIds.length > 0 && (
        <LinkedRecordPickers
          linkedLogIds={linkedLogIds}
          links={links}
          onLink={(lId, recordId) => setLink(lId, recordId)}
        />
      )}

      {entryColumns.map((col) => {
        const isSynced = col.behavior === "synchronized";
        const isCalc = col.behavior === "calculated" || col.dataType === "calculated";
        return (
          <div key={col.id}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.35rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#334155" }}>
                {col.label}
                {col.isRequired && <span style={{ color: "#b91c1c", marginLeft: 2 }}>*</span>}
              </label>
              {isSynced && <span className="badge badge-teal">synchronized</span>}
              {isCalc && <span className="badge badge-orange">calculated</span>}
            </div>

            {isSynced || isCalc ? (
              <div style={{ padding: "0.55rem 0.75rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: "0.875rem", color: "#94a3b8", fontStyle: "italic" }}>
                {syncedValues[col.id] ?? "— will be resolved automatically —"}
              </div>
            ) : (
              <FieldInput
                col={col}
                value={data[col.name]}
                onChange={(v) => setField(col.name, v)}
                onLink={(recordId) => setLink(col.id, recordId)}
                linkedLogIds={linkedLogIds}
              />
            )}

            {errors[col.name] && (
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.78rem", color: "#b91c1c" }}>
                {errors[col.name]}
              </p>
            )}
          </div>
        );
      })}

      {mode === "correct" && (
        <div>
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
            Correction Reason <span style={{ color: "#b91c1c" }}>*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            placeholder="Explain why this correction is being made"
            className="inp"
            style={{ resize: "none" }}
          />
          {errors["_reason"] && (
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.78rem", color: "#b91c1c" }}>
              {errors["_reason"]}
            </p>
          )}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.5rem", paddingTop: "0.5rem", borderTop: "1px solid #f1f5f9" }}>
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
        <button type="submit" disabled={submitting} className="btn btn-primary">
          {submitting ? "Saving…" : mode === "correct" ? "Submit Correction" : mode === "edit" ? "Save Changes" : "Create Record"}
        </button>
      </div>
    </form>
  );
}

// ─── Field input renderer ─────────────────────────────────────────────────────

function FieldInput({
  col, value, onChange, onLink, linkedLogIds,
}: {
  col: LogColumn;
  value: unknown;
  onChange: (v: unknown) => void;
  onLink: (recordId: string) => void;
  linkedLogIds: string[];
}) {
  if (col.behavior === "linked") return null;

  switch (col.dataType as ColumnDataType) {
    case "text":
      return <input type="text" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className="inp" />;

    case "long_text":
      return <textarea value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} rows={3} className="inp" style={{ resize: "none" }} />;

    case "integer":
      return <input type="number" step="1" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className="inp" />;

    case "decimal":
      return <input type="number" step="any" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className="inp" />;

    case "date":
      return <input type="date" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className="inp" />;

    case "time":
      return <input type="time" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className="inp" />;

    case "datetime":
      return <input type="datetime-local" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className="inp" />;

    case "boolean":
      return (
        <div style={{ display: "flex", gap: "1rem" }}>
          {["true", "false"].map((opt) => (
            <label key={opt} style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontSize: "0.875rem", color: "#334155", fontWeight: 500 }}>
              <input type="radio" name={col.id} value={opt} checked={String(value) === opt} onChange={() => onChange(opt === "true")} style={{ accentColor: "#0b5ed7", width: 14, height: 14 }} />
              {opt === "true" ? "Yes" : "No"}
            </label>
          ))}
        </div>
      );

    case "dropdown": {
      const opts = (col.typeConfig.options as Array<{ value: string; label: string }>) ?? [];
      return (
        <select value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className="inp">
          <option value="">— Select —</option>
          {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
    }

    case "multi_select": {
      const opts = (col.typeConfig.options as Array<{ value: string; label: string }>) ?? [];
      const selected = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div style={{ display: "grid", gap: "0.4rem" }}>
          {opts.map((o) => (
            <label key={o.value} style={{ display: "flex", alignItems: "center", gap: "0.45rem", cursor: "pointer", fontSize: "0.875rem", color: "#334155", fontWeight: 500 }}>
              <input
                type="checkbox"
                checked={selected.includes(o.value)}
                onChange={(e) => {
                  const next = e.target.checked ? [...selected, o.value] : selected.filter((v) => v !== o.value);
                  onChange(next);
                }}
                style={{ accentColor: "#0b5ed7", width: 14, height: 14 }}
              />
              {o.label}
            </label>
          ))}
        </div>
      );
    }

    case "reference":
      return <ReferencePicker linkedLogIds={linkedLogIds} value={String(value ?? "")} onChange={onChange} onLink={onLink} />;

    case "user":
    case "person":
      return <input type="text" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} placeholder="Name or ID" className="inp" />;

    case "file":
    case "image":
      return (
        <div style={{ padding: "0.75rem", border: "2px dashed #e2e8f0", borderRadius: 8, textAlign: "center", fontSize: "0.875rem", color: "#94a3b8" }}>
          File upload — attach after saving the record
        </div>
      );

    default:
      return <input type="text" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className="inp" />;
  }
}

// ─── Reference picker ─────────────────────────────────────────────────────────

function ReferencePicker({ linkedLogIds, value, onChange, onLink }: {
  linkedLogIds: string[];
  value: string;
  onChange: (v: unknown) => void;
  onLink: (id: string) => void;
}) {
  const [options, setOptions] = useState<Array<{ id: string; recordNumber: string; data: Record<string, unknown> }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (linkedLogIds.length === 0) return;
    setLoading(true);
    import("../api/records")
      .then(({ recordsApi }) => recordsApi.list(linkedLogIds[0], { limit: 100 }))
      .then((r) => setOptions(r.items))
      .finally(() => setLoading(false));
  }, [linkedLogIds[0]]);

  if (loading) return <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Loading records…</div>;

  return (
    <select value={value} onChange={(e) => { onChange(e.target.value); onLink(e.target.value); }} className="inp">
      <option value="">— Select a record —</option>
      {options.map((r) => {
        const firstVal = Object.values(r.data)[0];
        return <option key={r.id} value={r.id}>{r.recordNumber}{firstVal ? ` — ${firstVal}` : ""}</option>;
      })}
    </select>
  );
}

// ─── Linked record pickers (mini table per linked log) ────────────────────────

function LinkedRecordPickers({ linkedLogIds, links, onLink }: {
  linkedLogIds: string[];
  links: Record<string, string>;
  onLink: (logId: string, recordId: string) => void;
}) {
  const [groups, setGroups] = useState<Array<{
    logId: string;
    logName: string;
    columns: Array<{ id: string; name: string; label: string }>;
    records: Array<{ id: string; recordNumber: string; data: Record<string, unknown> }>;
  }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (linkedLogIds.length === 0) return;
    setLoading(true);
    Promise.all(
      linkedLogIds.map((lId) =>
        Promise.all([
          import("../api/records").then(({ recordsApi }) => recordsApi.list(lId, { limit: 100 })),
          import("../api/logs").then(({ logsApi }) => logsApi.get(lId)),
        ]).then(([result, log]) => ({
          logId: lId,
          logName: log.name,
          columns: log.columns
            .filter((c: { dataType: string; behavior: string }) =>
              c.dataType !== "signature" && c.dataType !== "file" && c.dataType !== "image" && c.behavior !== "calculated"
            )
            .slice(0, 6),
          records: result.items,
        })),
      ),
    )
      .then(setGroups)
      .finally(() => setLoading(false));
  }, [linkedLogIds.join(",")]);

  if (loading)
    return <div style={{ fontSize: "0.875rem", color: "#94a3b8" }}>Loading linked records…</div>;

  return (
    <>
      {groups.map((group) => {
        const selectedId =
          Object.entries(links).find(([, v]) => group.records.some((r) => r.id === v))?.[1] ??
          links[group.logId] ??
          "";
        return (
          <div key={group.logId} style={{ border: "1px solid #bfdbfe", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ padding: "0.6rem 0.85rem", background: "#eff6ff", borderBottom: "1px solid #bfdbfe" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1e3a8a" }}>
                Select a record from {group.logName}
              </span>
              {selectedId && (
                <span style={{ marginLeft: "0.75rem", fontSize: "0.75rem", color: "#166534", fontWeight: 600 }}>
                  ✓ {group.records.find((r) => r.id === selectedId)?.recordNumber ?? "selected"}
                </span>
              )}
            </div>

            {group.records.length === 0 ? (
              <div style={{ padding: "0.85rem", fontSize: "0.82rem", color: "#94a3b8", fontStyle: "italic" }}>
                No records in {group.logName} yet.
              </div>
            ) : (
              <div style={{ overflowX: "auto", maxHeight: 260, overflowY: "auto" }}>
                <table className="drt-table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th style={{ width: 16 }}></th>
                      <th>Record #</th>
                      {group.columns.map((col) => <th key={col.id}>{col.label}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {group.records.map((record) => {
                      const isSelected = record.id === selectedId;
                      return (
                        <tr
                          key={record.id}
                          className="clickable"
                          onClick={() => onLink(group.logId, isSelected ? "" : record.id)}
                          style={{
                            background: isSelected ? "#eff6ff" : undefined,
                            outline: isSelected ? "2px solid #3b82f6" : undefined,
                            outlineOffset: -2,
                          }}
                        >
                          <td style={{ textAlign: "center", paddingRight: 0 }}>
                            <input type="radio" readOnly checked={isSelected} style={{ accentColor: "#0b5ed7" }} />
                          </td>
                          <td style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "var(--navy)", whiteSpace: "nowrap" }}>
                            {record.recordNumber}
                          </td>
                          {group.columns.map((col) => (
                            <td key={col.id} style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {formatCellValue(record.data[col.name])}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

function formatCellValue(val: unknown): string {
  if (val === null || val === undefined) return "—";
  if (typeof val === "boolean") return val ? "Yes" : "No";
  if (Array.isArray(val)) return val.join(", ");
  return String(val);
}
