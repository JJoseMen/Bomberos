import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { DeclaracionesService } from './declaraciones.service';
import { FirmarDeclaracionDto } from './dto/firmar-declaracion.dto';
import { QueryDeclaracionDto } from './dto/query-declaracion.dto';
import { Request } from 'express';

@ApiTags('Declaraciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class DeclaracionesController {
  constructor(private declaracionesService: DeclaracionesService) {}

  @Post('solicitudes/:codigo/declaracion')
  @ApiOperation({ summary: 'Firmar declaracion jurada' })
  async firmar(
    @Param('codigo') codigo: string,
    @Body() dto: FirmarDeclaracionDto,
    @CurrentUser('id') userId: number,
    @Req() req: Request,
  ) {
    return this.declaracionesService.firmar(codigo, dto, userId, req.ip);
  }

  @Get('solicitudes/:codigo/declaracion')
  @ApiOperation({ summary: 'Consultar declaracion de una solicitud' })
  async findOne(@Param('codigo') codigo: string) {
    return this.declaracionesService.findOne(codigo);
  }

  @Get('declaraciones')
  @ApiOperation({ summary: 'Listar declaraciones (admin/oficial)' })
  async findAll(@Query() query: QueryDeclaracionDto) {
    return this.declaracionesService.findAll(query);
  }

  @Get('declaraciones/:id/verificar')
  @ApiOperation({ summary: 'Verificar hash de declaracion' })
  async verificarHash(@Param('id') id: string) {
    return this.declaracionesService.verificarHash(+id);
  }
}
