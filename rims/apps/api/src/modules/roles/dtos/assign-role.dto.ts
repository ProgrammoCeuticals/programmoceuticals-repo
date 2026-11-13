import { IsIn, IsOptional, IsUUID } from "class-validator";

export class AssignRoleDto {
  @IsUUID()
  roleId!: string;

  @IsIn(["INSTITUTION", "DEPARTMENT", "TEAM", "PROJECT"])
  @IsOptional()
  scopeType?: string;

  @IsUUID()
  @IsOptional()
  scopeId?: string;

  @IsUUID()
  @IsOptional()
  assignedById?: string;
}
