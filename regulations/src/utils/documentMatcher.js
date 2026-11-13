/**
 * documentMatcher.js
 *
 * Centralized utility for finding pharmaceutical dossier documents
 * by type, tolerating the wide range of naming conventions used in
 * real-world NAFDAC submissions.
 *
 * Each document type has:
 *   - fileNameAliases  : keywords/phrases that appear in the file name itself
 *   - pathAliases      : keywords/phrases that appear anywhere in the file path
 *   - extensions       : accepted file extensions (null = any)
 *
 * Usage:
 *   import { findDocumentsByType, hasDocumentOfType } from '../utils/documentMatcher';
 *   const files = findDocumentsByType(allFiles, 'smpc');
 */

// ─── Normalise a string for loose matching ────────────────────────────────────
export const normalise = (str) =>
  (str || "")
    .toLowerCase()
    .replace(/\\/g, "/")          // backslash → forward slash
    .replace(/[_\-]/g, " ")       // underscores & dashes → space
    .replace(/\s+/g, " ")         // collapse whitespace
    .trim();

// ─── Check if a normalised string contains ANY of the given tokens ────────────
const hasAny = (normalised, tokens) =>
  tokens.some((tok) => normalised.includes(tok));

// ─── Normalise section numbers: "3.2.p.5.1" → also try "32p51", "3 2 p 5 1" ─
const sectionVariants = (ref) => {
  const lower = ref.toLowerCase();
  return [
    lower,
    lower.replace(/\./g, ""),           // 32p51
    lower.replace(/\./g, " "),          // 3 2 p 5 1
    lower.replace(/\./g, "-"),          // 3-2-p-5-1
    lower.replace(/\s+/g, ""),          // collapse any spaces
  ];
};

// ─── Document type registry ───────────────────────────────────────────────────
// Each entry:  { fileNameAliases, pathAliases, extensions, requireAll }
// requireAll: if true, ALL fileNameAliases must be present (AND logic); default OR
export const DOCUMENT_TYPES = {

  // ── Q1 ── DMS Portal / Cover documents ─────────────────────────────────────
  coverLetter: {
    fileNameAliases: ["cover letter", "covering letter", "cover ltr", "coverletter"],
    pathAliases: ["module 1", "1.0", "cover"],
    extensions: [".pdf", ".doc", ".docx"],
  },

  // ── Q4 ── API / CEP / CoA ──────────────────────────────────────────────────
  cep: {
    fileNameAliases: [
      "cep", "certificate of suitability", "cert of suitability",
      "certificate suitability", "european pharmacopoeia",
      "edqm", "cep certificate",
    ],
    pathAliases: ["1.2.15", "1215", "cep", "certificate of suitability"],
    extensions: [".pdf", ".doc", ".docx"],
  },
  apiCoA: {
    fileNameAliases: [
      "certificate of analysis", "coa", "c.o.a", "batch analysis",
      "analytical certificate", "api coa", "drug substance coa",
      "iso 17025", "accredited laboratory",
    ],
    pathAliases: [
      "3.2.s.4.4", "32s44", "batch anal", "coa", "certificate of analysis",
    ],
    extensions: [".pdf"],
  },

  // ── Q5 ── SmPC ─────────────────────────────────────────────────────────────
  smpc: {
    fileNameAliases: [
      "smpc", "spc", "summary of product characteristics",
      "summary product characteristics",
      "product characteristics", "prescribing information",
      "product monograph", "spc document", "smpc document",
    ],
    pathAliases: [
      "1.3.1", "131", "smpc", "spc",
      "summary of product", "product characteristics",
    ],
    extensions: [".pdf", ".doc", ".docx"],
  },

  // ── Q7 ── QOS (Quality Overall Summary) ────────────────────────────────────
  qos: {
    fileNameAliases: [
      "qos", "q.o.s", "quality overall summary",
      "quality overall summury",          // common misspelling in Nigerian dossiers
      "qos pd", "qos-pd", "qospd",
      "quality overall summ",             // truncated
      "qual overall sum",
    ],
    pathAliases: [
      "2.3", "module 2", "qos", "quality overall",
    ],
    extensions: [".doc", ".docx"],        // must be Word
  },

  // ── Q7 ── QIS (Quality Information Summary) ────────────────────────────────
  qis: {
    fileNameAliases: [
      "qis", "q.i.s", "quality information summary",
      "quality information summ",
      "qual info summary", "qual info sum",
      "qis document", "qis form",
    ],
    pathAliases: [
      "1.4.2", "142", "qis", "quality information",
    ],
    extensions: [".doc", ".docx"],        // must be Word
  },

  // ── Q8 ── FPP Specification ─────────────────────────────────────────────────
  fppSpecification: {
    fileNameAliases: [
      "specification", "spec", "fpp spec", "fpp specification",
      "finished product spec", "finished product specification",
      "product specification", "drug product spec",
      "3.2.p.5.1", "32p51", "p51",
    ],
    pathAliases: [
      "3.2.p.5.1", "32p51", "specification", "control of drug product",
    ],
    extensions: [".pdf"],
  },

  // ── Q9 ── BTIF / BAF (Bioequivalence Trial / Availability Info Form) ────────
  btif: {
    fileNameAliases: [
      "btif", "b.t.i.f",
      "bioequivalence trial information form",
      "bioequivalence trial info",
      "bioequivalence technical information",
      "be trial information", "be technical info",
      "be trial info form",
      "baf", "b.a.f",
      "bioavailability form", "bioavailability information form",
      "biowaiver technical information", "biowaiver trial information",
      "bw trial information", "bw technical information",
      "be information form",
    ],
    pathAliases: [
      "1.4.1", "141", "btif", "baf",
      "bioequivalence trial", "bioavailability form",
    ],
    extensions: [".doc", ".docx"],        // must be Word
  },

  // ── Q9 ── Module 5 BE / BW Study data ─────────────────────────────────────
  beStudyData: {
    fileNameAliases: [
      "be study", "bioequivalence study", "bioequivalence report",
      "comparative ba", "comparative be", "ba be study",
      "bioavailability study", "dissolution profile",
      "5.3.1", "5312",
    ],
    pathAliases: [
      "module 5", "5.3", "5.3.1", "bioequivalence", "bioavailability",
      "comparative ba", "be study",
    ],
    extensions: [".pdf"],
  },

  // ── Q11 ── Batch Analysis / Batch Consistency ──────────────────────────────
  batchAnalysis: {
    fileNameAliases: [
      "batch analysis", "batch anal", "batch test", "batch results",
      "3.2.p.5.4", "32p54",
    ],
    pathAliases: [
      "3.2.p.5.4", "32p54", "batch anal", "batch analysis",
    ],
    extensions: [".pdf"],
  },

  // ── Q11/Q12 ── Executed BMR (Batch Manufacturing Record) ───────────────────
  executedBMR: {
    fileNameAliases: [
      "executed bmr", "executed batch manufacturing record",
      "executed batch record", "executed production record",
      "ebmr", "executed bmr", "batch manufacturing record executed",
      "3.2.r.1.1", "32r11", "r1.1",
      "executed production document",
    ],
    pathAliases: [
      "3.2.r.1.1", "32r11", "executed", "executed bmr",
      "executed production", "executed batch",
    ],
    extensions: [".pdf"],
  },

  // ── Q13 ── Master / Blank BMR ───────────────────────────────────────────────
  masterBMR: {
    fileNameAliases: [
      "blank bmr", "master bmr", "master batch manufacturing record",
      "blank batch manufacturing record",
      "proposed bmr", "mbmr", "master production record",
      "master batch record", "blank batch record",
      "3.2.r.1.2", "32r12", "r1.2",
      "master production document",
    ],
    pathAliases: [
      "3.2.r.1.2", "32r12", "blank bmr", "master bmr",
      "master production", "master batch",
    ],
    extensions: [".pdf"],
  },

  // ── Q14 ── Comparative Dissolution Profile ─────────────────────────────────
  dissolutionProfile: {
    fileNameAliases: [
      "dissolution", "dissolution profile", "comparative dissolution",
      "cdp", "c.d.p", "comparative dissolution profile",
      "f2", "f2 similarity", "similarity factor",
      "dissolution study", "dissolution data",
    ],
    pathAliases: [
      "3.2.p.2", "32p2", "dissolution", "5.3.1.2", "5312",
      "pharmaceutical development",
    ],
    extensions: [".pdf"],
  },

  // ── Q15 ── Stability Data ──────────────────────────────────────────────────
  stabilityData: {
    fileNameAliases: [
      "stability data", "stability study", "stability report",
      "accelerated stability", "long term stability", "long-term stability",
      "real time stability", "real-time stability",
      "stability results", "stability testing",
      "3.2.p.8.3", "32p83", "p8.3",
      "zone ivb", "zone iv", "30c", "40c",
    ],
    pathAliases: [
      "3.2.p.8.3", "32p83", "stability", "accelerated", "long term",
    ],
    extensions: [".pdf"],
  },

  // ── Q16/Q17/Q20 ── Process Validation ─────────────────────────────────────
  processValidation: {
    fileNameAliases: [
      "process validation", "process validation report", "pvr",
      "p.v.r", "validation report", "validation protocol",
      "validation study", "consecutive batches",
      "3.2.p.3.5", "32p35",
      "media fill", "aseptic process",
    ],
    pathAliases: [
      "3.2.p.3.5", "32p35", "process validation", "validation report",
      "pvr",
    ],
    extensions: [".pdf"],
  },

  // ── Additional commonly needed types ───────────────────────────────────────
  applicationLetter: {
    fileNameAliases: [
      "application letter", "app letter", "application ltr",
    ],
    pathAliases: ["1.2.1", "121", "application letter"],
    extensions: [".pdf"],
  },
  gmpCertificate: {
    fileNameAliases: [
      "gmp certificate", "gmp cert", "good manufacturing practice",
      "gmp inspection", "manufacturing certificate",
    ],
    pathAliases: ["1.2.8", "128", "gmp"],
    extensions: [".pdf"],
  },
  copp: {
    fileNameAliases: [
      "copp", "c.o.p.p", "certificate of pharmaceutical product",
      "cert pharmaceutical product",
    ],
    pathAliases: ["1.2.7", "127", "copp", "pharmaceutical product cert"],
    extensions: [".pdf"],
  },
};

// ─── Core finder ─────────────────────────────────────────────────────────────
/**
 * Find files from `allFiles` that match the given document type.
 *
 * @param {Array}  allFiles  - flat list of file objects: { path, name, fullPath, ... }
 * @param {string} docType   - key from DOCUMENT_TYPES
 * @param {Object} options
 *   @param {boolean} options.strictExtension  - enforce extension list (default true)
 *   @param {boolean} options.searchName       - match against file name (default true)
 *   @param {boolean} options.searchPath       - match against full path (default true)
 * @returns {Array} matching file objects, sorted by match quality (best first)
 */
export const findDocumentsByType = (allFiles, docType, options = {}) => {
  const def = DOCUMENT_TYPES[docType];
  if (!def) return [];

  const {
    strictExtension = true,
    searchName = true,
    searchPath = true,
  } = options;

  const results = [];

  for (const file of allFiles) {
    const name    = normalise(file.name || "");
    const path    = normalise(file.fullPath || file.path || "");
    const ext     = (file.name || "").toLowerCase().match(/\.[^/.]+$/)?.[0] || "";

    // Extension check
    if (strictExtension && def.extensions) {
      if (!def.extensions.includes(ext)) continue;
    }

    let score = 0;

    // Name alias matching
    if (searchName && def.fileNameAliases) {
      for (const alias of def.fileNameAliases) {
        if (name.includes(normalise(alias))) {
          score += 2;  // name match is weighted higher
          break;
        }
      }
    }

    // Path alias matching (folder structure)
    if (searchPath && def.pathAliases) {
      for (const alias of def.pathAliases) {
        const variants = sectionVariants(alias);
        if (variants.some((v) => path.includes(v))) {
          score += 1;
          break;
        }
      }
    }

    if (score > 0) {
      results.push({ ...file, _matchScore: score, _matchedType: docType });
    }
  }

  // Sort best match first
  return results.sort((a, b) => b._matchScore - a._matchScore);
};

/**
 * Returns true if at least one matching file is found.
 */
export const hasDocumentOfType = (allFiles, docType, options = {}) =>
  findDocumentsByType(allFiles, docType, options).length > 0;

/**
 * Find files matching any of multiple document types.
 * Returns an object keyed by docType.
 */
export const findMultipleTypes = (allFiles, docTypes, options = {}) => {
  const result = {};
  for (const t of docTypes) {
    result[t] = findDocumentsByType(allFiles, t, options);
  }
  return result;
};

/**
 * Given a moduleRef string like "Module 1.2.15 / 3.2.S.4.4",
 * return all files whose path contains any of the section refs.
 */
export const findFilesByModuleRef = (allFiles, moduleRef) => {
  const refs = moduleRef.split("/").map((r) => r.trim()).filter(Boolean);
  const results = [];
  const seen = new Set();

  for (const file of allFiles) {
    const path = normalise(file.fullPath || file.path || "");
    for (const ref of refs) {
      const variants = sectionVariants(ref);
      if (variants.some((v) => path.includes(v))) {
        const key = file.path || file.fullPath;
        if (!seen.has(key)) {
          seen.add(key);
          results.push(file);
        }
        break;
      }
    }
  }
  return results;
};
