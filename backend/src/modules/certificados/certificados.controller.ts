import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CertificadosService } from './certificados.service';
import { RevisarSolicitudDto } from './dto/revisar-solicitud.dto';
import { AprobarSolicitudDto } from './dto/aprobar-solicitud.dto';
import { RegistrarCertificadoDto } from './dto/registrar-certificado.dto';
import { QueryCertificadoDto } from './dto/query-certificado.dto';

@ApiTags('Certificados')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class CertificadosController {
  constructor(private certificadosService: CertificadosService) {}

  @Patch('solicitudes/:codigo/revisar')
  @ApiOperation({ summary: 'Visto bueno del oficial (EN_REVISION -> REVISADO)' })
  async revisar(
    @Param('codigo') codigo: string,
    @Body() dto: RevisarSolicitudDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.certificadosService.revisar(codigo, dto, userId);
  }

  @Patch('solicitudes/:codigo/aprobar')
  @ApiOperation({ summary: 'Aprobar solicitud (REVISADO -> APROBADO)' })
  async aprobar(
    @Param('codigo') codigo: string,
    @Body() dto: AprobarSolicitudDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.certificadosService.aprobar(codigo, dto, userId);
  }

  @Patch('solicitudes/:codigo/registrar-certificado')
  @ApiOperation({ summary: 'Registrar codigo fisico del certificado' })
  async registrarCertificado(
    @Param('codigo') codigo: string,
    @Body() dto: RegistrarCertificadoDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.certificadosService.registrarCertificado(codigo, dto, userId);
  }

  @Patch('certificados/:id/entregar')
  @ApiOperation({ summary: 'Marcar certificado como entregado (cajero/admin)' })
  async entregar(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.certificadosService.marcarEntregado(id, userId);
  }

  @Get('solicitudes/:codigo/certificado')
  @ApiOperation({ summary: 'Consultar certificado de una solicitud' })
  async findOne(@Param('codigo') codigo: string) {
    return this.certificadosService.findOne(codigo);
  }

  @Get('certificados/verificar/:codigoCertificado')
  @Public()
  @ApiOperation({ summary: 'Verificar certificado (publico)' })
  async verificar(@Param('codigoCertificado') codigoCertificado: string) {
    return this.certificadosService.verificarPorCodigo(codigoCertificado);
  }

  @Get('certificados')
  @ApiOperation({ summary: 'Listar certificados emitidos' })
  async findAll(@Query() query: QueryCertificadoDto) {
    return this.certificadosService.findAll(query);
  }
}
