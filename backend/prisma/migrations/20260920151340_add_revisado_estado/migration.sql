-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EstadoSolicitud" ADD VALUE 'REVISADO';
ALTER TYPE "EstadoSolicitud" ADD VALUE 'CERTIFICADO_EMITIDO';
ALTER TYPE "EstadoSolicitud" ADD VALUE 'VENCIDO';
ALTER TYPE "EstadoSolicitud" ADD VALUE 'RENOVADO';
