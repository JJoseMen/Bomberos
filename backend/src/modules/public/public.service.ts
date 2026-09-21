import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PublicService {
  constructor(private prisma: PrismaService) {}

  async consultarEstado(codigo: string) {
    const sol = await this.prisma.solicitudes.findFirst({
      where: { codigoFormulario: codigo },
      select: {
        codigoFormulario: true,
        tipoTramite: true,
        estado: true,
        createdAt: true,
        fechaAprobacion: true,
        fechaVigencia: true,
        datosJson: true,
      },
    });
    if (!sol) throw new NotFoundException(`Solicitud ${codigo} no encontrada`);

    const datos = sol.datosJson as Record<string, unknown>;
    const nombre = (datos?.nombre as string) || 'No disponible';
    const nombreEnmascarado = this.enmascararNombre(nombre);

    return {
      codigoFormulario: sol.codigoFormulario,
      tipoTramite: sol.tipoTramite,
      estado: sol.estado,
      fechaCreacion: sol.createdAt,
      fechaAprobacion: sol.fechaAprobacion,
      fechaVencimiento: sol.fechaVigencia,
      titular: nombreEnmascarado,
    };
  }

  async verificarCertificado(codigoCertificado: string) {
    const cert = await this.prisma.certificados.findFirst({
      where: { codigoCertificado },
      include: {
        solicitud: {
          select: {
            codigoFormulario: true,
            tipoTramite: true,
            estado: true,
            fechaAprobacion: true,
            fechaVigencia: true,
            datosJson: true,
          },
        },
      },
    });
    if (!cert) throw new NotFoundException(`Certificado ${codigoCertificado} no encontrado`);

    const datos = cert.solicitud.datosJson as Record<string, unknown>;
    const nombre = (datos?.nombre as string) || 'No disponible';
    const hoy = new Date();
    const vigente = cert.solicitud.fechaVigencia ? cert.solicitud.fechaVigencia > hoy : false;

    return {
      codigoCertificado: cert.codigoCertificado,
      codigoFormulario: cert.solicitud.codigoFormulario,
      tipoTramite: cert.solicitud.tipoTramite,
      titular: this.enmascararNombre(nombre),
      fechaAprobacion: cert.solicitud.fechaAprobacion,
      fechaVencimiento: cert.solicitud.fechaVigencia,
      estado: vigente ? 'VIGENTE' : 'VENCIDO',
    };
  }

  private enmascararNombre(nombre: string): string {
    const partes = nombre.trim().split(' ');
    if (partes.length <= 1) return partes[0] + ' *';
    return partes[0] + ' ' + partes[partes.length - 1].charAt(0) + '.';
  }
}
