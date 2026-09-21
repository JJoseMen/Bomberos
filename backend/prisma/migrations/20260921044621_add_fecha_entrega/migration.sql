-- AlterTable
ALTER TABLE "certificados" ADD COLUMN     "entregadoPorId" INTEGER,
ADD COLUMN     "fechaEntrega" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "certificados" ADD CONSTRAINT "certificados_entregadoPorId_fkey" FOREIGN KEY ("entregadoPorId") REFERENCES "usuarios_internos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
