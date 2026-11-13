/**
 * Unit tests — MimeValidator
 * spec §16, §43, §49.
 *
 * Tests cover:
 *   + PDF magic bytes correctly detected
 *   + allowed MIME type accepted
 *   - disallowed MIME type rejected
 *   - empty file rejected
 *   - magic byte mismatch (file says PDF but declared as XML) rejected
 *   + XML declared and detected accepted
 *   + OOXML (ZIP magic + OOXML declared) compatible
 *
 * REGULATORY_GAP: The definitive allowed MIME type list must be verified
 * against the ICH eCTD v4.0 file format specification and applicable
 * regional technical conformance guides before production use.
 */

import {
  validateMime,
  detectMimeFromMagicBytes,
  ALLOWED_MIME_TYPES,
} from "../../../packages/ectd-documents/src/upload/mime-validator";

// ── Synthetic buffers ────────────────────────────────────────────────────

const PDF_MAGIC = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]); // %PDF-1.7
const XML_MAGIC = Buffer.from([0x3c, 0x3f, 0x78, 0x6d, 0x6c, 0x20]); // <?xml
const ZIP_MAGIC = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00]); // PK..

function padBuffer(magic: Buffer, totalSize = 100): Buffer {
  const padding = Buffer.alloc(totalSize - magic.length);
  return Buffer.concat([magic, padding]);
}

// ── Tests ─────────────────────────────────────────────────────────────────

describe("MimeValidator (spec §16, §43)", () => {
  describe("detectMimeFromMagicBytes", () => {
    it("should detect PDF from magic bytes", () => {
      expect(detectMimeFromMagicBytes(padBuffer(PDF_MAGIC))).toBe(
        "application/pdf",
      );
    });

    it("should detect XML from magic bytes", () => {
      expect(detectMimeFromMagicBytes(padBuffer(XML_MAGIC))).toBe("text/xml");
    });

    it("should detect ZIP from magic bytes (covers OOXML)", () => {
      expect(detectMimeFromMagicBytes(padBuffer(ZIP_MAGIC))).toBe(
        "application/zip",
      );
    });

    it("should return null for unknown magic bytes", () => {
      const unknown = Buffer.from([0xde, 0xad, 0xbe, 0xef]);
      expect(detectMimeFromMagicBytes(padBuffer(unknown))).toBeNull();
    });

    it("should return null for empty buffer", () => {
      expect(detectMimeFromMagicBytes(Buffer.alloc(0))).toBeNull();
    });
  });

  describe("validateMime — positive cases", () => {
    it("should accept PDF file with application/pdf declared", () => {
      const result = validateMime(padBuffer(PDF_MAGIC), "application/pdf");
      expect(result.valid).toBe(true);
      expect(result.detectedMimeType).toBe("application/pdf");
    });

    it("should accept XML file with text/xml declared", () => {
      const result = validateMime(padBuffer(XML_MAGIC), "text/xml");
      expect(result.valid).toBe(true);
    });

    it("should accept XML file with application/xml declared", () => {
      const result = validateMime(padBuffer(XML_MAGIC), "application/xml");
      expect(result.valid).toBe(true);
    });

    it("should accept OOXML (Word) file — ZIP magic + OOXML MIME declared", () => {
      const result = validateMime(
        padBuffer(ZIP_MAGIC),
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      );
      expect(result.valid).toBe(true);
    });

    it("should accept files with unknown magic bytes if MIME type is allowed (e.g. plain text)", () => {
      const plainText = Buffer.from("This is a plain text document.");
      const result = validateMime(plainText, "text/plain");
      expect(result.valid).toBe(true);
    });
  });

  describe("validateMime — negative cases", () => {
    it("should reject empty file", () => {
      const result = validateMime(Buffer.alloc(0), "application/pdf");
      expect(result.valid).toBe(false);
      expect(result.message).toMatch(/empty/i);
    });

    it("should reject disallowed MIME type", () => {
      const result = validateMime(
        padBuffer(PDF_MAGIC),
        "application/x-executable",
      );
      expect(result.valid).toBe(false);
      expect(result.message).toMatch(/not permitted/i);
    });

    it("should reject file where magic bytes say PDF but declared as XML", () => {
      const result = validateMime(padBuffer(PDF_MAGIC), "text/xml");
      expect(result.valid).toBe(false);
      expect(result.message).toMatch(/magic bytes/i);
    });

    it("should reject file where magic bytes say XML but declared as PDF", () => {
      const result = validateMime(padBuffer(XML_MAGIC), "application/pdf");
      expect(result.valid).toBe(false);
    });

    it("MIME type check should be case-insensitive for declared type", () => {
      const result = validateMime(padBuffer(PDF_MAGIC), "Application/PDF");
      expect(result.valid).toBe(true);
    });

    it("should strip charset parameter from declared MIME type", () => {
      const plainText = Buffer.from("some text");
      const result = validateMime(plainText, "text/plain; charset=UTF-8");
      expect(result.valid).toBe(true);
    });
  });

  describe("ALLOWED_MIME_TYPES set", () => {
    it("should contain application/pdf", () => {
      expect(ALLOWED_MIME_TYPES.has("application/pdf")).toBe(true);
    });

    it("should contain text/xml and application/xml", () => {
      expect(ALLOWED_MIME_TYPES.has("text/xml")).toBe(true);
      expect(ALLOWED_MIME_TYPES.has("application/xml")).toBe(true);
    });

    it("should NOT contain executable types", () => {
      expect(ALLOWED_MIME_TYPES.has("application/x-executable")).toBe(false);
      expect(ALLOWED_MIME_TYPES.has("text/html")).toBe(false);
    });
  });
});
