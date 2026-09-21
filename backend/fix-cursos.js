const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.cursos.deleteMany({});
  console.log('Cursos eliminados');

  const cursos = [
    { nombre: 'EXTINTORES', descripcion: 'Uso de extintores contra incendios', modalidad: 'PRESENCIAL', duracionHoras: 20, costoBsf: 20.00 },
    { nombre: 'PRIMEROS_AUXILIOS', descripcion: 'Primeros auxilios y RCP', modalidad: 'PRESENCIAL', duracionHoras: 20, costoBsf: 20.00 },
    { nombre: 'EVACUACION', descripcion: 'Evacuacion y manejo de emergencias', modalidad: 'PRESENCIAL', duracionHoras: 20, costoBsf: 20.00 },
    { nombre: 'TRABAJOS_EN_ALTURA', descripcion: 'Trabajos en altura y seguridad', modalidad: 'PRESENCIAL', duracionHoras: 50, costoBsf: 50.00 },
  ];

  for (const c of cursos) {
    await prisma.cursos.create({ data: c });
  }
  console.log('Cursos creados:');
  const all = await prisma.cursos.findMany();
  all.forEach(c => console.log(`  ${c.nombre} - UFV: ${c.costoBsf} - Horas: ${c.duracionHoras}`));
}
main().catch(console.error).finally(() => prisma.$disconnect());
