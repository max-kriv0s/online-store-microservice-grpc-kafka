import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  UserResponse,
  USERS_SERVICE_NAME,
  UsersResponse,
  UsersServiceClient,
} from './interfaces/users-service.interface';
import { USERS_CLIENT_NAME } from './users.constants';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { UpdateUserDto } from './dto/update-user.dto';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class UsersService implements OnModuleInit {
  private usersService: UsersServiceClient;

  constructor(@Inject(USERS_CLIENT_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.usersService = this.client.getService<UsersServiceClient>(USERS_SERVICE_NAME);
  }

  private getMetadate(): Metadata {
    return new Metadata();
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<UserResponse> {
    return firstValueFrom(
      this.usersService
        .updateUser({ userId, ...updateUserDto }, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async findUser(userId: string): Promise<UserResponse> {
    return firstValueFrom(
      this.usersService
        .findUser({ userId }, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async findAllUsers(): Promise<UsersResponse> {
    return firstValueFrom(
      this.usersService
        .findAllUsers({}, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }
}
