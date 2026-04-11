import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class TableAssignmentDto {
  @IsInt()
  @Min(1)
  tableNumber: number;

  @IsOptional()
  @IsString()
  collaboratorUuid?: string | null;
}

export class AssignTablesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TableAssignmentDto)
  assignments: TableAssignmentDto[];
}
