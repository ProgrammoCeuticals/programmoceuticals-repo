import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { Prisma, TaskStatus, TaskPriority } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { ScopeContextService } from "../../common/scope/scope-context.service";
import { ScopeAssignment } from "@rims/shared-types";
import { QueryTasksDto } from "./dtos/query-tasks.dto";
import { CreateTaskDto } from "./dtos/create-task.dto";
import { UpdateTaskDto } from "./dtos/update-task.dto";

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly scopeContext: ScopeContextService,
  ) {}

  async findAll(
    tenantId: string,
    query: QueryTasksDto,
    scopes: ScopeAssignment[],
    userId: string,
  ) {
    const {
      researchProjectId,
      status,
      assigneeId,
      priority,
      page = 1,
      pageSize = 20,
    } = query;

    const baseFilter = this.scopeContext.buildTaskFilter(
      scopes,
      tenantId,
      userId,
    );
    if (baseFilter === null) {
      return { data: [], meta: { total: 0, page, pageSize, totalPages: 0 } };
    }

    const where: Prisma.ProjectTaskWhereInput = {
      ...(baseFilter as Prisma.ProjectTaskWhereInput),
      ...(researchProjectId && { researchProjectId }),
      ...(status && { status: status as TaskStatus }),
      ...(assigneeId && { assigneeId }),
      ...(priority && { priority: priority as TaskPriority }),
    };

    const [total, data] = await Promise.all([
      this.prisma.projectTask.count({ where }),
      this.prisma.projectTask.findMany({
        where,
        include: {
          assignee: { select: { firstName: true, lastName: true } },
          researchProject: { select: { title: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async create(dto: CreateTaskDto, tenantId: string, createdById: string) {
    const task = await this.prisma.projectTask.create({
      data: {
        title: dto.title,
        tenantId,
        createdById,
        status: (dto.status as TaskStatus) ?? TaskStatus.NOT_STARTED,
        priority: (dto.priority as TaskPriority) ?? TaskPriority.MEDIUM,
        ...(dto.description !== undefined
          ? { description: dto.description }
          : {}),
        ...(dto.researchProjectId !== undefined
          ? { researchProjectId: dto.researchProjectId }
          : {}),
        ...(dto.assigneeId !== undefined ? { assigneeId: dto.assigneeId } : {}),
        ...(dto.projectTeamId !== undefined
          ? { projectTeamId: dto.projectTeamId }
          : {}),
        ...(dto.startDate !== undefined
          ? { startDate: new Date(dto.startDate) }
          : {}),
        ...(dto.dueDate !== undefined
          ? { dueDate: new Date(dto.dueDate) }
          : {}),
      },
    });

    await this.auditService.log({
      tenantId,
      actorId: createdById,
      action: "task.created",
      resourceType: "ProjectTask",
      resourceId: task.id,
      outcome: "SUCCESS",
    });

    return task;
  }

  async findOne(
    id: string,
    tenantId: string,
    scopes: ScopeAssignment[],
    userId: string,
  ) {
    const task = await this.prisma.projectTask.findFirst({
      where: { id, tenantId },
      include: {
        comments: {
          include: {
            author: { select: { firstName: true, lastName: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            userId: true,
            teamId: true,
            departmentId: true,
          },
        },
        researchProject: {
          select: { id: true, title: true, departmentId: true },
        },
      },
    });

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    if (!this.scopeContext.hasInstitutionScope(scopes)) {
      const projectIds = this.scopeContext.getProjectIds(scopes);
      const deptIds = this.scopeContext.getDepartmentIds(scopes);
      const teamIds = this.scopeContext.getTeamIds(scopes);

      const isAssignee =
        task.assignee &&
        (task.assignee as { userId?: string | null }).userId === userId;
      const inProject =
        task.researchProjectId !== null &&
        projectIds.includes(task.researchProjectId);
      const inDept =
        task.researchProject &&
        (task.researchProject as { departmentId?: string | null })
          .departmentId !== null &&
        deptIds.includes(
          (task.researchProject as { departmentId?: string | null })
            .departmentId!,
        );
      const inTeam =
        task.assignee &&
        (task.assignee as { teamId?: string | null }).teamId !== null &&
        teamIds.includes((task.assignee as { teamId?: string | null }).teamId!);

      if (!isAssignee && !inProject && !inDept && !inTeam) {
        throw new ForbiddenException("Access denied");
      }
    }

    return task;
  }

  async update(
    id: string,
    dto: UpdateTaskDto,
    tenantId: string,
    actorId: string,
  ) {
    const existing = await this.prisma.projectTask.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException("Task not found");
    }

    const data: Prisma.ProjectTaskUncheckedUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.researchProjectId !== undefined)
      data.researchProjectId = dto.researchProjectId;
    if (dto.assigneeId !== undefined) data.assigneeId = dto.assigneeId ?? null;
    if (dto.projectTeamId !== undefined)
      data.projectTeamId = dto.projectTeamId ?? null;
    if (dto.startDate !== undefined)
      data.startDate = dto.startDate ? new Date(dto.startDate) : null;
    if (dto.dueDate !== undefined) data.dueDate = new Date(dto.dueDate);
    if (dto.priority !== undefined)
      data.priority = dto.priority as TaskPriority;
    if (dto.status !== undefined) {
      data.status = dto.status as TaskStatus;
      if (dto.status === "COMPLETED") {
        data.completedAt = new Date();
      }
    }

    const updated = await this.prisma.projectTask.update({
      where: { id },
      data,
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "task.updated",
      resourceType: "ProjectTask",
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }

  async addComment(
    taskId: string,
    content: string,
    authorId: string,
    tenantId: string,
  ) {
    const task = await this.prisma.projectTask.findFirst({
      where: { id: taskId, tenantId },
    });

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    const comment = await this.prisma.taskComment.create({
      data: {
        taskId,
        authorId,
        content,
      },
    });

    await this.auditService.log({
      tenantId,
      actorId: authorId,
      action: "task.comment.added",
      resourceType: "TaskComment",
      resourceId: comment.id,
      outcome: "SUCCESS",
    });

    return comment;
  }
}
