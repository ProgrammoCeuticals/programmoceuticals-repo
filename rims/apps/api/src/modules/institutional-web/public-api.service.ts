import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactSubmissionDto } from './dtos/contact.dto';

@Injectable()
export class PublicApiService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Resolves tenant/website from a verified hostname.
   * NEVER trusts client-supplied tenantId — only hostname lookup.
   * Throws NotFoundException if domain not VERIFIED or website not PUBLISHED.
   */
  async resolveTenantFromHostname(hostname: string): Promise<{ websiteId: string; tenantId: string }> {
    const domain = await this.prisma.websiteDomain.findFirst({
      where: {
        hostname,
        verificationStatus: 'VERIFIED',
      },
      include: {
        website: {
          select: { id: true, tenantId: true, status: true },
        },
      },
    });

    if (!domain || !domain.website) {
      throw new NotFoundException('Site not found');
    }

    if (domain.website.status !== 'PUBLISHED') {
      throw new NotFoundException('Site not available');
    }

    return {
      websiteId: domain.website.id,
      tenantId: domain.website.tenantId,
    };
  }

  async getSiteInfo(websiteId: string) : Promise<unknown> {
    const website = await this.prisma.institutionWebsite.findFirst({
      where: { id: websiteId },
      select: {
        id: true,
        name: true,
        defaultLocale: true,
        timezone: true,
        branding: {
          select: {
            logoUrl: true,
            logoDarkUrl: true,
            faviconUrl: true,
            tagline: true,
            shortDescription: true,
            fullDescription: true,
            mission: true,
            vision: true,
            primaryColor: true,
            secondaryColor: true,
            accentColor: true,
            typographyPreset: true,
            contactEmail: true,
            contactPhone: true,
            address: true,
            socialLinksJson: true,
            copyrightStatement: true,
            // Never expose internal fields: updatedById, tenantId, websiteId
          },
        },
      },
    });

    if (!website) {
      throw new NotFoundException('Site not found');
    }

    return website;
  }

  async getNavigation(websiteId: string) : Promise<unknown> {
    return this.prisma.websiteNavigation.findMany({
      where: { websiteId },
      include: {
        items: {
          where: { isVisible: true },
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            label: true,
            linkType: true,
            pageId: true,
            externalUrl: true,
            sortOrder: true,
            parentId: true,
          },
        },
      },
    });
  }

  async getPage(websiteId: string, slug: string) : Promise<unknown> {
    const page = await this.prisma.websitePage.findFirst({
      where: { websiteId, slug, status: 'PUBLISHED' },
      select: {
        id: true,
        title: true,
        publicTitle: true,
        slug: true,
        pageType: true,
        summary: true,
        seoTitle: true,
        seoDescription: true,
        socialImageUrl: true,
        publishedAt: true,
        sections: {
          where: { isVisible: true },
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            sectionType: true,
            sortOrder: true,
            configJson: true,
          },
        },
      },
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    return page;
  }

  async listNews(websiteId: string, query: { page?: number; pageSize?: number; category?: string }) : Promise<unknown> {
    const page = Number(query.page ?? 1);
    const pageSize = Number(query.pageSize ?? 10);
    const { category } = query;

    const where: Record<string, unknown> = {
      websiteId,
      status: 'PUBLISHED',
      ...(category && { category }),
    };

    const [total, data] = await Promise.all([
      this.prisma.websiteNews.count({ where }),
      this.prisma.websiteNews.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          featuredImageUrl: true,
          category: true,
          tags: true,
          publishedAt: true,
          seoTitle: true,
          seoDescription: true,
        },
      }),
    ]);

    return { data, meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) } };
  }

  async getNewsArticle(websiteId: string, slug: string) : Promise<unknown> {
    const article = await this.prisma.websiteNews.findFirst({
      where: { websiteId, slug, status: 'PUBLISHED' },
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        body: true,
        featuredImageUrl: true,
        category: true,
        tags: true,
        publishedAt: true,
        seoTitle: true,
        seoDescription: true,
      },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }

  async listEvents(websiteId: string, query: { page?: number; pageSize?: number }) : Promise<unknown> {
    const page = Number(query.page ?? 1);
    const pageSize = Number(query.pageSize ?? 10);

    const where: Record<string, unknown> = { websiteId, status: 'PUBLISHED' };

    const [total, data] = await Promise.all([
      this.prisma.websiteEvent.count({ where }),
      this.prisma.websiteEvent.findMany({
        where,
        orderBy: { startDatetime: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          startDatetime: true,
          endDatetime: true,
          timezone: true,
          venue: true,
          isOnline: true,
          registrationUrl: true,
          featuredImageUrl: true,
          publishedAt: true,
        },
      }),
    ]);

    return { data, meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) } };
  }

  async getEvent(websiteId: string, slug: string) : Promise<unknown> {
    const event = await this.prisma.websiteEvent.findFirst({
      where: { websiteId, slug, status: 'PUBLISHED' },
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        description: true,
        startDatetime: true,
        endDatetime: true,
        timezone: true,
        venue: true,
        isOnline: true,
        registrationUrl: true,
        featuredImageUrl: true,
        publishedAt: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async listPublications(websiteId: string, query: { page?: number; pageSize?: number }) : Promise<unknown> {
    const page = Number(query.page ?? 1);
    const pageSize = Number(query.pageSize ?? 10);

    const where: Record<string, unknown> = { websiteId, status: 'PUBLISHED' };

    const [total, data] = await Promise.all([
      this.prisma.websitePublicationLink.count({ where }),
      this.prisma.websitePublicationLink.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          publicSummaryOverride: true,
          publishedAt: true,
          manuscript: {
            select: {
              id: true,
              title: true,
              abstract: true,
              doi: true,
              url: true,
              publishedAt: true,
              targetJournal: true,
              // Never expose internal notes, drafts, or unpublished manuscripts
              authors: {
                select: {
                  authorOrder: true,
                  isCorresponding: true,
                  employee: {
                    select: { firstName: true, lastName: true },
                  },
                },
                orderBy: { authorOrder: 'asc' },
              },
            },
          },
        },
      }),
    ]);

    return { data, meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) } };
  }

  async getPublication(websiteId: string, manuscriptId: string) : Promise<unknown> {
    const link = await this.prisma.websitePublicationLink.findFirst({
      where: { websiteId, manuscriptId, status: 'PUBLISHED' },
      select: {
        id: true,
        publicSummaryOverride: true,
        publishedAt: true,
        manuscript: {
          select: {
            id: true,
            title: true,
            abstract: true,
            doi: true,
            url: true,
            publishedAt: true,
            targetJournal: true,
            authors: {
              select: {
                authorOrder: true,
                isCorresponding: true,
                employee: {
                  select: { firstName: true, lastName: true },
                },
              },
              orderBy: { authorOrder: 'asc' },
            },
          },
        },
      },
    });

    if (!link) {
      throw new NotFoundException('Publication not found');
    }

    return link;
  }

  async listOpportunities(
    websiteId: string,
    query: { page?: number; pageSize?: number; type?: string },
  ) : Promise<unknown> {
    const page = Number(query.page ?? 1);
    const pageSize = Number(query.pageSize ?? 10);
    const { type } = query;

    const where: Record<string, unknown> = {
      websiteId,
      status: 'PUBLISHED',
      ...(type && { opportunityType: type }),
    };

    const [total, data] = await Promise.all([
      this.prisma.websiteOpportunity.count({ where }),
      this.prisma.websiteOpportunity.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          title: true,
          slug: true,
          opportunityType: true,
          summary: true,
          department: true,
          location: true,
          isRemote: true,
          closingDate: true,
          applicationUrl: true,
          publishedAt: true,
        },
      }),
    ]);

    return { data, meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) } };
  }

  async getOpportunity(websiteId: string, slug: string) : Promise<unknown> {
    const opp = await this.prisma.websiteOpportunity.findFirst({
      where: { websiteId, slug, status: 'PUBLISHED' },
      select: {
        id: true,
        title: true,
        slug: true,
        opportunityType: true,
        summary: true,
        body: true,
        department: true,
        location: true,
        isRemote: true,
        closingDate: true,
        applicationUrl: true,
        publishedAt: true,
      },
    });

    if (!opp) {
      throw new NotFoundException('Opportunity not found');
    }

    return opp;
  }

  async listTeamProfiles(websiteId: string) : Promise<unknown> {
    const profiles = await this.prisma.websiteTeamProfile.findMany({
      where: { websiteId, status: 'PUBLISHED' },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        displayName: true,
        role: true,
        department: true,
        biography: true,
        photoUrl: true,
        qualifications: true,
        professionalLinksJson: true,
        sortOrder: true,
        publishedAt: true,
        // Never expose employeeId (internal HR link)
      },
    });

    return profiles;
  }

  async listPartners(websiteId: string) : Promise<unknown> {
    return this.prisma.websitePartner.findMany({
      where: { websiteId, status: 'PUBLISHED' },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        name: true,
        logoUrl: true,
        description: true,
        websiteUrl: true,
        partnershipType: true,
        sortOrder: true,
      },
    });
  }

  async listResources(websiteId: string) : Promise<unknown> {
    return this.prisma.websiteResource.findMany({
      where: { websiteId, status: 'PUBLISHED', publicDownload: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        fileName: true,
        mimeType: true,
        category: true,
        publishedAt: true,
        // fileKey is internal — not exposed
      },
    });
  }

  async listFaqs(websiteId: string) : Promise<unknown> {
    return this.prisma.websiteFaq.findMany({
      where: { websiteId, status: 'PUBLISHED' },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        question: true,
        answer: true,
        category: true,
        sortOrder: true,
      },
    });
  }

  /**
   * J-004: Returns cached sitemap XML. Falls back to a minimal sitemap if not yet generated.
   */
  async getSitemapXml(websiteId: string): Promise<string> {
    const website = await this.prisma.institutionWebsite.findUnique({
      where: { id: websiteId },
      select: { sitemapCache: true },
    });

    if (website?.sitemapCache) {
      return website.sitemapCache;
    }

    // Minimal fallback until worker generates the full sitemap
    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      '</urlset>',
    ].join('\n');
  }

  /**
   * Accepts a contact form submission.
   * NEVER returns the submission data — returns only { success: true }.
   */
  async submitContact(
    websiteId: string,
    tenantId: string,
    dto: CreateContactSubmissionDto,
  ): Promise<{ success: true }> {
    if (!dto.consentGiven) {
      throw new Error('Consent is required');
    }

    await this.prisma.websiteContactSubmission.create({
      data: {
        tenantId,
        websiteId,
        name: dto.name,
        email: dto.email,
        ...(dto.subject !== undefined && { subject: dto.subject }),
        message: dto.message,
        consentGiven: dto.consentGiven,
      },
    });

    // Never return submission data
    return { success: true };
  }
}
