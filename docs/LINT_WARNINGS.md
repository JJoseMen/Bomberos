# Lint — Advertencias pendientes (backend)

Resultado: **0 errores, 8 warnings** (`npx eslint "src/**/*.ts"`).

> Fuente: backend NestJS 10.4 · ESLint 9.17 · rule `@typescript-eslint/no-unused-vars`.

## Warnings

| # | Archivo | Línea | Variable | Descripción | Prioridad |
|---|---------|-------|----------|-------------|:--------:|
| 1 | `backend/src/modules/declaraciones/declaraciones.service.ts` | 20 | `_ipAddress` | Definida pero nunca usada | Baja |
| 2 | `backend/src/modules/declaraciones/declaraciones.service.ts` | 46 | `hash` | Asignada pero nunca usada | Media |
| 3 | `backend/src/modules/declaraciones/declaraciones.service.ts` | 103 | `hashCalculado` | Asignada pero nunca usada | Media |
| 4 | `backend/src/modules/documentos/documentos.service.ts` | 103 | `_usuarioInternoId` | Definida pero nunca usada | Baja |
| 5 | `backend/src/modules/pagos/pagos.service.ts` | 57 | `_usuarioInternoId` | Definida pero nunca usada | Baja |
| 6 | `backend/src/modules/profesionales/profesionales.service.ts` | 1 | `BadRequestException` | Import no usado | Baja |
| 7 | `backend/src/modules/profesionales/profesionales.service.ts` | 15 | `count` | Asignada pero nunca usada | Media |
| 8 | `backend/src/modules/usuarios/dto/create-usuario.dto.ts` | 7 | `MinLength` | Import no usado | Baja |

## Recomendación

- **Media**: los warnings 2, 3 y 7 sugieren lógica incompleta (verificación de hash/cuenta) — revisar antes de limpiar.
- **Baja**: imports y parámetros `_*`/resto pueden eliminarse sin efecto funcional.
- Comando: `npx eslint "src/**/*.ts"` (sin `--fix` para solo inspeccionar).