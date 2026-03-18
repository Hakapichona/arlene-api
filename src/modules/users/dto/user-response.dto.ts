import { UsersRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';

export class UserResponseDto {
  uuid: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: UsersRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}
