import {
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  MinLength,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @MinLength(1)
  firstName!: string;

  @IsString()
  @MinLength(1)
  lastName!: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  teamId?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  positionId?: string;

  @IsOptional()
  @IsDateString()
  hireDate?: string;
}
