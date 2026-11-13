import * as Joi from 'joi';

/**
 * Joi schema that validates all environment variables at startup.
 * The ConfigModule will throw on any missing/invalid required var.
 */
export const envValidationSchema = Joi.object({
  // ── Database ────────────────────────────────────────────────────────────────
  DATABASE_URL: Joi.string().uri().required(),
  DATABASE_MIGRATION_URL: Joi.string().uri().optional(),

  // ── Redis ───────────────────────────────────────────────────────────────────
  REDIS_URL: Joi.string().required(),

  // ── JWT ─────────────────────────────────────────────────────────────────────
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRY: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRY: Joi.string().default('7d'),

  // ── Server ──────────────────────────────────────────────────────────────────
  PORT: Joi.number().integer().min(1).max(65535).default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  CORS_ORIGIN: Joi.string().optional(),

  // ── Rate limiting ───────────────────────────────────────────────────────────
  THROTTLE_TTL: Joi.number().integer().min(1).default(60),
  THROTTLE_LIMIT: Joi.number().integer().min(1).default(100),

  // ── SMTP (optional) ─────────────────────────────────────────────────────────
  SMTP_HOST: Joi.string().optional(),
  SMTP_PORT: Joi.number().integer().optional(),
  SMTP_USER: Joi.string().optional(),
  SMTP_PASS: Joi.string().optional(),
  SMTP_FROM: Joi.string().email().optional(),

  // ── Misc ─────────────────────────────────────────────────────────────────────
  SEED_DEMO: Joi.boolean().default(true),
});
