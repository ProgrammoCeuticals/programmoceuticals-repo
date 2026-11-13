import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from "./dto/organization.dto";
import type { Organization } from "@prisma/client";

/**
 * OrganizationsService — spec §7.1.
 * Controllers call this service. No Prisma in controllers.
 */
@Injectable()
export class OrganizationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async create(
    dto: CreateOrganizationDto,
    actorId?: string,
  ): Promise<Organization> {
    const org = await this.prisma.organization.create({ data: dto });

    await this.audit.record({
      organizationId: org.id,
      userId: actorId,
      eventType: "CREATE_ORGANIZATION",
      entityType: "Organization",
      entityId: org.id,
      newValue: { name: org.name, code: org.code },
    });

    return org;
  }

  async findAll(): Promise<Organization[]> {
    return this.prisma.organization.findMany({
      where: { status: "ACTIVE" },
      orderBy: { name: "asc" },
    });
  }

  async findOne(id: string): Promise<Organization> {
    const org = await this.prisma.organization.findUnique({ where: { id } });
    if (!org) throw new NotFoundException(`Organization ${id} not found.`);
    return org;
  }

  async update(
    id: string,
    dto: UpdateOrganizationDto,
    actorId?: string,
  ): Promise<Organization> {
    const existing = await this.findOne(id);

    const updated = await this.prisma.organization.update({
      where: { id },
      data: dto,
    });

    await this.audit.record({
      organizationId: id,
      userId: actorId,
      eventType: "UPDATE_ORGANIZATION",
      entityType: "Organization",
      entityId: id,
      oldValue: { name: existing.name },
      newValue: { name: updated.name },
    });

    return updated;
  }
}
