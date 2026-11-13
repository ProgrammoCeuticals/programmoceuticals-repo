import {
  IsString, IsOptional, IsEnum, IsDateString, IsArray, IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubmitVerificationDto {
  @ApiPropertyOptional({ description: 'Organisation location ID if this is a location-level case' })
  @IsOptional()
  @IsString()
  locationId?: string;
}

export class UploadVerificationDocumentDto {
  @ApiProperty({ example: 'PCN_LICENCE' })
  @IsString()
  documentType!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  originalFilename?: string;
}

export class UpdateVerificationStatusDto {
  @ApiProperty({
    enum: [
      'UNDER_REVIEW', 'MEETING_REQUIRED', 'MEETING_SCHEDULED',
      'ADDITIONAL_INFORMATION_REQUIRED',
    ],
  })
  @IsString()
  status!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}

export class RecordVerificationMeetingDto {
  @ApiProperty({ description: 'ISO8601 datetime of meeting' })
  @IsDateString()
  scheduledAt!: string;

  @ApiPropertyOptional({ description: 'ISO8601 datetime meeting was actually held' })
  @IsOptional()
  @IsDateString()
  heldAt?: string;

  @ApiPropertyOptional({ isArray: true, type: String })
  @IsOptional()
  @IsArray()
  participants?: string[];

  @ApiPropertyOptional({ description: 'Checklist responses JSON' })
  @IsOptional()
  @IsObject()
  checklistResponses?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ enum: ['PASSED', 'FAILED', 'INCONCLUSIVE'] })
  @IsOptional()
  @IsEnum(['PASSED', 'FAILED', 'INCONCLUSIVE'])
  outcome?: 'PASSED' | 'FAILED' | 'INCONCLUSIVE';
}

export class DecideVerificationDto {
  @ApiProperty({ enum: ['APPROVED', 'REJECTED', 'SUSPENDED'] })
  @IsEnum(['APPROVED', 'REJECTED', 'SUSPENDED'])
  decision!: 'APPROVED' | 'REJECTED' | 'SUSPENDED';

  @ApiProperty({ description: 'Required when decision is REJECTED or SUSPENDED' })
  @IsString()
  reason!: string;
}
