import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EstadoSolicitud } from '@prisma/client';
import { CrearProfesionalDto } from './dto/crear-profesional.dto';
import { QueryProfesionalDto } from './dto/query-profesional.dto';

@Injectable()
export class ProfesionalesService {
  constructor(private prisma: PrismaService) {}

  async crear(dto: CrearProfesionalDto, usuarioId: number) {
    const user = await this.prisma.usuarios.findUnique({ where: { id: usuarioId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const count = await this.prisma.solicitudes.count({
      where: { usuarioId, tipoTramite: 'REGISTRO_PROFESIONAL' },
    });

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
      tituloProfesional: dto.tituloProfesional,
      carrera: dto.carrera,
      nivelEducacion: dto.nivelEducacion,
    };

    const subtipo = dto.tipoPersona === 'JURIDICA' ? 'JURIDICA' : 'NATURAL';

    return this.prisma.solicitudes.create({
      data: {
        codigoFormulario: `BOR-PROF-${Date.now()}`,
        tipoTramite: 'REGISTRO_PROFESIONAL',
        subtipoTramite: subtipo as any,
        estado: EstadoSolicitud.BORRADOR,
        usuarioId,
        datosJson: datosJson as any,
      },
    });
  }

  async findAll(query: QueryProfesionalDto) {
    const page = parseInt(query.page ?? '1', 10);
    const limit = parseInt(query.limit ?? '20', 10);
    const where: Record<string, unknown> = { tipoTramite: 'REGISTRO_PROFESIONAL' };

    if (query.search) {
      where.OR = [
        { codigoFormulario: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.tipoPersona) {
      where.datosJson = { path: ['tipoPersona'], equals: query.tipoPersona };
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
      where: { codigoFormulario: codigo, tipoTramite: 'REGISTRO_PROFESIONAL' },
      include: {
        usuario: { select: { id: true, nombre: true, email: true } },
        documentos: true, pagos: true, certificados: true,
      },
    });
    if (!sol) throw new NotFoundException(`Solicitud ${codigo} no encontrada`);
    return sol;
  }
}
