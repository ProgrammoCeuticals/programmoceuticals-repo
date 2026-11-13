import type { ReportClassification } from "../types/report.types.js";

const pharmaSignals = [
  "tablet",
  "capsule",
  "oral liquid",
  "suspension",
  "injection",
  "sterile product",
  "api",
  "active pharmaceutical ingredient",
  "finished pharmaceutical product",
  "drug product",
  "pharmaceutical manufacturing",
  "granulation",
  "compression",
  "coating",
  "blending",
  "dispensing",
  "pharmaceutical quality system"
];

const deviceSignals = [
  "medical device",
  "ivd",
  "iso 13485",
  "device master record",
  "device history record",
  "unique device identification",
  "udi",
  "design controls",
  "cannula",
  "catheter",
  "infusion set",
  "transfusion set",
  "hypodermic needle",
  "ghtf"
];

export function classifyReport(text: string): ReportClassification {
  const normalized = text.toLowerCase();
  const matchedPharma = pharmaSignals.filter((signal) => containsSignal(normalized, signal));
  const matchedDevice = deviceSignals.filter((signal) => containsSignal(normalized, signal));
  const difference = Math.abs(matchedPharma.length - matchedDevice.length);

  if (matchedDevice.length >= matchedPharma.length + 3) {
    return {
      likelyType: "Medical Device/IVD GMP",
      confidence: difference >= 6 ? "High" : "Medium",
      matchedSignals: [...matchedDevice, ...matchedPharma]
    };
  }

  if (matchedPharma.length >= matchedDevice.length + 3) {
    return {
      likelyType: "Pharmaceutical GMP",
      confidence: difference >= 6 ? "High" : "Medium",
      matchedSignals: [...matchedPharma, ...matchedDevice]
    };
  }

  return {
    likelyType: "Unknown / Needs Review",
    confidence: matchedPharma.length || matchedDevice.length ? "Low" : "Low",
    matchedSignals: [...matchedPharma, ...matchedDevice]
  };
}

function containsSignal(text: string, signal: string): boolean {
  if (/^[a-z0-9 ]+$/.test(signal)) {
    const pattern = new RegExp(`\\b${signal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    return pattern.test(text);
  }

  return text.includes(signal.toLowerCase());
}
