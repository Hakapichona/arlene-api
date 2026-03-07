import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  @MaxLength(150, { message: 'El nombre es muy largo' })
  fullName: string;

  @IsOptional()
  @IsString()
  @MaxLength(30, { message: 'El teléfono es muy largo' })
  phone?: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(8, { message: 'La contraseña es muy corta' })
  @MaxLength(128, { message: 'La contraseña es muy larga' })
  @IsString()
  password: string;

  @IsNotEmpty({ message: 'El email es obligatorio' })
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;
}
