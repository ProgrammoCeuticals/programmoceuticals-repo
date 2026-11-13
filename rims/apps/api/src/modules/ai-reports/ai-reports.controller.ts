import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '@rims/shared-types';
import { AiReportsService } from './ai-reports.service';
import { ExecutiveSummaryDto } from './dtos/executive-summary.dto';

@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AiReportsController {
  constructor(private readonly aiReportsService: AiReportsService) {}

  @Post('ai-reports/executive-summary')
  @RequirePermissions('reports.view')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  generateExecutiveSummary(
    @Body() dto: ExecutiveSummaryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.aiReportsService.generateExecutiveSummary(
      user.tenantId,
      dto.periodStart,
      dto.periodEnd,
    );
  }
}
