import { Module } from "@nestjs/common";
import { XmlGenerationService } from "./xml-generation.service";
import { AuditModule } from "../audit/audit.module";

/**
 * XmlModule — spec §21, Phase 7.
 *
 * No dedicated controller — XML generation is triggered via
 * POST /submission-units/:id/generate-xml (SubmissionUnitsController).
 * This module provides the XmlGenerationService used by that controller.
 */
@Module({
  imports: [AuditModule],
  providers: [XmlGenerationService],
  exports: [XmlGenerationService],
})
export class XmlModule {}
