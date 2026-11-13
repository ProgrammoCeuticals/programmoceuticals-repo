import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { UpdateWebsiteSettingsDto, UpdateBrandingDto } from './dtos/website.dto';
import { QueryContactSubmissionsDto } from './dtos/contact.dto';

@Injectable()
export class WebsiteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async provisionWebsite(tenantId: string) : Promise<unknown> {
    const website = await this.prisma.institutionWebsite.upsert({
      where: { tenantId },
      update: {},
      create: {
        tenantId,
        name: 'My Institute',
        status: 'SETUP',
        defaultLocale: 'en',
        timezone: 'UTC',
      },
    });

    await this.prisma.websiteBranding.upsert({
      where: { websiteId: website.id },
      update: {},
      create: {
        tenantId,
        websiteId: website.id,
      },
    });

    // Create default navigations
    for (const loc of ['primary', 'footer']) {
      const existing = await this.prisma.websiteNavigation.findFirst({
        where: { websiteId: website.id, location: loc },
      });
      if (!existing) {
        await this.prisma.websiteNavigation.create({
          data: {
            tenantId,
            websiteId: website.id,
            name: loc === 'primary' ? 'Main Navigation' : 'Footer Navigation',
            location: loc,
          },
        });
      }
    }

    return website;
  }

  async getWebsite(tenantId: string) : Promise<unknown> {
    const website = await this.prisma.institutionWebsite.findFirst({
      where: { tenantId },
      include: {
        branding: true,
        themeSelection: true,
        domains: true,
      },
    });

    if (!website) {
      throw new NotFoundException('Website not found. Use POST /provision to set it up.');
    }

    return website;
  }

  async getBranding(tenantId: string) : Promise<unknown> {
    const website = await this.prisma.institutionWebsite.findFirst({
      where: { tenantId },
      include: { branding: true },
    });

    if (!website) {
      throw new NotFoundException('Website not found');
    }

    return website.branding;
  }

  async updateSettings(
    tenantId: string,
    dto: UpdateWebsiteSettingsDto,
    actorId: string,
  ) : Promise<unknown> {
    const website = await this.prisma.institutionWebsite.findFirst({
      where: { tenantId },
    });

    if (!website) {
      throw new NotFoundException('Website not found');
    }

    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data['name'] = dto.name;
    if (dto.defaultLocale !== undefined) data['defaultLocale'] = dto.defaultLocale;
    if (dto.timezone !== undefined) data['timezone'] = dto.timezone;

    const updated = await this.prisma.institutionWebsite.update({
      where: { id: website.id },
      data,
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: 'website.settings.updated',
      resourceType: 'InstitutionWebsite',
      resourceId: website.id,
      outcome: 'SUCCESS',
    });

    return updated;
  }

  async updateBranding(
    tenantId: string,
    dto: UpdateBrandingDto,
    actorId: string,
  ) : Promise<unknown> {
    const website = await this.prisma.institutionWebsite.findFirst({
      where: { tenantId },
    });

    if (!website) {
      throw new NotFoundException('Website not found');
    }

    const data: Record<string, unknown> = { updatedById: actorId };
    if (dto.logoUrl !== undefined) data['logoUrl'] = dto.logoUrl;
    if (dto.logoDarkUrl !== undefined) data['logoDarkUrl'] = dto.logoDarkUrl;
    if (dto.faviconUrl !== undefined) data['faviconUrl'] = dto.faviconUrl;
    if (dto.tagline !== undefined) data['tagline'] = dto.tagline;
    if (dto.shortDescription !== undefined) data['shortDescription'] = dto.shortDescription;
    if (dto.fullDescription !== undefined) data['fullDescription'] = dto.fullDescription;
    if (dto.mission !== undefined) data['mission'] = dto.mission;
    if (dto.vision !== undefined) data['vision'] = dto.vision;
    if (dto.primaryColor !== undefined) data['primaryColor'] = dto.primaryColor;
    if (dto.secondaryColor !== undefined) data['secondaryColor'] = dto.secondaryColor;
    if (dto.accentColor !== undefined) data['accentColor'] = dto.accentColor;
    if (dto.typographyPreset !== undefined) data['typographyPreset'] = dto.typographyPreset;
    if (dto.contactEmail !== undefined) data['contactEmail'] = dto.contactEmail;
    if (dto.contactPhone !== undefined) data['contactPhone'] = dto.contactPhone;
    if (dto.address !== undefined) data['address'] = dto.address;
    if (dto.socialLinksJson !== undefined) data['socialLinksJson'] = dto.socialLinksJson;
    if (dto.copyrightStatement !== undefined) data['copyrightStatement'] = dto.copyrightStatement;

    const branding = await this.prisma.websiteBranding.upsert({
      where: { websiteId: website.id },
      update: data,
      create: {
        tenantId,
        websiteId: website.id,
        ...data,
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: 'website.branding.updated',
      resourceType: 'WebsiteBranding',
      resourceId: branding.id,
      outcome: 'SUCCESS',
    });

    return branding;
  }

  async publishWebsite(tenantId: string, actorId: string) : Promise<unknown> {
    const website = await this.prisma.institutionWebsite.findFirst({
      where: { tenantId },
    });

    if (!website) {
      throw new NotFoundException('Website not found');
    }

    const updated = await this.prisma.institutionWebsite.update({
      where: { id: website.id },
      data: { status: 'PUBLISHED' },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: 'website.published',
      resourceType: 'InstitutionWebsite',
      resourceId: website.id,
      outcome: 'SUCCESS',
    });

    return updated;
  }

  async findContactSubmissions(
    tenantId: string,
    query: QueryContactSubmissionsDto,
  ) : Promise<unknown> {
    const { processingStatus, page = 1, pageSize = 20 } = query;

    const website = await this.prisma.institutionWebsite.findFirst({
      where: { tenantId },
      select: { id: true },
    });

    if (!website) {
      throw new NotFoundException('Website not found');
    }

    const where: Record<string, unknown> = {
      tenantId,
      websiteId: website.id,
      ...(processingStatus && { processingStatus }),
    };

    const [total, data] = await Promise.all([
      this.prisma.websiteContactSubmission.count({ where }),
      this.prisma.websiteContactSubmission.findMany({
        where,
        orderBy: { receivedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        // Never select message body by default for privacy — return summary only
        select: {
          id: true,
          name: true,
          email: true,
          subject: true,
          processingStatus: true,
          receivedAt: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}
