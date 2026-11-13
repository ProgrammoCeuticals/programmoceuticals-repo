/**
 * Unit tests — ChecksumService
 * spec §16, §30, §49.
 *
 * SHA-256 is the required checksum algorithm — spec §5.
 *
 * Tests:
 *   + computeChecksum returns correct hex and byte count
 *   + verifyChecksum returns true for matching content
 *   - verifyChecksum returns false for tampered content
 *   + same content always produces same checksum (deterministic)
 *   + different content produces different checksums
 */

import {
  computeChecksum,
  verifyChecksum,
  CHECKSUM_ALGORITHM,
} from "../../../packages/ectd-documents/src/checksum/checksum.service";
import { createHash } from "crypto";

describe("ChecksumService (spec §16, §30)", () => {
  const testData = Buffer.from("ProgrammoCeuticals eCTD test content");

  describe("CHECKSUM_ALGORITHM", () => {
    it("should be SHA-256", () => {
      expect(CHECKSUM_ALGORITHM).toBe("SHA-256");
    });
  });

  describe("computeChecksum", () => {
    it("should return a 64-character hex string", () => {
      const result = computeChecksum(testData);
      expect(result.checksum).toMatch(/^[a-f0-9]{64}$/);
    });

    it("should return the correct SHA-256 value", () => {
      const expected = createHash("sha256").update(testData).digest("hex");
      const result = computeChecksum(testData);
      expect(result.checksum).toBe(expected);
    });

    it("should return the correct byte size", () => {
      const result = computeChecksum(testData);
      expect(result.sizeBytes).toBe(testData.byteLength);
    });

    it("should be deterministic — same content always same checksum", () => {
      const r1 = computeChecksum(testData);
      const r2 = computeChecksum(testData);
      expect(r1.checksum).toBe(r2.checksum);
    });

    it("should produce different checksums for different content", () => {
      const r1 = computeChecksum(Buffer.from("content-a"));
      const r2 = computeChecksum(Buffer.from("content-b"));
      expect(r1.checksum).not.toBe(r2.checksum);
    });

    it("should handle empty buffer", () => {
      const result = computeChecksum(Buffer.alloc(0));
      expect(result.checksum).toHaveLength(64);
      expect(result.sizeBytes).toBe(0);
    });
  });

  describe("verifyChecksum", () => {
    it("should return true when content matches expected checksum", () => {
      const { checksum } = computeChecksum(testData);
      expect(verifyChecksum(testData, checksum)).toBe(true);
    });

    it("should return false when content has been tampered with", () => {
      const { checksum } = computeChecksum(testData);
      const tampered = Buffer.from("tampered content");
      expect(verifyChecksum(tampered, checksum)).toBe(false);
    });

    it("should be case-insensitive for the expected checksum hex", () => {
      const { checksum } = computeChecksum(testData);
      expect(verifyChecksum(testData, checksum.toUpperCase())).toBe(true);
    });

    it("should return false for a completely wrong checksum", () => {
      expect(verifyChecksum(testData, "a".repeat(64))).toBe(false);
    });
  });
});
