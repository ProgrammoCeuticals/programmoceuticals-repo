import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailService } from './email.service';
import { EmailWorkerProcessor } from './processors/email.processor';
import {
  UsageMetricsWorkerProcessor,
  UsageMetricsTriggerController,
} from './processors/usage-metrics.processor';
import { NotificationsWorkerProcessor } from './processors/notifications.processor';
import { CmsJobsProcessor } from './processors/cms-jobs.processor';
import { CmsScheduler } from './processors/cms-scheduler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        connection: { url: config.getOrThrow<string>('REDIS_URL') },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({ name: 'email' }),
    BullModule.registerQueue({ name: 'usage-metrics' }),
    BullModule.registerQueue({ name: 'notifications' }),
    BullModule.registerQueue({ name: 'cms-jobs' }),
  ],
  providers: [
    EmailService,
    EmailWorkerProcessor,
    UsageMetricsWorkerProcessor,
    NotificationsWorkerProcessor,
    CmsJobsProcessor,
    CmsScheduler,
  ],
  controllers: [UsageMetricsTriggerController],
})
export class WorkerAppModule {}
