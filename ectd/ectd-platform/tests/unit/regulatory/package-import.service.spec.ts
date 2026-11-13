/**
 * Unit tests — PackageImportService
 * spec §49, §3.
 *
 * Each test includes:
 *   - positive test (valid input → expected outcome)
 *   - negative test (invalid input → failure without partial activation)
 *   - edge case where relevant
 *
 * These are synthetic tests — not based on real ICH package files.
 * All fixtures are clearly labelled SYNTHETIC.
 */

import { createHash } from "crypto";
import {
  PackageImportService,
  type IStorageReader,
  type IRegulatoryArtifactRepository,
  type IStructureValidator,
} from "../../../packages/ectd-standards/src/import/package-import.service";
import { IMPORT_STEPS } from "../../../packages/ectd-standards/src/import/import-pipeline.types";
import { RegulatoryPackageType } from "../../../packages/ectd-standards/src/regulatory-package/regulatory-package-status";

// ── Synthetic test fixture helpers ───────────────────────────────────────

/** SYNTHETIC: Creates a minimal valid ZIP buffer for testing only */
function createSyntheticZipBuffer(
  fileEntries: Array<{ name: string; content: string }>,
): Buffer {
  // Build a minimal ZIP structure manually
  const parts: Buffer[] = [];
  const centralDirEntries: Buffer[] = [];
  let offset = 0;

  for (const entry of fileEntries) {
    const nameBytes = Buffer.from(entry.name, "utf8");
    const contentBytes = Buffer.from(entry.content, "utf8");

    // Local file header
    const localHeader = Buffer.alloc(
      30 + nameBytes.length + contentBytes.length,
    );
    localHeader.writeUInt32LE(0x04034b50, 0); // signature
    localHeader.writeUInt16LE(20, 4); // version needed
    localHeader.writeUInt16LE(0, 6); // general purpose flag
    localHeader.writeUInt16LE(0, 8); // compression (stored)
    localHeader.writeUInt32LE(0, 14); // CRC-32 (0 for simplicity)
    localHeader.writeUInt32LE(contentBytes.length, 18); // compressed size
    localHeader.writeUInt32LE(contentBytes.length, 22); // uncompressed size
    localHeader.writeUInt16LE(nameBytes.length, 26);
    localHeader.writeUInt16LE(0, 28);
    nameBytes.copy(localHeader, 30);
    contentBytes.copy(localHeader, 30 + nameBytes.length);

    parts.push(localHeader);

    // Central directory entry
    const cdEntry = Buffer.alloc(46 + nameBytes.length);
    cdEntry.writeUInt32LE(0x02014b50, 0); // signature
    cdEntry.writeUInt16LE(20, 4); // version made by
    cdEntry.writeUInt16LE(20, 6); // version needed
    cdEntry.writeUInt32LE(contentBytes.length, 20); // compressed size
    cdEntry.writeUInt32LE(contentBytes.length, 24); // uncompressed size
    cdEntry.writeUInt16LE(nameBytes.length, 28);
    cdEntry.writeUInt16LE(0, 30); // extra field length
    cdEntry.writeUInt16LE(0, 32); // file comment length
    cdEntry.writeUInt32LE(offset, 42); // relative offset
    nameBytes.copy(cdEntry, 46);
    centralDirEntries.push(cdEntry);

    offset += localHeader.length;
  }

  const cdBuffer = Buffer.concat(centralDirEntries);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(centralDirEntries.length, 8);
  eocd.writeUInt16LE(centralDirEntries.length, 10);
  eocd.writeUInt32LE(cdBuffer.length, 12);
  eocd.writeUInt32LE(offset, 16);

  return Buffer.concat([...parts, cdBuffer, eocd]);
}

function sha256(buf: Buffer): string {
  return createHash("sha256").update(buf).digest("hex");
}

// ── Test doubles ─────────────────────────────────────────────────────────

function makeStorageReader(archive: Buffer): IStorageReader {
  return {
    readAsBuffer: async (_key: string) => archive,
  };
}

function makeArtifactRepository(
  opts: { existingChecksum?: string } = {},
): IRegulatoryArtifactRepository & { created: unknown[] } {
  const created: unknown[] = [];
  return {
    created,
    create: async (data) => {
      created.push(data);
      return { id: "artifact-test-id-001" };
    },
    updateStatus: async () => {},
    findByChecksum: async (checksum) => {
      if (opts.existingChecksum && checksum === opts.existingChecksum) {
        return { id: "existing-id", status: "ACTIVE" };
      }
      return null;
    },
  };
}

function makeStructureValidator(
  valid: boolean,
  message?: string,
): IStructureValidator {
  return {
    validate: async () => ({ valid, message }),
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────

describe("PackageImportService", () => {
  // ── Positive: successful import ──────────────────────────────────────
  describe("execute — success path", () => {
    it("should complete all pipeline steps and return SUCCESS when checksum matches and structure is valid", async () => {
      // SYNTHETIC fixture — not a real ICH package
      const archive = createSyntheticZipBuffer([
        { name: "schema.xsd", content: "<xs:schema/>" },
        { name: "guide.pdf", content: "%PDF-synthetic" },
      ]);
      const checksum = sha256(archive);

      const artifactRepo = makeArtifactRepository();
      const service = new PackageImportService(
        makeStorageReader(archive),
        artifactRepo,
        makeStructureValidator(true),
      );

      const result = await service.execute({
        expectedChecksum: checksum,
        storageKey: "regulatory/test-package.zip",
        sourceFilename: "test-package.zip",
        packageType: RegulatoryPackageType.IMPLEMENTATION_GUIDE,
        name: "ICH eCTD v4.0 IG",
        version: "1.7",
        authority: "ICH",
        region: "ICH",
        importedById: "user-001",
      });

      expect(result.outcome).toBe("SUCCESS");
      expect(result.artifactId).toBe("artifact-test-id-001");
      expect(result.verifiedChecksum).toBe(checksum);
      expect(result.errorMessage).toBeUndefined();

      // All required steps must be present
      const stepNames = result.steps.map((s) => s.name);
      expect(stepNames).toContain(IMPORT_STEPS.VERIFY_CHECKSUM);
      expect(stepNames).toContain(IMPORT_STEPS.VALIDATE_STRUCTURE);
      expect(stepNames).toContain(IMPORT_STEPS.REGISTER_PACKAGE);

      // VERIFY_CHECKSUM must pass
      const checksumStep = result.steps.find(
        (s) => s.name === IMPORT_STEPS.VERIFY_CHECKSUM,
      );
      expect(checksumStep?.status).toBe("PASSED");

      // Artifact must be registered with IMPORTING status (not ACTIVE)
      expect(artifactRepo.created).toHaveLength(1);
      const created = artifactRepo.created[0] as Record<string, unknown>;
      expect(created["status"]).toBe("IMPORTING");
    });
  });

  // ── Negative: checksum mismatch ──────────────────────────────────────
  describe("execute — checksum mismatch", () => {
    it("should return FAILED without creating any artifact when checksum does not match", async () => {
      // SYNTHETIC
      const archive = createSyntheticZipBuffer([
        { name: "file.xsd", content: "content" },
      ]);
      const wrongChecksum = "a".repeat(64); // invalid checksum

      const artifactRepo = makeArtifactRepository();
      const service = new PackageImportService(
        makeStorageReader(archive),
        artifactRepo,
        makeStructureValidator(true),
      );

      const result = await service.execute({
        expectedChecksum: wrongChecksum,
        storageKey: "regulatory/test.zip",
        sourceFilename: "test.zip",
        packageType: RegulatoryPackageType.SCHEMA,
        name: "Test Schema",
        version: "1.0",
      });

      expect(result.outcome).toBe("FAILED");
      expect(result.errorMessage).toMatch(/checksum/i);

      // Critical: no artifact must be registered on failure — spec §3
      expect(artifactRepo.created).toHaveLength(0);

      const checksumStep = result.steps.find(
        (s) => s.name === IMPORT_STEPS.VERIFY_CHECKSUM,
      );
      expect(checksumStep?.status).toBe("FAILED");
    });
  });

  // ── Negative: invalid structure ──────────────────────────────────────
  describe("execute — invalid structure", () => {
    it("should return FAILED without registering when structure validation fails", async () => {
      // SYNTHETIC
      const archive = createSyntheticZipBuffer([
        { name: "readme.txt", content: "no schemas here" },
      ]);
      const checksum = sha256(archive);

      const artifactRepo = makeArtifactRepository();
      const service = new PackageImportService(
        makeStorageReader(archive),
        artifactRepo,
        makeStructureValidator(false, "Missing required .xsd files."),
      );

      const result = await service.execute({
        expectedChecksum: checksum,
        storageKey: "regulatory/bad-package.zip",
        sourceFilename: "bad-package.zip",
        packageType: RegulatoryPackageType.SCHEMA,
        name: "Bad Schema Package",
        version: "1.0",
      });

      expect(result.outcome).toBe("FAILED");
      expect(result.errorMessage).toMatch(/structure/i);
      expect(artifactRepo.created).toHaveLength(0);
    });
  });

  // ── Negative: duplicate checksum ────────────────────────────────────
  describe("execute — duplicate checksum", () => {
    it("should return FAILED when an artifact with the same checksum already exists", async () => {
      // SYNTHETIC
      const archive = createSyntheticZipBuffer([
        { name: "schema.xsd", content: "<xs:schema/>" },
      ]);
      const checksum = sha256(archive);

      const artifactRepo = makeArtifactRepository({
        existingChecksum: checksum,
      });
      const service = new PackageImportService(
        makeStorageReader(archive),
        artifactRepo,
        makeStructureValidator(true),
      );

      const result = await service.execute({
        expectedChecksum: checksum,
        storageKey: "regulatory/duplicate.zip",
        sourceFilename: "duplicate.zip",
        packageType: RegulatoryPackageType.SCHEMA,
        name: "Duplicate Package",
        version: "1.0",
      });

      expect(result.outcome).toBe("FAILED");
      expect(result.errorMessage).toMatch(/duplicate checksum/i);

      // No new artifact registered
      expect(artifactRepo.created).toHaveLength(0);
    });
  });

  // ── Edge case: storage read failure ─────────────────────────────────
  describe("execute — storage read failure", () => {
    it("should return FAILED gracefully when archive cannot be read from storage", async () => {
      const failingStorage: IStorageReader = {
        readAsBuffer: async () => {
          throw new Error("S3 timeout");
        },
      };

      const artifactRepo = makeArtifactRepository();
      const service = new PackageImportService(
        failingStorage,
        artifactRepo,
        makeStructureValidator(true),
      );

      const result = await service.execute({
        expectedChecksum: "a".repeat(64),
        storageKey: "regulatory/missing.zip",
        sourceFilename: "missing.zip",
        packageType: RegulatoryPackageType.IMPLEMENTATION_GUIDE,
        name: "Missing Package",
        version: "1.0",
      });

      expect(result.outcome).toBe("FAILED");
      expect(result.errorMessage).toMatch(/read package archive/i);
      expect(artifactRepo.created).toHaveLength(0);
    });
  });
});
