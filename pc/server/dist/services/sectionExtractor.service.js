import { normalizeText } from "../utils/textNormalize.js";
const inspectedSiteHeadings = [
    "Inspected site(s)",
    "Inspected sites",
    "Inspected site",
    "Site inspected",
    "Manufacturing site",
    "Name and address of inspected site",
    "Name and address of manufacturing site"
];
const inspectedSiteEndHeadings = [
    "Activities carried out by company",
    "Inspection Details",
    "Date of Inspection",
    "Type of Inspection",
    "Inspectors",
    "References",
    "Introduction"
];
const deficiencyHeadings = [
    "List of Deficiencies classified into critical, major and others",
    "List of Deficiencies",
    "Deficiencies",
    "Deficiency List",
    "Critical",
    "Major",
    "Others"
];
const deficiencyEndHeadings = [
    "Recommendations",
    "Recommendation",
    "Summary and Conclusions",
    "Summary and Conclusion",
    "Conclusion",
    "Distribution of Report",
    "Annexes attached",
    "Name:",
    "Signature:"
];
const summaryHeadings = ["Summary and Conclusions", "Summary and Conclusion", "Summary/Conclusion", "Conclusion", "Conclusions"];
const summaryEndHeadings = ["Name:", "Designation:", "Signature:", "Date:", "Distribution of Report", "Annexes attached"];
export function extractReportSections(text, html) {
    const warnings = [];
    const normalized = normalizeText(text);
    const inspectedSite = extractSection(normalized, html, "Inspected site(s)", inspectedSiteHeadings, inspectedSiteEndHeadings);
    if (!inspectedSite.found) {
        warnings.push("Inspected site section could not be found. Please review the full document manually.");
    }
    const rawDeficiencies = extractDeficiencySection(normalized, html);
    if (!rawDeficiencies.found) {
        warnings.push("List of Deficiencies section could not be found. Please review the full document manually.");
    }
    const summaryAndConclusions = extractSection(normalized, html, "Summary and Conclusions", summaryHeadings, summaryEndHeadings);
    if (!summaryAndConclusions.found) {
        warnings.push("Summary and Conclusions section could not be found. Please review the full document manually.");
    }
    return {
        sections: {
            inspectedSite,
            deficiencies: rawDeficiencies,
            summaryAndConclusions
        },
        warnings
    };
}
export function extractInspectedSiteDetails(section) {
    if (!section.found)
        return { facilityName: "", address: "" };
    const lines = section.text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .filter((line) => !/^(page \d+|confidential|do not photocopy)/i.test(line));
    const facilityName = lines[0]?.replace(/[,.]+$/, "").trim() ?? "";
    const addressLines = lines
        .slice(1)
        .filter((line) => !/^(phone|email|corporate office|tel|fax|website)\b/i.test(line))
        .slice(0, 4);
    return {
        facilityName,
        address: normalizeText(addressLines.join("\n"))
    };
}
function extractSection(text, html, title, startHeadings, endHeadings) {
    const match = findHeading(text, startHeadings);
    if (!match)
        return { title, found: false, text: "", html: "" };
    const end = findNextHeading(text, endHeadings, match.contentStart);
    const sectionText = normalizeText(text.slice(match.contentStart, end?.start ?? text.length));
    const sectionHtml = html ? extractSectionHtml(html, startHeadings, endHeadings) : plainSectionToHtml(sectionText);
    return {
        title,
        found: Boolean(sectionText),
        text: sectionText,
        html: sectionHtml,
        startHeading: match.heading,
        endHeading: end?.heading
    };
}
function extractDeficiencySection(text, html) {
    const section = extractSection(text, html, "List of Deficiencies", deficiencyHeadings, deficiencyEndHeadings);
    if (!section.found) {
        return {
            title: "List of Deficiencies",
            found: false,
            text: "",
            html: "",
            rawText: "",
            deficiencyHtml: "",
            critical: "",
            major: "",
            others: ""
        };
    }
    const deficiencyHtml = section.html || plainDeficiencyToHtml(section.text);
    const parserInput = ["Critical", "Major", "Others"].includes(section.startHeading ?? "")
        ? `${section.startHeading}\n${section.text}`
        : section.text;
    const parsed = parseDeficiencies(parserInput);
    return {
        title: "List of Deficiencies",
        found: true,
        rawText: section.text,
        deficiencyHtml,
        text: section.text,
        html: section.html,
        critical: parsed.critical,
        major: parsed.major,
        others: parsed.others,
        startHeading: section.startHeading,
        endHeading: section.endHeading
    };
}
function parseDeficiencies(rawText) {
    const critical = extractBetweenCategory(rawText, "Critical", ["Major", "Others"]);
    const major = extractBetweenCategory(rawText, "Major", ["Others", "Other"]);
    const others = extractBetweenCategory(rawText, "Others", []);
    if (critical || major || others) {
        return {
            critical: critical || "Needs manual review",
            major: major || "Needs manual review",
            others: others || "Needs manual review"
        };
    }
    return {
        critical: "Needs manual review",
        major: "Needs manual review",
        others: "Needs manual review"
    };
}
function extractBetweenCategory(text, heading, nextHeadings) {
    const lines = text.split("\n");
    const startIndex = lines.findIndex((line) => isLooseHeading(line, heading));
    if (startIndex === -1)
        return "";
    let endIndex = lines.length;
    for (let index = startIndex + 1; index < lines.length; index += 1) {
        if (nextHeadings.some((nextHeading) => isLooseHeading(lines[index], nextHeading))) {
            endIndex = index;
            break;
        }
    }
    return normalizeText(lines
        .slice(startIndex + 1, endIndex)
        .filter((line) => line.trim().toLowerCase() !== "s/n")
        .join("\n"));
}
function findHeading(text, headings) {
    const candidates = headings
        .flatMap((heading) => findAllHeadingMatches(text, heading))
        .sort((a, b) => a.start - b.start);
    return candidates[0] ?? null;
}
function findNextHeading(text, headings, fromIndex) {
    const candidates = headings
        .flatMap((heading) => findAllHeadingMatches(text.slice(fromIndex), heading).map((match) => ({
        ...match,
        start: match.start + fromIndex,
        contentStart: match.contentStart + fromIndex
    })))
        .sort((a, b) => a.start - b.start);
    return candidates[0] ?? null;
}
function findAllHeadingMatches(text, heading) {
    const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\ /g, "\\s+");
    const pattern = new RegExp(`(^|\\n)\\s*(?:\\d+(?:\\.\\d+)*\\s*)?${escapedHeading}\\s*:?\\s*(?=\\n|$)`, "gi");
    const matches = [];
    let match;
    while ((match = pattern.exec(text)) !== null) {
        const start = match.index + (match[1] ? match[1].length : 0);
        matches.push({ start, contentStart: pattern.lastIndex, heading });
    }
    return matches;
}
function isLooseHeading(line, heading) {
    const normalizedLine = line.replace(/^\s*\d+(?:\.\d+)*\s*/, "").replace(/:$/, "").trim().toLowerCase();
    return normalizedLine === heading.toLowerCase() || normalizedLine.startsWith(`${heading.toLowerCase()} `);
}
function plainDeficiencyToHtml(text) {
    if (!text.trim())
        return "";
    return `<pre class="pdf-layout-text">${escapeHtml(text)}</pre>`;
}
function plainSectionToHtml(text) {
    if (!text.trim())
        return "";
    return `<pre class="pdf-layout-text">${escapeHtml(text)}</pre>`;
}
function escapeHtml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
function extractSectionHtml(html, startHeadings, endHeadings) {
    const lower = html.toLowerCase();
    let startIndex = -1;
    for (const heading of startHeadings) {
        const idx = lower.indexOf(heading.toLowerCase());
        if (idx !== -1) {
            startIndex = findSectionHtmlStart(html, idx);
            break;
        }
    }
    if (startIndex === -1)
        return "";
    let endIndex = html.length;
    for (const heading of endHeadings) {
        const idx = lower.indexOf(heading.toLowerCase(), startIndex + 1);
        if (idx !== -1) {
            const blockStart = findSectionHtmlStart(html, idx);
            if (blockStart < endIndex)
                endIndex = blockStart;
        }
    }
    let fragment = html.slice(startIndex, endIndex).trim();
    if (fragment.includes("<tr") && !fragment.trimStart().startsWith("<table")) {
        fragment = `<table><tbody>${fragment}</tbody></table>`;
    }
    return fragment;
}
function findSectionHtmlStart(html, fromIndex) {
    const rowStart = html.lastIndexOf("<tr", fromIndex);
    const rowEnd = html.lastIndexOf("</tr>", fromIndex);
    if (rowStart !== -1 && rowStart > rowEnd && fromIndex - rowStart < 1200) {
        return rowStart;
    }
    return findOpeningBlockTag(html, fromIndex);
}
function findOpeningBlockTag(html, fromIndex) {
    const blockPattern = /<(p|h[1-6]|div)[\s>]/i;
    for (let i = fromIndex; i >= 0; i--) {
        if (html[i] === "<") {
            const slice = html.slice(i, i + 10);
            if (blockPattern.test(slice))
                return i;
        }
    }
    return fromIndex;
}
