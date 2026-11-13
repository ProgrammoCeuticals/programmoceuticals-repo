import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { SubmissionsService } from "./submissions.service";
import { CreateSubmissionDto, UpdateSubmissionDto } from "./dto/submission.dto";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { OrganizationScopeGuard } from "../../common/guards/organization-scope.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtPayload } from "../auth/auth.service";

@ApiTags("Submissions")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, OrganizationScopeGuard)
@Controller()
export class SubmissionsController {
  constructor(private readonly service: SubmissionsService) {}

  @Post("applications/:appId/submissions")
  @ApiOperation({ summary: "Create a submission under an application" })
  create(
    @Param("appId") appId: string,
    @Body() dto: CreateSubmissionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.create(appId, user.orgId!, dto, user.sub);
  }

  @Get("applications/:appId/submissions")
  @ApiOperation({ summary: "List submissions for an application (paginated)" })
  findByApplication(
    @Param("appId") appId: string,
    @CurrentUser() user: JwtPayload,
    @Query() pagination: PaginationDto,
  ) {
    return this.service.findByApplication(
      appId,
      user.orgId!,
      pagination.page,
      pagination.pageSize,
    );
  }

  @Get("submissions/:id")
  @ApiOperation({ summary: "Get submission by ID" })
  findOne(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    return this.service.findOne(id, user.orgId!);
  }

  @Patch("submissions/:id")
  @ApiOperation({ summary: "Update submission metadata" })
  update(
    @Param("id") id: string,
    @Body() dto: UpdateSubmissionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.update(id, user.orgId!, dto, user.sub);
  }

  @Get("submissions/:id/submission-units")
  @ApiOperation({
    summary: "List submission units for a submission (paginated)",
  })
  getSubmissionUnits(
    @Param("id") id: string,
    @CurrentUser() user: JwtPayload,
    @Query() pagination: PaginationDto,
  ) {
    return this.service.getSubmissionUnits(
      id,
      user.orgId!,
      pagination.page,
      pagination.pageSize,
    );
  }
}
