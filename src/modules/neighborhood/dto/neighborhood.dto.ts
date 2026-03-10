import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { NeighborhoodStatus } from '../enums/neighborhood-status.enum';
import { Type } from 'class-transformer';

export class NeighborhoodDto {
  @IsNotEmpty({ message: 'El nombre del barrio es requerido' })
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  nameCode?: string;

  @IsNotEmpty({ message: 'La población estimada es requerida' })
  @IsNumber()
  @Type(() => Number)
  @Min(1, { message: 'La población estimada debe ser mayor a cero' })
  estimatedPopulation: number;

  @IsEnum(NeighborhoodStatus)
  @IsOptional()
  status?: NeighborhoodStatus;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;
}
