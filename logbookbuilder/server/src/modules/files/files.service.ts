import { eq, and } from "drizzle-orm";
import { db } from "../../db/index.js";
import { fileAttachments } from "../../db/schema.js";
import { auditAsync } from "../../lib/audit.js";
import type { AuthContext } from "../../types/index.js";
import multer from "multer";
import fs from "node:fs";

const uploadDir = process.env.FILE_UPLOAD_DIR ?? "./uploads";

// Ensure upload directory exists on startup
fs.mkdirSync(uploadDir, { recursive: true });

export const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE_MB ?? 20) * 1024 * 1024,
  },
  fileFilter(_req, file, cb) {
    const blocked = [
      "application/x-msdownload",
      "application/x-executable",
      "application/x-sh",
    ];
    if (blocked.includes(file.mimetype)) cb(new Error("File type not allowed"));
    else cb(null, true);
  },
});

export async function uploadFileService(
  auth: AuthContext,
  file: Express.Multer.File,
  recordId?: string,
  columnId?: string,
) {
  const [attachment] = await db
    .insert(fileAttachments)
    .values({
      organizationId: auth.organizationId,
      recordId: recordId ?? null,
      columnId: columnId ?? null,
      originalName: file.originalname,
      storagePath: file.path,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      uploadedById: auth.userId,
    })
    .returning();

  auditAsync({
    auth,
    eventType: "file_uploaded",
    entityType: "file_attachment",
    entityId: attachment.id,
    summary: `File "${file.originalname}" uploaded by ${auth.name}`,
    newState: { fileId: attachment.id, recordId, columnId },
  });

  return attachment;
}

export async function getFileService(auth: AuthContext, fileId: string) {
  const file = await db.query.fileAttachments.findFirst({
    where: and(
      eq(fileAttachments.id, fileId),
      eq(fileAttachments.organizationId, auth.organizationId),
      eq(fileAttachments.isDeleted, false),
    ),
  });
  if (!file) throw new Error("File not found");
  return file;
}

export async function deleteFileService(auth: AuthContext, fileId: string) {
  const file = await db.query.fileAttachments.findFirst({
    where: and(
      eq(fileAttachments.id, fileId),
      eq(fileAttachments.organizationId, auth.organizationId),
    ),
  });
  if (!file) throw new Error("File not found");

  await db
    .update(fileAttachments)
    .set({ isDeleted: true, updatedAt: new Date() })
    .where(eq(fileAttachments.id, fileId));

  auditAsync({
    auth,
    eventType: "file_deleted",
    entityType: "file_attachment",
    entityId: fileId,
    summary: `File "${file.originalName}" deleted by ${auth.name}`,
  });
}
