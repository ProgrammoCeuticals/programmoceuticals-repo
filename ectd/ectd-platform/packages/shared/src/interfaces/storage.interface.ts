/**
 * StorageService interface — spec §57 Rule 15, §16, §43.
 *
 * Never expose permanent filesystem paths through the public API.
 * Use logical storage keys. Full implementation in Phase 5.
 *
 * Spec §43 security requirements:
 *   - No public document buckets
 *   - No permanent direct storage URLs
 *   - Encryption at rest where infrastructure provides it
 *   - TLS in transit
 *   - Document access auditing
 */
export interface StorageWriteOptions {
  mimeType?: string;
  metadata?: Record<string, string>;
}

export interface StorageReadResult {
  stream: NodeJS.ReadableStream;
  mimeType?: string | undefined;
  size?: number | undefined;
}

export interface StorageService {
  /**
   * Store a file. Returns a logical storage key (never a filesystem path).
   */
  put(
    key: string,
    data: Buffer | NodeJS.ReadableStream,
    options?: StorageWriteOptions,
  ): Promise<{ storageKey: string; checksum: string; size: number }>;

  /**
   * Retrieve a file by logical storage key.
   */
  get(storageKey: string): Promise<StorageReadResult>;

  /**
   * Delete a file. Use with extreme caution — published/immutable
   * documents must NEVER be deleted.
   */
  delete(storageKey: string): Promise<void>;

  /**
   * Check existence of a file without reading it.
   */
  exists(storageKey: string): Promise<boolean>;
}
