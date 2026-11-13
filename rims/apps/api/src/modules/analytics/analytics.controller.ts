import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '@rims/shared-types';
import { AnalyticsService } from './analytics.service';

@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('analytics/trends')
  @RequirePermissions('reports.view')
  getTrends(
    @Query('metric') metric: string,
    @Query('periodStart') periodStart: string,
    @Query('periodEnd') periodEnd: string,
    @Query('interval') interval: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.analyticsService.getTrends(user.tenantId, {
      metric,
      periodStart,
      periodEnd,
      interval,
    });
  }

  @Get('analytics/workload')
  @RequirePermissions('reports.view')
  getWorkload(@CurrentUser() user: JwtPayload) {
    return this.analyticsService.getWorkloadDistribution(user.tenantId);
  }

  @Get('analytics/project-risks')
  @RequirePermissions('research.projects.view')
  getProjectRisks(@CurrentUser() user: JwtPayload) {
    return this.analyticsService.getProjectRiskIndicators(user.tenantId);
  }

  @Get('analytics/publication-trends')
  @RequirePermissions('publications.view')
  getPublicationTrends(
    @Query('year') year: string | undefined,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.analyticsService.getPublicationTrends(
      user.tenantId,
      year ? parseInt(year, 10) : undefined,
    );
  }
}
