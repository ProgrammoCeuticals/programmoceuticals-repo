import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

/**
 * PrismaService wraps PrismaClient for NestJS DI.
 *
 * Spec §4.1 — Controllers are thin. All database access goes through
 * repositories, never directly from controllers.
 *
 * Spec §5 — Do not introduce a second ORM or persistence model without
 * architectural review.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log("Database connection established");
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log("Database connection closed");
  }
}
