import ExcelJS from "exceljs";
const inspectionKeywords = [
    "inspection",
    "site",
    "company",
    "country",
    "address",
    "date",
    "remarks",
    "summary",
    "conclusion"
];
const deficiencyKeywords = [
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
];
export async function extractSpreadsheetStructure(filePath) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const visibleWorksheets = workbook.worksheets.filter((sheet) => sheet.state !== "hidden" && sheet.state !== "veryHidden");
    const activeWorksheet = visibleWorksheets[0] ?? workbook.worksheets[0];
    const headers = activeWorksheet ? detectHeaders(activeWorksheet) : [];
    return {
        sheetNames: workbook.worksheets.map((sheet) => sheet.name),
        activeSheetName: activeWorksheet?.name ?? "",
        headers,
        inspectionRelatedHeaders: filterHeaders(headers, inspectionKeywords),
        deficiencyRelatedHeaders: filterHeaders(headers, deficiencyKeywords)
    };
}
function detectHeaders(worksheet) {
    let bestHeaders = [];
    let bestScore = 0;
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber > 20)
            return;
        const values = row.values;
        if (!Array.isArray(values))
            return;
        const headers = values
            .slice(1)
            .map(cellToString)
            .map((value) => value.trim())
            .filter(Boolean);
        const score = headers.length + filterHeaders(headers, [...inspectionKeywords, ...deficiencyKeywords]).length * 2;
        if (score > bestScore) {
            bestScore = score;
            bestHeaders = headers;
        }
    });
    return bestHeaders;
}
function cellToString(value) {
    if (value == null)
        return "";
    if (value instanceof Date)
        return value.toISOString();
    if (typeof value === "object") {
        if ("text" in value && typeof value.text === "string")
            return value.text;
        if ("richText" in value && Array.isArray(value.richText)) {
            return value.richText.map((part) => part.text).join("");
        }
        if ("result" in value)
            return String(value.result ?? "");
        if ("hyperlink" in value && "text" in value)
            return String(value.text ?? "");
    }
    return String(value);
}
function filterHeaders(headers, keywords) {
    return headers.filter((header) => {
        const normalized = header.toLowerCase();
        return keywords.some((keyword) => normalized.includes(keyword));
    });
}
