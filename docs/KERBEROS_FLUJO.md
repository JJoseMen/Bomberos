# Kerberos - Flujo de redirección

## Secuencia

1. Funcionario accede al SSO institucional y obtiene ticket SPNEGO.
2. SSO redirige a `{FRONTEND_URL}/kerberos/callback?ticket=<ticket>`.
3. `KerberosCallbackPage` lee `ticket` del query param.
4. Frontend `POST /api/auth/kerberos/exchange { ticket }`.
5. Backend valida:
   - Mock (`KERBEROS_MOCK_MODE=true`): payload de prueba.
   - Real: `POST {KERBEROS_URL}/validate` con `X-API-Key`.
6. Backend emite JWT propio + usuario interno (upsert por `externalId`).
7. Frontend guarda token (`auth.store` + `localStorage`) y redirige por rol:
   - `ADMIN` → `/admin/dashboard`
   - `OFICIAL` → `/oficial/dashboard`
   - `CAJERO` → `/cajero/dashboard`
   - otro → `/dashboard`

## URLs

| Paso | URL |
|------|-----|
| Callback | `/kerberos/callback?ticket=...` |
| Exchange | `POST /api/auth/kerberos/exchange` |
| Validación SSO | `POST {KERBEROS_URL}/validate` |

## Manejo de errores

- Sin `ticket` en query: pantalla "Error de autenticacion".
- Exchange 401: toast "Error en la autenticacion Kerberos" + pantalla de error.
- Ticket expirado: el SSO responde 401 → 401 al frontend → reintentar login SSO.
- Usuario no autorizado (rol desconocido): entra como ciudadano a `/dashboard`;
  endurecer con `ProtectedRoute allowedRoles` si se requiere bloqueo total.
- SSO caído/timeout: 401 `SSO institucional no responde`; mostrar reintento.

## Casos edge

- Doble callback (StrictMode): el exchange es idempotente por `externalId`
  (upsert); segundo llamado reutiliza el usuario.
- Ticket reutilizado: el SSO lo rechaza con 401; el frontend muestra error.
- Sesión expirada: interceptor 401 limpia token y manda a `/login`.
