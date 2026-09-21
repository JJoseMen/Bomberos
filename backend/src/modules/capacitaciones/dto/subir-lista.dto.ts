import { ApiProperty } from '@nestjs/swagger';

export class SubirListaDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file!: any;
}
