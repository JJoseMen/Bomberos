# Flujo de usuario externo — SIPPCI

## Registro (Persona Natural / Jurídica)

1. Usuario llega a `/registro`
2. Completa campos básicos (nombre/razón social, NIT/CI, email, teléfono, contraseña)
3. Envía → backend registra en tabla `usuarios` con `estado = PENDIENTE_VERIFICACION`
4. Sistema genera OTP → envía correo/SMS con código de 6 dígitos
5. Backend retorna `requiereOtp = true` + `otpId`

## Verificación OTP

1. Usuario ingresa a `/verificar-otp?otpId=xxx`
2. Escribe código de 6 dígitos → POST `/auth/verificar-otp`
3. Backend valida OTP en `codigos_verificacion`
4. Si correcto: activa cuenta, emite JWT → redirige a dashboard

## Login

1. Usuario llega a `/login`
2. Ingresa usuario + contraseña → POST `/auth/login`
3. Si requiere OTP → redirige a `/verificar-otp`
4. Si no requiere → emite JWT interno → redirige a dashboard

## Dashboard → Formularios

1. Usuario autenticado accede a su dashboard
2. Selecciona tipo de trámite (Certificación SIPPCI, Registro Profesional, Capacitación, Renovación)
3. Completa wizard de 5 pasos
4. Adjunta documentos (Formulario 06 Declaración Jurada obligatorio)
5. Realiza depósito bancario (Banco Unión)
6. Envía solicitud → estado `EN_REVISION`
7. Funcionario revisa y emite certificado (vigencia 2 años)
