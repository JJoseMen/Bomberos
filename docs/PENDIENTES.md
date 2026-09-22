# Pendientes — SIPPCI

## 1. SMTP sin configurar

- El OTP se imprime en consola del backend: `[DEV] OTP para <email>: <codigo>`.
- Configurar variables `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
  en `backend/.env` para envío real (app password de Gmail).
- Bloquea la entrega de credenciales a usuarios reales.

## 2. Placeholders muertos — ELIMINADOS

- ~~`frontend/src/pages/public/LoginPage.tsx` y `frontend/src/pages/public/RegisterPage.tsx`
  eran stubs sin ruta; el router usaba `pages/auth/*`.~~
- **Eliminados** en FASE III. Verificado: el router (`src/router/index.tsx`) usa
  `pages/auth/LoginPage` y `pages/auth/RegisterPage`; sin referencias rotas;
  `pages/public/` queda solo con páginas públicas reales.

## 3. Migración Sass pendiente

- `frontend/vite.config.ts:24` usa `@import` en `additionalData`.
- Migrar a `@use` (sintaxis moderna de Sass). Baja prioridad, no bloquea.

## 4. Registro JURIDICA ignora NIT — CORREGIDO

- ~~El flujo `POST /api/auth/register` creaba el usuario con `tipo=JURIDICA` e ignoraba el
  campo `nit` (no creaba/asociaba `empresas` ni `usuarios_empresas`).~~
- **Corregido** en `backend/src/modules/auth/auth.service.ts`: cuando
  `tipoPersona=JURIDICA` y hay `nit`, se ejecuta `prisma.$transaction` que crea:
  1. El usuario.
  2. La `empresa` (`nit`, `razonSocial` = nombreCompleto, `representanteLegal` =
     nombreCompleto, `email`, `telefono`).
  3. La relación `usuarios_empresas` con `rol='REPRESENTANTE'`.
- Respuesta: `{ message, userId, empresaId }` (`empresaId` null para NATURAL).
- Verificado: JURIDICA crea usuario+empresa+relación; NATURAL queda sin relación.

## 5. E2E de otra instancia

- El E2E documentado (PROF-NAT-2026-00019, CERT-PROF-2026-00002) se ejecutó en la
  máquina original; la base actual `sippci` se migró y sembró de cero (solo datos del seed).
- Acción: re-ejecutar el recorrido E2E completo en esta instancia y volcar el resultado.

## 6. Pasada manual en navegador

- Verificación visual de los flujos UI (E.2–E.6) pendiente en esta instancia.