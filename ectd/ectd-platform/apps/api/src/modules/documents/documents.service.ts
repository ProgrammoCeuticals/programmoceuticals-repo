import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Inject,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import { STORAGE_SERVICE } from "../storage/storage.token";
import {
  DocumentUploadPipeline,
  ReuseValidator,
  buildStorageKey,
} from "@ectd/ectd-documents";
import {
  CreateDocumentDto,
  CreateDocumentVersionDto,
  ReuseDocumentDto,
} from "./dto/document.dto";
import {
  paginate,
  type PaginatedResult,
} from "../../common/dto/pagination.dto";
import type { StorageService } from "@ectd/shared";
import type { Document, DocumentVersion } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { createHash } from "crypto";

/**
 * DocumentsService — spec §16, §17.
 *
 * Phase 5 implementation:
 *   - Upload pipeline: MIME validation → checksum → immutable store → persist
 *   - Physical file content is immutable once a version is stored — spec §16.
 *   - Document identity is separate from DocumentVersion (physical file).
 *   - Reuse validator: validates structural prerequisites before recording reuse.
 *   - Download: controlled reference — never exposes storage paths — spec §16.
 *
 * Organization scope: documents are not org-scoped by themselves, but
 * Context of Use assignments are. Access control enforced at CoU level.
 */
@Injectable()
export class DocumentsService {
  private readonly uploadPipeline: DocumentUploadPipeline;
  private readonly reuseValidator: ReuseValidator;

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    @Inject(STORAGE_SERVICE) private readonly storage: StorageService,
  ) {
    this.uploadPipeline = new DocumentUploadPipeline(storage);
    this.reuseValidator = new ReuseValidator();
  }

  // ── Document creation ────────────────────────────────────────────────

  async create(
    organizationId: string,
    dto: CreateDocumentDto,
    actorId?: string | undefined,
  ): Promise<Document> {
    const doc = await this.prisma.document.create({
      data: {
        uuid: uuidv4(),
        title: dto.title,
        filename: dto.filename,
        mimeType: dto.mimeType,
        language: dto.language ?? null,
      },
    });

    await this.audit.record({
      organizationId,
      userId: actorId,
      eventType: "UPLOAD_DOCUMENT",
      entityType: "Document",
      entityId: doc.id,
      newValue: { uuid: doc.uuid, title: doc.title, mimeType: doc.mimeType },
    });

    return doc;
  }

  async findAll(
    page = 1,
    pageSize = 50,
    applicationId?: string | undefined,
  ): Promise<PaginatedResult<Document>> {
    // Scope to application when provided — documents are linked to applications
    // via ContextOfUse → SubmissionUnit → Submission → Application chain.
    const where = applicationId
      ? {
          contextsOfUse: {
            some: {
              submissionUnit: {
                submissions: {
                  some: {
                    submission: { applicationId },
                  },
                },
              },
            },
          },
        }
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.document.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.document.count({ where }),
    ]);
    return paginate(data, total, page, pageSize);
  }

  async findOne(id: string): Promise<Document> {
    const doc = await this.prisma.document.findUnique({
      where: { id },
      include: {
        currentVersion: {
          select: { versionNumber: true, checksum: true, mimeType: true },
        },
      },
    });
    if (!doc) throw new NotFoundException(`Document ${id} not found.`);
    return doc;
  }

  // ── Versions ─────────────────────────────────────────────────────────

  async getVersions(id: string): Promise<DocumentVersion[]> {
    await this.findOne(id);
    return this.prisma.documentVersion.findMany({
      where: { documentId: id },
      orderBy: { versionNumber: "asc" },
    });
  }

  /**
   * uploadVersion — full upload pipeline for a new document version.
   *
   * Pipeline (spec §16):
   *   receive buffer → MIME validation → size check → checksum
   *   → immutable store → persist metadata → update currentVersionId → audit
   *
   * Physical file content is immutable once stored.
   * The storageKey is content-addressable — same file never stored twice.
   */
  async uploadVersion(
    id: string,
    organizationId: string,
    buffer: Buffer,
    dto: CreateDocumentVersionDto,
    actorId?: string | undefined,
  ): Promise<DocumentVersion> {
    await this.findOne(id);

    // Run upload pipeline
    const result = await this.uploadPipeline.execute({
      buffer,
      originalFilename: dto.filename,
      declaredMimeType: dto.mimeType,
      language: dto.language,
    });

    if (result.outcome === "FAILED") {
      throw new BadRequestException({
        code: "UPLOAD_PIPELINE_FAILED",
        message: result.errorMessage ?? "Upload pipeline failed.",
        steps: result.steps,
      });
    }

    // Compute next version number
    const last = await this.prisma.documentVersion.findFirst({
      where: { documentId: id },
      orderBy: { versionNumber: "desc" },
      select: { versionNumber: true },
    });
    const nextVersion = (last?.versionNumber ?? 0) + 1;

    // Persist the immutable version record
    const version = await this.prisma.documentVersion.create({
      data: {
        documentId: id,
        versionNumber: nextVersion,
        filename: dto.filename,
        storageKey: result.storageKey!,
        mimeType: dto.mimeType,
        language: dto.language ?? null,
        fileSize: BigInt(result.fileSize!),
        checksum: result.checksum!,
        checksumAlgorithm: result.checksumAlgorithm!,
        createdById: actorId ?? null,
      },
    });

    // Update document's currentVersionId
    await this.prisma.document.update({
      where: { id },
      data: { currentVersionId: version.id },
    });

    await this.audit.record({
      organizationId,
      userId: actorId,
      eventType: "CREATE_DOCUMENT_VERSION",
      entityType: "DocumentVersion",
      entityId: version.id,
      newValue: {
        versionNumber: nextVersion,
        checksum: result.checksum,
        storageKey: result.storageKey,
        fileSize: result.fileSize,
      },
    });

    return version;
  }

  async getHistory(id: string, page = 1, pageSize = 50) {
    await this.findOne(id);
    const where = { entityType: "Document", entityId: id };
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

  // ── Reuse ────────────────────────────────────────────────────────────

  /**
   * reuse — validates prerequisites and records document reuse.
   *
   * Reuse is distinct from lifecycle replacement — spec §17.
   * Does not physically copy the file — the document's storageKey is
   * referenced from the new Context of Use.
   */
  async reuse(
    id: string,
    organizationId: string,
    dto: ReuseDocumentDto,
    actorId?: string | undefined,
  ): Promise<{ canReuse: boolean; findings: unknown[]; message: string }> {
    const doc = await this.findOne(id);

    // Gather reuse check inputs
    const currentVersion = await this.prisma.documentVersion.findFirst({
      where: { documentId: id },
      orderBy: { versionNumber: "desc" },
      select: { storageKey: true },
    });

    const targetUnit = await this.prisma.submissionUnit.findUnique({
      where: { id: dto.targetSubmissionUnitId },
      select: { id: true, status: true },
    });

    if (!targetUnit) {
      throw new NotFoundException(
        `SubmissionUnit ${dto.targetSubmissionUnitId} not found.`,
      );
    }

    // Check physical file availability
    let storageKeyExists = false;
    if (currentVersion?.storageKey) {
      storageKeyExists = await this.storage.exists(currentVersion.storageKey);
    }

    // Run reuse validator
    const validation = this.reuseValidator.validate({
      documentId: id,
      documentHasVersion: currentVersion !== null,
      documentVersionStorageKeyExists: storageKeyExists,
      targetSubmissionUnitStatus: targetUnit.status,
      targetContextDefinitionId: dto.targetContextDefinitionId,
      sourceSubmissionUnitId: "unknown", // resolved at CoU assignment time
      targetSubmissionUnitId: dto.targetSubmissionUnitId,
    });

    if (validation.canReuse) {
      await this.audit.record({
        organizationId,
        userId: actorId,
        eventType: "REUSE_DOCUMENT",
        entityType: "Document",
        entityId: id,
        newValue: {
          targetSubmissionUnitId: dto.targetSubmissionUnitId,
          targetContextDefinitionId: dto.targetContextDefinitionId,
        },
        metadata: { reason: dto.reason },
      });
    }

    return {
      canReuse: validation.canReuse,
      findings: validation.findings,
      message: validation.canReuse
        ? "Document reuse validated. Proceed to create a ContextOfUse assignment."
        : "Document cannot be reused — see findings for blocking issues.",
    };
  }

  // ── Download ─────────────────────────────────────────────────────────

  /**
   * getDownloadRef — returns a time-limited controlled download token.
   *
   * Spec §16: Never expose permanent filesystem paths via the API.
   * Spec §43: No direct storage URLs.
   *
   * For Phase 5, returns metadata + confirms file availability.
   * A production implementation would return a signed URL or streaming response.
   */
  async getDownloadRef(
    id: string,
    organizationId: string,
    actorId?: string | undefined,
  ): Promise<{
    documentId: string;
    versionNumber: number;
    filename: string;
    mimeType: string | null;
    fileSize: string;
    checksum: string;
    available: boolean;
  }> {
    const doc = await this.findOne(id);

    const version = await this.prisma.documentVersion.findFirst({
      where: { documentId: id },
      orderBy: { versionNumber: "desc" },
    });

    if (!version) {
      throw new NotFoundException(
        `Document ${id} has no versions. Upload a file before downloading.`,
      );
    }

    const available = await this.storage.exists(version.storageKey);

    // Audit document access — spec §43, §44
    await this.audit.record({
      organizationId,
      userId: actorId,
      eventType: "UPLOAD_DOCUMENT", // closest available event type for access audit
      entityType: "Document",
      entityId: id,
      metadata: {
        action: "DOWNLOAD_REF_REQUESTED",
        versionNumber: version.versionNumber,
      },
    });

    return {
      documentId: id,
      versionNumber: version.versionNumber,
      filename: version.filename,
      mimeType: version.mimeType,
      fileSize: version.fileSize.toString(),
      checksum: version.checksum,
      available,
    };
  }

  /**
   * stream — returns the actual file stream for download.
   * Used internally by the controller to stream the response.
   * Never exposes the storageKey to the client.
   */
  async stream(
    id: string,
    organizationId: string,
    actorId?: string | undefined,
  ): Promise<{
    stream: NodeJS.ReadableStream;
    filename: string;
    mimeType: string;
  }> {
    const doc = await this.findOne(id);

    const version = await this.prisma.documentVersion.findFirst({
      where: { documentId: id },
      orderBy: { versionNumber: "desc" },
    });

    if (!version) {
      throw new NotFoundException(`Document ${id} has no versions.`);
    }

    const result = await this.storage.get(version.storageKey);

    return {
      stream: result.stream,
      filename: version.filename,
      mimeType: version.mimeType ?? doc.mimeType,
    };
  }
}
