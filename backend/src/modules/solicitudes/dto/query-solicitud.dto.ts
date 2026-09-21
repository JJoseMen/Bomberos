import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

export class QuerySolicitudDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ['CERTIFICACION_SIPPCI', 'REGISTRO_PROFESIONAL', 'CAPACITACION', 'RENOVACION'] })
  @IsOptional()
  @IsEnum(['CERTIFICACION_SIPPCI', 'REGISTRO_PROFESIONAL', 'CAPACITACION', 'RENOVACION'] as const)
  tipoTramite?: string;

  @ApiPropertyOptional({ enum: ['BORRADOR', 'ENVIADA', 'EN_REVISION', 'OBSERVADA', 'APROBADA', 'RECHAZADA', 'ANULADA'] })
  @IsOptional()
  @IsEnum(['BORRADOR', 'ENVIADA', 'EN_REVISION', 'OBSERVADA', 'APROBADA', 'RECHAZADA', 'ANULADA'] as const)
  estado?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  usuarioId?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
