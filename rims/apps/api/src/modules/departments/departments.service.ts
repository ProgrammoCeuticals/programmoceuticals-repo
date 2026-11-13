import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { ScopeContextService } from "../../common/scope/scope-context.service";
import { ScopeAssignment } from "@rims/shared-types";
import { CreateDepartmentDto } from "./dtos/create-department.dto";
import { UpdateDepartmentDto } from "./dtos/update-department.dto";

export interface DepartmentNode {
  id: string;
  name: string;
  parentId: string | null;
  status: string;
  archivedAt: Date | null;
  institutionId: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: { employees: number };
  children: DepartmentNode[];
}

@Injectable()
export class DepartmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly scopeContext: ScopeContextService,
  ) {}

  async findAll(
    tenantId: string,
    scopes: ScopeAssignment[],
  ): Promise<DepartmentNode[]> {
    const filter = this.scopeContext.buildDepartmentFilter(scopes, tenantId);
    if (filter === null) return [];

    const institutionScoped = this.scopeContext.hasInstitutionScope(scopes);

    const flat = await this.prisma.department.findMany({
      where: filter as never,
      include: { _count: { select: { employees: true } } },
      orderBy: { createdAt: "asc" },
    });

    // For institution-wide users: build tree. Scoped users get a flat list.
    if (!institutionScoped) {
      return flat.map((d) => ({ ...d, children: [] }));
    }

    const map = new Map<string, DepartmentNode>();
    const roots: DepartmentNode[] = [];

    for (const d of flat) {
      map.set(d.id, { ...d, children: [] });
    }

    for (const node of map.values()) {
      if (node.parentId && map.has(node.parentId)) {
        map.get(node.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  }

  async create(dto: CreateDepartmentDto, tenantId: string, actorId: string) {
    const department = await this.prisma.department.create({
      data: {
        name: dto.name,
        tenantId,
        ...(dto.parentId !== undefined ? { parentId: dto.parentId } : {}),
        ...(dto.institutionId !== undefined
          ? { institutionId: dto.institutionId }
          : {}),
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "department.created",
      resourceType: "Department",
      resourceId: department.id,
      outcome: "SUCCESS",
    });

    return department;
  }

  async findOne(id: string, tenantId: string, scopes: ScopeAssignment[]) {
    const department = await this.prisma.department.findFirst({
      where: { id, tenantId },
      include: {
        _count: { select: { employees: true } },
        children: { include: { _count: { select: { employees: true } } } },
        employees: {
          where: { status: { not: "ARCHIVED" } },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            status: true,
            hireDate: true,
            position: { select: { title: true } },
          },
          orderBy: { firstName: "asc" },
        },
      },
    });

    if (!department) {
      throw new NotFoundException("Department not found");
    }

    if (!this.scopeContext.hasInstitutionScope(scopes)) {
      const deptIds = this.scopeContext.getDepartmentIds(scopes);
      if (!deptIds.includes(id)) {
        throw new ForbiddenException("Access denied");
      }
    }

    return department;
  }

  async update(
    id: string,
    dto: UpdateDepartmentDto,
    tenantId: string,
    actorId: string,
  ) {
    const department = await this.prisma.department.findFirst({
      where: { id, tenantId },
    });

    if (!department) {
      throw new NotFoundException("Department not found");
    }

    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data["name"] = dto.name;
    if (dto.parentId !== undefined) data["parentId"] = dto.parentId;
    if (dto.institutionId !== undefined)
      data["institutionId"] = dto.institutionId;

    const updated = await this.prisma.department.update({
      where: { id },
      data,
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "department.updated",
      resourceType: "Department",
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }

  async archive(id: string, tenantId: string, actorId: string) {
    const department = await this.prisma.department.findFirst({
      where: { id, tenantId },
    });

    if (!department) {
      throw new NotFoundException("Department not found");
    }

    const activeChildren = await this.prisma.department.count({
      where: { parentId: id, tenantId, status: "ACTIVE" },
    });

    if (activeChildren > 0) {
      throw new ConflictException(
        "Department has active sub-departments. Archive them first.",
      );
    }

    const activeEmployees = await this.prisma.employee.count({
      where: { departmentId: id, tenantId, status: { not: "ARCHIVED" } },
    });

    if (activeEmployees > 0) {
      throw new ConflictException(
        "Department has active employees. Reassign them first.",
      );
    }

    const updated = await this.prisma.department.update({
      where: { id },
      data: { status: "ARCHIVED", archivedAt: new Date() },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "department.archived",
      resourceType: "Department",
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }
}
