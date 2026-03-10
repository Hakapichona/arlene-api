import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PoliticsRole } from '../enums/politics-role.enum';
import { CollaboratorStatus } from '../enums/collaborato-status.enum';

export class CollaboratorDto {
  @IsNotEmpty({ message: 'El nombre completo es requerido' })
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  dni?: string;

  @IsNotEmpty({ message: 'El teléfono es requerido' })
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(PoliticsRole)
  politicsRole?: PoliticsRole;

  @IsOptional()
  @IsEnum(CollaboratorStatus)
  status?: CollaboratorStatus;

  @IsOptional()
  @IsString()
  mainProblem?: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsString()
  interactionHistory?: string;

  @IsNotEmpty({ message: 'El barrio es requerido' })
  @IsString()
  neighborhoodUuid: string;
}
