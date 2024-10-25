import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import {
  LoginResponse,
  UpdateRefreshTokenResponse,
  UserResponse,
  ValidateAccessTokenResponse,
  ValidateRefreshTokenResponse,
} from '../interfaces/auth.interface';
import { UsersService } from '../../users/users.service';
import { UserEntity } from '../../users/entities/user.entity';
import { TokensDto } from '../dto/tokens.dto';
import { AccessTokenPayloadDto, RefreshTokenPayloadDto } from '../dto/token.payload.dto';
import { AuthJwtService } from './auth-jwt.service';
import { NotFoundError } from '../../../common/exceptions/not-found.error';
import { ERROR_TOKEN, ERROR_USER_NOT_FOUND } from '../../../module/users/user.constants';
import { UnauthorizedError } from '../../../common/exceptions/unauthorized.error';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authJwtService: AuthJwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserResponse> {
    return this.usersService.createUser(registerDto);
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.usersService.checkCredentials(email, password);
    const tokens = await this.createTokens(user);
    await this.usersService.updateRefreshToken(user, tokens.refreshToken);
    return tokens;
  }

  private async createTokens(user: UserEntity): Promise<TokensDto> {
    const accessPayload: AccessTokenPayloadDto = { userId: user.id, roles: [user.role] };
    const accessToken = await this.authJwtService.generateAccessToken(accessPayload);

    const refreshPayload: RefreshTokenPayloadDto = { userId: user.id };
    const refreshToken = await this.authJwtService.generateRefreshToken(refreshPayload);
    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: string): Promise<UpdateRefreshTokenResponse> {
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_USER_NOT_FOUND);
    }

    const tokens = await this.createTokens(user);
    await this.usersService.updateRefreshToken(user, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string): Promise<void> {
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_USER_NOT_FOUND);
    }

    await this.usersService.deleteRefreshToken(user);
  }

  async validate(token: string): Promise<ValidateAccessTokenResponse> {
    try {
      const payload = await this.authJwtService.validateAccessToken(token);
      const user = await this.usersService.findUserById(payload.userId);
      if (!user) {
        throw new UnauthorizedError(ERROR_TOKEN);
      }
      return payload;
    } catch (error) {
      throw new UnauthorizedError(ERROR_TOKEN);
    }
  }

  async validateRefreshToken(token: string): Promise<ValidateRefreshTokenResponse> {
    try {
      const payload = await this.authJwtService.validateRefreshToken(token);
      const user = await this.usersService.checkRefreshToken(payload.userId, token);
      if (!user) {
        throw new UnauthorizedError(ERROR_TOKEN);
      }
      return payload;
    } catch (error) {
      throw new UnauthorizedError(ERROR_TOKEN);
    }
  }
}
