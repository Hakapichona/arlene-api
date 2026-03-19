import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class ElectoralHistoryDto {
  @IsNotEmpty({ message: 'El año es requerido' })
  @IsNumber()
  @Min(0, { message: 'El año no puede ser negativo' })
  electoralYear: number;

  @IsNotEmpty({ message: 'Los votos son requeridos' })
  @IsNumber()
  @Min(0, { message: 'Los votos no pueden ser negativos' })
  numberOfVotes: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'El barrio es requerido' })
  @IsString()
  neighborhoodUuid: string;
}
