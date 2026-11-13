import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { level: 'warn', emit: 'event' },
        { level: 'error', emit: 'event' },
        // Enable query logging in dev only — never log queries with PII in production
        ...(process.env['NODE_ENV'] === 'development'
          ? [{ level: 'query' as const, emit: 'event' as const }]
          : []),
      ],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connected');
    } catch (err) {
      this.logger.error('Database connection failed', err);
      throw err;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }

  /**
   * Helper: execute a callback inside a Prisma interactive transaction.
   * Prefer this over $transaction([...]) for multi-step operations.
   */
  async transaction<T>(
    fn: (tx: PrismaClient) => Promise<T>,
    options?: { timeout?: number; maxWait?: number; isolationLevel?: 'Serializable' | 'RepeatableRead' },
  ): Promise<T> {
    return this.$transaction(fn as Parameters<typeof this.$transaction>[0], options);
  }
}
