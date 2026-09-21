import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RevisarSolicitudDto {
  @ApiPropertyOptional({ example: 'Documentacion completa y correcta' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  observacion?: string;
}
