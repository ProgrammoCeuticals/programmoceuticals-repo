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
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { ContextsOfUseService } from "./contexts-of-use.service";
import {
  CreateContextOfUseDto,
  SuspendContextOfUseDto,
  ReplaceContextOfUseDto,
} from "./dto/context-of-use.dto";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { OrganizationScopeGuard } from "../../common/guards/organization-scope.guard";
import { PermissionGuard, RequirePermission } from "../../common/guards/permission.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtPayload } from "../auth/auth.service";

/**
 * Contexts of Use — spec §14, §15, §29, §33.
 *
 * suspend and replace are explicit domain commands, NOT PATCH status changes.
 * Suspension is irreversible under the ICH lifecycle model.
 */
@ApiTags("Contexts of Use")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, OrganizationScopeGuard, PermissionGuard)
@Controller()
export class ContextsOfUseController {
  constructor(private readonly service: ContextsOfUseService) {}

  @Post("submission-units/:unitId/contexts-of-use")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Assign a document to a CTD context within a submission unit",
  })
  create(
    @Param("unitId") unitId: string,
    @Body() dto: CreateContextOfUseDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.create(unitId, user.orgId!, dto, user.sub);
  }

  @Get("submission-units/:unitId/contexts-of-use")
  @ApiOperation({
    summary: "List contexts of use for a submission unit (paginated)",
  })
  findByUnit(
    @Param("unitId") unitId: string,
    @CurrentUser() user: JwtPayload,
    @Query() pagination: PaginationDto,
  ) {
    return this.service.findBySubmissionUnit(
      unitId,
      user.orgId!,
      pagination.page,
      pagination.pageSize,
    );
  }

  @Get("contexts-of-use/:id")
  @ApiOperation({
    summary: "Get context of use by ID (with keywords and lifecycle)",
  })
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post("contexts-of-use/:id/suspend")
  @HttpCode(HttpStatus.OK)
  @RequirePermission("LIFECYCLE_MANAGE")
  @ApiOperation({
    summary: "[Command] Suspend context of use — IRREVERSIBLE — spec §15",
    description:
      "Only ACTIVE CoUs can be suspended. " +
      "Suspension is irreversible under the ICH lifecycle model. " +
      "No reactivation command exists.",
  })
  suspend(
    @Param("id") id: string,
    @Body() dto: SuspendContextOfUseDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.suspend(id, user.orgId!, dto, user.sub);
  }

  @Post("contexts-of-use/:id/replace")
  @HttpCode(HttpStatus.OK)
  @RequirePermission("LIFECYCLE_MANAGE")
  @ApiOperation({
    summary: "[Command] Record replacement relationship for a context of use",
    description:
      "Records that replacingContextOfUseId replaces this CoU. " +
      "Full cardinality/context-group rules enforced in Phase 6.",
  })
  replace(
    @Param("id") id: string,
    @Body() dto: ReplaceContextOfUseDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.replace(id, user.orgId!, dto, user.sub);
  }

  @Get("contexts-of-use/:id/lifecycle")
  @ApiOperation({
    summary: "Get lifecycle operation history for a context of use",
  })
  getLifecycle(@Param("id") id: string) {
    return this.service.getLifecycle(id);
  }
}
