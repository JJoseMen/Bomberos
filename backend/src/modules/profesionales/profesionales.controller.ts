import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ProfesionalesService } from './profesionales.service';
import { CrearProfesionalDto } from './dto/crear-profesional.dto';
import { QueryProfesionalDto } from './dto/query-profesional.dto';

@ApiTags('Profesionales')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profesionales')
export class ProfesionalesController {
  constructor(private profesionalesService: ProfesionalesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear solicitud de registro profesional' })
  async crear(@Body() dto: CrearProfesionalDto, @CurrentUser('id') userId: number) {
    return this.profesionalesService.crear(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar solicitudes de profesionales' })
  async findAll(@Query() query: QueryProfesionalDto) {
    return this.profesionalesService.findAll(query);
  }

  @Get(':codigo')
  @ApiOperation({ summary: 'Detalle de solicitud profesional' })
  async findOne(@Param('codigo') codigo: string) {
    return this.profesionalesService.findOne(codigo);
  }
}
