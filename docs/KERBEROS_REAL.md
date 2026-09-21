# Kerberos Real - Integración SSO Policía Boliviana

## Descripción

`KerberosService.validarTicket()` opera en dos modos según `KERBEROS_MOCK_MODE`:

| Modo | Variable | Comportamiento |
|------|----------|----------------|
| Mock | `KERBEROS_MOCK_MODE=true` | Retorna payload de prueba sin red |
| Real | `KERBEROS_MOCK_MODE=false` | `POST {KERBEROS_URL}/validate` con el ticket |

## Endpoint real

- **URL:** `{KERBEROS_URL}/validate`
- **Método:** `POST`
- **Headers:** `Content-Type: application/json`, `X-API-Key: {KERBEROS_API_KEY}`
- **Payload:** `{ "ticket": "<ticket SPNEGO>" }`
- **Timeout:** `KERBEROS_TIMEOUT` ms (default 5000)

## Formato del ticket

Ticket SPNEGO/Kerberos emitido por el KDC institucional, en base64,
recibido en el frontend tras la negociación con el SSO y enviado como
`{ "ticket": "..." }` a `/api/auth/kerberos/exchange`.

## Formato de la respuesta esperada

```json
{
  "externalId": "POL-12345",
  "nombreCompleto": "Juan Perez",
  "email": "juan.perez@policia.gob.bo",
  "grado": "Tcn. 1",
  "rol": "OFICIAL"
}
```

Campos opcionales adicionales se ignoran. `externalId` y `email`
son obligatorios; si faltan se lanza `UnauthorizedException`.

## Manejo de errores

| Caso | Acción |
|------|--------|
| Timeout (`AbortError`) | `UnauthorizedException('SSO no responde')` |
| HTTP 401 | `UnauthorizedException('Ticket invalido o expirado')` |
| HTTP 500 / red caída | `UnauthorizedException('Error del SSO institucional')` |
| Payload sin `externalId`/`email` | `UnauthorizedException('Respuesta SSO incompleta')` |
| `KERBEROS_URL` sin configurar | Error de arranque en el servicio |

## Diferencias con el mock

- Mock: sin red, `externalId` aleatorio `KERB-{timestamp}`, email fijo,
  rol siempre `OFICIAL`.
- Real: valida contra el SSO, datos del funcionario real, rol según
  respuesta (`ADMIN`, `OFICIAL`, `CAJERO`).
