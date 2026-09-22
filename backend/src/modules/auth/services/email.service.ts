import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dns from 'dns';
import * as nodemailer from 'nodemailer';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';

dns.setDefaultResultOrder('ipv4first');

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private isMock: boolean;

  constructor(private config: ConfigService) {
    const host = config.get<string>('SMTP_HOST');
    const user = config.get<string>('SMTP_USER');
    const pass = config.get<string>('SMTP_PASS');
    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: config.get<number>('SMTP_PORT', 587),
        secure: false,
        family: 4,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
      } as SMTPTransport.Options);
      this.isMock = false;
      this.logger.log('EmailService configurado con SMTP real');
    } else {
      this.isMock = true;
      this.logger.warn('SMTP no configurado - OTP en modo MOCK');
    }
  }

  async enviarOtp(email: string, codigo: string): Promise<void> {
    if (this.isMock || !this.transporter) {
      this.logger.log(`[MOCK] OTP para ${email}: ${codigo}`);
      return;
    }
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #C41E3A;">Dirección Nacional de Bomberos</h2>
        <p>Su código de verificación es:</p>
        <h1 style="font-size: 36px; letter-spacing: 8px; color: #1A3A5C;">${codigo}</h1>
        <p>Este código expira en 10 minutos.</p>
        <p style="color: #666; font-size: 12px;">Si no solicitó este código, ignore este mensaje.</p>
      </div>`;
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