import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private config: ConfigService) {
    const host = config.get<string>('SMTP_HOST');
    const user = config.get<string>('SMTP_USER');
    const pass = config.get<string>('SMTP_PASS');
    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: config.get<number>('SMTP_PORT', 587),
        secure: false,
        auth: { user, pass },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
      });
      this.logger.log('EmailService con SMTP real');
    } else {
      this.logger.warn('SMTP no configurado - OTP se loguea en consola');
    }
  }

  async enviarOtp(email: string, codigo: string): Promise<void> {
    if (!this.transporter) {
      this.logger.log(`[DEV] OTP para ${email}: ${codigo}`);
      return;
    }
    const html = '<div>SIPPCI OTP: ' + codigo + '</div>';
    try {
      await this.transporter.sendMail({
        from: this.config.get<string>('SMTP_FROM', '"SIPPCI" <noreply@sippci.gob.bo>'),
        to: email,
        subject: 'Codigo de Verificacion SIPPCI',
        html,
      });
      this.logger.log('OTP enviado a ' + email);
    } catch (err) {
      this.logger.error('Error enviando OTP a ' + email, err as Error);
      this.logger.log(`[FALLBACK] OTP para ${email}: ${codigo}`);
    }
  }
}
