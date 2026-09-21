import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminService } from './admin.service';
import { QueryAdminDto } from './dto/query-admin.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'KPIs del sistema' })
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('solicitudes')
  @ApiOperation({ summary: 'Listar solicitudes' })
  async findAll(@Query() query: QueryAdminDto) {
    return this.adminService.findAllSolicitudes(query);
  }

  @Get('solicitudes/:codigo')
  @ApiOperation({ summary: 'Detalle solicitud' })
  async findOne(@Param('codigo') codigo: string) {
    return this.adminService.findOneSolicitud(codigo);
  }

  @Get('solicitudes/:codigo/estados-permitidos')
  @ApiOperation({ summary: 'Estados permitidos para transicion' })
  async getEstadosPermitidos(@Param('codigo') codigo: string) {
    return this.adminService.getEstadosPermitidos(codigo);
  }

  @Get('alertas')
  @ApiOperation({ summary: 'Alertas del sistema' })
  async getAlertas() {
    return this.adminService.getAlertas();
  }
}
