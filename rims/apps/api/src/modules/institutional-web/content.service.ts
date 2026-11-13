import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import {
  CreateNewsDto,
  UpdateNewsDto,
  CreateEventDto,
  UpdateEventDto,
  CreateOpportunityDto,
  UpdateOpportunityDto,
  CreateTeamProfileDto,
  UpdateTeamProfileDto,
  CreatePartnerDto,
  UpdatePartnerDto,
  CreateResourceDto,
  UpdateResourceDto,
  CreateFaqDto,
  UpdateFaqDto,
} from "./dtos/content.dto";

@Injectable()
export class ContentService {
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

  // ─── News ────────────────────────────────────────────────────────────────

  async findNews(
    tenantId: string,
    query: { page?: number; pageSize?: number; status?: string },
  ) {
    const websiteId = await this.getWebsiteId(tenantId);
    const { page = 1, pageSize = 20, status } = query;

    const where: Prisma.WebsiteNewsWhereInput = {
      tenantId,
      websiteId,
      ...(status && {
        status: status as Prisma.EnumWebsiteContentStatusFilter,
      }),
    };

    const [total, data] = await Promise.all([
      this.prisma.websiteNews.count({ where }),
      this.prisma.websiteNews.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      data,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async createNews(tenantId: string, dto: CreateNewsDto, actorId: string) {
    const websiteId = await this.getWebsiteId(tenantId);

    const news = await this.prisma.websiteNews.create({
      data: {
        tenantId,
        websiteId,
        title: dto.title,
        slug: dto.slug,
        ...(dto.summary !== undefined && { summary: dto.summary }),
        ...(dto.body !== undefined && { body: dto.body }),
        ...(dto.featuredImageUrl !== undefined && {
          featuredImageUrl: dto.featuredImageUrl,
        }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
        ...(dto.seoTitle !== undefined && { seoTitle: dto.seoTitle }),
        ...(dto.seoDescription !== undefined && {
          seoDescription: dto.seoDescription,
        }),
        authorId: actorId,
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "website.news.created",
      resourceType: "WebsiteNews",
      resourceId: news.id,
      outcome: "SUCCESS",
    });

    return news;
  }

  async updateNews(
    id: string,
    tenantId: string,
    dto: UpdateNewsDto,
    actorId: string,
  ) {
    const existing = await this.prisma.websiteNews.findFirst({
      where: { id, tenantId },
    });
    if (!existing) throw new NotFoundException("News article not found");

    const data: Prisma.WebsiteNewsUncheckedUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.slug !== undefined) data.slug = dto.slug;
    if (dto.summary !== undefined) data.summary = dto.summary;
    if (dto.body !== undefined) data.body = dto.body;
    if (dto.featuredImageUrl !== undefined)
      data.featuredImageUrl = dto.featuredImageUrl;
    if (dto.category !== undefined) data.category = dto.category;
    if (dto.tags !== undefined) data.tags = dto.tags;
    if (dto.seoTitle !== undefined) data.seoTitle = dto.seoTitle;
    if (dto.seoDescription !== undefined)
      data.seoDescription = dto.seoDescription;

    const updated = await this.prisma.websiteNews.update({
      where: { id },
      data,
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "website.news.updated",
      resourceType: "WebsiteNews",
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }

  // ─── Events ──────────────────────────────────────────────────────────────

  async findEvents(
    tenantId: string,
    query: { page?: number; pageSize?: number; status?: string },
  ) {
    const websiteId = await this.getWebsiteId(tenantId);
    const { page = 1, pageSize = 20, status } = query;

    const where: Prisma.WebsiteEventWhereInput = {
      tenantId,
      websiteId,
      ...(status && {
        status: status as Prisma.EnumWebsiteContentStatusFilter,
      }),
    };

    const [total, data] = await Promise.all([
      this.prisma.websiteEvent.count({ where }),
      this.prisma.websiteEvent.findMany({
        where,
        orderBy: { startDatetime: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      data,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async createEvent(tenantId: string, dto: CreateEventDto, actorId: string) {
    const websiteId = await this.getWebsiteId(tenantId);

    const event = await this.prisma.websiteEvent.create({
      data: {
        tenantId,
        websiteId,
        title: dto.title,
        slug: dto.slug,
        startDatetime: new Date(dto.startDatetime),
        ...(dto.summary !== undefined && { summary: dto.summary }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.endDatetime !== undefined && {
          endDatetime: new Date(dto.endDatetime),
        }),
        ...(dto.timezone !== undefined && { timezone: dto.timezone }),
        ...(dto.venue !== undefined && { venue: dto.venue }),
        ...(dto.isOnline !== undefined && { isOnline: dto.isOnline }),
        ...(dto.registrationUrl !== undefined && {
          registrationUrl: dto.registrationUrl,
        }),
        ...(dto.featuredImageUrl !== undefined && {
          featuredImageUrl: dto.featuredImageUrl,
        }),
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "website.event.created",
      resourceType: "WebsiteEvent",
      resourceId: event.id,
      outcome: "SUCCESS",
    });

    return event;
  }

  async updateEvent(
    id: string,
    tenantId: string,
    dto: UpdateEventDto,
    actorId: string,
  ) {
    const existing = await this.prisma.websiteEvent.findFirst({
      where: { id, tenantId },
    });
    if (!existing) throw new NotFoundException("Event not found");

    const data: Prisma.WebsiteEventUncheckedUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.slug !== undefined) data.slug = dto.slug;
    if (dto.summary !== undefined) data.summary = dto.summary;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.startDatetime !== undefined)
      data.startDatetime = new Date(dto.startDatetime);
    if (dto.endDatetime !== undefined)
      data.endDatetime = new Date(dto.endDatetime);
    if (dto.timezone !== undefined) data.timezone = dto.timezone;
    if (dto.venue !== undefined) data.venue = dto.venue;
    if (dto.isOnline !== undefined) data.isOnline = dto.isOnline;
    if (dto.registrationUrl !== undefined)
      data.registrationUrl = dto.registrationUrl;
    if (dto.featuredImageUrl !== undefined)
      data.featuredImageUrl = dto.featuredImageUrl;

    const updated = await this.prisma.websiteEvent.update({
      where: { id },
      data,
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "website.event.updated",
      resourceType: "WebsiteEvent",
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }

  // ─── Opportunities ───────────────────────────────────────────────────────

  async findOpportunities(
    tenantId: string,
    query: { page?: number; pageSize?: number; status?: string; type?: string },
  ) {
    const websiteId = await this.getWebsiteId(tenantId);
    const { page = 1, pageSize = 20, status, type } = query;

    const where: Prisma.WebsiteOpportunityWhereInput = {
      tenantId,
      websiteId,
      ...(status && {
        status: status as Prisma.EnumWebsiteContentStatusFilter,
      }),
      ...(type && {
        opportunityType: type as Prisma.EnumOpportunityTypeFilter,
      }),
    };

    const [total, data] = await Promise.all([
      this.prisma.websiteOpportunity.count({ where }),
      this.prisma.websiteOpportunity.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      data,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async createOpportunity(
    tenantId: string,
    dto: CreateOpportunityDto,
    actorId: string,
  ) {
    const websiteId = await this.getWebsiteId(tenantId);

    const opp = await this.prisma.websiteOpportunity.create({
      data: {
        tenantId,
        websiteId,
        title: dto.title,
        slug: dto.slug,
        opportunityType:
          dto.opportunityType as Prisma.WebsiteOpportunityCreateInput["opportunityType"],
        ...(dto.summary !== undefined && { summary: dto.summary }),
        ...(dto.body !== undefined && { body: dto.body }),
        ...(dto.department !== undefined && { department: dto.department }),
        ...(dto.location !== undefined && { location: dto.location }),
        ...(dto.isRemote !== undefined && { isRemote: dto.isRemote }),
        ...(dto.applicationUrl !== undefined && {
          applicationUrl: dto.applicationUrl,
        }),
        ...(dto.openingDate !== undefined && {
          openingDate: new Date(dto.openingDate),
        }),
        ...(dto.closingDate !== undefined && {
          closingDate: new Date(dto.closingDate),
        }),
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "website.opportunity.created",
      resourceType: "WebsiteOpportunity",
      resourceId: opp.id,
      outcome: "SUCCESS",
    });

    return opp;
  }

  async updateOpportunity(
    id: string,
    tenantId: string,
    dto: UpdateOpportunityDto,
    actorId: string,
  ) {
    const existing = await this.prisma.websiteOpportunity.findFirst({
      where: { id, tenantId },
    });
    if (!existing) throw new NotFoundException("Opportunity not found");

    const data: Prisma.WebsiteOpportunityUncheckedUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.slug !== undefined) data.slug = dto.slug;
    if (dto.opportunityType !== undefined)
      data.opportunityType =
        dto.opportunityType as import("@prisma/client").OpportunityType;
    if (dto.summary !== undefined) data.summary = dto.summary;
    if (dto.body !== undefined) data.body = dto.body;
    if (dto.department !== undefined) data.department = dto.department;
    if (dto.location !== undefined) data.location = dto.location;
    if (dto.isRemote !== undefined) data.isRemote = dto.isRemote;
    if (dto.applicationUrl !== undefined)
      data.applicationUrl = dto.applicationUrl;
    if (dto.closingDate !== undefined)
      data.closingDate = new Date(dto.closingDate);

    const updated = await this.prisma.websiteOpportunity.update({
      where: { id },
      data,
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "website.opportunity.updated",
      resourceType: "WebsiteOpportunity",
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }

  // ─── Team Profiles ───────────────────────────────────────────────────────

  async findTeamProfiles(
    tenantId: string,
    query: { page?: number; pageSize?: number; status?: string },
  ) {
    const websiteId = await this.getWebsiteId(tenantId);
    const { page = 1, pageSize = 50, status } = query;

    const where: Prisma.WebsiteTeamProfileWhereInput = {
      tenantId,
      websiteId,
      ...(status && {
        status: status as Prisma.EnumWebsiteContentStatusFilter,
      }),
    };

    const [total, data] = await Promise.all([
      this.prisma.websiteTeamProfile.count({ where }),
      this.prisma.websiteTeamProfile.findMany({
        where,
        orderBy: { sortOrder: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      data,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async createTeamProfile(
    tenantId: string,
    dto: CreateTeamProfileDto,
    actorId: string,
  ) {
    const websiteId = await this.getWebsiteId(tenantId);

    const profile = await this.prisma.websiteTeamProfile.create({
      data: {
        tenantId,
        websiteId,
        displayName: dto.displayName,
        ...(dto.role !== undefined && { role: dto.role }),
        ...(dto.department !== undefined && { department: dto.department }),
        ...(dto.biography !== undefined && { biography: dto.biography }),
        ...(dto.photoUrl !== undefined && { photoUrl: dto.photoUrl }),
        ...(dto.qualifications !== undefined && {
          qualifications: dto.qualifications,
        }),
        ...(dto.professionalLinksJson !== undefined && {
          professionalLinksJson: dto.professionalLinksJson,
        }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "website.team.created",
      resourceType: "WebsiteTeamProfile",
      resourceId: profile.id,
      outcome: "SUCCESS",
    });

    return profile;
  }

  async updateTeamProfile(
    id: string,
    tenantId: string,
    dto: UpdateTeamProfileDto,
    actorId: string,
  ) {
    const existing = await this.prisma.websiteTeamProfile.findFirst({
      where: { id, tenantId },
    });
    if (!existing) throw new NotFoundException("Team profile not found");

    const data: Prisma.WebsiteTeamProfileUncheckedUpdateInput = {};
    if (dto.displayName !== undefined) data.displayName = dto.displayName;
    if (dto.role !== undefined) data.role = dto.role;
    if (dto.department !== undefined) data.department = dto.department;
    if (dto.biography !== undefined) data.biography = dto.biography;
    if (dto.photoUrl !== undefined) data.photoUrl = dto.photoUrl;
    if (dto.qualifications !== undefined)
      data.qualifications = dto.qualifications;
    if (dto.professionalLinksJson !== undefined)
      data.professionalLinksJson = dto.professionalLinksJson;
    if (dto.sortOrder !== undefined) data.sortOrder = dto.sortOrder;

    const updated = await this.prisma.websiteTeamProfile.update({
      where: { id },
      data,
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "website.team.updated",
      resourceType: "WebsiteTeamProfile",
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }

  // ─── Partners ────────────────────────────────────────────────────────────

  async findPartners(
    tenantId: string,
    query: { page?: number; pageSize?: number; status?: string },
  ) {
    const websiteId = await this.getWebsiteId(tenantId);
    const { page = 1, pageSize = 50, status } = query;

    const where: Prisma.WebsitePartnerWhereInput = {
      tenantId,
      websiteId,
      ...(status && {
        status: status as Prisma.EnumWebsiteContentStatusFilter,
      }),
    };

    const [total, data] = await Promise.all([
      this.prisma.websitePartner.count({ where }),
      this.prisma.websitePartner.findMany({
        where,
        orderBy: { sortOrder: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      data,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async createPartner(
    tenantId: string,
    dto: CreatePartnerDto,
    actorId: string,
  ) {
    const websiteId = await this.getWebsiteId(tenantId);

    const partner = await this.prisma.websitePartner.create({
      data: {
        tenantId,
        websiteId,
        name: dto.name,
        ...(dto.logoUrl !== undefined && { logoUrl: dto.logoUrl }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.websiteUrl !== undefined && { websiteUrl: dto.websiteUrl }),
        ...(dto.partnershipType !== undefined && {
          partnershipType: dto.partnershipType,
        }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "website.partner.created",
      resourceType: "WebsitePartner",
      resourceId: partner.id,
      outcome: "SUCCESS",
    });

    return partner;
  }

  async updatePartner(
    id: string,
    tenantId: string,
    dto: UpdatePartnerDto,
    actorId: string,
  ) {
    const existing = await this.prisma.websitePartner.findFirst({
      where: { id, tenantId },
    });
    if (!existing) throw new NotFoundException("Partner not found");

    const data: Prisma.WebsitePartnerUncheckedUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.logoUrl !== undefined) data.logoUrl = dto.logoUrl;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.websiteUrl !== undefined) data.websiteUrl = dto.websiteUrl;
    if (dto.partnershipType !== undefined)
      data.partnershipType = dto.partnershipType;
    if (dto.sortOrder !== undefined) data.sortOrder = dto.sortOrder;

    const updated = await this.prisma.websitePartner.update({
      where: { id },
      data,
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "website.partner.updated",
      resourceType: "WebsitePartner",
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }

  // ─── Resources ───────────────────────────────────────────────────────────

  async findResources(
    tenantId: string,
    query: { page?: number; pageSize?: number; status?: string },
  ) {
    const websiteId = await this.getWebsiteId(tenantId);
    const { page = 1, pageSize = 20, status } = query;

    const where: Prisma.WebsiteResourceWhereInput = {
      tenantId,
      websiteId,
      ...(status && {
        status: status as Prisma.EnumWebsiteContentStatusFilter,
      }),
    };

    const [total, data] = await Promise.all([
      this.prisma.websiteResource.count({ where }),
      this.prisma.websiteResource.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      data,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async createResource(
    tenantId: string,
    dto: CreateResourceDto,
    actorId: string,
  ) {
    const websiteId = await this.getWebsiteId(tenantId);

    const resource = await this.prisma.websiteResource.create({
      data: {
        tenantId,
        websiteId,
        title: dto.title,
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.fileKey !== undefined && { fileKey: dto.fileKey }),
        ...(dto.fileName !== undefined && { fileName: dto.fileName }),
        ...(dto.mimeType !== undefined && { mimeType: dto.mimeType }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.publicDownload !== undefined && {
          publicDownload: dto.publicDownload,
        }),
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "website.resource.created",
      resourceType: "WebsiteResource",
      resourceId: resource.id,
      outcome: "SUCCESS",
    });

    return resource;
  }

  async updateResource(
    id: string,
    tenantId: string,
    dto: UpdateResourceDto,
    actorId: string,
  ) {
    const existing = await this.prisma.websiteResource.findFirst({
      where: { id, tenantId },
    });
    if (!existing) throw new NotFoundException("Resource not found");

    const data: Prisma.WebsiteResourceUncheckedUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.category !== undefined) data.category = dto.category;
    if (dto.publicDownload !== undefined)
      data.publicDownload = dto.publicDownload;

    const updated = await this.prisma.websiteResource.update({
      where: { id },
      data,
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "website.resource.updated",
      resourceType: "WebsiteResource",
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }

  // ─── FAQs ────────────────────────────────────────────────────────────────

  async findFaqs(
    tenantId: string,
    query: { page?: number; pageSize?: number; status?: string },
  ) {
    const websiteId = await this.getWebsiteId(tenantId);
    const { page = 1, pageSize = 50, status } = query;

    const where: Prisma.WebsiteFaqWhereInput = {
      tenantId,
      websiteId,
      ...(status && {
        status: status as Prisma.EnumWebsiteContentStatusFilter,
      }),
    };

    const [total, data] = await Promise.all([
      this.prisma.websiteFaq.count({ where }),
      this.prisma.websiteFaq.findMany({
        where,
        orderBy: { sortOrder: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      data,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async createFaq(tenantId: string, dto: CreateFaqDto, actorId: string) {
    const websiteId = await this.getWebsiteId(tenantId);

    const faq = await this.prisma.websiteFaq.create({
      data: {
        tenantId,
        websiteId,
        question: dto.question,
        answer: dto.answer,
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "website.faq.created",
      resourceType: "WebsiteFaq",
      resourceId: faq.id,
      outcome: "SUCCESS",
    });

    return faq;
  }

  async updateFaq(
    id: string,
    tenantId: string,
    dto: UpdateFaqDto,
    actorId: string,
  ) {
    const existing = await this.prisma.websiteFaq.findFirst({
      where: { id, tenantId },
    });
    if (!existing) throw new NotFoundException("FAQ not found");

    const data: Prisma.WebsiteFaqUncheckedUpdateInput = {};
    if (dto.question !== undefined) data.question = dto.question;
    if (dto.answer !== undefined) data.answer = dto.answer;
    if (dto.category !== undefined) data.category = dto.category;
    if (dto.sortOrder !== undefined) data.sortOrder = dto.sortOrder;

    const updated = await this.prisma.websiteFaq.update({
      where: { id },
      data,
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "website.faq.updated",
      resourceType: "WebsiteFaq",
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }

  // ─── Generic lifecycle ───────────────────────────────────────────────────

  async publishContent(
    type:
      | "news"
      | "event"
      | "opportunity"
      | "team"
      | "partner"
      | "resource"
      | "faq",
    id: string,
    tenantId: string,
    actorId: string,
  ) {
    const record = await this.getRecord(type, id, tenantId);
    if (!record) throw new NotFoundException(`${type} not found`);

    const updated = await this.updateRecord(type, id, {
      status: "PUBLISHED",
      publishedAt: new Date(),
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: `website.${type}.published`,
      resourceType: this.getModelName(type),
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }

  async unpublishContent(
    type:
      | "news"
      | "event"
      | "opportunity"
      | "team"
      | "partner"
      | "resource"
      | "faq",
    id: string,
    tenantId: string,
    actorId: string,
  ) {
    const record = await this.getRecord(type, id, tenantId);
    if (!record) throw new NotFoundException(`${type} not found`);

    const updated = await this.updateRecord(type, id, {
      status: "UNPUBLISHED",
      publishedAt: null,
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: `website.${type}.unpublished`,
      resourceType: this.getModelName(type),
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }

  private getModelName(type: string): string {
    const map: Record<string, string> = {
      news: "WebsiteNews",
      event: "WebsiteEvent",
      opportunity: "WebsiteOpportunity",
      team: "WebsiteTeamProfile",
      partner: "WebsitePartner",
      resource: "WebsiteResource",
      faq: "WebsiteFaq",
    };
    return map[type] ?? type;
  }

  private async getRecord(type: string, id: string, tenantId: string) {
    switch (type) {
      case "news":
        return this.prisma.websiteNews.findFirst({ where: { id, tenantId } });
      case "event":
        return this.prisma.websiteEvent.findFirst({ where: { id, tenantId } });
      case "opportunity":
        return this.prisma.websiteOpportunity.findFirst({
          where: { id, tenantId },
        });
      case "team":
        return this.prisma.websiteTeamProfile.findFirst({
          where: { id, tenantId },
        });
      case "partner":
        return this.prisma.websitePartner.findFirst({
          where: { id, tenantId },
        });
      case "resource":
        return this.prisma.websiteResource.findFirst({
          where: { id, tenantId },
        });
      case "faq":
        return this.prisma.websiteFaq.findFirst({ where: { id, tenantId } });
      default:
        return null;
    }
  }

  private async updateRecord(
    type: string,
    id: string,
    data: Record<string, unknown>,
  ) {
    switch (type) {
      case "news":
        return this.prisma.websiteNews.update({ where: { id }, data });
      case "event":
        return this.prisma.websiteEvent.update({ where: { id }, data });
      case "opportunity":
        return this.prisma.websiteOpportunity.update({ where: { id }, data });
      case "team":
        return this.prisma.websiteTeamProfile.update({ where: { id }, data });
      case "partner":
        return this.prisma.websitePartner.update({ where: { id }, data });
      case "resource":
        return this.prisma.websiteResource.update({ where: { id }, data });
      case "faq":
        return this.prisma.websiteFaq.update({ where: { id }, data });
      default:
        throw new NotFoundException("Unknown content type");
    }
  }
}
