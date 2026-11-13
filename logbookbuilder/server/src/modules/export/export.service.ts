import { eq, and } from "drizzle-orm";
import { db } from "../../db/index.js";
import { logDefinitions, logRecords, logColumns } from "../../db/schema.js";
import { auditAsync } from "../../lib/audit.js";
import type { AuthContext } from "../../types/index.js";
import xlsx from "xlsx";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function fetchLogWithRecords(auth: AuthContext, logId: string) {
  const log = await db.query.logDefinitions.findFirst({
    where: and(eq(logDefinitions.id, logId), eq(logDefinitions.organizationId, auth.organizationId)),
    with: { columns: { orderBy: (c, { asc }) => [asc(c.displayOrder)] } },
  });
  if (!log) throw new Error("Log not found");

  const records = await db.query.logRecords.findMany({
    where: and(
      eq(logRecords.logDefinitionId, logId),
      eq(logRecords.organizationId, auth.organizationId),
      eq(logRecords.status, "active")
    ),
    orderBy: (r, { asc }) => [asc(r.createdAt)],
    with: {
      fieldValues: { with: { column: true } },
      createdBy: true,
    },
  });

  return { log, records };
}

function buildRows(log: Awaited<ReturnType<typeof fetchLogWithRecords>>["log"], records: Awaited<ReturnType<typeof fetchLogWithRecords>>["records"]) {
  const columns = log.columns;

  const headers = [
    "Record #",
    ...columns.map((c) => c.label),
    "Status",
    "Created By",
    "Created At",
  ];

  const rows = records.map((record) => {
    const data = record.data as Record<string, unknown>;
    const fvMap = new Map(record.fieldValues.map((fv) => [fv.columnId, fv.value]));

    const cells = columns.map((col) => {
      const fv = fvMap.get(col.id);
      const raw = fv ?? data[col.name];
      if (raw === null || raw === undefined) return "";
      if (Array.isArray(raw)) return raw.join(", ");
      return String(raw);
    });

    return [
      record.recordNumber,
      ...cells,
      record.status,
      record.createdBy?.name ?? "",
      new Date(record.createdAt).toISOString(),
    ];
  });

  return { headers, rows };
}

// ─── CSV ──────────────────────────────────────────────────────────────────────

export async function exportCsvService(auth: AuthContext, logId: string): Promise<Buffer> {
  const { log, records } = await fetchLogWithRecords(auth, logId);
  const { headers, rows } = buildRows(log, records);

  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = [
    headers.map(escape).join(","),
    ...rows.map((r) => r.map(escape).join(",")),
  ];

  auditAsync({
    auth,
    eventType: "log_exported",
    entityType: "log_definition",
    entityId: logId,
    summary: `Log "${log.name}" exported as CSV by ${auth.name}`,
  });

  return Buffer.from(lines.join("\n"), "utf-8");
}

// ─── Excel ────────────────────────────────────────────────────────────────────

export async function exportExcelService(auth: AuthContext, logId: string): Promise<Buffer> {
  const { log, records } = await fetchLogWithRecords(auth, logId);
  const { headers, rows } = buildRows(log, records);

  const wb = xlsx.utils.book_new();
  const wsData = [headers, ...rows];
  const ws = xlsx.utils.aoa_to_sheet(wsData);

  // Style header row bold
  const range = xlsx.utils.decode_range(ws["!ref"] ?? "A1");
  for (let c = range.s.c; c <= range.e.c; c++) {
    const cell = ws[xlsx.utils.encode_cell({ r: 0, c })];
    if (cell) cell.s = { font: { bold: true } };
  }

  // Auto column widths
  ws["!cols"] = headers.map((h) => ({ wch: Math.max(h.length + 2, 12) }));

  xlsx.utils.book_append_sheet(wb, ws, log.name.slice(0, 31));

  // Metadata sheet
  const metaWs = xlsx.utils.aoa_to_sheet([
    ["Log Name", log.name],
    ["Organization", auth.organizationId],
    ["Export Date", new Date().toISOString()],
    ["Total Records", records.length],
    ["Exported By", auth.name],
  ]);
  xlsx.utils.book_append_sheet(wb, metaWs, "Export Info");

  auditAsync({
    auth,
    eventType: "log_exported",
    entityType: "log_definition",
    entityId: logId,
    summary: `Log "${log.name}" exported as Excel by ${auth.name}`,
  });

  return xlsx.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
}

// ─── PDF ──────────────────────────────────────────────────────────────────────
// Pure HTML→PDF via a self-contained HTML string returned to the client.
// The client triggers window.print() or the browser's PDF save.
// This avoids a heavy PDF library dependency while producing a clean printable output.

export async function exportPdfHtmlService(auth: AuthContext, logId: string): Promise<string> {
  const { log, records } = await fetchLogWithRecords(auth, logId);
  const { headers, rows } = buildRows(log, records);

  const headerCells = headers.map((h) => `<th>${h}</th>`).join("");
  const bodyRows = rows.map((r) =>
    `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`
  ).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${log.name}</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 11px; margin: 20px; color: #111; }
  h1 { font-size: 16px; margin-bottom: 4px; }
  .meta { font-size: 10px; color: #555; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #1e40af; color: #fff; padding: 6px 8px; text-align: left; font-size: 10px; }
  td { padding: 5px 8px; border-bottom: 1px solid #e5e7eb; font-size: 10px; }
  tr:nth-child(even) td { background: #f9fafb; }
  @media print { body { margin: 0; } }
</style>
</head>
<body>
<h1>${log.name}</h1>
<div class="meta">
  Exported: ${new Date().toLocaleString()} &nbsp;|&nbsp;
  Records: ${records.length} &nbsp;|&nbsp;
  Exported by: ${auth.name}
</div>
<table>
  <thead><tr>${headerCells}</tr></thead>
  <tbody>${bodyRows}</tbody>
</table>
<script>window.onload = () => window.print();</script>
</body>
</html>`;

  auditAsync({
    auth,
    eventType: "log_exported",
    entityType: "log_definition",
    entityId: logId,
    summary: `Log "${log.name}" exported as PDF by ${auth.name}`,
  });

  return html;
}
