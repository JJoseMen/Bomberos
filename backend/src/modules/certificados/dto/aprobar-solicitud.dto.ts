import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class AprobarSolicitudDto {
  @ApiPropertyOptional({ example: 'Solicitud aprobada, emitir certificado' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  observacion?: string;
}
