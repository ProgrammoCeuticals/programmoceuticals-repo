import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ReviewKpiResultDto {
  @IsBoolean()
  approved!: boolean;

  @IsOptional()
  @IsString()
  reviewNotes?: string;
}
