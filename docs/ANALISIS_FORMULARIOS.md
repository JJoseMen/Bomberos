# INFORME DE ANÁLISIS — SISTEMA BOMBEROS / SIPPCI

Fecha: 2026-09-22

## A) Proyecto actual en producción (PHP)

**Ruta:** `C:\Users\JOSE\OneDrive\Escritorio\bomberos\Bomberos`
**Stack:** PHP clásico + MySQL (MariaDB 10.4) + HTML/jQuery. Conexión `mysqli_connect("localhost","root","","bomberos")`.

- **45 formularios** inventariados en 44 archivos (login, formularios BND, Administracion, dashboard, capacitación, profesionales, validaciones).
- **28 tablas** en `bomberos.sql` (6 formularios BND + 4 checklists de validación + 8 de capacitación + 4 personal/usuarios + 6 catálogos).
- **Sin FOREIGN KEYS** en BD (relaciones solo lógicas por `ci`/`nit`/`codigo`). Sin validación JS real (solo atributos HTML `required` y lógica PHP). Plantillas inline, con bugs heredados (`oficnas`, `ncprofecional`, `materno` como int, `fecha_deposito` como int en BND-06, extensiones comparadas con `=`).

**Catálogos clave del dominio:** ámbito `oficnas` (Dirección Nacional + 9 departamentales), `nriesgo` (Bajo/Mediano/Alto), `grado` (14 grados), `neducacion` (Téc. Medio/Téc. Superior/Licenciatura), `tcapacitacion` (4 cursos), `departamento` (9). Códigos de trámite: `REGPROF-JUR-######`, `REGPROF-NAT-######`, `CAPACI-JUR-######`.

---

## B) Campos específicos de los 6 formularios BND (núcleo del original)

Todos comparten patrón: **codigo + fecha_solicitud + identidad + datos de pago por depósito + observaciones + adjunto (`docs`)**. Cuenta bancaria: Banco Unión "10000041958478 - Policía Boliviana Bomberos".

### formbns01 — Certificación SIPPCI Jurídica (FORM-DNB-001)

| Campo                     | Tipo                  |
|---------------------------|-----------------------|
| `num` (hidden) · `fsolicitud` (date auto) | num/fecha |
| `nombrers` · `nit` · `oficina` · `legal` · `ci` · `expedido`(select) | identidad jurídica |
| `mail`(email) · `fono` · `ciudad` · `depto`(select) · `provincia` · `municipio` | contacto/ubicación |
| `deposito`(num) · `fdeposito`(date) | pago |
| `obs`(textarea opcional) · `docs`(file) | doc |

### formbns02 — Certificación SIPPCI Natural (FORM-DNB-002)

Mismo patrón sin NIT/razón social: `num`, `fecha`, `ci`, `expedido`, `mail`, `telefono`, `ciudad`, `departamento`, `provincia`, `municipio`, `deposito`, `fdeposito`, `observaciones`, `docs`.

### formbns03 — Registro Profesional Jurídica (FORM-DNB-003)

| Campo                     | Tipo |
|---------------------------|------|
| `num` · `fecha` | — |
| `nombrerz` · `nit` · `oficina` · `legal` · `cedula` · `expedido`(select) | identidad jurídica |
| `mail` · `telefono` · `ciudad` · `departamento`(select) · `provincia` · `municipio` | contacto |
| `ncprofesional` · `ciprofesional` · `carrera` · `educacion`(select) | **datos profesionales** |
| `deposito` · `fdeposito` · `observaciones` · `docs` | pago/doc |

### formbns04 — Registro Profesional Natural (FORM-DNB-004)

Igual que 03 sin razón/NIT/oficina: `cedula`, `expedido`, `mail`, `telefono`, `ciudad`, `departamento`, `provincia`, `municipio`, `ncprofesional`, `ciprofesional`, `carrera`, `educacion`, `deposito`, `fdeposito`, `observaciones`, `docs`.

### formbns05 — Capacitación Jurídica (FORM-DNB-005)

| Campo                     | Tipo |
|---------------------------|------|
| `nombrerz` · `nit` · `oficina` · `legal` · `cedula` · `expedido` | identidad |
| `mail` · `telefono` · `ciudad` · `departamento` · `provincia` · `municipio` | contacto |
| `capacitacion`(select) · `cantidad`(num) | **curso + nº personas** |
| `deposito` · `fdeposito` · `observaciones` · `docs` | pago/doc |

### formbns06 — Declaración Jurada (FORM-DNB-006)

| Campo                          | Tipo |
|--------------------------------|------|
| `num`(DECLA-JUR-rand) · `nombrerz` · `fecha` · `nit` | identidad |
| `ciudad` · `direccion` · `legal` · `ciresponsable` · `departamento`(select) · `provincia` · `municipio` | domicilio |
| `telefono` · `mail` · `nombrepersona` · `nivel`(select→nriesgo) · `tipo` | nivel de riesgo/tipo |
| `numoperacion` · `fdeposito` · `montodeposito` · `docs` | **pago monetario** |

### Checklists de validación documental (4)

- `sippci01Val` (C.P.N.): formulario, plano, plan, licencia, carnet, boleta.
- `sippci02Val` (V.C.P.J.): formulario, plano, plan, licencia, carnet, poder, boleta.
- `profesionales01Val` (R.P.P.N.): solicitud, carnet, dirección, teléfono, nit, legalizada, boleta.
- `profesionales02Val` (R.P.P.J.): solicitud, escritura, poder, carnet, lic. funcionamiento, reg. comercio, cert. nit, título, boleta.

### Módulo capacitación

- `crearCurso` (nombre, oficina, instructor[], fecha).
- `crearInstructor` (oficina, grado, pnombre, snombre, apaterno, amaterno, curso[1-4], fecha, usuario).
- `programar` (codigo, lugar radios "Bomberos"/"Empresa", direccion, date, time), `reprogramar`.
- `subirNotas` (nit, curso, ci, nombre, puntuacion), `subirParticipantes` (codigo, curso, depto, instructor, docs[xlsx]), `participantes` (depto).

### Administración de usuarios

- `crear`/`habilitar`/`deshabilitar` (grado, ci, p/s nombre, paterno, materno, oficina, usuario auto, pass=escalafón).
- `password.php` (4 checkboxes todos `name="instructor"`).

---

## C) Proyecto nuevo (React + NestJS) — qué tenemos hoy

**Stack:** React 19 + Vite + TS, React Hook Form + Zod, Zustand, TanStack Query · NestJS 10 + Prisma 5.22 + PostgreSQL 16 · **24 tablas Prisma / 16 módulos / 31 tipos / 15 servicios**. SMTP real funcionando (FASE VII).

### Formularios funcionales (React Hook Form + Zod)

| Form                  | Campos                                                                 | Endpoint |
|-----------------------|------------------------------------------------------------------------|----------|
| RegisterPage          | `ci?`, `nombreCompleto`, `departamento?`, `telefono?`, `email`, `password`, `tipoPersona`(radio→`nit?`), términos | `POST /auth/register` |
| LoginPage             | `email`, `password`                                                     | `POST /auth/login` |
| VerifyOtpPage         | `email`, `codigo`(6)                                                    | `POST /auth/verify-otp` / `resend-otp` |
| RegistrarPago         | `numeroOperacion?`, `monto`, `fechaDeposito?`, `banco?`                 | `POST /solicitudes/:codigo/pago` |
| DeclaracionJurada     | `firmadoPor`, `ciFirmante`, checkbox acepta                             | `POST /solicitudes/:codigo/declaracion` |
| EmisionCertificados   | `codigo`, `codigoCert` (oficial)                                        | `PATCH /solicitudes/:codigo/registrar-certificado` |

### Wizards de trámite (SIPPCI / Profesional / Capacitación)

Estructurados en pasos pero **en gran parte placeholders**: campos sin `name`, no se persisten; `SubirDocumento` no conectado al servicio; botones de admin/cajero (Revisar, Aprobar, Verificar, Rechazar) sin `onClick`.

### DTOs backend (bien definidos)

- `CreateSolicitudDto` / `CrearSippciDto`: tipoPersona, nombreCompleto, ci/nit, email, telefono, direccion, ciudad, departamento, tipoInfraestructura, **nivelRiesgo**, superficie, aforoMaximo.
- `CrearProfesionalDto`: tipoPersona, nombreCompleto, ci/nit, email, telefono, direccion, ciudad, departamento, **tituloProfesional, carrera, nivelEducacion**, datosEspecificos.
- `CrearParticipanteDto`: nombreCompleto, carnet, expedido, email?, telefono?, **cursos[]**.
- `RegistrarPagoDto`, `FirmarDeclaracionDto`, `CreateUsuarioDto`, `CambiarEstadoDto`.

### Catálogos replicados con `legacyId`

departamentos(9 + abrev), grados(14), oficinas(10), niveles_educacion, niveles_riesgo. Enums bien tipados: SubTipoTramite, EstadoSolicitud(11 estados), EstadoDocumento/Pago/Participante, TipoDocumento.

---

## D) Mapa original → nuevo: lo que YA está controlado

| Original                          | Nuevo                                                                 |
|-----------------------------------|-----------------------------------------------------------------------|
| 6 formularios BND en tablas separadas | `solicitudes` + `datosJson` + `solicitudAnteriorId` (unifica)      |
| código manual (`REGPROF-JUR-rand`) | `codigoFormulario` @unique auto (SIPPCI–NNN–año–seq)                  |
| pago por depósito libre            | `pagos` (numeroOperacion @unique, monto Decimal, banco default Banco Unión, estados PENDIENTE/VERIFICADO/OBSERVADO/RECHAZADO) |
| validación documental con checkboxes libre | `documentos` + `TipoDocumento` enum (checklist tipificado)   |
| usuarios con pass=escalafón        | `usuarios` + `usuarios_internos`(roles ADMINISTRADOR/OFICIAL/CAJERO) + `sesiones` + `intentos_login` |
| sin auditoría                      | `auditoria_general`, `historial_solicitudes`, `notificaciones`, `declaraciones_juradas` (hash/código único) |
| catálogos sueltos                  | tablas con `legacyId`, enums Prisma                                   |

### Desalineaciones detectadas (a corregir)

- `CambiarEstadoDto` front manda `comentario` vs backend `observacion`.
- `FirmarDeclaracionDto` front `{solicitudId}` vs backend `{firmadoPor, ciFirmante}`.
- `CreateUsuarioDto` front tiene `password` pero el DTO backend no la valida.
- `Curso` front (`duracionUfv`, `costoUnitario`) vs tabla `cursos` (`costoBsf`).
- `CreateSolicitudDto.empresaId` IsString vs Prisma Int.

---

## E) Campos que aumentaremos (visión técnica / mejor control)

1. **Tipificar pago multiplataforma:** `moneda` (BOB/USD), `numeroBoleta`, `comprobanteRuta`, `cobradoPorId` en `pagos` (el DTO ya los prevé; la UI aún no).
2. **Normalizar identidad tipo "expedido":** tabla `lugares_expedicion` (hoy texto libre en original) y vincular `usuarios.expedidoCi`.
3. **Formularios completos (wizard→RHF+Zod):**
   - **SIPPCI:** tipoPersona, nombre/razonSocial, ci/nit, departamento, ciudad, direccion, tipoInfraestructura, nivelRiesgo, superficie, aforoMaximo, fecha inspección programada (+ generar `inspecciones`).
   - **Profesional:** tituloProfesional, carrera, nivelEducacion, nroRegistro, grado, matricula, vigencia título → **renovaciones por vencimiento**.
   - **Capacitación:** curso(s), cantidadParticipantes, lista Excel, resultados (`subirnota`→`participantes` APROBADO/REPROBADO), certificado por participante.
4. **Declaración Jurada con trazabilidad:** ya tiene `codigoJurada`+`fechaAceptacion`; añadir `hashContenido`, `aceptadaEnDispositivo/ip` y persistir firma (firmadoPor/ciFirmante).
5. **Vencimientos/alertas:** `fechaVigencia`/`fechaAprobacion` ya existen en `certificados`/`solicitudes`; activar alertas vencidos/próximos + notificaciones EMAIL/SMS/APP.
6. **Control de bonos/valor UFV:** en `cursos` usar `costoUfv` y calcular `costoTotal` con tasa del día (`costo-total` ya es endpoint).

---

## F) Conclusión

El nuevo sistema ya absorbe la taxonomía del original (catálogos con `legacyId`, estados, checklist documental, pagos, auditoría). Pendiente: **completar la captura de datos de los 3 wizards** (hoy placeholder), **persistir la declaración con sus firmantes**, **unificar discrepancias de nombres front/back** y **activar flujo de revisión/inspección** para tener la visión técnica y control deseada.