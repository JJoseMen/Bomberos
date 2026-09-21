const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cursos = [
    { nombre: 'EXTINTORES', descripcion: 'Uso de extintores contra incendios', duracionHoras: 8, costoBsf: 150.00 },
    { nombre: 'PRIMEROS_AUXILIOS', descripcion: 'Primeros auxilios y RCP', duracionHoras: 12, costoBsf: 200.00 },
    { nombre: 'EMERGENCIAS', descripcion: 'Manejo de emergencias y evacuacion', duracionHoras: 10, costoBsf: 180.00 },
    { nombre: 'RCP', descripcion: 'Reanimacion cardiopulmonar avanzada', duracionHoras: 6, costoBsf: 120.00 },
  ];
  for (const c of cursos) {
    await prisma.cursos.upsert({ where: { id: Object.values(c)[0].length }, update: {}, create: c });
  }
  console.log('Cursos seed completado');
}
main().catch(console.error).finally(() => prisma.$disconnect());
