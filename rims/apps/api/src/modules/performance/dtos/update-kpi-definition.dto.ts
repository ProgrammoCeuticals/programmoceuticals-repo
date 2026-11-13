import { IsOptional, IsString, IsNumber, IsBoolean } from "class-validator";

export class UpdateKpiDefinitionDto {
  @IsOptional()
  @IsString()
  name?: string;

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

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
