-- AlterEnum
BEGIN;
CREATE TYPE "EstadoParticipante_new" AS ENUM ('PENDIENTE', 'FORMULARIO_GENERADO', 'APROBADO', 'RECHAZADO', 'REPROBADO', 'CERTIFICADO_EMITIDO');
ALTER TABLE "participantes_capacitacion" ALTER COLUMN "estado" DROP DEFAULT;
ALTER TABLE "participantes_cursos" ALTER COLUMN "estado" DROP DEFAULT;
ALTER TABLE "participantes_capacitacion" ALTER COLUMN "estado" TYPE "EstadoParticipante_new" USING ("estado"::text::"EstadoParticipante_new");
ALTER TABLE "participantes_cursos" ALTER COLUMN "estado" TYPE "EstadoParticipante_new" USING ("estado"::text::"EstadoParticipante_new");
ALTER TYPE "EstadoParticipante" RENAME TO "EstadoParticipante_old";
ALTER TYPE "EstadoParticipante_new" RENAME TO "EstadoParticipante";
DROP TYPE "EstadoParticipante_old";
ALTER TABLE "participantes_capacitacion" ALTER COLUMN "estado" SET DEFAULT 'PENDIENTE';
ALTER TABLE "participantes_cursos" ALTER COLUMN "estado" SET DEFAULT 'PENDIENTE';
COMMIT;

-- DropForeignKey
ALTER TABLE "participantes_capacitacion" DROP CONSTRAINT "participantes_capacitacion_cursoId_fkey";

-- DropForeignKey
ALTER TABLE "participantes_capacitacion" DROP CONSTRAINT "participantes_capacitacion_solicitudId_fkey";

-- AlterTable
ALTER TABLE "participantes_capacitacion" DROP COLUMN "certificadoEmitido",
DROP COLUMN "ci",
DROP COLUMN "cursoId",
DROP COLUMN "nombre",
ADD COLUMN     "calificacion" TEXT,
ADD COLUMN     "carnet" TEXT NOT NULL,
ADD COLUMN     "codigoCertificado" TEXT,
ADD COLUMN     "esRepresentante" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "expedido" TEXT NOT NULL,
ADD COLUMN     "fechaEmisionCert" TIMESTAMP(3),
ADD COLUMN     "instructor" TEXT,
ADD COLUMN     "nombreCompleto" TEXT NOT NULL,
ADD COLUMN     "observacion" TEXT,
ADD COLUMN     "pdfCertificadoHash" TEXT,
ADD COLUMN     "pdfCertificadoRuta" TEXT,
ADD COLUMN     "pdfFormularioHash" TEXT,
ADD COLUMN     "pdfFormularioRuta" TEXT,
ADD COLUMN     "subCodigo" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "solicitudId" SET NOT NULL,
ALTER COLUMN "estado" SET DEFAULT 'PENDIENTE';

-- AlterTable
ALTER TABLE "participantes_cursos" ALTER COLUMN "estado" SET DEFAULT 'PENDIENTE';

-- CreateIndex
CREATE UNIQUE INDEX "participantes_capacitacion_subCodigo_key" ON "participantes_capacitacion"("subCodigo");

-- CreateIndex
CREATE UNIQUE INDEX "participantes_capacitacion_codigoCertificado_key" ON "participantes_capacitacion"("codigoCertificado");

-- AddForeignKey
ALTER TABLE "participantes_capacitacion" ADD CONSTRAINT "participantes_capacitacion_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "solicitudes"("id") ON DELETE CASCADE ON UPDATE CASCADE;