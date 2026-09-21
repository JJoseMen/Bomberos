import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

const TIPOS = [
  'FORMULARIO', 'PLANO_SIPPCI', 'PLAN_EMERGENCIA',
  'CREDENCIAL_PROFESIONAL', 'NIT', 'BOLETA_DEPOSITO',
  'CERTIFICADO_ANTERIOR', 'OTRO',
] as const;

export class QueryDocumentoDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: TIPOS })
  @IsOptional()
  @IsEnum(TIPOS)
  tipoDocumento?: string;

  @ApiPropertyOptional({ enum: ['PENDIENTE', 'VALIDADO', 'RECHAZADO'] })
  @IsOptional()
  @IsEnum(['PENDIENTE', 'VALIDADO', 'RECHAZADO'] as const)
  estado?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
