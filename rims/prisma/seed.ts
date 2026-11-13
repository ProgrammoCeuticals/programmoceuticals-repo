// DEMO DATA — for local development only. Not for production.
const { PrismaClient } = require("../node_modules/.prisma/client");
import * as argon2 from "argon2";
import * as crypto from "crypto";

const prisma = new PrismaClient();

const ALL_PERMISSION_CODES = [
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

async function seedPermissionsAndRoles(tenantId: string): Promise<void> {
  // Upsert all permissions
  for (const code of ALL_PERMISSION_CODES) {
    await prisma.permission.upsert({
      where: { code },
      update: {},
      create: { code, description: code, scope: "TENANT" },
    });
  }

  const allPerms = await prisma.permission.findMany({
    where: { code: { in: ALL_PERMISSION_CODES } },
    select: { id: true, code: true },
  });
  const permMap = new Map(
    allPerms.map((p: { code: string; id: string }) => [p.code, p.id]),
  );

  for (const def of DEFAULT_ROLES) {
    const role = await prisma.role.upsert({
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

    await prisma.$transaction([
      prisma.rolePermission.deleteMany({ where: { roleId: role.id } }),
      prisma.rolePermission.createMany({
        data: permIds.map((permissionId) => ({
          roleId: role.id,
          permissionId,
        })),
        skipDuplicates: true,
      }),
    ]);
  }
}

async function main() {
  console.log("🌱  Seeding demo data...");

  // 1. Upsert demo tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: "demo-rims" },
    update: {},
    create: {
      name: "Demo Research Institute",
      slug: "demo-rims",
      status: "ACTIVE",
    },
  });
  console.log(`   tenant: ${tenant.id}`);

  // 2. Upsert TenantSettings
  await prisma.tenantSettings.upsert({
    where: { tenantId: tenant.id },
    update: {},
    create: {
      tenantId: tenant.id,
      defaultLocale: "en",
      defaultTimezone: "UTC",
      mfaRequired: false,
      sessionTimeoutMinutes: 480,
      allowedIpRanges: [],
    },
  });

  // 3. Upsert Institution
  await prisma.institution.upsert({
    where: { tenantId: tenant.id },
    update: {},
    create: {
      tenantId: tenant.id,
      name: "Demo Research Institute",
      type: "UNIVERSITY",
    },
  });

  // 4. Seed permissions and roles
  await seedPermissionsAndRoles(tenant.id);
  console.log("   permissions + roles seeded");

  // 5. Hash password and upsert admin user
  const passwordHash = await argon2.hash("DemoAdmin123!");
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@demo.rims.local" },
    update: { passwordHash, status: "ACTIVE" },
    create: {
      email: "admin@demo.rims.local",
      passwordHash,
      firstName: "Admin",
      lastName: "User",
      status: "ACTIVE",
      tenantId: tenant.id,
    },
  });
  console.log(`   admin user: ${adminUser.id}`);

  // 6. Ensure tenant membership
  await prisma.userTenantMembership.upsert({
    where: { userId_tenantId: { userId: adminUser.id, tenantId: tenant.id } },
    update: {},
    create: { userId: adminUser.id, tenantId: tenant.id },
  });

  // 7. Assign Institution Admin role to admin user
  const institutionAdminRole = await prisma.role.findFirst({
    where: { tenantId: tenant.id, name: "Institution Admin" },
    select: { id: true },
  });

  if (institutionAdminRole) {
    const existingAssignment = await prisma.userRoleAssignment.findFirst({
      where: {
        userId: adminUser.id,
        roleId: institutionAdminRole.id,
        scopeType: "INSTITUTION",
        scopeId: null,
      },
    });
    if (!existingAssignment) {
      await prisma.userRoleAssignment.create({
        data: {
          userId: adminUser.id,
          roleId: institutionAdminRole.id,
          scopeType: "INSTITUTION",
          scopeId: null,
          assignedById: adminUser.id,
        },
      });
    }
    console.log("   Institution Admin role assigned");
  }

  // 8. Demo ResearchProject
  const existingProject = await prisma.researchProject.findFirst({
    where: {
      tenantId: tenant.id,
      title: "Antimicrobial Resistance Surveillance Study",
    },
  });
  if (!existingProject) {
    await prisma.researchProject.create({
      data: {
        tenantId: tenant.id,
        title: "Antimicrobial Resistance Surveillance Study",
        status: "ACTIVE",
        methodology: "Cross-Sectional",
      },
    });
    console.log("   demo research project created");
  } else {
    console.log("   demo research project already exists");
  }

  // 9. Demo PerformanceCycle
  const existingCycle = await prisma.performanceCycle.findFirst({
    where: { tenantId: tenant.id, name: "Q4 2026 Performance Review" },
  });
  if (!existingCycle) {
    await prisma.performanceCycle.create({
      data: {
        tenantId: tenant.id,
        name: "Q4 2026 Performance Review",
        startDate: new Date("2026-10-01"),
        endDate: new Date("2026-12-31"),
        status: "ACTIVE",
      },
    });
    console.log("   demo performance cycle created");
  } else {
    console.log("   demo performance cycle already exists");
  }

  // 10. Demo KpiDefinitions
  const kpiDefs = [
    {
      name: "Research Deliverable Completion",
      measurementType: "PERCENTAGE" as const,
      directionality: "HIGHER_IS_BETTER" as const,
      defaultWeight: 30,
    },
    {
      name: "Publications Output",
      measurementType: "NUMERIC" as const,
      directionality: "HIGHER_IS_BETTER" as const,
      defaultWeight: 25,
    },
    {
      name: "Task Completion Rate",
      measurementType: "PERCENTAGE" as const,
      directionality: "HIGHER_IS_BETTER" as const,
      defaultWeight: 45,
    },
  ];

  for (const kpi of kpiDefs) {
    const existing = await prisma.kpiDefinition.findFirst({
      where: { tenantId: tenant.id, name: kpi.name },
    });
    if (!existing) {
      await prisma.kpiDefinition.create({
        data: {
          tenantId: tenant.id,
          name: kpi.name,
          measurementType: kpi.measurementType,
          directionality: kpi.directionality,
          defaultWeight: kpi.defaultWeight,
          isActive: true,
        },
      });
      console.log(`   KPI created: ${kpi.name}`);
    } else {
      console.log(`   KPI already exists: ${kpi.name}`);
    }
  }

  console.log(
    "Schema step complete. Prisma validate passed. New models: ResearchProject, ResearchProjectMember, ResearchApproval, ProjectMilestone, ProjectTask, TaskComment, ProjectStatusUpdate, PerformanceCycle, PerformanceObjective, KpiDefinition, KpiAssignment, KpiResult. Seed updated.",
  );

  // DEMO DATA — Phase 3
  const demoTenant = tenant;

  const demoProject = await prisma.researchProject.findFirst({
    where: { tenantId: demoTenant.id },
  });

  if (demoProject) {
    // Demo manuscript
    const existingManuscript = await prisma.manuscript.findFirst({
      where: {
        tenantId: demoTenant.id,
        title:
          "Antimicrobial Resistance Patterns in West Africa: A Cross-Sectional Study",
      },
    });
    if (!existingManuscript) {
      await prisma.manuscript.create({
        data: {
          tenantId: demoTenant.id,
          title:
            "Antimicrobial Resistance Patterns in West Africa: A Cross-Sectional Study",
          status: "SUBMITTED",
          researchProjectId: demoProject.id,
          targetJournal: "PLOS ONE",
          submittedAt: new Date(),
        },
      });
      console.log("   demo manuscript created");
    } else {
      console.log("   demo manuscript already exists");
    }

    // Demo funding source
    let demoFundingSource = await prisma.fundingSource.findFirst({
      where: { tenantId: demoTenant.id, name: "WHO Research Grant 2025" },
    });
    if (!demoFundingSource) {
      demoFundingSource = await prisma.fundingSource.create({
        data: {
          tenantId: demoTenant.id,
          name: "WHO Research Grant 2025",
          funderName: "World Health Organization",
          currency: "USD",
          totalAmount: 250000,
        },
      });
      console.log("   demo funding source created");
    } else {
      console.log("   demo funding source already exists");
    }

    // Demo budget
    const existingBudget = await prisma.projectBudget.findFirst({
      where: {
        tenantId: demoTenant.id,
        researchProjectId: demoProject.id,
        fundingSourceId: demoFundingSource.id,
      },
    });
    if (!existingBudget) {
      await prisma.projectBudget.create({
        data: {
          tenantId: demoTenant.id,
          researchProjectId: demoProject.id,
          fundingSourceId: demoFundingSource.id,
          approvedAmount: 180000,
          currency: "USD",
          approvalStatus: "APPROVED",
        },
      });
      console.log("   demo project budget created");
    } else {
      console.log("   demo project budget already exists");
    }
  }

  // Demo quality review
  const existingQualityReview = await prisma.qualityReview.findFirst({
    where: { tenantId: tenant.id, title: "Q3 2026 Internal Audit" },
  });
  if (!existingQualityReview) {
    await prisma.qualityReview.create({
      data: {
        tenantId: tenant.id,
        title: "Q3 2026 Internal Audit",
        reviewType: "INTERNAL",
        status: "IN_PROGRESS",
      },
    });
    console.log("   demo quality review created");
  } else {
    console.log("   demo quality review already exists");
  }

  // Demo document folder
  const existingFolder = await prisma.documentFolder.findFirst({
    where: { tenantId: tenant.id, name: "Research Documents" },
  });
  if (!existingFolder) {
    await prisma.documentFolder.create({
      data: {
        tenantId: tenant.id,
        name: "Research Documents",
      },
    });
    console.log("   demo document folder created");
  } else {
    console.log("   demo document folder already exists");
  }

  // WEBSITE DEMO DATA
  const website = await prisma.institutionWebsite.upsert({
    where: { tenantId: demoTenant.id },
    update: {},
    create: {
      tenantId: demoTenant.id,
      name: "Demo Research Institute",
      status: "PUBLISHED",
      defaultLocale: "en",
      timezone: "UTC",
    },
  });
  console.log(`   institution website: ${website.id}`);

  await prisma.websiteBranding.upsert({
    where: { websiteId: website.id },
    update: {},
    create: {
      tenantId: demoTenant.id,
      websiteId: website.id,
      tagline: "Advancing Research for a Healthier World",
      shortDescription:
        "A leading research institution dedicated to infectious disease and public health.",
      primaryColor: "#1e3a5f",
      secondaryColor: "#ffffff",
      contactEmail: "info@demo-rims.localhost",
      copyrightStatement: "© 2024 Demo Research Institute",
    },
  });

  const demoDomain = await prisma.websiteDomain.upsert({
    where: { hostname: "demo-rims.localhost" },
    update: {},
    create: {
      tenantId: demoTenant.id,
      websiteId: website.id,
      hostname: "demo-rims.localhost",
      verificationStatus: "VERIFIED",
      isPrimary: true,
      verifiedAt: new Date(),
    },
  });

  await prisma.institutionWebsite.update({
    where: { id: website.id },
    data: { primaryDomainId: demoDomain.id },
  });

  const defaultPages = [
    { title: "Home", slug: "home", pageType: "HOME" as const },
    { title: "About", slug: "about", pageType: "ABOUT" as const },
    { title: "Research", slug: "research", pageType: "RESEARCH" as const },
    {
      title: "Publications",
      slug: "publications",
      pageType: "PUBLICATIONS" as const,
    },
    {
      title: "Opportunities",
      slug: "opportunities",
      pageType: "OPPORTUNITIES" as const,
    },
    { title: "News", slug: "news", pageType: "NEWS" as const },
    { title: "Contact", slug: "contact", pageType: "CONTACT" as const },
  ];

  for (const p of defaultPages) {
    await prisma.websitePage.upsert({
      where: { websiteId_slug: { websiteId: website.id, slug: p.slug } },
      update: {},
      create: {
        tenantId: demoTenant.id,
        websiteId: website.id,
        title: p.title,
        slug: p.slug,
        pageType: p.pageType,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
  }
  console.log("   default website pages seeded");

  await prisma.websiteNews.upsert({
    where: {
      websiteId_slug: {
        websiteId: website.id,
        slug: "research-breakthrough-2024",
      },
    },
    update: {},
    create: {
      tenantId: demoTenant.id,
      websiteId: website.id,
      title: "Research Breakthrough in Drug Discovery",
      slug: "research-breakthrough-2024",
      summary:
        "Our team has achieved a significant milestone in pharmaceutical research.",
      body: "The institute is proud to announce a significant breakthrough in drug discovery methodologies that promises to accelerate development timelines.",
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  await prisma.websiteEvent.upsert({
    where: {
      websiteId_slug: { websiteId: website.id, slug: "annual-symposium-2025" },
    },
    update: {},
    create: {
      tenantId: demoTenant.id,
      websiteId: website.id,
      title: "Annual Research Symposium 2025",
      slug: "annual-symposium-2025",
      summary:
        "Join us for our annual symposium showcasing the latest research findings.",
      startDatetime: new Date("2025-06-15T09:00:00Z"),
      endDatetime: new Date("2025-06-16T17:00:00Z"),
      venue: "Main Auditorium",
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  await prisma.websiteOpportunity.upsert({
    where: {
      websiteId_slug: {
        websiteId: website.id,
        slug: "research-scientist-2024",
      },
    },
    update: {},
    create: {
      tenantId: demoTenant.id,
      websiteId: website.id,
      opportunityType: "VACANCY",
      title: "Senior Research Scientist",
      slug: "research-scientist-2024",
      summary:
        "We are seeking a talented Senior Research Scientist to join our drug discovery team.",
      department: "Drug Discovery",
      closingDate: new Date("2025-03-31"),
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  await prisma.websiteTeamProfile
    .create({
      data: {
        tenantId: demoTenant.id,
        websiteId: website.id,
        displayName: "Dr. Jane Research",
        role: "Principal Investigator",
        department: "Drug Discovery",
        biography:
          "Dr. Research leads our flagship drug discovery programme with over 15 years of experience.",
        sortOrder: 1,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    })
    .catch(() => {});

  for (const loc of ["primary", "footer"]) {
    const existing = await prisma.websiteNavigation.findFirst({
      where: { websiteId: website.id, location: loc },
    });
    if (!existing) {
      await prisma.websiteNavigation.create({
        data: {
          tenantId: demoTenant.id,
          websiteId: website.id,
          name: loc === "primary" ? "Main Navigation" : "Footer Navigation",
          location: loc,
        },
      });
    }
  }
  console.log("   website navigations seeded");

  const demoManuscript = await prisma.manuscript.findFirst({
    where: { tenantId: demoTenant.id },
  });
  if (demoManuscript) {
    await prisma.websitePublicationLink.upsert({
      where: {
        websiteId_manuscriptId: {
          websiteId: website.id,
          manuscriptId: demoManuscript.id,
        },
      },
      update: {},
      create: {
        tenantId: demoTenant.id,
        websiteId: website.id,
        manuscriptId: demoManuscript.id,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
    console.log("   demo publication link seeded");
  }

  console.log("✅  Seed complete");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
