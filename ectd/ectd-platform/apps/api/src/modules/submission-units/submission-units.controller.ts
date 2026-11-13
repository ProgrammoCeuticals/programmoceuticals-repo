import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Headers,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { SubmissionUnitsService } from "./submission-units.service";
import {
  CreateSubmissionUnitDto,
  ValidateSubmissionUnitDto,
  PublishSubmissionUnitDto,
} from "./dto/submission-unit.dto";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { OrganizationScopeGuard } from "../../common/guards/organization-scope.guard";
import { PermissionGuard, RequirePermission } from "../../common/guards/permission.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtPayload } from "../auth/auth.service";

/**
 * Submission Units — spec §29, §33.
 * All lifecycle operations are explicit domain commands, never PATCH status.
 */
@ApiTags("Submission Units")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, OrganizationScopeGuard, PermissionGuard)
@Controller()
export class SubmissionUnitsController {
  constructor(private readonly service: SubmissionUnitsService) {}

  @Post("submissions/:subId/submission-units")
  @ApiOperation({ summary: "Create a submission unit under a submission" })
  create(
    @Param("subId") subId: string,
    @Body() dto: CreateSubmissionUnitDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.create(subId, user.orgId!, dto, user.sub);
  }

  @Get("submissions/:subId/submission-units")
  @ApiOperation({
    summary: "List submission units for a submission (paginated)",
  })
  findBySubmission(
    @Param("subId") subId: string,
    @CurrentUser() user: JwtPayload,
    @Query() pagination: PaginationDto,
  ) {
    return this.service.findBySubmission(
      subId,
      user.orgId!,
      pagination.page,
      pagination.pageSize,
    );
  }

  @Get("submission-units/:id")
  @ApiOperation({ summary: "Get submission unit by ID" })
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post("submission-units/:id/freeze")
  @HttpCode(HttpStatus.OK)
  @RequirePermission("SUBMISSION_MANAGE")
  @ApiOperation({
    summary: "[Command] Freeze — create immutable snapshot of current state",
    description: "Required before validation, XML generation, and publishing.",
  })
  freeze(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    return this.service.freeze(id, user.orgId!, user.sub);
  }

  @Post("submission-units/:id/validate")
  @HttpCode(HttpStatus.ACCEPTED)
  @RequirePermission("SUBMISSION_MANAGE")
  @ApiOperation({
    summary: "[Command] Enqueue validation run",
    description:
      "Queues a VALIDATE_SUBMISSION_UNIT job. Full engine is Phase 8. " +
      "Requires ValidationProfile ID. Supports Idempotency-Key header.",
  })
  validate(
    @Param("id") id: string,
    @Body() dto: ValidateSubmissionUnitDto,
    @CurrentUser() user: JwtPayload,
    @Headers("idempotency-key") idempotencyKey?: string,
  ) {
    return this.service.validate(id, dto, user.orgId!, user.sub, idempotencyKey);
  }

  @Post("submission-units/:id/generate-xml")
  @HttpCode(HttpStatus.ACCEPTED)
  @RequirePermission("SUBMISSION_MANAGE")
  @ApiOperation({
    summary: "[Command] Enqueue XML generation",
    description:
      "Queues a GENERATE_XML job to the publishing worker. " +
      "Requires a frozen snapshot. Supports Idempotency-Key header.",
  })
  generateXml(
    @Param("id") id: string,
    @CurrentUser() user: JwtPayload,
    @Headers("idempotency-key") idempotencyKey?: string,
  ) {
    return this.service.generateXml(id, user.orgId!, user.sub, idempotencyKey);
  }

  @Post("submission-units/:id/prepare-publication")
  @HttpCode(HttpStatus.OK)
  @RequirePermission("PUBLISH")
  @ApiOperation({
    summary: "[Command] Run publish gate checks (non-destructive)",
    description: "Returns readiness status and list of blocking issues.",
  })
  preparePublication(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    return this.service.preparePublication(id, user.orgId!);
  }

  @Post("submission-units/:id/publish")
  @HttpCode(HttpStatus.ACCEPTED)
  @RequirePermission("PUBLISH")
  @ApiOperation({
    summary: "[Command] Publish submission unit — full pipeline (Phase 9)",
    description:
      "Runs publish gate then invokes the full publication pipeline. " +
      "This is NOT a PATCH status change — spec §33.",
  })
  publish(
    @Param("id") id: string,
    @Body() dto: PublishSubmissionUnitDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.publish(id, dto, user.orgId!, user.sub);
  }
}
