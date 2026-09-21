import { PrismaClient, RolInterno, TipoPersona, EstadoUsuario, EstadoSolicitud } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPasswordHash = await bcrypt.hash('Admin123!', 10);
  const userPasswordHash = await bcrypt.hash('User123!', 10);

  const admin = await prisma.usuarios_internos.upsert({
    where: { ci: '12345678' },
    update: {},
    create: {
      ci: '12345678',
      nombre: 'Admin',
      apellido: 'SIPPCI',
      grado: 'Tcn. 1',
      rol: RolInterno.ADMINISTRADOR,
      unidad: 'Direccion Nacional de Bomberos',
      email: 'admin@sippci.gob.bo',
      passwordHash: adminPasswordHash,
      activo: true,
    },
  });

  const oficial = await prisma.usuarios_internos.upsert({
    where: { ci: '87654321' },
    update: {},
    create: {
      ci: '87654321',
      nombre: 'Oficial',
      apellido: 'Demo',
      grado: 'Sub.Tte.',
      rol: RolInterno.OFICIAL,
      unidad: 'Seccion de Aplicaciones',
      email: 'oficial@sippci.gob.bo',
      passwordHash: userPasswordHash,
      activo: true,
    },
  });

  const cajero = await prisma.usuarios_internos.upsert({
    where: { ci: '11223344' },
    update: {},
    create: {
      ci: '11223344',
      nombre: 'Cajero',
      apellido: 'Demo',
      grado: 'Bom. 1',
      rol: RolInterno.CAJERO,
      unidad: 'Caja Central',
      email: 'cajero@sippci.gob.bo',
      passwordHash: userPasswordHash,
      activo: true,
    },
  });

  console.log('Internal users:', { admin: admin.email, oficial: oficial.email, cajero: cajero.email });

  const empresa = await prisma.empresas.upsert({
    where: { nit: '1234567890' },
    update: {},
    create: {
      razonSocial: 'Boliviana de Seguridad S.A.',
      nit: '1234567890',
      direccion: 'Av. Principal #1234, Zona Central',
      telefono: '2-123456',
      email: 'info@bolseg.gob.bo',
      representanteLegal: 'Juan Perez Lopez',
    },
  });

  const externalUser = await prisma.usuarios.upsert({
    where: { email: 'demo@usuario.com' },
    update: {},
    create: {
      nombre: 'Maria',
      apellido: 'Garcia',
      email: 'demo@usuario.com',
      telefono: '71234567',
      passwordHash: userPasswordHash,
      tipo: TipoPersona.NATURAL,
      estado: EstadoUsuario.ACTIVO,
      emailVerified: true,
    },
  });

  console.log('External user:', externalUser.email);

  const empresaLink = await prisma.usuarios_empresas.upsert({
    where: {
      usuarioId_empresaId: { usuarioId: externalUser.id, empresaId: empresa.id },
    },
    update: {},
    create: {
      usuarioId: externalUser.id,
      empresaId: empresa.id,
      rol: 'REPRESENTANTE',
    },
  });

  console.log('Empresa linked:', empresaLink.id);

  const cursos = [
    { nombre: 'EXTINTORES', descripcion: 'Uso de extintores contra incendios', modalidad: 'PRESENCIAL', duracionHoras: 20, costoBsf: 20.00 },
    { nombre: 'PRIMEROS_AUXILIOS', descripcion: 'Primeros auxilios y RCP', modalidad: 'PRESENCIAL', duracionHoras: 20, costoBsf: 20.00 },
    { nombre: 'EVACUACION', descripcion: 'Evacuacion y manejo de emergencias', modalidad: 'PRESENCIAL', duracionHoras: 20, costoBsf: 20.00 },
    { nombre: 'TRABAJOS_EN_ALTURA', descripcion: 'Trabajos en altura y seguridad', modalidad: 'PRESENCIAL', duracionHoras: 50, costoBsf: 50.00 },
  ];

  for (const curso of cursos) {
    await prisma.cursos.upsert({
      where: { id: cursos.indexOf(curso) + 1 },
      update: {},
      create: curso,
    });
  }
  console.log('Cursos seed:', cursos.map(c => c.nombre));

  const solicitud = await prisma.solicitudes.upsert({
    where: { codigoFormulario: 'SIPPCI-2026-0001' },
    update: {},
    create: {
      codigoFormulario: 'SIPPCI-2026-0001',
      tipoTramite: 'CERTIFICACION_SIPPCI',
      subtipoTramite: 'INFRAESTRUCTURA',
      estado: EstadoSolicitud.ENVIADA,
      usuarioId: externalUser.id,
      empresaId: empresa.id,
      datosJson: {
        descripcion: 'Solicitud de certificacion SIPPCI para local comercial',
        direccionLocal: 'Av. Comercial #5678',
        tipoLocal: 'Comercial',
      },
    },
  });

  console.log('Solicitud created:', solicitud.codigoFormulario);

  const auditoria = await prisma.auditoria_general.create({
    data: {
      usuarioInternoId: admin.id,
      accion: 'SEED',
      entidad: 'sistema',
      detalle: { message: 'Base de datos sembrada correctamente' },
    },
  });

  console.log('Audit log:', auditoria.id);
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
