import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EstadoSolicitud } from '@prisma/client';
import { CrearRenovacionDto } from './dto/crear-renovacion.dto';
import { QueryRenovacionDto } from './dto/query-renovacion.dto';

@Injectable()
export class RenovacionesService {
  constructor(private prisma: PrismaService) {}

  async crear(codigoSolicitud: string, dto: CrearRenovacionDto, usuarioId: number) {
    const solOriginal = await this.prisma.solicitudes.findFirst({
      where: { codigoFormulario: codigoSolicitud },
      include: { certificados: true },
    });
    if (!solOriginal) throw new NotFoundException('Solicitud original no encontrada');
    if (solOriginal.usuarioId !== usuarioId)
      throw new BadRequestException('No es tu solicitud');
    if (!['CERTIFICADO_EMITIDO', 'VENCIDO'].includes(solOriginal.estado))
      throw new BadRequestException('La solicitud debe estar en CERTIFICADO_EMITIDO o VENCIDO');

    if (solOriginal.certificados?.codigoCertificado !== dto.codigoCertificadoAnterior)
      throw new BadRequestException('El codigo del certificado anterior no coincide');

    const datosJson = dto.datosActualizados ?? solOriginal.datosJson as Record<string, unknown>;

    return this.prisma.solicitudes.create({
      data: {
        codigoFormulario: `BOR-REN-${Date.now()}`,
        tipoTramite: solOriginal.tipoTramite,
        subtipoTramite: solOriginal.subtipoTramite,
        estado: EstadoSolicitud.BORRADOR,
        usuarioId,
        empresaId: solOriginal.empresaId,
        datosJson: datosJson as any,
        esRenovacion: true,
        solicitudAnteriorId: solOriginal.id,
      },
    });
  }

  async findAll(query: QueryRenovacionDto) {
    const page = parseInt(query.page ?? '1', 10);
    const limit = parseInt(query.limit ?? '20', 10);
    const where: Record<string, unknown> = { esRenovacion: true };

    if (query.search) {
      where.OR = [
        { codigoFormulario: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.estado) where.estado = query.estado;

    const [items, total] = await Promise.all([
      this.prisma.solicitudes.findMany({
        where, skip: (page - 1) * limit, take: limit,
        include: {
          usuario: { select: { id: true, nombre: true, email: true } },
          solicitudAnterior: { select: { id: true, codigoFormulario: true, estado: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.solicitudes.count({ where }),
    ]);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(codigo: string) {
    const sol = await this.prisma.solicitudes.findFirst({
      where: { codigoFormulario: codigo, esRenovacion: true },
      include: {
        usuario: { select: { id: true, nombre: true, email: true } },
        solicitudAnterior: { select: { id: true, codigoFormulario: true, estado: true } },
        documentos: true, pagos: true, certificados: true,
      },
    });
    if (!sol) throw new NotFoundException(`Renovacion ${codigo} no encontrada`);
    return sol;
  }
}
