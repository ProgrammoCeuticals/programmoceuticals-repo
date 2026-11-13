import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SubmitKpiResultDto {
  @IsString()
  @IsNotEmpty()
  value!: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  evidenceRef?: string;
}
