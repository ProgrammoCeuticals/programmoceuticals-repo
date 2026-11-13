import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

/**
 * Database seed — spec §6A.2, §6A.3.
 *
 * Seeds:
 *   - System roles (SUPER_ADMIN is system-scoped, not organization-scoped)
 *   - Required permissions
 *   - Role-permission assignments
 *   - Initial super admin user (password from env — never hard-coded)
 */

const prisma = new PrismaClient();

const PERMISSIONS = [
  "APPLICATION_VIEW",
  "APPLICATION_EDIT",
  "DOCUMENT_VIEW",
  "DOCUMENT_UPLOAD",
  "DOCUMENT_EDIT",
  "SUBMISSION_VIEW",
  "SUBMISSION_EDIT",
  "LIFECYCLE_MANAGE",
  "VALIDATION_RUN",
  "XML_GENERATE",
  "PUBLISH",
  "AUDIT_VIEW",
  "REGULATORY_ADMIN",
  "ORGANIZATION_ADMIN",
  "USER_ADMIN",
  "ROLE_ADMIN",
  "SYSTEM_CONFIG_ADMIN",
];

const ROLES: Array<{ name: string; scope: string; permissions: string[] }> = [
  {
    name: "SUPER_ADMIN",
    scope: "SYSTEM",
    permissions: PERMISSIONS, // all permissions
  },
  {
    name: "ORGANIZATION_ADMIN",
    scope: "ORGANIZATION",
    permissions: [
      "APPLICATION_VIEW",
      "APPLICATION_EDIT",
      "DOCUMENT_VIEW",
      "DOCUMENT_UPLOAD",
      "DOCUMENT_EDIT",
      "SUBMISSION_VIEW",
      "SUBMISSION_EDIT",
      "LIFECYCLE_MANAGE",
      "VALIDATION_RUN",
      "XML_GENERATE",
      "AUDIT_VIEW",
      "USER_ADMIN",
      "ROLE_ADMIN",
    ],
  },
  {
    name: "REGULATORY_MANAGER",
    scope: "ORGANIZATION",
    permissions: [
      "APPLICATION_VIEW",
      "APPLICATION_EDIT",
      "DOCUMENT_VIEW",
      "DOCUMENT_UPLOAD",
      "DOCUMENT_EDIT",
      "SUBMISSION_VIEW",
      "SUBMISSION_EDIT",
      "LIFECYCLE_MANAGE",
      "VALIDATION_RUN",
      "XML_GENERATE",
      "PUBLISH",
      "AUDIT_VIEW",
      "REGULATORY_ADMIN",
    ],
  },
  {
    name: "AUTHOR",
    scope: "ORGANIZATION",
    permissions: [
      "APPLICATION_VIEW",
      "DOCUMENT_VIEW",
      "DOCUMENT_UPLOAD",
      "DOCUMENT_EDIT",
      "SUBMISSION_VIEW",
      "SUBMISSION_EDIT",
      "VALIDATION_RUN",
    ],
  },
  {
    name: "REVIEWER",
    scope: "ORGANIZATION",
    permissions: [
      "APPLICATION_VIEW",
      "DOCUMENT_VIEW",
      "SUBMISSION_VIEW",
      "AUDIT_VIEW",
    ],
  },
  {
    name: "VIEWER",
    scope: "ORGANIZATION",
    permissions: ["APPLICATION_VIEW", "DOCUMENT_VIEW", "SUBMISSION_VIEW"],
  },
];

// Seed base regulatory reference data
const AUTHORITIES = [
  {
    name: "Food and Drug Administration",
    code: "FDA",
    countryCode: "US",
    website: "https://www.fda.gov",
  },
  {
    name: "NAFDAC",
    code: "NAFDAC",
    countryCode: "NG",
    website: "https://www.nafdac.gov.ng",
  },
  {
    name: "European Medicines Agency",
    code: "EMA",
    countryCode: "EU",
    website: "https://www.ema.europa.eu",
  },
];

const REGIONS = [
  { name: "United States", code: "US", countryCode: "US" },
  { name: "Nigeria", code: "NG", countryCode: "NG" },
  { name: "European Union", code: "EU", countryCode: "EU" },
  { name: "ICH (Harmonized)", code: "ICH", countryCode: null },
];

async function main(): Promise<void> {
  console.log("Seeding database...");

  // 1. Permissions
  for (const code of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code },
      update: {},
      create: { code, description: `Permission: ${code}` },
    });
  }
  console.log(`  ✓ ${PERMISSIONS.length} permissions`);

  // 2. Roles + role-permission assignments
  for (const roleDef of ROLES) {
    const role = await prisma.role.upsert({
      where: { name: roleDef.name },
      update: { scope: roleDef.scope },
      create: { name: roleDef.name, scope: roleDef.scope },
    });

    for (const permCode of roleDef.permissions) {
      const perm = await prisma.permission.findUnique({
        where: { code: permCode },
      });
      if (!perm) continue;

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: { roleId: role.id, permissionId: perm.id },
        },
        update: {},
        create: { roleId: role.id, permissionId: perm.id },
      });
    }
  }
  console.log(`  ✓ ${ROLES.length} roles with permissions`);

  // 3. Regulatory authorities
  for (const auth of AUTHORITIES) {
    await prisma.regulatoryAuthority.upsert({
      where: { code: auth.code },
      update: {},
      create: auth,
    });
  }
  console.log(`  ✓ ${AUTHORITIES.length} regulatory authorities`);

  // 4. Regulatory regions
  for (const region of REGIONS) {
    await prisma.regulatoryRegion.upsert({
      where: { code: region.code },
      update: {},
      create: region,
    });
  }
  console.log(`  ✓ ${REGIONS.length} regulatory regions`);

  // 5. Super admin user — password from env, never hard-coded
  const superAdminEmail = process.env["SEED_SUPER_ADMIN_EMAIL"];
  const superAdminPassword = process.env["SEED_SUPER_ADMIN_PASSWORD"];

  if (superAdminEmail && superAdminPassword) {
    const passwordHash = await argon2.hash(superAdminPassword, {
      type: argon2.argon2id,
    });

    const superAdmin = await prisma.user.upsert({
      where: {
        organizationId_email: {
          organizationId: null as unknown as string,
          email: superAdminEmail,
        },
      },
      update: {},
      create: {
        name: "Super Admin",
        email: superAdminEmail,
        passwordHash,
        isSuperAdmin: true,
        status: "ACTIVE",
      },
    });

    const superAdminRole = await prisma.role.findUnique({
      where: { name: "SUPER_ADMIN" },
    });
    if (superAdminRole) {
      await prisma.userRole.upsert({
        where: {
          userId_roleId: { userId: superAdmin.id, roleId: superAdminRole.id },
        },
        update: {},
        create: { userId: superAdmin.id, roleId: superAdminRole.id },
      });
    }

    console.log(`  ✓ Super admin user created: ${superAdminEmail}`);
  } else {
    console.log(
      "  ⚠ SEED_SUPER_ADMIN_EMAIL and SEED_SUPER_ADMIN_PASSWORD not set — skipping super admin creation.",
    );
  }

  // 6. ICH eCTD v4.0 standard baseline entry
  // spec §2: As of September 2026, the ICH eCTD v4.0 page lists IG v1.7 and CV v1.0.3.
  // This seed creates the EctdStandard record. Actual IG and CV artifacts must be
  // imported manually using POST /api/v1/regulatory/packages/import after the seed.
  const ichStandard = await prisma.ectdStandard.upsert({
    where: { name_version: { name: "ICH eCTD v4.0", version: "4.0" } },
    update: {},
    create: {
      name: "ICH eCTD v4.0",
      version: "4.0",
      implementationGuideVersion: "1.7",
      controlledVocabularyVersion: "1.0.3",
      status: "ACTIVE",
      // Effective from ICH eCTD v4.0 adoption — approximate baseline
      effectiveFrom: new Date("2020-01-01"),
    },
  });
  console.log(
    `  ✓ ICH eCTD standard: ${ichStandard.name} v${ichStandard.version} (id: ${ichStandard.id})`,
  );
  console.log(
    "  ℹ  To complete regulatory setup, import IG and CV artifacts via:",
  );
  console.log("     POST /api/v1/regulatory/packages/import");
  console.log(
    "     POST /api/v1/regulatory/standards/:id/link-implementation-guide",
  );
  console.log(
    "     POST /api/v1/regulatory/standards/:id/link-controlled-vocabulary",
  );

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
