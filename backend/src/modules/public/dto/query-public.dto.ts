import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class QueryPublicDto {
  @ApiProperty({ example: 'SIPPCI-NAT-2026-00001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codigo!: string;
}
