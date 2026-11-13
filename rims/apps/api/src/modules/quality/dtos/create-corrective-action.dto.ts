import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateCorrectiveActionDto {
  @IsString() @IsNotEmpty() title!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() ownerId?: string;
  @IsOptional() @IsDateString() dueDate?: string;
  @IsOptional() @IsString() evidenceRef?: string;
}
