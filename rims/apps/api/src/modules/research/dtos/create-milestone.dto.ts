import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateMilestoneDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
