import { Controller } from '@nestjs/common';
import {
  FindUserRequest,
  UserResponse,
  USERS_SERVICE_NAME,
  UsersResponse,
  UsersServiceController,
  UsersServiceControllerMethods,
} from './interfaces/users.interface';
import { GrpcMethod } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UsersServiceControllerMethods()
export class UsersController implements UsersServiceController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod(USERS_SERVICE_NAME)
  async updateUser(updateDto: UpdateUserDto): Promise<UserResponse> {
    return this.usersService.updateUser(updateDto);
  }

  @GrpcMethod(USERS_SERVICE_NAME)
  findUser(dto: FindUserRequest): Promise<UserResponse> {
    return this.usersService.findUser(dto);
  }

  @GrpcMethod(USERS_SERVICE_NAME)
  async findAllUsers(): Promise<UsersResponse> {
    return this.usersService.findAllUsers();
  }
}
