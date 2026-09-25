import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CertificadosPublicService {
  constructor(private prisma: PrismaService) {}

  async validar(codigo: string) {
    const cert = await this.prisma.certificados.findFirst({
      where: { codigoCertificado: codigo, activo: true },
      include: {
        solicitud: {
          include: {
            usuario: { select: { nombre: true, apellido: true } },
            empresa: { select: { razonSocial: true, nit: true } },
          },
        },
      },
    });

    if (!cert) {
      return { valido: false, mensaje: 'Certificado no encontrado' };
    }

    const hoy = new Date();
    const vencido = cert.fechaVigencia ? cert.fechaVigencia < hoy : false;

    return {
      valido: true,
      vencido,
      codigo: cert.codigoCertificado,
      tipo: cert.tipo,
      titular:
        (cert.solicitud.usuario
          ? `${cert.solicitud.usuario.nombre} ${cert.solicitud.usuario.apellido ?? ''}`.trim()
          : cert.solicitud.empresa?.razonSocial) || 'N/D',
      nit: cert.solicitud.empresa?.nit,
      fechaEmision: cert.fechaEmision,
      fechaVigencia: cert.fechaVigencia,
      mensaje: vencido ? 'Certificado vencido' : 'Certificado válido',
    };
  }
}
