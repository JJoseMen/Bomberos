import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryAdminDto } from './dto/query-admin.dto';
import { SolicitudStateMachine } from '../solicitudes/state-machine/solicitud.state-machine';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalSolicitudes,
      totalUsuarios,
      totalEmpresas,
      totalCertificados,
      totalPagosVerificados,
      porEstado,
      porTipoTramite,
    ] = await Promise.all([
      this.prisma.solicitudes.count(),
      this.prisma.usuarios.count(),
      this.prisma.empresas.count(),
      this.prisma.certificados.count(),
      this.prisma.pagos.count({ where: { estado: 'VERIFICADO' } }),
      this.prisma.solicitudes.groupBy({ by: ['estado'], _count: { estado: true } }),
      this.prisma.solicitudes.groupBy({ by: ['tipoTramite'], _count: { tipoTramite: true } }),
    ]);

    const porEstadoObj: Record<string, number> = {};
    for (const e of porEstado) porEstadoObj[e.estado] = e._count.estado;

    const porTipoObj: Record<string, number> = {};
    for (const t of porTipoTramite) porTipoObj[t.tipoTramite] = t._count.tipoTramite;

    return {
      totalSolicitudes,
      totalUsuarios,
      totalEmpresas,
      totalCertificados,
      totalPagosVerificados,
      porEstado: porEstadoObj,
      porTipoTramite: porTipoObj,
    };
  }

  async findAllSolicitudes(query: QueryAdminDto) {
    const page = parseInt(query.page ?? '1', 10);
    const limit = parseInt(query.limit ?? '20', 10);
    const where: Record<string, unknown> = {};

    if (query.estado) where.estado = query.estado;
    if (query.tipoTramite) where.tipoTramite = query.tipoTramite;
    if (query.search) {
      where.OR = [
        { codigoFormulario: { contains: query.search, mode: 'insensitive' } },
        { datosJson: { path: ['nombre'], string_contains: query.search } },
      ];
    }
    if (query.fechaDesde || query.fechaHasta) {
      where.createdAt = {};
      if (query.fechaDesde) (where.createdAt as Record<string, unknown>).gte = new Date(query.fechaDesde);
      if (query.fechaHasta) (where.createdAt as Record<string, unknown>).lte = new Date(query.fechaHasta + 'T23:59:59Z');
    }

    const [items, total] = await Promise.all([
      this.prisma.solicitudes.findMany({
        where, skip: (page - 1) * limit, take: limit,
        include: {
          usuario: { select: { id: true, nombre: true, email: true } },
          empresa: { select: { id: true, razonSocial: true } },
        documentos: { select: { id: true, nombreOriginal: true } },
        pagos: { select: { id: true, estado: true, monto: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.solicitudes.count({ where }),
    ]);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOneSolicitud(codigo: string) {
    const sol = await this.prisma.solicitudes.findFirst({
      where: { codigoFormulario: codigo },
      include: {
        usuario: { select: { id: true, nombre: true, email: true } },
        empresa: true,
        documentos: true,
        pagos: true,
        certificados: true,
        declaracionesJuradas: true,
        historial: { orderBy: { createdAt: 'desc' } },
        inspecciones: true,
      },
    });
    if (!sol) throw new NotFoundException(`Solicitud ${codigo} no encontrada`);
    return sol;
  }

  async getAlertas() {
    const hoy = new Date();
    const en30 = new Date(hoy);
    en30.setDate(en30.getDate() + 30);

    const [proximas, vencidas, pagosPendientes, documentosPendientes] = await Promise.all([
      this.prisma.solicitudes.findMany({
        where: {
          estado: 'CERTIFICADO_EMITIDO',
          fechaVigencia: { gte: hoy, lte: en30 },
        },
        select: { codigoFormulario: true, fechaVigencia: true },
      }),
      this.prisma.solicitudes.findMany({
        where: {
          estado: 'CERTIFICADO_EMITIDO',
          fechaVigencia: { lt: hoy },
        },
        select: { codigoFormulario: true, fechaVigencia: true },
      }),
      this.prisma.pagos.count({ where: { estado: 'PENDIENTE' } }),
      this.prisma.documentos.count({ where: { estado: 'PENDIENTE' } }),
    ]);

    const proximasAVencer = proximas.map(p => ({
      codigoFormulario: p.codigoFormulario,
      fechaVencimiento: p.fechaVigencia!,
      diasRestantes: Math.ceil((p.fechaVigencia!.getTime() - hoy.getTime()) / 86400000),
    }));

    return { proximasAVencer, vencidas, pagosPendientes, documentosPendientes };
  }

  async getEstadosPermitidos(codigo: string) {
    const sol = await this.prisma.solicitudes.findFirst({
      where: { codigoFormulario: codigo },
      select: { codigoFormulario: true, estado: true },
    });
    if (!sol) throw new NotFoundException(`Solicitud ${codigo} no encontrada`);

    const permitidos = SolicitudStateMachine.obtenerEstadosPermitidos(sol.estado);
    return { codigoFormulario: sol.codigoFormulario, estadoActual: sol.estado, estadosPermitidos: permitidos };
  }
}
