import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';

export class AddAuthorDto {
  @IsString()
  @IsNotEmpty()
  employeeId!: string;

  @IsOptional()
  @IsString()
  contributionRole?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  authorOrder?: number;

  @IsOptional()
  @IsBoolean()
  isCorresponding?: boolean;
}
