import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BullMqJobQueue } from "./bullmq-job-queue.adapter";
import { JOB_QUEUE } from "./job-queue.token";

/**
 * JobQueueModule — spec §39.
 *
 * Provides the JobQueue abstraction backed by BullMQ.
 * Core engines must NOT depend directly on BullMQ — they use the
 * JobQueue interface from @ectd/shared.
 *
 * Global so all modules can inject JOB_QUEUE without re-importing.
 */
@Global()
@Module({
  providers: [
    {
      provide: JOB_QUEUE,
      useFactory: (config: ConfigService) => {
        const redisUrl = config.get<string>(
          "app.redisUrl",
          "redis://localhost:6379",
        );
        return new BullMqJobQueue(redisUrl);
      },
      inject: [ConfigService],
    },
  ],
  exports: [JOB_QUEUE],
})
export class JobQueueModule {}
