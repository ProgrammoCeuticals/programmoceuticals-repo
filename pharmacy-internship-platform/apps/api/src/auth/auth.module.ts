import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RedisService } from './redis.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      // Secret is read at runtime in signAsync/verify calls to support rotation
      signOptions: { expiresIn: '15m' },
    }),
    NotificationsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, RedisService, JwtStrategy],
  exports: [AuthService, RedisService, JwtStrategy, JwtModule, PassportModule],
})
export class AuthModule {}
