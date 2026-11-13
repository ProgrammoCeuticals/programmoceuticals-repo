import React, { useState, useMemo, useRef, useCallback } from "react";
import * as XLSX from "xlsx";
import nafdacRegistry from "../data/nafdac_registry_complete.json";
import acceptedDossiers from "../data/accepted_dossiers.json";

const ITEMS_PER_PAGE = 50;

const normalize = (str) => (str || "").toLowerCase().trim();
const stripBrackets = (str) => (str || "").replace(/^\((.*)\)$/, "$1").trim();

// Dice coefficient fuzzy match — returns 0 to 1
function diceSimilarity(a, b) {
  a = normalize(stripBrackets(a));
  b = normalize(stripBrackets(b));
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;
  const getBigrams = (s) => {
    const bigrams = new Map();
    for (let i = 0; i < s.length - 1; i++) {
      const bg = s.slice(i, i + 2);
      bigrams.set(bg, (bigrams.get(bg) || 0) + 1);
    }
    return bigrams;
  };
  const aB = getBigrams(a);
  const bB = getBigrams(b);
  let intersection = 0;
  for (const [bg, count] of aB) {
    if (bB.has(bg)) intersection += Math.min(count, bB.get(bg));
  }
  return (2 * intersection) / (a.length - 1 + b.length - 1);
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const INGREDIENT_THRESHOLD = 0.82;
const MFR_THRESHOLD = 0.85;
const MFR_ADDRESS_THRESHOLD = 0.70;

const SALT_WORDS = new Set([
  "trihydrate","monohydrate","anhydrous","dihydrate","hemihydrate",
  "sodium","potassium","calcium","magnesium","zinc","aluminium","aluminum",
  "hydrochloride","hcl","sulphate","sulfate","phosphate","maleate",
  "tartrate","citrate","acetate","gluconate","lactate","fumarate",
  "mesylate","tosylate","besylate","bromide","chloride","nitrate",
  "oxalate","stearate","succinate","valerate","benzoate","palmitate",
]);

const NOISE = new Set([
  "bp","usp","ip","ph","int","eq","eqv","to","equivalent",
  "sterile","lyophilized","lyophilised","for","oral","each","vial",
  "contains","combipack","combi","kit","pack","active","ingredient",
  "excipient","excipients","qs","in","house","as","and","with",
  "of","the","per","base","free","form","inj",
  "mg","mcg","iu","ml","g",
  "tablet","tablets","tab","tabs","capsule","capsules","cap","caps",
  "injection","injections","suspension","syrup","solution","drops",
  "cream","ointment","gel","lotion","powder","granules","inhaler",
]);

const DOSAGE_CANON = {
  "tablets":"tablet","tab":"tablet","tabs":"tablet",
  "capsules":"capsule","cap":"capsule","caps":"capsule",
  "hard gelatin capsule":"capsule","oral capsules":"capsule",
  "injections":"injection","inj":"injection",
  "powder for injection":"injection","powder for oral suspension":"suspension",
  "oral suspension":"suspension","oral drop":"oral drops",
  "drop":"oral drops","drops":"oral drops",
  "syrup":"oral solution","solution":"oral solution",
  "susp":"suspension",
};

const HIGH_RISK_DOSAGE_FORMS = new Set([
  "syrup", "oral solution", "solution", "oral liquid", "liquid",
  "elixir", "linctus", "suspension", "oral suspension", "dry suspension",
]);

function isHighRiskDosage(dosage_form) {
  const c = canonDosage(dosage_form);
  return HIGH_RISK_DOSAGE_FORMS.has(c) || HIGH_RISK_DOSAGE_FORMS.has(clean(dosage_form));
}

const STERILE_DOSAGE_FORMS = new Set([
  "eye drops", "ear drops", "nasal drops", "oral drops", "drops",
  "ophthalmic solution", "ophthalmic suspension", "ophthalmic ointment", "eye ointment",
  "injection", "solution for injection", "powder for injection", "infusion", "iv infusion",
  "nasal spray", "nasal solution", "inhalation solution", "nebuliser solution",
]);

function isSterileDosage(dosage_form) {
  const c = canonDosage(dosage_form);
  return STERILE_DOSAGE_FORMS.has(c) || STERILE_DOSAGE_FORMS.has(clean(dosage_form));
}

function findSterileDossierMatch(row) {
  const rowMfrCanon = canonMfr(row.manufacturer_name || "");
  const rowAddrCanon = canonMfr(row.manufacturer_address || "");
  if (!rowMfrCanon || !rowAddrCanon || !row.generic_name || !row.dosage_form) return null;
  for (const d of acceptedDossiers) {
    const dMfrCanon = canonMfr(d.manufacturer_name || "");
    const dAddrCanon = canonMfr(d.manufacturer_address || "");
    if (!dMfrCanon || !dAddrCanon || !d.generic_name || !d.dosage_form) continue;
    const nameOk = diceSimilarity(dMfrCanon, rowMfrCanon) >= MFR_THRESHOLD
      || dMfrCanon.includes(rowMfrCanon) || rowMfrCanon.includes(dMfrCanon);
    if (!nameOk) continue;
    const addrOk = diceSimilarity(dAddrCanon, rowAddrCanon) >= MFR_ADDRESS_THRESHOLD
      || dAddrCanon.includes(rowAddrCanon) || rowAddrCanon.includes(dAddrCanon);
    if (!addrOk) continue;
    if (!genericNamesMatch(row.generic_name, d.generic_name)) continue;
    if (canonDosage(row.dosage_form) !== canonDosage(d.dosage_form)) continue;
    return d;
  }
  return null;
}

function findSterileNafdacMatch(row) {
  if (!row.manufacturer_name || !row.manufacturer_address || !row.generic_name || !row.dosage_form) return null;
  const fw = clean(row.generic_name).split(" ").find(t => t.length > 3);
  const candidates = fw ? (nafdacIndex.get(fw) || []) : [];
  for (const r of candidates) {
    if (!r["NAME OF MANUFACTRER/ADDRESS"] || !r["DOSAGE FORM"]) continue;
    if (!mfrNameMatch(row.manufacturer_name, r["NAME OF MANUFACTRER/ADDRESS"])) continue;
    if (!mfrAddressMatch(row.manufacturer_address, r["NAME OF MANUFACTRER/ADDRESS"])) continue;
    if (!genericNamesMatch(row.generic_name, r["GENERIC NAME /STRENGTH"])) continue;
    if (canonDosage(row.dosage_form) !== canonDosage(r["DOSAGE FORM"])) continue;
    return r;
  }
  return null;
}

function findOtherDosageMismatch(row) {
  if (!row.manufacturer_name || !row.manufacturer_address || !row.generic_name || !row.dosage_form) return null;
  const rowMfrCanon = canonMfr(row.manufacturer_name);
  const rowAddrCanon = canonMfr(row.manufacturer_address);
  const rowDosage = canonDosage(row.dosage_form);
  for (const d of acceptedDossiers) {
    if (!d.manufacturer_name || !d.manufacturer_address || !d.generic_name || !d.dosage_form) continue;
    const nameOk = diceSimilarity(canonMfr(d.manufacturer_name), rowMfrCanon) >= MFR_THRESHOLD
      || canonMfr(d.manufacturer_name).includes(rowMfrCanon) || rowMfrCanon.includes(canonMfr(d.manufacturer_name));
    if (!nameOk) continue;
    const addrOk = diceSimilarity(canonMfr(d.manufacturer_address), rowAddrCanon) >= MFR_ADDRESS_THRESHOLD
      || canonMfr(d.manufacturer_address).includes(rowAddrCanon) || rowAddrCanon.includes(canonMfr(d.manufacturer_address));
    if (!addrOk) continue;
    if (!genericNamesMatch(row.generic_name, d.generic_name)) continue;
    if (canonDosage(d.dosage_form) === rowDosage) continue;
    return d;
  }
  return null;
}

function findOtherGenericMismatch(row) {
  if (!row.manufacturer_name || !row.manufacturer_address || !row.generic_name || !row.dosage_form) return null;
  const rowMfrCanon = canonMfr(row.manufacturer_name);
  const rowAddrCanon = canonMfr(row.manufacturer_address);
  const rowDosage = canonDosage(row.dosage_form);
  for (const d of acceptedDossiers) {
    if (!d.manufacturer_name || !d.manufacturer_address || !d.generic_name || !d.dosage_form) continue;
    const nameOk = diceSimilarity(canonMfr(d.manufacturer_name), rowMfrCanon) >= MFR_THRESHOLD
      || canonMfr(d.manufacturer_name).includes(rowMfrCanon) || rowMfrCanon.includes(canonMfr(d.manufacturer_name));
    if (!nameOk) continue;
    const addrOk = diceSimilarity(canonMfr(d.manufacturer_address), rowAddrCanon) >= MFR_ADDRESS_THRESHOLD
      || canonMfr(d.manufacturer_address).includes(rowAddrCanon) || rowAddrCanon.includes(canonMfr(d.manufacturer_address));
    if (!addrOk) continue;
    if (canonDosage(d.dosage_form) !== rowDosage) continue;
    if (genericNamesMatch(row.generic_name, d.generic_name)) continue;
    return d;
  }
  return null;
}


function clean(str) {
  return (str || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function canonDosage(str) {
  const s = normalize(str);
  return DOSAGE_CANON[s] || s;
}

function canonMfr(str) {
  return clean(str)
    .replace(/\b(m s|ms|pvt|private|ltd|limited|co|company|inc|incorporated|llc|llp|plc|pte|sdn|bhd|gmbh|sa|spa|srl|ag|nv|bv)\b/g, "")
    .replace(/\s+/g, " ").trim();
}

// Address-trigger words that signal the start of the address portion
const ADDR_TRIGGERS = new Set([
  "plot","survey","village","vill","khasra","sy","at","post",
  "phase","sector","block","unit","flat","house","road","street","lane",
  "avenue","nagar","estate","area","industrial","ind","midc","gidc",
  "riico","sidcul","epip","sidc","kiadb","iie","eia","sez",
]);

const LEGAL_ABBREVS = new Set([
  "pvt","ltd","inc","corp","co","llc","llp","plc","pte","sdn","bhd","gmbh",
  "srl","spa","lab","labs","pharm","pharma","mfg","mfr","div","p","l",
]);

function splitMfrField(str) {
  if (!str) return { name: "", address: "" };
  let s = str.replace(/\s*(old|new)\s+site[:\s].*/i, "").trim();
  s = s.replace(/^m\/s\s*/i, "").trim();

  const tokens = s.split(/([,.]|\s+)/).filter(t => t.trim());
  let splitIdx = -1;

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i].replace(/[^a-z0-9]/gi, "").toLowerCase();
    const prev = i > 0 ? tokens[i - 1].replace(/[^a-z]/gi, "").toLowerCase() : "";

    // Digit-starting token = address begins here
    if (/^\d/.test(t) && tokens[i] !== "," && tokens[i] !== ".") { splitIdx = i; break; }
    // Comma after 2+ name tokens = split after comma
    if (tokens[i] === "," && i >= 2) { splitIdx = i + 1; break; }
    // Period after 2+ name tokens, but NOT after a legal abbreviation
    if (tokens[i] === "." && i >= 2 && !LEGAL_ABBREVS.has(prev)) { splitIdx = i + 1; break; }
    // Known address trigger word after 2+ name tokens
    if (i >= 2 && ADDR_TRIGGERS.has(t) && tokens[i] !== "," && tokens[i] !== ".") { splitIdx = i; break; }
  }

  if (splitIdx <= 0) {
    const commaIdx = s.indexOf(",");
    if (commaIdx > 0) return { name: s.slice(0, commaIdx).trim(), address: s.slice(commaIdx + 1).trim() };
    return { name: s, address: "" };
  }

  const namePart = tokens.slice(0, splitIdx).join(" ").replace(/[,.]$/, "").trim();
  const addrPart = tokens.slice(splitIdx).join(" ").trim();
  return { name: namePart, address: addrPart };
}

const MFR_GENERIC_WORDS = new Set([
  "pharmaceuticals","pharmaceutical","pharma","laboratories","laboratory",
  "labs","lab","healthcare","health","biotech","biosciences","bioscience",
  "lifesciences","life","sciences","science","remedies","remedy",
  "medicaments","medicament","drugs","drug","chemicals","chemical",
  "industries","industry","enterprises","enterprise","international",
  "exports","export","trading","trade","group","holdings","holding",
]);

function isNigerianManufacturer(address) {
  const a = normalize(address);
  return a.includes("nigeria") || a.includes("lagos") || a.includes("abuja") || a.includes("kano") || a.includes("ibadan") || a.includes("ogun") || a.includes("anambra") || a.includes("rivers") || a.includes("onitsha");
}

function stripMfrGeneric(s) {
  return s.split(" ").filter(t => !MFR_GENERIC_WORDS.has(t)).join(" ").trim();
}

function mfrNameMatch(query, nafdacCombined) {
  const q = canonMfr(query);
  if (!q) return true; // no query = no filter
  const { name: extractedName } = splitMfrField(nafdacCombined);
  const nm = canonMfr(extractedName);
  const nmFull = canonMfr(nafdacCombined);

  // 1. Dice on core name (generic industry words stripped)
  const qCore = stripMfrGeneric(q);
  const nmCore = stripMfrGeneric(nm);
  if (qCore && nmCore && diceSimilarity(qCore, nmCore) >= MFR_THRESHOLD) return true;

  // 2. Token overlap: all meaningful non-generic query tokens present in extracted name
  const qTokens = q.split(" ").filter(t => t.length > 2 && !MFR_GENERIC_WORDS.has(t));
  if (qTokens.length > 0 && qTokens.every(t => nm.includes(t))) return true;

  // 3. Fallback: query tokens present anywhere in full combined string
  if (qTokens.length > 0 && qTokens.every(t => nmFull.includes(t))) return true;

  // 4. Substring on core names only
  if (qCore && nmCore && (nmCore.includes(qCore) || qCore.includes(nmCore))) return true;

  return false;
}

function mfrAddressMatch(query, nafdacCombined) {
  const q = canonMfr(query);
  if (!q) return true;
  const { address: extractedAddr } = splitMfrField(nafdacCombined);
  const na = canonMfr(extractedAddr);
  const nmFull = canonMfr(nafdacCombined);

  if (diceSimilarity(q, na) >= MFR_ADDRESS_THRESHOLD) return true;
  const qTokens = q.split(" ").filter(t => t.length > 2);
  if (qTokens.length > 0 && qTokens.every(t => na.includes(t))) return true;
  if (qTokens.length > 0 && qTokens.every(t => nmFull.includes(t))) return true;
  return false;
}

// ─── STRENGTH EXTRACTION ───────────────────────────────────────────────────────

function normStrength(token) {
  const s = token.toLowerCase().replace(/\s/g, "");
  const num = s.split("/")[0];
  const m = num.match(/^([\d.]+)(g|mg|mcg|iu|%)?$/);
  if (!m) return null;
  let v = parseFloat(m[1]);
  const u = m[2] || "mg";
  if (u === "g")   v *= 1000;
  if (u === "mcg") v /= 1000;
  return Math.round(v * 1000) / 1000;
}

// ─── GENERIC NAME PARSING ──────────────────────────────────────────────────────

function parseIngredients(str) {
  str = clean(stripBrackets(str))
    .replace(/equivalent\s*to/g, "")
    .replace(/\beqv?\.?\s*(to)?\b/g, "")
    .replace(/\beq\.?\s*(to)?\b/g, "")
    .replace(/_x000d_/g, " ")
    .replace(/[|]/g, ",");

  const segments = str.split(/[,;+&\n]+/).map(s => s.trim()).filter(Boolean);
  const results = [];

  for (const seg of segments) {
    const tokens = seg.split(/[\s/]+/).filter(Boolean);
    const nameTokens = [];
    let strength = null;

    for (const t of tokens) {
      if (/^[\d.]+/.test(t)) {
        if (!strength) strength = normStrength(t);
      } else {
        const lw = t.replace(/[^a-z]/g, "");
        if (!NOISE.has(lw) && !SALT_WORDS.has(lw) && lw.length > 1) {
          nameTokens.push(lw);
        }
      }
    }
    if (nameTokens.length > 0) results.push({ name: nameTokens.join(" "), strength });
  }

  // Deduplicate: keep entry with strength when same name appears twice
  const seen = new Map();
  for (const p of results) {
    if (!seen.has(p.name) || (!seen.get(p.name).strength && p.strength)) {
      seen.set(p.name, p);
    }
  }
  return [...seen.values()];
}

// ─── INGREDIENT MATCHING ───────────────────────────────────────────────────────

function ingredientNamesMatch(a, b) {
  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) return true;
  return diceSimilarity(a, b) >= INGREDIENT_THRESHOLD;
}

// ─── STRUCTURED MATCH ─────────────────────────────────────────────────────────

function computeMatch(dossier, nafdac) {
  const dIng = parseIngredients(dossier.generic_name);
  const nIng = parseIngredients(nafdac["GENERIC NAME /STRENGTH"]);

  let ingredientMatch = false;
  let strengthMatch = false;

  if (dIng.length > 0 && nIng.length > 0) {
    const pairs = dIng.map(di => {
      const cp = nIng.find(ni => ingredientNamesMatch(di.name, ni.name));
      if (!cp) return { found: false, strengthOk: false };
      const strengthOk = di.strength === null || cp.strength === null || di.strength === cp.strength;
      return { found: true, strengthOk };
    });
    ingredientMatch = pairs.every(r => r.found);
    strengthMatch   = ingredientMatch && pairs.every(r => r.strengthOk);
  }

  const dosageFormMatch = (() => {
    const a = canonDosage(dossier.dosage_form);
    const b = canonDosage(nafdac["DOSAGE FORM"] || "");
    return a === b || a.includes(b) || b.includes(a);
  })();

  const nafdacMfrRaw = nafdac["NAME OF MANUFACTRER/ADDRESS"] || "";
  const dn = canonMfr(dossier.manufacturer_name || "");
  const da = canonMfr(dossier.manufacturer_address || "");
  const manufacturerMatch = (dn || da)
    ? (mfrNameMatch(dn, nafdacMfrRaw) && (da ? mfrAddressMatch(da, nafdacMfrRaw) : true))
    : false;

  let match_type;
  if (!ingredientMatch || !strengthMatch || !dosageFormMatch || !manufacturerMatch) {
    match_type = "MISMATCH";
  } else {
    match_type = "EXACT";
  }

  const score =
    (ingredientMatch   ? 0.40 : 0) +
    (strengthMatch     ? 0.25 : 0) +
    (dosageFormMatch   ? 0.20 : 0) +
    (manufacturerMatch ? 0.15 : 0);

  return { ingredient_match: ingredientMatch, strength_match: strengthMatch,
           dosage_form_match: dosageFormMatch, manufacturer_match: manufacturerMatch,
           match_type, score };
}

// ─── DOSSIER SEARCH ────────────────────────────────────────────────────────────

function genericNamesMatch(a, b) {
  const pa = parseIngredients(a);
  const pb = parseIngredients(b);
  if (!pa.length || !pb.length) {
    return clean(a).includes(clean(b)) || clean(b).includes(clean(a));
  }
  return pa.every(ia => pb.some(ib => ingredientNamesMatch(ia.name, ib.name)));
}

function getRiskReasonLabel(reason) {
  return reason === "high_risk_dosage" ? "High-risk dosage form"
    : reason === "sterile_dossier_match" ? "Sterile accepted dossier match"
    : reason === "sterile_nafdac_match" ? "NAFDAC registry match — no accepted dossier found"
    : reason === "sterile_no_match" ? "Sterile — no registry or dossier match"
    : reason === "dossier_match" ? "Accepted dossier match"
    : reason === "nafdac_match" ? "NAFDAC registry match"
    : reason === "dosage_mismatch" ? "Known manufacturer — different dosage form"
    : reason === "generic_mismatch" ? "Known manufacturer — different generic name"
    : reason === "no_match" ? "Unknown manufacturer — no registry or dossier match"
    : reason || "—";
}

function useTable(data, searchFields, genericField) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const tableRef = useRef(null);

  const scrollToTop = () => { const y = (tableRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 80; window.scrollTo({ top: y, behavior: "smooth" }); };

  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.trim();
    const qClean = clean(q);
    return data.filter((row) => {
      // Pharmaceutical-aware match on the generic name field
      if (genericField && row[genericField]) {
        if (genericNamesMatch(row[genericField], q)) return true;
      }
      // Robust substring match on all other fields
      return searchFields
        .filter(f => f !== genericField)
        .some(f => clean(row[f] || "").includes(qClean));
    });
  }, [data, query, searchFields, genericField]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleQuery = (val) => { setQuery(val); setPage(1); };
  const handlePage = (p) => { setPage(p); scrollToTop(); };

  return { query, setQuery: handleQuery, filtered, paginated, page, setPage: handlePage, totalPages, tableRef };
}

export default function RiskCategorization() {
  const [activeTab, setActiveTab] = useState(null);

  return (
    <div style={{ maxWidth: "100%", margin: "0 auto", padding: "1rem 0.5rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: "0 0 0.25rem 0", fontSize: "20px", fontWeight: "700", color: "#193441", textTransform: "uppercase", letterSpacing: "1px" }}>
          Risk Categorization
        </h1>
        <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>
          Browse NAFDAC registered products and accepted dossiers.
        </p>
      </div>

      <div style={{ display: "flex", borderBottom: "2px solid #e2e8f0", marginBottom: "1.5rem", overflowX: "auto", overflowY: "visible", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
        <TabButton label="NAFDAC Registry" count={cleanNafdac.length} active={activeTab === "nafdac"} onClick={() => setActiveTab(activeTab === "nafdac" ? null : "nafdac")} color="#193441" />
        <TabButton label="Accepted Dossiers" count={acceptedDossiers.length} active={activeTab === "dossiers"} onClick={() => setActiveTab(activeTab === "dossiers" ? null : "dossiers")} color="#2d6a4f" />
        <TabButton label="Missing Dosage Form" count={missingDosageForm.length} active={activeTab === "missingdosage"} onClick={() => setActiveTab(activeTab === "missingdosage" ? null : "missingdosage")} color="#c53030" />
        <TabButton label="Risk Check" count={null} active={activeTab === "riskcheck"} onClick={() => setActiveTab(activeTab === "riskcheck" ? null : "riskcheck")} color="#7b2d8b" />
        <TabButton label="Cross-Reference" count={null} active={activeTab === "crossref"} onClick={() => setActiveTab(activeTab === "crossref" ? null : "crossref")} color="#b7410e" />
        <TabButton label="Analytics" count={null} active={activeTab === "analytics"} onClick={() => setActiveTab(activeTab === "analytics" ? null : "analytics")} color="#2b6cb0" />
      </div>

      <div style={{ display: activeTab === "nafdac" ? "block" : "none" }}><NAFDACTable /></div>
      <div style={{ display: activeTab === "dossiers" ? "block" : "none" }}><DossiersTable /></div>
      <div style={{ display: activeTab === "missingdosage" ? "block" : "none" }}><MissingDosageTable /></div>
      <div style={{ display: activeTab === "riskcheck" ? "block" : "none" }}><RiskCheck /></div>
      <div style={{ display: activeTab === "crossref" ? "block" : "none" }}><CrossReference /></div>
      <div style={{ display: activeTab === "analytics" ? "block" : "none" }}><Analytics /></div>
    </div>
  );
}

// ─── Analytics ────────────────────────────────────────────────────────────────

const extractMarketingCategory = (raw = '') => {
  const m = (raw || '').match(/^(POM|OTC)/i);
  return m ? m[1].toUpperCase() : 'Unknown';
};

const extractManufacturerCountry = (address = '') => {
  const a = normalize(address);
  if (a.includes('india')) return 'India';
  if (a.includes('china')) return 'China';
  if (a.includes('nigeria')) return 'Nigeria';
  if (a.includes('italy') || a.includes('germany') || a.includes('france') || a.includes('uk') || a.includes('ireland') || a.includes('poland') || a.includes('turkey') || a.includes('cyprus')) return 'Europe';
  if (a.includes('pakistan')) return 'Pakistan';
  if (a.includes('usa') || a.includes('indiana') || a.includes('united states')) return 'USA';
  if (a.includes('egypt')) return 'Egypt';
  return 'Other';
};

const extractYear = (raw = '') => {
  const m = (raw || '').match(/\b(20\d{2})\b/);
  return m ? m[1] : null;
};

const normalizeForm = (raw = '') => {
  const f = normalize(raw);
  if (f.includes('tablet') || f.includes('caplet')) return 'Tablets';
  if (f.includes('capsule')) return 'Capsules';
  if (f.includes('injection') || f.includes('infusion')) return 'Injections';
  if (f.includes('suspension')) return 'Suspensions';
  if (f.includes('syrup') || f.includes('liquid') || f.includes('solution') || f.includes('drops')) return 'Liquids/Syrups';
  if (f.includes('cream') || f.includes('ointment') || f.includes('gel')) return 'Topicals';
  if (f.includes('granule') || f.includes('powder')) return 'Powders/Granules';
  if (f.includes('pessary') || f.includes('suppository')) return 'Pessaries/Suppositories';
  return 'Other';
};

const countBy = (arr, keyFn) => {
  const map = {};
  arr.forEach(item => { const k = keyFn(item); map[k] = (map[k] || 0) + 1; });
  return map;
};

const topN = (countMap, n = 10) =>
  Object.entries(countMap).sort((a, b) => b[1] - a[1]).slice(0, n);

const REGISTRY_BAR_COLORS = ['#193441','#2a5068','#3a6d8f','#4a8ab0','#5aa7d1','#6ac4f2','#8ad4f8','#aae4ff','#c4eeff','#ddf6ff'];

function RegistryBarChart({ data, total, colorOffset = 0 }) {
  const max = Math.max(...data.map(([, v]) => v), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {data.map(([label, count], i) => {
        const pct = total ? ((count / total) * 100).toFixed(1) : null;
        return (
          <div key={label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span style={{ fontSize: '11px', color: '#444', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }} title={label}>{label}</span>
              <span style={{ fontSize: '11px', color: '#888', flexShrink: 0 }}>
                {count.toLocaleString()}{pct ? <span style={{ marginLeft: '6px', color: REGISTRY_BAR_COLORS[(i + colorOffset) % REGISTRY_BAR_COLORS.length], fontWeight: '700' }}>{pct}%</span> : null}
              </span>
            </div>
            <div style={{ background: '#f0f0f0', height: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${(count / max) * 100}%`, height: '100%', background: REGISTRY_BAR_COLORS[(i + colorOffset) % REGISTRY_BAR_COLORS.length], transition: 'width 0.4s ease' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({ value, total, color, label, sub }) {
  const pct = total ? value / total : 0;
  const r = 36, cx = 44, cy = 44, stroke = 10;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '90px' }}>
      <svg width={88} height={88}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="butt"
          transform={`rotate(-90 ${cx} ${cy})`} />
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize="13" fontWeight="800" fill={color}>{(pct * 100).toFixed(1)}%</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill="#888">{value.toLocaleString()}</text>
      </svg>
      <div style={{ fontSize: '10px', fontWeight: '700', color: '#444', textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: 'center', marginTop: '2px' }}>{label}</div>
      {sub && <div style={{ fontSize: '10px', color: '#aaa', textAlign: 'center' }}>{sub}</div>}
    </div>
  );
}

// Normalize for grouping: lowercase, strip trailing punctuation/spaces, collapse internal punctuation
const normKey = (s) => s.toLowerCase().replace(/[\s.,;]+$/g, "").replace(/\.\s*/g, " ").replace(/\s+/g, " ").trim();

// Groups by case-insensitive key, displays the most-frequent raw variant
function rank(arr, key) {
  const counts = {};
  const variants = {};
  arr.forEach(d => {
    const val = (d[key] || "").trim();
    if (!val) return;
    const k = normKey(val);
    counts[k] = (counts[k] || 0) + 1;
    if (!variants[k]) variants[k] = {};
    variants[k][val] = (variants[k][val] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([k, count]) => {
      const best = Object.entries(variants[k]).sort((a, b) => b[1] - a[1])[0][0];
      return [best, count];
    });
}

const PIE_COLORS = ["#193441","#2b6cb0","#276749","#b7410e","#7b2d8b","#c53030","#d69e2e","#2c7a7b","#744210","#553c9a","#2d3748","#276749"];

function PieChart({ slices, size = 180 }) {
  const [hovered, setHovered] = useState(null);
  const r = size / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;
  const total = slices.reduce((s, x) => s + x.value, 0);
  if (!total) return null;
  let angle = -Math.PI / 2;
  const paths = slices.map((sl, i) => {
    const sweep = (sl.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    angle += sweep;
    const x2 = cx + r * Math.cos(angle);
    const y2 = cy + r * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    const midAngle = angle - sweep / 2;
    return { d: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`, color: PIE_COLORS[i % PIE_COLORS.length], midAngle, ...sl };
  });
  const hov = hovered !== null ? slices[hovered] : null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <svg width={size} height={size}>
          {paths.map((p, i) => (
            <path key={i} d={p.d} fill={p.color} stroke="white" strokeWidth={hovered === i ? 0 : 1.5}
              transform={hovered === i ? `translate(${Math.cos(p.midAngle) * 6},${Math.sin(p.midAngle) * 6})` : ""}
              style={{ cursor: "pointer", transition: "transform 0.15s" }}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} />
          ))}
        </svg>
        {hov && (
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", pointerEvents: "none", background: "rgba(255,255,255,0.92)", padding: "4px 8px", border: "1px solid #ddd", fontSize: "11px", maxWidth: "120px", lineHeight: "1.4" }}>
            <div style={{ fontWeight: "700", color: "#193441" }}>{((hov.value / total) * 100).toFixed(1)}%</div>
            <div style={{ color: "#555" }}>{hov.label}</div>
            <div style={{ color: "#888" }}>{hov.value.toLocaleString()}</div>
          </div>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "12px" }}>
        {paths.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", opacity: hovered !== null && hovered !== i ? 0.5 : 1, transition: "opacity 0.15s" }}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <div style={{ width: "12px", height: "12px", background: p.color, flexShrink: 0 }} />
            <span style={{ color: "#333" }}>{p.label}</span>
            <span style={{ color: "#888", marginLeft: "auto", paddingLeft: "12px" }}>{((p.value / total) * 100).toFixed(1)}% ({p.value.toLocaleString()})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RankedTable({ title, rows, label, total, renderSub }) {
  const [q, setQ] = useState("");
  const filtered = q.trim() ? rows.filter(([name]) => name.toLowerCase().includes(q.toLowerCase())) : rows.slice(0, 20);
  const max = filtered[0]?.[1] || 1;
  const rankMap = useMemo(() => Object.fromEntries(rows.map(([name], i) => [name, i + 1])), [rows]);
  return (
    <div style={{ marginBottom: "1.75rem", background: "white", border: "1px solid #e2e8f0" }}>
      <div style={{ background: "#193441", padding: "0.65rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "11px", fontWeight: "800", color: "white", letterSpacing: "0.6px", textTransform: "uppercase" }}>{title}</span>
        <span style={{ fontSize: "10px", color: "#8ab0bb", fontWeight: "400" }}>{q.trim() ? `${filtered.length} of ${rows.length}` : `Top ${filtered.length} of ${rows.length}`}</span>
      </div>
      <div style={{ padding: "0.6rem 0.75rem", borderBottom: "1px solid #e2e8f0" }}>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder={`Search ${label.toLowerCase()}...`}
          style={{ width: "100%", padding: "5px 8px", fontSize: "12px", border: "1px solid #e2e8f0", boxSizing: "border-box", outline: "none", background: "#f7f8fa" }}
        />
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
        <thead>
          <tr style={{ background: "#f7f8fa" }}>
            <th style={thStyle}>#</th>
            <th style={thStyle}>{label}</th>
            <th style={thStyle}>Count</th>
            {total && <th style={thStyle}>%</th>}
            <th style={{ ...thStyle, width: "160px" }}></th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr><td colSpan={5} style={{ padding: "10px 8px", color: "#aaa", textAlign: "center", fontSize: "12px" }}>No results</td></tr>
          )}
          {filtered.map(([name, count, ...rest], i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#fafafa" }}>
              <td style={{ ...tdStyle, color: "#aaa", textAlign: "center", width: "32px" }}>{rankMap[name]}</td>
              <td style={tdStyle}>
                {name}
                {renderSub && renderSub(rest[0], name)}
              </td>
              <td style={{ ...tdStyle, textAlign: "center", fontWeight: "700", color: "#193441" }}>{count}</td>
              {total && <td style={{ ...tdStyle, textAlign: "center", color: "#888" }}>{((count / total) * 100).toFixed(1)}%</td>}
              <td style={{ ...tdStyle, width: "160px" }}>
                <div style={{ background: "#7b2d8b", height: "8px", width: `${Math.round((count / max) * 100)}%`, minWidth: "2px" }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RegistryAnalyticsTab() {
  const [search, setSearch] = useState('');

  const registryStats = useMemo(() => {
    const total = nafdacRegistry.length;
    const marketingCats = countBy(nafdacRegistry, r => extractMarketingCategory(r['MARKETING CATEGORY/PACK SIZES']));
    const dosageForms = countBy(nafdacRegistry, r => normalizeForm(r['DOSAGE FORM']));
    const pharmClasses = countBy(nafdacRegistry, r => (r['PHARMACOLOGICAL CLASS/CATEGORY'] || '').trim() || 'Unclassified');
    const countries = countBy(nafdacRegistry, r => extractManufacturerCountry(r['NAME OF MANUFACTRER/ADDRESS']));
    const years = countBy(
      nafdacRegistry.filter(r => extractYear(r['DATE OF APPLICATION'])),
      r => extractYear(r['DATE OF APPLICATION'])
    );
    const fdrcStatus = countBy(nafdacRegistry, r => {
      if (r['FDRC'] && normalize(r['FDRC']) !== 'null') return 'FDRC Approved';
      if (r['SUB FDRC'] && normalize(r['SUB FDRC']) !== 'null') return 'Sub-FDRC';
      if (r['DIRECTORATE'] && normalize(r['DIRECTORATE']) !== 'null') return 'Directorate';
      return 'Unknown';
    });
    const applicants = countBy(nafdacRegistry, r => (r['NAME OF APPLICANT/ADDRESS'] || '').split(',')[0].trim() || 'Unknown');

    // Top generic names
    const generics = countBy(nafdacRegistry, r => (r['GENERIC NAME /STRENGTH'] || '').split(/[,;+]/)[0].trim() || 'Unknown');

    // POM vs OTC per dosage form
    const pomByForm = {};
    const otcByForm = {};
    nafdacRegistry.forEach(r => {
      const form = normalizeForm(r['DOSAGE FORM']);
      const cat = extractMarketingCategory(r['MARKETING CATEGORY/PACK SIZES']);
      if (cat === 'POM') pomByForm[form] = (pomByForm[form] || 0) + 1;
      else if (cat === 'OTC') otcByForm[form] = (otcByForm[form] || 0) + 1;
    });

    // Nigeria vs foreign
    const nigeriaCount = countries['Nigeria'] || 0;
    const foreignCount = total - nigeriaCount;

    // Directorate breakdown
    const directorates = countBy(nafdacRegistry, r => (r['DIRECTORATE'] || '').trim() || 'Unspecified');

    return { total, marketingCats, dosageForms, pharmClasses, countries, years, fdrcStatus, applicants, generics, pomByForm, otcByForm, nigeriaCount, foreignCount, directorates };
  }, []);

  const filteredRecords = useMemo(() => {
    if (!search.trim()) return [];
    const q = normalize(search);
    return nafdacRegistry
      .filter(r =>
        normalize(r['BRAND NAME']).includes(q) ||
        normalize(r['GENERIC NAME /STRENGTH']).includes(q) ||
        normalize(r['PHARMACOLOGICAL CLASS/CATEGORY']).includes(q) ||
        normalize(r['NAME OF APPLICANT/ADDRESS']).includes(q)
      )
      .slice(0, 50);
  }, [search]);

  const pomCount = registryStats.marketingCats['POM'] || 0;
  const otcCount = registryStats.marketingCats['OTC'] || 0;
  const indiaCount = registryStats.countries['India'] || 0;
  const uniqueApplicants = Object.keys(registryStats.applicants).length;
  const yearData = Object.entries(registryStats.years).sort((a, b) => a[0].localeCompare(b[0]));

  const pill = (label, val, color = '#193441', sub = null) => (
    <div style={{ display: 'flex', flexDirection: 'column', background: 'white', border: '1px solid #e2e8f0', borderTop: `3px solid ${color}`, padding: '1rem 1.25rem', minWidth: '140px', flex: 1 }}>
      <span style={{ fontSize: '24px', fontWeight: '800', color, lineHeight: 1 }}>{typeof val === 'number' ? val.toLocaleString() : val}</span>
      <span style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.6px', marginTop: '6px', fontWeight: '600' }}>{label}</span>
      {sub && <span style={{ fontSize: '10px', color, marginTop: '3px', fontWeight: '700' }}>{sub}</span>}
    </div>
  );

  const sectionCard = (title, children) => (
    <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '1.25rem', marginBottom: '1.25rem' }}>
      <div style={{ fontSize: '11px', fontWeight: '800', color: '#193441', textTransform: 'uppercase', letterSpacing: '0.6px', borderBottom: '2px solid #193441', paddingBottom: '0.5rem', marginBottom: '1rem' }}>{title}</div>
      {children}
    </div>
  );

  // year sparkline max
  const yearMax = Math.max(...yearData.map(([, v]) => v), 1);

  return (
    <div style={{ fontSize: '13px', background: '#f7f8fa', minHeight: '400px' }}>
      <div style={{ background: '#193441', padding: '1.25rem 1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '13px', fontWeight: '800', color: 'white', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Registry Analytics</div>
        <div style={{ fontSize: '11px', color: '#8ab0bb', marginTop: '3px' }}>NAFDAC product registry — {registryStats.total.toLocaleString()} records</div>
      </div>
      <div style={{ padding: '0 1.25rem 1.25rem' }}>

        {/* Stat pills */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {pill('Total Products', registryStats.total)}
          {pill('POM Products', pomCount, '#c53030', `${((pomCount / registryStats.total) * 100).toFixed(1)}% of registry`)}
          {pill('OTC Products', otcCount, '#276749', `${((otcCount / registryStats.total) * 100).toFixed(1)}% of registry`)}
          {pill('India-Manufactured', indiaCount, '#b7410e', `${((indiaCount / registryStats.total) * 100).toFixed(1)}% of registry`)}
          {pill('Local (Nigerian)', registryStats.nigeriaCount, '#2b6cb0', `${((registryStats.nigeriaCount / registryStats.total) * 100).toFixed(1)}% of registry`)}
          {pill('Unique Applicants', uniqueApplicants, '#7b2d8b')}
          {pill('Drug Classes', Object.keys(registryStats.pharmClasses).length, '#d69e2e')}
        </div>

        {/* Donut row — POM/OTC, Local/Foreign, top country */}
        {sectionCard('Registry Composition', (
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ fontSize: '10px', fontWeight: '800', color: '#555', textTransform: 'uppercase', letterSpacing: '0.6px' }}>POM vs OTC</div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <DonutChart value={pomCount} total={registryStats.total} color="#c53030" label="POM" />
                <DonutChart value={otcCount} total={registryStats.total} color="#276749" label="OTC" />
                <DonutChart value={registryStats.marketingCats['Unknown'] || 0} total={registryStats.total} color="#aaa" label="Unknown" />
              </div>
            </div>
            <div style={{ width: '1px', background: '#e2e8f0', alignSelf: 'stretch' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ fontSize: '10px', fontWeight: '800', color: '#555', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Local vs Foreign Manufacturer</div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <DonutChart value={registryStats.nigeriaCount} total={registryStats.total} color="#2b6cb0" label="Nigeria" />
                <DonutChart value={registryStats.foreignCount} total={registryStats.total} color="#b7410e" label="Foreign" />
              </div>
            </div>
            <div style={{ width: '1px', background: '#e2e8f0', alignSelf: 'stretch' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ fontSize: '10px', fontWeight: '800', color: '#555', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Top Manufacturing Countries</div>
              <PieChart slices={[
                ...topN(registryStats.countries, 6).map(([label, value]) => ({ label, value })),
                ...(Object.keys(registryStats.countries).length > 6 ? [{ label: 'Others', value: Object.entries(registryStats.countries).sort((a,b)=>b[1]-a[1]).slice(6).reduce((s,[,v])=>s+v,0) }] : []),
              ]} size={160} />
            </div>
          </div>
        ))}

        {/* Dosage form + POM/OTC breakdown */}
        {sectionCard('Dosage Form Distribution', (
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 2, minWidth: '260px' }}>
              <RegistryBarChart data={topN(registryStats.dosageForms, 9)} total={registryStats.total} />
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ fontSize: '10px', fontWeight: '800', color: '#555', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '0.75rem' }}>Dosage Form Split</div>
              <PieChart slices={[
                ...topN(registryStats.dosageForms, 7).map(([label, value]) => ({ label, value })),
                ...(Object.keys(registryStats.dosageForms).length > 7 ? [{ label: 'Others', value: Object.entries(registryStats.dosageForms).sort((a,b)=>b[1]-a[1]).slice(7).reduce((s,[,v])=>s+v,0) }] : []),
              ]} size={160} />
            </div>
          </div>
        ))}

        {/* POM vs OTC per dosage form */}
        {sectionCard('POM vs OTC by Dosage Form', (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: '#f7f8fa' }}>
                  {['Dosage Form', 'Total', 'POM', 'POM %', 'OTC', 'OTC %', 'Split'].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topN(registryStats.dosageForms, 10).map(([form, total], i) => {
                  const pom = registryStats.pomByForm[form] || 0;
                  const otc = registryStats.otcByForm[form] || 0;
                  const pomPct = total ? (pom / total) * 100 : 0;
                  const otcPct = total ? (otc / total) * 100 : 0;
                  return (
                    <tr key={form} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                      <td style={tdStyle}>{form}</td>
                      <td style={{ ...tdStyle, textAlign: 'center', fontWeight: '700', color: '#193441' }}>{total.toLocaleString()}</td>
                      <td style={{ ...tdStyle, textAlign: 'center', color: '#c53030', fontWeight: '600' }}>{pom.toLocaleString()}</td>
                      <td style={{ ...tdStyle, textAlign: 'center', color: '#c53030' }}>{pomPct.toFixed(1)}%</td>
                      <td style={{ ...tdStyle, textAlign: 'center', color: '#276749', fontWeight: '600' }}>{otc.toLocaleString()}</td>
                      <td style={{ ...tdStyle, textAlign: 'center', color: '#276749' }}>{otcPct.toFixed(1)}%</td>
                      <td style={{ ...tdStyle, minWidth: '120px' }}>
                        <div style={{ display: 'flex', height: '10px', overflow: 'hidden' }}>
                          <div style={{ width: `${pomPct}%`, background: '#c53030' }} />
                          <div style={{ width: `${otcPct}%`, background: '#276749' }} />
                          <div style={{ flex: 1, background: '#e2e8f0' }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}

        {/* Pharmacological classes + pie */}
        {sectionCard('Pharmacological Classes', (
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 2, minWidth: '260px' }}>
              <RegistryBarChart data={topN(registryStats.pharmClasses, 10)} total={registryStats.total} colorOffset={4} />
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ fontSize: '10px', fontWeight: '800', color: '#555', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '0.75rem' }}>Top Classes Split</div>
              <PieChart slices={[
                ...topN(registryStats.pharmClasses, 7).map(([label, value]) => ({ label, value })),
                ...(Object.keys(registryStats.pharmClasses).length > 7 ? [{ label: 'Others', value: Object.entries(registryStats.pharmClasses).sort((a,b)=>b[1]-a[1]).slice(7).reduce((s,[,v])=>s+v,0) }] : []),
              ]} size={160} />
            </div>
          </div>
        ))}

        {/* Application year sparkline */}
        {sectionCard('Application Year Trend', (
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '80px', marginBottom: '6px' }}>
              {yearData.map(([year, count]) => (
                <div key={year} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{ fontSize: '9px', color: '#888', marginBottom: '2px' }}>{count}</div>
                  <div style={{ width: '100%', background: '#193441', height: `${(count / yearMax) * 64}px`, minHeight: '2px', transition: 'height 0.3s' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {yearData.map(([year]) => (
                <div key={year} style={{ flex: 1, fontSize: '9px', color: '#888', textAlign: 'center', overflow: 'hidden' }}>{year}</div>
              ))}
            </div>
          </div>
        ))}

        {/* Top applicants */}
        {sectionCard('Top Applicants', (
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 2, minWidth: '260px' }}>
              <RegistryBarChart data={topN(registryStats.applicants, 10)} total={registryStats.total} colorOffset={5} />
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ fontSize: '10px', fontWeight: '800', color: '#555', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '0.75rem' }}>Top 6 Applicants</div>
              <PieChart slices={[
                ...topN(registryStats.applicants, 6).map(([label, value]) => ({ label, value })),
                ...(Object.keys(registryStats.applicants).length > 6 ? [{ label: 'Others', value: Object.entries(registryStats.applicants).sort((a,b)=>b[1]-a[1]).slice(6).reduce((s,[,v])=>s+v,0) }] : []),
              ]} size={160} />
            </div>
          </div>
        ))}

        {/* Directorate breakdown */}
        {sectionCard('Directorate Breakdown', (
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 2, minWidth: '260px' }}>
              <RegistryBarChart data={topN(registryStats.directorates, 10)} total={registryStats.total} colorOffset={2} />
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <PieChart slices={[
                ...topN(registryStats.directorates, 6).map(([label, value]) => ({ label, value })),
                ...(Object.keys(registryStats.directorates).length > 6 ? [{ label: 'Others', value: Object.entries(registryStats.directorates).sort((a,b)=>b[1]-a[1]).slice(6).reduce((s,[,v])=>s+v,0) }] : []),
              ]} size={160} />
            </div>
          </div>
        ))}

        {/* Registry Search */}
        {sectionCard('Registry Search',
          <>
            <input
              type="text"
              placeholder="Search by brand name, generic name, drug class, or applicant…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #ccc', fontSize: '13px', marginBottom: '1rem', boxSizing: 'border-box', outline: 'none' }}
            />
            {search.trim() && (
              <>
                <div style={{ fontSize: '11px', color: '#888', marginBottom: '0.75rem' }}>
                  {filteredRecords.length === 50 ? 'Showing first 50 results' : `${filteredRecords.length} result${filteredRecords.length !== 1 ? 's' : ''}`}
                </div>
                {filteredRecords.length === 0 ? (
                  <div style={{ color: '#888', fontSize: '12px' }}>No matching records found.</div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead>
                        <tr style={{ background: '#193441' }}>
                          {['NAFDAC No.', 'Brand Name', 'Generic Name / Strength', 'Dosage Form', 'Category', 'Applicant'].map(h => (
                            <th key={h} style={{ ...thStyle, background: '#193441', color: 'white' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRecords.map((r, i) => (
                          <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                            <td style={{ ...tdStyle, color: '#193441', fontWeight: '600', fontFamily: 'monospace', fontSize: '11px' }}>{r['NAFDAC NO'] || '—'}</td>
                            <td style={tdStyle}>{r['BRAND NAME'] || '—'}</td>
                            <td style={{ ...tdStyle, maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={r['GENERIC NAME /STRENGTH']}>{r['GENERIC NAME /STRENGTH'] || '—'}</td>
                            <td style={tdStyle}>{r['DOSAGE FORM'] || '—'}</td>
                            <td style={{ ...tdStyle }}>
                              {(() => { const cat = extractMarketingCategory(r['MARKETING CATEGORY/PACK SIZES']); return <span style={{ background: cat === 'POM' ? '#fed7d7' : cat === 'OTC' ? '#c6f6d5' : '#e2e8f0', color: cat === 'POM' ? '#c53030' : cat === 'OTC' ? '#276749' : '#888', padding: '2px 8px', fontSize: '10px', fontWeight: '700' }}>{cat}</span>; })()}
                            </td>
                            <td style={{ ...tdStyle, maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={r['NAME OF APPLICANT/ADDRESS']}>{(r['NAME OF APPLICANT/ADDRESS'] || '—').split(',')[0]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function DossierAnalyticsTab() {
  const [tab, setTab] = useState("manufacturers");

  const stats = useMemo(() => {
    const d = acceptedDossiers;

    // Manufacturers
    const topMfr = rank(d, "manufacturer_name");
    const mfrUniqueGenerics = (() => {
      const map = {};
      const mfrBest = {};
      d.forEach(r => {
        const m = (r.manufacturer_name || "").trim();
        const g = (r.generic_name || "").trim().toLowerCase();
        if (!m || !g) return;
        const mk = normKey(m);
        if (!map[mk]) { map[mk] = new Set(); mfrBest[mk] = {}; }
        map[mk].add(g);
        mfrBest[mk][m] = (mfrBest[mk][m] || 0) + 1;
      });
      return Object.entries(map)
        .map(([mk, v]) => [Object.entries(mfrBest[mk]).sort((a,b)=>b[1]-a[1])[0][0], v.size])
        .sort((a, b) => b[1] - a[1]);
    })();
    const mfrUniqueDosage = (() => {
      const map = {};
      const mfrBest = {};
      d.forEach(r => {
        const m = (r.manufacturer_name || "").trim();
        const df = (r.dosage_form || "").trim().toLowerCase();
        if (!m || !df) return;
        const mk = normKey(m);
        if (!map[mk]) { map[mk] = new Set(); mfrBest[mk] = {}; }
        map[mk].add(df);
        mfrBest[mk][m] = (mfrBest[mk][m] || 0) + 1;
      });
      const dfBest = {};
      d.forEach(r => {
        const df = (r.dosage_form || "").trim();
        if (!df) return;
        const dk = df.toLowerCase();
        if (!dfBest[dk]) dfBest[dk] = {};
        dfBest[dk][df] = (dfBest[dk][df] || 0) + 1;
      });
      const bestDf = (dk) => Object.entries(dfBest[dk] || {}).sort((a,b)=>b[1]-a[1])[0]?.[0] || dk;
      return Object.entries(map)
        .map(([mk, v]) => {
          const name = Object.entries(mfrBest[mk]).sort((a,b)=>b[1]-a[1])[0][0];
          const forms = [...v].map(bestDf).sort();
          return [name, v.size, forms];
        })
        .sort((a, b) => b[1] - a[1]);
    })();

    // Local vs Foreign
    const local = d.filter(r => isNigerianManufacturer(r.manufacturer_address || "")).length;
    const foreign = d.length - local;

    // Country of origin (last meaningful token before punctuation — rough parse)
    const INDIA_TOKENS = new Set(["GUJARAT","MAHARASHTRA","RAJASTHAN","PUNJAB","HARYANA","KARNATAKA","TAMIL NADU","TELANGANA","ANDHRA PRADESH","UTTAR PRADESH","MADHYA PRADESH","HIMACHAL PRADESH","UTTARAKHAND","WEST BENGAL","KERALA","ODISHA","JHARKHAND","CHHATTISGARH","ASSAM","BIHAR","GOA","MUMBAI","DELHI","BANGALORE","HYDERABAD","CHENNAI","KOLKATA","PUNE","AHMEDABAD","SURAT","INDORE","NAGPUR","VADODARA","HARIDWAR","BADDI","ROORKEE","DEHRADUN","CHANDIGARH","PANIPAT","ANKLESHWAR","VAPI","SILVASSA","DAMAN","SIKKIM","MANIPUR","MEGHALAYA","TRIPURA","MIZORAM","NAGALAND","ARUNACHAL PRADESH"]);
    const countryCount = {};
    d.forEach(r => {
      const addr = (r.manufacturer_address || "").trim();
      if (!addr) return;
      let country;
      if (isNigerianManufacturer(addr)) {
        country = "NIGERIA";
      } else if (/\bindia\b/i.test(addr)) {
        country = "INDIA";
      } else if (/\bpakistan\b/i.test(addr)) {
        country = "PAKISTAN";
      } else if (/\bchina\b/i.test(addr)) {
        country = "CHINA";
      } else if (/\bbangladesh\b/i.test(addr)) {
        country = "BANGLADESH";
      } else {
        const parts = addr.split(/[,\.]+/).map(s => s.trim()).filter(Boolean);
        const last = parts[parts.length - 1];
        if (!last) return;
        const cleaned = last.replace(/[\(\)]/g, "").replace(/\b\d{5,}\b/g, "").replace(/\bpin\s*code[:\s-]*\d*/gi, "").replace(/[-–]+$/, "").trim();
        if (!cleaned) return;
        const up = cleaned.toUpperCase();
        // skip tokens that look like street addresses (contain digits or too long)
        if (/\d/.test(up) || up.length > 30) return;
        // map known Indian state/city tokens to INDIA
        const baseToken = up.split(/[\s-]/)[0];
        country = (INDIA_TOKENS.has(up) || INDIA_TOKENS.has(baseToken)) ? "INDIA" : up;
      }
      countryCount[country] = (countryCount[country] || 0) + 1;
    });
    const topCountries = Object.entries(countryCount).sort((a, b) => b[1] - a[1]);

    // Generics & Dosage
    const topGenerics = rank(d, "generic_name");
    const topDosage = rank(d, "dosage_form");
    const topCombos = (() => {
      const map = {};
      const best = {};
      d.forEach(r => {
        const g = (r.generic_name || "").trim();
        const df = (r.dosage_form || "").trim();
        if (!g || !df) return;
        const key = `${g.toLowerCase()} — ${df.toLowerCase()}`;
        const display = `${g} — ${df}`;
        map[key] = (map[key] || 0) + 1;
        if (!best[key]) best[key] = {};
        best[key][display] = (best[key][display] || 0) + 1;
      });
      return Object.entries(map)
        .sort((a, b) => b[1] - a[1])
        .map(([k, count]) => [Object.entries(best[k]).sort((a,b)=>b[1]-a[1])[0][0], count]);
    })();

    // Applicants
    const topApplicants = rank(d, "applicant");
    const applicantUniqueGenerics = (() => {
      const map = {};
      const appBest = {};
      d.forEach(r => {
        const a = (r.applicant || "").trim();
        const g = (r.generic_name || "").trim().toLowerCase();
        if (!a || !g) return;
        const ak = normKey(a);
        if (!map[ak]) { map[ak] = new Set(); appBest[ak] = {}; }
        map[ak].add(g);
        appBest[ak][a] = (appBest[ak][a] || 0) + 1;
      });
      return Object.entries(map)
        .map(([ak, v]) => [Object.entries(appBest[ak]).sort((a,b)=>b[1]-a[1])[0][0], v.size])
        .sort((a, b) => b[1] - a[1]);
    })();
    const selfMfr = d.filter(r => (r.applicant || "").trim().toLowerCase() === (r.manufacturer_name || "").trim().toLowerCase()).length;

    return { topMfr, mfrUniqueGenerics, mfrUniqueDosage, local, foreign, topCountries, topGenerics, topDosage, topCombos, topApplicants, applicantUniqueGenerics, selfMfr, total: d.length };
  }, []);

  const tabs = [
    { key: "manufacturers", label: "Manufacturers" },
    { key: "generics", label: "Generics & Dosage" },
    { key: "applicants", label: "Applicants" },
  ];

  const pill = (label, val, color = "#193441") => (
    <div style={{ display: "flex", flexDirection: "column", background: "white", border: "1px solid #e2e8f0", borderTop: `3px solid ${color}`, padding: "1rem 1.25rem", minWidth: "140px", flex: 1 }}>
      <span style={{ fontSize: "24px", fontWeight: "800", color, lineHeight: 1 }}>{val.toLocaleString()}</span>
      <span style={{ fontSize: "10px", color: "#888", textTransform: "uppercase", letterSpacing: "0.6px", marginTop: "6px", fontWeight: "600" }}>{label}</span>
    </div>
  );

  return (
    <div style={{ fontSize: "13px", background: "#f7f8fa", minHeight: "400px" }}>
      {/* Header */}
      <div style={{ background: "#193441", padding: "1.25rem 1.5rem", marginBottom: "1.25rem" }}>
        <div style={{ fontSize: "13px", fontWeight: "800", color: "white", letterSpacing: "1.5px", textTransform: "uppercase" }}>Analytics</div>
        <div style={{ fontSize: "11px", color: "#8ab0bb", marginTop: "3px" }}>Accepted dossier database — {acceptedDossiers.length.toLocaleString()} records</div>
      </div>
      <div style={{ padding: "0 1.25rem" }}>
      <div style={{ display: "flex", borderBottom: "2px solid #e2e8f0", marginBottom: "1.5rem", overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            background: "transparent", border: "none", borderBottom: tab === t.key ? "3px solid #2b6cb0" : "3px solid transparent",
            color: tab === t.key ? "#2b6cb0" : "#666", padding: "0.65rem 1.25rem", fontSize: "12px",
            fontWeight: tab === t.key ? "700" : "500", cursor: "pointer", marginBottom: "-2px",
            letterSpacing: "0.3px", textTransform: "uppercase", whiteSpace: "nowrap",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "manufacturers" && (
        <div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            {pill("Total Dossiers", stats.total)}
            {pill("Local Manufacturers", stats.local, "#276749")}
            {pill("Foreign Manufacturers", stats.foreign, "#c53030")}
            {pill("Self-Manufacturing", stats.selfMfr, "#b7410e")}
          </div>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <div style={{ flex: 1, minWidth: "280px" }}>
              <div style={{ fontSize: "10px", fontWeight: "800", color: "#555", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "0.75rem", paddingBottom: "6px", borderBottom: "1px solid #e2e8f0" }}>Local vs Foreign Split</div>
              <PieChart slices={[
                { label: "Local (Nigerian)", value: stats.local },
                { label: "Foreign", value: stats.foreign },
              ]} />
            </div>
            <div style={{ flex: 1, minWidth: "280px" }}>
              <div style={{ fontSize: "10px", fontWeight: "800", color: "#555", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "0.75rem", paddingBottom: "6px", borderBottom: "1px solid #e2e8f0" }}>Top Countries of Origin</div>
              <PieChart slices={[
                ...stats.topCountries.slice(0, 8).map(([label, value]) => ({ label, value })),
                ...(stats.topCountries.length > 8 ? [{ label: "Others", value: stats.topCountries.slice(8).reduce((s, [, v]) => s + v, 0) }] : []),
              ]} />
            </div>
          </div>
          <RankedTable title="Top Manufacturers by Dossier Count" rows={stats.topMfr} label="Manufacturer" total={stats.total} />
          <RankedTable title="Top Manufacturers by Unique Generics" rows={stats.mfrUniqueGenerics} label="Manufacturer" />
          <RankedTable title="Top Manufacturers by Unique Dosage Forms" rows={stats.mfrUniqueDosage} label="Manufacturer"
            renderSub={forms => forms?.length ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginTop: "5px" }}>
                {forms.map((f, i) => (
                  <span key={i} style={{ fontSize: "10px", background: "#eef2f7", color: "#2b6cb0", padding: "1px 6px", border: "1px solid #c3d4e8", fontWeight: "600", letterSpacing: "0.2px" }}>{f}</span>
                ))}
              </div>
            ) : null}
          />
          <RankedTable title="Top Countries of Origin" rows={stats.topCountries} label="Country / Region" total={stats.total} />
        </div>
      )}

      {tab === "generics" && (
        <div>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <div style={{ flex: 1, minWidth: "280px" }}>
              <div style={{ fontSize: "10px", fontWeight: "800", color: "#555", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "0.75rem", paddingBottom: "6px", borderBottom: "1px solid #e2e8f0" }}>Dosage Form Distribution</div>
              <PieChart slices={[
                ...stats.topDosage.slice(0, 8).map(([label, value]) => ({ label, value })),
                ...(stats.topDosage.length > 8 ? [{ label: "Others", value: stats.topDosage.slice(8).reduce((s, [, v]) => s + v, 0) }] : []),
              ]} />
            </div>
            <div style={{ flex: 1, minWidth: "280px" }}>
              <div style={{ fontSize: "10px", fontWeight: "800", color: "#555", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "0.75rem", paddingBottom: "6px", borderBottom: "1px solid #e2e8f0" }}>Top Generics Distribution</div>
              <PieChart slices={[
                ...stats.topGenerics.slice(0, 8).map(([label, value]) => ({ label, value })),
                ...(stats.topGenerics.length > 8 ? [{ label: "Others", value: stats.topGenerics.slice(8).reduce((s, [, v]) => s + v, 0) }] : []),
              ]} />
            </div>
          </div>
          <RankedTable title="Most Registered Generic Names" rows={stats.topGenerics} label="Generic Name" total={stats.total} />
          <RankedTable title="Most Common Dosage Forms" rows={stats.topDosage} label="Dosage Form" total={stats.total} />
          <RankedTable title="Top Generic + Dosage Form Combinations" rows={stats.topCombos} label="Generic — Dosage Form" total={stats.total} />
        </div>
      )}

      {tab === "applicants" && (
        <div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            {pill("Self-Manufacturing Applicants", stats.selfMfr, "#b7410e")}
          </div>
          <div style={{ fontSize: "10px", fontWeight: "800", color: "#555", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "0.75rem", paddingBottom: "6px", borderBottom: "1px solid #e2e8f0" }}>Top Applicants Distribution</div>
          <PieChart slices={[
            ...stats.topApplicants.slice(0, 8).map(([label, value]) => ({ label, value })),
            ...(stats.topApplicants.length > 8 ? [{ label: "Others", value: stats.topApplicants.slice(8).reduce((s, [, v]) => s + v, 0) }] : []),
          ]} />
          <RankedTable title="Top Applicants by Dossier Count" rows={stats.topApplicants} label="Applicant" total={stats.total} />
          <RankedTable title="Top Applicants by Unique Generics" rows={stats.applicantUniqueGenerics} label="Applicant" />
        </div>
      )}
      </div>
    </div>
  );
}

function Analytics() {
  const [subTab, setSubTab] = useState('registry');
  return (
    <div>
      <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: '1.25rem', background: 'white' }}>
        {[{ key: 'registry', label: 'Registry Analytics' }, { key: 'dossier', label: 'Dossier Analytics' }].map(t => (
          <button key={t.key} onClick={() => setSubTab(t.key)} style={{
            background: 'transparent', border: 'none',
            borderBottom: subTab === t.key ? '3px solid #2b6cb0' : '3px solid transparent',
            color: subTab === t.key ? '#2b6cb0' : '#666',
            padding: '0.65rem 1.5rem', fontSize: '12px',
            fontWeight: subTab === t.key ? '700' : '500',
            cursor: 'pointer', marginBottom: '-2px',
            letterSpacing: '0.3px', textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>{t.label}</button>
        ))}
      </div>
      {subTab === 'registry' && <RegistryAnalyticsTab />}
      {subTab === 'dossier' && <DossierAnalyticsTab />}
    </div>
  );
}

function TabButton({ label, count, active, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        color: active ? color : "#666",
        border: "none",
        borderBottom: active ? `3px solid ${color}` : "3px solid transparent",
        padding: "0.65rem 1.25rem",
        fontSize: "13px",
        fontWeight: active ? "700" : "500",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "-2px",
        letterSpacing: "0.2px",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {label}
      {count !== null && (
        <span style={{
          background: active ? color : "#e2e8f0",
          color: active ? "white" : "#666",
          borderRadius: "999px",
          padding: "1px 7px",
          fontSize: "11px",
          fontWeight: "700",
        }}>
          {count.toLocaleString()}
        </span>
      )}
    </button>
  );
}

function RiskCheck() {
  const [mode, setMode] = useState("manual");
  const [batchRows, setBatchRows] = useState(null);
  const [batchError, setBatchError] = useState("");
  const [batchStatus, setBatchStatus] = useState("idle");
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchResults, setBatchResults] = useState([]);
  const batchCancelRef = useRef(false);
  const fileInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [previewPage, setPreviewPage] = useState(1);
  const [selectedPreviewIdx, setSelectedPreviewIdx] = useState(null);
  const previewTableRef = useRef(null);
  const scrollToPreview = () => {
    const y = (previewTableRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
  };
  const handlePreviewPage = (p) => { setPreviewPage(p); setSelectedPreviewIdx(null); scrollToPreview(); };

  const processFile = (file) => {
    if (!file) return;
    setBatchError("");
    setBatchRows(null);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json(ws, { defval: "" });
        const rows = raw.map(r => ({
          sn:                   String(r["S/N"] || r["s/n"] || r["SN"] || "").trim(),
          name:                 String(r["Name"] || r["name"] || r["NAME"] || "").trim(),
          dossier_number:       String(r["Dossier Number"] || r["Dossier No."] || r["Dossier No"] || r["dossier_number"] || r["dossier number"] || r["Name (Dossier No.)"] || r["Name"] || r["name"] || r["NAME"] || "").trim(),
          applicant:            String(r["Applicant"] || r["applicant"] || "").trim(),
          generic_name:         String(r["Generic Name"] || r["generic_name"] || r["Generic name"] || "").trim(),
          dosage_form:          String(r["Dosage form"] || r["Dosage Form"] || r["dosage_form"] || "").trim(),
          manufacturer_name:    String(r["Manufacturer Name"] || r["manufacturer_name"] || r["Manufacturer name"] || "").trim(),
          manufacturer_address: String(r["Manufacturer Address"] || r["manufacturer_address"] || r["Manufacturer address"] || "").trim(),
          status:               String(r["Status"] || r["status"] || "").trim(),
        })).filter(r => r.generic_name);
        if (rows.length === 0) { setBatchError("No valid rows found. Check that your headers match the expected format."); return; }
        setBatchRows(rows);
      } catch (err) {
        setBatchError("Failed to parse file: " + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFile = (e) => processFile(e.target.files[0]);
  const handleDrop = (e) => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]); };

  const exportToExcel = useCallback(() => {
    const data = batchRows.map((r, i) => ({
      "S/N": r.sn || i + 1,
      "Dossier No.": r.dossier_number || "",
      "Generic Name": r.generic_name || "",
      "Dosage Form": r.dosage_form || "",
      "Manufacturer Name": r.manufacturer_name || "",
      "Manufacturer Address": r.manufacturer_address || "",
      "Risk Categorization": batchResults[i]?.risk || "",
      "Categorization Reason": getRiskReasonLabel(batchResults[i]?.reason),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Risk Report");
    XLSX.writeFile(wb, "risk_categorization.xlsx");
  }, [batchRows, batchResults]);

  const runBatchChecks = useCallback(() => {
    if (!batchRows || !batchRows.length) return;
    batchCancelRef.current = false;
    setBatchStatus("running");
    setBatchProgress(0);
    setBatchResults([]);
    const total = batchRows.length;
    const CHUNK = 20;
    let i = 0;
    const accumulated = [];
    function processChunk() {
      if (batchCancelRef.current) { setBatchStatus("idle"); return; }
      const end = Math.min(i + CHUNK, total);
      for (; i < end; i++) {
        const row = batchRows[i];
        if (isHighRiskDosage(row.dosage_form)) { accumulated.push({ risk: "HIGH", reason: "high_risk_dosage" }); continue; }
        if (isSterileDosage(row.dosage_form)) {
          const m = findSterileDossierMatch(row);
          if (m) { accumulated.push({ risk: "LOW", reason: "sterile_dossier_match", dossierMatches: [m] }); continue; }
          const n = findSterileNafdacMatch(row);
          if (n) { accumulated.push({ risk: "MEDIUM", reason: "sterile_nafdac_match", nafdacMatches: [n] }); continue; }
          accumulated.push({ risk: "HIGH", reason: "sterile_no_match" });
          continue;
        }
        const dm = findSterileDossierMatch(row);
        if (dm) { accumulated.push({ risk: "LOW", reason: "dossier_match", dossierMatches: [dm] }); continue; }
        const nm = findSterileNafdacMatch(row);
        if (nm) { accumulated.push({ risk: "LOW", reason: "nafdac_match", nafdacMatches: [nm] }); continue; }
        const dosageMismatch = findOtherDosageMismatch(row);
        if (dosageMismatch) { accumulated.push({ risk: "HIGH", reason: "dosage_mismatch", dossierMatches: [dosageMismatch] }); continue; }
        const genericMismatch = findOtherGenericMismatch(row);
        if (genericMismatch) { accumulated.push({ risk: "MEDIUM", reason: "generic_mismatch", dossierMatches: [genericMismatch] }); continue; }
        accumulated.push({ risk: "HIGH", reason: "no_match" });
      }
      setBatchProgress(Math.round((i / total) * 100));
      if (i < total) { setTimeout(processChunk, 0); }
      else { setBatchResults([...accumulated]); setBatchStatus("done"); }
    }
    setTimeout(processChunk, 0);
  }, [batchRows]);

  const [form, setForm] = useState({ generic_name: "", dosage_form: "", manufacturer_name: "", manufacturer_address: "" });
  const [submitted, setSubmitted] = useState(null);
  const [selected, setSelected] = useState(null);
  const [notification, setNotification] = useState("");
  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  const manualResult = submitted
    ? isHighRiskDosage(submitted.dosage_form)
      ? { risk: "HIGH", reason: "high_risk_dosage" }
      : isSterileDosage(submitted.dosage_form)
        ? (() => {
            const m = findSterileDossierMatch(submitted);
            if (m) return { risk: "LOW", reason: "sterile_dossier_match", dossierMatches: [m] };
            const n = findSterileNafdacMatch(submitted);
            if (n) return { risk: "MEDIUM", reason: "sterile_nafdac_match", nafdacMatches: [n] };
            return { risk: "HIGH", reason: "sterile_no_match" };
          })()
        : (() => {
            const dm = findSterileDossierMatch(submitted);
            if (dm) return { risk: "LOW", reason: "dossier_match", dossierMatches: [dm] };
            const nm = findSterileNafdacMatch(submitted);
            if (nm) return { risk: "LOW", reason: "nafdac_match", nafdacMatches: [nm] };
            const dosageMismatch = findOtherDosageMismatch(submitted);
            if (dosageMismatch) return { risk: "HIGH", reason: "dosage_mismatch", dossierMatches: [dosageMismatch] };
            const genericMismatch = findOtherGenericMismatch(submitted);
            if (genericMismatch) return { risk: "MEDIUM", reason: "generic_mismatch", dossierMatches: [genericMismatch] };
            return { risk: "HIGH", reason: "no_match" };
          })()
    : null;
  const handleSearch = () => {
    if (!form.generic_name.trim()) return;
    setSelected(null);
    setNotification("");
    setSubmitted({ ...form });
  };

  const inputStyle = { width: "100%", padding: "0.55rem 0.75rem", border: "1px solid #ccc", fontSize: "13px", outline: "none", boxSizing: "border-box" };
  const labelStyle = { fontSize: "11px", fontWeight: "600", color: "#555", textTransform: "uppercase", letterSpacing: "0.4px", display: "block", marginBottom: "4px" };

  return (
    <div style={{ background: "#f7f8fa", minHeight: "400px" }}>
      <div style={{ background: "#193441", padding: "1.25rem 1.5rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <div style={{ fontSize: "13px", fontWeight: "800", color: "white", letterSpacing: "1.5px", textTransform: "uppercase" }}>Risk Check</div>
          <div style={{ fontSize: "11px", color: "#8ab0bb", marginTop: "3px" }}>Verify products against NAFDAC registry &amp; accepted dossier database</div>
        </div>
        <div style={{ display: "flex", border: "1px solid rgba(255,255,255,0.15)", overflow: "hidden" }}>
          {[{ key: "manual", label: "Manual Check" }, { key: "batch", label: "Batch Upload" }].map(m => (
            <button key={m.key} onClick={() => setMode(m.key)} style={{ padding: "0.45rem 1.2rem", fontSize: "11px", fontWeight: "700", cursor: "pointer", border: "none", letterSpacing: "0.5px", textTransform: "uppercase", background: mode === m.key ? "#7b2d8b" : "transparent", color: mode === m.key ? "white" : "#8ab0bb", transition: "all 0.15s" }}>{m.label}</button>
          ))}
        </div>
      </div>

      {mode === "batch" && (
        <div style={{ padding: "0 1.25rem 1.25rem" }}>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            style={{ border: `2px dashed ${dragging ? "#7b2d8b" : batchRows ? "#276749" : "#ccc"}`, padding: "2rem 1.5rem", textAlign: "center", background: dragging ? "#f3e8ff" : batchRows ? "#f0fff4" : "white", transition: "all 0.15s", cursor: batchRows ? "default" : "pointer" }}
            onClick={() => !batchRows && fileInputRef.current.click()}>
            <div style={{ fontSize: "22px", marginBottom: "0.4rem", opacity: 0.6 }}>{batchRows ? "✓" : "⬆"}</div>
            <div style={{ fontSize: "13px", fontWeight: "700", color: batchRows ? "#276749" : "#193441", marginBottom: "3px" }}>
              {batchRows ? `${batchRows.length} rows loaded` : "Drop Excel file here or click to browse"}
            </div>
            <div style={{ fontSize: "11px", color: "#999", marginBottom: "1rem" }}>
              {batchRows ? <span style={{ color: "#276749" }}>File parsed successfully — run checks when ready</span> : ".xlsx · .xls · .csv"}
            </div>
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} style={{ display: "none" }} />
            <button onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}
              style={{ padding: "0.45rem 1.4rem", background: batchRows ? "#555" : "#193441", color: "white", border: "none", fontWeight: "700", fontSize: "11px", cursor: "pointer", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              {batchRows ? "Replace File" : "Choose File"}
            </button>
          </div>
          {batchError && (
            <div style={{ background: "#fff5f5", borderLeft: "4px solid #c53030", color: "#c53030", padding: "0.75rem 1rem", fontSize: "13px", marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontWeight: "700" }}>⚠</span> {batchError}
            </div>
          )}
          {batchRows && (
            <div style={{ marginTop: "1rem", background: "white", border: "1px solid #e2e8f0" }}>
              <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#193441" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "white" }}>
                  {batchRows.length} ROWS
                  {batchStatus === "done" && <span style={{ marginLeft: "0.75rem", fontSize: "11px", color: "#8ab0bb", fontWeight: "400" }}>— analysis complete</span>}
                </span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {batchStatus !== "running" ? (
                    <button onClick={runBatchChecks} style={{ padding: "0.35rem 1rem", background: "#7b2d8b", color: "white", border: "none", fontWeight: "700", fontSize: "11px", cursor: "pointer", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                      {batchStatus === "done" ? "↺ Re-run" : "▶ Run Checks"}
                    </button>
                  ) : (
                    <button onClick={() => { batchCancelRef.current = true; }} style={{ padding: "0.35rem 1rem", background: "#555", color: "white", border: "none", fontWeight: "700", fontSize: "11px", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.5px" }}>✕ Cancel</button>
                  )}
                  {batchStatus === "done" && (
                    <button onClick={exportToExcel} style={{ padding: "0.35rem 1rem", background: "#276749", color: "white", border: "none", fontWeight: "700", fontSize: "11px", cursor: "pointer", letterSpacing: "0.5px", textTransform: "uppercase" }}>↓ Export Excel</button>
                  )}
                </div>
              </div>
              {batchStatus === "running" && (
                <div style={{ padding: "0.4rem 1rem", background: "#f7f8fa", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ flex: 1, background: "#e2e8f0", height: "6px" }}>
                    <div style={{ background: "linear-gradient(90deg, #193441, #7b2d8b)", height: "6px", width: `${batchProgress}%`, transition: "width 0.2s" }} />
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#193441", minWidth: "32px", textAlign: "right" }}>{batchProgress}%</span>
                </div>
              )}
              <div style={{ padding: "0.5rem" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                    <thead ref={previewTableRef}>
                      <tr>
                        {["S/N", "Dossier No.", "Generic Name", "Dosage Form", "Manufacturer Name", "Manufacturer Address"].map(h => (
                          <th key={h} style={thStyle}>{h}</th>
                        ))}
                        {batchStatus === "done" && <th style={thStyle}>Risk Categorization</th>}
                        {batchStatus === "done" && <th style={{ ...thStyle, width: "28px" }}></th>}
                      </tr>
                    </thead>
                    <tbody>
                      {batchRows.slice((previewPage - 1) * ITEMS_PER_PAGE, previewPage * ITEMS_PER_PAGE).map((r, i) => {
                        const absIdx = (previewPage - 1) * ITEMS_PER_PAGE + i;
                        return (
                          <React.Fragment key={absIdx}>
                            <tr
                              onClick={() => batchStatus === "done" ? setSelectedPreviewIdx(selectedPreviewIdx === absIdx ? null : absIdx) : null}
                              style={{ background: selectedPreviewIdx === absIdx ? "#eef4fb" : i % 2 === 0 ? "white" : "#fafafa", cursor: batchStatus === "done" ? "pointer" : "default", transition: "background 0.1s" }}>
                              <td style={{ ...tdStyle, color: "#999", fontSize: "11px", textAlign: "center" }}>{r.sn || absIdx + 1}</td>
                              <td style={{ ...tdStyle, fontWeight: "600", color: "#7b2d8b", fontFamily: "monospace", fontSize: "11px", textAlign: "center" }}>{r.dossier_number || "—"}</td>
                              <td style={tdStyle}>{r.generic_name || "—"}</td>
                              <td style={{ ...tdStyle, textTransform: "capitalize" }}>{r.dosage_form || "—"}</td>
                              <td style={{ ...tdStyle, fontSize: "11px" }}>{r.manufacturer_name || "—"}</td>
                              <td style={{ ...tdStyle, fontSize: "11px", color: "#666" }}>{r.manufacturer_address || "—"}</td>
                              {batchStatus === "done" && (() => { const res = batchResults[absIdx] || {}; const color = res.risk === "HIGH" ? "#c0392b" : res.risk === "MEDIUM" ? "#e67e22" : res.risk === "LOW" ? "#27ae60" : "#aaa"; return <td style={{ ...tdStyle, textAlign: "center", verticalAlign: "middle" }}><span style={{ color, fontWeight: res.risk ? "700" : "400", fontSize: "11px" }}>{res.risk || "—"}</span></td>; })()}
                              {batchStatus === "done" && <td style={{ ...tdStyle, textAlign: "center", color: "#bbb", fontSize: "11px" }}>{selectedPreviewIdx === absIdx ? "▲" : "▼"}</td>}
                            </tr>
                            {selectedPreviewIdx === absIdx && (
                              <tr><td colSpan={8} style={{ padding: 0, border: "1px solid #e2e8f0" }}>
                                <RowDetailPanel res={batchResults[absIdx]} />
                              </td></tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <Pagination page={previewPage} totalPages={Math.ceil(batchRows.length / ITEMS_PER_PAGE)} setPage={handlePreviewPage} total={batchRows.length} filtered={batchRows.length} />
              </div>
            </div>
          )}
          {batchStatus === "done" && batchResults.length > 0 && (
            <div style={{ padding: "0 1.25rem 1.25rem" }}>
              <BatchResultsTable results={batchResults} rows={batchRows} />
            </div>
          )}
        </div>
      )}

      {mode === "manual" && (
        <div style={{ padding: "0 1.25rem 1.25rem" }}>
          <div style={{ background: "white", border: "1px solid #e2e8f0" }}>
            <div style={{ background: "#193441", padding: "0.75rem 1.25rem" }}>
              <div style={{ fontSize: "11px", fontWeight: "800", color: "white", letterSpacing: "1px", textTransform: "uppercase" }}>Product Details</div>
              <div style={{ fontSize: "11px", color: "#8ab0bb", marginTop: "2px" }}>Enter product information to check against the registry</div>
            </div>
            <div style={{ padding: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                <div>
                  <label style={labelStyle}>Generic Name <span style={{ color: "#c53030" }}>*</span></label>
                  <input style={inputStyle} value={form.generic_name} onChange={set("generic_name")} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="e.g. Ampicillin 60mg + Cloxacillin 30mg" />
                </div>
                <div>
                  <label style={labelStyle}>Dosage Form</label>
                  <input style={inputStyle} value={form.dosage_form} onChange={set("dosage_form")} placeholder="e.g. Tablet, Injection, Suspension" />
                </div>
                <div>
                  <label style={labelStyle}>Manufacturer Name</label>
                  <input style={inputStyle} value={form.manufacturer_name} onChange={set("manufacturer_name")} placeholder="e.g. Kamla Lifesciences Ltd" />
                </div>
                <div>
                  <label style={labelStyle}>Manufacturer Address</label>
                  <input style={inputStyle} value={form.manufacturer_address} onChange={set("manufacturer_address")} placeholder="e.g. Plot G-84/1, Tarapur MIDC, Boisar, Maharashtra, India" />
                </div>
              </div>
              <button onClick={handleSearch} disabled={!form.generic_name.trim()}
                style={{ padding: "0.55rem 2rem", background: "#193441", color: "white", border: "none", fontWeight: "700", fontSize: "11px", cursor: form.generic_name.trim() ? "pointer" : "default", opacity: form.generic_name.trim() ? 1 : 0.45, letterSpacing: "0.8px", textTransform: "uppercase" }}>
                Run Check
              </button>
            </div>
          </div>
          {notification && (
            <div style={{ background: "#fffbeb", borderLeft: "4px solid #d69e2e", color: "#856404", padding: "0.75rem 1rem", fontSize: "12px", marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "600" }}>
              <span>&#9888;</span> {notification}
            </div>
          )}
          {submitted && (
            <div style={{ marginTop: "1rem", background: "#f9f9f9", border: "1px solid #ccc", borderLeft: `4px solid ${manualResult?.risk === "HIGH" ? "#c0392b" : manualResult?.risk === "MEDIUM" ? "#e67e22" : manualResult?.risk === "LOW" ? "#27ae60" : "#555"}`, padding: "0.75rem 1rem", fontSize: "12px", color: "#555" }}>
              {manualResult ? (
                <><span style={{ fontWeight: "700", color: manualResult.risk === "HIGH" ? "#c0392b" : manualResult.risk === "MEDIUM" ? "#e67e22" : "#27ae60" }}>{manualResult.risk} RISK</span>{manualResult.reason === "high_risk_dosage" && <span style={{ marginLeft: "0.5rem" }}>— High-risk dosage form</span>}</>
              ) : "Classification pending."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RowDetailPanel({ res }) {
  if (!res || !res.risk) return <div style={{ padding: "1rem", background: "#f7f8fa", color: "#888", fontSize: "12px" }}>Classification pending.</div>;
  const { risk, reason, dossierMatches = [], nafdacMatches = [], row } = res;
  const riskColor = risk === "HIGH" ? "#c53030" : risk === "LOW" ? "#276749" : risk === "MEDIUM" ? "#b7410e" : "#555";
  const riskBg = risk === "HIGH" ? "#fff5f5" : risk === "LOW" ? "#f0fff4" : risk === "MEDIUM" ? "#fff8f5" : "#f9f9f9";
  const reasonLabel = getRiskReasonLabel(reason);
  return (
    <div style={{ padding: "1rem", background: "#f7f8fa", borderTop: `3px solid ${riskColor}` }}>
      <div style={{ background: riskBg, border: `1px solid ${riskColor}`, borderLeft: `4px solid ${riskColor}`, padding: "0.85rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <div>
          <div style={{ fontSize: "10px", fontWeight: "800", color: "#888", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "3px" }}>Risk Verdict</div>
          <div style={{ fontSize: "16px", fontWeight: "800", color: riskColor, letterSpacing: "0.5px" }}>{risk} RISK</div>
          {reasonLabel && <div style={{ fontSize: "11px", color: riskColor, marginTop: "2px", opacity: 0.8 }}>{reasonLabel}</div>}
        </div>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          {[{ label: "Dossier Matches", val: dossierMatches.length, color: "#7b2d8b" }, { label: "NAFDAC Matches", val: nafdacMatches.length, color: "#276749" }].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "15px", fontWeight: "800", color: s.color }}>{s.val}</div>
              <div style={{ fontSize: "10px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      {dossierMatches.length > 0 && (
        <div style={{ marginBottom: "0.75rem", background: "white", border: "1px solid #e2e8f0" }}>
          <div style={{ padding: "0.55rem 1rem", background: "#193441", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "white", letterSpacing: "0.5px", textTransform: "uppercase" }}>Accepted Dossier Matches</span>
            <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 10px", background: "#7b2d8b", color: "white" }}>{dossierMatches.length}</span>
          </div>
          <div style={{ overflowX: "auto", padding: "0.5rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead><tr>{["#", "Dossier No.", "Generic Name", "Dosage Form", "Manufacturer", "Manufacturer Address"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
              <tbody>{dossierMatches.map((d, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#fafafa" }}>
                  <td style={{ ...tdStyle, textAlign: "center", color: "#999", fontSize: "11px" }}>{i + 1}</td>
                  <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: "11px", color: "#7b2d8b", fontWeight: "600", textAlign: "center" }}>{d.dossier_number || "—"}</td>
                  <td style={tdStyle}>{d.generic_name || "—"}</td>
                  <td style={{ ...tdStyle, textTransform: "capitalize" }}>{d.dosage_form || "—"}</td>
                  <td style={{ ...tdStyle, fontSize: "11px" }}>{d.manufacturer_name || "—"}</td>
                  <td style={{ ...tdStyle, fontSize: "11px", color: "#666" }}>{d.manufacturer_address || "—"}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
      {nafdacMatches.length > 0 && (
        <div style={{ marginBottom: "0.75rem", background: "white", border: "1px solid #e2e8f0" }}>
          <div style={{ padding: "0.55rem 1rem", background: "#193441", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "white", letterSpacing: "0.5px", textTransform: "uppercase" }}>NAFDAC Registry Matches</span>
            <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 10px", background: "#276749", color: "white" }}>{nafdacMatches.length}</span>
          </div>
          <div style={{ overflowX: "auto", padding: "0.5rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead><tr>{["#", "NAFDAC No.", "Brand Name", "Generic Name / Strength", "Dosage Form", "Manufacturer"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
              <tbody>{nafdacMatches.map((r, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#fafafa" }}>
                  <td style={{ ...tdStyle, textAlign: "center", color: "#999", fontSize: "11px" }}>{i + 1}</td>
                  <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: "11px", color: "#276749", fontWeight: "600", textAlign: "center" }}>{r["NAFDAC NO"] || "—"}</td>
                  <td style={{ ...tdStyle, fontWeight: "600", color: "#193441" }}>{r["BRAND NAME"] || "—"}</td>
                  <td style={tdStyle}>{stripBrackets(r["GENERIC NAME /STRENGTH"]) || "—"}</td>
                  <td style={{ ...tdStyle, textTransform: "capitalize" }}>{r["DOSAGE FORM"] || "—"}</td>
                  <td style={{ ...tdStyle, fontSize: "11px" }}>{r["NAME OF MANUFACTRER/ADDRESS"] || "—"}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function BatchResultsTable({ results, rows }) {
  const enrichedResults = results.map((r, i) => ({ ...r, row: rows[i] }));
  const highRisk = enrichedResults.filter(r => r.risk === "HIGH");
  const lowRisk = enrichedResults.filter(r => r.risk === "LOW");
  const mediumRisk = enrichedResults.filter(r => r.risk === "MEDIUM");
  const pending = enrichedResults.filter(r => !r.risk);

  const exportRiskRowsToExcel = useCallback((sheetName, riskRows) => {
    const data = riskRows.map((r, i) => ({
      "S/N": r.row?.sn || i + 1,
      "Dossier No.": r.row?.dossier_number || "",
      "Generic Name": r.row?.generic_name || "",
      "Dosage Form": r.row?.dosage_form || "",
      "Manufacturer Name": r.row?.manufacturer_name || "",
      "Manufacturer Address": r.row?.manufacturer_address || "",
      "Risk Categorization": r.risk || "",
      "Categorization Reason": getRiskReasonLabel(r.reason),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${sheetName.toLowerCase().replace(/\s+/g, "_")}.xlsx`);
  }, []);

  const highRiskRows = highRisk.map((r, i) => [
    <span style={{ color: "#999", fontSize: "11px" }}>{i + 1}</span>,
    <span style={{ fontWeight: "700", color: "#7b2d8b", fontFamily: "monospace", fontSize: "11px", display: "block", textAlign: "center" }}>{r.row.dossier_number || "—"}</span>,
    r.row.generic_name || "—",
    <span style={{ textTransform: "capitalize" }}>{r.row.dosage_form || "—"}</span>,
    <span style={{ fontSize: "11px" }}>{r.row.manufacturer_name || "—"}</span>,
    <span style={{ fontSize: "11px", color: "#c53030", fontWeight: "600" }}>{getRiskReasonLabel(r.reason)}</span>,
  ]);

  const lowRiskRows = lowRisk.map((r, i) => [
    <span style={{ color: "#999", fontSize: "11px" }}>{i + 1}</span>,
    <span style={{ fontWeight: "700", color: "#7b2d8b", fontFamily: "monospace", fontSize: "11px", display: "block", textAlign: "center" }}>{r.row.dossier_number || "—"}</span>,
    r.row.generic_name || "—",
    <span style={{ textTransform: "capitalize" }}>{r.row.dosage_form || "—"}</span>,
    <span style={{ fontSize: "11px" }}>{r.row.manufacturer_name || "—"}</span>,
    <span style={{ fontSize: "11px", background: "#c6f6d5", color: "#276749", padding: "2px 6px", fontWeight: "600" }}>{getRiskReasonLabel(r.reason)}</span>,
  ]);

  const mediumRiskRows = mediumRisk.map((r, i) => [
    <span style={{ color: "#999", fontSize: "11px" }}>{i + 1}</span>,
    <span style={{ fontWeight: "700", color: "#7b2d8b", fontFamily: "monospace", fontSize: "11px", display: "block", textAlign: "center" }}>{r.row.dossier_number || "—"}</span>,
    r.row.generic_name || "—",
    <span style={{ textTransform: "capitalize" }}>{r.row.dosage_form || "—"}</span>,
    <span style={{ fontSize: "11px" }}>{r.row.manufacturer_name || "—"}</span>,
    <span style={{ fontSize: "11px", background: "#fde8d8", color: "#b7410e", padding: "2px 6px", fontWeight: "600" }}>{getRiskReasonLabel(r.reason)}</span>,
  ]);

  return (
    <div style={{ marginTop: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem", marginBottom: "1.25rem" }}>
        {[
          { label: "High Risk", count: highRisk.length, color: "#c53030", bg: "#fff5f5" },
          { label: "Medium Risk", count: mediumRisk.length, color: "#b7410e", bg: "#fff8f5" },
          { label: "Low Risk", count: lowRisk.length, color: "#276749", bg: "#f0fff4" },
          { label: "Pending", count: pending.length, color: "#555", bg: "#f9f9f9" },
        ].map(({ label, count, color, bg }) => (
          <div key={label} style={{ background: bg, border: `1px solid #e2e8f0`, borderLeft: `4px solid ${color}`, padding: "0.75rem 1rem" }}>
            <div style={{ fontSize: "22px", fontWeight: "700", color, lineHeight: 1 }}>{count}</div>
            <div style={{ fontSize: "11px", color: "#666", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.4px" }}>{label}</div>
            <div style={{ fontSize: "11px", color: "#aaa", marginTop: "2px" }}>{results.length ? ((count / results.length) * 100).toFixed(1) : 0}%</div>
          </div>
        ))}
      </div>
      <RiskPanel title="⚠ HIGH RISK" count={highRisk.length} color="#c53030" bgColor="#fff5f5">
        {highRisk.length > 0 && (
          <div style={{ padding: "0 1rem 0.75rem" }}>
            <button onClick={() => exportRiskRowsToExcel("High Risk", highRisk)} style={{ padding: "0.4rem 1rem", background: "#c53030", color: "white", border: "none", fontWeight: "700", fontSize: "11px", cursor: "pointer", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              ↓ Export Excel
            </button>
          </div>
        )}
        <RiskTable headers={["#", "Dossier No.", "Generic Name", "Dosage Form", "Manufacturer", "Reason"]} rows={highRiskRows} emptyMsg="No high risk items." />
      </RiskPanel>
      <RiskPanel title="◈ MEDIUM RISK" count={mediumRisk.length} color="#b7410e" bgColor="#fff8f5">
        {mediumRisk.length > 0 && (
          <div style={{ padding: "0 1rem 0.75rem" }}>
            <button onClick={() => exportRiskRowsToExcel("Medium Risk", mediumRisk)} style={{ padding: "0.4rem 1rem", background: "#b7410e", color: "white", border: "none", fontWeight: "700", fontSize: "11px", cursor: "pointer", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              ↓ Export Excel
            </button>
          </div>
        )}
        <RiskTable headers={["#", "Dossier No.", "Generic Name", "Dosage Form", "Manufacturer", "Reason"]} rows={mediumRiskRows} emptyMsg="No medium risk items." />
      </RiskPanel>
      <RiskPanel title="✓ LOW RISK" count={lowRisk.length} color="#276749" bgColor="#f0fff4">
        {lowRisk.length > 0 && (
          <div style={{ padding: "0 1rem 0.75rem" }}>
            <button onClick={() => exportRiskRowsToExcel("Low Risk", lowRisk)} style={{ padding: "0.4rem 1rem", background: "#276749", color: "white", border: "none", fontWeight: "700", fontSize: "11px", cursor: "pointer", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              ↓ Export Excel
            </button>
          </div>
        )}
        <RiskTable headers={["#", "Dossier No.", "Generic Name", "Dosage Form", "Manufacturer", "Reason"]} rows={lowRiskRows} emptyMsg="No low risk items." />
      </RiskPanel>
      {pending.length > 0 && (
        <RiskPanel title="— PENDING" count={pending.length} color="#555" bgColor="#f9f9f9">
          <RiskTable headers={["#", "Dossier No.", "Generic Name", "Dosage Form", "Manufacturer"]} rows={pending.map((r, i) => [
            <span style={{ color: "#999", fontSize: "11px" }}>{i + 1}</span>,
            <span style={{ fontWeight: "700", color: "#7b2d8b", fontFamily: "monospace", fontSize: "11px", display: "block", textAlign: "center" }}>{r.row.dossier_number || "—"}</span>,
            r.row.generic_name || "—",
            <span style={{ textTransform: "capitalize" }}>{r.row.dosage_form || "—"}</span>,
            <span style={{ fontSize: "11px" }}>{r.row.manufacturer_name || "—"}</span>,
          ])} emptyMsg="" />
        </RiskPanel>
      )}
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div style={{ position: "relative", marginBottom: "1rem" }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "0.6rem 1rem 0.6rem 2.5rem",
          border: "1px solid #ccc",
          fontSize: "14px",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
      <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#999", fontSize: "14px" }}>🔍</span>
      {value && (
        <button onClick={() => onChange("")} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: "16px" }}>×</button>
      )}
    </div>
  );
}

function Pagination({ page, totalPages, setPage, total, filtered }) {
  if (totalPages <= 1) return (
    <div style={{ fontSize: "12px", color: "#888", marginTop: "0.75rem" }}>
      Showing {filtered} of {total} records
    </div>
  );
  const windowSize = Math.min(5, totalPages);
  const start = Math.min(Math.max(page - Math.floor(windowSize / 2), 1), totalPages - windowSize + 1);
  const pageNums = Array.from({ length: windowSize }, (_, i) => start + i);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem", fontSize: "13px" }}>
      <span style={{ color: "#666" }}>
        Showing {((page - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered)} of {filtered} records {filtered < total ? `(filtered from ${total})` : ""}
      </span>
      <div style={{ display: "flex", gap: "0.25rem" }}>
        <PagBtn label="«" disabled={page === 1} onClick={() => setPage(1)} />
        <PagBtn label="‹" disabled={page === 1} onClick={() => setPage(page - 1)} />
        {pageNums.map((p) => (
          <PagBtn key={p} label={p} active={p === page} onClick={() => setPage(p)} />
        ))}
        <PagBtn label="›" disabled={page === totalPages} onClick={() => setPage(page + 1)} />
        <PagBtn label="»" disabled={page === totalPages} onClick={() => setPage(totalPages)} />
      </div>
    </div>
  );
}

function PagBtn({ label, onClick, disabled, active }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "4px 10px",
        border: "1px solid #ddd",
        background: active ? "#193441" : disabled ? "#f5f5f5" : "white",
        color: active ? "white" : disabled ? "#bbb" : "#333",
        cursor: disabled ? "default" : "pointer",
        fontSize: "13px",
        minWidth: "32px",
      }}
    >
      {label}
    </button>
  );
}

const thStyle = {
  padding: "0.75rem 1rem",
  textAlign: "left",
  border: "1px solid #e2e8f0",
  fontWeight: "600",
  color: "#2c3e50",
  whiteSpace: "nowrap",
  background: "#f7f8fa",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.4px",
};

const tdStyle = {
  padding: "0.75rem 1rem",
  border: "1px solid #e2e8f0",
  color: "#444",
  verticalAlign: "top",
  fontSize: "13px",
};

const cleanNafdac = nafdacRegistry.filter(r => r["BRAND NAME"] || r["GENERIC NAME /STRENGTH"] || r["NAFDAC NO"]);
const missingDosageForm = nafdacRegistry.filter(r => !r["DOSAGE FORM"] || r["DOSAGE FORM"].toString().trim() === "");

// Pre-built index: first meaningful word of generic name → NAFDAC records
const nafdacIndex = (() => {
  const idx = new Map();
  for (const r of cleanNafdac) {
    const fw = clean(r["GENERIC NAME /STRENGTH"] || "").split(" ").find(t => t.length > 3);
    if (!fw) continue;
    if (!idx.has(fw)) idx.set(fw, []);
    idx.get(fw).push(r);
  }
  return idx;
})();

// Pre-built index: first meaningful word of generic name → dossier records
const dossierGenericIndex = (() => {
  const idx = new Map();
  for (const d of acceptedDossiers) {
    const fw = clean(d.generic_name || "").split(" ").find(t => t.length > 3);
    if (!fw) continue;
    if (!idx.has(fw)) idx.set(fw, []);
    idx.get(fw).push(d);
  }
  return idx;
})();

function RiskPanel({ title, count, color, bgColor, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: "1px solid #e2e8f0", borderLeft: `4px solid ${color}`, marginBottom: "0.75rem", background: "white" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1rem", background: open ? bgColor : "white", border: "none", cursor: "pointer", textAlign: "left", transition: "background 0.15s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontWeight: "700", fontSize: "13px", color, letterSpacing: "0.3px" }}>{title}</span>
          {count != null && <span style={{ background: color, color: "white", borderRadius: "999px", padding: "1px 8px", fontSize: "11px", fontWeight: "700" }}>{count}</span>}
        </div>
        <span style={{ color, fontSize: "12px" }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && <div style={{ padding: "0.75rem 1rem", background: bgColor }}>{children}</div>}
    </div>
  );
}

function RiskTable({ headers, rows, emptyMsg, searchable = true }) {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const ref = useRef(null);
  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const lq = q.toLowerCase();
    return rows.filter(row => row.some(cell => String(cell?.props?.children ?? cell ?? "").toLowerCase().includes(lq)));
  }, [rows, q]);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const safePage = Math.min(page, totalPages || 1);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);
  const handlePage = (p) => { setPage(p); const y = (ref.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 80; window.scrollTo({ top: y, behavior: "smooth" }); };
  return (
    <>
      {searchable && <SearchBar value={q} onChange={v => { setQ(v); setPage(1); }} placeholder="Search..." />}
      <div style={{ overflowX: "auto" }} ref={ref}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead><tr>{headers.map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
          <tbody>
            {paginated.length === 0
              ? <tr><td colSpan={headers.length} style={{ ...tdStyle, textAlign: "center", color: "#aaa" }}>{emptyMsg}</td></tr>
              : paginated.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#fafafa" }}>
                  {row.map((cell, j) => <td key={j} style={tdStyle}>{cell}</td>)}
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      <Pagination page={safePage} totalPages={totalPages} setPage={handlePage} total={rows.length} filtered={filtered.length} />
    </>
  );
}

function CrossReference() {
  const [status, setStatus] = useState("idle"); // idle | running | done
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [filterQuery, setFilterQuery] = useState("");
  const [page, setPage] = useState(1);
  const cancelRef = useRef(false);
  const tableRef = useRef(null);
  const scrollToTop = () => { const y = (tableRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 80; window.scrollTo({ top: y, behavior: "smooth" }); };

  const start = useCallback(() => {
    cancelRef.current = false;
    setStatus("running");
    setProgress(0);
    setResults([]);
    setPage(1);

    const dossiers = acceptedDossiers;
    const total = dossiers.length;
    let i = 0;
    const found = [];

    function processChunk() {
      if (cancelRef.current) { setStatus("idle"); return; }
      const end = Math.min(i + CHUNK_SIZE, total);
      for (; i < end; i++) {
        const d = dossiers[i];
        const fw = clean(d.generic_name || "").split(" ").find(t => t.length > 3);
        const candidates = fw ? (nafdacIndex.get(fw) || []) : [];
        for (const r of candidates) {
          if (!genericNamesMatch(d.generic_name, r["GENERIC NAME /STRENGTH"])) continue;
          const result = computeMatch(d, r);
          if (result.match_type === "EXACT") {
            found.push({ dossier: d, nafdac: r, result });
          }
        }
      }
      setProgress(Math.round((i / total) * 100));
      if (i < total) {
        setTimeout(processChunk, 0);
      } else {
        found.sort((a, b) => a.dossier.generic_name.localeCompare(b.dossier.generic_name));
        setResults(found);
        setStatus("done");
      }
    }
    setTimeout(processChunk, 0);
  }, []);

  const cancel = () => { cancelRef.current = true; };

  const filtered = useMemo(() => {
    if (!filterQuery.trim()) return results;
    const q = clean(filterQuery);
    return results.filter(({ dossier, nafdac }) =>
      clean(dossier.generic_name).includes(q) ||
      clean(dossier.manufacturer_name).includes(q) ||
      clean(nafdac["BRAND NAME"]).includes(q) ||
      clean(nafdac["NAFDAC NO"]).includes(q)
    );
  }, [results, filterQuery]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const handlePage = (p) => { setPage(p); scrollToTop(); };

  const Dot = ({ ok }) => (
    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%",
      background: ok ? "#276749" : "#c53030", marginRight: 4 }} />
  );

  return (
    <div style={{ background: "white", border: "1px solid #ddd", padding: "1rem 0.75rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div>
          <h2 style={{ margin: "0 0 0.2rem 0", fontSize: "15px", fontWeight: "700", color: "#b7410e" }}>Cross-Reference</h2>
          <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
            Finds every accepted dossier that has an exact match in the NAFDAC registry.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {status !== "running" ? (
            <button onClick={start}
              style={{ padding: "0.6rem 1.4rem", background: "#b7410e", color: "white", border: "none", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
              {status === "done" ? "Re-run" : "Run Cross-Reference"}
            </button>
          ) : (
            <button onClick={cancel}
              style={{ padding: "0.6rem 1.4rem", background: "#555", color: "white", border: "none", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {status === "running" && (
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#555", marginBottom: "4px" }}>
            <span>Processing dossiers…</span>
            <span>{progress}%</span>
          </div>
          <div style={{ background: "#eee", height: 6, borderRadius: 3 }}>
            <div style={{ background: "#b7410e", height: 6, borderRadius: 3, width: `${progress}%`, transition: "width 0.2s" }} />
          </div>
        </div>
      )}

      {status === "done" && (
        <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
          <span style={{ fontSize: "13px", color: "#276749", fontWeight: "600" }}>
            ✓ {results.length.toLocaleString()} exact match{results.length !== 1 ? "es" : ""} found across {new Set(results.map(r => r.dossier.dossier_number)).size} dossiers
          </span>
          <div style={{ position: "relative" }}>
            <input value={filterQuery} onChange={e => { setFilterQuery(e.target.value); setPage(1); }}
              placeholder="Filter by generic name, manufacturer, brand, NAFDAC no…"
              style={{ padding: "0.45rem 2rem 0.45rem 0.75rem", border: "1px solid #ccc", fontSize: "13px", outline: "none", width: 320 }} />
            {filterQuery && (
              <button onClick={() => setFilterQuery("")} style={{ position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: "15px" }}>×</button>
            )}
          </div>
        </div>
      )}

      {status === "done" && filtered.length > 0 && (
        <>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead ref={tableRef}>
                <tr style={{ background: "#fdf0eb" }}>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>Dossier No.</th>
                  <th style={thStyle}>Dossier Generic Name</th>
                  <th style={thStyle}>Dossier Dosage Form</th>
                  <th style={thStyle}>Dossier Manufacturer</th>
                  <th style={thStyle}>NAFDAC Brand</th>
                  <th style={thStyle}>NAFDAC Generic / Strength</th>
                  <th style={thStyle}>NAFDAC No.</th>
                  <th style={thStyle}>NAFDAC Manufacturer</th>
                  <th style={thStyle}>Match</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(({ dossier: d, nafdac: r, result }, i) => {
                  const mktCat = (r["MARKETING CATEGORY/PACK SIZES"] || "").split("/")[0].trim().toUpperCase();
                  const isPOM = mktCat === "POM";
                  return (
                    <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#fafafa" }}>
                      <td style={{ ...tdStyle, color: "#999", fontSize: "11px", textAlign: "center" }}>{(page - 1) * ITEMS_PER_PAGE + i + 1}</td>
                      <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: "11px", color: "#2d6a4f", fontWeight: "600", textAlign: "center" }}>{d.dossier_number}</td>
                      <td style={tdStyle}>{d.generic_name}</td>
                      <td style={{ ...tdStyle, textTransform: "capitalize" }}>{d.dosage_form}</td>
                      <td style={{ ...tdStyle, fontSize: "11px" }}>{d.manufacturer_name}</td>
                      <td style={{ ...tdStyle, fontWeight: "600", color: "#193441" }}>
                        {r["BRAND NAME"] || "—"}
                        {mktCat && (
                          <span style={{ marginLeft: 6, background: isPOM ? "#fed7d7" : "#c6f6d5", color: isPOM ? "#c53030" : "#276749", padding: "1px 6px", fontSize: "10px", fontWeight: "700", borderRadius: 2 }}>{mktCat}</span>
                        )}
                      </td>
                      <td style={tdStyle}>{stripBrackets(r["GENERIC NAME /STRENGTH"]) || "—"}</td>
                      <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: "11px" }}>{r["NAFDAC NO"] || "—"}</td>
                      <td style={{ ...tdStyle, fontSize: "11px" }}>{r["NAME OF MANUFACTRER/ADDRESS"] || "—"}</td>
                      <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2, fontSize: "11px" }}>
                          <span><Dot ok={result.ingredient_match} />Generic</span>
                          <span><Dot ok={result.strength_match} />Strength</span>
                          <span><Dot ok={result.dosage_form_match} />Dosage</span>
                          <span><Dot ok={result.manufacturer_match} />Mfr</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} setPage={handlePage} total={results.length} filtered={filtered.length} />
        </>
      )}

      {status === "done" && filtered.length === 0 && (
        <div style={{ color: "#888", fontSize: "13px", padding: "1rem 0" }}>
          {results.length === 0 ? "No exact matches found between the two databases." : `No results match "${filterQuery}".`}
        </div>
      )}
    </div>
  );
}

function NAFDACTable() {
  const fields = ["BRAND NAME", "GENERIC NAME /STRENGTH", "PHARMACOLOGICAL CLASS/CATEGORY", "NAME OF APPLICANT/ADDRESS", "NAME OF MANUFACTRER/ADDRESS", "NAFDAC NO", "DOSAGE FORM", "APPROVED INDICATION"];
  const { query, setQuery, filtered, paginated, page, setPage, totalPages, tableRef } = useTable(cleanNafdac, fields, "GENERIC NAME /STRENGTH");

  return (
    <div style={{ background: "white", border: "1px solid #ddd", padding: "1rem 0.75rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#193441" }}>NAFDAC Registry</h2>
        <span style={{ fontSize: "12px", color: "#888" }}>{filtered.length.toLocaleString()} records</span>
      </div>
      <SearchBar value={query} onChange={setQuery} placeholder="Search by brand name, generic name, NAFDAC no., applicant, manufacturer, indication..." />
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead ref={tableRef}>
            <tr>
              <th style={thStyle}>S/N</th>
              <th style={thStyle}>Brand Name</th>
              <th style={thStyle}>Generic Name / Strength</th>
              <th style={thStyle}>Dosage Form</th>
              <th style={thStyle}>Manufacturer</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>NAFDAC No.</th>
              <th style={thStyle}>Marketing Category</th>
              <th style={thStyle}>Indication</th>
              <th style={thStyle}>Applicant</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={10} style={{ ...tdStyle, textAlign: "center", color: "#888", padding: "2rem" }}>No records found for "{query}"</td></tr>
            ) : paginated.map((r, i) => {
              const mktCat = (r["MARKETING CATEGORY/PACK SIZES"] || "").split("/")[0].trim().toUpperCase();
              const isPOM = mktCat === "POM";
              return (
                <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#fafafa" }}>
                  <td style={{ ...tdStyle, color: "#999", fontSize: "11px", textAlign: "center" }}>{(page - 1) * ITEMS_PER_PAGE + i + 1}</td>
                  <td style={{ ...tdStyle, fontWeight: "600", color: "#193441" }}>{r["BRAND NAME"] || "—"}</td>
                  <td style={tdStyle}>{stripBrackets(r["GENERIC NAME /STRENGTH"]) || "—"}</td>
                  <td style={{ ...tdStyle, textTransform: "capitalize" }}>{r["DOSAGE FORM"] || "—"}</td>
                  <td style={{ ...tdStyle, fontSize: "12px" }}>{r["NAME OF MANUFACTRER/ADDRESS"] || "—"}</td>
                  <td style={tdStyle}>{r["PHARMACOLOGICAL CLASS/CATEGORY"] || "—"}</td>
                  <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: "12px" }}>{r["NAFDAC NO"] || "—"}</td>
                  <td style={tdStyle}>
                    {mktCat ? (
                      <span style={{
                        background: isPOM ? "#fed7d7" : "#c6f6d5",
                        color: isPOM ? "#c53030" : "#276749",
                        padding: "2px 8px",
                        fontSize: "11px",
                        fontWeight: "700",
                        borderRadius: "2px",
                      }}>{mktCat}</span>
                    ) : "—"}
                  </td>
                  <td style={tdStyle}>{r["APPROVED INDICATION"] || "—"}</td>
                  <td style={{ ...tdStyle, fontSize: "12px" }}>{r["NAME OF APPLICANT/ADDRESS"] || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} setPage={setPage} total={cleanNafdac.length} filtered={filtered.length} />
    </div>
  );
}

function MissingDosageTable() {
  const fields = ["BRAND NAME", "GENERIC NAME /STRENGTH", "NAFDAC NO", "NAME OF MANUFACTRER/ADDRESS", "NAME OF APPLICANT/ADDRESS"];
  const { query, setQuery, filtered, paginated, page, setPage, totalPages, tableRef } = useTable(missingDosageForm, fields, "GENERIC NAME /STRENGTH");

  const exportToExcel = () => {
    const data = filtered.map(r => ({
      "NAFDAC No.": r["NAFDAC NO"] || "",
      "Brand Name": r["BRAND NAME"] || "",
      "Generic Name / Strength": r["GENERIC NAME /STRENGTH"] || "",
      "Dosage Form": "",
      "Manufacturer": r["NAME OF MANUFACTRER/ADDRESS"] || "",
      "Applicant": r["NAME OF APPLICANT/ADDRESS"] || "",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Missing Dosage Form");
    XLSX.writeFile(wb, "missing_dosage_form.xlsx");
  };

  return (
    <div style={{ background: "white", border: "1px solid #ddd", padding: "1rem 0.75rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h2 style={{ margin: "0 0 2px 0", fontSize: "15px", fontWeight: "700", color: "#c53030" }}>Missing Dosage Form</h2>
          <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>NAFDAC registry records with no dosage form — update these to improve risk matching accuracy.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "12px", color: "#888" }}>{filtered.length.toLocaleString()} records</span>
          <button onClick={exportToExcel} style={{ padding: "0.4rem 1rem", background: "#276749", color: "white", border: "none", fontWeight: "700", fontSize: "11px", cursor: "pointer", letterSpacing: "0.5px", textTransform: "uppercase" }}>↓ Export Excel</button>
        </div>
      </div>
      <SearchBar value={query} onChange={setQuery} placeholder="Search by brand name, generic name, NAFDAC no., manufacturer..." />
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead ref={tableRef}>
            <tr>
              <th style={thStyle}>#</th>
              <th style={thStyle}>NAFDAC No.</th>
              <th style={thStyle}>Brand Name</th>
              <th style={thStyle}>Generic Name / Strength</th>
              <th style={thStyle}>Manufacturer</th>
              <th style={thStyle}>Applicant</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={6} style={{ ...tdStyle, textAlign: "center", color: "#888", padding: "2rem" }}>No records found for "{query}"</td></tr>
            ) : paginated.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#fafafa" }}>
                <td style={{ ...tdStyle, color: "#999", fontSize: "11px", textAlign: "center" }}>{(page - 1) * ITEMS_PER_PAGE + i + 1}</td>
                <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: "12px", color: "#c53030", fontWeight: "600" }}>{r["NAFDAC NO"] || "—"}</td>
                <td style={{ ...tdStyle, fontWeight: "600", color: "#193441" }}>{r["BRAND NAME"] || "—"}</td>
                <td style={tdStyle}>{stripBrackets(r["GENERIC NAME /STRENGTH"]) || "—"}</td>
                <td style={{ ...tdStyle, fontSize: "12px" }}>{r["NAME OF MANUFACTRER/ADDRESS"] || "—"}</td>
                <td style={{ ...tdStyle, fontSize: "12px" }}>{r["NAME OF APPLICANT/ADDRESS"] || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} setPage={setPage} total={missingDosageForm.length} filtered={filtered.length} />
    </div>
  );
}

function DossiersTable() {
  const fields = ["generic_name", "applicant", "manufacturer_name", "dossier_number", "dosage_form", "manufacturer_address"];
  const { query, setQuery, filtered, paginated, page, setPage, totalPages, tableRef } = useTable(acceptedDossiers, fields, "generic_name");

  return (
    <div style={{ background: "white", border: "1px solid #ddd", padding: "1rem 0.75rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#2d6a4f" }}>Accepted Dossiers</h2>
        <span style={{ fontSize: "12px", color: "#888" }}>{filtered.length.toLocaleString()} records</span>
      </div>
      <SearchBar value={query} onChange={setQuery} placeholder="Search by generic name, dossier number, applicant, manufacturer, dosage form..." />
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead ref={tableRef}>
            <tr>
              <th style={thStyle}>S/N</th>
              <th style={thStyle}>Dossier No.</th>
              <th style={thStyle}>Generic Name</th>
              <th style={thStyle}>Dosage Form</th>
              <th style={thStyle}>Applicant</th>
              <th style={thStyle}>Manufacturer</th>
              <th style={thStyle}>Manufacturer Address</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={8} style={{ ...tdStyle, textAlign: "center", color: "#888", padding: "2rem" }}>No records found for "{query}"</td></tr>
            ) : paginated.map((d, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#fafafa" }}>
                <td style={{ ...tdStyle, color: "#999", fontSize: "11px", textAlign: "center" }}>{d.s_n}</td>
                <td style={{ ...tdStyle, fontWeight: "600", color: "#2d6a4f", fontFamily: "monospace", fontSize: "12px", textAlign: "center" }}>{d.dossier_number || "—"}</td>
                <td style={tdStyle}>{d.generic_name?.trim() || "—"}</td>
                <td style={{ ...tdStyle, textTransform: "capitalize" }}>{d.dosage_form || "—"}</td>
                <td style={{ ...tdStyle, fontSize: "12px" }}>{d.applicant || "—"}</td>
                <td style={{ ...tdStyle, fontSize: "12px" }}>{d.manufacturer_name?.trim() || "—"}</td>
                <td style={{ ...tdStyle, fontSize: "11px", color: "#666" }}>{d.manufacturer_address || "—"}</td>
                <td style={tdStyle}>
                  <span style={{ background: "#c6f6d5", color: "#276749", padding: "2px 8px", fontSize: "11px", fontWeight: "700", borderRadius: "2px" }}>
                    {d.status || "Accepted"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} setPage={setPage} total={acceptedDossiers.length} filtered={filtered.length} />
    </div>
  );
}
