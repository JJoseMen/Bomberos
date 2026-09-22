-- CreateEnum
CREATE TYPE "EstadoDeclaracion" AS ENUM ('PENDIENTE', 'GENERADA', 'FIRMADA_SUBIDA', 'APROBADA', 'RECHAZADA');

-- AlterEnum
ALTER TYPE "TipoDocumento" ADD VALUE 'DECLARACION_JURADA_FIRMADA';

-- DropIndex
DROP INDEX "declaraciones_juradas_codigoJurada_key";

-- AlterTable
ALTER TABLE "declaraciones_juradas" DROP COLUMN "aceptada",
DROP COLUMN "codigoJurada",
DROP COLUMN "contenido",
DROP COLUMN "fechaAceptacion",
ADD COLUMN     "ciFirmante" TEXT NOT NULL,
ADD COLUMN     "codigoDeclaracion" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "estado" "EstadoDeclaracion" NOT NULL DEFAULT 'PENDIENTE',
ADD COLUMN     "fechaFirma" TIMESTAMP(3),
ADD COLUMN     "firmadoPor" TEXT NOT NULL,
ADD COLUMN     "ipFirma" TEXT,
ADD COLUMN     "observacion" TEXT,
ADD COLUMN     "pdfFirmadoHash" TEXT,
ADD COLUMN     "pdfFirmadoRuta" TEXT,
ADD COLUMN     "pdfGeneradoHash" TEXT NOT NULL,
ADD COLUMN     "pdfGeneradoRuta" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "declaraciones_juradas_codigoDeclaracion_key" ON "declaraciones_juradas"("codigoDeclaracion");