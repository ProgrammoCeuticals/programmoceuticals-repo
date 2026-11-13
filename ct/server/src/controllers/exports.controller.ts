import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { and, desc, eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "../db/client.js";
import {
  applicantProfiles,
  applications,
  assessorAssignments,
  beChecklists,
  beSummaryResults,
  beStudyPeriods,
  complianceDirectives,
  finalDecisions,
  productClassifications,
  sectionBDocumentReferences,
  users,
} from "../db/schema.js";
import { asyncHandler } from "../utils/http.js";

// ─── Registry Export ────────────────────────────────────────────────────────

const buildRegistryRows = async (req: Request) => {
  const filters: ReturnType<typeof eq>[] = [];
  const { ilike } = await import("drizzle-orm");

  if (req.query.productName)
    filters.push(ilike(applications.productName, `%${req.query.productName}%`));
  if (req.query.applicationNo)
    filters.push(ilike(applications.applicationNo, `%${req.query.applicationNo}%`));
  if (req.query.reviewStatus)
    filters.push(eq(applications.reviewStatus, req.query.reviewStatus as "Pending" | "Ongoing" | "Completed"));
  if (req.query.finalDecision)
    filters.push(eq(applications.finalDecision, req.query.finalDecision as "CD" | "Approved" | "Rejected"));

  const rows = await db
    .select()
    .from(applications)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(applications.updatedAt));

  // Enrich with classification and assignments
  const enriched = await Promise.all(
    rows.map(async (app, index) => {
      const [profile] = await db
        .select()
        .from(applicantProfiles)
        .where(eq(applicantProfiles.id, app.applicantProfileId!))
        .limit(1);

      const [classification] = await db
        .select()
        .from(productClassifications)
        .where(eq(productClassifications.applicationId, app.id))
        .limit(1);

      const assignments = await db
        .select()
        .from(assessorAssignments)
        .where(eq(assessorAssignments.applicationId, app.id))
        .orderBy(assessorAssignments.assignedAt);

      const firstAssignment = assignments.find((a) => a.assessmentStage === "first_assessment");
      const secondAssignment = assignments.find((a) => a.assessmentStage === "second_assessment");

      const [firstAssessor] = firstAssignment
        ? await db.select({ fullName: users.fullName }).from(users).where(eq(users.id, firstAssignment.assessorUserId)).limit(1)
        : [null];

      const [secondAssessor] = secondAssignment
        ? await db.select({ fullName: users.fullName }).from(users).where(eq(users.id, secondAssignment.assessorUserId)).limit(1)
        : [null];

      return {
        sn: index + 1,
        applicantCompany: profile?.companyName ?? "",
        productName: app.productName,
        strengthAndDosageForm: app.strengthAndDosageForm ?? "",
        applicationNo: app.applicationNo,
        firstAssessor: firstAssessor?.fullName ?? "",
        dateAssigned: firstAssignment?.assignedAt ? new Date(firstAssignment.assignedAt).toLocaleDateString() : "",
        dateReverted: firstAssignment?.revertedAt ? new Date(firstAssignment.revertedAt).toLocaleDateString() : "",
        secondAssessor: secondAssessor?.fullName ?? "",
        reviewStatus: app.reviewStatus,
        finalDecision: app.finalDecision ?? "",
        finalDecisionDate: app.finalDecisionDate ?? "",
        therapeuticIndexClass: classification?.therapeuticIndexClass ?? "",
        bcsClass: classification?.bcsClass ?? "",
        pharmacologicalClass: classification?.pharmacologicalClass ?? "",
        localOrForeign: classification?.localOrForeign ?? "",
        currentStatus: app.currentStatus,
        lastUpdated: new Date(app.updatedAt).toLocaleDateString(),
      };
    }),
  );

  return enriched;
};

export const exportRegistryExcel = asyncHandler(async (req: Request, res: Response) => {
  const rows = await buildRegistryRows(req);

  const headers = [
    "S/N", "Applicant / Company", "Product Name", "Strength & Dosage Form",
    "Application No.", "First Assessor", "Date Assigned", "Date Reverted",
    "2nd Assessor", "Status of Review", "Final Decision", "Date of Final Decision",
    "Therapeutic Index Class", "BCS Class", "Pharmacological Class",
    "Local / Foreign", "Current Workflow Status", "Last Updated",
  ];

  const escapeHtml = (value: string | number) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const values = rows.map((r) => [
    r.sn, r.applicantCompany, r.productName, r.strengthAndDosageForm,
    r.applicationNo, r.firstAssessor, r.dateAssigned, r.dateReverted,
    r.secondAssessor, r.reviewStatus, r.finalDecision, r.finalDecisionDate,
    r.therapeuticIndexClass, r.bcsClass, r.pharmacologicalClass,
    r.localOrForeign, r.currentStatus, r.lastUpdated,
  ]);

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    table { border-collapse: collapse; font-family: Arial, sans-serif; font-size: 12px; }
    th { background: #1f4e79; color: #fff; font-weight: 700; }
    th, td { border: 1px solid #b7c9e2; padding: 6px 8px; mso-number-format:"\\@"; }
    tr:nth-child(even) td { background: #d9e1f2; }
  </style>
</head>
<body>
  <table>
    <thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>
    <tbody>${values
      .map((row) => `<tr>${row.map((value) => `<td>${escapeHtml(value)}</td>`).join("")}</tr>`)
      .join("")}</tbody>
  </table>
</body>
</html>`;

  res.setHeader("Content-Type", "application/vnd.ms-excel; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="BE_Registry_${Date.now()}.xls"`);
  res.send(html);
});

export const exportRegistryCSV = asyncHandler(async (req: Request, res: Response) => {
  const rows = await buildRegistryRows(req);

  const headers = [
    "S/N", "Applicant / Company", "Product Name", "Strength & Dosage Form",
    "Application No.", "First Assessor", "Date Assigned", "Date Reverted",
    "2nd Assessor", "Status of Review", "Final Decision", "Date of Final Decision",
    "Therapeutic Index Class", "BCS Class", "Pharmacological Class",
    "Local / Foreign", "Current Workflow Status", "Last Updated",
  ];

  const escape = (val: string | number) => `"${String(val).replace(/"/g, '""')}"`;

  const lines = [
    headers.map(escape).join(","),
    ...rows.map((r) =>
      [
        r.sn, r.applicantCompany, r.productName, r.strengthAndDosageForm,
        r.applicationNo, r.firstAssessor, r.dateAssigned, r.dateReverted,
        r.secondAssessor, r.reviewStatus, r.finalDecision, r.finalDecisionDate,
        r.therapeuticIndexClass, r.bcsClass, r.pharmacologicalClass,
        r.localOrForeign, r.currentStatus, r.lastUpdated,
      ]
        .map(escape)
        .join(","),
    ),
  ];

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="BE_Registry_${Date.now()}.csv"`);
  res.send(lines.join("\n"));
});

// ─── Checklist DOCX Export ───────────────────────────────────────────────────

export const exportChecklistDocx = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;

  const [application] = await db.select().from(applications).where(eq(applications.id, applicationId)).limit(1);
  const [checklist] = await db.select().from(beChecklists).where(eq(beChecklists.applicationId, applicationId)).limit(1);
  const studyPeriods = await db.select().from(beStudyPeriods).where(eq(beStudyPeriods.applicationId, applicationId)).orderBy(beStudyPeriods.sortOrder);
  const summaryResults = await db.select().from(beSummaryResults).where(eq(beSummaryResults.applicationId, applicationId)).orderBy(beSummaryResults.sortOrder);
  const docRefs = await db.select().from(sectionBDocumentReferences).where(eq(sectionBDocumentReferences.applicationId, applicationId)).orderBy(sectionBDocumentReferences.sortOrder);

  const field = (label: string, value: string | null | undefined | boolean) =>
    new Paragraph({
      children: [
        new TextRun({ text: `${label}: `, bold: true }),
        new TextRun({ text: value == null ? "—" : String(value) }),
      ],
      spacing: { after: 100 },
    });

  const heading = (text: string, level = HeadingLevel.HEADING_2) =>
    new Paragraph({ text, heading: level, spacing: { before: 300, after: 100 } });

  const sectionBTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "No.", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Document", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Name & Location", bold: true })] })] }),
        ],
      }),
      ...docRefs.map(
        (ref) =>
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(String(ref.itemNumber))] }),
              new TableCell({ children: [new Paragraph(ref.documentTitle)] }),
              new TableCell({ children: [new Paragraph(ref.nameOfDocumentAndLocation ?? "—")] }),
            ],
          }),
      ),
    ],
  });

  const summaryTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: ["Parameter", "Log Transformed", "Test GM", "Ref GM", "% Ratio", "CI Lower", "CI Upper", "ISCV"].map(
          (h) => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })] }),
        ),
      }),
      ...summaryResults.map(
        (r) =>
          new TableRow({
            children: [
              r.parameter,
              r.logarithmicTransformedData ?? "—",
              r.testGeometricMean ?? "—",
              r.referenceGeometricMean ?? "—",
              r.percentageRatioGeometricMeans ?? "—",
              r.confidenceIntervalLower ?? "—",
              r.confidenceIntervalUpper ?? "—",
              r.intraSubjectCoefficientVariationIscv ?? "—",
            ].map((val) => new TableCell({ children: [new Paragraph(val)] })),
          }),
      ),
    ],
  });

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: "NAFDAC Bioequivalence Study Report Submission Checklist",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: `Application No: ${application.applicationNo}`, spacing: { after: 200 } }),

          heading("Certification"),
          field("Signed on behalf of", checklist.signedOnBehalfOf),
          field("Signatory name and title", checklist.signatoryNameAndTitle),
          field("Certification date", checklist.certificationDate),

          heading("A. Bioequivalence Study Information"),
          field("1. Study protocol number", checklist.studyProtocolNumber),
          field("2. Study title", checklist.studyTitle),

          heading("Study Periods", HeadingLevel.HEADING_2),
          ...studyPeriods.flatMap((p) => [
            field(`${p.periodLabel} — Start`, p.startDate),
            field(`${p.periodLabel} — End`, p.endDate),
          ]),

          field("4. Bioanalytical study start date", checklist.bioanalyticalStudyStartDate),
          field("4. Bioanalytical study end date", checklist.bioanalyticalStudyEndDate),
          field("5. Clinical study site name", checklist.clinicalStudySiteName),
          field("5. Clinical study site address", checklist.clinicalStudySiteAddress),
          field("6. Bioanalytical study site name", checklist.bioanalyticalStudySiteName),
          field("6. Bioanalytical study site address", checklist.bioanalyticalStudySiteAddress),
          field("7. Ethics committee name", checklist.ethicsCommitteeName),
          field("7. Ethics committee address", checklist.ethicsCommitteeAddress),
          field("7. Study protocol approval date", checklist.studyProtocolApprovalDate),
          field("7. Approved protocol number and version", checklist.approvedStudyProtocolNumberAndVersion),
          field("7. Informed consent approval date", checklist.informedConsentApprovalDate),

          heading("8. Test Product"),
          field("Name", checklist.testProductName),
          field("Strength", checklist.testProductStrength),
          field("Dosage form", checklist.testProductDosageForm),
          field("Batch number", checklist.testProductBatchNumber),
          field("Batch size", checklist.testProductBatchSize),
          field("Manufacture date", checklist.testProductManufactureDate),
          field("Expiry date", checklist.testProductExpiryDate),
          field("API manufacturing site", checklist.apiManufacturingSiteNameAndAddress),
          field("Manufacturing site", checklist.testProductManufacturingSiteNameAndAddress),
          field("Same strength as registration product", checklist.testProductSameStrengthAsRegistrationProduct),
          field("Same composition as registration product", checklist.testProductSameCompositionAsRegistrationProduct),

          heading("9. Reference Product"),
          field("Name", checklist.referenceProductName),
          field("Strength", checklist.referenceProductStrength),
          field("Dosage form", checklist.referenceProductDosageForm),
          field("Batch number", checklist.referenceProductBatchNumber),
          field("Expiry date", checklist.referenceProductExpiryDate),
          field("Source country", checklist.referenceProductSourceCountry),
          field("Manufacturing site", checklist.referenceProductManufacturingSiteNameAndAddress),
          field("Same as WHO comparator", checklist.referenceProductSameAsWhoComparator),

          heading("10. Summary Results"),
          summaryTable,

          heading("B. Documents to be Submitted"),
          sectionBTable,
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  res.setHeader("Content-Disposition", `attachment; filename="Checklist_${application.applicationNo}.docx"`);
  res.send(buffer);
});

// ─── Assessor Workload Report ────────────────────────────────────────────────

export const assessorWorkloadReport = asyncHandler(async (_req: Request, res: Response) => {
  const assessors = await db
    .select({ id: users.id, fullName: users.fullName, email: users.email })
    .from(users)
    .where(eq(users.role, "assessor"));

  const report = await Promise.all(
    assessors.map(async (assessor) => {
      const assignments = await db
        .select()
        .from(assessorAssignments)
        .where(eq(assessorAssignments.assessorUserId, assessor.id));

      return {
        assessor: { id: assessor.id, fullName: assessor.fullName, email: assessor.email },
        total: assignments.length,
        assigned: assignments.filter((a) => a.status === "assigned").length,
        ongoing: assignments.filter((a) => a.status === "ongoing").length,
        completed: assignments.filter((a) => a.status === "completed").length,
        reverted: assignments.filter((a) => a.status === "reverted").length,
        cancelled: assignments.filter((a) => a.status === "cancelled").length,
      };
    }),
  );

  res.json({ report });
});

// ─── Compliance Directive Report ─────────────────────────────────────────────

export const complianceDirectiveReport = asyncHandler(async (_req: Request, res: Response) => {
  const directives = await db
    .select()
    .from(complianceDirectives)
    .orderBy(desc(complianceDirectives.issuedAt));

  const summary = {
    total: directives.length,
    open: directives.filter((d) => d.status === "open").length,
    responded: directives.filter((d) => d.status === "responded").length,
    closed: directives.filter((d) => d.status === "closed").length,
    cancelled: directives.filter((d) => d.status === "cancelled").length,
  };

  res.json({ summary, directives });
});
