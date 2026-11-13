import { Module } from "@nestjs/common";
import { ValidationController } from "./validation.controller";
import { ValidationDomainService } from "./validation-domain.service";
import { RegulatoryModule } from "../regulatory/regulatory.module";

@Module({
  imports: [RegulatoryModule],
  controllers: [ValidationController],
  providers: [ValidationDomainService],
  exports: [ValidationDomainService],
})
export class ValidationModule {}
