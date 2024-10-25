import { SetMetadata } from '@nestjs/common';
import { UsersRoles } from '../enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UsersRoles[]) => SetMetadata(ROLES_KEY, roles);
