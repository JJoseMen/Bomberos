import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../prisma/prisma.service';

export interface JwtPayload {
  sub: number;
  email: string;
  tipo: 'externo' | 'interno';
  rol?: string;
  tipoPersona?: 'NATURAL' | 'JURIDICA';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.tipo === 'interno') {
      const user = await this.prisma.usuarios_internos.findUnique({
        where: { id: payload.sub },
      });
      if (!user || !user.activo) {
        throw new UnauthorizedException('Usuario interno no encontrado');
      }
      return {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        rol: user.rol,
        tipo: 'interno' as const,
      };
    }

    const user = await this.prisma.usuarios.findUnique({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      tipo: 'externo' as const,
      tipoPersona: user.tipo,
    };
  }
}
