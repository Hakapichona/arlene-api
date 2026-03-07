import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsNotEmpty({ message: 'El correo no puede estar vacío' })
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  @MinLength(8, { message: 'La contraseña es muy corta' })
  @MaxLength(128, { message: 'La contraseña es muy larga' })
  password: string;
}
