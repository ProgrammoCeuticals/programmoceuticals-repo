import * as path from "path";
import { RegulatoryPackageType } from "../regulatory-package/regulatory-package-status";
import { IStructureValidator } from "./package-import.service";

/**
 * StructureValidator — validates the internal structure of a regulatory
 * package archive.
 *
 * Each package type has expected file patterns. The validator checks that
 * the archive contains the minimum required files.
 *
 * REGULATORY_GAP: Exact required file paths for ICH eCTD v4.0 packages
 * must be verified against the official ICH IG v1.7 and CV v1.0.3 package
 * manifests. The patterns below are structural expectations — they must be
 * cross-checked against actual downloaded ICH packages before activation.
 *
 * We do NOT parse the archive here because we do not want to execute
 * arbitrary code from an untrusted archive before checksum verification.
 * Checksum is verified first (step 1), then structure is validated (step 2).
 */

/**
 * Required file patterns per package type.
 * Each entry is a regex that at least one file path in the archive must match.
 *
 * REGULATORY_GAP: These patterns are initial structural expectations.
 * They must be validated against actual ICH package manifests before
 * production use.
 */
const REQUIRED_PATTERNS: Partial<Record<RegulatoryPackageType, RegExp[]>> = {
  IMPLEMENTATION_GUIDE: [
    /\.pdf$/i, // Implementation guide document
    /\.xsd$/i, // Schema file(s) included with IG package
  ],
  SCHEMA: [
    /\.xsd$/i, // At least one XSD schema file
  ],
  CONTROLLED_VOCABULARY: [
    /\.xml$/i, // Code list XML
  ],
  GENERICODE: [
    /\.gc$/i, // Genericode files
  ],
  CTD_STRUCTURE: [
    /\.xml$/i, // CTD structure definition
  ],
  VALIDATION_CRITERIA: [
    /\.xlsx?$/i, // Validation criteria spreadsheet (FDA pattern)
  ],
  REGIONAL_MODULE_1: [/\.pdf$/i],
  REGIONAL_CONTROLLED_VOCABULARY: [/\.xml$/i],
  REGIONAL_VALIDATION_CRITERIA: [/\.xlsx?$/i],
};

/**
 * ZipStructureValidator reads a zip archive and checks for required files.
 *
 * NOTE: This requires 'yauzl' or similar at the call site.
 * The validator interface accepts a pre-read Buffer so the archive is only
 * read once and checksum was already verified.
 *
 * For Phase 2, we provide a lenient implementation that lists entries and
 * checks them against patterns. Strict mode can be enabled per package type.
 */
export class ZipStructureValidator implements IStructureValidator {
  /**
   * Validate the structure of a zip archive Buffer.
   *
   * Uses a simple scan: extract all file paths from the central directory
   * without decompressing entries (faster and safer).
   */
  async validate(
    packageType: RegulatoryPackageType,
    archive: Buffer,
  ): Promise<{ valid: boolean; message?: string | undefined }> {
    // Extract file list from zip central directory
    let entries: string[];
    try {
      entries = this.listZipEntries(archive);
    } catch (err) {
      return {
        valid: false,
        message: `Cannot read archive as ZIP: ${String(err)}`,
      };
    }

    if (entries.length === 0) {
      return { valid: false, message: "Archive contains no files." };
    }

    const required = REQUIRED_PATTERNS[packageType];
    if (!required || required.length === 0) {
      // No structural requirements defined yet — flag as REGULATORY_GAP
      // but do not block import. The gap is recorded in metadata.
      return {
        valid: true,
        message:
          `REGULATORY_GAP: No structural requirements defined for package type ` +
          `${packageType}. Manual review required before activation.`,
      };
    }

    const missing: string[] = [];
    for (const pattern of required) {
      const found = entries.some((e) => pattern.test(path.basename(e)));
      if (!found) {
        missing.push(pattern.toString());
      }
    }

    if (missing.length > 0) {
      return {
        valid: false,
        message:
          `Archive is missing required file patterns: ${missing.join(", ")}. ` +
          `Found files: ${entries.slice(0, 10).join(", ")}${entries.length > 10 ? "..." : ""}.`,
      };
    }

    return { valid: true };
  }

  /**
   * Extract file paths from ZIP central directory without decompressing.
   * Reads only the ZIP end-of-central-directory record and central directory.
   */
  private listZipEntries(buffer: Buffer): string[] {
    const entries: string[] = [];

    // Locate end-of-central-directory record (EOCD) — signature 0x06054b50
    const EOCD_SIG = 0x06054b50;
    const CD_SIG = 0x02014b50;

    let eocdOffset = -1;
    for (let i = buffer.length - 22; i >= 0; i--) {
      if (buffer.readUInt32LE(i) === EOCD_SIG) {
        eocdOffset = i;
        break;
      }
    }

    if (eocdOffset === -1) {
      throw new Error("Not a valid ZIP file — EOCD signature not found.");
    }

    const cdOffset = buffer.readUInt32LE(eocdOffset + 16);
    const cdSize = buffer.readUInt32LE(eocdOffset + 12);
    let offset = cdOffset;

    while (offset < cdOffset + cdSize && offset + 46 <= buffer.length) {
      if (buffer.readUInt32LE(offset) !== CD_SIG) break;

      const filenameLen = buffer.readUInt16LE(offset + 28);
      const extraLen = buffer.readUInt16LE(offset + 30);
      const commentLen = buffer.readUInt16LE(offset + 32);
      const filename = buffer.toString(
        "utf8",
        offset + 46,
        offset + 46 + filenameLen,
      );

      entries.push(filename);
      offset += 46 + filenameLen + extraLen + commentLen;
    }

    return entries;
  }
}
