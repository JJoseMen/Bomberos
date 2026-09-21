import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PagosService } from './pagos.service';
import { RegistrarPagoDto } from './dto/registrar-pago.dto';
import { VerificarPagoDto } from './dto/verificar-pago.dto';
import { QueryPagoDto } from './dto/query-pago.dto';

@ApiTags('Pagos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class PagosController {
  constructor(private pagosService: PagosService) {}

  @Post('solicitudes/:codigo/pago')
  @ApiOperation({ summary: 'Registrar pago para una solicitud' })
  async registrar(
    @Param('codigo') codigo: string,
    @Body() dto: RegistrarPagoDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.pagosService.registrar(codigo, dto, userId);
  }

  @Get('solicitudes/:codigo/pago')
  @ApiOperation({ summary: 'Consultar pago de una solicitud' })
  async findOne(@Param('codigo') codigo: string) {
    return this.pagosService.findOne(codigo);
  }

  @Patch('pagos/:id/verificar')
  @ApiOperation({ summary: 'Verificar pago (cajero/admin)' })
  async verificar(
    @Param('id') id: string,
    @Body() dto: VerificarPagoDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.pagosService.verificar(+id, dto, userId);
  }

  @Get('pagos')
  @ApiOperation({ summary: 'Listar pagos (cajero/admin)' })
  async findAll(@Query() query: QueryPagoDto) {
    return this.pagosService.findAll(query);
  }
}
