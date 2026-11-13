import { Module } from "@nestjs/common";
import { CtdController } from "./ctd.controller";
import { CtdService } from "./ctd.service";

/**
 * CTD Structure module — spec §13.
 *
 * CTD structure is configuration, not business logic.
 * This module provides read-only access to the loaded CTD package data
 * and is used by the Context of Use module to validate assignments.
 */
@Module({
  controllers: [CtdController],
  providers: [CtdService],
  exports: [CtdService],
})
export class CtdModule {}
