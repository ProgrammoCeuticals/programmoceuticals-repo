import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Reset token from email link' })
  @IsString()
  token!: string;

  @ApiProperty({ example: 'NewS3cur3P@ss!' })
  @IsString()
  @MinLength(8)
  newPassword!: string;
}
