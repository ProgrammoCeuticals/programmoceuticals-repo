import {
  Controller, Get, Post, Param, Body, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { VerificationService } from './verification.service';
import {
  SubmitVerificationDto,
  RecordVerificationMeetingDto,
  DecideVerificationDto,
  UpdateVerificationStatusDto,
} from './dto/verification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole, JwtPayload } from '@pharmintern/shared-types';
import { OrganisationsService } from '../organisations/organisations.service';
import { OrgMemberRole } from '@pharmintern/shared-types';

@ApiTags('verification')
@Controller({ path: 'verification', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VerificationController {
  constructor(
    private readonly verificationService: VerificationService,
    private readonly orgsService: OrganisationsService,
  ) {}

  // ── Employer routes ───────────────────────────────────────────────────────

  @Get('organisations/:orgId/my-case')
  @ApiOperation({ summary: 'Get own organisation verification case' })
  async getMyCase(
    @Param('orgId') orgId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    await this.orgsService.assertMember(orgId, user.sub);
    return this.verificationService.getMyCase(orgId);
  }

  @Post('organisations/:orgId/submit')
  @ApiOperation({ summary: 'Submit organisation for verification' })
  async submit(
    @Param('orgId') orgId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: SubmitVerificationDto,
  ) {
    await this.orgsService.assertRole(orgId, user.sub, [OrgMemberRole.ORGANISATION_OWNER]);
    return this.verificationService.submit(orgId, user.sub, dto);
  }

  // ── Platform admin routes ─────────────────────────────────────────────────

  @Get('queue')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  @ApiOperation({ summary: 'Admin: list verification queue' })
  listQueue(
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.verificationService.listQueue({ status, page, pageSize });
  }

  @Get('cases/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  @ApiOperation({ summary: 'Admin: get full verification case detail' })
  getCase(@Param('id') id: string) {
    return this.verificationService.getCaseFull(id);
  }

  @Post('cases/:id/assign')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  @ApiOperation({ summary: 'Admin: assign reviewer to case' })
  assign(
    @Param('id') id: string,
    @Body('reviewerUserId') reviewerUserId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.verificationService.assignReviewer(id, reviewerUserId, user.sub);
  }

  @Post('cases/:id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  @ApiOperation({ summary: 'Admin: update verification case status' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateVerificationStatusDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.verificationService.updateStatus(id, dto, user.sub);
  }

  @Post('cases/:id/schedule-meeting')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  @ApiOperation({ summary: 'Admin: schedule verification meeting' })
  scheduleMeeting(
    @Param('id') id: string,
    @Body() dto: RecordVerificationMeetingDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.verificationService.scheduleMeeting(id, dto, user.sub);
  }

  @Post('cases/:id/meetings/:meetingId/outcome')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  @ApiOperation({ summary: 'Admin: record meeting outcome' })
  recordMeetingOutcome(
    @Param('id') id: string,
    @Param('meetingId') meetingId: string,
    @Body() dto: RecordVerificationMeetingDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.verificationService.recordMeetingOutcome(id, meetingId, dto, user.sub);
  }

  @Post('cases/:id/decide')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin: approve, reject, or suspend a centre' })
  decide(
    @Param('id') id: string,
    @Body() dto: DecideVerificationDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.verificationService.decide(id, dto, user.sub);
  }
}
