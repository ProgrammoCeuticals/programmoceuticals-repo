import { Module } from "@nestjs/common";
import { SubmissionUnitsController } from "./submission-units.controller";
import { SubmissionUnitsService } from "./submission-units.service";
import { AuditModule } from "../audit/audit.module";
import { PublishingModule } from "../publishing/publishing.module";

// XmlModule removed: XML generation is now enqueued via JOB_QUEUE (spec §39),
// not called synchronously. JOB_QUEUE is provided globally by JobQueueModule.
@Module({
  imports: [AuditModule, PublishingModule],
  controllers: [SubmissionUnitsController],
  providers: [SubmissionUnitsService],
  exports: [SubmissionUnitsService],
})
export class SubmissionUnitsModule {}
