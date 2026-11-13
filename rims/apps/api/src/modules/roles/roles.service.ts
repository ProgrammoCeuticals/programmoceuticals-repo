import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateRoleDto } from "./dtos/create-role.dto";
import { UpdateRoleDto } from "./dtos/update-role.dto";

export const ALL_PERMISSION_CODES = [
  "institution.view",
  "institution.update",
  "institution.settings.manage",
  "users.view",
  "users.invite",
  "users.update",
  "users.suspend",
  "roles.view",
  "roles.create",
  "roles.update",
  "roles.assign",
  "departments.view",
  "departments.create",
  "departments.update",
  "departments.archive",
  "teams.view",
  "teams.create",
  "teams.update",
  "employees.view",
  "employees.create",
  "employees.update",
  "employees.archive",
  "performance.cycles.view",
  "performance.cycles.manage",
  "performance.kpis.configure",
  "performance.results.submit",
  "performance.results.review",
  "performance.results.approve",
  "performance.reports.view",
  "research.projects.view",
  "research.projects.create",
  "research.projects.update",
  "research.projects.approve",
  "research.projects.close",
  "projects.view",
  "projects.create",
  "projects.update",
  "projects.assign",
  "projects.close",
  "tasks.view",
  "tasks.create",
  "tasks.update",
  "tasks.assign",
  "tasks.complete",
  "reports.view",
  "reports.export",
  "audit.view",
  "publications.view",
  "publications.create",
  "publications.update",
  "finance.view",
  "finance.create",
  "finance.update",
  "finance.approve",
  "quality.reviews.view",
  "quality.reviews.manage",
  "quality.findings.view",
  "quality.findings.manage",
  "documents.view",
  "documents.upload",
  "documents.approve",
  "documents.archive",
  "website.view",
  "website.settings.manage",
  "website.branding.manage",
  "website.pages.create",
  "website.pages.edit",
  "website.pages.delete",
  "website.navigation.manage",
  "website.media.upload",
  "website.media.delete",
  "website.content.submit",
  "website.content.review",
  "website.content.approve",
  "website.content.publish",
  "website.content.unpublish",
  "website.domains.manage",
  "website.analytics.view",
  "website.audit.view",
];

interface RoleDefinition {
  name: string;
  scope: "TENANT" | "SYSTEM";
  isSystem: boolean;
  permissions: string[];
}

const DEFAULT_ROLES: RoleDefinition[] = [
  {
    name: "Institution Admin",
    scope: "TENANT",
    isSystem: false,
    permissions: ALL_PERMISSION_CODES,
  },
  {
    name: "Executive Director",
    scope: "TENANT",
    isSystem: false,
    permissions: [
      "institution.view",
      "departments.view",
      "employees.view",
      "performance.cycles.view",
      "research.projects.view",
      "projects.view",
      "tasks.view",
      "reports.view",
      "audit.view",
      "documents.view",
    ],
  },
  {
    name: "Research Director",
    scope: "TENANT",
    isSystem: false,
    permissions: [
      "research.projects.view",
      "research.projects.create",
      "research.projects.update",
      "projects.view",
      "projects.create",
      "tasks.view",
      "employees.view",
      "reports.view",
      "publications.view",
      "publications.create",
      "publications.update",
    ],
  },
  {
    name: "HR Manager",
    scope: "TENANT",
    isSystem: false,
    permissions: [
      "employees.view",
      "employees.create",
      "employees.update",
      "employees.archive",
      "users.view",
      "users.invite",
      "departments.view",
      "documents.view",
    ],
  },
  {
    name: "Department Head",
    scope: "TENANT",
    isSystem: false,
    permissions: [
      "departments.view",
      "departments.update",
      "teams.view",
      "employees.view",
      "projects.view",
      "tasks.view",
      "performance.cycles.view",
      "performance.results.review",
      "reports.view",
      "documents.view",
    ],
  },
  {
    name: "Team Lead",
    scope: "TENANT",
    isSystem: false,
    permissions: [
      "teams.view",
      "employees.view",
      "projects.view",
      "tasks.view",
      "tasks.create",
      "tasks.update",
      "tasks.assign",
      "tasks.complete",
    ],
  },
  {
    name: "Project Manager",
    scope: "TENANT",
    isSystem: false,
    permissions: [
      "projects.view",
      "projects.create",
      "projects.update",
      "projects.assign",
      "projects.close",
      "tasks.view",
      "tasks.create",
      "tasks.update",
      "tasks.assign",
      "reports.view",
      "documents.view",
    ],
  },
  {
    name: "Principal Investigator",
    scope: "TENANT",
    isSystem: false,
    permissions: [
      "research.projects.view",
      "research.projects.create",
      "research.projects.update",
      "projects.view",
      "tasks.view",
      "employees.view",
      "publications.view",
      "publications.create",
      "finance.view",
      "documents.view",
      "documents.upload",
    ],
  },
  {
    name: "Researcher",
    scope: "TENANT",
    isSystem: false,
    permissions: [
      "research.projects.view",
      "projects.view",
      "tasks.view",
      "tasks.update",
      "tasks.complete",
      "performance.results.submit",
      "publications.view",
      "documents.view",
    ],
  },
  {
    name: "Finance Officer",
    scope: "TENANT",
    isSystem: false,
    permissions: [
      "reports.view",
      "reports.export",
      "finance.view",
      "finance.create",
      "finance.update",
      "finance.approve",
    ],
  },
  {
    name: "QA Officer",
    scope: "TENANT",
    isSystem: false,
    permissions: [
      "reports.view",
      "quality.reviews.view",
      "quality.reviews.manage",
      "quality.findings.view",
      "quality.findings.manage",
    ],
  },
  {
    name: "Auditor",
    scope: "TENANT",
    isSystem: false,
    permissions: ["audit.view", "reports.view", "documents.view"],
  },
  {
    name: "Platform Super Admin",
    scope: "SYSTEM",
    isSystem: true,
    permissions: ALL_PERMISSION_CODES,
  },
];

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.role.findMany({
      where: { OR: [{ tenantId }, { scope: "SYSTEM" }] },
      include: {
        _count: { select: { rolePermissions: true } },
        rolePermissions: {
          include: { permission: { select: { code: true } } },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  async create(dto: CreateRoleDto, tenantId: string) {
    return this.prisma.role.create({
      data: {
        tenantId,
        name: dto.name,
        scope: "TENANT",
        isSystem: false,
      },
    });
  }

  async update(id: string, dto: UpdateRoleDto, tenantId: string) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role || role.tenantId !== tenantId) {
      throw new NotFoundException("Role not found");
    }
    if (role.isSystem) {
      throw new ForbiddenException("System roles cannot be modified");
    }
    return this.prisma.role.update({ where: { id }, data: dto });
  }

  async setPermissions(
    roleId: string,
    permissionCodes: string[],
    tenantId: string,
  ) {
    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    if (!role || role.tenantId !== tenantId) {
      throw new NotFoundException("Role not found");
    }
    const permissions = await this.prisma.permission.findMany({
      where: { code: { in: permissionCodes } },
      select: { id: true },
    });
    return this.prisma.$transaction([
      this.prisma.rolePermission.deleteMany({ where: { roleId } }),
      this.prisma.rolePermission.createMany({
        data: permissions.map((p) => ({ roleId, permissionId: p.id })),
        skipDuplicates: true,
      }),
    ]);
  }

  async assignRoleToUser(
    userId: string,
    dto: {
      roleId: string;
      scopeType?: string;
      scopeId?: string;
      assignedById?: string;
    },
    tenantId: string,
  ) {
    const [role, user] = await Promise.all([
      this.prisma.role.findUnique({ where: { id: dto.roleId } }),
      this.prisma.user.findUnique({ where: { id: userId } }),
    ]);
    if (!role || role.tenantId !== tenantId) {
      throw new NotFoundException("Role not found");
    }
    if (!user || user.tenantId !== tenantId) {
      throw new NotFoundException("User not found");
    }
    // Check for exact duplicate before creating
    const existing = await this.prisma.userRoleAssignment.findFirst({
      where: {
        userId,
        roleId: dto.roleId,
        scopeType: dto.scopeType ?? "INSTITUTION",
        scopeId: dto.scopeId ?? null,
      },
    });
    if (existing) return existing;
    return this.prisma.userRoleAssignment.create({
      data: {
        userId,
        roleId: dto.roleId,
        scopeType: dto.scopeType ?? "INSTITUTION",
        scopeId: dto.scopeId ?? null,
        assignedById: dto.assignedById ?? null,
      },
    });
  }

  async removeRoleFromUser(assignmentId: string, tenantId: string) {
    const assignment = await this.prisma.userRoleAssignment.findUnique({
      where: { id: assignmentId },
      include: { user: { select: { tenantId: true } } },
    });
    if (!assignment || assignment.user.tenantId !== tenantId) {
      throw new NotFoundException("Role assignment not found");
    }
    await this.prisma.userRoleAssignment.delete({
      where: { id: assignmentId },
    });
    return { success: true };
  }

  async findAllPermissions() {
    return this.prisma.permission.findMany({ orderBy: { code: "asc" } });
  }

  async seedDefaultRolesForTenant(tenantId: string): Promise<void> {
    // 1. Upsert all permissions
    for (const code of ALL_PERMISSION_CODES) {
      await this.prisma.permission.upsert({
        where: { code },
        update: {},
        create: { code, description: code, scope: "TENANT" },
      });
    }

    // 2. Fetch all permissions once so we can map code -> id
    const allPerms = await this.prisma.permission.findMany({
      where: { code: { in: ALL_PERMISSION_CODES } },
      select: { id: true, code: true },
    });
    const permMap = new Map(allPerms.map((p) => [p.code, p.id]));

    // 3. Upsert each role and set its permissions
    for (const def of DEFAULT_ROLES) {
      const role = await this.prisma.role.upsert({
        where: { tenantId_name: { tenantId, name: def.name } },
        update: {},
        create: {
          tenantId,
          name: def.name,
          scope: def.scope,
          isSystem: def.isSystem,
        },
      });

      const permIds = def.permissions
        .map((code) => permMap.get(code))
        .filter((id): id is string => id !== undefined);

      await this.prisma.$transaction([
        this.prisma.rolePermission.deleteMany({ where: { roleId: role.id } }),
        this.prisma.rolePermission.createMany({
          data: permIds.map((permissionId) => ({
            roleId: role.id,
            permissionId,
          })),
          skipDuplicates: true,
        }),
      ]);
    }
  }
}
