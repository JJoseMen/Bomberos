-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TipoDocumento" ADD VALUE 'CI';
ALTER TYPE "TipoDocumento" ADD VALUE 'TITULO_PROFESIONAL';
ALTER TYPE "TipoDocumento" ADD VALUE 'ESCRITURA_PUBLICA';
ALTER TYPE "TipoDocumento" ADD VALUE 'PODER_REPRESENTANTE';
ALTER TYPE "TipoDocumento" ADD VALUE 'LICENCIA_FUNCIONAMIENTO';
ALTER TYPE "TipoDocumento" ADD VALUE 'REGISTRO_COMERCIO';
ALTER TYPE "TipoDocumento" ADD VALUE 'CERTIFICADO_NIT';
ALTER TYPE "TipoDocumento" ADD VALUE 'PLANILLA_EXCEL';
ALTER TYPE "TipoDocumento" ADD VALUE 'COMPROBANTE_PAGO';
