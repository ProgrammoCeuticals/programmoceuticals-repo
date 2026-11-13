import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import {
  CreatePageDto,
  UpdatePageDto,
  QueryPagesDto,
  AddSectionDto,
  UpdateSectionDto,
} from "./dtos/pages.dto";

@Injectable()
export class PagesService {
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
      throw new NotFoundException("Website not found");
    }
    return website.id;
  }

  async findAll(tenantId: string, query: QueryPagesDto) {
    const websiteId = await this.getWebsiteId(tenantId);
    const { status, pageType, search, page = 1, pageSize = 20 } = query;

    const where: Prisma.WebsitePageWhereInput = {
      tenantId,
      websiteId,
      ...(status && { status: status as Prisma.EnumWebsitePageStatusFilter }),
      ...(pageType && {
        pageType: pageType as Prisma.EnumWebsitePageTypeFilter,
      }),
    };

    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    const [total, data] = await Promise.all([
      this.prisma.websitePage.count({ where }),
      this.prisma.websitePage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
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

  async create(tenantId: string, dto: CreatePageDto, actorId: string) {
    const websiteId = await this.getWebsiteId(tenantId);

    const createData: Prisma.WebsitePageUncheckedCreateInput = {
      tenantId,
      websiteId,
      title: dto.title,
      slug: dto.slug,
      authorId: actorId,
    };
    if (dto.pageType)
      createData.pageType =
        dto.pageType as import("@prisma/client").WebsitePageType;
    if (dto.summary !== undefined) createData.summary = dto.summary;
    if (dto.publicTitle !== undefined) createData.publicTitle = dto.publicTitle;
    if (dto.seoTitle !== undefined) createData.seoTitle = dto.seoTitle;
    if (dto.seoDescription !== undefined)
      createData.seoDescription = dto.seoDescription;
    if (dto.socialImageUrl !== undefined)
      createData.socialImageUrl = dto.socialImageUrl;

    const page = await this.prisma.websitePage.create({ data: createData });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "website.page.created",
      resourceType: "WebsitePage",
      resourceId: page.id,
      outcome: "SUCCESS",
    });

    return page;
  }

  async findOne(id: string, tenantId: string) {
    const page = await this.prisma.websitePage.findFirst({
      where: { id, tenantId },
      include: {
        sections: { orderBy: { sortOrder: "asc" } },
        revisions: { orderBy: { revisionNumber: "desc" }, take: 10 },
      },
    });

    if (!page) {
      throw new NotFoundException("Page not found");
    }

    return page;
  }

  async update(
    id: string,
    tenantId: string,
    dto: UpdatePageDto,
    actorId: string,
  ) {
    const existing = await this.prisma.websitePage.findFirst({
      where: { id, tenantId },
      include: { sections: true },
    });

    if (!existing) {
      throw new NotFoundException("Page not found");
    }

    // If sections are being replaced, snapshot first
    if (dto.sections !== undefined) {
      await this.createRevision(id, tenantId, existing.sections, actorId);
    }

    const data: Prisma.WebsitePageUncheckedUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.publicTitle !== undefined) data.publicTitle = dto.publicTitle;
    if (dto.slug !== undefined) data.slug = dto.slug;
    if (dto.summary !== undefined) data.summary = dto.summary;
    if (dto.seoTitle !== undefined) data.seoTitle = dto.seoTitle;
    if (dto.seoDescription !== undefined)
      data.seoDescription = dto.seoDescription;
    if (dto.socialImageUrl !== undefined)
      data.socialImageUrl = dto.socialImageUrl;
    if (dto.robotsIndex !== undefined) data.robotsIndex = dto.robotsIndex;

    const updated = await this.prisma.websitePage.update({
      where: { id },
      data,
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "website.page.updated",
      resourceType: "WebsitePage",
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }

  async submit(id: string, tenantId: string, actorId: string) {
    const existing = await this.prisma.websitePage.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException("Page not found");
    }

    if (
      existing.status !== "DRAFT" &&
      existing.status !== "CHANGES_REQUESTED"
    ) {
      throw new BadRequestException(
        `Cannot submit page with status ${existing.status}`,
      );
    }

    const updated = await this.prisma.websitePage.update({
      where: { id },
      data: { status: "SUBMITTED" },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "website.page.submitted",
      resourceType: "WebsitePage",
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }

  async approve(id: string, tenantId: string, actorId: string) {
    const existing = await this.prisma.websitePage.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException("Page not found");
    }

    if (
      existing.status !== "SUBMITTED" &&
      existing.status !== "CHANGES_REQUESTED"
    ) {
      throw new BadRequestException(
        `Cannot approve page with status ${existing.status}`,
      );
    }

    const updated = await this.prisma.websitePage.update({
      where: { id },
      data: { status: "APPROVED", approverId: actorId },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "website.page.approved",
      resourceType: "WebsitePage",
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }

  async publish(id: string, tenantId: string, actorId: string) {
    const existing = await this.prisma.websitePage.findFirst({
      where: { id, tenantId },
      include: { sections: true },
    });

    if (!existing) {
      throw new NotFoundException("Page not found");
    }

    if (existing.status !== "APPROVED") {
      throw new BadRequestException(
        `Cannot publish page with status ${existing.status}. Page must be APPROVED first.`,
      );
    }

    // Snapshot sections before publishing
    await this.createRevision(id, tenantId, existing.sections, actorId);

    const updated = await this.prisma.websitePage.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
        publisherId: actorId,
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "website.page.published",
      resourceType: "WebsitePage",
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }

  async unpublish(id: string, tenantId: string, actorId: string) {
    const existing = await this.prisma.websitePage.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException("Page not found");
    }

    const updated = await this.prisma.websitePage.update({
      where: { id },
      data: {
        status: "UNPUBLISHED",
        unpublishedAt: new Date(),
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "website.page.unpublished",
      resourceType: "WebsitePage",
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }

  async archive(id: string, tenantId: string, actorId: string) {
    const existing = await this.prisma.websitePage.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException("Page not found");
    }

    const updated = await this.prisma.websitePage.update({
      where: { id },
      data: {
        status: "ARCHIVED",
        archivedAt: new Date(),
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "website.page.archived",
      resourceType: "WebsitePage",
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }

  async addSection(
    pageId: string,
    tenantId: string,
    dto: AddSectionDto,
    actorId: string,
  ) {
    const page = await this.prisma.websitePage.findFirst({
      where: { id: pageId, tenantId },
    });

    if (!page) {
      throw new NotFoundException("Page not found");
    }

    const section = await this.prisma.websitePageSection.create({
      data: {
        tenantId,
        pageId,
        sectionType: dto.sectionType,
        sortOrder: dto.sortOrder ?? 0,
        configJson: dto.configJson as Prisma.JsonObject,
        ...(dto.isVisible !== undefined && { isVisible: dto.isVisible }),
      },
    });

    return section;
  }

  async updateSection(
    sectionId: string,
    pageId: string,
    tenantId: string,
    dto: UpdateSectionDto,
    actorId: string,
  ) {
    const section = await this.prisma.websitePageSection.findFirst({
      where: { id: sectionId, pageId, tenantId },
    });

    if (!section) {
      throw new NotFoundException("Section not found");
    }

    const data: Prisma.WebsitePageSectionUncheckedUpdateInput = {};
    if (dto.sectionType !== undefined) data.sectionType = dto.sectionType;
    if (dto.sortOrder !== undefined) data.sortOrder = dto.sortOrder;
    if (dto.configJson !== undefined)
      data.configJson = dto.configJson as Prisma.JsonObject;
    if (dto.isVisible !== undefined) data.isVisible = dto.isVisible;

    return this.prisma.websitePageSection.update({
      where: { id: sectionId },
      data,
    });
  }

  async removeSection(
    sectionId: string,
    pageId: string,
    tenantId: string,
    actorId: string,
  ) {
    const section = await this.prisma.websitePageSection.findFirst({
      where: { id: sectionId, pageId, tenantId },
    });

    if (!section) {
      throw new NotFoundException("Section not found");
    }

    return this.prisma.websitePageSection.delete({
      where: { id: sectionId },
    });
  }

  async getSections(pageId: string, tenantId: string) {
    const page = await this.prisma.websitePage.findFirst({
      where: { id: pageId, tenantId },
    });

    if (!page) {
      throw new NotFoundException("Page not found");
    }

    return this.prisma.websitePageSection.findMany({
      where: { pageId, tenantId },
      orderBy: { sortOrder: "asc" },
    });
  }

  async getRevisions(pageId: string, tenantId: string) {
    const page = await this.prisma.websitePage.findFirst({
      where: { id: pageId, tenantId },
    });

    if (!page) {
      throw new NotFoundException("Page not found");
    }

    return this.prisma.websitePageRevision.findMany({
      where: { pageId, tenantId },
      orderBy: { revisionNumber: "desc" },
    });
  }

  private async createRevision(
    pageId: string,
    tenantId: string,
    sections: {
      id: string;
      sectionType: string;
      sortOrder: number;
      configJson: Prisma.JsonValue;
    }[],
    createdById: string,
  ) {
    const lastRevision = await this.prisma.websitePageRevision.findFirst({
      where: { pageId, tenantId },
      orderBy: { revisionNumber: "desc" },
      select: { revisionNumber: true },
    });

    const nextRevision = (lastRevision?.revisionNumber ?? 0) + 1;

    await this.prisma.websitePageRevision.create({
      data: {
        tenantId,
        pageId,
        revisionNumber: nextRevision,
        contentSnapshot: sections as unknown as Prisma.JsonObject,
        createdById,
      },
    });
  }
}
