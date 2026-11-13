import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";
import { RegulatoryService } from "./regulatory.service";
import {
  ImportPackageDto,
  ActivatePackageDto,
  RegisterEctdStandardDto,
  RegisterRegionalSpecDto,
} from "./dto/regulatory.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard, RequirePermission } from "../../common/guards/permission.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtPayload } from "../auth/auth.service";

/**
 * Regulatory controller — spec §29, Phase 2.
 *
 * All import/activation operations are explicit domain commands.
 * The regulatory package registry is the source of truth for all
 * downstream engines (validation, XML, publishing).
 */
@ApiTags("Regulatory")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller("regulatory")
export class RegulatoryController {
  constructor(private readonly service: RegulatoryService) {}

  // ── Read endpoints ───────────────────────────────────────────────────────

  @Get("standards")
  @ApiOperation({ summary: "List active eCTD standards" })
  getStandards() {
    return this.service.getStandards();
  }

  @Get("standards/:id")
  @ApiOperation({ summary: "Get eCTD standard by ID" })
  getStandard(@Param("id") id: string) {
    return this.service.getStandardById(id);
  }

  @Get("regions")
  @ApiOperation({ summary: "List regulatory regions" })
  getRegions() {
    return this.service.getRegions();
  }

  @Get("authorities")
  @ApiOperation({ summary: "List regulatory authorities" })
  getAuthorities() {
    return this.service.getAuthorities();
  }

  @Get("regional-readiness")
  @ApiOperation({
    summary: "Get eCTD v4.0 regional readiness status for all known regions",
    description:
      "Returns the production-readiness status for each region. " +
      "A region is only PRODUCTION_READY when its authoritative " +
      "regional package has been imported and validated. " +
      "NAFDAC/Nigeria is NOT_CONFIGURED until an authoritative " +
      "NAFDAC eCTD v4.0 specification is published.",
  })
  getRegionalReadiness() {
    return this.service.getRegionalReadiness();
  }

  @Get("regional-readiness/:regionCode/:authorityCode")
  @ApiOperation({
    summary: "Get eCTD v4.0 readiness for a specific region/authority",
  })
  getRegionalReadinessFor(
    @Param("regionCode") regionCode: string,
    @Param("authorityCode") authorityCode: string,
  ) {
    return this.service.getRegionalReadinessFor(regionCode, authorityCode);
  }

  @Get("specifications")
  @ApiOperation({ summary: "List active regional specifications" })
  getSpecifications() {
    return this.service.getSpecifications();
  }

  @Get("validation-profiles")
  @ApiOperation({ summary: "List active validation profiles" })
  getValidationProfiles() {
    return this.service.getValidationProfiles();
  }

  @Get("code-systems")
  @ApiOperation({ summary: "List code systems" })
  getCodeSystems() {
    return this.service.getCodeSystems();
  }

  @Get("code-lists")
  @ApiOperation({ summary: "List code lists (with latest version)" })
  getCodeLists() {
    return this.service.getCodeLists();
  }

  @Get("code-lists/:id/values")
  @ApiOperation({
    summary: "Get code list values for a specific code list and version",
  })
  @ApiQuery({ name: "version", required: false })
  getCodeListValues(
    @Param("id") id: string,
    @Query("version") version?: string,
  ) {
    return this.service.getCodeListValues(id, version);
  }

  @Get("artifacts")
  @ApiOperation({ summary: "List imported regulatory artifacts" })
  @ApiQuery({
    name: "status",
    required: false,
    description: "Filter by status (ACTIVE, IMPORTING, FAILED, ...)",
  })
  getArtifacts(@Query("status") status?: string) {
    return this.service.getArtifacts(status);
  }

  @Get("artifacts/:id")
  @ApiOperation({ summary: "Get artifact by ID" })
  getArtifact(@Param("id") id: string) {
    return this.service.getArtifactById(id);
  }

  // ── Import pipeline ──────────────────────────────────────────────────────

  /**
   * [Command] Import a regulatory package archive.
   *
   * The archive must already be uploaded to the storage root.
   * Pipeline: verify checksum -> validate structure -> register as IMPORTING.
   * Activation is a separate explicit command — spec §3.
   */
  @Post("packages/import")
  @HttpCode(HttpStatus.CREATED)
  @RequirePermission("REGULATORY_ADMIN")
  @ApiOperation({
    summary: "[Command] Import regulatory package — full pipeline",
    description:
      "Verifies SHA-256 checksum, validates archive structure, registers as IMPORTING. " +
      "Activation is a separate explicit step. A failed import never partially activates.",
  })
  @ApiResponse({ status: 201, description: "Import pipeline result" })
  @ApiResponse({ status: 400, description: "Bad request or checksum mismatch" })
  importPackage(
    @Body() dto: ImportPackageDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.importPackage(dto, user.orgId ?? "", user.sub);
  }

  /**
   * [Command] Activate an imported regulatory package.
   *
   * Runs consistency checks before activation.
   * Only IMPORTED (not IMPORTING/FAILED) packages can be activated.
   * spec §3.
   */
  @Post("packages/:id/activate")
  @HttpCode(HttpStatus.OK)
  @RequirePermission("REGULATORY_ADMIN")
  @ApiOperation({
    description:
      "Runs consistency checks then sets status to ACTIVE. " +
      "Only call this after the import pipeline succeeds.",
  })
  activatePackage(
    @Param("id") id: string,
    @Body() dto: ActivatePackageDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.activatePackage(id, dto, user.orgId ?? "", user.sub);
  }

  /**
   * [Command] Supersede an older package version.
   * Does NOT delete it — historical packages remain available.
   */
  @Post("packages/:id/supersede")
  @HttpCode(HttpStatus.OK)
  @RequirePermission("REGULATORY_ADMIN")
  @ApiOperation({
    description:
      "Old packages are never deleted — they remain for historical validation.",
  })
  supersedePackage(
    @Param("id") id: string,
    @Body() body: { reason?: string },
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.supersedePackage(
      id,
      body.reason,
      user.orgId ?? "",
      user.sub,
    );
  }

  // ── Standard / specification registration ────────────────────────────────

  @Post("standards")
  @HttpCode(HttpStatus.CREATED)
  @RequirePermission("REGULATORY_ADMIN")
  @ApiOperation({ summary: "Register an eCTD standard" })
  registerStandard(
    @Body() dto: RegisterEctdStandardDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.registerEctdStandard(dto, user.orgId ?? "", user.sub);
  }

  @Post("standards/:id/link-implementation-guide")
  @HttpCode(HttpStatus.OK)
  @RequirePermission("REGULATORY_ADMIN")
  @ApiOperation({
    summary: "[Command] Link an activated IG artifact to an eCTD standard",
  })
  linkImplementationGuide(
    @Param("id") standardId: string,
    @Body() body: { artifactId: string },
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.linkImplementationGuide(
      standardId,
      body.artifactId,
      user.orgId ?? "",
      user.sub,
    );
  }

  @Post("standards/:id/link-controlled-vocabulary")
  @HttpCode(HttpStatus.OK)
  @RequirePermission("REGULATORY_ADMIN")
  @ApiOperation({
    summary: "[Command] Link an activated CV artifact to an eCTD standard",
  })
  linkControlledVocabulary(
    @Param("id") standardId: string,
    @Body() body: { artifactId: string },
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.linkControlledVocabulary(
      standardId,
      body.artifactId,
      user.orgId ?? "",
      user.sub,
    );
  }

  @Post("specifications")
  @HttpCode(HttpStatus.CREATED)
  @RequirePermission("REGULATORY_ADMIN")
  @ApiOperation({
    summary: "Register a regional specification profile",
    description:
      "NAFDAC may be registered as region+authority but must not have a " +
      "fabricated spec — only register with an authoritative specification source.",
  })
  registerSpecification(
    @Body() dto: RegisterRegionalSpecDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.registerRegionalSpecification(
      dto,
      user.orgId ?? "",
      user.sub,
    );
  }

  /**
   * Resolve the exact regulatory profile for a Submission Unit.
   * Used for debugging and verification — the same resolution is used
   * internally by validation and XML generation.
   */
  @Get("resolve-profile/:submissionUnitId")
  @ApiOperation({
    summary: "Resolve regulatory profile for a Submission Unit",
    description:
      "Returns the exact pinned package versions and checksums that will be used " +
      "for validation and XML generation. Fails closed if any package is missing.",
  })
  resolveProfile(@Param("submissionUnitId") id: string) {
    return this.service.resolveProfile(id);
  }
}
