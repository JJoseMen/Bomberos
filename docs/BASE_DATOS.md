# Base de datos — SIPPCI

## Esquema Prisma (25 tablas + 14 enums)

### Enums
`TipoPersona` · `EstadoUsuario` · `RolInterno` · `TipoCodigo` · `TipoTramite`
`SubtipoTramite` · `EstadoSolicitud` · `EstadoDocumento` · `EstadoPago`
`TipoDocumento` · `TipoCertificado` · `EstadoParticipante` · `EstadoInspeccion`
`TipoNotificacion`

### Tablas principales

| Tabla                    | Descripción                                                |
|--------------------------|------------------------------------------------------------|
| `usuarios`               | Usuarios externos (ciudadanos). OTP, bloqueos, intentos.   |
| `usuarios_internos`      | Funcionarios (ADMIN, OFICIAL, CAJERO). SSO Kerberos.      |
| `sesiones`               | Tokens de sesión activos.                                  |
| `codigos_verificacion`   | Códigos OTP para 2FA / registro / recuperación.            |
| `intentos_login`         | Trazabilidad de intentos de login (anti-brute-force).     |
| `empresas`               | Personas jurídicas (NIT, representante legal, etc.).      |
| `usuarios_empresas`      | Relación N:M usuarios ↔ empresas.                          |
| `solicitudes`            | Trámites en curso (certificación, registro, capacitación).|
| `historial_solicitudes`  | Cambio de estados por cada trámite.                        |
| `documentos`             | Archivos adjuntos (forms, planos, boletas).                |
| `pagos`                  | Depósitos bancarios (Banco Unión).                         |
| `certificados`           | Certificados emitidos (código físico por funcionario).     |
| `declaraciones_juradas`  | Declaración jurada (Form 06, obligatorio en los 3 módulos).|
| `cursos`                 | Catálogo de cursos de capacitación.                        |
| `participantes_capacitacion` | Inscritos a cursos/eventos.                       |
| `participantes_cursos`   | Relación N:M participantes ↔ cursos.                      |
| `inspecciones`           | Inspecciones técnicas de la DNB.                           |
| `notificaciones`         | Avisos a usuarios (email, SMS, app, sistema).              |
| `auditoria_general`      | Trazabilidad completa de acciones del sistema.             |

> Schema completo en `backend/prisma/schema.prisma` (19 modelos).
