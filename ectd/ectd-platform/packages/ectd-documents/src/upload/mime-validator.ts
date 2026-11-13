/**
 * MimeValidator — spec §16, §43.
 *
 * Upload pipeline step: MIME/magic-byte validation.
 * Validates the actual file content (magic bytes) against the declared
 * MIME type. A mismatch between declared and actual type is a security
 * concern and must block the upload.
 *
 * Spec §43: "MIME/magic-byte verification" is an explicit security requirement.
 *
 * REGULATORY_GAP: The definitive list of acceptable file formats for
 * eCTD v4.0 submission documents must be verified against the ICH eCTD
 * v4.0 Implementation Guide and applicable regional file format
 * specifications (e.g. FDA Technical Conformance Guide).
 * The allowed types below are a structural baseline only.
 */

export interface MimeValidationResult {
  valid: boolean;
  detectedMimeType: string | null;
  declaredMimeType: string;
  message?: string | undefined;
}

/**
 * Magic byte signatures for common eCTD document types.
 * Format: { mimeType: string, signatures: Buffer[] }
 *
 * REGULATORY_GAP: Confirm the full list of allowed formats against the
 * applicable eCTD file format specification before production use.
 */
const MAGIC_SIGNATURES: Array<{
  mimeType: string;
  magic: number[];
  offset: number;
}> = [
  // PDF — most common eCTD document type
  { mimeType: "application/pdf", magic: [0x25, 0x50, 0x44, 0x46], offset: 0 },

  // OOXML / Office Open XML (Word, Excel)
  { mimeType: "application/zip", magic: [0x50, 0x4b, 0x03, 0x04], offset: 0 },

  // XML
  { mimeType: "text/xml", magic: [0x3c, 0x3f, 0x78, 0x6d], offset: 0 }, // <?xm
  { mimeType: "application/xml", magic: [0x3c, 0x3f, 0x78, 0x6d], offset: 0 },

  // SAS transport (XPT) — clinical data format
  {
    mimeType: "application/octet-stream",
    magic: [0x48, 0x45, 0x41, 0x44],
    offset: 0,
  }, // HEAD

  // Plain text / CSV
  // No reliable magic bytes — accept by extension check only
];

/**
 * MIME types that are allowed in eCTD submissions.
 *
 * REGULATORY_GAP: This list must be validated against:
 *   - ICH eCTD v4.0 IG file format requirements
 *   - FDA Technical Conformance Guide (current version)
 *   - Regional file format specifications
 * Do not extend this list without an authoritative source.
 */
export const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "text/xml",
  "application/xml",
  "text/plain",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/octet-stream", // SAS XPT and other binary formats
]);

/**
 * Detect MIME type from magic bytes.
 * Returns null if the type cannot be determined from magic bytes.
 */
export function detectMimeFromMagicBytes(buffer: Buffer): string | null {
  for (const sig of MAGIC_SIGNATURES) {
    if (buffer.length < sig.offset + sig.magic.length) continue;
    const match = sig.magic.every((byte, i) => buffer[sig.offset + i] === byte);
    if (match) return sig.mimeType;
  }
  return null;
}

/**
 * Validate a file buffer against its declared MIME type.
 *
 * Rules:
 *   1. Declared MIME type must be in the allowed list.
 *   2. If magic bytes are detectable, actual type must be compatible with declared.
 *   3. Empty files are always rejected.
 */
export function validateMime(
  buffer: Buffer,
  declaredMimeType: string,
): MimeValidationResult {
  if (buffer.length === 0) {
    return {
      valid: false,
      detectedMimeType: null,
      declaredMimeType,
      message: "File is empty.",
    };
  }

  // Check declared type is allowed
  const normalizedDeclared = declaredMimeType
    .toLowerCase()
    .split(";")[0]!
    .trim();
  if (!ALLOWED_MIME_TYPES.has(normalizedDeclared)) {
    return {
      valid: false,
      detectedMimeType: null,
      declaredMimeType: normalizedDeclared,
      message:
        `MIME type "${normalizedDeclared}" is not permitted in eCTD submissions. ` +
        "REGULATORY_GAP: Verify allowed types against the applicable file format specification.",
    };
  }

  const detected = detectMimeFromMagicBytes(buffer);

  // If we detected a type and it conflicts with the declaration, block.
  if (detected !== null) {
    const compatible = isMimeCompatible(detected, normalizedDeclared);
    if (!compatible) {
      return {
        valid: false,
        detectedMimeType: detected,
        declaredMimeType: normalizedDeclared,
        message:
          `File magic bytes indicate "${detected}" but declared MIME type is "${normalizedDeclared}". ` +
          "Declared MIME type must match actual file content.",
      };
    }
  }

  return {
    valid: true,
    detectedMimeType: detected,
    declaredMimeType: normalizedDeclared,
  };
}

/**
 * Check if a detected MIME type is compatible with a declared one.
 * Handles the ZIP/OOXML case where OOXML files are ZIP archives.
 */
function isMimeCompatible(detected: string, declared: string): boolean {
  if (detected === declared) return true;

  // OOXML documents are ZIP archives
  if (
    detected === "application/zip" &&
    (declared.includes("officedocument") || declared.includes("ms-excel"))
  ) {
    return true;
  }

  // XML variants
  if (
    (detected === "text/xml" || detected === "application/xml") &&
    (declared === "text/xml" || declared === "application/xml")
  ) {
    return true;
  }

  return false;
}
