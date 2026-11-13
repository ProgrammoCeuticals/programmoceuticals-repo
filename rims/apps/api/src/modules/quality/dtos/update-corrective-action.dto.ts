import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateCorrectiveActionDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() ownerId?: string;
  @IsOptional() @IsDateString() dueDate?: string;
  @IsOptional() @IsString() evidenceRef?: string;
}
