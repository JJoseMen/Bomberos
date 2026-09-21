import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CrearParticipanteDto {
  @ApiProperty({ example: 'Juan Perez Lopez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombreCompleto!: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  carnet!: string;

  @ApiProperty({ example: 'LP' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  expedido!: string;

  @ApiPropertyOptional({ example: 'juan@email.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '71234567' })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  telefono?: string;

  @ApiProperty({ example: ['EXTINTORES', 'PRIMEROS_AUXILIOS'] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  cursos!: string[];
}
