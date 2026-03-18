import { UsersRole } from '../../users/enums/user-role.enum';
import { UserStatus } from '../../users/enums/user-status.enum';

export interface JwtPayload {
  sub: string; // uuid del usuario (identificador inmutable)
  email: string;
  role: UsersRole;
  status: UserStatus;
}
