import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dtos/create-role.dto";
import { UpdateRoleDto } from "./dtos/update-role.dto";
import { SetRolePermissionsDto } from "./dtos/set-role-permissions.dto";
import { AssignRoleDto } from "./dtos/assign-role.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { RequirePermissions } from "../../common/decorators/require-permissions.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtPayload } from "@rims/shared-types";

@ApiTags("roles")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get("roles")
  @RequirePermissions("roles.view")
  @ApiOperation({ summary: "List all roles for the current tenant" })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.rolesService.findAll(user.tenantId);
  }

  @Post("roles")
  @RequirePermissions("roles.create")
  @ApiOperation({ summary: "Create a new tenant role" })
  create(@Body() dto: CreateRoleDto, @CurrentUser() user: JwtPayload) {
    return this.rolesService.create(dto, user.tenantId);
  }

  @Patch("roles/:id")
  @RequirePermissions("roles.update")
  @ApiOperation({ summary: "Update a tenant role" })
  update(
    @Param("id") id: string,
    @Body() dto: UpdateRoleDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.rolesService.update(id, dto, user.tenantId);
  }

  @Get("permissions")
  @RequirePermissions("roles.view")
  @ApiOperation({ summary: "List all permissions" })
  findAllPermissions() {
    return this.rolesService.findAllPermissions();
  }

  @Post("roles/:id/permissions")
  @RequirePermissions("roles.update")
  @ApiOperation({ summary: "Set permissions on a role (replaces existing)" })
  setPermissions(
    @Param("id") id: string,
    @Body() dto: SetRolePermissionsDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.rolesService.setPermissions(
      id,
      dto.permissionCodes,
      user.tenantId,
    );
  }

  @Post("users/:id/roles")
  @RequirePermissions("roles.assign")
  @ApiOperation({ summary: "Assign a role to a user" })
  assignRoleToUser(
    @Param("id") userId: string,
    @Body() dto: AssignRoleDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.rolesService.assignRoleToUser(userId, dto, user.tenantId);
  }

  @Delete("users/:id/roles/:assignmentId")
  @RequirePermissions("roles.assign")
  @ApiOperation({ summary: "Remove a role assignment from a user" })
  @HttpCode(HttpStatus.OK)
  removeRoleFromUser(
    @Param("assignmentId") assignmentId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.rolesService.removeRoleFromUser(assignmentId, user.tenantId);
  }
}
