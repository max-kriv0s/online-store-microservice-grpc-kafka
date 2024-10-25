import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Role, UpdateUserRequest } from '../interfaces/users-service.interface';
import { USER_VALIDATION } from '../users.constants';

export class UpdateUserDto implements Omit<UpdateUserRequest, 'userId'> {
  @MaxLength(USER_VALIDATION.username.length)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  username?: string;

  @IsEnum(Role)
  @IsNotEmpty()
  @IsOptional()
  role?: Role;
}
