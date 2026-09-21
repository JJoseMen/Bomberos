import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateEmpresaDto {
  @ApiProperty({ example: '1234567890' })
  @IsString()
  nit!: string;

  @ApiProperty({ example: 'Boliviana de Seguridad S.A.' })
  @IsString()
  razonSocial!: string;

  @ApiPropertyOptional({ example: 'Juan Perez Lopez' })
  @IsOptional()
  @IsString()
  representanteLegal?: string;

  @ApiPropertyOptional({ example: '12345678' })
  @IsOptional()
  @IsString()
  ciRepresentante?: string;

  @ApiPropertyOptional({ example: 'Av. Principal #1234' })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({ example: '2-123456' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({ example: 'info@empresa.gob.bo' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'La Paz' })
  @IsOptional()
  @IsString()
  departamento?: string;
}
