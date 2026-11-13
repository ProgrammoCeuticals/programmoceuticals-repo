import { Module } from "@nestjs/common";
import { ContextsOfUseController } from "./contexts-of-use.controller";
import { ContextsOfUseService } from "./contexts-of-use.service";
import { AuditModule } from "../audit/audit.module";

@Module({
  imports: [AuditModule],
  controllers: [ContextsOfUseController],
  providers: [ContextsOfUseService],
  exports: [ContextsOfUseService],
})
export class ContextsOfUseModule {}
