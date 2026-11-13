/**
 * DocumentRepository interface — spec §57 Rule 15.
 *
 * Separates document domain logic from the Prisma persistence model.
 * Used by domain services and testable without a real database.
 */

export interface DocumentVersionSummary {
  id: string;
  documentId: string;
  versionNumber: number;
  storageKey: string;
  checksum: string;
  checksumAlgorithm: string;
  fileSize: bigint;
  mimeType: string | null;
  language: string | null;
  createdAt: Date;
}

export interface DocumentSummary {
  id: string;
  uuid: string;
  title: string;
  filename: string;
  mimeType: string;
  language: string | null;
  currentVersionId: string | null;
}

export interface DocumentRepository {
  findById(id: string): Promise<DocumentSummary | null>;
  findVersionsByDocumentId(
    documentId: string,
  ): Promise<DocumentVersionSummary[]>;
  findCurrentVersion(
    documentId: string,
  ): Promise<DocumentVersionSummary | null>;
  countVersions(documentId: string): Promise<number>;
}
