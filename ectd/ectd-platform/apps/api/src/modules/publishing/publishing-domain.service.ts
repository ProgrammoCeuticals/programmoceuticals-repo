import { Injectable } from "@nestjs/common";
import { PublishingService } from "./publishing.service";

/**
 * PublishingDomainService — spec §30–§32.
 *
 * Thin facade used by the controller. Delegates all operations
 * to PublishingService which owns persistence, storage, and audit.
 */
@Injectable()
export class PublishingDomainService {
  constructor(
    private readonly publishingService: PublishingService,
  ) {}

  async getPackagesForUnit(submissionUnitId: string) {
    return this.publishingService.findPackagesBySubmissionUnit(submissionUnitId);
  }

  async getPackage(id: string) {
    return this.publishingService.findPackage(id);
  }

  async getManifest(id: string) {
    return this.publishingService.getManifest(id);
  }

  async getDownloadRef(id: string) {
    return this.publishingService.getDownloadRef(id);
  }

  /**
   * invalidate — explicit command. Marks a package as INVALIDATED.
   * A generated package is not the same as a transmitted submission — spec §32.
   */
  async invalidate(
    id: string,
    organizationId: string,
    reason: string,
    actorId?: string,
  ): Promise<{ id: string; status: string }> {
    return this.publishingService.invalidate(
      id,
      { reason },
      actorId,
      organizationId,
    );
  }
}
