import { v2 as cloudinary } from "cloudinary";
import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { env } from "../config/env.js";
import { HttpError } from "../utils/http.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const ALLOWED_MIME_TYPES = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new HttpError(400, "Only .doc and .docx files are allowed") as unknown as null, false);
    }
  },
});

export const uploadWordReport = upload.single("report");

export const uploadToCloudinary = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (!req.file) return next();

  try {
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "raw", folder: "assessor-reports" },
          (error, result) => {
            if (error || !result) return reject(error ?? new Error("Upload failed"));
            resolve(result as { secure_url: string; public_id: string });
          },
        );
        stream.end(req.file!.buffer);
      },
    );

    req.cloudinaryResult = {
      fileUrl: result.secure_url,
      cloudinaryPublicId: result.public_id,
      fileName: req.file.originalname,
      fileMimeType: req.file.mimetype,
      fileSize: req.file.size,
    };

    next();
  } catch {
    next(new HttpError(500, "File upload failed"));
  }
};
