import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './repositories/user.repository';
import { RegisterDto } from '../auth/dto/register.dto';
import argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from 'src/config/configuration';
import { ERROR_LOGIN_OR_PASSWORD, ERROR_REFRESH_TOKEN, ERROR_USER_NOT_FOUND } from './user.constants';
import { ConflictError } from '../../common/exceptions/conflict.error';
import { UnauthorizedError } from '../../common/exceptions/unauthorized.error';
import { FindUserRequest, UpdateUserRequest, UserResponse, UsersResponse } from './interfaces/users.interface';
import { UsersMapper } from './users.mapper';
import { NotFoundError } from '../../common/exceptions/not-found.error';
import { Role } from './enums/role.enum';
import { Role as RoleUsersGrpc } from './interfaces/users.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService<ConfigurationType, true>,
    private readonly mapper: UsersMapper,
  ) {}

  async createUser(registerDto: RegisterDto): Promise<UserResponse> {
    const email = this.normalizedEmail(registerDto.email);
    const findedUser = await this.userRepository.findByEmail(email);
    if (findedUser) {
      throw new ConflictError(`User with email ${email} already exists`);
    }

    const hashPassword = await this.generateHash(registerDto.password);

    const userDto: CreateUserDto = {
      username: registerDto.username,
      email: email,
      hashPassword: hashPassword,
    };
    const user = this.createUserEntity(userDto);
    const createdUser = await this.userRepository.save(user);
    return this.mapper.map(createdUser);
  }

  async checkCredentials(email: string, password: string): Promise<UserEntity> {
    const emailNormalized = this.normalizedEmail(email);
    const user = await this.userRepository.findByEmail(emailNormalized);
    if (!user) {
      throw new UnauthorizedError(ERROR_LOGIN_OR_PASSWORD);
    }
    if (!(await this.verifyPassword(user.hashPassword, password))) {
      throw new UnauthorizedError(ERROR_LOGIN_OR_PASSWORD);
    }
    return user;
  }

  async updateRefreshToken(user: UserEntity, refreshToken: string) {
    const hashRefreshToken = await this.generateHash(refreshToken);
    this.updateUserRefreshToken(user, hashRefreshToken);
    this.userRepository.save(user);
  }

  async checkRefreshToken(userId: string, refreshToken: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError(ERROR_REFRESH_TOKEN);
    }
    if (!(await this.verifyRefreshToken(user.refreshToken, refreshToken))) {
      throw new UnauthorizedError(ERROR_REFRESH_TOKEN);
    }
    return user;
  }

  private async generateHash(data: string): Promise<string> {
    return await argon2.hash(data);
  }

  private async verifyPassword(passwordHash: string, password: string): Promise<boolean> {
    try {
      return await argon2.verify(passwordHash, password);
    } catch (err: unknown) {
      throw new UnauthorizedError(ERROR_LOGIN_OR_PASSWORD);
    }
  }

  private async verifyRefreshToken(refreshTokenHash: string, refreshToken): Promise<boolean> {
    try {
      return await argon2.verify(refreshTokenHash, refreshToken);
    } catch (err: unknown) {
      throw new UnauthorizedError(ERROR_REFRESH_TOKEN);
    }
  }

  private normalizedEmail(email: string) {
    return email.toLowerCase();
  }

  private createUserEntity(createDto: CreateUserDto): UserEntity {
    const instance = new UserEntity();
    instance.username = createDto.username;
    instance.email = createDto.email;
    instance.hashPassword = createDto.hashPassword;
    instance.role = Role.Buyer;

    return instance;
  }

  private updateUserRefreshToken(user: UserEntity, token: string | null): void {
    user.refreshToken = token;
  }

  async deleteRefreshToken(user: UserEntity): Promise<void> {
    this.updateUserRefreshToken(user, null);
    this.userRepository.save(user);
  }

  async findUserById(userId: string): Promise<UserEntity | null> {
    return this.userRepository.findById(userId);
  }

  async findAllUsers(): Promise<UsersResponse> {
    const users = await this.userRepository.findUsers();
    return { users: users.map((user) => this.mapper.map(user)) };
  }

  async findUser({ userId }: FindUserRequest): Promise<UserResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_USER_NOT_FOUND);
    }
    return this.mapper.map(user);
  }

  async updateUser(updateDto: UpdateUserRequest): Promise<UserResponse> {
    const user = await this.userRepository.findById(updateDto.userId);
    if (!user) {
      throw new NotFoundError(ERROR_USER_NOT_FOUND);
    }
    user.username = updateDto.username ?? user.username;

    const userRoles = Object.values(Role);
    const newRole = Object.values(RoleUsersGrpc)[updateDto.role] as Role;
    if (userRoles.includes(newRole)) {
      const indexRole = userRoles.indexOf(newRole);
      user.role = userRoles[indexRole];
    }

    const updatedUser = await this.userRepository.save(user);
    return this.mapper.map(updatedUser);
  }
}
