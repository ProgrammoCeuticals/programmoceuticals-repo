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
import { TasksService } from "./tasks.service";
import { QueryTasksDto } from "./dtos/query-tasks.dto";
import { CreateTaskDto } from "./dtos/create-task.dto";
import { UpdateTaskDto } from "./dtos/update-task.dto";
import { AddCommentDto } from "./dtos/add-comment.dto";

@Controller("tasks")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @RequirePermissions("tasks.view")
  findAll(@Query() query: QueryTasksDto, @CurrentUser() user: JwtPayload) {
    return this.tasksService.findAll(
      user.tenantId,
      query,
      user.scopes ?? [],
      user.sub,
    );
  }

  @Post()
  @RequirePermissions("tasks.create")
  create(@Body() dto: CreateTaskDto, @CurrentUser() user: JwtPayload) {
    return this.tasksService.create(dto, user.tenantId, user.sub);
  }

  @Get(":id")
  @RequirePermissions("tasks.view")
  findOne(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    return this.tasksService.findOne(
      id,
      user.tenantId,
      user.scopes ?? [],
      user.sub,
    );
  }

  @Patch(":id")
  @RequirePermissions("tasks.update")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.tasksService.update(id, dto, user.tenantId, user.sub);
  }

  @Post(":id/comments")
  @RequirePermissions("tasks.update")
  addComment(
    @Param("id") id: string,
    @Body() dto: AddCommentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.tasksService.addComment(
      id,
      dto.content,
      user.sub,
      user.tenantId,
    );
  }
}
