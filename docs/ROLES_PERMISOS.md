# Roles y permisos — SIPPCI

## Roles internos

| Rol        | Nivel     | Usuarios            |
|------------|-----------|---------------------|
| `ADMIN`    | Táctico   | Directores nacionales |
| `OFICIAL`  | Estratégico | Jefes de unidades / inspectores |
| `CAJERO`   | Operativo | Personal de recepción / pagos |

## Matriz de permisos

| Acción                                        | ADMIN | OFICIAL | CAJERO |
|-----------------------------------------------|:-----:|:-------:|:------:|
| Crear / editar / eliminar usuarios internos     |   ✅   |   ❌    |   ❌   |
| Revisar solicitudes pendientes                  |   ✅   |   ✅    |   ❌   |
| Aprobar / rechazar solicitudes                  |   ✅   |   ✅    |   ❌   |
| Emitir certificados físicos                     |   ✅   |   ✅    |   ❌   |
| Programar inspecciones                          |   ✅   |   ✅    |   ❌   |
| Registrar pagos / verificar boletas             |   ✅   |   ✅    |   ✅   |
| Crear / gestionar cursos                        |   ✅   |   ❌    |   ❌   |
| Ver reportes estadísticos                       |   ✅   |   ✅    |   ❌   |
| Acceder al panel de auditoría                   |   ✅   |   ❌    |   ❌   |

> El flujo de autenticación interna usa **Kerberos SSO** (simulado por ahora con mock). Los externos usan email + password + OTP.
