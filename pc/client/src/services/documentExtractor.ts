import * as mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export interface ExtractedDocument {
  text: string;
  html: string;
}

export async function extractDocument(file: File): Promise<ExtractedDocument> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".docx")) return extractDocx(file);
  if (name.endsWith(".pdf")) return extractPdf(file);
  throw new Error(`Cannot extract "${file.name}" client-side. Only .docx and .pdf are supported.`);
}

export function canExtractClientSide(file: File): boolean {
  const name = file.name.toLowerCase();
  return name.endsWith(".docx") || name.endsWith(".pdf");
}

async function extractDocx(file: File): Promise<ExtractedDocument> {
  const arrayBuffer = await file.arrayBuffer();
  const [textResult, htmlResult] = await Promise.all([
    mammoth.extractRawText({ arrayBuffer }),
    mammoth.convertToHtml({ arrayBuffer })
  ]);
  return {
    text: normalizeText(textResult.value),
    html: htmlResult.value
  };
}

async function extractPdf(file: File): Promise<ExtractedDocument> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pageTexts: string[] = [];
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    pageTexts.push(renderPageWithLayout(content.items as PdfTextItem[]));
  }

  const text = normalizeText(pageTexts.join("\n\n"));
  return { text, html: structuredTextToHtml(text) };
}

interface PdfTextItem {
  str: string;
  transform: number[];
  width: number;
}

function renderPageWithLayout(items: PdfTextItem[]): string {
  const rows = new Map<number, Array<{ x: number; text: string; width: number }>>();

  for (const item of items) {
    const text = item.str?.trim();
    if (!text) continue;
    const x = item.transform[4] ?? 0;
    const y = item.transform[5] ?? 0;
    const width = item.width ?? text.length * 4;
    const rowKey = Math.round(y / 2) * 2;
    const row = rows.get(rowKey) ?? [];
    row.push({ x, text, width });
    rows.set(rowKey, row);
  }

  return [...rows.entries()]
    .sort(([a], [b]) => b - a)
    .map(([, rowItems]) => {
      const sorted = rowItems.sort((a, b) => a.x - b.x);
      let line = "";
      let lastEnd = 0;
      for (const item of sorted) {
        const gap = item.x - lastEnd;
        if (line && gap > 2) line += " ".repeat(Math.min(48, Math.max(1, Math.round(gap / 4))));
        line += item.text;
        lastEnd = item.x + item.width;
      }
      return line.trimEnd();
    })
    .filter(Boolean)
    .join("\n");
}

function structuredTextToHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      const lines = trimmed.split("\n");
      if (lines.length === 1 && isHeadingLine(trimmed)) {
        return `<h2>${escapeHtml(trimmed)}</h2>`;
      }
      const content = lines
        .map((line) =>
          isHeadingLine(line.trim())
            ? `</p><h2>${escapeHtml(line.trim())}</h2><p>`
            : escapeHtml(line)
        )
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

function normalizeText(text: string): string {
  return text
    .replace(/\r/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
