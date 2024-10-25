import { IsEmail, IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';
import { RegisterRequest } from '../interfaces/auth.interface';
import { USER_VALIDATION } from '../../users/user.constants';

export class RegisterDto implements RegisterRequest {
  @MaxLength(USER_VALIDATION.username.length)
  @IsString()
  @IsNotEmpty()
  username: string;

  @MaxLength(USER_VALIDATION.email.length)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Length(USER_VALIDATION.password.minLength, USER_VALIDATION.password.maxLength)
  @IsString()
  @IsNotEmpty()
  password: string;
}
