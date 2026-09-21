import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

export class QuerySippciDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ['NATURAL', 'JURIDICA'] })
  @IsOptional()
  @IsEnum(['NATURAL', 'JURIDICA'] as const)
  tipoPersona?: string;

  @ApiPropertyOptional({ enum: ['BAJO', 'MEDIO', 'ALTO'] })
  @IsOptional()
  @IsEnum(['BAJO', 'MEDIO', 'ALTO'] as const)
  nivelRiesgo?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
