/**
 * Unit tests — DocumentUploadPipeline (updated for malware-scanner enforcement)
 * spec §16, §43, §49, user requirement.
 *
 * All upload tests now inject a mock clean scanner because the pipeline
 * BLOCKS (fails with SCANNER_NOT_CONFIGURED) when no scanner is configured.
 * That enforcement is tested in tests/unit/regulatory-gaps/malware-scanner.spec.ts.
 *
 * Tests cover:
 *   + successful upload with clean scanner — all steps PASSED
 *   + malware scan step is PASSED (not SKIPPED)
 *   - empty file blocked at SIZE_VALIDATION
 *   - disallowed MIME type blocked at MIME_MAGIC_BYTE_VALIDATION
 *   - storage failure handled gracefully
 *   + content-addressable key — same file always produces same key
 */

import {
  DocumentUploadPipeline,
  UPLOAD_STEPS,
  buildStorageKey,
} from "../../../packages/ectd-documents/src/upload/upload-pipeline";
import {
  SCANNER_CLEAN,
  type MalwareScanner,
  type ScanResult,
} from "../../../packages/ectd-documents/src/upload/malware-scanner.interface";
import type { StorageService } from "../../../packages/shared/src/interfaces/storage.interface";

// ── Test doubles ─────────────────────────────────────────────────────────

function makeStorage(
  failOnPut = false,
): StorageService & { stored: Map<string, Buffer> } {
  const stored = new Map<string, Buffer>();
  return {
    stored,
    put: async (key: string, data: Buffer | NodeJS.ReadableStream) => {
      if (failOnPut) throw new Error("Storage unavailable");
      const buf = Buffer.isBuffer(data) ? data : Buffer.alloc(0);
      stored.set(key, buf);
      const { createHash } = await import("crypto");
      const checksum = createHash("sha256").update(buf).digest("hex");
      return { storageKey: key, checksum, size: buf.byteLength };
    },
    get: async () => {
      throw new Error("Not implemented in test");
    },
    delete: async () => {},
    exists: async (key: string) => stored.has(key),
  };
}

/** A scanner that always returns CLEAN — for use in upload success tests */
function makeCleanScanner(): MalwareScanner {
  return {
    isConfigured: () => true,
    scan: async (): Promise<ScanResult> => ({
      status: SCANNER_CLEAN,
      engineVersion: "mock-1.0",
      durationMs: 1,
    }),
  };
}

// PDF magic bytes — SYNTHETIC content
const VALID_PDF = Buffer.concat([
  Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]),
  Buffer.alloc(100),
]);

// ── Tests ─────────────────────────────────────────────────────────────────

describe("DocumentUploadPipeline (spec §16)", () => {
  // ── Positive: successful upload ──────────────────────────────────────
  describe("execute — success", () => {
    it("should complete all steps and return SUCCESS with storageKey and checksum", async () => {
      const pipeline = new DocumentUploadPipeline(
        makeStorage(),
        makeCleanScanner(),
      );

      const result = await pipeline.execute({
        buffer: VALID_PDF,
        originalFilename: "drug-product.pdf",
        declaredMimeType: "application/pdf",
      });

      expect(result.outcome).toBe("SUCCESS");
      expect(result.storageKey).toBeTruthy();
      expect(result.checksum).toMatch(/^[a-f0-9]{64}$/);
      expect(result.checksumAlgorithm).toBe("SHA-256");
      expect(result.fileSize).toBe(VALID_PDF.byteLength);
    });

    it("should mark MALWARE_SCAN step as PASSED (not SKIPPED) when scanner runs clean", async () => {
      const pipeline = new DocumentUploadPipeline(
        makeStorage(),
        makeCleanScanner(),
      );
      const result = await pipeline.execute({
        buffer: VALID_PDF,
        originalFilename: "test.pdf",
        declaredMimeType: "application/pdf",
      });

      const malwareStep = result.steps.find(
        (s) => s.name === UPLOAD_STEPS.MALWARE_SCAN,
      );
      expect(malwareStep).toBeDefined();
      expect(malwareStep!.status).toBe("PASSED");
      expect(malwareStep!.status).not.toBe("SKIPPED");
    });

    it("should store the file so it can be retrieved by key", async () => {
      const storage = makeStorage();
      const pipeline = new DocumentUploadPipeline(storage, makeCleanScanner());
      const result = await pipeline.execute({
        buffer: VALID_PDF,
        originalFilename: "immutable.pdf",
        declaredMimeType: "application/pdf",
      });

      expect(storage.stored.has(result.storageKey!)).toBe(true);
    });

    it("should produce the same storageKey for identical content (content-addressable)", async () => {
      const pipeline = new DocumentUploadPipeline(
        makeStorage(),
        makeCleanScanner(),
      );

      const r1 = await pipeline.execute({
        buffer: VALID_PDF,
        originalFilename: "file.pdf",
        declaredMimeType: "application/pdf",
      });
      const r2 = await pipeline.execute({
        buffer: VALID_PDF,
        originalFilename: "file.pdf",
        declaredMimeType: "application/pdf",
      });

      expect(r1.storageKey).toBe(r2.storageKey);
      expect(r1.checksum).toBe(r2.checksum);
    });
  });

  // ── Negative: empty file ─────────────────────────────────────────────
  describe("execute — empty file", () => {
    it("should return FAILED at SIZE_VALIDATION for empty buffer", async () => {
      const pipeline = new DocumentUploadPipeline(
        makeStorage(),
        makeCleanScanner(),
      );
      const result = await pipeline.execute({
        buffer: Buffer.alloc(0),
        originalFilename: "empty.pdf",
        declaredMimeType: "application/pdf",
      });

      expect(result.outcome).toBe("FAILED");
      const step = result.steps.find(
        (s) => s.name === UPLOAD_STEPS.SIZE_VALIDATION,
      );
      expect(step?.status).toBe("FAILED");
      expect(result.errorMessage).toMatch(/empty/i);
    });
  });

  // ── Negative: disallowed MIME ────────────────────────────────────────
  describe("execute — disallowed MIME type", () => {
    it("should return FAILED at MIME_MAGIC_BYTE_VALIDATION for disallowed type", async () => {
      const pipeline = new DocumentUploadPipeline(
        makeStorage(),
        makeCleanScanner(),
      );
      const result = await pipeline.execute({
        buffer: Buffer.from("#!/bin/bash\necho hello"),
        originalFilename: "script.sh",
        declaredMimeType: "application/x-sh",
      });

      expect(result.outcome).toBe("FAILED");
      const step = result.steps.find(
        (s) => s.name === UPLOAD_STEPS.MIME_VALIDATION,
      );
      expect(step?.status).toBe("FAILED");
      expect(result.errorMessage).toMatch(/not permitted/i);
    });
  });

  // ── Negative: file too large ─────────────────────────────────────────
  describe("execute — file too large", () => {
    it("should return FAILED at SIZE_VALIDATION when file exceeds maxSizeBytes", async () => {
      const pipeline = new DocumentUploadPipeline(
        makeStorage(),
        makeCleanScanner(),
      );
      const result = await pipeline.execute({
        buffer: Buffer.alloc(1000),
        originalFilename: "large.pdf",
        declaredMimeType: "application/pdf",
        maxSizeBytes: 100,
      });

      expect(result.outcome).toBe("FAILED");
      const step = result.steps.find(
        (s) => s.name === UPLOAD_STEPS.SIZE_VALIDATION,
      );
      expect(step?.status).toBe("FAILED");
      expect(result.errorMessage).toMatch(/exceeds maximum/i);
    });
  });

  // ── Negative: storage failure ────────────────────────────────────────
  describe("execute — storage failure", () => {
    it("should return FAILED gracefully when storage throws", async () => {
      const pipeline = new DocumentUploadPipeline(
        makeStorage(true),
        makeCleanScanner(),
      );
      const result = await pipeline.execute({
        buffer: VALID_PDF,
        originalFilename: "test.pdf",
        declaredMimeType: "application/pdf",
      });

      expect(result.outcome).toBe("FAILED");
      const step = result.steps.find((s) => s.name === UPLOAD_STEPS.STORE);
      expect(step?.status).toBe("FAILED");
      expect(result.errorMessage).toMatch(/store/i);
    });
  });
});

// ── buildStorageKey ──────────────────────────────────────────────────────

describe("buildStorageKey", () => {
  it("should include the checksum prefix for directory sharding", () => {
    const key = buildStorageKey("abcdef1234567890", "test.pdf");
    expect(key.startsWith("abcdef12/")).toBe(true);
  });

  it("should include the full checksum in the path", () => {
    const checksum = "a".repeat(64);
    const key = buildStorageKey(checksum, "test.pdf");
    expect(key).toContain(checksum);
  });

  it("should sanitize special characters from filename", () => {
    const key = buildStorageKey("a".repeat(64), "my file (v2).pdf");
    expect(key).not.toContain(" ");
    expect(key).not.toContain("(");
  });

  it("should truncate extremely long filenames", () => {
    const key = buildStorageKey("a".repeat(64), "x".repeat(500) + ".pdf");
    expect(key.split("/").pop()!.length).toBeLessThanOrEqual(200);
  });
});
