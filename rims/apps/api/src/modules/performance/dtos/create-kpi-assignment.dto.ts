import { IsString, IsNotEmpty, IsNumber, IsOptional, IsIn } from 'class-validator';

export class CreateKpiAssignmentDto {
  @IsString()
  @IsNotEmpty()
  cycleId!: string;

  @IsString()
  @IsNotEmpty()
  kpiId!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['EMPLOYEE', 'TEAM', 'DEPARTMENT'])
  subjectType!: string;

  @IsString()
  @IsNotEmpty()
  subjectId!: string;

  @IsNumber()
  weight!: number;

  @IsOptional()
  @IsString()
  targetValue?: string;
}
