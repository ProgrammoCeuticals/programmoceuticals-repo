import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import { STORAGE_SERVICE } from "../storage/storage.token";
import { InvalidatePackageDto } from "./dto/publishing.dto";
import type { StorageService } from "@ectd/shared";
import type { SubmissionPackage } from "@prisma/client";
import {
  paginate,
  type PaginatedResult,
} from "../../common/dto/pagination.dto";

/**
 * PublishingService — spec §30, §31.
 *
 * Read access and invalidation for SubmissionPackage records.
 * Packages are created by PublishingEngineService.publish().
 *
 * Spec §32 — Transmission Boundary:
 *   A FINALIZED package is READY_FOR_TRANSMISSION.
 *   Do not claim a package is transmitted without a confirmed
 *   transmission service response.
 *
 * Spec §43 — File Security:
 *   No permanent direct storage URLs.
 *   Download uses controlled access via storage service.
 */
@Injectable()
export class PublishingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    @Inject(STORAGE_SERVICE) private readonly storage: StorageService,
  ) {}

  async findPackagesBySubmissionUnit(
    submissionUnitId: string,
    page = 1,
    pageSize = 50,
  ): Promise<PaginatedResult<SubmissionPackage>> {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.submissionPackage.findMany({
        where: { submissionUnitId },
        orderBy: { generatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.submissionPackage.count({ where: { submissionUnitId } }),
    ]);
    return paginate(data, total, page, pageSize);
  }

  async findPackage(packageId: string): Promise<SubmissionPackage> {
    const pkg = await this.prisma.submissionPackage.findUnique({
      where: { id: packageId },
    });
    if (!pkg) throw new NotFoundException(`SubmissionPackage ${packageId} not found.`);
    return pkg;
  }

  /**
   * getDownloadRef — returns controlled download metadata.
   * Spec §43: no permanent direct storage URLs.
   * Returns availability + metadata; streaming is handled by the controller.
   */
  async getDownloadRef(packageId: string): Promise<{
    packageId: string;
    packageVersion: number;
    checksum: string;
    checksumAlgorithm: string;
    fileSize: string;
    status: string;
    available: boolean;
  }> {
    const pkg = await this.findPackage(packageId);
    const available = await this.storage.exists(pkg.storageKey);
    return {
      packageId: pkg.id,
      packageVersion: pkg.packageVersion,
      checksum: pkg.checksum,
      checksumAlgorithm: pkg.checksumAlgorithm,
      fileSize: pkg.fileSize.toString(),
      status: pkg.status,
      available,
    };
  }

  /**
   * stream — returns the package file stream for download.
   * Never exposes the storageKey to the client — spec §43.
   */
  async stream(
    packageId: string,
  ): Promise<{ stream: NodeJS.ReadableStream; checksum: string }> {
    const pkg = await this.findPackage(packageId);
    const result = await this.storage.get(pkg.storageKey);
    return { stream: result.stream, checksum: pkg.checksum };
  }

  /**
   * getManifest — returns structured package manifest.
   * Includes package metadata, checksum, and status.
   */
  async getManifest(packageId: string): Promise<{
    packageId: string;
    submissionUnitId: string;
    packageVersion: number;
    checksum: string;
    checksumAlgorithm: string;
    fileSize: string;
    status: string;
    generatorVersion: string | null;
    validationRunId: string | null;
    xmlGenerationRunId: string | null;
    generatedAt: Date;
    readyForTransmission: boolean;
  }> {
    const pkg = await this.findPackage(packageId);
    return {
      packageId: pkg.id,
      submissionUnitId: pkg.submissionUnitId,
      packageVersion: pkg.packageVersion,
      checksum: pkg.checksum,
      checksumAlgorithm: pkg.checksumAlgorithm,
      fileSize: pkg.fileSize.toString(),
      status: pkg.status,
      generatorVersion: pkg.generatorVersion,
      validationRunId: pkg.validationRunId,
      xmlGenerationRunId: pkg.xmlGenerationRunId,
      generatedAt: pkg.generatedAt,
      readyForTransmission: pkg.status === "FINALIZED",
    };
  }

  /**
   * invalidate — marks a SubmissionPackage as INVALIDATED.
   * Explicit domain command — spec §33.
   * A FINALIZED package can be invalidated; an already-INVALIDATED one cannot.
   */
  async invalidate(
    packageId: string,
    dto: InvalidatePackageDto,
    actorId?: string | undefined,
    organizationId?: string | undefined,
  ): Promise<{ id: string; status: string }> {
    const pkg = await this.findPackage(packageId);

    if (pkg.status === "INVALIDATED") {
      throw new ConflictException(
        `SubmissionPackage ${packageId} is already INVALIDATED.`,
      );
    }

    await this.prisma.submissionPackage.update({
      where: { id: packageId },
      data: { status: "INVALIDATED" },
    });

    if (organizationId) {
      await this.audit.record({
        organizationId,
        userId: actorId,
        eventType: "INVALIDATE_PACKAGE",
        entityType: "SubmissionPackage",
        entityId: packageId,
        oldValue: { status: pkg.status },
        newValue: { status: "INVALIDATED" },
        metadata: { reason: dto.reason },
      });
    }

    return { id: packageId, status: "INVALIDATED" };
  }
}
