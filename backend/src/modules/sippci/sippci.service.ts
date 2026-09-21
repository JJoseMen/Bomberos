import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EstadoSolicitud } from '@prisma/client';
import { CrearSippciDto } from './dto/crear-sippci.dto';
import { QuerySippciDto } from './dto/query-sippci.dto';

@Injectable()
export class SippciService {
  constructor(private prisma: PrismaService) {}

  async crear(dto: CrearSippciDto, usuarioId: number) {
    const user = await this.prisma.usuarios.findUnique({ where: { id: usuarioId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const datosJson = {
      ...dto.datosEspecificos,
      tipoPersona: dto.tipoPersona,
      nombreCompleto: dto.nombreCompleto,
      ci: dto.ci,
      nit: dto.nit,
      email: dto.email,
      telefono: dto.telefono,
      direccion: dto.direccion,
      ciudad: dto.ciudad,
      departamento: dto.departamento,
      tipoInfraestructura: dto.tipoInfraestructura,
      nivelRiesgo: dto.nivelRiesgo,
      superficie: dto.superficie,
      aforoMaximo: dto.aforoMaximo,
    };

    const subtipo = dto.tipoPersona === 'JURIDICA' ? 'JURIDICA' : 'NATURAL';

    return this.prisma.solicitudes.create({
      data: {
        codigoFormulario: `BOR-SIPPCI-${Date.now()}`,
        tipoTramite: 'CERTIFICACION_SIPPCI',
        subtipoTramite: subtipo as any,
        estado: EstadoSolicitud.BORRADOR,
        usuarioId,
        datosJson: datosJson as any,
      },
    });
  }

  async findAll(query: QuerySippciDto) {
    const page = parseInt(query.page ?? '1', 10);
    const limit = parseInt(query.limit ?? '20', 10);
    const where: Record<string, unknown> = { tipoTramite: 'CERTIFICACION_SIPPCI' };

    if (query.search) {
      where.OR = [
        { codigoFormulario: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.nivelRiesgo) {
      where.datosJson = { path: ['nivelRiesgo'], equals: query.nivelRiesgo };
    }

    const [items, total] = await Promise.all([
      this.prisma.solicitudes.findMany({
        where, skip: (page - 1) * limit, take: limit,
        include: { usuario: { select: { id: true, nombre: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.solicitudes.count({ where }),
    ]);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(codigo: string) {
    const sol = await this.prisma.solicitudes.findFirst({
      where: { codigoFormulario: codigo, tipoTramite: 'CERTIFICACION_SIPPCI' },
      include: {
        usuario: { select: { id: true, nombre: true, email: true } },
        empresa: true, documentos: true, pagos: true, certificados: true,
      },
    });
    if (!sol) throw new NotFoundException(`Solicitud ${codigo} no encontrada`);
    return sol;
  }
}
