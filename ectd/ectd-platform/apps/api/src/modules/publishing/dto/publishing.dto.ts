import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

/**
 * InvalidatePackageDto — spec §30
 * Invalidating a package is an explicit domain command (POST), not a PATCH.
 */
export class InvalidatePackageDto {
  @ApiProperty({
    description: "Reason for invalidation — required for audit trail",
  })
  @IsString()
  reason!: string;

  @ApiPropertyOptional({
    description: "Optional correlation ID linking to an external system",
  })
  @IsOptional()
  @IsString()
  correlationId?: string;
}
