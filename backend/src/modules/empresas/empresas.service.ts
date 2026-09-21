import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { QueryEmpresaDto } from './dto/query-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Injectable()
export class EmpresasService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEmpresaDto) {
    const exists = await this.prisma.empresas.findUnique({
      where: { nit: dto.nit },
    });
    if (exists) {
      throw new ConflictException('NIT ya registrado');
    }
    return this.prisma.empresas.create({ data: dto });
  }

  async findAll(query: QueryEmpresaDto) {
    const page = parseInt(query.page ?? '1', 10);
    const limit = parseInt(query.limit ?? '20', 10);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (query.search) {
      where.OR = [
        { razonSocial: { contains: query.search, mode: 'insensitive' } },
        { nit: { contains: query.search } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.empresas.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.empresas.count({ where }),
    ]);

    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const empresa = await this.prisma.empresas.findUnique({
      where: { id },
      include: {
        usuarioEmpresas: {
          select: {
            id: true,
            usuario: { select: { id: true, nombre: true, email: true } },
          },
        },
        solicitudes: {
          select: { id: true, codigoFormulario: true, estado: true },
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!empresa) {
      throw new NotFoundException(`Empresa ${id} no encontrada`);
    }
    return empresa;
  }

  async update(id: number, dto: UpdateEmpresaDto) {
    const existing = await this.prisma.empresas.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Empresa ${id} no encontrada`);
    }
    if (dto.nit && dto.nit !== existing.nit) {
      const nitExists = await this.prisma.empresas.findUnique({
        where: { nit: dto.nit },
      });
      if (nitExists) {
        throw new ConflictException('NIT ya registrado');
      }
    }
    return this.prisma.empresas.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const existing = await this.prisma.empresas.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Empresa ${id} no encontrada`);
    }
    return this.prisma.empresas.delete({ where: { id } });
  }
}
