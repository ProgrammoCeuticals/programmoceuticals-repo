import { Module } from "@nestjs/common";
import { RegulatoryController } from "./regulatory.controller";
import { RegulatoryService } from "./regulatory.service";
import { AuditModule } from "../audit/audit.module";

@Module({
  imports: [AuditModule],
  controllers: [RegulatoryController],
  providers: [RegulatoryService],
  exports: [RegulatoryService],
})
export class RegulatoryModule {}
