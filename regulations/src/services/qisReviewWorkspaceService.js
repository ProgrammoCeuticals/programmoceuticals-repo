import mammoth from "mammoth";

export const REVIEW_SECTION_SCHEMA = [
  {
    id: "foreword",
    navLabel: "Foreword",
    number: "Pre",
    title: "Foreword",
    pattern: /\bFOREWORD\b/i,
    qosPattern: null,
  },
  {
    id: "introduction",
    navLabel: "Introduction",
    number: "Intro",
    title: "Introduction",
    pattern: /^INTRODUCTION$/i,
  },
  {
    id: "2.3.s",
    navLabel: "2.3.S API",
    number: "2.3.S",
    title: "Drug Substance / API",
    pattern: /2\.3\.?\s*S\s*DRUG SUBSTANCE/i,
  },
  {
    id: "2.3.s.2",
    navLabel: "2.3.S.2 Manufacture",
    number: "2.3.S.2",
    title: "Manufacture",
    pattern: /2\.3\.?\s*S\.?\s*2\s*Manufacture/i,
  },
  {
    id: "2.3.s.4",
    navLabel: "2.3.S.4 Control of API",
    number: "2.3.S.4",
    title: "Control of API",
    pattern: /2\.3\.?\s*S\.?\s*4\s*Control of the API/i,
  },
  {
    id: "2.3.s.6",
    navLabel: "2.3.S.6 Container Closure",
    number: "2.3.S.6",
    title: "API Container Closure",
    pattern: /2\.3\.?\s*S\.?\s*6\s*Container Closure System/i,
  },
  {
    id: "2.3.s.7",
    navLabel: "2.3.S.7 Stability",
    number: "2.3.S.7",
    title: "API Stability",
    pattern: /2\.3\.?\s*S\.?\s*7\s*Stability/i,
  },
  {
    id: "2.3.p.1",
    navLabel: "2.3.P.1 Composition",
    number: "2.3.P.1",
    title: "Description and Composition",
    pattern: /2\.3\.?\s*P\.?\s*1\s*Description and Composition of the FPP/i,
  },
  {
    id: "2.3.p.2.2.1",
    navLabel: "2.3.P.2.2.1 Formulation",
    number: "2.3.P.2.2.1",
    title: "Formulation Development",
    pattern: /2\.3\.?\s*P\.?\s*2\.?\s*2\.?\s*1\s*Formulation Development/i,
  },
  {
    id: "2.3.p.3",
    navLabel: "2.3.P.3 Manufacture",
    number: "2.3.P.3",
    title: "Manufacture",
    pattern: /2\.3\.?\s*P\.?\s*3\s*Manufacture/i,
  },
  {
    id: "2.3.p.5",
    navLabel: "2.3.P.5 Specifications",
    number: "2.3.P.5",
    title: "Control of FPP",
    pattern: /2\.3\.?\s*P\.?\s*5\s*Control of FPP/i,
  },
  {
    id: "2.3.p.7",
    navLabel: "2.3.P.7 Container Closure",
    number: "2.3.P.7",
    title: "FPP Container Closure",
    pattern: /2\.3\.?\s*P\.?\s*7\s*Container Closure System/i,
  },
  {
    id: "2.3.p.8",
    navLabel: "2.3.P.8 Stability",
    number: "2.3.P.8",
    title: "Stability",
    pattern: /2\.3\.?\s*P\.?\s*8\s*Stability/i,
  },
  {
    id: "written-commitments",
    navLabel: "Commitments",
    number: "Commit",
    title: "Written Commitments",
    pattern: /WRITTEN COMMITMENTS OF THE MANUFACTURER/i,
    qosPattern: null,
  },
  {
    id: "change-history",
    navLabel: "Change History",
    number: "History",
    title: "Change History",
    pattern: /Change History/i,
    qosPattern: null,
  },
];

const normalizeText = (value = "") =>
  String(value)
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const stripHtml = (html = "") => {
  if (typeof DOMParser === "undefined") {
    return html;
  }

  const doc = new DOMParser().parseFromString(html, "text/html");
  return normalizeText(doc.body.textContent || "");
};

const sanitizeFragment = (html = "") => {
  if (!html || typeof DOMParser === "undefined") {
    return html;
  }

  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
  doc.querySelectorAll("script,style").forEach((node) => node.remove());

  doc.querySelectorAll("*").forEach((node) => {
    [...node.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      if (!["rowspan", "colspan"].includes(name)) {
        node.removeAttribute(attribute.name);
      }
    });
  });

  return doc.body.innerHTML;
};

const createEmptySection = (definition) => ({
  ...definition,
  found: false,
  html: "",
  text: "",
  preview: "",
  wordCount: 0,
  tableCount: 0,
});

const matchesSection = (text, definition, docRole) => {
  const pattern = docRole === "qos" ? definition.qosPattern ?? definition.pattern : definition.pattern;
  if (!pattern || !text) {
    return false;
  }

  const normalized = normalizeText(text);
  if (!normalized || normalized.length > 260) {
    return false;
  }

  return pattern.test(normalized);
};

const buildSectionMapFromHtml = (html, docRole) => {
  if (typeof DOMParser === "undefined") {
    return REVIEW_SECTION_SCHEMA.map(createEmptySection);
  }

  const doc = new DOMParser().parseFromString(html, "text/html");
  const sections = REVIEW_SECTION_SCHEMA.map(createEmptySection);
  const elements = [...doc.body.children];
  let currentIndex = -1;

  elements.forEach((element) => {
    const text = normalizeText(element.textContent || "");

    const nextIndex = sections.findIndex(
      (section, index) => index > currentIndex && matchesSection(text, section, docRole)
    );

    if (nextIndex !== -1) {
      currentIndex = nextIndex;
    }

    if (currentIndex === -1) {
      return;
    }

    const section = sections[currentIndex];
    section.found = true;
    section.html += element.outerHTML;
    section.text += `${section.text ? "\n" : ""}${text}`;
    if (element.tagName === "TABLE") {
      section.tableCount += 1;
    }
  });

  return sections.map((section) => {
    const cleanedText = normalizeText(section.text);
    const sanitizedHtml = sanitizeFragment(section.html);
    return {
      ...section,
      html: sanitizedHtml,
      text: cleanedText,
      preview: cleanedText.slice(0, 520),
      wordCount: cleanedText ? cleanedText.split(/\s+/).length : 0,
    };
  });
};

const extractDocumentMeta = (file, sections) => {
  const foundSections = sections.filter((section) => section.found).length;
  return {
    fileName: file.name,
    fileSize: file.size,
    lastModified: file.lastModified,
    extractedAt: new Date().toISOString(),
    foundSections,
    totalSections: sections.length,
  };
};

export const parseRegulatoryDocx = async (file, docRole) => {
  if (!file) {
    throw new Error("No file selected.");
  }

  const extension = file.name.toLowerCase().split(".").pop();
  if (extension !== "docx") {
    throw new Error("For now, upload Word .docx files to preserve QIS/QOS structure.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const [htmlResult, textResult] = await Promise.all([
    mammoth.convertToHtml({ arrayBuffer }),
    mammoth.extractRawText({ arrayBuffer }),
  ]);

  const html = htmlResult.value || "";
  const rawText = normalizeText(textResult.value || stripHtml(html));
  const sections = buildSectionMapFromHtml(html, docRole);

  return {
    docRole,
    file,
    meta: extractDocumentMeta(file, sections),
    html,
    rawText,
    sections,
  };
};

export const getSectionById = (documentData, sectionId) =>
  documentData?.sections?.find((section) => section.id === sectionId) || null;

export const buildSectionFindings = ({ qisSection, qosSection, hasQosUpload }) => {
  const findings = [];

  if (!qisSection?.found) {
    findings.push({
      severity: "major",
      code: "qis-missing-section",
      message: "This section was not located in the uploaded QIS document.",
    });
  }

  if (qisSection?.found && qisSection.wordCount < 12) {
    findings.push({
      severity: "minor",
      code: "qis-thin-section",
      message: "This QIS section looks sparse and may be incomplete.",
    });
  }

  if (hasQosUpload && !qosSection?.found) {
    findings.push({
      severity: "major",
      code: "qos-missing-reference",
      message: "The corresponding QOS section was not located. Review the uploaded QOS structure or section numbering.",
    });
  }

  if (qisSection?.found && qosSection?.found && qosSection.wordCount > 0 && qisSection.wordCount > qosSection.wordCount) {
    findings.push({
      severity: "note",
      code: "qis-longer-than-qos",
      message: "This QIS section is longer than the corresponding QOS section. Verify that the uploaded files are the intended versions.",
    });
  }

  return findings;
};
