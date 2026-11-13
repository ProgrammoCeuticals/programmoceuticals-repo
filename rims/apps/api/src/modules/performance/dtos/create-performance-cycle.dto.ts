import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreatePerformanceCycleDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;
}
