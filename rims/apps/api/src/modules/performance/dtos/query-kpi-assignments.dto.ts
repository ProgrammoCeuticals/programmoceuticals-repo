import { IsOptional, IsString } from 'class-validator';

export class QueryKpiAssignmentsDto {
  @IsOptional()
  @IsString()
  cycleId?: string;

  @IsOptional()
  @IsString()
  subjectType?: string;

  @IsOptional()
  @IsString()
  subjectId?: string;
}
