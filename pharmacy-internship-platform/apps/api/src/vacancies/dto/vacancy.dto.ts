import {
  IsString, IsOptional, IsInt, Min, Max, IsEnum, IsDateString,
  IsArray, IsBoolean, IsObject, ValidateNested, MinLength, MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccommodationStatus, QuestionType } from '@pharmintern/shared-types';

export class VacancyQuestionDto {
  @ApiProperty()
  @IsString()
  @MinLength(5)
  questionText!: string;

  @ApiProperty({ enum: QuestionType })
  @IsEnum(QuestionType)
  questionType!: QuestionType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  options?: string[];

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  displayOrder?: number;
}

export class RequiredDocumentDto {
  @ApiProperty({ example: 'University Certificate' })
  @IsString()
  documentLabel!: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;
}

export class CreateVacancyDto {
  @ApiProperty({ example: 'Community Pharmacy Intern' })
  @IsString()
  @MinLength(3)
  @MaxLength(300)
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Location ID (leave null for org-wide)' })
  @IsOptional()
  @IsString()
  locationId?: string;

  @ApiProperty({ minimum: 1, maximum: 500 })
  @IsInt()
  @Min(1)
  @Max(500)
  totalPositions!: number;

  @ApiPropertyOptional({ isArray: true, type: String, description: 'Practice area IDs' })
  @IsOptional()
  @IsArray()
  practiceAreaIds?: string[];

  @ApiPropertyOptional({ description: 'ISO8601 date' })
  @IsOptional()
  @IsDateString()
  applicationOpenDate?: string;

  @ApiPropertyOptional({ description: 'ISO8601 date' })
  @IsOptional()
  @IsDateString()
  applicationDeadline?: string;

  @ApiPropertyOptional({ description: 'ISO8601 date' })
  @IsOptional()
  @IsDateString()
  expectedStartDate?: string;

  @ApiPropertyOptional({ enum: AccommodationStatus })
  @IsOptional()
  @IsEnum(AccommodationStatus)
  accommodationStatus?: AccommodationStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  accommodationDetails?: string;

  @ApiPropertyOptional({ description: 'Employer-provided remuneration info — display only' })
  @IsOptional()
  @IsString()
  remunerationInfo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  applicationInstructions?: string;

  @ApiPropertyOptional({ type: [VacancyQuestionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VacancyQuestionDto)
  questions?: VacancyQuestionDto[];

  @ApiPropertyOptional({ type: [RequiredDocumentDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RequiredDocumentDto)
  requiredDocuments?: RequiredDocumentDto[];
}

export class UpdateVacancyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(300)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  locationId?: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 500 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  totalPositions?: number;

  @ApiPropertyOptional({ isArray: true, type: String })
  @IsOptional()
  @IsArray()
  practiceAreaIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  applicationOpenDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  applicationDeadline?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  expectedStartDate?: string;

  @ApiPropertyOptional({ enum: AccommodationStatus })
  @IsOptional()
  @IsEnum(AccommodationStatus)
  accommodationStatus?: AccommodationStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  accommodationDetails?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  remunerationInfo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  applicationInstructions?: string;

  @ApiPropertyOptional({ type: [VacancyQuestionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VacancyQuestionDto)
  questions?: VacancyQuestionDto[];

  @ApiPropertyOptional({ type: [RequiredDocumentDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RequiredDocumentDto)
  requiredDocuments?: RequiredDocumentDto[];
}

export class VacancySearchQueryDto {
  @IsOptional() @IsString() keyword?: string;
  @IsOptional() @IsString() practiceAreaId?: string;
  @IsOptional() @IsString() stateId?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsEnum(AccommodationStatus) accommodation?: AccommodationStatus;
  @IsOptional() @IsDateString() deadlineAfter?: string;
  @IsOptional() @IsDateString() startAfter?: string;
  @IsOptional() @IsString() sort?: 'deadline_asc' | 'posted_desc';
  @IsOptional() @IsInt() @Min(1) @Type(() => Number) page?: number;
  @IsOptional() @IsInt() @Min(1) @Max(100) @Type(() => Number) pageSize?: number;
}
