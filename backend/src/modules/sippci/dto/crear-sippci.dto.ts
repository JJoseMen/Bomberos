import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class CrearSippciDto {
  @ApiProperty({ enum: ['NATURAL', 'JURIDICA'] })
  @IsEnum(['NATURAL', 'JURIDICA'] as const)
  tipoPersona!: string;

  @ApiProperty({ example: 'Empresa Test S.R.L.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombreCompleto!: string;

  @ApiPropertyOptional({ example: '12345678' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  ci?: string;

  @ApiPropertyOptional({ example: '1234567890' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  nit?: string;

  @ApiProperty({ example: 'empresa@email.com' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: '2-123456' })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  telefono?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  direccion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  ciudad?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  departamento?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  tipoInfraestructura?: string;

  @ApiPropertyOptional({ enum: ['BAJO', 'MEDIO', 'ALTO'] })
  @IsOptional()
  @IsEnum(['BAJO', 'MEDIO', 'ALTO'] as const)
  nivelRiesgo?: string;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber()
  superficie?: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsNumber()
  aforoMaximo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  datosEspecificos?: Record<string, unknown>;
}
