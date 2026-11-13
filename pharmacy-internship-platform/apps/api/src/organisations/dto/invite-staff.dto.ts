import { IsEmail, IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrgMemberRole } from '@pharmintern/shared-types';

export class InviteStaffDto {
  @ApiProperty({ example: 'recruiter@hospital.ng' })
  @IsEmail()
  email!: string;

  @ApiProperty({ enum: OrgMemberRole, isArray: true })
  @IsArray()
  @IsEnum(OrgMemberRole, { each: true })
  roles!: OrgMemberRole[];

  @ApiPropertyOptional({ description: 'Scope to a specific location ID; null means org-wide' })
  @IsOptional()
  @IsString()
  locationId?: string;
}

export class UpdateStaffRolesDto {
  @ApiProperty({ enum: OrgMemberRole, isArray: true })
  @IsArray()
  @IsEnum(OrgMemberRole, { each: true })
  roles!: OrgMemberRole[];
}
