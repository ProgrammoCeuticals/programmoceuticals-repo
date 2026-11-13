import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ResearchService } from './research.service';
import { ResearchController, ResearchTeamsController } from './research.controller';

@Module({
  imports: [AuditModule, NotificationsModule],
  providers: [ResearchService],
  controllers: [ResearchController, ResearchTeamsController],
  exports: [ResearchService],
})
export class ResearchModule {}
