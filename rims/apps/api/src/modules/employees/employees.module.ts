import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { EmployeesService } from "./employees.service";
import { EmployeesController } from "./employees.controller";

@Module({
  imports: [AuditModule, NotificationsModule],
  providers: [EmployeesService],
  controllers: [EmployeesController],
  exports: [EmployeesService],
})
export class EmployeesModule {}
