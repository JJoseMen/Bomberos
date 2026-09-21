import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

export class QueryUsuarioDto {
  @ApiPropertyOptional({ example: 'juan' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ['NATURAL', 'JURIDICA'] })
  @IsOptional()
  @IsEnum(['NATURAL', 'JURIDICA'] as const)
  tipoPersona?: 'NATURAL' | 'JURIDICA';

  @ApiPropertyOptional({ example: 'La Paz' })
  @IsOptional()
  @IsString()
  departamento?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
