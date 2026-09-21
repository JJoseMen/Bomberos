import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmpresasService } from './empresas.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { QueryEmpresaDto } from './dto/query-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Empresas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('empresas')
export class EmpresasController {
  constructor(private empresasService: EmpresasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear empresa' })
  async create(@Body() dto: CreateEmpresaDto) {
    return this.empresasService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar empresas' })
  async findAll(@Query() query: QueryEmpresaDto) {
    return this.empresasService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalle de empresa' })
  async findOne(@Param('id') id: string) {
    return this.empresasService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar empresa' })
  async update(@Param('id') id: string, @Body() dto: UpdateEmpresaDto) {
    return this.empresasService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar empresa' })
  async remove(@Param('id') id: string) {
    return this.empresasService.remove(+id);
  }
}
