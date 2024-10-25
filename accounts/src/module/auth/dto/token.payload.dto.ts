import { Role } from '../../users/enums/role.enum';

export class AccessTokenPayloadDto {
  userId: string;
  roles: Role[];
}
export class RefreshTokenPayloadDto {
  userId: string;
}
