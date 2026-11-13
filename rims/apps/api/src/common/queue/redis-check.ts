import * as net from 'net';
import { Logger } from '@nestjs/common';

const logger = new Logger('Redis');

/**
 * Synchronously checks if Redis is reachable within 500ms.
 * Used at module init to decide whether to register BullMQ.
 */
export function isRedisAvailable(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname || '127.0.0.1';
      const port = parseInt(parsed.port || '6379', 10);

      const socket = net.createConnection({ host, port });
      const timer = setTimeout(() => {
        socket.destroy();
        resolve(false);
      }, 500);

      socket.once('connect', () => {
        clearTimeout(timer);
        socket.destroy();
        resolve(true);
      });

      socket.once('error', () => {
        clearTimeout(timer);
        resolve(false);
      });
    } catch {
      resolve(false);
    }
  });
}

export let REDIS_AVAILABLE = false;

export async function detectRedis(url: string): Promise<void> {
  REDIS_AVAILABLE = await isRedisAvailable(url);
  if (!REDIS_AVAILABLE) {
    logger.warn(
      'Redis not available — queue-based features (email, notifications) disabled. ' +
        'Install Redis to enable: https://redis.io/docs/getting-started/',
    );
  } else {
    logger.log('Redis available — queue-based features active.');
  }
}
