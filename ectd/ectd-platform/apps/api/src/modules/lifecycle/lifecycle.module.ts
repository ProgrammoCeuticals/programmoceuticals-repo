import { Module } from "@nestjs/common";
import { LifecycleService } from "./lifecycle.service";
import { AuditModule } from "../audit/audit.module";

/**
 * LifecycleModule — spec §15.
 *
 * No controller — lifecycle operations are exposed through
 * ContextsOfUseController via explicit domain command endpoints.
 * spec §33: suspend and replace are explicit POST commands.
 */
@Module({
  imports: [AuditModule],
  providers: [LifecycleService],
  exports: [LifecycleService],
})
export class LifecycleModule {}
