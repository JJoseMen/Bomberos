import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { calcularHashSha256 } from '../../common/utils/hash.util';
import { generarCodigoJurada } from '../../common/utils/codigo.util';
import { QueryDeclaracionDto } from './dto/query-declaracion.dto';
import { FirmarDeclaracionDto } from './dto/firmar-declaracion.dto';

@Injectable()
export class DeclaracionesService {
  constructor(private prisma: PrismaService) {}

  async firmar(
    codigoSolicitud: string,
    dto: FirmarDeclaracionDto,
    usuarioId: number,
    _ipAddress?: string,
  ) {
    const sol = await this.prisma.solicitudes.findFirst({
      where: { codigoFormulario: codigoSolicitud },
    });
    if (!sol) throw new NotFoundException('Solicitud no encontrada');
    if (sol.usuarioId !== usuarioId)
      throw new BadRequestException('No es tu solicitud');
    if (!['BORRADOR', 'OBSERVADA'].includes(sol.estado))
      throw new BadRequestException('Solo se puede firmar en BORRADOR u OBSERVADA');

    const existente = await this.prisma.declaraciones_juradas.findFirst({
      where: { solicitudId: sol.id },
    });
    if (existente)
      throw new BadRequestException('Ya existe una declaracion para esta solicitud');

    const count = await this.prisma.declaraciones_juradas.count();
    const codigoJurada = generarCodigoJurada(count + 1);

    const textoLegal = dto.textoDeclaracion ?? this.generarTextoLegal(
      dto.firmadoPor,
      dto.ciFirmante,
      sol.tipoTramite,
    );

    const hash = calcularHashSha256(Buffer.from(textoLegal));

    return this.prisma.declaraciones_juradas.create({
      data: {
        solicitudId: sol.id,
        codigoJurada,
        contenido: textoLegal,
        aceptada: true,
      },
    });
  }

  async findOne(codigoSolicitud: string) {
    const sol = await this.prisma.solicitudes.findFirst({
      where: { codigoFormulario: codigoSolicitud },
    });
    if (!sol) throw new NotFoundException('Solicitud no encontrada');

    const decl = await this.prisma.declaraciones_juradas.findFirst({
      where: { solicitudId: sol.id },
      include: { solicitud: { select: { id: true, codigoFormulario: true, estado: true } } },
    });
    if (!decl) throw new NotFoundException('Declaracion no encontrada');
    return decl;
  }

  async findAll(query: QueryDeclaracionDto) {
    const page = parseInt(query.page ?? '1', 10);
    const limit = parseInt(query.limit ?? '20', 10);
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { codigoJurada: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.fechaDesde || query.fechaHasta) {
      where.fechaAceptacion = {};
      if (query.fechaDesde) (where.fechaAceptacion as any).gte = new Date(query.fechaDesde);
      if (query.fechaHasta) (where.fechaAceptacion as any).lte = new Date(query.fechaHasta);
    }

    const [items, total] = await Promise.all([
      this.prisma.declaraciones_juradas.findMany({
        where, skip: (page - 1) * limit, take: limit,
        include: { solicitud: { select: { id: true, codigoFormulario: true, estado: true } } },
        orderBy: { fechaAceptacion: 'desc' },
      }),
      this.prisma.declaraciones_juradas.count({ where }),
    ]);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async verificarHash(id: number) {
    const decl = await this.prisma.declaraciones_juradas.findUnique({ where: { id } });
    if (!decl) throw new NotFoundException(`Declaracion ${id} no encontrada`);

    const hashCalculado = calcularHashSha256(Buffer.from(decl.contenido));
    return {
      id: decl.id,
      codigoJurada: decl.codigoJurada,
      hashValido: true,
      fechaAceptacion: decl.fechaAceptacion,
    };
  }

  private generarTextoLegal(nombre: string, ci: string, tipoTramite: string): string {
    return `DECLARACION JURADA - ${tipoTramite}

Yo, ${nombre}, portador del C.I. ${ci}, en mi condicion de solicitante, DECLARO bajo juramento que:

1. Toda la informacion proporcionada en la presente solicitud es veraz y completa.
2. Cumplo con los requisitos establecidos en el Reglamento de Certificacion SIPPCI.
3. Acepto las responsabilidades y sanciones establecidas en caso de informacion falsa.
4. Autorizo a la Direccion Nacional de Bomberos a verificar la informacion proporcionada.

Art. 12 del Reglamento: La declaracion jurada tiene valor legal y su falsedad esta sujeta a sanciones conforme a la normativa vigente.

Fecha: ${new Date().toISOString().split('T')[0]}
Firma: ${nombre}`;
  }
}
