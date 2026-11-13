import {
  Controller, Get, Post, Param, Body, Query,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PlacementsService } from './placements.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '@pharmintern/shared-types';

class UpdatePlacementStatusDto {
  @ApiPropertyOptional()
  @IsString()
  status!: string;

  @IsOptional() @IsString()
  reason?: string;
}

class CompletePlacementDto {
  @ApiPropertyOptional()
  @IsOptional() @IsDateString()
  completionDate?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  finalAssessmentNotes?: string;
}

class AssignSupervisorDto {
  @IsString()
  supervisorUserId!: string;
}

@ApiTags('placements')
@Controller({ version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PlacementsController {
  constructor(private readonly placementsService: PlacementsService) {}

  // ── Applicant ─────────────────────────────────────────────────────────────

  @Get('placements/mine')
  @ApiOperation({ summary: "List own placements (applicant)" })
  listMine(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.placementsService.listMine(user.sub, page, pageSize);
  }

  @Get('placements/:id')
  @ApiOperation({ summary: 'Get own placement detail (applicant)' })
  getOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.placementsService.getForApplicant(id, user.sub);
  }

  // ── Employer ──────────────────────────────────────────────────────────────

  @Get('organisations/:orgId/placements')
  @ApiOperation({ summary: 'List org placements (coordinator+)' })
  listForOrg(
    @Param('orgId') orgId: string,
    @CurrentUser() user: JwtPayload,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.placementsService.listForOrg(orgId, user.sub, { status, page, pageSize });
  }

  @Get('organisations/:orgId/placements/:id')
  @ApiOperation({ summary: 'Get placement detail (employer view)' })
  getForEmployer(
    @Param('orgId') orgId: string,
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.placementsService.getForEmployer(id, orgId, user.sub);
  }

  @Post('organisations/:orgId/placements/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update placement status' })
  updateStatus(
    @Param('orgId') orgId: string,
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdatePlacementStatusDto,
  ) {
    return this.placementsService.updateStatus(id, orgId, user.sub, dto.status, dto.reason);
  }

  @Post('organisations/:orgId/placements/:id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark placement as completed — explicit coordinator action required' })
  complete(
    @Param('orgId') orgId: string,
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CompletePlacementDto,
  ) {
    return this.placementsService.complete(id, orgId, user.sub, dto);
  }

  @Post('organisations/:orgId/placements/:id/supervisors')
  @ApiOperation({ summary: 'Assign a supervisor to a placement' })
  assignSupervisor(
    @Param('orgId') orgId: string,
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: AssignSupervisorDto,
  ) {
    return this.placementsService.assignSupervisor(id, orgId, user.sub, dto.supervisorUserId);
  }

  @Post('organisations/:orgId/placements/supervisors/:assignmentId/unassign')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unassign a supervisor' })
  unassignSupervisor(
    @Param('orgId') orgId: string,
    @Param('assignmentId') assignmentId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.placementsService.unassignSupervisor(assignmentId, orgId, user.sub);
  }
}
