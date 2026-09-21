import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CrearNotificacionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  usuarioId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  solicitudId?: number;

  @ApiProperty({ enum: ['EMAIL', 'SMS', 'APP', 'SISTEMA'] })
  @IsEnum(['EMAIL', 'SMS', 'APP', 'SISTEMA'] as const)
  tipo!: string;

  @ApiProperty({ example: 'Certificado proximo a vencer' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  titulo!: string;

  @ApiProperty({ example: 'Su certificado vence en 30 dias' })
  @IsString()
  @IsNotEmpty()
  mensaje!: string;
}
