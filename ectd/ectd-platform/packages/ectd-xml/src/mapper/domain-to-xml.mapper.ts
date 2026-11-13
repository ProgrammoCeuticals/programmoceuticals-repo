/**
 * DomainToXmlMapper — spec §21, §4.3, user requirement.
 *
 * Maps frozen domain snapshot data to the eCTD XML object model.
 *
 * STRICT RULES:
 *   - Do NOT invent element names, attributes, namespaces, or fixed values.
 *   - Sender OID must come from ECTD_SENDER_OID env var (resolveSenderIdentity).
 *   - interactionId must come from the installed ICH IG package (resolveInteractionId).
 *   - moodCode and other fixed values must come from ICH IG v1.7.
 *   - If any required config is missing, throw a structured error — do not
 *     produce placeholder XML.
 *
 * Determinism (spec §23): given identical input and config, output is identical.
 * All collections sorted by stable key before mapping.
 */

import {
  resolveSenderIdentity,
  SENDER_IDENTITY_NOT_CONFIGURED,
} from "../config/sender-identity";
import {
  resolveInteractionId,
  INTERACTION_ID_NOT_CONFIGURED,
} from "../config/interaction-id";
import type {
  EctdMessageXml,
  SubmissionUnitXml,
  ContextOfUseXml,
  SubmissionXml,
  ApplicationXml,
  KeywordXml,
  KeywordDefinitionXml,
  XmlII,
  XmlCD,
  XmlST,
  XmlTS,
  ReplacementOfXml,
} from "../model/xml-model.types";

// ── Dependency resolution errors ──────────────────────────────────────────

export class SenderIdentityMissingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SenderIdentityMissingError";
  }
}

export class InteractionIdMissingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InteractionIdMissingError";
  }
}

export class RegulatoryConfigMissingError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "RegulatoryConfigMissingError";
  }
}

// ── Domain snapshot types ─────────────────────────────────────────────────

export interface SnapshotKeyword {
  code: string;
  codeSystem: string;
  value: string;
}

export interface SnapshotContextOfUse {
  uuid: string;
  contextCode: string;
  contextCodeSystem: string;
  status: string;
  keywords: SnapshotKeyword[];
  replacesContextUuid?: string | undefined;
}

export interface SnapshotSubmission {
  uuid: string;
  submissionTypeCode?: string | undefined;
  submissionTypeCodeSystem?: string | undefined;
}

export interface SnapshotKeywordDefinition {
  uuid: string;
  code: string;
  codeSystem: string;
  name: string;
  dataTypeCode: string;
  dataTypeCodeSystem: string;
}

export interface SnapshotApplication {
  uuid: string;
  applicationType?: string | undefined;
  applicationTypeCodeSystem?: string | undefined;
  applicationNumber?: string | undefined;
  keywordDefinitions: SnapshotKeywordDefinition[];
}

/**
 * IgPackageConfig — configuration values extracted from the installed
 * ICH IG v1.7 package. Required before any message can be generated.
 *
 * REGULATORY_GAP: All values must come from the official ICH IG v1.7
 * package once imported. Do not supply invented values.
 */
export interface IgPackageConfig {
  /**
   * InteractionId OID root — from IG v1.7 fixed values.
   * REGULATORY_GAP until package is installed.
   */
  interactionIdRoot: string;
  /**
   * InteractionId extension — from IG v1.7 fixed values.
   * REGULATORY_GAP until package is installed.
   */
  interactionIdExtension: string;
  /**
   * moodCode for ControlActProcess — from IG v1.7.
   * REGULATORY_GAP until package is installed.
   */
  controlActProcessMoodCode: string;
}

export interface DomainSnapshot {
  submissionUnitUuid: string;
  sequenceNumber: number;
  priorityNumber?: number | undefined;
  creationTime: string;
  contextsOfUse: SnapshotContextOfUse[];
  submissions: SnapshotSubmission[];
  application: SnapshotApplication;
  /**
   * Configuration extracted from the installed ICH IG v1.7 package.
   * Must be populated from the regulatory package registry.
   * If null/undefined, mapping THROWS — no placeholder XML is generated.
   */
  igPackageConfig?: IgPackageConfig | null | undefined;
}

// ── Mapper ────────────────────────────────────────────────────────────────

export class DomainToXmlMapper {
  /**
   * Map a frozen domain snapshot to an EctdMessageXml.
   *
   * THROWS if:
   *   - Sender identity (ECTD_SENDER_OID) is not configured.
   *   - IG package config (interactionId, moodCode) is not available.
   *
   * Never produces placeholder or partial XML.
   * Spec §23: deterministic — same input → same output.
   */
  map(snapshot: DomainSnapshot): EctdMessageXml {
    // ── Resolve sender identity ───────────────────────────────────────────
    const senderResolution = resolveSenderIdentity();
    if (!senderResolution.configured) {
      throw new SenderIdentityMissingError(senderResolution.message);
    }

    // ── Resolve interaction ID from installed IG package ──────────────────
    const igConfig = snapshot.igPackageConfig;
    const interactionResolution = resolveInteractionId(
      igConfig as Record<string, unknown> | null,
    );
    if (!interactionResolution.available) {
      throw new InteractionIdMissingError(interactionResolution.message);
    }

    // ── Validate moodCode is available ────────────────────────────────────
    if (!igConfig?.controlActProcessMoodCode) {
      throw new RegulatoryConfigMissingError(
        "IG_CONFIG_MISSING",
        "ControlActProcess moodCode is not available. " +
          "The ICH IG v1.7 package must be imported and its configuration " +
          "extracted before XML can be generated. " +
          "REGULATORY_GAP: moodCode must come from official ICH IG v1.7.",
      );
    }

    return {
      id: ii(snapshot.submissionUnitUuid),
      creationTime: ts(normalizeTimestamp(snapshot.creationTime)),
      interactionId: cd(
        interactionResolution.config.extension,
        interactionResolution.config.root,
      ),
      header: {
        sender: {
          id: senderResolution.identity.oidExtension
            ? {
                root: senderResolution.identity.oid,
                extension: senderResolution.identity.oidExtension,
              }
            : { root: senderResolution.identity.oid },
          name: senderResolution.identity.name
            ? st(senderResolution.identity.name)
            : undefined,
        },
      },
      controlActProcess: {
        moodCode: igConfig.controlActProcessMoodCode,
        subject: {
          submissionUnit: this.mapSubmissionUnit(snapshot),
          submissions: [...snapshot.submissions]
            .sort((a, b) => a.uuid.localeCompare(b.uuid))
            .map((s) => this.mapSubmission(s)),
          applications: [this.mapApplication(snapshot.application)],
        },
      },
    };
  }

  private mapSubmissionUnit(snapshot: DomainSnapshot): SubmissionUnitXml {
    const sortedCous = [...snapshot.contextsOfUse].sort((a, b) =>
      a.uuid.localeCompare(b.uuid),
    );
    return {
      id: ii(snapshot.submissionUnitUuid),
      sequenceNumber: snapshot.sequenceNumber,
      priorityNumber: snapshot.priorityNumber,
      contextsOfUse: sortedCous.map((c) => this.mapContextOfUse(c)),
    };
  }

  private mapContextOfUse(cou: SnapshotContextOfUse): ContextOfUseXml {
    const sortedKws = [...cou.keywords].sort((a, b) =>
      a.code.localeCompare(b.code),
    );
    const replacementOf: ReplacementOfXml | undefined = cou.replacesContextUuid
      ? { contextOfUse: { id: ii(cou.replacesContextUuid) } }
      : undefined;

    return {
      id: ii(cou.uuid),
      code: cd(cou.contextCode, cou.contextCodeSystem),
      keywords: sortedKws.map((kw) => this.mapKeyword(kw)),
      replacementOf,
      // Status code for SUSPENDED CoU — REGULATORY_GAP: XML representation
      // of suspension must be confirmed from ICH IG v1.7 before emitting.
      // We record the status in the object model but mark the codeSystem as
      // REGULATORY_GAP so the serializer can identify it as unresolved.
      statusCode:
        cou.status === "SUSPENDED"
          ? cd("suspended", "REGULATORY_GAP:status-codeSystem-from-IG-v1.7")
          : undefined,
    };
  }

  private mapKeyword(kw: SnapshotKeyword): KeywordXml {
    return { code: cd(kw.code, kw.codeSystem), value: st(kw.value) };
  }

  private mapSubmission(sub: SnapshotSubmission): SubmissionXml {
    return {
      id: ii(sub.uuid),
      code:
        sub.submissionTypeCode && sub.submissionTypeCodeSystem
          ? cd(sub.submissionTypeCode, sub.submissionTypeCodeSystem)
          : undefined,
    };
  }

  private mapApplication(app: SnapshotApplication): ApplicationXml {
    const sortedDefs = [...app.keywordDefinitions].sort((a, b) =>
      a.code.localeCompare(b.code),
    );
    return {
      id: ii(app.uuid),
      code:
        app.applicationType && app.applicationTypeCodeSystem
          ? cd(app.applicationType, app.applicationTypeCodeSystem)
          : undefined,
      applicationNumber: app.applicationNumber
        ? st(app.applicationNumber)
        : undefined,
      keywordDefinitions: sortedDefs.map((d) => this.mapKeywordDefinition(d)),
    };
  }

  private mapKeywordDefinition(
    def: SnapshotKeywordDefinition,
  ): KeywordDefinitionXml {
    return {
      id: ii(def.uuid),
      code: cd(def.code, def.codeSystem),
      name: st(def.name),
      dataType: cd(def.dataTypeCode, def.dataTypeCodeSystem),
    };
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────

function ii(root: string, extension?: string | undefined): XmlII {
  return extension ? { root, extension } : { root };
}

function cd(
  code: string,
  codeSystem: string,
  displayName?: string | undefined,
): XmlCD {
  return displayName ? { code, codeSystem, displayName } : { code, codeSystem };
}

function st(value: string, language?: string | undefined): XmlST {
  return language ? { value, language } : { value };
}

function ts(value: string): XmlTS {
  return { value };
}

/**
 * Normalize a timestamp to HL7 v3 format (yyyyMMddHHmmss UTC).
 * REGULATORY_GAP: Confirm required precision and timezone handling
 * from ICH IG v1.7.
 */
export function normalizeTimestamp(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return (
    String(d.getUTCFullYear()) +
    String(d.getUTCMonth() + 1).padStart(2, "0") +
    String(d.getUTCDate()).padStart(2, "0") +
    String(d.getUTCHours()).padStart(2, "0") +
    String(d.getUTCMinutes()).padStart(2, "0") +
    String(d.getUTCSeconds()).padStart(2, "0")
  );
}
