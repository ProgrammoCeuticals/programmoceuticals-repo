import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationDispatcher } from './notification-dispatcher';
import { PrismaModule } from '../prisma/prisma.module';
import { REDIS_AVAILABLE } from '../../common/queue/redis-check';

@Module({
  imports: [
    PrismaModule,
    ...(REDIS_AVAILABLE
      ? [
          BullModule.registerQueue({ name: 'notifications' }),
          BullModule.registerQueue({ name: 'email' }),
        ]
      : []),
  ],
  providers: [NotificationsService, NotificationDispatcher],
  controllers: [NotificationsController],
  exports: [NotificationsService, NotificationDispatcher],
})
export class NotificationsModule {}
