import { IsString, IsOptional, IsEnum } from "class-validator";
import { AuditOutcome } from "@prisma/client";

export class CreateAuditEventDto {
  @IsString()
  tenantId!: string;

  @IsString()
  @IsOptional()
  actorId?: string;

  @IsString()
  action!: string;

  @IsString()
  resourceType!: string;

  @IsString()
  @IsOptional()
  resourceId?: string;

  @IsEnum(AuditOutcome)
  @IsOptional()
  outcome?: AuditOutcome; // default SUCCESS

  @IsOptional()
  beforeState?: Record<string, unknown>;

  @IsOptional()
  afterState?: Record<string, unknown>;

  @IsString()
  @IsOptional()
  ipAddress?: string;

  @IsString()
  @IsOptional()
  userAgent?: string;

  @IsString()
  @IsOptional()
  requestId?: string;
}
