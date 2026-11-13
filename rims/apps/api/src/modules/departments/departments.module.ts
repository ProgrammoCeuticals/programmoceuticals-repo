import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { DepartmentsService } from "./departments.service";
import { DepartmentsController } from "./departments.controller";

@Module({
  imports: [AuditModule],
  providers: [DepartmentsService],
  controllers: [DepartmentsController],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
