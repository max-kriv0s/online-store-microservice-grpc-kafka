import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthJwtService } from './services/auth-jwt.service';

@Module({
  imports: [UsersModule, JwtModule.register({})],
  providers: [AuthService, AuthJwtService],
  controllers: [AuthController],
})
export class AuthModule {}
