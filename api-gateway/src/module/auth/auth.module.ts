import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { ClientsModule } from '@nestjs/microservices';
import { ACCOUNT_CLIENT_NAME } from './auth.constants';
import { AuthServiceConfig } from './auth-service.config';
import { AuthJwtService } from './services/auth-jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ACCOUNT_CLIENT_NAME,
        useClass: AuthServiceConfig,
      },
    ]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthJwtService],
  exports: [AuthService],
})
export class AuthModule {}
