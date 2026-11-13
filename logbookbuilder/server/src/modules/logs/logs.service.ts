import { z } from "zod";
import { eq, and, ilike, count, asc } from "drizzle-orm";
import { db } from "../../db/index.js";
import { logDefinitions, logColumns } from "../../db/schema.js";
import { auditAsync } from "../../lib/audit.js";
import { parsePagination, buildPaginatedResult } from "../../lib/utils.js";
import { validateExpression } from "../../lib/expression.js";
import type { AuthContext } from "../../types/index.js";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const columnSchema = z.object({
  name: z.string().min(1).max(100).regex(/^[a-z0-9_]+$/, "Column name must be lowercase letters, numbers, and underscores only"),
  label: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  dataType: z.enum([
    "text", "long_text", "integer", "decimal", "date", "time", "datetime",
    "boolean", "dropdown", "multi_select", "user", "person", "reference",
    "calculated", "file", "image", "signature",
  ]),
  behavior: z.enum(["independent", "linked", "synchronized", "calculated"]).default("independent"),
  isRequired: z.boolean().default(false),
  isUnique: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
  defaultValue: z.string().optional(),
  typeConfig: z.record(z.unknown()).default({}),
  behaviorConfig: z.record(z.unknown()).default({}),
  validationRules: z.record(z.unknown()).default({}),
});

export const createLogSchema = z.object({
  name: z.string().min(2).max(150),
  description: z.string().max(1000).optional(),
  icon: z.string().max(50).optional(),
  color: z.string().max(20).optional(),
  settings: z.record(z.unknown()).optional(),
  columns: z.array(columnSchema).min(1, "A log must have at least one column"),
});

export const updateLogSchema = z.object({
  name: z.string().min(2).max(150).optional(),
  description: z.string().max(1000).optional(),
  icon: z.string().max(50).optional(),
  color: z.string().max(20).optional(),
  status: z.enum(["draft", "active", "archived"]).optional(),
  settings: z.record(z.unknown()).optional(),
});

export const addColumnSchema = columnSchema;

export const updateColumnSchema = columnSchema.partial().omit({ name: true });

export const reorderColumnsSchema = z.object({
  order: z.array(z.object({ id: z.string(), displayOrder: z.number().int().min(0) })),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function validateColumnConfig(col: z.infer<typeof columnSchema>): string | null {
  if (col.dataType === "calculated") {
    const expr = (col.typeConfig as Record<string, unknown>).expression as string | undefined;
    if (!expr) return `Column "${col.label}": calculated fields require an expression in typeConfig`;
    const check = validateExpression(expr);
    if (!check.valid) return `Column "${col.label}": invalid expression — ${check.error}`;
  }
  if (col.dataType === "dropdown" || col.dataType === "multi_select") {
    const opts = (col.typeConfig as Record<string, unknown>).options;
    if (!Array.isArray(opts) || opts.length === 0) {
      return `Column "${col.label}": dropdown/multi_select fields require at least one option`;
    }
  }
  if (col.dataType === "reference") {
    const sourceLogId = (col.typeConfig as Record<string, unknown>).sourceLogId;
    if (!sourceLogId) return `Column "${col.label}": reference fields require a sourceLogId in typeConfig`;
  }
  return null;
}

// ─── Services ─────────────────────────────────────────────────────────────────

export async function listLogsService(auth: AuthContext, query: Record<string, unknown>) {
  const { page, limit, offset } = parsePagination(query);
  const search = String(query.search ?? "");
  const status = query.status as string | undefined;

  const conditions = [eq(logDefinitions.organizationId, auth.organizationId)];
  if (!auth.isAdmin && auth.divisionId) conditions.push(eq(logDefinitions.divisionId, auth.divisionId));
  if (search) conditions.push(ilike(logDefinitions.name, `%${search}%`));
  if (status) conditions.push(eq(logDefinitions.status, status as "draft" | "active" | "archived"));

  const where = and(...conditions);

  const [total, items] = await Promise.all([
    db.select({ count: count() }).from(logDefinitions).where(where),
    db.query.logDefinitions.findMany({
      where,
      limit,
      offset,
      orderBy: (l, { asc }) => [asc(l.name)],
      with: { columns: { orderBy: (c, { asc }) => [asc(c.displayOrder)] } },
    }),
  ]);

  return buildPaginatedResult(items, total[0].count, page, limit);
}

export async function getLogService(auth: AuthContext, logId: string) {
  const log = await db.query.logDefinitions.findFirst({
    where: and(eq(logDefinitions.id, logId), eq(logDefinitions.organizationId, auth.organizationId)),
    with: {
      columns: { orderBy: (c, { asc }) => [asc(c.displayOrder)] },
      createdBy: true,
    },
  });
  if (!log) throw new Error("Log not found");
  return log;
}

export async function createLogService(
  auth: AuthContext,
  input: z.infer<typeof createLogSchema>
) {
  // Validate all column configs
  for (const col of input.columns) {
    const err = validateColumnConfig(col);
    if (err) throw new Error(err);
  }

  // Check for duplicate column names within the log
  const names = input.columns.map((c) => c.name);
  if (new Set(names).size !== names.length) throw new Error("Column names must be unique within a log");

  const [log] = await db.insert(logDefinitions).values({
    organizationId: auth.organizationId,
    divisionId: auth.divisionId ?? null,
    name: input.name,
    description: input.description,
    icon: input.icon,
    color: input.color,
    settings: input.settings ?? {},
    status: "draft",
    createdById: auth.userId,
    updatedById: auth.userId,
  }).returning();

  if (input.columns.length > 0) {
    await db.insert(logColumns).values(
      input.columns.map((col, i) => ({
        logDefinitionId: log.id,
        organizationId: auth.organizationId,
        name: col.name,
        label: col.label,
        description: col.description,
        dataType: col.dataType,
        behavior: col.behavior,
        isRequired: col.isRequired,
        isUnique: col.isUnique,
        displayOrder: col.displayOrder ?? i,
        defaultValue: col.defaultValue,
        typeConfig: col.typeConfig,
        behaviorConfig: col.behaviorConfig,
        validationRules: col.validationRules,
        createdById: auth.userId,
        updatedById: auth.userId,
      }))
    );
  }

  auditAsync({
    auth,
    eventType: "log_created",
    entityType: "log_definition",
    entityId: log.id,
    summary: `Log "${log.name}" created with ${input.columns.length} column(s)`,
    newState: { log, columnCount: input.columns.length },
  });

  return getLogService(auth, log.id);
}

export async function updateLogService(
  auth: AuthContext,
  logId: string,
  input: z.infer<typeof updateLogSchema>
) {
  const log = await db.query.logDefinitions.findFirst({
    where: and(eq(logDefinitions.id, logId), eq(logDefinitions.organizationId, auth.organizationId)),
  });
  if (!log) throw new Error("Log not found");

  if (input.status === "active" && log.status === "archived") {
    throw new Error("Archived logs cannot be re-activated directly");
  }

  const [updated] = await db.update(logDefinitions)
    .set({ ...input, updatedById: auth.userId, updatedAt: new Date() })
    .where(eq(logDefinitions.id, logId))
    .returning();

  auditAsync({
    auth,
    eventType: input.status === "active" ? "log_published" : input.status === "archived" ? "log_archived" : "log_updated",
    entityType: "log_definition",
    entityId: logId,
    summary: `Log "${log.name}" updated`,
    previousState: log,
    newState: updated,
  });

  return updated;
}

export async function addColumnService(
  auth: AuthContext,
  logId: string,
  input: z.infer<typeof addColumnSchema>
) {
  const log = await db.query.logDefinitions.findFirst({
    where: and(eq(logDefinitions.id, logId), eq(logDefinitions.organizationId, auth.organizationId)),
  });
  if (!log) throw new Error("Log not found");

  const err = validateColumnConfig(input);
  if (err) throw new Error(err);

  const existing = await db.query.logColumns.findFirst({
    where: and(eq(logColumns.logDefinitionId, logId), eq(logColumns.name, input.name)),
  });
  if (existing) throw new Error(`A column named "${input.name}" already exists in this log`);

  const [col] = await db.insert(logColumns).values({
    logDefinitionId: logId,
    organizationId: auth.organizationId,
    name: input.name,
    label: input.label,
    description: input.description,
    dataType: input.dataType,
    behavior: input.behavior,
    isRequired: input.isRequired,
    isUnique: input.isUnique,
    displayOrder: input.displayOrder,
    defaultValue: input.defaultValue,
    typeConfig: input.typeConfig,
    behaviorConfig: input.behaviorConfig,
    validationRules: input.validationRules,
    createdById: auth.userId,
    updatedById: auth.userId,
  }).returning();

  auditAsync({
    auth,
    eventType: "column_added",
    entityType: "log_column",
    entityId: col.id,
    summary: `Column "${col.label}" added to log "${log.name}"`,
    newState: col,
  });

  return col;
}

export async function updateColumnService(
  auth: AuthContext,
  logId: string,
  columnId: string,
  input: z.infer<typeof updateColumnSchema>
) {
  const col = await db.query.logColumns.findFirst({
    where: and(
      eq(logColumns.id, columnId),
      eq(logColumns.logDefinitionId, logId),
      eq(logColumns.organizationId, auth.organizationId)
    ),
  });
  if (!col) throw new Error("Column not found");

  if (input.dataType === "calculated" || col.dataType === "calculated") {
    const expr = ((input.typeConfig ?? col.typeConfig) as Record<string, unknown>).expression as string | undefined;
    if (expr) {
      const check = validateExpression(expr);
      if (!check.valid) throw new Error(`Invalid expression: ${check.error}`);
    }
  }

  const [updated] = await db.update(logColumns)
    .set({ ...input, updatedById: auth.userId, updatedAt: new Date() })
    .where(eq(logColumns.id, columnId))
    .returning();

  auditAsync({
    auth,
    eventType: "column_updated",
    entityType: "log_column",
    entityId: columnId,
    summary: `Column "${col.label}" updated`,
    previousState: col,
    newState: updated,
  });

  return updated;
}

export async function removeColumnService(auth: AuthContext, logId: string, columnId: string) {
  const col = await db.query.logColumns.findFirst({
    where: and(
      eq(logColumns.id, columnId),
      eq(logColumns.logDefinitionId, logId),
      eq(logColumns.organizationId, auth.organizationId)
    ),
  });
  if (!col) throw new Error("Column not found");
  if (col.isSystem) throw new Error("System columns cannot be removed");

  await db.delete(logColumns).where(eq(logColumns.id, columnId));

  auditAsync({
    auth,
    eventType: "column_removed",
    entityType: "log_column",
    entityId: columnId,
    summary: `Column "${col.label}" removed from log`,
    previousState: col,
  });
}

export async function reorderColumnsService(
  auth: AuthContext,
  logId: string,
  input: z.infer<typeof reorderColumnsSchema>
) {
  const log = await db.query.logDefinitions.findFirst({
    where: and(eq(logDefinitions.id, logId), eq(logDefinitions.organizationId, auth.organizationId)),
  });
  if (!log) throw new Error("Log not found");

  await Promise.all(
    input.order.map(({ id, displayOrder }) =>
      db.update(logColumns)
        .set({ displayOrder, updatedAt: new Date() })
        .where(and(eq(logColumns.id, id), eq(logColumns.logDefinitionId, logId)))
    )
  );

  auditAsync({
    auth,
    eventType: "columns_reordered",
    entityType: "log_definition",
    entityId: logId,
    summary: `Columns reordered in log "${log.name}"`,
  });
}
