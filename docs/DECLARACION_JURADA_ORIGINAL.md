# Declaración Jurada en el Sistema Original (FORM-DNB-06)

> Documento de análisis: cómo funcionaba la declaración jurada en el sistema original
> (PHP + MySQL, `C:\Users\JOSE\OneDrive\Escritorio\bomberos\Bomberos`).
> Fecha: 22/09/2026

---

## 1. Descripción del formulario original

El trámite se llama **"Formulario Único de Declaración Jurada – FORM-DNB-06"** y se
materializa en 3 piezas PHP:

| Archivo | Ruta | Rol |
|---|---|---|
| `formbns06.php` | `formularios/formbns06.php` | Formulario público de captura |
| `upload06.php` | `formularios/upload/upload06.php` | Procesa POST, valida y sube la imagen, inserta en BD |
| `reporte02.php` | `formularios/upload/reporte02.php` | Genera el "comprobante PDF" con FPDF |
| `sippci03.php` | `dashboard/sippci03.php` | Panel del oficial: listado de declaraciones |
| `sippci03Rev.php` | `dashboard/respaldos/sippci03Rev.php` | Vista de detalle para el oficial (pasa datos por GET) |

Aunque es un solo formulario, la UI original lo titula "Persona Natural" en el PDF,
pero el campo principal es **Nombre o Razón Social** y solicita **NIT**, lo que lo hace
aplicable a personas naturales y jurídicas (empresas).

---

## 2. Campos que tenía

Extraídos de `formbns06.php`:

1. **Código de sistema** (autogenerado en PHP: `DECLA-JUR-` + `rand(1,1000000)`, campo oculto `num`)
2. **Datos Generales**:
   - Nombre o Razón Social (`nombrerz`)
   - Fecha de Solicitud (`fecha`, fecha de hoy readonly)
   - NIT (`nit`)
   - Ciudad (`ciudad`)
   - Dirección de la Oficina (`direccion`)
   - Nombre del Responsable Legal (`legal`)
   - Número de C.I. (`ciresponsable`)
   - Departamento (`departamento`, select desde tabla `departamento`)
   - Provincia (`provincia`)
   - Municipio (`municipio`)
   - Teléfono Oficina/Celular (`telefono`)
   - Correo Electrónico (`mail`)
   - Nombre del Personal que elaboró el Plan de Emergencia (`nombrepersona`)
3. **Contenido del Plan de Emergencia**:
   - Nivel de Riesgo (`nivel`, select desde tabla `nriesgo`)
   - Tipo de Infraestructura según Título 4° SIPPCI (`tipo`)
   - Texto fijo que declara el contenido técnico implementado (plano SIPPCI, plan de
     emergencia: evacuación, brigadas, instalaciones, salidas, escaleras, pasillos,
     señalización, puntos de encuentro, botones de pánico) — NO es editable, es texto estático.
4. **Datos de la Boleta de Depósito Bancario**:
   - Número de Operación (`numoperacion`)
   - Fecha de Depósito (`fdeposito`)
   - Monto del Depósito (`montodeposito`)
   - **Adjuntar Comprobante (Fotografía)** (`docs`, `type=file`)
5. **Texto normativo de la declaración** (bloque estático): invoca el **art. 1322 del
   Código Civil** y declara que los contenidos técnicos son verídicos y fidedignos.

**Tabla en BD**: `formbnd06s` — columnas `codigo, nombrerz, fecha_solicitud, nit, ciudad,
direccion, responsablelegal, ciresponsable, departamento, provincia, municipio, telefono,
mail, nombre_persona, nivel, tipo, num_operacion, fecha_deposito, monto_deposito, docs`.

---

## 3. Cómo se generaba el PDF

En `reporte02.php` tras el guardado (enlace "Generar comprobante PDF" con `?codigo=`):

- Se usa la librería **FPDF** (carpeta `fpdf/`), clase `PDF` con `Header()` y `Footer()`.
- Encabezado con banner (imagen), pie con "Página N" y línea decorativa.
- Título: "Formulario de Registro de Certificación SIPPCI - Persona Natural".
- Imprime en vertical los datos del registro: código, fecha solicitud, NIT, correo,
  teléfono, departamento, provincia, municipio, ciudad, monto depósito, fecha depósito,
  archivo adjunto; y un pie con el **NIT** + texto "Nit".
- Respuesta: `$pdf->Output()` (descarga inline del PDF).

**Importante**: el PDF es un *comprobante de datos*, no un documento legal con firma.
Varias líneas de campos están comentadas (expedido, observaciones) — el template está a mitad de construcción.

---

## 4. Cómo se firmaba

**No había firma digital ni electrónica en el sistema.** El flujo de firma era **físico
en papel**:

- El formulario web mostraba un alert al final:
  > "ENTREGAR EL PRESENTE FORMULARIO DEBIDAMENTE LLENADO Y FIRMADO A LA DIRECCIÓN DEPARTAMENTAL DE SU JURISDICCIÓN"
- La única subida de archivo era la **imagen del comprobante de depósito bancario**
  (jpg/jpeg/png, tamaño < 1 MB), no un PDF firmado.
- La "declaración" en línea era aceptar el texto normativo al enviar el formulario
  (declaración implícita), y la firma formal ocurre al entregar el impreso.

---

## 5. Cómo se validaba (checklist del oficial)

- `dashboard/sippci03.php` lista las declaraciones (`SELECT * FROM formbnd06s`)
  con columnas: Fecha Solicitud, Razón Social, NIT, Institución, Responsable Legal, Acciones.
- Acciones por fila: **"Ver"** → `sippci03Rev.php` (detalle completo), y dos enlaces
  **"Requisitos"** y **"Aprobar"** que **apuntan a `#` (no implementados)**.
- `sippci03Rev.php` simplemente recorre los valores por **GET** y los muestra en una tabla
  (incluye el comprobante `docs` como `<img>`). No escribe ningún estado de aprobación.

**Conclusión**: para este trámite **no existía checklist ni flujo de aprobación/rechazo**
funcional en el oficial. El patrón de checklist sí existía *para otros trámites*:
`dashboard/validaciones/sippci01Val.php` (SIPPCI Persona Natural) muestra un tabla de
"Información y Documentación Presentada" con **casillas de verificación**:
Formulario, Plano SIPPCI, Plan de Emergencia, Licencia de funcionamiento, Carnet de
identidad, Boleta de depósito bancario — y permite **subir un archivo PDF** y guardarlo en
la tabla `validacioncpn`. Para la declaración jurada ese checklist nunca se completó.

---

## 6. Diferencias con el nuevo enfoque

| Aspecto | Original (PHP) | Nuevo enfoque (Objetivo) |
|---|---|---|
| Entrada de datos | 20+ campos manuales en un formulario web | ? (a definir) |
| Documento legal | Formulario impreso en papel, firmado a mano | **PDF generado + firmado en papel + subido al sistema** |
| Firma | Manuscrita fuera del sistema | Escaneo del PDF firmado subido al sistema |
| Archivo subido | Solo fotografía del comprobante bancario (jpg, <1MB) | PDF firmado (y demás documentos) |
| Generación PDF | `reporte02.php` (FPDF) como comprobante de datos | PDF generado por el sistema con diseño formal |
| Código | `DECLA-JUR-` + `rand()` (colisión posible) | (usar código único tipo `DJ-YYYY-NNNNN`) |
| Validación oficial | No implementada (enlaces `#`) | (a definir) |
| Estado del trámite | No existía (solo INSERT) | El sistema nuevo ya tiene estados (BORRADOR→ENVIADA→…) |
| Oracle legal | Texto art. 1322 Código Civil | (conservar el texto normativo) |

---

## 7. Recomendaciones

1. **Generar el PDF en el backend** (NestJS) con la misma estructura FORM-DNB-06
   (datos generales + contenido del plan de emergencia + datos del depósito + texto
   normativo del art. 1322), reutilizando la librería ya usada en el proyecto o una
   equivalente (pdfkit / jspdf / playwright).
2. **Flujo de firma mixto**: el sistema genera el PDF → el ciudadano lo imprime, lo
   firma y lo sube escaneado como documento `DECLARACION_JURADA_FIRMADA`; además guardar
   los metadatos (aceptación de términos con timestamp) en `declaraciones_juradas`.
3. **Código único**: reemplazar `rand()` por secuencia/autoincremento con formato
   `DJ-YYYY-NNNNN` (ya existe `codigoJurada` en el modelo nuevo).
4. **Validación oficial**: implementar el checklist de requisitos que nunca se hizo en el
   original (formulario, plano SIPPCI, plan de emergencia, licencia, carnet, boleta y el
   **PDF firmado**) con flujo aprobar/rechazar + registro en historial.
5. **Seguridad de uploads**: el original validaba tamaño y extensión de imagen; el nuevo
   debe validar extensión PDF y tamaño, y guardar fuera de la raíz pública (ya se hace en
   `backend/uploads`).
6. **Mantener el texto legal**: el art. 1322 del Código Civil debe conservarse en el
   contenido del PDF generado.