import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SippciService } from './sippci.service';
import { CrearSippciDto } from './dto/crear-sippci.dto';
import { QuerySippciDto } from './dto/query-sippci.dto';

@ApiTags('SIPPCI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sippci')
export class SippciController {
  constructor(private sippciService: SippciService) {}

  @Post()
  @ApiOperation({ summary: 'Crear solicitud de certificacion SIPPCI' })
  async crear(@Body() dto: CrearSippciDto, @CurrentUser('id') userId: number) {
    return this.sippciService.crear(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar solicitudes SIPPCI' })
  async findAll(@Query() query: QuerySippciDto) {
    return this.sippciService.findAll(query);
  }

  @Get(':codigo')
  @ApiOperation({ summary: 'Detalle de solicitud SIPPCI' })
  async findOne(@Param('codigo') codigo: string) {
    return this.sippciService.findOne(codigo);
  }
}
