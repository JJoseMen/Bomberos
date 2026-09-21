import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateSolicitudDto {
  @ApiProperty({
    enum: ['CERTIFICACION_SIPPCI', 'REGISTRO_PROFESIONAL', 'CAPACITACION', 'RENOVACION'],
  })
  @IsEnum(['CERTIFICACION_SIPPCI', 'REGISTRO_PROFESIONAL', 'CAPACITACION', 'RENOVACION'] as const)
  tipoTramite!: string;

  @ApiProperty({
    enum: ['INFRAESTRUCTURA', 'HIDROCARBUROS', 'POLIGONO_TIRO', 'TURISMO', 'NATURAL', 'JURIDICA', 'ASESOR_EMERGENCIA'],
  })
  @IsEnum(['INFRAESTRUCTURA', 'HIDROCARBUROS', 'POLIGONO_TIRO', 'TURISMO', 'NATURAL', 'JURIDICA', 'ASESOR_EMERGENCIA'] as const)
  subtipoTramite!: string;

  @ApiPropertyOptional({ example: { descripcion: 'Solicitud de certificacion', direccionLocal: 'Av. Principal' } })
  @IsOptional()
  @IsObject()
  datosJson?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  empresaId?: string;
}
