import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto, UpdateUserDto, AssignRoleDto } from "./dto/user.dto";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { OrganizationScopeGuard } from "../../common/guards/organization-scope.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtPayload } from "../auth/auth.service";

@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, OrganizationScopeGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a user within the current organization" })
  create(@Body() dto: CreateUserDto, @CurrentUser() user: JwtPayload) {
    return this.service.create(dto, user.sub, user.orgId ?? undefined);
  }

  @Get()
  @ApiOperation({
    summary: "List users in the current organization (paginated)",
  })
  findAll(@CurrentUser() user: JwtPayload, @Query() pagination: PaginationDto) {
    return this.service.findAll(
      user.orgId!,
      pagination.page,
      pagination.pageSize,
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user by ID" })
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update user name or status" })
  update(
    @Param("id") id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.update(id, dto, user.sub);
  }

  @Post(":id/roles")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Assign a role to a user" })
  assignRole(
    @Param("id") id: string,
    @Body() dto: AssignRoleDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.assignRole(id, dto, user.orgId!, user.sub);
  }

  @Delete(":id/roles/:roleId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remove a role from a user" })
  removeRole(
    @Param("id") id: string,
    @Param("roleId") roleId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.removeRole(id, roleId, user.orgId!, user.sub);
  }

  @Get(":id/roles")
  @ApiOperation({ summary: "Get roles and permissions for a user" })
  getRoles(@Param("id") id: string) {
    return this.service.getUserRoles(id);
  }
}
