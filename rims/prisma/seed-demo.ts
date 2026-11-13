// Rich demo data seed — run after seed.ts
const { PrismaClient } = require("../node_modules/.prisma/client");
import * as argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱  Seeding rich demo data...");

  const tenant = await prisma.tenant.findFirst({ where: { slug: "demo-rims" } });
  if (!tenant) throw new Error("Run seed.ts first");
  const adminUser = await prisma.user.findFirst({ where: { email: "admin@demo.rims.local" } });
  if (!adminUser) throw new Error("Admin user not found");
  const website = await prisma.institutionWebsite.findFirst({ where: { tenantId: tenant.id } });

  // ── DEPARTMENTS ──────────────────────────────────────────────────────────
  const deptData = [
    { name: "Drug Discovery" },
    { name: "Clinical Research" },
    { name: "Bioinformatics" },
    { name: "Epidemiology" },
    { name: "Finance & Operations" },
    { name: "Human Resources" },
  ];
  const depts: Record<string, any> = {};
  for (const d of deptData) {
    let dept = await prisma.department.findFirst({ where: { tenantId: tenant.id, name: d.name } });
    if (!dept) {
      dept = await prisma.department.create({
        data: { tenantId: tenant.id, name: d.name, status: "ACTIVE" },
      });
    }
    depts[d.name] = dept;
  }
  console.log("   departments seeded");

  // ── TEAMS ────────────────────────────────────────────────────────────────
  const teamData = [
    { name: "Antimicrobial Team", deptName: "Drug Discovery" },
    { name: "Oncology Research Team", deptName: "Clinical Research" },
    { name: "Genomics Team", deptName: "Bioinformatics" },
    { name: "Field Epidemiology Team", deptName: "Epidemiology" },
  ];
  const teams: Record<string, any> = {};
  for (const t of teamData) {
    let team = await prisma.team.findFirst({ where: { tenantId: tenant.id, name: t.name } });
    if (!team) {
      team = await prisma.team.create({
        data: { tenantId: tenant.id, name: t.name, departmentId: depts[t.deptName].id },
      });
    }
    teams[t.name] = team;
  }
  console.log("   teams seeded");

  // ── USERS & EMPLOYEES ────────────────────────────────────────────────────
  const staffData = [
    { email: "dr.amara@demo.rims.local", firstName: "Amara", lastName: "Diallo", role: "Principal Investigator", deptName: "Drug Discovery" },
    { email: "dr.kwame@demo.rims.local", firstName: "Kwame", lastName: "Asante", role: "Researcher", deptName: "Drug Discovery" },
    { email: "dr.fatima@demo.rims.local", firstName: "Fatima", lastName: "Al-Hassan", role: "Researcher", deptName: "Clinical Research" },
    { email: "dr.chen@demo.rims.local", firstName: "Wei", lastName: "Chen", role: "Department Head", deptName: "Bioinformatics" },
    { email: "dr.okonkwo@demo.rims.local", firstName: "Chidi", lastName: "Okonkwo", role: "Research Director", deptName: "Epidemiology" },
    { email: "ms.patel@demo.rims.local", firstName: "Priya", lastName: "Patel", role: "Finance Officer", deptName: "Finance & Operations" },
    { email: "mr.mensah@demo.rims.local", firstName: "Kofi", lastName: "Mensah", role: "HR Manager", deptName: "Human Resources" },
    { email: "dr.ibrahim@demo.rims.local", firstName: "Yusuf", lastName: "Ibrahim", role: "Researcher", deptName: "Drug Discovery" },
    { email: "dr.santos@demo.rims.local", firstName: "Maria", lastName: "Santos", role: "Researcher", deptName: "Clinical Research" },
    { email: "dr.nakamura@demo.rims.local", firstName: "Hiro", lastName: "Nakamura", role: "Department Head", deptName: "Bioinformatics" },
  ];
  const employees: Record<string, any> = {};
  const passwordHash = await argon2.hash("Staff123!");
  for (const s of staffData) {
    let user = await prisma.user.findFirst({ where: { email: s.email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email: s.email, passwordHash, firstName: s.firstName, lastName: s.lastName, status: "ACTIVE", tenantId: tenant.id },
      });
      await prisma.userTenantMembership.create({ data: { userId: user.id, tenantId: tenant.id } });
    }
    const role = await prisma.role.findFirst({ where: { tenantId: tenant.id, name: s.role } });
    if (role) {
      await prisma.userRoleAssignment.upsert({
        where: { userId_roleId: { userId: user.id, roleId: role.id } },
        update: {},
        create: { userId: user.id, roleId: role.id },
      });
    }
    let emp = await prisma.employee.findFirst({ where: { tenantId: tenant.id, userId: user.id } });
    if (!emp) {
      emp = await prisma.employee.create({
        data: { tenantId: tenant.id, userId: user.id, firstName: s.firstName, lastName: s.lastName, status: "ACTIVE", departmentId: depts[s.deptName].id, hireDate: new Date("2022-01-15") },
      });
    }
    employees[s.email] = emp;
  }
  console.log("   users + employees seeded");

  // ── RESEARCH PROJECTS ────────────────────────────────────────────────────
  const projectsData = [
    { title: "Antimicrobial Resistance Surveillance Study", status: "ACTIVE", methodology: "Cross-Sectional" },
    { title: "Novel Malaria Vaccine Efficacy Trial", status: "ACTIVE", methodology: "Randomized Controlled Trial" },
    { title: "HIV Drug Resistance Genomics", status: "ACTIVE", methodology: "Genomic Sequencing" },
    { title: "Tuberculosis Transmission Dynamics", status: "COMPLETED", methodology: "Cohort Study" },
    { title: "COVID-19 Long-Term Outcomes Registry", status: "ACTIVE", methodology: "Longitudinal Registry" },
  ];
  const projects: any[] = [];
  for (const p of projectsData) {
    let proj = await prisma.researchProject.findFirst({ where: { tenantId: tenant.id, title: p.title } });
    if (!proj) {
      proj = await prisma.researchProject.create({
        data: { tenantId: tenant.id, title: p.title, status: p.status, methodology: p.methodology },
      });
    }
    projects.push(proj);
  }
  console.log("   research projects seeded");

  // ── MANUSCRIPTS ──────────────────────────────────────────────────────────
  const manuscriptsData = [
    { title: "Antimicrobial Resistance Patterns in West Africa: A Cross-Sectional Study", status: "PUBLISHED", journal: "PLOS ONE", doi: "10.1371/journal.pone.0123456", projIdx: 0 },
    { title: "Efficacy of Novel Artemisinin Combination Therapy in Paediatric Malaria", status: "UNDER_REVIEW", journal: "The Lancet Infectious Diseases", doi: null, projIdx: 1 },
    { title: "Whole-Genome Sequencing of HIV-1 Drug Resistance Mutations", status: "SUBMITTED", journal: "Nature Medicine", doi: null, projIdx: 2 },
    { title: "Tuberculosis Transmission Networks in Urban Settings", status: "PUBLISHED", journal: "New England Journal of Medicine", doi: "10.1056/NEJMoa2034321", projIdx: 3 },
    { title: "Long COVID Neurological Manifestations: A 24-Month Follow-Up", status: "DRAFT", journal: "Brain", doi: null, projIdx: 4 },
    { title: "Machine Learning Approaches to AMR Prediction", status: "PUBLISHED", journal: "Bioinformatics", doi: "10.1093/bioinformatics/btab123", projIdx: 0 },
  ];
  const manuscripts: any[] = [];
  for (const m of manuscriptsData) {
    let ms = await prisma.manuscript.findFirst({ where: { tenantId: tenant.id, title: m.title } });
    if (!ms) {
      ms = await prisma.manuscript.create({
        data: {
          tenantId: tenant.id,
          title: m.title,
          status: m.status,
          researchProjectId: projects[m.projIdx].id,
          targetJournal: m.journal,
          doi: m.doi,
          abstract: `This study investigates key aspects of ${m.journal} research using rigorous scientific methodology. Our findings contribute significantly to the field of infectious disease and global health.`,
          submittedAt: m.status !== "DRAFT" ? new Date("2024-03-01") : null,
          publishedAt: m.status === "PUBLISHED" ? new Date("2024-06-01") : null,
        },
      });
    }
    manuscripts.push(ms);
  }
  console.log("   manuscripts seeded");

  // ── TASKS ────────────────────────────────────────────────────────────────
  const tasksData = [
    { title: "Prepare Q4 research report", status: "IN_PROGRESS", priority: "HIGH" },
    { title: "Review IRB submission for malaria trial", status: "NOT_STARTED", priority: "HIGH" },
    { title: "Update data collection protocols", status: "COMPLETED", priority: "MEDIUM" },
    { title: "Analyse genomic sequencing results", status: "IN_PROGRESS", priority: "HIGH" },
    { title: "Submit ethics amendment for COVID registry", status: "NOT_STARTED", priority: "MEDIUM" },
    { title: "Prepare annual donor report", status: "IN_PROGRESS", priority: "HIGH" },
    { title: "Onboard new research associates", status: "COMPLETED", priority: "LOW" },
    { title: "Update lab safety procedures", status: "COMPLETED", priority: "MEDIUM" },
    { title: "Review manuscript draft — AMR study", status: "IN_REVIEW", priority: "HIGH" },
    { title: "Schedule team performance reviews", status: "NOT_STARTED", priority: "LOW" },
  ];
  const adminEmployee = await prisma.employee.findFirst({ where: { tenantId: tenant.id, userId: adminUser.id } });
  for (const t of tasksData) {
    const existing = await prisma.projectTask.findFirst({ where: { tenantId: tenant.id, title: t.title } });
    if (!existing) {
      await prisma.projectTask.create({
        data: { tenantId: tenant.id, researchProjectId: projects[0].id, title: t.title, status: t.status, priority: t.priority, assigneeId: adminEmployee?.id ?? null, dueDate: new Date(Date.now() + 14 * 86400000) },
      });
    }
  }
  console.log("   tasks seeded");

  // ── FUNDING SOURCES & BUDGETS ────────────────────────────────────────────
  const fundingData = [
    { name: "WHO Research Grant 2025", funder: "World Health Organization", amount: 250000, currency: "USD" },
    { name: "NIH R01 Grant — AMR", funder: "National Institutes of Health", amount: 500000, currency: "USD" },
    { name: "Wellcome Trust Fellowship", funder: "Wellcome Trust", amount: 180000, currency: "GBP" },
    { name: "EDCTP Malaria Consortium Grant", funder: "EDCTP", amount: 320000, currency: "EUR" },
  ];
  const fundingSrcs: any[] = [];
  for (const f of fundingData) {
    let fs = await prisma.fundingSource.findFirst({ where: { tenantId: tenant.id, name: f.name } });
    if (!fs) {
      fs = await prisma.fundingSource.create({
        data: { tenantId: tenant.id, name: f.name, funderName: f.funder, currency: f.currency, totalAmount: f.amount },
      });
    }
    fundingSrcs.push(fs);
  }
  for (let i = 0; i < Math.min(projects.length, fundingSrcs.length); i++) {
    const existing = await prisma.projectBudget.findFirst({ where: { tenantId: tenant.id, researchProjectId: projects[i].id, fundingSourceId: fundingSrcs[i].id } });
    if (!existing) {
      await prisma.projectBudget.create({
        data: { tenantId: tenant.id, researchProjectId: projects[i].id, fundingSourceId: fundingSrcs[i].id, approvedAmount: fundingSrcs[i].totalAmount * 0.8, currency: fundingSrcs[i].currency, approvalStatus: "APPROVED" },
      });
    }
  }
  console.log("   funding sources + budgets seeded");

  // ── QUALITY REVIEWS ──────────────────────────────────────────────────────
  const qualityData = [
    { title: "Q3 2026 Internal Audit", type: "INTERNAL", status: "IN_PROGRESS" },
    { title: "GCP Compliance Review — Malaria Trial", type: "REGULATORY", status: "COMPLETED" },
    { title: "Data Management Quality Assessment", type: "INTERNAL", status: "COMPLETED" },
    { title: "ISO 9001 Readiness Review", type: "EXTERNAL", status: "SCHEDULED" },
  ];
  for (const q of qualityData) {
    const existing = await prisma.qualityReview.findFirst({ where: { tenantId: tenant.id, title: q.title } });
    if (!existing) {
      await prisma.qualityReview.create({ data: { tenantId: tenant.id, title: q.title, reviewType: q.type, status: q.status } });
    }
  }
  console.log("   quality reviews seeded");

  // ── DOCUMENT FOLDERS ─────────────────────────────────────────────────────
  for (const name of ["Research Documents", "HR Policies", "Financial Reports", "Ethics Approvals", "SOPs"]) {
    const existing = await prisma.documentFolder.findFirst({ where: { tenantId: tenant.id, name } });
    if (!existing) await prisma.documentFolder.create({ data: { tenantId: tenant.id, name } });
  }
  console.log("   document folders seeded");

  // ── WEBSITE CONTENT ──────────────────────────────────────────────────────
  if (website) {
    const newsItems = [
      { title: "Institute Receives $2M NIH Grant for AMR Research", slug: "nih-grant-amr-2024", summary: "A major NIH grant to advance our antimicrobial resistance research programme.", body: "The Demo Research Institute has been awarded a $2 million R01 grant from the National Institutes of Health to fund a five-year study on antimicrobial resistance patterns across sub-Saharan Africa." },
      { title: "Research Breakthrough in Drug Discovery", slug: "research-breakthrough-2024", summary: "Our team has achieved a significant milestone in pharmaceutical research.", body: "The institute is proud to announce a significant breakthrough in drug discovery methodologies that promises to accelerate development timelines." },
      { title: "New Partnership with WHO Africa Regional Office", slug: "who-partnership-2024", summary: "A strategic partnership to strengthen disease surveillance across the continent.", body: "The Demo Research Institute has formalised a strategic partnership with the WHO Africa Regional Office to strengthen infectious disease surveillance and response capacity across 12 countries." },
      { title: "Dr. Amara Diallo Wins Prestigious Research Award", slug: "diallo-award-2024", summary: "Our Principal Investigator recognised for outstanding contributions to global health research.", body: "Dr. Amara Diallo has been awarded the Global Health Research Excellence Award by the International Society for Infectious Diseases." },
      { title: "Institute Launches Open-Access Data Repository", slug: "open-data-2024", summary: "Making our research data freely available to the global scientific community.", body: "In line with our commitment to open science, the Demo Research Institute has launched a publicly accessible data repository containing anonymised datasets from completed research projects." },
    ];
    for (const n of newsItems) {
      await prisma.websiteNews.upsert({
        where: { websiteId_slug: { websiteId: website.id, slug: n.slug } },
        update: {},
        create: { tenantId: tenant.id, websiteId: website.id, title: n.title, slug: n.slug, summary: n.summary, body: n.body, status: "PUBLISHED", publishedAt: new Date() },
      });
    }

    const events = [
      { title: "Annual Research Symposium 2025", slug: "annual-symposium-2025", summary: "Join us for our annual symposium showcasing the latest research findings.", start: "2025-06-15T09:00:00Z", end: "2025-06-16T17:00:00Z", venue: "Main Auditorium" },
      { title: "AMR Awareness Workshop", slug: "amr-workshop-2025", summary: "A hands-on workshop on antimicrobial stewardship for healthcare professionals.", start: "2025-03-10T08:00:00Z", end: "2025-03-10T17:00:00Z", venue: "Conference Room A" },
      { title: "Global Health Data Science Bootcamp", slug: "data-science-bootcamp-2025", summary: "Intensive training in R, Python and machine learning for health researchers.", start: "2025-04-22T09:00:00Z", end: "2025-04-25T17:00:00Z", venue: "Training Centre" },
      { title: "Public Lecture: The Future of Vaccines", slug: "vaccine-lecture-2025", summary: "A public lecture by leading immunologists on next-generation vaccine platforms.", start: "2025-05-08T18:00:00Z", end: "2025-05-08T20:00:00Z", venue: "Main Auditorium" },
    ];
    for (const e of events) {
      await prisma.websiteEvent.upsert({
        where: { websiteId_slug: { websiteId: website.id, slug: e.slug } },
        update: {},
        create: { tenantId: tenant.id, websiteId: website.id, title: e.title, slug: e.slug, summary: e.summary, startDatetime: new Date(e.start), endDatetime: new Date(e.end), venue: e.venue, status: "PUBLISHED", publishedAt: new Date() },
      });
    }

    const opps = [
      { title: "Senior Research Scientist", slug: "research-scientist-2024", type: "VACANCY", summary: "We are seeking a talented Senior Research Scientist to join our drug discovery team.", dept: "Drug Discovery", closing: "2025-03-31" },
      { title: "Postdoctoral Fellow — Genomics", slug: "postdoc-genomics-2025", type: "FELLOWSHIP", summary: "A two-year postdoctoral fellowship in computational genomics and bioinformatics.", dept: "Bioinformatics", closing: "2025-04-15" },
      { title: "PhD Studentship — Epidemiology", slug: "phd-epidemiology-2025", type: "GRADUATE", summary: "Fully funded PhD studentship investigating disease transmission dynamics.", dept: "Epidemiology", closing: "2025-05-01" },
      { title: "Clinical Research Coordinator", slug: "crc-2025", type: "VACANCY", summary: "Coordinate clinical trials across multiple sites in West Africa.", dept: "Clinical Research", closing: "2025-03-20" },
      { title: "Data Analyst — Health Informatics", slug: "data-analyst-2025", type: "VACANCY", summary: "Analyse large-scale health datasets to support research and policy.", dept: "Bioinformatics", closing: "2025-04-30" },
    ];
    for (const o of opps) {
      await prisma.websiteOpportunity.upsert({
        where: { websiteId_slug: { websiteId: website.id, slug: o.slug } },
        update: {},
        create: { tenantId: tenant.id, websiteId: website.id, title: o.title, slug: o.slug, opportunityType: o.type, summary: o.summary, department: o.dept, closingDate: new Date(o.closing), status: "PUBLISHED", publishedAt: new Date() },
      });
    }

    const teamProfiles = [
      { name: "Prof. James Osei", role: "Executive Director", dept: "Leadership", bio: "Prof. Osei has led the institute for over a decade, driving its growth into a world-class research centre.", order: 1 },
      { name: "Dr. Amara Diallo", role: "Principal Investigator — Drug Discovery", dept: "Drug Discovery", bio: "Dr. Diallo leads our flagship drug discovery programme with over 15 years of experience in antimicrobial research.", order: 2 },
      { name: "Dr. Chidi Okonkwo", role: "Director of Epidemiology", dept: "Epidemiology", bio: "Dr. Okonkwo oversees all epidemiological research, with expertise in infectious disease modelling and field studies.", order: 3 },
      { name: "Dr. Wei Chen", role: "Head of Bioinformatics", dept: "Bioinformatics", bio: "Dr. Chen leads our computational biology team, applying machine learning to genomic and clinical datasets.", order: 4 },
      { name: "Dr. Fatima Al-Hassan", role: "Clinical Research Scientist", dept: "Clinical Research", bio: "Dr. Al-Hassan coordinates multi-site clinical trials across West Africa with a focus on paediatric infectious diseases.", order: 5 },
    ];
    for (const tp of teamProfiles) {
      const existing = await prisma.websiteTeamProfile.findFirst({ where: { websiteId: website.id, displayName: tp.name } });
      if (!existing) {
        await prisma.websiteTeamProfile.create({
          data: { tenantId: tenant.id, websiteId: website.id, displayName: tp.name, role: tp.role, department: tp.dept, biography: tp.bio, sortOrder: tp.order, status: "PUBLISHED", publishedAt: new Date() },
        });
      }
    }

    const partners = [
      { name: "World Health Organization", desc: "Strategic partner for disease surveillance and global health policy.", url: "https://www.who.int", type: "STRATEGIC", order: 1 },
      { name: "National Institutes of Health", desc: "Primary research funder supporting our AMR and genomics programmes.", url: "https://www.nih.gov", type: "FUNDER", order: 2 },
      { name: "Wellcome Trust", desc: "Supporting our fellowship programme and open science initiatives.", url: "https://wellcome.org", type: "FUNDER", order: 3 },
      { name: "University of Ghana", desc: "Academic partner for joint research programmes and student placements.", url: "https://www.ug.edu.gh", type: "ACADEMIC", order: 4 },
      { name: "EDCTP", desc: "European & Developing Countries Clinical Trials Partnership.", url: "https://www.edctp.org", type: "FUNDER", order: 5 },
    ];
    for (const p of partners) {
      const existing = await prisma.websitePartner.findFirst({ where: { websiteId: website.id, name: p.name } });
      if (!existing) {
        await prisma.websitePartner.create({
          data: { tenantId: tenant.id, websiteId: website.id, name: p.name, description: p.desc, websiteUrl: p.url, partnershipType: p.type, sortOrder: p.order, status: "PUBLISHED", publishedAt: new Date() },
        });
      }
    }

    const faqs = [
      { q: "How can I apply for a research position?", a: "Visit our Opportunities page to view current vacancies, fellowships and studentships. Submit your application through the provided link before the closing date.", cat: "Careers", order: 1 },
      { q: "How do I access published research data?", a: "Our open-access data repository is freely available. All datasets are anonymised and available under a Creative Commons licence.", cat: "Research", order: 2 },
      { q: "Can I collaborate with the institute?", a: "We welcome collaboration proposals from academic institutions, NGOs and industry partners. Please contact us via the Contact page with a brief outline of your proposal.", cat: "Partnerships", order: 3 },
      { q: "How are research participants protected?", a: "All research involving human participants is reviewed and approved by our Institutional Review Board. We adhere to the Declaration of Helsinki and ICH-GCP guidelines.", cat: "Ethics", order: 4 },
      { q: "Where is the institute located?", a: "Our main campus is located in Accra, Ghana, with field offices in Lagos, Nairobi and Dakar.", cat: "General", order: 5 },
    ];
    for (const f of faqs) {
      const existing = await prisma.websiteFaq.findFirst({ where: { websiteId: website.id, question: f.q } });
      if (!existing) {
        await prisma.websiteFaq.create({
          data: { tenantId: tenant.id, websiteId: website.id, question: f.q, answer: f.a, category: f.cat, sortOrder: f.order, status: "PUBLISHED" },
        });
      }
    }

    for (const ms of manuscripts) {
      if (ms.status === "PUBLISHED") {
        await prisma.websitePublicationLink.upsert({
          where: { websiteId_manuscriptId: { websiteId: website.id, manuscriptId: ms.id } },
          update: {},
          create: { tenantId: tenant.id, websiteId: website.id, manuscriptId: ms.id, status: "PUBLISHED", publishedAt: new Date() },
        });
      }
    }
    console.log("   website content seeded");
  }

  // ── INSTITUTION DETAILS ─────────────────────────────────────────────────
  await prisma.institution.updateMany({
    where: { tenantId: tenant.id },
    data: {
      address: "14 Research Avenue, Airport Residential Area, Accra, Ghana",
      phone: "+233 30 277 4000",
      website: "https://demo-rims.localhost",
    },
  });
  console.log("   institution details updated");

  // ── KPI ASSIGNMENTS ──────────────────────────────────────────────────────
  const cycle = await prisma.performanceCycle.findFirst({ where: { tenantId: tenant.id } });
  const kpis = await prisma.kpiDefinition.findMany({ where: { tenantId: tenant.id } });
  const empList = await prisma.employee.findMany({ where: { tenantId: tenant.id }, take: 6 });
  if (cycle && kpis.length && empList.length) {
    for (const emp of empList) {
      for (const kpi of kpis) {
        const existing = await prisma.kpiAssignment.findFirst({ where: { cycleId: cycle.id, kpiId: kpi.id, subjectType: "EMPLOYEE", subjectId: emp.id } });
        if (!existing) {
          const assignment = await prisma.kpiAssignment.create({
            data: { tenantId: tenant.id, cycleId: cycle.id, kpiId: kpi.id, subjectType: "EMPLOYEE", subjectId: emp.id, targetValue: kpi.measurementType === "PERCENTAGE" ? "85" : "3", weight: Number(kpi.defaultWeight) },
          });
          await prisma.kpiResult.create({
            data: { tenantId: tenant.id, assignmentId: assignment.id, value: kpi.measurementType === "PERCENTAGE" ? String(70 + Math.floor(Math.random() * 25)) : String(2 + Math.floor(Math.random() * 3)), status: "SUBMITTED", submittedAt: new Date() },
          });
        }
      }
    }
    console.log("   KPI assignments + results seeded");
  }

  // ── AUDIT EVENTS ─────────────────────────────────────────────────────────
  const auditCount = await prisma.auditEvent.count({ where: { tenantId: tenant.id } });
  if (auditCount === 0) {
    const actions = [
      { action: "user.login", resourceType: "User", outcome: "SUCCESS" },
      { action: "employee.created", resourceType: "Employee", outcome: "SUCCESS" },
      { action: "department.created", resourceType: "Department", outcome: "SUCCESS" },
      { action: "research_project.created", resourceType: "ResearchProject", outcome: "SUCCESS" },
      { action: "manuscript.submitted", resourceType: "Manuscript", outcome: "SUCCESS" },
      { action: "user.login", resourceType: "User", outcome: "SUCCESS" },
      { action: "budget.approved", resourceType: "ProjectBudget", outcome: "SUCCESS" },
      { action: "quality_review.completed", resourceType: "QualityReview", outcome: "SUCCESS" },
      { action: "user.login", resourceType: "User", outcome: "FAILURE" },
      { action: "institution.updated", resourceType: "Institution", outcome: "SUCCESS" },
      { action: "kpi_assignment.created", resourceType: "KpiAssignment", outcome: "SUCCESS" },
      { action: "document.uploaded", resourceType: "Document", outcome: "SUCCESS" },
      { action: "team.member_added", resourceType: "Team", outcome: "SUCCESS" },
      { action: "performance_cycle.activated", resourceType: "PerformanceCycle", outcome: "SUCCESS" },
      { action: "user.invited", resourceType: "User", outcome: "SUCCESS" },
    ];
    for (let i = 0; i < actions.length; i++) {
      await prisma.auditEvent.create({
        data: {
          tenantId: tenant.id,
          actorId: adminUser.id,
          action: actions[i].action,
          resourceType: actions[i].resourceType,
          outcome: actions[i].outcome,
          createdAt: new Date(Date.now() - (actions.length - i) * 3600000),
        },
      });
    }
    console.log("   audit events seeded");
  }

  console.log("✅  Rich demo seed complete");
}

main().catch(console.error).finally(() => prisma.$disconnect());
