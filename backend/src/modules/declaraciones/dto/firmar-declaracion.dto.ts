import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class FirmarDeclaracionDto {
  @ApiProperty({ example: 'Juan Perez Lopez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firmadoPor!: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  ciFirmante!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  textoDeclaracion?: string;
}
