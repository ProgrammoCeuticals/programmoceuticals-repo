/**
 * EctdXmlSerializer — spec §21, §23.
 *
 * Serializes an EctdMessageXml object to XML string.
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  REGULATORY_GAP — CRITICAL                                      ║
 * ║                                                                  ║
 * ║  This serializer uses PLACEHOLDER element names and attribute   ║
 * ║  structures. The authoritative element names, namespace prefixes,║
 * ║  attribute names, fixed values, and canonical ordering MUST come║
 * ║  from the official ICH eCTD v4.0 IG v1.7 and schema package.  ║
 * ║                                                                  ║
 * ║  The serializer BLOCKS output when namespaces have not been     ║
 * ║  resolved from the official package (fail closed — spec §4.5). ║
 * ║                                                                  ║
 * ║  To activate full serialization:                                ║
 * ║   1. Import ICH IG v1.7 package (Phase 2).                     ║
 * ║   2. Parse XSD to resolve namespace URIs.                       ║
 * ║   3. Map XML object fields to confirmed element names.          ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Determinism (spec §23):
 *   - Attributes and elements are emitted in a fixed order.
 *   - Collections are sorted by a stable key before serialization.
 *   - No random or time-based values unless explicitly required.
 */

import type {
  EctdMessageXml,
  ContextOfUseXml,
  KeywordXml,
  SubmissionXml,
  ApplicationXml,
  DocumentXml,
} from "../model/xml-model.types";
import type {
  XmlSerializer,
  SerializationOptions,
  SerializationResult,
} from "./xml-serializer.interface";
import { EctdXmlNamespaceRegistry } from "../namespace/xml-namespace-registry";

export class EctdXmlSerializer implements XmlSerializer {
  constructor(private readonly namespaceRegistry: EctdXmlNamespaceRegistry) {}

  serialize(
    message: EctdMessageXml,
    options: SerializationOptions = {},
  ): SerializationResult {
    const warnings: string[] = [];

    // ── Fail closed if namespaces are not resolved — spec §4.5 ──────────
    const unresolved = this.namespaceRegistry.getUnresolvedNamespaces();
    if (unresolved.length > 0) {
      throw new Error(
        `XmlSerializer: Cannot serialize — the following namespaces have ` +
          `REGULATORY_GAP placeholders (not yet resolved from the official ` +
          `ICH schema package): ${unresolved.join(", ")}. ` +
          `Import and activate the ICH IG v1.7 package first.`,
      );
    }

    // All namespaces resolved — proceed with serialization
    // Check for any remaining REGULATORY_GAP placeholders in the message.
    // If found, block serialization — do not produce partial/placeholder XML.
    const messageStr = JSON.stringify(message);
    if (messageStr.includes("REGULATORY_GAP")) {
      throw new Error(
        "XmlSerializer: Cannot serialize — the XML message contains " +
          "REGULATORY_GAP placeholder values. These must be resolved from " +
          "the official ICH IG v1.7 package before XML can be generated. " +
          "Do not produce XML with invented element names, codes, or OIDs.",
      );
    }

    const indent = options.pretty ? "  " : "";
    const nl = options.pretty ? "\n" : "";
    const encoding = options.encoding ?? "UTF-8";

    const lines: string[] = [];

    if (options.includeXmlDeclaration !== false) {
      lines.push(`<?xml version="1.0" encoding="${encoding}"?>`);
    }

    // Root element — REGULATORY_GAP: element name from IG v1.7
    const hl7Ns = this.namespaceRegistry.get("HL7V3");
    const xsiNs = this.namespaceRegistry.get("XSI");

    lines.push(
      `<PORX_IN000001UV01 xmlns="${hl7Ns}"` +
        ` xmlns:xsi="${xsiNs}"` +
        ` ITSVersion="XML_1.0"` +
        `>`,
    );
    // REGULATORY_GAP: ITSVersion, profileId, interactionId values from IG v1.7

    // Message id
    lines.push(
      `${indent}<id root="${escapeXml(message.id.root)}"${message.id.extension ? ` extension="${escapeXml(message.id.extension)}"` : ""}/>`,
    );

    // Creation time
    lines.push(
      `${indent}<creationTime value="${escapeXml(message.creationTime.value)}"/>`,
    );

    // Interaction ID — REGULATORY_GAP: code/codeSystem from IG v1.7
    lines.push(
      `${indent}<interactionId root="${escapeXml(message.interactionId.codeSystem)}"` +
        ` extension="${escapeXml(message.interactionId.code)}"/>`,
    );

    // Sender
    lines.push(`${indent}<sender>${nl}`);
    lines.push(`${indent}${indent}<device>${nl}`);
    lines.push(
      `${indent}${indent}${indent}<id root="${escapeXml(message.header.sender.id.root)}"${message.header.sender.id.extension ? ` extension="${escapeXml(message.header.sender.id.extension)}"` : ""}/>`,
    );
    if (message.header.sender.name) {
      lines.push(
        `${indent}${indent}${indent}<name>${escapeXml(message.header.sender.name.value)}</name>`,
      );
    }
    lines.push(`${indent}${indent}</device>${nl}`);
    lines.push(`${indent}</sender>`);

    // ControlActProcess — REGULATORY_GAP: moodCode, classCode from IG v1.7
    lines.push(
      `${indent}<controlActProcess moodCode="${escapeXml(message.controlActProcess.moodCode)}">`,
    );
    lines.push(`${indent}${indent}<subject>`);

    // SubmissionUnit
    const su = message.controlActProcess.subject.submissionUnit;
    lines.push(
      `${indent}${indent}${indent}<submissionUnit><!-- REGULATORY_GAP: element name from IG v1.7 -->`,
    );
    lines.push(
      `${indent}${indent}${indent}${indent}<id root="${escapeXml(su.id.root)}"${su.id.extension ? ` extension="${escapeXml(su.id.extension)}"` : ""}/>`,
    );
    lines.push(
      `${indent}${indent}${indent}${indent}<sequenceNumber value="${su.sequenceNumber}"/><!-- REGULATORY_GAP: element/attr from IG v1.7 -->`,
    );

    // ContextsOfUse — sorted deterministically by ID for spec §23
    const sortedCous = [...su.contextsOfUse].sort((a, b) =>
      a.id.root.localeCompare(b.id.root),
    );
    for (const cou of sortedCous) {
      lines.push(
        ...this.serializeContextOfUse(
          cou,
          indent + indent + indent + indent,
          nl,
        ),
      );
    }

    lines.push(`${indent}${indent}${indent}</submissionUnit>`);

    // Submissions
    for (const sub of [...message.controlActProcess.subject.submissions].sort(
      (a, b) => a.id.root.localeCompare(b.id.root),
    )) {
      lines.push(
        ...this.serializeSubmission(sub, indent + indent + indent, nl),
      );
    }

    // Applications
    for (const app of [...message.controlActProcess.subject.applications].sort(
      (a, b) => a.id.root.localeCompare(b.id.root),
    )) {
      lines.push(
        ...this.serializeApplication(app, indent + indent + indent, nl),
      );
    }

    lines.push(`${indent}${indent}</subject>`);
    lines.push(`${indent}</controlActProcess>`);
    lines.push(
      `</PORX_IN000001UV01><!-- REGULATORY_GAP: root element name from IG v1.7 -->`,
    );

    return {
      xml: lines.join(nl),
      warnings,
    };
  }

  private serializeContextOfUse(
    cou: ContextOfUseXml,
    indent: string,
    nl: string,
  ): string[] {
    const lines: string[] = [];
    lines.push(
      `${indent}<contextOfUse><!-- REGULATORY_GAP: element name from IG v1.7 -->`,
    );
    lines.push(
      `${indent}  <id root="${escapeXml(cou.id.root)}"${cou.id.extension ? ` extension="${escapeXml(cou.id.extension)}"` : ""}/>`,
    );
    lines.push(
      `${indent}  <code code="${escapeXml(cou.code.code)}" codeSystem="${escapeXml(cou.code.codeSystem)}"${cou.code.displayName ? ` displayName="${escapeXml(cou.code.displayName)}"` : ""}/>`,
    );

    if (cou.statusCode) {
      lines.push(
        `${indent}  <statusCode code="${escapeXml(cou.statusCode.code)}"/><!-- REGULATORY_GAP: status representation from IG v1.7 -->`,
      );
    }

    // Keywords — sorted by code for determinism
    const sortedKws = [...cou.keywords].sort((a, b) =>
      a.code.code.localeCompare(b.code.code),
    );
    for (const kw of sortedKws) {
      lines.push(...this.serializeKeyword(kw, indent + "  ", nl));
    }

    if (cou.replacementOf) {
      lines.push(
        `${indent}  <replacementOf><!-- REGULATORY_GAP: element name from IG v1.7 -->`,
      );
      lines.push(
        `${indent}    <contextOfUse><id root="${escapeXml(cou.replacementOf.contextOfUse.id.root)}"/></contextOfUse>`,
      );
      lines.push(`${indent}  </replacementOf>`);
    }

    lines.push(`${indent}</contextOfUse>`);
    return lines;
  }

  private serializeKeyword(
    kw: KeywordXml,
    indent: string,
    _nl: string,
  ): string[] {
    return [
      `${indent}<keyword><!-- REGULATORY_GAP: element/structure from IG v1.7 -->`,
      `${indent}  <code code="${escapeXml(kw.code.code)}" codeSystem="${escapeXml(kw.code.codeSystem)}"/>`,
      `${indent}  <value>${escapeXml(kw.value.value)}</value>`,
      `${indent}</keyword>`,
    ];
  }

  private serializeSubmission(
    sub: SubmissionXml,
    indent: string,
    _nl: string,
  ): string[] {
    const lines: string[] = [
      `${indent}<submission><!-- REGULATORY_GAP: element name from IG v1.7 -->`,
      `${indent}  <id root="${escapeXml(sub.id.root)}"${sub.id.extension ? ` extension="${escapeXml(sub.id.extension)}"` : ""}/>`,
    ];
    if (sub.code) {
      lines.push(
        `${indent}  <code code="${escapeXml(sub.code.code)}" codeSystem="${escapeXml(sub.code.codeSystem)}"/>`,
      );
    }
    lines.push(`${indent}</submission>`);
    return lines;
  }

  private serializeApplication(
    app: ApplicationXml,
    indent: string,
    _nl: string,
  ): string[] {
    const lines: string[] = [
      `${indent}<application><!-- REGULATORY_GAP: element name from IG v1.7 -->`,
      `${indent}  <id root="${escapeXml(app.id.root)}"${app.id.extension ? ` extension="${escapeXml(app.id.extension)}"` : ""}/>`,
    ];
    if (app.code) {
      lines.push(
        `${indent}  <code code="${escapeXml(app.code.code)}" codeSystem="${escapeXml(app.code.codeSystem)}"/>`,
      );
    }
    if (app.applicationNumber) {
      lines.push(
        `${indent}  <id extension="${escapeXml(app.applicationNumber.value)}"/><!-- REGULATORY_GAP: application number element from IG v1.7 -->`,
      );
    }
    lines.push(`${indent}</application>`);
    return lines;
  }
}

/**
 * Escape XML special characters.
 * Deterministic — applies to all string values before emission.
 */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
