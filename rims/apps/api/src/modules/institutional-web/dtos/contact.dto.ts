import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  MaxLength,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateContactSubmissionDto {
  @IsString()
  @MaxLength(200)
  name!: string;

  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  subject?: string;

  @IsString()
  @MaxLength(5000)
  message!: string;

  @IsBoolean()
  consentGiven!: boolean;
}

export class QueryContactSubmissionsDto {
  @IsOptional()
  @IsString()
  processingStatus?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number;
}
