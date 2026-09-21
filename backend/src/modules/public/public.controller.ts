import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { PublicService } from './public.service';

@ApiTags('Publico')
@Controller('public')
export class PublicController {
  constructor(private publicService: PublicService) {}

  @Get('solicitudes/:codigo/estado')
  @Public()
  @ApiOperation({ summary: 'Consultar estado de solicitud (publico)' })
  async consultarEstado(@Param('codigo') codigo: string) {
    return this.publicService.consultarEstado(codigo);
  }

  @Get('certificados/verificar/:codigo')
  @Public()
  @ApiOperation({ summary: 'Verificar certificado (publico)' })
  async verificarCertificado(@Param('codigo') codigo: string) {
    return this.publicService.verificarCertificado(codigo);
  }
}
