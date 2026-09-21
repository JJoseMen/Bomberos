import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class KerberosExchangeDto {
  @ApiProperty({ example: 'base64-encoded-ticket-data' })
  @IsString()
  ticket!: string;
}
