# Autenticación interna — Kerberos SSO (mock)

## Visión general

Los funcionarios de la Dirección Nacional de Bomberos acceden al sistema mediante el **SSO institucional Kerberos**. Por ahora se implementa un **mock** que simula el flujo real.

## Flujo (mock)

1. Usuario interno ingresa credenciales (`ci` + `password`) en `/login-interno`.
2. Backend simula validación Kerberos → emite JWT interno (`sippci_internal_token`).
3. JWT incluye claims: `sub` (CI), `rol`, `unidad`, `nombreCompleto`.
4. El JWT tiene `expiresIn = 7d` y se almacena en localStorage/cookies httpOnly.

## Mock vs. Producción

| Aspecto           | Mock actual       | Producción        |
|-------------------|-------------------|-------------------|
| Validación        | `bcrypt.compare`  | Kerberos KDC      |
| Fuente de roles   | Base de datos     | Directorio activo |
| SSO               | No aplica         | SPNEGO / ticket   |
| MFA               | No aplica         | Token / APP       |

## Configuración

Variable de entorno `KERBEROS_MOCK_MODE=true` activa el modo simulación. Para producción establecer a `false` e integrar con el KDC de la Policía Boliviana.
