import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RegistrarPagoDto {
  @ApiPropertyOptional({ example: '123456' })
  @IsOptional()
  @IsString()
  numeroOperacion?: string;

  @ApiPropertyOptional({ example: 'BOL-2026-001' })
  @IsOptional()
  @IsString()
  numeroBoleta?: string;

  @ApiProperty({ example: 200.0 })
  @IsNumber()
  @IsNotEmpty()
  monto!: number;

  @ApiPropertyOptional({ example: 'BOB' })
  @IsOptional()
  @IsString()
  moneda?: string;

  @ApiPropertyOptional({ example: '2026-09-20' })
  @IsOptional()
  @IsDateString()
  fechaDeposito?: string;

  @ApiPropertyOptional({ example: 'Banco Union' })
  @IsOptional()
  @IsString()
  banco?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comprobanteRuta?: string;
}
