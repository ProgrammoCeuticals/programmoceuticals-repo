/**
 * Unit tests — PackageIntegrity
 * spec §30, §49.
 *
 * Tests:
 *   + package checksum deterministic for same input
 *   + different inputs produce different checksums
 *   + total size sum correct
 *   + entries sorted by relativePath for determinism
 *   + manifest contains submissionUnitUuid and sequenceNumber
 *   + verifyFileChecksum returns true for correct data
 *   - verifyFileChecksum returns false for tampered data
 */

import {
  computePackageIntegrity,
  generatePackageManifest,
  verifyFileChecksum,
  type FileIntegrityEntry,
} from "../../../packages/ectd-publishing/src/integrity/package-integrity";
import { createHash } from "crypto";

function makeEntry(path: string, content: string): FileIntegrityEntry {
  const buf = Buffer.from(content, "utf-8");
  return {
    relativePath: path,
    checksum: createHash("sha256").update(buf).digest("hex"),
    checksumAlgorithm: "SHA-256",
    fileSize: buf.byteLength,
  };
}

describe("PackageIntegrity (spec §30)", () => {
  describe("computePackageIntegrity", () => {
    it("should be deterministic for identical input", () => {
      const entries = [
        makeEntry("submissionunit.xml", "<xml/>"),
        makeEntry("documents/doc1.pdf", "pdf-content"),
      ];
      const r1 = computePackageIntegrity(entries);
      const r2 = computePackageIntegrity(entries);
      expect(r1.packageChecksum).toBe(r2.packageChecksum);
    });

    it("should sort entries by relativePath for determinism", () => {
      const entriesUnsorted = [
        makeEntry("z-last.pdf", "z"),
        makeEntry("a-first.xml", "a"),
      ];
      const result = computePackageIntegrity(entriesUnsorted);
      expect(result.fileEntries[0]?.relativePath).toBe("a-first.xml");
      expect(result.fileEntries[1]?.relativePath).toBe("z-last.pdf");
    });

    it("should produce different checksums for different file sets", () => {
      const r1 = computePackageIntegrity([makeEntry("file.xml", "content-a")]);
      const r2 = computePackageIntegrity([makeEntry("file.xml", "content-b")]);
      expect(r1.packageChecksum).not.toBe(r2.packageChecksum);
    });

    it("should compute correct total size", () => {
      const entries = [
        makeEntry("a.xml", "hello"), // 5 bytes
        makeEntry("b.pdf", "world"), // 5 bytes
      ];
      const result = computePackageIntegrity(entries);
      expect(result.totalSizeBytes).toBe(10);
    });

    it("should report correct total file count", () => {
      const entries = [
        makeEntry("a", "1"),
        makeEntry("b", "2"),
        makeEntry("c", "3"),
      ];
      const result = computePackageIntegrity(entries);
      expect(result.totalFiles).toBe(3);
    });

    it("should handle empty file list", () => {
      const result = computePackageIntegrity([]);
      expect(result.totalFiles).toBe(0);
      expect(result.totalSizeBytes).toBe(0);
      expect(result.packageChecksum).toBeTruthy();
    });
  });

  describe("generatePackageManifest", () => {
    it("should include submissionUnitUuid and sequenceNumber", () => {
      const integrity = computePackageIntegrity([makeEntry("file.xml", "x")]);
      const manifest = generatePackageManifest(integrity, {
        submissionUnitUuid: "su-uuid-001",
        sequenceNumber: 3,
        generatedAt: "2024-01-01T00:00:00Z",
        generatorVersion: "0.1.0",
      });
      expect(manifest).toContain("su-uuid-001");
      expect(manifest).toContain("3");
    });

    it("should include package checksum in manifest", () => {
      const integrity = computePackageIntegrity([makeEntry("file.xml", "x")]);
      const manifest = generatePackageManifest(integrity, {
        submissionUnitUuid: "su-001",
        sequenceNumber: 1,
        generatedAt: "2024-01-01",
        generatorVersion: "0.1.0",
      });
      expect(manifest).toContain(integrity.packageChecksum);
    });

    it("should include a REGULATORY_GAP note", () => {
      const integrity = computePackageIntegrity([]);
      const manifest = generatePackageManifest(integrity, {
        submissionUnitUuid: "su-001",
        sequenceNumber: 1,
        generatedAt: "2024-01-01",
        generatorVersion: "0.1.0",
      });
      expect(manifest).toContain("REGULATORY_GAP");
    });
  });

  describe("verifyFileChecksum", () => {
    it("should return true for correct data", () => {
      const buf = Buffer.from("test content");
      const checksum = createHash("sha256").update(buf).digest("hex");
      expect(verifyFileChecksum(buf, checksum)).toBe(true);
    });

    it("should return false for tampered data", () => {
      const buf = Buffer.from("original");
      const checksum = createHash("sha256").update(buf).digest("hex");
      const tampered = Buffer.from("modified");
      expect(verifyFileChecksum(tampered, checksum)).toBe(false);
    });

    it("should be case-insensitive for checksum comparison", () => {
      const buf = Buffer.from("data");
      const checksum = createHash("sha256")
        .update(buf)
        .digest("hex")
        .toUpperCase();
      expect(verifyFileChecksum(buf, checksum)).toBe(true);
    });
  });
});
