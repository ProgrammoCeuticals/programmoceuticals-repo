import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { randomBytes } from "crypto";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { StorageService } from "../storage/storage.service";
import {
  CreateMediaDto,
  UpdateMediaDto,
  QueryMediaDto,
} from "./dtos/media.dto";

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly storage: StorageService,
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

  async findAll(tenantId: string, query: QueryMediaDto) {
    const websiteId = await this.getWebsiteId(tenantId);
    const { mimeType, search, page = 1, pageSize = 20 } = query;

    const where: Prisma.WebsiteMediaWhereInput = {
      tenantId,
      websiteId,
      ...(mimeType && { mimeType: { contains: mimeType } }),
    };

    if (search) {
      where.fileName = { contains: search, mode: "insensitive" };
    }

    const [total, data] = await Promise.all([
      this.prisma.websiteMedia.count({ where }),
      this.prisma.websiteMedia.findMany({
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

  async create(tenantId: string, dto: CreateMediaDto, uploadedById: string) {
    const websiteId = await this.getWebsiteId(tenantId);

    // SVG uploads are not permitted in this release (XSS risk via public delivery)
    if (dto.mimeType === "image/svg+xml") {
      throw new BadRequestException("SVG uploads are not permitted");
    }

    // Generate a safe internal storage key — never accept from client
    const storageKey = `website/${tenantId}/${randomBytes(16).toString("hex")}/${dto.fileName}`;

    const media = await this.prisma.websiteMedia.create({
      data: {
        tenantId,
        websiteId,
        storageKey,
        fileName: dto.fileName,
        mimeType: dto.mimeType,
        fileSizeBytes: dto.fileSizeBytes ?? 0,
        ...(dto.altText !== undefined && { altText: dto.altText }),
        ...(dto.caption !== undefined && { caption: dto.caption }),
        ...(dto.credit !== undefined && { credit: dto.credit }),
        ...(dto.isPublic !== undefined && { isPublic: dto.isPublic }),
        uploadedById,
      },
    });

    await this.auditService.log({
      tenantId,
      actorId: uploadedById,
      action: "website.media.created",
      resourceType: "WebsiteMedia",
      resourceId: media.id,
      outcome: "SUCCESS",
    });

    return media;
  }

  async update(
    id: string,
    tenantId: string,
    dto: UpdateMediaDto,
    actorId: string,
  ) {
    const existing = await this.prisma.websiteMedia.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException("Media not found");
    }

    const data: Prisma.WebsiteMediaUncheckedUpdateInput = {};
    if (dto.altText !== undefined) data.altText = dto.altText;
    if (dto.caption !== undefined) data.caption = dto.caption;
    if (dto.credit !== undefined) data.credit = dto.credit;
    if (dto.isPublic !== undefined) data.isPublic = dto.isPublic;

    return this.prisma.websiteMedia.update({ where: { id }, data });
  }

  /**
   * Returns a presigned S3 PUT URL so the client can upload directly.
   * The storageKey is generated server-side — never trusted from the client.
   */
  async getUploadUrl(
    tenantId: string,
    fileName: string,
    mimeType: string,
  ): Promise<{ uploadUrl: string; storageKey: string; expiresIn: number }> {
    if (mimeType === "image/svg+xml") {
      throw new BadRequestException("SVG uploads are not permitted");
    }
    const storageKey = `website/${tenantId}/${randomBytes(16).toString("hex")}/${fileName}`;
    return this.storage.getPresignedUploadUrl(storageKey, mimeType);
  }

  async delete(id: string, tenantId: string, actorId: string) {
    const existing = await this.prisma.websiteMedia.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException("Media not found");
    }

    await this.prisma.websiteMedia.delete({ where: { id } });

    // Best-effort S3 cleanup
    if (existing.storageKey) {
      await this.storage.deleteObject(existing.storageKey);
    }

    await this.auditService.log({
      tenantId,
      actorId,
      action: "website.media.deleted",
      resourceType: "WebsiteMedia",
      resourceId: id,
      outcome: "SUCCESS",
    });

    return { success: true };
  }
}
