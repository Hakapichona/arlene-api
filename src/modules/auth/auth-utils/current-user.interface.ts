import { UsersRole } from '../../users/enums/user-role.enum';
import { UserStatus } from '../../users/enums/user-status.enum';

export interface CurrentUser {
  uuid: string;
  email: string;
  role: UsersRole;
  status: UserStatus;
}
