import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '@rims/shared-types';
import { UsageService } from './usage.service';

@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsageController {
  constructor(private readonly usageService: UsageService) {}

  @Get('usage/summary')
  @RequirePermissions('institution.settings.manage')
  getSummary(@CurrentUser() user: JwtPayload) {
    return this.usageService.getCurrentUsageSummary(user.tenantId);
  }

  @Get('usage/history')
  @RequirePermissions('institution.settings.manage')
  getHistory(
    @Query('metricType') metricType: string | undefined,
    @Query('dateFrom') dateFrom: string | undefined,
    @Query('dateTo') dateTo: string | undefined,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.usageService.getUsage(
      user.tenantId,
      metricType,
      dateFrom,
      dateTo,
    );
  }
}
