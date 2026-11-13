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

export interface DocumentPreview {
  text: string;
  html: string;
}

export async function extractDocumentPreview(filePath: string, originalName: string): Promise<DocumentPreview> {
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

export function detectReportFileType(fileName: string): "docx" | "pdf" {
  const name = fileName.toLowerCase();
  if (name.endsWith(".docx") || name.endsWith(".doc")) return "docx";
  if (name.endsWith(".pdf")) return "pdf";
  throw new Error(`Unsupported file type: ${fileName}.`);
}

async function extractDocxPreview(filePath: string): Promise<DocumentPreview> {
  const [textResult, htmlResult] = await Promise.all([
    mammoth.extractRawText({ path: filePath }),
    mammoth.convertToHtml({ path: filePath })
  ]);

  return {
    text: normalizeText(textResult.value),
    html: htmlResult.value
  };
}

async function extractDocPreview(filePath: string, originalName: string): Promise<DocumentPreview> {
  const convertedByLibreOffice = await tryConvertDocWithLibreOffice(filePath, originalName);
  if (convertedByLibreOffice?.text) return convertedByLibreOffice;

  const convertedByTextutil = await tryConvertDocWithTextutil(filePath, originalName);
  if (convertedByTextutil?.text) return convertedByTextutil;

  const antiwordPreview = await tryExtractDocWithAntiword(filePath);
  if (antiwordPreview?.text) return antiwordPreview;

  return extractDocWithWordExtractor(filePath);
}

async function extractPdfPreview(filePath: string): Promise<DocumentPreview> {
  const buffer = await readFile(filePath);
  const result = await pdfParse(buffer, {
    pagerender: renderPdfPageWithLayout
  });
  const text = normalizePdfLayoutText(result.text);

  return {
    text,
    html: structuredTextToHtml(text)
  };
}

async function tryConvertDocWithLibreOffice(filePath: string, originalName: string): Promise<DocumentPreview | null> {
  for (const command of libreOfficeCandidates) {
    const converted = await tryConvertDoc(command, ["--headless", "--convert-to", "docx"], filePath, originalName);
    if (converted?.text) return converted;
  }

  return null;
}

async function tryConvertDocWithTextutil(filePath: string, originalName: string): Promise<DocumentPreview | null> {
  const tempDir = await mkdtemp(join(tmpdir(), "gmp-doc-"));
  const inputPath = join(tempDir, ensureExtension(sanitizeFileName(originalName), ".doc"));
  const outputPath = join(tempDir, `${basename(inputPath, ".doc")}.docx`);

  try {
    await copyFile(filePath, inputPath);
    await execFileAsync("/usr/bin/textutil", ["-convert", "docx", "-output", outputPath, inputPath]);
    return extractDocxPreview(outputPath);
  } catch {
    return null;
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

async function tryConvertDoc(
  command: string,
  args: string[],
  filePath: string,
  originalName: string
): Promise<DocumentPreview | null> {
  const tempDir = await mkdtemp(join(tmpdir(), "gmp-doc-"));
  const inputPath = join(tempDir, ensureExtension(sanitizeFileName(originalName), ".doc"));
  const outputPath = join(tempDir, `${basename(inputPath, ".doc")}.docx`);

  try {
    await copyFile(filePath, inputPath);

    if (command.endsWith("textutil")) {
      await execFileAsync(command, [...args, "-output", outputPath, inputPath]);
    } else {
      await execFileAsync(command, [...args, "--outdir", tempDir, inputPath]);
    }

    return extractDocxPreview(outputPath);
  } catch {
    return null;
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

async function tryExtractDocWithAntiword(filePath: string): Promise<DocumentPreview | null> {
  try {
    const { stdout } = await execFileAsync(antiwordPath, ["-x", "db", filePath]);
    if (!stdout.trim()) return null;

    const html = docbookXmlToHtml(stdout);
    const text = normalizeText(stdout.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));
    return { text, html };
  } catch {
    return null;
  }
}

async function extractDocWithWordExtractor(filePath: string): Promise<DocumentPreview> {
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
    return { text, html: structuredTextToHtml(text) };
  } catch {
    return { text: "", html: "" };
  }
}

async function renderPdfPageWithLayout(pageData: any): Promise<string> {
  const textContent = await pageData.getTextContent({
    normalizeWhitespace: false,
    disableCombineTextItems: false
  });
  const rows = new Map<number, Array<{ x: number; text: string; width: number }>>();

  for (const item of textContent.items) {
    const text = String(item.str ?? "").trim();
    if (!text) continue;

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

function renderPdfRow(items: Array<{ x: number; text: string; width: number }>): string {
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

function normalizePdfLayoutText(text: string): string {
  return text
    .replace(/\r/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

function docbookXmlToHtml(xml: string): string {
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

function plainTextToHtml(text: string): string {
  return normalizeText(text)
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`)
    .join("");
}

/**
 * Converts plain text to HTML while promoting heading-like lines to <h2> tags.
 * A line is treated as a heading if it is short (<= 80 chars), does not end
 * with sentence-ending punctuation, and is not purely numeric.
 * This gives extractSectionHtml enough structure to locate sections in .doc
 * and PDF documents that lack native HTML output.
 */
function structuredTextToHtml(text: string): string {
  const normalized = normalizeText(text);
  const blocks = normalized.split(/\n{2,}/);

  return blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";

      const lines = trimmed.split("\n");

      if (lines.length === 1 && isHeadingLine(trimmed)) {
        return `<h2>${escapeHtml(trimmed)}</h2>`;
      }

      const content = lines
        .map((line) => {
          if (isHeadingLine(line.trim())) {
            return `</p><h2>${escapeHtml(line.trim())}</h2><p>`;
          }
          return escapeHtml(line);
        })
        .join("<br />");

      return `<p>${content}</p>`;
    })
    .filter(Boolean)
    .join("");
}

function isHeadingLine(line: string): boolean {
  if (!line || line.length > 80) return false;
  if (/[.!?,;]$/.test(line)) return false;
  if (/^\d+$/.test(line)) return false;
  if (/^\d+\.\d+/.test(line)) return false;
  return true;
}

function safeRead(reader: () => string): string {
  try {
    return reader();
  } catch {
    return "";
  }
}

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^\w .()-]/g, "_");
}

function ensureExtension(fileName: string, extension: string): string {
  return fileName.toLowerCase().endsWith(extension) ? fileName : `${fileName}${extension}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
