import { copyFile, mkdtemp, readFile, rm } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { basename, join } from "node:path";
import { tmpdir } from "node:os";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";
import WordExtractor from "word-extractor";
import { normalizeText } from "../utils/textNormalize.js";
const execFileAsync = promisify(execFile);
const antiwordPath = "/usr/local/bin/antiword";
const libreOfficeCandidates = [
    "/Applications/LibreOffice.app/Contents/MacOS/soffice",
    "soffice",
    "libreoffice"
];
export async function extractDocumentPreview(filePath, originalName) {
    const name = originalName.toLowerCase();
    if (name.endsWith(".docx")) {
        return extractDocxPreview(filePath);
    }
    if (name.endsWith(".doc")) {
        return extractDocPreview(filePath, originalName);
    }
    if (name.endsWith(".pdf")) {
        return extractPdfPreview(filePath);
    }
    throw new Error(`Unsupported file type: ${originalName}. Upload a .doc, .docx or .pdf report.`);
}
export function detectReportFileType(fileName) {
    const name = fileName.toLowerCase();
    if (name.endsWith(".docx") || name.endsWith(".doc"))
        return "docx";
    if (name.endsWith(".pdf"))
        return "pdf";
    throw new Error(`Unsupported file type: ${fileName}.`);
}
async function extractDocxPreview(filePath) {
    const [textResult, htmlResult] = await Promise.all([
        mammoth.extractRawText({ path: filePath }),
        mammoth.convertToHtml({ path: filePath })
    ]);
    return {
        text: normalizeText(textResult.value),
        html: htmlResult.value
    };
}
async function extractDocPreview(filePath, originalName) {
    const convertedByLibreOffice = await tryConvertDocWithLibreOffice(filePath, originalName);
    if (convertedByLibreOffice?.text)
        return convertedByLibreOffice;
    const convertedByTextutil = await tryConvertDocWithTextutil(filePath, originalName);
    if (convertedByTextutil?.text)
        return convertedByTextutil;
    const antiwordPreview = await tryExtractDocWithAntiword(filePath);
    if (antiwordPreview?.text)
        return antiwordPreview;
    return extractDocWithWordExtractor(filePath);
}
async function extractPdfPreview(filePath) {
    const buffer = await readFile(filePath);
    const result = await pdfParse(buffer, {
        pagerender: renderPdfPageWithLayout
    });
    const text = normalizePdfLayoutText(result.text);
    return {
        text,
        html: ""
    };
}
async function tryConvertDocWithLibreOffice(filePath, originalName) {
    for (const command of libreOfficeCandidates) {
        const converted = await tryConvertDoc(command, ["--headless", "--convert-to", "docx"], filePath, originalName);
        if (converted?.text)
            return converted;
    }
    return null;
}
async function tryConvertDocWithTextutil(filePath, originalName) {
    return tryConvertDoc("/usr/bin/textutil", ["-convert", "docx"], filePath, originalName);
}
async function tryConvertDoc(command, args, filePath, originalName) {
    const tempDir = await mkdtemp(join(tmpdir(), "gmp-doc-"));
    const inputPath = join(tempDir, ensureExtension(sanitizeFileName(originalName), ".doc"));
    const outputPath = join(tempDir, `${basename(inputPath, ".doc")}.docx`);
    try {
        await copyFile(filePath, inputPath);
        if (command.endsWith("textutil")) {
            await execFileAsync(command, [...args, "-output", outputPath, inputPath]);
        }
        else {
            await execFileAsync(command, [...args, "--outdir", tempDir, inputPath]);
        }
        return extractDocxPreview(outputPath);
    }
    catch {
        return null;
    }
    finally {
        await rm(tempDir, { recursive: true, force: true });
    }
}
async function tryExtractDocWithAntiword(filePath) {
    try {
        const { stdout } = await execFileAsync(antiwordPath, ["-x", "db", filePath]);
        if (!stdout.trim())
            return null;
        const html = docbookXmlToHtml(stdout);
        const text = normalizeText(stdout.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));
        return { text, html };
    }
    catch {
        return null;
    }
}
async function extractDocWithWordExtractor(filePath) {
    try {
        const extractor = new WordExtractor();
        const doc = await extractor.extract(filePath);
        const parts = [
            safeRead(() => doc.getHeaders({ includeFooters: false })),
            safeRead(() => doc.getBody()),
            safeRead(() => doc.getTextboxes({ includeHeadersAndFooters: true, includeBody: true })),
            safeRead(() => doc.getFooters()),
            safeRead(() => doc.getFootnotes()),
            safeRead(() => doc.getEndnotes()),
            safeRead(() => doc.getAnnotations())
        ].filter(Boolean);
        const text = normalizeText(parts.join("\n\n"));
        return { text, html: plainTextToHtml(text) };
    }
    catch {
        return { text: "", html: "" };
    }
}
async function renderPdfPageWithLayout(pageData) {
    const textContent = await pageData.getTextContent({
        normalizeWhitespace: false,
        disableCombineTextItems: false
    });
    const rows = new Map();
    for (const item of textContent.items) {
        const text = String(item.str ?? "").trim();
        if (!text)
            continue;
        const transform = item.transform ?? [];
        const x = Number(transform[4] ?? 0);
        const y = Number(transform[5] ?? 0);
        const width = Number(item.width ?? text.length * 4);
        const rowKey = Math.round(y / 2) * 2;
        const row = rows.get(rowKey) ?? [];
        row.push({ x, text, width });
        rows.set(rowKey, row);
    }
    return [...rows.entries()]
        .sort((left, right) => right[0] - left[0])
        .map(([, items]) => renderPdfRow(items))
        .filter(Boolean)
        .join("\n");
}
function renderPdfRow(items) {
    const sorted = items.sort((left, right) => left.x - right.x);
    let row = "";
    let lastEnd = 0;
    for (const item of sorted) {
        const gap = item.x - lastEnd;
        if (row && gap > 2) {
            row += " ".repeat(Math.min(48, Math.max(1, Math.round(gap / 4))));
        }
        row += item.text;
        lastEnd = item.x + item.width;
    }
    return row.trimEnd();
}
function normalizePdfLayoutText(text) {
    return text
        .replace(/\r/g, "\n")
        .replace(/\u00a0/g, " ")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n{4,}/g, "\n\n\n")
        .trim();
}
function docbookXmlToHtml(xml) {
    let html = xml;
    html = html.replace(/<informaltable[^>]*>/gi, "<table>").replace(/<\/informaltable>/gi, "</table>");
    html = html.replace(/<tgroup[^>]*>/gi, "").replace(/<\/tgroup>/gi, "");
    html = html.replace(/<thead[^>]*>/gi, "<thead>").replace(/<\/thead>/gi, "</thead>");
    html = html.replace(/<tbody[^>]*>/gi, "<tbody>").replace(/<\/tbody>/gi, "</tbody>");
    html = html.replace(/<row[^>]*>/gi, "<tr>").replace(/<\/row>/gi, "</tr>");
    html = html.replace(/<entry[^>]*>/gi, "<td>").replace(/<\/entry>/gi, "</td>");
    html = html.replace(/<para[^>]*>/gi, "<p>").replace(/<\/para>/gi, "</p>");
    html = html.replace(/<emphasis[^>]*>/gi, "<strong>").replace(/<\/emphasis>/gi, "</strong>");
    html = html.replace(/<\?xml[^>]*\?>/gi, "");
    html = html.replace(/<\/?(?:article|sect\d|section|title|colspec|spanspec|colgroup)[^>]*>/gi, "");
    html = html.replace(/(<\/p>|<\/tr>|<\/table>)\s*(<p>|<tr>|<table>)/g, "$1$2");
    return html.trim();
}
function plainTextToHtml(text) {
    return normalizeText(text)
        .split(/\n{2,}/)
        .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`)
        .join("");
}
function safeRead(reader) {
    try {
        return reader();
    }
    catch {
        return "";
    }
}
function sanitizeFileName(fileName) {
    return fileName.replace(/[^\w .()-]/g, "_");
}
function ensureExtension(fileName, extension) {
    return fileName.toLowerCase().endsWith(extension) ? fileName : `${fileName}${extension}`;
}
function escapeHtml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
