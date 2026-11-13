import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { UsageModule } from '../usage/usage.module';
import { PlatformAdminService } from './platform-admin.service';
import { PlatformAdminController } from './platform-admin.controller';
import { PlatformAdminGuard } from './guards/platform-admin.guard';

@Module({
  imports: [AuditModule, UsageModule],
  providers: [PlatformAdminService, PlatformAdminGuard],
  controllers: [PlatformAdminController],
  exports: [PlatformAdminService],
})
export class PlatformAdminModule {}
