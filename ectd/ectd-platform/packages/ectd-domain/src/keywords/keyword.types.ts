/**
 * Keyword domain types — spec §19, §15.
 *
 * Keywords define the "context group" identity of a Context of Use.
 * Context group comparison must use normalizeContextGroup() — spec §15.
 *
 * REGULATORY_GAP: Keyword data types and allowed values are governed by
 * the applicable eCTD v4.0 controlled vocabulary. Do not invent keyword
 * codes — they must come from the CV package.
 */

export type KeywordDataType =
  | "STRING"
  | "CODE" // value must be from a code list
  | "DATE"
  | "INTEGER"
  | "BOOLEAN";

export interface KeywordDefinitionRecord {
  id: string;
  applicationId: string;
  code: string;
  name: string;
  description: string | null;
  dataType: KeywordDataType;
  allowedValues: unknown | null;
}

export interface ContextKeywordRecord {
  id: string;
  contextOfUseId: string;
  keywordDefinitionId: string;
  value: string;
}

/**
 * Validate a keyword value against its definition.
 * For CODE type, the value must be in the allowedValues list.
 *
 * REGULATORY_GAP: Full validation of CODE type keywords requires
 * the CV package to be imported and code list values loaded (Phase 2).
 */
export function validateKeywordValue(
  value: string,
  definition: KeywordDefinitionRecord,
): { valid: boolean; message?: string | undefined } {
  if (!value || value.trim() === "") {
    return { valid: false, message: "Keyword value must not be empty." };
  }

  if (definition.dataType === "INTEGER") {
    const n = Number(value);
    if (!Number.isInteger(n)) {
      return {
        valid: false,
        message: `Keyword "${definition.code}" requires an integer value, got: "${value}".`,
      };
    }
  }

  if (definition.dataType === "BOOLEAN") {
    if (value !== "true" && value !== "false") {
      return {
        valid: false,
        message: `Keyword "${definition.code}" requires "true" or "false", got: "${value}".`,
      };
    }
  }

  if (definition.dataType === "CODE" && definition.allowedValues) {
    const allowed = definition.allowedValues as string[];
    if (Array.isArray(allowed) && !allowed.includes(value)) {
      return {
        valid: false,
        message:
          `Keyword "${definition.code}" value "${value}" is not in the allowed list: ` +
          `[${allowed.join(", ")}].`,
      };
    }
  }

  return { valid: true };
}
