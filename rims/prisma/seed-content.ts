const { PrismaClient } = require('../node_modules/.prisma/client');
const prisma = new PrismaClient();

const TENANT = '3f52a388-ce6b-4230-a7e4-6cfd7fa59bf5';
const USER = '03915e44-9bc6-4ab2-b096-a3488c64423d';

const EMPS = {
  amara:  '10bc111d-4669-4f80-b354-24e4c4b5b402',
  kwame:  'ca8f3765-1cc4-4993-a89f-86d77aeb28ea',
  yusuf:  '735f7d2b-22b1-4348-8b86-a08e2fa0be34',
  priya:  '34c17553-8e5f-4862-a8e7-de4b59a57e66',
  chidi:  'd4bc0a4c-2108-4083-94c5-a766285137a5',
  wei:    'f07142a8-ecd7-48c9-9242-a479437309aa',
  hiro:   'b87bbfa4-fab8-4e7a-bc58-9c067c7d196e',
  fatima: '22cd2446-eabf-4744-b7e3-e767ea34827f',
  maria:  '5f55116c-7dad-4950-a2bc-b77af32391dc',
  kofi:   'b85ef94a-6ab7-40e7-a63d-169c4a659baa',
};

const MANUSCRIPTS = {
  longCovid:  '3e588adc-0890-418b-90e1-6edab63e031f',
  amr:        '919d23ed-c82b-4e7a-a0a0-f9c8b81f7c60',
  hiv:        '5ed4c211-3f27-43f0-aae9-1180c071711b',
  malaria:    '7b50e3c5-f6f9-474e-9779-32d92659a6dd',
  tb:         'b1cc27d3-db6c-4a0d-a768-bbc081822a33',
  mlAmr:      '6a98b363-0abe-4ab7-9bee-5f603243ce1a',
};

const QUALITY = {
  iso:    '05895d1a-4899-41cf-a6b0-c01551314fc5',
  q3:     'cbe7f4e7-9db1-480d-8752-a4d3407d87c2',
  gcp:    '0577e1f7-33eb-445f-a925-be94a6ffce04',
  data:   '33eec21d-0af6-440f-b790-5bcdf7a89273',
};

const BUDGETS = {
  b1: '72afe272-b4f0-4e90-af19-c770998dd487',
  b2: '05b2010f-5b8b-480c-a48c-6c31a251599d',
  b3: '205dcd85-669a-441d-b956-0438d6397c8f',
  b4: '543252e7-d343-4c95-aaae-e3594ac330aa',
};

const TASKS = [
  'fb1b9f8b-01b2-4803-aa46-87c2506658a9',
  'fa62c21d-78e1-4df3-a65e-e5c8a8228ac7',
  '92fe5a0f-1e78-4042-8c19-21551cb3141b',
  '4a5719eb-47ce-40a4-8f8f-330aa5f8a29b',
  '53ecb4f6-79aa-4f54-879f-36cf6e57d1b9',
  '80f8a6ad-b1d3-402c-bbb4-c97715403e68',
  '1fa8e90b-ee81-4410-ab0b-bd761d2c442f',
  '70c608d7-50a5-46d5-9e8c-48ebaddcd6eb',
];

// ── helpers ──────────────────────────────────────────────────────────────────

function d(s: string) { return new Date(s); }

async function seedManuscripts() {
  console.log('Seeding manuscript authors & peer reviews...');

  const authorData: Array<{ manuscriptId: string; employeeId: string; contributionRole: string; authorOrder: number; isCorresponding: boolean }> = [
    { manuscriptId: MANUSCRIPTS.longCovid, employeeId: EMPS.priya,  contributionRole: 'Conceptualization, Writing – Original Draft', authorOrder: 1, isCorresponding: true },
    { manuscriptId: MANUSCRIPTS.longCovid, employeeId: EMPS.hiro,   contributionRole: 'Data Curation, Formal Analysis',              authorOrder: 2, isCorresponding: false },
    { manuscriptId: MANUSCRIPTS.longCovid, employeeId: EMPS.maria,  contributionRole: 'Investigation, Methodology',                  authorOrder: 3, isCorresponding: false },

    { manuscriptId: MANUSCRIPTS.amr,       employeeId: EMPS.kwame,  contributionRole: 'Conceptualization, Supervision',              authorOrder: 1, isCorresponding: true },
    { manuscriptId: MANUSCRIPTS.amr,       employeeId: EMPS.chidi,  contributionRole: 'Data Curation, Software',                     authorOrder: 2, isCorresponding: false },
    { manuscriptId: MANUSCRIPTS.amr,       employeeId: EMPS.wei,    contributionRole: 'Formal Analysis, Visualization',              authorOrder: 3, isCorresponding: false },

    { manuscriptId: MANUSCRIPTS.hiv,       employeeId: EMPS.yusuf,  contributionRole: 'Conceptualization, Writing – Original Draft', authorOrder: 1, isCorresponding: true },
    { manuscriptId: MANUSCRIPTS.hiv,       employeeId: EMPS.amara,  contributionRole: 'Methodology, Validation',                     authorOrder: 2, isCorresponding: false },

    { manuscriptId: MANUSCRIPTS.malaria,   employeeId: EMPS.fatima, contributionRole: 'Conceptualization, Project Administration',   authorOrder: 1, isCorresponding: true },
    { manuscriptId: MANUSCRIPTS.malaria,   employeeId: EMPS.kofi,   contributionRole: 'Investigation, Resources',                    authorOrder: 2, isCorresponding: false },
    { manuscriptId: MANUSCRIPTS.malaria,   employeeId: EMPS.priya,  contributionRole: 'Formal Analysis',                             authorOrder: 3, isCorresponding: false },

    { manuscriptId: MANUSCRIPTS.tb,        employeeId: EMPS.amara,  contributionRole: 'Conceptualization, Writing – Original Draft', authorOrder: 1, isCorresponding: true },
    { manuscriptId: MANUSCRIPTS.tb,        employeeId: EMPS.kwame,  contributionRole: 'Supervision, Funding Acquisition',            authorOrder: 2, isCorresponding: false },

    { manuscriptId: MANUSCRIPTS.mlAmr,     employeeId: EMPS.wei,    contributionRole: 'Conceptualization, Software, Visualization',  authorOrder: 1, isCorresponding: true },
    { manuscriptId: MANUSCRIPTS.mlAmr,     employeeId: EMPS.hiro,   contributionRole: 'Data Curation, Formal Analysis',              authorOrder: 2, isCorresponding: false },
    { manuscriptId: MANUSCRIPTS.mlAmr,     employeeId: EMPS.chidi,  contributionRole: 'Methodology, Validation',                     authorOrder: 3, isCorresponding: false },
  ];

  for (const a of authorData) {
    await prisma.manuscriptAuthor.upsert({
      where: { manuscriptId_employeeId: { manuscriptId: a.manuscriptId, employeeId: a.employeeId } },
      update: {},
      create: a,
    });
  }

  const reviewData = [
    { manuscriptId: MANUSCRIPTS.longCovid, round: 1, deadline: d('2026-03-15'), submittedAt: d('2026-03-10'), outcome: 'MAJOR_REVISION', notes: 'Reviewers requested additional neuroimaging data and expanded discussion of pathophysiology.' },
    { manuscriptId: MANUSCRIPTS.longCovid, round: 2, deadline: d('2026-05-01'), submittedAt: d('2026-04-28'), outcome: 'MINOR_REVISION', notes: 'Most concerns addressed. Minor clarifications needed in methods section.' },
    { manuscriptId: MANUSCRIPTS.longCovid, round: 3, deadline: d('2026-06-15'), submittedAt: d('2026-06-12'), outcome: 'ACCEPTED',       notes: 'All reviewer comments satisfactorily addressed.' },

    { manuscriptId: MANUSCRIPTS.amr,       round: 1, deadline: d('2026-04-20'), submittedAt: d('2026-04-18'), outcome: 'MAJOR_REVISION', notes: 'Statistical methodology questioned; additional controls requested.' },
    { manuscriptId: MANUSCRIPTS.amr,       round: 2, deadline: d('2026-06-30'), submittedAt: null,            outcome: null,             notes: 'Awaiting revised submission.' },

    { manuscriptId: MANUSCRIPTS.hiv,       round: 1, deadline: d('2025-11-30'), submittedAt: d('2025-11-25'), outcome: 'ACCEPTED',       notes: 'Strong methodology, well-written. Minor typographical corrections only.' },

    { manuscriptId: MANUSCRIPTS.malaria,   round: 1, deadline: d('2026-02-28'), submittedAt: d('2026-02-25'), outcome: 'MAJOR_REVISION', notes: 'Sample size justification insufficient; blinding procedures unclear.' },
    { manuscriptId: MANUSCRIPTS.malaria,   round: 2, deadline: d('2026-05-15'), submittedAt: d('2026-05-10'), outcome: 'MINOR_REVISION', notes: 'Improved but additional clarification on adverse events reporting needed.' },

    { manuscriptId: MANUSCRIPTS.tb,        round: 1, deadline: d('2026-01-31'), submittedAt: d('2026-01-28'), outcome: 'ACCEPTED',       notes: 'Excellent epidemiological analysis. Accepted with minor editorial changes.' },

    { manuscriptId: MANUSCRIPTS.mlAmr,     round: 1, deadline: d('2026-07-31'), submittedAt: null,            outcome: null,             notes: 'Under review.' },
  ];

  for (const r of reviewData) {
    await prisma.manuscriptReview.create({ data: r });
  }

  console.log(`  ✓ ${authorData.length} authors, ${reviewData.length} peer reviews`);
}

async function seedQualityReviews() {
  console.log('Seeding quality findings & corrective actions...');

  type FindingInput = { reviewId: string; title: string; description: string; severity: string; status: string };
  const findings: FindingInput[] = [
    // ISO 9001
    { reviewId: QUALITY.iso, title: 'Document Control Gaps', description: 'Several SOPs lack version control headers and approval signatures.', severity: 'MAJOR', status: 'IN_PROGRESS' },
    { reviewId: QUALITY.iso, title: 'Training Records Incomplete', description: 'Training completion records missing for 6 staff members in Clinical Research dept.', severity: 'MAJOR', status: 'OPEN' },
    { reviewId: QUALITY.iso, title: 'Internal Audit Schedule Overdue', description: 'Last internal audit was conducted 14 months ago; schedule requires quarterly cadence.', severity: 'MINOR', status: 'OPEN' },
    { reviewId: QUALITY.iso, title: 'Corrective Action Tracking System', description: 'No centralised system for tracking corrective actions to closure.', severity: 'OBSERVATION', status: 'CLOSED' },

    // Q3 Internal Audit
    { reviewId: QUALITY.q3, title: 'Budget Variance Reporting Delay', description: 'Finance team reporting budget variances 3 weeks after period close instead of 5 days.', severity: 'MAJOR', status: 'IN_PROGRESS' },
    { reviewId: QUALITY.q3, title: 'Ethics Approval Expiry Monitoring', description: 'No automated alerts for ethics approval renewals; two approvals expired unnoticed.', severity: 'CRITICAL', status: 'IN_PROGRESS' },
    { reviewId: QUALITY.q3, title: 'Data Backup Verification', description: 'Backup restoration tests not performed in the last 6 months.', severity: 'MAJOR', status: 'OPEN' },
    { reviewId: QUALITY.q3, title: 'Visitor Access Log Gaps', description: 'Laboratory visitor log has 3 undocumented entries in August.', severity: 'MINOR', status: 'CLOSED' },

    // GCP Compliance
    { reviewId: QUALITY.gcp, title: 'Informed Consent Form Version Mismatch', description: 'Participants enrolled using v1.2 consent form after v1.3 was approved.', severity: 'CRITICAL', status: 'IN_PROGRESS' },
    { reviewId: QUALITY.gcp, title: 'Adverse Event Reporting Delay', description: 'Two SAEs reported to sponsor 6 days after occurrence; GCP requires 24-hour reporting.', severity: 'MAJOR', status: 'IN_PROGRESS' },
    { reviewId: QUALITY.gcp, title: 'Investigator Brochure Not Current', description: 'Site has version 4 of IB; current version is 6.', severity: 'MAJOR', status: 'OPEN' },

    // Data Management
    { reviewId: QUALITY.data, title: 'Missing Data Validation Rules', description: 'EDC system lacks range checks for 4 critical data fields.', severity: 'MAJOR', status: 'OPEN' },
    { reviewId: QUALITY.data, title: 'Data Dictionary Not Updated', description: 'Data dictionary has not been updated to reflect protocol amendment v2.', severity: 'MINOR', status: 'OPEN' },
    { reviewId: QUALITY.data, title: 'Query Resolution Backlog', description: '47 open data queries outstanding for more than 30 days.', severity: 'MAJOR', status: 'IN_PROGRESS' },
  ];

  const createdFindings: Array<{ id: string; reviewId: string }> = [];
  for (const f of findings) {
    const created = await prisma.qualityFinding.create({
      data: { tenantId: TENANT, ...f },
    });
    createdFindings.push({ id: created.id, reviewId: f.reviewId });
  }

  type ActionInput = { findingId: string; title: string; description: string; status: string; dueDate: Date };
  const actions: ActionInput[] = [
    { findingId: createdFindings[0].id, title: 'Update all SOPs with version control template', description: 'Apply standardised header to all 23 active SOPs.', status: 'IN_PROGRESS', dueDate: d('2026-09-30') },
    { findingId: createdFindings[0].id, title: 'Obtain missing approval signatures', description: 'Route 8 unsigned SOPs through approval workflow.', status: 'OPEN', dueDate: d('2026-09-15') },
    { findingId: createdFindings[1].id, title: 'Complete outstanding training sessions', description: 'Schedule and complete training for 6 staff members.', status: 'OPEN', dueDate: d('2026-10-01') },
    { findingId: createdFindings[4].id, title: 'Implement automated variance reporting', description: 'Configure finance system to auto-generate variance report on day 5 of period close.', status: 'IN_PROGRESS', dueDate: d('2026-09-20') },
    { findingId: createdFindings[5].id, title: 'Set up ethics renewal alert system', description: 'Configure 90-day, 60-day, and 30-day automated email alerts for ethics expiry.', status: 'IN_PROGRESS', dueDate: d('2026-08-31') },
    { findingId: createdFindings[5].id, title: 'Renew expired ethics approvals', description: 'Submit renewal applications for the two expired approvals immediately.', status: 'OPEN', dueDate: d('2026-08-15') },
    { findingId: createdFindings[8].id, title: 'Re-consent affected participants', description: 'Identify and re-consent all participants enrolled with v1.2 form.', status: 'IN_PROGRESS', dueDate: d('2026-08-20') },
    { findingId: createdFindings[9].id, title: 'Retrain site staff on SAE reporting', description: 'Conduct emergency GCP refresher training focused on SAE timelines.', status: 'OPEN', dueDate: d('2026-08-10') },
    { findingId: createdFindings[11].id, title: 'Implement EDC validation rules', description: 'Programme range checks for all 4 critical fields in EDC system.', status: 'OPEN', dueDate: d('2026-09-15') },
    { findingId: createdFindings[13].id, title: 'Resolve query backlog', description: 'Assign queries to data managers; target zero queries >30 days by end of month.', status: 'IN_PROGRESS', dueDate: d('2026-08-31') },
  ];

  for (const a of actions) {
    await prisma.correctiveAction.create({
      data: { tenantId: TENANT, ...a },
    });
  }

  console.log(`  ✓ ${findings.length} findings, ${actions.length} corrective actions`);
}

async function seedBudgets() {
  console.log('Seeding budget categories & expenses...');

  // Budget 1 — $180,000
  const b1cats = await Promise.all([
    prisma.budgetCategory.create({ data: { budgetId: BUDGETS.b1, name: 'Personnel',          allocated: 90000 } }),
    prisma.budgetCategory.create({ data: { budgetId: BUDGETS.b1, name: 'Laboratory Supplies', allocated: 45000 } }),
    prisma.budgetCategory.create({ data: { budgetId: BUDGETS.b1, name: 'Travel & Conferences', allocated: 20000 } }),
    prisma.budgetCategory.create({ data: { budgetId: BUDGETS.b1, name: 'Equipment',            allocated: 25000 } }),
  ]);

  // Budget 2 — $144,000
  const b2cats = await Promise.all([
    prisma.budgetCategory.create({ data: { budgetId: BUDGETS.b2, name: 'Personnel',          allocated: 72000 } }),
    prisma.budgetCategory.create({ data: { budgetId: BUDGETS.b2, name: 'Clinical Supplies',  allocated: 36000 } }),
    prisma.budgetCategory.create({ data: { budgetId: BUDGETS.b2, name: 'Data Management',    allocated: 18000 } }),
    prisma.budgetCategory.create({ data: { budgetId: BUDGETS.b2, name: 'Overheads',          allocated: 18000 } }),
  ]);

  // Budget 3 — $256,000
  const b3cats = await Promise.all([
    prisma.budgetCategory.create({ data: { budgetId: BUDGETS.b3, name: 'Personnel',          allocated: 128000 } }),
    prisma.budgetCategory.create({ data: { budgetId: BUDGETS.b3, name: 'Reagents & Kits',    allocated: 64000  } }),
    prisma.budgetCategory.create({ data: { budgetId: BUDGETS.b3, name: 'Sequencing Costs',   allocated: 40000  } }),
    prisma.budgetCategory.create({ data: { budgetId: BUDGETS.b3, name: 'Dissemination',      allocated: 24000  } }),
  ]);

  // Budget 4 — $400,000
  const b4cats = await Promise.all([
    prisma.budgetCategory.create({ data: { budgetId: BUDGETS.b4, name: 'Personnel',          allocated: 200000 } }),
    prisma.budgetCategory.create({ data: { budgetId: BUDGETS.b4, name: 'Field Operations',   allocated: 80000  } }),
    prisma.budgetCategory.create({ data: { budgetId: BUDGETS.b4, name: 'Laboratory',         allocated: 60000  } }),
    prisma.budgetCategory.create({ data: { budgetId: BUDGETS.b4, name: 'Indirect Costs',     allocated: 60000  } }),
  ]);

  type ExpInput = { tenantId: string; budgetId: string; categoryId: string; description: string; amount: number; currency: string; transactionDate: Date; reference: string };
  const expenses: ExpInput[] = [
    // B1
    { tenantId: TENANT, budgetId: BUDGETS.b1, categoryId: b1cats[0].id, description: 'Research Assistant salary — July',    amount: 3800,  currency: 'USD', transactionDate: d('2026-07-31'), reference: 'PAY-2026-07-RA01' },
    { tenantId: TENANT, budgetId: BUDGETS.b1, categoryId: b1cats[0].id, description: 'Research Assistant salary — August',  amount: 3800,  currency: 'USD', transactionDate: d('2026-08-31'), reference: 'PAY-2026-08-RA01' },
    { tenantId: TENANT, budgetId: BUDGETS.b1, categoryId: b1cats[1].id, description: 'PCR reagent kit (x50)',               amount: 4200,  currency: 'USD', transactionDate: d('2026-07-15'), reference: 'PO-2026-0142' },
    { tenantId: TENANT, budgetId: BUDGETS.b1, categoryId: b1cats[1].id, description: 'Cell culture media & supplements',    amount: 2100,  currency: 'USD', transactionDate: d('2026-08-05'), reference: 'PO-2026-0158' },
    { tenantId: TENANT, budgetId: BUDGETS.b1, categoryId: b1cats[2].id, description: 'ASTMH 2026 conference registration',  amount: 1200,  currency: 'USD', transactionDate: d('2026-08-20'), reference: 'CONF-ASTMH-2026' },
    { tenantId: TENANT, budgetId: BUDGETS.b1, categoryId: b1cats[3].id, description: 'Centrifuge maintenance contract',     amount: 3500,  currency: 'USD', transactionDate: d('2026-07-01'), reference: 'MAINT-CENT-2026' },

    // B2
    { tenantId: TENANT, budgetId: BUDGETS.b2, categoryId: b2cats[0].id, description: 'Clinical coordinator salary — Q3',    amount: 12000, currency: 'USD', transactionDate: d('2026-09-30'), reference: 'PAY-2026-Q3-CC' },
    { tenantId: TENANT, budgetId: BUDGETS.b2, categoryId: b2cats[1].id, description: 'Artemisinin combination therapy stock', amount: 8500, currency: 'USD', transactionDate: d('2026-08-10'), reference: 'PO-2026-0171' },
    { tenantId: TENANT, budgetId: BUDGETS.b2, categoryId: b2cats[1].id, description: 'Rapid diagnostic test kits (x500)',   amount: 3200,  currency: 'USD', transactionDate: d('2026-09-01'), reference: 'PO-2026-0185' },
    { tenantId: TENANT, budgetId: BUDGETS.b2, categoryId: b2cats[2].id, description: 'REDCap hosting annual fee',           amount: 2400,  currency: 'USD', transactionDate: d('2026-07-01'), reference: 'INV-REDCAP-2026' },

    // B3
    { tenantId: TENANT, budgetId: BUDGETS.b3, categoryId: b3cats[0].id, description: 'Bioinformatician salary — H2 2026',   amount: 28000, currency: 'USD', transactionDate: d('2026-09-30'), reference: 'PAY-2026-H2-BIO' },
    { tenantId: TENANT, budgetId: BUDGETS.b3, categoryId: b3cats[1].id, description: 'Illumina sequencing reagents',        amount: 15000, currency: 'USD', transactionDate: d('2026-07-20'), reference: 'PO-2026-0155' },
    { tenantId: TENANT, budgetId: BUDGETS.b3, categoryId: b3cats[2].id, description: 'Whole-genome sequencing batch 1',     amount: 18000, currency: 'USD', transactionDate: d('2026-08-15'), reference: 'SEQ-WGS-B1-2026' },
    { tenantId: TENANT, budgetId: BUDGETS.b3, categoryId: b3cats[3].id, description: 'Open-access publication fee',         amount: 3200,  currency: 'USD', transactionDate: d('2026-09-10'), reference: 'OA-PUB-2026-01' },

    // B4
    { tenantId: TENANT, budgetId: BUDGETS.b4, categoryId: b4cats[0].id, description: 'Epidemiologist salary — Q3 2026',     amount: 18000, currency: 'USD', transactionDate: d('2026-09-30'), reference: 'PAY-2026-Q3-EPI' },
    { tenantId: TENANT, budgetId: BUDGETS.b4, categoryId: b4cats[1].id, description: 'Field team transport & logistics',    amount: 9500,  currency: 'USD', transactionDate: d('2026-08-31'), reference: 'FIELD-TRANS-Q3' },
    { tenantId: TENANT, budgetId: BUDGETS.b4, categoryId: b4cats[1].id, description: 'Community engagement activities',     amount: 4200,  currency: 'USD', transactionDate: d('2026-09-15'), reference: 'COMM-ENG-2026' },
    { tenantId: TENANT, budgetId: BUDGETS.b4, categoryId: b4cats[2].id, description: 'TB culture media & biosafety supplies', amount: 7800, currency: 'USD', transactionDate: d('2026-07-25'), reference: 'PO-2026-0162' },
  ];

  for (const e of expenses) {
    await prisma.expense.create({ data: e });
  }

  console.log(`  ✓ 16 budget categories, ${expenses.length} expenses`);
}

async function seedTaskComments() {
  console.log('Seeding task comments...');

  const comments = [
    { taskId: TASKS[0], authorId: USER, content: 'IRB submission package reviewed. Missing two supporting documents — requesting from PI.' },
    { taskId: TASKS[0], authorId: USER, content: 'Documents received. Submission ready for final sign-off.' },
    { taskId: TASKS[1], authorId: USER, content: 'Ethics committee confirmed receipt of amendment. Awaiting acknowledgement letter.' },
    { taskId: TASKS[2], authorId: USER, content: 'Performance review schedule drafted and sent to department heads for confirmation.' },
    { taskId: TASKS[2], authorId: USER, content: 'All department heads confirmed. Calendar invites sent to all reviewees.' },
    { taskId: TASKS[3], authorId: USER, content: 'Data collection complete. Starting analysis phase.' },
    { taskId: TASKS[3], authorId: USER, content: 'Draft report sections 1–3 complete. Circulating for internal review.' },
    { taskId: TASKS[4], authorId: USER, content: 'Sequencing results received from core facility. Running initial QC pipeline.' },
    { taskId: TASKS[4], authorId: USER, content: 'QC passed for 94% of samples. Proceeding with variant calling.' },
    { taskId: TASKS[5], authorId: USER, content: 'Donor report template approved by communications team. Populating with Q3 data.' },
    { taskId: TASKS[6], authorId: USER, content: 'Manuscript draft reviewed. Flagged 3 areas needing additional references.' },
    { taskId: TASKS[7], authorId: USER, content: 'Protocol amendment v2 reviewed. Updating data collection forms accordingly.' },
  ];

  for (const c of comments) {
    await prisma.taskComment.create({ data: c });
  }

  console.log(`  ✓ ${comments.length} task comments`);
}

async function seedDocuments() {
  console.log('Seeding document versions...');

  const docs = await prisma.document.findMany({ where: { tenantId: TENANT } });
  if (docs.length === 0) {
    // Create some documents first
    const createdDocs = await Promise.all([
      prisma.document.create({ data: { tenantId: TENANT, title: 'Standard Operating Procedure — Sample Collection', description: 'SOP for biological sample collection across all clinical trials.', status: 'APPROVED', fileName: 'SOP-SAMPLE-COLLECTION-v3.pdf', mimeType: 'application/pdf', fileSizeBytes: 524288, currentVersion: 3, fileKey: 'docs/sop-sample-collection-v3.pdf' } }),
      prisma.document.create({ data: { tenantId: TENANT, title: 'Data Management Plan — AMR Study', description: 'Comprehensive data management plan for the antimicrobial resistance surveillance study.', status: 'APPROVED', fileName: 'DMP-AMR-STUDY-v2.pdf', mimeType: 'application/pdf', fileSizeBytes: 307200, currentVersion: 2, fileKey: 'docs/dmp-amr-study-v2.pdf' } }),
      prisma.document.create({ data: { tenantId: TENANT, title: 'Ethics Application — Malaria Trial', description: 'Full ethics application package for the artemisinin combination therapy trial.', status: 'APPROVED', fileName: 'ETHICS-MALARIA-TRIAL-v1.pdf', mimeType: 'application/pdf', fileSizeBytes: 1048576, currentVersion: 1, fileKey: 'docs/ethics-malaria-trial-v1.pdf' } }),
      prisma.document.create({ data: { tenantId: TENANT, title: 'Informed Consent Form — COVID Registry', description: 'Patient informed consent form for the Long COVID neurological registry.', status: 'UNDER_REVIEW', fileName: 'ICF-COVID-REGISTRY-v1.3.pdf', mimeType: 'application/pdf', fileSizeBytes: 204800, currentVersion: 3, fileKey: 'docs/icf-covid-registry-v1.3.pdf' } }),
      prisma.document.create({ data: { tenantId: TENANT, title: 'Annual Research Report 2025', description: 'Comprehensive annual report covering all research activities for the 2025 fiscal year.', status: 'APPROVED', fileName: 'ANNUAL-REPORT-2025.pdf', mimeType: 'application/pdf', fileSizeBytes: 2097152, currentVersion: 1, fileKey: 'docs/annual-report-2025.pdf' } }),
    ]);

    for (const doc of createdDocs) {
      const versionCount = doc.currentVersion;
      for (let v = 1; v <= versionCount; v++) {
        await prisma.documentVersion.create({
          data: {
            documentId: doc.id,
            version: v,
            fileKey: doc.fileKey?.replace(/v\d+/, `v${v}`) ?? `docs/doc-${doc.id}-v${v}.pdf`,
            fileName: doc.fileName?.replace(/v[\d.]+/, `v${v}`) ?? `document-v${v}.pdf`,
            fileSizeBytes: doc.fileSizeBytes ? Math.round(doc.fileSizeBytes * (0.8 + v * 0.1)) : null,
            uploadedById: USER,
            notes: v === versionCount ? 'Current version' : `Version ${v} — superseded`,
          },
        });
      }
    }
    console.log(`  ✓ 5 documents with versions created`);
  } else {
    // Add versions to existing docs that have none
    for (const doc of docs) {
      const existing = await prisma.documentVersion.count({ where: { documentId: doc.id } });
      if (existing === 0) {
        await prisma.documentVersion.create({
          data: {
            documentId: doc.id,
            version: doc.currentVersion ?? 1,
            fileKey: doc.fileKey ?? `docs/doc-${doc.id}-v1.pdf`,
            fileName: doc.fileName ?? 'document-v1.pdf',
            fileSizeBytes: doc.fileSizeBytes,
            uploadedById: USER,
            notes: 'Initial version',
          },
        });
      }
    }
    console.log(`  ✓ Document versions seeded for ${docs.length} existing documents`);
  }
}

async function seedEmployeeDetails() {
  console.log('Seeding employee qualifications, certifications & skills...');

  const qualifications = [
    { employeeId: EMPS.amara,  name: 'PhD Epidemiology',              institution: 'London School of Hygiene & Tropical Medicine', yearObtained: 2015 },
    { employeeId: EMPS.amara,  name: 'MSc Public Health',             institution: 'University of Ghana',                          yearObtained: 2010 },
    { employeeId: EMPS.kwame,  name: 'PhD Microbiology',              institution: 'University of Cape Town',                      yearObtained: 2013 },
    { employeeId: EMPS.kwame,  name: 'BSc Biochemistry',              institution: 'Kwame Nkrumah University of Science & Technology', yearObtained: 2008 },
    { employeeId: EMPS.yusuf,  name: 'PhD Molecular Biology',         institution: 'University of Nairobi',                        yearObtained: 2016 },
    { employeeId: EMPS.priya,  name: 'MD',                            institution: 'All India Institute of Medical Sciences',      yearObtained: 2012 },
    { employeeId: EMPS.priya,  name: 'PhD Clinical Research',         institution: 'University of Oxford',                         yearObtained: 2018 },
    { employeeId: EMPS.chidi,  name: 'MSc Bioinformatics',            institution: 'University of Edinburgh',                      yearObtained: 2019 },
    { employeeId: EMPS.wei,    name: 'PhD Computational Biology',     institution: 'Peking University',                            yearObtained: 2017 },
    { employeeId: EMPS.hiro,   name: 'PhD Neuroscience',              institution: 'University of Tokyo',                          yearObtained: 2018 },
    { employeeId: EMPS.fatima, name: 'PhD Parasitology',              institution: 'University of Khartoum',                       yearObtained: 2014 },
    { employeeId: EMPS.maria,  name: 'MSc Clinical Trials',           institution: 'University of São Paulo',                      yearObtained: 2020 },
    { employeeId: EMPS.kofi,   name: 'BSc Medical Laboratory Science', institution: 'University of Ghana Medical School',          yearObtained: 2017 },
  ];

  for (const q of qualifications) {
    await prisma.employeeQualification.create({ data: q });
  }

  const certifications = [
    { employeeId: EMPS.amara,  name: 'Good Clinical Practice (ICH-GCP)', issuingBody: 'CITI Program',          licenceNumber: 'CITI-2024-001', issuedAt: new Date('2024-01-15'), expiresAt: new Date('2026-01-15') },
    { employeeId: EMPS.kwame,  name: 'Good Clinical Practice (ICH-GCP)', issuingBody: 'CITI Program',          licenceNumber: 'CITI-2024-002', issuedAt: new Date('2024-02-10'), expiresAt: new Date('2026-02-10') },
    { employeeId: EMPS.yusuf,  name: 'Good Clinical Practice (ICH-GCP)', issuingBody: 'CITI Program',          licenceNumber: 'CITI-2024-003', issuedAt: new Date('2024-03-05'), expiresAt: new Date('2026-03-05') },
    { employeeId: EMPS.priya,  name: 'Good Clinical Practice (ICH-GCP)', issuingBody: 'CITI Program',          licenceNumber: 'CITI-2023-004', issuedAt: new Date('2023-06-20'), expiresAt: new Date('2025-06-20') },
    { employeeId: EMPS.priya,  name: 'Medical License',                  issuingBody: 'Medical Council of India', licenceNumber: 'MCI-2012-78432', issuedAt: new Date('2012-09-01'), expiresAt: null },
    { employeeId: EMPS.chidi,  name: 'AWS Certified Solutions Architect', issuingBody: 'Amazon Web Services',  licenceNumber: 'AWS-SAA-2024-0891', issuedAt: new Date('2024-04-12'), expiresAt: new Date('2027-04-12') },
    { employeeId: EMPS.wei,    name: 'Certified Bioinformatics Scientist', issuingBody: 'ABPI',                licenceNumber: 'ABPI-CBS-2023-112', issuedAt: new Date('2023-11-01'), expiresAt: new Date('2026-11-01') },
    { employeeId: EMPS.fatima, name: 'Good Clinical Practice (ICH-GCP)', issuingBody: 'CITI Program',          licenceNumber: 'CITI-2024-005', issuedAt: new Date('2024-01-30'), expiresAt: new Date('2026-01-30') },
    { employeeId: EMPS.kofi,   name: 'Medical Laboratory Scientist License', issuingBody: 'Allied Health Professions Council Ghana', licenceNumber: 'AHPC-MLS-2022-0341', issuedAt: new Date('2022-03-01'), expiresAt: new Date('2025-03-01') },
  ];

  for (const c of certifications) {
    await prisma.employeeCertification.create({ data: c });
  }

  const skills = [
    { employeeId: EMPS.amara,  skill: 'Epidemiological Study Design', level: 'Expert' },
    { employeeId: EMPS.amara,  skill: 'Stata / R Statistical Software', level: 'Expert' },
    { employeeId: EMPS.amara,  skill: 'Field Research Management', level: 'Advanced' },
    { employeeId: EMPS.kwame,  skill: 'Antimicrobial Susceptibility Testing', level: 'Expert' },
    { employeeId: EMPS.kwame,  skill: 'Molecular Diagnostics', level: 'Expert' },
    { employeeId: EMPS.kwame,  skill: 'Laboratory Management', level: 'Advanced' },
    { employeeId: EMPS.yusuf,  skill: 'HIV Molecular Epidemiology', level: 'Expert' },
    { employeeId: EMPS.yusuf,  skill: 'Phylogenetic Analysis', level: 'Advanced' },
    { employeeId: EMPS.priya,  skill: 'Clinical Trial Management', level: 'Expert' },
    { employeeId: EMPS.priya,  skill: 'Neurology', level: 'Advanced' },
    { employeeId: EMPS.priya,  skill: 'REDCap', level: 'Advanced' },
    { employeeId: EMPS.chidi,  skill: 'Python / Biopython', level: 'Expert' },
    { employeeId: EMPS.chidi,  skill: 'Next-Generation Sequencing Analysis', level: 'Advanced' },
    { employeeId: EMPS.wei,    skill: 'Machine Learning (scikit-learn, PyTorch)', level: 'Expert' },
    { employeeId: EMPS.wei,    skill: 'Genomic Data Analysis', level: 'Expert' },
    { employeeId: EMPS.hiro,   skill: 'Neuroimaging Analysis (FSL, SPM)', level: 'Expert' },
    { employeeId: EMPS.hiro,   skill: 'Clinical Data Management', level: 'Advanced' },
    { employeeId: EMPS.fatima, skill: 'Malaria Parasitology', level: 'Expert' },
    { employeeId: EMPS.fatima, skill: 'Clinical Trial Protocol Development', level: 'Advanced' },
    { employeeId: EMPS.maria,  skill: 'Clinical Data Coordination', level: 'Advanced' },
    { employeeId: EMPS.maria,  skill: 'Regulatory Submissions', level: 'Intermediate' },
    { employeeId: EMPS.kofi,   skill: 'Haematology & Biochemistry Analysis', level: 'Advanced' },
    { employeeId: EMPS.kofi,   skill: 'Quality Control in Laboratory', level: 'Advanced' },
  ];

  for (const s of skills) {
    await prisma.employeeSkill.create({ data: s });
  }

  const employmentRecords = [
    { employeeId: EMPS.amara,  eventType: 'HIRE',       description: 'Joined as Senior Epidemiologist',          effectiveDate: new Date('2020-03-01') },
    { employeeId: EMPS.amara,  eventType: 'PROMOTION',  description: 'Promoted to Principal Epidemiologist',     effectiveDate: new Date('2023-01-01') },
    { employeeId: EMPS.kwame,  eventType: 'HIRE',       description: 'Joined as Laboratory Director',            effectiveDate: new Date('2019-06-01') },
    { employeeId: EMPS.yusuf,  eventType: 'HIRE',       description: 'Joined as Molecular Biologist',            effectiveDate: new Date('2021-09-01') },
    { employeeId: EMPS.priya,  eventType: 'HIRE',       description: 'Joined as Clinical Research Physician',    effectiveDate: new Date('2022-01-15') },
    { employeeId: EMPS.chidi,  eventType: 'HIRE',       description: 'Joined as Bioinformatics Analyst',         effectiveDate: new Date('2023-04-01') },
    { employeeId: EMPS.wei,    eventType: 'HIRE',       description: 'Joined as Computational Biologist',        effectiveDate: new Date('2022-08-01') },
    { employeeId: EMPS.hiro,   eventType: 'HIRE',       description: 'Joined as Clinical Data Manager',          effectiveDate: new Date('2023-02-01') },
    { employeeId: EMPS.fatima, eventType: 'HIRE',       description: 'Joined as Malaria Research Scientist',     effectiveDate: new Date('2020-11-01') },
    { employeeId: EMPS.fatima, eventType: 'PROMOTION',  description: 'Promoted to Senior Research Scientist',    effectiveDate: new Date('2024-01-01') },
    { employeeId: EMPS.maria,  eventType: 'HIRE',       description: 'Joined as Clinical Trials Coordinator',    effectiveDate: new Date('2024-03-01') },
    { employeeId: EMPS.kofi,   eventType: 'HIRE',       description: 'Joined as Laboratory Technician',          effectiveDate: new Date('2023-07-01') },
  ];

  for (const r of employmentRecords) {
    await prisma.employmentRecord.create({ data: r });
  }

  console.log(`  ✓ ${qualifications.length} qualifications, ${certifications.length} certifications, ${skills.length} skills, ${employmentRecords.length} employment records`);
}

async function main() {
  try {
    await seedManuscripts();
    await seedQualityReviews();
    await seedBudgets();
    await seedTaskComments();
    await seedDocuments();
    await seedEmployeeDetails();
    console.log('\n✅ All content seeded successfully');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
