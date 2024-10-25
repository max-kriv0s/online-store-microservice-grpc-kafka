import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtSettingType, ConfigurationType } from '../../../config/configuration';
import { AccessTokenPayloadDto, RefreshTokenPayloadDto } from '../dto/token.payload.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthJwtService {
  jwtSettings: JwtSettingType;

  constructor(
    private readonly configService: ConfigService<ConfigurationType, true>,
    private readonly jwtService: JwtService,
  ) {
    this.jwtSettings = configService.get('jwtSettings', { infer: true });
  }

  async generateAccessToken(payload: AccessTokenPayloadDto) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtSettings.accessTokenSecret,
      expiresIn: this.jwtSettings.accessTokenExpirationTime,
    });
    return accessToken;
  }

  async generateRefreshToken(payload: RefreshTokenPayloadDto) {
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtSettings.refreshTokenSecret,
      expiresIn: this.jwtSettings.refreshTokenExpirationTime,
    });
    return refreshToken;
  }

  async validateAccessToken(token: string): Promise<AccessTokenPayloadDto> {
    return this.jwtService.verifyAsync<AccessTokenPayloadDto>(token, {
      secret: this.jwtSettings.accessTokenSecret,
    });
  }

  async validateRefreshToken(token: string): Promise<AccessTokenPayloadDto> {
    return this.jwtService.verifyAsync<AccessTokenPayloadDto>(token, {
      secret: this.jwtSettings.refreshTokenSecret,
    });
  }
}
