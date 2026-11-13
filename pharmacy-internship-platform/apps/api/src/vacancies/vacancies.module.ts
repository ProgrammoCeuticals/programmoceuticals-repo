import { Module } from "@nestjs/common";
import { VacanciesController } from "./vacancies.controller";
import { VacanciesService } from "./vacancies.service";
import { VacancyGateway } from "./vacancy.gateway";
import { AuthModule } from "../auth/auth.module";
import { OrganisationsModule } from "../organisations/organisations.module";

@Module({
  imports: [AuthModule, OrganisationsModule],
  controllers: [VacanciesController],
  providers: [VacanciesService, VacancyGateway],
  exports: [VacanciesService, VacancyGateway],
})
export class VacanciesModule {}
