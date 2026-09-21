import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CrearParticipanteDto } from './dto/crear-participante.dto';
import { QueryParticipanteDto } from './dto/query-participante.dto';
import { ExcelService } from './services/excel.service';

@Injectable()
export class CapacitacionesService {
  constructor(
    private prisma: PrismaService,
    private excelService: ExcelService,
  ) {}

  async listarCursos() {
    return this.prisma.cursos.findMany({ where: { activo: true } });
  }

  async agregarParticipante(
    codigoSolicitud: string, dto: CrearParticipanteDto, usuarioId: number,
  ) {
    const sol = await this.prisma.solicitudes.findFirst({
      where: { codigoFormulario: codigoSolicitud },
    });
    if (!sol) throw new NotFoundException('Solicitud no encontrada');
    if (sol.usuarioId !== usuarioId)
      throw new ForbiddenException('No es tu solicitud');
    if (sol.estado !== 'BORRADOR')
      throw new BadRequestException('Solo se pueden agregar participantes en BORRADOR');

    const cursoRecords = await this.prisma.cursos.findMany({
      where: { nombre: { in: dto.cursos }, activo: true },
    });
    if (cursoRecords.length !== dto.cursos.length) {
      throw new BadRequestException('Algunos cursos no son validos');
    }

    const participante = await this.prisma.participantes_capacitacion.create({
      data: {
        solicitudId: sol.id,
        nombre: dto.nombreCompleto,
        ci: dto.carnet,
        email: dto.email,
        telefono: dto.telefono,
      },
    });

    for (const curso of cursoRecords) {
      await this.prisma.participantes_cursos.create({
        data: {
          participanteId: participante.id,
          cursoId: curso.id,
        },
      });
    }

    return participante;
  }

  async subirLista(codigoSolicitud: string, file: any, usuarioId: number) {
    const sol = await this.prisma.solicitudes.findFirst({
      where: { codigoFormulario: codigoSolicitud },
    });
    if (!sol) throw new NotFoundException('Solicitud no encontrada');
    if (sol.usuarioId !== usuarioId)
      throw new ForbiddenException('No es tu solicitud');
    if (sol.estado !== 'BORRADOR')
      throw new BadRequestException('Solo se pueden agregar participantes en BORRADOR');

    const lista = this.excelService.parsearLista(file.buffer);
    const creados = [];

    for (const item of lista) {
      const participante = await this.prisma.participantes_capacitacion.create({
        data: {
          solicitudId: sol.id,
          nombre: item.nombre,
          ci: item.ci,
          email: item.email,
          telefono: item.telefono,
        },
      });

      const cursos = await this.prisma.cursos.findMany({
        where: { nombre: { in: item.cursos }, activo: true },
      });
      for (const curso of cursos) {
        await this.prisma.participantes_cursos.create({
          data: { participanteId: participante.id, cursoId: curso.id },
        });
      }
      creados.push(participante);
    }
    return { creados: creados.length, participantes: creados };
  }

  async listarParticipantes(codigoSolicitud: string, query: QueryParticipanteDto) {
    const sol = await this.prisma.solicitudes.findFirst({
      where: { codigoFormulario: codigoSolicitud },
    });
    if (!sol) throw new NotFoundException('Solicitud no encontrada');

    const where: Record<string, unknown> = { solicitudId: sol.id };
    if (query.search) {
      where.OR = [
        { nombre: { contains: query.search, mode: 'insensitive' } },
        { ci: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.estado) where.estado = query.estado;

    const page = parseInt(query.page ?? '1', 10);
    const limit = parseInt(query.limit ?? '20', 10);

    const [items, total] = await Promise.all([
      this.prisma.participantes_capacitacion.findMany({
        where, skip: (page - 1) * limit, take: limit,
        include: { relaciones: { include: { curso: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.participantes_capacitacion.count({ where }),
    ]);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async eliminarParticipante(id: number, usuarioId: number) {
    const part = await this.prisma.participantes_capacitacion.findUnique({
      where: { id }, include: { solicitud: true },
    });
    if (!part) throw new NotFoundException('Participante no encontrado');
    if (part.solicitud?.usuarioId !== usuarioId)
      throw new ForbiddenException('No es tu solicitud');
    if (part.solicitud?.estado !== 'BORRADOR')
      throw new BadRequestException('Solo se pueden eliminar en BORRADOR');

    await this.prisma.participantes_cursos.deleteMany({ where: { participanteId: id } });
    await this.prisma.participantes_capacitacion.delete({ where: { id } });
    return { message: 'Participante eliminado' };
  }

  async calcularCostoTotal(codigoSolicitud: string) {
    const sol = await this.prisma.solicitudes.findFirst({
      where: { codigoFormulario: codigoSolicitud },
    });
    if (!sol) throw new NotFoundException('Solicitud no encontrada');

    const participantes = await this.prisma.participantes_capacitacion.findMany({
      where: { solicitudId: sol.id },
      include: { relaciones: { include: { curso: true } } },
    });

    let total = 0;
    for (const p of participantes) {
      for (const r of p.relaciones) {
        total += Number(r.curso.costoBsf ?? 0);
      }
    }
    return { total, participantes: participantes.length };
  }
}
