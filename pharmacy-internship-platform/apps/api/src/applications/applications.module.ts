import { Module } from "@nestjs/common";
import { ApplicationsController } from "./applications.controller";
import { ApplicationsService } from "./applications.service";
import { AuthModule } from "../auth/auth.module";
import { OrganisationsModule } from "../organisations/organisations.module";
import { VacanciesModule } from "../vacancies/vacancies.module";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [
    AuthModule,
    OrganisationsModule,
    VacanciesModule,
    NotificationsModule,
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
