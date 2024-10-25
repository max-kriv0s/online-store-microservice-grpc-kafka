import { IsUUID, IsNotEmpty, MaxLength, IsString, IsOptional, IsNumber } from 'class-validator';
import { Role, UpdateUserRequest } from '../interfaces/users.interface';
import { USER_VALIDATION } from '../user.constants';

export class UpdateUserDto implements UpdateUserRequest {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @MaxLength(USER_VALIDATION.username.length)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  username?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  role?: Role;
}
