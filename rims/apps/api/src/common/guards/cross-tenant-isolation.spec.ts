/**
 * Cross-tenant isolation tests (T-002)
 *
 * These tests verify that a user authenticated to Tenant A cannot read or
 * write resources belonging to Tenant B. They exercise the full guard stack:
 * JwtAuthGuard → TenantMiddleware → PermissionsGuard → RLS.
 *
 * Each test provisions two independent tenants, authenticates as Tenant A's
 * admin, then attempts to access Tenant B's resources directly.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../modules/prisma/prisma.service';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function provisionTenant(
  prisma: PrismaService,
  slug: string,
  email: string,
): Promise<{ tenantId: string; userId: string }> {
  const tenant = await prisma.tenant.create({
    data: { name: `Test Tenant ${slug}`, slug, status: 'ACTIVE' },
  });

  await prisma.tenantSettings.create({
    data: {
      tenantId: tenant.id,
      defaultLocale: 'en',
      defaultTimezone: 'UTC',
      sessionTimeoutMinutes: 480,
      allowedIpRanges: [],
    },
  });

  await prisma.institution.create({
    data: { tenantId: tenant.id, name: `Institution ${slug}` },
  });

  const passwordHash = await argon2.hash('TestPass123!');
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName: 'Test',
      lastName: 'Admin',
      status: 'ACTIVE',
      tenantId: tenant.id,
    },
  });

  await prisma.userTenantMembership.create({
    data: { userId: user.id, tenantId: tenant.id },
  });

  // Seed minimal permissions + Institution Admin role
  const permCodes = [
    'employees.view', 'employees.create',
    'departments.view', 'departments.create',
    'research.projects.view', 'research.projects.create',
    'institution.view',
  ];

  for (const code of permCodes) {
    await prisma.permission.upsert({
      where: { code },
      update: {},
      create: { code, scope: 'TENANT' },
    });
  }

  const allPerms = await prisma.permission.findMany({
    where: { code: { in: permCodes } },
  });

  const role = await prisma.role.create({
    data: { tenantId: tenant.id, name: 'Institution Admin', scope: 'TENANT' },
  });

  await prisma.rolePermission.createMany({
    data: allPerms.map((p) => ({ roleId: role.id, permissionId: p.id })),
    skipDuplicates: true,
  });

  await prisma.userRoleAssignment.create({
    data: { userId: user.id, roleId: role.id },
  });

  return { tenantId: tenant.id, userId: user.id };
}

async function loginAndGetToken(
  app: INestApplication,
  email: string,
  password: string,
): Promise<string> {
  const res = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({ email, password })
    .expect(201);

  return (res.body as { data: { accessToken: string } }).data.accessToken;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Cross-tenant isolation (T-002)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let tenantAId: string;
  let tenantBId: string;
  let tenantAToken: string;

  // Resources belonging to Tenant B
  let tenantBEmployeeId: string;
  let tenantBDepartmentId: string;
  let tenantBProjectId: string;

  const slugA = `iso-tenant-a-${crypto.randomBytes(4).toString('hex')}`;
  const slugB = `iso-tenant-b-${crypto.randomBytes(4).toString('hex')}`;
  const emailA = `admin-a-${slugA}@test.local`;
  const emailB = `admin-b-${slugB}@test.local`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    prisma = app.get(PrismaService);

    // Provision two independent tenants
    const a = await provisionTenant(prisma, slugA, emailA);
    const b = await provisionTenant(prisma, slugB, emailB);
    tenantAId = a.tenantId;
    tenantBId = b.tenantId;

    // Create resources in Tenant B
    const dept = await prisma.department.create({
      data: { tenantId: tenantBId, name: 'Dept B' },
    });
    tenantBDepartmentId = dept.id;

    const emp = await prisma.employee.create({
      data: { tenantId: tenantBId, firstName: 'Bob', lastName: 'B' },
    });
    tenantBEmployeeId = emp.id;

    const proj = await prisma.researchProject.create({
      data: { tenantId: tenantBId, title: 'Project B', status: 'ACTIVE' },
    });
    tenantBProjectId = proj.id;

    // Authenticate as Tenant A
    tenantAToken = await loginAndGetToken(app, emailA, 'TestPass123!');
  });

  afterAll(async () => {
    // Clean up both tenants (cascade deletes all related records)
    await prisma.tenant.deleteMany({
      where: { slug: { in: [slugA, slugB] } },
    });
    await app.close();
  });

  // ── Employee isolation ────────────────────────────────────────────────────

  it('Tenant A cannot list Tenant B employees', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/employees')
      .set('Authorization', `Bearer ${tenantAToken}`)
      .expect(200);

    const ids = (res.body as { data: { data: { id: string }[] } }).data.data.map(
      (e) => e.id,
    );
    expect(ids).not.toContain(tenantBEmployeeId);
  });

  it('Tenant A cannot fetch a specific Tenant B employee by ID', async () => {
    await request(app.getHttpServer())
      .get(`/api/v1/employees/${tenantBEmployeeId}`)
      .set('Authorization', `Bearer ${tenantAToken}`)
      .expect(404);
  });

  it('Tenant A cannot update a Tenant B employee', async () => {
    await request(app.getHttpServer())
      .patch(`/api/v1/employees/${tenantBEmployeeId}`)
      .set('Authorization', `Bearer ${tenantAToken}`)
      .send({ firstName: 'Hacked' })
      .expect(404);
  });

  // ── Department isolation ──────────────────────────────────────────────────

  it('Tenant A cannot list Tenant B departments', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/departments')
      .set('Authorization', `Bearer ${tenantAToken}`)
      .expect(200);

    const ids = (res.body as { data: { id: string }[] }).data.map(
      (d: { id: string }) => d.id,
    );
    expect(ids).not.toContain(tenantBDepartmentId);
  });

  it('Tenant A cannot fetch a specific Tenant B department by ID', async () => {
    await request(app.getHttpServer())
      .get(`/api/v1/departments/${tenantBDepartmentId}`)
      .set('Authorization', `Bearer ${tenantAToken}`)
      .expect(404);
  });

  // ── Research project isolation ────────────────────────────────────────────

  it('Tenant A cannot list Tenant B research projects', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/research/projects')
      .set('Authorization', `Bearer ${tenantAToken}`)
      .expect(200);

    const ids = (
      res.body as { data: { data: { id: string }[] } }
    ).data.data.map((p) => p.id);
    expect(ids).not.toContain(tenantBProjectId);
  });

  it('Tenant A cannot fetch a specific Tenant B research project by ID', async () => {
    await request(app.getHttpServer())
      .get(`/api/v1/research/projects/${tenantBProjectId}`)
      .set('Authorization', `Bearer ${tenantAToken}`)
      .expect(404);
  });

  // ── Unauthenticated access ────────────────────────────────────────────────

  it('Unauthenticated request to protected route returns 401', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/employees')
      .expect(401);
  });

  // ── Tampered tenant ID in JWT payload ────────────────────────────────────

  it('Request with a tampered/invalid JWT returns 401', async () => {
    const parts = tenantAToken.split('.');
    // Corrupt the payload segment
    const tamperedToken = `${parts[0]}.${Buffer.from(
      JSON.stringify({ sub: 'fake', tenantId: tenantBId }),
    ).toString('base64url')}.${parts[2]}`;

    await request(app.getHttpServer())
      .get('/api/v1/employees')
      .set('Authorization', `Bearer ${tamperedToken}`)
      .expect(401);
  });
});
