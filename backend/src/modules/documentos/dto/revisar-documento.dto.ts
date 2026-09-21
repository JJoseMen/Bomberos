import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class RevisarDocumentoDto {
  @ApiProperty({ enum: ['VALIDADO', 'RECHAZADO'] })
  @IsEnum(['VALIDADO', 'RECHAZADO'] as const)
  estado!: string;

  @ApiPropertyOptional({ example: 'Documento ilegible' })
  @IsOptional()
  @IsString()
  observacion?: string;
}
