import React, { useState, useCallback, useRef, useMemo } from "react";
import * as XLSX from "xlsx";
import {
  vetRow,
  greenbookSearch,
  parsePackSize,
  classifyGreenbookResult,
} from "../utils/vetEngine";

// ── Constants ─────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 50;
const CHUNK = 30;

const FLAG_CODE_META = {
  Fill: { label: "Fill", cls: "flag-fill", tip: "Empty required column" },
  Brand: { label: "Brand", cls: "flag-brand", tip: "Brand not stated" },
  "Inc. T": {
    label: "Inc.T",
    cls: "flag-inc-t",
    tip: "Total quantity mismatch",
  },
  Unit: { label: "Unit", cls: "flag-unit", tip: "Missing unit of measurement" },
  Size: { label: "Size", cls: "flag-size", tip: "Pack size missing" },
  Typo: { label: "Typo", cls: "flag-typo", tip: "Typographical error" },
  "P.T": { label: "P.T", cls: "flag-pt", tip: "Incorrect pack type" },
  Rep: { label: "Rep", cls: "flag-rep", tip: "Repeated entry" },
  Ban: { label: "Ban", cls: "flag-ban", tip: "Banned product" },
  "N/A reg": {
    label: "N/A reg",
    cls: "flag-na",
    tip: "Should be registered, not global listed",
  },
  "Abbv.": {
    label: "Abbv.",
    cls: "flag-abbv",
    tip: "Abbreviated product name",
  },
  Itemise: {
    label: "Itemise",
    cls: "flag-itemise",
    tip: "SET/KIT — list variants individually",
  },
  Desc: { label: "Desc", cls: "flag-desc", tip: "Description inadequate" },
  Country: { label: "Country", cls: "flag-country", tip: "Country issue" },
  Clarify: {
    label: "Clarify",
    cls: "flag-clarify",
    tip: "Product name needs clarification",
  },
  Reg: {
    label: "Reg",
    cls: "flag-reg",
    tip: "Already registered — check Greenbook",
  },
  Label: {
    label: "Label",
    cls: "flag-fill",
    tip: "Submit label/sample for further clarification",
  },
  Hidden: {
    label: "Hidden",
    cls: "flag-typo",
    tip: "Formatting error — table columns overlap",
  },
  Quantity: {
    label: "Quantity",
    cls: "flag-inc-t",
    tip: "Product quantity exceeds allowed number",
  },
  OK: { label: "OK", cls: "flag-ok", tip: "Manually cleared — no issues" },
  Suspicious: {
    label: "Suspicious",
    cls: "flag-na",
    tip: "Keyword detected — check Greenbook",
  },
};

// ── Column header aliases from Excel ─────────────────────────────────────────
function parseRow(r, i) {
  return {
    _idx: i,
    sn: String(
      r["NO"] || r["S/N"] || r["SN"] || r["No."] || r["NO."] || i + 1,
    ).trim(),
    brand: String(
      r["BRAND OF PRODUCT"] || r["Brand"] || r["BRAND"] || "",
    ).trim(),
    name: String(
      r["NAME OF PRODUCT"] || r["Product Name"] || r["NAME"] || r["name"] || "",
    ).trim(),
    desc: String(
      r["DESCRIPTION OF PRODUCT"] ||
        r["Description"] ||
        r["DESCRIPTION"] ||
        r["DESC"] ||
        "",
    ).trim(),
    origin: String(
      r["ORIGIN OF PRODUCT"] ||
        r["Origin"] ||
        r["ORIGIN"] ||
        r["COUNTRY OF ORIGIN"] ||
        "",
    ).trim(),
    pack_size: String(
      r["PACK SIZE"] || r["Pack Size"] || r["PACKSIZE"] || "",
    ).trim(),
    pack_type: String(
      r["PACK TYPE"] || r["Pack Type"] || r["PACKTYPE"] || "",
    ).trim(),
    cartons:
      r["NO. OF CTN PER SHIPPING"] ??
      r["NO OF CTN PER SHIPPING"] ??
      r["NO OF CTN"] ??
      r["Cartons"] ??
      r["CARTONS"] ??
      "",
    total:
      r["TOTAL QUANTITY"] ??
      r["Total Quantity"] ??
      r["TOTAL QTY"] ??
      r["TOTAL"] ??
      "",
  };
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 14, color = "currentColor", style: s = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      display: "inline-block",
      verticalAlign: "middle",
      flexShrink: 0,
      ...s,
    }}
  >
    <path d={d} />
  </svg>
);
const IconX = (p) => <Icon {...p} d="M18 6L6 18M6 6l12 12" />;
const IconCheck = (p) => <Icon {...p} d="M20 6L9 17l-5-5" />;
const IconAlert = (p) => (
  <Icon
    {...p}
    d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
  />
);
const IconRobot = (p) => (
  <Icon
    {...p}
    d="M12 2a2 2 0 012 2v1h3a2 2 0 012 2v9a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h3V4a2 2 0 012-2zm-3 9a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2z"
  />
);
const IconUser = (p) => (
  <Icon
    {...p}
    d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
  />
);
const IconPlus = (p) => <Icon {...p} d="M12 5v14M5 12h14" />;
const IconCalc = (p) => (
  <Icon
    {...p}
    d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm4 4H7v2h2V7zm6 0h-2v2h2V7zM7 13h2v2H7v-2zm6 0h-2v2h2v-2z"
  />
);

// ── Flag Chip ──────────────────────────────────────────────────────────────────
function FlagChip({ code, onRemove }) {
  const meta = FLAG_CODE_META[code] || {
    label: code,
    cls: "flag-fill",
    tip: code,
  };
  return (
    <span
      className={`flag-chip ${meta.cls}`}
      title={meta.tip}
      style={{ display: "inline-flex", alignItems: "center", gap: 3 }}
    >
      {meta.label}
      {onRemove && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          title="Remove this flag"
          style={{
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            opacity: 0.7,
            marginLeft: 1,
          }}
        >
          <IconX size={9} color="currentColor" />
        </span>
      )}
    </span>
  );
}

// ── Panel section subheading ───────────────────────────────────────────────────
function PanelSection({ icon, title, children }) {
  return (
    <div
      style={{
        marginTop: "1rem",
        borderTop: "1px solid #e8ecf0",
        paddingTop: "0.85rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          marginBottom: "0.65rem",
        }}
      >
        {icon}
        <span
          style={{
            fontSize: "10px",
            fontWeight: 800,
            color: "#193441",
            textTransform: "uppercase",
            letterSpacing: "0.7px",
          }}
        >
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

// ── Detail Panel ──────────────────────────────────────────────────────────────
function DetailPanel({ result, onClose, onFlagsChange }) {
  const { row, flags } = result;
  const ps = parsePackSize(row.pack_size);
  const parsedTotal = Number(String(row.total).replace(/[,\s]/g, ""));
  const expected = ps
    ? ps.units * Number(String(row.cartons).replace(/[,\s]/g, ""))
    : null;
  const calcOk = expected !== null && parsedTotal === expected;

  const [selected, setSelected] = useState([]);
  const ALL_CODES = Object.keys(FLAG_CODE_META);

  const toggleCode = (code) =>
    setSelected((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );

  const addFlags = () => {
    if (!selected.length) return;
    const existing = new Set(flags.map((f) => f.code));
    const toAdd = selected
      .filter((c) => !existing.has(c))
      .map((c) => ({
        code: c,
        note: "Manually added by officer",
        manual: true,
      }));
    if (toAdd.length) onFlagsChange([...flags, ...toAdd]);
    setSelected([]);
  };

  const removeFlag = (idx) => onFlagsChange(flags.filter((_, i) => i !== idx));

  const Field = ({ label, value, mono = false }) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "130px 1fr",
        padding: "0.32rem 0",
        borderBottom: "1px solid #f0f2f5",
      }}
    >
      <span
        style={{
          fontSize: "11px",
          fontWeight: 600,
          color: "#7a8494",
          letterSpacing: "0.2px",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "12px",
          color: value ? "#1a202c" : "#c0c8d2",
          fontFamily: mono ? "monospace" : "inherit",
          fontStyle: value ? "normal" : "italic",
          wordBreak: "break-word",
        }}
      >
        {value || "—"}
      </span>
    </div>
  );

  return (
    <tr>
      <td colSpan={10} style={{ padding: 0, border: "none" }}>
        <div
          style={{
            margin: "0 0 2px 0",
            background: "white",
            borderLeft: `3px solid ${flags.length > 0 ? "#c53030" : "#276749"}`,
            borderBottom: "2px solid #e2e8f0",
            boxShadow: "0 4px 16px rgba(25,52,65,0.09)",
          }}
        >
          {/* ── Panel header ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.65rem 1.25rem",
              background: "#193441",
              color: "white",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  background: "rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {row.sn}
              </div>
              <div>
                <div
                  style={{ fontSize: "13px", fontWeight: 700, lineHeight: 1.3 }}
                >
                  {row.brand}
                </div>
                <div style={{ fontSize: "11px", opacity: 0.7 }}>
                  {row.name} · {row.desc}
                </div>
              </div>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}
            >
              {flags.length > 0 ? (
                <span
                  style={{
                    background: "#c53030",
                    color: "white",
                    fontSize: "10px",
                    fontWeight: 800,
                    padding: "2px 8px",
                  }}
                >
                  {flags.length} FLAG{flags.length > 1 ? "S" : ""}
                </span>
              ) : (
                <span
                  style={{
                    background: "#276749",
                    color: "white",
                    fontSize: "10px",
                    fontWeight: 800,
                    padding: "2px 8px",
                  }}
                >
                  CLEAN
                </span>
              )}
              <button
                onClick={onClose}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  cursor: "pointer",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconX size={13} color="white" />
              </button>
            </div>
          </div>

          <div style={{ padding: "1rem 1.25rem" }}>
            {/* ── Product fields ── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0 2.5rem",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    color: "#193441",
                    textTransform: "uppercase",
                    letterSpacing: "0.7px",
                    marginBottom: "0.4rem",
                  }}
                >
                  Product Information
                </div>
                <Field label="Brand" value={row.brand} />
                <Field label="Product Name" value={row.name} />
                <Field label="Description" value={row.desc} />
                <Field label="Origin" value={row.origin} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    color: "#193441",
                    textTransform: "uppercase",
                    letterSpacing: "0.7px",
                    marginBottom: "0.4rem",
                  }}
                >
                  Packaging &amp; Quantity
                </div>
                <Field label="Pack Size" value={row.pack_size} mono />
                <Field label="Pack Type" value={row.pack_type} />
                <Field label="No. of Cartons" value={String(row.cartons)} />
                <Field label="Total Quantity" value={String(row.total)} />
              </div>
            </div>

            {/* ── Calculation ── */}
            {ps && (
              <div
                style={{
                  marginTop: "0.85rem",
                  padding: "0.55rem 0.85rem",
                  background: calcOk ? "#f0faf4" : "#fff5f5",
                  border: `1px solid ${calcOk ? "#c6f6d5" : "#fed7d7"}`,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <IconCalc size={13} color={calcOk ? "#276749" : "#c53030"} />
                <span
                  style={{
                    fontSize: "12px",
                    color: calcOk ? "#276749" : "#c53030",
                    fontWeight: 600,
                  }}
                >
                  {ps.units} × {row.cartons} = {expected?.toLocaleString()}
                  {calcOk ? (
                    <span style={{ fontWeight: 400, marginLeft: 8 }}>
                      matches total
                    </span>
                  ) : (
                    <span style={{ fontWeight: 400, marginLeft: 8 }}>
                      listed as {String(row.total)} — mismatch
                    </span>
                  )}
                </span>
                {calcOk ? (
                  <IconCheck
                    size={13}
                    color="#276749"
                    style={{ marginLeft: "auto" }}
                  />
                ) : (
                  <IconAlert
                    size={13}
                    color="#c53030"
                    style={{ marginLeft: "auto" }}
                  />
                )}
              </div>
            )}

            {/* ── Current flags ── */}
            <PanelSection
              icon={
                <IconAlert
                  size={13}
                  color={flags.length > 0 ? "#c53030" : "#276749"}
                />
              }
              title={
                flags.length > 0
                  ? `Current Flags (${flags.length}) — click × to remove`
                  : "Current Flags"
              }
            >
              {flags.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "12px",
                    color: "#276749",
                    fontWeight: 600,
                  }}
                >
                  <IconCheck size={13} color="#276749" /> No flags on this row
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.35rem",
                  }}
                >
                  {flags.map((f, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        padding: "0.4rem 0.75rem",
                        background: "#f8fafc",
                        border: "1px solid #e8ecf0",
                      }}
                    >
                      <FlagChip code={f.code} onRemove={() => removeFlag(i)} />
                      <span
                        style={{ fontSize: "11px", color: "#555", flex: 1 }}
                      >
                        {f.note}
                      </span>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          fontSize: "10px",
                          color: "#aaa",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {f.manual ? (
                          <>
                            <IconUser size={10} color="#aaa" /> Officer
                          </>
                        ) : (
                          <>
                            <IconRobot size={10} color="#aaa" /> Auto
                          </>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </PanelSection>

            {/* ── Add flags ── */}
            <PanelSection
              icon={<IconPlus size={13} color="#193441" />}
              title="Add Flag(s)"
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "5px",
                  marginBottom: "0.7rem",
                }}
              >
                {ALL_CODES.map((code) => {
                  const meta = FLAG_CODE_META[code];
                  const isSelected = selected.includes(code);
                  const alreadySet = flags.some((f) => f.code === code);
                  return (
                    <button
                      key={code}
                      onClick={() => !alreadySet && toggleCode(code)}
                      title={alreadySet ? "Already flagged" : meta.tip}
                      style={{
                        padding: "3px 9px",
                        fontSize: "10px",
                        fontWeight: 700,
                        border: `1.5px solid ${isSelected ? "#193441" : alreadySet ? "#eaecef" : "#d0d7de"}`,
                        background: isSelected
                          ? "#193441"
                          : alreadySet
                            ? "#f5f6f7"
                            : "white",
                        color: isSelected
                          ? "white"
                          : alreadySet
                            ? "#bbb"
                            : "#333",
                        cursor: alreadySet ? "not-allowed" : "pointer",
                        transition: "all 0.1s",
                      }}
                    >
                      {code}
                    </button>
                  );
                })}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <button
                  className="btn"
                  onClick={addFlags}
                  disabled={selected.length === 0}
                  style={{
                    fontSize: "11px",
                    padding: "0.4rem 1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <IconPlus size={11} color="white" />
                  {selected.length > 0
                    ? `Add ${selected.length} flag${selected.length > 1 ? "s" : ""}`
                    : "Add selected flags"}
                </button>
                {selected.length > 0 && (
                  <>
                    <button
                      className="btn btn-ghost"
                      onClick={() => setSelected([])}
                      style={{ fontSize: "11px", padding: "0.4rem 0.85rem" }}
                    >
                      Clear
                    </button>
                    <span style={{ fontSize: "11px", color: "#888" }}>
                      Selected: {selected.join(", ")}
                    </span>
                  </>
                )}
              </div>
            </PanelSection>
          </div>
        </div>
      </td>
    </tr>
  );
}

// ── Results table ──────────────────────────────────────────────────────────────
function ResultsTable({ results, showOnlyFlagged, onFlagsChange }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(null);
  const tableRef = useRef(null);

  const filtered = useMemo(() => {
    let base = showOnlyFlagged
      ? results.filter((r) => r.flags.length > 0)
      : results;
    if (!query.trim()) return base;
    const q = query.toLowerCase().trim();
    return base.filter(
      ({ row, flags }) =>
        (row.brand + row.name + row.desc + row.origin)
          .toLowerCase()
          .includes(q) ||
        flags.some(
          (f) =>
            f.code.toLowerCase().includes(q) ||
            f.note.toLowerCase().includes(q),
        ),
    );
  }, [results, query, showOnlyFlagged]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const scrollTop = () => {
    const y =
      (tableRef.current?.getBoundingClientRect().top ?? 0) +
      window.scrollY -
      80;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const handlePage = (p) => {
    setPage(p);
    setExpanded(null);
    scrollTop();
  };
  const handleQuery = (v) => {
    setQuery(v);
    setPage(1);
    setExpanded(null);
  };

  return (
    <div ref={tableRef}>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "0.75rem",
          alignItems: "center",
        }}
      >
        <input
          className="search-input"
          style={{ maxWidth: 320 }}
          placeholder="Search brand, name, description, flag code…"
          value={query}
          onChange={(e) => handleQuery(e.target.value)}
        />
        <span style={{ fontSize: "11px", color: "#888", whiteSpace: "nowrap" }}>
          {filtered.length.toLocaleString()} row
          {filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="results-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Brand</th>
              <th>Product Name</th>
              <th>Description</th>
              <th>Origin</th>
              <th>Pack Size</th>
              <th>Pack Type</th>
              <th style={{ textAlign: "right" }}>Cartons</th>
              <th style={{ textAlign: "right" }}>Total Qty</th>
              <th>Flags</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(({ row, flags }, i) => {
              const absIdx = (page - 1) * ITEMS_PER_PAGE + i;
              const isExpanded = expanded === absIdx;
              const hasFlaw = flags.length > 0;
              return (
                <React.Fragment key={absIdx}>
                  <tr
                    onClick={() => setExpanded(isExpanded ? null : absIdx)}
                    style={{
                      cursor: "pointer",
                      background: hasFlaw ? "#fffbeb" : "white",
                    }}
                  >
                    <td style={{ color: "#888", fontSize: "11px" }}>
                      {row.sn}
                    </td>
                    <td
                      style={{
                        fontWeight: 500,
                        maxWidth: 120,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.brand}
                    </td>
                    <td
                      style={{
                        maxWidth: 160,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.name}
                    </td>
                    <td style={{ color: "#555" }}>{row.desc}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{row.origin}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{row.pack_size}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{row.pack_type}</td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      {row.cartons}
                    </td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      {row.total?.toLocaleString?.() ?? row.total}
                    </td>
                    <td>
                      {flags.length === 0 ? (
                        <span className="flag-chip flag-ok">✓ OK</span>
                      ) : (
                        flags.map((f, fi) => (
                          <FlagChip key={fi} code={f.code} />
                        ))
                      )}
                    </td>
                  </tr>
                  {isExpanded && (
                    <DetailPanel
                      result={{ row, flags }}
                      onClose={() => setExpanded(null)}
                      onFlagsChange={(newFlags) => {
                        // Find the absolute index in the full results array
                        const absResultIdx = results.findIndex(
                          (r) => r.row._idx === row._idx,
                        );
                        if (absResultIdx !== -1)
                          onFlagsChange(absResultIdx, newFlags);
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
            {paginated.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "#888",
                  }}
                >
                  No results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pag-btn"
            onClick={() => handlePage(1)}
            disabled={page === 1}
          >
            «
          </button>
          <button
            className="pag-btn"
            onClick={() => handlePage(page - 1)}
            disabled={page === 1}
          >
            ‹
          </button>
          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
            const p = Math.max(1, Math.min(totalPages - 6, page - 3)) + i;
            if (p < 1 || p > totalPages) return null;
            return (
              <button
                key={p}
                className={`pag-btn ${page === p ? "active" : ""}`}
                onClick={() => handlePage(p)}
              >
                {p}
              </button>
            );
          })}
          <button
            className="pag-btn"
            onClick={() => handlePage(page + 1)}
            disabled={page === totalPages}
          >
            ›
          </button>
          <button
            className="pag-btn"
            onClick={() => handlePage(totalPages)}
            disabled={page === totalPages}
          >
            »
          </button>
          <span
            style={{ fontSize: "11px", color: "#888", marginLeft: "0.5rem" }}
          >
            Page {page} of {totalPages} · {filtered.length.toLocaleString()}{" "}
            rows
          </span>
        </div>
      )}
    </div>
  );
}

// ── Summary analytics ──────────────────────────────────────────────────────────
function Summary({ results }) {
  const flagCounts = useMemo(() => {
    const map = {};
    results.forEach(({ flags }) =>
      flags.forEach(({ code }) => {
        map[code] = (map[code] || 0) + 1;
      }),
    );
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [results]);

  const totalRows = results.length;
  const flaggedRows = results.filter((r) => r.flags.length > 0).length;
  const cleanRows = totalRows - flaggedRows;
  const totalFlags = results.reduce((s, r) => s + r.flags.length, 0);

  const COLORS = [
    "#193441",
    "#c53030",
    "#d97706",
    "#276749",
    "#6b46c1",
    "#2b6cb0",
    "#c17f24",
    "#2d6a4f",
    "#b7410e",
    "#1a365d",
  ];

  return (
    <div>
      <div className="stat-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="stat-card">
          <div className="stat-val">{totalRows.toLocaleString()}</div>
          <div className="stat-lbl">Total Rows</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-val">{flaggedRows.toLocaleString()}</div>
          <div className="stat-lbl">Flagged Rows</div>
        </div>
        <div className="stat-card ok">
          <div className="stat-val">{cleanRows.toLocaleString()}</div>
          <div className="stat-lbl">Clean Rows</div>
        </div>
        <div className="stat-card warn">
          <div className="stat-val">{totalFlags.toLocaleString()}</div>
          <div className="stat-lbl">Total Flags</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">
            {totalRows ? Math.round((cleanRows / totalRows) * 100) : 0}%
          </div>
          <div className="stat-lbl">Pass Rate</div>
        </div>
      </div>

      <p className="section-title">Flag Frequency</p>
      <div style={{ maxWidth: 480 }}>
        {flagCounts.map(([code, count], i) => {
          const meta = FLAG_CODE_META[code] || { label: code };
          const pct = totalFlags ? ((count / totalFlags) * 100).toFixed(1) : 0;
          return (
            <div key={code} style={{ marginBottom: "0.6rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "3px",
                }}
              >
                <span
                  style={{ fontSize: "12px", fontWeight: 600, color: "#333" }}
                >
                  <FlagChip code={code} /> {meta.label || code}
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#888",
                      fontWeight: 400,
                      marginLeft: 8,
                    }}
                  >
                    {FLAG_CODE_META[code]?.tip}
                  </span>
                </span>
                <span style={{ fontSize: "12px", color: "#555" }}>
                  {count}{" "}
                  <span
                    style={{
                      color: COLORS[i % COLORS.length],
                      fontWeight: 700,
                    }}
                  >
                    ({pct}%)
                  </span>
                </span>
              </div>
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{
                    width: `${(count / (flagCounts[0]?.[1] || 1)) * 100}%`,
                    background: COLORS[i % COLORS.length],
                  }}
                />
              </div>
            </div>
          );
        })}
        {flagCounts.length === 0 && (
          <p style={{ color: "#276749", fontWeight: 600 }}>
            🎉 No flags — all rows passed.
          </p>
        )}
      </div>

      {/* Per-brand breakdown */}
      {results.length > 0 &&
        (() => {
          const brandMap = {};
          results.forEach(({ row, flags }) => {
            const b = row.brand || "Unknown";
            if (!brandMap[b]) brandMap[b] = { total: 0, flagged: 0 };
            brandMap[b].total++;
            if (flags.length > 0) brandMap[b].flagged++;
          });
          const brands = Object.entries(brandMap).sort(
            (a, b) => b[1].flagged - a[1].flagged,
          );
          return (
            <div style={{ marginTop: "2rem" }}>
              <p className="section-title">Brand Breakdown</p>
              <div style={{ overflowX: "auto" }}>
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Brand</th>
                      <th style={{ textAlign: "right" }}>Total Rows</th>
                      <th style={{ textAlign: "right" }}>Flagged</th>
                      <th style={{ textAlign: "right" }}>Clean</th>
                      <th style={{ textAlign: "right" }}>Pass Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brands.map(([brand, s]) => (
                      <tr key={brand}>
                        <td style={{ fontWeight: 500 }}>{brand}</td>
                        <td style={{ textAlign: "right" }}>{s.total}</td>
                        <td
                          style={{
                            textAlign: "right",
                            color: s.flagged > 0 ? "#c53030" : "#276749",
                          }}
                        >
                          {s.flagged}
                        </td>
                        <td style={{ textAlign: "right", color: "#276749" }}>
                          {s.total - s.flagged}
                        </td>
                        <td
                          style={{
                            textAlign: "right",
                            fontWeight: 600,
                            color:
                              s.flagged === 0
                                ? "#276749"
                                : s.flagged === s.total
                                  ? "#c53030"
                                  : "#d97706",
                          }}
                        >
                          {Math.round(((s.total - s.flagged) / s.total) * 100)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}
    </div>
  );
}

// ── Greenbook Checker — batch check suspicious rows ───────────────────────────
function GreenbookChecker({ results, onFlagsChange }) {
  const suspicious = results
    .map((r, i) => ({ ...r, _absIdx: i }))
    .filter((r) => r.flags.some((f) => f.code === "Suspicious"));

  const [checkStatus, setCheckStatus] = useState({}); // absIdx → "idle"|"loading"|"done"|"cors"|"error"
  const [checkResults, setCheckResults] = useState({}); // absIdx → gbData
  const [running, setRunning] = useState(false);
  const cancelRef = useRef(false);

  const checkOne = async (absIdx, row) => {
    setCheckStatus((s) => ({ ...s, [absIdx]: "loading" }));
    try {
      const gb = await greenbookSearch(row.name);
      setCheckResults((s) => ({ ...s, [absIdx]: gb }));
      setCheckStatus((s) => ({ ...s, [absIdx]: "done" }));
      const classification = classifyGreenbookResult(gb);
      // Update flags: remove Suspicious, add N/A reg or Reg or nothing
      const result = results[absIdx];
      const newFlags = result.flags.filter((f) => f.code !== "Suspicious");
      if (classification === "na_reg") {
        newFlags.push({
          code: "N/A reg",
          note: "Confirmed via Greenbook — product is registered and not applicable for global listing",
          manual: false,
        });
      } else if (classification === "reg") {
        newFlags.push({
          code: "Reg",
          note: "Confirmed via Greenbook — product is already registered",
          manual: false,
        });
      }
      // If clean — Suspicious removed, no new flag added
      onFlagsChange(absIdx, newFlags);
    } catch (e) {
      const type =
        e.message.includes("CORS") || e.message.includes("fetch")
          ? "cors"
          : "error";
      setCheckStatus((s) => ({ ...s, [absIdx]: type }));
    }
  };

  const runAll = async () => {
    cancelRef.current = false;
    setRunning(true);
    for (const r of suspicious) {
      if (cancelRef.current) break;
      await checkOne(r._absIdx, r.row);
      // Small delay to avoid hammering the server
      await new Promise((res) => setTimeout(res, 300));
    }
    setRunning(false);
  };

  const cancel = () => {
    cancelRef.current = true;
    setRunning(false);
  };

  const StatusBadge = ({ idx }) => {
    const s = checkStatus[idx];
    if (!s || s === "idle") return null;
    if (s === "loading")
      return (
        <span style={{ fontSize: "10px", color: "#d97706", fontWeight: 600 }}>
          Checking…
        </span>
      );
    if (s === "cors")
      return (
        <span style={{ fontSize: "10px", color: "#c53030", fontWeight: 600 }}>
          CORS blocked
        </span>
      );
    if (s === "error")
      return (
        <span style={{ fontSize: "10px", color: "#c53030", fontWeight: 600 }}>
          Error
        </span>
      );
    if (s === "done") {
      const gb = checkResults[idx];
      const cls = classifyGreenbookResult(gb);
      if (cls === "na_reg")
        return (
          <span style={{ fontSize: "10px", color: "#c53030", fontWeight: 700 }}>
            N/A reg — registered product
          </span>
        );
      if (cls === "reg")
        return (
          <span style={{ fontSize: "10px", color: "#d97706", fontWeight: 700 }}>
            Reg — already registered
          </span>
        );
      return (
        <span style={{ fontSize: "10px", color: "#276749", fontWeight: 700 }}>
          Clean — not found in Greenbook
        </span>
      );
    }
    return null;
  };

  if (suspicious.length === 0) {
    return (
      <div style={{ padding: "1.5rem", textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            color: "#276749",
            fontWeight: 600,
            fontSize: "13px",
          }}
        >
          <IconCheck size={16} color="#276749" />
          No suspicious rows detected — keyword scan found nothing to check
        </div>
      </div>
    );
  }

  const done = Object.values(checkStatus).filter((s) => s === "done").length;
  const total = suspicious.length;

  return (
    <div>
      {/* Header */}
      <div
        style={{
          background: "#193441",
          color: "white",
          padding: "1rem 1.25rem",
          marginBottom: "1rem",
        }}
      >
        <h2
          style={{
            margin: "0 0 0.2rem 0",
            fontSize: "14px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Greenbook Checker
        </h2>
        <p style={{ margin: 0, fontSize: "12px", opacity: 0.75 }}>
          {total} suspicious row{total > 1 ? "s" : ""} detected by keyword scan
          — check against NAFDAC Greenbook to confirm N/A reg or Reg status
        </p>
      </div>

      {/* Progress */}
      {(running || done > 0) && (
        <div style={{ marginBottom: "1rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
              color: "#555",
              marginBottom: "4px",
            }}
          >
            <span>
              {done} of {total} checked
            </span>
            <span>{Math.round((done / total) * 100)}%</span>
          </div>
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${(done / total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button className="btn" onClick={runAll} disabled={running}>
          {running ? "Checking…" : `Check All ${total} Rows`}
        </button>
        {running && (
          <button className="btn btn-danger" onClick={cancel}>
            Cancel
          </button>
        )}
        {done > 0 && !running && (
          <span
            style={{ fontSize: "12px", color: "#555", alignSelf: "center" }}
          >
            {done} checked · {total - done} remaining
          </span>
        )}
      </div>

      {/* CORS warning */}
      {Object.values(checkStatus).some((s) => s === "cors") && (
        <div
          style={{
            background: "#fffbeb",
            border: "1px solid #f6e05e",
            padding: "0.75rem 1rem",
            fontSize: "12px",
            color: "#78350f",
            marginBottom: "1rem",
          }}
        >
          <strong>CORS restriction</strong> — browser is blocking requests to
          greenbook.nafdac.gov.ng. Deploy with a server-side proxy to enable
          batch checking. Individual lookups are available in the Greenbook
          Lookup tab.
        </div>
      )}

      {/* Suspicious rows table */}
      <div style={{ overflowX: "auto" }}>
        <table className="results-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Brand</th>
              <th>Product Name</th>
              <th>Description</th>
              <th>Suspicious Keyword</th>
              <th>Greenbook Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {suspicious.map(({ row, flags, _absIdx }) => {
              const suspFlag = flags.find((f) => f.code === "Suspicious");
              return (
                <tr key={_absIdx}>
                  <td style={{ color: "#888", fontSize: "11px" }}>{row.sn}</td>
                  <td style={{ fontWeight: 500 }}>{row.brand}</td>
                  <td>{row.name}</td>
                  <td style={{ color: "#555" }}>{row.desc}</td>
                  <td>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#d97706",
                        fontWeight: 600,
                      }}
                    >
                      {suspFlag?.note?.match(/"([^"]+)"/)?.[1] || "—"}
                    </span>
                  </td>
                  <td>
                    <StatusBadge idx={_absIdx} />
                  </td>
                  <td>
                    <button
                      className="btn"
                      onClick={() => checkOne(_absIdx, row)}
                      disabled={checkStatus[_absIdx] === "loading" || running}
                      style={{ fontSize: "10px", padding: "0.3rem 0.7rem" }}
                    >
                      {checkStatus[_absIdx] === "loading" ? "…" : "Check"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Greenbook Lookup tab ──────────────────────────────────────────────────────
function GreenbookLookup() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error | cors
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const search = async () => {
    if (!query.trim()) return;
    setStatus("loading");
    setResults(null);
    setError("");
    try {
      const data = await greenbookSearch(query.trim());
      setResults(data);
      setStatus("done");
    } catch (e) {
      if (
        e.message.includes("CORS") ||
        e.message.includes("non-JSON") ||
        e.message.includes("Failed to fetch")
      ) {
        setStatus("cors");
      } else {
        setError(e.message);
        setStatus("error");
      }
    }
  };

  return (
    <div>
      <div
        style={{
          background: "#193441",
          color: "white",
          padding: "1rem 1.25rem",
          marginBottom: "1.25rem",
        }}
      >
        <h2
          style={{
            margin: "0 0 0.25rem 0",
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          NAFDAC Greenbook Lookup
        </h2>
        <p style={{ margin: 0, fontSize: "12px", opacity: 0.75 }}>
          Check if a product is registered in the NAFDAC Greenbook (live query).
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          className="search-input"
          style={{ maxWidth: 380 }}
          placeholder="Enter product name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
        />
        <button
          className="btn"
          onClick={search}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Searching…" : "Search Greenbook"}
        </button>
      </div>

      {status === "cors" && (
        <div
          style={{
            background: "#fffbeb",
            border: "1px solid #f6e05e",
            padding: "1rem",
            fontSize: "12px",
            color: "#78350f",
          }}
        >
          <strong>CORS restriction</strong> — the browser is blocking direct
          queries to <code>greenbook.nafdac.gov.ng</code> from this origin. This
          is a browser security policy, not a Greenbook issue. To use live
          lookup:
          <ul style={{ marginTop: "0.5rem", lineHeight: 1.8 }}>
            <li>
              Open{" "}
              <a
                href="https://greenbook.nafdac.gov.ng"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#c17f24" }}
              >
                greenbook.nafdac.gov.ng
              </a>{" "}
              directly in a new tab
            </li>
            <li>
              Or deploy this app with a small server-side proxy (a single
              ~10-line function)
            </li>
          </ul>
        </div>
      )}

      {status === "error" && (
        <div
          style={{
            background: "#fff5f5",
            border: "1px solid #feb2b2",
            padding: "0.75rem",
            fontSize: "12px",
            color: "#9b1c1c",
          }}
        >
          Error: {error}
        </div>
      )}

      {status === "done" && results && (
        <div>
          <div
            style={{ fontSize: "12px", color: "#555", marginBottom: "0.75rem" }}
          >
            <strong
              style={{
                color: results.recordsFiltered > 0 ? "#c53030" : "#276749",
              }}
            >
              {results.recordsFiltered} result
              {results.recordsFiltered !== 1 ? "s" : ""} found
            </strong>{" "}
            in Greenbook
            {results.recordsFiltered > 0 && (
              <span
                style={{
                  marginLeft: 8,
                  background: "#fed7d7",
                  color: "#9b1c1c",
                  padding: "2px 8px",
                  fontSize: "10px",
                  fontWeight: 700,
                  borderRadius: 2,
                }}
              >
                REG FLAG — product may already be registered
              </span>
            )}
          </div>

          {results.data?.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>NRN</th>
                    <th>Form</th>
                    <th>Applicant</th>
                    <th>Approval Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.data.map((row, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 500 }}>{row.product_name}</td>
                      <td>
                        {row["product_category.name"] ||
                          row.product_category?.name}
                      </td>
                      <td style={{ fontFamily: "monospace", fontSize: "11px" }}>
                        {row.NAFDAC}
                      </td>
                      <td>{row["form.name"] || row.form?.name}</td>
                      <td>{row["applicant.name"] || row.applicant?.name}</td>
                      <td>{row.approval_date}</td>
                      <td>
                        <span
                          style={{
                            background:
                              row.status === "Active" ? "#c6f6d5" : "#fef3c7",
                            color:
                              row.status === "Active" ? "#1c4532" : "#78350f",
                            padding: "1px 7px",
                            fontSize: "10px",
                            fontWeight: 700,
                            borderRadius: 2,
                          }}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {results.data?.length === 0 && (
            <p style={{ color: "#276749", fontSize: "13px" }}>
              ✓ No Greenbook results — product appears not to be registered.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Export to Excel ────────────────────────────────────────────────────────────
function exportResults(results) {
  const data = results.map(({ row, flags }) => ({
    "S/N": row.sn,
    Brand: row.brand,
    "Product Name": row.name,
    Description: row.desc,
    Origin: row.origin,
    "Pack Size": row.pack_size,
    "Pack Type": row.pack_type,
    "No. of Cartons": row.cartons,
    "Total Quantity": row.total,
    "Flag Codes": flags.map((f) => f.code).join(", ") || "OK",
    "Flag Details":
      flags.map((f) => `${f.code}: ${f.note}`).join(" | ") || "No issues",
    Status: flags.length === 0 ? "PASS" : "FLAGGED",
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "GLSI Vetting Report");
  XLSX.writeFile(
    wb,
    `GLSI_Vetting_Report_${new Date().toISOString().slice(0, 10)}.xlsx`,
  );
}

// ── Main Vetter component ─────────────────────────────────────────────────────
export default function Vetter() {
  const [rows, setRows] = useState(null);
  const [parseError, setParseError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | running | done
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const fileInputRef = useRef(null);
  const cancelRef = useRef(false);

  // ── File parsing ──────────────────────────────────────────────────────────
  const processFile = (file) => {
    if (!file) return;
    setParseError("");
    setRows(null);
    setResults([]);
    setStatus("idle");
    setActiveTab(null);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];

        // Read as raw array-of-arrays first so we can find the real header row
        // regardless of title rows, merged cells, or blank rows at the top.
        const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

        // Find the row index whose cells contain the expected column headers
        const HEADER_SIGNALS = [
          "brand",
          "name of product",
          "description",
          "pack size",
          "pack type",
          "origin",
          "total quantity",
          "no. of ctn",
        ];
        let headerIdx = -1;
        for (let r = 0; r < Math.min(aoa.length, 10); r++) {
          const rowLow = aoa[r].map((c) => String(c).toLowerCase().trim());
          const matches = HEADER_SIGNALS.filter((sig) =>
            rowLow.some((cell) => cell.includes(sig)),
          );
          if (matches.length >= 3) {
            headerIdx = r;
            break;
          }
        }

        if (headerIdx === -1) {
          setParseError(
            "Could not find header row. Make sure your file contains columns like: BRAND OF PRODUCT, NAME OF PRODUCT, PACK SIZE, TOTAL QUANTITY.",
          );
          return;
        }

        // Build objects using the found header row
        const headers = aoa[headerIdx].map((c) => String(c).trim());
        const raw = aoa
          .slice(headerIdx + 1)
          .filter((row) => row.some((c) => String(c).trim() !== ""))
          .map((row) => {
            const obj = {};
            headers.forEach((h, i) => {
              obj[h] = row[i] ?? "";
            });
            return obj;
          });

        const parsed = raw
          .filter((r) => {
            // Skip rows where every cell is empty or the row is a sub-header repeat
            const brand = String(
              r["BRAND OF PRODUCT"] || r["Brand"] || r["BRAND"] || "",
            )
              .trim()
              .toLowerCase();
            return brand && brand !== "brand of product" && brand !== "brand";
          })
          .map(parseRow);

        if (parsed.length === 0) {
          setParseError(
            "No valid data rows found after header row. Check the file content.",
          );
          return;
        }
        setRows(parsed);
      } catch (e) {
        setParseError("Failed to parse file: " + e.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFilePick = (e) => processFile(e.target.files[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  // ── Run vetting ───────────────────────────────────────────────────────────
  const runVetting = useCallback(() => {
    if (!rows?.length) return;
    cancelRef.current = false;
    setStatus("running");
    setProgress(0);
    setResults([]);
    const total = rows.length;
    let i = 0;
    const acc = new Array(total);

    function processChunk() {
      if (cancelRef.current) {
        setStatus("idle");
        return;
      }
      const end = Math.min(i + CHUNK, total);
      // Vet each row — pass full rows array so Rep detection works across the whole set
      for (; i < end; i++) {
        acc[i] = { row: rows[i], flags: vetRow(rows[i], rows, i) };
      }
      setProgress(Math.round((i / total) * 100));
      if (i < total) {
        setTimeout(processChunk, 0);
      } else {
        setResults([...acc]);
        setStatus("done");
        setActiveTab("all");
      }
    }
    setTimeout(processChunk, 0);
  }, [rows]);

  const cancel = () => {
    cancelRef.current = true;
  };
  const reset = () => {
    setRows(null);
    setResults([]);
    setStatus("idle");
    setProgress(0);
    setActiveTab(null);
    setParseError("");
  };

  // ── Flag editing — officer can add/remove flags on any row ────────────────
  const handleFlagsChange = useCallback((resultIdx, newFlags) => {
    setResults((prev) => {
      const next = [...prev];
      next[resultIdx] = { ...next[resultIdx], flags: newFlags };
      return next;
    });
  }, []);

  // ── Tab counts ────────────────────────────────────────────────────────────
  const flaggedCount = results.filter((r) => r.flags.length > 0).length;
  const cleanCount = results.length - flaggedCount;

  return (
    <div
      style={{ maxWidth: "100%", margin: "0 auto", padding: "0.75rem 0.25rem" }}
    >
      {/* Page header */}
      <div style={{ marginBottom: "1.25rem" }}>
        <h1
          style={{
            margin: "0 0 0.2rem 0",
            fontSize: "18px",
            fontWeight: 800,
            color: "#193441",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Global Listing Vetter
        </h1>
        <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
          NAFDAC Global Listing Supermarket Inventory (GLSI) — automated vetting
          against 19-point checklist
        </p>
      </div>

      {/* Upload card */}
      {!rows && (
        <div className="card">
          <p className="section-title">Upload Inventory</p>
          <div
            className={`drop-zone${dragging ? " dragging" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              ref={fileInputRef}
              onChange={handleFilePick}
            />
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📂</div>
            <p
              style={{
                margin: "0 0 0.25rem 0",
                fontWeight: 600,
                color: "#193441",
                fontSize: "13px",
              }}
            >
              Drop your GLSI inventory Excel here
            </p>
            <p style={{ margin: 0, fontSize: "11px", color: "#888" }}>
              Accepts .xlsx · .xls · .csv · Click to browse
            </p>
          </div>
          {parseError && (
            <div
              style={{
                marginTop: "0.75rem",
                background: "#fff5f5",
                border: "1px solid #feb2b2",
                padding: "0.65rem",
                fontSize: "12px",
                color: "#9b1c1c",
              }}
            >
              {parseError}
            </div>
          )}
          <div
            style={{
              marginTop: "1rem",
              fontSize: "11px",
              color: "#888",
              lineHeight: 1.8,
            }}
          >
            <strong style={{ color: "#193441" }}>
              Expected columns (case-insensitive):
            </strong>
            <br />
            BRAND OF PRODUCT · NAME OF PRODUCT · DESCRIPTION OF PRODUCT · ORIGIN
            OF PRODUCT · PACK SIZE · PACK TYPE · NO. OF CTN PER SHIPPING · TOTAL
            QUANTITY
          </div>
        </div>
      )}

      {/* Loaded — ready to run */}
      {rows && status === "idle" && (
        <div className="card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 0.2rem 0",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#193441",
                }}
              >
                {rows.length.toLocaleString()} rows loaded
              </p>
              <p style={{ margin: 0, fontSize: "11px", color: "#888" }}>
                Ready to vet against the NAFDAC Global Listing checklist
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn" onClick={runVetting}>
                Run Vetting
              </button>
              <button className="btn btn-ghost" onClick={reset}>
                Upload Different File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Running */}
      {status === "running" && (
        <div className="card">
          <p
            style={{
              margin: "0 0 0.5rem 0",
              fontSize: "13px",
              fontWeight: 600,
              color: "#193441",
            }}
          >
            Vetting in progress… {progress}%
          </p>
          <div
            className="progress-container"
            style={{ marginBottom: "0.75rem" }}
          >
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <button className="btn btn-danger" onClick={cancel}>
            Cancel
          </button>
        </div>
      )}

      {/* Done — tabs */}
      {status === "done" && results.length > 0 && (
        <>
          {/* Action bar */}
          <div
            className="card"
            style={{ padding: "0.75rem 1rem", marginBottom: "0.75rem" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <div
                className="stat-grid"
                style={{
                  gap: "0.5rem",
                  marginBottom: 0,
                  gridTemplateColumns: "repeat(4, auto)",
                }}
              >
                <div
                  className="stat-card"
                  style={{ padding: "0.5rem 0.85rem" }}
                >
                  <div className="stat-val" style={{ fontSize: 18 }}>
                    {results.length}
                  </div>
                  <div className="stat-lbl">Total</div>
                </div>
                <div
                  className="stat-card danger"
                  style={{ padding: "0.5rem 0.85rem" }}
                >
                  <div className="stat-val" style={{ fontSize: 18 }}>
                    {flaggedCount}
                  </div>
                  <div className="stat-lbl">Flagged</div>
                </div>
                <div
                  className="stat-card ok"
                  style={{ padding: "0.5rem 0.85rem" }}
                >
                  <div className="stat-val" style={{ fontSize: 18 }}>
                    {cleanCount}
                  </div>
                  <div className="stat-lbl">Clean</div>
                </div>
                <div
                  className="stat-card warn"
                  style={{ padding: "0.5rem 0.85rem" }}
                >
                  <div className="stat-val" style={{ fontSize: 18 }}>
                    {results.reduce((s, r) => s + r.flags.length, 0)}
                  </div>
                  <div className="stat-lbl">Flags</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className="btn btn-ok"
                  onClick={() => exportResults(results)}
                >
                  Export Excel
                </button>
                <button className="btn btn-ghost" onClick={reset}>
                  New Upload
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="card" style={{ padding: "0 0 1rem 0" }}>
            <div className="tab-bar" style={{ padding: "0 1rem" }}>
              <button
                className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                All Rows <span className="tab-count">{results.length}</span>
              </button>
              <button
                className={`tab-btn ${activeTab === "flagged" ? "active" : ""}`}
                onClick={() => setActiveTab("flagged")}
              >
                Flagged <span className="tab-count">{flaggedCount}</span>
              </button>
              <button
                className={`tab-btn ${activeTab === "clean" ? "active" : ""}`}
                onClick={() => setActiveTab("clean")}
              >
                Clean <span className="tab-count">{cleanCount}</span>
              </button>
              <button
                className={`tab-btn ${activeTab === "summary" ? "active" : ""}`}
                onClick={() => setActiveTab("summary")}
              >
                Summary
              </button>
              <button
                className={`tab-btn ${activeTab === "greenbook" ? "active" : ""}`}
                onClick={() => setActiveTab("greenbook")}
              >
                Greenbook Lookup
              </button>
              <button
                className={`tab-btn ${activeTab === "suspicious" ? "active" : ""}`}
                onClick={() => setActiveTab("suspicious")}
              >
                Suspicious
                <span className="tab-count">
                  {
                    results.filter((r) =>
                      r.flags.some((f) => f.code === "Suspicious"),
                    ).length
                  }
                </span>
              </button>
            </div>

            <div style={{ padding: "1rem" }}>
              {activeTab === "all" && (
                <ResultsTable
                  results={results}
                  showOnlyFlagged={false}
                  onFlagsChange={handleFlagsChange}
                />
              )}
              {activeTab === "flagged" && (
                <ResultsTable
                  results={results}
                  showOnlyFlagged={true}
                  onFlagsChange={handleFlagsChange}
                />
              )}
              {activeTab === "clean" && (
                <ResultsTable
                  results={results.filter((r) => r.flags.length === 0)}
                  showOnlyFlagged={false}
                  onFlagsChange={handleFlagsChange}
                />
              )}
              {activeTab === "summary" && <Summary results={results} />}
              {activeTab === "greenbook" && <GreenbookLookup />}
              {activeTab === "suspicious" && (
                <GreenbookChecker
                  results={results}
                  onFlagsChange={handleFlagsChange}
                />
              )}
            </div>
          </div>
        </>
      )}

      {/* Greenbook accessible before upload too */}
      {status === "idle" && !rows && (
        <div className="card">
          <p className="section-title">Greenbook Lookup</p>
          <GreenbookLookup />
        </div>
      )}
    </div>
  );
}
