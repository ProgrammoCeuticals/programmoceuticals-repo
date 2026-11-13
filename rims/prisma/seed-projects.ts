// Seed rich research project data — members, milestones, deliverables, status updates, approvals
const { PrismaClient } = require("../node_modules/.prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱  Seeding research project data...");

  const tenant = await prisma.tenant.findFirst({ where: { slug: "demo-rims" } });
  if (!tenant) throw new Error("Run seed.ts first");

  const adminUser = await prisma.user.findFirst({ where: { email: "admin@demo.rims.local" } });
  if (!adminUser) throw new Error("Admin user not found");

  const projects = await prisma.researchProject.findMany({ where: { tenantId: tenant.id } });
  const employees = await prisma.employee.findMany({ where: { tenantId: tenant.id } });

  // Helper maps
  const emp = (name: string) => employees.find((e: any) => e.firstName === name)!;
  const proj = (title: string) => projects.find((p: any) => p.title.includes(title))!;

  // ── Update projects with full details ──────────────────────────────────────
  const projectDetails = [
    {
      title: "Antimicrobial Resistance",
      summary: "A cross-sectional surveillance study examining antimicrobial resistance (AMR) patterns across 8 sentinel sites in West Africa. The study aims to characterise resistance profiles of key bacterial pathogens and inform national AMR action plans.",
      researchArea: "Infectious Disease",
      startDate: new Date("2023-03-01"),
      endDate: new Date("2025-02-28"),
      ethicsApprovalStatus: "APPROVED",
      ethicsReferenceNo: "IRB-2023-AMR-001",
      departmentId: employees.find((e: any) => e.firstName === "Amara")?.departmentId,
      principalInvestigatorId: emp("Amara")?.id,
    },
    {
      title: "Novel Malaria Vaccine",
      summary: "A Phase II randomised controlled trial evaluating the efficacy and safety of a novel artemisinin combination therapy in paediatric malaria patients aged 6 months to 5 years across three clinical sites.",
      researchArea: "Vaccinology & Clinical Trials",
      startDate: new Date("2023-06-01"),
      endDate: new Date("2026-05-31"),
      ethicsApprovalStatus: "APPROVED",
      ethicsReferenceNo: "IRB-2023-MAL-007",
      departmentId: employees.find((e: any) => e.firstName === "Fatima")?.departmentId,
      principalInvestigatorId: emp("Fatima")?.id,
    },
    {
      title: "HIV Drug Resistance",
      summary: "Whole-genome sequencing of HIV-1 isolates from treatment-naive and treatment-experienced patients to characterise drug resistance mutation profiles and inform second-line therapy selection guidelines.",
      researchArea: "Genomics & Virology",
      startDate: new Date("2023-09-01"),
      endDate: new Date("2025-08-31"),
      ethicsApprovalStatus: "APPROVED",
      ethicsReferenceNo: "IRB-2023-HIV-012",
      departmentId: employees.find((e: any) => e.firstName === "Wei")?.departmentId,
      principalInvestigatorId: emp("Wei")?.id,
    },
    {
      title: "Tuberculosis Transmission",
      summary: "A completed cohort study using whole-genome sequencing and contact tracing to reconstruct tuberculosis transmission networks in three high-burden urban settings. Findings have been published in NEJM.",
      researchArea: "Epidemiology",
      startDate: new Date("2021-01-01"),
      endDate: new Date("2023-12-31"),
      ethicsApprovalStatus: "APPROVED",
      ethicsReferenceNo: "IRB-2021-TB-003",
      departmentId: employees.find((e: any) => e.firstName === "Chidi")?.departmentId,
      principalInvestigatorId: emp("Chidi")?.id,
      closureSummary: "Study completed successfully. Primary findings published in NEJM (DOI: 10.1056/NEJMoa2034321). Data archived in institutional repository. All regulatory requirements fulfilled.",
    },
    {
      title: "COVID-19 Long-Term",
      summary: "A longitudinal registry study tracking 24-month outcomes in COVID-19 survivors, with a focus on neurological, cardiovascular, and pulmonary sequelae. Enrolment ongoing across 5 sites.",
      researchArea: "Infectious Disease & Long COVID",
      startDate: new Date("2022-01-01"),
      endDate: new Date("2026-12-31"),
      ethicsApprovalStatus: "APPROVED",
      ethicsReferenceNo: "IRB-2022-COV-019",
      departmentId: employees.find((e: any) => e.firstName === "Chidi")?.departmentId,
      principalInvestigatorId: emp("Chidi")?.id,
    },
  ];

  for (const detail of projectDetails) {
    const p = proj(detail.title);
    if (!p) continue;
    const { title: _, ...updateData } = detail as any;
    await prisma.researchProject.update({ where: { id: p.id }, data: updateData });
  }
  console.log("   project details updated");

  // ── Members ────────────────────────────────────────────────────────────────
  const memberData = [
    // AMR Study
    { projTitle: "Antimicrobial Resistance", empName: "Amara",  role: "PRINCIPAL_INVESTIGATOR" },
    { projTitle: "Antimicrobial Resistance", empName: "Kwame",  role: "CO_INVESTIGATOR" },
    { projTitle: "Antimicrobial Resistance", empName: "Yusuf",  role: "RESEARCHER" },
    { projTitle: "Antimicrobial Resistance", empName: "Hiro",   role: "DATA_ANALYST" },
    // Malaria Trial
    { projTitle: "Novel Malaria Vaccine",    empName: "Fatima", role: "PRINCIPAL_INVESTIGATOR" },
    { projTitle: "Novel Malaria Vaccine",    empName: "Maria",  role: "CO_INVESTIGATOR" },
    { projTitle: "Novel Malaria Vaccine",    empName: "Kwame",  role: "RESEARCHER" },
    // HIV Genomics
    { projTitle: "HIV Drug Resistance",      empName: "Wei",    role: "PRINCIPAL_INVESTIGATOR" },
    { projTitle: "HIV Drug Resistance",      empName: "Hiro",   role: "CO_INVESTIGATOR" },
    { projTitle: "HIV Drug Resistance",      empName: "Yusuf",  role: "RESEARCHER" },
    // TB Study
    { projTitle: "Tuberculosis Transmission",empName: "Chidi",  role: "PRINCIPAL_INVESTIGATOR" },
    { projTitle: "Tuberculosis Transmission",empName: "Amara",  role: "CO_INVESTIGATOR" },
    // COVID Registry
    { projTitle: "COVID-19 Long-Term",       empName: "Chidi",  role: "PRINCIPAL_INVESTIGATOR" },
    { projTitle: "COVID-19 Long-Term",       empName: "Fatima", role: "CO_INVESTIGATOR" },
    { projTitle: "COVID-19 Long-Term",       empName: "Maria",  role: "RESEARCHER" },
    { projTitle: "COVID-19 Long-Term",       empName: "Kwame",  role: "RESEARCHER" },
  ];

  for (const m of memberData) {
    const p = proj(m.projTitle);
    const e = emp(m.empName);
    if (!p || !e) continue;
    const existing = await prisma.researchProjectMember.findFirst({
      where: { researchProjectId: p.id, employeeId: e.id },
    });
    if (!existing) {
      await prisma.researchProjectMember.create({
        data: { researchProjectId: p.id, employeeId: e.id, role: m.role },
      });
    }
  }
  console.log("   members seeded");

  // ── Milestones ─────────────────────────────────────────────────────────────
  const milestoneData = [
    // AMR Study
    { projTitle: "Antimicrobial Resistance", title: "Site activation & ethics clearance",       dueDate: "2023-04-30", status: "COMPLETED", completedAt: new Date("2023-04-15") },
    { projTitle: "Antimicrobial Resistance", title: "Baseline data collection complete",         dueDate: "2023-10-31", status: "COMPLETED", completedAt: new Date("2023-10-28") },
    { projTitle: "Antimicrobial Resistance", title: "Interim analysis & data quality review",    dueDate: "2024-04-30", status: "COMPLETED", completedAt: new Date("2024-04-22") },
    { projTitle: "Antimicrobial Resistance", title: "Final data lock",                           dueDate: "2024-11-30", status: "IN_PROGRESS", completedAt: null },
    { projTitle: "Antimicrobial Resistance", title: "Manuscript submission",                     dueDate: "2025-01-31", status: "PENDING",      completedAt: null },
    // Malaria Trial
    { projTitle: "Novel Malaria Vaccine",    title: "Protocol finalisation & regulatory submission", dueDate: "2023-07-31", status: "COMPLETED", completedAt: new Date("2023-07-20") },
    { projTitle: "Novel Malaria Vaccine",    title: "First patient enrolled",                    dueDate: "2023-10-01", status: "COMPLETED", completedAt: new Date("2023-09-28") },
    { projTitle: "Novel Malaria Vaccine",    title: "50% enrolment target reached",              dueDate: "2024-06-30", status: "COMPLETED", completedAt: new Date("2024-06-15") },
    { projTitle: "Novel Malaria Vaccine",    title: "Full enrolment complete",                   dueDate: "2025-03-31", status: "IN_PROGRESS", completedAt: null },
    { projTitle: "Novel Malaria Vaccine",    title: "Primary endpoint analysis",                 dueDate: "2025-12-31", status: "PENDING",      completedAt: null },
    // HIV Genomics
    { projTitle: "HIV Drug Resistance",      title: "Sample collection protocol approved",       dueDate: "2023-10-31", status: "COMPLETED", completedAt: new Date("2023-10-10") },
    { projTitle: "HIV Drug Resistance",      title: "500 samples sequenced",                     dueDate: "2024-03-31", status: "COMPLETED", completedAt: new Date("2024-03-25") },
    { projTitle: "HIV Drug Resistance",      title: "Bioinformatics pipeline validated",         dueDate: "2024-06-30", status: "COMPLETED", completedAt: new Date("2024-06-18") },
    { projTitle: "HIV Drug Resistance",      title: "Full cohort sequencing complete",           dueDate: "2025-03-31", status: "IN_PROGRESS", completedAt: null },
    // TB Study
    { projTitle: "Tuberculosis Transmission",title: "Cohort recruitment complete",               dueDate: "2022-06-30", status: "COMPLETED", completedAt: new Date("2022-06-20") },
    { projTitle: "Tuberculosis Transmission",title: "WGS analysis complete",                     dueDate: "2023-03-31", status: "COMPLETED", completedAt: new Date("2023-03-15") },
    { projTitle: "Tuberculosis Transmission",title: "Manuscript accepted",                       dueDate: "2023-09-30", status: "COMPLETED", completedAt: new Date("2023-08-12") },
    { projTitle: "Tuberculosis Transmission",title: "Study closure & data archiving",            dueDate: "2023-12-31", status: "COMPLETED", completedAt: new Date("2023-12-20") },
    // COVID Registry
    { projTitle: "COVID-19 Long-Term",       title: "Registry platform go-live",                 dueDate: "2022-03-31", status: "COMPLETED", completedAt: new Date("2022-03-28") },
    { projTitle: "COVID-19 Long-Term",       title: "500 participants enrolled",                  dueDate: "2022-12-31", status: "COMPLETED", completedAt: new Date("2022-11-30") },
    { projTitle: "COVID-19 Long-Term",       title: "12-month follow-up data complete",          dueDate: "2023-12-31", status: "COMPLETED", completedAt: new Date("2024-01-10") },
    { projTitle: "COVID-19 Long-Term",       title: "24-month follow-up data complete",          dueDate: "2025-06-30", status: "IN_PROGRESS", completedAt: null },
    { projTitle: "COVID-19 Long-Term",       title: "Primary outcomes paper submission",         dueDate: "2025-12-31", status: "PENDING",      completedAt: null },
  ];

  for (const m of milestoneData) {
    const p = proj(m.projTitle);
    if (!p) continue;
    const existing = await prisma.projectMilestone.findFirst({
      where: { researchProjectId: p.id, title: m.title },
    });
    if (!existing) {
      await prisma.projectMilestone.create({
        data: {
          tenantId: tenant.id,
          researchProjectId: p.id,
          title: m.title,
          dueDate: new Date(m.dueDate),
          status: m.status,
          completedAt: m.completedAt ?? null,
        },
      });
    }
  }
  console.log("   milestones seeded");

  // ── Deliverables ───────────────────────────────────────────────────────────
  const deliverableData = [
    { projTitle: "Antimicrobial Resistance", title: "AMR Surveillance Protocol v2.0",         dueDate: "2023-05-31", status: "DELIVERED", deliveredAt: new Date("2023-05-20") },
    { projTitle: "Antimicrobial Resistance", title: "Interim Analysis Report",                 dueDate: "2024-05-31", status: "DELIVERED", deliveredAt: new Date("2024-05-15") },
    { projTitle: "Antimicrobial Resistance", title: "Final Study Report",                      dueDate: "2025-02-28", status: "PENDING",   deliveredAt: null },
    { projTitle: "Novel Malaria Vaccine",    title: "Clinical Trial Protocol v1.2",            dueDate: "2023-08-31", status: "DELIVERED", deliveredAt: new Date("2023-08-10") },
    { projTitle: "Novel Malaria Vaccine",    title: "Safety Monitoring Report Q1 2024",        dueDate: "2024-04-30", status: "DELIVERED", deliveredAt: new Date("2024-04-25") },
    { projTitle: "Novel Malaria Vaccine",    title: "Interim Efficacy Report",                 dueDate: "2025-06-30", status: "PENDING",   deliveredAt: null },
    { projTitle: "HIV Drug Resistance",      title: "Sequencing QC Report",                    dueDate: "2024-04-30", status: "DELIVERED", deliveredAt: new Date("2024-04-20") },
    { projTitle: "HIV Drug Resistance",      title: "Resistance Mutation Database v1.0",       dueDate: "2024-09-30", status: "IN_PROGRESS", deliveredAt: null },
    { projTitle: "Tuberculosis Transmission",title: "Transmission Network Analysis Report",    dueDate: "2023-04-30", status: "DELIVERED", deliveredAt: new Date("2023-04-10") },
    { projTitle: "Tuberculosis Transmission",title: "Published Manuscript — NEJM",             dueDate: "2023-09-30", status: "DELIVERED", deliveredAt: new Date("2023-08-12") },
    { projTitle: "COVID-19 Long-Term",       title: "12-Month Outcomes Report",                dueDate: "2024-02-28", status: "DELIVERED", deliveredAt: new Date("2024-02-20") },
    { projTitle: "COVID-19 Long-Term",       title: "Neurological Sequelae Sub-study Report",  dueDate: "2025-03-31", status: "IN_PROGRESS", deliveredAt: null },
  ];

  for (const d of deliverableData) {
    const p = proj(d.projTitle);
    if (!p) continue;
    const existing = await prisma.projectDeliverable.findFirst({
      where: { researchProjectId: p.id, title: d.title },
    });
    if (!existing) {
      await prisma.projectDeliverable.create({
        data: {
          tenantId: tenant.id,
          researchProjectId: p.id,
          title: d.title,
          dueDate: new Date(d.dueDate),
          status: d.status,
          deliveredAt: d.deliveredAt ?? null,
        },
      });
    }
  }
  console.log("   deliverables seeded");

  // ── Status Updates ─────────────────────────────────────────────────────────
  const updateData = [
    // AMR Study
    { projTitle: "Antimicrobial Resistance", content: "All 8 sentinel sites have completed baseline data collection. Sample quality is excellent with >95% pass rate on QC. Data entry is 87% complete. On track for interim analysis in April.", daysAgo: 45 },
    { projTitle: "Antimicrobial Resistance", content: "Interim analysis completed. Key finding: 68% of E. coli isolates show resistance to third-generation cephalosporins. Results shared with national AMR committee. Manuscript drafting underway.", daysAgo: 20 },
    { projTitle: "Antimicrobial Resistance", content: "Final data lock scheduled for end of November. All sites have submitted outstanding CRFs. Statistical analysis plan finalised and approved by DSMB.", daysAgo: 5 },
    // Malaria Trial
    { projTitle: "Novel Malaria Vaccine",    content: "Enrolment is progressing well — 312 of 600 target participants enrolled across 3 sites. Site 2 (Kumasi) is ahead of schedule. No serious adverse events reported to date.", daysAgo: 60 },
    { projTitle: "Novel Malaria Vaccine",    content: "DSMB met and reviewed unblinded safety data. Recommendation to continue without protocol modification. Enrolment now at 68% of target.", daysAgo: 30 },
    { projTitle: "Novel Malaria Vaccine",    content: "Q3 safety monitoring report submitted to regulatory authority. All sites compliant with GCP requirements. Enrolment on track to complete by March 2025.", daysAgo: 8 },
    // HIV Genomics
    { projTitle: "HIV Drug Resistance",      content: "Bioinformatics pipeline validated against reference datasets. Sensitivity 98.7%, specificity 99.2% for known resistance mutations. Pipeline now deployed for full cohort analysis.", daysAgo: 55 },
    { projTitle: "HIV Drug Resistance",      content: "750 of 1,200 samples sequenced. Preliminary data shows 34% prevalence of NNRTI resistance mutations in treatment-naive patients — higher than expected. Investigating potential sampling bias.", daysAgo: 25 },
    { projTitle: "HIV Drug Resistance",      content: "Collaboration established with NIH-funded consortium for cross-validation of resistance calls. Joint analysis planned for Q1 2025.", daysAgo: 10 },
    // TB Study
    { projTitle: "Tuberculosis Transmission",content: "Study successfully completed. All primary and secondary objectives met. Transmission network analysis identified 3 major super-spreader events accounting for 28% of cases.", daysAgo: 180 },
    { projTitle: "Tuberculosis Transmission",content: "NEJM manuscript accepted after minor revisions. Publication scheduled for September 2023. Press release coordinated with WHO Africa office.", daysAgo: 150 },
    { projTitle: "Tuberculosis Transmission",content: "Study closure complete. All data archived per institutional policy. Final regulatory report submitted. Study team commended by IRB for exemplary conduct.", daysAgo: 90 },
    // COVID Registry
    { projTitle: "COVID-19 Long-Term",       content: "12-month follow-up data collection complete for 847 participants. Neurological symptoms persist in 23% of participants at 12 months. Cardiology sub-study initiated.", daysAgo: 70 },
    { projTitle: "COVID-19 Long-Term",       content: "Collaboration with University of Ghana neurology department formalised. Additional funding secured from Wellcome Trust for neurological sub-study (£180,000).", daysAgo: 40 },
    { projTitle: "COVID-19 Long-Term",       content: "24-month follow-up underway. Retention rate 91% — excellent for a longitudinal study of this duration. Data quality review completed with no major issues.", daysAgo: 12 },
  ];

  for (const u of updateData) {
    const p = proj(u.projTitle);
    if (!p) continue;
    const existing = await prisma.projectStatusUpdate.findFirst({
      where: { researchProjectId: p.id, content: u.content },
    });
    if (!existing) {
      await prisma.projectStatusUpdate.create({
        data: {
          researchProjectId: p.id,
          content: u.content,
          authorId: adminUser.id,
          createdAt: new Date(Date.now() - u.daysAgo * 86400000),
        },
      });
    }
  }
  console.log("   status updates seeded");

  // ── Approvals ──────────────────────────────────────────────────────────────
  const approvalData = [
    // AMR Study
    { projTitle: "Antimicrobial Resistance", type: "ETHICS",     status: "APPROVED", ref: "IRB-2023-AMR-001", approvedAt: new Date("2023-02-15") },
    { projTitle: "Antimicrobial Resistance", type: "REGULATORY", status: "APPROVED", ref: "FDA-IND-2023-0042", approvedAt: new Date("2023-02-28") },
    { projTitle: "Antimicrobial Resistance", type: "BUDGET",     status: "APPROVED", ref: "FIN-2023-AMR-001",  approvedAt: new Date("2023-03-01") },
    // Malaria Trial
    { projTitle: "Novel Malaria Vaccine",    type: "ETHICS",     status: "APPROVED", ref: "IRB-2023-MAL-007", approvedAt: new Date("2023-05-10") },
    { projTitle: "Novel Malaria Vaccine",    type: "REGULATORY", status: "APPROVED", ref: "NMRA-CT-2023-019",  approvedAt: new Date("2023-05-25") },
    { projTitle: "Novel Malaria Vaccine",    type: "BUDGET",     status: "APPROVED", ref: "FIN-2023-MAL-007",  approvedAt: new Date("2023-06-01") },
    { projTitle: "Novel Malaria Vaccine",    type: "PROTOCOL_AMENDMENT", status: "APPROVED", ref: "PA-2024-MAL-002", approvedAt: new Date("2024-02-14") },
    // HIV Genomics
    { projTitle: "HIV Drug Resistance",      type: "ETHICS",     status: "APPROVED", ref: "IRB-2023-HIV-012", approvedAt: new Date("2023-08-20") },
    { projTitle: "HIV Drug Resistance",      type: "BUDGET",     status: "APPROVED", ref: "FIN-2023-HIV-012",  approvedAt: new Date("2023-09-01") },
    { projTitle: "HIV Drug Resistance",      type: "DATA_SHARING", status: "PENDING", ref: null, approvedAt: null },
    // TB Study
    { projTitle: "Tuberculosis Transmission",type: "ETHICS",     status: "APPROVED", ref: "IRB-2021-TB-003",  approvedAt: new Date("2020-12-10") },
    { projTitle: "Tuberculosis Transmission",type: "REGULATORY", status: "APPROVED", ref: "NMRA-OBS-2021-004", approvedAt: new Date("2021-01-05") },
    { projTitle: "Tuberculosis Transmission",type: "STUDY_CLOSURE", status: "APPROVED", ref: "CLO-2023-TB-003", approvedAt: new Date("2023-12-20") },
    // COVID Registry
    { projTitle: "COVID-19 Long-Term",       type: "ETHICS",     status: "APPROVED", ref: "IRB-2022-COV-019", approvedAt: new Date("2021-11-30") },
    { projTitle: "COVID-19 Long-Term",       type: "BUDGET",     status: "APPROVED", ref: "FIN-2022-COV-019",  approvedAt: new Date("2022-01-10") },
    { projTitle: "COVID-19 Long-Term",       type: "PROTOCOL_AMENDMENT", status: "APPROVED", ref: "PA-2023-COV-005", approvedAt: new Date("2023-03-15") },
    { projTitle: "COVID-19 Long-Term",       type: "BUDGET_EXTENSION", status: "PENDING", ref: null, approvedAt: null },
  ];

  for (const a of approvalData) {
    const p = proj(a.projTitle);
    if (!p) continue;
    const existing = await prisma.researchApproval.findFirst({
      where: { researchProjectId: p.id, approvalType: a.type },
    });
    if (!existing) {
      await prisma.researchApproval.create({
        data: {
          researchProjectId: p.id,
          approvalType: a.type,
          status: a.status,
          referenceNo: a.ref,
          approvedAt: a.approvedAt,
        },
      });
    }
  }
  console.log("   approvals seeded");

  console.log("✅  Research project seed complete");
}

main().catch(console.error).finally(() => prisma.$disconnect());
