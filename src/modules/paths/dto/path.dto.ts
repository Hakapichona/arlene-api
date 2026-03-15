import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PathDto {
  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @IsString()
  observations: string;

  @IsOptional()
  @IsString()
  additionalInformation?: string;

  @IsNotEmpty()
  @IsString()
  neighborhoodUuid: string;
}
