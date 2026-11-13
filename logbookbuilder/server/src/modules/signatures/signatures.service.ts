import { z } from "zod";
import bcrypt from "bcryptjs";
import { createHash } from "node:crypto";
import { eq, and } from "drizzle-orm";
import { db } from "../../db/index.js";
import { signatures, fileAttachments, logRecords, logColumns, users } from "../../db/schema.js";
import { auditAsync } from "../../lib/audit.js";
import type { AuthContext } from "../../types/index.js";
import path from "node:path";
import fs from "node:fs/promises";

export const signRecordSchema = z.object({
  columnId: z.string(),
  password: z.string().min(1, "Password is required for signing"),
  signatureImageBase64: z.string().min(1, "Signature image is required"),
  personnelId: z.string().optional(),
});

export const revokeSignatureSchema = z.object({
  reason: z.string().min(1, "Revocation reason is required"),
});

function computeIntegrityHash(
  recordId: string,
  userId: string,
  signedAt: Date,
  intent: string
): string {
  return createHash("sha256")
    .update(`${recordId}|${userId}|${signedAt.toISOString()}|${intent}`)
    .digest("hex");
}

export async function signRecordService(
  auth: AuthContext,
  logId: string,
  recordId: string,
  input: z.infer<typeof signRecordSchema>
) {
  const record = await db.query.logRecords.findFirst({
    where: and(
      eq(logRecords.id, recordId),
      eq(logRecords.logDefinitionId, logId),
      eq(logRecords.organizationId, auth.organizationId)
    ),
  });
  if (!record) throw new Error("Record not found");
  if (record.status === "voided") throw new Error("Cannot sign a voided record");

  const column = await db.query.logColumns.findFirst({
    where: and(eq(logColumns.id, input.columnId), eq(logColumns.logDefinitionId, logId)),
  });
  if (!column) throw new Error("Column not found");
  if (column.dataType !== "signature") throw new Error("Column is not a signature field");

  const typeConfig = column.typeConfig as Record<string, unknown>;
  const intent = (typeConfig.intent as string) ?? "I certify the above information is accurate";
  const requireReauth = (typeConfig.requireReauth as boolean) ?? true;

  const existing = await db.query.signatures.findFirst({
    where: and(
      eq(signatures.recordId, recordId),
      eq(signatures.columnId, input.columnId),
      eq(signatures.status, "signed")
    ),
  });
  if (existing) throw new Error("This field has already been signed");

  if (requireReauth) {
    const user = await db.query.users.findFirst({ where: eq(users.id, auth.userId) });
    if (!user) throw new Error("User not found");
    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) throw new Error("Incorrect password — signature rejected");
  }

  const uploadDir = process.env.FILE_UPLOAD_DIR ?? "./uploads";
  await fs.mkdir(uploadDir, { recursive: true });

  const base64Data = input.signatureImageBase64.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");
  const filename = `sig_${recordId}_${input.columnId}_${Date.now()}.png`;
  const storagePath = path.join(uploadDir, filename);
  await fs.writeFile(storagePath, buffer);

  const [sigFile] = await db.insert(fileAttachments).values({
    organizationId: auth.organizationId,
    recordId,
    columnId: input.columnId,
    originalName: filename,
    storagePath,
    mimeType: "image/png",
    sizeBytes: buffer.length,
    uploadedById: auth.userId,
  }).returning();

  const signedAt = new Date();
  const integrityHash = computeIntegrityHash(recordId, auth.userId, signedAt, intent);

  const [sig] = await db.insert(signatures).values({
    organizationId: auth.organizationId,
    recordId,
    columnId: input.columnId,
    signedById: auth.userId,
    personnelId: input.personnelId ?? null,
    intent,
    signedAt,
    integrityHash,
    signatureImageId: sigFile.id,
    status: "signed",
  }).returning();

  auditAsync({
    auth,
    eventType: "record_signed",
    entityType: "signature",
    entityId: sig.id,
    summary: `Record ${record.recordNumber} signed by ${auth.name} — "${intent}"`,
    newState: { signatureId: sig.id, recordId, columnId: input.columnId, signedAt: signedAt.toISOString(), integrityHash },
  });

  return { ...sig, signatureImageUrl: `/api/files/${sigFile.id}` };
}

export async function revokeSignatureService(
  auth: AuthContext,
  signatureId: string,
  input: z.infer<typeof revokeSignatureSchema>
) {
  const sig = await db.query.signatures.findFirst({
    where: and(eq(signatures.id, signatureId), eq(signatures.organizationId, auth.organizationId)),
  });
  if (!sig) throw new Error("Signature not found");
  if (sig.status === "revoked") throw new Error("Signature is already revoked");

  const [revoked] = await db.update(signatures)
    .set({ status: "revoked", revokedAt: new Date(), revokedById: auth.userId, revocationReason: input.reason, updatedAt: new Date() })
    .where(eq(signatures.id, signatureId))
    .returning();

  auditAsync({
    auth,
    eventType: "record_signed",
    entityType: "signature",
    entityId: signatureId,
    summary: `Signature revoked by ${auth.name}. Reason: ${input.reason}`,
    previousState: { status: "signed" },
    newState: { status: "revoked", reason: input.reason },
  });

  return revoked;
}

export async function verifySignatureService(auth: AuthContext, signatureId: string) {
  const sig = await db.query.signatures.findFirst({
    where: and(eq(signatures.id, signatureId), eq(signatures.organizationId, auth.organizationId)),
    with: { signedBy: true },
  });
  if (!sig) throw new Error("Signature not found");

  const recomputed = computeIntegrityHash(sig.recordId, sig.signedById, sig.signedAt, sig.intent);

  return { signature: sig, integrityValid: recomputed === sig.integrityHash, recomputedHash: recomputed };
}
