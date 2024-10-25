import { MaxLength, IsEmail, IsNotEmpty, Length, IsString } from 'class-validator';
import { LoginRequest } from '../interfaces/auth-service.interface';
import { USER_VALIDATION } from '../../../module/users/users.constants';

export class LoginDto implements LoginRequest {
  @MaxLength(USER_VALIDATION.email.length)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Length(USER_VALIDATION.password.minLength, USER_VALIDATION.password.maxLength)
  @IsString()
  @IsNotEmpty()
  password: string;
}
