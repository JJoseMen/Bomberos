import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

const TIPOS = [
  'FORMULARIO', 'PLANO_SIPPCI', 'PLAN_EMERGENCIA',
  'CREDENCIAL_PROFESIONAL', 'NIT', 'BOLETA_DEPOSITO',
  'CERTIFICADO_ANTERIOR', 'OTRO',
] as const;

export class SubirDocumentoDto {
  @ApiProperty({ enum: TIPOS })
  @IsEnum(TIPOS)
  tipoDocumento!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descripcion?: string;
}
