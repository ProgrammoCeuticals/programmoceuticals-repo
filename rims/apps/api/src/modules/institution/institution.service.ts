import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { UpdateInstitutionDto } from './dtos/update-institution.dto';

@Injectable()
export class InstitutionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async findOne(tenantId: string) {
    const institution = await this.prisma.institution.findFirst({
      where: { tenantId },
    });

    if (!institution) {
      throw new NotFoundException('Institution not found');
    }

    return institution;
  }

  async update(
    tenantId: string,
    dto: UpdateInstitutionDto,
    actorId: string,
  ) {
    const institution = await this.prisma.institution.findFirst({
      where: { tenantId },
    });

    if (!institution) {
      throw new NotFoundException('Institution not found');
    }

    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data['name'] = dto.name;
    if (dto.type !== undefined) data['type'] = dto.type;
    if (dto.address !== undefined) data['address'] = dto.address;
    if (dto.phone !== undefined) data['phone'] = dto.phone;
    if (dto.website !== undefined) data['website'] = dto.website;
    if (dto.logoUrl !== undefined) data['logoUrl'] = dto.logoUrl;

    const updated = await this.prisma.institution.update({
      where: { id: institution.id },
      data,
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: 'institution.updated',
      resourceType: 'Institution',
      resourceId: institution.id,
      outcome: 'SUCCESS',
    });

    return updated;
  }
}
