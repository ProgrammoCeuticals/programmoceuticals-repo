import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { ProvisionTenantDto } from './dtos/provision-tenant.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { JwtPayload } from '@rims/shared-types';

@ApiTags('tenants')
@Controller()
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('tenants/current')
  @ApiOperation({ summary: 'Get the current tenant profile' })
  getCurrent(@CurrentUser() user: JwtPayload) {
    return this.tenantsService.getCurrent(user.tenantId);
  }

  @Public()
  @Post('dev/tenants/provision')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Provision a new tenant (dev only)' })
  async provision(@Body() dto: ProvisionTenantDto) {
    if (process.env['NODE_ENV'] === 'production') {
      throw new NotFoundException();
    }
    return this.tenantsService.provision(dto);
  }
}
