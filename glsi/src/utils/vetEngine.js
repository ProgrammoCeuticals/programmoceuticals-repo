// ─── GLSI Vetting Engine ────────────────────────────────────────────────────
// Applies all 19 NAFDAC Global Listing checklist codes to each inventory row.

// ── Helpers ──────────────────────────────────────────────────────────────────
const norm = (s) => (s || "").toString().toLowerCase().trim();
const clean = (s) =>
  norm(s)
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// ── Banned product keywords (NAFDAC cosmetics ban list for global listing) ───
// Soaps, detergents, body washes that foam — banned per checklist note
const BANNED_DESCRIPTION_KEYWORDS = [
  "soap",
  "detergent",
  "body wash",
  "shower gel",
  "shampoo",
  "conditioner",
  "hair dye",
  "hair color",
  "hair colour",
  "relaxer",
  "perm",
  "bleach",
  "toothpaste",
  "tooth paste",
  "dental",
  "mouthwash",
  "mouth wash",
];

// ── Therapeutic / N/A reg keywords ──────────────────────────────────────────
const NA_REG_KEYWORDS = [
  "anti-dandruff",
  "antidandruff",
  "anti dandruff",
  "medicated",
  "therapeutic",
  "antibacterial",
  "anti-bacterial",
  "antiseptic",
  "anti-septic",
  "antifungal",
  "anti-fungal",
  "acne",
  "anti-acne",
  "whitening",
  "lightening",
  "brightening",
  "bleaching",
  "spf",
  "sunscreen",
  "sunblock",
  "uv protect",
  "baby",
  "infant",
  "newborn",
  "toddler",
  "drug",
  "medicine",
  "pharmaceutical",
  "treatment",
  "cure",
  "heal",
  "remedy",
  "vitamin",
  "supplement",
  "probiotic",
];

// ── Valid pack type tokens ────────────────────────────────────────────────────
// Each word in a pack type string must be one of these known tokens.
// The full string is validated word-by-word so combinations like
// "GLASS BOTTLE", "PLASTIC JAR", "ROLL ON BOTTLE" all pass.

const VALID_PACK_TOKENS = new Set([
  // Materials
  "glass",
  "plastic",
  "aluminium",
  "aluminum",
  "alumnium", // alumnium — known typo kept as valid token
  "rubber",
  "metal",
  "tin",
  "steel",
  "cardboard",
  "paper",
  "silicone",
  "ceramic",
  // Container types
  "bottle",
  "jar",
  "can",
  "tube",
  "sachet",
  "pouch",
  "box",
  "carton",
  "blister",
  "aerosol",
  "bag",
  "tub",
  "vial",
  "ampoule",
  "dispenser",
  "container",
  // Descriptors
  "spray",
  "pump",
  "roll",
  "dropper",
  "flip",
  "top",
  "on",
  "cap",
  "push",
  "squeeze",
  "press",
  // Size/form
  "mini",
  "travel",
  "size",
  "refill",
  "set",
]);

// Canonical corrections for common misspellings of the full string
const PACK_TYPE_CORRECTIONS = {
  "alumium can": "ALUMINIUM CAN",
  "alumnium can": "ALUMINIUM CAN",
  "aluminuim can": "ALUMINIUM CAN",
  "glas bottle": "GLASS BOTTLE",
  "plastc bottle": "PLASTIC BOTTLE",
};

function validatePackType(raw) {
  if (!raw) return { ok: false, type: "fill" };
  const upper = raw.trim().toUpperCase();
  const lower = raw.trim().toLowerCase();

  // Check full-string correction map first
  if (PACK_TYPE_CORRECTIONS[lower]) {
    return {
      ok: false,
      type: "typo",
      suggestion: PACK_TYPE_CORRECTIONS[lower],
    };
  }

  // Token-by-token validation
  const tokens = lower.split(/\s+/);
  const unknownTokens = tokens.filter((t) => !VALID_PACK_TOKENS.has(t));

  if (unknownTokens.length === 0) return { ok: true };

  // All tokens unknown — likely a completely wrong value
  if (unknownTokens.length === tokens.length) {
    return { ok: false, type: "pt", unknown: unknownTokens };
  }

  // Some tokens unknown — likely a typo/spelling issue
  return { ok: false, type: "typo", unknown: unknownTokens };
}

// ── Pack size parser: "48X100ML" → { units: 48, volume: 100, unit: "ML" } ───
export function parsePackSize(raw) {
  if (!raw) return null;
  // formats: "48X100ML", "96 X 50ML", "144X 88ML", "288X25ML", "72X236ML"
  const m = String(raw)
    .toUpperCase()
    .replace(/\s+/g, "")
    .match(/^(\d+)[X×*](\d+(?:\.\d+)?)([A-Z]+)?$/);
  if (!m) return null;
  return { units: Number(m[1]), volume: Number(m[2]), unit: m[3] || "" };
}

// Parse total quantity: handles "10,080", "10 080", plain "480"
function parseQty(raw) {
  if (raw === null || raw === undefined || raw === "") return null;
  const n = Number(String(raw).replace(/[,\s]/g, ""));
  return isNaN(n) ? null : n;
}

// ── Vague description check ───────────────────────────────────────────────────
// Only flag descriptions that are genuinely meaningless — not recognised
// product-type terms. "PERFUME", "BODY SPRAY" etc. are valid descriptions.
const TRULY_VAGUE_DESCS = new Set([
  "product",
  "item",
  "goods",
  "misc",
  "miscellaneous",
  "other",
  "n/a",
  "na",
  "tbd",
  "unknown",
  "various",
]);
function isVagueDescription(desc) {
  return TRULY_VAGUE_DESCS.has(norm(desc));
}

// ── Country validation ────────────────────────────────────────────────────────
// ISO 3166-1 country names likely to appear in NAFDAC GLSI submissions.
// Covers the main manufacturing origins seen in fragrance/cosmetics trade.
const KNOWN_COUNTRIES = new Set([
  "afghanistan",
  "albania",
  "algeria",
  "angola",
  "argentina",
  "armenia",
  "australia",
  "austria",
  "azerbaijan",
  "bahrain",
  "bangladesh",
  "belarus",
  "belgium",
  "benin",
  "bolivia",
  "bosnia",
  "botswana",
  "brazil",
  "bulgaria",
  "burkina faso",
  "cambodia",
  "cameroon",
  "canada",
  "chile",
  "china",
  "colombia",
  "congo",
  "costa rica",
  "croatia",
  "cuba",
  "cyprus",
  "czech republic",
  "denmark",
  "ecuador",
  "egypt",
  "eritrea",
  "estonia",
  "ethiopia",
  "finland",
  "france",
  "georgia",
  "germany",
  "ghana",
  "greece",
  "guatemala",
  "guinea",
  "haiti",
  "honduras",
  "hong kong",
  "hungary",
  "india",
  "indonesia",
  "iran",
  "iraq",
  "ireland",
  "israel",
  "italy",
  "ivory coast",
  "jamaica",
  "japan",
  "jordan",
  "kazakhstan",
  "kenya",
  "kuwait",
  "kyrgyzstan",
  "latvia",
  "lebanon",
  "libya",
  "lithuania",
  "luxembourg",
  "malaysia",
  "mali",
  "malta",
  "mauritania",
  "mauritius",
  "mexico",
  "moldova",
  "morocco",
  "mozambique",
  "myanmar",
  "namibia",
  "nepal",
  "netherlands",
  "new zealand",
  "nicaragua",
  "niger",
  "nigeria",
  "north korea",
  "norway",
  "oman",
  "pakistan",
  "palestine",
  "panama",
  "peru",
  "philippines",
  "poland",
  "portugal",
  "qatar",
  "romania",
  "russia",
  "rwanda",
  "saudi arabia",
  "senegal",
  "serbia",
  "sierra leone",
  "singapore",
  "slovakia",
  "slovenia",
  "somalia",
  "south africa",
  "south korea",
  "spain",
  "sri lanka",
  "sudan",
  "sweden",
  "switzerland",
  "syria",
  "taiwan",
  "tajikistan",
  "tanzania",
  "thailand",
  "togo",
  "trinidad and tobago",
  "tunisia",
  "turkey",
  "turkmenistan",
  "uganda",
  "ukraine",
  "united arab emirates",
  "uae",
  "united kingdom",
  "uk",
  "united states",
  "usa",
  "uzbekistan",
  "venezuela",
  "vietnam",
  "yemen",
  "zambia",
  "zimbabwe",
]);

function validateCountry(country) {
  const n = norm(country || "");
  if (!n) return "fill";
  // Multiple countries in one cell
  if (
    n.includes(",") ||
    n.includes("/") ||
    n.includes(" and ") ||
    n.includes(" & ")
  )
    return "multi";
  // Vague placeholders
  if (
    ["various", "multiple", "mixed", "unknown", "n/a", "na", "tbd"].includes(n)
  )
    return "vague";
  // Not a recognised country name
  if (!KNOWN_COUNTRIES.has(n)) return "unknown";
  return "ok";
}

// ── Main vet function — returns array of flag objects ─────────────────────────
export function vetRow(row, allRows, rowIndex) {
  const flags = [];
  const add = (code, note) => flags.push({ code, note });

  const brand = (row.brand || "").trim();
  const name = (row.name || "").trim();
  const desc = (row.desc || "").trim();
  const origin = (row.origin || "").trim();
  const packSize = (row.pack_size || "").trim();
  const packType = (row.pack_type || "").trim();
  const cartons = row.cartons;
  const total = row.total;

  // ── FILL: empty required columns ─────────────────────────────────────────
  const missing = [];
  if (!brand) missing.push("Brand");
  if (!name) missing.push("Product Name");
  if (!desc) missing.push("Description");
  if (!origin) missing.push("Origin");
  if (!packSize) missing.push("Pack Size");
  if (!packType) missing.push("Pack Type");
  if (cartons === "" || cartons === null || cartons === undefined)
    missing.push("No. of Cartons");
  if (total === "" || total === null || total === undefined)
    missing.push("Total Qty");
  if (missing.length > 0) add("Fill", `Empty: ${missing.join(", ")}`);

  // ── BRAND: brand column is blank ─────────────────────────────────────────
  if (!brand) add("Brand", "Brand column is empty");

  // ── NO. OF CTN: must be a positive whole number ──────────────────────────
  if (cartons !== "" && cartons !== null && cartons !== undefined) {
    const cartonsStr = String(cartons).replace(/,/g, "").trim();
    const cartonsNum = Number(cartonsStr);
    if (isNaN(cartonsNum) || cartonsStr === "") {
      add("Typo", `No. of cartons "${cartons}" is not a valid number`);
    } else if (cartonsNum <= 0) {
      add("Typo", `No. of cartons "${cartons}" must be greater than zero`);
    } else if (!Number.isInteger(cartonsNum)) {
      add(
        "Typo",
        `No. of cartons "${cartons}" must be a whole number — no decimals`,
      );
    }
  }
  const parsed = parsePackSize(packSize);
  const parsedTotal = parseQty(total);
  const parsedCartons = parseQty(cartons);
  if (parsed && parsedTotal !== null && parsedCartons !== null) {
    const expected = parsed.units * parsedCartons;
    if (expected !== parsedTotal) {
      add(
        "Inc. T",
        `${parsed.units} × ${parsedCartons} = ${expected}, listed as ${parsedTotal}`,
      );
    }
  }

  // ── PACK SIZE: must follow strict format NxVOLUNIT e.g. 48X100ML ───────────
  if (packSize) {
    const strictFormat = /^\d+X\d+(\.\d+)?[A-Z]+$/.test(packSize);
    if (!strictFormat) {
      // Distinguish between wrong format vs just missing unit
      const hasUnit = /[A-Z]/.test(packSize);
      const parseable = parsePackSize(packSize);
      if (parseable && !parseable.unit) {
        add(
          "Unit",
          `Pack size "${packSize}" is missing a unit (e.g. ML, G, L)`,
        );
      } else {
        add(
          "Typo",
          `Pack size "${packSize}" does not follow required format — must be uppercase e.g. 48X100ML`,
        );
      }
    }
  }

  // ── TYPO / P.T: pack type validation ─────────────────────────────────────
  if (packType) {
    const ptResult = validatePackType(packType);
    if (!ptResult.ok) {
      if (ptResult.type === "typo") {
        const msg = ptResult.suggestion
          ? `Pack type "${packType}" — did you mean "${ptResult.suggestion}"?`
          : `Pack type "${packType}" contains unrecognised word(s): ${ptResult.unknown.join(", ")}`;
        add("Typo", msg);
      } else if (ptResult.type === "pt") {
        add(
          "P.T",
          `Pack type "${packType}" is not a recognised packaging type`,
        );
      }
    }
  }

  // ── REP: duplicate detection ─────────────────────────────────────────────
  const key = `${norm(brand)}|${norm(name)}|${norm(desc)}|${norm(packSize)}`;
  const firstIdx = allRows.findIndex(
    (r) =>
      `${norm(r.brand)}|${norm(r.name)}|${norm(r.desc)}|${norm(r.pack_size)}` ===
      key,
  );
  if (firstIdx !== -1 && firstIdx < rowIndex) {
    add("Rep", `Duplicate of row ${firstIdx + 1}`);
  }

  // ── BAN: banned products ──────────────────────────────────────────────────
  const descLow = norm(desc);
  const nameLow = norm(name);
  for (const kw of BANNED_DESCRIPTION_KEYWORDS) {
    if (descLow.includes(kw) || nameLow.includes(kw)) {
      add("Ban", `"${kw}" found — banned product category`);
      break;
    }
  }

  // ── N/A REG / SUSPICIOUS: keyword pre-filter ─────────────────────────────
  // These rows are candidates for Greenbook checking — the officer triggers
  // the actual API call from the "Suspicious" tab. If Greenbook confirms
  // registration, the flag is upgraded to N/A reg or Reg based on category.
  const combined = `${nameLow} ${descLow}`;
  for (const kw of NA_REG_KEYWORDS) {
    if (combined.includes(kw)) {
      add(
        "Suspicious",
        `Keyword "${kw}" detected — check Greenbook to confirm`,
      );
      break;
    }
  }

  // ── ITEMISE: SET or KIT products should be listed individually ────────────
  if (
    /\bset\b|\bkit\b|\bcombo\b|\bbundle\b/i.test(name) ||
    /\bset\b|\bkit\b|\bcombo\b|\bbundle\b/i.test(desc)
  ) {
    add(
      "Itemise",
      "Product appears to be a SET/KIT — variants should be listed individually",
    );
  }

  // ── DESC: description too vague ───────────────────────────────────────────
  if (desc && isVagueDescription(desc)) {
    add(
      "Desc",
      `Description "${desc}" is too generic — provide fuller description (e.g. EAU DE PARFUM, BODY SPRAY DEODORANT)`,
    );
  }

  // ── COUNTRY: origin issues ────────────────────────────────────────────────
  const countryCheck = validateCountry(origin);
  if (countryCheck === "multi") {
    add(
      "Country",
      "Multiple countries stated — specify one country of manufacture",
    );
  } else if (countryCheck === "vague") {
    add("Country", `"${origin}" is not a specific country`);
  } else if (countryCheck === "unknown") {
    add(
      "Country",
      `"${origin}" is not a recognised country name — check spelling`,
    );
  }

  // ── CLARIFY: product name needs clarification ─────────────────────────────
  const GENERIC_SINGLE_WORDS = new Set([
    "perfume",
    "fragrance",
    "spray",
    "lotion",
    "cream",
    "gel",
    "product",
    "item",
    "sample",
    "tester",
  ]);
  const nameCleaned = clean(name);
  if (
    name &&
    nameCleaned.split(" ").length === 1 &&
    GENERIC_SINGLE_WORDS.has(nameCleaned)
  ) {
    add("Clarify", `Product name "${name}" is too generic — clarify`);
  }

  return flags;
}

// ── Batch vet ─────────────────────────────────────────────────────────────────
// Returns array of { row, flags } synchronously for chunk processing.
export function vetBatch(rows) {
  return rows.map((row, i) => ({ row, flags: vetRow(row, rows, i) }));
}

// ── Greenbook category classification ────────────────────────────────────────
// Determines whether a Greenbook hit means N/A reg or Reg based on category.
const NA_REG_CATEGORIES = new Set([
  "pharmaceutical",
  "pharmaceuticals",
  "drug",
  "drugs",
  "medical device",
  "medical devices",
  "baby product",
  "baby products",
  "infant",
  "herbal",
  "supplement",
  "nutraceutical",
  "veterinary",
  "vaccine",
]);

export function classifyGreenbookResult(gbData) {
  if (!gbData?.data?.length) return "clean"; // not found — fine to global list
  const category = (
    gbData.data[0]["product_category.name"] ||
    gbData.data[0].product_category?.name ||
    ""
  )
    .toLowerCase()
    .trim();
  const base = category.replace(/s$/, "");
  if (NA_REG_CATEGORIES.has(category) || NA_REG_CATEGORIES.has(base))
    return "na_reg";
  return "reg";
}

// ── Greenbook lookup ─────────────────────────────────────────────────────────
// Calls Greenbook DataTables API with X-Requested-With header via fetch.
// Returns DataTables { data, recordsFiltered } or throws.
export async function greenbookSearch(query, category = "") {
  const params = new URLSearchParams();
  // Minimum required DataTables columns
  const cols = [
    "product_name",
    "ingredient.ingredient_name",
    "product_category.name",
    "product_category_id",
    "ingredient.synonym",
    "NAFDAC",
    "form.name",
    "route.name",
    "strength",
    "applicant.name",
    "approval_date",
    "status",
  ];
  cols.forEach((col, i) => {
    params.set(`columns[${i}][data]`, col);
    params.set(`columns[${i}][name]`, col);
    params.set(`columns[${i}][searchable]`, "true");
    params.set(`columns[${i}][orderable]`, i !== 2 ? "true" : "false");
    params.set(
      `columns[${i}][search][value]`,
      i === 2 && category ? category : "",
    );
    params.set(`columns[${i}][search][regex]`, "false");
  });
  params.set("order[0][column]", "0");
  params.set("order[0][dir]", "asc");
  params.set("start", "0");
  params.set("length", "20");
  params.set("search[value]", query);
  params.set("search[regex]", "false");
  params.set("search_ingredient", "");
  params.set("draw", "1");
  params.set("_", Date.now().toString());

  const res = await fetch(
    `https://greenbook.nafdac.gov.ng/?${params.toString()}`,
    {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json, text/javascript, */*; q=0.01",
      },
    },
  );

  if (!res.ok) throw new Error(`Greenbook responded with ${res.status}`);
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("json"))
    throw new Error("Greenbook returned non-JSON — CORS may be blocking");
  return res.json();
}
