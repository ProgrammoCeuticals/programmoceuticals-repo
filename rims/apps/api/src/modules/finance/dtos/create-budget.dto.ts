import { IsString, IsNotEmpty, IsOptional, IsNumberString } from 'class-validator';

export class CreateBudgetDto {
  @IsString()
  @IsNotEmpty()
  researchProjectId!: string;

  @IsOptional()
  @IsString()
  fundingSourceId?: string;

  @IsNumberString()
  approvedAmount!: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
