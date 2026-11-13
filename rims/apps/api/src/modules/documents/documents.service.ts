import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { StorageService } from "../storage/storage.service";
import { NotificationDispatcher } from "../notifications/notification-dispatcher";
import { CreateFolderDto } from "./dtos/create-folder.dto";
import { QueryDocumentsDto } from "./dtos/query-documents.dto";
import { CreateDocumentDto } from "./dtos/create-document.dto";
import { UpdateDocumentDto } from "./dtos/update-document.dto";
import { AddVersionDto } from "./dtos/add-version.dto";

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly storage: StorageService,
    private readonly dispatcher: NotificationDispatcher,
  ) {}

  async findFolders(tenantId: string, parentId?: string) {
    const where: Prisma.DocumentFolderWhereInput = { tenantId };

    if (parentId !== undefined) {
      where.parentId = parentId;
    } else {
      where.parentId = null;
    }

    return this.prisma.documentFolder.findMany({
      where,
      include: {
        _count: { select: { documents: true, children: true } },
      },
      orderBy: { name: "asc" },
    });
  }

  async createFolder(dto: CreateFolderDto, tenantId: string) {
    return this.prisma.documentFolder.create({
      data: {
        tenantId,
        name: dto.name,
        ...(dto.parentId !== undefined ? { parentId: dto.parentId } : {}),
      },
    });
  }

  async findAll(tenantId: string, query: QueryDocumentsDto) {
    const { folderId, status, search, mimeType, page = 1, pageSize = 20 } =
      query;

    const where: Prisma.DocumentWhereInput = {
      tenantId,
      ...(folderId && { folderId }),
      ...(status && { status: status as any }),
      ...(mimeType && { mimeType }),
    };

    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    const [total, data] = await Promise.all([
      this.prisma.document.count({ where }),
      this.prisma.document.findMany({
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

  async create(
    dto: CreateDocumentDto,
    tenantId: string,
    uploadedById: string,
  ) {
    const document = await this.prisma.$transaction(async (tx) => {
      const doc = await tx.document.create({
        data: {
          tenantId,
          title: dto.title,
          uploadedById,
          ...(dto.description !== undefined
            ? { description: dto.description }
            : {}),
          ...(dto.folderId !== undefined ? { folderId: dto.folderId } : {}),
          ...(dto.fileKey !== undefined ? { fileKey: dto.fileKey } : {}),
          ...(dto.fileName !== undefined ? { fileName: dto.fileName } : {}),
          ...(dto.mimeType !== undefined ? { mimeType: dto.mimeType } : {}),
          ...(dto.fileSizeBytes !== undefined
            ? { fileSizeBytes: dto.fileSizeBytes }
            : {}),
          ...(dto.checksum !== undefined ? { checksum: dto.checksum } : {}),
        },
      });

      await tx.documentVersion.create({
        data: {
          documentId: doc.id,
          version: 1,
          fileKey: dto.fileKey ?? "",
          fileName: dto.fileName ?? "",
          uploadedById,
          ...(dto.fileSizeBytes !== undefined
            ? { fileSizeBytes: dto.fileSizeBytes }
            : {}),
          ...(dto.checksum !== undefined ? { checksum: dto.checksum } : {}),
        },
      });

      return doc;
    });

    await this.auditService.log({
      tenantId,
      actorId: uploadedById,
      action: "document.created",
      resourceType: "Document",
      resourceId: document.id,
      outcome: "SUCCESS",
    });

    return document;
  }

  async findOne(id: string, tenantId: string) {
    const document = await this.prisma.document.findFirst({
      where: { id, tenantId },
      include: {
        versions: { orderBy: { version: "desc" } },
      },
    });

    if (!document) {
      throw new NotFoundException("Document not found");
    }

    return document;
  }

  async update(
    id: string,
    dto: UpdateDocumentDto,
    tenantId: string,
    actorId: string,
  ) {
    const existing = await this.prisma.document.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException("Document not found");
    }

    const data: Prisma.DocumentUncheckedUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.folderId !== undefined) data.folderId = dto.folderId;

    const updated = await this.prisma.document.update({
      where: { id },
      data,
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "document.updated",
      resourceType: "Document",
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }

  async approve(id: string, tenantId: string, actorId: string) {
    const existing = await this.prisma.document.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException("Document not found");
    }

    const updated = await this.prisma.document.update({
      where: { id },
      data: {
        status: "APPROVED" as any,
        approvedById: actorId,
        approvedAt: new Date(),
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "document.approved",
      resourceType: "Document",
      resourceId: id,
      outcome: "SUCCESS",
    });

    // Notify the uploader
    if (existing.uploadedById) {
      const uploader = await this.prisma.user.findFirst({
        where: { id: existing.uploadedById },
        select: { id: true, email: true },
      });
      if (uploader) {
        await this.dispatcher.dispatch("document.approved", {
          tenantId,
          userId: uploader.id,
          userEmail: uploader.email,
          title: "Document approved",
          body: `Your document "${existing.title}" has been approved.`,
          resourceType: "Document",
          resourceId: id,
          actionUrl: `/documents/${id}`,
        });
      }
    }

    return updated;
  }

  async archive(id: string, tenantId: string, actorId: string) {
    const existing = await this.prisma.document.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException("Document not found");
    }

    const updated = await this.prisma.document.update({
      where: { id },
      data: {
        status: "ARCHIVED" as any,
        archivedAt: new Date(),
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "document.archived",
      resourceType: "Document",
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }

  async addVersion(
    id: string,
    dto: AddVersionDto,
    tenantId: string,
    uploadedById: string,
  ) {
    const updated = await this.prisma.$transaction(async (tx) => {
      const document = await tx.document.findFirst({
        where: { id, tenantId },
      });

      if (!document) {
        throw new NotFoundException("Document not found");
      }

      const nextVersion = document.currentVersion + 1;

      await tx.documentVersion.create({
        data: {
          documentId: id,
          version: nextVersion,
          fileKey: dto.fileKey,
          fileName: dto.fileName,
          uploadedById,
          ...(dto.fileSizeBytes !== undefined
            ? { fileSizeBytes: dto.fileSizeBytes }
            : {}),
          ...(dto.checksum !== undefined ? { checksum: dto.checksum } : {}),
          ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
        },
      });

      return tx.document.update({
        where: { id },
        data: { currentVersion: nextVersion },
        include: { versions: { orderBy: { version: "desc" } } },
      });
    });

    await this.auditService.log({
      tenantId,
      actorId: uploadedById,
      action: "document.version_added",
      resourceType: "Document",
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }

  async getDownloadUrl(id: string, tenantId: string) {
    const document = await this.prisma.document.findFirst({
      where: { id, tenantId },
    });

    if (!document) {
      throw new NotFoundException("Document not found");
    }

    const url = await this.storage.getPresignedDownloadUrl(document.fileKey ?? id);
    return { url, expiresIn: 3600 };
  }
}
