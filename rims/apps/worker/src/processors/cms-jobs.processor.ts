import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { promises as dns } from 'dns';

const prisma = new PrismaClient();

@Processor('cms-jobs')
export class CmsJobsProcessor extends WorkerHost {
  private readonly logger = new Logger(CmsJobsProcessor.name);

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case 'dns-verify':
        return this.handleDnsVerify(job);
      case 'scheduled-publish':
        return this.handleScheduledPublish(job);
      case 'contact-retention':
        return this.handleContactRetention(job);
      case 'sitemap-generate':
        return this.handleSitemapGenerate(job);
      default:
        this.logger.warn(`[CMS] Unknown job: ${job.name}`);
    }
  }

  /**
   * J-001: Verify DNS TXT record for a pending domain.
   * Expected TXT record: `rims-site-verification=<verificationToken>`
   */
  private async handleDnsVerify(job: Job<{ domainId: string }>): Promise<void> {
    const { domainId } = job.data;

    const domain = await prisma.websiteDomain.findUnique({
      where: { id: domainId },
    });

    if (!domain || domain.verificationStatus === 'VERIFIED') return;

    let verified = false;
    try {
      const records = await dns.resolveTxt(domain.hostname);
      const expected = `rims-site-verification=${domain.verificationToken}`;
      verified = records.flat().some((r) => r === expected);
    } catch {
      this.logger.warn(`[DNS] TXT lookup failed for ${domain.hostname}`);
    }

    if (verified) {
      await prisma.websiteDomain.update({
        where: { id: domainId },
        data: { verificationStatus: 'VERIFIED', verifiedAt: new Date() },
      });
      this.logger.log(`[DNS] Verified: ${domain.hostname}`);
    } else {
      this.logger.log(`[DNS] Not yet verified: ${domain.hostname}`);
    }
  }

  /**
   * J-002: Publish all APPROVED pages/news/events whose scheduledPublishAt <= now.
   */
  private async handleScheduledPublish(_job: Job): Promise<void> {
    const now = new Date();

    const [pages, news, events] = await Promise.all([
      prisma.websitePage.findMany({
        where: { status: 'APPROVED', scheduledAt: { lte: now } },
        select: { id: true },
      }),
      prisma.websiteNews.findMany({
        where: { status: 'APPROVED', scheduledPublishAt: { lte: now } },
        select: { id: true },
      }),
      prisma.websiteEvent.findMany({
        where: { status: 'APPROVED', scheduledPublishAt: { lte: now } },
        select: { id: true },
      }),
    ]);

    const pageIds = pages.map((p) => p.id);
    const newsIds = news.map((n) => n.id);
    const eventIds = events.map((e) => e.id);

    await Promise.all([
      pageIds.length &&
        prisma.websitePage.updateMany({
          where: { id: { in: pageIds } },
          data: { status: 'PUBLISHED', publishedAt: now },
        }),
      newsIds.length &&
        prisma.websiteNews.updateMany({
          where: { id: { in: newsIds } },
          data: { status: 'PUBLISHED', publishedAt: now },
        }),
      eventIds.length &&
        prisma.websiteEvent.updateMany({
          where: { id: { in: eventIds } },
          data: { status: 'PUBLISHED', publishedAt: now },
        }),
    ]);

    const total = pageIds.length + newsIds.length + eventIds.length;
    if (total > 0) {
      this.logger.log(`[PUBLISH] Auto-published ${total} item(s)`);
    }
  }

  /**
   * J-003: Delete contact submissions older than retentionDays (default 90).
   */
  private async handleContactRetention(
    job: Job<{ retentionDays?: number }>,
  ): Promise<void> {
    const retentionDays = job.data.retentionDays ?? 90;
    const cutoff = new Date(Date.now() - retentionDays * 86_400_000);

    const { count } = await prisma.websiteContactSubmission.deleteMany({
      where: { createdAt: { lt: cutoff } },
    });

    this.logger.log(`[RETENTION] Deleted ${count} contact submission(s) older than ${retentionDays} days`);
  }

  /**
   * J-004: Generate and cache sitemap XML for a website.
   * Stores result in website.sitemapCache (JSON string).
   */
  private async handleSitemapGenerate(
    job: Job<{ websiteId: string }>,
  ): Promise<void> {
    const { websiteId } = job.data;

    const website = await prisma.institutionWebsite.findUnique({
      where: { id: websiteId },
      include: {
        domains: { where: { isPrimary: true, verificationStatus: 'VERIFIED' } },
      },
    });

    if (!website) return;

    const primaryDomain = website.domains[0]?.hostname;
    if (!primaryDomain) {
      this.logger.warn(`[SITEMAP] No primary verified domain for website ${websiteId}`);
      return;
    }

    const baseUrl = `https://${primaryDomain}`;

    const [pages, news, events, opportunities] = await Promise.all([
      prisma.websitePage.findMany({
        where: { websiteId, status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
      }),
      prisma.websiteNews.findMany({
        where: { websiteId, status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
      }),
      prisma.websiteEvent.findMany({
        where: { websiteId, status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
      }),
      prisma.websiteOpportunity.findMany({
        where: { websiteId, status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const urls: { loc: string; lastmod: string }[] = [
      { loc: baseUrl, lastmod: new Date().toISOString().split('T')[0] },
      ...pages.map((p) => ({
        loc: `${baseUrl}/${p.slug}`,
        lastmod: p.updatedAt.toISOString().split('T')[0],
      })),
      ...news.map((n) => ({
        loc: `${baseUrl}/news/${n.slug}`,
        lastmod: n.updatedAt.toISOString().split('T')[0],
      })),
      ...events.map((e) => ({
        loc: `${baseUrl}/events/${e.slug}`,
        lastmod: e.updatedAt.toISOString().split('T')[0],
      })),
      ...opportunities.map((o) => ({
        loc: `${baseUrl}/opportunities/${o.slug}`,
        lastmod: o.updatedAt.toISOString().split('T')[0],
      })),
    ];

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...urls.map(
        (u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`,
      ),
      '</urlset>',
    ].join('\n');

    await prisma.institutionWebsite.update({
      where: { id: websiteId },
      data: { sitemapCache: xml, sitemapGeneratedAt: new Date() },
    });

    this.logger.log(`[SITEMAP] Generated ${urls.length} URL(s) for ${primaryDomain}`);
  }
}
