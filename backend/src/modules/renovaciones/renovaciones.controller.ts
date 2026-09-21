import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RenovacionesService } from './renovaciones.service';
import { CrearRenovacionDto } from './dto/crear-renovacion.dto';
import { QueryRenovacionDto } from './dto/query-renovacion.dto';

@ApiTags('Renovaciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class RenovacionesController {
  constructor(private renovacionesService: RenovacionesService) {}

  @Post('solicitudes/:codigo/renovar')
  @ApiOperation({ summary: 'Crear solicitud de renovacion' })
  async crear(
    @Param('codigo') codigo: string,
    @Body() dto: CrearRenovacionDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.renovacionesService.crear(codigo, dto, userId);
  }

  @Get('renovaciones')
  @ApiOperation({ summary: 'Listar renovaciones (admin/oficial)' })
  async findAll(@Query() query: QueryRenovacionDto) {
    return this.renovacionesService.findAll(query);
  }

  @Get('renovaciones/:codigo')
  @ApiOperation({ summary: 'Detalle de renovacion' })
  async findOne(@Param('codigo') codigo: string) {
    return this.renovacionesService.findOne(codigo);
  }
}
