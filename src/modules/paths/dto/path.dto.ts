import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PathDto {
  @IsNotEmpty({ message: 'La fecha es requerido' })
  @IsDate()
  date: Date;

  @IsNotEmpty({ message: 'La observacion es requerido' })
  @IsString()
  observations: string;

  @IsOptional()
  @IsString()
  additionalInformation?: string;

  @IsOptional()
  @IsString()
  route: string;

  @IsNotEmpty({ message: 'El barrio es requerido' })
  @IsString()
  neighborhoodUuid: string;
}
