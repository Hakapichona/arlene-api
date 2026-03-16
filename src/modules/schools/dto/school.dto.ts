import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SchoolDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsNotEmpty({ message: 'Numero de mesas obligatorio' })
  @IsNumber()
  @Type(() => Number)
  @Min(1, { message: 'El numero de mesas no puede ser negativo' })
  numberOfBoxes: number;

  @IsNotEmpty({ message: 'El barrio es obligatorio' })
  @IsString()
  neighborhoodUuid: string;
}
