import { PrismaClient, RolInterno, TipoPersona, EstadoUsuario, EstadoSolicitud } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPasswordHash = await bcrypt.hash('Bomberos2026*', 10);
  const userPasswordHash = await bcrypt.hash('User123!', 10);

  const internoPasswordHash = adminPasswordHash;

  // Limpiar legacy que colisiona por email antes de upsert
  await prisma.usuarios_internos.deleteMany({
    where: { ci: { in: ['12345678', '87654321', '11223344'] } },
  });

  const admin = await prisma.usuarios_internos.upsert({
    where: { ci: '7711111' },
    update: {
      nombre: 'Admin',
      apellido: 'Sistema',
      grado: 'Tcn. 1',
      rol: RolInterno.ADMIN,
      unidad: 'Comando Nacional',
      email: 'admin@sippci.gob.bo',
      passwordHash: internoPasswordHash,
      activo: true,
    },
    create: {
      ci: '7711111',
      nombre: 'Admin',
      apellido: 'Sistema',
      grado: 'Tcn. 1',
      rol: RolInterno.ADMIN,
      unidad: 'Comando Nacional',
      email: 'admin@sippci.gob.bo',
      passwordHash: internoPasswordHash,
      activo: true,
    },
  });

  const gestorCumplimiento = await prisma.usuarios_internos.upsert({
    where: { ci: '9905200' },
    update: {
      nombre: 'Gestor',
      apellido: 'Cumplimiento',
      grado: 'Tcn. 1',
      rol: RolInterno.GESTOR_CUMPLIMIENTO,
      unidad: 'Comando Nacional',
      email: 'cumplimiento@sippci.gob.bo',
      passwordHash: internoPasswordHash,
      activo: true,
    },
    create: {
      ci: '9905200',
      nombre: 'Gestor',
      apellido: 'Cumplimiento',
      grado: 'Tcn. 1',
      rol: RolInterno.GESTOR_CUMPLIMIENTO,
      unidad: 'Comando Nacional',
      email: 'cumplimiento@sippci.gob.bo',
      passwordHash: internoPasswordHash,
      activo: true,
    },
  });

  const gestorCapacitaciones = await prisma.usuarios_internos.upsert({
    where: { ci: '6622222' },
    update: {
      nombre: 'Gestor',
      apellido: 'Capacitaciones',
      grado: 'Tcn. 1',
      rol: RolInterno.GESTOR_CAPACITACIONES,
      unidad: 'Comando Nacional',
      email: 'capacitaciones@sippci.gob.bo',
      passwordHash: internoPasswordHash,
      activo: true,
    },
    create: {
      ci: '6622222',
      nombre: 'Gestor',
      apellido: 'Capacitaciones',
      grado: 'Tcn. 1',
      rol: RolInterno.GESTOR_CAPACITACIONES,
      unidad: 'Comando Nacional',
      email: 'capacitaciones@sippci.gob.bo',
      passwordHash: internoPasswordHash,
      activo: true,
    },
  });

  const gestorRegistro = await prisma.usuarios_internos.upsert({
    where: { ci: '8812345' },
    update: {
      nombre: 'Gestor',
      apellido: 'Registro',
      grado: 'Tcn. 1',
      rol: RolInterno.GESTOR_REGISTRO_PROFESIONAL,
      unidad: 'Comando Nacional',
      email: 'registro@sippci.gob.bo',
      passwordHash: internoPasswordHash,
      activo: true,
    },
    create: {
      ci: '8812345',
      nombre: 'Gestor',
      apellido: 'Registro',
      grado: 'Tcn. 1',
      rol: RolInterno.GESTOR_REGISTRO_PROFESIONAL,
      unidad: 'Comando Nacional',
      email: 'registro@sippci.gob.bo',
      passwordHash: internoPasswordHash,
      activo: true,
    },
  });

  const cajero = await prisma.usuarios_internos.upsert({
    where: { ci: '5555555' },
    update: {
      nombre: 'Cajero',
      apellido: 'Sistema',
      grado: 'Tcn. 1',
      rol: RolInterno.CAJERO,
      unidad: 'Comando Nacional',
      email: 'cajero@sippci.gob.bo',
      passwordHash: internoPasswordHash,
      activo: true,
    },
    create: {
      ci: '5555555',
      nombre: 'Cajero',
      apellido: 'Sistema',
      grado: 'Tcn. 1',
      rol: RolInterno.CAJERO,
      unidad: 'Comando Nacional',
      email: 'cajero@sippci.gob.bo',
      passwordHash: internoPasswordHash,
      activo: true,
    },
  });

  console.log('Internal users:', {
    admin: admin.email,
    cumplimiento: gestorCumplimiento.email,
    capacitaciones: gestorCapacitaciones.email,
    registro: gestorRegistro.email,
    cajero: cajero.email,
  });

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
