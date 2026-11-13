import { IsString, IsNotEmpty, IsOptional, IsNumberString } from 'class-validator';

export class CreateFundingSourceDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  funderName?: string;

  @IsOptional()
  @IsString()
  grantRef?: string;

  @IsOptional()
  @IsNumberString()
  totalAmount?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
