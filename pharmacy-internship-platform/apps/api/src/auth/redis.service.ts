import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';

/**
 * Thin wrapper around ioredis for use in auth (refresh tokens, OTP tokens).
 * For BullMQ job queues, a separate queue-specific connection is used.
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client!: Redis;

  async onModuleInit() {
    const url = process.env['REDIS_URL'];
    this.client = url
      ? new Redis(url, { lazyConnect: true })
      : new Redis({
          host: process.env['REDIS_HOST'] ?? 'localhost',
          port: parseInt(process.env['REDIS_PORT'] ?? '6379', 10),
          password: process.env['REDIS_PASSWORD'] || undefined,
          lazyConnect: true,
        });

    this.client.on('error', (err) => this.logger.error('Redis error', err));

    try {
      await this.client.connect();
      this.logger.log('Redis connected');
    } catch (err) {
      this.logger.error('Redis connection failed', err);
      throw err;
    }
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async setEx(key: string, ttlSeconds: number, value: string): Promise<void> {
    await this.client.setex(key, ttlSeconds, value);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
