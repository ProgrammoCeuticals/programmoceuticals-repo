/**
 * StorageService port — all file access goes through this abstraction.
 * Source: ECTD_BACKEND_IMPLEMENTATION.md §§ 16, 43, 57 Rule 6, 57 Rule 15
 *
 * Never expose permanent filesystem paths through the API.
 * Use logical storage keys only.
 */
export interface StoragePort {
  /**
   * Store a file and return its immutable storage key.
   * The key is opaque to callers — never a raw path.
   */
  put(key: string, data: Buffer, options?: StoragePutOptions): Promise<void>;

  /**
   * Retrieve a file by its storage key.
   */
  get(key: string): Promise<Buffer>;

  /**
   * Check whether a key exists in storage.
   */
  exists(key: string): Promise<boolean>;

  /**
   * Generate a short-lived signed download URL.
   * Never return a permanent public URL.
   */
  getSignedDownloadUrl(key: string, expiresInSeconds: number): Promise<string>;

  /**
   * Delete a key — only for quarantine/staging cleanup.
   * Published artifacts must never be deleted.
   */
  deleteQuarantine(key: string): Promise<void>;
}

export interface StoragePutOptions {
  contentType?: string;
  metadata?: Record<string, string>;
}
