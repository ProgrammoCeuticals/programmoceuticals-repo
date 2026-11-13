import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ScopeContextService } from "../../common/scope/scope-context.service";
import { ScopeAssignment } from "@rims/shared-types";
import { CreateTeamDto } from "./dtos/create-team.dto";
import { UpdateTeamDto } from "./dtos/update-team.dto";

@Injectable()
export class TeamsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scopeContext: ScopeContextService,
  ) {}

  async findAll(
    tenantId: string,
    departmentId?: string,
    scopes: ScopeAssignment[] = [],
  ) {
    const filter = this.scopeContext.buildTeamFilter(scopes, tenantId);
    if (filter === null) {
      return [];
    }

    const where: Record<string, unknown> = { ...(filter as object) };
    // If institution-scoped and a departmentId query param is passed, narrow by it
    if (departmentId && this.scopeContext.hasInstitutionScope(scopes)) {
      where["departmentId"] = departmentId;
    }

    return this.prisma.team.findMany({
      where,
      include: {
        _count: { select: { employees: true } },
      },
    });
  }

  async create(dto: CreateTeamDto, tenantId: string) {
    const department = await this.prisma.department.findFirst({
      where: { id: dto.departmentId, tenantId },
    });

    if (!department) {
      throw new NotFoundException("Department not found");
    }

    return this.prisma.team.create({
      data: {
        name: dto.name,
        departmentId: dto.departmentId,
        tenantId,
        status: "ACTIVE",
      },
    });
  }

  async update(id: string, dto: UpdateTeamDto, tenantId: string) {
    const team = await this.prisma.team.findFirst({
      where: { id, tenantId },
    });

    if (!team) {
      throw new NotFoundException("Team not found");
    }

    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data["name"] = dto.name;
    if (dto.departmentId !== undefined) data["departmentId"] = dto.departmentId;

    return this.prisma.team.update({ where: { id }, data });
  }

  async addMember(teamId: string, employeeId: string, tenantId: string) {
    const team = await this.prisma.team.findFirst({
      where: { id: teamId, tenantId },
    });

    if (!team) {
      throw new NotFoundException("Team not found");
    }

    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, tenantId },
    });

    if (!employee) {
      throw new NotFoundException("Employee not found");
    }

    return this.prisma.employee.update({
      where: { id: employeeId },
      data: { teamId },
    });
  }

  async removeMember(teamId: string, employeeId: string, tenantId: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, tenantId, teamId },
    });

    if (!employee) {
      throw new NotFoundException("Employee not found or not in that team");
    }

    return this.prisma.employee.update({
      where: { id: employeeId },
      data: { teamId: null },
    });
  }
}
