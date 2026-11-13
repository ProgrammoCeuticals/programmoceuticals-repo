import { IsString, IsNotEmpty } from 'class-validator';

export class RejectBudgetDto {
  @IsString()
  @IsNotEmpty()
  reason!: string;
}
