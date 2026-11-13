import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { RequirePermissions } from "../../common/decorators/require-permissions.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtPayload } from "@rims/shared-types";
import { DepartmentsService, DepartmentNode } from "./departments.service";
import { CreateDepartmentDto } from "./dtos/create-department.dto";
import { UpdateDepartmentDto } from "./dtos/update-department.dto";

@Controller("departments")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  @RequirePermissions("departments.view")
  findAll(@CurrentUser() user: JwtPayload): Promise<DepartmentNode[]> {
    return this.departmentsService.findAll(user.tenantId, user.scopes ?? []);
  }

  @Post()
  @RequirePermissions("departments.create")
  create(@Body() dto: CreateDepartmentDto, @CurrentUser() user: JwtPayload) {
    return this.departmentsService.create(dto, user.tenantId, user.sub);
  }

  @Get(":id")
  @RequirePermissions("departments.view")
  findOne(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    return this.departmentsService.findOne(
      id,
      user.tenantId,
      user.scopes ?? [],
    );
  }

  @Patch(":id")
  @RequirePermissions("departments.update")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateDepartmentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.departmentsService.update(id, dto, user.tenantId, user.sub);
  }

  @Post(":id/archive")
  @RequirePermissions("departments.archive")
  @HttpCode(HttpStatus.OK)
  archive(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    return this.departmentsService.archive(id, user.tenantId, user.sub);
  }
}
