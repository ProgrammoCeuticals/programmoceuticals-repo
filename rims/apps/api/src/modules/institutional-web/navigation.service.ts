import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { ReplaceNavigationItemsDto } from './dtos/navigation.dto';

@Injectable()
export class NavigationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async findAll(tenantId: string) {
    const website = await this.prisma.institutionWebsite.findFirst({
      where: { tenantId },
      select: { id: true },
    });

    if (!website) {
      throw new NotFoundException('Website not found');
    }

    return this.prisma.websiteNavigation.findMany({
      where: { tenantId, websiteId: website.id },
      include: {
        items: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  async replaceItems(
    navigationId: string,
    tenantId: string,
    dto: ReplaceNavigationItemsDto,
    actorId: string,
  ) {
    // Verify navigation belongs to tenant
    const website = await this.prisma.institutionWebsite.findFirst({
      where: { tenantId },
      select: { id: true },
    });

    if (!website) {
      throw new NotFoundException('Website not found');
    }

    const navigation = await this.prisma.websiteNavigation.findFirst({
      where: { id: navigationId, tenantId, websiteId: website.id },
    });

    if (!navigation) {
      throw new NotFoundException('Navigation not found');
    }

    const items = await this.prisma.$transaction(async (tx) => {
      // Delete existing items
      await tx.websiteNavigationItem.deleteMany({
        where: { navigationId, tenantId },
      });

      // Create new items
      if (dto.items.length > 0) {
        await tx.websiteNavigationItem.createMany({
          data: dto.items.map((item) => ({
            tenantId,
            navigationId,
            label: item.label,
            linkType: item.linkType,
            ...(item.parentId !== undefined && { parentId: item.parentId }),
            ...(item.pageId !== undefined && { pageId: item.pageId }),
            ...(item.externalUrl !== undefined && { externalUrl: item.externalUrl }),
            sortOrder: item.sortOrder ?? 0,
            isVisible: item.isVisible ?? true,
          })),
        });
      }

      return tx.websiteNavigationItem.findMany({
        where: { navigationId, tenantId },
        orderBy: { sortOrder: 'asc' },
      });
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: 'website.navigation.items_replaced',
      resourceType: 'WebsiteNavigation',
      resourceId: navigationId,
      outcome: 'SUCCESS',
    });

    return items;
  }
}
