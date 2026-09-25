import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsDateString, IsOptional, IsString } from 'class-validator';

export class ProgramarInspeccionDto {
  @ApiProperty()
  @IsDateString()
  fechaProgramada!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  inspectorId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  observaciones?: string;
}
