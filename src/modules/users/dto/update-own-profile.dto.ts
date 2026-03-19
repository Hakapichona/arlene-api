import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateOwnProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(150, { message: 'El nombre es muy largo' })
  fullName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30, { message: 'El teléfono es muy largo' })
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El email no es válido' })
  email?: string;
}
