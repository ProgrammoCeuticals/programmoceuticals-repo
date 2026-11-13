import {
  Controller, Get, Post, Param, Body, Query,
  UseGuards, HttpCode, HttpStatus, Headers, BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { OffersService } from './offers.service';
import { CreateOfferDto, IssueOfferDto, DeclineOfferDto, WithdrawOfferDto } from './dto/offer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '@pharmintern/shared-types';

@ApiTags('offers')
@Controller({ version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  // ── Applicant: list & view own offers ─────────────────────────────────────

  @Get('offers/mine')
  @ApiOperation({ summary: "List own offers" })
  listMine(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.offersService.listMine(user.sub, page, pageSize);
  }

  @Get('offers/:id')
  @ApiOperation({ summary: 'Get own offer detail' })
  getOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.offersService.getForApplicant(id, user.sub);
  }

  // ── Applicant: accept offer ───────────────────────────────────────────────

  @Post('offers/:id/accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Accept an offer — executes the atomic one-placement transaction' })
  @ApiHeader({
    name: 'Idempotency-Key',
    description: 'Client-generated UUID. Required. Prevents duplicate placements on retry.',
    required: true,
  })
  async accept(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Headers('idempotency-key') idempotencyKey: string,
  ) {
    if (!idempotencyKey) {
      throw new BadRequestException({
        code: 'VALIDATION_ERROR',
        message: 'Idempotency-Key header is required',
      });
    }
    return this.offersService.accept(id, user.sub, idempotencyKey);
  }

  // ── Applicant: decline offer ──────────────────────────────────────────────

  @Post('offers/:id/decline')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Decline an offer' })
  decline(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: DeclineOfferDto,
  ) {
    return this.offersService.decline(id, user.sub, dto);
  }

  // ── Employer: create, issue, withdraw ─────────────────────────────────────

  @Post('organisations/:orgId/offers')
  @ApiOperation({ summary: 'Create offer draft' })
  create(
    @Param('orgId') orgId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateOfferDto,
  ) {
    return this.offersService.create(orgId, user.sub, dto);
  }

  @Post('organisations/:orgId/offers/:id/issue')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Issue offer to candidate — reserves a vacancy position' })
  @ApiHeader({
    name: 'Idempotency-Key',
    description: 'Client-generated UUID. Required. Prevents duplicate offer issuance.',
    required: true,
  })
  issue(
    @Param('orgId') orgId: string,
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: IssueOfferDto,
    @Headers('idempotency-key') idempotencyKey: string,
  ) {
    if (!idempotencyKey) {
      throw new BadRequestException({ code: 'VALIDATION_ERROR', message: 'Idempotency-Key header is required' });
    }
    return this.offersService.issue(id, orgId, user.sub, dto, idempotencyKey);
  }

  @Post('organisations/:orgId/offers/:id/withdraw')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Withdraw an issued offer — releases vacancy reservation' })
  withdraw(
    @Param('orgId') orgId: string,
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: WithdrawOfferDto,
  ) {
    return this.offersService.withdraw(id, orgId, user.sub, dto);
  }

  @Get('organisations/:orgId/vacancies/:vacancyId/offers')
  @ApiOperation({ summary: 'List offers for a vacancy (employer)' })
  listForVacancy(
    @Param('orgId') orgId: string,
    @Param('vacancyId') vacancyId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.offersService.listForVacancy(vacancyId, orgId, user.sub);
  }
}
