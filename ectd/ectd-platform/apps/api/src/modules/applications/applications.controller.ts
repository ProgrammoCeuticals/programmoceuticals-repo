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
import { ApplicationsService } from "./applications.service";
import {
  CreateApplicationDto,
  UpdateApplicationDto,
} from "./dto/application.dto";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { OrganizationScopeGuard } from "../../common/guards/organization-scope.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtPayload } from "../auth/auth.service";

@ApiTags("Applications")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, OrganizationScopeGuard)
@Controller("applications")
export class ApplicationsController {
  constructor(private readonly service: ApplicationsService) {}

  @Post()
  @ApiOperation({ summary: "Create a regulatory application" })
  create(@Body() dto: CreateApplicationDto, @CurrentUser() user: JwtPayload) {
    return this.service.create(user.orgId!, dto, user.sub);
  }

  @Get()
  @ApiOperation({
    summary: "List applications for current organization (paginated)",
  })
  findAll(@CurrentUser() user: JwtPayload, @Query() pagination: PaginationDto) {
    return this.service.findAll(
      user.orgId!,
      pagination.page,
      pagination.pageSize,
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get application by ID" })
  findOne(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    return this.service.findOne(id, user.orgId!);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Update application metadata (applicationNumber, applicationType)",
  })
  update(
    @Param("id") id: string,
    @Body() dto: UpdateApplicationDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.update(id, user.orgId!, dto, user.sub);
  }

  @Get(":id/submissions")
  @ApiOperation({ summary: "List submissions for this application" })
  getSubmissions(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    return this.service.getSubmissions(id, user.orgId!);
  }

  @Get(":id/audit")
  @ApiOperation({ summary: "Audit trail for this application (paginated)" })
  getAudit(
    @Param("id") id: string,
    @CurrentUser() user: JwtPayload,
    @Query() pagination: PaginationDto,
  ) {
    return this.service.getAuditTrail(
      id,
      user.orgId!,
      pagination.page,
      pagination.pageSize,
    );
  }
}
