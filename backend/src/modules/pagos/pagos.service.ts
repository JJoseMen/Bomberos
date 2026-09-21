import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegistrarPagoDto } from './dto/registrar-pago.dto';
import { VerificarPagoDto } from './dto/verificar-pago.dto';
import { QueryPagoDto } from './dto/query-pago.dto';

@Injectable()
export class PagosService {
  constructor(private prisma: PrismaService) {}

  async registrar(codigoSolicitud: string, dto: RegistrarPagoDto, usuarioId: number) {
    const sol = await this.prisma.solicitudes.findFirst({
      where: { codigoFormulario: codigoSolicitud },
    });
    if (!sol) throw new NotFoundException('Solicitud no encontrada');
    if (sol.usuarioId !== usuarioId)
      throw new ForbiddenException('No es tu solicitud');
    if (!['BORRADOR', 'OBSERVADA'].includes(sol.estado))
      throw new BadRequestException('Solo se puede pagar en BORRADOR u OBSERVADA');

    const existente = await this.prisma.pagos.findFirst({
      where: { solicitudId: sol.id },
    });
    if (existente)
      throw new BadRequestException('Ya existe un pago para esta solicitud');

    return this.prisma.pagos.create({
      data: {
        solicitudId: sol.id,
        numeroOperacion: dto.numeroOperacion ?? `OP-${Date.now()}`,
        monto: dto.monto,
        fechaDeposito: dto.fechaDeposito ? new Date(dto.fechaDeposito) : new Date(),
        banco: dto.banco ?? 'Banco Union',
      },
    });
  }

  async findOne(codigoSolicitud: string) {
    const sol = await this.prisma.solicitudes.findFirst({
      where: { codigoFormulario: codigoSolicitud },
    });
    if (!sol) throw new NotFoundException('Solicitud no encontrada');

    const pago = await this.prisma.pagos.findFirst({
      where: { solicitudId: sol.id },
      include: { solicitud: { select: { id: true, codigoFormulario: true } } },
    });
    if (!pago) throw new NotFoundException('Pago no encontrado para esta solicitud');
    return pago;
  }

  async verificar(id: number, dto: VerificarPagoDto, _usuarioInternoId: number) {
    const pago = await this.prisma.pagos.findUnique({ where: { id } });
    if (!pago) throw new NotFoundException(`Pago ${id} no encontrado`);

    return this.prisma.pagos.update({
      where: { id },
      data: {
        estado: dto.estado as any,
        verificadoEn: new Date(),
      },
    });
  }

  async findAll(query: QueryPagoDto) {
    const page = parseInt(query.page ?? '1', 10);
    const limit = parseInt(query.limit ?? '20', 10);
    const where: Record<string, unknown> = {};

    if (query.estado) where.estado = query.estado;
    if (query.banco) where.banco = { contains: query.banco, mode: 'insensitive' };
    if (query.fechaDesde || query.fechaHasta) {
      where.fechaDeposito = {};
      if (query.fechaDesde) (where.fechaDeposito as any).gte = new Date(query.fechaDesde);
      if (query.fechaHasta) (where.fechaDeposito as any).lte = new Date(query.fechaHasta);
    }

    const [items, total] = await Promise.all([
      this.prisma.pagos.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          solicitud: { select: { id: true, codigoFormulario: true, estado: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.pagos.count({ where }),
    ]);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }
}
