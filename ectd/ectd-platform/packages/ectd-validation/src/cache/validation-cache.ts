/**
 * ValidationCache — spec §28.
 *
 * Cache expensive inspection results by:
 *   file checksum + inspection engine version + inspection profile/version
 *
 * Do NOT cache an old regulatory result against a changed validation ruleset.
 * Cache key must include all three components.
 *
 * This interface allows the engine to be decoupled from the cache backend
 * (in-memory for testing, Redis for production).
 */

import type { ValidationFinding } from "../interfaces/validation-engine.interface";

export interface CacheKey {
  fileChecksum: string;
  engineVersion: string;
  profileVersion: string;
}

export interface CachedFinding {
  ruleCode: string;
  findings: ValidationFinding[];
  cachedAt: Date;
}

export interface ValidationCache {
  get(key: CacheKey): Promise<CachedFinding | null>;
  set(key: CacheKey, findings: ValidationFinding[]): Promise<void>;
  invalidate(key: CacheKey): Promise<void>;
}

/**
 * Build a stable cache key string from the three required components.
 * Must include all three — spec §28.
 */
export function buildCacheKey(key: CacheKey): string {
  return `${key.fileChecksum}::${key.engineVersion}::${key.profileVersion}`;
}

/**
 * In-memory validation cache — for testing and development.
 * Does not persist across restarts.
 */
export class InMemoryValidationCache implements ValidationCache {
  private readonly store = new Map<string, CachedFinding>();

  async get(key: CacheKey): Promise<CachedFinding | null> {
    return this.store.get(buildCacheKey(key)) ?? null;
  }

  async set(key: CacheKey, findings: ValidationFinding[]): Promise<void> {
    this.store.set(buildCacheKey(key), {
      ruleCode: "cached",
      findings,
      cachedAt: new Date(),
    });
  }

  async invalidate(key: CacheKey): Promise<void> {
    this.store.delete(buildCacheKey(key));
  }

  get size(): number {
    return this.store.size;
  }
}
