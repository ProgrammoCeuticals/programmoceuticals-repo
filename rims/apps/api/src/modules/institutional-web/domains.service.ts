import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateDomainDto } from './dtos/domains.dto';

@Injectable()
export class DomainsService {
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

  async findAll(tenantId: string) {
    const websiteId = await this.getWebsiteId(tenantId);
    return this.prisma.websiteDomain.findMany({
      where: { tenantId, websiteId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(tenantId: string, dto: CreateDomainDto, actorId: string) {
    const websiteId = await this.getWebsiteId(tenantId);

    const verificationToken = randomBytes(32).toString('hex');

    const domain = await this.prisma.websiteDomain.create({
      data: {
        tenantId,
        websiteId,
        hostname: dto.hostname,
        verificationToken,
        verificationStatus: 'PENDING',
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: 'website.domain.created',
      resourceType: 'WebsiteDomain',
      resourceId: domain.id,
      outcome: 'SUCCESS',
    });

    return { ...domain, verificationToken };
  }

  async verify(id: string, tenantId: string, actorId: string) {
    const domain = await this.prisma.websiteDomain.findFirst({
      where: { id, tenantId },
    });

    if (!domain) {
      throw new NotFoundException('Domain not found');
    }

    // Stub: in production, this would check DNS TXT records
    const updated = await this.prisma.websiteDomain.update({
      where: { id },
      data: {
        verificationStatus: 'VERIFIED',
        verifiedAt: new Date(),
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: 'website.domain.verified',
      resourceType: 'WebsiteDomain',
      resourceId: id,
      outcome: 'SUCCESS',
    });

    return updated;
  }

  async setPrimary(id: string, tenantId: string, actorId: string) {
    const websiteId = await this.getWebsiteId(tenantId);

    const domain = await this.prisma.websiteDomain.findFirst({
      where: { id, tenantId, websiteId },
    });

    if (!domain) {
      throw new NotFoundException('Domain not found');
    }

    await this.prisma.$transaction(async (tx) => {
      // Clear isPrimary on all website domains
      await tx.websiteDomain.updateMany({
        where: { websiteId, tenantId },
        data: { isPrimary: false },
      });

      // Set this domain as primary
      await tx.websiteDomain.update({
        where: { id },
        data: { isPrimary: true },
      });

      // Update primaryDomainId on the website
      await tx.institutionWebsite.update({
        where: { id: websiteId },
        data: { primaryDomainId: id },
      });
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: 'website.domain.set_primary',
      resourceType: 'WebsiteDomain',
      resourceId: id,
      outcome: 'SUCCESS',
    });

    return this.prisma.websiteDomain.findFirst({ where: { id } });
  }
}
