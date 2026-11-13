import { IsString, IsOptional, MinLength, MaxLength } from "class-validator";

export class CreateRoleDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;
}
