import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class CmsScheduler {
  private readonly logger = new Logger(CmsScheduler.name);

  constructor(@InjectQueue('cms-jobs') private readonly cmsQueue: Queue) {}

  /** J-002: Check for scheduled publishes every minute */
  @Cron(CronExpression.EVERY_MINUTE)
  async schedulePublish() {
    await this.cmsQueue.add('scheduled-publish', {}, { removeOnComplete: 10 });
  }

  /** J-003: Contact submission retention — runs daily at 02:00 UTC */
  @Cron('0 2 * * *')
  async scheduleContactRetention() {
    await this.cmsQueue.add(
      'contact-retention',
      { retentionDays: 90 },
      { removeOnComplete: 5 },
    );
    this.logger.log('[SCHEDULER] Enqueued contact-retention');
  }

  /** J-004: Regenerate sitemaps for all published websites — runs every hour */
  @Cron(CronExpression.EVERY_HOUR)
  async scheduleSitemapGenerate() {
    const websites = await prisma.institutionWebsite.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true },
    });

    for (const { id } of websites) {
      await this.cmsQueue.add(
        'sitemap-generate',
        { websiteId: id },
        { removeOnComplete: 5 },
      );
    }

    if (websites.length > 0) {
      this.logger.log(`[SCHEDULER] Enqueued sitemap-generate for ${websites.length} site(s)`);
    }
  }
}
