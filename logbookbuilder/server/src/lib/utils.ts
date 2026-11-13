import { db } from "../db/index.js";
import { logRecords } from "../db/schema.js";
import { eq, and, sql } from "drizzle-orm";

/**
 * Generates the next sequential record number for a log.
 * Format: <PREFIX>-<NNNNN>  e.g. "BMR-00001"
 * Prefix is derived from the log name initials (up to 4 chars, uppercase).
 */
export async function generateRecordNumber(
  logDefinitionId: string,
  logName: string,
  organizationId: string
): Promise<string> {
  const prefix = logName
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 4)
    .replace(/[^A-Z]/g, "X") || "LOG";

  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(logRecords)
    .where(
      and(
        eq(logRecords.logDefinitionId, logDefinitionId),
        eq(logRecords.organizationId, organizationId)
      )
    );

  const count = (result[0]?.count ?? 0) + 1;
  const padded = String(count).padStart(5, "0");
  return `${prefix}-${padded}`;
}

/**
 * Builds a paginated result object.
 */
export function buildPaginatedResult<T>(
  items: T[],
  total: number,
  page: number,
  limit: number
) {
  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Parses pagination query params with safe defaults.
 */
export function parsePagination(query: Record<string, unknown>) {
  const page = Math.max(1, parseInt(String(query.page ?? "1"), 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit ?? "25"), 10) || 25));
  return { page, limit, offset: (page - 1) * limit };
}

/**
 * Strips undefined keys from an object (useful for partial updates).
 */
export function stripUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
}
