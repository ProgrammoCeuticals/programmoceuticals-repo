import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { Request } from "express";
import { AuditService } from "./audit.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { TenantGuard } from "../../common/guards/tenant.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { RequirePermissions } from "../../common/decorators/require-permissions.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtPayload } from "@rims/shared-types";
import { IsOptional, IsInt, Min, Max } from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

class AuditQueryDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value as string, 10))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value as string, 10))
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;

  @ApiProperty({ required: false })
  @IsOptional()
  resourceType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  actorId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  dateFrom?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  dateTo?: string;
}

@ApiTags("audit")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller("audit-events")
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @RequirePermissions("audit.view")
  @ApiOperation({
    summary: "List audit events for the current tenant (paginated)",
  })
  async list(
    @Query() query: AuditQueryDto,
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
  ) {
    return this.auditService.list(
      user.tenantId,
      query.page ?? 1,
      query.pageSize ?? 20,
      {
        ...(query.resourceType !== undefined
          ? { resourceType: query.resourceType }
          : {}),
        ...(query.actorId !== undefined ? { actorId: query.actorId } : {}),
        ...(query.dateFrom !== undefined ? { dateFrom: query.dateFrom } : {}),
        ...(query.dateTo !== undefined ? { dateTo: query.dateTo } : {}),
      },
      req.requestId,
    );
  }
}
