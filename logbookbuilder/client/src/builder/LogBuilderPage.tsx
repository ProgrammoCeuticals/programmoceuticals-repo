import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { logsApi } from "../api/logs";
import { relationshipsApi } from "../api/relationships";
import { useToast } from "../shared/components/Toast";
import type { LogRelationship } from "../types";
import type { ColumnDataType, ColumnBehavior } from "../types/schema";

interface ColumnDraft {
  _key: string;
  name: string;
  label: string;
  dataType: ColumnDataType;
  behavior: ColumnBehavior;
  isRequired: boolean;
  isUnique: boolean;
  displayOrder: number;
  typeConfig: Record<string, unknown>;
  behaviorConfig: Record<string, unknown>;
  validationRules: Record<string, unknown>;
  _expanded: boolean;
}

const DATA_TYPES: { value: ColumnDataType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "long_text", label: "Long Text" },
  { value: "integer", label: "Integer" },
  { value: "decimal", label: "Decimal" },
  { value: "date", label: "Date" },
  { value: "time", label: "Time" },
  { value: "datetime", label: "Date & Time" },
  { value: "boolean", label: "Boolean" },
  { value: "dropdown", label: "Dropdown" },
  { value: "multi_select", label: "Multi-select" },
  { value: "user", label: "User" },
  { value: "person", label: "Person" },
  { value: "reference", label: "Reference" },
  { value: "calculated", label: "Calculated" },
  { value: "file", label: "File" },
  { value: "image", label: "Image" },
  { value: "signature", label: "Signature" },
];

const BEHAVIORS: {
  value: ColumnBehavior;
  label: string;
  description: string;
}[] = [
  {
    value: "independent",
    label: "Independent",
    description: "Value entered directly by the user",
  },
  {
    value: "synchronized",
    label: "Synchronized",
    description: "Value pulled from a linked log by matching column code",
  },
  {
    value: "calculated",
    label: "Calculated",
    description: "Value derived from an expression",
  },
];

function newColumn(order: number): ColumnDraft {
  return {
    _key: crypto.randomUUID(),
    name: "",
    label: "",
    dataType: "text",
    behavior: "independent",
    isRequired: false,
    isUnique: false,
    displayOrder: order,
    typeConfig: {},
    behaviorConfig: {},
    validationRules: {},
    _expanded: true,
  };
}

function labelToName(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export function LogBuilderPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = Boolean(id);

  const [logName, setLogName] = useState("");
  const [columns, setColumns] = useState<ColumnDraft[]>([newColumn(0)]);
  const [originalColumnIds, setOriginalColumnIds] = useState<Set<string>>(
    new Set(),
  );
  const [relationships, setRelationships] = useState<LogRelationship[]>([]);
  const [pendingLinkIds, setPendingLinkIds] = useState<string[]>([]);
  const [allLogs, setAllLogs] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    logsApi.list({ limit: 200 }).then((r) =>
      setAllLogs(
        r.items.map((l: { id: string; name: string }) => ({
          id: l.id,
          name: l.name,
        })),
      ),
    );
  }, []);

  useEffect(() => {
    if (!id) return;
    relationshipsApi
      .list()
      .then((rels) =>
        setRelationships(
          rels.filter((r) => r.sourceLogId === id || r.targetLogId === id),
        ),
      );
    logsApi.get(id).then((log) => {
      setLogName(log.name);
      setColumns(
        log.columns.map((c) => ({
          _key: c.id,
          name: c.name,
          label: c.label,
          dataType: c.dataType,
          behavior: c.behavior,
          isRequired: c.isRequired,
          isUnique: c.isUnique,
          displayOrder: c.displayOrder,
          typeConfig: c.typeConfig,
          behaviorConfig: c.behaviorConfig,
          validationRules: c.validationRules,
          _expanded: false,
        })),
      );
      setOriginalColumnIds(new Set(log.columns.map((c) => c.id)));
    });
  }, [id]);

  function addColumn() {
    setColumns((prev) => [
      ...prev.map((c) => ({ ...c, _expanded: false })),
      newColumn(prev.length),
    ]);
  }
  function removeColumn(key: string) {
    setColumns((prev) => prev.filter((c) => c._key !== key));
  }
  function updateColumn(key: string, patch: Partial<ColumnDraft>) {
    setColumns((prev) =>
      prev.map((c) => {
        if (c._key !== key) return c;
        const updated = { ...c, ...patch };
        if (patch.label !== undefined && !patch.name)
          updated.name = labelToName(patch.label);
        return updated;
      }),
    );
  }
  function toggleExpand(key: string) {
    setColumns((prev) =>
      prev.map((c) => (c._key === key ? { ...c, _expanded: !c._expanded } : c)),
    );
  }
  function moveColumn(key: string, dir: -1 | 1) {
    setColumns((prev) => {
      const idx = prev.findIndex((c) => c._key === key);
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr.map((c, i) => ({ ...c, displayOrder: i }));
    });
  }

  function reorderColumns(fromKey: string, toKey: string) {
    setColumns((prev) => {
      const from = prev.findIndex((c) => c._key === fromKey);
      const to = prev.findIndex((c) => c._key === toKey);
      if (from === -1 || to === -1 || from === to) return prev;
      const arr = [...prev];
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return arr.map((c, i) => ({ ...c, displayOrder: i }));
    });
  }

  async function handleSave() {
    setError("");
    // ── Client-side validation ────────────────────────────────────────────
    const validationErrors: string[] = [];
    if (!logName.trim()) validationErrors.push("Log name is required");
    columns.forEach((col, i) => {
      const n = i + 1;
      if (!col.label.trim())
        validationErrors.push(`Column ${n}: label is required`);
      if (!col.name.trim())
        validationErrors.push(`Column ${n}: internal name is required`);
      if (col.dataType === "dropdown" || col.dataType === "multi_select") {
        const opts =
          (col.typeConfig.options as Array<{ value: string; label: string }>) ??
          [];
        if (opts.length === 0)
          validationErrors.push(
            `Column ${n} (${col.label || "unnamed"}): at least one option is required for ${col.dataType}`,
          );
        opts.forEach((o, oi) => {
          if (!o.label.trim() || !o.value.trim())
            validationErrors.push(
              `Column ${n} option ${oi + 1}: both label and value are required`,
            );
        });
      }
      if (col.behavior === "calculated") {
        const expr = (col.behaviorConfig?.expression as string) ?? "";
        if (!expr.trim())
          validationErrors.push(
            `Column ${n} (${col.label || "unnamed"}): calculated columns require an expression`,
          );
      }
    });
    if (validationErrors.length > 0) {
      setError(validationErrors.join(" · "));
      return;
    }
    setSaving(true);
    try {
      const colPayloadBase = (col: ColumnDraft, i: number) => ({
        label: col.label,
        dataType: col.dataType,
        behavior: col.behavior,
        isRequired: col.isRequired,
        isUnique: col.isUnique,
        displayOrder: i,
        typeConfig: col.typeConfig,
        behaviorConfig: col.behaviorConfig,
        validationRules: col.validationRules,
      });

      if (isEdit && id) {
        await logsApi.update(id, { name: logName });
        const currentKeys = new Set(columns.map((c) => c._key));
        for (const origId of originalColumnIds) {
          if (!currentKeys.has(origId)) await logsApi.removeColumn(id, origId);
        }
        for (const col of columns) {
          if (originalColumnIds.has(col._key)) {
            await logsApi.updateColumn(
              id,
              col._key,
              colPayloadBase(col, col.displayOrder),
            );
          } else {
            await logsApi.addColumn(id, {
              ...colPayloadBase(col, col.displayOrder),
              name: col.name,
            });
          }
        }
        toast.success("Log updated");
        navigate(`/logs/${id}`);
      } else {
        const log = await logsApi.create({
          name: logName,
          columns: columns.map((c, i) => ({
            name: c.name,
            ...colPayloadBase(c, i),
          })),
        });
        for (const targetLogId of pendingLinkIds) {
          const tgtLog = allLogs.find((l) => l.id === targetLogId);
          await relationshipsApi.create({
            name: `${logName} ↔ ${tgtLog?.name ?? targetLogId}`,
            sourceLogId: log.id,
            targetLogId,
            relationshipType: "many_to_one",
          });
        }
        toast.success("Log created");
        navigate(`/logs/${log.id}`);
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg ?? "Failed to save log");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {isEdit ? "Edit Template" : "New Template"}
          </h1>
          <p className="page-subtitle">
            {isEdit
              ? "Update the log definition and its columns"
              : "Define a new configurable logbook"}
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => setPreview((p) => !p)}
            className="btn btn-secondary"
          >
            {preview ? <EyeOff size={14} /> : <Eye size={14} />}
            {preview ? "Edit" : "Preview"}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
          >
            <Save size={14} />
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {preview ? (
        <LogPreview name={logName} columns={columns} />
      ) : (
        <>
          {/* Log name */}
          <div
            className="card"
            style={{ padding: "1rem", marginBottom: "1.25rem" }}
          >
            <label className="field-label">
              Log Name <span style={{ color: "#b91c1c" }}>*</span>
            </label>
            <input
              value={logName}
              onChange={(e) => setLogName(e.target.value)}
              placeholder="e.g. Raw Material Receipt Log"
              className="inp"
            />
          </div>

          {/* Linked logs */}
          <LinkedLogsSection
            currentLogId={id}
            allLogs={allLogs}
            relationships={relationships}
            pendingLinkIds={pendingLinkIds}
            onRelationshipAdded={(rel) =>
              setRelationships((prev) => [...prev, rel])
            }
            onRelationshipRemoved={(relId) =>
              setRelationships((prev) => prev.filter((r) => r.id !== relId))
            }
            onPendingChange={setPendingLinkIds}
            onAddColumns={(cols) =>
              setColumns((prev) => [
                ...prev,
                ...cols.map((c, i) => ({
                  ...c,
                  displayOrder: prev.length + i,
                  _expanded: false,
                })),
              ])
            }
            onRemoveColumnsBySource={(sourceLogId) =>
              setColumns((prev) =>
                prev.filter(
                  (c) => c.behaviorConfig?.sourceLogId !== sourceLogId,
                ),
              )
            }
            onRemoveOneColumn={(sourceLogId, colName) =>
              setColumns((prev) =>
                prev.filter(
                  (c) =>
                    !(
                      c.behaviorConfig?.sourceLogId === sourceLogId &&
                      c.name === colName
                    ),
                ),
              )
            }
          />

          {/* Section label */}
          <p
            style={{
              margin: "0 0 0.6rem",
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "var(--text-mid)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Columns ({columns.length})
          </p>

          {/* Column editors */}
          <div
            style={{ display: "grid", gap: "0.5rem", marginBottom: "0.75rem" }}
          >
            {columns.map((col, idx) => (
              <ColumnEditor
                key={col._key}
                col={col}
                idx={idx}
                total={columns.length}
                onChange={(patch) => updateColumn(col._key, patch)}
                onRemove={() => removeColumn(col._key)}
                onToggle={() => toggleExpand(col._key)}
                onMove={(dir) => moveColumn(col._key, dir)}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={(fromKey) => reorderColumns(fromKey, col._key)}
              />
            ))}
          </div>

          {/* Add column */}
          <button
            onClick={addColumn}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              width: "100%",
              padding: "0.75rem",
              border: "2px dashed var(--border-dark)",
              background: "transparent",
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "var(--text-muted)",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "var(--navy)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--navy)";
              (e.currentTarget as HTMLButtonElement).style.background =
                "#eef2f4";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "var(--border-dark)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--text-muted)";
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
            }}
          >
            <Plus size={15} />
            Add Column
          </button>
        </>
      )}
    </div>
  );
}

// ─── Column editor row ────────────────────────────────────────────────────────

function ColumnEditor({
  col,
  idx,
  total,
  onChange,
  onRemove,
  onToggle,
  onMove,
  onDragOver,
  onDrop,
}: {
  col: ColumnDraft;
  idx: number;
  total: number;
  onChange: (patch: Partial<ColumnDraft>) => void;
  onRemove: () => void;
  onToggle: () => void;
  onMove: (dir: -1 | 1) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (fromKey: string) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div
      className={`card lb-col-${col.dataType}`}
      style={{
        overflow: "hidden",
        opacity: 1,
        outline: isDragOver ? "2px solid var(--navy)" : "none",
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
        onDragOver(e);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        setIsDragOver(false);
        onDrop(e.dataTransfer.getData("colKey"));
      }}
    >
      {/* Header row */}
      <div
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          padding: "0.75rem 1rem",
          cursor: "pointer",
          background: col._expanded ? "var(--bg-header)" : "#ffffff",
        }}
      >
        <GripVertical
          size={14}
          color="var(--border-dark)"
          style={{ flexShrink: 0, cursor: "grab" }}
        />
        <span
          style={{
            fontSize: "0.7rem",
            fontFamily: "monospace",
            color: "var(--text-faint)",
            width: 18,
            flexShrink: 0,
          }}
        >
          {idx + 1}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: col.label ? "var(--text-dark)" : "var(--text-faint)",
              fontStyle: col.label ? "normal" : "italic",
            }}
          >
            {col.label || "Untitled column"}
          </span>
          {col.label && (
            <span
              style={{
                marginLeft: "0.5rem",
                fontSize: "0.7rem",
                color: "var(--text-faint)",
              }}
            >
              {col.dataType}
              {col.behavior !== "independent" ? ` · ${col.behavior}` : ""}
            </span>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.2rem",
            flexShrink: 0,
          }}
        >
          {col.isRequired && <span className="badge badge-red">req</span>}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMove(-1);
            }}
            disabled={idx === 0}
            style={{
              padding: "0.2rem",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "var(--text-faint)",
              opacity: idx === 0 ? 0.3 : 1,
            }}
          >
            <ChevronUp size={13} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMove(1);
            }}
            disabled={idx === total - 1}
            style={{
              padding: "0.2rem",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "var(--text-faint)",
              opacity: idx === total - 1 ? 0.3 : 1,
            }}
          >
            <ChevronDown size={13} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            style={{
              padding: "0.2rem",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "var(--text-faint)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "#b91c1c")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color =
                "var(--text-faint)")
            }
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Expanded editor */}
      {col._expanded && (
        <div
          style={{
            padding: "1rem",
            borderTop: "1px solid var(--border)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.85rem",
          }}
        >
          <div>
            <label style={lbl}>
              Label <span style={{ color: "#b91c1c" }}>*</span>
            </label>
            <input
              value={col.label}
              onChange={(e) => onChange({ label: e.target.value })}
              placeholder="e.g. Batch Number"
              className="inp"
            />
          </div>

          <div>
            <label style={lbl}>Column Code</label>
            <input
              value={col.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="auto-generated"
              className="inp"
              style={{ fontFamily: "monospace" }}
            />
          </div>

          <div>
            <label style={lbl}>Data Type</label>
            <select
              value={col.dataType}
              onChange={(e) =>
                onChange({ dataType: e.target.value as ColumnDataType })
              }
              className="inp"
            >
              {DATA_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={lbl}>Behavior</label>
            <select
              value={col.behavior}
              onChange={(e) =>
                onChange({ behavior: e.target.value as ColumnBehavior })
              }
              className="inp"
            >
              {BEHAVIORS.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label} — {b.description}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown options */}
          {(col.dataType === "dropdown" || col.dataType === "multi_select") && (
            <div style={{ gridColumn: "1 / -1" }}>
              <DropdownOptionsEditor
                options={
                  (col.typeConfig?.options as Array<{
                    value: string;
                    label: string;
                  }>) ?? []
                }
                onChange={(options) =>
                  onChange({ typeConfig: { ...col.typeConfig, options } })
                }
              />
            </div>
          )}

          {/* Calculated expression */}
          {col.behavior === "calculated" && (
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={lbl}>Expression</label>
              <input
                value={(col.behaviorConfig?.expression as string) ?? ""}
                onChange={(e) =>
                  onChange({
                    behaviorConfig: {
                      ...col.behaviorConfig,
                      expression: e.target.value,
                    },
                  })
                }
                placeholder="e.g. {yield_kg} / {batch_size_kg} * 100"
                className="inp"
                style={{ fontFamily: "monospace" }}
              />
              <p
                style={{
                  margin: "0.3rem 0 0",
                  fontSize: "0.72rem",
                  color: "var(--text-faint)",
                }}
              >
                Use {"{column_name}"} to reference other columns.
              </p>
            </div>
          )}

          {/* Synchronized note */}

          {col.behavior === "synchronized" && (
            <div style={{ gridColumn: "1 / -1" }} className="alert alert-info">
              This field pulls its value from a linked log by matching column
              code{" "}
              <span style={{ fontFamily: "monospace", fontWeight: 700 }}>
                {col.name || "…"}
              </span>
              . Link logs in the <strong>Linked Logs</strong> section above.
            </div>
          )}

          {/* Required / Unique */}
          <div style={{ gridColumn: "1 / -1", display: "flex", gap: "1.5rem" }}>
            {[
              {
                checked: col.isRequired,
                onChange: (v: boolean) => onChange({ isRequired: v }),
                label: "Required",
              },
              {
                checked: col.isUnique,
                onChange: (v: boolean) => onChange({ isUnique: v }),
                label: "Unique values",
              },
            ].map(({ checked, onChange: onCh, label }) => (
              <label
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  cursor: "pointer",
                  fontSize: "0.82rem",
                  color: "var(--text-mid)",
                  fontWeight: 500,
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => onCh(e.target.checked)}
                  style={{ accentColor: "var(--navy)", width: 14, height: 14 }}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const lbl: React.CSSProperties = {
  display: "block",
  fontSize: "0.72rem",
  fontWeight: 700,
  color: "var(--text-mid)",
  marginBottom: "0.3rem",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

// ─── Linked logs section ─────────────────────────────────────────────────────

type LogWithColumns = {
  id: string;
  name: string;
  columns: {
    id: string;
    name: string;
    label: string;
    dataType: ColumnDataType;
  }[];
};

function LinkedLogsSection({
  currentLogId,
  allLogs,
  relationships,
  pendingLinkIds,
  onRelationshipAdded,
  onRelationshipRemoved,
  onPendingChange,
  onAddColumns,
  onRemoveColumnsBySource,
  onRemoveOneColumn,
}: {
  currentLogId?: string;
  allLogs: { id: string; name: string }[];
  relationships: LogRelationship[];
  pendingLinkIds: string[];
  onRelationshipAdded: (rel: LogRelationship) => void;
  onRelationshipRemoved: (id: string) => void;
  onPendingChange: (ids: string[]) => void;
  onAddColumns: (cols: ColumnDraft[]) => void;
  onRemoveColumnsBySource: (sourceLogId: string) => void;
  onRemoveOneColumn: (sourceLogId: string, colName: string) => void;
}) {
  const [loadedLogs, setLoadedLogs] = useState<Record<string, LogWithColumns>>(
    {},
  );
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const isEdit = Boolean(currentLogId);
  const others = allLogs.filter((l) => l.id !== currentLogId);
  if (others.length === 0) return null;

  const linkedIds = isEdit
    ? new Set(
        relationships
          .flatMap((r) => [r.sourceLogId, r.targetLogId])
          .filter((x) => x !== currentLogId),
      )
    : new Set(pendingLinkIds);

  async function loadLog(logId: string) {
    if (loadedLogs[logId]) return;
    const full = await logsApi.get(logId);
    setLoadedLogs((prev) => ({
      ...prev,
      [logId]: {
        id: full.id,
        name: full.name,
        columns: full.columns.map((c) => ({
          id: c.id,
          name: c.name,
          label: c.label,
          dataType: c.dataType,
        })),
      },
    }));
  }

  async function toggleLog(logId: string) {
    setError("");
    const isLinked = linkedIds.has(logId);
    if (isEdit) {
      const existingRel = relationships.find(
        (r) => r.sourceLogId === logId || r.targetLogId === logId,
      );
      if (isLinked && existingRel) {
        await relationshipsApi.delete(existingRel.id);
        onRelationshipRemoved(existingRel.id);
        onRemoveColumnsBySource(logId);
        if (selectedLogId === logId) setSelectedLogId(null);
      } else {
        try {
          const srcLog = allLogs.find((l) => l.id === currentLogId);
          const tgtLog = allLogs.find((l) => l.id === logId);
          const rel = await relationshipsApi.create({
            name: `${srcLog?.name ?? currentLogId} ↔ ${tgtLog?.name ?? logId}`,
            sourceLogId: currentLogId!,
            targetLogId: logId,
            relationshipType: "many_to_one",
          });
          onRelationshipAdded(rel);
          await loadLog(logId);
          setSelectedLogId(logId);
        } catch (err: unknown) {
          const msg = (err as { response?: { data?: { message?: string } } })
            ?.response?.data?.message;
          setError(msg ?? "Failed to link log");
        }
      }
    } else {
      if (isLinked) {
        onPendingChange(pendingLinkIds.filter((x) => x !== logId));
        onRemoveColumnsBySource(logId);
        if (selectedLogId === logId) setSelectedLogId(null);
      } else {
        onPendingChange([...pendingLinkIds, logId]);
        await loadLog(logId);
        setSelectedLogId(logId);
      }
    }
  }

  async function handleSelectLog(logId: string) {
    await loadLog(logId);
    setSelectedLogId((prev) => (prev === logId ? null : logId));
  }

  return (
    <div className="card" style={{ padding: "1rem", marginBottom: "1.25rem" }}>
      <p
        style={{
          margin: "0 0 0.75rem",
          fontSize: "0.72rem",
          fontWeight: 700,
          color: "var(--text-mid)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        Linked Logs
      </p>
      {error && (
        <div className="alert alert-error" style={{ marginBottom: "0.5rem" }}>
          {error}
        </div>
      )}

      {/* Horizontal log cards */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: linkedIds.size > 0 ? "1rem" : 0,
        }}
      >
        {others.map((l) => {
          const linked = linkedIds.has(l.id);
          const selected = selectedLogId === l.id;
          return (
            <div
              key={l.id}
              style={{
                display: "flex",
                alignItems: "stretch",
                border: `1px solid ${linked ? "var(--navy)" : "var(--border)"}`,
                background: linked ? "#eef2f4" : "var(--bg-header)",
              }}
            >
              <button
                onClick={() => toggleLog(l.id)}
                style={{
                  padding: "0.4rem 0.75rem",
                  border: "none",
                  borderRight: linked ? "1px solid var(--navy)" : "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: linked ? "var(--navy)" : "var(--text-mid)",
                  fontFamily: "inherit",
                }}
              >
                {linked ? "✓ " : ""}
                {l.name}
              </button>
              {linked && (
                <button
                  onClick={() => handleSelectLog(l.id)}
                  style={{
                    padding: "0.4rem 0.6rem",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "0.72rem",
                    color: selected ? "var(--navy)" : "var(--text-faint)",
                    fontFamily: "inherit",
                    fontWeight: 700,
                  }}
                  title="Pick columns to synchronize"
                >
                  {selected ? "▲" : "▼"} columns
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Column picker for selected log */}
      {selectedLogId &&
        linkedIds.has(selectedLogId) &&
        (() => {
          const logData = loadedLogs[selectedLogId];
          if (!logData)
            return (
              <p style={{ fontSize: "0.8rem", color: "var(--text-faint)" }}>
                Loading…
              </p>
            );
          return (
            <LinkedLogColumnPicker
              logData={logData}
              onAddColumn={(col) => onAddColumns([col])}
              onRemoveOneColumn={(colName) =>
                onRemoveOneColumn(selectedLogId, colName)
              }
            />
          );
        })()}
    </div>
  );
}

function LinkedLogColumnPicker({
  logData,
  onAddColumn,
  onRemoveOneColumn,
}: {
  logData: LogWithColumns;
  onAddColumn: (col: ColumnDraft) => void;
  onRemoveOneColumn: (colName: string) => void;
}) {
  const [added, setAdded] = useState<Set<string>>(new Set());

  function toggle(col: LogWithColumns["columns"][number]) {
    if (added.has(col.name)) {
      setAdded((prev) => {
        const s = new Set(prev);
        s.delete(col.name);
        return s;
      });
      onRemoveOneColumn(col.name);
    } else {
      setAdded((prev) => new Set([...prev, col.name]));
      onAddColumn({
        _key: crypto.randomUUID(),
        name: col.name,
        label: col.label,
        dataType: col.dataType,
        behavior: "synchronized",
        isRequired: false,
        isUnique: false,
        displayOrder: 0,
        typeConfig: {},
        behaviorConfig: { sourceLogId: logData.id },
        validationRules: {},
        _expanded: false,
      });
    }
  }

  return (
    <div
      style={{ borderTop: "1px solid var(--border)", paddingTop: "0.75rem" }}
    >
      <p
        style={{
          margin: "0 0 0.5rem",
          fontSize: "0.72rem",
          fontWeight: 700,
          color: "var(--text-mid)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        Columns from {logData.name} — tick to synchronize
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
        {logData.columns.map((col) => {
          const isAdded = added.has(col.name);
          return (
            <label
              key={col.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.35rem 0.65rem",
                border: `1px solid ${isAdded ? "var(--navy)" : "var(--border)"}`,
                background: isAdded ? "#eef2f4" : "#fff",
                cursor: "pointer",
                fontSize: "0.82rem",
              }}
            >
              <input
                type="checkbox"
                checked={isAdded}
                onChange={() => toggle(col)}
                style={{
                  accentColor: "var(--navy)",
                  width: 13,
                  height: 13,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontWeight: 600, color: "var(--text-dark)" }}>
                {col.label}
              </span>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.7rem",
                  color: "var(--text-faint)",
                }}
              >
                {col.dataType}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

// ─── Dropdown options editor ──────────────────────────────────────────────────

function DropdownOptionsEditor({
  options,
  onChange,
}: {
  options: Array<{ value: string; label: string }>;
  onChange: (opts: Array<{ value: string; label: string }>) => void;
}) {
  return (
    <div>
      <label style={lbl}>Options</label>
      <div style={{ display: "grid", gap: "0.4rem", marginBottom: "0.5rem" }}>
        {options.map((opt, i) => (
          <div
            key={i}
            style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}
          >
            <input
              value={opt.label}
              onChange={(e) =>
                onChange(
                  options.map((o, idx) =>
                    idx === i ? { ...o, label: e.target.value } : o,
                  ),
                )
              }
              placeholder="Label"
              className="inp"
            />
            <input
              value={opt.value}
              onChange={(e) =>
                onChange(
                  options.map((o, idx) =>
                    idx === i ? { ...o, value: e.target.value } : o,
                  ),
                )
              }
              placeholder="Value"
              className="inp"
              style={{ fontFamily: "monospace" }}
            />
            <button
              onClick={() => onChange(options.filter((_, idx) => idx !== i))}
              style={{
                padding: "0.3rem",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "var(--text-faint)",
                flexShrink: 0,
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#b91c1c")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color =
                  "var(--text-faint)")
              }
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => onChange([...options, { value: "", label: "" }])}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.3rem",
          fontSize: "0.78rem",
          color: "var(--navy)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          fontWeight: 700,
          padding: 0,
        }}
      >
        <Plus size={12} /> Add option
      </button>
    </div>
  );
}

// ─── Preview ──────────────────────────────────────────────────────────────────

function LogPreview({
  name,
  columns,
}: {
  name: string;
  columns: ColumnDraft[];
}) {
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div className="card-header">
        <span className="card-title">{name || "Untitled Log"}</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="drt-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col._key}>
                  {col.label || (
                    <em
                      style={{
                        fontStyle: "italic",
                        color: "var(--text-faint)",
                      }}
                    >
                      Untitled
                    </em>
                  )}
                  {col.isRequired && (
                    <span style={{ color: "#b91c1c", marginLeft: 2 }}>*</span>
                  )}
                  <div
                    style={{
                      fontWeight: 400,
                      textTransform: "none",
                      letterSpacing: 0,
                      color: "var(--text-faint)",
                      marginTop: 1,
                    }}
                  >
                    {col.dataType}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {columns.map((col) => (
                <td
                  key={col._key}
                  style={{
                    color: "var(--text-faint)",
                    fontStyle: "italic",
                    fontSize: "0.78rem",
                  }}
                >
                  {col.behavior === "synchronized"
                    ? "⟳ synchronized"
                    : col.behavior === "calculated"
                      ? "= calculated"
                      : "enter value…"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
