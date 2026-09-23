-- CreateEnum
CREATE TYPE "RolInterno_new" AS ENUM ('ADMIN', 'GESTOR_CUMPLIMIENTO', 'GESTOR_CAPACITACIONES', 'GESTOR_REGISTRO_PROFESIONAL', 'CAJERO');

-- AlterTable: remove default before type change
ALTER TABLE "usuarios_internos" ALTER COLUMN "rol" DROP DEFAULT;

-- AlterEnum with data migration: map old values to new
ALTER TABLE "usuarios_internos" ALTER COLUMN "rol" TYPE "RolInterno_new" USING (
  CASE "rol"::text
    WHEN 'ADMINISTRADOR' THEN 'ADMIN'::text::"RolInterno_new"
    WHEN 'OFICIAL' THEN 'GESTOR_CUMPLIMIENTO'::text::"RolInterno_new"
    WHEN 'CAJERO' THEN 'CAJERO'::text::"RolInterno_new"
    ELSE "rol"::text::"RolInterno_new"
  END
);

-- Drop old enum and rename new
ALTER TYPE "RolInterno" RENAME TO "RolInterno_old";
ALTER TYPE "RolInterno_new" RENAME TO "RolInterno";
DROP TYPE "RolInterno_old";
