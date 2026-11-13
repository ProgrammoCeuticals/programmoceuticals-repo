import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import {
  CreateApplicationDto,
  UpdateApplicationDto,
} from "./dto/application.dto";
import {
  paginate,
  type PaginatedResult,
} from "../../common/dto/pagination.dto";
import { v4 as uuidv4 } from "uuid";
import type { RegulatoryApplication } from "@prisma/client";

/**
 * ApplicationsService — spec §7.3.
 *
 * RegulatoryApplication is the long-lived regulatory container.
 * It links: Organization → Product → Authority → Region → EctdStandard → RegionalSpec.
 *
 * Tenant isolation (spec §42): all queries scope to organizationId
 * unless the caller is Super Admin.
 *
 * Validation at create time:
 *   - Product must belong to the same organization.
 *   - Authority, Region, EctdStandard, RegionalSpec must exist and be active.
 */
@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async create(
    organizationId: string,
    dto: CreateApplicationDto,
    actorId?: string | undefined,
  ): Promise<RegulatoryApplication> {
    // Validate product ownership — spec §42
    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, organizationId },
    });
    if (!product) {
      throw new ForbiddenException(
        `Product ${dto.productId} does not belong to this organization.`,
      );
    }

    // Validate authority exists
    const authority = await this.prisma.regulatoryAuthority.findUnique({
      where: { id: dto.authorityId, active: true },
    });
    if (!authority) {
      throw new BadRequestException(
        `RegulatoryAuthority ${dto.authorityId} not found or inactive.`,
      );
    }

    // Validate region exists
    const region = await this.prisma.regulatoryRegion.findUnique({
      where: { id: dto.regionId, active: true },
    });
    if (!region) {
      throw new BadRequestException(
        `RegulatoryRegion ${dto.regionId} not found or inactive.`,
      );
    }

    // Validate eCTD standard exists and is active
    const standard = await this.prisma.ectdStandard.findUnique({
      where: { id: dto.ectdStandardId },
    });
    if (!standard || standard.status !== "ACTIVE") {
      throw new BadRequestException(
        `EctdStandard ${dto.ectdStandardId} not found or not ACTIVE. ` +
          "Import and activate the regulatory package before creating applications.",
      );
    }

    // Validate regional specification exists and belongs to the standard
    const regionalSpec = await this.prisma.regionalSpecification.findUnique({
      where: { id: dto.regionalSpecificationId },
    });
    if (!regionalSpec || regionalSpec.status !== "ACTIVE") {
      throw new BadRequestException(
        `RegionalSpecification ${dto.regionalSpecificationId} not found or not ACTIVE.`,
      );
    }
    if (regionalSpec.ectdStandardId !== dto.ectdStandardId) {
      throw new BadRequestException(
        `RegionalSpecification ${dto.regionalSpecificationId} does not belong ` +
          `to EctdStandard ${dto.ectdStandardId}.`,
      );
    }

    const application = await this.prisma.regulatoryApplication.create({
      data: {
        uuid: uuidv4(),
        organizationId,
        productId: dto.productId,
        authorityId: dto.authorityId,
        regionId: dto.regionId,
        ectdStandardId: dto.ectdStandardId,
        regionalSpecificationId: dto.regionalSpecificationId,
        applicationNumber: dto.applicationNumber ?? null,
        applicationType: dto.applicationType ?? null,
        status: "DRAFT",
      },
    });

    await this.audit.record({
      organizationId,
      userId: actorId,
      eventType: "CREATE_APPLICATION",
      entityType: "RegulatoryApplication",
      entityId: application.id,
      newValue: {
        uuid: application.uuid,
        applicationType: application.applicationType,
        authorityCode: authority.code,
        regionCode: region.code,
        standardVersion: `${standard.name} ${standard.version}`,
      },
    });

    return application;
  }

  async findAll(
    organizationId: string,
    page = 1,
    pageSize = 50,
  ): Promise<PaginatedResult<RegulatoryApplication>> {
    const where = { organizationId };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.regulatoryApplication.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          product: { select: { productName: true, genericName: true } },
          authority: { select: { name: true, code: true } },
          region: { select: { name: true, code: true } },
          ectdStandard: { select: { name: true, version: true } },
        },
      }),
      this.prisma.regulatoryApplication.count({ where }),
    ]);
    return paginate(data, total, page, pageSize);
  }

  async findOne(
    id: string,
    organizationId: string,
  ): Promise<RegulatoryApplication> {
    const app = await this.prisma.regulatoryApplication.findFirst({
      where: { id, organizationId },
      include: {
        product: true,
        authority: true,
        region: true,
        ectdStandard: true,
        regionalSpecification: true,
      },
    });
    if (!app) throw new NotFoundException(`Application ${id} not found.`);
    return app;
  }

  async update(
    id: string,
    organizationId: string,
    dto: UpdateApplicationDto,
    actorId?: string | undefined,
  ): Promise<RegulatoryApplication> {
    const existing = await this.findOne(id, organizationId);

    // Cannot update a published application
    if (existing.status === "PUBLISHED") {
      throw new BadRequestException(
        "Published applications cannot be modified.",
      );
    }

    const updated = await this.prisma.regulatoryApplication.update({
      where: { id },
      data: {
        ...(dto.applicationNumber !== undefined && {
          applicationNumber: dto.applicationNumber,
        }),
        ...(dto.applicationType !== undefined && {
          applicationType: dto.applicationType,
        }),
      },
    });

    await this.audit.record({
      organizationId,
      userId: actorId,
      eventType: "UPDATE_APPLICATION",
      entityType: "RegulatoryApplication",
      entityId: id,
      oldValue: {
        applicationNumber: existing.applicationNumber,
        applicationType: existing.applicationType,
      },
      newValue: {
        applicationNumber: updated.applicationNumber,
        applicationType: updated.applicationType,
      },
    });

    return updated;
  }

  async getSubmissions(id: string, organizationId: string) {
    await this.findOne(id, organizationId);
    return this.prisma.submission.findMany({
      where: { applicationId: id },
      orderBy: { createdAt: "desc" },
    });
  }

  async getAuditTrail(
    id: string,
    organizationId: string,
    page = 1,
    pageSize = 50,
  ) {
    await this.findOne(id, organizationId);
    const where = { entityType: "RegulatoryApplication", entityId: id };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.auditEvent.findMany({
        where,
        orderBy: { timestamp: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.auditEvent.count({ where }),
    ]);
    return paginate(data, total, page, pageSize);
  }

  /** Assert application belongs to org — used by child resource services */
  async assertOwnership(
    applicationId: string,
    organizationId: string,
  ): Promise<void> {
    const app = await this.prisma.regulatoryApplication.findFirst({
      where: { id: applicationId, organizationId },
      select: { id: true },
    });
    if (!app) {
      throw new ForbiddenException(
        `Application ${applicationId} does not belong to this organization.`,
      );
    }
  }
}
