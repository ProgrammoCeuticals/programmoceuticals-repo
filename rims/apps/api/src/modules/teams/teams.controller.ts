import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { RequirePermissions } from "../../common/decorators/require-permissions.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtPayload } from "@rims/shared-types";
import { TeamsService } from "./teams.service";
import { CreateTeamDto } from "./dtos/create-team.dto";
import { UpdateTeamDto } from "./dtos/update-team.dto";
import { AddMemberDto } from "./dtos/add-member.dto";
import { QueryTeamsDto } from "./dtos/query-teams.dto";

@Controller("teams")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @RequirePermissions("teams.view")
  findAll(@Query() query: QueryTeamsDto, @CurrentUser() user: JwtPayload) {
    return this.teamsService.findAll(
      user.tenantId,
      query.departmentId,
      user.scopes ?? [],
    );
  }

  @Post()
  @RequirePermissions("teams.create")
  create(@Body() dto: CreateTeamDto, @CurrentUser() user: JwtPayload) {
    return this.teamsService.create(dto, user.tenantId);
  }

  @Patch(":id")
  @RequirePermissions("teams.update")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateTeamDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.teamsService.update(id, dto, user.tenantId);
  }

  @Post(":id/members")
  @RequirePermissions("teams.update")
  addMember(
    @Param("id") id: string,
    @Body() dto: AddMemberDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.teamsService.addMember(id, dto.employeeId, user.tenantId);
  }

  @Delete(":id/members/:employeeId")
  @RequirePermissions("teams.update")
  @HttpCode(HttpStatus.OK)
  removeMember(
    @Param("id") id: string,
    @Param("employeeId") employeeId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.teamsService.removeMember(id, employeeId, user.tenantId);
  }
}
