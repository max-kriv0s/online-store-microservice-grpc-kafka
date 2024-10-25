import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayloadDto, RefreshTokenPayloadDto } from '../dto/token.payload.dto';

@Injectable()
export class AuthJwtService {
  constructor(private readonly jwtService: JwtService) {}

  async decodeRefreshToken(refreshToken: string): Promise<RefreshTokenPayloadDto> {
    return this.jwtService.decode(refreshToken);
  }

  async decodeAccessToken(refreshToken: string): Promise<AccessTokenPayloadDto> {
    return this.jwtService.decode(refreshToken);
  }
}
