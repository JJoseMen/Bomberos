import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class RegistrarInformeDto {
  @ApiProperty({ enum: ['APTO', 'OBSERVADO', 'NO_APTO'] })
  @IsIn(['APTO', 'OBSERVADO', 'NO_APTO'])
  resultado!: string;

  @ApiProperty()
  @IsString()
  observaciones!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  informeRuta?: string;
}
