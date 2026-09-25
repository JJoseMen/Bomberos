# API Profesionales — Endpoints

Base URL: `http://localhost:3001/api`

Todos los endpoints (excepto los públicos) requieren:
- Header `Authorization: Bearer {JWT}`
- Roles: ADMIN o GESTOR_REGISTRO_PROFESIONAL

## Solicitudes Natural

### GET /admin/profesionales/solicitudes/natural
Lista paginada de solicitudes de Persona Natural.

**Query params:**
- `search` (opcional): búsqueda por código/nombre
- `estado` (opcional): BORRADOR|ENVIADA|EN_REVISION|OBSERVADA|APROBADA|RECHAZADA|CERTIFICADO_EMITIDO|VENCIDO|RENOVADO|ANULADA
- `fechaDesde`, `fechaHasta` (opcional): ISO date
- `page` (default 1), `limit` (default 20)

**Response:**
```json
{
  "items": [...],
  "total": 45,
  "page": 1,
  "limit": 20,
  "pages": 3
}
```

### GET /admin/profesionales/solicitudes/natural/:codigo
Detalle completo (Expediente Digital).

**Response:**
```json
{
  "id": 1,
  "codigoFormulario": "SOL-2026-001",
  "estado": "EN_REVISION",
  "datosJson": { "...": "..." },
  "usuario": { "id": 5, "nombre": "...", "email": "...", "telefono": "..." },
  "documentos": [...],
  "historial": [...],
  "certificados": [...]
}
```

## Solicitudes Jurídica

### GET /admin/profesionales/solicitudes/juridica
### GET /admin/profesionales/solicitudes/juridica/:codigo
(Mismo formato que Natural, con empresa en lugar de usuario)

## Acciones

### POST /admin/profesionales/solicitudes/:codigo/aprobar
Body: (vacío)
Response: solicitud actualizada

### POST /admin/profesionales/solicitudes/:codigo/observar
Body:
```json
{ "justificacion": "Falta el título profesional" }
```
Validación: justificación ≥10 caracteres
Response: solicitud actualizada

### POST /admin/profesionales/solicitudes/:codigo/rechazar
Body:
```json
{ "justificacion": "Documentación fraudulenta" }
```
Validación: justificación ≥10 caracteres
Response: solicitud actualizada

### POST /admin/profesionales/solicitudes/:codigo/emitir-certificado
Body:
```json
{ "observaciones": "Emisión normal" }
```
Requiere: estado === APROBADA
Response:
```json
{
  "id": 1,
  "codigoCertificado": "CERT-2026-0001",
  "fechaEmision": "2026-09-25T...",
  "fechaVigencia": "2028-09-25T...",
  "tipo": "PROFESIONAL",
  "rutaArchivo": "uploads/certificados/CERT-2026-0001.pdf",
  "qrBase64": "data:image/png;base64,..."
}
```

## Certificados

### GET /admin/profesionales/lista/naturales
Lista de profesionales naturales certificados (con estado vigencia).

### GET /admin/profesionales/lista/juridicas
Lista de profesionales jurídicos certificados.

### GET /admin/profesionales/certificados
Todos los certificados emitidos (con filtros).

### GET /admin/profesionales/certificados/:codigo/descargar
Descarga el PDF del certificado.
Response: Content-Type: application/pdf

## Reportes

### GET /admin/profesionales/reportes/solicitudes-por-estado
Response: [{ "estado": "APROBADA", "total": 12 }, ...]

### GET /admin/profesionales/reportes/certificados-por-mes
Response: [{ "mes": "2026-09", "total": 5 }, ...]

### GET /admin/profesionales/reportes/por-especialidad
Response: [{ "especialidad": "Ingeniería", "total": 8 }, ...]

## Público

### GET /public/validar-certificado/:codigo
Sin autenticación.

**Response (válido):**
```json
{
  "valido": true,
  "vencido": false,
  "codigo": "CERT-2026-0001",
  "tipo": "PROFESIONAL",
  "titular": "Juan Pérez",
  "fechaEmision": "2026-09-25",
  "fechaVigencia": "2028-09-25",
  "mensaje": "Certificado válido"
}
```

**Response (inválido):**
```json
{
  "valido": false,
  "mensaje": "Certificado no encontrado"
}
```
