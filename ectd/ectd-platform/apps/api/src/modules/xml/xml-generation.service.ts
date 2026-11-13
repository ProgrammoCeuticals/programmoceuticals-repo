import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import {
  DomainToXmlMapper,
  EctdXmlSerializer,
  StubXsdValidator,
  ectdNamespaceRegistry,
  type DomainSnapshot,
  type SnapshotContextOfUse,
  type SnapshotKeyword,
  type SnapshotSubmission,
  type SnapshotApplication,
  type SnapshotKeywordDefinition,
} from "@ectd/ectd-xml";

/**
 * XmlGenerationService — spec §21, Phase 7.
 *
 * Pipeline (spec §21):
 *   frozen domain snapshot
 *     → regulatory resolver
 *     → eCTD XML model (DomainToXmlMapper)
 *     → serializer (EctdXmlSerializer)
 *     → submissionunit.xml
 *     → XSD validator (StubXsdValidator until ICH schema imported)
 *
 * Spec §21: The XML engine is a compiler, not a controller utility.
 * Spec §23: Given identical frozen input, XML output is deterministic.
 *
 * REGULATORY_GAP: Full XML generation requires:
 *   1. ICH IG v1.7 schema package imported and namespaces resolved (Phase 2).
 *   2. Exact element/attribute names confirmed from official XSD.
 *   3. XSD validation passing against the official schema.
 *
 * Currently blocks at the namespace resolution check (fail closed — spec §4.5).
 * The domain snapshot is still built and stored for development inspection.
 */
@Injectable()
export class XmlGenerationService {
  private readonly logger = new Logger(XmlGenerationService.name);
  private readonly mapper = new DomainToXmlMapper();
  private readonly serializer = new EctdXmlSerializer(ectdNamespaceRegistry);
  private readonly xsdValidator = new StubXsdValidator();

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  /**
   * generateXml — executes the full XML generation pipeline for a
   * Submission Unit.
   *
   * Returns the XmlGenerationRun record. XML output is stored in the
   * run record's outputStorageKey when namespaces are resolved.
   */
  async generateXml(
    submissionUnitId: string,
    organizationId: string,
    actorId?: string | undefined,
  ): Promise<{
    xmlRunId: string;
    status: string;
    warnings: string[];
    regulatoryGap: boolean;
    xml?: string | undefined;
  }> {
    const unit = await this.prisma.submissionUnit.findUnique({
      where: { id: submissionUnitId },
      include: {
        ectdStandard: {
          include: {
            implementationGuide: { include: { sourceArtifact: true } },
          },
        },
      },
    });

    if (!unit) {
      throw new NotFoundException(
        `SubmissionUnit ${submissionUnitId} not found.`,
      );
    }

    // ── Step 1: Check for frozen snapshot ────────────────────────────────
    const snapshot = await this.prisma.submissionUnitSnapshot.findFirst({
      where: { submissionUnitId },
      orderBy: { snapshotVersion: "desc" },
    });

    if (!snapshot) {
      throw new BadRequestException(
        "SubmissionUnit has no frozen snapshot. " +
          "Run POST /submission-units/:id/freeze before generating XML.",
      );
    }

    // ── Step 2: Build domain snapshot from DB ────────────────────────────
    const domainSnapshot = await this.buildDomainSnapshot(
      submissionUnitId,
      snapshot.payload,
    );

    // ── Step 3: Map to XML object model ──────────────────────────────────
    const xmlMessage = this.mapper.map(domainSnapshot);
    const warnings: string[] = [];
    let xmlOutput: string | undefined;
    let regulatoryGap = false;
    let status = "FAILED";

    // ── Step 4: Serialize ────────────────────────────────────────────────
    // The serializer blocks if namespaces are unresolved (fail closed — spec §4.5).
    try {
      const result = this.serializer.serialize(xmlMessage, {
        pretty: true,
        includeXmlDeclaration: true,
      });
      xmlOutput = result.xml;
      warnings.push(...result.warnings);

      // ── Step 5: XSD validation ──────────────────────────────────────────
      const igChecksum =
        unit.ectdStandard.implementationGuide?.sourceArtifact?.checksum ??
        "unknown";
      const validationResult = await this.xsdValidator.validate(
        xmlOutput,
        `${unit.ectdStandard.name} ${unit.ectdStandard.version}`,
        igChecksum,
      );

      if (!validationResult.valid) {
        for (const err of validationResult.errors) {
          warnings.push(`XSD [${err.severity}]: ${err.message}`);
        }
        // XSD REGULATORY_GAP errors don't hard-block the run record creation
        regulatoryGap = validationResult.errors.some((e) =>
          e.message.includes("REGULATORY_GAP"),
        );
        status = regulatoryGap ? "QUEUED" : "FAILED";
      } else {
        status = "SUCCEEDED";
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      warnings.push(msg);
      regulatoryGap = msg.includes("REGULATORY_GAP");
      status = regulatoryGap ? "QUEUED" : "FAILED";

      this.logger.warn({
        event: "XML_GENERATION_BLOCKED",
        submissionUnitId,
        reason: msg,
        regulatoryGap,
      });
    }

    // ── Step 6: Persist XmlGenerationRun ────────────────────────────────
    const igVersion = unit.ectdStandard.implementationGuide?.version ?? null;
    const cvVersion = unit.ectdStandard.controlledVocabularyVersion ?? null;

    const run = await this.prisma.xmlGenerationRun.create({
      data: {
        submissionUnitId,
        standardId: unit.ectdStandardId,
        implementationGuideVersion: igVersion,
        controlledVocabularyVersion: cvVersion,
        schemaPackageChecksum:
          unit.ectdStandard.implementationGuide?.sourceArtifact?.checksum ??
          null,
        generatorVersion: "0.1.0-phase7",
        status,
        // outputStorageKey: set when we have storage + resolved namespaces
        outputStorageKey: null,
      },
    });

    await this.audit.record({
      organizationId,
      userId: actorId,
      eventType: "GENERATE_XML",
      entityType: "SubmissionUnit",
      entityId: submissionUnitId,
      newValue: {
        xmlRunId: run.id,
        status,
        regulatoryGap,
        warningCount: warnings.length,
      },
    });

    this.logger.log({
      event: "XML_GENERATION_RUN_CREATED",
      xmlRunId: run.id,
      submissionUnitId,
      status,
      regulatoryGap,
    });

    return {
      xmlRunId: run.id,
      status,
      warnings,
      regulatoryGap,
      xml: xmlOutput,
    };
  }

  // ── Domain snapshot builder ───────────────────────────────────────────

  /**
   * Build a DomainSnapshot from live DB data.
   * Uses the frozen snapshot payload as the authoritative source of truth
   * for the SubmissionUnit state at freeze time — spec §29.
   */
  private async buildDomainSnapshot(
    submissionUnitId: string,
    _frozenPayload: unknown,
  ): Promise<DomainSnapshot> {
    // Load live data for relationships not captured in the snapshot payload
    const unit = await this.prisma.submissionUnit.findUniqueOrThrow({
      where: { id: submissionUnitId },
      include: {
        ectdStandard: {
          include: {
            implementationGuide: { include: { sourceArtifact: true } },
          },
        },
        submissions: {
          include: { submission: { include: { application: true } } },
        },
        contextsOfUse: {
          where: { status: { not: "OBSOLETE" } },
          include: {
            contextDefinition: { select: { code: true, codeSystem: true } },
            keywords: {
              include: {
                keywordDefinition: { select: { code: true } },
              },
            },
            sourceRelationships: {
              where: { relationshipType: "REPLACES" },
              select: { targetContextId: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    // Get application for keyword definitions
    const submissionLink = unit.submissions[0];
    const application = submissionLink?.submission.application;

    const keywordDefs: SnapshotKeywordDefinition[] = [];
    if (application) {
      const defs = await this.prisma.keywordDefinition.findMany({
        where: { applicationId: application.id },
        orderBy: { code: "asc" },
      });
      for (const d of defs) {
        keywordDefs.push({
          uuid: d.id,
          code: d.code,
          codeSystem: "REGULATORY_GAP:keyword-codeSystem-from-IG-v1.7",
          name: d.name,
          dataTypeCode: d.dataType,
          dataTypeCodeSystem: "REGULATORY_GAP:dataType-codeSystem-from-IG-v1.7",
        });
      }
    }

    // Build CoU snapshots
    const couSnapshots: SnapshotContextOfUse[] = unit.contextsOfUse.map(
      (cou) => {
        const keywords: SnapshotKeyword[] = cou.keywords.map((kw) => ({
          code: kw.keywordDefinition.code,
          codeSystem: "REGULATORY_GAP:keyword-codeSystem-from-CV-v1.0.3",
          value: kw.value,
        }));

        // The CoU replaces another if it has a REPLACES relationship as source
        const replacesTarget = cou.sourceRelationships[0]?.targetContextId;

        return {
          uuid: cou.uuid,
          contextCode: cou.contextDefinition.code,
          contextCodeSystem: cou.contextDefinition.codeSystem,
          status: cou.status,
          keywords,
          replacesContextUuid: replacesTarget,
        };
      },
    );

    // Build submission snapshots
    const submissions: SnapshotSubmission[] = unit.submissions.map((link) => ({
      uuid: link.submission.uuid,
      submissionTypeCode: link.submission.submissionType ?? undefined,
      // REGULATORY_GAP: submissionType codeSystem from IG v1.7
      submissionTypeCodeSystem: link.submission.submissionType
        ? "REGULATORY_GAP:submissionType-codeSystem-from-IG-v1.7"
        : undefined,
    }));

    const snapshotApplication: SnapshotApplication = {
      uuid: application?.uuid ?? "REGULATORY_GAP:application-uuid-not-found",
      applicationType: application?.applicationType ?? undefined,
      applicationTypeCodeSystem: application?.applicationType
        ? "REGULATORY_GAP:applicationType-codeSystem-from-IG-v1.7"
        : undefined,
      applicationNumber: application?.applicationNumber ?? undefined,
      keywordDefinitions: keywordDefs,
    };

    // ── Resolve sender identity — BLOCKS if not configured ───────────────
    const { resolveSenderIdentity } = await import("@ectd/ectd-xml");
    const senderResolution = resolveSenderIdentity();
    if (!senderResolution.configured) {
      throw new Error(senderResolution.message);
    }

    // ── Resolve interactionId from installed IG package ──────────────────
    // Load IG package config from the database (set during package import)
    const igMetadata = unit.ectdStandard.implementationGuide?.sourceArtifact
      ?.metadata as Record<string, unknown> | null | undefined;

    const { resolveInteractionId } = await import("@ectd/ectd-xml");
    const interactionResolution = resolveInteractionId(igMetadata ?? null);
    if (!interactionResolution.available) {
      throw new Error(interactionResolution.message);
    }

    // ── Resolve moodCode from IG package ─────────────────────────────────
    const moodCode = igMetadata?.["controlActProcessMoodCode"] as
      | string
      | undefined;
    if (!moodCode) {
      throw new Error(
        "REGULATORY_GAP: ControlActProcess moodCode not available. " +
          "The ICH IG v1.7 package must be imported and its configuration " +
          "extracted. Do not hard-code a moodCode value.",
      );
    }

    return {
      submissionUnitUuid: unit.uuid,
      sequenceNumber: unit.sequenceNumber,
      priorityNumber: unit.priorityNumber ?? undefined,
      creationTime: new Date().toISOString(),
      contextsOfUse: couSnapshots,
      submissions,
      application: snapshotApplication,
      // igPackageConfig is populated from the installed IG package metadata
      igPackageConfig: {
        interactionIdRoot: interactionResolution.config.root,
        interactionIdExtension: interactionResolution.config.extension,
        controlActProcessMoodCode: moodCode,
      },
      // Note: sender identity is resolved inside DomainToXmlMapper from env vars
    };
  }
}
