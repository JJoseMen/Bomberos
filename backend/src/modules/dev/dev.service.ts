import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DevService {
  constructor(private prisma: PrismaService) {}

  async eliminarUsuarioPorEmail(email: string) {
    const user = await this.prisma.usuarios.findUnique({ where: { email } });
    if (!user) throw new NotFoundException(`Usuario ${email} no encontrado`);

    const sols = await this.prisma.solicitudes.findMany({
      where: { usuarioId: user.id },
      select: { id: true },
    });
    const ids = sols.map((s) => s.id);

    await this.prisma.$transaction(async (tx) => {
      if (ids.length > 0) {
        await tx.documentos.deleteMany({ where: { solicitudId: { in: ids } } });
        await tx.pagos.deleteMany({ where: { solicitudId: { in: ids } } });
        await tx.certificados.deleteMany({ where: { solicitudId: { in: ids } } });
        await tx.declaraciones_juradas.deleteMany({ where: { solicitudId: { in: ids } } });
        await tx.historial_solicitudes.deleteMany({ where: { solicitudId: { in: ids } } });
        await tx.inspecciones.deleteMany({ where: { solicitudId: { in: ids } } });
        await tx.notificaciones.deleteMany({ where: { solicitudId: { in: ids } } });
        await tx.solicitudes.deleteMany({ where: { id: { in: ids } } });
      }
      await tx.sesiones.deleteMany({ where: { usuarioId: user.id } });
      await tx.codigos_verificacion.deleteMany({ where: { usuarioId: user.id } });
      await tx.intentos_login.deleteMany({ where: { usuarioId: user.id } });
      await tx.usuarios_empresas.deleteMany({ where: { usuarioId: user.id } });
      await tx.documentos.deleteMany({ where: { usuarioId: user.id } });
      await tx.notificaciones.deleteMany({ where: { usuarioId: user.id } });
      await tx.auditoria_general.deleteMany({ where: { usuarioId: user.id } });
      await tx.usuarios.delete({ where: { id: user.id } });
    });

    return { message: `Usuario ${email} eliminado`, solicitudesEliminadas: ids.length };
  }
}
