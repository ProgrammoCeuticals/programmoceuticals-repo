import bcrypt from "bcryptjs";
import { execFileSync } from "node:child_process";
import { eq } from "drizzle-orm";
import { env } from "../config/env.js";
import { LOOKUP_TYPES, FINAL_DECISIONS, REVIEW_STATUSES, BCS_CLASSES } from "../constants/workflow.js";
import { DEFAULT_STUDY_PERIODS, DEFAULT_SUMMARY_RESULTS, SECTION_B_DOCUMENTS } from "../constants/checklist.js";
import { db } from "../db/client.js";
import {
  applicantProfiles,
  applications,
  assessorAssignments,
  assessorComments,
  auditLogs,
  beChecklists,
  beStudyPeriods,
  beSummaryResults,
  complianceDirectives,
  finalDecisions,
  internalNotes,
  lookupItems,
  notifications,
  productClassifications,
  sectionBDocumentReferences,
  users,
} from "../db/schema.js";
import { makeApplicationNumber } from "../utils/application-number.js";

// ─── Workbook helpers ─────────────────────────────────────────────────────────

const decodeXml = (v: string) =>
  v.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
   .replace(/&quot;/g, '"').replace(/&apos;/g, "'");

const readZipEntry = (xlsxPath: string, entryPath: string) =>
  execFileSync("unzip", ["-p", xlsxPath, entryPath], { encoding: "utf8" });

const readSharedStrings = (xlsxPath: string) => {
  const xml = readZipEntry(xlsxPath, "xl/sharedStrings.xml");
  const strings: string[] = [];
  const itemPattern = /<si>([\s\S]*?)<\/si>/g;
  let m: RegExpExecArray | null;
  while ((m = itemPattern.exec(xml))) {
    const parts = [...m[1].matchAll(/<t(?:\s[^>]*)?>([^<]*)<\/t>/g)];
    strings.push(decodeXml(parts.map((p) => p[1]).join("")).trim());
  }
  return strings;
};

const extractRowsFromWorksheet = (xlsxPath: string, worksheetPath: string) => {
  const ss = readSharedStrings(xlsxPath);
  const xml = readZipEntry(xlsxPath, worksheetPath);
  const rows: Array<{ rowNumber: number; xml: string; ss: string[] }> = [];
  const rp = /<row\b[^>]*r="(\d+)"[\s\S]*?<\/row>/g;
  let m: RegExpExecArray | null;
  while ((m = rp.exec(xml))) rows.push({ rowNumber: Number(m[1]), xml: m[0], ss });
  return rows;
};

const cellText = (rowXml: string, cellRef: string, ss: string[]) => {
  const cell = rowXml.match(new RegExp(`<c\\b[^>]*r="${cellRef}"[^>]*>([\\s\\S]*?)<\\/c>`))?.[0];
  if (!cell) return "";
  const v = cell.match(/<v>([\s\S]*?)<\/v>/)?.[1];
  if (!v) return "";
  return cell.includes('t="s"') ? (ss[Number(v)] ?? "").trim() : v.trim();
};

const normalize = (v: string) => v.replace(/\s+/g, " ").replace(/\s+\+/g, " +").replace(/\+\s+/g, "+ ").trim();

const bcsEnum = (raw: string) => {
  const v = raw.trim().replace(/\s+/g, " ").replace(/[()]/g, "");
  if (/^I$/i.test(v)) return "Class I";
  if (/^II$/i.test(v)) return "Class II";
  if (/^III$/i.test(v)) return "Class III";
  if (/^IV$/i.test(v)) return "Class IV";
  return "Unknown";
};

const slugEmail = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "").slice(0, 60) ||
  `assessor.${Math.random().toString(36).slice(2, 8)}`;

const workbookPath = () =>
  new URL("../../../BE_Assessment_Tracking_Template.xlsx", import.meta.url).pathname;

const extractAssessorNames = () => {
  const path = workbookPath();
  const ss = readSharedStrings(path);
  const xml = readZipEntry(path, "xl/worksheets/sheet3.xml");
  const names = new Set<string>();
  const rp = /<row\b[\s\S]*?<\/row>/g;
  let m: RegExpExecArray | null;
  while ((m = rp.exec(xml))) {
    const cell = m[0].match(/<c\b[^>]*r="B\d+"[^>]*t="s"[^>]*>\s*<v>(\d+)<\/v>\s*<\/c>/);
    if (!cell) continue;
    const name = ss[Number(cell[1])]?.replace(/\s+/g, " ").trim();
    if (!name || /name of assessors/i.test(name)) continue;
    names.add(name);
  }
  return [...names].sort((a, b) => a.localeCompare(b));
};

const extractBcsRows = () => {
  const path = workbookPath();
  const rows = extractRowsFromWorksheet(path, "xl/worksheets/sheet4.xml");
  const records = new Map<string, { productName: string; rawBcsClass: string; bcsClass: string }>();
  for (const row of rows) {
    const productName = normalize(cellText(row.xml, `A${row.rowNumber}`, row.ss));
    const rawBcsClass = normalize(cellText(row.xml, `B${row.rowNumber}`, row.ss));
    if (!productName || !rawBcsClass) continue;
    if (/drug substance|bcs class/i.test(productName)) continue;
    if (!/[IV]/i.test(rawBcsClass)) continue;
    records.set(productName.toLowerCase(), { productName, rawBcsClass, bcsClass: bcsEnum(rawBcsClass) });
  }
  return [...records.values()].sort((a, b) => a.productName.localeCompare(b.productName));
};

const extractNtiRows = () => {
  const path = workbookPath();
  const rows = extractRowsFromWorksheet(path, "xl/worksheets/sheet5.xml");
  const names = new Set<string>();
  for (const row of rows) {
    for (const col of ["B", "E"]) {
      const name = normalize(cellText(row.xml, `${col}${row.rowNumber}`, row.ss));
      if (!name || /products|s\/?no|list of drugs/i.test(name)) continue;
      names.add(name);
    }
  }
  return [...names].sort((a, b) => a.localeCompare(b));
};

// ─── DB helpers ───────────────────────────────────────────────────────────────

const upsertLookup = async (input: {
  type: string; label: string; value?: string;
  description?: string; metadata?: Record<string, unknown>; createdByUserId?: string;
}) => {
  await db.insert(lookupItems).values({
    type: input.type, label: input.label, value: input.value ?? input.label,
    description: input.description, metadata: input.metadata ?? {},
    createdByUserId: input.createdByUserId,
  }).onConflictDoNothing();
};

const upsertUser = async (data: {
  fullName: string; email: string; password: string;
  role: "super_admin" | "admin" | "assessor" | "applicant";
  companyName?: string; contactPersonName?: string; companyAddress?: string;
  companyPhone?: string; companyEmail?: string; rcNumber?: string;
  marketAuthorisationHolder?: string;
}) => {
  const [existing] = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
  if (existing) { console.log(`  already exists: ${data.email}`); return existing; }
  const passwordHash = await bcrypt.hash(data.password, 12);
  const [user] = await db.insert(users).values({
    fullName: data.fullName, email: data.email, passwordHash, role: data.role,
  }).returning();
  if (data.role === "applicant" && data.companyName) {
    await db.insert(applicantProfiles).values({
      userId: user.id,
      companyName: data.companyName,
      contactPersonName: data.contactPersonName ?? data.fullName,
      companyAddress: data.companyAddress,
      companyPhone: data.companyPhone,
      companyEmail: data.companyEmail,
      rcNumber: data.rcNumber,
      marketAuthorisationHolder: data.marketAuthorisationHolder,
    });
  }
  console.log(`  created [${data.role}]: ${data.email}`);
  return user;
};

const getProfile = async (userId: string) => {
  const [profile] = await db.select().from(applicantProfiles)
    .where(eq(applicantProfiles.userId, userId)).limit(1);
  return profile;
};

const createApplication = async (
  applicantUserId: string,
  applicantProfileId: string,
  overrides: {
    productName: string; strength: string; dosageForm: string;
    currentStatus: typeof applications.$inferInsert["currentStatus"];
    reviewStatus?: typeof applications.$inferInsert["reviewStatus"];
    finalDecision?: typeof applications.$inferInsert["finalDecision"];
    submittedAt?: Date; finalizedAt?: Date;
    companyName?: string;
  },
) => {
  const company = overrides.companyName ?? "PharmaCo Nigeria Ltd";
  const [app] = await db.insert(applications).values({
    applicantUserId, applicantProfileId,
    applicationNo: makeApplicationNumber(),
    productName: overrides.productName,
    strength: overrides.strength,
    dosageForm: overrides.dosageForm,
    strengthAndDosageForm: `${overrides.strength} ${overrides.dosageForm}`,
    currentStatus: overrides.currentStatus,
    reviewStatus: overrides.reviewStatus ?? "Pending",
    finalDecision: overrides.finalDecision,
    submittedAt: overrides.submittedAt,
    finalizedAt: overrides.finalizedAt,
  }).returning();

  const [checklist] = await db.insert(beChecklists).values({
    applicationId: app.id,
    hasReadGeneralInstructions: true,
    certifiedInformationIsTrue: true,
    signedOnBehalfOf: company,
    signatoryNameAndTitle: "Director of Regulatory Affairs",
    certificationDate: "2024-11-01",
    studyProtocolNumber: `SP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    studyTitle: `Bioequivalence Study of ${overrides.productName} ${overrides.strength} vs Reference`,
    bioanalyticalStudyStartDate: "2024-06-01",
    bioanalyticalStudyEndDate: "2024-07-15",
    clinicalStudySiteName: "Lagos Clinical Research Centre",
    clinicalStudySiteAddress: "12 Marina Road, Lagos Island, Lagos",
    bioanalyticalStudySiteName: "Abuja Bioanalytical Laboratory",
    bioanalyticalStudySiteAddress: "Plot 44, Central Business District, Abuja",
    ethicsCommitteeName: "National Health Research Ethics Committee (NHREC)",
    ethicsCommitteeAddress: "Federal Ministry of Health, Abuja",
    studyProtocolApprovalDate: "2024-04-10",
    approvedStudyProtocolNumberAndVersion: `NHREC/01/01/2024-${Math.floor(Math.random() * 999)}`,
    informedConsentApprovalDate: "2024-04-15",
    testProductName: overrides.productName,
    testProductStrength: overrides.strength,
    testProductDosageForm: overrides.dosageForm,
    testProductBatchNumber: `BN-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    testProductBatchSize: "100,000 units",
    testProductManufactureDate: "2024-01-15",
    testProductExpiryDate: "2026-01-14",
    apiManufacturingSiteNameAndAddress: "API Pharma GmbH, Frankfurt, Germany",
    testProductManufacturingSiteNameAndAddress: `${company}, Km 12 Lagos-Ibadan Expressway, Ogun State`,
    testProductSameStrengthAsRegistrationProduct: true,
    testProductSameCompositionAsRegistrationProduct: true,
    referenceProductName: `${overrides.productName} (Innovator)`,
    referenceProductStrength: overrides.strength,
    referenceProductDosageForm: overrides.dosageForm,
    referenceProductBatchNumber: `REF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    referenceProductExpiryDate: "2025-12-31",
    referenceProductSourceCountry: "United Kingdom",
    referenceProductManufacturingSiteNameAndAddress: "Innovator Pharma Ltd, London, UK",
    referenceProductSameAsWhoComparator: true,
    biowaiverOfAdditionalStrengthApplicable: false,
  }).returning();

  await db.insert(beStudyPeriods).values(
    DEFAULT_STUDY_PERIODS.map((label, i) => ({
      checklistId: checklist.id, applicationId: app.id,
      periodLabel: label, sortOrder: i + 1,
      startDate: i === 0 ? "2024-06-01" : "2024-06-22",
      endDate: i === 0 ? "2024-06-21" : "2024-07-12",
    })),
  );

  await db.insert(beSummaryResults).values(
    DEFAULT_SUMMARY_RESULTS.map((param, i) => ({
      checklistId: checklist.id, applicationId: app.id,
      parameter: param, sortOrder: i + 1,
      logarithmicTransformedData: "Yes",
      testGeometricMean: (Math.random() * 500 + 200).toFixed(2),
      referenceGeometricMean: (Math.random() * 500 + 200).toFixed(2),
      percentageRatioGeometricMeans: (Math.random() * 20 + 90).toFixed(2),
      confidenceIntervalLower: (Math.random() * 5 + 85).toFixed(2),
      confidenceIntervalUpper: (Math.random() * 5 + 110).toFixed(2),
      intraSubjectCoefficientVariationIscv: (Math.random() * 15 + 10).toFixed(2),
    })),
  );

  await db.insert(sectionBDocumentReferences).values(
    SECTION_B_DOCUMENTS.map((doc, i) => ({
      checklistId: checklist.id, applicationId: app.id,
      itemNumber: doc.itemNumber, documentTitle: doc.documentTitle,
      nameOfDocumentAndLocation: `Module 5, Section 5.3.${i + 1}, Appendix ${String.fromCharCode(65 + i)}, Page ${(i + 1) * 12}`,
      isApplicable: doc.itemNumber !== 5 && doc.itemNumber !== 6,
      sortOrder: i + 1,
    })),
  );

  return app;
};

// ─── Seed: super admin ────────────────────────────────────────────────────────

const seedSuperAdmin = async () => {
  const [existing] = await db.select().from(users).where(eq(users.email, env.SUPER_ADMIN_EMAIL)).limit(1);
  if (existing) { console.log(`  already exists: ${env.SUPER_ADMIN_EMAIL}`); return existing; }
  const passwordHash = await bcrypt.hash(env.SUPER_ADMIN_PASSWORD, 12);
  const [user] = await db.insert(users).values({
    fullName: env.SUPER_ADMIN_FULL_NAME, email: env.SUPER_ADMIN_EMAIL, passwordHash, role: "super_admin",
  }).returning();
  console.log(`  created [super_admin]: ${env.SUPER_ADMIN_EMAIL}`);
  return user;
};

// ─── Seed: lookups ────────────────────────────────────────────────────────────

const seedBaseLookups = async (createdByUserId: string) => {
  for (const d of FINAL_DECISIONS) await upsertLookup({ type: "final_decision", label: d, createdByUserId });
  for (const s of REVIEW_STATUSES) await upsertLookup({ type: "review_status", label: s, createdByUserId });
  for (const b of BCS_CLASSES) await upsertLookup({ type: "bcs_class", label: b, createdByUserId });
  for (const t of LOOKUP_TYPES) await upsertLookup({ type: "lookup_type", label: t, value: t, createdByUserId });

  for (const c of ["Antibiotics", "Antihypertensives", "Antidiabetics", "Analgesics",
    "Antiretrovirals", "Antimalarials", "Antifungals", "Anticoagulants",
    "Proton Pump Inhibitors", "Statins", "Antiepileptics", "Antipsychotics",
    "Antidepressants", "Bronchodilators", "ACE Inhibitors", "Beta Blockers"]) {
    await upsertLookup({ type: "pharmacological_class", label: c, createdByUserId });
  }

  for (const f of ["Tablet", "Capsule", "Oral Solution", "Suspension", "Injection", "Cream", "Ointment", "Syrup", "Powder for Reconstitution"]) {
    await upsertLookup({ type: "dosage_form", label: f, createdByUserId });
  }

  for (const d of ["Warfarin", "Digoxin", "Lithium", "Phenytoin", "Cyclosporine",
    "Tacrolimus", "Theophylline", "Carbamazepine", "Valproic Acid", "Methotrexate"]) {
    await upsertLookup({ type: "nti_drug", label: d, createdByUserId });
  }
};

const seedAssessorsFromWorkbook = async (createdByUserId: string) => {
  const names = extractAssessorNames();
  const usedEmails = new Set<string>();
  let count = 0;

  for (const fullName of names) {
    let email = `${slugEmail(fullName)}@assessors.nafdac.gov.ng`;
    let suffix = 2;
    while (usedEmails.has(email)) {
      email = `${slugEmail(fullName)}.${suffix}@assessors.nafdac.gov.ng`;
      suffix++;
    }
    usedEmails.add(email);

    const user = await upsertUser({
      fullName, email,
      password: env.ASSESSOR_DEFAULT_PASSWORD,
      role: "assessor",
    });

    await upsertLookup({
      type: "assessor_reference",
      label: fullName,
      value: user.id,
      metadata: { source: "BE_Assessment_Tracking_Template.xlsx", generatedEmail: email },
      createdByUserId,
    });
    count++;
  }
  console.log(`  imported ${count} assessors from workbook`);
};

const seedClassificationReferences = async (createdByUserId: string) => {
  const bcsRows = extractBcsRows();
  const ntiRows = extractNtiRows();

  for (const row of bcsRows) {
    await upsertLookup({
      type: "product_classification_reference",
      label: row.productName, value: row.productName,
      metadata: { source: "BE_Assessment_Tracking_Template.xlsx", bcsClass: row.bcsClass, rawBcsClass: row.rawBcsClass },
      createdByUserId,
    });
  }

  for (const name of ntiRows) {
    await upsertLookup({
      type: "nti_drug", label: name, value: name,
      metadata: { source: "BE_Assessment_Tracking_Template.xlsx" },
      createdByUserId,
    });
  }

  console.log(`  imported ${bcsRows.length} BCS references, ${ntiRows.length} NTI references`);
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const main = async () => {

  // ── Users ──────────────────────────────────────────────────────────────────
  console.log("\n── Seeding users ──────────────────────────────────────");
  const superAdmin = await seedSuperAdmin();
  const admin = await upsertUser({ fullName: "Admin User", email: "admin@beassessment.com", password: "Admin1234!", role: "admin" });
  const admin2 = await upsertUser({ fullName: "Dr. Fatima Bello", email: "fatima.bello@beassessment.com", password: "Admin1234!", role: "admin" });

  // Named assessors (in addition to workbook assessors)
  const assessor1 = await upsertUser({ fullName: "Dr. Jane Assessor", email: "assessor@beassessment.com", password: "Assess1234!", role: "assessor" });
  const assessor2 = await upsertUser({ fullName: "Dr. Chukwuemeka Nwosu", email: "c.nwosu@assessors.nafdac.gov.ng", password: "Assess1234!", role: "assessor" });
  const assessor3 = await upsertUser({ fullName: "Dr. Aisha Musa", email: "a.musa@assessors.nafdac.gov.ng", password: "Assess1234!", role: "assessor" });

  // Import all assessors from workbook
  await seedAssessorsFromWorkbook(superAdmin.id);

  // Multiple applicants
  const applicant1 = await upsertUser({
    fullName: "Emeka Obi", email: "applicant@beassessment.com", password: "Apply1234!", role: "applicant",
    companyName: "PharmaCo Nigeria Ltd", contactPersonName: "Emeka Obi",
    companyAddress: "Km 12 Lagos-Ibadan Expressway, Ogun State", rcNumber: "RC-123456",
    companyPhone: "08012345678", companyEmail: "info@pharmaconigeria.com",
    marketAuthorisationHolder: "PharmaCo Nigeria Ltd",
  });

  const applicant2 = await upsertUser({
    fullName: "Ngozi Adeyemi", email: "ngozi.adeyemi@meditechpharma.com", password: "Apply1234!", role: "applicant",
    companyName: "MediTech Pharma Ltd", contactPersonName: "Ngozi Adeyemi",
    companyAddress: "Plot 15, Adeola Odeku Street, Victoria Island, Lagos", rcNumber: "RC-789012",
    companyPhone: "08023456789", companyEmail: "regulatory@meditechpharma.com",
    marketAuthorisationHolder: "MediTech Pharma Ltd",
  });

  const applicant3 = await upsertUser({
    fullName: "Ibrahim Suleiman", email: "ibrahim.suleiman@northernpharma.com", password: "Apply1234!", role: "applicant",
    companyName: "Northern Pharma Industries", contactPersonName: "Ibrahim Suleiman",
    companyAddress: "No. 5 Ahmadu Bello Way, Kaduna", rcNumber: "RC-345678",
    companyPhone: "08034567890", companyEmail: "info@northernpharma.com",
    marketAuthorisationHolder: "Northern Pharma Industries",
  });

  const applicant4 = await upsertUser({
    fullName: "Chidinma Eze", email: "chidinma.eze@eastpharma.com", password: "Apply1234!", role: "applicant",
    companyName: "EastPharma Nigeria Ltd", contactPersonName: "Chidinma Eze",
    companyAddress: "3 Trans-Ekulu Road, Enugu", rcNumber: "RC-567890",
    companyPhone: "08045678901", companyEmail: "regulatory@eastpharma.com",
    marketAuthorisationHolder: "EastPharma Nigeria Ltd",
  });

  const p1 = await getProfile(applicant1.id);
  const p2 = await getProfile(applicant2.id);
  const p3 = await getProfile(applicant3.id);
  const p4 = await getProfile(applicant4.id);

  // ── Lookups ────────────────────────────────────────────────────────────────
  console.log("\n── Seeding lookups ────────────────────────────────────");
  await seedBaseLookups(superAdmin.id);
  await seedClassificationReferences(superAdmin.id);

  // ── Applications ───────────────────────────────────────────────────────────
  console.log("\n── Seeding applications ───────────────────────────────");

  // ── Applicant 1: PharmaCo Nigeria (6 applications) ────────────────────────

  // 1. Draft
  await createApplication(applicant1.id, p1.id, {
    productName: "Metformin", strength: "500mg", dosageForm: "Tablet",
    currentStatus: "draft", companyName: "PharmaCo Nigeria Ltd",
  });
  console.log("  [PharmaCo] Metformin 500mg → draft");

  // 2. Submitted
  await createApplication(applicant1.id, p1.id, {
    productName: "Amlodipine", strength: "5mg", dosageForm: "Tablet",
    currentStatus: "submitted", reviewStatus: "Pending", submittedAt: new Date(),
    companyName: "PharmaCo Nigeria Ltd",
  });
  console.log("  [PharmaCo] Amlodipine 5mg → submitted");

  // 3. Under screening
  const screening1 = await createApplication(applicant1.id, p1.id, {
    productName: "Lisinopril", strength: "10mg", dosageForm: "Tablet",
    currentStatus: "under_admin_screening", reviewStatus: "Ongoing", submittedAt: new Date(),
    companyName: "PharmaCo Nigeria Ltd",
  });
  await db.insert(internalNotes).values({
    applicationId: screening1.id, authorUserId: admin.id,
    note: "Checklist reviewed. Section B items 1-4 complete. Checking study protocol.",
  });
  console.log("  [PharmaCo] Lisinopril 10mg → under_admin_screening");

  // 4. Compliance directive issued
  const cdApp1 = await createApplication(applicant1.id, p1.id, {
    productName: "Atorvastatin", strength: "20mg", dosageForm: "Tablet",
    currentStatus: "compliance_directive_issued", reviewStatus: "Ongoing", submittedAt: new Date(),
    companyName: "PharmaCo Nigeria Ltd",
  });
  await db.insert(complianceDirectives).values({
    applicationId: cdApp1.id,
    directiveNumber: `CD-${Date.now()}-001`,
    title: "Incomplete Bioanalytical Study Information",
    issuedByUserId: admin.id, issuedToUserId: applicant1.id,
    affectedSections: ["A.6 — Bioanalytical facility", "B.9 — Bioanalytical method validation report"],
    directiveMessage: "The bioanalytical study site address is incomplete. The bioanalytical method validation report location in Section B item 9 is missing.",
    requiredCorrections: "1. Provide complete bioanalytical facility address. 2. State the exact location of the bioanalytical method validation report.",
    dueDate: "2025-03-31", status: "open", issuedAt: new Date(),
  });
  await db.insert(notifications).values({
    applicationId: cdApp1.id, userId: applicant1.id,
    title: "Compliance Directive Issued",
    message: `A compliance directive has been issued for your application ${cdApp1.applicationNo}.`,
  });
  console.log("  [PharmaCo] Atorvastatin 20mg → compliance_directive_issued");

  // 5. Classified
  const classified1 = await createApplication(applicant1.id, p1.id, {
    productName: "Omeprazole", strength: "20mg", dosageForm: "Capsule",
    currentStatus: "classified", reviewStatus: "Ongoing", submittedAt: new Date(),
    companyName: "PharmaCo Nigeria Ltd",
  });
  await db.insert(productClassifications).values({
    applicationId: classified1.id,
    therapeuticIndexClass: "Non-NTI", bcsClass: "Class II",
    pharmacologicalClass: "Proton Pump Inhibitors", localOrForeign: "Foreign",
    classifiedByUserId: admin.id, classifiedAt: new Date(),
  });
  console.log("  [PharmaCo] Omeprazole 20mg → classified");

  // 6. Finalized — Approved
  const finalized1 = await createApplication(applicant1.id, p1.id, {
    productName: "Amoxicillin", strength: "500mg", dosageForm: "Capsule",
    currentStatus: "finalized", reviewStatus: "Completed",
    finalDecision: "Approved", submittedAt: new Date(), finalizedAt: new Date(),
    companyName: "PharmaCo Nigeria Ltd",
  });
  await db.update(applications).set({
    finalDecisionDate: new Date().toISOString().split("T")[0],
    finalDecisionNote: "All BE criteria met. Study conducted per ICH E6 GCP guidelines.",
    finalDecisionBy: admin.id,
  }).where(eq(applications.id, finalized1.id));
  await db.insert(finalDecisions).values({
    applicationId: finalized1.id, decision: "Approved",
    decisionNote: "All BE criteria met.", decidedByUserId: admin.id, decidedAt: new Date(),
  });
  await db.insert(notifications).values({
    applicationId: finalized1.id, userId: applicant1.id,
    title: "Final Decision: Approved",
    message: `Your application ${finalized1.applicationNo} has been APPROVED.`,
  });
  console.log("  [PharmaCo] Amoxicillin 500mg → finalized (Approved)");

  // ── Applicant 2: MediTech Pharma (5 applications) ─────────────────────────

  // 7. First assessment ongoing
  const firstAssmt = await createApplication(applicant2.id, p2.id, {
    productName: "Azithromycin", strength: "250mg", dosageForm: "Tablet",
    currentStatus: "first_assessment_ongoing", reviewStatus: "Ongoing", submittedAt: new Date(),
    companyName: "MediTech Pharma Ltd",
  });
  await db.insert(productClassifications).values({
    applicationId: firstAssmt.id,
    therapeuticIndexClass: "Non-NTI", bcsClass: "Class II",
    pharmacologicalClass: "Antibiotics", localOrForeign: "Local",
    classifiedByUserId: admin.id, classifiedAt: new Date(),
  });
  const [asgn1] = await db.insert(assessorAssignments).values({
    applicationId: firstAssmt.id, assessorUserId: assessor1.id,
    assessmentStage: "first_assessment", assignedByUserId: admin.id,
    assignedAt: new Date(), dueDate: "2025-04-15",
    assignmentNote: "Review PK parameters carefully.",
    status: "ongoing", startedAt: new Date(),
  }).returning();
  await db.insert(notifications).values({
    applicationId: firstAssmt.id, userId: assessor1.id,
    title: "Application Assigned", message: `You have been assigned as first assessor for ${firstAssmt.applicationNo}.`,
  });
  console.log("  [MediTech] Azithromycin 250mg → first_assessment_ongoing");

  // 8. Awaiting final decision
  const awaitingDecision = await createApplication(applicant2.id, p2.id, {
    productName: "Ciprofloxacin", strength: "500mg", dosageForm: "Tablet",
    currentStatus: "awaiting_final_decision", reviewStatus: "Ongoing", submittedAt: new Date(),
    companyName: "MediTech Pharma Ltd",
  });
  await db.insert(productClassifications).values({
    applicationId: awaitingDecision.id,
    therapeuticIndexClass: "Non-NTI", bcsClass: "Class I",
    pharmacologicalClass: "Antibiotics", localOrForeign: "Foreign",
    classifiedByUserId: admin.id, classifiedAt: new Date(),
  });
  const [asgn2] = await db.insert(assessorAssignments).values({
    applicationId: awaitingDecision.id, assessorUserId: assessor2.id,
    assessmentStage: "first_assessment", assignedByUserId: admin.id,
    assignedAt: new Date(), status: "completed",
    startedAt: new Date(), completedAt: new Date(),
  }).returning();
  await db.insert(assessorComments).values({
    applicationId: awaitingDecision.id, assessorAssignmentId: asgn2.id,
    assessorUserId: assessor2.id, assessmentStage: "first_assessment",
    recommendation: "recommend_approval",
    comment: "The BE study meets all required criteria. 90% CI for AUC0-t, AUC0-∞ and Cmax fall within 80.00–125.00%. Recommend approval.",
    submittedAt: new Date(),
  });
  console.log("  [MediTech] Ciprofloxacin 500mg → awaiting_final_decision");

  // 9. First assessment reverted (needs second assessor)
  const reverted = await createApplication(applicant2.id, p2.id, {
    productName: "Losartan", strength: "50mg", dosageForm: "Tablet",
    currentStatus: "first_assessment_reverted", reviewStatus: "Ongoing", submittedAt: new Date(),
    companyName: "MediTech Pharma Ltd",
  });
  await db.insert(productClassifications).values({
    applicationId: reverted.id,
    therapeuticIndexClass: "Non-NTI", bcsClass: "Class III",
    pharmacologicalClass: "Antihypertensives", localOrForeign: "Foreign",
    classifiedByUserId: admin.id, classifiedAt: new Date(),
  });
  const [asgn3] = await db.insert(assessorAssignments).values({
    applicationId: reverted.id, assessorUserId: assessor1.id,
    assessmentStage: "first_assessment", assignedByUserId: admin.id,
    assignedAt: new Date(), status: "reverted",
    startedAt: new Date(), revertedAt: new Date(),
  }).returning();
  await db.insert(assessorComments).values({
    applicationId: reverted.id, assessorAssignmentId: asgn3.id,
    assessorUserId: assessor1.id, assessmentStage: "first_assessment",
    recommendation: "requires_second_assessment",
    comment: "The dissolution data requires further expert review. Recommend second assessment.",
    submittedAt: new Date(),
  });
  console.log("  [MediTech] Losartan 50mg → first_assessment_reverted");

  // 10. Second assessment ongoing
  const secondAssmt = await createApplication(applicant2.id, p2.id, {
    productName: "Metoprolol", strength: "100mg", dosageForm: "Tablet",
    currentStatus: "second_assessment_ongoing", reviewStatus: "Ongoing", submittedAt: new Date(),
    companyName: "MediTech Pharma Ltd",
  });
  await db.insert(productClassifications).values({
    applicationId: secondAssmt.id,
    therapeuticIndexClass: "Non-NTI", bcsClass: "Class I",
    pharmacologicalClass: "Beta Blockers", localOrForeign: "Local",
    classifiedByUserId: admin.id, classifiedAt: new Date(),
  });
  const [asgn4a] = await db.insert(assessorAssignments).values({
    applicationId: secondAssmt.id, assessorUserId: assessor1.id,
    assessmentStage: "first_assessment", assignedByUserId: admin.id,
    assignedAt: new Date(), status: "reverted",
    startedAt: new Date(), revertedAt: new Date(),
  }).returning();
  await db.insert(assessorComments).values({
    applicationId: secondAssmt.id, assessorAssignmentId: asgn4a.id,
    assessorUserId: assessor1.id, assessmentStage: "first_assessment",
    recommendation: "requires_second_assessment",
    comment: "Requires second opinion on the statistical analysis.",
    submittedAt: new Date(),
  });
  await db.insert(assessorAssignments).values({
    applicationId: secondAssmt.id, assessorUserId: assessor2.id,
    assessmentStage: "second_assessment", assignedByUserId: admin.id,
    assignedAt: new Date(), dueDate: "2025-04-30",
    reasonForSecondAssessment: "First assessor requested second opinion on statistical analysis.",
    status: "ongoing", startedAt: new Date(),
  });
  console.log("  [MediTech] Metoprolol 100mg → second_assessment_ongoing");

  // 11. Finalized — Rejected
  const rejected = await createApplication(applicant2.id, p2.id, {
    productName: "Warfarin", strength: "5mg", dosageForm: "Tablet",
    currentStatus: "finalized", reviewStatus: "Completed",
    finalDecision: "Rejected", submittedAt: new Date(), finalizedAt: new Date(),
    companyName: "MediTech Pharma Ltd",
  });
  await db.update(applications).set({
    finalDecisionDate: new Date().toISOString().split("T")[0],
    finalDecisionNote: "The 90% CI for Cmax (74.2–118.3%) falls outside the 80.00–125.00% acceptance criteria.",
    finalDecisionBy: admin.id,
  }).where(eq(applications.id, rejected.id));
  await db.insert(finalDecisions).values({
    applicationId: rejected.id, decision: "Rejected",
    decisionNote: "90% CI for Cmax outside acceptance criteria.",
    decidedByUserId: admin.id, decidedAt: new Date(),
  });
  console.log("  [MediTech] Warfarin 5mg → finalized (Rejected)");

  // ── Applicant 3: Northern Pharma (4 applications) ─────────────────────────

  // 12. Draft
  await createApplication(applicant3.id, p3.id, {
    productName: "Glibenclamide", strength: "5mg", dosageForm: "Tablet",
    currentStatus: "draft", companyName: "Northern Pharma Industries",
  });
  console.log("  [Northern] Glibenclamide 5mg → draft");

  // 13. Submitted
  await createApplication(applicant3.id, p3.id, {
    productName: "Chloroquine", strength: "250mg", dosageForm: "Tablet",
    currentStatus: "submitted", reviewStatus: "Pending", submittedAt: new Date(),
    companyName: "Northern Pharma Industries",
  });
  console.log("  [Northern] Chloroquine 250mg → submitted");

  // 14. Compliance directive — responded
  const cdApp2 = await createApplication(applicant3.id, p3.id, {
    productName: "Artemether", strength: "20mg", dosageForm: "Tablet",
    currentStatus: "resubmitted_after_compliance_directive", reviewStatus: "Pending", submittedAt: new Date(),
    companyName: "Northern Pharma Industries",
  });
  const [cd2] = await db.insert(complianceDirectives).values({
    applicationId: cdApp2.id,
    directiveNumber: `CD-${Date.now() + 1}-002`,
    title: "Missing Clinical Study Report Details",
    issuedByUserId: admin2.id, issuedToUserId: applicant3.id,
    affectedSections: ["A.5 — Clinical study facility", "B.7 — Clinical study report"],
    directiveMessage: "The clinical study facility address is incomplete and the clinical study report location is not specified.",
    requiredCorrections: "Provide full clinical study facility address and specify the location of the clinical study report in the dossier.",
    dueDate: "2025-03-15", status: "responded", issuedAt: new Date(),
  }).returning();
  await db.insert(notifications).values({
    applicationId: cdApp2.id, userId: applicant3.id,
    title: "Compliance Directive Issued",
    message: `A compliance directive has been issued for your application ${cdApp2.applicationNo}.`,
  });
  console.log("  [Northern] Artemether 20mg → resubmitted_after_compliance_directive");

  // 15. Finalized — Approved
  const finalized3 = await createApplication(applicant3.id, p3.id, {
    productName: "Cotrimoxazole", strength: "480mg", dosageForm: "Tablet",
    currentStatus: "finalized", reviewStatus: "Completed",
    finalDecision: "Approved", submittedAt: new Date(), finalizedAt: new Date(),
    companyName: "Northern Pharma Industries",
  });
  await db.update(applications).set({
    finalDecisionDate: new Date().toISOString().split("T")[0],
    finalDecisionNote: "BE criteria met. Approved.",
    finalDecisionBy: admin2.id,
  }).where(eq(applications.id, finalized3.id));
  await db.insert(finalDecisions).values({
    applicationId: finalized3.id, decision: "Approved",
    decisionNote: "BE criteria met.", decidedByUserId: admin2.id, decidedAt: new Date(),
  });
  console.log("  [Northern] Cotrimoxazole 480mg → finalized (Approved)");

  // ── Applicant 4: EastPharma (3 applications) ──────────────────────────────

  // 16. Under screening
  const screening4 = await createApplication(applicant4.id, p4.id, {
    productName: "Fluconazole", strength: "150mg", dosageForm: "Capsule",
    currentStatus: "under_admin_screening", reviewStatus: "Ongoing", submittedAt: new Date(),
    companyName: "EastPharma Nigeria Ltd",
  });
  await db.insert(internalNotes).values({
    applicationId: screening4.id, authorUserId: admin2.id,
    note: "Initial review started. Checking Section B completeness.",
  });
  console.log("  [EastPharma] Fluconazole 150mg → under_admin_screening");

  // 17. Assigned first assessor
  const assigned4 = await createApplication(applicant4.id, p4.id, {
    productName: "Ibuprofen", strength: "400mg", dosageForm: "Tablet",
    currentStatus: "assigned_first_assessor", reviewStatus: "Ongoing", submittedAt: new Date(),
    companyName: "EastPharma Nigeria Ltd",
  });
  await db.insert(productClassifications).values({
    applicationId: assigned4.id,
    therapeuticIndexClass: "Non-NTI", bcsClass: "Class II",
    pharmacologicalClass: "Analgesics", localOrForeign: "Local",
    classifiedByUserId: admin2.id, classifiedAt: new Date(),
  });
  await db.insert(assessorAssignments).values({
    applicationId: assigned4.id, assessorUserId: assessor3.id,
    assessmentStage: "first_assessment", assignedByUserId: admin2.id,
    assignedAt: new Date(), dueDate: "2025-05-01",
    status: "assigned",
  });
  await db.insert(notifications).values({
    applicationId: assigned4.id, userId: assessor3.id,
    title: "Application Assigned", message: `You have been assigned as first assessor for ${assigned4.applicationNo}.`,
  });
  console.log("  [EastPharma] Ibuprofen 400mg → assigned_first_assessor");

  // 18. Draft
  await createApplication(applicant4.id, p4.id, {
    productName: "Doxycycline", strength: "100mg", dosageForm: "Capsule",
    currentStatus: "draft", companyName: "EastPharma Nigeria Ltd",
  });
  console.log("  [EastPharma] Doxycycline 100mg → draft");

  // ── Audit logs ─────────────────────────────────────────────────────────────
  await db.insert(auditLogs).values([
    { applicationId: screening1.id, actorUserId: admin.id, action: "screening_started", entityType: "application", entityId: screening1.id, metadata: {} },
    { applicationId: classified1.id, actorUserId: admin.id, action: "product_classified", entityType: "product_classification", entityId: classified1.id, metadata: {} },
    { applicationId: firstAssmt.id, actorUserId: assessor1.id, action: "assessor_started_review", entityType: "assessor_assignment", entityId: asgn1.id, metadata: {} },
    { applicationId: awaitingDecision.id, actorUserId: assessor2.id, action: "assessment_submitted", entityType: "assessor_assignment", entityId: asgn2.id, metadata: {} },
    { applicationId: finalized1.id, actorUserId: admin.id, action: "final_decision_entered", entityType: "final_decision", entityId: finalized1.id, metadata: { decision: "Approved" } },
    { applicationId: rejected.id, actorUserId: admin.id, action: "final_decision_entered", entityType: "final_decision", entityId: rejected.id, metadata: { decision: "Rejected" } },
    { applicationId: reverted.id, actorUserId: assessor1.id, action: "assessment_reverted", entityType: "assessor_assignment", entityId: asgn3.id, metadata: {} },
  ]);

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log("\n── Seed completed ✓ ───────────────────────────────────");
  console.log("\nTest accounts:");
  console.log("  Super Admin   → superadmin@example.com          / ChangeMe123!");
  console.log("  Admin 1       → admin@beassessment.com           / Admin1234!");
  console.log("  Admin 2       → fatima.bello@beassessment.com    / Admin1234!");
  console.log("  Assessor 1    → assessor@beassessment.com        / Assess1234!");
  console.log("  Assessor 2    → c.nwosu@assessors.nafdac.gov.ng  / Assess1234!");
  console.log("  Assessor 3    → a.musa@assessors.nafdac.gov.ng   / Assess1234!");
  console.log(`  Excel assessors → @assessors.nafdac.gov.ng       / ${env.ASSESSOR_DEFAULT_PASSWORD}`);
  console.log("  Applicant 1   → applicant@beassessment.com       / Apply1234!  (PharmaCo Nigeria)");
  console.log("  Applicant 2   → ngozi.adeyemi@meditechpharma.com / Apply1234!  (MediTech Pharma)");
  console.log("  Applicant 3   → ibrahim.suleiman@northernpharma.com / Apply1234! (Northern Pharma)");
  console.log("  Applicant 4   → chidinma.eze@eastpharma.com      / Apply1234!  (EastPharma Nigeria)");
  console.log("\n18 applications seeded across 4 applicants covering all workflow stages.");
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
