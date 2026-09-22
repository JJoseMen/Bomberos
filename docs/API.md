# API — SIPPCI (Backend)

## General

- Base URL: `http://localhost:3001/api`
- Swagger: `http://localhost:3001/api/docs`
- **67 endpoints** en **16 controllers**
- Autenticación: `Authorization: Bearer <JWT>` salvo rutas `@Public()`

## Controllers y rutas

| Controller | Métodos | Endpoints |
|------------|---------|-----------|
| `auth` | POST | `/auth/register`, `/auth/login`, `/auth/verify-otp`, `/auth/resend-otp`, `/auth/kerberos/exchange`, GET `/auth/perfil` |
| `usuarios` | GET/POST/PATCH | gestión de usuarios externos |
| `empresas` | GET/POST/PATCH | gestión de empresas y NIT |
| `solicitudes` | GET/POST/PATCH | borrador, envío, costos, consulta por código |
| `documentos` | GET/POST/PATCH | subida (Multer + SHA256) y validación |
| `pagos` | GET/POST/PATCH | registros y verificación de depósitos |
| `certificados` | GET/PATCH | emisión, revisión, aprobación, **entrega** (`PATCH /certificados/:id/entregar`) |
| `declaraciones` | GET/POST | declaración jurada por solicitud |
| `capacitaciones` | GET/POST | cursos, participantes, exportación Excel |
| `profesionales` | GET/POST | registro profesional por código |
| `sippci` | GET/POST | certificación SIPPCI por código |
| `renovaciones` | GET/POST | renovación de solicitudes/certificados |
| `notificaciones` | GET/PATCH | lista, marcar leída, leer todas |
| `admin` | GET | stats, solicitudes, alertas |
| `public` | GET | estado de solicitud y verificación de certificado (sin auth) |
| `dev` | DELETE | `/dev/usuarios/:email` (solo `NODE_ENV=development`) |

## Notas

- Códigos: `{PREF}-{NAT|JUR}-{YEAR}-{SEQ}` según `tipoPersona` (NAT/JUR, corregido).
- `PATCH /certificados/:id/entregar` disponible solo para roles CAJERO y ADMIN.
- Endpoint global de Swagger documenta DTOs y respuestas por módulo.