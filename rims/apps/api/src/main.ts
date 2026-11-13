import "reflect-metadata";
import { NestFactory, Reflector } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import helmet from "helmet";
import cookieParser = require("cookie-parser");
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { ResponseTransformInterceptor } from "./common/interceptors/response-transform.interceptor";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { detectRedis } from "./common/queue/redis-check";

// Suppress BullMQ/ioredis ECONNREFUSED noise when Redis is not running
process.on("uncaughtException", (err: Error) => {
  const e = err as NodeJS.ErrnoException;
  if (e.code === "ECONNREFUSED" && e.syscall === "connect") return;
  console.error("[FATAL] Uncaught exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  const e = reason as NodeJS.ErrnoException & { errorCode?: string };
  if (e?.code === "ECONNREFUSED" && e?.syscall === "connect") return;
  // Prisma P1001 = can't reach database — give a clear human message instead of a stack
  if (e?.errorCode === "P1001") {
    console.error(
      "[FATAL] Cannot reach the database. Run `docker compose up -d` from the rims/ directory first, then restart the API.",
    );
    process.exit(1);
  }
  console.error("[FATAL] Unhandled rejection:", reason);
  process.exit(1);
});

async function bootstrap(): Promise<void> {
  // Check Redis availability before NestJS boots — result is read by AppModule
  // to decide whether to register BullMQ (avoids the ECONNREFUSED flood).
  const redisUrl = process.env['REDIS_URL'] ?? 'redis://localhost:6379';
  await detectRedis(redisUrl);

  const app = await NestFactory.create(AppModule, { bufferLogs: false });

  const config = app.get(ConfigService);
  const port = config.get<number>("PORT", 3000);
  const nodeEnv = config.get<string>("NODE_ENV", "development");
  const corsOrigin = config.get<string>("CORS_ORIGIN");

  // ── Security ─────────────────────────────────────────────────────────────
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: corsOrigin ?? (nodeEnv === "production" ? false : true),
    credentials: true,
  });

  // ── Global prefix ────────────────────────────────────────────────────────
  app.setGlobalPrefix("api/v1");

  // ── Validation ───────────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );

  // ── Global exception filter ───────────────────────────────────────────────
  app.useGlobalFilters(new HttpExceptionFilter());

  // ── Global interceptors ───────────────────────────────────────────────────
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  // ── Global JWT guard (routes opt-out with @Public()) ─────────────────────
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // ── Swagger ───────────────────────────────────────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle("RIMS API")
    .setDescription("Research Institute Management System REST API")
    .setVersion("0.1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(port);

  // Structured startup log
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "info",
      service: "api",
      event: "SERVER_STARTED",
      port,
      nodeEnv,
    }),
  );
}

void bootstrap();
