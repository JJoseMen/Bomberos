import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface KerberosPayload {
  externalId: string;
  nombreCompleto: string;
  email: string;
  grado: string;
  rol: string;
}

@Injectable()
export class KerberosService {
  private readonly logger = new Logger(KerberosService.name);

  constructor(private config: ConfigService) {}

  private mockPayload(ticket: string): KerberosPayload {
    const t = (ticket || '').toLowerCase();

    let rol: string;
    if (t.includes('admin')) {
      rol = 'ADMIN';
    } else if (t.includes('cumplimiento')) {
      rol = 'GESTOR_CUMPLIMIENTO';
    } else if (t.includes('capacitacion')) {
      rol = 'GESTOR_CAPACITACIONES';
    } else if (t.includes('registro')) {
      rol = 'GESTOR_REGISTRO_PROFESIONAL';
    } else if (t.includes('cajero')) {
      rol = 'CAJERO';
    } else {
      // Fallback: GESTOR_CUMPLIMIENTO (rol operativo básico)
      rol = 'GESTOR_CUMPLIMIENTO';
    }

    return {
      externalId: `KERB-${Date.now()}`,
      nombreCompleto: `Usuario ${rol} Mock`,
      email: `${rol.toLowerCase()}.mock@sippci.gob.bo`,
      grado: 'Tcn. 1',
      rol,
    };
  }

  async validarTicket(ticket: string): Promise<KerberosPayload> {
    const mockMode = this.config.get('KERBEROS_MOCK_MODE') === 'true';
    const kerberosUrl = this.config.get('KERBEROS_URL') as string | undefined;

    if (mockMode) {
      this.logger.warn('Kerberos en modo MOCK - retornando datos de prueba');
      return this.mockPayload(ticket);
    }

    if (!kerberosUrl) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('KERBEROS_URL no configurada');
      }
      this.logger.warn(
        'KERBEROS_URL no configurada - usando MOCK automaticamente (solo desarrollo)',
      );
      return this.mockPayload(ticket);
    }

    const timeoutMs = Number(this.config.get('KERBEROS_TIMEOUT') ?? 5000);
    const apiKey = this.config.get('KERBEROS_API_KEY') ?? '';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(`${kerberosUrl}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'X-API-Key': apiKey } : {}),
        },
        body: JSON.stringify({ ticket }),
        signal: controller.signal,
      });

      if (res.status === 401) {
        throw new UnauthorizedException('Ticket de Kerberos invalido o expirado');
      }
      if (!res.ok) {
        this.logger.error(`SSO respondio ${res.status}`);
        throw new UnauthorizedException('Error del SSO institucional');
      }

      const data = (await res.json()) as Partial<KerberosPayload>;
      if (!data.externalId || !data.email) {
        throw new UnauthorizedException('Respuesta del SSO incompleta');
      }

      return {
        externalId: data.externalId,
        nombreCompleto: data.nombreCompleto ?? data.email,
        email: data.email,
        grado: data.grado ?? '',
        rol: data.rol ?? 'GESTOR_CUMPLIMIENTO',
      };
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      if (err instanceof Error && err.name === 'AbortError') {
        this.logger.error('Timeout validando ticket Kerberos');
        throw new UnauthorizedException('SSO institucional no responde');
      }
      this.logger.error('Error de red con el SSO institucional');
      throw new UnauthorizedException('Error del SSO institucional');
    } finally {
      clearTimeout(timer);
    }
  }
}
