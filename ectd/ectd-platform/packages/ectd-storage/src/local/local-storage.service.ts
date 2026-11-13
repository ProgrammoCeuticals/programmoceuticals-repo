/**
 * LocalStorageService — development/test implementation of StorageService.
 * spec §16, §43, §57 Rule 15.
 *
 * Uses the filesystem under storageRoot as a content-addressable store.
 * Keys are SHA-256/filename — same content is never written twice.
 *
 * NOT suitable for production without proper access controls.
 * In production, replace with an S3-compatible or equivalent.
 *
 * Spec §43 security requirements enforced here:
 *   - No public document buckets (local FS under storageRoot — not web-accessible)
 *   - No permanent direct storage URLs exposed via API
 *   - Document access auditing is the responsibility of the calling service
 *   - storageRoot must never be mounted at a public HTTP path
 */

import * as fs from "fs/promises";
import * as path from "path";
import * as crypto from "crypto";
import { Readable } from "stream";
import type {
  StorageService,
  StorageWriteOptions,
  StorageReadResult,
} from "@ectd/shared";

export class LocalStorageService implements StorageService {
  constructor(private readonly storageRoot: string) {}

  /**
   * Store a file using a pre-computed key.
   * The key is typically: <sha256>/<sanitized-filename>
   *
   * Content-addressable: if the file already exists with the same key,
   * we skip writing (idempotent for same content + key).
   *
   * Never expose the underlying fullPath outside this service.
   */
  async put(
    key: string,
    data: Buffer | NodeJS.ReadableStream,
    _options?: StorageWriteOptions,
  ): Promise<{ storageKey: string; checksum: string; size: number }> {
    // Resolve to buffer for checksum computation
    const buffer = Buffer.isBuffer(data)
      ? data
      : await this.streamToBuffer(data as NodeJS.ReadableStream);

    const checksum = crypto.createHash("sha256").update(buffer).digest("hex");

    // Sanitize key to prevent path traversal
    const safeKey = this.sanitizeKey(key);
    const fullPath = path.join(this.storageRoot, safeKey);

    await fs.mkdir(path.dirname(fullPath), { recursive: true });

    // Idempotent: skip write if file already exists with same key
    // (same key implies same checksum in our content-addressable scheme)
    try {
      await fs.access(fullPath);
    } catch {
      await fs.writeFile(fullPath, buffer);
    }

    return {
      storageKey: safeKey,
      checksum,
      size: buffer.byteLength,
    };
  }

  async get(storageKey: string): Promise<StorageReadResult> {
    const safeKey = this.sanitizeKey(storageKey);
    const fullPath = path.join(this.storageRoot, safeKey);

    // Verify file exists before streaming
    await fs.access(fullPath);
    const stat = await fs.stat(fullPath);

    const { createReadStream } = await import("fs");
    const stream = createReadStream(fullPath);

    return {
      stream,
      size: stat.size,
      // MIME type is stored in the DB — storage layer is content-agnostic
    };
  }

  /**
   * Delete a file.
   * WARNING: Only call for quarantine/temp files.
   * Published/immutable document versions must NEVER be deleted — spec §16.
   */
  async delete(storageKey: string): Promise<void> {
    const safeKey = this.sanitizeKey(storageKey);
    const fullPath = path.join(this.storageRoot, safeKey);
    await fs.unlink(fullPath);
  }

  async exists(storageKey: string): Promise<boolean> {
    const safeKey = this.sanitizeKey(storageKey);
    const fullPath = path.join(this.storageRoot, safeKey);
    try {
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verify stored file integrity by recomputing SHA-256.
   * Used by publishing pipeline to verify physical file checksums — spec §30.
   */
  async verify(storageKey: string, expectedChecksum: string): Promise<boolean> {
    const safeKey = this.sanitizeKey(storageKey);
    const fullPath = path.join(this.storageRoot, safeKey);
    const buffer = await fs.readFile(fullPath);
    const actual = crypto.createHash("sha256").update(buffer).digest("hex");
    return actual.toLowerCase() === expectedChecksum.toLowerCase();
  }

  // ── Helpers ────────────────────────────────────────────────────────────

  /**
   * Prevent path traversal: strip leading slashes and normalize.
   * Keys must be relative paths within storageRoot.
   */
  private sanitizeKey(key: string): string {
    // Normalize to remove any .. segments, then strip leading slash
    const normalized = path.normalize(key).replace(/^(\.\.(\/|\\|$))+/, "");
    return normalized.replace(/^[/\\]/, "");
  }

  private async streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on("data", (chunk: Buffer | string) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", reject);
    });
  }
}
