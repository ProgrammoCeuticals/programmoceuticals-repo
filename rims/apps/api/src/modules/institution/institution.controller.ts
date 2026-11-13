import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '@rims/shared-types';
import { InstitutionService } from './institution.service';
import { UpdateInstitutionDto } from './dtos/update-institution.dto';

@Controller('institution')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InstitutionController {
  constructor(private readonly institutionService: InstitutionService) {}

  @Get()
  @RequirePermissions('institution.view')
  findOne(@CurrentUser() user: JwtPayload) {
    return this.institutionService.findOne(user.tenantId);
  }

  @Patch()
  @RequirePermissions('institution.update')
  update(
    @Body() dto: UpdateInstitutionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.institutionService.update(user.tenantId, dto, user.sub);
  }
}
