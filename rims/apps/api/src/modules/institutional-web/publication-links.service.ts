import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { LinkManuscriptDto } from './dtos/publication-links.dto';

@Injectable()
export class PublicationLinksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  private async getWebsiteId(tenantId: string): Promise<string> {
    const website = await this.prisma.institutionWebsite.findFirst({
      where: { tenantId },
      select: { id: true },
    });
    if (!website) {
      throw new NotFoundException('Website not found');
    }
    return website.id;
  }

  async findAll(tenantId: string, query: { page?: number; pageSize?: number; status?: string }) {
    const websiteId = await this.getWebsiteId(tenantId);
    const { page = 1, pageSize = 20, status } = query;

    const where: Record<string, unknown> = {
      tenantId,
      websiteId,
      ...(status && { status }),
    };

    const [total, data] = await Promise.all([
      this.prisma.websitePublicationLink.count({ where }),
      this.prisma.websitePublicationLink.findMany({
        where,
        include: {
          manuscript: {
            select: {
              id: true,
              title: true,
              abstract: true,
              status: true,
              doi: true,
              url: true,
              publishedAt: true,
              targetJournal: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      data,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async link(tenantId: string, dto: LinkManuscriptDto, actorId: string) {
    const websiteId = await this.getWebsiteId(tenantId);

    // Validate manuscript belongs to tenant
    const manuscript = await this.prisma.manuscript.findFirst({
      where: { id: dto.manuscriptId, tenantId },
    });

    if (!manuscript) {
      throw new NotFoundException('Manuscript not found');
    }

    const link = await this.prisma.websitePublicationLink.create({
      data: {
        tenantId,
        websiteId,
        manuscriptId: dto.manuscriptId,
        ...(dto.publicSummaryOverride !== undefined && {
          publicSummaryOverride: dto.publicSummaryOverride,
        }),
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: 'website.publication_link.created',
      resourceType: 'WebsitePublicationLink',
      resourceId: link.id,
      outcome: 'SUCCESS',
    });

    return link;
  }

  async approve(id: string, tenantId: string, actorId: string) {
    const link = await this.prisma.websitePublicationLink.findFirst({
      where: { id, tenantId },
    });

    if (!link) {
      throw new NotFoundException('Publication link not found');
    }

    if (link.status !== 'DRAFT' && link.status !== 'SUBMITTED') {
      throw new BadRequestException(
        `Cannot approve publication link with status ${link.status}`,
      );
    }

    const updated = await this.prisma.websitePublicationLink.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approverId: actorId,
        approvedAt: new Date(),
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: 'website.publication_link.approved',
      resourceType: 'WebsitePublicationLink',
      resourceId: id,
      outcome: 'SUCCESS',
    });

    return updated;
  }

  async publish(id: string, tenantId: string, actorId: string) {
    const link = await this.prisma.websitePublicationLink.findFirst({
      where: { id, tenantId },
    });

    if (!link) {
      throw new NotFoundException('Publication link not found');
    }

    const updated = await this.prisma.websitePublicationLink.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: 'website.publication_link.published',
      resourceType: 'WebsitePublicationLink',
      resourceId: id,
      outcome: 'SUCCESS',
    });

    return updated;
  }

  async unpublish(id: string, tenantId: string, actorId: string) {
    const link = await this.prisma.websitePublicationLink.findFirst({
      where: { id, tenantId },
    });

    if (!link) {
      throw new NotFoundException('Publication link not found');
    }

    const updated = await this.prisma.websitePublicationLink.update({
      where: { id },
      data: {
        status: 'UNPUBLISHED',
        publishedAt: null,
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: 'website.publication_link.unpublished',
      resourceType: 'WebsitePublicationLink',
      resourceId: id,
      outcome: 'SUCCESS',
    });

    return updated;
  }
}
