-- AlterTable
ALTER TABLE "solicitudes" ADD COLUMN     "esRenovacion" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "solicitudAnteriorId" INTEGER;

-- AddForeignKey
ALTER TABLE "solicitudes" ADD CONSTRAINT "solicitudes_solicitudAnteriorId_fkey" FOREIGN KEY ("solicitudAnteriorId") REFERENCES "solicitudes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
