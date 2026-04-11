import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DistrictDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  code: string;
}
