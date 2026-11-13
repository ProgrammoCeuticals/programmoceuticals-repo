import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TenantMiddleware } from "./tenant.middleware";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>("JWT_ACCESS_SECRET"),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TenantMiddleware],
  exports: [TenantMiddleware],
})
export class TenantModule {}
