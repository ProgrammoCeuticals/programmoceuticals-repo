import { IsInt, IsOptional, IsString, IsDateString, Min } from 'class-validator';

export class CreateReviewDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  round?: number;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
