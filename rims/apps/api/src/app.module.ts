import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { BullModule } from "@nestjs/bullmq";
import { envValidationSchema } from "./config/env.validation";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { HealthModule } from "./modules/health/health.module";
import { AuthModule } from "./modules/auth/auth.module";
import { TenantModule } from "./modules/tenant/tenant.module";
import { TenantMiddleware } from "./modules/tenant/tenant.middleware";
import { AuditModule } from "./modules/audit/audit.module";
import { CorrelationIdMiddleware } from "./common/middleware/correlation-id.middleware";
import { UsersModule } from "./modules/users/users.module";
import { RolesModule } from "./modules/roles/roles.module";
import { TenantsModule } from "./modules/tenants/tenants.module";
import { InstitutionModule } from "./modules/institution/institution.module";
import { DepartmentsModule } from "./modules/departments/departments.module";
import { TeamsModule } from "./modules/teams/teams.module";
import { EmployeesModule } from "./modules/employees/employees.module";
import { ResearchModule } from "./modules/research/research.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { PerformanceModule } from "./modules/performance/performance.module";
import { ReportsModule } from "./modules/reports/reports.module";
import { PublicationsModule } from "./modules/publications/publications.module";
import { FinanceModule } from "./modules/finance/finance.module";
import { QualityModule } from "./modules/quality/quality.module";
import { DocumentsModule } from "./modules/documents/documents.module";
import { SubscriptionsModule } from "./modules/subscriptions/subscriptions.module";
import { UsageModule } from "./modules/usage/usage.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { AiReportsModule } from "./modules/ai-reports/ai-reports.module";
import { PlatformAdminModule } from "./modules/platform-admin/platform-admin.module";
import { InstitutionalWebModule } from "./modules/institutional-web/institutional-web.module";
import { ScopeModule } from "./common/scope/scope.module";

import { createRedisConnection } from "./common/redis/redis.provider";
import { REDIS_AVAILABLE } from "./common/queue/redis-check";

@Module({
  imports: [
    // ── Environment config — must be first ──────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '.env'],
      validate: (config) => {
        const { error, value } = envValidationSchema.validate(config, {
          allowUnknown: true,
          abortEarly: false,
        });
        if (error) {
          throw new Error(`Config validation error: ${error.message}`);
        }
        return value as Record<string, unknown>;
      },
    }),

    // ── Rate limiting ────────────────────────────────────────────────────────
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>("THROTTLE_TTL", 60) * 1000,
          limit: config.get<number>("THROTTLE_LIMIT", 100),
        },
      ],
      inject: [ConfigService],
    }),

    // ── Redis / BullMQ ───────────────────────────────────────────────────────
    // Only registered when Redis is reachable (checked in main.ts before boot).
    // When absent, queue calls in AuthService/UsersService are no-ops.
    ...(REDIS_AVAILABLE
      ? [
          BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
              connection: createRedisConnection(
                config.getOrThrow<string>("REDIS_URL"),
              ),
            }),
            inject: [ConfigService],
          }),
        ]
      : []),

    // ── Core ─────────────────────────────────────────────────────────────────
    PrismaModule,
    HealthModule,
    ScopeModule,

    // ── Auth & Tenant ─────────────────────────────────────────────────────────
    AuthModule,
    TenantModule,

    // ── Domain modules ────────────────────────────────────────────────────────
    AuditModule,
    UsersModule,
    RolesModule,
    TenantsModule,
    InstitutionModule,
    DepartmentsModule,
    TeamsModule,
    EmployeesModule,
    ResearchModule,
    TasksModule,
    PerformanceModule,
    ReportsModule,
    PublicationsModule,
    FinanceModule,
    QualityModule,
    DocumentsModule,

    // ── Phase 4 modules ───────────────────────────────────────────────────────
    SubscriptionsModule,
    UsageModule,
    NotificationsModule,
    AnalyticsModule,
    AiReportsModule,
    PlatformAdminModule,
    InstitutionalWebModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    // Correlation ID on every request
    consumer.apply(CorrelationIdMiddleware).forRoutes("*");

    // Tenant resolution on all routes except health and login/register
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: "health", method: RequestMethod.GET },
        { path: "auth/login", method: RequestMethod.POST },
        { path: "auth/reset-password", method: RequestMethod.POST },
        { path: "auth/accept-invitation", method: RequestMethod.POST },
        { path: "public/sites/current", method: RequestMethod.ALL },
        { path: "public/sites/current/*", method: RequestMethod.ALL },
      )
      .forRoutes("*");
  }
}
