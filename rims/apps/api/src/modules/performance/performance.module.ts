import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PerformanceCyclesService } from './performance-cycles.service';
import { KpiDefinitionsService } from './kpi-definitions.service';
import { KpiAssignmentsService } from './kpi-assignments.service';
import { KpiResultsService } from './kpi-results.service';
import { PerformanceController } from './performance.controller';

@Module({
  imports: [AuditModule, NotificationsModule],
  providers: [
    PerformanceCyclesService,
    KpiDefinitionsService,
    KpiAssignmentsService,
    KpiResultsService,
  ],
  controllers: [PerformanceController],
  exports: [
    PerformanceCyclesService,
    KpiDefinitionsService,
    KpiAssignmentsService,
    KpiResultsService,
  ],
})
export class PerformanceModule {}
