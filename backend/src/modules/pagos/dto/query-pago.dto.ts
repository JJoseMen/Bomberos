import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

export class QueryPagoDto {
  @ApiPropertyOptional({ enum: ['PENDIENTE', 'VERIFICADO', 'OBSERVADO', 'RECHAZADO'] })
  @IsOptional()
  @IsEnum(['PENDIENTE', 'VERIFICADO', 'OBSERVADO', 'RECHAZADO'] as const)
  estado?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  banco?: string;

  @ApiPropertyOptional({ example: '2026-01-01' })
  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  @IsDateString()
  fechaHasta?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
