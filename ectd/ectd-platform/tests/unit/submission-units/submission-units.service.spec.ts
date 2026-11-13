/**
 * Unit tests — SubmissionUnitsService
 * spec §29, §33, §36, §39, §49.
 *
 * Tests cover:
 *   freeze:
 *     + creates snapshot with incremented version
 *     + records FREEZE_SUBMISSION_UNIT audit event
 *     - PUBLISHED unit throws ConflictException
 *     - unit not in org throws NotFoundException
 *
 *   validate:
 *     + creates ValidationRun with status QUEUED
 *     + enqueues VALIDATE_SUBMISSION_UNIT with runId/organizationId/actorId
 *     + returns existing run on duplicate idempotency key — spec §36
 *     - PUBLISHED unit throws ConflictException
 *     - inactive profile throws BadRequestException
 *     - missing profile throws BadRequestException
 *     + records RUN_VALIDATION audit event
 *
 *   generateXml:
 *     + creates XmlGenerationRun with status QUEUED
 *     + enqueues GENERATE_XML with organizationId/actorId
 *     + returns existing run on duplicate idempotency key — spec §36
 *     - no snapshot throws BadRequestException — spec §21
 *     - PUBLISHED unit throws ConflictException
 *     + records GENERATE_XML audit event
 */

import {
  ConflictException,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { SubmissionUnitsService } from "../../../apps/api/src/modules/submission-units/submission-units.service";

// ── Test double builders ──────────────────────────────────────────────────

function makeUnit(overrides: Record<string, unknown> = {}) {
  return {
    id: "unit-1",
    uuid: "uuid-unit-1",
    sequenceNumber: 1,
    priorityNumber: null,
    status: "DRAFT",
    ectdStandardId: "std-1",
    regionalSpecificationId: null,
    ctdStructurePackageId: null,
    ...overrides,
  };
}

function makePrisma(overrides: Record<string, unknown> = {}) {
  return {
    submissionUnit: {
      findUnique: jest.fn().mockResolvedValue(makeUnit()),
      create: jest.fn().mockResolvedValue(makeUnit()),
    },
    submissionSubmissionUnit: {
      findFirst: jest.fn().mockResolvedValue({ id: "link-1" }),
      findMany: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockResolvedValue({}),
      count: jest.fn().mockResolvedValue(0),
    },
    submissionUnitSnapshot: {
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest
        .fn()
        .mockResolvedValue({ id: "snap-1", snapshotVersion: 1 }),
    },
    validationProfile: {
      findUnique: jest.fn().mockResolvedValue({
        id: "profile-1",
        active: true,
        rulesetVersion: "1.0",
      }),
    },
    validationRun: {
      create: jest.fn().mockResolvedValue({ id: "run-1" }),
    },
    xmlGenerationRun: {
      create: jest.fn().mockResolvedValue({ id: "xml-run-1" }),
    },
    job: {
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({}),
    },
    ectdStandard: {
      findUnique: jest.fn().mockResolvedValue({
        id: "std-1",
        name: "eCTD v4.0",
        version: "4.0",
        implementationGuide: null,
      }),
    },
    regulatoryStandardCvLink: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    contextOfUse: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    submission: {
      findFirst: jest
        .fn()
        .mockResolvedValue({ id: "sub-1", applicationId: "app-1" }),
    },
    ...overrides,
  };
}

function makeAudit() {
  return { record: jest.fn().mockResolvedValue(undefined) };
}

function makeJobQueue() {
  return { enqueue: jest.fn().mockResolvedValue(undefined) };
}

function makePublishingEngine() {
  return {
    preparePublication: jest
      .fn()
      .mockResolvedValue({ ready: true, issues: [] }),
    publish: jest.fn().mockResolvedValue({
      packageId: "pkg-1",
      status: "READY_FOR_TRANSMISSION",
      readyForTransmission: true,
      packageChecksum: "abc",
      steps: [],
    }),
  };
}

function makeService(prismaOverrides: Record<string, unknown> = {}) {
  const prisma = makePrisma(prismaOverrides);
  const audit = makeAudit();
  const jobQueue = makeJobQueue();
  const publishingEngine = makePublishingEngine();
  const service = new SubmissionUnitsService(
    prisma as any,
    audit as any,
    publishingEngine as any,
    jobQueue as any,
  );
  return { service, prisma, audit, jobQueue };
}

// ── freeze ────────────────────────────────────────────────────────────────

describe("SubmissionUnitsService.freeze (spec §29)", () => {
  it("should create a snapshot and return snapshotId + snapshotVersion", async () => {
    const { service, prisma } = makeService();

    const result = await service.freeze("unit-1", "org-1", "user-1");

    expect(prisma.submissionUnitSnapshot.create).toHaveBeenCalled();
    expect(result.snapshotId).toBe("snap-1");
    expect(result.snapshotVersion).toBe(1);
  });

  it("should start at version 1 when no prior snapshot exists", async () => {
    const { service, prisma } = makeService();
    (prisma.submissionUnitSnapshot.findFirst as jest.Mock).mockResolvedValue(
      null,
    );

    await service.freeze("unit-1", "org-1", "user-1");

    const call = (prisma.submissionUnitSnapshot.create as jest.Mock).mock
      .calls[0][0];
    expect(call.data.snapshotVersion).toBe(1);
  });

  it("should increment snapshotVersion from last snapshot", async () => {
    const { service, prisma } = makeService();
    (prisma.submissionUnitSnapshot.findFirst as jest.Mock).mockResolvedValue({
      snapshotVersion: 3,
    });
    (prisma.submissionUnitSnapshot.create as jest.Mock).mockResolvedValue({
      id: "snap-4",
      snapshotVersion: 4,
    });

    const result = await service.freeze("unit-1", "org-1", "user-1");

    const call = (prisma.submissionUnitSnapshot.create as jest.Mock).mock
      .calls[0][0];
    expect(call.data.snapshotVersion).toBe(4);
    expect(result.snapshotVersion).toBe(4);
  });

  it("should record FREEZE_SUBMISSION_UNIT audit event", async () => {
    const { service, audit } = makeService();

    await service.freeze("unit-1", "org-1", "user-1");

    expect(audit.record).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "FREEZE_SUBMISSION_UNIT",
        entityId: "unit-1",
        organizationId: "org-1",
      }),
    );
  });

  it("should throw ConflictException when unit is PUBLISHED", async () => {
    const { service, prisma } = makeService();
    (prisma.submissionUnit.findUnique as jest.Mock).mockResolvedValue(
      makeUnit({ status: "PUBLISHED" }),
    );

    await expect(
      service.freeze("unit-1", "org-1", "user-1"),
    ).rejects.toThrow(ConflictException);
  });

  it("should throw NotFoundException when unit not in org", async () => {
    const { service, prisma } = makeService();
    (prisma.submissionSubmissionUnit.findFirst as jest.Mock).mockResolvedValue(
      null,
    );

    await expect(
      service.freeze("unit-1", "wrong-org", "user-1"),
    ).rejects.toThrow(NotFoundException);
  });
});

// ── validate ──────────────────────────────────────────────────────────────

describe("SubmissionUnitsService.validate (spec §33, §36, §39)", () => {
  it("should create a ValidationRun with status QUEUED", async () => {
    const { service, prisma } = makeService();

    const result = await service.validate(
      "unit-1",
      { validationProfileId: "profile-1" },
      "org-1",
      "user-1",
    );

    expect(prisma.validationRun.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "QUEUED" }),
      }),
    );
    expect(result.status).toBe("QUEUED");
    expect(result.validationRunId).toBe("run-1");
  });

  it("should enqueue VALIDATE_SUBMISSION_UNIT with runId, organizationId, actorId — spec §39", async () => {
    const { service, jobQueue } = makeService();

    await service.validate(
      "unit-1",
      { validationProfileId: "profile-1" },
      "org-1",
      "user-1",
    );

    expect(jobQueue.enqueue).toHaveBeenCalledWith(
      "VALIDATE_SUBMISSION_UNIT",
      expect.objectContaining({
        submissionUnitId: "unit-1",
        runId: "run-1",
        validationProfileId: "profile-1",
        organizationId: "org-1",
        actorId: "user-1",
      }),
      expect.anything(),
    );
  });

  it("should return existing run on duplicate idempotency key — spec §36", async () => {
    const { service, prisma, jobQueue } = makeService();
    (prisma.job.findUnique as jest.Mock).mockResolvedValue({
      payload: { validationRunId: "existing-run-99" },
    });

    const result = await service.validate(
      "unit-1",
      { validationProfileId: "profile-1" },
      "org-1",
      "user-1",
      "idem-key-abc",
    );

    expect(result.validationRunId).toBe("existing-run-99");
    expect(result.status).toBe("QUEUED");
    expect(jobQueue.enqueue).not.toHaveBeenCalled();
    expect(prisma.validationRun.create).not.toHaveBeenCalled();
  });

  it("should throw ConflictException when unit is PUBLISHED", async () => {
    const { service, prisma } = makeService();
    (prisma.submissionUnit.findUnique as jest.Mock).mockResolvedValue(
      makeUnit({ status: "PUBLISHED" }),
    );

    await expect(
      service.validate(
        "unit-1",
        { validationProfileId: "profile-1" },
        "org-1",
      ),
    ).rejects.toThrow(ConflictException);
  });

  it("should throw BadRequestException when profile is inactive", async () => {
    const { service, prisma } = makeService();
    (prisma.validationProfile.findUnique as jest.Mock).mockResolvedValue({
      id: "profile-1",
      active: false,
    });

    await expect(
      service.validate(
        "unit-1",
        { validationProfileId: "profile-1" },
        "org-1",
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it("should throw BadRequestException when profile not found", async () => {
    const { service, prisma } = makeService();
    (prisma.validationProfile.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      service.validate("unit-1", { validationProfileId: "missing" }, "org-1"),
    ).rejects.toThrow(BadRequestException);
  });

  it("should record RUN_VALIDATION audit event", async () => {
    const { service, audit } = makeService();

    await service.validate(
      "unit-1",
      { validationProfileId: "profile-1" },
      "org-1",
      "user-1",
    );

    expect(audit.record).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "RUN_VALIDATION",
        entityId: "unit-1",
        organizationId: "org-1",
      }),
    );
  });
});

// ── generateXml ───────────────────────────────────────────────────────────

describe("SubmissionUnitsService.generateXml (spec §21, §33, §36, §39)", () => {
  it("should create an XmlGenerationRun with status QUEUED", async () => {
    const { service, prisma } = makeService();
    (prisma.submissionUnitSnapshot.findFirst as jest.Mock).mockResolvedValue({
      id: "snap-1",
    });

    const result = await service.generateXml("unit-1", "org-1", "user-1");

    expect(prisma.xmlGenerationRun.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "QUEUED" }),
      }),
    );
    expect(result.status).toBe("QUEUED");
    expect(result.xmlRunId).toBe("xml-run-1");
  });

  it("should enqueue GENERATE_XML with organizationId and actorId — spec §39", async () => {
    const { service, prisma, jobQueue } = makeService();
    (prisma.submissionUnitSnapshot.findFirst as jest.Mock).mockResolvedValue({
      id: "snap-1",
    });

    await service.generateXml("unit-1", "org-1", "user-1");

    expect(jobQueue.enqueue).toHaveBeenCalledWith(
      "GENERATE_XML",
      expect.objectContaining({
        submissionUnitId: "unit-1",
        organizationId: "org-1",
        actorId: "user-1",
      }),
      expect.anything(),
    );
  });

  it("should throw BadRequestException when no snapshot exists — spec §21", async () => {
    const { service, prisma } = makeService();
    (prisma.submissionUnitSnapshot.findFirst as jest.Mock).mockResolvedValue(
      null,
    );

    await expect(
      service.generateXml("unit-1", "org-1"),
    ).rejects.toThrow(BadRequestException);
  });

  it("should return existing run on duplicate idempotency key — spec §36", async () => {
    const { service, prisma, jobQueue } = makeService();
    (prisma.submissionUnitSnapshot.findFirst as jest.Mock).mockResolvedValue({
      id: "snap-1",
    });
    (prisma.job.findUnique as jest.Mock).mockResolvedValue({
      payload: { xmlRunId: "existing-xml-99" },
    });

    const result = await service.generateXml(
      "unit-1",
      "org-1",
      "user-1",
      "idem-key-xyz",
    );

    expect(result.xmlRunId).toBe("existing-xml-99");
    expect(result.status).toBe("QUEUED");
    expect(jobQueue.enqueue).not.toHaveBeenCalled();
    expect(prisma.xmlGenerationRun.create).not.toHaveBeenCalled();
  });

  it("should throw ConflictException when unit is PUBLISHED", async () => {
    const { service, prisma } = makeService();
    (prisma.submissionUnit.findUnique as jest.Mock).mockResolvedValue(
      makeUnit({ status: "PUBLISHED" }),
    );

    await expect(
      service.generateXml("unit-1", "org-1"),
    ).rejects.toThrow(ConflictException);
  });

  it("should record GENERATE_XML audit event", async () => {
    const { service, prisma, audit } = makeService();
    (prisma.submissionUnitSnapshot.findFirst as jest.Mock).mockResolvedValue({
      id: "snap-1",
    });

    await service.generateXml("unit-1", "org-1", "user-1");

    expect(audit.record).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "GENERATE_XML",
        entityId: "unit-1",
        organizationId: "org-1",
      }),
    );
  });
});
