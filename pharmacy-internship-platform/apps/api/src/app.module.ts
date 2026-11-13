import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganisationsModule } from './organisations/organisations.module';
import { VacanciesModule } from './vacancies/vacancies.module';
import { ApplicationsModule } from './applications/applications.module';
import { OffersModule } from './offers/offers.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    // ── Config — loads .env and validates required variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // ── Rate limiting — global throttle
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env['THROTTLE_TTL_GLOBAL'] ?? '900000', 10),
        limit: parseInt(process.env['THROTTLE_LIMIT_GLOBAL'] ?? '100', 10),
      },
    ]),

    // ── Background job scheduling
    ScheduleModule.forRoot(),

    // ── Core infrastructure
    PrismaModule,

    // ── Feature modules
    AuthModule,
    UsersModule,
    OrganisationsModule,
    VacanciesModule,
    ApplicationsModule,
    OffersModule,
    NotificationsModule,
  ],
})
export class AppModule {}
