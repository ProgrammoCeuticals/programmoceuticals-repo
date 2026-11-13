import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { InstitutionService } from "./institution.service";
import { InstitutionController } from "./institution.controller";

@Module({
  imports: [AuditModule],
  providers: [InstitutionService],
  controllers: [InstitutionController],
})
export class InstitutionModule {}
