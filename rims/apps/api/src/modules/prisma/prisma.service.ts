import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { level: "warn", emit: "event" },
        { level: "error", emit: "event" },
        // Enable query logging only in development — never log queries containing PII in production
        ...(process.env["NODE_ENV"] === "development"
          ? [{ level: "query" as const, emit: "event" as const }]
          : []),
      ],
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.log("Database connected");
    } catch (err) {
      this.logger.error("Database connection failed", err);
      throw err;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log("Database disconnected");
  }

  /**
   * Execute a callback inside a Prisma interactive transaction.
   * Prefer this over $transaction([...]) for multi-step operations.
   */
  async transaction<T>(
    fn: (tx: PrismaClient) => Promise<T>,
    options?: {
      timeout?: number;
      maxWait?: number;
      isolationLevel?: "Serializable" | "RepeatableRead";
    },
  ): Promise<T> {
    return this.$transaction(
      fn as Parameters<typeof this.$transaction>[0],
      options,
    ) as Promise<T>;
  }

  /**
   * Set the RLS context for the current DB connection.
   * Calls the set_config() Postgres function so row-level security
   * policies can read app.current_tenant_id.
   */
  async setTenantContext(tenantId: string): Promise<void> {
    await this
      .$executeRaw`SELECT set_config('app.current_tenant_id', ${tenantId}, true)`;
  }
}
