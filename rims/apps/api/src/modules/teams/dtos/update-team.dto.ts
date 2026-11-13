import { IsString, IsUUID, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateTeamDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  departmentId?: string;
}
