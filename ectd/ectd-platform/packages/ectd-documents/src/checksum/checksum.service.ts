/**
 * ChecksumService — spec §16, §30, §43.
 *
 * SHA-256 is the required checksum algorithm for file integrity — spec §5.
 * Used in:
 *   - Document upload pipeline (verify physical file integrity)
 *   - Publishing pipeline (verify physical file checksums before building package)
 *   - Regulatory package import (verify archive checksum)
 */

import { createHash } from "crypto";

export const CHECKSUM_ALGORITHM = "SHA-256" as const;

export interface ChecksumResult {
  checksum: string;
  algorithm: typeof CHECKSUM_ALGORITHM;
  sizeBytes: number;
}

/**
 * Compute SHA-256 checksum of a Buffer.
 */
export function computeChecksum(data: Buffer): ChecksumResult {
  const checksum = createHash("sha256").update(data).digest("hex");
  return {
    checksum,
    algorithm: CHECKSUM_ALGORITHM,
    sizeBytes: data.byteLength,
  };
}

/**
 * Verify a Buffer against an expected SHA-256 checksum.
 * Case-insensitive comparison.
 */
export function verifyChecksum(data: Buffer, expected: string): boolean {
  const actual = createHash("sha256").update(data).digest("hex");
  return actual.toLowerCase() === expected.toLowerCase();
}
