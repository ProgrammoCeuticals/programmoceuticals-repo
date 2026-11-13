import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { CtdService } from "./ctd.service";
import {
  RegisterCtdPackageDto,
  CreateCtdSectionDto,
  CreateContextDefinitionDto,
} from "./dto/ctd.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

/**
 * CTD Structure endpoints — spec §13.
 *
 * CTD structure is configuration. Read access is open to authenticated
 * users. Write operations require auth (Super Admin in production).
 *
 * REGULATORY_GAP: Context definition codes must come from authoritative
 * ICH CTD structure package — the API validates codes exist in the
 * database but cannot enforce regulatory correctness until the package
 * is imported.
 */
@ApiTags("CTD Structure")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("ctd")
export class CtdController {
  constructor(private readonly service: CtdService) {}

  // ── Packages ─────────────────────────────────────────────────────────

  @Get("packages")
  @ApiOperation({ summary: "List active CTD structure packages" })
  getPackages() {
    return this.service.getPackages();
  }

  @Get("packages/:id")
  @ApiOperation({ summary: "Get CTD structure package by ID" })
  getPackage(@Param("id") id: string) {
    return this.service.getPackageById(id);
  }

  @Post("packages")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Register a CTD structure package" })
  registerPackage(@Body() dto: RegisterCtdPackageDto) {
    return this.service.registerPackage(dto);
  }

  @Post("packages/:id/seed-ich-baseline")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "[Command] Seed ICH baseline CTD modules (1–5) into a package",
    description:
      "Seeds the five ICH CTD modules with baseline titles. " +
      "Does not seed sections or context definitions — those require the " +
      "official ICH CTD structure package to be imported.",
  })
  seedIchBaseline(@Param("id") id: string) {
    return this.service.seedIchBaselineModules(id);
  }

  // ── Modules ──────────────────────────────────────────────────────────

  @Get("packages/:id/modules")
  @ApiOperation({ summary: "List CTD modules for a package" })
  getModules(@Param("id") id: string) {
    return this.service.getModules(id);
  }

  // ── Sections ─────────────────────────────────────────────────────────

  @Get("packages/:id/sections")
  @ApiOperation({ summary: "List all sections (flat) for a package" })
  getSections(@Param("id") id: string) {
    return this.service.getSections(id);
  }

  @Get("packages/:id/sections/tree")
  @ApiOperation({ summary: "Get section hierarchy tree for a package" })
  getSectionTree(@Param("id") id: string) {
    return this.service.getSectionTree(id);
  }

  @Post("packages/:id/sections")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create a CTD section",
    description:
      "REGULATORY_GAP: Section codes must come from the authoritative " +
      "ICH CTD structure package. Do not invent codes.",
  })
  createSection(
    @Param("id") packageId: string,
    @Body() dto: CreateCtdSectionDto,
  ) {
    return this.service.createSection({ packageId, ...dto });
  }

  // ── Context Definitions ──────────────────────────────────────────────

  @Get("packages/:id/context-definitions")
  @ApiOperation({ summary: "List all context definitions for a package" })
  getContextDefinitions(@Param("id") id: string) {
    return this.service.getContextDefinitions(id);
  }

  @Get("context-definitions/:id")
  @ApiOperation({ summary: "Get a single context definition by ID" })
  getContextDefinition(@Param("id") id: string) {
    return this.service.getContextDefinitionById(id);
  }

  @Post("packages/:id/context-definitions")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create a context definition",
    description:
      "REGULATORY_GAP: Codes and code systems must come from the " +
      "authoritative ICH eCTD v4.0 controlled vocabulary.",
  })
  createContextDefinition(
    @Param("id") packageId: string,
    @Body() dto: CreateContextDefinitionDto,
  ) {
    return this.service.createContextDefinition({
      structurePackageId: packageId,
      ...dto,
    });
  }
}
