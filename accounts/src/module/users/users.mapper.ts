import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UserResponse } from '../auth/interfaces/auth.interface';

@Injectable()
export class UsersMapper {
  map(user: UserEntity): UserResponse {
    const response: UserResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      role: user.role,
    };

    return response;
  }
}
