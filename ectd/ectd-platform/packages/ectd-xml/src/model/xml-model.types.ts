/**
 * eCTD v4.0 XML object model — spec §21.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  REGULATORY_GAP — CRITICAL                                          ║
 * ║                                                                      ║
 * ║  The exact element names, attribute names, attribute cardinalities,  ║
 * ║  fixed values, message type OIDs, namespace URIs, schema locations, ║
 * ║  and controlled vocabulary codes used in the XML output MUST come   ║
 * ║  from:                                                               ║
 * ║    - ICH eCTD v4.0 Implementation Guide v1.7                        ║
 * ║    - ICH eCTD v4.0 Schema package (bundled with IG v1.7)            ║
 * ║    - ICH eCTD v4.0 Controlled Vocabulary Package v1.0.3             ║
 * ║                                                                      ║
 * ║  Do NOT infer element names or structure from:                       ║
 * ║    - Secondary articles, blog posts, or vendor documentation         ║
 * ║    - eCTD v3.2.2 structure (different version, different schema)     ║
 * ║    - Partial examples without a named authoritative source           ║
 * ║                                                                      ║
 * ║  Fields marked ?? below require the official package to confirm.    ║
 * ║  The serializer must refuse to generate XML when any required        ║
 * ║  field cannot be resolved from the authoritative package.            ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * These types represent the internal XML object model (not Prisma entities).
 * Spec §4.3: Prisma entities are not XML objects. The pipeline is:
 *   PostgreSQL/Prisma → repository → domain aggregate
 *   → regulatory resolver → eCTD XML model → serializer → XSD validation
 */

// ── Core identity types ───────────────────────────────────────────────────

/**
 * An II (Instance Identifier) in HL7 v3.
 * REGULATORY_GAP: Exact root OID and extension rules per entity type
 * must be verified against ICH IG v1.7.
 */
export interface XmlII {
  root: string;
  extension?: string | undefined;
}

/**
 * A CD (Coded) or CE (Coded with Equivalents) value.
 * REGULATORY_GAP: Valid code/codeSystem values must come from the
 * ICH CV Package v1.0.3 Genericode files.
 */
export interface XmlCD {
  code: string;
  codeSystem: string;
  displayName?: string | undefined;
}

/**
 * An ST (String) value with optional language.
 */
export interface XmlST {
  value: string;
  language?: string | undefined;
}

/**
 * A TS (Timestamp) — ISO 8601 format.
 * REGULATORY_GAP: Confirm timestamp format and precision requirements
 * from ICH IG v1.7.
 */
export interface XmlTS {
  value: string; // e.g. "20240101120000"
}

// ── XML Object types (spec §21) ───────────────────────────────────────────

/**
 * EctdMessage — the root element of a Submission Unit XML file.
 *
 * REGULATORY_GAP: The exact root element name, namespace, ITSVersion,
 * profileId, and interactionId must come from the ICH IG v1.7 schema.
 */
export interface EctdMessageXml {
  /**
   * REGULATORY_GAP: Exact message ID structure from IG v1.7.
   * Likely a UUID in II format.
   */
  id: XmlII;

  /**
   * REGULATORY_GAP: creationTime format from IG v1.7.
   */
  creationTime: XmlTS;

  /**
   * REGULATORY_GAP: HL7 interactionId for eCTD v4.0 from IG v1.7.
   * This is a fixed value defined in the IG.
   */
  interactionId: XmlCD;

  header: EctdMessageHeaderXml;
  controlActProcess: ControlActProcessXml;
}

/**
 * EctdMessageHeader — sender/receiver identification.
 *
 * REGULATORY_GAP: Exact structure of sender/receiver identification,
 * including required device/organization identifiers, comes from IG v1.7.
 */
export interface EctdMessageHeaderXml {
  /**
   * REGULATORY_GAP: Sender identification structure from IG v1.7.
   */
  sender: {
    id: XmlII;
    name?: XmlST | undefined;
  };

  /**
   * REGULATORY_GAP: Receiver (regulatory authority) identification.
   * Authority-specific — must come from regional IG.
   */
  receiver?:
    | {
        id: XmlII;
        name?: XmlST | undefined;
      }
    | undefined;
}

/**
 * ControlActProcess — wraps the regulatory submission content.
 *
 * REGULATORY_GAP: moodCode, classCode, and exact element nesting
 * must come from ICH IG v1.7.
 */
export interface ControlActProcessXml {
  /**
   * REGULATORY_GAP: moodCode value from IG v1.7 (likely "EVN").
   */
  moodCode: string;

  subject: ControlActSubjectXml;
}

export interface ControlActSubjectXml {
  submissionUnit: SubmissionUnitXml;
  submissions: SubmissionXml[];
  applications: ApplicationXml[];
}

/**
 * SubmissionUnitXml — the core unit being transmitted.
 *
 * REGULATORY_GAP: Exact classCode, moodCode, sequenceNumber element
 * name and format from ICH IG v1.7.
 */
export interface SubmissionUnitXml {
  id: XmlII;

  /**
   * REGULATORY_GAP: Sequence number element/attribute name from IG v1.7.
   */
  sequenceNumber: number;

  /**
   * REGULATORY_GAP: priorityNumber handling from IG v1.7.
   */
  priorityNumber?: number | undefined;

  contextsOfUse: ContextOfUseXml[];

  /**
   * REGULATORY_GAP: componentOf relationships from IG v1.7.
   */
  componentOf?: SubmissionComponentXml | undefined;
}

/**
 * ContextOfUseXml — assigns a document to a regulatory context.
 *
 * REGULATORY_GAP: All element/attribute names, lifecycle status
 * representation, and keyword element structure must come from IG v1.7.
 */
export interface ContextOfUseXml {
  id: XmlII;

  /**
   * REGULATORY_GAP: Context code element structure from IG v1.7.
   */
  code: XmlCD;

  /**
   * REGULATORY_GAP: Document reference structure from IG v1.7.
   * This is NOT the same as DocumentRelationship in the domain model.
   */
  document?: DocumentReferenceXml | undefined;

  keywords: KeywordXml[];

  /**
   * REGULATORY_GAP: How replacement is represented in XML from IG v1.7.
   */
  replacementOf?: ReplacementOfXml | undefined;

  /**
   * REGULATORY_GAP: How suspension is represented in XML from IG v1.7.
   * May be a status code attribute rather than a separate element.
   */
  relatedContextsOfUse?: RelatedContextOfUseXml[] | undefined;

  /**
   * REGULATORY_GAP: Status code representation in XML from IG v1.7.
   */
  statusCode?: XmlCD | undefined;
}

/**
 * DocumentReferenceXml — reference to a physical document.
 *
 * REGULATORY_GAP: The exact structure for referencing physical files
 * (document ID, version, hash, URL) from IG v1.7.
 */
export interface DocumentReferenceXml {
  id: XmlII;

  /**
   * REGULATORY_GAP: File reference/URL structure from IG v1.7.
   * Must be a relative path within the submission package.
   */
  reference?:
    | {
        value: string; // relative path, e.g. "m3/32p/32p1.pdf"
      }
    | undefined;

  /**
   * REGULATORY_GAP: Hash/checksum element from IG v1.7.
   */
  integrityCheck?:
    | {
        value: string;
        integrityCheckAlgorithm: string;
      }
    | undefined;
}

/**
 * ReplacementOfXml — lifecycle replacement pointer.
 *
 * REGULATORY_GAP: Exact element name and structure for replacement
 * from ICH IG v1.7.
 */
export interface ReplacementOfXml {
  /** The CoU being replaced */
  contextOfUse: { id: XmlII };
}

/**
 * RelatedContextOfUseXml — relationship to another CoU.
 *
 * REGULATORY_GAP: Element name, typeCode, and structure from IG v1.7.
 */
export interface RelatedContextOfUseXml {
  typeCode: string; // REGULATORY_GAP: valid typeCodes from IG v1.7
  contextOfUse: { id: XmlII };
}

/**
 * ReferencedByXml — back-reference.
 *
 * REGULATORY_GAP: Structure from IG v1.7.
 */
export interface ReferencedByXml {
  typeCode: string;
  document: { id: XmlII };
}

/**
 * KeywordXml — a single keyword assignment.
 *
 * REGULATORY_GAP: Keyword element structure from IG v1.7.
 */
export interface KeywordXml {
  code: XmlCD;
  value: XmlST;
}

/**
 * KeywordDefinitionXml — keyword definition within an Application.
 *
 * REGULATORY_GAP: Structure from IG v1.7.
 */
export interface KeywordDefinitionXml {
  id: XmlII;
  code: XmlCD;
  name: XmlST;
  dataType: XmlCD;
}

/**
 * SubmissionXml — regulatory submission (activity).
 *
 * REGULATORY_GAP: Exact classCode, moodCode, submissionType representation
 * from ICH IG v1.7.
 */
export interface SubmissionXml {
  id: XmlII;

  /**
   * REGULATORY_GAP: Submission type code structure from IG v1.7.
   */
  code?: XmlCD | undefined;
}

/**
 * SubmissionComponentXml — links SubmissionUnit to a Submission.
 *
 * REGULATORY_GAP: componentOf structure from IG v1.7.
 */
export interface SubmissionComponentXml {
  submission: { id: XmlII };
}

/**
 * ApplicationXml — the regulatory application.
 *
 * REGULATORY_GAP: Exact classCode, moodCode, applicationNumber element
 * structure, application type codes from ICH IG v1.7.
 */
export interface ApplicationXml {
  id: XmlII;

  /**
   * REGULATORY_GAP: Application type code structure from IG v1.7.
   */
  code?: XmlCD | undefined;

  /**
   * REGULATORY_GAP: Application number element name from IG v1.7.
   */
  applicationNumber?: XmlST | undefined;

  keywordDefinitions: KeywordDefinitionXml[];
}

/**
 * DocumentXml — document record within the message.
 *
 * REGULATORY_GAP: Exact structure, title element, language code handling,
 * MIME type representation from ICH IG v1.7.
 */
export interface DocumentXml {
  id: XmlII;
  title?: XmlST | undefined;

  /**
   * REGULATORY_GAP: MIME type representation from IG v1.7.
   */
  mimeType?: XmlCD | undefined;

  /**
   * REGULATORY_GAP: Language code element from IG v1.7.
   */
  languageCode?: XmlCD | undefined;
}
