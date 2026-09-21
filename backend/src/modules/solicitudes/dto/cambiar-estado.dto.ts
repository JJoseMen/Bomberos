import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CambiarEstadoDto {
  @ApiProperty({
    enum: ['ENVIADA', 'EN_REVISION', 'OBSERVADA', 'APROBADA', 'RECHAZADA', 'ANULADA'],
  })
  @IsEnum(['ENVIADA', 'EN_REVISION', 'OBSERVADA', 'APROBADA', 'RECHAZADA', 'ANULADA'] as const)
  estado!: string;

  @ApiPropertyOptional({ example: 'Falta documentacion adicional' })
  @IsOptional()
  @IsString()
  observacion?: string;
}
