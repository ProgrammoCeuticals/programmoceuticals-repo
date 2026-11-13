import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import appConfig from "./config/app.config";
import { DatabaseModule } from "./modules/database/database.module";
import { JobQueueModule } from "./modules/jobs/job-queue.module";
import { StorageModule } from "./modules/storage/storage.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { OrganizationsModule } from "./modules/organizations/organizations.module";
import { ProductsModule } from "./modules/products/products.module";
import { ApplicationsModule } from "./modules/applications/applications.module";
import { SubmissionsModule } from "./modules/submissions/submissions.module";
import { SubmissionUnitsModule } from "./modules/submission-units/submission-units.module";
import { ContextsOfUseModule } from "./modules/contexts-of-use/contexts-of-use.module";
import { DocumentsModule } from "./modules/documents/documents.module";
import { LifecycleModule } from "./modules/lifecycle/lifecycle.module";
import { ValidationModule } from "./modules/validation/validation.module";
import { PublishingModule } from "./modules/publishing/publishing.module";
import { RegulatoryModule } from "./modules/regulatory/regulatory.module";
import { CtdModule } from "./modules/ctd/ctd.module";
import { KeywordsModule } from "./modules/keywords/keywords.module";
import { XmlModule } from "./modules/xml/xml.module";
import { AuditModule } from "./modules/audit/audit.module";
import { HealthModule } from "./modules/health/health.module";

@Module({
  imports: [
    // Configuration — loaded before all other modules
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: [".env.local", ".env"],
    }),

    // Rate limiting — spec: §40
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 100,
      },
    ]),

    // Core infrastructure
    DatabaseModule,
    JobQueueModule,
    StorageModule,

    // Domain modules — spec: §11
    AuthModule,
    UsersModule,
    OrganizationsModule,
    ProductsModule,
    ApplicationsModule,
    SubmissionsModule,
    SubmissionUnitsModule,
    ContextsOfUseModule,
    DocumentsModule,
    LifecycleModule,
    ValidationModule,
    PublishingModule,
    RegulatoryModule,
    CtdModule,
    KeywordsModule,
    XmlModule,
    AuditModule,
    HealthModule,
  ],
})
export class AppModule {}
