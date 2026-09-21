import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { NotificacionesService } from './notificaciones.service';
import { QueryNotificacionDto } from './dto/query-notificacion.dto';

@ApiTags('Notificaciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notificaciones')
export class NotificacionesController {
  constructor(private notificacionesService: NotificacionesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar mis notificaciones' })
  async findAll(
    @CurrentUser('id') userId: number,
    @Query() query: QueryNotificacionDto,
  ) {
    return this.notificacionesService.findAll(userId, query);
  }

  @Patch(':id/leida')
  @ApiOperation({ summary: 'Marcar notificacion como leida' })
  async marcarLeida(
    @Param('id') id: string,
    @CurrentUser('id') userId: number,
  ) {
    return this.notificacionesService.marcarLeida(+id, userId);
  }

  @Patch('leer-todas')
  @ApiOperation({ summary: 'Marcar todas como leidas' })
  async marcarTodasLeidas(@CurrentUser('id') userId: number) {
    return this.notificacionesService.marcarTodasLeidas(userId);
  }
}
