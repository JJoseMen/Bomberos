import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { calcularHashSha256 } from '../../common/utils/hash.util';
import { QueryDocumentoDto } from './dto/query-documento.dto';
import { RevisarDocumentoDto } from './dto/revisar-documento.dto';
import { unlink, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

const UPLOADS_DIR = join(process.cwd(), 'uploads');

@Injectable()
export class DocumentosService {
  constructor(private prisma: PrismaService) {}

  async subir(
    codigoSolicitud: string,
    tipoDocumento: string,
    file: any,
    usuarioId: number,
  ) {
    const sol = await this.prisma.solicitudes.findFirst({
      where: { codigoFormulario: codigoSolicitud },
    });
    if (!sol) throw new NotFoundException('Solicitud no encontrada');
    if (sol.usuarioId !== usuarioId)
      throw new ForbiddenException('No es tu solicitud');
    if (!['BORRADOR', 'OBSERVADA'].includes(sol.estado))
      throw new BadRequestException('Solo se pueden subir documentos en BORRADOR u OBSERVADA');
    const TIPOS_VALIDOS = [
      'FORMULARIO',
      'PLANO_SIPPCI',
      'PLAN_EMERGENCIA',
      'CREDENCIAL_PROFESIONAL',
      'NIT',
      'BOLETA_DEPOSITO',
      'CERTIFICADO_ANTERIOR',
      'OTRO',
    ];
    if (!TIPOS_VALIDOS.includes(tipoDocumento))
      throw new BadRequestException(`Tipo de documento no valido: ${tipoDocumento}`);

    const hash = calcularHashSha256(file.buffer);
    const ext = file.originalname.split('.').pop() ?? 'bin';
    const filename = `${randomUUID()}.${ext}`;
    if (!existsSync(UPLOADS_DIR)) await mkdir(UPLOADS_DIR, { recursive: true });
    const rutaArchivo = join(UPLOADS_DIR, filename);
    await writeFile(rutaArchivo, file.buffer);

    return this.prisma.documentos.create({
      data: {
        solicitudId: sol.id,
        usuarioId,
        tipo: tipoDocumento as any,
        rutaArchivo,
        nombreOriginal: file.originalname,
        mimeType: file.mimetype,
        tamanoBytes: file.size,
        observaciones: `hash:${hash}`,
      },
    });
  }

  async findAll(codigoSolicitud: string, query: QueryDocumentoDto) {
    const sol = await this.prisma.solicitudes.findFirst({
      where: { codigoFormulario: codigoSolicitud },
    });
    if (!sol) throw new NotFoundException('Solicitud no encontrada');

    const where: Record<string, unknown> = { solicitudId: sol.id };
    if (query.tipoDocumento) where.tipo = query.tipoDocumento;
    if (query.estado) where.estado = query.estado;

    const page = parseInt(query.page ?? '1', 10);
    const limit = parseInt(query.limit ?? '20', 10);

    const [items, total] = await Promise.all([
      this.prisma.documentos.findMany({ where, skip: (page - 1) * limit, take: limit }),
      this.prisma.documentos.count({ where }),
    ]);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const doc = await this.prisma.documentos.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException(`Documento ${id} no encontrado`);
    return doc;
  }

  async descargar(id: number) {
    const doc = await this.findOne(id);
    if (!existsSync(doc.rutaArchivo))
      throw new NotFoundException('Archivo no encontrado en storage');
    return { ruta: doc.rutaArchivo, nombre: doc.nombreOriginal, mime: doc.mimeType };
  }

  async revisar(id: number, dto: RevisarDocumentoDto, _usuarioInternoId: number) {
    const doc = await this.findOne(id);
    return this.prisma.documentos.update({
      where: { id },
      data: {
        estado: dto.estado as any,
        observaciones: dto.observacion ?? doc.observaciones,
      },
    });
  }

  async remove(id: number, usuarioId: number) {
    const doc = await this.findOne(id);
    const sol = await this.prisma.solicitudes.findUnique({ where: { id: doc.solicitudId } });
    if (!sol) throw new NotFoundException('Solicitud no encontrada');
    if (sol.usuarioId !== usuarioId)
      throw new ForbiddenException('No es tu solicitud');
    if (!['BORRADOR', 'OBSERVADA'].includes(sol.estado))
      throw new BadRequestException('Solo se pueden eliminar documentos en BORRADOR u OBSERVADA');

    if (existsSync(doc.rutaArchivo)) await unlink(doc.rutaArchivo);
    await this.prisma.documentos.delete({ where: { id } });
    return { message: 'Documento eliminado' };
  }
}
