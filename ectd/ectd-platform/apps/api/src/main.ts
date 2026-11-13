import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { IdempotencyInterceptor } from "./common/interceptors/idempotency.interceptor";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT", 3000);
  const nodeEnv = configService.get<string>("NODE_ENV", "development");

  // Security
  app.use(helmet());
  app.enableCors({
    origin: nodeEnv === "production" ? false : true,
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix("api/v1");

  // Validation — strict, no unknown fields passed through
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new IdempotencyInterceptor(),
  );

  // OpenAPI — spec: §52
  const swaggerConfig = new DocumentBuilder()
    .setTitle("ProgrammoCeuticals eCTD API")
    .setDescription(
      "eCTD v4.0 regulatory submission management platform. " +
        "All lifecycle operations are explicit domain commands — not generic CRUD.",
    )
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
