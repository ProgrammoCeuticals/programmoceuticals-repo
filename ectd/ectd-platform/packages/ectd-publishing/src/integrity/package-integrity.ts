/**
 * PackageIntegrity — spec §30.
 *
 * Calculates integrity values for the final submission package.
 * SHA-256 is the required checksum algorithm — spec §5.
 *
 * Two levels of integrity:
 *   1. Per-file checksums — each included document verified individually.
 *   2. Package-level checksum — checksum of the entire package archive.
 *
 * REGULATORY_GAP: The exact format of the package manifest/integrity
 * file (if required by the applicable specification) must come from
 * the ICH IG v1.7 and regional TCG.
 */

import { createHash } from "crypto";

export interface FileIntegrityEntry {
  relativePath: string;
  checksum: string;
  checksumAlgorithm: "SHA-256";
  fileSize: number;
}

export interface PackageIntegrityResult {
  packageChecksum: string;
  checksumAlgorithm: "SHA-256";
  totalFiles: number;
  totalSizeBytes: number;
  fileEntries: FileIntegrityEntry[];
}

/**
 * Compute the package-level integrity from a list of file entries.
 * The package checksum is computed over all file checksums concatenated
 * in a stable (sorted) order for determinism.
 *
 * REGULATORY_GAP: Confirm the package checksum computation method
 * from the applicable submission format specification.
 */
export function computePackageIntegrity(
  fileEntries: FileIntegrityEntry[],
): PackageIntegrityResult {
  // Sort by relativePath for determinism
  const sorted = [...fileEntries].sort((a, b) =>
    a.relativePath.localeCompare(b.relativePath),
  );

  // Package checksum = SHA-256 of sorted file checksums concatenated
  const hasher = createHash("sha256");
  let totalSize = 0;
  for (const entry of sorted) {
    hasher.update(entry.relativePath + ":" + entry.checksum + "\n");
    totalSize += entry.fileSize;
  }

  return {
    packageChecksum: hasher.digest("hex"),
    checksumAlgorithm: "SHA-256",
    totalFiles: sorted.length,
    totalSizeBytes: totalSize,
    fileEntries: sorted,
  };
}

/**
 * Verify a single file's checksum against its expected value.
 * Used in step 8 (VERIFY_FILE_CHECKSUMS) of the pipeline.
 */
export function verifyFileChecksum(
  fileBuffer: Buffer,
  expectedChecksum: string,
): boolean {
  const actual = createHash("sha256").update(fileBuffer).digest("hex");
  return actual.toLowerCase() === expectedChecksum.toLowerCase();
}

/**
 * Generate a package manifest string.
 * REGULATORY_GAP: Format must come from applicable specification.
 */
export function generatePackageManifest(
  integrity: PackageIntegrityResult,
  metadata: {
    submissionUnitUuid: string;
    sequenceNumber: number;
    generatedAt: string;
    generatorVersion: string;
  },
): string {
  const lines = [
    `# ProgrammoCeuticals eCTD Submission Package Manifest`,
    `# REGULATORY_GAP: Manifest format must be confirmed from applicable specification`,
    `# Generated: ${metadata.generatedAt}`,
    `# Generator: ${metadata.generatorVersion}`,
    `# SubmissionUnit: ${metadata.submissionUnitUuid}`,
    `# SequenceNumber: ${metadata.sequenceNumber}`,
    `# PackageChecksum: ${integrity.packageChecksum} (${integrity.checksumAlgorithm})`,
    `# TotalFiles: ${integrity.totalFiles}`,
    `# TotalSizeBytes: ${integrity.totalSizeBytes}`,
    ``,
    ...integrity.fileEntries.map((e) => `${e.checksum}  ${e.relativePath}`),
  ];
  return lines.join("\n");
}
