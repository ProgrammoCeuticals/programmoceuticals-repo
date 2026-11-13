import {
  IsString, IsOptional, IsDateString, IsUUID, MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOfferDto {
  @ApiProperty({ description: 'Application ID this offer is for' })
  @IsUUID()
  applicationId!: string;

  @ApiPropertyOptional({ description: 'Reporting / start date (ISO8601)' })
  @IsOptional()
  @IsDateString()
  reportingDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  termsAndConditions?: string;

  @ApiPropertyOptional({ description: 'Remuneration info — display only; no payment processing' })
  @IsOptional()
  @IsString()
  remunerationInfo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  accommodationDetails?: string;
}

export class IssueOfferDto {
  @ApiProperty({
    description:
      'Acceptance deadline (ISO8601 datetime). ' +
      'Must be between platform minimum (2 days) and maximum (30 days) from now.',
  })
  @IsDateString()
  acceptanceDeadline!: string;
}

export class AcceptOfferDto {
  // Body is empty — offer identified by :id, applicant identified by JWT.
  // Idempotency-Key header is required (enforced in controller).
}

export class DeclineOfferDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}

export class WithdrawOfferDto {
  @ApiProperty({ description: 'Reason for withdrawal' })
  @IsString()
  @MinLength(5)
  reason!: string;
}
