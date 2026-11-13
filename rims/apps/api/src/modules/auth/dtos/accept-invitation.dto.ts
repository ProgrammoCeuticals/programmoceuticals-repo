import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional } from 'class-validator';

export class AcceptInvitationDto {
  @ApiProperty({ description: 'Invitation token from email link' })
  @IsString()
  token!: string;

  @ApiProperty({ example: 'Jane Doe', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'NewS3cur3P@ss!' })
  @IsString()
  @MinLength(8)
  password!: string;
}
