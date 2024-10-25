export class AccessTokenPayloadDto {
  userId: string;
  roles: string[];
  exp: number;
}
export class RefreshTokenPayloadDto {
  userId: string;
  roles: string[];
  exp: number;
}
