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
import { UsersService } from './users.service';
import { QueryUsersDto } from './dtos/query-users.dto';
import { InviteUserDto } from './dtos/invite-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: JwtPayload) {
    return this.usersService.findMe(user.sub, user.tenantId);
  }

  @Get('users')
  @RequirePermissions('users.view')
  findAll(
    @Query() query: QueryUsersDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.usersService.findAll(query, user.tenantId);
  }

  @Get('users/:id')
  @RequirePermissions('users.view')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.usersService.findOne(id, user.tenantId);
  }

  @Post('users/invitations')
  @RequirePermissions('users.invite')
  inviteUser(
    @Body() dto: InviteUserDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.usersService.inviteUser(dto, user.tenantId, user.sub);
  }

  @Patch('users/:id')
  @RequirePermissions('users.update')
  updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.usersService.updateUser(id, dto, user.tenantId, user.sub);
  }
}
