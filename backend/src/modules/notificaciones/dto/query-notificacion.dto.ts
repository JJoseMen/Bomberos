import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsEnum, IsNumberString, IsOptional } from 'class-validator';

export class QueryNotificacionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBooleanString()
  leida?: string;

  @ApiPropertyOptional({ enum: ['EMAIL', 'SMS', 'APP', 'SISTEMA'] })
  @IsOptional()
  @IsEnum(['EMAIL', 'SMS', 'APP', 'SISTEMA'] as const)
  tipo?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
