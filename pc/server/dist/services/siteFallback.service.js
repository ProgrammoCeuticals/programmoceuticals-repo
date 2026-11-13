import { normalizeText } from "../utils/textNormalize.js";
const siteHeadingPattern = /(inspected\s+site|manufacturing\s+site|name\s+and\s+address|manufacturer|facility\s+name|site\s+address)/i;
export function extractSiteDetailsFromText(text) {
    const lines = normalizeText(text)
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    const headingIndex = lines.findIndex((line) => siteHeadingPattern.test(line));
    if (headingIndex === -1)
        return { facilityName: "", address: "" };
    const window = lines
        .slice(headingIndex, headingIndex + 12)
        .map(removeFieldLabel)
        .filter(Boolean)
        .filter((line) => !isNoiseLine(line));
    const facilityName = window.find(isLikelyCompanyName) ?? "";
    const facilityIndex = facilityName ? window.indexOf(facilityName) : -1;
    const address = facilityIndex >= 0 ? window.slice(facilityIndex + 1, facilityIndex + 5).filter(isLikelyAddressLine).join("\n") : "";
    return {
        facilityName,
        address: normalizeText(address)
    };
}
export function mergeSiteDetails(extracted, heuristic, registryMatch) {
    const registrySite = registryMatch.isKnownPharmaCompany
        ? {
            facilityName: registryMatch.matchedCompany ?? "",
            address: registryMatch.matchedAddress ?? ""
        }
        : { facilityName: "", address: "" };
    return {
        facilityName: extracted.facilityName || heuristic.facilityName || registrySite.facilityName,
        address: extracted.address || heuristic.address || registrySite.address
    };
}
function removeFieldLabel(line) {
    return line
        .replace(/^(inspected\s+site\(s\)|inspected\s+site|manufacturing\s+site|name\s+and\s+address\s+of\s+.+?|manufacturer|facility\s+name|site\s+address)\s*[:\-–—]?\s*/i, "")
        .trim();
}
function isNoiseLine(line) {
    return /^(page \d+|confidential|do not photocopy|inspection details|date of inspection|type of inspection)$/i.test(line);
}
function isLikelyCompanyName(line) {
    return /\b(limited|ltd|pharma|pharmaceutical|laborator|biotech|therapeutics|healthcare|formulations|industries|inc|company|co\.)\b/i.test(line);
}
function isLikelyAddressLine(line) {
    if (/^(phone|tel|email|website|corporate office)\b/i.test(line))
        return false;
    return /(\d|road|street|plot|zone|village|district|city|state|province|india|china|france|germany|pakistan|bangladesh|usa|uk)/i.test(line);
}
