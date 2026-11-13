import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '@rims/shared-types';
import { PerformanceCyclesService } from './performance-cycles.service';
import { KpiDefinitionsService } from './kpi-definitions.service';
import { KpiAssignmentsService } from './kpi-assignments.service';
import { KpiResultsService } from './kpi-results.service';
import { CreatePerformanceCycleDto } from './dtos/create-performance-cycle.dto';
import { UpdatePerformanceCycleDto } from './dtos/update-performance-cycle.dto';
import { CreateKpiDefinitionDto } from './dtos/create-kpi-definition.dto';
import { UpdateKpiDefinitionDto } from './dtos/update-kpi-definition.dto';
import { CreateKpiAssignmentDto } from './dtos/create-kpi-assignment.dto';
import { QueryKpiAssignmentsDto } from './dtos/query-kpi-assignments.dto';
import { SubmitKpiResultDto } from './dtos/submit-kpi-result.dto';
import { ReviewKpiResultDto } from './dtos/review-kpi-result.dto';
import { ReturnKpiResultDto } from './dtos/return-kpi-result.dto';

@Controller('performance')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PerformanceController {
  constructor(
    private readonly cyclesService: PerformanceCyclesService,
    private readonly kpiDefinitionsService: KpiDefinitionsService,
    private readonly kpiAssignmentsService: KpiAssignmentsService,
    private readonly kpiResultsService: KpiResultsService,
  ) {}

  // ── Cycles ────────────────────────────────────────────────────────────────

  @Get('cycles')
  @RequirePermissions('performance.cycles.view')
  findAllCycles(
    @Query() query: { page?: number; pageSize?: number; status?: string },
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.cyclesService.findAll(user.tenantId, query);
  }

  @Post('cycles')
  @RequirePermissions('performance.cycles.manage')
  createCycle(
    @Body() dto: CreatePerformanceCycleDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.cyclesService.create(dto, user.tenantId, user.sub);
  }

  @Get('cycles/:id')
  @RequirePermissions('performance.cycles.view')
  findOneCycle(@Param('id') id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.cyclesService.findOne(id, user.tenantId);
  }

  @Patch('cycles/:id')
  @RequirePermissions('performance.cycles.manage')
  updateCycle(
    @Param('id') id: string,
    @Body() dto: UpdatePerformanceCycleDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.cyclesService.update(id, dto, user.tenantId);
  }

  @Post('cycles/:id/activate')
  @RequirePermissions('performance.cycles.manage')
  activateCycle(@Param('id') id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.cyclesService.activate(id, user.tenantId, user.sub);
  }

  @Post('cycles/:id/close')
  @RequirePermissions('performance.cycles.manage')
  closeCycle(@Param('id') id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.cyclesService.close(id, user.tenantId, user.sub);
  }

  @Post('cycles/:id/lock')
  @RequirePermissions('performance.cycles.manage')
  lockCycle(@Param('id') id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.cyclesService.lock(id, user.tenantId, user.sub);
  }

  // ── KPI Definitions ───────────────────────────────────────────────────────

  @Get('kpis')
  @RequirePermissions('performance.cycles.view')
  findAllKpis(
    @Query()
    query: {
      category?: string;
      isActive?: boolean;
      measurementType?: string;
      page?: number;
      pageSize?: number;
    },
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.kpiDefinitionsService.findAll(user.tenantId, query);
  }

  @Post('kpis')
  @RequirePermissions('performance.kpis.configure')
  createKpi(
    @Body() dto: CreateKpiDefinitionDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.kpiDefinitionsService.create(dto, user.tenantId, user.sub);
  }

  @Patch('kpis/:id')
  @RequirePermissions('performance.kpis.configure')
  updateKpi(
    @Param('id') id: string,
    @Body() dto: UpdateKpiDefinitionDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.kpiDefinitionsService.update(id, dto, user.tenantId);
  }

  // ── KPI Assignments ───────────────────────────────────────────────────────

  @Post('assignments')
  @RequirePermissions('performance.kpis.configure')
  createAssignment(
    @Body() dto: CreateKpiAssignmentDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.kpiAssignmentsService.create(dto, user.tenantId);
  }

  @Get('assignments')
  @RequirePermissions('performance.cycles.view')
  getAssignments(
    @Query() query: QueryKpiAssignmentsDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    if (query.subjectType && query.subjectId && query.cycleId) {
      return this.kpiAssignmentsService.findBySubject(
        query.subjectType,
        query.subjectId,
        query.cycleId,
        user.tenantId,
      );
    }
    return this.kpiAssignmentsService.findByCycle(
      query.cycleId ?? '',
      user.tenantId,
    );
  }

  // ── KPI Results ───────────────────────────────────────────────────────────

  @Get('results/:assignmentId')
  @RequirePermissions('performance.cycles.view')
  findResult(
    @Param('assignmentId') assignmentId: string,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.kpiResultsService.findOne(assignmentId, user.tenantId);
  }

  @Post('results/:assignmentId/submit')
  @RequirePermissions('performance.results.submit')
  submitResult(
    @Param('assignmentId') assignmentId: string,
    @Body() dto: SubmitKpiResultDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.kpiResultsService.submit(assignmentId, dto, user.tenantId, user.sub);
  }

  @Post('results/:id/review')
  @RequirePermissions('performance.results.review')
  reviewResult(
    @Param('id') id: string,
    @Body() dto: ReviewKpiResultDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.kpiResultsService.review(id, dto, user.tenantId, user.sub);
  }

  @Post('results/:id/approve')
  @RequirePermissions('performance.results.approve')
  approveResult(
    @Param('id') id: string,
    @Body() dto: { approvalNotes?: string },
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.kpiResultsService.approve(id, dto, user.tenantId, user.sub);
  }

  @Post('results/:id/return')
  @RequirePermissions('performance.results.review')
  returnResult(
    @Param('id') id: string,
    @Body() dto: ReturnKpiResultDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.kpiResultsService.returnResult(id, dto.reviewNotes, user.tenantId, user.sub);
  }

  // ── Score ─────────────────────────────────────────────────────────────────

  @Get('score')
  @RequirePermissions('performance.cycles.view')
  getScore(
    @Query() query: { cycleId: string; subjectType: string; subjectId: string },
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.kpiResultsService.calculateScore(
      query.cycleId,
      query.subjectType,
      query.subjectId,
      user.tenantId,
    );
  }
}
