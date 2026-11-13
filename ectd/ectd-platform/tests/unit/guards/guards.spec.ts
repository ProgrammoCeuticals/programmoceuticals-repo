/**
 * Unit tests — PermissionGuard, SuperAdminGuard, OrganizationScopeGuard
 * spec §40, §41, §42, §49.
 *
 * Tests cover:
 *   PermissionGuard:
 *     + passes when no permission required on route
 *     + passes when user is Super Admin (bypasses DB check) — spec §41
 *     + passes when user has the required permission
 *     - throws ForbiddenException when user lacks permission
 *     - throws ForbiddenException when user has no sub
 *
 *   SuperAdminGuard:
 *     + passes when isSuperAdmin = true
 *     - throws ForbiddenException when isSuperAdmin = false
 *     - throws ForbiddenException when user is undefined
 *
 *   OrganizationScopeGuard:
 *     + passes when user has orgId
 *     + passes when user is Super Admin (no orgId required) — spec §41
 *     - throws ForbiddenException when orgId is null and not Super Admin
 */

import { ForbiddenException } from "@nestjs/common";
import { PermissionGuard } from "../../../apps/api/src/common/guards/permission.guard";
import { SuperAdminGuard } from "../../../apps/api/src/common/guards/super-admin.guard";
import { OrganizationScopeGuard } from "../../../apps/api/src/common/guards/organization-scope.guard";

// ── Helpers ───────────────────────────────────────────────────────────────

function makeContext(user: Record<string, unknown> | undefined, handlerMetadata?: string) {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
    getHandler: () => ({}),
    getClass: () => ({}),
  } as any;
}

function makeReflector(permission: string | undefined) {
  return {
    getAllAndOverride: jest.fn().mockReturnValue(permission),
  } as any;
}

function makePrismaWithPermissions(codes: string[]) {
  return {
    userRole: {
      findMany: jest.fn().mockResolvedValue(
        codes.map((code) => ({
          role: {
            permissions: [{ permission: { code } }],
          },
        })),
      ),
    },
  } as any;
}

// ── PermissionGuard ───────────────────────────────────────────────────────

describe("PermissionGuard (spec §40)", () => {
  it("should pass when no permission is required on the route", async () => {
    const guard = new PermissionGuard(makeReflector(undefined), makePrismaWithPermissions([]));
    const result = await guard.canActivate(makeContext({ sub: "u1", orgId: "org-1", isSuperAdmin: false }));
    expect(result).toBe(true);
  });

  it("should pass when user is Super Admin — bypasses DB check — spec §41", async () => {
    const prisma = makePrismaWithPermissions([]);
    const guard = new PermissionGuard(makeReflector("PUBLISH"), prisma);

    const result = await guard.canActivate(
      makeContext({ sub: "u1", orgId: null, isSuperAdmin: true }),
    );

    expect(result).toBe(true);
    expect(prisma.userRole.findMany).not.toHaveBeenCalled();
  });

  it("should pass when user has the required permission", async () => {
    const guard = new PermissionGuard(
      makeReflector("PUBLISH"),
      makePrismaWithPermissions(["PUBLISH", "DOCUMENT_VIEW"]),
    );

    const result = await guard.canActivate(
      makeContext({ sub: "u1", orgId: "org-1", isSuperAdmin: false }),
    );

    expect(result).toBe(true);
  });

  it("should throw ForbiddenException when user lacks the required permission", async () => {
    const guard = new PermissionGuard(
      makeReflector("PUBLISH"),
      makePrismaWithPermissions(["DOCUMENT_VIEW"]),
    );

    await expect(
      guard.canActivate(makeContext({ sub: "u1", orgId: "org-1", isSuperAdmin: false })),
    ).rejects.toThrow(ForbiddenException);
  });

  it("should throw ForbiddenException when user has no sub", async () => {
    const guard = new PermissionGuard(
      makeReflector("PUBLISH"),
      makePrismaWithPermissions([]),
    );

    await expect(
      guard.canActivate(makeContext({ sub: undefined, orgId: null, isSuperAdmin: false })),
    ).rejects.toThrow(ForbiddenException);
  });

  it("should throw ForbiddenException when user is undefined", async () => {
    const guard = new PermissionGuard(
      makeReflector("PUBLISH"),
      makePrismaWithPermissions([]),
    );

    await expect(
      guard.canActivate(makeContext(undefined)),
    ).rejects.toThrow(ForbiddenException);
  });

  it("error message should name the missing permission", async () => {
    const guard = new PermissionGuard(
      makeReflector("REGULATORY_ADMIN"),
      makePrismaWithPermissions([]),
    );

    await expect(
      guard.canActivate(makeContext({ sub: "u1", orgId: "org-1", isSuperAdmin: false })),
    ).rejects.toThrow(/REGULATORY_ADMIN/);
  });
});

// ── SuperAdminGuard ───────────────────────────────────────────────────────

describe("SuperAdminGuard (spec §41)", () => {
  it("should pass when isSuperAdmin is true", () => {
    const guard = new SuperAdminGuard();
    const result = guard.canActivate(
      makeContext({ sub: "u1", orgId: null, isSuperAdmin: true }),
    );
    expect(result).toBe(true);
  });

  it("should throw ForbiddenException when isSuperAdmin is false", () => {
    const guard = new SuperAdminGuard();
    expect(() =>
      guard.canActivate(makeContext({ sub: "u1", orgId: "org-1", isSuperAdmin: false })),
    ).toThrow(ForbiddenException);
  });

  it("should throw ForbiddenException when user is undefined", () => {
    const guard = new SuperAdminGuard();
    expect(() => guard.canActivate(makeContext(undefined))).toThrow(ForbiddenException);
  });

  it("error message should mention Super Admin privileges", () => {
    const guard = new SuperAdminGuard();
    expect(() =>
      guard.canActivate(makeContext({ sub: "u1", orgId: "org-1", isSuperAdmin: false })),
    ).toThrow(/Super Admin/);
  });
});

// ── OrganizationScopeGuard ────────────────────────────────────────────────

describe("OrganizationScopeGuard (spec §42)", () => {
  it("should pass when user has an orgId", () => {
    const guard = new OrganizationScopeGuard();
    const result = guard.canActivate(
      makeContext({ sub: "u1", orgId: "org-1", isSuperAdmin: false }),
    );
    expect(result).toBe(true);
  });

  it("should pass when user is Super Admin with no orgId — spec §41", () => {
    const guard = new OrganizationScopeGuard();
    const result = guard.canActivate(
      makeContext({ sub: "u1", orgId: null, isSuperAdmin: true }),
    );
    expect(result).toBe(true);
  });

  it("should throw ForbiddenException when orgId is null and not Super Admin", () => {
    const guard = new OrganizationScopeGuard();
    expect(() =>
      guard.canActivate(makeContext({ sub: "u1", orgId: null, isSuperAdmin: false })),
    ).toThrow(ForbiddenException);
  });

  it("should throw ForbiddenException when user is undefined", () => {
    const guard = new OrganizationScopeGuard();
    expect(() => guard.canActivate(makeContext(undefined))).toThrow(ForbiddenException);
  });
});
