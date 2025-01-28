import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CookieOptions, Response } from 'express';
import { COOKIE_ACCESS_TOKEN_NAME, COOKIE_REFRESH_TOKEN_NAME } from './auth.constants';
import { UserResponse } from './interfaces/auth-service.interface';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { CurrentUserId } from './decorators/current-user-id.decorator';

@Controller('auth')
export class AuthController {
  cookieAccessTokenExpires: number;
  cookieRefreshTokenExpires: number;

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<UserResponse> {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response): Promise<void> {
    const { accessToken, accessExp, refreshToken, refreshExp } = await this.authService.login(loginDto);

    response.cookie(COOKIE_ACCESS_TOKEN_NAME, accessToken, this.getCookieOptions(accessExp));
    response.cookie(COOKIE_REFRESH_TOKEN_NAME, refreshToken, this.getCookieOptions(refreshExp));
  }

  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async updateRefreshToken(
    @CurrentUserId() userId: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const { accessToken, accessExp, refreshToken, refreshExp } = await this.authService.updateRefreshToken(userId);

    response.cookie(COOKIE_ACCESS_TOKEN_NAME, accessToken, this.getCookieOptions(accessExp));
    response.cookie(COOKIE_REFRESH_TOKEN_NAME, refreshToken, this.getCookieOptions(refreshExp));
  }

  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@CurrentUserId() userId: string, @Res({ passthrough: true }) response: Response) {
    await this.authService.logout(userId);

    response.clearCookie(COOKIE_ACCESS_TOKEN_NAME);
    response.clearCookie(COOKIE_REFRESH_TOKEN_NAME);
  }

  private getCookieOptions(expires: Date): CookieOptions {
    return {
      httpOnly: true,
      secure: true,
      expires,
    };
  }
}
