import { z } from "zod";
import { eq, and, count, desc, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import {
  logDefinitions, logColumns, logRecords, fieldValues,
  recordLinks, recordVersions, logRelationships, relationshipFieldMappings,
} from "../../db/schema.js";
import { auditAsync } from "../../lib/audit.js";
import { generateRecordNumber, parsePagination, buildPaginatedResult } from "../../lib/utils.js";
import { evaluateExpression } from "../../lib/expression.js";
import type { AuthContext, ValidationRules, CalculatedTypeConfig } from "../../types/index.js";
import type { LogColumn, LogRecord } from "../../db/schema.js";

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const createRecordSchema = z.object({
  data: z.record(z.unknown()),
  // For linked/reference fields: { columnId: referencedRecordId }
  links: z.record(z.string()).optional(),
});

export const updateRecordSchema = z.object({
  data: z.record(z.unknown()),
  links: z.record(z.string()).optional(),
});

export const correctRecordSchema = z.object({
  data: z.record(z.unknown()),
  links: z.record(z.string()).optional(),
  reason: z.string().min(1, "Correction reason is required"),
});

export const voidRecordSchema = z.object({
  reason: z.string().min(1, "Void reason is required"),
});

// ─── Validation ───────────────────────────────────────────────────────────────

function validateFieldValue(
  col: LogColumn,
  value: unknown,
  rules: ValidationRules
): string | null {
  if (col.isRequired && (value === null || value === undefined || value === "")) {
    return `"${col.label}" is required`;
  }
  if (value === null || value === undefined || value === "") return null;

  const str = String(value);

  if (col.dataType === "text" || col.dataType === "long_text") {
    if (rules.minLength && str.length < rules.minLength)
      return `"${col.label}" must be at least ${rules.minLength} characters`;
    if (rules.maxLength && str.length > rules.maxLength)
      return `"${col.label}" must be at most ${rules.maxLength} characters`;
    if (rules.pattern && !new RegExp(rules.pattern).test(str))
      return `"${col.label}" does not match the required format`;
  }

  if (col.dataType === "integer") {
    const n = parseInt(str, 10);
    if (isNaN(n)) return `"${col.label}" must be a whole number`;
    if (rules.min !== undefined && n < rules.min) return `"${col.label}" must be at least ${rules.min}`;
    if (rules.max !== undefined && n > rules.max) return `"${col.label}" must be at most ${rules.max}`;
  }

  if (col.dataType === "decimal") {
    const n = parseFloat(str);
    if (isNaN(n)) return `"${col.label}" must be a number`;
    if (rules.min !== undefined && n < rules.min) return `"${col.label}" must be at least ${rules.min}`;
    if (rules.max !== undefined && n > rules.max) return `"${col.label}" must be at most ${rules.max}`;
  }

  if (col.dataType === "dropdown") {
    const opts = ((col.typeConfig as Record<string, unknown>).options as Array<{ value: string }> | undefined) ?? [];
    const allowed = opts.map((o) => o.value);
    if (!allowed.includes(str)) return `"${col.label}" must be one of: ${allowed.join(", ")}`;
  }

  if (col.dataType === "multi_select") {
    const selected = Array.isArray(value) ? value : [value];
    const opts = ((col.typeConfig as Record<string, unknown>).options as Array<{ value: string }> | undefined) ?? [];
    const allowed = opts.map((o) => o.value);
    for (const s of selected) {
      if (!allowed.includes(String(s))) return `"${col.label}": "${s}" is not a valid option`;
    }
  }

  if (col.dataType === "date") {
    const d = new Date(str);
    if (isNaN(d.getTime())) return `"${col.label}" must be a valid date`;
    if (rules.minDate && d < new Date(rules.minDate)) return `"${col.label}" must be on or after ${rules.minDate}`;
    if (rules.maxDate && d > new Date(rules.maxDate)) return `"${col.label}" must be on or before ${rules.maxDate}`;
  }

  return null;
}

// ─── Synchronization resolver ─────────────────────────────────────────────────

async function resolveSynchronizedValues(
  logId: string,
  organizationId: string,
  columns: LogColumn[],
  links: Record<string, string>
): Promise<Map<string, { value: string | null; sourceRecordId: string; sourceColumnId: string; sourceLogId: string }>> {
  const resolved = new Map<string, { value: string | null; sourceRecordId: string; sourceColumnId: string; sourceLogId: string }>();

  const syncColumns = columns.filter((c) => c.behavior === "synchronized");
  if (syncColumns.length === 0) return resolved;

  // Read linked log IDs from the log's settings
  const log = await db.query.logDefinitions.findFirst({
    where: eq(logDefinitions.id, logId),
  });
  const linkedLogIds = ((log?.settings as Record<string, unknown>)?.linkedLogIds as string[]) ?? [];
  if (linkedLogIds.length === 0) return resolved;

  // For each linked log, find which record was selected (from the links map)
  // links is keyed by the linked column's id — find linked columns and match by targetLogId or just try all
  const linkedColumns = columns.filter((c) => c.behavior === "linked");

  for (const linkedLogId of linkedLogIds) {
    // The links map is keyed by either a linked column id OR the logId itself
    // Try all link values and verify which record belongs to this linkedLogId
    let linkedRecordId: string | undefined;
    // First check if logId itself is a key (log-level link with no linked column)
    if (links[linkedLogId]) {
      linkedRecordId = links[linkedLogId];
    } else {
      // Fall back: check each link value to see if it belongs to this log
      for (const candidate of Object.values(links)) {
        if (!candidate) continue;
        const rec = await db.query.logRecords.findFirst({
          where: and(eq(logRecords.id, candidate), eq(logRecords.logDefinitionId, linkedLogId), eq(logRecords.organizationId, organizationId)),
        });
        if (rec) { linkedRecordId = candidate; break; }
      }
    }
    if (!linkedRecordId) continue;

    const sourceRecord = await db.query.logRecords.findFirst({
      where: and(eq(logRecords.id, linkedRecordId), eq(logRecords.organizationId, organizationId)),
    });
    if (!sourceRecord) continue;

    const sourceData = sourceRecord.data as Record<string, unknown>;

    const sourceLogCols = await db.query.logColumns.findMany({
      where: eq(logColumns.logDefinitionId, linkedLogId),
    });
    const sourceColByName = new Map(sourceLogCols.map((c) => [c.name, c]));

    for (const syncCol of syncColumns) {
      if (resolved.has(syncCol.id)) continue;
      const sourceCol = sourceColByName.get(syncCol.name);
      if (!sourceCol) continue;
      const val = sourceData[syncCol.name];
      resolved.set(syncCol.id, {
        value: val !== undefined && val !== null ? String(val) : null,
        sourceRecordId: linkedRecordId,
        sourceColumnId: sourceCol.id,
        sourceLogId: linkedLogId,
      });
    }
  }

  return resolved;
}

// ─── Calculated field resolver ────────────────────────────────────────────────

function resolveCalculatedValues(
  columns: LogColumn[],
  data: Record<string, unknown>
): Map<string, number | null> {
  const calculated = new Map<string, number | null>();
  const calcColumns = columns.filter((c) => c.behavior === "calculated" || c.dataType === "calculated");

  for (const col of calcColumns) {
    const config = col.typeConfig as CalculatedTypeConfig;
    if (!config.expression) continue;

    // Build context from column names → values
    const context: Record<string, number | boolean | string | null> = {};
    for (const c of columns) {
      const val = data[c.name];
      context[c.name] = val !== undefined && val !== null ? Number(val) : 0;
    }

    const result = evaluateExpression(config.expression, context);
    calculated.set(col.id, result.error ? null : Number(result.value));
  }

  return calculated;
}

// ─── Services ─────────────────────────────────────────────────────────────────

export async function listRecordsService(
  auth: AuthContext,
  logId: string,
  query: Record<string, unknown>
) {
  const log = await db.query.logDefinitions.findFirst({
    where: and(eq(logDefinitions.id, logId), eq(logDefinitions.organizationId, auth.organizationId)),
  });
  if (!log) throw new Error("Log not found");

  const { page, limit, offset } = parsePagination(query);
  const status = (query.status as string) ?? "active";

  const where = and(
    eq(logRecords.logDefinitionId, logId),
    eq(logRecords.organizationId, auth.organizationId),
    eq(logRecords.status, status as "active" | "corrected" | "voided" | "archived")
  );

  const [total, items] = await Promise.all([
    db.select({ count: count() }).from(logRecords).where(where),
    db.query.logRecords.findMany({
      where,
      limit,
      offset,
      orderBy: (r, { desc }) => [desc(r.createdAt)],
      with: {
        fieldValues: { with: { column: true, sourceRecord: true, sourceColumn: true } },
      },
    }),
  ]);

  return buildPaginatedResult(items, total[0].count, page, limit);
}

export async function getRecordService(auth: AuthContext, logId: string, recordId: string) {
  const record = await db.query.logRecords.findFirst({
    where: and(
      eq(logRecords.id, recordId),
      eq(logRecords.logDefinitionId, logId),
      eq(logRecords.organizationId, auth.organizationId)
    ),
    with: {
      createdBy: true,
      fieldValues: {
        with: {
          column: true,
          sourceLog: true,
          sourceRecord: true,
          sourceColumn: true,
        },
      },
      outgoingLinks: {
        with: { referencedRecord: true, relationship: true },
      },
      incomingLinks: {
        with: { referencingRecord: true, relationship: true },
      },
      signatures: { with: { signedBy: true } },
      files: true,
    },
  });
  if (!record) throw new Error("Record not found");
  return record;
}

export async function getRecordLineageService(auth: AuthContext, logId: string, recordId: string) {
  const record = await db.query.logRecords.findFirst({
    where: and(
      eq(logRecords.id, recordId),
      eq(logRecords.logDefinitionId, logId),
      eq(logRecords.organizationId, auth.organizationId)
    ),
    with: {
      fieldValues: {
        with: {
          column: true,
          sourceLog: true,
          sourceRecord: { with: { logDefinition: true } },
          sourceColumn: true,
        },
      },
    },
  });
  if (!record) throw new Error("Record not found");

  const log = await db.query.logDefinitions.findFirst({
    where: eq(logDefinitions.id, logId),
    with: { columns: { orderBy: (c, { asc }) => [asc(c.displayOrder)] } },
  });

  return { record, log };
}

export async function getRecordHistoryService(auth: AuthContext, logId: string, recordId: string) {
  const record = await db.query.logRecords.findFirst({
    where: and(
      eq(logRecords.id, recordId),
      eq(logRecords.logDefinitionId, logId),
      eq(logRecords.organizationId, auth.organizationId)
    ),
  });
  if (!record) throw new Error("Record not found");

  const versions = await db.query.recordVersions.findMany({
    where: eq(recordVersions.recordId, recordId),
    orderBy: (v, { desc }) => [desc(v.version)],
    with: { changedBy: true },
  });

  return { record, versions };
}

export async function createRecordService(
  auth: AuthContext,
  logId: string,
  input: z.infer<typeof createRecordSchema>
) {
  const log = await db.query.logDefinitions.findFirst({
    where: and(eq(logDefinitions.id, logId), eq(logDefinitions.organizationId, auth.organizationId)),
    with: { columns: { orderBy: (c, { asc }) => [asc(c.displayOrder)] } },
  });
  if (!log) throw new Error("Log not found");
  if (log.status === "archived") throw new Error("Cannot add records to an archived log");

  const columns = log.columns;
  const data = input.data as Record<string, unknown>;
  const links = input.links ?? {};

  // Validate all independent fields
  const errors: string[] = [];
  for (const col of columns) {
    if (col.behavior === "synchronized" || col.behavior === "calculated") continue;
    if (col.dataType === "reference" || col.dataType === "file" || col.dataType === "image" || col.dataType === "signature") continue;

    const value = data[col.name];
    const err = validateFieldValue(col, value, col.validationRules as ValidationRules);
    if (err) errors.push(err);
  }
  if (errors.length > 0) throw new Error(errors.join("; "));

  // Resolve synchronized values
  const syncValues = await resolveSynchronizedValues(logId, auth.organizationId, columns, links);

  // Resolve calculated values (using independent + synced data)
  const fullData: Record<string, unknown> = { ...data };
  for (const [colId, sv] of syncValues) {
    const col = columns.find((c) => c.id === colId);
    if (col) fullData[col.name] = sv.value;
  }
  const calcValues = resolveCalculatedValues(columns, fullData);

  const recordNumber = await generateRecordNumber(logId, log.name, auth.organizationId);

  // Build the JSONB data payload (independent fields only)
  const now = new Date();
  const jsonbData: Record<string, unknown> = {
    _entry_date: now.toISOString().slice(0, 10),
    _entry_time: now.toTimeString().slice(0, 5),
  };
  for (const col of columns) {
    if (col.behavior === "independent" && col.dataType !== "file" && col.dataType !== "image" && col.dataType !== "signature") {
      jsonbData[col.name] = data[col.name] ?? col.defaultValue ?? null;
    }
  }

  const [record] = await db.insert(logRecords).values({
    logDefinitionId: logId,
    organizationId: auth.organizationId,
    recordNumber,
    data: jsonbData,
    createdById: auth.userId,
    updatedById: auth.userId,
  }).returning();

  // Insert field_values for synchronized fields
  const fvInserts = [];

  for (const [colId, sv] of syncValues) {
    fvInserts.push({
      recordId: record.id,
      columnId: colId,
      organizationId: auth.organizationId,
      value: sv.value,
      sourceLogId: sv.sourceLogId,
      sourceRecordId: sv.sourceRecordId,
      sourceColumnId: sv.sourceColumnId,
      snapshotValue: sv.value,
      snapshotAt: new Date(),
      createdById: auth.userId,
      updatedById: auth.userId,
    });
  }

  // Insert field_values for calculated fields
  for (const [colId, val] of calcValues) {
    fvInserts.push({
      recordId: record.id,
      columnId: colId,
      organizationId: auth.organizationId,
      value: val !== null ? String(val) : null,
      calculationMeta: { computedAt: new Date().toISOString() },
      createdById: auth.userId,
      updatedById: auth.userId,
    });
  }

  if (fvInserts.length > 0) {
    await db.insert(fieldValues).values(fvInserts);
  }

  // Insert record links for reference fields
  for (const [referencingColumnId, referencedRecordId] of Object.entries(links)) {
    const rel = await db.query.logRelationships.findFirst({
      where: eq(logRelationships.referencingColumnId, referencingColumnId),
    });
    if (!rel) continue;

    await db.insert(recordLinks).values({
      organizationId: auth.organizationId,
      relationshipId: rel.id,
      referencingRecordId: record.id,
      referencedRecordId,
      createdById: auth.userId,
    }).onConflictDoNothing();
  }

  // Create initial version snapshot
  await db.insert(recordVersions).values({
    recordId: record.id,
    organizationId: auth.organizationId,
    version: 1,
    data: jsonbData,
    fieldValuesSnapshot: Object.fromEntries([
      ...Array.from(syncValues.entries()).map(([id, v]) => [id, v]),
      ...Array.from(calcValues.entries()).map(([id, v]) => [id, v]),
    ]),
    changedById: auth.userId,
    changeReason: "Initial record creation",
  });

  auditAsync({
    auth,
    eventType: "record_created",
    entityType: "log_record",
    entityId: record.id,
    summary: `Record ${recordNumber} created in log "${log.name}"`,
    newState: { recordId: record.id, recordNumber, logId },
  });

  return getRecordService(auth, logId, record.id);
}

export async function updateRecordService(
  auth: AuthContext,
  logId: string,
  recordId: string,
  input: z.infer<typeof updateRecordSchema>
) {
  const record = await db.query.logRecords.findFirst({
    where: and(
      eq(logRecords.id, recordId),
      eq(logRecords.logDefinitionId, logId),
      eq(logRecords.organizationId, auth.organizationId)
    ),
  });
  if (!record) throw new Error("Record not found");
  if (record.status === "voided") throw new Error("Voided records cannot be updated");
  if (record.status === "archived") throw new Error("Archived records cannot be updated");

  const log = await db.query.logDefinitions.findFirst({
    where: eq(logDefinitions.id, logId),
    with: { columns: { orderBy: (c, { asc }) => [asc(c.displayOrder)] } },
  });
  if (!log) throw new Error("Log not found");

  const columns = log.columns;
  const data = input.data as Record<string, unknown>;
  const links = input.links ?? {};

  const errors: string[] = [];
  for (const col of columns) {
    if (col.behavior === "synchronized" || col.behavior === "calculated") continue;
    if (col.dataType === "reference" || col.dataType === "file" || col.dataType === "image" || col.dataType === "signature") continue;
    const value = data[col.name];
    const err = validateFieldValue(col, value, col.validationRules as ValidationRules);
    if (err) errors.push(err);
  }
  if (errors.length > 0) throw new Error(errors.join("; "));

  const syncValues = await resolveSynchronizedValues(logId, auth.organizationId, columns, links);
  const fullData: Record<string, unknown> = { ...data };
  for (const [colId, sv] of syncValues) {
    const col = columns.find((c) => c.id === colId);
    if (col) fullData[col.name] = sv.value;
  }
  const calcValues = resolveCalculatedValues(columns, fullData);

  const jsonbData: Record<string, unknown> = {};
  for (const col of columns) {
    if (col.behavior === "independent" && col.dataType !== "file" && col.dataType !== "image" && col.dataType !== "signature") {
      jsonbData[col.name] = data[col.name] ?? null;
    }
  }
  // Preserve original entry timestamps on update
  const existingData = record.data as Record<string, unknown>;
  if (existingData._entry_date) jsonbData._entry_date = existingData._entry_date;
  if (existingData._entry_time) jsonbData._entry_time = existingData._entry_time;

  const previousData = record.data;

  const [updated] = await db.update(logRecords)
    .set({ data: jsonbData, updatedById: auth.userId, updatedAt: new Date() })
    .where(eq(logRecords.id, recordId))
    .returning();

  // Update field_values for synchronized and calculated fields
  for (const [colId, sv] of syncValues) {
    await db.delete(fieldValues).where(and(eq(fieldValues.recordId, recordId), eq(fieldValues.columnId, colId)));
    await db.insert(fieldValues).values({
      recordId,
      columnId: colId,
      organizationId: auth.organizationId,
      value: sv.value,
      sourceLogId: sv.sourceLogId,
      sourceRecordId: sv.sourceRecordId,
      sourceColumnId: sv.sourceColumnId,
      snapshotValue: sv.value,
      snapshotAt: new Date(),
      createdById: auth.userId,
      updatedById: auth.userId,
    });
  }

  for (const [colId, val] of calcValues) {
    await db.delete(fieldValues).where(and(eq(fieldValues.recordId, recordId), eq(fieldValues.columnId, colId)));
    await db.insert(fieldValues).values({
      recordId,
      columnId: colId,
      organizationId: auth.organizationId,
      value: val !== null ? String(val) : null,
      calculationMeta: { computedAt: new Date().toISOString() },
      createdById: auth.userId,
      updatedById: auth.userId,
    });
  }

  // Get current version number
  const latestVersion = await db.query.recordVersions.findFirst({
    where: eq(recordVersions.recordId, recordId),
    orderBy: (v, { desc }) => [desc(v.version)],
  });
  const nextVersion = (latestVersion?.version ?? 0) + 1;

  await db.insert(recordVersions).values({
    recordId,
    organizationId: auth.organizationId,
    version: nextVersion,
    data: jsonbData,
    fieldValuesSnapshot: Object.fromEntries([
      ...Array.from(syncValues.entries()).map(([id, v]) => [id, v]),
      ...Array.from(calcValues.entries()).map(([id, v]) => [id, v]),
    ]),
    changedById: auth.userId,
    changeReason: "Record updated",
  });

  auditAsync({
    auth,
    eventType: "record_updated",
    entityType: "log_record",
    entityId: recordId,
    summary: `Record ${record.recordNumber} updated`,
    previousState: previousData,
    newState: jsonbData,
  });

  return getRecordService(auth, logId, recordId);
}

export async function correctRecordService(
  auth: AuthContext,
  logId: string,
  recordId: string,
  input: z.infer<typeof correctRecordSchema>
) {
  const original = await db.query.logRecords.findFirst({
    where: and(
      eq(logRecords.id, recordId),
      eq(logRecords.logDefinitionId, logId),
      eq(logRecords.organizationId, auth.organizationId)
    ),
  });
  if (!original) throw new Error("Record not found");
  if (original.status === "voided") throw new Error("Voided records cannot be corrected");

  const log = await db.query.logDefinitions.findFirst({
    where: eq(logDefinitions.id, logId),
    with: { columns: { orderBy: (c, { asc }) => [asc(c.displayOrder)] } },
  });
  if (!log) throw new Error("Log not found");

  const columns = log.columns;
  const data = input.data as Record<string, unknown>;
  const links = input.links ?? {};

  const errors: string[] = [];
  for (const col of columns) {
    if (col.behavior === "synchronized" || col.behavior === "calculated") continue;
    if (col.dataType === "reference" || col.dataType === "file" || col.dataType === "image" || col.dataType === "signature") continue;
    const value = data[col.name];
    const err = validateFieldValue(col, value, col.validationRules as ValidationRules);
    if (err) errors.push(err);
  }
  if (errors.length > 0) throw new Error(errors.join("; "));

  // Mark original as corrected
  await db.update(logRecords)
    .set({
      status: "corrected",
      correctedAt: new Date(),
      correctedById: auth.userId,
      correctionReason: input.reason,
      updatedAt: new Date(),
    })
    .where(eq(logRecords.id, recordId));

  // Create new active record as the correction
  const syncValues = await resolveSynchronizedValues(logId, auth.organizationId, columns, links);
  const fullData: Record<string, unknown> = { ...data };
  for (const [colId, sv] of syncValues) {
    const col = columns.find((c) => c.id === colId);
    if (col) fullData[col.name] = sv.value;
  }
  const calcValues = resolveCalculatedValues(columns, fullData);

  const correctionNow = new Date();
  const jsonbData: Record<string, unknown> = {
    _entry_date: correctionNow.toISOString().slice(0, 10),
    _entry_time: correctionNow.toTimeString().slice(0, 5),
  };
  for (const col of columns) {
    if (col.behavior === "independent" && col.dataType !== "file" && col.dataType !== "image" && col.dataType !== "signature") {
      jsonbData[col.name] = data[col.name] ?? null;
    }
  }

  const recordNumber = await generateRecordNumber(logId, log.name, auth.organizationId);

  const [corrected] = await db.insert(logRecords).values({
    logDefinitionId: logId,
    organizationId: auth.organizationId,
    recordNumber,
    data: jsonbData,
    correctedFromId: recordId,
    correctionReason: input.reason,
    createdById: auth.userId,
    updatedById: auth.userId,
  }).returning();

  const fvInserts = [];
  for (const [colId, sv] of syncValues) {
    fvInserts.push({
      recordId: corrected.id,
      columnId: colId,
      organizationId: auth.organizationId,
      value: sv.value,
      sourceLogId: sv.sourceLogId,
      sourceRecordId: sv.sourceRecordId,
      sourceColumnId: sv.sourceColumnId,
      snapshotValue: sv.value,
      snapshotAt: new Date(),
      createdById: auth.userId,
      updatedById: auth.userId,
    });
  }
  for (const [colId, val] of calcValues) {
    fvInserts.push({
      recordId: corrected.id,
      columnId: colId,
      organizationId: auth.organizationId,
      value: val !== null ? String(val) : null,
      calculationMeta: { computedAt: new Date().toISOString() },
      createdById: auth.userId,
      updatedById: auth.userId,
    });
  }
  if (fvInserts.length > 0) await db.insert(fieldValues).values(fvInserts);

  await db.insert(recordVersions).values({
    recordId: corrected.id,
    organizationId: auth.organizationId,
    version: 1,
    data: jsonbData,
    fieldValuesSnapshot: {},
    changedById: auth.userId,
    changeReason: `Correction of ${original.recordNumber}: ${input.reason}`,
  });

  auditAsync({
    auth,
    eventType: "record_corrected",
    entityType: "log_record",
    entityId: corrected.id,
    summary: `Record ${original.recordNumber} corrected → ${recordNumber}. Reason: ${input.reason}`,
    previousState: { recordId: original.id, data: original.data },
    newState: { recordId: corrected.id, data: jsonbData },
  });

  return getRecordService(auth, logId, corrected.id);
}

export async function voidRecordService(
  auth: AuthContext,
  logId: string,
  recordId: string,
  input: z.infer<typeof voidRecordSchema>
) {
  const record = await db.query.logRecords.findFirst({
    where: and(
      eq(logRecords.id, recordId),
      eq(logRecords.logDefinitionId, logId),
      eq(logRecords.organizationId, auth.organizationId)
    ),
  });
  if (!record) throw new Error("Record not found");
  if (record.status === "voided") throw new Error("Record is already voided");

  const [voided] = await db.update(logRecords)
    .set({
      status: "voided",
      voidedAt: new Date(),
      voidedById: auth.userId,
      voidReason: input.reason,
      updatedAt: new Date(),
    })
    .where(eq(logRecords.id, recordId))
    .returning();

  auditAsync({
    auth,
    eventType: "record_voided",
    entityType: "log_record",
    entityId: recordId,
    summary: `Record ${record.recordNumber} voided. Reason: ${input.reason}`,
    previousState: { status: record.status },
    newState: { status: "voided", voidReason: input.reason },
  });

  return voided;
}
