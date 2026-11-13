import { registerAs } from "@nestjs/config";

export interface AppConfig {
  nodeEnv: string;
  port: number;
  databaseUrl: string;
  redisUrl: string;
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  storage: {
    provider: string;
    root: string;
  };
  regulatory: {
    packageRoot: string;
  };
  logging: {
    level: string;
  };
}

export default registerAs("app", (): AppConfig => {
  const required = (key: string): string => {
    const val = process.env[key];
    if (!val) {
      throw new Error(`Required environment variable "${key}" is not set.`);
    }
    return val;
  };

  return {
    nodeEnv: process.env["NODE_ENV"] ?? "development",
    port: parseInt(process.env["PORT"] ?? "3000", 10),
    databaseUrl: required("DATABASE_URL"),
    redisUrl: process.env["REDIS_URL"] ?? "redis://localhost:6379",
    jwt: {
      secret: required("JWT_SECRET"),
      expiresIn: process.env["JWT_EXPIRES_IN"] ?? "15m",
      refreshSecret: required("JWT_REFRESH_SECRET"),
      refreshExpiresIn: process.env["JWT_REFRESH_EXPIRES_IN"] ?? "7d",
    },
    storage: {
      provider: process.env["STORAGE_PROVIDER"] ?? "local",
      root: process.env["STORAGE_ROOT"] ?? "/tmp/ectd-storage",
    },
    regulatory: {
      packageRoot:
        process.env["REGULATORY_PACKAGE_ROOT"] ?? "./regulatory/packages",
    },
    logging: {
      level: process.env["LOG_LEVEL"] ?? "info",
    },
  };
});
