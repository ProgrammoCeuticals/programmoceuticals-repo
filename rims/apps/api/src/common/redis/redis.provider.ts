import { Logger } from "@nestjs/common";
import Redis from "ioredis";

const logger = new Logger("Redis");

// Track whether we've already warned so we only log once across all connections
let _redisWarnedOnce = false;
let _redisConnected = false;

/**
 * Attaches a quiet error/connect handler to any ioredis client.
 * Suppresses the ECONNREFUSED flood — logs once on first failure,
 * logs once when reconnected.
 */
function attachQuietHandlers(client: Redis): void {
  client.on("error", (err: Error) => {
    const isRefused = (err as NodeJS.ErrnoException).code === "ECONNREFUSED";
    if (isRefused && !_redisWarnedOnce) {
      logger.warn(
        "Redis not available — queue-based features (email, notifications) will " +
          "activate automatically when Redis connects. Run: brew services start redis",
      );
      _redisWarnedOnce = true;
    }
    // Swallow all other ECONNREFUSED errors silently
  });

  client.on("connect", () => {
    if (!_redisConnected) {
      logger.log("Redis connected — queue-based features are now active.");
      _redisConnected = true;
      _redisWarnedOnce = false;
    }
  });

  client.on("close", () => {
    _redisConnected = false;
  });
}

/**
 * Creates the ioredis connection used by BullModule.forRoot.
 * Uses lazyConnect so the app starts immediately even without Redis.
 */
function makeRedisOptions() {
  return {
    maxRetriesPerRequest: null,
    enableOfflineQueue: false,
    lazyConnect: true,
    connectTimeout: 3000,
    // Back off aggressively — 10s, 20s, 30s, then cap at 60s
    // Prevents the ECONNREFUSED flood in the terminal
    retryStrategy: (times: number) => Math.min(times * 10_000, 60_000),
  };
}

export function createRedisConnection(url: string): Redis {
  const client = new Redis(url, makeRedisOptions());
  attachQuietHandlers(client);
  return client;
}

export function createQueueConnection(url: string): Redis {
  const client = new Redis(url, makeRedisOptions());
  attachQuietHandlers(client);
  return client;
}
