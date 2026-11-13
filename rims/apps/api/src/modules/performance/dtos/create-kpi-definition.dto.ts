import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateKpiDefinitionDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  measurementType?: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  directionality?: string;

  @IsOptional()
  @IsNumber()
  defaultWeight?: number;

  @IsOptional()
  @IsString()
  targetValue?: string;

  @IsOptional()
  @IsBoolean()
  evidenceRequired?: boolean;

  @IsOptional()
  @IsString()
  objectiveId?: string;
}
