import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { AuditModule } from "../audit/audit.module";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { REDIS_AVAILABLE } from "../../common/queue/redis-check";

@Module({
  imports: [AuditModule, ...(REDIS_AVAILABLE ? [BullModule.registerQueue({ name: "email" })] : [])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
