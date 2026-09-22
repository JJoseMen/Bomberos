import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { DeclaracionesService } from './declaraciones.service';
import { QueryDeclaracionDto } from './dto/query-declaracion.dto';
import { AprobarDeclaracionDto } from './dto/aprobar-declaracion.dto';

@ApiTags('Declaraciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class DeclaracionesController {
  constructor(private declaracionesService: DeclaracionesService) {}

  @Post('solicitudes/:codigo/declaracion/generar')
  @ApiOperation({ summary: 'Generar PDF de declaracion jurada (SIPPCI)' })
  async generar(
    @Param('codigo') codigo: string,
    @CurrentUser('id') userId: number,
  ) {
    return this.declaracionesService.generarPdf(codigo, userId);
  }

  @Get('solicitudes/:codigo/declaracion/pdf')
  @ApiOperation({ summary: 'Descargar PDF generado de declaracion jurada' })
  async descargarPdf(
    @Param('codigo') codigo: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const pdf = await this.declaracionesService.descargarPdf(codigo);
    res.setHeader('Content-Type', pdf.mime);
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${pdf.nombre}"`,
    );
    return new StreamableFile(createReadStream(pdf.ruta));
  }

  @Get('declaraciones/:id/pdf-firmado')
  @ApiOperation({ summary: 'Descargar PDF firmado de declaracion jurada' })
  async descargarPdfFirmado(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const pdf = await this.declaracionesService.descargarPdfFirmado(+id);
    res.setHeader('Content-Type', pdf.mime);
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${pdf.nombre}"`,
    );
    return new StreamableFile(createReadStream(pdf.ruta));
  }

  @Post('solicitudes/:codigo/declaracion/firmada')
  @ApiOperation({ summary: 'Subir PDF firmado de declaracion jurada' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async subirFirmada(
    @Param('codigo') codigo: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'application/pdf' })],
      }),
    )
    file: any,
  ) {
    return this.declaracionesService.subirFirmada(codigo, file);
  }

  @Get('solicitudes/:codigo/declaracion')
  @ApiOperation({ summary: 'Consultar declaracion de una solicitud' })
  async findOne(@Param('codigo') codigo: string) {
    return this.declaracionesService.findOne(codigo);
  }

  @Patch('declaraciones/:id/aprobar')
  @ApiOperation({ summary: 'Aprobar declaracion jurada (oficial/admin)' })
  async aprobar(
    @Param('id') id: string,
    @Body() dto: AprobarDeclaracionDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.declaracionesService.aprobar(+id, dto, userId);
  }

  @Patch('declaraciones/:id/rechazar')
  @ApiOperation({ summary: 'Rechazar declaracion jurada (oficial/admin)' })
  async rechazar(
    @Param('id') id: string,
    @Body() dto: AprobarDeclaracionDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.declaracionesService.rechazar(+id, dto, userId);
  }

  @Get('declaraciones')
  @ApiOperation({ summary: 'Listar declaraciones (oficial/admin)' })
  async findAll(@Query() query: QueryDeclaracionDto) {
    return this.declaracionesService.findAll(query);
  }

  @Get('declaraciones/:id/verificar')
  @ApiOperation({ summary: 'Verificar hash de declaracion' })
  async verificarHash(@Param('id') id: string) {
    return this.declaracionesService.verificarHash(+id);
  }
}