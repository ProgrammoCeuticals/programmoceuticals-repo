import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { Prisma, ResearchProjectStatus, MilestoneStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { NotificationDispatcher } from "../notifications/notification-dispatcher";
import { ScopeContextService } from "../../common/scope/scope-context.service";
import { ScopeAssignment } from "@rims/shared-types";
import { QueryResearchProjectsDto } from "./dtos/query-research-projects.dto";
import { CreateResearchProjectDto } from "./dtos/create-research-project.dto";
import { UpdateResearchProjectDto } from "./dtos/update-research-project.dto";
import { CreateMilestoneDto } from "./dtos/create-milestone.dto";
import { UpdateMilestoneDto } from "./dtos/update-milestone.dto";

// Valid status transitions for ResearchProject
const STATUS_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ["PENDING_APPROVAL", "CANCELLED"],
  PENDING_APPROVAL: ["APPROVED", "DRAFT", "CANCELLED"],
  APPROVED: ["ACTIVE", "CANCELLED"],
  ACTIVE: ["ON_HOLD", "COMPLETED", "CANCELLED"],
  ON_HOLD: ["ACTIVE", "CANCELLED"],
  COMPLETED: ["CANCELLED"],
  CANCELLED: [],
  ARCHIVED: [],
};

@Injectable()
export class ResearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly scopeContext: ScopeContextService,
    private readonly dispatcher: NotificationDispatcher,
  ) {}

  async findAll(
    tenantId: string,
    query: QueryResearchProjectsDto,
    scopes: ScopeAssignment[],
    userId: string,
  ) {
    const {
      status,
      departmentId,
      principalInvestigatorId,
      search,
      page = 1,
      pageSize = 20,
    } = query;

    const baseFilter = this.scopeContext.buildProjectFilter(
      scopes,
      tenantId,
      userId,
    );
    if (baseFilter === null) {
      return { data: [], meta: { total: 0, page, pageSize, totalPages: 0 } };
    }

    const institutionScoped = this.scopeContext.hasInstitutionScope(scopes);

    const where: Prisma.ResearchProjectWhereInput = {
      ...(baseFilter as Prisma.ResearchProjectWhereInput),
      ...(status && { status: status as ResearchProjectStatus }),
      ...(principalInvestigatorId && { principalInvestigatorId }),
    };

    // Only institution-scoped users can filter by departmentId query param
    if (departmentId && institutionScoped) {
      where.departmentId = departmentId;
    }

    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    const [total, data] = await Promise.all([
      this.prisma.researchProject.count({ where }),
      this.prisma.researchProject.findMany({
        where,
        include: {
          _count: { select: { members: true, milestones: true } },
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

  async create(
    dto: CreateResearchProjectDto,
    tenantId: string,
    createdById: string,
  ) {
    const project = await this.prisma.researchProject.create({
      data: {
        title: dto.title,
        tenantId,
        createdById,
        ...(dto.summary !== undefined ? { summary: dto.summary } : {}),
        ...(dto.researchArea !== undefined
          ? { researchArea: dto.researchArea }
          : {}),
        ...(dto.methodology !== undefined
          ? { methodology: dto.methodology }
          : {}),
        ...(dto.principalInvestigatorId !== undefined
          ? { principalInvestigatorId: dto.principalInvestigatorId }
          : {}),
        ...(dto.departmentId !== undefined
          ? { departmentId: dto.departmentId }
          : {}),
        ...(dto.startDate !== undefined
          ? { startDate: new Date(dto.startDate) }
          : {}),
        ...(dto.endDate !== undefined
          ? { endDate: new Date(dto.endDate) }
          : {}),
        ...(dto.ethicsApprovalStatus !== undefined
          ? { ethicsApprovalStatus: dto.ethicsApprovalStatus }
          : {}),
        ...(dto.ethicsReferenceNo !== undefined
          ? { ethicsReferenceNo: dto.ethicsReferenceNo }
          : {}),
      },
    });

    await this.auditService.log({
      tenantId,
      actorId: createdById,
      action: "research.project.created",
      resourceType: "ResearchProject",
      resourceId: project.id,
      outcome: "SUCCESS",
    });

    return project;
  }

  async findOne(
    id: string,
    tenantId: string,
    scopes: ScopeAssignment[],
    userId: string,
  ) {
    const project = await this.prisma.researchProject.findFirst({
      where: { id, tenantId },
      include: {
        members: {
          include: {
            employee: { select: { id: true, firstName: true, lastName: true, userId: true } },
          },
        },
        milestones: true,
        approvals: true,
        statusUpdates: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        tasks: {
          include: {
            assignee: { select: { firstName: true, lastName: true } },
            projectTeam: { select: { id: true, name: true } },
          },
        },
        projectTeams: {
          include: {
            leader: { select: { id: true, firstName: true, lastName: true } },
            members: {
              include: {
                employee: {
                  select: { id: true, firstName: true, lastName: true },
                },
              },
            },
            _count: { select: { tasks: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!project) {
      throw new NotFoundException("Research project not found");
    }

    if (!this.scopeContext.hasInstitutionScope(scopes)) {
      const projectIds = this.scopeContext.getProjectIds(scopes);
      const deptIds = this.scopeContext.getDepartmentIds(scopes);
      const inProject = projectIds.includes(id);
      const inDept =
        project.departmentId !== null && deptIds.includes(project.departmentId);
      const isMember = project.members.some(
        (m) => m.employee && (m.employee as { userId?: string | null }).userId === userId,
      );
      if (!inProject && !inDept && !isMember) {
        throw new ForbiddenException("Access denied");
      }
    }

    return project;
  }

  async update(
    id: string,
    dto: UpdateResearchProjectDto,
    tenantId: string,
    actorId: string,
  ) {
    const existing = await this.prisma.researchProject.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException("Research project not found");
    }

    if (dto.status !== undefined) {
      const currentStatus = existing.status as string;
      const allowedNextStatuses = STATUS_TRANSITIONS[currentStatus] ?? [];
      if (!allowedNextStatuses.includes(dto.status)) {
        throw new BadRequestException(
          `Invalid status transition from ${currentStatus} to ${dto.status}`,
        );
      }
    }

    const data: Prisma.ResearchProjectUncheckedUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.summary !== undefined) data.summary = dto.summary;
    if (dto.researchArea !== undefined) data.researchArea = dto.researchArea;
    if (dto.methodology !== undefined) data.methodology = dto.methodology;
    if (dto.principalInvestigatorId !== undefined)
      data.principalInvestigatorId = dto.principalInvestigatorId;
    if (dto.departmentId !== undefined) data.departmentId = dto.departmentId;
    if (dto.startDate !== undefined) data.startDate = new Date(dto.startDate);
    if (dto.endDate !== undefined) data.endDate = new Date(dto.endDate);
    if (dto.ethicsApprovalStatus !== undefined)
      data.ethicsApprovalStatus = dto.ethicsApprovalStatus;
    if (dto.ethicsReferenceNo !== undefined)
      data.ethicsReferenceNo = dto.ethicsReferenceNo;
    if (dto.status !== undefined)
      data.status = dto.status as ResearchProjectStatus;

    const updated = await this.prisma.researchProject.update({
      where: { id },
      data,
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "research.project.updated",
      resourceType: "ResearchProject",
      resourceId: id,
      outcome: "SUCCESS",
    });

    // ── Workflow notifications ────────────────────────────────────────────────
    if (dto.status === "PENDING_APPROVAL") {
      await this.dispatcher.dispatchToPermission(
        "research.project.pending_approval",
        "research.projects.approve",
        {
          tenantId,
          title: "Research project awaiting approval",
          body: `"${existing.title}" has been submitted for approval.`,
          resourceType: "ResearchProject",
          resourceId: id,
          actionUrl: `/research/projects/${id}`,
        },
      );
    } else if (dto.status === "APPROVED" || dto.status === "ACTIVE") {
      // Notify the PI if set
      const project = await this.prisma.researchProject.findFirst({
        where: { id, tenantId },
        include: { principalInvestigator: { include: { user: { select: { id: true, email: true } } } } },
      });
      const piUser = project?.principalInvestigator?.user;
      if (piUser) {
        await this.dispatcher.dispatch("research.project.approved", {
          tenantId,
          userId: piUser.id,
          userEmail: piUser.email,
          title: `Research project ${dto.status === "APPROVED" ? "approved" : "activated"}`,
          body: `"${existing.title}" has been ${dto.status === "APPROVED" ? "approved" : "activated"}.`,
          resourceType: "ResearchProject",
          resourceId: id,
          actionUrl: `/research/projects/${id}`,
        });
      }
    }

    return updated;
  }

  async addMember(
    projectId: string,
    employeeId: string,
    role: string,
    tenantId: string,
    actorId: string,
  ) {
    const project = await this.prisma.researchProject.findFirst({
      where: { id: projectId, tenantId },
    });

    if (!project) {
      throw new NotFoundException("Research project not found");
    }

    const member = await this.prisma.researchProjectMember.create({
      data: {
        researchProjectId: projectId,
        employeeId,
        role,
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "research.project.member.added",
      resourceType: "ResearchProjectMember",
      resourceId: employeeId,
      outcome: "SUCCESS",
    });

    return member;
  }

  async removeMember(
    projectId: string,
    employeeId: string,
    tenantId: string,
    actorId: string,
  ) {
    const project = await this.prisma.researchProject.findFirst({
      where: { id: projectId, tenantId },
    });

    if (!project) {
      throw new NotFoundException("Research project not found");
    }

    const removed = await this.prisma.researchProjectMember.delete({
      where: {
        researchProjectId_employeeId: {
          researchProjectId: projectId,
          employeeId,
        },
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "research.project.member.removed",
      resourceType: "ResearchProjectMember",
      resourceId: employeeId,
      outcome: "SUCCESS",
    });

    return removed;
  }

  async addMilestone(
    projectId: string,
    dto: CreateMilestoneDto,
    tenantId: string,
    actorId: string,
  ) {
    const project = await this.prisma.researchProject.findFirst({
      where: { id: projectId, tenantId },
    });

    if (!project) {
      throw new NotFoundException("Research project not found");
    }

    const milestone = await this.prisma.projectMilestone.create({
      data: {
        title: dto.title,
        tenantId,
        researchProjectId: projectId,
        ...(dto.description !== undefined
          ? { description: dto.description }
          : {}),
        ...(dto.dueDate !== undefined
          ? { dueDate: new Date(dto.dueDate) }
          : {}),
        ...(dto.status !== undefined
          ? { status: dto.status as MilestoneStatus }
          : {}),
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "research.project.milestone.added",
      resourceType: "ProjectMilestone",
      resourceId: milestone.id,
      outcome: "SUCCESS",
    });

    return milestone;
  }

  async updateMilestone(
    milestoneId: string,
    dto: UpdateMilestoneDto,
    tenantId: string,
    actorId: string,
  ) {
    const milestone = await this.prisma.projectMilestone.findFirst({
      where: { id: milestoneId, tenantId },
    });

    if (!milestone) {
      throw new NotFoundException("Milestone not found");
    }

    const data: Prisma.ProjectMilestoneUncheckedUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.dueDate !== undefined) data.dueDate = new Date(dto.dueDate);
    if (dto.status !== undefined) data.status = dto.status as MilestoneStatus;

    const updated = await this.prisma.projectMilestone.update({
      where: { id: milestoneId },
      data,
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "research.project.milestone.updated",
      resourceType: "ProjectMilestone",
      resourceId: milestoneId,
      outcome: "SUCCESS",
    });

    return updated;
  }

  async addStatusUpdate(
    projectId: string,
    content: string,
    authorId: string,
    tenantId: string,
  ) {
    const project = await this.prisma.researchProject.findFirst({
      where: { id: projectId, tenantId },
    });

    if (!project) {
      throw new NotFoundException("Research project not found");
    }

    const statusUpdate = await this.prisma.projectStatusUpdate.create({
      data: {
        researchProjectId: projectId,
        content,
        authorId,
      },
    });

    await this.auditService.log({
      tenantId,
      actorId: authorId,
      action: "research.project.status_update.added",
      resourceType: "ProjectStatusUpdate",
      resourceId: statusUpdate.id,
      outcome: "SUCCESS",
    });

    return statusUpdate;
  }

  async getAllProjectTeams(tenantId: string) {
    const teams = await this.prisma.projectTeam.findMany({
      where: { tenantId },
      include: {
        researchProject: { select: { id: true, title: true } },
        leader: { select: { id: true, firstName: true, lastName: true } },
        members: {
          include: {
            employee: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: "asc" },
    });
    return {
      data: teams,
      meta: {
        total: teams.length,
        page: 1,
        pageSize: teams.length,
        totalPages: 1,
      },
    };
  }

  async getProjectTeams(projectId: string, tenantId: string) {
    return this.prisma.projectTeam.findMany({
      where: { researchProjectId: projectId, tenantId },
      include: {
        leader: { select: { id: true, firstName: true, lastName: true } },
        members: {
          include: {
            employee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                departmentId: true,
              },
            },
          },
        },
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async createProjectTeam(
    projectId: string,
    data: {
      name: string;
      description?: string;
      leaderId?: string;
      startDate?: string;
      endDate?: string;
    },
    tenantId: string,
  ) {
    const project = await this.prisma.researchProject.findFirst({
      where: { id: projectId, tenantId },
    });
    if (!project) throw new NotFoundException("Research project not found");

    return this.prisma.projectTeam.create({
      data: {
        tenantId,
        researchProjectId: projectId,
        name: data.name,
        description: data.description ?? null,
        leaderId: data.leaderId ?? null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
      include: {
        leader: { select: { id: true, firstName: true, lastName: true } },
        members: {
          include: {
            employee: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
    });
  }

  async updateProjectTeam(
    teamId: string,
    data: {
      name?: string;
      description?: string;
      leaderId?: string;
      startDate?: string;
      endDate?: string;
    },
    tenantId: string,
  ) {
    const team = await this.prisma.projectTeam.findFirst({
      where: { id: teamId, tenantId },
    });
    if (!team) throw new NotFoundException("Project team not found");

    return this.prisma.projectTeam.update({
      where: { id: teamId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.leaderId !== undefined && { leaderId: data.leaderId || null }),
        ...(data.startDate !== undefined && {
          startDate: data.startDate ? new Date(data.startDate) : null,
        }),
        ...(data.endDate !== undefined && {
          endDate: data.endDate ? new Date(data.endDate) : null,
        }),
      },
      include: {
        leader: { select: { id: true, firstName: true, lastName: true } },
        members: {
          include: {
            employee: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
    });
  }

  async addProjectTeamMember(
    teamId: string,
    employeeId: string,
    role: string,
    tenantId: string,
  ) {
    const team = await this.prisma.projectTeam.findFirst({
      where: { id: teamId, tenantId },
    });
    if (!team) throw new NotFoundException("Project team not found");

    return this.prisma.projectTeamMember.upsert({
      where: {
        projectTeamId_employeeId: { projectTeamId: teamId, employeeId },
      },
      update: { role },
      create: { projectTeamId: teamId, employeeId, role },
    });
  }

  async removeProjectTeamMember(
    teamId: string,
    employeeId: string,
    tenantId: string,
  ) {
    const team = await this.prisma.projectTeam.findFirst({
      where: { id: teamId, tenantId },
    });
    if (!team) throw new NotFoundException("Project team not found");

    return this.prisma.projectTeamMember.delete({
      where: {
        projectTeamId_employeeId: { projectTeamId: teamId, employeeId },
      },
    });
  }
}
