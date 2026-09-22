import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class AprobarDeclaracionDto {
  @ApiPropertyOptional({ example: 'Documentacion conforme' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  observacion?: string;
}