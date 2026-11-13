/**
 * CodeListImporter — imports code list values from regulatory package XML.
 *
 * Spec §20 — Controlled Vocabulary Engine:
 *   The system must store: package identity, code list, code list version,
 *   code, display name, definition, status, source/provenance.
 *
 *   Vocabulary source categories: ICH, REGIONAL, HL7, EXTERNAL, SENDER.
 *
 *   Do NOT convert the entire vocabulary system into static TypeScript enums.
 *   Enums may only be used for application-internal states where the value
 *   is not an externally controlled regulatory vocabulary.
 *
 * REGULATORY_GAP: The exact XML structure of ICH eCTD v4.0 Controlled
 * Vocabulary Package v1.0.3 code list files (including Genericode format)
 * must be verified against the official ICH CV package before this
 * parser produces reliable results.
 *
 * This importer handles the two formats typically found in ICH packages:
 *   1. Simple XML code lists (OID-based)
 *   2. OASIS Genericode (.gc) files
 */

export interface CodeListValueInput {
  code: string;
  displayName: string;
  definition?: string | undefined;
  status?: string | undefined;
  order?: number | undefined;
}

export interface CodeListInput {
  name: string;
  oid?: string | undefined;
  ownerType?: string | undefined;
  description?: string | undefined;
  version: string;
  values: CodeListValueInput[];
}

export interface ICodeListRepository {
  upsertCodeList(
    cvPackageId: string,
    list: Omit<CodeListInput, "values">,
  ): Promise<{ codeListId: string; codeListVersionId: string }>;

  bulkInsertValues(
    codeListVersionId: string,
    values: CodeListValueInput[],
  ): Promise<number>;
}

export interface ParseResult {
  codeLists: CodeListInput[];
  warnings: string[];
}

export class CodeListImporter {
  constructor(private readonly repo: ICodeListRepository) {}

  /**
   * Import all code lists from a regulatory archive into the database.
   * Safe to call multiple times (upsert semantics).
   *
   * @param cvPackageId  ControlledVocabularyPackage.id in the database
   * @param xmlBuffers   Map of filename -> Buffer for each XML/GC file in the archive
   */
  async importFromBuffers(
    cvPackageId: string,
    xmlBuffers: Map<string, Buffer>,
  ): Promise<{ imported: number; warnings: string[] }> {
    const allWarnings: string[] = [];
    let totalImported = 0;

    for (const [filename, buffer] of xmlBuffers) {
      const ext = filename.split(".").pop()?.toLowerCase();

      let parsed: ParseResult;
      if (ext === "gc") {
        parsed = this.parseGenericode(buffer, filename);
      } else if (ext === "xml") {
        parsed = this.parseXmlCodeList(buffer, filename);
      } else {
        allWarnings.push(`Skipping non-code-list file: ${filename}`);
        continue;
      }

      allWarnings.push(...parsed.warnings);

      for (const list of parsed.codeLists) {
        const { codeListVersionId } = await this.repo.upsertCodeList(
          cvPackageId,
          {
            name: list.name,
            oid: list.oid,
            ownerType: list.ownerType,
            description: list.description,
            version: list.version,
          },
        );

        const count = await this.repo.bulkInsertValues(
          codeListVersionId,
          list.values,
        );
        totalImported += count;
      }
    }

    return { imported: totalImported, warnings: allWarnings };
  }

  /**
   * Parse OASIS Genericode (.gc) format.
   *
   * REGULATORY_GAP: The exact element structure of ICH Genericode files must
   * be verified against the official CV package v1.0.3 before this parser
   * can be considered authoritative.
   *
   * Expected structure (typical OASIS Genericode):
   * <gc:CodeList>
   *   <Identification>
   *     <ShortName>ListName</ShortName>
   *     <Version>1.0</Version>
   *     <CanonicalUri>urn:oid:...</CanonicalUri>
   *   </Identification>
   *   <SimpleCodeList>
   *     <Row>
   *       <Value ColumnRef="code"><SimpleValue>CODE</SimpleValue></Value>
   *       <Value ColumnRef="displayName"><SimpleValue>Display</SimpleValue></Value>
   *     </Row>
   *   </SimpleCodeList>
   * </gc:CodeList>
   */
  private parseGenericode(buffer: Buffer, filename: string): ParseResult {
    const warnings: string[] = [];
    const xml = buffer.toString("utf-8");

    // Extract basic identification
    const shortName =
      this.extractText(xml, "ShortName") ?? filename.replace(/\.gc$/i, "");
    const version = this.extractText(xml, "Version") ?? "1.0";
    const oid = this.extractOid(xml);

    // Extract column references
    const columns = this.extractColumns(xml);
    const codeCol = this.findColumn(columns, ["code", "Code", "CODE"]);
    const nameCol = this.findColumn(columns, [
      "displayName",
      "name",
      "Name",
      "display",
    ]);
    const defCol = this.findColumn(columns, [
      "definition",
      "Definition",
      "desc",
      "description",
    ]);

    if (!codeCol) {
      warnings.push(
        `REGULATORY_GAP: Could not identify "code" column in Genericode file ${filename}. ` +
          `Available columns: ${columns.join(", ")}. Manual review required.`,
      );
      return { codeLists: [], warnings };
    }

    // Extract rows
    const values: CodeListValueInput[] = [];
    const rowRegex = /<Row>([\s\S]*?)<\/Row>/g;
    let rowMatch: RegExpExecArray | null;
    let order = 0;

    while ((rowMatch = rowRegex.exec(xml)) !== null) {
      const rowXml = rowMatch[1] ?? "";
      const code = this.extractColumnValue(rowXml, codeCol);
      if (!code) continue;

      values.push({
        code,
        displayName:
          (nameCol ? this.extractColumnValue(rowXml, nameCol) : null) ?? code,
        definition: defCol
          ? (this.extractColumnValue(rowXml, defCol) ?? undefined)
          : undefined,
        order: order++,
      });
    }

    if (values.length === 0) {
      warnings.push(`No rows extracted from Genericode file ${filename}.`);
    }

    return {
      codeLists: [{ name: shortName, oid, version, values }],
      warnings,
    };
  }

  /**
   * Parse simple XML code list format.
   *
   * REGULATORY_GAP: ICH may use a different XML structure than assumed here.
   * Must be verified against actual CV package files.
   */
  private parseXmlCodeList(buffer: Buffer, filename: string): ParseResult {
    const warnings: string[] = [];
    const xml = buffer.toString("utf-8");

    // Try to extract code list name from common patterns
    const listName =
      this.extractAttribute(xml, "name") ??
      this.extractText(xml, "ListName") ??
      filename.replace(/\.xml$/i, "");
    const oid = this.extractOid(xml);
    const version = this.extractText(xml, "Version") ?? "1.0";

    const values: CodeListValueInput[] = [];
    // Common patterns: <code value="X" displayName="Y"/> or <Code concept="X" displayName="Y"/>
    const codeRegex =
      /<(?:code|Code|item|Item|concept|Concept)\s+(?:[^>]*\s)?(?:code|value|concept)\s*=\s*["']([^"']+)["'][^>]*(?:displayName|display|name)\s*=\s*["']([^"']+)["'][^>]*\/?>/g;
    let match: RegExpExecArray | null;
    let order = 0;

    while ((match = codeRegex.exec(xml)) !== null) {
      values.push({
        code: match[1] ?? "",
        displayName: match[2] ?? match[1] ?? "",
        order: order++,
      });
    }

    if (values.length === 0) {
      warnings.push(
        `REGULATORY_GAP: No code values extracted from XML file ${filename}. ` +
          "XML structure may not match expected patterns. Manual review required.",
      );
    }

    return {
      codeLists: [{ name: listName, oid, version, values }],
      warnings,
    };
  }

  // ── XML parsing helpers ────────────────────────────────────────────────

  private extractText(xml: string, tag: string): string | null {
    const m = new RegExp(`<${tag}[^>]*>([^<]+)<\/${tag}>`).exec(xml);
    return m ? (m[1]?.trim() ?? null) : null;
  }

  private extractAttribute(xml: string, attr: string): string | null {
    const m = new RegExp(`${attr}\\s*=\\s*["']([^"']+)["']`).exec(xml);
    return m ? (m[1] ?? null) : null;
  }

  private extractOid(xml: string): string | undefined {
    const m =
      /urn:oid:([\d.]+)/.exec(xml) ?? /OID\s*=\s*["']([\d.]+)["']/.exec(xml);
    return m ? m[1] : undefined;
  }

  private extractColumns(xml: string): string[] {
    const cols: string[] = [];
    const colRegex = /<Column\s[^>]*Id\s*=\s*["']([^"']+)["'][^>]*>/g;
    let m: RegExpExecArray | null;
    while ((m = colRegex.exec(xml)) !== null) {
      if (m[1]) cols.push(m[1]);
    }
    return cols;
  }

  private findColumn(cols: string[], candidates: string[]): string | null {
    for (const c of candidates) {
      if (cols.includes(c)) return c;
    }
    return null;
  }

  private extractColumnValue(rowXml: string, columnRef: string): string | null {
    const pattern = new RegExp(
      `<Value[^>]*ColumnRef\\s*=\\s*["']${columnRef}["'][^>]*>\\s*<SimpleValue>([^<]*)<\\/SimpleValue>`,
    );
    const m = pattern.exec(rowXml);
    return m ? (m[1]?.trim() ?? null) : null;
  }
}
