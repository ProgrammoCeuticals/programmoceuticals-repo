import { Module } from "@nestjs/common";
import { PublishingController } from "./publishing.controller";
import { PublishingService } from "./publishing.service";
import { PublishingDomainService } from "./publishing-domain.service";
import { PublishingEngineService } from "./publishing-engine.service";
import { AuditModule } from "../audit/audit.module";

@Module({
  imports: [AuditModule],
  controllers: [PublishingController],
  providers: [PublishingService, PublishingDomainService, PublishingEngineService],
  exports: [PublishingService, PublishingDomainService, PublishingEngineService],
})
export class PublishingModule {}
