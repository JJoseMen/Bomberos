import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class VerificarPagoDto {
  @ApiProperty({ enum: ['VERIFICADO', 'RECHAZADO'] })
  @IsEnum(['VERIFICADO', 'RECHAZADO'] as const)
  estado!: string;

  @ApiPropertyOptional({ example: 'Comprobante no valido' })
  @IsOptional()
  @IsString()
  observacion?: string;
}
