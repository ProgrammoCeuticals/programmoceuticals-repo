import { IsString, IsNotEmpty, IsOptional, IsNumberString, IsDateString } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  budgetId!: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumberString()
  amount!: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsDateString()
  transactionDate!: string;

  @IsOptional()
  @IsString()
  reference?: string;
}
