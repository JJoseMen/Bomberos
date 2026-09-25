import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional } from 'class-validator';

export class ObservarCumplimientoDto {
  @ApiProperty()
  @IsString()
  @MinLength(10, { message: 'La justificación debe tener al menos 10 caracteres' })
  justificacion!: string;
}

export class RechazarCumplimientoDto {
  @ApiProperty()
  @IsString()
  @MinLength(10, { message: 'La justificación debe tener al menos 10 caracteres' })
  justificacion!: string;
}

export class EmitirCertificadoCumplimientoDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  observaciones?: string;
}
