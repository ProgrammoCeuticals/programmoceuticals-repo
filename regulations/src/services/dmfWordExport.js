import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, WidthType, AlignmentType, BorderStyle, VerticalAlign,
  ShadingType, Header,
} from "docx";
import { saveAs } from "file-saver";

// ─── Constants ────────────────────────────────────────────────────────────────
const C = "\u2612"; // ☒
const U = "\u2610"; // ☐

const SZ   = 18; // 9pt  (docx half-points)
const SZ_S = 17; // 8.5pt
const SZ_L = 20; // 10pt

// ─── Border helpers ───────────────────────────────────────────────────────────
const BORDER = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };

const allBorders = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };
const noBorders  = { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER };

// ─── Cell factory ─────────────────────────────────────────────────────────────
const cell = (children, { w, span, borders: b = allBorders, shading } = {}) =>
  new TableCell({
    children: Array.isArray(children) ? children : [children],
    verticalAlign: VerticalAlign.TOP,
    borders: b,
    ...(w !== undefined && { width: { size: w, type: WidthType.PERCENTAGE } }),
    ...(span && { columnSpan: span }),
    ...(shading && { shading }),
  });

// light grey shading for notes column and module break
const SHADING_LIGHT = { type: ShadingType.CLEAR, fill: "FAFAFA", color: "auto" };
const SHADING_GREY  = { type: ShadingType.CLEAR, fill: "F9F9F9", color: "auto" };
const SHADING_WHITE = { type: ShadingType.CLEAR, fill: "FFFFFF", color: "auto" };
const SHADING_TH    = { type: ShadingType.CLEAR, fill: "F2F2F2", color: "auto" };

// ─── Paragraph / TextRun helpers ─────────────────────────────────────────────
const run = (text, { bold = false, italic = false, size = SZ, underline } = {}) =>
  new TextRun({ text: String(text ?? ""), bold, italic, size, font: "Times New Roman", ...(underline && { underline: {} }) });

const br = () => new TextRun({ break: 1 });

const para = (runs, { align = AlignmentType.LEFT, spacingAfter = 40 } = {}) =>
  new Paragraph({
    children: Array.isArray(runs) ? runs : [runs],
    alignment: align,
    spacing: { after: spacingAfter },
  });

const emptyPara = (spacingAfter = 80) =>
  new Paragraph({ children: [run("")], spacing: { after: spacingAfter } });

// ─── Invisible-border table (used for layout blocks) ─────────────────────────
const layoutTable = (rows) =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: NO_BORDER, bottom: NO_BORDER,
      left: NO_BORDER, right: NO_BORDER,
      insideH: NO_BORDER, insideV: NO_BORDER,
    },
    rows,
  });

// ─── Admin info block ────────────────────────────────────────────────────────
const adminBlock = (dmfName, dmfMeta) => {
  const fields = [
    ["NAME OF APPLICANT:",              dmfMeta.applicantName  || ""],
    ["DMF NUMBER:",                     dmfMeta.dmfNumber      || ""],
    ["DMF HOLDER:",                     dmfMeta.dmfHolder      || ""],
    ["DRUG NAME (subject):",            dmfName                || ""],
    ["SUBMIT DATE:",                    dmfMeta.submitDate     || ""],
    ["RECEIVED DATE:",                  dmfMeta.receivedDate   || ""],
    ["Electronic or paper submission:", dmfMeta.submissionType || ""],
  ];

  const expedited = dmfMeta.expeditedRequest || "";

  const innerRows = fields.map(([label, value]) =>
    new TableRow({
      children: [
        cell(para([run(label, { bold: true, size: SZ_L })]), { w: 38, borders: noBorders, shading: SHADING_GREY }),
        cell(para([run(value, { size: SZ_L })]),               { w: 62, borders: noBorders, shading: SHADING_GREY }),
      ],
    })
  );

  innerRows.push(
    new TableRow({
      children: [
        cell(
          para([
            run(U, { size: SZ_L }), run("  "),
            run("EXPEDITED SCREENING REQUEST", { bold: true, size: SZ_L }),
            run(" by: ", { size: SZ_L }),
            run(expedited || "(requestor name here) if applicable", { size: SZ_L }),
          ]),
          { w: 100, span: 2, borders: noBorders, shading: SHADING_GREY }
        ),
      ],
    })
  );

  // Wrap the inner layout table inside a single bordered+shaded cell
  const innerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: NO_BORDER, bottom: NO_BORDER,
      left: NO_BORDER, right: NO_BORDER,
      insideH: NO_BORDER, insideV: NO_BORDER,
    },
    rows: innerRows,
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          cell([innerTable], { w: 100, borders: allBorders, shading: SHADING_GREY }),
        ],
      }),
    ],
  });
};

// ─── Reviewer block (no border — plain paragraphs) ──────────────────────────
const reviewerBlock = (reviewerName, screeningDate, screeningStatus, gatewayResponses, gatewayQuestions) => {
  const isComplete = screeningStatus === "complete";
  const g1 = gatewayResponses instanceof Map ? gatewayResponses.get("g1") : (gatewayResponses?.g1 ?? null);
  const g2 = gatewayResponses instanceof Map ? gatewayResponses.get("g2") : (gatewayResponses?.g2 ?? null);

  return [
    para([
      run("Primary reviewer: ", { bold: true, size: SZ_L }),
      run(reviewerName || "", { size: SZ_L }),
      run("          ", { size: SZ_L }),
      run(isComplete ? C : U, { size: SZ_L }), run("  ", { size: SZ_L }), run("COMPLETE", { bold: true, size: SZ_L }),
      run("          ", { size: SZ_L }),
      run(!isComplete ? C : U, { size: SZ_L }), run("  ", { size: SZ_L }), run("INCOMPLETE", { bold: true, size: SZ_L }),
    ], { spacingAfter: 40 }),
    para([run("Date :  ", { bold: true, size: SZ_L }), run(screeningDate || "", { size: SZ_L })], { spacingAfter: 80 }),
    para([run("Is the DMF active?", { bold: true, size: SZ_L })], { spacingAfter: 20 }),
    para([
      run(g1 === "yes" ? C : U, { size: SZ_L }), run("  YES          ", { size: SZ_L }),
      run(g1 === "no" ? C : U, { size: SZ_L }), run("  NO", { size: SZ_L }),
    ], { spacingAfter: 20 }),
    para([run("If no, DMF is INCOMPLETE per policy. Issue Incomplete Letter to DMF holder.", { italic: true, size: SZ_S })], { spacingAfter: 80 }),
    para([run("Has the DMF been reviewed previously for chemistry, manufacturing, and controls (CMC) by NAFDAC in the context of a review of a prior application?", { bold: true, size: SZ_L })], { spacingAfter: 20 }),
    para([
      run(g2 === "yes" ? C : U, { size: SZ_L }), run("  YES          ", { size: SZ_L }),
      run(g2 === "no" ? C : U, { size: SZ_L }), run("  NO", { size: SZ_L }),
    ], { spacingAfter: 40 }),
  ];
};

// ─── Policy box ───────────────────────────────────────────────────────────────
const policyBox = () =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          cell(
            para([run(
              '"If \u201cyes,\u201d the DMF is COMPLETE per policy.", "If \u201cno\u201d, review DMF with checklist."',
              { italic: true, size: SZ_L }
            )]),
            { w: 100, borders: allBorders, shading: SHADING_WHITE }
          ),
        ],
      }),
    ],
  });

// ─── Checklist table ──────────────────────────────────────────────────────────
// Maps the exact grouped-row structure of the HTML sample.
// Each entry is ONE table row. Items within a group share a single row with
// stacked statuses in the status cell, consolidated notes in the notes cell.

const ck = (responses, id) =>
  responses instanceof Map ? responses.get(id) : (responses?.[id] ?? undefined);

const statusRuns = (responses, ids, hasNAs = {}) => {
  const runs = [];
  ids.forEach((id, idx) => {
    const r = ck(responses, id);
    if (idx > 0) runs.push(br());
    runs.push(run(r === "yes" ? C : U, { size: SZ_L }));
    runs.push(run("  YES    ", { size: SZ_L }));
    runs.push(run(r === "no" ? C : U, { size: SZ_L }));
    runs.push(run("  NO", { size: SZ_L }));
    if (hasNAs[id]) {
      runs.push(run("    ", { size: SZ_L }));
      runs.push(run(r === "na" ? C : U, { size: SZ_L }));
      runs.push(run("  NA", { size: SZ_L }));
    }
  });
  return runs;
};

// reviewer notes (per-item text typed during screening)
const noteRun = (notes, id) => {
  const n = notes instanceof Map ? notes.get(id) : (notes?.[id] ?? "");
  return n ? [br(), run(n, { italic: true, size: SZ_S })] : [];
};

const buildChecklistTable = (responses, notes) => {
  const rows = [];

  // ── Header row ──
  rows.push(
    new TableRow({
      children: [
        cell(para([run("Section",           { bold: true, size: SZ })]), { w: 12, shading: SHADING_TH }),
        cell(para([run("Requirement / Item",{ bold: true, size: SZ })]), { w: 43, shading: SHADING_TH }),
        cell(para([run("Status",            { bold: true, size: SZ })]), { w: 18, shading: SHADING_TH }),
        cell(para([run("NOTE(S)",           { bold: true, size: SZ })]), { w: 27, shading: SHADING_TH }),
      ],
    })
  );

  // ── Helper to push a grouped row ──
  // reqParagraphs: Paragraph[]   statusIds: number[]   notesParagraphs: Paragraph[]
  const pushRow = (sectionText, reqParagraphs, statusIds, notesParagraphs, hasNAs = {}) => {
    rows.push(
      new TableRow({
        children: [
          cell(para([run(sectionText, { bold: true, size: SZ })]), { w: 12 }),
          cell(reqParagraphs,  { w: 43 }),
          cell(para(statusRuns(responses, statusIds, hasNAs)), { w: 18 }),
          cell(notesParagraphs, { w: 27, shading: SHADING_LIGHT }),
        ],
      })
    );
  };

  // ── Items 1–7 — one row each ──
  const generalItems = [
    { id: 1, text: "1. Subject of the DMF is a single API produced by one manufacturing process" },
    { id: 2, text: "2. For previously submitted DMFs, the DMF holder has submitted a complete update." },
    { id: 3, text: "3. Provides current Good Manufacturing Practice (cGMP) Statement of Commitment." },
    { id: 4, text: "4. Provides complete name, address, and contact information for holder." },
    { id: 5, text: "5. Contains label with storage conditions and expiry date." },
    { id: 6, text: "6. Contains bovine spongiform encephalopathy (BSE)/ transmissible spongiform encephalopathy (TSE) certification if animal sourced.", hasNA: true },
    { id: 7, text: "7. Contains information on presence of pesticides if plant-sourced.", hasNA: true },
  ];

  const NOTES_1 =
    "For #1: The DMF is limited to: (i) one API, although multiple manufacturing sites for a single API are permitted when the same process is used in each of those sites; (ii) one manufacturing process, although certain process alternatives/changes may be permissible with sufficient supportive information provided. Examples include: validated reprocess/rework procedures; micronization leading to different particle sizes; addition of a stabilizing agent for stability purposes; and minor process variation that leaves the chemical transformation the same, with little risk to the impurity profile. A separate DMF should be filed for: different salt form; different synthetic route; and significant process variation resulting in a different impurity profile and requiring a different control strategy.";
  const NOTES_2 =
    "For #2: The complete update should reflect the current state of the process and not require reference to any previous submission for information. This requirement does not apply if the entire DMF is in eCTD format.";
  const NOTES_6 = "For #6: If not included, should be submitted separately (uploaded).";

  const notesByItem = {
    1: NOTES_1,
    2: NOTES_2,
    6: NOTES_6,
  };

  generalItems.forEach(({ id, text, hasNA }) => {
    const staticNote = notesByItem[id] || "";
    const reviewerNote = notes instanceof Map ? (notes.get(id) || "") : (notes?.[id] || "");
    const noteParagraphs = [];
    if (staticNote) noteParagraphs.push(para([run(staticNote, { size: SZ_S })], { spacingAfter: 20 }));
    if (reviewerNote) noteParagraphs.push(para([run(reviewerNote, { italic: true, size: SZ_S })], { spacingAfter: 20 }));
    if (!noteParagraphs.length) noteParagraphs.push(para([run("")]));

    rows.push(
      new TableRow({
        children: [
          cell(para([run("", { size: SZ })]), { w: 12 }),
          cell(para([run(text, { size: SZ })]), { w: 43 }),
          cell(para(statusRuns(responses, [id], hasNA ? { [id]: true } : {})), { w: 18 }),
          cell(noteParagraphs, { w: 27, shading: SHADING_LIGHT }),
        ],
      })
    );
  });

  // ── Module break row ──
  rows.push(
    new TableRow({
      children: [
        cell(
          [
            para([run("MODULE 3: QUALITY", { bold: true, size: SZ })], { spacingAfter: 20 }),
            para([run("3.2 Body of Data",  { bold: true, size: SZ })], { spacingAfter: 20 }),
            para([run("3.2.S API [name, manufacturer]", { bold: true, size: SZ })], { spacingAfter: 20 }),
          ],
          { w: 100, span: 4, shading: SHADING_GREY }
        ),
      ],
    })
  );

  // ── 3.2.S.1 — items 8, 9, 10 grouped ──
  pushRow(
    "3.2. S.1",
    [
      para([run("General Information", { bold: true, size: SZ })], { spacingAfter: 20 }),
      para([run("Contains complete General Information on the following:", { size: SZ })], { spacingAfter: 20 }),
      para([run("8. Nomenclature.", { size: SZ })], { spacingAfter: 10 }),
      para([run("9. Structure.", { size: SZ })], { spacingAfter: 10 }),
      para([run("10. General Properties: basic information regarding the general properties of the API.", { size: SZ })], { spacingAfter: 20 }),
      ...noteRun(notes, 8), ...noteRun(notes, 9), ...noteRun(notes, 10),
    ],
    [8, 9, 10],
    [para([run("")])]
  );

  // ── 3.2.S.2 — item 11 ──
  const notes11 = "For #11: Separate facilities used for release testing of the API and for additional processing (e.g., micronization) should also be listed. CFN, FEI, and DUNS numbers should be provided if available.";
  const rNote11 = notes instanceof Map ? (notes.get(11) || "") : (notes?.[11] || "");
  pushRow(
    "3.2. S.2",
    [
      para([run("Manufacture", { bold: true, size: SZ })], { spacingAfter: 20 }),
      para([run("3.2.S.2.1", { bold: true, size: SZ }), run(" Contains complete Manufacturer Information on the following on each site:", { size: SZ })], { spacingAfter: 20 }),
      para([run("11. Name and full address(es) of the manufacturing facility(ies), contact name of on-site Individual, phone and fax numbers, and e-mail address.", { size: SZ })], { spacingAfter: 20 }),
    ],
    [11],
    [
      para([run(notes11, { size: SZ_S })], { spacingAfter: rNote11 ? 20 : 40 }),
      ...(rNote11 ? [para([run(rNote11, { italic: true, size: SZ_S })])] : []),
    ]
  );

  // ── 3.2.S.2.2 — items 12, 13 ──
  const rNote12 = notes instanceof Map ? (notes.get(12) || "") : (notes?.[12] || "");
  const rNote13 = notes instanceof Map ? (notes.get(13) || "") : (notes?.[13] || "");
  const noteRows1213 = [];
  if (rNote12) noteRows1213.push(para([run(rNote12, { italic: true, size: SZ_S })], { spacingAfter: 20 }));
  if (rNote13) noteRows1213.push(para([run(rNote13, { italic: true, size: SZ_S })], { spacingAfter: 20 }));
  if (!noteRows1213.length) noteRows1213.push(para([run("")]));

  pushRow(
    "",
    [
      para([run("3.2.S.2.2", { bold: true, size: SZ }), run(" Contains Description of Manufacturing Process and Process Controls addressing the following:", { size: SZ })], { spacingAfter: 20 }),
      para([run("12. Flow chart for every stage.", { size: SZ })], { spacingAfter: 10 }),
      para([run("13. Description of the manufacturing process.", { size: SZ })], { spacingAfter: 20 }),
    ],
    [12, 13],
    noteRows1213
  );

  // ── 3.2.S.2.3 — items 14–19 ──
  const notes14 = "For #14: Justification for designation of each starting material should be in agreement with ICH Q11. This can include name, address, and contact information of the manufacturer(s), and a flow diagram/description outlining the synthetic route and conditions of each proposed starting material.\n\nStated to be in the closed part of the DMF.";
  const rNotes1419 = [14,15,16,17,18,19].map(id => notes instanceof Map ? (notes.get(id) || "") : (notes?.[id] || "")).join("").trim();
  const noteCell1419 = [
    para([run(notes14, { size: SZ_S })], { spacingAfter: 20 }),
    ...(rNotes1419 ? [para([run(rNotes1419, { italic: true, size: SZ_S })])] : []),
  ];

  pushRow(
    "",
    [
      para([run("3.2.S.2.3", { bold: true, size: SZ }), run(" Contains information on the Control of Materials, as follows:", { size: SZ })], { spacingAfter: 10 }),
      para([run("Starting Material:", { bold: true, size: SZ })], { spacingAfter: 20 }),
      para([run("14. Starting material, clearly designated, with appropriate justification.", { size: SZ })], { spacingAfter: 10 }),
      para([run("15. Name of each manufacturer.", { size: SZ })], { spacingAfter: 10 }),
      para([run("16. Specification.", { size: SZ })], { spacingAfter: 10 }),
      para([run("17. Analytical method.", { size: SZ })], { spacingAfter: 10 }),
      para([run("18. Certificate of Analysis (CoA) from manufacturer.", { size: SZ })], { spacingAfter: 10 }),
      para([run("19. CoAs from the DMF holder.", { size: SZ })], { spacingAfter: 20 }),
    ],
    [14, 15, 16, 17, 18, 19],
    noteCell1419
  );

  // ── Reagents/Solvents — items 20, 21 ──
  const notes20 = "For #20: Specifications should clearly identify the test methods. For non-compendial methods, the method description should be provided.\n\nStated to be in the closed part of the DMF.";
  const rNote20 = notes instanceof Map ? (notes.get(20) || "") : (notes?.[20] || "");
  const rNote21 = notes instanceof Map ? (notes.get(21) || "") : (notes?.[21] || "");
  const noteCell2021 = [
    para([run(notes20, { size: SZ_S })], { spacingAfter: 20 }),
    ...(rNote20 ? [para([run(rNote20, { italic: true, size: SZ_S })], { spacingAfter: 10 })] : []),
    ...(rNote21 ? [para([run(rNote21, { italic: true, size: SZ_S })])] : []),
  ];
  if (noteCell2021.length === 1 && !rNote20 && !rNote21) noteCell2021.push(para([run("")]));

  pushRow(
    "",
    [
      para([run("Reagents/Solvents", { bold: true, size: SZ })], { spacingAfter: 20 }),
      para([run("20. Specifications.", { size: SZ })], { spacingAfter: 10 }),
      para([run("21. Representative CoAs.", { size: SZ })], { spacingAfter: 20 }),
    ],
    [20, 21],
    noteCell2021
  );

  // ── 3.2.S.2.5 — items 22, 23 ──
  const notes22 = "For #22: If validation has been performed, the DMF holder should provide a validation summary, including batch descriptions with traceability among steps/stages, and analytical test results for starting materials, intermediates, in-process controls, and final API, preferably in tabular format.";
  const notes23 = "For #23: The full sterilization process validation and the method validation of sterility tests for the sterilized API should be provided.";
  const rNote22 = notes instanceof Map ? (notes.get(22) || "") : (notes?.[22] || "");
  const rNote23 = notes instanceof Map ? (notes.get(23) || "") : (notes?.[23] || "");

  pushRow(
    "3.2. S.2.5",
    [
      para([run("Process Validation and/or Evaluation", { bold: true, size: SZ })], { spacingAfter: 20 }),
      para([run("22. Contains a summary of Process Validation and/or Evaluation information.", { size: SZ })], { spacingAfter: 10 }),
      para([run("23. Provides sterility assurance data for sterile API.", { size: SZ })], { spacingAfter: 20 }),
    ],
    [22, 23],
    [
      para([run(notes22, { size: SZ_S })], { spacingAfter: 20 }),
      para([run(notes23, { size: SZ_S })], { spacingAfter: rNote22 || rNote23 ? 20 : 40 }),
      ...(rNote22 ? [para([run(rNote22, { italic: true, size: SZ_S })], { spacingAfter: 10 })] : []),
      ...(rNote23 ? [para([run(rNote23, { italic: true, size: SZ_S })])] : []),
    ],
    { 23: true }
  );

  // ── 3.2.S.2.6 — item 24 ──
  const rNote24 = notes instanceof Map ? (notes.get(24) || "") : (notes?.[24] || "");
  pushRow(
    "3.2. S.2.6",
    [
      para([run("Manufacturing Process Development", { bold: true, size: SZ })], { spacingAfter: 20 }),
      para([run("24. Contains a summary of Manufacturing Process Development.", { size: SZ })], { spacingAfter: 20 }),
    ],
    [24],
    [
      ...(rNote24 ? [para([run(rNote24, { italic: true, size: SZ_S })])] : [para([run("")])]),
    ]
  );

  // ── 3.2.S.3 — items 25, 26, 27 ──
  const notes25 = "For #25: Potential genotoxic impurities can be included in this table or summarized in a separate table.";
  const rNote25 = notes instanceof Map ? (notes.get(25) || "") : (notes?.[25] || "");
  const rNote26 = notes instanceof Map ? (notes.get(26) || "") : (notes?.[26] || "");
  const rNote27 = notes instanceof Map ? (notes.get(27) || "") : (notes?.[27] || "");

  pushRow(
    "3.2. S.3",
    [
      para([run("Characterization", { bold: true, size: SZ })], { spacingAfter: 20 }),
      para([run("3.2.S.3.2", { bold: true, size: SZ }), run(" Provides information on Impurities, as follows:", { size: SZ })], { spacingAfter: 20 }),
      para([run("25. A table including the name(s), structure(s), origin (degradant, process impurity) of observed/potential organic impurities.", { size: SZ })], { spacingAfter: 10 }),
      para([run("26. Information on potential inorganic impurities (e.g., metal catalysts, reagents).", { size: SZ })], { spacingAfter: 10 }),
      para([run("27. Potential residual solvents.", { size: SZ })], { spacingAfter: 20 }),
    ],
    [25, 26, 27],
    [
      para([run(notes25, { size: SZ_S })], { spacingAfter: rNote25 || rNote26 || rNote27 ? 20 : 40 }),
      ...(rNote25 ? [para([run(rNote25, { italic: true, size: SZ_S })], { spacingAfter: 10 })] : []),
      ...(rNote26 ? [para([run(rNote26, { italic: true, size: SZ_S })], { spacingAfter: 10 })] : []),
      ...(rNote27 ? [para([run(rNote27, { italic: true, size: SZ_S })])] : []),
    ]
  );

  // ── 3.2.S.4 — items 28, 29, 30, 31 ──
  const notes30 = "For #30: Method verification reports should be provided for compendial methods, such as assay or related substance by HPLC; the method equivalency study should be provided when an in-house method is used in lieu of a compendial method.\n\nStated to be in the closed part of the DMF.";
  const rNotes2831 = [28,29,30,31].map(id => notes instanceof Map ? (notes.get(id) || "") : (notes?.[id] || "")).join("").trim();

  pushRow(
    "3.2. S.4",
    [
      para([run("Provides information to support the ", { size: SZ }), run("Control of the API", { bold: true, size: SZ }), run(", as follows:", { size: SZ })], { spacingAfter: 20 }),
      para([run("28. Full test specification.", { size: SZ })], { spacingAfter: 10 }),
      para([run("29. Description of the analytical methods.", { size: SZ })], { spacingAfter: 10 }),
      para([run("30. Method validation and/or method verification reports.", { size: SZ })], { spacingAfter: 10 }),
      para([run("31. CoAs for representative batches (batch analysis).", { size: SZ })], { spacingAfter: 20 }),
    ],
    [28, 29, 30, 31],
    [
      para([run(notes30, { size: SZ_S })], { spacingAfter: rNotes2831 ? 20 : 40 }),
      ...(rNotes2831 ? [para([run(rNotes2831, { italic: true, size: SZ_S })])] : []),
    ]
  );

  // ── 3.2.S.6 — items 32, 33, 34 ──
  const notes33 = "For #33: The certification statement from the supplier should state that each primary packaging material for the drug substance is safe to use in contact with food.";
  const rNotes3234 = [32,33,34].map(id => notes instanceof Map ? (notes.get(id) || "") : (notes?.[id] || "")).join("").trim();

  pushRow(
    "3.2. S.6",
    [
      para([run("Provides information to support the ", { size: SZ }), run("Container/Closure System", { bold: true, size: SZ }), run(", as follows:", { size: SZ })], { spacingAfter: 20 }),
      para([run("32. Description of container/closure system (including contact material and secondary material).", { size: SZ })], { spacingAfter: 10 }),
      para([run("33. Certification statements for contact materials for use in food and drugs.", { size: SZ })], { spacingAfter: 10 }),
      para([run("34. Manufacturer, specifications, and representative CoA for primary contact material and functional secondary packaging component.", { size: SZ })], { spacingAfter: 20 }),
    ],
    [32, 33, 34],
    [
      para([run(notes33, { size: SZ_S })], { spacingAfter: rNotes3234 ? 20 : 40 }),
      ...(rNotes3234 ? [para([run(rNotes3234, { italic: true, size: SZ_S })])] : []),
    ]
  );

  // ── 3.2.S.7 — items 35, 36 ──
  const rNote35 = notes instanceof Map ? (notes.get(35) || "") : (notes?.[35] || "");
  const rNote36 = notes instanceof Map ? (notes.get(36) || "") : (notes?.[36] || "");

  pushRow(
    "3.2.S.7",
    [
      para([run("Provides information to support the ", { size: SZ }), run("Stability of the API", { bold: true, size: SZ }), run(", as follows:", { size: SZ })], { spacingAfter: 20 }),
      para([run("3.2.S.7.1 Stability Summary and Conclusions", { bold: true, size: SZ })], { spacingAfter: 20 }),
      para([run("35. Clearly indicates the retest date or expiration date of API.", { size: SZ })], { spacingAfter: 20 }),
      para([run("3.2.S.7.3 Stability Data", { bold: true, size: SZ })], { spacingAfter: 20 }),
      para([run("36. Provides Stability Data.", { size: SZ })], { spacingAfter: 20 }),
    ],
    [35, 36],
    [
      ...(rNote35 ? [para([run(rNote35, { italic: true, size: SZ_S })], { spacingAfter: 10 })] : []),
      ...(rNote36 ? [para([run(rNote36, { italic: true, size: SZ_S })])] : [para([run("")])]),
    ]
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows,
  });
};

// ─── Main builder ─────────────────────────────────────────────────────────────
export const buildDMFWordDoc = async (rawData) => {
  const {
    dmfName, dmfMeta = {}, reviewerName, screeningDate, screeningStatus,
    gatewayResponses: _gw, gatewayQuestions,
    responses: _res, notes: _notes = [],
    additionalComments,
  } = rawData;

  // Ensure all Maps are real Maps regardless of how data arrived
  const gatewayResponses = _gw instanceof Map ? _gw : new Map(Array.isArray(_gw) ? _gw : Object.entries(_gw || {}));
  const responses        = _res instanceof Map ? _res : new Map(Array.isArray(_res) ? _res : Object.entries(_res || {}));
  const notes            = _notes instanceof Map ? _notes : new Map(Array.isArray(_notes) ? _notes : Object.entries(_notes || {}));

  const children = [];

  // 1. Admin block (single)
  children.push(adminBlock(dmfName, dmfMeta));
  children.push(emptyPara(120));

  // 2. Centred title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [run("NAFDAC API DMF/ASMF SCREENING FOR COMPLETENESS FORM", { bold: true, size: SZ_L + 2 })],
    })
  );

  // 3. Reviewer block (plain paragraphs — no border)
  children.push(...reviewerBlock(reviewerName, screeningDate, screeningStatus, gatewayResponses, gatewayQuestions));
  children.push(emptyPara(80));

  // 4. Policy box
  children.push(policyBox());
  children.push(emptyPara(80));

  // 5. Additional comments
  children.push(
    para([run("ADDITIONAL COMMENTS REGARDING THE DMF:", { bold: true, underline: true, size: SZ_L })], { spacingAfter: 40 })
  );
  children.push(
    new Paragraph({
      children: [run(additionalComments || "", { size: SZ_L })],
      spacing: { after: 160 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" } },
    })
  );

  // 6. Checklist Review heading
  children.push(
    para([run("CHECKLIST REVIEW", { bold: true, size: SZ_L + 2 })], { spacingAfter: 20 })
  );

  // 7. GENERAL INFORMATION subheading
  children.push(
    para([run("GENERAL INFORMATION", { bold: true, size: SZ_L })], { spacingAfter: 40 })
  );

  // 8. Checklist table
  children.push(buildChecklistTable(responses, notes));

    const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          cell(para([run("ANNEXURE - 4", { bold: true, size: SZ })]), { w: 22 }),
          cell(para([run("SOP Ref. No.: ", { bold: true, size: SZ }), run("DER-303-02", { size: SZ })]), { w: 28 }),
          cell(para([run("Title of Annexure: ", { bold: true, size: SZ }), run("API DMF/ASMF Screening for Completeness Form", { size: SZ })]), { w: 50 }),
        ],
      }),
    ],
  });

  const doc = new Document({
    sections: [{
      properties: {
        page: { margin: { top: 1440, bottom: 720, left: 900, right: 900 } },
      },
      headers: {
        default: new Header({
          children: [
            headerTable,
            emptyPara(80),
          ],
        }),
      },
      children,
    }],
  });

  return doc;
};

// ─── Export entry points ──────────────────────────────────────────────────────
export const generateDMFWordReport = async (data) => {
  const doc = await buildDMFWordDoc(data);
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `DMF_Screening_${(data.dmfName || "report").replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.docx`);
};
