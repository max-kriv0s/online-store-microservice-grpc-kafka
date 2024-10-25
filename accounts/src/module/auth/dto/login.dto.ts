import { MaxLength, IsEmail, IsNotEmpty, Length, IsString } from 'class-validator';
import { USER_VALIDATION } from '../../users/user.constants';
import { LoginRequest } from '../interfaces/auth.interface';

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
