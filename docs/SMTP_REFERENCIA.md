# SMTP_REFERENCIA — OTP real con nodemailer (proyecto anterior)

Fecha de lectura: 21/09/2026.
Fuente (SOLO LECTURA): `C:\JUAN_JOSE_MENDOZA_CONDORI\BomberoWeb\bomberos_gral`
Las credenciales reales NO se documentan; solo nombres de variables y estructura.

## 1. Estructura del proyecto anterior (relevante a email)

- Backend: **NestJS 11 + Prisma 5.22 + nodemailer 9.0.5** (`backend/`)
- Frontend: **Vue 3 + Vite** (`bomberos-frontend/`) — irrelevante para SMTP
- Módulo de email: `backend/src/email/email.module.ts`
- Servicio de email: `backend/src/email/email.service.ts`
- OTP: `backend/src/auth/otp.service.ts` + `backend/src/auth/auth.service.ts`
- BD: PostgreSQL (puerto 5433, DB `sippci_v2`), tablas en **snake_case** (`codigo_verificacion`, `usuario_id`, `codigo_hash`, `created_at`)

## 2. Variables SMTP identificadas (sin valores)

`backend/.env` contiene (nombres reales; valores omitidos aquí):

| Variable | Uso en código |
|---|---|
| `SMTP_HOST` | host del transporter |
| `SMTP_PORT` | puerto (587 por defecto) |
| `SMTP_USER` | usuario SMTP |
| `SMTP_PASS` | password SMTP |
| `SMTP_FROM` | remitente (default `noreply@sippci.bo`) |
| `SMTP_SECURE` | presente pero NO usado por el código (usa `secure: false` fijo) |

`backend/.env.example` documenta solo `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (comentadas).

## 3. Configuración del transporter (email.service.ts)

```ts
import * as dns from 'dns';
dns.setDefaultResultOrder('ipv4first'); // evita resolución IPv6 en Windows

this.transporter = nodemailer.createTransport({
  host,
  port: config.get<number>('SMTP_PORT', 587),
  secure: false,
  family: 4,                       // fuerza IPv4
  auth: { user, pass },
  tls: { rejectUnauthorized: false }, // tolera certificados autofirmados
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});
```

Modo MOCK: si faltan `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS` → `isMock=true`, el OTP se loguea por consola.

## 4. Código clave: enviarOtp / sendOTP

Plantea el envío con try/catch y **fallback a consola** ante cualquier error (nunca rompe el login):

```ts
async sendOTP(email: string, otp: string): Promise<void> {
  if (this.isMock || !this.transporter) {
    this.logger.log(`[MOCK] OTP para ${email}: ${otp}`);
    return;
  }
  try {
    await this.transporter.sendMail({
      from: config.get('SMTP_FROM', 'noreply@sippci.bo'),
      to: email,
      subject: 'Código de verificación SIPPCI',
      html: htmlTemplate, // plantilla inline (ver §5)
    });
    this.logger.log(`OTP enviado a ${email}`);
  } catch (error) {
    this.logger.error('Error enviando OTP a ' + email, error);
    this.logger.log(`[FALLBACK] OTP para ${email}: ${otp}`);
  }
}
```

El servicio original además tenía `sendCredentials(email, password)` y `sendPasswordReset(email, resetLink)` con el mismo patrón.

## 5. Plantillas de email

**No hay archivos de plantilla separados** (sin `.hbs`/`.ejs`/`.html` en `templates/`). La plantilla del OTP es **HTML inline** en `email.service.ts`, con identidad DNB:

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #C41E3A;">Dirección Nacional de Bomberos</h2>
  <p>Su código de verificación es:</p>
  <h1 style="font-size: 36px; letter-spacing: 8px; color: #1A3A5C;">${otp}</h1>
  <p>Este código expira en 10 minutos.</p>
  <p style="color: #666; font-size: 12px;">Si no solicitó este código, ignore este mensaje.</p>
</div>
```

## 6. Flujo completo del OTP (auth.service.ts + otp.service.ts)

1. `login(email, password)`: bcrypt.compare contra `password_hash`.
2. `otpService.createVerificationCode(usuario.id, 'LOGIN_2FA')`:
   - OTP: `randomInt(100000, 1000000)` → **6 dígitos** (crypto, seguro).
   - Hash: **bcrypt salt 10** (`codigo_hash`).
   - Expiración: `Date.now() + 10*60*1000` (**10 minutos**).
   - Invalida códigos anteriores `{ usuario_id, tipo, usado:false }` → `usado:true`.
3. `emailService.sendOTP(email, otp)` en try/catch (fallo no bloquea).
4. `resendOtp(email)`: repite 2-3 con tipo `LOGIN_2FA`.
5. `verifyOtp(email, codigo)`: `validateAndUseCode`:
   - Busca el más reciente `{ usuario_id, tipo, usado:false, expira:>ahora }`.
   - **Máx. 3 intentos**: si `intentos>=3` marca `usado:true` y bloquea.
   - `bcrypt.compare`; OK → `usado:true, usado_at:ahora`; falla → `intentos++`.
6. Éxito → emite JWT (role `EXTERNO`) y actualiza `ultimo_acceso`.

## 7. Diferencias con el proyecto actual (Bomberos)

| Aspecto | Anterior (bomberos_gral) | Actual (Bomberos) |
|---|---|---|
| Ruta | `src/email/email.service.ts` | `src/modules/auth/services/email.service.ts` |
| DNS/IPv4 | `dns setDefaultResultOrder('ipv4first')` + `family: 4` | NO presente (riesgo de resolución en Windows) |
| TLS | `tls.rejectUnauthorized:false` | NO presente |
| Métodos | sendOTP + sendCredentials + sendPasswordReset | solo `enviarOtp` |
| Plantilla | HTML DNB con marca y expiración | `<div>SIPPCI OTP: codigo</div>` (mínimo) |
| Malog | `[MOCK]` / `[FALLBACK]` | `[DEV]` / `[FALLBACK]` |
| Logout otp | consola siempre + email | consola `[DEV]` (SMTP apagado) |
| `.env` SMTP | 6 claves (`SMTP_HOST/PORT/SECURE/USER/PASS/FROM`) | ninguna (solo `DATABASE_URL`, `PORT`, `KERBEROS_MOCK_MODE`) |

## 8. Recomendación de réplica (proyecto actual)

1. Añadir a `backend/.env`: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`.
2. En `email.service.ts`: agregar `dns.setDefaultResultOrder('ipv4first')`, `family: 4` y `tls.rejectUnauthorized:false`.
3. Mejorar plantilla `enviarOtp` con el HTML DNB y el texto "expira en 10 minutos".
4. Mantener try/catch + fallback a consola (ya implementado).
5. Validar en `Joi` (`config/validation.ts`) que las claves SMTP son opcionales (ya lo son).
6. (Opcional) portar `sendCredentials`/`sendPasswordReset`.