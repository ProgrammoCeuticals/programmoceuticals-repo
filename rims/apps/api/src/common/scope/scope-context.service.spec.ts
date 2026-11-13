import { ScopeContextService } from './scope-context.service';
import { ScopeAssignment } from '@rims/shared-types';

describe('ScopeContextService', () => {
  let service: ScopeContextService;

  beforeEach(() => {
    service = new ScopeContextService();
  });

  // ── hasInstitutionScope ───────────────────────────────────────────────────

  describe('hasInstitutionScope', () => {
    it('returns true when at least one scope is INSTITUTION', () => {
      const scopes: ScopeAssignment[] = [
        { roleId: 'r1', roleName: 'Admin', scopeType: 'INSTITUTION', scopeId: null },
      ];
      expect(service.hasInstitutionScope(scopes)).toBe(true);
    });

    it('returns true when mixed scopes include INSTITUTION', () => {
      const scopes: ScopeAssignment[] = [
        { roleId: 'r1', roleName: 'DeptHead', scopeType: 'DEPARTMENT', scopeId: 'd1' },
        { roleId: 'r2', roleName: 'Admin', scopeType: 'INSTITUTION', scopeId: null },
      ];
      expect(service.hasInstitutionScope(scopes)).toBe(true);
    });

    it('returns false when no scope is INSTITUTION', () => {
      const scopes: ScopeAssignment[] = [
        { roleId: 'r1', roleName: 'DeptHead', scopeType: 'DEPARTMENT', scopeId: 'd1' },
        { roleId: 'r2', roleName: 'TeamLead', scopeType: 'TEAM', scopeId: 't1' },
      ];
      expect(service.hasInstitutionScope(scopes)).toBe(false);
    });

    it('returns false for empty scopes', () => {
      expect(service.hasInstitutionScope([])).toBe(false);
    });
  });

  // ── buildEmployeeFilter ───────────────────────────────────────────────────

  describe('buildEmployeeFilter', () => {
    it('returns { tenantId } for institution scope', () => {
      const scopes: ScopeAssignment[] = [
        { roleId: 'r1', roleName: 'Admin', scopeType: 'INSTITUTION', scopeId: null },
      ];
      expect(service.buildEmployeeFilter(scopes, 'tenant1')).toEqual({
        tenantId: 'tenant1',
      });
    });

    it('returns OR filter for department scope', () => {
      const scopes: ScopeAssignment[] = [
        { roleId: 'r1', roleName: 'DeptHead', scopeType: 'DEPARTMENT', scopeId: 'dept1' },
      ];
      expect(service.buildEmployeeFilter(scopes, 'tenant1')).toEqual({
        tenantId: 'tenant1',
        OR: [{ departmentId: { in: ['dept1'] } }],
      });
    });

    it('returns OR filter for team scope', () => {
      const scopes: ScopeAssignment[] = [
        { roleId: 'r1', roleName: 'TeamLead', scopeType: 'TEAM', scopeId: 'team1' },
      ];
      expect(service.buildEmployeeFilter(scopes, 'tenant1')).toEqual({
        tenantId: 'tenant1',
        OR: [{ teamId: { in: ['team1'] } }],
      });
    });

    it('returns OR filter combining dept and team scopes', () => {
      const scopes: ScopeAssignment[] = [
        { roleId: 'r1', roleName: 'DeptHead', scopeType: 'DEPARTMENT', scopeId: 'dept1' },
        { roleId: 'r2', roleName: 'TeamLead', scopeType: 'TEAM', scopeId: 'team1' },
      ];
      const filter = service.buildEmployeeFilter(scopes, 'tenant1') as {
        tenantId: string;
        OR: object[];
      };
      expect(filter.tenantId).toBe('tenant1');
      expect(filter.OR).toHaveLength(2);
    });

    it('returns null when no dept or team scopes', () => {
      const scopes: ScopeAssignment[] = [
        { roleId: 'r1', roleName: 'Researcher', scopeType: 'PROJECT', scopeId: 'proj1' },
      ];
      expect(service.buildEmployeeFilter(scopes, 'tenant1')).toBeNull();
    });

    it('returns null for empty scopes', () => {
      expect(service.buildEmployeeFilter([], 'tenant1')).toBeNull();
    });
  });

  // ── buildProjectFilter ────────────────────────────────────────────────────

  describe('buildProjectFilter', () => {
    it('returns { tenantId } for institution scope', () => {
      const scopes: ScopeAssignment[] = [
        { roleId: 'r1', roleName: 'Admin', scopeType: 'INSTITUTION', scopeId: null },
      ];
      expect(service.buildProjectFilter(scopes, 'tenant1', 'user1')).toEqual({
        tenantId: 'tenant1',
      });
    });

    it('returns OR filter with member fallback for project scope', () => {
      const scopes: ScopeAssignment[] = [
        { roleId: 'r1', roleName: 'Researcher', scopeType: 'PROJECT', scopeId: 'proj1' },
      ];
      const filter = service.buildProjectFilter(scopes, 'tenant1', 'user1') as {
        tenantId: string;
        OR: object[];
      };
      expect(filter.tenantId).toBe('tenant1');
      expect(filter.OR).toContainEqual({ id: { in: ['proj1'] } });
      expect(filter.OR).toContainEqual({
        members: { some: { employee: { userId: 'user1' } } },
      });
    });

    it('always includes member fallback even with no explicit project scopes', () => {
      const scopes: ScopeAssignment[] = [];
      const filter = service.buildProjectFilter(scopes, 'tenant1', 'user99') as {
        tenantId: string;
        OR: object[];
      };
      expect(filter).not.toBeNull();
      expect(filter.OR).toContainEqual({
        members: { some: { employee: { userId: 'user99' } } },
      });
    });

    it('includes departmentId OR condition when department scope present', () => {
      const scopes: ScopeAssignment[] = [
        { roleId: 'r1', roleName: 'DeptHead', scopeType: 'DEPARTMENT', scopeId: 'dept1' },
      ];
      const filter = service.buildProjectFilter(scopes, 'tenant1', 'user1') as {
        tenantId: string;
        OR: object[];
      };
      expect(filter.OR).toContainEqual({ departmentId: { in: ['dept1'] } });
    });
  });

  // ── buildTaskFilter ───────────────────────────────────────────────────────

  describe('buildTaskFilter', () => {
    it('returns { tenantId } for institution scope', () => {
      const scopes: ScopeAssignment[] = [
        { roleId: 'r1', roleName: 'Admin', scopeType: 'INSTITUTION', scopeId: null },
      ];
      expect(service.buildTaskFilter(scopes, 'tenant1', 'user1')).toEqual({
        tenantId: 'tenant1',
      });
    });

    it('always includes assignee condition as fallback', () => {
      const scopes: ScopeAssignment[] = [
        { roleId: 'r1', roleName: 'Researcher', scopeType: 'PROJECT', scopeId: 'proj1' },
      ];
      const filter = service.buildTaskFilter(scopes, 'tenant1', 'user1') as {
        tenantId: string;
        OR: object[];
      };
      expect(filter.OR).toContainEqual({ assignee: { userId: 'user1' } });
    });

    it('includes researchProjectId condition for project scope', () => {
      const scopes: ScopeAssignment[] = [
        { roleId: 'r1', roleName: 'Researcher', scopeType: 'PROJECT', scopeId: 'proj1' },
      ];
      const filter = service.buildTaskFilter(scopes, 'tenant1', 'user1') as {
        tenantId: string;
        OR: object[];
      };
      expect(filter.OR).toContainEqual({ researchProjectId: { in: ['proj1'] } });
    });

    it('includes departmentId condition for department scope', () => {
      const scopes: ScopeAssignment[] = [
        { roleId: 'r1', roleName: 'DeptHead', scopeType: 'DEPARTMENT', scopeId: 'dept1' },
      ];
      const filter = service.buildTaskFilter(scopes, 'tenant1', 'user1') as {
        tenantId: string;
        OR: object[];
      };
      expect(filter.OR).toContainEqual({
        researchProject: { departmentId: { in: ['dept1'] } },
      });
    });

    it('includes team assignee condition for team scope', () => {
      const scopes: ScopeAssignment[] = [
        { roleId: 'r1', roleName: 'TeamLead', scopeType: 'TEAM', scopeId: 'team1' },
      ];
      const filter = service.buildTaskFilter(scopes, 'tenant1', 'user1') as {
        tenantId: string;
        OR: object[];
      };
      expect(filter.OR).toContainEqual({ assignee: { teamId: { in: ['team1'] } } });
    });
  });
});
