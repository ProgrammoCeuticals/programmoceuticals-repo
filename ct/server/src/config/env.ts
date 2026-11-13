import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CORS_ORIGIN: z.string().default("http://localhost:4200"),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  SUPER_ADMIN_FULL_NAME: z.string().default("System Super Admin"),
  SUPER_ADMIN_EMAIL: z.string().email().default("superadmin@example.com"),
  SUPER_ADMIN_PASSWORD: z.string().min(8).default("ChangeMe123!"),
  ASSESSOR_DEFAULT_PASSWORD: z.string().min(8).default("Assess1234!"),
});

export const env = envSchema.parse(process.env);
