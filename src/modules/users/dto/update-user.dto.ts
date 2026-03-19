import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UsersRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(150, { message: 'El nombre es muy largo' })
  fullName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30, { message: 'El teléfono es muy largo' })
  phone?: string;

  @IsOptional()
  @MinLength(8, { message: 'La contraseña es muy corta' })
  @MaxLength(128, { message: 'La contraseña es muy larga' })
  @IsString()
  password?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El email no es válido' })
  email?: string;

  @IsOptional()
  @IsEnum(UsersRole, { message: 'El rol no es válido' })
  role?: UsersRole;

  @IsOptional()
  @IsEnum(UserStatus, { message: 'El estado no es válido' })
  status?: UserStatus;
}
