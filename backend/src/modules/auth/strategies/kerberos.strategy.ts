import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { KerberosService } from '../services/kerberos.service';

@Injectable()
export class KerberosStrategy extends PassportStrategy(Strategy, 'kerberos') {
  constructor(private kerberosService: KerberosService) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const auth = req.headers?.authorization ?? '';
    const headerTicket = auth.startsWith('Negotiate ') ? auth.slice('Negotiate '.length) : '';
    const ticket =
      headerTicket || (req.query?.ticket as string) || req.body?.ticket;
    if (!ticket) {
      throw new UnauthorizedException('Ticket de Kerberos requerido');
    }

    try {
      const payload = await this.kerberosService.validarTicket(ticket);
      return {
        externalId: payload.externalId,
        email: payload.email,
        nombre: payload.nombreCompleto,
        grado: payload.grado,
        rol: payload.rol,
        tipo: 'interno' as const,
      };
    } catch {
      throw new UnauthorizedException('Ticket de Kerberos invalido');
    }
  }
}
