import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { PrismaService } from "../database/prisma.service";

/**
 * Health endpoints — spec §45.
 *
 * GET /health/live     — liveness: is the process running?
 * GET /health/ready    — readiness: can the process serve requests?
 * GET /health          — combined summary with metrics
 * GET /health/regulatory — regulatory package registry status
 */
@ApiTags("Health")
@Controller("health")
export class HealthController {
  private readonly startedAt = new Date();

  constructor(private readonly prisma: PrismaService) {}

  @Get("live")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Liveness probe" })
  live(): { status: string; uptime: number } {
    return {
      status: "ok",
      uptime: Math.floor((Date.now() - this.startedAt.getTime()) / 1000),
    };
  }

  @Get("ready")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Readiness probe — checks database connectivity" })
  async ready(): Promise<{ status: string; database: string }> {
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: "ok", database: "connected" };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Combined health summary with metrics" })
  async health(): Promise<{
    status: string;
    timestamp: string;
    uptimeSeconds: number;
    database: string;
    metrics: Record<string, number>;
  }> {
    await this.prisma.$queryRaw`SELECT 1`;

    // Light metrics query — spec §45
    const [
      orgCount,
      userCount,
      appCount,
      docCount,
      pendingValidations,
      pendingXml,
    ] = await Promise.all([
      this.prisma.organization.count({ where: { status: "ACTIVE" } }),
      this.prisma.user.count({ where: { status: "ACTIVE" } }),
      this.prisma.regulatoryApplication.count({ where: { status: "DRAFT" } }),
      this.prisma.document.count(),
      this.prisma.validationRun.count({ where: { status: "QUEUED" } }),
      this.prisma.xmlGenerationRun.count({ where: { status: "QUEUED" } }),
    ]);

    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor((Date.now() - this.startedAt.getTime()) / 1000),
      database: "connected",
      metrics: {
        activeOrganizations: orgCount,
        activeUsers: userCount,
        draftApplications: appCount,
        totalDocuments: docCount,
        pendingValidationJobs: pendingValidations,
        pendingXmlJobs: pendingXml,
      },
    };
  }

  @Get("regulatory")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Regulatory package registry status — spec §45" })
  async regulatory(): Promise<{
    status: string;
    activeStandards: number;
    activeArtifacts: number;
    importingArtifacts: number;
    failedArtifacts: number;
    standardsWithIg: number;
    standardsWithCv: number;
    namespacesResolved: boolean;
    senderIdentityConfigured: boolean;
    gaps: string[];
  }> {
    const [activeStandards, activeArtifacts, importing, failed, withIg, withCv] =
      await Promise.all([
        this.prisma.ectdStandard.count({ where: { status: "ACTIVE" } }),
        this.prisma.regulatoryArtifact.count({ where: { status: "ACTIVE" } }),
        this.prisma.regulatoryArtifact.count({ where: { status: "IMPORTING" } }),
        this.prisma.regulatoryArtifact.count({ where: { status: "FAILED" } }),
        this.prisma.ectdStandard.count({
          where: { status: "ACTIVE", implementationGuideId: { not: null } },
        }),
        this.prisma.ectdStandard.count({
          where: {
            status: "ACTIVE",
            controlledVocabularyLinks: { some: {} },
          },
        }),
      ]);

    // Check namespace resolution — spec §22
    const { ectdNamespaceRegistry } = await import("@ectd/ectd-xml");
    const namespacesResolved = ectdNamespaceRegistry.allResolved();
    const unresolvedNamespaces = ectdNamespaceRegistry.getUnresolvedNamespaces();

    // Check sender identity — spec §40
    const { resolveSenderIdentity } = await import("@ectd/ectd-xml");
    const senderResolution = resolveSenderIdentity();

    const gaps: string[] = [];
    if (!namespacesResolved) {
      gaps.push(
        `REGULATORY_GAP: Unresolved XML namespaces: ${unresolvedNamespaces.join(", ")}. ` +
          "Import and activate the ICH IG v1.7 schema package.",
      );
    }
    if (!senderResolution.configured) {
      gaps.push("SENDER_IDENTITY_NOT_CONFIGURED: Set ECTD_SENDER_OID and ECTD_SENDER_NAME.");
    }
    if (activeStandards > 0 && withIg === 0) {
      gaps.push(
        "REGULATORY_GAP: No active EctdStandard has a linked Implementation Guide. " +
          "Import the ICH IG v1.7 package and link it via POST /regulatory/standards/:id/link-implementation-guide.",
      );
    }
    if (activeStandards > 0 && withCv === 0) {
      gaps.push(
        "REGULATORY_GAP: No active EctdStandard has a linked Controlled Vocabulary package. " +
          "Import the ICH CV v1.0.3 package and link it via POST /regulatory/standards/:id/link-controlled-vocabulary.",
      );
    }

    const overallStatus =
      gaps.length === 0 ? "ok" :
      activeStandards === 0 ? "no_active_standards" :
      "gaps_present";

    return {
      status: overallStatus,
      activeStandards,
      activeArtifacts,
      importingArtifacts: importing,
      failedArtifacts: failed,
      standardsWithIg: withIg,
      standardsWithCv: withCv,
      namespacesResolved,
      senderIdentityConfigured: senderResolution.configured,
      gaps,
    };
  }
}
