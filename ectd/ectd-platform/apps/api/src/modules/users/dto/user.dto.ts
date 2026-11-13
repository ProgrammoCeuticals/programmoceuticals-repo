import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsIn,
  MinLength,
  MaxLength,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ example: "Jane Smith" })
  @IsString()
  @MaxLength(500)
  name!: string;

  @ApiProperty({ example: "jane@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: "Initial password (min 12 chars)",
    minLength: 12,
  })
  @IsString()
  @MinLength(12)
  password!: string;

  @ApiPropertyOptional({ description: "Organization ID to assign user to" })
  @IsOptional()
  @IsUUID()
  organizationId?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  name?: string;

  @ApiPropertyOptional({ enum: ["ACTIVE", "INACTIVE"] })
  @IsOptional()
  @IsIn(["ACTIVE", "INACTIVE"])
  status?: string;
}

export class AssignRoleDto {
  @ApiProperty({ description: "Role.id to assign" })
  @IsUUID()
  roleId!: string;
}

export class ChangePasswordDto {
  @ApiProperty({ minLength: 12 })
  @IsString()
  @MinLength(12)
  newPassword!: string;
}
