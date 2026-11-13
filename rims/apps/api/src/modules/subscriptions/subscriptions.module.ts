import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AuditModule } from '../audit/audit.module';
import { RolesModule } from '../roles/roles.module';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { REDIS_AVAILABLE } from '../../common/queue/redis-check';

@Module({
  imports: [
    AuditModule,
    RolesModule,
    ...(REDIS_AVAILABLE ? [BullModule.registerQueue({ name: 'email' })] : []),
  ],
  providers: [SubscriptionsService],
  controllers: [SubscriptionsController],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
