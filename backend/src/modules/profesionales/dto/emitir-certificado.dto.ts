import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EmitirCertificadoDto {
  @ApiPropertyOptional({ description: 'Observaciones adicionales al emitir' })
  @IsOptional()
  @IsString()
  observaciones?: string;
}
