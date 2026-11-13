import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AddMemberDto {
  @IsString()
  @IsNotEmpty()
  employeeId!: string;

  @IsOptional()
  @IsString()
  role?: string;
}
