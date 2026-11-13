# Build a GMP Report Review Assistant Without AI

## Goal

Build a simple web application that helps a reviewer extract and preview specific sections from GMP inspection reports so the reviewer does not need to scroll through the full document manually.

The system should **not use AI for now**.

The application should allow the user to upload:

1. A reference Excel spreadsheet used to validate/check whether a report is for pharmaceutical inspection.
2. A GMP inspection report in `.docx` or `.pdf` format.

After upload, the system should extract and display only these sections from the report:

- Inspected site(s)
- List of Deficiencies classified into critical, major and others
- Summary and Conclusions

The system should make the review process easier. It should not make final professional decisions automatically.

---

## Tech Stack

Use the following stack:

### Frontend

- React with Vite
- TypeScript
- Tailwind CSS

### Backend

- Node.js
- Express.js
- TypeScript

### Libraries

Use:

- `multer` for file uploads
- `mammoth` for extracting text from `.docx`
- `pdf-parse` for extracting text from `.pdf`
- `exceljs` for reading the uploaded Excel spreadsheet
- `cors`
- `dotenv`

---

## Main Workflow

The app should have one main page.

The page should contain:

### Upload Section

The user should be able to upload:

1. Reference Excel spreadsheet  
   Accepted formats:
   - `.xlsx`
   - `.xls`

2. GMP inspection report  
   Accepted formats:
   - `.docx`
   - `.pdf`

There should be a button:

```text
Extract Report Sections
```

When clicked, the frontend sends both files to the backend.

---

## Backend Processing

Create an endpoint:

```http
POST /api/reports/extract
```

This endpoint should accept:

- `spreadsheet`
- `report`

The backend should:

1. Save uploaded files temporarily.
2. Detect the report file type.
3. Extract text from the report.
4. Extract useful information from the spreadsheet.
5. Extract the three required report sections.
6. Return a structured JSON response to the frontend.
7. Delete temporary uploaded files after processing.

---

## Report Text Extraction

### For `.docx`

Use `mammoth.extractRawText`.

### For `.pdf`

Use `pdf-parse`.

Create a utility function:

```ts
extractTextFromReport(filePath: string, mimeType: string): Promise<string>
```

It should return plain text.

---

## Excel Spreadsheet Reading

Use `exceljs`.

Create a utility function:

```ts
extractSpreadsheetStructure(filePath: string): Promise<SpreadsheetStructure>
```

The goal is not to fill the Excel sheet yet.

For now, extract:

- workbook sheet names
- column headers from the first visible worksheet
- possible inspection-related headers
- possible deficiency-related headers

Return something like:

```ts
interface SpreadsheetStructure {
  sheetNames: string[];
  activeSheetName: string;
  headers: string[];
  inspectionRelatedHeaders: string[];
  deficiencyRelatedHeaders: string[];
}
```

Use keyword matching to detect relevant headers.

Inspection-related keywords:

```ts
[
  "inspection",
  "site",
  "company",
  "country",
  "address",
  "date",
  "remarks",
  "summary",
  "conclusion"
]
```

Deficiency-related keywords:

```ts
[
  "deficiency",
  "critical",
  "major",
  "minor",
  "other",
  "capa",
  "qms",
  "personnel",
  "premises",
  "equipment",
  "validation",
  "documentation",
  "production",
  "material",
  "quality control",
  "complaint",
  "recall",
  "self inspection"
]
```

---

## Required Report Sections

Extract only these sections:

```ts
interface ExtractedReportSections {
  inspectedSite: ExtractedSection;
  deficiencies: DeficiencySection;
  summaryAndConclusions: ExtractedSection;
}

interface ExtractedSection {
  title: string;
  found: boolean;
  text: string;
  startHeading?: string;
  endHeading?: string;
}

interface DeficiencySection {
  title: string;
  found: boolean;
  rawText: string;
  critical: string;
  major: string;
  others: string;
}
```

---

## Section Extraction Rules

The Word/PDF reports may contain headings with small variations.

### Inspected Site Section

Possible headings:

```ts
[
  "Inspected site(s)",
  "Inspected sites",
  "Inspected site",
  "Site inspected",
  "Manufacturing site",
  "Name and address of inspected site",
  "Name and address of manufacturing site"
]
```

Extract from the matched heading until the next major heading.

Possible next headings:

```ts
[
  "Activities carried out by company",
  "Inspection Details",
  "Date of Inspection",
  "Type of Inspection",
  "Inspectors",
  "References",
  "Introduction"
]
```

---

### Deficiency Section

Possible headings:

```ts
[
  "List of Deficiencies classified into critical, major and others",
  "List of Deficiencies",
  "Deficiencies",
  "Deficiency List",
  "Critical",
  "Major",
  "Others"
]
```

Extract from the matched heading until one of these next headings:

```ts
[
  "Recommendations",
  "Recommendation",
  "Summary and Conclusions",
  "Summary and Conclusion",
  "Conclusion",
  "Distribution of Report",
  "Annexes attached",
  "Name:",
  "Signature:"
]
```

Then parse the raw deficiency text into:

```text
critical
major
others
```

Use rule-based parsing.

If the report says:

```text
Critical
Nil
Major
Nil
Others
Nil
```

Return:

```json
{
  "critical": "Nil",
  "major": "Nil",
  "others": "Nil"
}
```

If the exact parsing fails, return the full raw text and set each category to:

```text
Needs manual review
```

Do not guess.

---

### Summary and Conclusions Section

Possible headings:

```ts
[
  "Summary and Conclusions",
  "Summary and Conclusion",
  "Summary/Conclusion",
  "Conclusion",
  "Conclusions"
]
```

Extract from the matched heading until one of these next headings:

```ts
[
  "Name:",
  "Designation:",
  "Signature:",
  "Date:",
  "Distribution of Report",
  "Annexes attached"
]
```

---

## Report Type Detection Without AI

Add simple rule-based detection.

The system should not make final decisions. It should only show a likely classification.

Create:

```ts
interface ReportClassification {
  likelyType: "Pharmaceutical GMP" | "Medical Device/IVD GMP" | "Unknown / Needs Review";
  confidence: "High" | "Medium" | "Low";
  matchedSignals: string[];
}
```

### Pharma Signals

Search the report text for:

```ts
[
  "tablet",
  "capsule",
  "oral liquid",
  "suspension",
  "injection",
  "sterile product",
  "api",
  "active pharmaceutical ingredient",
  "finished pharmaceutical product",
  "drug product",
  "pharmaceutical manufacturing",
  "granulation",
  "compression",
  "coating",
  "blending",
  "dispensing",
  "pharmaceutical quality system"
]
```

### Medical Device / IVD Signals

Search the report text for:

```ts
[
  "medical device",
  "ivd",
  "iso 13485",
  "device master record",
  "device history record",
  "unique device identification",
  "udi",
  "design controls",
  "cannula",
  "catheter",
  "infusion set",
  "transfusion set",
  "hypodermic needle",
  "ghtf"
]
```

### Classification Logic

- If medical device signals are much higher than pharma signals, classify as `Medical Device/IVD GMP`.
- If pharma signals are much higher than medical device signals, classify as `Pharmaceutical GMP`.
- If both are close, classify as `Unknown / Needs Review`.

Return all matched signals so the reviewer can see why the system suggested the classification.

---

## Frontend UI

Create a clean review dashboard.

After extraction, show these cards:

### 1. Report Classification Card

Display:

- Likely report type
- Confidence
- Matched signals

Example:

```text
Likely Type: Medical Device/IVD GMP
Confidence: High

Matched Signals:
- ISO 13485
- Medical Device
- IVD
- Device Master Record
- Cannula
- Infusion Set
```

Add a manual dropdown:

```text
Reviewer Final Classification:
[Pharmaceutical GMP] [Medical Device/IVD GMP] [Unknown / Needs Review]
```

The reviewer should be able to change the final classification manually.

---

### 2. Inspected Site Card

Display:

- Extracted text
- Copy button

Also provide editable fields:

```text
Company/Site Name
Address
Country
```

These fields may be manually edited by the reviewer.

Do not over-automate the company/address extraction yet. The raw section preview is the priority.

---

### 3. Deficiencies Card

Display:

```text
Critical Deficiencies
[extracted critical text]

Major Deficiencies
[extracted major text]

Other Deficiencies
[extracted other text]
```

Also display:

```text
Raw Deficiency Section
[full raw extracted text]
```

Add manual review fields:

```text
Critical Count
Major Count
Other Count
Reviewer Notes
```

The reviewer should be able to type or correct the values manually.

Do not automatically assign CAPA type yet.

---

### 4. Summary and Conclusions Card

Display:

- Extracted summary/conclusion text
- Copy button

Add reviewer field:

```text
Final Remark
[Satisfactory] [Unsatisfactory] [Needs Review]
```

Also allow manual notes.

---

### 5. Spreadsheet Structure Card

Display:

- Uploaded spreadsheet sheet names
- Detected active sheet
- Detected headers
- Inspection-related headers
- Deficiency-related headers

This is just for review now.

Do not write into the Excel file yet.

---

## Final Reviewed Output

At the bottom of the page, create a `Reviewed Summary` panel.

It should show:

```ts
interface ReviewedSummary {
  finalClassification: string;
  inspectedSite: {
    companyName: string;
    address: string;
    country: string;
  };
  deficiencies: {
    criticalCount: string;
    majorCount: string;
    otherCount: string;
    notes: string;
  };
  finalRemark: string;
  reviewerNotes: string;
}
```

Add buttons:

```text
Copy Reviewed Summary
Download JSON
```

For now, only support JSON export.

Do not update the Excel workbook yet.

---

## API Response Format

The backend should return:

```ts
interface ExtractReportResponse {
  success: boolean;
  spreadsheet: SpreadsheetStructure;
  report: {
    fileName: string;
    fileType: "docx" | "pdf";
    classification: ReportClassification;
    sections: ExtractedReportSections;
  };
  warnings: string[];
}
```

If a section is not found, the backend should not fail. It should return:

```json
{
  "found": false,
  "text": ""
}
```

and add a warning like:

```text
Summary and Conclusions section could not be found. Please review the full document manually.
```

---

## Project Structure

Create the project like this:

```text
gmp-report-review-assistant/
│
├── server/
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── routes/
│   │   │   └── report.routes.ts
│   │   ├── controllers/
│   │   │   └── report.controller.ts
│   │   ├── services/
│   │   │   ├── reportText.service.ts
│   │   │   ├── sectionExtractor.service.ts
│   │   │   ├── spreadsheet.service.ts
│   │   │   └── reportClassifier.service.ts
│   │   ├── types/
│   │   │   └── report.types.ts
│   │   └── utils/
│   │       ├── fileCleanup.ts
│   │       └── textNormalize.ts
│   │
│   ├── uploads/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── client/
    ├── src/
    │   ├── App.tsx
    │   ├── api/
    │   │   └── reportApi.ts
    │   ├── components/
    │   │   ├── UploadForm.tsx
    │   │   ├── ClassificationCard.tsx
    │   │   ├── InspectedSiteCard.tsx
    │   │   ├── DeficienciesCard.tsx
    │   │   ├── SummaryCard.tsx
    │   │   ├── SpreadsheetStructureCard.tsx
    │   │   └── ReviewedSummary.tsx
    │   └── types/
    │       └── report.types.ts
    │
    ├── package.json
    └── vite.config.ts
```

---

## Validation Rules

Add validation for upload:

- Spreadsheet is required.
- Report file is required.
- Spreadsheet must be `.xlsx` or `.xls`.
- Report must be `.docx` or `.pdf`.
- Max file size: 20MB per file.

If validation fails, return a clear error.

---

## Important Behaviour

The system must be reviewer-assisted, not fully automated.

Do not use AI.

Do not automatically write into the spreadsheet.

Do not hide the raw extracted text.

Always show the raw extracted sections so the reviewer can verify the information.

Where extraction is uncertain, show:

```text
Needs manual review
```

---

## Expected Result

At the end, the user should be able to:

1. Upload an Excel validation sheet.
2. Upload a Word or PDF GMP report.
3. See only the important sections:
   - Inspected site
   - Deficiencies
   - Summary and conclusions
4. See a rule-based report type suggestion.
5. Manually confirm or correct the extracted details.
6. Copy or download a reviewed JSON summary.

Build this first version cleanly and keep the code modular so Excel writing can be added later.
