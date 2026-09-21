-- CreateEnum
CREATE TYPE "TipoPersona" AS ENUM ('NATURAL', 'JURIDICA');

-- CreateEnum
CREATE TYPE "EstadoUsuario" AS ENUM ('PENDIENTE_VERIFICACION', 'ACTIVO', 'BLOQUEADO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "RolInterno" AS ENUM ('ADMINISTRADOR', 'OFICIAL', 'CAJERO');

-- CreateEnum
CREATE TYPE "TipoCodigo" AS ENUM ('VERIFICAR_EMAIL', 'VERIFICAR_CUENTA', 'RESTABLECER_PASSWORD');

-- CreateEnum
CREATE TYPE "TipoTramite" AS ENUM ('CERTIFICACION_SIPPCI', 'REGISTRO_PROFESIONAL', 'CAPACITACION', 'RENOVACION');

-- CreateEnum
CREATE TYPE "SubtipoTramite" AS ENUM ('INFRAESTRUCTURA', 'HIDROCARBUROS', 'POLIGONO_TIRO', 'TURISMO', 'NATURAL', 'JURIDICA', 'ASESOR_EMERGENCIA');

-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('BORRADOR', 'ENVIADA', 'EN_REVISION', 'OBSERVADA', 'APROBADA', 'RECHAZADA', 'ANULADA');

-- CreateEnum
CREATE TYPE "EstadoDocumento" AS ENUM ('PENDIENTE', 'VALIDADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'VERIFICADO', 'OBSERVADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('FORMULARIO', 'PLANO_SIPPCI', 'PLAN_EMERGENCIA', 'CREDENCIAL_PROFESIONAL', 'NIT', 'BOLETA_DEPOSITO', 'CERTIFICADO_ANTERIOR', 'OTRO');

-- CreateEnum
CREATE TYPE "TipoCertificado" AS ENUM ('SIPPCI', 'PROFESIONAL', 'CAPACITACION', 'RENOVACION');

-- CreateEnum
CREATE TYPE "EstadoParticipante" AS ENUM ('INSCRITO', 'APROBADO', 'REPROBADO', 'ABANDONO');

-- CreateEnum
CREATE TYPE "EstadoInspeccion" AS ENUM ('PROGRAMADA', 'EN_CURSO', 'CONFORME', 'NO_CONFORME');

-- CreateEnum
CREATE TYPE "TipoNotificacion" AS ENUM ('EMAIL', 'SMS', 'APP', 'SISTEMA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "passwordHash" TEXT NOT NULL,
    "tipo" "TipoPersona" NOT NULL DEFAULT 'NATURAL',
    "estado" "EstadoUsuario" NOT NULL DEFAULT 'PENDIENTE_VERIFICACION',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "intentosLogin" INTEGER NOT NULL DEFAULT 0,
    "bloqueadoHasta" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios_internos" (
    "id" SERIAL NOT NULL,
    "ci" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "grado" TEXT,
    "rol" "RolInterno" NOT NULL DEFAULT 'OFICIAL',
    "unidad" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_internos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sesiones" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER,
    "usuarioInternoId" INTEGER,
    "token" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sesiones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "codigos_verificacion" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "codigo" TEXT NOT NULL,
    "tipo" "TipoCodigo" NOT NULL,
    "expiraEn" TIMESTAMP(3) NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "codigos_verificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intentos_login" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "ip" TEXT NOT NULL,
    "exitoso" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "intentos_login_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresas" (
    "id" SERIAL NOT NULL,
    "razonSocial" TEXT NOT NULL,
    "nit" TEXT NOT NULL,
    "direccion" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "representanteLegal" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios_empresas" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'REPRESENTANTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitudes" (
    "id" SERIAL NOT NULL,
    "codigoFormulario" TEXT NOT NULL,
    "tipoTramite" "TipoTramite" NOT NULL,
    "subtipoTramite" "SubtipoTramite" NOT NULL,
    "estado" "EstadoSolicitud" NOT NULL DEFAULT 'BORRADOR',
    "usuarioId" INTEGER NOT NULL,
    "empresaId" INTEGER,
    "datosJson" JSONB NOT NULL DEFAULT '{}',
    "revisadoPorId" INTEGER,
    "aprobadoPorId" INTEGER,
    "fechaPresentacion" TIMESTAMP(3),
    "fechaAprobacion" TIMESTAMP(3),
    "fechaVigencia" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitudes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historial_solicitudes" (
    "id" SERIAL NOT NULL,
    "solicitudId" INTEGER NOT NULL,
    "estadoAnterior" "EstadoSolicitud",
    "estadoNuevo" "EstadoSolicitud" NOT NULL,
    "comentario" TEXT,
    "realizadoPorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_solicitudes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos" (
    "id" SERIAL NOT NULL,
    "solicitudId" INTEGER NOT NULL,
    "usuarioId" INTEGER,
    "tipo" "TipoDocumento" NOT NULL,
    "rutaArchivo" TEXT NOT NULL,
    "nombreOriginal" TEXT NOT NULL,
    "mimeType" TEXT,
    "tamanoBytes" INTEGER,
    "estado" "EstadoDocumento" NOT NULL DEFAULT 'PENDIENTE',
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" SERIAL NOT NULL,
    "solicitudId" INTEGER NOT NULL,
    "numeroOperacion" TEXT NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "fechaDeposito" TIMESTAMP(3) NOT NULL,
    "banco" TEXT NOT NULL DEFAULT 'Banco Union',
    "estado" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "verificadoPorId" INTEGER,
    "verificadoEn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificados" (
    "id" SERIAL NOT NULL,
    "solicitudId" INTEGER NOT NULL,
    "tipo" "TipoCertificado" NOT NULL,
    "codigoCertificado" TEXT NOT NULL,
    "emitidoPorId" INTEGER NOT NULL,
    "fechaEmision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaVigencia" TIMESTAMP(3) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "declaraciones_juradas" (
    "id" SERIAL NOT NULL,
    "solicitudId" INTEGER NOT NULL,
    "codigoJurada" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "aceptada" BOOLEAN NOT NULL DEFAULT true,
    "fechaAceptacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "declaraciones_juradas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cursos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "modalidad" TEXT NOT NULL DEFAULT 'PRESENCIAL',
    "duracionHoras" INTEGER,
    "costoBsf" DECIMAL(10,2),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participantes_capacitacion" (
    "id" SERIAL NOT NULL,
    "cursoId" INTEGER,
    "solicitudId" INTEGER,
    "nombre" TEXT NOT NULL,
    "ci" TEXT NOT NULL,
    "email" TEXT,
    "telefono" TEXT,
    "estado" "EstadoParticipante" NOT NULL DEFAULT 'INSCRITO',
    "certificadoEmitido" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "participantes_capacitacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participantes_cursos" (
    "id" SERIAL NOT NULL,
    "participanteId" INTEGER NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "estado" "EstadoParticipante" NOT NULL DEFAULT 'INSCRITO',
    "fechaInscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "participantes_cursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspecciones" (
    "id" SERIAL NOT NULL,
    "solicitudId" INTEGER NOT NULL,
    "inspectorId" INTEGER NOT NULL,
    "fechaProgramada" TIMESTAMP(3) NOT NULL,
    "fechaRealizada" TIMESTAMP(3),
    "estado" "EstadoInspeccion" NOT NULL DEFAULT 'PROGRAMADA',
    "resultado" TEXT,
    "observaciones" TEXT,
    "informeRuta" TEXT,
    "creadoPorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inspecciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER,
    "usuarioInternoId" INTEGER,
    "solicitudId" INTEGER,
    "tipo" "TipoNotificacion" NOT NULL,
    "asunto" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditoria_general" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER,
    "usuarioInternoId" INTEGER,
    "accion" TEXT NOT NULL,
    "entidad" TEXT,
    "entidadId" INTEGER,
    "detalle" JSONB,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditoria_general_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departamentos" (
    "id" SERIAL NOT NULL,
    "abrev" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "legacy_id" INTEGER,

    CONSTRAINT "departamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grados" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "legacy_id" INTEGER,

    CONSTRAINT "grados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oficinas" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "legacy_id" INTEGER,

    CONSTRAINT "oficinas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "niveles_educacion" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "legacy_id" INTEGER,

    CONSTRAINT "niveles_educacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "niveles_riesgo" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "legacy_id" INTEGER,

    CONSTRAINT "niveles_riesgo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_internos_ci_key" ON "usuarios_internos"("ci");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_internos_email_key" ON "usuarios_internos"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sesiones_usuarioId_key" ON "sesiones"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "sesiones_usuarioInternoId_key" ON "sesiones"("usuarioInternoId");

-- CreateIndex
CREATE UNIQUE INDEX "sesiones_token_key" ON "sesiones"("token");

-- CreateIndex
CREATE INDEX "codigos_verificacion_usuarioId_idx" ON "codigos_verificacion"("usuarioId");

-- CreateIndex
CREATE INDEX "intentos_login_usuarioId_createdAt_idx" ON "intentos_login"("usuarioId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_nit_key" ON "empresas"("nit");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_empresas_usuarioId_empresaId_key" ON "usuarios_empresas"("usuarioId", "empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "solicitudes_codigoFormulario_key" ON "solicitudes"("codigoFormulario");

-- CreateIndex
CREATE INDEX "solicitudes_usuarioId_idx" ON "solicitudes"("usuarioId");

-- CreateIndex
CREATE INDEX "historial_solicitudes_solicitudId_createdAt_idx" ON "historial_solicitudes"("solicitudId", "createdAt");

-- CreateIndex
CREATE INDEX "documentos_solicitudId_idx" ON "documentos"("solicitudId");

-- CreateIndex
CREATE UNIQUE INDEX "pagos_numeroOperacion_key" ON "pagos"("numeroOperacion");

-- CreateIndex
CREATE INDEX "pagos_solicitudId_idx" ON "pagos"("solicitudId");

-- CreateIndex
CREATE UNIQUE INDEX "certificados_solicitudId_key" ON "certificados"("solicitudId");

-- CreateIndex
CREATE UNIQUE INDEX "certificados_codigoCertificado_key" ON "certificados"("codigoCertificado");

-- CreateIndex
CREATE UNIQUE INDEX "declaraciones_juradas_solicitudId_key" ON "declaraciones_juradas"("solicitudId");

-- CreateIndex
CREATE UNIQUE INDEX "declaraciones_juradas_codigoJurada_key" ON "declaraciones_juradas"("codigoJurada");

-- CreateIndex
CREATE UNIQUE INDEX "participantes_cursos_participanteId_cursoId_key" ON "participantes_cursos"("participanteId", "cursoId");

-- CreateIndex
CREATE INDEX "inspecciones_solicitudId_idx" ON "inspecciones"("solicitudId");

-- CreateIndex
CREATE INDEX "auditoria_general_createdAt_idx" ON "auditoria_general"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "departamentos_abrev_key" ON "departamentos"("abrev");

-- CreateIndex
CREATE UNIQUE INDEX "departamentos_legacy_id_key" ON "departamentos"("legacy_id");

-- CreateIndex
CREATE UNIQUE INDEX "grados_legacy_id_key" ON "grados"("legacy_id");

-- CreateIndex
CREATE UNIQUE INDEX "oficinas_legacy_id_key" ON "oficinas"("legacy_id");

-- CreateIndex
CREATE UNIQUE INDEX "niveles_educacion_legacy_id_key" ON "niveles_educacion"("legacy_id");

-- CreateIndex
CREATE UNIQUE INDEX "niveles_riesgo_legacy_id_key" ON "niveles_riesgo"("legacy_id");

-- AddForeignKey
ALTER TABLE "sesiones" ADD CONSTRAINT "sesiones_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones" ADD CONSTRAINT "sesiones_usuarioInternoId_fkey" FOREIGN KEY ("usuarioInternoId") REFERENCES "usuarios_internos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "codigos_verificacion" ADD CONSTRAINT "codigos_verificacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intentos_login" ADD CONSTRAINT "intentos_login_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios_empresas" ADD CONSTRAINT "usuarios_empresas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios_empresas" ADD CONSTRAINT "usuarios_empresas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes" ADD CONSTRAINT "solicitudes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes" ADD CONSTRAINT "solicitudes_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes" ADD CONSTRAINT "solicitudes_revisadoPorId_fkey" FOREIGN KEY ("revisadoPorId") REFERENCES "usuarios_internos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes" ADD CONSTRAINT "solicitudes_aprobadoPorId_fkey" FOREIGN KEY ("aprobadoPorId") REFERENCES "usuarios_internos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_solicitudes" ADD CONSTRAINT "historial_solicitudes_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "solicitudes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "solicitudes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "solicitudes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificados" ADD CONSTRAINT "certificados_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "solicitudes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificados" ADD CONSTRAINT "certificados_emitidoPorId_fkey" FOREIGN KEY ("emitidoPorId") REFERENCES "usuarios_internos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "declaraciones_juradas" ADD CONSTRAINT "declaraciones_juradas_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "solicitudes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participantes_capacitacion" ADD CONSTRAINT "participantes_capacitacion_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "cursos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participantes_capacitacion" ADD CONSTRAINT "participantes_capacitacion_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "solicitudes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participantes_cursos" ADD CONSTRAINT "participantes_cursos_participanteId_fkey" FOREIGN KEY ("participanteId") REFERENCES "participantes_capacitacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participantes_cursos" ADD CONSTRAINT "participantes_cursos_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspecciones" ADD CONSTRAINT "inspecciones_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "solicitudes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspecciones" ADD CONSTRAINT "inspecciones_inspectorId_fkey" FOREIGN KEY ("inspectorId") REFERENCES "usuarios_internos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_usuarioInternoId_fkey" FOREIGN KEY ("usuarioInternoId") REFERENCES "usuarios_internos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "solicitudes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditoria_general" ADD CONSTRAINT "auditoria_general_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditoria_general" ADD CONSTRAINT "auditoria_general_usuarioInternoId_fkey" FOREIGN KEY ("usuarioInternoId") REFERENCES "usuarios_internos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
