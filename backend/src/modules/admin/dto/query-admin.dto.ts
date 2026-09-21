import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumberString, IsOptional, IsString, MaxLength } from 'class-validator';

export class QueryAdminDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({ enum: ['CERTIFICACION_SIPPCI', 'REGISTRO_PROFESIONAL', 'CAPACITACION'] })
  @IsOptional()
  @IsEnum(['CERTIFICACION_SIPPCI', 'REGISTRO_PROFESIONAL', 'CAPACITACION'] as const)
  tipoTramite?: string;

  @ApiPropertyOptional({ enum: ['BORRADOR', 'ENVIADA', 'EN_REVISION', 'REVISADO', 'OBSERVADA', 'APROBADA', 'RECHAZADA', 'CERTIFICADO_EMITIDO', 'VENCIDO', 'RENOVADO', 'ANULADA'] })
  @IsOptional()
  @IsEnum(['BORRADOR', 'ENVIADA', 'EN_REVISION', 'REVISADO', 'OBSERVADA', 'APROBADA', 'RECHAZADA', 'CERTIFICADO_EMITIDO', 'VENCIDO', 'RENOVADO', 'ANULADA'] as const)
  estado?: string;

  @ApiPropertyOptional({ description: 'Formato: YYYY-MM-DD' })
  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  @ApiPropertyOptional({ description: 'Formato: YYYY-MM-DD' })
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
