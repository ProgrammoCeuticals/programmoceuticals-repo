import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { RequirePermissions } from "../../common/decorators/require-permissions.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtPayload } from "@rims/shared-types";
import { EmployeesService } from "./employees.service";
import { CreateEmployeeDto } from "./dtos/create-employee.dto";
import { UpdateEmployeeDto } from "./dtos/update-employee.dto";
import { QueryEmployeesDto } from "./dtos/query-employees.dto";

@Controller("employees")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @RequirePermissions("employees.view")
  findAll(@Query() query: QueryEmployeesDto, @CurrentUser() user: JwtPayload) {
    return this.employeesService.findAll(user.tenantId, query, user.scopes ?? []);
  }

  @Post()
  @RequirePermissions("employees.write")
  create(@Body() dto: CreateEmployeeDto, @CurrentUser() user: JwtPayload) {
    return this.employeesService.create(dto, user.tenantId, user.sub);
  }

  @Get(":id")
  @RequirePermissions("employees.view")
  findOne(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    return this.employeesService.findOne(id, user.tenantId, user.scopes ?? []);
  }

  @Patch(":id")
  @RequirePermissions("employees.write")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateEmployeeDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.employeesService.update(id, dto, user.tenantId, user.sub);
  }

  @Post(":id/qualifications")
  @RequirePermissions("employees.write")
  addQualification(
    @Param("id") id: string,
    @Body() dto: { name: string; institution?: string; yearObtained?: number },
    @CurrentUser() user: JwtPayload,
  ) {
    return this.employeesService.addQualification(id, dto, user.tenantId);
  }

  @Post(":id/skills")
  @RequirePermissions("employees.write")
  addSkill(
    @Param("id") id: string,
    @Body() dto: { skill: string; level?: string },
    @CurrentUser() user: JwtPayload,
  ) {
    return this.employeesService.addSkill(id, dto, user.tenantId);
  }
}
