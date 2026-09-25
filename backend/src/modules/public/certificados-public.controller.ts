import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { CertificadosPublicService } from './certificados-public.service';

@ApiTags('Public - Validación')
@Controller('public/validar-certificado')
export class CertificadosPublicController {
  constructor(private service: CertificadosPublicService) {}

  @Get(':codigo')
  @Public()
  @ApiOperation({ summary: 'Validar certificado público por código' })
  async validar(@Param('codigo') codigo: string) {
    return this.service.validar(codigo);
  }
}
