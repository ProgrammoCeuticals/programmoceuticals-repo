import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OrganisationsService } from './organisations.service';
import { CreateOrganisationDto, UpdateOrganisationDto } from './dto/create-organisation.dto';
import { CreateLocationDto, UpdateLocationDto } from './dto/create-location.dto';
import { InviteStaffDto, UpdateStaffRolesDto } from './dto/invite-staff.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '@pharmintern/shared-types';

@ApiTags('organisations')
@Controller({ path: 'organisations', version: '1' })
export class OrganisationsController {
  constructor(private readonly orgs: OrganisationsService) {}

  // ── Public ────────────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'List approved organisations (public)' })
  list(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('keyword') keyword?: string,
    @Query('stateId') stateId?: string,
    @Query('practiceAreaId') practiceAreaId?: string,
  ) {
    return this.orgs.findPublic({ page, pageSize, keyword, stateId, practiceAreaId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'View approved organisation profile (public)' })
  findOne(@Param('id') id: string) {
    return this.orgs.findPublicById(id);
  }

  @Get(':id/locations')
  @ApiOperation({ summary: 'List locations for an organisation (public)' })
  getLocations(@Param('id') id: string) {
    return this.orgs.getLocations(id);
  }

  // ── Authenticated ─────────────────────────────────────────────────────────

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new organisation (authenticated user becomes owner)' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateOrganisationDto) {
    return this.orgs.create(user.sub, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update organisation (org owner only)' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateOrganisationDto,
  ) {
    return this.orgs.update(id, user.sub, dto);
  }

  @Post(':id/locations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a location (org owner only)' })
  addLocation(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateLocationDto,
  ) {
    return this.orgs.addLocation(id, user.sub, dto);
  }

  @Patch(':id/locations/:locId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a location (org owner only)' })
  updateLocation(
    @Param('id') id: string,
    @Param('locId') locId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateLocationDto,
  ) {
    return this.orgs.updateLocation(id, locId, user.sub, dto);
  }

  @Get(':id/staff')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List staff memberships (org members)' })
  listStaff(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.orgs.listStaff(id, user.sub);
  }

  @Post(':id/staff/invite')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Invite a staff member (org owner only)' })
  inviteStaff(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: InviteStaffDto,
  ) {
    return this.orgs.inviteStaff(id, user.sub, dto);
  }

  @Patch(':id/staff/:memberId/roles')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update staff roles (org owner only)' })
  updateStaffRoles(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateStaffRolesDto,
  ) {
    return this.orgs.updateStaffRoles(id, memberId, user.sub, dto);
  }

  @Delete(':id/staff/:memberId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke staff access (org owner only)' })
  revokeStaff(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.orgs.revokeStaff(id, memberId, user.sub);
  }
}
