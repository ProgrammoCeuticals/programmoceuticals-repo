import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsString()
  outcome?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  submittedAt?: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;
}
