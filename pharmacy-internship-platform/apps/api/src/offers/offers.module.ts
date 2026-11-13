import { Module } from "@nestjs/common";
import { OffersController } from "./offers.controller";
import { OffersService } from "./offers.service";
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
  controllers: [OffersController],
  providers: [OffersService],
  exports: [OffersService],
})
export class OffersModule {}
