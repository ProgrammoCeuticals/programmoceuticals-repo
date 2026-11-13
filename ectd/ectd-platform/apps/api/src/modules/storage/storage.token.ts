/**
 * Injection token for the StorageService abstraction — spec §43, §57 Rule 15.
 *
 * Usage:
 *   constructor(@Inject(STORAGE_SERVICE) private readonly storage: StorageService) {}
 *
 * In development: backed by LocalStorageService.
 * In production: replace with S3StorageService or equivalent — no code changes
 * required in consumers.
 */
export const STORAGE_SERVICE = Symbol("STORAGE_SERVICE");
