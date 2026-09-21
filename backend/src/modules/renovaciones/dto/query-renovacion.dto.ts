import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

export class QueryRenovacionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ['BORRADOR', 'ENVIADA', 'EN_REVISION', 'APROBADA', 'CERTIFICADO_EMITIDO', 'VENCIDO'] })
  @IsOptional()
  @IsEnum(['BORRADOR', 'ENVIADA', 'EN_REVISION', 'APROBADA', 'CERTIFICADO_EMITIDO', 'VENCIDO'] as const)
  estado?: string;

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
