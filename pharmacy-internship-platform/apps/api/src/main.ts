import { NestFactory } from "@nestjs/core";
import { VersioningType, ValidationPipe, Logger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule);

  // ── Security headers
  app.use(helmet());
  app.use(cookieParser());

  // ── CORS — configured from env; never wildcard in production
  const allowedOrigins = (
    process.env["CORS_ORIGINS"] ?? "http://localhost:3000"
  )
    .split(",")
    .map((o) => o.trim());
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });

  // ── Global prefix and versioning
  app.setGlobalPrefix("api");
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: "1" });

  // ── Validation — all routes enforce DTOs server-side
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown properties
      forbidNonWhitelisted: true, // throw on unknown properties
      transform: true, // auto-transform to DTO types
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Global exception filter — normalised error shape
  app.useGlobalFilters(new AllExceptionsFilter());

  // ── Swagger (dev only)
  if (process.env["NODE_ENV"] !== "production") {
    const config = new DocumentBuilder()
      .setTitle("PharmIntern NG API")
      .setDescription("Pharmacy Internship Marketplace & Management Platform")
      .setVersion("1.0")
      .addBearerAuth()
      .addCookieAuth("refresh_token")
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);
    logger.log("Swagger docs available at /api/docs");
  }

  const port = parseInt(process.env["PORT"] ?? "3001", 10);
  await app.listen(port);
  logger.log(`API running on port ${port}`);
}

bootstrap().catch((err) => {
  console.error("Failed to start API", err);
  process.exit(1);
});
