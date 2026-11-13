import { Injectable } from '@nestjs/common';
import { ScopeAssignment } from '@rims/shared-types';

@Injectable()
export class ScopeContextService {
  hasInstitutionScope(scopes: ScopeAssignment[]): boolean {
    return scopes.some((s) => s.scopeType === 'INSTITUTION');
  }

  getDepartmentIds(scopes: ScopeAssignment[]): string[] {
    return scopes
      .filter((s) => s.scopeType === 'DEPARTMENT' && s.scopeId)
      .map((s) => s.scopeId!);
  }

  getTeamIds(scopes: ScopeAssignment[]): string[] {
    return scopes
      .filter((s) => s.scopeType === 'TEAM' && s.scopeId)
      .map((s) => s.scopeId!);
  }

  getProjectIds(scopes: ScopeAssignment[]): string[] {
    return scopes
      .filter((s) => s.scopeType === 'PROJECT' && s.scopeId)
      .map((s) => s.scopeId!);
  }

  buildEmployeeFilter(
    scopes: ScopeAssignment[],
    tenantId: string,
  ): object | null {
    if (this.hasInstitutionScope(scopes)) return { tenantId };
    const deptIds = this.getDepartmentIds(scopes);
    const teamIds = this.getTeamIds(scopes);
    const conditions: object[] = [];
    if (deptIds.length) conditions.push({ departmentId: { in: deptIds } });
    if (teamIds.length) conditions.push({ teamId: { in: teamIds } });
    if (!conditions.length) return null;
    return { tenantId, OR: conditions };
  }

  buildDepartmentFilter(
    scopes: ScopeAssignment[],
    tenantId: string,
  ): object | null {
    if (this.hasInstitutionScope(scopes)) return { tenantId };
    const deptIds = this.getDepartmentIds(scopes);
    if (!deptIds.length) return null;
    return { tenantId, id: { in: deptIds } };
  }

  buildTeamFilter(
    scopes: ScopeAssignment[],
    tenantId: string,
  ): object | null {
    if (this.hasInstitutionScope(scopes)) return { tenantId };
    const deptIds = this.getDepartmentIds(scopes);
    const teamIds = this.getTeamIds(scopes);
    const conditions: object[] = [];
    if (deptIds.length) conditions.push({ departmentId: { in: deptIds } });
    if (teamIds.length) conditions.push({ id: { in: teamIds } });
    if (!conditions.length) return null;
    return { tenantId, OR: conditions };
  }

  buildProjectFilter(
    scopes: ScopeAssignment[],
    tenantId: string,
    userId: string,
  ): object | null {
    if (this.hasInstitutionScope(scopes)) return { tenantId };
    const deptIds = this.getDepartmentIds(scopes);
    const projectIds = this.getProjectIds(scopes);
    const conditions: object[] = [];
    if (deptIds.length) conditions.push({ departmentId: { in: deptIds } });
    if (projectIds.length) conditions.push({ id: { in: projectIds } });
    conditions.push({ members: { some: { employee: { userId } } } });
    return { tenantId, OR: conditions };
  }

  buildTaskFilter(
    scopes: ScopeAssignment[],
    tenantId: string,
    userId: string,
  ): object | null {
    if (this.hasInstitutionScope(scopes)) return { tenantId };
    const projectIds = this.getProjectIds(scopes);
    const deptIds = this.getDepartmentIds(scopes);
    const teamIds = this.getTeamIds(scopes);
    const conditions: object[] = [];
    conditions.push({ assignee: { userId } });
    if (deptIds.length) {
      conditions.push({ researchProject: { departmentId: { in: deptIds } } });
    }
    if (teamIds.length) {
      conditions.push({ assignee: { teamId: { in: teamIds } } });
    }
    if (projectIds.length) {
      conditions.push({ researchProjectId: { in: projectIds } });
    }
    return { tenantId, OR: conditions };
  }
}
