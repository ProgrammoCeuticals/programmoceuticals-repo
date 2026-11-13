import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { Prisma, EmployeeStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { NotificationDispatcher } from "../notifications/notification-dispatcher";
import { ScopeContextService } from "../../common/scope/scope-context.service";
import { ScopeAssignment } from "@rims/shared-types";
import { CreateEmployeeDto } from "./dtos/create-employee.dto";
import { UpdateEmployeeDto } from "./dtos/update-employee.dto";
import { QueryEmployeesDto } from "./dtos/query-employees.dto";

@Injectable()
export class EmployeesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly scopeContext: ScopeContextService,
    private readonly dispatcher: NotificationDispatcher,
  ) {}

  async findAll(
    tenantId: string,
    query: QueryEmployeesDto,
    scopes: ScopeAssignment[],
  ) {
    const { status, departmentId, search, page = 1, pageSize = 20 } = query;

    const baseFilter = this.scopeContext.buildEmployeeFilter(scopes, tenantId);
    if (baseFilter === null) {
      return {
        data: [],
        meta: { total: 0, page, pageSize, totalPages: 0 },
      };
    }

    const institutionScoped = this.scopeContext.hasInstitutionScope(scopes);

    const where: Prisma.EmployeeWhereInput = {
      ...(baseFilter as Prisma.EmployeeWhereInput),
      ...(status && { status: status as Prisma.EnumEmployeeStatusFilter }),
    };

    // Only institution-wide users can further narrow by departmentId query param
    if (departmentId && institutionScoped) {
      where.departmentId = departmentId;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
      ];
    }

    const include = {
      position: { select: { title: true } },
      team: { select: { name: true } },
      department: { select: { name: true } },
    };

    const [total, data] = await Promise.all([
      this.prisma.employee.count({ where }),
      this.prisma.employee.findMany({
        where,
        include,
        orderBy: { createdAt: "asc" },
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

  async create(dto: CreateEmployeeDto, tenantId: string, actorId: string) {
    const employee = await this.prisma.employee.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        tenantId,
        status: "ACTIVE",
        ...(dto.userId !== undefined ? { userId: dto.userId } : {}),
        ...(dto.departmentId !== undefined
          ? { departmentId: dto.departmentId }
          : {}),
        ...(dto.teamId !== undefined ? { teamId: dto.teamId } : {}),
        ...(dto.positionId !== undefined ? { positionId: dto.positionId } : {}),
        ...(dto.hireDate !== undefined
          ? { hireDate: new Date(dto.hireDate) }
          : {}),
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "employee.created",
      resourceType: "Employee",
      resourceId: employee.id,
      outcome: "SUCCESS",
    });

    // Auto-create hire record
    await this.prisma.employmentRecord.create({
      data: {
        employeeId: employee.id,
        eventType: "HIRE",
        description: "Employee hired",
        effectiveDate: dto.hireDate ? new Date(dto.hireDate) : new Date(),
        recordedById: actorId,
      },
    });

    return employee;
  }

  async findOne(id: string, tenantId: string, scopes: ScopeAssignment[]) {
    const employee = await this.prisma.employee.findFirst({
      where: { id, tenantId },
      include: {
        qualifications: true,
        skills: true,
        employmentRecords: true,
        position: true,
        team: true,
        department: true,
      },
    });

    if (!employee) {
      throw new NotFoundException("Employee not found");
    }

    if (!this.scopeContext.hasInstitutionScope(scopes)) {
      const deptIds = this.scopeContext.getDepartmentIds(scopes);
      const teamIds = this.scopeContext.getTeamIds(scopes);
      const inDept =
        employee.departmentId !== null &&
        deptIds.includes(employee.departmentId);
      const inTeam =
        employee.teamId !== null && teamIds.includes(employee.teamId);
      if (!inDept && !inTeam) {
        throw new ForbiddenException("Access denied");
      }
    }

    return employee;
  }

  async update(
    id: string,
    dto: UpdateEmployeeDto,
    tenantId: string,
    actorId: string,
  ) {
    const employee = await this.prisma.employee.findFirst({
      where: { id, tenantId },
    });

    if (!employee) {
      throw new NotFoundException("Employee not found");
    }

    const data: Prisma.EmployeeUncheckedUpdateInput = {};
    if (dto.firstName !== undefined) data.firstName = dto.firstName;
    if (dto.lastName !== undefined) data.lastName = dto.lastName;
    if (dto.userId !== undefined) data.userId = dto.userId;
    if (dto.departmentId !== undefined) data.departmentId = dto.departmentId;
    if (dto.teamId !== undefined) data.teamId = dto.teamId;
    if (dto.positionId !== undefined) data.positionId = dto.positionId;
    if (dto.hireDate !== undefined) data.hireDate = new Date(dto.hireDate);
    if (dto.status !== undefined) {
      data.status = dto.status as EmployeeStatus;
      if (dto.status === "ARCHIVED") {
        data.archivedAt = new Date();
      }
    }

    const updated = await this.prisma.employee.update({
      where: { id },
      data,
    });

    // Auto-create EmploymentRecord for status changes
    if (dto.status !== undefined && dto.status !== employee.status) {
      const eventTypeMap: Record<string, string> = {
        ACTIVE: employee.status === "ON_LEAVE" ? "RETURN_FROM_LEAVE" : "REHIRE",
        ON_LEAVE: "LEAVE_START",
        SUSPENDED: "SUSPENSION",
        TERMINATED: "TERMINATION",
        ARCHIVED: "ARCHIVE",
      };
      const eventType = eventTypeMap[dto.status] ?? "STATUS_CHANGE";
      await this.prisma.employmentRecord.create({
        data: {
          employeeId: id,
          eventType,
          description: `Status changed from ${employee.status} to ${dto.status}`,
          effectiveDate: new Date(),
          recordedById: actorId,
        },
      });

      // Notify HR managers on termination or suspension
      if (dto.status === "TERMINATED" || dto.status === "SUSPENDED") {
        await this.dispatcher.dispatchToPermission(
          "employee.status_change",
          "employees.write",
          {
            tenantId,
            title: `Employee ${dto.status.toLowerCase()}`,
            body: `${employee.firstName} ${employee.lastName} has been ${dto.status.toLowerCase()}.`,
            resourceType: "Employee",
            resourceId: id,
            actionUrl: `/employees/${id}`,
          },
        );
      }
    }

    // Auto-create EmploymentRecord for department/team transfers
    if (
      dto.departmentId !== undefined &&
      dto.departmentId !== employee.departmentId
    ) {
      await this.prisma.employmentRecord.create({
        data: {
          employeeId: id,
          eventType: "TRANSFER",
          description: `Department transfer`,
          effectiveDate: new Date(),
          recordedById: actorId,
        },
      });
    }

    await this.auditService.log({
      tenantId,
      actorId,
      action: "employee.updated",
      resourceType: "Employee",
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }

  async addQualification(
    employeeId: string,
    dto: { name: string; institution?: string; yearObtained?: number },
    tenantId: string,
  ) {
    const employee = await this.prisma.employee.findFirst({ where: { id: employeeId, tenantId } });
    if (!employee) throw new NotFoundException("Employee not found");
    return this.prisma.employeeQualification.create({
      data: {
        employeeId,
        name: dto.name,
        ...(dto.institution !== undefined ? { institution: dto.institution } : {}),
        ...(dto.yearObtained !== undefined ? { yearObtained: dto.yearObtained } : {}),
      },
    });
  }

  async addSkill(
    employeeId: string,
    dto: { skill: string; level?: string },
    tenantId: string,
  ) {
    const employee = await this.prisma.employee.findFirst({ where: { id: employeeId, tenantId } });
    if (!employee) throw new NotFoundException("Employee not found");
    return this.prisma.employeeSkill.create({
      data: {
        employeeId,
        skill: dto.skill,
        ...(dto.level !== undefined ? { level: dto.level } : {}),
      },
    });
  }
}
