import React, { useEffect, useMemo, useRef, useState } from "react";
import { API_BASE_URL, apiRequest } from "./api";
import { loadXlsxLibrary } from "./lib/xlsx";

const DEFAULT_STATUSES = ["RECEIVED", "REJECTED"];
const DEFAULT_CHECK_VALUES = ["YES", "NO", "PENDING"];
const MIN_MONTHS_BEFORE_EXPIRY = 6;
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const PRODUCTS_PER_PAGE = 50;
const BRAND_NAME_FIELD_CODE = "brand_name";
const GENERIC_NAME_FIELD_CODE = "generic_name";
const NAPAMS_NUMBER_FIELD_CODE = "napams_number";
const NAFDAC_NUMBER_FIELD_CODE = "nafdac_no";
const PRODUCT_CLASS_FIELD_CODE = "product_class";
const DOSAGE_FORM_FIELD_CODE = "dosage_form";
const PACK_SIZE_FIELD_CODE = "pack_size";
const MANUFACTURING_DATE_FIELD_CODE = "manufacturing_date";
const EXPIRY_DATE_FIELD_CODE = "expiry_date";
const SAMPLING_DATE_FIELD_CODE = "sampling_date";
const QUANTITY_FIELD_CODE = "quantity";
const RISK_FACTOR_FIELD_CODE = "risk_factor";
const DISTRIBUTOR_FIELD_CODE = "distributor";
const SOURCE_FIELD_CODE = "source";
const BATCH_NUMBER_FIELD_CODE = "batch_no";
const ANALYTICS_DATE_MODES = [
  { key: "sampling", label: "Sampling Date", shortLabel: "Sampling" },
  { key: "received", label: "Date Received", shortLabel: "Received" },
  { key: "created", label: "Created At", shortLabel: "Created" },
];
const INJECTABLE_SUBTYPES = [
  {
    value: "ampoule",
    label: "Ampoules",
    unit: "ml",
    test: (s) => /ampoule/i.test(s),
  },
  {
    value: "vial_liquid",
    label: "Liquid Vials",
    unit: "ml",
    test: (s) => !/ampoule/i.test(s) && !/\bg\b/i.test(s),
  },
  {
    value: "vial_powder",
    label: "Powder Vials (g)",
    unit: "g",
    test: (s) => /\bg\b/i.test(s),
  },
];

const GUIDE_RISK_OPTIONS = [
  { value: "HIGH", label: "High" },
  { value: "LOW", label: "Low" },
];
const PUBLIC_FORM_SECTIONS = [
  {
    id: "applicant_information",
    title: "Applicant Information",
    description:
      "Contact details of the person or organisation submitting the sample.",
    codes: ["applicant_name", "applicant_phone", "applicant_email"],
  },
  {
    id: "identity",
    title: "Product Identity",
    description:
      "Core product name, class, presentation, and registration details.",
    codes: [
      BRAND_NAME_FIELD_CODE,
      "generic_name",
      PRODUCT_CLASS_FIELD_CODE,
      "nafdac_no",
      DOSAGE_FORM_FIELD_CODE,
      "strength",
      "category",
      "physical_description",
    ],
  },
  {
    id: "batch_and_packaging",
    title: "Batch and Packaging",
    description:
      "Pack size, batch details, and risk-based quantity calculation.",
    codes: [
      PACK_SIZE_FIELD_CODE,
      "batch_no",
      RISK_FACTOR_FIELD_CODE,
      QUANTITY_FIELD_CODE,
      "pharmacopoeia",
      "storage_condition",
    ],
  },
  {
    id: "manufacture_and_source",
    title: "Manufacture and Source",
    description: "Manufacturer, dates, origin, and movement details.",
    codes: [
      MANUFACTURING_DATE_FIELD_CODE,
      EXPIRY_DATE_FIELD_CODE,
      "manufacturer",
      "source",
      DISTRIBUTOR_FIELD_CODE,
      "country_of_origin",
      "port_of_entry",
      "sampling_date",
    ],
  },
  {
    id: "analysis",
    title: "Analysis Details",
    description: "Reason for analysis and required laboratory tests.",
    codes: ["reason_for_analysis", "required_test"],
  },
];
const WIDE_PUBLIC_FIELD_CODES = new Set([
  PACK_SIZE_FIELD_CODE,
  "pharmacopoeia",
  "storage_condition",
  "physical_description",
  "reason_for_analysis",
  "required_test",
]);
const DRUG_CLASS_OPTIONS = Array.from(
  new Set([
    "Analgesic",
    "Anaesthetic",
    "Anti-Allergic / Antihistamine",
    "Antacid",
    "Anthelmintic",
    "Anti-Asthmatic",
    "Antibacterial",
    "Antibiotic",
    "Anticoagulant",
    "Anticonvulsant",
    "Antidepressant",
    "Antidiabetic",
    "Antidiarrheal",
    "Antidote",
    "Antiemetic",
    "Antiepileptic",
    "Antifibrinolytic",
    "Antifungal",
    "Anti-Inflammatory",
    "Antihypertensive",
    "Antimalarial",
    "Antimigraine",
    "Antimycobacterial",
    "Antineoplastic / Anticancer",
    "Antiplatelet",
    "Antipsychotic",
    "Antiprotozoal",
    "Antipruritic",
    "Antiretroviral",
    "Antirheumatic",
    "Antiseptic / Disinfectant",
    "Antispasmodic",
    "Antithyroid",
    "Antitubercular",
    "Antitussive",
    "Antiviral",
    "Anxiolytic",
    "Appetite Suppressant",
    "Biological",
    "Bronchodilator",
    "Cardiotonic",
    "Central Nervous System Stimulant",
    "Chemotherapeutic Agent",
    "Cholinergic Agent",
    "Contraceptive",
    "Contrast Agent",
    "Corticosteroid",
    "Cough and Cold Preparation",
    "Diagnostic Agent",
    "Diuretic",
    "Electrolyte / Fluid Replacement",
    "Enzyme Preparation",
    "Expectorant / Mucolytic",
    "Fertility Agent",
    "Gastrointestinal Agent",
    "Haematinic / Hematinic",
    "Haemostatic / Hemostatic",
    "Herbal Medicinal Product",
    "Hormonal Preparation",
    "Hypnotic / Sedative",
    "Immunomodulator",
    "Immunosuppressant",
    "Immunotherapy",
    "Laxative",
    "Lipid-Lowering Agent",
    "Medical Device Adjunct",
    "Medical Gas",
    "Mineral Supplement",
    "Muscle Relaxant",
    "Nasal Decongestant",
    "NSAID",
    "Nutraceutical",
    "Obstetric / Gynaecological Preparation",
    "Ophthalmic Preparation",
    "Opioid Analgesic",
    "Oral Care Preparation",
    "Oxytocic",
    "Parasiticide",
    "Probiotic",
    "Radiopharmaceutical",
    "Rehydration Therapy",
    "Respiratory Tract Preparation",
    "Sedative",
    "Sexual Health Preparation",
    "Steroid",
    "Topical Dermatological Preparation",
    "Urological Preparation",
    "Vaccines and Toxoids",
    "Vasodilator",
    "Veterinary Medicinal Product",
    "Vitamin / Supplement",
    "Wound Care Preparation",
  ]),
).sort((left, right) => left.localeCompare(right));
const COMMON_DOSAGE_FORM_OPTIONS = [
  "Tablet",
  "Film-Coated Tablet",
  "Sugar-Coated Tablet",
  "Enteric-Coated Tablet",
  "Chewable Tablet",
  "Effervescent Tablet",
  "Dispersible Tablet",
  "Soluble Tablet",
  "Orally Disintegrating Tablet",
  "Modified-Release Tablet",
  "Sublingual Tablet",
  "Buccal Tablet",
  "Caplet",
  "Lozenge / Troche / Pastille",
  "Capsule",
  "Hard Gelatin Capsule",
  "Soft Gelatin Capsule",
  "Modified-Release Capsule",
  "Bolus",
  "Powder",
  "Granules",
  "Pellets",
  "Oral Powder",
  "Powder for Oral Suspension",
  "Powder for Oral Solution",
  "Powder for Injection",
  "Powder for Infusion",
  "Sachet",
  "Syrup",
  "Elixir",
  "Oral Solution",
  "Oral Suspension",
  "Oral Emulsion",
  "Oral Drops",
  "Eye Drops",
  "Ear Drops",
  "Nasal Drops",
  "Eye Ointment",
  "Mouthwash",
  "Spirit",
  "Gargle",
  "Infusions",
  "Injection",
  "Small Volume Injection",
  "Large Volume Injection",
  "Ampoule",
  "Vial",
  "Prefilled Syringe",
  "Nebulizer Solution",
  "Metered Dose Inhaler",
  "Dry Powder Inhaler",
  "Inhalation Solution",
  "Inhalation Aerosol",
  "Spray",
  "Nasal Spray",
  "Topical Spray",
  "Cream",
  "Ointment",
  "Paste",
  "Gel",
  "Lotion",
  "Liniment",
  "Topical Solution",
  "Topical Suspension",
  "Transdermal Patch",
  "Suppository",
  "Pessary",
  "Enema",
  "Vaginal Cream",
  "Vaginal Tablet",
  "Vaginal Capsule",
  "Implant",
  "Molasses / Block",
  "Veterinary Powder for Suspension",
  "Herbal Mixture / Bitters",
  "Herbal Powder / Granules / Pellets / Seeds",
  "Herbal Tea / Bars",
  "Herbal Balm / Ointment",
  "Herbal Soap",
  "Herbal Suppository / Capsule",
];
const DOSAGE_FORM_GUIDE_ALIASES = {
  [normalizeLookupValue("Tablet")]: "Tablets",
  [normalizeLookupValue("Film-Coated Tablet")]: "Tablets",
  [normalizeLookupValue("Sugar-Coated Tablet")]: "Tablets",
  [normalizeLookupValue("Enteric-Coated Tablet")]: "Tablets",
  [normalizeLookupValue("Chewable Tablet")]: "Tablets",
  [normalizeLookupValue("Effervescent Tablet")]: "Tablets",
  [normalizeLookupValue("Dispersible Tablet")]: "Tablets",
  [normalizeLookupValue("Soluble Tablet")]: "Tablets",
  [normalizeLookupValue("Orally Disintegrating Tablet")]: "Tablets",
  [normalizeLookupValue("Modified-Release Tablet")]: "Tablets",
  [normalizeLookupValue("Sublingual Tablet")]: "Tablets",
  [normalizeLookupValue("Buccal Tablet")]: "Tablets",
  [normalizeLookupValue("Caplet")]: "Tablets",
  [normalizeLookupValue("Lozenge / Troche / Pastille")]: "Lozenges",
  [normalizeLookupValue("Capsule")]: "Capsules",
  [normalizeLookupValue("Hard Gelatin Capsule")]: "Capsules",
  [normalizeLookupValue("Soft Gelatin Capsule")]: "Capsules",
  [normalizeLookupValue("Modified-Release Capsule")]: "Capsules",
  [normalizeLookupValue("Powder")]: "Oral Powder",
  [normalizeLookupValue("Powder for Oral Suspension")]:
    "Powder for Oral Suspension",
  [normalizeLookupValue("Powder for Oral Solution")]: "Oral Powder",
  [normalizeLookupValue("Sachet")]: "Oral Powder",
  [normalizeLookupValue("Syrup")]: "Syrup / Elixir / Suspension",
  [normalizeLookupValue("Elixir")]: "Syrup / Elixir / Suspension",
  [normalizeLookupValue("Oral Solution")]: "Syrup / Elixir / Suspension",
  [normalizeLookupValue("Oral Suspension")]: "Syrup / Elixir / Suspension",
  [normalizeLookupValue("Oral Emulsion")]: "Syrup / Elixir / Suspension",
  [normalizeLookupValue("Oral Drops")]: "Syrup / Elixir / Suspension",
  [normalizeLookupValue("Eye Drops")]: "Ear / Eye / Nose Drops",
  [normalizeLookupValue("Ear Drops")]: "Ear / Eye / Nose Drops",
  [normalizeLookupValue("Nasal Drops")]: "Ear / Eye / Nose Drops",
  [normalizeLookupValue("Mouthwash")]: "Mouthwash / Spirit",
  [normalizeLookupValue("Spirit")]: "Mouthwash / Spirit",
  [normalizeLookupValue("Gargle")]: "Mouthwash / Spirit",
  [normalizeLookupValue("Injection")]: "Injectables",
  [normalizeLookupValue("Small Volume Injection")]: "Injectables",
  [normalizeLookupValue("Large Volume Injection")]: "Injectables",
  [normalizeLookupValue("Ampoule")]: "Injectables",
  [normalizeLookupValue("Vial")]: "Injectables",
  [normalizeLookupValue("Prefilled Syringe")]: "Injectables",
  [normalizeLookupValue("Powder for Injection")]: "Injectables",
  [normalizeLookupValue("Powder for Infusion")]: "Infusions",
  [normalizeLookupValue("Metered Dose Inhaler")]: "Inhalations",
  [normalizeLookupValue("Dry Powder Inhaler")]: "Inhalations",
  [normalizeLookupValue("Nebulizer Solution")]: "Inhalations",
  [normalizeLookupValue("Inhalation Solution")]: "Inhalations",
  [normalizeLookupValue("Inhalation Aerosol")]: "Inhalations",
  [normalizeLookupValue("Spray")]: "Sprays",
  [normalizeLookupValue("Nasal Spray")]: "Sprays",
  [normalizeLookupValue("Topical Spray")]: "Sprays",
  [normalizeLookupValue("Cream")]: "Ointments / Creams / Pastes",
  [normalizeLookupValue("Ointment")]: "Ointments / Creams / Pastes",
  [normalizeLookupValue("Paste")]: "Ointments / Creams / Pastes",
  [normalizeLookupValue("Gel")]: "Ointments / Creams / Pastes",
  [normalizeLookupValue("Lotion")]: "Ointments / Creams / Pastes",
  [normalizeLookupValue("Liniment")]: "Liniments",
  [normalizeLookupValue("Topical Solution")]: "Ointments / Creams / Pastes",
  [normalizeLookupValue("Topical Suspension")]: "Ointments / Creams / Pastes",
  [normalizeLookupValue("Transdermal Patch")]: "Transdermal Patches",
  [normalizeLookupValue("Suppository")]: "Suppositories / Vaginal Tablets",
  [normalizeLookupValue("Pessary")]: "Drug Device Implant / Pessaries",
  [normalizeLookupValue("Vaginal Cream")]: "Suppositories / Vaginal Tablets",
  [normalizeLookupValue("Vaginal Tablet")]: "Suppositories / Vaginal Tablets",
  [normalizeLookupValue("Vaginal Capsule")]: "Suppositories / Vaginal Tablets",
  [normalizeLookupValue("Implant")]: "Drug Device Implant / Pessaries",
  [normalizeLookupValue("Herbal Mixture / Bitters")]:
    "Herbal Mixtures / Bitters",
  [normalizeLookupValue("Herbal Powder / Granules / Pellets / Seeds")]:
    "Herbal Powder / Granules / Pellets / Seeds",
  [normalizeLookupValue("Herbal Tea / Bars")]: "Herbal Tea / Bars",
  [normalizeLookupValue("Herbal Balm / Ointment")]: "Herbal Balms / Ointments",
  [normalizeLookupValue("Herbal Soap")]: "Herbal Soaps",
  [normalizeLookupValue("Herbal Suppository / Capsule")]:
    "Herbal Suppositories / Capsules",
};
const DOSAGE_FORM_GUIDE_KEYWORDS = [
  {
    guideProductType: "Veterinary Powder for Suspension",
    keywords: ["veterinary powder"],
  },
  {
    guideProductType: "Herbal Mixtures / Bitters",
    keywords: ["herbal mixture", "bitters"],
  },
  {
    guideProductType: "Herbal Powder / Granules / Pellets / Seeds",
    keywords: [
      "herbal powder",
      "herbal granules",
      "herbal pellets",
      "herbal seeds",
    ],
  },
  {
    guideProductType: "Herbal Balms / Ointments",
    keywords: ["herbal balm", "herbal ointment"],
  },
  { guideProductType: "Herbal Soaps", keywords: ["soap"] },
  {
    guideProductType: "Herbal Suppositories / Capsules",
    keywords: ["herbal suppository", "herbal capsule"],
  },
  {
    guideProductType: "Ear / Eye / Nose Drops",
    keywords: [
      "eye drop",
      "ear drop",
      "nasal drop",
      "ophthalmic drop",
      "otic drop",
    ],
  },
  {
    guideProductType: "Inhalations",
    keywords: ["inhaler", "inhalation", "nebulizer"],
  },
  {
    guideProductType: "Infusions",
    keywords: ["infusion"],
  },
  {
    guideProductType: "Injectables",
    keywords: ["inject", "ampoule", "vial", "syringe"],
  },
  {
    guideProductType: "Sprays",
    keywords: ["spray"],
  },
  {
    guideProductType: "Ointments / Creams / Pastes",
    keywords: [
      "ointment",
      "cream",
      "paste",
      "gel",
      "lotion",
      "liniment",
      "topical",
    ],
  },
  {
    guideProductType: "Transdermal Patches",
    keywords: ["patch"],
  },
  {
    guideProductType: "Suppositories",
    keywords: ["suppository", "pessary", "vaginal"],
  },
  {
    guideProductType: "Syrup / Elixir / Suspension",
    keywords: [
      "syrup",
      "elixir",
      "solution",
      "suspension",
      "emulsion",
      "oral drops",
    ],
  },
  {
    guideProductType: "Mouthwash / Spirit",
    keywords: ["mouthwash", "spirit", "gargle"],
  },
  {
    guideProductType: "Oral Powder",
    keywords: ["powder", "sachet"],
  },
  {
    guideProductType: "Granules",
    keywords: ["granule", "pellet"],
  },
  {
    guideProductType: "Capsules",
    keywords: ["capsule", "softgel"],
  },
  {
    guideProductType: "Tablets",
    keywords: ["tablet", "caplet", "lozenge", "troche", "pastille"],
  },
];

const ADMIN_ROUTE = "/admin";
const GUIDE_ROUTE = "/guide";
const SUBMISSION_DETAIL_ROUTE_RE = /^\/admin\/submissions\/([^/]+)$/;
const ADMIN_TOKEN_STORAGE_KEY = "samples_admin_token";
const ADMIN_PROFILE_STORAGE_KEY = "samples_admin_profile";
const EMPTY_ADMIN_PROFILE = {
  officerName: "",
  officerDesignation: "",
  officerPhone: "",
  officerEmail: "",
};

const TEMPLATE_LABELS = {
  new_registration: "New Registration",
  renewal: "Renewal",
  variation: "Variation",
};

const MANIFEST_BASE_HEADERS = [
  "BRAND NAME",
  "GENERIC NAME",
  "PRODUCT CLASS",
  "NAFDAC NO",
  "DOSAGE FORM",
  "STRENGTH",
  "PACK SIZE",
  "MANUF. DATE",
  "EXPIRY DATE",
  "BATCH NO",
  "SOURCE",
  "DISTRIBUTOR",
  "QTY",
  "MANUFACTURER",
  "SAMPLING DATE",
  "CONSIGNMENT SIZE",
  "RETEST DATE",
  "PHARMACOPOEIA",
  "STORAGE CONDITION",
  "REASON FOR ANALYSIS",
  "REQUIRED TEST",
  "NAME OF OFFICER",
  "DESIGNATION",
  "PHONE NO",
  "EMAIL",
  "CATEGORY",
  "PHYSICAL DESCRIPTION",
  "COUNTRY OF ORIGIN",
  "PORT OF ENTRY",
  "TEST REQUEST NO",
  "TEST PARAMETERS",
  "RISK FACTOR",
];

const MANIFEST_TRACKING_HEADERS = [
  "DATE SAMPLE RECEIVED",
  "DATE TAKEN TO LAB",
  "DATE LAB REPORT RECEIVED",
  "LAB COMMENT",
];

const EXPORT_COLUMN_DEFS = [
  // manifest base — default selected
  { header: "BRAND NAME", key: "brand_name", type: "answer", default: true },
  {
    header: "GENERIC NAME",
    key: "generic_name",
    type: "answer",
    default: true,
  },
  {
    header: "PRODUCT CLASS",
    key: "product_class",
    type: "answer",
    default: true,
  },
  { header: "NAFDAC NO", key: "nafdac_no", type: "answer", default: true },
  { header: "DOSAGE FORM", key: "dosage_form", type: "answer", default: true },
  { header: "STRENGTH", key: "strength", type: "answer", default: true },
  { header: "PACK SIZE", key: "pack_size", type: "answer", default: true },
  {
    header: "MANUF. DATE",
    key: "manufacturing_date",
    type: "answer",
    default: true,
  },
  { header: "EXPIRY DATE", key: "expiry_date", type: "answer", default: true },
  { header: "BATCH NO", key: "batch_no", type: "answer", default: true },
  { header: "SOURCE", key: "source", type: "answer", default: true },
  { header: "DISTRIBUTOR", key: "distributor", type: "answer", default: true },
  { header: "QTY", key: "quantity", type: "answer", default: true },
  {
    header: "MANUFACTURER",
    key: "manufacturer",
    type: "answer",
    default: true,
  },
  {
    header: "SAMPLING DATE",
    key: "sampling_date",
    type: "answer",
    default: true,
  },
  {
    header: "CONSIGNMENT SIZE",
    key: "consignmentSize",
    type: "field",
    default: true,
  },
  { header: "RETEST DATE", key: "retestDate", type: "field", default: true },
  {
    header: "PHARMACOPOEIA",
    key: "pharmacopoeia",
    type: "answer",
    default: true,
  },
  {
    header: "STORAGE CONDITION",
    key: "storage_condition",
    type: "answer",
    default: true,
  },
  {
    header: "REASON FOR ANALYSIS",
    key: "reason_for_analysis",
    type: "answer",
    default: true,
  },
  {
    header: "REQUIRED TEST",
    key: "required_test",
    type: "answer",
    default: true,
  },
  {
    header: "NAME OF OFFICER",
    key: "officerName",
    type: "field",
    default: true,
  },
  {
    header: "DESIGNATION",
    key: "officerDesignation",
    type: "field",
    default: true,
  },
  { header: "PHONE NO", key: "officerPhone", type: "field", default: true },
  { header: "EMAIL", key: "officerEmail", type: "field", default: true },
  { header: "CATEGORY", key: "category", type: "answer", default: true },
  {
    header: "PHYSICAL DESCRIPTION",
    key: "physical_description",
    type: "answer",
    default: true,
  },
  {
    header: "COUNTRY OF ORIGIN",
    key: "country_of_origin",
    type: "answer",
    default: true,
  },
  {
    header: "PORT OF ENTRY",
    key: "port_of_entry",
    type: "answer",
    default: true,
  },
  {
    header: "TEST REQUEST NO",
    key: "testRequestNo",
    type: "field",
    default: true,
  },
  {
    header: "TEST PARAMETERS",
    key: "testParameters",
    type: "field",
    default: true,
  },
  { header: "RISK FACTOR", key: "risk_factor", type: "answer", default: true },
  // additional — not selected by default
  {
    header: "DATE SAMPLE RECEIVED",
    key: "sampleReceivedDate",
    type: "field",
    default: false,
  },
  {
    header: "DATE TAKEN TO LAB",
    key: "takenToLabDate",
    type: "field",
    default: false,
  },
  {
    header: "DATE LAB REPORT RECEIVED",
    key: "labReportReceivedDate",
    type: "field",
    default: false,
  },
  { header: "LAB COMMENT", key: "labComment", type: "field", default: false },
  { header: "NAFDAC NO", key: "nafdacNumber", type: "field", default: false },
  {
    header: "TRACKING NO",
    key: "trackingNumber",
    type: "field",
    default: false,
  },
  { header: "STATUS", key: "status", type: "field", default: false },
  { header: "RECEIVED BY", key: "reviewedBy", type: "field", default: false },
  {
    header: "REJECTION REASON",
    key: "decisionRemark",
    type: "field",
    default: false,
  },
];

const MANIFEST_IMPORT_HEADERS = [
  ...MANIFEST_BASE_HEADERS,
  ...MANIFEST_TRACKING_HEADERS,
];
const MANIFEST_REASON_TO_TEMPLATE_ID = {
  "new registration": "new_registration",
  registration: "new_registration",
  new: "new_registration",
  renewal: "renewal",
  variation: "variation",
};

function normalizeLookupValue(value) {
  return `${value || ""}`
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ");
}

function normalizeManifestReasonToTemplateId(value) {
  const normalized = `${value || ""}`
    .trim()
    .toLowerCase()
    .replace(/[^a-z]+/g, " ")
    .replace(/\s+/g, " ");

  return MANIFEST_REASON_TO_TEMPLATE_ID[normalized] || "";
}

function validateManifestImportRow(row) {
  const issues = [];

  if (
    !`${row?.["BRAND NAME"] || ""}`.trim() &&
    !`${row?.["GENERIC NAME"] || ""}`.trim()
  ) {
    issues.push("Missing brand name or generic name");
  }

  if (!normalizeManifestReasonToTemplateId(row?.["REASON FOR ANALYSIS"])) {
    issues.push("Unsupported reason for analysis");
  }

  if (!`${row?.["BATCH NO"] || ""}`.trim()) {
    issues.push("Missing batch number");
  }

  return issues;
}

function normalizeManifestHeaderValue(value) {
  return `${value || ""}`
    .trim()
    .toUpperCase()
    .replace(/[._]/g, " ")
    .replace(/[^A-Z0-9]+/g, " ")
    .replace(/\s+/g, " ");
}

function getCanonicalManifestHeader(header) {
  const normalizedHeader = normalizeManifestHeaderValue(header);

  const aliases = {
    "PRODUC T CLASS": "PRODUCT CLASS",
    "PRODUCT T CLASS": "PRODUCT CLASS",
  };

  return (
    aliases[normalizedHeader] ||
    MANIFEST_IMPORT_HEADERS.find(
      (item) => normalizeManifestHeaderValue(item) === normalizedHeader,
    ) ||
    `${header || ""}`.trim()
  );
}

function formatManifestCellValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return `${value}`;
  }

  return `${value}`.trim();
}

function formatManifestDateCandidate(value) {
  const text = formatManifestCellValue(value);
  if (!text) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }

  const parsed = new Date(text);
  if (!Number.isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = `${parsed.getMonth() + 1}`.padStart(2, "0");
    const day = `${parsed.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return text;
}

async function parseManifestWorkbook(file) {
  const XLSX = await loadXlsxLibrary();
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onerror = () =>
      reject(new Error("Unable to read the selected Excel file."));
    reader.onload = () => {
      try {
        const workbook = XLSX.read(reader.result, {
          type: "array",
          cellDates: true,
        });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        if (!sheet) {
          throw new Error(
            "The workbook does not contain a readable worksheet.",
          );
        }

        const rows = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          defval: "",
          raw: false,
          blankrows: false,
        });

        if (!rows.length) {
          throw new Error("The selected workbook is empty.");
        }

        const headerRow = rows[0].map((cell) =>
          getCanonicalManifestHeader(cell),
        );
        const expectedHeaders = MANIFEST_BASE_HEADERS;
        const headerIssues = [];

        expectedHeaders.forEach((header, index) => {
          if (headerRow[index] !== header) {
            headerIssues.push(`Column ${index + 1} should be "${header}"`);
          }
        });

        if (headerIssues.length) {
          throw new Error(
            `The manifest header order does not match the required sequence. ${headerIssues[0]}`,
          );
        }

        const unsupportedHeaders = headerRow
          .slice(expectedHeaders.length)
          .filter(
            (header) => header && !MANIFEST_TRACKING_HEADERS.includes(header),
          );

        if (unsupportedHeaders.length) {
          throw new Error(
            `Unsupported extra columns found after the manifest sequence: ${unsupportedHeaders.join(", ")}`,
          );
        }

        const activeHeaders = headerRow.filter(Boolean);
        const dataRows = rows
          .slice(1)
          .map((row) => {
            const normalizedRow = Object.fromEntries(
              MANIFEST_IMPORT_HEADERS.map((header) => [header, ""]),
            );

            activeHeaders.forEach((header, index) => {
              normalizedRow[header] = formatManifestCellValue(row[index]);
            });

            [
              "DATE SAMPLE RECEIVED",
              "DATE TAKEN TO LAB",
              "DATE LAB REPORT RECEIVED",
            ].forEach((header) => {
              normalizedRow[header] = formatManifestDateCandidate(
                normalizedRow[header],
              );
            });

            return normalizedRow;
          })
          .filter((row) =>
            MANIFEST_IMPORT_HEADERS.some((header) =>
              Boolean(`${row[header] || ""}`.trim()),
            ),
          );

        resolve({
          headers: headerRow,
          rows: dataRows,
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.readAsArrayBuffer(file);
  });
}

function loadAdminProfile() {
  if (typeof window === "undefined") {
    return { ...EMPTY_ADMIN_PROFILE };
  }

  try {
    const raw = window.localStorage.getItem(ADMIN_PROFILE_STORAGE_KEY);
    if (!raw) {
      return { ...EMPTY_ADMIN_PROFILE };
    }

    const parsed = JSON.parse(raw);
    return {
      officerName: `${parsed?.officerName || ""}`,
      officerDesignation: `${parsed?.officerDesignation || ""}`,
      officerPhone: `${parsed?.officerPhone || ""}`,
      officerEmail: `${parsed?.officerEmail || ""}`,
    };
  } catch (error) {
    return { ...EMPTY_ADMIN_PROFILE };
  }
}

function filterOptions(options, query, currentValue = "") {
  const cleanQuery = normalizeLookupValue(query);
  const filtered = options.filter((option) => {
    if (!cleanQuery) {
      return true;
    }

    return normalizeLookupValue(option).includes(cleanQuery);
  });

  if (!cleanQuery && currentValue && !filtered.includes(currentValue)) {
    return [currentValue, ...filtered];
  }

  return filtered;
}

function resolveGuideProductTypeFromDosageForm(dosageForm) {
  const normalizedDosageForm = normalizeLookupValue(dosageForm);

  if (!normalizedDosageForm) {
    return "";
  }

  if (DOSAGE_FORM_GUIDE_ALIASES[normalizedDosageForm]) {
    return DOSAGE_FORM_GUIDE_ALIASES[normalizedDosageForm];
  }

  const keywordMatch = DOSAGE_FORM_GUIDE_KEYWORDS.find((rule) =>
    rule.keywords.some((keyword) =>
      normalizedDosageForm.includes(normalizeLookupValue(keyword)),
    ),
  );

  if (keywordMatch) {
    return keywordMatch.guideProductType;
  }

  return dosageForm;
}

function buildPublicFormSections(items) {
  const itemMap = new Map(items.map((item) => [item.code, item]));
  const categorizedCodes = new Set();

  const sections = PUBLIC_FORM_SECTIONS.map((section) => {
    const sectionItems = section.codes
      .map((code) => itemMap.get(code))
      .filter(Boolean);

    sectionItems.forEach((item) => categorizedCodes.add(item.code));

    return {
      ...section,
      items: sectionItems,
    };
  }).filter((section) => section.items.length);

  const uncategorizedItems = items.filter(
    (item) => !categorizedCodes.has(item.code),
  );

  if (uncategorizedItems.length) {
    sections.push({
      id: "additional",
      title: "Additional Details",
      description:
        "These fields remain part of the submission and are shown here for completion.",
      items: uncategorizedItems,
    });
  }

  return sections;
}

function isWidePublicField(code) {
  return WIDE_PUBLIC_FIELD_CODES.has(code);
}

function normalizeSamplingGuide(guide) {
  const products = Array.isArray(guide?.products) ? guide.products : [];

  return products
    .map((product) => {
      const productType = `${product?.productType || ""}`.trim();
      const sizes = Array.isArray(product?.sizes)
        ? product.sizes
            .map((entry, index) => ({
              id: `${index}`,
              size: `${entry?.size || ""}`.trim(),
              retention: Number(entry?.retention),
              total: Number(entry?.total),
            }))
            .filter(
              (entry) =>
                entry.size &&
                Number.isFinite(entry.retention) &&
                entry.retention > 0 &&
                Number.isFinite(entry.total) &&
                entry.total > 0,
            )
        : [];

      return {
        productType,
        sizes,
      };
    })
    .filter((product) => product.productType && product.sizes.length);
}

function getGuideQuantityForRisk(entry, riskLevel) {
  if (riskLevel === "HIGH") {
    return entry.total;
  }

  return entry.retention;
}

function findGuideProductByDosageForm(products, dosageForm) {
  const normalizedDosageForm = normalizeLookupValue(dosageForm);
  const resolvedGuideProductType = normalizeLookupValue(
    resolveGuideProductTypeFromDosageForm(dosageForm),
  );

  if (!normalizedDosageForm) {
    return null;
  }

  return (
    products.find((product) => {
      const normalizedProductType = normalizeLookupValue(product.productType);

      return (
        normalizedProductType === normalizedDosageForm ||
        (resolvedGuideProductType &&
          normalizedProductType === resolvedGuideProductType)
      );
    }) || null
  );
}

async function loadFrontendSamplingGuide() {
  try {
    const response = await fetch("/samplingguide.json", { cache: "no-store" });
    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    return payload;
  } catch (error) {
    return null;
  }
}

function detectRawSizeUnit(sizeLabel) {
  const value = `${sizeLabel || ""}`.toLowerCase();

  if (/\bmg\b/.test(value)) {
    return "mg";
  }
  if (/\bkg\b/.test(value)) {
    return "kg";
  }
  if (/\bml\b/.test(value)) {
    return "ml";
  }
  if (/\bl\b/.test(value)) {
    return "l";
  }
  if (/\bg\b/.test(value)) {
    return "g";
  }
  if (
    /(tabs?|caps?(?:ules)?|sachets?|actuations?|ampoules?|vials?|patches?)/.test(
      value,
    )
  ) {
    return "count";
  }

  return "";
}

function normalizeGuideSizeLabel(sizeLabel) {
  return `${sizeLabel || ""}`
    .replace(/[–—]/g, "-")
    .replace(/\bto\b/gi, " - ")
    .replace(/\bless than\b/gi, "<")
    .replace(/\band above\b/gi, "")
    .replace(/\babove\b/gi, ">")
    .replace(/\s*x\s*/gi, " x ")
    .replace(/\s*-\s*/g, " - ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeDetectedUnit(unit) {
  if (unit === "kg" || unit === "mg") {
    return "g";
  }

  if (unit === "l") {
    return "ml";
  }

  return unit || "";
}

function convertValueToBaseUnit(value, unit) {
  if (!Number.isFinite(value)) {
    return value;
  }

  if (unit === "kg") {
    return value * 1000;
  }

  if (unit === "mg") {
    return value / 1000;
  }

  if (unit === "l") {
    return value * 1000;
  }

  return value;
}

function detectGuideRuleUnit(sizeLabel) {
  const value = normalizeGuideSizeLabel(sizeLabel).toLowerCase();

  if (/(g\s*(?:\/|or)\s*ml|ml\s*(?:\/|or)\s*g)/.test(value)) {
    return "";
  }

  return normalizeDetectedUnit(detectRawSizeUnit(value));
}

function parseComparableSize(sizeLabel) {
  const raw = normalizeGuideSizeLabel(sizeLabel);
  if (!raw) {
    return null;
  }

  if (/^(<=|>=|<|>)/.test(raw) || /\ball sizes\b/i.test(raw)) {
    return null;
  }

  const multiplierMatch = raw.match(
    /(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)(?:\s*([a-zA-Z]+))?/i,
  );
  const rangeMatch =
    raw.match(/[<>]/) || raw.includes("–") || raw.includes("-");
  const numericMatches = [...raw.matchAll(/\d+(?:\.\d+)?/g)].map((item) =>
    Number(item[0]),
  );

  let value;
  let unit = "";

  if (multiplierMatch) {
    value = Number(multiplierMatch[2]);
    unit = detectRawSizeUnit(multiplierMatch[0]) || detectRawSizeUnit(raw);
  } else {
    if (!numericMatches.length) {
      return null;
    }

    if (rangeMatch && numericMatches.length > 1) {
      return null;
    }

    value = numericMatches[numericMatches.length - 1];
    unit = detectRawSizeUnit(raw);
  }

  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }

  const normalizedUnit = normalizeDetectedUnit(unit);
  return {
    value: convertValueToBaseUnit(value, unit),
    unit: normalizedUnit,
  };
}

function isIntegerish(value) {
  return Math.abs(value - Math.round(value)) < 0.000001;
}

function parseGuideBound(boundLabel, fallbackUnit = "") {
  const normalized = normalizeGuideSizeLabel(boundLabel);
  const match = normalized.match(/^(<=|>=|<|>)?\s*(\d+(?:\.\d+)?)/);

  if (!match) {
    return null;
  }

  const comparator = match[1] || "";
  const numericValue = Number(match[2]);
  const hasMixedWeightVolumeUnit =
    /(g\s*(?:\/|or)\s*ml|ml\s*(?:\/|or)\s*g)/.test(normalized.toLowerCase());
  const rawUnit = hasMixedWeightVolumeUnit ? "" : detectRawSizeUnit(normalized);
  const boundUnit = normalizeDetectedUnit(rawUnit || fallbackUnit);

  return {
    comparator,
    value: convertValueToBaseUnit(numericValue, rawUnit || fallbackUnit),
    unit: boundUnit,
  };
}

function applyGuideBound(rule, bound, preferredSide) {
  if (!bound) {
    return;
  }

  if (bound.comparator === ">" || bound.comparator === ">=") {
    rule.min = bound.value;
    rule.minInclusive = bound.comparator === ">=";
    return;
  }

  if (bound.comparator === "<" || bound.comparator === "<=") {
    rule.max = bound.value;
    rule.maxInclusive = bound.comparator === "<=";
    return;
  }

  if (preferredSide === "lower") {
    rule.min = bound.value;
    rule.minInclusive = true;
    return;
  }

  rule.max = bound.value;
  rule.maxInclusive = true;
}

function parseGuideSizeRule(sizeLabel) {
  const normalized = normalizeGuideSizeLabel(sizeLabel);
  const lower = normalized.toLowerCase();

  if (!normalized) {
    return null;
  }

  if (/all sizes/.test(lower)) {
    return {
      type: "fixed",
      label: normalized,
      unit: "",
    };
  }

  if (/industrial sizes|retail sizes|see capsules|based on/.test(lower)) {
    return {
      type: "unsupported",
      label: normalized,
      unit: "",
    };
  }

  const multiplierRangeMatch = normalized.match(
    /^1 x (\d+(?:\.\d+)?) - 1 x (\d+(?:\.\d+)?)(?:\s*[a-zA-Z]+.*)?$/i,
  );

  if (multiplierRangeMatch) {
    return {
      type: "range",
      label: normalized,
      unit: "count",
      min: Number(multiplierRangeMatch[1]),
      minInclusive: true,
      max: Number(multiplierRangeMatch[2]),
      maxInclusive: true,
    };
  }

  const exactComparable = parseComparableSize(normalized);
  if (exactComparable) {
    return {
      type: "exact",
      label: normalized,
      ...exactComparable,
    };
  }

  const ruleUnit = detectGuideRuleUnit(normalized);
  const rangeParts = normalized.split(" - ");

  if (rangeParts.length === 2) {
    const lowerBound = parseGuideBound(rangeParts[0], ruleUnit);
    const upperBound = parseGuideBound(rangeParts[1], ruleUnit);
    const rule = {
      type: "range",
      label: normalized,
      unit: lowerBound?.unit || upperBound?.unit || ruleUnit || "",
      min: null,
      minInclusive: true,
      max: null,
      // When the lower bound uses a strict ">" comparator (e.g. ">30 ml - 200 ml"),
      // the upper bound without an explicit comparator is exclusive at that value —
      // the guide's convention is that the next range begins with ">N" picking up
      // exactly at N. So treat the upper bound as exclusive in that case.
      maxInclusive: !(lowerBound?.comparator === ">"),
    };

    applyGuideBound(rule, lowerBound, "lower");
    applyGuideBound(rule, upperBound, "upper");

    if (Number.isFinite(rule.min) || Number.isFinite(rule.max)) {
      return rule;
    }
  }

  const singleBound = parseGuideBound(normalized, ruleUnit);
  if (singleBound && singleBound.comparator) {
    const rule = {
      type: "range",
      label: normalized,
      unit: singleBound.unit || ruleUnit || "",
      min: null,
      minInclusive: true,
      max: null,
      maxInclusive: true,
    };

    applyGuideBound(rule, singleBound, "upper");
    return rule;
  }

  return null;
}

function isGuideUnitCompatible(customUnit, ruleUnit) {
  if (!customUnit || !ruleUnit) {
    return true;
  }

  return customUnit === ruleUnit;
}

function isWithinGuideRange(value, rule) {
  if (Number.isFinite(rule.min)) {
    if (rule.minInclusive ? value < rule.min : value <= rule.min) {
      return false;
    }
  }

  if (Number.isFinite(rule.max)) {
    if (rule.maxInclusive ? value > rule.max : value >= rule.max) {
      return false;
    }
  }

  return true;
}

function getGuideRangeScore(parsedCustom, rule) {
  const span =
    Number.isFinite(rule.min) && Number.isFinite(rule.max)
      ? Math.abs(rule.max - rule.min)
      : Number.POSITIVE_INFINITY;
  const centerDistance =
    Number.isFinite(rule.min) && Number.isFinite(rule.max)
      ? Math.abs(parsedCustom.value - (rule.min + rule.max) / 2)
      : 0;

  return span + centerDistance;
}

function findCustomSizeFactorMatch(product, customSizeInput) {
  const parsedCustom = parseComparableSize(customSizeInput);

  if (!parsedCustom) {
    return {
      error: 'Enter custom size using a format like "1 x 20 tabs" or "20 ml".',
    };
  }

  const candidates = (product?.sizes || [])
    .map((entry) => ({
      entry,
      rule: parseGuideSizeRule(entry.size),
    }))
    .filter((item) => item.rule && item.rule.type !== "unsupported");

  if (!candidates.length) {
    return {
      error:
        "Sampling guide entries for this product type are not ready for automated matching.",
    };
  }

  const compatibleCandidates = candidates.filter((item) => {
    if (!isGuideUnitCompatible(parsedCustom.unit, item.rule.unit)) return false;
    // Entries whose size label specifies a dosage form keyword (ampoule, vial)
    // should only match user inputs that also reference that form.
    // This prevents "2 ml" (no form specified) from matching "1 ml - 5 ml ampoules".
    const entryLabel = (item.entry.size || "").toLowerCase();
    const userInput = customSizeInput.toLowerCase();
    if (/ampoule/.test(entryLabel) && !/ampoule/.test(userInput)) return false;
    if (/\bvial/.test(entryLabel) && !/\bvial/.test(userInput)) return false;
    return true;
  });

  if (!compatibleCandidates.length) {
    return {
      error:
        "Custom size cannot be compared with the available guide sizes for this product type.",
    };
  }

  // Check for range matches FIRST — if the input falls within a specific range
  // entry, that always takes priority over ratio-scaling from an exact entry.
  // This handles cases like Oral Powder where "1 x 3 - 1 x 6 sachets" is a
  // fixed-quantity range and must not be overridden by a ratio from "1 x 1 sachet".
  const earlyRangeMatches = compatibleCandidates
    .filter((c) => c.rule.type === "range")
    .filter((c) => isWithinGuideRange(parsedCustom.value, c.rule))
    .sort(
      (a, b) =>
        getGuideRangeScore(parsedCustom, a.rule) -
        getGuideRangeScore(parsedCustom, b.rule),
    );

  if (earlyRangeMatches.length) {
    return {
      parsedCustom,
      referenceEntry: earlyRangeMatches[0].entry,
      referenceComparable: parsedCustom,
      scalingMode: "direct",
    };
  }

  let bestMatch = null;

  for (const candidate of compatibleCandidates) {
    if (candidate.rule.type !== "exact") {
      continue;
    }

    const candidateValue = candidate.rule.value;
    const ratioForward = parsedCustom.value / candidateValue;
    const ratioBackward = candidateValue / parsedCustom.value;
    const equalSize = Math.abs(parsedCustom.value - candidateValue) < 0.000001;
    const factorRelationship =
      isIntegerish(ratioForward) || isIntegerish(ratioBackward);

    if (!equalSize && !factorRelationship) {
      continue;
    }

    const closeness = Math.abs(Math.log(candidateValue / parsedCustom.value));

    if (!bestMatch || closeness < bestMatch.closeness) {
      bestMatch = {
        ...candidate,
        closeness,
      };
    }
  }

  if (bestMatch) {
    return {
      parsedCustom,
      referenceEntry: bestMatch.entry,
      referenceComparable: {
        value: bestMatch.rule.value,
        unit: bestMatch.rule.unit,
      },
      scalingMode: "ratio",
    };
  }

  const rangeMatches = compatibleCandidates
    .filter((candidate) => candidate.rule.type === "range")
    .filter((candidate) =>
      isWithinGuideRange(parsedCustom.value, candidate.rule),
    )
    .sort(
      (left, right) =>
        getGuideRangeScore(parsedCustom, left.rule) -
        getGuideRangeScore(parsedCustom, right.rule),
    );

  if (rangeMatches.length) {
    return {
      parsedCustom,
      referenceEntry: rangeMatches[0].entry,
      referenceComparable: parsedCustom,
      scalingMode: "direct",
    };
  }

  const fixedMatch = compatibleCandidates.find(
    (candidate) => candidate.rule.type === "fixed",
  );
  if (fixedMatch) {
    return {
      parsedCustom,
      referenceEntry: fixedMatch.entry,
      referenceComparable: parsedCustom,
      scalingMode: "direct",
    };
  }

  return {
    error:
      "Pack size does not match any guide size or interval for this product type.",
  };
}

function normalizePath(pathname) {
  const value = `${pathname || "/"}`;
  if (value === "/") {
    return "/";
  }
  return value.replace(/\/+$/, "") || "/";
}

function getTemplateDisplayName(template) {
  const templateKey = `${template?.templateId || template?.id || ""}`;
  return TEMPLATE_LABELS[templateKey] || template?.title || templateKey;
}

function countRequiredItems(items) {
  return items.filter((item) => Boolean(item.required)).length;
}

function countCompletedRequiredItems(items, answers) {
  return items.filter((item) => {
    if (!item.required) {
      return false;
    }

    return Boolean(`${answers?.[item.code] || ""}`.trim());
  }).length;
}

function parseDateInput(value) {
  const cleanValue = `${value || ""}`.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanValue)) {
    return null;
  }

  const [year, month, day] = cleanValue.split("-").map((part) => Number(part));
  const parsed = new Date(Date.UTC(year, month - 1, day));

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return null;
  }

  return parsed;
}

function toUtcDateOnly(date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function addUtcMonths(date, months) {
  const day = date.getUTCDate();
  const shifted = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1),
  );
  shifted.setUTCMonth(shifted.getUTCMonth() + months);

  const lastDayOfTargetMonth = new Date(
    Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth() + 1, 0),
  ).getUTCDate();

  shifted.setUTCDate(Math.min(day, lastDayOfTargetMonth));
  return shifted;
}

function getRemainingMonthsAndDays(fromDate, toDate) {
  let months =
    (toDate.getUTCFullYear() - fromDate.getUTCFullYear()) * 12 +
    (toDate.getUTCMonth() - fromDate.getUTCMonth());
  let anchor = addUtcMonths(fromDate, months);

  if (anchor > toDate) {
    months -= 1;
    anchor = addUtcMonths(fromDate, months);
  }

  const days = Math.max(0, Math.floor((toDate - anchor) / DAY_IN_MS));
  return { months: Math.max(0, months), days };
}

function formatMonthsAndDays(months, days) {
  const monthPart = `${months} month${months === 1 ? "" : "s"}`;
  const dayPart = `${days} day${days === 1 ? "" : "s"}`;
  return `${monthPart} ${dayPart}`;
}

function getExpiryAssessment(answers) {
  const manufacturingRaw =
    `${answers[MANUFACTURING_DATE_FIELD_CODE] || ""}`.trim();
  const expiryRaw = `${answers[EXPIRY_DATE_FIELD_CODE] || ""}`.trim();

  if (!manufacturingRaw || !expiryRaw) {
    return {
      status: "pending",
      message:
        "Enter manufacturing and expiration dates to confirm registration eligibility.",
      remainingLabel: "",
    };
  }

  const manufacturingDate = parseDateInput(manufacturingRaw);
  if (!manufacturingDate) {
    return {
      status: "error",
      message:
        "This sample cannot be registered because the manufacturing date is invalid.",
      remainingLabel: "",
    };
  }

  const expiryDate = parseDateInput(expiryRaw);
  if (!expiryDate) {
    return {
      status: "error",
      message:
        "This sample cannot be registered because the expiration date is invalid.",
      remainingLabel: "",
    };
  }

  if (manufacturingDate >= expiryDate) {
    return {
      status: "error",
      message:
        "This sample cannot be registered because the expiration date must be after the manufacturing date.",
      remainingLabel: "",
    };
  }

  const today = toUtcDateOnly(new Date());
  if (expiryDate < today) {
    return {
      status: "error",
      message:
        "This sample cannot be registered because the product has already expired.",
      remainingLabel: "",
    };
  }

  const minimumAllowedExpiry = addUtcMonths(today, MIN_MONTHS_BEFORE_EXPIRY);
  const { months, days } = getRemainingMonthsAndDays(today, expiryDate);
  const remainingLabel = formatMonthsAndDays(months, days);

  if (expiryDate < minimumAllowedExpiry) {
    return {
      status: "error",
      message: `This sample cannot be registered because only ${remainingLabel} remains before expiry. Minimum required is 6 months from today.`,
      remainingLabel,
    };
  }

  return {
    status: "ok",
    message: `Time remaining is ${remainingLabel}. Sample is eligible for registration under the 6-month minimum requirement.`,
    remainingLabel,
  };
}

function normalizeTemplate(template) {
  if (!template) {
    return null;
  }

  const id =
    template.id || template.templateId || template._id?.toString?.() || "";
  return {
    ...template,
    id,
    templateId: template.templateId || id,
    documentsRequired: Array.isArray(template.documentsRequired)
      ? template.documentsRequired
      : [],
    productSample: Array.isArray(template.productSample)
      ? template.productSample
      : [],
  };
}

function normalizeSubmission(submission) {
  if (!submission) {
    return null;
  }

  const id = submission.id || submission._id?.toString?.() || "";
  const templateSnapshot = normalizeTemplate(submission.templateSnapshot);

  return {
    ...submission,
    id,
    templateId: submission.templateId || templateSnapshot?.templateId || "",
    templateSnapshot,
    documentsChecklist: Array.isArray(submission.documentsChecklist)
      ? submission.documentsChecklist
      : [],
    productSampleAnswers: submission.productSampleAnswers || {},
    nafdacNumber:
      submission.productSampleAnswers?.nafdac_no ||
      submission.productSampleAnswers?.[NAFDAC_NUMBER_FIELD_CODE] ||
      "",
    source:
      submission.source ||
      submission.productSampleAnswers?.[SOURCE_FIELD_CODE] ||
      "",
    samplingDate:
      submission.samplingDate ||
      submission.productSampleAnswers?.[SAMPLING_DATE_FIELD_CODE] ||
      "",
    sampleReceivedDate: submission.sampleReceivedDate || "",
    officerName: submission.officerName || "",
    officerDesignation: submission.officerDesignation || "",
    officerPhone: submission.officerPhone || "",
    officerEmail: submission.officerEmail || "",
  };
}

function buildDefaultSampleAnswers(template, previous = {}) {
  const next = {};

  if (!template) {
    return next;
  }

  for (const item of template.productSample) {
    const defaultValue = `${item.defaultValue || ""}`.trim();
    next[item.code] = item.readOnly
      ? defaultValue
      : previous[item.code] || defaultValue;
  }

  return next;
}

function getSubmissionAnswer(submission, code) {
  return `${submission?.productSampleAnswers?.[code] || ""}`.trim() || "NIL";
}

function toStatusLabel(status) {
  if (!status) {
    return "";
  }

  return status
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

function formatDate(isoString) {
  if (!isoString) {
    return "";
  }

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return isoString;
  }

  return date.toLocaleString();
}

function getLocalDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

function getDateKeyFromValue(value) {
  if (!value && value !== 0) {
    return "";
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return "";
    }
    return getLocalDateKey(value);
  }

  const cleanValue = `${value || ""}`.trim();
  if (!cleanValue) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(cleanValue)) {
    return cleanValue;
  }

  const parsed = new Date(cleanValue);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return getLocalDateKey(parsed);
}

function getMonthKeyFromValue(value) {
  const dateKey = getDateKeyFromValue(value);
  return dateKey ? dateKey.slice(0, 7) : "";
}

function buildAnalyticsTimeline(submissions, valueGetter) {
  const byMonth = {};
  let datedCount = 0;
  const todayKey = getDateKeyFromValue(new Date());
  let todayCount = 0;

  submissions.forEach((submission) => {
    const value = valueGetter(submission);
    const dateKey = getDateKeyFromValue(value);
    const monthKey = getMonthKeyFromValue(value);

    if (dateKey && dateKey === todayKey) {
      todayCount += 1;
    }

    if (!monthKey) {
      return;
    }

    datedCount += 1;
    byMonth[monthKey] = (byMonth[monthKey] || 0) + 1;
  });

  return {
    total: datedCount,
    todayCount,
    months: fillMonthGaps(
      Object.entries(byMonth).sort((left, right) =>
        left[0].localeCompare(right[0]),
      ),
    ),
  };
}

// Gap-fill a sorted months array so every month between first and last is
// represented (missing months get count 0). This prevents visual jumps in the
// trend chart.
function fillMonthGaps(months) {
  if (months.length < 2) return months;
  const filled = [];
  const [firstKey] = months[0];
  const [lastKey] = months[months.length - 1];
  const existing = new Map(months);

  let [y, m] = firstKey.split("-").map(Number);
  const [endY, endM] = lastKey.split("-").map(Number);

  while (y < endY || (y === endY && m <= endM)) {
    const key = `${y}-${String(m).padStart(2, "0")}`;
    filled.push([key, existing.get(key) || 0]);
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return filled;
}

function escapeHtml(value) {
  return `${value || ""}`
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildPrintHtml(template, submission) {
  const docsRows = template.documentsRequired
    .map((item) => {
      const entry = submission.documentsChecklist.find(
        (doc) => doc.code === item.code,
      ) || { status: "PENDING", remark: "" };

      return `
        <tr>
          <td>${item.serialNumber}</td>
          <td>${escapeHtml(item.label)}</td>
          <td>${entry.status === "YES" ? "X" : ""}</td>
          <td>${entry.status === "NO" ? "X" : ""}</td>
          <td>${escapeHtml(entry.remark || "")}</td>
        </tr>
      `;
    })
    .join("");

  const productRows = template.productSample
    .map((item) => {
      const value = submission.productSampleAnswers[item.code] || "";
      return `
        <tr>
          <td>${item.serialNumber}</td>
          <td>${escapeHtml(item.label)}</td>
          <td colspan="3">${escapeHtml(value)}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${escapeHtml(submission.trackingNumber)}</title>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; font-family: "Times New Roman", serif; color: #111; }
          .page { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 12mm 10mm; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #1a1a1a; padding: 6px 8px; font-size: 12px; vertical-align: top; }
          .header-cell { font-weight: 700; }
          .directorate { text-align: center; margin: 10px 0 12px; font-size: 20px; font-weight: 600; }
          .section-row td { font-weight: 700; font-size: 13px; }
          .fields-row td { font-weight: 700; }
          .docs-columns-row td { font-weight: 700; text-align: center; }
          .docs-columns-row td:nth-child(2) { text-align: left; }
          .meta { margin-top: 10px; font-size: 11px; }
          @media print {
            .page { margin: 0; padding: 10mm 8mm; }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <table>
            <tr>
              <td class="header-cell" style="width:20%">${escapeHtml(template.annexure)}</td>
              <td class="header-cell" style="width:23%">SOP Ref.No.: ${escapeHtml(template.sopRef)}</td>
              <td class="header-cell">${escapeHtml(template.title)}</td>
            </tr>
          </table>

          <div class="directorate">${escapeHtml(template.directorate)}</div>

          <table>
            <tbody>
              <tr class="section-row">
                <td></td>
                <td colspan="4">DOCUMENTS REQUIRED</td>
              </tr>
              <tr class="docs-columns-row">
                <td style="width:7%">S/N</td>
                <td style="width:54%">DESCRIPTION</td>
                <td style="width:10%">YES</td>
                <td style="width:10%">NO</td>
                <td style="width:19%">REMARK</td>
              </tr>
              ${docsRows}
              <tr class="section-row">
                <td></td>
                <td colspan="4">PRODUCT SAMPLE</td>
              </tr>
              ${productRows}
            </tbody>
          </table>

          <div class="meta">
            <div><strong>Tracking No:</strong> ${escapeHtml(submission.trackingNumber)}</div>
            <div><strong>NAFDAC No:</strong> ${escapeHtml(submission.productSampleAnswers?.nafdac_no || "")}</div>
            <div><strong>Status:</strong> ${escapeHtml(toStatusLabel(submission.status))}</div>
            <div><strong>Received By:</strong> ${escapeHtml(submission.reviewedBy || "")}</div>
            <div><strong>Officer Name:</strong> ${escapeHtml(submission.officerName || "")}</div>
            <div><strong>Designation:</strong> ${escapeHtml(submission.officerDesignation || "")}</div>
            <div><strong>Officer Phone:</strong> ${escapeHtml(submission.officerPhone || "")}</div>
            <div><strong>Officer Email:</strong> ${escapeHtml(submission.officerEmail || "")}</div>
            <div><strong>Exported At:</strong> ${escapeHtml(formatDate(new Date().toISOString()))}</div>
          </div>
        </div>
      </body>
    </html>
  `;
}

function openPrintWindow(template, submission) {
  const printWindow = window.open("", "_blank", "width=980,height=760");
  if (!printWindow) {
    window.alert("Popup blocked. Allow popups to print/export this form.");
    return;
  }

  printWindow.document.open();
  printWindow.document.write(buildPrintHtml(template, submission));
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function isAuthErrorMessage(message) {
  return /(auth|token|unauthori)/i.test(`${message || ""}`);
}

function SamplingGuideCalculator({ samplingGuideProducts }) {
  const [dosageFormSearch, setDosageFormSearch] = useState("");
  const [openField, setOpenField] = useState("");
  const [dosageForm, setDosageForm] = useState("");
  const [injectableSubtype, setInjectableSubtype] = useState("");
  const [packSize, setPackSize] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const fieldRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!openField) return undefined;
    function handlePointerDown(event) {
      if (fieldRef.current && !fieldRef.current.contains(event.target)) {
        setOpenField("");
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [openField]);

  useEffect(() => {
    if (openField && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [openField]);

  const dosageFormOptions = useMemo(() => {
    return samplingGuideProducts
      .map((p) => p.productType)
      .sort((a, b) => a.localeCompare(b));
  }, [samplingGuideProducts]);

  const filteredOptions = useMemo(() => {
    return filterOptions(dosageFormOptions, dosageFormSearch, dosageForm);
  }, [dosageFormOptions, dosageFormSearch, dosageForm]);

  const selectedProduct = useMemo(
    () => findGuideProductByDosageForm(samplingGuideProducts, dosageForm),
    [samplingGuideProducts, dosageForm],
  );

  const isInjectables = selectedProduct?.productType === "Injectables";

  const filteredProduct = useMemo(() => {
    if (!isInjectables || !injectableSubtype) return selectedProduct;
    const subtype = INJECTABLE_SUBTYPES.find(
      (s) => s.value === injectableSubtype,
    );
    if (!subtype) return selectedProduct;
    return {
      ...selectedProduct,
      sizes: selectedProduct.sizes.filter((entry) => subtype.test(entry.size)),
    };
  }, [selectedProduct, isInjectables, injectableSubtype]);

  const result = useMemo(() => {
    if (!samplingGuideProducts.length) {
      return {
        status: "pending",
        message: "Sampling guide is loading...",
        quantity: "",
        detail: "",
      };
    }
    if (!dosageForm) {
      return {
        status: "pending",
        message: "Select a dosage form to begin.",
        quantity: "",
        detail: "",
      };
    }
    if (!selectedProduct) {
      return {
        status: "error",
        message: "This dosage form is not covered by the sampling guide.",
        quantity: "",
        detail: "",
      };
    }
    if (isInjectables && !injectableSubtype) {
      return {
        status: "pending",
        message: "Select the injectable type.",
        quantity: "",
        detail: "",
      };
    }
    if (!riskLevel) {
      return {
        status: "pending",
        message: "Select a risk factor.",
        quantity: "",
        detail: "",
      };
    }
    if (!packSize.trim()) {
      return {
        status: "pending",
        message: "Enter the pack size.",
        quantity: "",
        detail: "",
      };
    }

    const match = findCustomSizeFactorMatch(filteredProduct, packSize);
    if (match.error) {
      return {
        status: "error",
        message: match.error,
        quantity: "",
        detail: "",
      };
    }

    const baseQuantity = getGuideQuantityForRisk(
      match.referenceEntry,
      riskLevel,
    );
    const scaledQuantity =
      match.scalingMode === "ratio"
        ? Math.ceil(
            (baseQuantity * match.referenceComparable.value) /
              match.parsedCustom.value,
          )
        : baseQuantity;
    const quantity = Math.max(1, scaledQuantity);
    const sourceLabel = riskLevel === "HIGH" ? "total" : "retention";
    const detail = `${match.scalingMode === "ratio" ? "Calculated" : "Matched"} from "${match.referenceEntry.size}" using ${sourceLabel} quantity.`;

    return { status: "ok", message: "", quantity, detail };
  }, [samplingGuideProducts, dosageForm, selectedProduct, riskLevel, packSize]);

  const isOpen = openField === "dosage_form";
  const visibleValue = isOpen ? dosageFormSearch : dosageForm;

  return (
    <section className="mode-panel">
      <div className="panel-card guide-card">
        <div className="panel-head">
          <h2>Sampling Guide Calculator</h2>
          <span className="guide-source-label">
            NAFDAC Laboratory Sampling Guide 2023
          </span>
        </div>

        <div className="guide-layout">
          <div className="guide-inputs">
            <div className="form-field">
              <div className="form-field-label">
                Dosage Form <span className="form-field-required">*</span>
              </div>
              <div className="form-field-control">
                <div
                  className={`searchable-select ${isOpen ? "is-open" : ""}`.trim()}
                  ref={fieldRef}
                >
                  <div className="searchable-select-input-wrap">
                    <input
                      ref={inputRef}
                      type="text"
                      className="searchable-select-input"
                      value={visibleValue}
                      placeholder="Select or type dosage form"
                      autoComplete="off"
                      aria-label="Dosage Form"
                      onFocus={() => {
                        setOpenField("dosage_form");
                        setDosageFormSearch(dosageForm || "");
                      }}
                      onChange={(e) => {
                        setOpenField("dosage_form");
                        setDosageFormSearch(e.target.value);
                        if (!e.target.value.trim()) setDosageForm("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setOpenField("");
                          setDosageFormSearch("");
                        }
                        if (e.key === "Enter" && filteredOptions[0]) {
                          e.preventDefault();
                          setDosageForm(filteredOptions[0]);
                          setDosageFormSearch("");
                          setOpenField("");
                          setInjectableSubtype("");
                          setPackSize("");
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="searchable-select-toggle"
                      aria-label={
                        isOpen ? "Close suggestions" : "Open suggestions"
                      }
                      onClick={() => {
                        if (isOpen) {
                          setOpenField("");
                          setDosageFormSearch("");
                        } else {
                          setOpenField("dosage_form");
                          setDosageFormSearch(dosageForm || "");
                        }
                      }}
                    >
                      {isOpen ? "▲" : "▼"}
                    </button>
                  </div>
                  {isOpen ? (
                    <div className="searchable-select-panel">
                      <div className="searchable-select-panel-head">
                        <span className="field-hint">
                          {filteredOptions.length
                            ? `${filteredOptions.length} option${filteredOptions.length === 1 ? "" : "s"}`
                            : "No matches found."}
                        </span>
                      </div>
                      <div className="searchable-select-options" role="listbox">
                        {filteredOptions.length ? (
                          filteredOptions.map((option) => (
                            <button
                              key={option}
                              type="button"
                              className={`searchable-select-option ${dosageForm === option ? "is-selected" : ""}`.trim()}
                              onClick={() => {
                                setDosageForm(option);
                                setDosageFormSearch("");
                                setOpenField("");
                                setInjectableSubtype("");
                                setPackSize("");
                              }}
                            >
                              <span>{option}</span>
                              {dosageForm === option ? (
                                <strong>Selected</strong>
                              ) : null}
                            </button>
                          ))
                        ) : (
                          <div className="searchable-select-empty">
                            No dosage form matches.
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {isInjectables ? (
              <div className="form-field">
                <div className="form-field-label">
                  Injectable Type <span className="form-field-required">*</span>
                </div>
                <div className="form-field-control">
                  <div
                    className="risk-radio-group"
                    role="radiogroup"
                    aria-label="Injectable Type"
                  >
                    {INJECTABLE_SUBTYPES.map((option) => (
                      <label key={option.value} className="risk-radio-option">
                        <input
                          type="radio"
                          name="injectable_subtype"
                          value={option.value}
                          checked={injectableSubtype === option.value}
                          onChange={() => {
                            setInjectableSubtype(option.value);
                            setPackSize("");
                          }}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="form-field">
              <div className="form-field-label">
                Pack Size <span className="form-field-required">*</span>
              </div>
              <div className="form-field-control auto-quantity-field">
                <input
                  type="text"
                  value={packSize}
                  onChange={(e) => setPackSize(e.target.value)}
                  placeholder={
                    injectableSubtype === "ampoule"
                      ? 'e.g. "2 ml" or "10 ml"'
                      : injectableSubtype === "vial_liquid"
                        ? 'e.g. "100 ml" or "250 ml"'
                        : injectableSubtype === "vial_powder"
                          ? 'e.g. "1 g" or "500 mg"'
                          : 'e.g. "1 x 10 tabs" or "100 ml"'
                  }
                  disabled={isInjectables && !injectableSubtype}
                  aria-label="Pack Size"
                />
                <span className="field-hint">
                  Enter the pack size as supplied.
                </span>
              </div>
            </div>

            <div className="form-field">
              <div className="form-field-label">
                Risk Factor <span className="form-field-required">*</span>
              </div>
              <div className="form-field-control">
                <div
                  className="risk-radio-group"
                  role="radiogroup"
                  aria-label="Risk Factor"
                >
                  {GUIDE_RISK_OPTIONS.map((option) => (
                    <label key={option.value} className="risk-radio-option">
                      <input
                        type="radio"
                        name="guide_risk"
                        value={option.value}
                        checked={riskLevel === option.value}
                        onChange={() => setRiskLevel(option.value)}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="guide-result-panel">
            <div
              className={`guide-result guide-result-${result.status}`}
              aria-live="polite"
            >
              <div className="guide-result-qty-label">Sampling Quantity</div>
              <div className="guide-result-qty">
                {result.quantity !== "" ? result.quantity : "—"}
              </div>
              {result.quantity !== "" ? (
                <div className="guide-result-unit">
                  pack{result.quantity === 1 ? "" : "s"}
                </div>
              ) : null}
              {result.message || result.detail ? (
                <div className="guide-result-message">
                  {result.message || result.detail}
                </div>
              ) : null}
            </div>

            {filteredProduct ? (
              <div className="guide-ref-table-wrap">
                <div className="guide-ref-table-head">
                  <span className="guide-ref-product-type">
                    {filteredProduct.productType}
                    {injectableSubtype
                      ? ` — ${INJECTABLE_SUBTYPES.find((s) => s.value === injectableSubtype)?.label}`
                      : ""}
                  </span>
                  <span className="field-hint">Guide reference</span>
                </div>
                <div className="table-scroll">
                  <table className="data-table guide-ref-table">
                    <thead>
                      <tr>
                        <th>Pack Size</th>
                        <th>Low</th>
                        <th>High</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const matchResult =
                          result.status === "ok" && packSize.trim()
                            ? findCustomSizeFactorMatch(
                                filteredProduct,
                                packSize,
                              )
                            : null;
                        const matchedEntry =
                          matchResult && !matchResult.error
                            ? matchResult.referenceEntry
                            : null;
                        return filteredProduct.sizes.map((entry) => (
                          <tr
                            key={entry.id}
                            className={
                              entry === matchedEntry ? "is-guide-match" : ""
                            }
                          >
                            <td>{entry.size}</td>
                            <td>{entry.retention}</td>
                            <td>{entry.total}</td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductsRegister({
  submissions,
  selectedId,
  onSelect,
  renderDetail,
  onExport,
}) {
  const [q, setQ] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const resultsTopRef = useRef(null);
  const filtered = useMemo(() => {
    const lq = q.trim().toLowerCase();
    return submissions.filter((s) => {
      if (!lq) return true;
      const brand =
        `${s.productName || s.productSampleAnswers?.brand_name || ""}`.toLowerCase();
      const generic =
        `${s.genericName || s.productSampleAnswers?.generic_name || ""}`.toLowerCase();
      const mfr =
        `${s.manufacturer || s.productSampleAnswers?.manufacturer || ""}`.toLowerCase();
      const dist =
        `${s.distributor || s.productSampleAnswers?.distributor || ""}`.toLowerCase();
      const reason =
        `${s.reasonForAnalysis || s.productSampleAnswers?.reason_for_analysis || ""}`.toLowerCase();
      return (
        brand.includes(lq) ||
        generic.includes(lq) ||
        mfr.includes(lq) ||
        dist.includes(lq) ||
        reason.includes(lq)
      );
    });
  }, [submissions, q]);
  const hasSearch = Boolean(q.trim());
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PRODUCTS_PER_PAGE),
  );
  const pageStart = filtered.length ? (currentPage - 1) * PRODUCTS_PER_PAGE : 0;
  const pageEnd = filtered.length
    ? Math.min(pageStart + PRODUCTS_PER_PAGE, filtered.length)
    : 0;
  const pagedProducts = filtered.slice(
    pageStart,
    pageStart + PRODUCTS_PER_PAGE,
  );
  const selectedProduct =
    filtered.find((item) => item.id === selectedId) || null;

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  useEffect(() => {
    if (!selectedId) {
      return;
    }
    const selectedIndex = filtered.findIndex((item) => item.id === selectedId);
    if (selectedIndex === -1) {
      return;
    }
    const nextPage = Math.floor(selectedIndex / PRODUCTS_PER_PAGE) + 1;
    setCurrentPage((prev) => (prev === nextPage ? prev : nextPage));
  }, [filtered, selectedId]);

  function handlePageChange(nextPage) {
    setCurrentPage(nextPage);
    if (
      typeof window !== "undefined" &&
      typeof window.requestAnimationFrame === "function"
    ) {
      window.requestAnimationFrame(() => {
        resultsTopRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
      return;
    }
    resultsTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="products-register-shell">
      <div className="products-register-toolbar">
        <div className="products-register-toolbar-actions">
          <label className="products-register-search-wrap">
            <span className="products-register-search-label">Search</span>
            <input
              className="products-register-search"
              type="search"
              value={q}
              onChange={(event) => {
                setQ(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Brand, generic, manufacturer, distributor, reason..."
            />
          </label>
        </div>
      </div>
      <div className="products-register-chip-row">
        <span className="products-register-chip">
          {hasSearch
            ? `${filtered.length} match${filtered.length === 1 ? "" : "es"} in ${submissions.length} submissions`
            : `${submissions.length} submission${submissions.length === 1 ? "" : "s"} in register`}
        </span>
        {hasSearch ? (
          <span className="products-register-chip">Search: {q.trim()}</span>
        ) : (
          <span className="products-register-chip products-register-chip-muted">
            Showing all submissions
          </span>
        )}
        {selectedProduct ? (
          <span className="products-register-chip">
            Selected:{" "}
            {selectedProduct.nafdacNumber ||
              selectedProduct.productName ||
              selectedProduct.trackingNumber}
          </span>
        ) : (
          <span className="products-register-chip products-register-chip-muted">
            Click a row to review and update it inline
          </span>
        )}
      </div>
      <div ref={resultsTopRef} aria-hidden="true" />
      <div className="table-scroll products-register-scroll">
        <table className="data-table products-register-table">
          <thead>
            <tr>
              <th className="products-register-col-serial">S/N</th>
              <th className="products-register-col-brand">Brand Name</th>
              <th className="products-register-col-generic">Generic Name</th>
              <th className="products-register-col-manufacturer">
                Manufacturer
              </th>
              <th className="products-register-col-distributor">Distributor</th>
              <th className="products-register-col-reason">
                Reason for Analysis
              </th>
              <th className="products-register-col-status">Status</th>
              <th className="products-register-col-date">Date Received</th>
              <th className="products-register-col-lab-report">Lab Report</th>
              <th style={{ width: "36px" }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? (
              pagedProducts.map((s, i) => (
                <React.Fragment key={s.id}>
                  <tr
                    className={`products-register-row ${selectedId === s.id ? "is-selected" : ""}`.trim()}
                    style={{ cursor: "pointer" }}
                    onClick={() => onSelect(s.id)}
                    tabIndex={0}
                    role="button"
                  >
                    <td className="products-register-col-serial">
                      {pageStart + i + 1}
                    </td>
                    <td className="products-register-col-brand">
                      <strong>
                        {s.productName ||
                          s.productSampleAnswers?.brand_name ||
                          "—"}
                      </strong>
                      <span className="products-register-cell-subtext">
                        {s.nafdacNumber || "No NAFDAC No."}
                      </span>
                    </td>
                    <td
                      className="products-register-col-generic"
                      title={
                        s.genericName ||
                        s.productSampleAnswers?.generic_name ||
                        "—"
                      }
                    >
                      {s.genericName ||
                        s.productSampleAnswers?.generic_name ||
                        "—"}
                      <span className="products-register-cell-subtext">
                        {s.dosageForm ||
                          s.productSampleAnswers?.dosage_form ||
                          "Dosage form not provided"}
                      </span>
                    </td>
                    <td
                      className="products-register-col-manufacturer"
                      title={
                        s.manufacturer ||
                        s.productSampleAnswers?.manufacturer ||
                        "—"
                      }
                    >
                      {s.manufacturer ||
                        s.productSampleAnswers?.manufacturer ||
                        "—"}
                    </td>
                    <td
                      className="products-register-col-distributor"
                      title={
                        s.distributor ||
                        s.productSampleAnswers?.distributor ||
                        "—"
                      }
                    >
                      {s.distributor ||
                        s.productSampleAnswers?.distributor ||
                        "—"}
                    </td>
                    <td
                      className="products-register-col-reason"
                      title={
                        s.reasonForAnalysis ||
                        s.productSampleAnswers?.reason_for_analysis ||
                        "—"
                      }
                    >
                      {s.reasonForAnalysis ||
                        s.productSampleAnswers?.reason_for_analysis ||
                        "—"}
                    </td>
                    <td className="products-register-col-status">
                      <span
                        className={`status-pill status-${(s.status || "").toLowerCase()}`}
                      >
                        {toStatusLabel(s.status)}
                      </span>
                    </td>
                    <td className="products-register-col-date">
                      {s.sampleReceivedDate || formatDate(s.createdAt)}
                    </td>
                    <td className="products-register-col-lab-report">
                      {s.labComment || "—"}
                    </td>
                    <td className="products-register-row-toggle">
                      <span
                        className={`products-register-view-icon ${selectedId === s.id ? "is-active" : ""}`.trim()}
                        title={
                          selectedId === s.id ? "Close record" : "View record"
                        }
                        aria-label={
                          selectedId === s.id ? "Close record" : "View record"
                        }
                      >
                        {/* Eye icon */}
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </span>
                    </td>
                  </tr>
                  {selectedId === s.id && renderDetail ? (
                    <tr>
                      <td
                        colSpan={10}
                        style={{
                          padding: 0,
                          borderTop: "2px solid var(--accent)",
                        }}
                      >
                        <div className="admin-row-detail-panel">
                          {renderDetail()}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="products-register-empty">
                  {q ? `No products match "${q}"` : "No submissions yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="data-table-mobile products-register-mobile">
        {filtered.length ? (
          pagedProducts.map((s, i) => (
            <div
              key={`mobile-${s.id}`}
              className={`mobile-table-card products-register-card ${
                selectedId === s.id ? "is-selected" : ""
              }`.trim()}
              onClick={() => onSelect(s.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(s.id);
                }
              }}
              tabIndex={0}
              role="button"
            >
              <div className="products-register-card-head">
                <span className="products-register-chip products-register-chip-muted">
                  {s.sampleReceivedDate || formatDate(s.createdAt)}
                </span>
                <span
                  className={`status-pill status-${(s.status || "").toLowerCase()}`}
                >
                  {toStatusLabel(s.status)}
                </span>
              </div>
              <div className="mobile-table-row">
                <div className="mobile-table-label">S/N</div>
                <div className="mobile-table-value products-register-card-serial">
                  {pageStart + i + 1}
                </div>
              </div>
              <div className="mobile-table-row">
                <div className="mobile-table-label">Brand Name</div>
                <div className="mobile-table-value">
                  <strong>
                    {s.productName || s.productSampleAnswers?.brand_name || "—"}
                  </strong>
                </div>
              </div>
              <div className="mobile-table-row">
                <div className="mobile-table-label">Generic Name</div>
                <div className="mobile-table-value">
                  {s.genericName || s.productSampleAnswers?.generic_name || "—"}
                </div>
              </div>
              <div className="mobile-table-row">
                <div className="mobile-table-label">Manufacturer</div>
                <div className="mobile-table-value">
                  {s.manufacturer ||
                    s.productSampleAnswers?.manufacturer ||
                    "—"}
                </div>
              </div>
              <div className="mobile-table-row">
                <div className="mobile-table-label">Distributor</div>
                <div className="mobile-table-value">
                  {s.distributor || s.productSampleAnswers?.distributor || "—"}
                </div>
              </div>
              <div className="mobile-table-row">
                <div className="mobile-table-label">Reason for Analysis</div>
                <div className="mobile-table-value">
                  {s.reasonForAnalysis ||
                    s.productSampleAnswers?.reason_for_analysis ||
                    "—"}
                </div>
              </div>
              <div className="mobile-table-row">
                <div className="mobile-table-label">Date Received</div>
                <div className="mobile-table-value">
                  {s.sampleReceivedDate || formatDate(s.createdAt)}
                </div>
              </div>
              <div className="mobile-table-row">
                <div className="mobile-table-label">Lab Report</div>
                <div className="mobile-table-value">{s.labComment || "—"}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state empty-state-admin">
            <h4>No products found</h4>
            <p>{q ? `No products match "${q}".` : "No submissions yet."}</p>
          </div>
        )}
      </div>
      {filtered.length ? (
        <div
          className="products-register-pagination"
          aria-label="Products pagination"
        >
          <div className="products-register-pagination-meta">
            <span className="products-register-pagination-range">
              Showing {pageStart + 1}-{pageEnd} of {filtered.length} product
              {filtered.length === 1 ? "" : "s"}
            </span>
            <span className="products-register-pagination-page">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          {totalPages > 1 ? (
            <div className="products-register-pagination-actions">
              <button
                className="ghost-button"
                type="button"
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={() =>
                  handlePageChange(Math.min(currentPage + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function AnalyticsBar({ data, total, colorVar }) {
  if (!data.length)
    return <div className="analytics-empty">No data available.</div>;
  const max = Math.max(...data.map(([, v]) => v), 1);
  const color = colorVar || "var(--accent)";
  return (
    <div className="analytics-bar-list">
      {data.map(([label, count], index) => {
        const pct = total ? ((count / total) * 100).toFixed(1) : null;
        const barW = ((count / max) * 100).toFixed(1);
        return (
          <div key={label} className="analytics-bar-row">
            <div className="analytics-bar-meta">
              <div className="analytics-bar-label-group">
                <span className="analytics-bar-rank">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="analytics-bar-label" title={label}>
                  {label}
                </span>
              </div>
              <span className="analytics-bar-count">
                <strong>{count}</strong>
                {pct && <span className="analytics-bar-pct">{pct}%</span>}
              </span>
            </div>
            <div className="analytics-bar-track">
              <div
                className="analytics-bar-fill"
                style={{ width: `${barW}%`, background: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

const ANALYTICS_DONUT_COLORS = [
  "var(--accent)",
  "var(--accent-mid)",
  "var(--gold)",
  "var(--ok)",
  "var(--warning)",
  "var(--danger)",
  "#0f766e",
  "#475569",
];

function compactAnalyticsData(data, maxItems = 5) {
  const entries = data.filter(([, count]) => Number(count) > 0);
  if (entries.length <= maxItems) {
    return entries;
  }

  const primaryEntries = entries.slice(0, maxItems - 1);
  const otherCount = entries
    .slice(maxItems - 1)
    .reduce((sum, [, count]) => sum + Number(count || 0), 0);

  return otherCount
    ? [...primaryEntries, ["Other", otherCount]]
    : primaryEntries;
}

function AnalyticsDonut({ data, total, centerLabel }) {
  const normalized = data.filter(([, count]) => Number(count) > 0);
  const chartTotal =
    total || normalized.reduce((sum, [, count]) => sum + Number(count || 0), 0);

  if (!normalized.length || !chartTotal) {
    return <div className="analytics-empty">No data available.</div>;
  }

  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const segments = normalized.map(([label, count], index) => {
    const value = Number(count || 0);
    const fraction = value / chartTotal;
    const dash = Math.max(fraction * circumference, 0);
    const segment = {
      label,
      value,
      percent: fraction * 100,
      color: ANALYTICS_DONUT_COLORS[index % ANALYTICS_DONUT_COLORS.length],
      dash,
      offset,
    };
    offset += dash;
    return segment;
  });

  return (
    <div className="analytics-donut-layout">
      <div className="analytics-donut-figure">
        <svg
          className="analytics-donut-svg"
          viewBox="0 0 120 120"
          role="img"
          aria-label={`${centerLabel} distribution chart`}
        >
          <circle
            className="analytics-donut-track"
            cx="60"
            cy="60"
            r={radius}
          />
          <g transform="rotate(-90 60 60)">
            {segments.map((segment) => (
              <circle
                key={segment.label}
                className="analytics-donut-segment"
                cx="60"
                cy="60"
                r={radius}
                stroke={segment.color}
                strokeDasharray={`${segment.dash} ${circumference - segment.dash}`}
                strokeDashoffset={-segment.offset}
              />
            ))}
          </g>
        </svg>
        <div className="analytics-donut-center">
          <strong>{chartTotal}</strong>
          <span>{centerLabel}</span>
        </div>
      </div>
      <div className="analytics-donut-legend">
        {segments.map((segment) => (
          <div key={segment.label} className="analytics-donut-legend-row">
            <div className="analytics-donut-legend-copy">
              <span
                className="analytics-donut-swatch"
                style={{ backgroundColor: segment.color }}
                aria-hidden="true"
              />
              <span
                className="analytics-donut-legend-label"
                title={segment.label}
              >
                {segment.label}
              </span>
            </div>
            <span className="analytics-donut-legend-value">
              <strong>{segment.value}</strong>
              <span>{segment.percent.toFixed(1)}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatAnalyticsLabel(value) {
  const normalized = `${value || ""}`.trim().replace(/_/g, " ").toLowerCase();
  if (!normalized) return "Unknown";
  return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatAnalyticsMonthLabel(monthKey) {
  const date = new Date(`${monthKey}-01T00:00:00`);
  if (Number.isNaN(date.getTime())) return monthKey;
  return new Intl.DateTimeFormat("en-NG", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function MonthChart({ data }) {
  const max = Math.max(...data.map(([, v]) => v), 1);
  return (
    <div className="analytics-month-chart">
      <div className="analytics-month-bars">
        {data.map(([month, count]) => (
          <div key={month} className="analytics-month-col">
            <span className="analytics-month-count">{count}</span>
            <div className="analytics-month-bar-shell">
              <div
                className="analytics-month-bar"
                style={{ height: `${Math.max((count / max) * 100, 4)}%` }}
              />
            </div>
            <div className="analytics-month-label">
              {formatAnalyticsMonthLabel(month)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(() =>
    normalizePath(window.location.pathname),
  );

  useEffect(() => {
    function onPopState() {
      setCurrentPath(normalizePath(window.location.pathname));
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function navigate(path) {
    window.history.pushState(null, "", path);
    setCurrentPath(normalizePath(path));
  }

  const isAdminRoute =
    currentPath === ADMIN_ROUTE || SUBMISSION_DETAIL_ROUTE_RE.test(currentPath);
  const isGuideRoute = currentPath === GUIDE_ROUTE;
  const submissionDetailMatch = SUBMISSION_DETAIL_ROUTE_RE.exec(currentPath);

  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [validStatuses, setValidStatuses] = useState(DEFAULT_STATUSES);
  const [validChecklistValues, setValidChecklistValues] =
    useState(DEFAULT_CHECK_VALUES);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  const [samplingGuideProducts, setSamplingGuideProducts] = useState([]);
  const [productClassSearch, setProductClassSearch] = useState("");
  const [dosageFormSearch, setDosageFormSearch] = useState("");
  const [openSearchableField, setOpenSearchableField] = useState("");
  const [productSampleAnswers, setProductSampleAnswers] = useState({});
  const [clientFeedback, setClientFeedback] = useState({
    type: "",
    message: "",
  });
  const [submissionReceipt, setSubmissionReceipt] = useState(null);
  const searchableFieldRefs = useRef({});
  const searchableInputRefs = useRef({});

  const [adminToken, setAdminToken] = useState(
    () => window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || "",
  );
  const [adminPassword, setAdminPassword] = useState("");
  const [adminAuthFeedback, setAdminAuthFeedback] = useState({
    type: "",
    message: "",
  });

  const [adminTemplateFilter, setAdminTemplateFilter] = useState("");
  const [adminStatusFilter, setAdminStatusFilter] = useState("");
  const [adminSearchTerm, setAdminSearchTerm] = useState("");
  const [debouncedAdminSearchTerm, setDebouncedAdminSearchTerm] = useState("");
  const [adminReceivedTodayOnly, setAdminReceivedTodayOnly] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [searchSubmissions, setSearchSubmissions] = useState([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [adminFeedback, setAdminFeedback] = useState({ type: "", message: "" });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [checklistSaveState, setChecklistSaveState] = useState("idle"); // idle | saving | saved

  const [adminTab, setAdminTab] = useState("register");
  const [adminReceivedBy, setAdminReceivedBy] = useState("");
  const [adminOfficerProfile, setAdminOfficerProfile] =
    useState(loadAdminProfile);
  const [manifestImportFileNames, setManifestImportFileNames] = useState([]);
  const [manifestImportRows, setManifestImportRows] = useState([]);
  const [manifestImportHeaders, setManifestImportHeaders] = useState([]);
  const [manifestImportFeedback, setManifestImportFeedback] = useState({
    type: "",
    message: "",
  });
  const [isManifestImporting, setIsManifestImporting] = useState(false);
  const [isManifestDragActive, setIsManifestDragActive] = useState(false);
  const [adminSampleReceivedDate, setAdminSampleReceivedDate] = useState("");
  const [adminTakenToLabDate, setAdminTakenToLabDate] = useState("");
  const [adminLabReportReceivedDate, setAdminLabReportReceivedDate] =
    useState("");
  const [adminLabComment, setAdminLabComment] = useState("");
  const [adminQuantity, setAdminQuantity] = useState("");
  const [adminQuickStatus, setAdminQuickStatus] = useState("RECEIVED");
  const [adminRejectionReason, setAdminRejectionReason] = useState("");
  const [analyticsDateMode, setAnalyticsDateMode] = useState("sampling");
  const [analyticsRangeMode, setAnalyticsRangeMode] = useState("all");
  const [analyticsDateFrom, setAnalyticsDateFrom] = useState("");
  const [analyticsDateTo, setAnalyticsDateTo] = useState("");
  const [checklistDraft, setChecklistDraft] = useState({});
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportSelectedCols, setExportSelectedCols] = useState(
    () =>
      new Set(EXPORT_COLUMN_DEFS.filter((c) => c.default).map((c) => c.header)),
  );
  const [detailTab, setDetailTab] = useState("overview");
  const manifestFileInputRef = useRef(null);
  const manifestDragCounterRef = useRef(0);
  const adminDetailRef = useRef(null);
  const todayDateKey = getDateKeyFromValue(new Date());

  const selectedTemplate = useMemo(
    () =>
      templates.find((template) => template.id === selectedTemplateId) || null,
    [templates, selectedTemplateId],
  );
  const publicFormSections = useMemo(
    () => buildPublicFormSections(selectedTemplate?.productSample || []),
    [selectedTemplate],
  );
  const publicWizardSteps = useMemo(() => {
    const sectionSteps = publicFormSections.map((section, index) => ({
      ...section,
      stepType: "section",
      index,
      requiredCount: countRequiredItems(section.items),
      completedRequiredCount: countCompletedRequiredItems(
        section.items,
        productSampleAnswers,
      ),
    }));

    if (!selectedTemplate) {
      return sectionSteps;
    }

    return [
      ...sectionSteps,
      {
        id: "documents_required",
        title: "Documents Required",
        description:
          "Confirm the supporting documents to bring along with the sample.",
        stepType: "documents",
        index: sectionSteps.length,
        items: selectedTemplate.documentsRequired,
        requiredCount: 0,
        completedRequiredCount: 0,
      },
    ];
  }, [publicFormSections, productSampleAnswers, selectedTemplate]);
  const [activePublicStepId, setActivePublicStepId] = useState("");
  const activePublicStepIndex = publicWizardSteps.findIndex(
    (step) => step.id === activePublicStepId,
  );
  const activePublicStep =
    activePublicStepIndex >= 0
      ? publicWizardSteps[activePublicStepIndex]
      : publicWizardSteps[0] || null;
  const completedWizardSections = publicWizardSteps.filter(
    (step) =>
      step.stepType === "section" &&
      step.completedRequiredCount >= step.requiredCount,
  ).length;
  const manifestImportDisplayHeaders = useMemo(
    () => manifestImportHeaders.filter(Boolean),
    [manifestImportHeaders],
  );
  const manifestImportSelectedRows = useMemo(
    () =>
      manifestImportRows.filter(
        (entry) => entry.selected && !entry.imported && !entry.issues.length,
      ),
    [manifestImportRows],
  );
  const manifestImportValidRowCount = useMemo(
    () => manifestImportRows.filter((entry) => !entry.issues.length).length,
    [manifestImportRows],
  );
  const hasImportedManifestRows = useMemo(
    () => manifestImportRows.some((entry) => entry.imported),
    [manifestImportRows],
  );

  const adminRegisterView = useMemo(() => {
    const hasSearch = Boolean(`${debouncedAdminSearchTerm || ""}`.trim());
    const matchedIds = new Set(searchSubmissions.map((entry) => entry.id));
    const baseOrdered = hasSearch
      ? [
          ...searchSubmissions,
          ...submissions.filter((submission) => !matchedIds.has(submission.id)),
        ]
      : submissions;
    const totalPool = adminReceivedTodayOnly
      ? submissions.filter(
          (submission) =>
            getDateKeyFromValue(submission.sampleReceivedDate) === todayDateKey,
        ).length
      : submissions.length;
    const ordered = adminReceivedTodayOnly
      ? baseOrdered.filter(
          (submission) =>
            getDateKeyFromValue(submission.sampleReceivedDate) === todayDateKey,
        )
      : baseOrdered;
    const matchIds = new Set(
      ordered
        .filter((submission) => matchedIds.has(submission.id))
        .map((submission) => submission.id),
    );

    return {
      hasSearch,
      matchIds,
      ordered,
      totalPool,
      matchesCount: matchIds.size,
    };
  }, [
    adminReceivedTodayOnly,
    debouncedAdminSearchTerm,
    searchSubmissions,
    submissions,
    todayDateKey,
  ]);

  useEffect(() => {
    if (!openSearchableField) {
      return undefined;
    }

    function handlePointerDown(event) {
      const fieldNode = searchableFieldRefs.current[openSearchableField];

      if (fieldNode && !fieldNode.contains(event.target)) {
        setOpenSearchableField("");
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [openSearchableField]);

  useEffect(() => {
    if (!openSearchableField) {
      return;
    }

    const input = searchableInputRefs.current[openSearchableField];
    if (input) {
      input.focus();
      input.select();
    }
  }, [openSearchableField]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedAdminSearchTerm(adminSearchTerm.trim());
    }, 250);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [adminSearchTerm]);

  const dosageFormOptions = useMemo(() => {
    const merged = new Set([
      ...samplingGuideProducts.map((product) => product.productType),
      ...COMMON_DOSAGE_FORM_OPTIONS,
    ]);

    return Array.from(merged).sort((left, right) => left.localeCompare(right));
  }, [samplingGuideProducts]);

  const filteredProductClassOptions = useMemo(
    () =>
      filterOptions(
        DRUG_CLASS_OPTIONS,
        productClassSearch,
        `${productSampleAnswers[PRODUCT_CLASS_FIELD_CODE] || ""}`.trim(),
      ),
    [productClassSearch, productSampleAnswers],
  );

  const filteredDosageFormOptions = useMemo(
    () =>
      filterOptions(
        dosageFormOptions,
        dosageFormSearch,
        `${productSampleAnswers[DOSAGE_FORM_FIELD_CODE] || ""}`.trim(),
      ),
    [dosageFormOptions, dosageFormSearch, productSampleAnswers],
  );

  const selectedSamplingGuideProduct = useMemo(
    () =>
      findGuideProductByDosageForm(
        samplingGuideProducts,
        `${productSampleAnswers[DOSAGE_FORM_FIELD_CODE] || ""}`.trim(),
      ),
    [samplingGuideProducts, productSampleAnswers],
  );

  const shelfLifeAssessment = useMemo(
    () => getExpiryAssessment(productSampleAnswers),
    [productSampleAnswers],
  );

  const samplingQuantityAssessment = useMemo(() => {
    const selectedRiskLevel =
      `${productSampleAnswers[RISK_FACTOR_FIELD_CODE] || ""}`
        .trim()
        .toUpperCase();
    const packSizeValue =
      `${productSampleAnswers[PACK_SIZE_FIELD_CODE] || ""}`.trim();
    const dosageFormValue =
      `${productSampleAnswers[DOSAGE_FORM_FIELD_CODE] || ""}`.trim();

    if (!samplingGuideProducts.length) {
      return {
        status: "pending",
        message: "Sampling guide is not available yet.",
        quantity: "",
      };
    }

    if (!dosageFormValue) {
      return {
        status: "pending",
        message: "Select a dosage form to calculate quantity.",
        quantity: "",
      };
    }

    if (!selectedSamplingGuideProduct) {
      return {
        status: "error",
        message: "Selected dosage form is not covered by the sampling guide.",
        quantity: "",
      };
    }

    if (!GUIDE_RISK_OPTIONS.some((item) => item.value === selectedRiskLevel)) {
      return {
        status: "pending",
        message: "Select a risk factor.",
        quantity: "",
      };
    }

    if (!packSizeValue) {
      return {
        status: "pending",
        message: "Enter the pack size to calculate quantity.",
        quantity: "",
      };
    }

    const sourceLabel =
      selectedRiskLevel === "HIGH" ? "total quantity" : "retention quantity";
    const match = findCustomSizeFactorMatch(
      selectedSamplingGuideProduct,
      packSizeValue,
    );

    if (match.error) {
      return {
        status: "error",
        message: match.error,
        quantity: "",
      };
    }

    const baseQuantity = getGuideQuantityForRisk(
      match.referenceEntry,
      selectedRiskLevel,
    );
    const scaledQuantity =
      match.scalingMode === "ratio"
        ? Math.ceil(
            (baseQuantity * match.referenceComparable.value) /
              match.parsedCustom.value,
          )
        : baseQuantity;

    return {
      status: "ok",
      message: `${match.scalingMode === "ratio" ? "Calculated" : "Matched"} from "${
        match.referenceEntry.size
      }" using ${sourceLabel}.`,
      quantity: Math.max(1, scaledQuantity),
    };
  }, [
    productSampleAnswers,
    selectedSamplingGuideProduct,
    samplingGuideProducts,
  ]);

  useEffect(() => {
    let ignore = false;

    async function bootstrap() {
      try {
        const frontendSamplingGuide = await loadFrontendSamplingGuide();
        if (ignore) return;

        if (isGuideRoute) {
          setSamplingGuideProducts(
            normalizeSamplingGuide(frontendSamplingGuide),
          );
          return;
        }

        const response = await apiRequest("/templates");
        if (ignore) return;
        setIsLoadingTemplates(false);

        const normalizedTemplates = Array.isArray(response.templates)
          ? response.templates.map(normalizeTemplate).filter(Boolean)
          : [];

        setTemplates(normalizedTemplates);
        setValidStatuses(
          Array.isArray(response.validStatuses) && response.validStatuses.length
            ? response.validStatuses
            : DEFAULT_STATUSES,
        );
        setValidChecklistValues(
          Array.isArray(response.validChecklistValues) &&
            response.validChecklistValues.length
            ? response.validChecklistValues
            : DEFAULT_CHECK_VALUES,
        );
        setSamplingGuideProducts(
          normalizeSamplingGuide(
            frontendSamplingGuide || response.samplingGuide,
          ),
        );

        if (!normalizedTemplates.length) {
          setIsLoadingTemplates(false);
          setClientFeedback({
            type: "error",
            message: "No templates available.",
          });
          return;
        }

        setSelectedTemplateId(
          (current) => current || normalizedTemplates[0].id,
        );
      } catch (error) {
        if (!ignore) {
          setIsLoadingTemplates(false);
          setClientFeedback({ type: "error", message: error.message });
        }
      }
    }

    void bootstrap();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    setProductSampleAnswers((current) =>
      buildDefaultSampleAnswers(selectedTemplate, current),
    );
  }, [selectedTemplate]);

  useEffect(() => {
    if (!publicWizardSteps.length) {
      setActivePublicStepId("");
      return;
    }

    setActivePublicStepId((current) =>
      publicWizardSteps.some((step) => step.id === current)
        ? current
        : publicWizardSteps[0].id,
    );
  }, [publicWizardSteps]);

  useEffect(() => {
    setProductSampleAnswers((current) => {
      if (!Object.prototype.hasOwnProperty.call(current, QUANTITY_FIELD_CODE)) {
        return current;
      }

      const nextValue =
        samplingQuantityAssessment.status === "ok"
          ? `${samplingQuantityAssessment.quantity}`
          : "";

      if (`${current[QUANTITY_FIELD_CODE] || ""}` === nextValue) {
        return current;
      }

      return {
        ...current,
        [QUANTITY_FIELD_CODE]: nextValue,
      };
    });
  }, [samplingQuantityAssessment.quantity, samplingQuantityAssessment.status]);

  useEffect(() => {
    window.localStorage.setItem(
      ADMIN_PROFILE_STORAGE_KEY,
      JSON.stringify(adminOfficerProfile),
    );
  }, [adminOfficerProfile]);

  useEffect(() => {
    if (!selectedSubmission) {
      setChecklistDraft({});
      setAdminReceivedBy("");
      setAdminSampleReceivedDate("");
      setAdminTakenToLabDate("");
      setAdminLabReportReceivedDate("");
      setAdminLabComment("");
      setAdminQuickStatus("RECEIVED");
      setAdminRejectionReason("");
      return;
    }

    const nextDraft = {};
    for (const item of selectedSubmission.documentsChecklist) {
      nextDraft[item.code] = {
        status: item.status || "PENDING",
        remark: item.remark || "",
      };
    }

    setChecklistDraft(nextDraft);
    setAdminReceivedBy(selectedSubmission.reviewedBy || "");
    setAdminSampleReceivedDate(selectedSubmission.sampleReceivedDate || "");
    setAdminTakenToLabDate(selectedSubmission.takenToLabDate || "");
    setAdminLabReportReceivedDate(
      selectedSubmission.labReportReceivedDate || "",
    );
    setAdminLabComment(selectedSubmission.labComment || "");
    setAdminQuantity(
      `${selectedSubmission.productSampleAnswers?.[QUANTITY_FIELD_CODE] || ""}`.trim(),
    );
    setAdminQuickStatus(
      DEFAULT_STATUSES.includes(selectedSubmission.status)
        ? selectedSubmission.status
        : "RECEIVED",
    );
    setAdminRejectionReason(selectedSubmission.decisionRemark || "");
    setDetailTab("overview");
  }, [selectedSubmission]);

  useEffect(() => {
    if (!isAdminRoute || !adminToken) {
      return;
    }

    void refreshSubmissions(selectedSubmissionId);
  }, [
    isAdminRoute,
    adminToken,
    adminTemplateFilter,
    adminStatusFilter,
    debouncedAdminSearchTerm,
  ]);

  useEffect(() => {
    if (!adminToken || !submissionDetailMatch) {
      return;
    }
    const idFromUrl = submissionDetailMatch[1];
    if (idFromUrl && idFromUrl !== selectedSubmissionId) {
      void loadSubmissionDetail(idFromUrl);
    }
  }, [adminToken, submissionDetailMatch?.[1]]);

  function clearAdminSession(message = "") {
    window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    setAdminToken("");
    setSubmissions([]);
    setSearchSubmissions([]);
    setAdminReceivedTodayOnly(true);
    setAnalyticsDateMode("sampling");
    setAnalyticsRangeMode("all");
    setAnalyticsDateFrom("");
    setAnalyticsDateTo("");
    setSelectedSubmissionId("");
    setSelectedSubmission(null);
    setAdminReceivedBy("");
    setAdminSampleReceivedDate("");
    setAdminTakenToLabDate("");
    setAdminLabReportReceivedDate("");
    setAdminLabComment("");
    setAdminQuickStatus("RECEIVED");
    setAdminRejectionReason("");
    setChecklistDraft({});
    setManifestImportFileName("");
    setManifestImportRows([]);
    setManifestImportHeaders([]);
    setManifestImportFeedback({ type: "", message: "" });
    setAdminSearchTerm("");
    setDebouncedAdminSearchTerm("");

    if (message) {
      setAdminAuthFeedback({ type: "error", message });
    }
  }

  async function adminApiRequest(path, options = {}) {
    if (!adminToken) {
      throw new Error("Admin session is not active.");
    }

    try {
      return await apiRequest(path, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${adminToken}`,
        },
      });
    } catch (error) {
      if (isAuthErrorMessage(error.message)) {
        clearAdminSession("Session expired. Please sign in again.");
      }
      throw error;
    }
  }

  async function refreshSubmissions(
    preferredSelectionId = selectedSubmissionId,
    searchOverride = debouncedAdminSearchTerm,
  ) {
    if (!adminToken) {
      return;
    }

    try {
      setIsRefreshing(true);
      const activeSearchTerm = `${searchOverride || ""}`.trim();

      const baseParams = new URLSearchParams();
      if (adminTemplateFilter) {
        baseParams.set("templateId", adminTemplateFilter);
      }
      if (adminStatusFilter) {
        baseParams.set("status", adminStatusFilter);
      }

      const fullPath = baseParams.toString()
        ? `/submissions?${baseParams.toString()}`
        : "/submissions";
      const fullResponse = await adminApiRequest(fullPath);
      const rows = Array.isArray(fullResponse.submissions)
        ? fullResponse.submissions.map(normalizeSubmission).filter(Boolean)
        : [];

      setSubmissions(rows);

      let searchRows = [];
      if (activeSearchTerm) {
        const searchParams = new URLSearchParams(baseParams);
        searchParams.set("q", activeSearchTerm);
        const searchPath = `/submissions?${searchParams.toString()}`;
        const searchResponse = await adminApiRequest(searchPath);
        searchRows = Array.isArray(searchResponse.submissions)
          ? searchResponse.submissions.map(normalizeSubmission).filter(Boolean)
          : [];
        setSearchSubmissions(searchRows);
      } else {
        setSearchSubmissions([]);
      }

      const availableIds = new Set(
        [...rows, ...searchRows].map((entry) => entry.id).filter(Boolean),
      );

      if (preferredSelectionId && availableIds.has(preferredSelectionId)) {
        await loadSubmissionDetail(preferredSelectionId);
      } else if (!submissionDetailMatch) {
        setSelectedSubmissionId("");
        setSelectedSubmission(null);
      }
    } catch (error) {
      setAdminFeedback({ type: "error", message: error.message });
    } finally {
      setIsRefreshing(false);
    }
  }

  async function loadSubmissionDetail(id) {
    try {
      setIsLoadingDetail(true);
      const response = await adminApiRequest(`/submissions/${id}`);
      const submission = normalizeSubmission(response.submission);
      setSelectedSubmissionId(submission?.id || "");
      setSelectedSubmission(submission);
    } catch (error) {
      setSelectedSubmission(null);
      setAdminFeedback({ type: "error", message: error.message });
    } finally {
      setIsLoadingDetail(false);
    }
  }

  async function handleAdminSubmissionSelect(id) {
    navigate(`/admin/submissions/${id}`);
    await loadSubmissionDetail(id);
  }

  async function handleClientSubmit(event) {
    event.preventDefault();

    if (!selectedTemplate) {
      setClientFeedback({ type: "error", message: "Template not found." });
      return;
    }

    const payloadAnswers = {};
    for (const item of selectedTemplate.productSample) {
      payloadAnswers[item.code] =
        `${productSampleAnswers[item.code] || ""}`.trim();
    }

    const submissionShelfLifeAssessment = getExpiryAssessment(payloadAnswers);
    if (submissionShelfLifeAssessment.status !== "ok") {
      setClientFeedback({
        type: "error",
        message: submissionShelfLifeAssessment.message,
      });
      return;
    }

    if (samplingQuantityAssessment.status !== "ok") {
      setClientFeedback({
        type: "error",
        message:
          samplingQuantityAssessment.message ||
          "Complete dosage form, pack size, and risk factor to calculate quantity.",
      });
      return;
    }

    const payload = {
      templateId: selectedTemplate.templateId || selectedTemplate.id,
      applicantName:
        `${payloadAnswers["applicant_name"] || payloadAnswers[DISTRIBUTOR_FIELD_CODE] || payloadAnswers[SOURCE_FIELD_CODE] || ""}`.trim() ||
        `${payloadAnswers[BRAND_NAME_FIELD_CODE] || ""}`.trim(),
      applicantPhone: `${payloadAnswers["applicant_phone"] || ""}`.trim(),
      applicantEmail: `${payloadAnswers["applicant_email"] || ""}`.trim(),
      productName:
        `${payloadAnswers[BRAND_NAME_FIELD_CODE] || ""}`.trim() ||
        `${payloadAnswers[GENERIC_NAME_FIELD_CODE] || ""}`.trim(),
      productSampleAnswers: payloadAnswers,
    };

    try {
      setClientFeedback({ type: "", message: "Submitting form..." });
      const response = await apiRequest("/submissions", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const sub = response.submission;
      setSubmissionReceipt({
        trackingNumber: sub.trackingNumber,
        productName: `${payloadAnswers[BRAND_NAME_FIELD_CODE] || ""}`.trim() || `${payloadAnswers[GENERIC_NAME_FIELD_CODE] || ""}`.trim() || sub.productName || "",
        genericName: `${payloadAnswers[GENERIC_NAME_FIELD_CODE] || ""}`.trim(),
        batchNumber: `${payloadAnswers[BATCH_NUMBER_FIELD_CODE] || ""}`.trim(),
        applicantName: sub.applicantName || "",
        templateLabel: TEMPLATE_LABELS[selectedTemplate.templateId || selectedTemplate.id] || selectedTemplate.title || "",
        submittedAt: sub.clientSubmittedAt || new Date().toISOString(),
      });
      setClientFeedback({ type: "", message: "" });
      setProductClassSearch("");
      setDosageFormSearch("");
      setProductSampleAnswers(buildDefaultSampleAnswers(selectedTemplate));
      setActivePublicStepId(publicWizardSteps[0]?.id || "");
    } catch (error) {
      setClientFeedback({ type: "error", message: error.message });
    }
  }

  function handlePublicFormSubmit(event) {
    if (!activePublicStep || activePublicStep.stepType === "documents") {
      void handleClientSubmit(event);
      return;
    }

    event.preventDefault();

    const nextStep = publicWizardSteps[activePublicStepIndex + 1];
    if (nextStep) {
      setActivePublicStepId(nextStep.id);
    }
  }

  function handleSampleAnswerChange(code, value) {
    setProductSampleAnswers((current) => ({
      ...current,
      [code]: value,
    }));
  }

  async function handleAdminLogin(event) {
    event.preventDefault();

    const password = adminPassword.trim();
    if (!password) {
      setAdminAuthFeedback({
        type: "error",
        message: "Admin password is required.",
      });
      return;
    }

    try {
      setAdminAuthFeedback({ type: "", message: "Signing in..." });
      const response = await apiRequest("/admin/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      });

      if (!response.token) {
        throw new Error("Admin login response did not include a token");
      }

      window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, response.token);
      setAdminToken(response.token);
      setAdminPassword("");
      setAdminAuthFeedback({ type: "ok", message: "Signed in." });
      setAdminFeedback({ type: "", message: "" });
      await refreshSubmissions("", adminSearchTerm.trim());
    } catch (error) {
      setAdminAuthFeedback({ type: "error", message: error.message });
    }
  }

  function handleAdminLogout() {
    clearAdminSession();
    setAdminAuthFeedback({ type: "", message: "" });
  }

  function handleAdminOfficerProfileChange(field, value) {
    setAdminOfficerProfile((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleChecklistSave() {
    if (!selectedSubmission || !selectedSubmission.templateSnapshot) {
      return;
    }

    const normalizedStatus = DEFAULT_STATUSES.includes(adminQuickStatus)
      ? adminQuickStatus
      : "RECEIVED";
    const rejectionReason = adminRejectionReason.trim();

    if (normalizedStatus === "REJECTED" && !rejectionReason) {
      setAdminFeedback({
        type: "error",
        message: "Rejection reason is required when status is Rejected.",
      });
      return;
    }

    const checklist = selectedSubmission.templateSnapshot.documentsRequired.map(
      (item) => ({
        code: item.code,
        status: checklistDraft[item.code]?.status || "PENDING",
        remark: `${checklistDraft[item.code]?.remark || ""}`.trim(),
      }),
    );

    try {
      setChecklistSaveState("saving");
      setAdminFeedback({ type: "", message: "Saving checklist..." });
      await adminApiRequest(`/submissions/${selectedSubmission.id}/documents`, {
        method: "PATCH",
        body: JSON.stringify({
          checklist,
          reviewedBy: adminReceivedBy.trim(),
          officerName: adminOfficerProfile.officerName.trim(),
          officerDesignation: adminOfficerProfile.officerDesignation.trim(),
          officerPhone: adminOfficerProfile.officerPhone.trim(),
          officerEmail: adminOfficerProfile.officerEmail.trim(),
          sampleReceivedDate: adminSampleReceivedDate,
          takenToLabDate: adminTakenToLabDate,
          labReportReceivedDate: adminLabReportReceivedDate,
          labComment: adminLabComment.trim(),
          quantityOverride: adminQuantity.trim(),
          status: normalizedStatus,
          decisionRemark:
            normalizedStatus === "REJECTED" ? rejectionReason : "",
        }),
      });

      setChecklistSaveState("saved");
      setAdminFeedback({ type: "ok", message: "Checklist saved." });
      setTimeout(() => setChecklistSaveState("idle"), 2500);
      await refreshSubmissions(selectedSubmission.id);
    } catch (error) {
      setChecklistSaveState("idle");
      setAdminFeedback({ type: "error", message: error.message });
    }
  }

  async function handlePrintExport() {
    if (!selectedSubmission) {
      return;
    }

    try {
      const response = await adminApiRequest(
        `/submissions/${selectedSubmission.id}/export`,
      );
      const template = normalizeTemplate(response.template);
      const submission = normalizeSubmission(response.submission);

      if (!template || !submission) {
        throw new Error("Invalid export payload");
      }

      openPrintWindow(template, submission);
    } catch (error) {
      setAdminFeedback({ type: "error", message: error.message });
    }
  }

  async function handleExportProductsExcel(rows) {
    try {
      const XLSX = await loadXlsxLibrary();
      const data = rows.map((s, i) => ({
        "S/N": i + 1,
        "Brand Name": s.productName || s.productSampleAnswers?.brand_name || "",
        "Generic Name":
          s.genericName || s.productSampleAnswers?.generic_name || "",
        Manufacturer:
          s.manufacturer || s.productSampleAnswers?.manufacturer || "",
        Distributor: s.distributor || s.productSampleAnswers?.distributor || "",
        "Reason for Analysis":
          s.reasonForAnalysis ||
          s.productSampleAnswers?.reason_for_analysis ||
          "",
        Status: toStatusLabel(s.status),
        "Date Received": s.sampleReceivedDate || formatDate(s.createdAt),
        "NAFDAC No.": s.nafdacNumber || "",
        "Tracking No.": s.trackingNumber || "",
        "Batch No.": s.batchNumber || "",
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Products");
      XLSX.writeFile(
        wb,
        `products-register-${new Date().toISOString().slice(0, 10)}.xlsx`,
      );
    } catch (error) {
      setAdminFeedback({ type: "error", message: error.message });
    }
  }

  async function handleExportAllExcel() {
    if (!adminToken) {
      setAdminFeedback({
        type: "error",
        message: "Admin session is not active.",
      });
      return;
    }
    setExportModalOpen(true);
  }

  async function handleExportModalConfirm() {
    setExportModalOpen(false);
    try {
      setAdminFeedback({ type: "", message: "Preparing Excel export..." });
      const XLSX = await loadXlsxLibrary();

      const response = await adminApiRequest("/submissions");
      const allSubmissions = response.submissions || [];

      const activeCols = EXPORT_COLUMN_DEFS.filter((c) =>
        exportSelectedCols.has(c.header),
      );

      const rows = allSubmissions.map((s) => {
        const answers = s.productSampleAnswers || {};
        const row = {};
        for (const col of activeCols) {
          row[col.header] =
            col.type === "answer"
              ? `${answers[col.key] || ""}`.trim()
              : col.key === "status"
                ? toStatusLabel(s[col.key] || "")
                : `${s[col.key] || ""}`.trim();
        }
        return row;
      });

      const ws = XLSX.utils.json_to_sheet(
        rows.length
          ? rows
          : [Object.fromEntries(activeCols.map((c) => [c.header, ""]))],
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Manifest");
      XLSX.writeFile(
        wb,
        `samples-manifest-${new Date().toISOString().slice(0, 10)}.xlsx`,
      );
      setAdminFeedback({ type: "ok", message: "Excel export downloaded." });
    } catch (error) {
      setAdminFeedback({ type: "error", message: error.message });
    }
  }

  function resetManifestImportState() {
    setManifestImportFileNames([]);
    setManifestImportRows([]);
    setManifestImportHeaders([]);
    setManifestImportFeedback({ type: "", message: "" });
    setIsManifestDragActive(false);
    manifestDragCounterRef.current = 0;

    if (manifestFileInputRef.current) {
      manifestFileInputRef.current.value = "";
    }
  }

  async function loadManifestWorkbookFile(file) {
    if (!file) return;

    try {
      setManifestImportFeedback({
        type: "",
        message: `Parsing ${file.name}...`,
      });
      const parsed = await parseManifestWorkbook(file);
      const entries = parsed.rows.map((row, index) => ({
        id: `${file.name}-${index + 2}`,
        rowNumber: index + 2,
        fileName: file.name,
        values: row,
        issues: validateManifestImportRow(row),
        selected: false,
        imported: false,
      }));

      setManifestImportFileNames((current) =>
        current.includes(file.name) ? current : [...current, file.name],
      );
      setManifestImportHeaders((current) =>
        current.length ? current : parsed.headers,
      );
      setManifestImportRows((current) => [...current, ...entries]);
      setManifestImportFeedback({
        type: "ok",
        message: `Parsed ${parsed.rows.length} row${parsed.rows.length === 1 ? "" : "s"} from ${file.name}.`,
      });
    } catch (error) {
      setManifestImportFeedback({
        type: "error",
        message: `${file.name}: ${error.message}`,
      });
    } finally {
      setIsManifestDragActive(false);
      manifestDragCounterRef.current = 0;
      if (manifestFileInputRef.current) {
        manifestFileInputRef.current.value = "";
      }
    }
  }

  async function loadManifestFiles(files) {
    for (const file of Array.from(files)) {
      await loadManifestWorkbookFile(file);
    }
  }

  async function handleManifestFileChange(event) {
    await loadManifestFiles(event.target.files);
  }

  function handleManifestDragEnter(event) {
    event.preventDefault();
    event.stopPropagation();
    manifestDragCounterRef.current += 1;
    setIsManifestDragActive(true);
  }

  function handleManifestDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
    setIsManifestDragActive(true);
  }

  function handleManifestDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    manifestDragCounterRef.current = Math.max(
      manifestDragCounterRef.current - 1,
      0,
    );

    if (!manifestDragCounterRef.current) {
      setIsManifestDragActive(false);
    }
  }

  async function handleManifestDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    setIsManifestDragActive(false);
    manifestDragCounterRef.current = 0;

    await loadManifestFiles(event.dataTransfer.files);
  }

  function openManifestPicker() {
    manifestFileInputRef.current?.click();
  }

  async function handleManifestImport() {
    if (!manifestImportRows.length) {
      setManifestImportFeedback({
        type: "error",
        message: "Choose a manifest workbook and parse it before importing.",
      });
      return;
    }

    if (!manifestImportSelectedRows.length) {
      setManifestImportFeedback({
        type: "error",
        message: "Tick at least one valid manifest row to import.",
      });
      return;
    }

    try {
      setIsManifestImporting(true);
      setManifestImportFeedback({
        type: "",
        message: `Importing ${manifestImportSelectedRows.length} selected manifest row${
          manifestImportSelectedRows.length === 1 ? "" : "s"
        }...`,
      });
      const response = await adminApiRequest("/submissions/import/manifest", {
        method: "POST",
        body: JSON.stringify({
          fileName: manifestImportFileNames.join(", "),
          rows: manifestImportSelectedRows.map((entry) => entry.values),
        }),
      });

      const importedIds = new Set(
        manifestImportSelectedRows.map((entry) => entry.id),
      );
      setManifestImportRows((current) =>
        current.map((entry) =>
          importedIds.has(entry.id)
            ? {
                ...entry,
                imported: true,
                selected: false,
              }
            : entry,
        ),
      );
      setManifestImportFeedback({
        type: "ok",
        message: `Imported ${response.importedCount || manifestImportSelectedRows.length} manifest row${
          (response.importedCount || manifestImportSelectedRows.length) === 1
            ? ""
            : "s"
        }${response.skippedCount ? ` (${response.skippedCount} skipped — duplicate batch numbers)` : ""}.`,
      });
      await refreshSubmissions(selectedSubmissionId);
    } catch (error) {
      setManifestImportFeedback({ type: "error", message: error.message });
    } finally {
      setIsManifestImporting(false);
    }
  }

  function toggleManifestRowSelection(rowId, selected) {
    setManifestImportRows((current) =>
      current.map((entry) =>
        entry.id === rowId
          ? {
              ...entry,
              selected,
            }
          : entry,
      ),
    );
  }

  function setManifestSelection(mode) {
    setManifestImportRows((current) =>
      current.map((entry) => {
        const canSelect = !entry.issues.length && !entry.imported;
        const nextSelected =
          mode === "all"
            ? canSelect
            : mode === "none"
              ? false
              : canSelect && !entry.imported;

        return {
          ...entry,
          selected: nextSelected,
        };
      }),
    );
  }

  function renderSearchableSelectInput({
    value,
    onChange,
    searchValue,
    onSearchChange,
    options,
    fieldLabel,
    fieldKey,
    selectPlaceholder,
    emptyLabel,
  }) {
    const isOpen = openSearchableField === fieldKey;
    const visibleValue = isOpen ? searchValue : value;

    function openAutocomplete() {
      setOpenSearchableField(fieldKey);
      onSearchChange(value || "");
    }

    return (
      <div
        className={`searchable-select ${isOpen ? "is-open" : ""}`.trim()}
        ref={(node) => {
          if (node) {
            searchableFieldRefs.current[fieldKey] = node;
          } else {
            delete searchableFieldRefs.current[fieldKey];
          }
        }}
      >
        <div className="searchable-select-input-wrap">
          <input
            ref={(node) => {
              if (node) {
                searchableInputRefs.current[fieldKey] = node;
              } else {
                delete searchableInputRefs.current[fieldKey];
              }
            }}
            type="text"
            className="searchable-select-input"
            value={visibleValue}
            onFocus={openAutocomplete}
            onChange={(event) => {
              const nextValue = event.target.value;
              setOpenSearchableField(fieldKey);
              onSearchChange(nextValue);

              if (!nextValue.trim()) {
                onChange("");
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                setOpenSearchableField("");
                onSearchChange("");
              }

              if (event.key === "Enter") {
                const firstOption = options[0];
                if (firstOption) {
                  event.preventDefault();
                  onChange(firstOption);
                  onSearchChange("");
                  setOpenSearchableField("");
                }
              }
            }}
            placeholder={selectPlaceholder}
            autoComplete="off"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-label={fieldLabel}
          />
          <button
            type="button"
            className="searchable-select-toggle"
            aria-label={
              isOpen
                ? `Close ${fieldLabel} suggestions`
                : `Open ${fieldLabel} suggestions`
            }
            onClick={() => {
              if (isOpen) {
                setOpenSearchableField("");
                onSearchChange("");
                return;
              }

              openAutocomplete();
            }}
          >
            {isOpen ? "▲" : "▼"}
          </button>
        </div>

        {isOpen ? (
          <div className="searchable-select-panel">
            <div className="searchable-select-panel-head">
              <span className="field-hint">
                {options.length
                  ? `Showing ${options.length} matching option${options.length === 1 ? "" : "s"}.`
                  : emptyLabel}
              </span>
            </div>

            <div
              className="searchable-select-options"
              role="listbox"
              aria-label={fieldLabel}
            >
              {options.length ? (
                options.map((option) => {
                  const isSelected = value === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      className={`searchable-select-option ${
                        isSelected ? "is-selected" : ""
                      }`.trim()}
                      onClick={() => {
                        onChange(option);
                        onSearchChange("");
                        setOpenSearchableField("");
                      }}
                    >
                      <span>{option}</span>
                      {isSelected ? <strong>Selected</strong> : null}
                    </button>
                  );
                })
              ) : (
                <div className="searchable-select-empty">{emptyLabel}</div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  function renderSampleInput(item) {
    const value = productSampleAnswers[item.code] || "";

    if (item.code === PRODUCT_CLASS_FIELD_CODE) {
      return renderSearchableSelectInput({
        value,
        onChange: (nextValue) => handleSampleAnswerChange(item.code, nextValue),
        searchValue: productClassSearch,
        onSearchChange: setProductClassSearch,
        options: filteredProductClassOptions,
        fieldLabel: item.label,
        fieldKey: item.code,
        selectPlaceholder: "Select product class",
        emptyLabel: "No product class matches the current search.",
      });
    }

    if (item.code === DOSAGE_FORM_FIELD_CODE) {
      return renderSearchableSelectInput({
        value,
        onChange: (nextValue) => handleSampleAnswerChange(item.code, nextValue),
        searchValue: dosageFormSearch,
        onSearchChange: setDosageFormSearch,
        options: filteredDosageFormOptions,
        fieldLabel: item.label,
        fieldKey: item.code,
        selectPlaceholder: "Select dosage form",
        emptyLabel: "No dosage form matches the current search.",
      });
    }

    if (item.code === RISK_FACTOR_FIELD_CODE) {
      return (
        <div
          className="risk-radio-group"
          role="radiogroup"
          aria-label={item.label}
        >
          {GUIDE_RISK_OPTIONS.map((option) => (
            <label key={option.value} className="risk-radio-option">
              <input
                type="radio"
                name={item.code}
                value={option.value}
                checked={value === option.value}
                onChange={(event) =>
                  handleSampleAnswerChange(item.code, event.target.value)
                }
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      );
    }

    if (item.code === QUANTITY_FIELD_CODE) {
      return (
        <div className="auto-quantity-field">
          <input
            required={Boolean(item.required)}
            type="number"
            min="1"
            readOnly
            value={value}
            aria-label={item.label}
          />
          <span className="field-hint">
            Auto-calculated from dosage form, pack size, and risk factor.
          </span>
        </div>
      );
    }

    if (item.code === PACK_SIZE_FIELD_CODE) {
      return (
        <div className="auto-quantity-field">
          <input
            required={Boolean(item.required)}
            type="text"
            value={value}
            onChange={(event) =>
              handleSampleAnswerChange(item.code, event.target.value)
            }
            placeholder='Example: "1 x 10 tabs" or "20 ml"'
            aria-label={item.label}
          />
          <span className="field-hint">
            Enter the pack size exactly as supplied so the sampling guide can
            calculate quantity.
          </span>
        </div>
      );
    }

    if (item.inputType === "textarea") {
      return (
        <textarea
          required={Boolean(item.required)}
          readOnly={Boolean(item.readOnly)}
          value={value}
          onChange={(event) =>
            handleSampleAnswerChange(item.code, event.target.value)
          }
          aria-label={item.label}
        />
      );
    }

    return (
      <input
        required={Boolean(item.required)}
        readOnly={Boolean(item.readOnly)}
        type={item.inputType === "number" ? "number" : item.inputType || "text"}
        value={value}
        onChange={(event) =>
          handleSampleAnswerChange(item.code, event.target.value)
        }
        aria-label={item.label}
      />
    );
  }

  function renderPublicField(item) {
    return (
      <div
        key={item.code}
        className={`form-field ${isWidePublicField(item.code) ? "form-field-wide" : ""}`.trim()}
      >
        <div className="form-field-label">
          {item.label}
          {item.required ? (
            <span className="form-field-required"> *</span>
          ) : null}
        </div>
        <div className="form-field-control">{renderSampleInput(item)}</div>
      </div>
    );
  }

  function renderActivePublicStep() {
    if (!activePublicStep) {
      return null;
    }

    if (activePublicStep.stepType === "documents") {
      return (
        <section className="form-section form-section-muted wizard-stage-card">
          <div className="form-section-head">
            <div className="form-section-title-group">
              <span className="form-section-index">D</span>
              <div>
                <div className="form-section-meta">
                  {selectedTemplate?.documentsRequired.length || 0} item
                  {(selectedTemplate?.documentsRequired.length || 0) === 1
                    ? ""
                    : "s"}
                </div>
                <h3>Documents Required</h3>
              </div>
            </div>
            <div className="form-section-copy">
              <p className="muted-text">
                Bring these along for verification at submission. Admin will
                validate them after the sample is received.
              </p>
            </div>
          </div>
          <div className="documents-preview-list">
            {(selectedTemplate?.documentsRequired || []).map((item) => (
              <article key={item.code} className="document-preview-card">
                <div className="document-preview-index">
                  {item.serialNumber}
                </div>
                <div>
                  <h4>{item.label}</h4>
                  <p>Verified by admin after the sample is received.</p>
                </div>
              </article>
            ))}
          </div>
          {shelfLifeAssessment.status === "error" ? (
            <div className="form-intro-note" role="alert">
              {shelfLifeAssessment.message}
            </div>
          ) : null}
        </section>
      );
    }

    return (
      <section className="form-section wizard-stage-card">
        <div className="form-section-head">
          <div className="form-section-title-group">
            <span className="form-section-index">
              {activePublicStep.index + 1}
            </span>
            <div>
              <div className="form-section-meta">
                {activePublicStep.items.length} field
                {activePublicStep.items.length === 1 ? "" : "s"}
              </div>
              <h3>{activePublicStep.title}</h3>
            </div>
          </div>
          <div className="form-section-copy">
            <p className="muted-text">{activePublicStep.description}</p>
          </div>
        </div>
        <div className="field-grid">
          {activePublicStep.items.map((item) => renderPublicField(item))}
        </div>
        {activePublicStep.id === "batch_and_packaging" ? (
          <div className="form-insights-grid">
            <div
              className={`sampling-result sampling-${samplingQuantityAssessment.status}`}
              aria-live="polite"
            >
              <p>
                <strong>Calculated Quantity:</strong>{" "}
                {samplingQuantityAssessment.quantity
                  ? samplingQuantityAssessment.quantity
                  : "Not calculated yet"}
              </p>
              <p>{samplingQuantityAssessment.message}</p>
            </div>
          </div>
        ) : null}
        {activePublicStep.id === "manufacture_and_source" ? (
          <div className="form-insights-grid">
            <div
              className={`expiry-calculation expiry-${shelfLifeAssessment.status}`}
              aria-live="polite"
            >
              <p>
                <strong>Expiry Check:</strong> {shelfLifeAssessment.message}
              </p>
              {shelfLifeAssessment.remainingLabel ? (
                <p>
                  <strong>Time Remaining:</strong>{" "}
                  {shelfLifeAssessment.remainingLabel}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </section>
    );
  }

  function renderPublicContent() {
    if (submissionReceipt) {
      return (
        <section className="mode-panel">
          <div className="receipt-shell">
            <div className="receipt-card" id="submission-receipt">
              <div className="receipt-header">
                <img className="receipt-logo" src="/nafdac-logo.webp" alt="NAFDAC Logo" />
                <div>
                  <div className="receipt-org">Drugs NRA — Sample Submission</div>
                  <div className="receipt-title">Submission Receipt</div>
                </div>
              </div>
              <div className="receipt-tracking-block">
                <div className="receipt-tracking-label">Tracking Number</div>
                <div className="receipt-tracking-number">{submissionReceipt.trackingNumber}</div>
                <div className="receipt-tracking-note">Keep this number for all follow-up enquiries</div>
              </div>
              <div className="receipt-details">
                {[
                  ["Submission Type",  submissionReceipt.templateLabel],
                  ["Product Name",     submissionReceipt.productName],
                  ["Generic Name",     submissionReceipt.genericName || "—"],
                  ["Batch Number",     submissionReceipt.batchNumber || "—"],
                  ["Applicant",        submissionReceipt.applicantName],
                  ["Date Submitted",   formatDate(submissionReceipt.submittedAt)],
                ].map(([label, value]) => (
                  <div key={label} className="receipt-row">
                    <span className="receipt-row-label">{label}</span>
                    <span className="receipt-row-value">{value}</span>
                  </div>
                ))}
              </div>
              <div className="receipt-footer">
                This receipt was generated automatically. Please save or print it for your records.
              </div>
            </div>
            <div className="receipt-actions">
              <button
                className="primary-button"
                type="button"
                onClick={() => window.print()}
              >
                Save / Print Receipt
              </button>
              <button
                className="ghost-button"
                type="button"
                onClick={() => setSubmissionReceipt(null)}
              >
                Submit Another
              </button>
            </div>
          </div>
        </section>
      );
    }

    const requiredFieldCount = countRequiredItems(
      selectedTemplate?.productSample || [],
    );

    if (isLoadingTemplates) {
      return (
        <section className="mode-panel">
          <div className="panel-card">
            <div className="skeleton-shell">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line skeleton-line-short" />
              <div className="skeleton-field-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton-field">
                    <div className="skeleton skeleton-label" />
                    <div className="skeleton skeleton-input" />
                  </div>
                ))}
              </div>
              <div className="skeleton skeleton-button" />
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="mode-panel">
        <div className="panel-card">
          <div className="panel-head">
            <h2>Client Submission</h2>
            <div className="template-selector">
              <label className="inline-label" htmlFor="template-select">
                Form Type
                <select
                  id="template-select"
                  className="template-selector-select"
                  value={selectedTemplateId}
                  onChange={(event) =>
                    setSelectedTemplateId(event.target.value)
                  }
                >
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {getTemplateDisplayName(template)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="notice-banner" role="note">
            <span className="notice-icon" aria-hidden="true">
              ⚠
            </span>
            <strong>Submission Notice:</strong> Dossiers must be submitted in
            flash, not CD.
          </div>

          {selectedTemplate ? (
            <>
              <div className="template-preview">
                <div className="template-preview-grid">
                  <div>
                    <span className="template-preview-label">Annexure</span>
                    <strong>{selectedTemplate.annexure}</strong>
                  </div>
                  <div>
                    <span className="template-preview-label">SOP Ref.</span>
                    <strong>{selectedTemplate.sopRef}</strong>
                  </div>
                  <div>
                    <span className="template-preview-label">Title</span>
                    <strong>{selectedTemplate.title}</strong>
                  </div>
                  <div>
                    <span className="template-preview-label">Directorate</span>
                    <strong>{selectedTemplate.directorate}</strong>
                  </div>
                </div>
              </div>

              <form className="wizard-shell" onSubmit={handlePublicFormSubmit}>
                <div className="wizard-overview">
                  <div className="wizard-overview-copy">
                    <strong>Sampling Intake Wizard</strong>
                    <span>
                      Complete the form one stage at a time. Quantity and expiry
                      checks update as you move through the intake.
                    </span>
                  </div>
                  <div className="wizard-metrics">
                    <article className="wizard-metric">
                      <span>Form</span>
                      <strong>
                        {getTemplateDisplayName(selectedTemplate)}
                      </strong>
                    </article>
                    <article className="wizard-metric">
                      <span>Required Fields</span>
                      <strong>{requiredFieldCount}</strong>
                    </article>
                    <article className="wizard-metric">
                      <span>Sections Done</span>
                      <strong>
                        {completedWizardSections}/{publicFormSections.length}
                      </strong>
                    </article>
                    <article className="wizard-metric">
                      <span>Expiry Rule</span>
                      <strong>6 months minimum</strong>
                    </article>
                  </div>
                </div>

                <div className="wizard-layout">
                  <aside className="wizard-sidebar">
                    <div className="wizard-sidebar-card">
                      <div className="wizard-sidebar-head">
                        <span className="wizard-sidebar-label">Progress</span>
                        <strong>
                          {activePublicStepIndex >= 0
                            ? activePublicStepIndex + 1
                            : 0}
                          /{publicWizardSteps.length}
                        </strong>
                      </div>
                      <div className="wizard-progress-track" aria-hidden="true">
                        <span
                          className="wizard-progress-fill"
                          style={{
                            width: `${
                              publicWizardSteps.length
                                ? (((activePublicStepIndex >= 0
                                    ? activePublicStepIndex
                                    : 0) +
                                    1) /
                                    publicWizardSteps.length) *
                                  100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                      <div className="wizard-step-list">
                        {publicWizardSteps.map((step, index) => {
                          const isActive = activePublicStep?.id === step.id;
                          const isComplete =
                            step.stepType === "documents" ||
                            step.completedRequiredCount >= step.requiredCount;

                          return (
                            <button
                              key={step.id}
                              type="button"
                              className={`wizard-step-button ${
                                isActive ? "is-active" : ""
                              } ${isComplete ? "is-complete" : ""}`.trim()}
                              onClick={() => setActivePublicStepId(step.id)}
                            >
                              <span className="wizard-step-badge">
                                {step.stepType === "documents"
                                  ? "D"
                                  : index + 1}
                              </span>
                              <span className="wizard-step-copy">
                                <strong>{step.title}</strong>
                                <small>
                                  {step.stepType === "documents"
                                    ? `${selectedTemplate.documentsRequired.length} document${
                                        selectedTemplate.documentsRequired
                                          .length === 1
                                          ? ""
                                          : "s"
                                      }`
                                    : `${step.completedRequiredCount}/${step.requiredCount} required complete`}
                                </small>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </aside>

                  <div className="wizard-stage">
                    <div className="wizard-stage-header">
                      <div>
                        <span className="wizard-stage-label">
                          {activePublicStep?.stepType === "documents"
                            ? "Final Stage"
                            : `Stage ${activePublicStepIndex + 1}`}
                        </span>
                        <h3>{activePublicStep?.title}</h3>
                      </div>
                      <div className="wizard-stage-meta">
                        {activePublicStep?.stepType === "documents" ? (
                          <strong>Bring all required documents</strong>
                        ) : (
                          <strong>
                            {activePublicStep?.completedRequiredCount || 0}/
                            {activePublicStep?.requiredCount || 0} required
                            fields completed
                          </strong>
                        )}
                      </div>
                    </div>

                    {renderActivePublicStep()}

                    <div className="wizard-actions">
                      <button
                        className="ghost-button"
                        type="button"
                        disabled={activePublicStepIndex <= 0}
                        onClick={() => {
                          const previousStep =
                            publicWizardSteps[activePublicStepIndex - 1];
                          if (previousStep) {
                            setActivePublicStepId(previousStep.id);
                          }
                        }}
                      >
                        Previous
                      </button>
                      {activePublicStep?.stepType === "documents" ? (
                        <button
                          className="primary-button"
                          type="submit"
                          disabled={shelfLifeAssessment.status !== "ok"}
                        >
                          Submit Sample Form
                        </button>
                      ) : (
                        <button
                          className="primary-button"
                          type="button"
                          onClick={() => {
                            const nextStep =
                              publicWizardSteps[activePublicStepIndex + 1];
                            if (nextStep) {
                              setActivePublicStepId(nextStep.id);
                            }
                          }}
                        >
                          Continue
                        </button>
                      )}
                    </div>

                    <p
                      className={`feedback ${clientFeedback.type || ""}`.trim()}
                      aria-live="polite"
                    >
                      {clientFeedback.message}
                    </p>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <div className="empty-state">No templates available.</div>
          )}
        </div>
      </section>
    );
  }

  function renderAdminLogin() {
    return (
      <section className="mode-panel">
        <div className="panel-card admin-login-card">
          <div className="login-brand">
            <img
              className="login-brand-logo"
              src="/nafdac-logo.webp"
              alt="NAFDAC logo"
            />
            <h2>Samples Admin</h2>
            <p>
              Private access for submissions, manifests, and export operations.
            </p>
          </div>

          <div className="login-divider" />

          <form className="admin-login-form" onSubmit={handleAdminLogin}>
            <label>
              Admin Password
              <input
                type="password"
                value={adminPassword}
                onChange={(event) => setAdminPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            <button className="primary-button" type="submit">
              Sign In
            </button>
            <p
              className={`feedback ${adminAuthFeedback.type || ""}`.trim()}
              aria-live="polite"
            >
              {adminAuthFeedback.message}
            </p>
          </form>
        </div>
      </section>
    );
  }

  // Derive the filtered submission set for analytics based on the date range filter.
  // Uses sampleReceivedDate as the primary date, falling back to createdAt.
  const analyticsSubmissions = useMemo(() => {
    if (analyticsRangeMode === "all") return submissions;

    const now = new Date();
    let fromDate = null;
    let toDate = null;

    if (analyticsRangeMode === "month") {
      fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (analyticsRangeMode === "quarter") {
      fromDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    } else if (analyticsRangeMode === "year") {
      fromDate = new Date(now.getFullYear(), 0, 1);
    } else if (analyticsRangeMode === "custom") {
      if (analyticsDateFrom)
        fromDate = new Date(`${analyticsDateFrom}T00:00:00`);
      if (analyticsDateTo) toDate = new Date(`${analyticsDateTo}T23:59:59`);
    }

    return submissions.filter((s) => {
      const raw = s.sampleReceivedDate || s.createdAt;
      if (!raw) return false;
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) return false;
      if (fromDate && d < fromDate) return false;
      if (toDate && d > toDate) return false;
      return true;
    });
  }, [submissions, analyticsRangeMode, analyticsDateFrom, analyticsDateTo]);

  const analytics = useMemo(() => {
    const total = analyticsSubmissions.length;
    if (!total) return null;
    const byStatus = {};
    const byTemplate = {};
    const byManufacturer = {};
    const byDistributor = {};
    const byGenericKey = {}; // normalised key → {display, count}
    const byDosageForm = {};
    const byCountry = {};
    const byRejectionReason = {};

    // Turnaround accumulator helpers
    function daysBetween(a, b) {
      if (!a || !b) return null;
      const da = new Date(a),
        db = new Date(b);
      if (Number.isNaN(da.getTime()) || Number.isNaN(db.getTime())) return null;
      const diff = (db - da) / (1000 * 60 * 60 * 24);
      return diff >= 0 ? diff : null;
    }
    const ta = {
      submissionToReceived: { sum: 0, count: 0, min: Infinity, max: -Infinity },
      receivedToLab: { sum: 0, count: 0, min: Infinity, max: -Infinity },
      labToReport: { sum: 0, count: 0, min: Infinity, max: -Infinity },
    };
    function pushTa(acc, days) {
      if (days === null) return;
      acc.sum += days;
      acc.count += 1;
      if (days < acc.min) acc.min = days;
      if (days > acc.max) acc.max = days;
    }

    for (const s of analyticsSubmissions) {
      const status = s.status || "UNKNOWN";
      byStatus[status] = (byStatus[status] || 0) + 1;

      const tpl = TEMPLATE_LABELS[s.templateId] || s.templateId || "Unknown";
      byTemplate[tpl] = (byTemplate[tpl] || 0) + 1;

      const mfr =
        `${s.manufacturer || s.productSampleAnswers?.manufacturer || ""}`.trim();
      if (mfr) byManufacturer[mfr] = (byManufacturer[mfr] || 0) + 1;

      const dist =
        `${s.distributor || s.productSampleAnswers?.distributor || ""}`.trim();
      if (dist) byDistributor[dist] = (byDistributor[dist] || 0) + 1;

      // Normalised generic name grouping — case-insensitive key, preserve first-seen display form
      const genRaw =
        `${s.genericName || s.productSampleAnswers?.generic_name || ""}`.trim();
      if (genRaw) {
        const genKey = genRaw.toLowerCase();
        if (!byGenericKey[genKey])
          byGenericKey[genKey] = { display: genRaw, count: 0 };
        byGenericKey[genKey].count += 1;
      }

      const dosage =
        `${s.dosageForm || s.productSampleAnswers?.dosage_form || ""}`.trim();
      if (dosage) byDosageForm[dosage] = (byDosageForm[dosage] || 0) + 1;

      const country =
        `${s.productSampleAnswers?.country_of_origin || ""}`.trim();
      if (country) byCountry[country] = (byCountry[country] || 0) + 1;

      if (status === "REJECTED") {
        const reason = `${s.decisionRemark || ""}`.trim();
        if (reason)
          byRejectionReason[reason] = (byRejectionReason[reason] || 0) + 1;
      }

      // Turnaround metrics
      pushTa(
        ta.submissionToReceived,
        daysBetween(s.clientSubmittedAt, s.sampleReceivedDate),
      );
      pushTa(
        ta.receivedToLab,
        daysBetween(s.sampleReceivedDate, s.takenToLabDate),
      );
      pushTa(
        ta.labToReport,
        daysBetween(s.takenToLabDate, s.labReportReceivedDate),
      );
    }

    const top = (obj, n = 10) =>
      Object.entries(obj)
        .sort((a, b) => b[1] - a[1])
        .slice(0, n);

    // Convert normalised generic map back to [display, count] pairs
    const topGeneric = Object.values(byGenericKey)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((g) => [g.display, g.count]);

    // Finalise turnaround stats
    function finaliseTa(acc) {
      if (acc.count === 0) return { count: 0, avg: null, min: null, max: null };
      return {
        count: acc.count,
        avg: +(acc.sum / acc.count).toFixed(1),
        min: +acc.min.toFixed(1),
        max: +acc.max.toFixed(1),
      };
    }
    const turnaround = {
      submissionToReceived: finaliseTa(ta.submissionToReceived),
      receivedToLab: finaliseTa(ta.receivedToLab),
      labToReport: finaliseTa(ta.labToReport),
    };

    const timelines = {
      sampling: {
        key: "sampling",
        label: "Sampling Date",
        shortLabel: "Sampling",
        ...buildAnalyticsTimeline(
          analyticsSubmissions,
          (submission) =>
            submission.samplingDate ||
            submission.productSampleAnswers?.[SAMPLING_DATE_FIELD_CODE],
        ),
      },
      received: {
        key: "received",
        label: "Date Received",
        shortLabel: "Received",
        ...buildAnalyticsTimeline(
          analyticsSubmissions,
          (submission) => submission.sampleReceivedDate,
        ),
      },
      created: {
        key: "created",
        label: "Created At",
        shortLabel: "Created",
        ...buildAnalyticsTimeline(
          analyticsSubmissions,
          (submission) => submission.createdAt,
        ),
      },
    };
    return {
      total,
      byStatus,
      byTemplate,
      timelines,
      sampledTodayCount: timelines.sampling.todayCount,
      receivedTodayCount: timelines.received.todayCount,
      createdTodayCount: timelines.created.todayCount,
      topMfr: top(byManufacturer),
      topDist: top(byDistributor),
      topGeneric,
      topDosageForm: top(byDosageForm),
      topCountry: top(byCountry),
      topRejectionReasons: top(byRejectionReason),
      turnaround,
      templateCount: Object.keys(byTemplate).length,
      manufacturerCount: Object.keys(byManufacturer).length,
      distributorCount: Object.keys(byDistributor).length,
      genericCount: Object.keys(byGenericKey).length,
      dosageFormCount: Object.keys(byDosageForm).length,
      countryCount: Object.keys(byCountry).length,
      rejectionReasonCount: Object.keys(byRejectionReason).length,
    };
  }, [analyticsSubmissions]);

  function renderAdminDetailPanel() {
    if (!selectedSubmission) return null;
    const s = selectedSubmission;
    const answers = s.productSampleAnswers || {};
    const get = (code) => `${answers[code] || ""}`.trim() || "—";

    const overviewRows = [
      ["Brand Name",          get(BRAND_NAME_FIELD_CODE)],
      ["Generic Name",        get(GENERIC_NAME_FIELD_CODE)],
      ["Product Class",       get("product_class")],
      ["NAFDAC No.",          s.nafdacNumber || get(NAFDAC_NUMBER_FIELD_CODE) || "—"],
      ["Dosage Form",         get(DOSAGE_FORM_FIELD_CODE)],
      ["Strength",            get("strength")],
      ["Pack Size",           get(PACK_SIZE_FIELD_CODE)],
      ["Manuf. Date",         get(MANUFACTURING_DATE_FIELD_CODE)],
      ["Expiry Date",         get(EXPIRY_DATE_FIELD_CODE)],
      ["Batch No.",           get(BATCH_NUMBER_FIELD_CODE)],
      ["Source",              get(SOURCE_FIELD_CODE)],
      ["Distributor",         get(DISTRIBUTOR_FIELD_CODE)],
      ["Qty",                 get(QUANTITY_FIELD_CODE)],
      ["Manufacturer",        get("manufacturer")],
      ["Sampling Date",       get(SAMPLING_DATE_FIELD_CODE)],
      ["Consignment Size",    s.consignmentSize || "—"],
      ["Retest Date",         s.retestDate || "—"],
      ["Pharmacopoeia",       get("pharmacopoeia")],
      ["Storage Condition",   get("storage_condition")],
      ["Reason for Analysis", get("reason_for_analysis")],
      ["Required Test",       get("required_test")],
      ["Name of Officer",     s.officerName || "—"],
      ["Designation",         s.officerDesignation || "—"],
      ["Phone No.",           s.officerPhone || "—"],
      ["Email",               s.officerEmail || "—"],
      ["Category",            get("category")],
      ["Physical Description",get("physical_description")],
      ["Country of Origin",   get("country_of_origin")],
      ["Port of Entry",       get("port_of_entry")],
      ["Test Request No.",    s.testRequestNo || "—"],
      ["Test Parameters",     s.testParameters || "—"],
      ["Risk Factor",         get(RISK_FACTOR_FIELD_CODE)],
      // identifiers
      ["Tracking No.",        s.trackingNumber],
      ["Applicant",           s.applicantName || "—"],
      ["Status",              toStatusLabel(s.status)],
      ["Received By",         s.reviewedBy || "—"],
      ["Submitted",           formatDate(s.createdAt)],
      // lab — last
      ["Date Received",       s.sampleReceivedDate || "—"],
      ["Date to Lab",         s.takenToLabDate || "—"],
      ["Lab Report Date",     s.labReportReceivedDate || "—"],
      ["Lab Comment",         s.labComment || "—"],
    ];

    const detailTabs = [
      { id: "overview", label: "Overview" },
      { id: "docs",     label: "Documents" },
    ];

    return (
      <div className="admin-detail">
        <div className="sdp-header">
          <div className="sdp-header-left">
            <div className="sdp-header-meta">
              <span className="detail-annexure">{s.templateSnapshot?.annexure}</span>
              <span className="detail-sop">SOP: {s.templateSnapshot?.sopRef}</span>
            </div>
            <h3 className="sdp-title">
              {get(BRAND_NAME_FIELD_CODE) !== "—" ? get(BRAND_NAME_FIELD_CODE) : s.productName}
              {get(GENERIC_NAME_FIELD_CODE) !== "—" && (
                <span className="sdp-title-generic"> · {get(GENERIC_NAME_FIELD_CODE)}</span>
              )}
            </h3>
            <div className="sdp-header-chips">
              <span className={`status-pill status-${(s.status || "").toLowerCase()}`}>
                {toStatusLabel(s.status)}
              </span>
              <span className="sdp-chip">{s.trackingNumber}</span>
              {s.napamsNumber && <span className="sdp-chip">{s.napamsNumber}</span>}
            </div>
          </div>
          <div className="sdp-header-right">
            <button className="ghost-button" type="button" onClick={handlePrintExport}>
              Print / Export PDF
            </button>
          </div>
        </div>

        <div className="sdp-body">
          <div className="sdp-main">
            <div className="sdp-tab-bar">
              {detailTabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`sdp-tab-btn${detailTab === t.id ? " is-active" : ""}`}
                  onClick={() => setDetailTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {detailTab === "overview" && (
              <div className="sdp-overview-table">
                {overviewRows.map(([label, value]) => (
                  <div key={label} className="sdp-overview-row">
                    <span className="sdp-overview-label">{label}</span>
                    <span className="sdp-overview-value">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {detailTab === "docs" && (
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: "56px" }}>S/N</th>
                      <th>Description</th>
                      <th style={{ width: "150px" }}>Status</th>
                      <th style={{ width: "260px" }}>Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(s.templateSnapshot?.documentsRequired || []).map((item) => (
                      <tr key={item.code}>
                        <td>{item.serialNumber}</td>
                        <td>{item.label}</td>
                        <td>
                          <select
                            value={checklistDraft[item.code]?.status || "PENDING"}
                            onChange={(event) =>
                              setChecklistDraft((prev) => ({
                                ...prev,
                                [item.code]: {
                                  ...prev[item.code],
                                  status: event.target.value,
                                },
                              }))
                            }
                          >
                            <option value="PENDING">Pending</option>
                            <option value="YES">Yes</option>
                            <option value="NO">No</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            value={checklistDraft[item.code]?.remark || ""}
                            onChange={(event) =>
                              setChecklistDraft((prev) => ({
                                ...prev,
                                [item.code]: {
                                  ...prev[item.code],
                                  remark: event.target.value,
                                },
                              }))
                            }
                            placeholder="Remark"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="sdp-side">
            <div className="sdp-side-section">
              <div className="sdp-side-label">Movement Tracking</div>
              <label>
                Date Sample Received
                <input type="date" value={adminSampleReceivedDate}
                  onChange={(e) => setAdminSampleReceivedDate(e.target.value)} />
              </label>
              <label>
                Date Taken to Lab
                <input type="date" value={adminTakenToLabDate}
                  onChange={(e) => setAdminTakenToLabDate(e.target.value)} />
              </label>
              <label>
                Date Lab Report Received
                <input type="date" value={adminLabReportReceivedDate}
                  onChange={(e) => setAdminLabReportReceivedDate(e.target.value)} />
              </label>
              <label>
                Quantity
                <input type="number" min="0" value={adminQuantity}
                  onChange={(e) => setAdminQuantity(e.target.value)}
                  placeholder="Enter quantity" />
              </label>
              <label>
                Lab Comment
                <textarea value={adminLabComment}
                  onChange={(e) => setAdminLabComment(e.target.value)}
                  placeholder="Enter lab comment" />
              </label>
            </div>

            <div className="sdp-side-divider" />

            <div className="sdp-side-section">
              <div className="sdp-side-label">Review</div>
              <label>
                Received By
                <input type="text" value={adminReceivedBy}
                  onChange={(e) => setAdminReceivedBy(e.target.value)} />
              </label>
              <label>
                Status
                <select value={adminQuickStatus}
                  onChange={(e) => {
                    setAdminQuickStatus(e.target.value);
                    if (e.target.value !== "REJECTED") setAdminRejectionReason("");
                  }}
                >
                  {validStatuses.map((st) => (
                    <option key={st} value={st}>{toStatusLabel(st)}</option>
                  ))}
                </select>
              </label>
              {adminQuickStatus === "REJECTED" && (
                <label>
                  Rejection Reason
                  <input type="text" value={adminRejectionReason}
                    onChange={(e) => setAdminRejectionReason(e.target.value)}
                    placeholder="Enter reason" required />
                </label>
              )}
            </div>

            <div className="sdp-side-divider" />

            <div className="sdp-side-actions">
              <button
                className={`primary-button ${checklistSaveState === "saved" ? "btn-saved" : ""}`.trim()}
                type="button"
                onClick={handleChecklistSave}
                disabled={checklistSaveState === "saving"}
              >
                {checklistSaveState === "saving" ? "Saving…" : checklistSaveState === "saved" ? "✓ Saved" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderSubmissionDetailPage() {
    return (
      <section className="mode-panel">
        <div className="submission-detail-page">
          <div className="submission-detail-page-nav">
            <button
              className="ghost-button"
              type="button"
              onClick={() => navigate("/admin")}
            >
              ← Back to Register
            </button>
            <p
              className={`feedback ${adminFeedback.type || ""}`.trim()}
              aria-live="polite"
            >
              {adminFeedback.message}
            </p>
          </div>
          {selectedSubmission ? (
            renderAdminDetailPanel()
          ) : (
            <div className="admin-detail sdp-skeleton">
              <div className="sdp-skeleton-header">
                <div className="sdp-skeleton-header-left">
                  <div className="skeleton skeleton-line" style={{ width: "120px", height: "12px" }} />
                  <div className="skeleton skeleton-title" style={{ width: "280px", height: "22px", marginTop: "8px" }} />
                  <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                    <div className="skeleton" style={{ width: "72px", height: "22px", borderRadius: "20px" }} />
                    <div className="skeleton" style={{ width: "110px", height: "22px", borderRadius: "20px" }} />
                  </div>
                </div>
                <div className="skeleton" style={{ width: "130px", height: "38px", borderRadius: "6px" }} />
              </div>
              <div className="sdp-skeleton-body">
                <div className="sdp-skeleton-main">
                  <div className="sdp-skeleton-tabs">
                    {["Overview", "Sample Fields", "Documents"].map((t) => (
                      <div key={t} className="skeleton" style={{ width: "90px", height: "14px", borderRadius: "4px" }} />
                    ))}
                  </div>
                  <div className="sdp-skeleton-rows">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="sdp-skeleton-row">
                        <div className="skeleton" style={{ width: "100px", height: "12px" }} />
                        <div className="skeleton" style={{ width: `${120 + (i % 4) * 40}px`, height: "12px" }} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="sdp-skeleton-side">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="skeleton" style={{ height: "36px", borderRadius: "6px" }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  function renderAdminConsole() {
    const registerMatchesCount = adminRegisterView.hasSearch
      ? adminRegisterView.matchesCount
      : adminRegisterView.ordered.length;
    const registerBaseCount = adminRegisterView.totalPool;
    const activeFilterCount = [
      adminSearchTerm.trim(),
      adminTemplateFilter,
      adminStatusFilter,
      adminReceivedTodayOnly ? "received_today" : "",
    ].filter(Boolean).length;
    const currentSelectedLabel = selectedSubmission
      ? selectedSubmission.nafdacNumber || selectedSubmission.trackingNumber
      : "No record selected";
    const receivedSubmissionsCount = analytics?.byStatus?.RECEIVED || 0;
    const rejectedSubmissionsCount = analytics?.byStatus?.REJECTED || 0;
    const receivedTodayCount = analytics?.receivedTodayCount || 0;

    return (
      <section className="mode-panel">
        <div className="panel-card admin-console-card">
          <div className="admin-console-header">
            <div className="admin-console-header-copy">
              <span className="admin-console-eyebrow">Samples operations</span>
              <h2>Admin Review Console</h2>
              <p>
                Review submissions, track movement, and maintain the sample
                register.
              </p>
              <div className="admin-console-stats">
                <span className="admin-console-stat">
                  <strong>{submissions.length}</strong>
                  <span>Total records</span>
                </span>
                <span className="admin-console-stat">
                  <strong>{receivedSubmissionsCount}</strong>
                  <span>Received</span>
                </span>
                <span className="admin-console-stat">
                  <strong>{rejectedSubmissionsCount}</strong>
                  <span>Rejected</span>
                </span>
              </div>
            </div>
            <div className="admin-toolbar">
              <button
                className="secondary-button"
                type="button"
                onClick={handleExportAllExcel}
              >
                Export All (Excel)
              </button>
              <button
                className="ghost-button"
                type="button"
                onClick={handleAdminLogout}
              >
                Sign Out
              </button>
            </div>
          </div>

          <div className="admin-tab-bar">
            {[
              { key: "register", label: "Register", badge: receivedTodayCount },
              {
                key: "products",
                label: "Submissions",
                badge: submissions.length,
              },
              {
                key: "analytics",
                label: "Analytics",
                badge: analytics ? "Live" : "Empty",
              },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                className={`admin-tab-btn ${adminTab === t.key ? "is-active" : ""}`.trim()}
                onClick={() => setAdminTab(t.key)}
              >
                <span className="admin-tab-btn-label">{t.label}</span>
                <span className="admin-tab-btn-badge">{t.badge}</span>
              </button>
            ))}
          </div>

          <div className="admin-content-zone">
            {adminTab === "register" && (
              <section className="checklist-block profile-block">
                <h3>Officer Profile</h3>
                <p className="muted-text">
                  Enter these once on this device. They will be reused
                  automatically whenever you save a submission.
                </p>
                <div className="action-row profile-fields">
                  <label>
                    Name of Officer
                    <input
                      type="text"
                      value={adminOfficerProfile.officerName}
                      onChange={(event) =>
                        handleAdminOfficerProfileChange(
                          "officerName",
                          event.target.value,
                        )
                      }
                    />
                  </label>
                  <label>
                    Designation
                    <input
                      type="text"
                      value={adminOfficerProfile.officerDesignation}
                      onChange={(event) =>
                        handleAdminOfficerProfileChange(
                          "officerDesignation",
                          event.target.value,
                        )
                      }
                    />
                  </label>
                  <label>
                    Phone No
                    <input
                      type="tel"
                      inputMode="tel"
                      value={adminOfficerProfile.officerPhone}
                      onChange={(event) =>
                        handleAdminOfficerProfileChange(
                          "officerPhone",
                          event.target.value,
                        )
                      }
                    />
                  </label>
                  <label>
                    Email
                    <input
                      type="email"
                      value={adminOfficerProfile.officerEmail}
                      onChange={(event) =>
                        handleAdminOfficerProfileChange(
                          "officerEmail",
                          event.target.value,
                        )
                      }
                    />
                  </label>
                </div>
              </section>
            )}

            {adminTab === "register" && (
              <section className="checklist-block">
                <div>
                  <div className="register-toolbar">
                    <div className="register-toolbar-filters">
                      <div className="admin-search-field">
                        <label htmlFor="admin-search-input">Search</label>
                        <input
                          id="admin-search-input"
                          type="search"
                          value={adminSearchTerm}
                          onChange={(event) =>
                            setAdminSearchTerm(event.target.value)
                          }
                          placeholder="NAFDAC No, tracking, brand, generic, batch..."
                        />
                      </div>
                      <label className="admin-filter-template">
                        Template
                        <select
                          value={adminTemplateFilter}
                          onChange={(event) =>
                            setAdminTemplateFilter(event.target.value)
                          }
                        >
                          <option value="">All</option>
                          {templates.map((template) => (
                            <option
                              key={template.id}
                              value={template.templateId || template.id}
                            >
                              {getTemplateDisplayName(template)}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="admin-filter-status">
                        Status
                        <select
                          value={adminStatusFilter}
                          onChange={(event) =>
                            setAdminStatusFilter(event.target.value)
                          }
                        >
                          <option value="">All</option>
                          {validStatuses.map((status) => (
                            <option key={status} value={status}>
                              {toStatusLabel(status)}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        className="ghost-button"
                        type="button"
                        onClick={() =>
                          setAdminReceivedTodayOnly((current) => !current)
                        }
                      >
                        {adminReceivedTodayOnly
                          ? "Show all dates"
                          : "Today only"}
                      </button>
                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() =>
                          refreshSubmissions(
                            selectedSubmissionId,
                            adminSearchTerm.trim(),
                          )
                        }
                      >
                        {isRefreshing ? "Refreshing..." : "Refresh"}
                      </button>
                      <button
                        className="ghost-button"
                        type="button"
                        onClick={() => {
                          setAdminSearchTerm("");
                          setAdminTemplateFilter("");
                          setAdminStatusFilter("");
                          setAdminReceivedTodayOnly(true);
                          void refreshSubmissions(selectedSubmissionId, "");
                        }}
                        disabled={!activeFilterCount}
                      >
                        Clear Filters
                      </button>
                      <span className="register-record-count">
                        {adminRegisterView.hasSearch
                          ? `${registerMatchesCount} match${registerMatchesCount === 1 ? "" : "es"} of ${registerBaseCount}`
                          : adminReceivedTodayOnly
                            ? `${adminRegisterView.ordered.length} today`
                            : `${registerBaseCount} record${registerBaseCount === 1 ? "" : "s"}`}
                      </span>
                    </div>
                    <div className="register-toolbar-meta">
                      <p
                        className={`feedback ${adminFeedback.type || ""}`.trim()}
                        aria-live="polite"
                      >
                        {adminFeedback.message}
                      </p>
                    </div>
                  </div>
                  <div className="table-scroll admin-register-scroll">
                    <table className="data-table admin-register-table">
                      <thead>
                        <tr>
                          <th style={{ width: "160px" }}>NAFDAC No</th>
                          <th style={{ width: "160px" }}>Tracking</th>
                          <th>Product</th>
                          <th style={{ width: "170px" }}>Batch</th>
                          <th style={{ width: "220px" }}>
                            Source / Distributor
                          </th>
                          <th style={{ width: "150px" }}>Sampling Date</th>
                          <th style={{ width: "150px" }}>Date Received</th>
                          <th style={{ width: "130px" }}>Status</th>
                          <th style={{ width: "200px" }}>Lab Remark</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminRegisterView.ordered.length ? (
                          adminRegisterView.ordered.map((submission) => {
                            const isMatch =
                              adminRegisterView.hasSearch &&
                              adminRegisterView.matchIds.has(submission.id);
                            const isSelected =
                              selectedSubmissionId === submission.id;
                            const statusClass = `status-pill status-${(
                              submission.status || ""
                            ).toLowerCase()}`;

                            const isNew =
                              submission.status === "RECEIVED" &&
                              !submission.reviewedBy;

                            return (
                              <React.Fragment key={submission.id}>
                                <tr
                                  className={`admin-register-row ${isMatch ? "is-match" : ""} ${
                                    isSelected ? "is-selected" : ""
                                  } ${isNew ? "is-new" : ""}`.trim()}
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    void handleAdminSubmissionSelect(
                                      submission.id,
                                    );
                                  }}
                                  onKeyDown={(event) => {
                                    if (
                                      event.key === "Enter" ||
                                      event.key === " "
                                    ) {
                                      event.preventDefault();
                                      void handleAdminSubmissionSelect(
                                        submission.id,
                                      );
                                    }
                                  }}
                                  tabIndex={0}
                                  role="button"
                                >
                                  <td>
                                    {isNew && (
                                      <span className="new-badge">New</span>
                                    )}
                                    {submission.nafdacNumber || "NIL"}
                                  </td>
                                  <td>{submission.trackingNumber}</td>
                                  <td className="admin-register-col-product">
                                    <strong>
                                      {submission.productName || "Not provided"}
                                    </strong>
                                    {submission.genericName ? (
                                      <div className="admin-register-subtext">
                                        Generic: {submission.genericName}
                                      </div>
                                    ) : null}
                                    {submission.dosageForm ? (
                                      <div className="admin-register-subtext">
                                        {submission.dosageForm}
                                      </div>
                                    ) : null}
                                  </td>
                                  <td>
                                    {submission.batchNumber || "Not provided"}
                                  </td>
                                  <td className="admin-register-col-source">
                                    <div className="admin-register-source">
                                      <strong>
                                        {submission.source ||
                                          submission.productSampleAnswers
                                            ?.source ||
                                          "Not provided"}
                                      </strong>
                                      <div className="admin-register-subtext">
                                        Distributor:{" "}
                                        {submission.distributor ||
                                          submission.productSampleAnswers
                                            ?.distributor ||
                                          "Not provided"}
                                      </div>
                                      <div className="admin-register-subtext">
                                        Applicant:{" "}
                                        {submission.applicantName ||
                                          "Not provided"}
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {submission.samplingDate || "Not provided"}
                                  </td>
                                  <td>
                                    {submission.sampleReceivedDate ||
                                      "Not received"}
                                  </td>
                                  <td>
                                    <span className={statusClass}>
                                      {toStatusLabel(submission.status)}
                                    </span>
                                  </td>
                                  <td className="admin-register-col-lab-remark">
                                    {submission.labComment || "—"}
                                  </td>
                                </tr>
                              </React.Fragment>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={9}>
                              <div className="empty-state empty-state-admin">
                                <h4>No samples received today</h4>
                                <p>
                                  {adminReceivedTodayOnly
                                    ? 'No samples have been received today yet. Click "Show all dates" to view all records.'
                                    : "No records match the current filters."}
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="data-table-mobile">
                    {adminRegisterView.ordered.length ? (
                      adminRegisterView.ordered.map((submission) => {
                        const isMatch =
                          adminRegisterView.hasSearch &&
                          adminRegisterView.matchIds.has(submission.id);
                        const isSelected =
                          selectedSubmissionId === submission.id;
                        const statusClass = `status-pill status-${(
                          submission.status || ""
                        ).toLowerCase()}`;
                        const isNewCard =
                          submission.status === "RECEIVED" &&
                          !submission.reviewedBy;

                        return (
                          <div
                            key={`card-${submission.id}`}
                            className={`mobile-table-card ${isMatch ? "is-match" : ""} ${
                              isSelected ? "is-selected" : ""
                            } ${isNewCard ? "is-new" : ""}`.trim()}
                            onClick={() => {
                              void handleAdminSubmissionSelect(submission.id);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                void handleAdminSubmissionSelect(submission.id);
                              }
                            }}
                            tabIndex={0}
                            role="button"
                          >
                            <div className="admin-register-card-head">
                              <span className="mobile-table-label">
                                Current status
                              </span>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                              >
                                {isNewCard && (
                                  <span className="new-badge">New</span>
                                )}
                                <span className={statusClass}>
                                  {toStatusLabel(submission.status)}
                                </span>
                              </div>
                            </div>
                            <div className="mobile-table-row">
                              <div className="mobile-table-label">
                                NAFDAC No
                              </div>
                              <div className="mobile-table-value">
                                {submission.nafdacNumber || "NIL"}
                              </div>
                            </div>
                            <div className="mobile-table-row">
                              <div className="mobile-table-label">Tracking</div>
                              <div className="mobile-table-value">
                                {submission.trackingNumber}
                              </div>
                            </div>
                            <div className="mobile-table-row">
                              <div className="mobile-table-label">Product</div>
                              <div className="mobile-table-value">
                                {submission.productName || "Not provided"}
                                {submission.genericName
                                  ? ` • ${submission.genericName}`
                                  : ""}
                              </div>
                            </div>
                            <div className="mobile-table-row">
                              <div className="mobile-table-label">Batch</div>
                              <div className="mobile-table-value">
                                {submission.batchNumber || "Not provided"}
                              </div>
                            </div>
                            <div className="mobile-table-row">
                              <div className="mobile-table-label">
                                Source / Distributor
                              </div>
                              <div className="mobile-table-value">
                                {submission.source ||
                                  submission.productSampleAnswers?.source ||
                                  "Not provided"}
                                <div className="admin-register-subtext">
                                  Distributor:{" "}
                                  {submission.distributor ||
                                    submission.productSampleAnswers
                                      ?.distributor ||
                                    "Not provided"}
                                </div>
                              </div>
                            </div>
                            <div className="mobile-table-row">
                              <div className="mobile-table-label">
                                Sampling Date
                              </div>
                              <div className="mobile-table-value">
                                {submission.samplingDate || "Not provided"}
                              </div>
                            </div>
                            <div className="mobile-table-row">
                              <div className="mobile-table-label">
                                Date Received
                              </div>
                              <div className="mobile-table-value">
                                {submission.sampleReceivedDate ||
                                  "Not received"}
                              </div>
                            </div>
                            <div className="mobile-table-row">
                              <div className="mobile-table-label">
                                Lab Remark
                              </div>
                              <div className="mobile-table-value">
                                {submission.labComment || "—"}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="empty-state empty-state-admin">
                        <h4>No samples received today</h4>
                        <p>
                          {adminReceivedTodayOnly
                            ? 'No samples have been received today yet. Tap "Show all dates" to view all records.'
                            : "No records match the current filters."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {adminTab === "products" && (
              <section className="checklist-block">
                <div className="checklist-block-head">
                  <h3>Submissions</h3>
                  <p>
                    All received submissions. Click a row to open the full
                    detail page.
                  </p>
                </div>
                <ProductsRegister
                  submissions={submissions}
                  selectedId={selectedSubmissionId}
                  onSelect={(id) => {
                    void handleAdminSubmissionSelect(id);
                  }}
                  renderDetail={null}
                  onExport={handleExportProductsExcel}
                />
              </section>
            )}

            {adminTab === "analytics" && (
              <section className="checklist-block">
                {!analytics ? (
                  <div className="empty-state empty-state-admin">
                    <h4>No data yet</h4>
                    <p>Submissions will appear here once records are added.</p>
                  </div>
                ) : (
                  (() => {
                    const templateEntries = Object.entries(
                      analytics.byTemplate,
                    ).sort((a, b) => b[1] - a[1]);
                    const statusEntries = Object.entries(analytics.byStatus)
                      .sort((a, b) => b[1] - a[1])
                      .map(([status, count]) => [
                        formatAnalyticsLabel(status),
                        count,
                      ]);
                    const receivedCount = analytics.byStatus["RECEIVED"] || 0;
                    const rejectedCount = analytics.byStatus["REJECTED"] || 0;
                    const receivedRate = analytics.total
                      ? `${((receivedCount / analytics.total) * 100).toFixed(1)}%`
                      : "0.0%";
                    const rejectionRate = analytics.total
                      ? `${((rejectedCount / analytics.total) * 100).toFixed(1)}%`
                      : "0.0%";
                    const activeTimeline =
                      analytics.timelines[analyticsDateMode] ||
                      analytics.timelines.created;
                    const peakMonth = activeTimeline.months.reduce(
                      (best, entry) =>
                        !best || entry[1] > best[1] ? entry : best,
                      null,
                    );
                    const templatePieEntries = compactAnalyticsData(
                      templateEntries,
                      6,
                    );
                    const statusPieEntries = compactAnalyticsData(
                      statusEntries,
                      6,
                    );
                    const leadingTemplate = templateEntries[0] || null;
                    const leadingStatus = statusEntries[0] || null;
                    const leadingManufacturer = analytics.topMfr[0] || null;
                    const leadingDistributor = analytics.topDist[0] || null;
                    const monthlyAverage = activeTimeline.months.length
                      ? (
                          activeTimeline.total / activeTimeline.months.length
                        ).toFixed(1)
                      : "0.0";

                    return (
                      <div className="analytics-shell">
                        {/* ── Compact toolbar ── */}
                        <div className="analytics-toolbar">
                          <div className="analytics-toolbar-left">
                            <span className="analytics-toolbar-label">Period</span>
                            <div className="analytics-filter-strip-btns" role="group" aria-label="Analytics date range">
                              {[
                                { key: "all", label: "All time" },
                                { key: "month", label: "This month" },
                                { key: "quarter", label: "Last 3 months" },
                                { key: "year", label: "This year" },
                                { key: "custom", label: "Custom" },
                              ].map((opt) => (
                                <button
                                  key={opt.key}
                                  type="button"
                                  className={`analytics-filter-btn ${analyticsRangeMode === opt.key ? "is-active" : ""}`.trim()}
                                  onClick={() => setAnalyticsRangeMode(opt.key)}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                            {analyticsRangeMode === "custom" && (
                              <div className="analytics-filter-custom">
                                <label>
                                  From
                                  <input type="date" value={analyticsDateFrom} onChange={(e) => setAnalyticsDateFrom(e.target.value)} />
                                </label>
                                <label>
                                  To
                                  <input type="date" value={analyticsDateTo} onChange={(e) => setAnalyticsDateTo(e.target.value)} />
                                </label>
                              </div>
                            )}
                          </div>
                          <div className="analytics-toolbar-right">
                            <span className="analytics-toolbar-label">Date basis</span>
                            <div className="analytics-filter-strip-btns" role="group" aria-label="Analytics date basis">
                              {ANALYTICS_DATE_MODES.map((mode) => (
                                <button
                                  key={mode.key}
                                  type="button"
                                  className={`analytics-filter-btn ${analyticsDateMode === mode.key ? "is-active" : ""}`.trim()}
                                  onClick={() => setAnalyticsDateMode(mode.key)}
                                >
                                  {mode.shortLabel}
                                </button>
                              ))}
                            </div>
                            <span className="analytics-filter-count">
                              {analyticsRangeMode === "all"
                                ? `${analytics.total} records`
                                : `${analytics.total} of ${submissions.length} records`}
                            </span>
                          </div>
                        </div>
                        {/* ── KPI strip ── */}
                        <div className="analytics-kpi-strip">
                          {[
                            { label: "Total", value: analytics.total, accent: "var(--accent)" },
                            { label: "Received", value: receivedCount, sub: receivedRate, accent: "var(--ok)" },
                            { label: "Rejected", value: rejectedCount, sub: rejectionRate, accent: "var(--danger)" },
                            { label: `${activeTimeline.shortLabel} today`, value: activeTimeline.todayCount, accent: "var(--accent-mid)" },
                            { label: "Received today", value: analytics.receivedTodayCount, accent: "var(--accent)" },
                            { label: "Sampled today", value: analytics.sampledTodayCount, accent: "var(--accent)" },
                          ].map((s) => (
                            <div key={s.label} className="analytics-kpi-tile" style={{ "--kpi-accent": s.accent }}>
                              <span className="analytics-kpi-tile-value">{s.value}</span>
                              <span className="analytics-kpi-tile-label">{s.label}</span>
                              {s.sub && <span className="analytics-kpi-tile-sub">{s.sub}</span>}
                            </div>
                          ))}
                        </div>

                        {/* ── Main grid: trend (2 cols) + turnaround sidebar (1 col) ── */}
                        <div className="analytics-main-grid">
                          <div className="analytics-card analytics-card-emphasis analytics-main-trend">
                            <div className="analytics-card-head">
                              <div className="analytics-card-title-block">
                                <span className="analytics-card-kicker">Trend</span>
                                <h4 className="analytics-card-title">
                                  {activeTimeline.shortLabel} activity by month
                                </h4>
                              </div>
                              <span className="analytics-card-meta">
                                {activeTimeline.months.length
                                  ? `${activeTimeline.total} records · avg ${monthlyAverage}/month`
                                  : `No ${activeTimeline.label.toLowerCase()} values yet`}
                              </span>
                            </div>
                            {activeTimeline.months.length ? (
                              <MonthChart data={activeTimeline.months} />
                            ) : (
                              <div className="analytics-empty-state">
                                <h4>No {activeTimeline.label.toLowerCase()} records yet</h4>
                                <p>{`The trend chart will populate once records have ${activeTimeline.label.toLowerCase()} in the register.`}</p>
                              </div>
                            )}
                          </div>
                          <div className="analytics-main-ta">
                            <div className="analytics-card-head" style={{ padding: "0 0 10px" }}>
                              <div className="analytics-card-title-block">
                                <span className="analytics-card-kicker">Performance</span>
                                <h4 className="analytics-card-title">Journey time</h4>
                              </div>
                            </div>
                            {[
                              { label: "Submission → Received", data: analytics.turnaround.submissionToReceived, color: "var(--accent)" },
                              { label: "Received → Lab", data: analytics.turnaround.receivedToLab, color: "var(--accent-mid)" },
                              { label: "Lab → Report", data: analytics.turnaround.labToReport, color: "var(--ok)" },
                            ].map((stage) => (
                              <div key={stage.label} className="analytics-ta-card" style={{ "--ta-color": stage.color }}>
                                <span className="analytics-ta-label">{stage.label}</span>
                                <strong className="analytics-ta-value">
                                  {stage.data.count > 0 ? `${stage.data.avg}d` : "N/A"}
                                </strong>
                                <div className="analytics-ta-range">
                                  {stage.data.count > 0 ? (
                                    <><span>min {stage.data.min}d</span><span>max {stage.data.max}d</span></>
                                  ) : (
                                    <span>No data yet</span>
                                  )}
                                </div>
                                <span className="analytics-ta-count">{stage.data.count} record{stage.data.count === 1 ? "" : "s"}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* ── Distribution donuts ── */}
                        <div className="analytics-chart-grid">
                          <div className="analytics-card analytics-card-chart">
                            <div className="analytics-card-head">
                              <div className="analytics-card-title-block">
                                <span className="analytics-card-kicker">
                                  Distribution
                                </span>
                                <h4 className="analytics-card-title">
                                  Submission status mix
                                </h4>
                              </div>
                              <span className="analytics-card-meta">
                                {statusEntries.length} statuses represented
                              </span>
                            </div>
                            <AnalyticsDonut
                              data={statusPieEntries}
                              total={analytics.total}
                              centerLabel="records"
                            />
                          </div>

                          <div className="analytics-card analytics-card-chart">
                            <div className="analytics-card-head">
                              <div className="analytics-card-title-block">
                                <span className="analytics-card-kicker">
                                  Distribution
                                </span>
                                <h4 className="analytics-card-title">
                                  Form type share
                                </h4>
                              </div>
                              <span className="analytics-card-meta">
                                {templateEntries.length} template types in use
                              </span>
                            </div>
                            <AnalyticsDonut
                              data={templatePieEntries}
                              total={analytics.total}
                              centerLabel="submissions"
                            />
                          </div>
                        </div>

                        {/* ── Network ── */}
                        <div className="analytics-grid">
                          <div className="analytics-card">
                            <div className="analytics-card-head">
                              <div className="analytics-card-title-block">
                                <span className="analytics-card-kicker">
                                  Network
                                </span>
                                <h4 className="analytics-card-title">
                                  Top manufacturers
                                </h4>
                              </div>
                              <span className="analytics-card-meta">
                                {analytics.manufacturerCount} manufacturers
                                tracked
                              </span>
                            </div>
                            <AnalyticsBar
                              data={analytics.topMfr}
                              total={analytics.total}
                            />
                          </div>
                          <div className="analytics-card">
                            <div className="analytics-card-head">
                              <div className="analytics-card-title-block">
                                <span className="analytics-card-kicker">
                                  Network
                                </span>
                                <h4 className="analytics-card-title">
                                  Top distributors
                                </h4>
                              </div>
                              <span className="analytics-card-meta">
                                {analytics.distributorCount} distributors
                                tracked
                              </span>
                            </div>
                            <AnalyticsBar
                              data={analytics.topDist}
                              total={analytics.total}
                              colorVar="var(--accent-mid)"
                            />
                          </div>
                        </div>

                        <div className="analytics-card analytics-card-full">
                          <div className="analytics-card-head">
                            <div className="analytics-card-title-block">
                              <span className="analytics-card-kicker">
                                Portfolio
                              </span>
                              <h4 className="analytics-card-title">
                                Top generic names
                              </h4>
                            </div>
                            <span className="analytics-card-meta">
                              {analytics.genericCount} generics tracked
                            </span>
                          </div>
                          <AnalyticsBar
                            data={analytics.topGeneric}
                            total={analytics.total}
                            colorVar="var(--gold)"
                          />
                        </div>

                        {/* ── Dosage form + Country of origin ── */}
                        <div className="analytics-grid">
                          <div className="analytics-card">
                            <div className="analytics-card-head">
                              <div className="analytics-card-title-block">
                                <span className="analytics-card-kicker">
                                  Portfolio
                                </span>
                                <h4 className="analytics-card-title">
                                  Top dosage forms
                                </h4>
                              </div>
                              <span className="analytics-card-meta">
                                {analytics.dosageFormCount} forms tracked
                              </span>
                            </div>
                            <AnalyticsBar
                              data={analytics.topDosageForm}
                              total={analytics.total}
                              colorVar="var(--accent-mid)"
                            />
                          </div>
                          <div className="analytics-card">
                            <div className="analytics-card-head">
                              <div className="analytics-card-title-block">
                                <span className="analytics-card-kicker">
                                  Origin
                                </span>
                                <h4 className="analytics-card-title">
                                  Top countries of origin
                                </h4>
                              </div>
                              <span className="analytics-card-meta">
                                {analytics.countryCount} countries tracked
                              </span>
                            </div>
                            <AnalyticsBar
                              data={analytics.topCountry}
                              total={analytics.total}
                              colorVar="var(--gold)"
                            />
                          </div>
                        </div>

                        {/* ── Rejection reason frequency (only when there are rejections) ── */}
                        {analytics.rejectionReasonCount > 0 && (
                          <div className="analytics-card analytics-card-full">
                            <div className="analytics-card-head">
                              <div className="analytics-card-title-block">
                                <span className="analytics-card-kicker">
                                  Quality
                                </span>
                                <h4 className="analytics-card-title">
                                  Rejection reason frequency
                                </h4>
                              </div>
                              <span className="analytics-card-meta">
                                {analytics.rejectionReasonCount} distinct reason
                                {analytics.rejectionReasonCount === 1
                                  ? ""
                                  : "s"}
                              </span>
                            </div>
                            <AnalyticsBar
                              data={analytics.topRejectionReasons}
                              total={analytics.byStatus?.REJECTED || 0}
                              colorVar="var(--danger)"
                            />
                          </div>
                        )}

                      </div>
                    );
                  })()
                )}
              </section>
            )}

            {adminTab === "register" && (
              <section className="checklist-block manifest-block">
                <div className="checklist-block-head">
                  <h3>Import Previous Manifest</h3>
                  <p>
                    Upload an older manifest workbook. The browser will display
                    the full sheet so you can tick the exact rows to import into
                    the database.
                  </p>
                </div>
                <div className="manifest-upload-shell">
                  <input
                    ref={manifestFileInputRef}
                    className="visually-hidden"
                    type="file"
                    accept=".xlsx,.xls"
                    multiple
                    onChange={handleManifestFileChange}
                    tabIndex={-1}
                  />
                  <div
                    className={`manifest-dropzone ${isManifestDragActive ? "is-active" : ""} ${
                      manifestImportFileNames.length ? "has-file" : ""
                    }`.trim()}
                    role="button"
                    tabIndex={0}
                    onClick={openManifestPicker}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openManifestPicker();
                      }
                    }}
                    onDragEnter={handleManifestDragEnter}
                    onDragOver={handleManifestDragOver}
                    onDragLeave={handleManifestDragLeave}
                    onDrop={handleManifestDrop}
                    aria-label="Upload manifest workbook"
                  >
                    <span className="manifest-dropzone-badge">
                      <span className="dropzone-icon" aria-hidden="true">
                        ↑
                      </span>
                      Excel Manifest
                    </span>
                    <div className="manifest-dropzone-copy">
                      <strong>
                        {manifestImportFileNames.length
                          ? "Add more workbooks"
                          : "Drop manifest workbooks here"}
                      </strong>
                      <p>
                        Drag and drop a `.xlsx` or `.xls` file, or click
                        anywhere in this panel to browse.
                      </p>
                    </div>
                    <div className="manifest-dropzone-footer">
                      <span className="manifest-dropzone-file">
                        {manifestImportFileNames.length
                          ? manifestImportFileNames.join(", ")
                          : "No workbooks selected"}
                      </span>
                      <div className="manifest-dropzone-actions">
                        <button
                          className="secondary-button"
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            openManifestPicker();
                          }}
                        >
                          Choose Workbook
                        </button>
                        <button
                          className="ghost-button"
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            resetManifestImportState();
                          }}
                          disabled={
                            !manifestImportFileNames.length ||
                            isManifestImporting
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="manifest-import-stats">
                  <div className="import-stat">
                    <span className="import-stat-label">Files</span>
                    <strong className="import-stat-value">
                      {manifestImportFileNames.length
                        ? manifestImportFileNames.join(", ")
                        : "No files selected"}
                    </strong>
                  </div>
                  <div className="import-stat">
                    <span className="import-stat-label">Rows Parsed</span>
                    <strong className="import-stat-value">
                      {manifestImportRows.length}
                    </strong>
                  </div>
                  <div className="import-stat">
                    <span className="import-stat-label">Valid Rows</span>
                    <strong className="import-stat-value">
                      {manifestImportValidRowCount}
                    </strong>
                  </div>
                  <div className="import-stat">
                    <span className="import-stat-label">Selected</span>
                    <strong className="import-stat-value">
                      {manifestImportSelectedRows.length}
                    </strong>
                  </div>
                  <div className="import-stat">
                    <span className="import-stat-label">Columns</span>
                    <strong className="import-stat-value">
                      {manifestImportDisplayHeaders.length}
                    </strong>
                  </div>
                </div>
                <div className="manifest-legend">
                  <div className="manifest-legend-item">
                    <span className="status-pill status-ready">Ready</span>
                    <span className="manifest-legend-copy">
                      Valid row available for selection
                    </span>
                  </div>
                  <div className="manifest-legend-item">
                    <span className="status-pill status-selected">
                      Selected
                    </span>
                    <span className="manifest-legend-copy">
                      Queued for import into the register
                    </span>
                  </div>
                  <div className="manifest-legend-item">
                    <span className="status-pill status-invalid">
                      Needs attention
                    </span>
                    <span className="manifest-legend-copy">
                      Contains header or data issues
                    </span>
                  </div>
                  <div className="manifest-legend-item">
                    <span className="status-pill status-imported">
                      Imported
                    </span>
                    <span className="manifest-legend-copy">
                      Already saved to the database
                    </span>
                  </div>
                </div>
                <div className="manifest-import-cta">
                  <button
                    className="secondary-button"
                    type="button"
                    disabled={
                      !manifestImportSelectedRows.length || isManifestImporting
                    }
                    onClick={handleManifestImport}
                  >
                    {isManifestImporting
                      ? "Importing..."
                      : `Import Selected (${manifestImportSelectedRows.length})`}
                  </button>
                  {manifestImportRows.length ? (
                    <div className="manifest-import-actions">
                      <button
                        className="ghost-button"
                        type="button"
                        onClick={() => setManifestSelection("all")}
                        disabled={!manifestImportValidRowCount}
                      >
                        Select All Valid
                      </button>
                      <button
                        className="ghost-button"
                        type="button"
                        onClick={() => setManifestSelection("none")}
                        disabled={!manifestImportRows.length}
                      >
                        Clear Selection
                      </button>
                      {hasImportedManifestRows ? (
                        <button
                          className="ghost-button"
                          type="button"
                          onClick={resetManifestImportState}
                          disabled={isManifestImporting}
                        >
                          Clear Uploads
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                {manifestImportRows.length ? (
                  <>
                    <div className="table-scroll manifest-import-scroll">
                      <table className="data-table manifest-import-table">
                        <thead>
                          <tr>
                            <th style={{ width: "48px" }}>Approve</th>
                            <th style={{ width: "72px" }}>Row</th>
                            {manifestImportDisplayHeaders.map((header) => (
                              <th key={header}>{header}</th>
                            ))}
                            <th style={{ width: "170px" }}>Import Status</th>
                            <th style={{ width: "260px" }}>Issues</th>
                          </tr>
                        </thead>
                        <tbody>
                          {manifestImportRows.map((entry) => {
                            const isInvalid = entry.issues.length > 0;
                            const canSelect = !isInvalid && !entry.imported;

                            return (
                              <tr
                                key={entry.id}
                                className={`manifest-import-row ${
                                  isInvalid ? "is-invalid" : ""
                                } ${entry.imported ? "is-imported" : ""} ${
                                  entry.selected && !entry.imported
                                    ? "is-selected"
                                    : ""
                                }`.trim()}
                              >
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={entry.selected}
                                    disabled={!canSelect || isManifestImporting}
                                    onChange={(event) =>
                                      toggleManifestRowSelection(
                                        entry.id,
                                        event.target.checked,
                                      )
                                    }
                                  />
                                </td>
                                <td>{entry.rowNumber}</td>
                                {manifestImportDisplayHeaders.map((header) => (
                                  <td key={`${entry.id}-${header}`}>
                                    {entry.values[header] || ""}
                                  </td>
                                ))}
                                <td>
                                  <span
                                    className={`status-pill ${
                                      entry.imported
                                        ? "status-imported"
                                        : isInvalid
                                          ? "status-invalid"
                                          : entry.selected
                                            ? "status-selected"
                                            : "status-ready"
                                    }`}
                                  >
                                    {entry.imported
                                      ? "Imported"
                                      : isInvalid
                                        ? "Needs attention"
                                        : entry.selected
                                          ? "Selected"
                                          : "Ready"}
                                  </span>
                                </td>
                                <td>
                                  {entry.issues.join("; ") || "No issues"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : null}
                <p
                  className={`feedback ${manifestImportFeedback.type || ""}`.trim()}
                  aria-live="polite"
                >
                  {manifestImportFeedback.message}
                </p>
              </section>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-brand">
            <img
              className="app-logo"
              src="/logo.png"
              alt="ProgrammoCeuticals logo"
            />
            <div className="app-brand-copy">
              <h1 className="app-brand-title">
                {isAdminRoute
                  ? "Samples Admin"
                  : isGuideRoute
                    ? "Sampling Guide"
                    : "Samples"}
              </h1>
              <span className="app-brand-tagline">
                {submissionDetailMatch
                  ? "Submission detail"
                  : isAdminRoute
                    ? "Private admin portal for checklist review and exports"
                    : isGuideRoute
                      ? "Calculate sampling quantity from the NAFDAC Laboratory Sampling Guide 2023"
                      : "Digital checklist workflow for laboratory sample receiving"}
              </span>
            </div>
          </div>
          <div className="header-meta">
            <span className="pill">NAFDAC</span>
            <span className="pill pill-muted">DR&amp;RA Templates</span>
            {!isGuideRoute ? (
              <a className="pill pill-nav" href="/guide">
                Sampling Guide
              </a>
            ) : (
              <a className="pill pill-nav" href="/">
                Submission Form
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        {isGuideRoute ? (
          <SamplingGuideCalculator
            samplingGuideProducts={samplingGuideProducts}
          />
        ) : submissionDetailMatch ? (
          adminToken ? (
            renderSubmissionDetailPage()
          ) : (
            renderAdminLogin()
          )
        ) : isAdminRoute ? (
          adminToken ? (
            renderAdminConsole()
          ) : (
            renderAdminLogin()
          )
        ) : (
          renderPublicContent()
        )}
      </main>
      {exportModalOpen && (
        <div
          className="export-modal-overlay"
          onClick={() => setExportModalOpen(false)}
        >
          <div className="export-modal" onClick={(e) => e.stopPropagation()}>
            <div className="export-modal-head">
              <h3>Choose Export Columns</h3>
              <p>
                Manifest columns are selected by default. Check or uncheck as
                needed.
              </p>
            </div>
            <div className="export-modal-body">
              <div className="export-modal-group">
                <div className="export-modal-group-label">Manifest Columns</div>
                {EXPORT_COLUMN_DEFS.filter((c) => c.default).map((col) => (
                  <label key={col.header} className="export-modal-col-row">
                    <input
                      type="checkbox"
                      checked={exportSelectedCols.has(col.header)}
                      onChange={() => {
                        setExportSelectedCols((prev) => {
                          const next = new Set(prev);
                          next.has(col.header)
                            ? next.delete(col.header)
                            : next.add(col.header);
                          return next;
                        });
                      }}
                    />
                    {col.header}
                  </label>
                ))}
              </div>
              <div className="export-modal-group">
                <div className="export-modal-group-label">
                  Additional Columns
                </div>
                {EXPORT_COLUMN_DEFS.filter((c) => !c.default).map((col) => (
                  <label key={col.header} className="export-modal-col-row">
                    <input
                      type="checkbox"
                      checked={exportSelectedCols.has(col.header)}
                      onChange={() => {
                        setExportSelectedCols((prev) => {
                          const next = new Set(prev);
                          next.has(col.header)
                            ? next.delete(col.header)
                            : next.add(col.header);
                          return next;
                        });
                      }}
                    />
                    {col.header}
                  </label>
                ))}
              </div>
            </div>
            <div className="export-modal-footer">
              <button
                className="ghost-button"
                type="button"
                onClick={() => setExportModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="primary-button"
                type="button"
                disabled={exportSelectedCols.size === 0}
                onClick={handleExportModalConfirm}
              >
                Download Excel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
