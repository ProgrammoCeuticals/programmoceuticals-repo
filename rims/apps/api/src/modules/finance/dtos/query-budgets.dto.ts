import { IsOptional, IsString } from 'class-validator';

export class QueryBudgetsDto {
  @IsOptional()
  @IsString()
  researchProjectId?: string;

  @IsOptional()
  @IsString()
  approvalStatus?: string;
}
