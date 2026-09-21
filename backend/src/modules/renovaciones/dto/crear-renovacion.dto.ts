import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class CrearRenovacionDto {
  @ApiProperty({ example: 'CERT-INF-2026-00001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codigoCertificadoAnterior!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  datosActualizados?: Record<string, unknown>;
}
