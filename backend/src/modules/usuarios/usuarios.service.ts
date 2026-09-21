import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryUsuarioDto } from './dto/query-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryUsuarioDto) {
    const page = parseInt(query.page ?? '1', 10);
    const limit = parseInt(query.limit ?? '20', 10);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (query.search) {
      where.OR = [
        { nombre: { contains: query.search, mode: 'insensitive' } },
        { apellido: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.tipoPersona) {
      where.tipo = query.tipoPersona;
    }

    const [items, total] = await Promise.all([
      this.prisma.usuarios.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          nombre: true,
          apellido: true,
          email: true,
          telefono: true,
          tipo: true,
          estado: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.usuarios.count({ where }),
    ]);

    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const user = await this.prisma.usuarios.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        telefono: true,
        tipo: true,
        estado: true,
        createdAt: true,
        usuarioEmpresas: {
          select: {
            id: true,
            empresa: { select: { id: true, razonSocial: true, nit: true } },
          },
        },
        solicitudes: {
          select: { id: true, codigoFormulario: true, estado: true },
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!user) {
      throw new NotFoundException(`Usuario ${id} no encontrado`);
    }
    return user;
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    const existing = await this.prisma.usuarios.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Usuario ${id} no encontrado`);
    }
    const [nombre, ...apellidoParts] = (dto.nombreCompleto ?? '').split(' ');
    return this.prisma.usuarios.update({
      where: { id },
      data: {
        ...(nombre && { nombre }),
        ...(apellidoParts.length && { apellido: apellidoParts.join(' ') }),
        ...(dto.email && { email: dto.email }),
        ...(dto.telefono !== undefined && { telefono: dto.telefono }),
        ...(dto.tipoPersona && { tipo: dto.tipoPersona }),
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.usuarios.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Usuario ${id} no encontrado`);
    }
    return this.prisma.usuarios.delete({ where: { id } });
  }
}
