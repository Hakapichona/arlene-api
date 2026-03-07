import { SetMetadata } from '@nestjs/common';
import { UsersRole } from '../modules/users/enums/user-role.enum';

export const ROLES_KEY = 'roles';

export const AdminOnly = () => SetMetadata(ROLES_KEY, [UsersRole.ADMIN]);
