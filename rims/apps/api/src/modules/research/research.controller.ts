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
} from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { RequirePermissions } from "../../common/decorators/require-permissions.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtPayload } from "@rims/shared-types";
import { ResearchService } from "./research.service";
import { QueryResearchProjectsDto } from "./dtos/query-research-projects.dto";
import { CreateResearchProjectDto } from "./dtos/create-research-project.dto";
import { UpdateResearchProjectDto } from "./dtos/update-research-project.dto";
import { AddMemberDto } from "./dtos/add-member.dto";
import { CreateMilestoneDto } from "./dtos/create-milestone.dto";
import { UpdateMilestoneDto } from "./dtos/update-milestone.dto";

@Controller("research/projects")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  // ── Cross-project teams list ──────────────────────────────────────────────
  // Mounted at GET /research/teams (separate path prefix needed)
  // — handled via a second controller below

  @Get()
  @RequirePermissions("research.projects.view")
  findAll(
    @Query() query: QueryResearchProjectsDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.researchService.findAll(
      user.tenantId,
      query,
      user.scopes ?? [],
      user.sub,
    );
  }

  @Post()
  @RequirePermissions("research.projects.create")
  create(
    @Body() dto: CreateResearchProjectDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.researchService.create(dto, user.tenantId, user.sub);
  }

  @Get(":id")
  @RequirePermissions("research.projects.view")
  findOne(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    return this.researchService.findOne(
      id,
      user.tenantId,
      user.scopes ?? [],
      user.sub,
    );
  }

  @Patch(":id")
  @RequirePermissions("research.projects.update")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateResearchProjectDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.researchService.update(id, dto, user.tenantId, user.sub);
  }

  @Post(":id/members")
  @RequirePermissions("research.projects.update")
  addMember(
    @Param("id") id: string,
    @Body() dto: AddMemberDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.researchService.addMember(
      id,
      dto.employeeId,
      dto.role ?? "MEMBER",
      user.tenantId,
      user.sub,
    );
  }

  @Delete(":id/members/:employeeId")
  @RequirePermissions("research.projects.update")
  removeMember(
    @Param("id") id: string,
    @Param("employeeId") employeeId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.researchService.removeMember(
      id,
      employeeId,
      user.tenantId,
      user.sub,
    );
  }

  @Post(":id/milestones")
  @RequirePermissions("research.projects.update")
  addMilestone(
    @Param("id") id: string,
    @Body() dto: CreateMilestoneDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.researchService.addMilestone(id, dto, user.tenantId, user.sub);
  }

  @Patch(":id/milestones/:milestoneId")
  @RequirePermissions("research.projects.update")
  updateMilestone(
    @Param("id") _id: string,
    @Param("milestoneId") milestoneId: string,
    @Body() dto: UpdateMilestoneDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.researchService.updateMilestone(
      milestoneId,
      dto,
      user.tenantId,
      user.sub,
    );
  }

  @Post(":id/status-updates")
  @RequirePermissions("research.projects.update")
  addStatusUpdate(
    @Param("id") id: string,
    @Body() body: { content: string },
    @CurrentUser() user: JwtPayload,
  ) {
    return this.researchService.addStatusUpdate(
      id,
      body.content,
      user.sub,
      user.tenantId,
    );
  }

  // ── Project Teams ────────────────────────────────────────────────────────

  @Get(":id/teams")
  @RequirePermissions("research.projects.view")
  getTeams(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    return this.researchService.getProjectTeams(id, user.tenantId);
  }

  @Post(":id/teams")
  @RequirePermissions("research.projects.update")
  createTeam(
    @Param("id") id: string,
    @Body()
    body: {
      name: string;
      description?: string;
      leaderId?: string;
      startDate?: string;
      endDate?: string;
    },
    @CurrentUser() user: JwtPayload,
  ) {
    return this.researchService.createProjectTeam(id, body, user.tenantId);
  }

  @Patch(":id/teams/:teamId")
  @RequirePermissions("research.projects.update")
  updateTeam(
    @Param("teamId") teamId: string,
    @Body()
    body: {
      name?: string;
      description?: string;
      leaderId?: string;
      startDate?: string;
      endDate?: string;
    },
    @CurrentUser() user: JwtPayload,
  ) {
    return this.researchService.updateProjectTeam(teamId, body, user.tenantId);
  }

  @Post(":id/teams/:teamId/members")
  @RequirePermissions("research.projects.update")
  addTeamMember(
    @Param("teamId") teamId: string,
    @Body() body: { employeeId: string; role?: string },
    @CurrentUser() user: JwtPayload,
  ) {
    return this.researchService.addProjectTeamMember(
      teamId,
      body.employeeId,
      body.role ?? "MEMBER",
      user.tenantId,
    );
  }

  @Delete(":id/teams/:teamId/members/:employeeId")
  @RequirePermissions("research.projects.update")
  removeTeamMember(
    @Param("teamId") teamId: string,
    @Param("employeeId") employeeId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.researchService.removeProjectTeamMember(
      teamId,
      employeeId,
      user.tenantId,
    );
  }
}

@Controller("research/teams")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ResearchTeamsController {
  constructor(private readonly researchService: ResearchService) {}

  @Get()
  @RequirePermissions("research.projects.view")
  findAll(@CurrentUser() user: JwtPayload) {
    return this.researchService.getAllProjectTeams(user.tenantId);
  }
}
