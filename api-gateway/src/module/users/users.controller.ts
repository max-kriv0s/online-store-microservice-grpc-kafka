import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponse, UsersResponse } from './interfaces/users-service.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UsersRoles } from '../../common/enums/role.enum';
import { Roles } from '../../common/decorators/roles.decorator';

@UseGuards(JwtGuard, RolesGuard)
@Roles(UsersRoles.Admin)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string): Promise<UserResponse> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Get(':id')
  async findUser(@Param('id') id: string): Promise<UserResponse> {
    return this.usersService.findUser(id);
  }

  @Get()
  async findAllUsers(): Promise<UsersResponse> {
    return this.usersService.findAllUsers();
  }
}
