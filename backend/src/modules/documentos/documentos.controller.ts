import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import type { Response } from 'express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { DocumentosService } from './documentos.service';
import { QueryDocumentoDto } from './dto/query-documento.dto';
import { RevisarDocumentoDto } from './dto/revisar-documento.dto';

@ApiTags('Documentos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class DocumentosController {
  constructor(private documentosService: DocumentosService) {}

  @Post('solicitudes/:codigo/documentos')
  @ApiOperation({ summary: 'Subir documento a una solicitud' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async subir(
    @Param('codigo') codigo: string,
    @UploadedFile() file: any,
    @Body('tipoDocumento') tipoDocumento: string,
    @CurrentUser('id') userId: number,
  ) {
    return this.documentosService.subir(codigo, tipoDocumento, file, userId);
  }

  @Get('solicitudes/:codigo/documentos')
  @ApiOperation({ summary: 'Listar documentos de una solicitud' })
  async findAll(
    @Param('codigo') codigo: string,
    @Query() query: QueryDocumentoDto,
  ) {
    return this.documentosService.findAll(codigo, query);
  }

  @Get('documentos/:id/descargar')
  @ApiOperation({ summary: 'Descargar documento' })
  async descargar(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const info = await this.documentosService.descargar(id);
    res.setHeader(
      'Content-Type',
      info.mime ?? 'application/octet-stream',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(info.nombre)}"`,
    );
    const stream = createReadStream(info.ruta);
    return new StreamableFile(stream);
  }

  @Patch('documentos/:id/revisar')
  @ApiOperation({ summary: 'Revisar documento (admin/oficial)' })
  async revisar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RevisarDocumentoDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.documentosService.revisar(id, dto, userId);
  }

  @Delete('documentos/:id')
  @ApiOperation({ summary: 'Eliminar documento' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.documentosService.remove(id, userId);
  }
}
