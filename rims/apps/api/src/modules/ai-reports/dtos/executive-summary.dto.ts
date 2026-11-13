import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class ExecutiveSummaryDto {
  @IsString()
  @IsNotEmpty()
  @IsDateString()
  periodStart!: string;

  @IsString()
  @IsNotEmpty()
  @IsDateString()
  periodEnd!: string;
}
