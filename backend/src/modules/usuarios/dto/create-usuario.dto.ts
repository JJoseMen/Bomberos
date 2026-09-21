import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUsuarioDto {
  @ApiPropertyOptional({ example: '12345678' })
  @IsOptional()
  @IsString()
  ci?: string;

  @ApiPropertyOptional({ example: '1234567890' })
  @IsOptional()
  @IsString()
  nit?: string;

  @ApiProperty({ example: 'Juan Perez Lopez' })
  @IsString()
  nombreCompleto!: string;

  @ApiProperty({ example: 'juan@correo.com' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: '71234567' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ enum: ['NATURAL', 'JURIDICA'], example: 'NATURAL' })
  @IsEnum(['NATURAL', 'JURIDICA'] as const)
  tipoPersona!: 'NATURAL' | 'JURIDICA';

  @ApiPropertyOptional({ example: 'La Paz' })
  @IsOptional()
  @IsString()
  departamento?: string;
}
