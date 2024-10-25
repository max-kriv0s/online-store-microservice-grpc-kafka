import { Controller } from '@nestjs/common';
import {
  AUTH_SERVICE_NAME,
  AuthServiceController,
  AuthServiceControllerMethods,
  LoginResponse,
  LogoutRequest,
  UpdateRefreshTokenRequest,
  UpdateRefreshTokenResponse,
  UserResponse,
  ValidateAccessTokenResponse,
  ValidateRefreshTokenResponse,
  ValidateTokenRequest,
} from './interfaces/auth.interface';
import { AuthService } from './services/auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('auth')
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod(AUTH_SERVICE_NAME)
  async register(registerDto: RegisterDto): Promise<UserResponse> {
    return this.authService.register(registerDto);
  }

  @GrpcMethod(AUTH_SERVICE_NAME)
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @GrpcMethod(AUTH_SERVICE_NAME)
  async updateRefreshToken({ userId }: UpdateRefreshTokenRequest): Promise<UpdateRefreshTokenResponse> {
    return this.authService.updateRefreshToken(userId);
  }

  @GrpcMethod(AUTH_SERVICE_NAME)
  async logout({ userId }: LogoutRequest): Promise<void> {
    await this.authService.logout(userId);
  }

  @GrpcMethod(AUTH_SERVICE_NAME)
  async validate({ token }: ValidateTokenRequest): Promise<ValidateAccessTokenResponse> {
    return this.authService.validate(token);
  }

  @GrpcMethod(AUTH_SERVICE_NAME)
  async validateRefreshToken({ token }: ValidateTokenRequest): Promise<ValidateRefreshTokenResponse> {
    return this.authService.validateRefreshToken(token);
  }
}
