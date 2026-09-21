import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { TipoCodigo } from '@prisma/client';

@Injectable()
export class OtpService {
  constructor(private prisma: PrismaService) {}

  generarCodigo(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async hashearCodigo(codigo: string): Promise<string> {
    return bcrypt.hash(codigo, 10);
  }

  async verificarCodigo(
    codigo: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(codigo, hash);
  }

  async guardarCodigo(
    usuarioId: number,
    codigoHash: string,
    tipo: TipoCodigo,
    minutosExpira: number = 15,
  ) {
    const expiraEn = new Date();
    expiraEn.setMinutes(expiraEn.getMinutes() + minutosExpira);

    return this.prisma.codigos_verificacion.create({
      data: {
        usuarioId,
        codigo: codigoHash,
        tipo,
        expiraEn,
      },
    });
  }

  async buscarCodigoActivo(usuarioId: number, tipo: TipoCodigo) {
    return this.prisma.codigos_verificacion.findFirst({
      where: {
        usuarioId,
        tipo,
        usado: false,
        expiraEn: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async marcarUsado(codigoId: number) {
    return this.prisma.codigos_verificacion.update({
      where: { id: codigoId },
      data: { usado: true, usedAt: new Date() },
    });
  }

  async incrementarIntentos(usuarioId: number) {
    return this.prisma.usuarios.update({
      where: { id: usuarioId },
      data: { intentosLogin: { increment: 1 } },
    });
  }
}
