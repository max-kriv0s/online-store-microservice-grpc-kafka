import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  LoginResponse,
  UserResponse,
  UpdateRefreshTokenResponse,
  ValidateAccessTokenResponse,
  ValidateRefreshTokenResponse,
} from '../interfaces/auth-service.interface';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { ACCOUNT_CLIENT_NAME } from '../auth.constants';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthJwtService } from './auth-jwt.service';
import { TokensExpiration } from '../interfaces/auth.interface';

@Injectable()
export class AuthService implements OnModuleInit {
  private authService: AuthServiceClient;

  constructor(
    @Inject(ACCOUNT_CLIENT_NAME) private client: ClientGrpc,
    private readonly authJwtService: AuthJwtService,
  ) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  private getMetadate(): Metadata {
    return new Metadata();
  }

  async register(registerDto: RegisterDto): Promise<UserResponse> {
    return firstValueFrom(
      this.authService
        .register(registerDto, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async login(loginDto: LoginDto): Promise<LoginResponse & TokensExpiration> {
    const tokens = await firstValueFrom(
      this.authService
        .login(loginDto, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );

    const tokensPayload = await Promise.all([
      this.authJwtService.decodeAccessToken(tokens.accessToken),
      this.authJwtService.decodeRefreshToken(tokens.refreshToken),
    ]);
    return {
      ...tokens,
      accessExp: new Date(tokensPayload[0].exp * 1000),
      refreshExp: new Date(tokensPayload[1].exp * 1000),
    };
  }

  async updateRefreshToken(userId: string): Promise<UpdateRefreshTokenResponse & TokensExpiration> {
    const tokens = await firstValueFrom(
      this.authService
        .updateRefreshToken({ userId }, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );

    const tokensPayload = await Promise.all([
      this.authJwtService.decodeAccessToken(tokens.accessToken),
      this.authJwtService.decodeRefreshToken(tokens.refreshToken),
    ]);
    return {
      ...tokens,
      accessExp: new Date(tokensPayload[0].exp * 1000),
      refreshExp: new Date(tokensPayload[1].exp * 1000),
    };
  }

  async logout(userId: string): Promise<void> {
    await firstValueFrom(
      this.authService
        .logout({ userId }, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async validate(token: string): Promise<ValidateAccessTokenResponse> {
    return firstValueFrom(
      this.authService
        .validate({ token }, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async validateRefreshToken(token: string): Promise<ValidateRefreshTokenResponse> {
    return firstValueFrom(
      this.authService
        .validateRefreshToken({ token }, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }
}
