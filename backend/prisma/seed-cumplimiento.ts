import { PrismaClient, TipoTramite, SubtipoTramite, EstadoSolicitud, TipoPersona } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed Cumplimiento — iniciando...');

  // 1. Usuario ciudadano (puede ser el mismo del seed profesionales)
  const ciudadano = await prisma.usuarios.upsert({
    where: { email: 'ciudadano.cumplimiento@sippci.gob.bo' },
    update: {},
    create: {
      email: 'ciudadano.cumplimiento@sippci.gob.bo',
      nombre: 'Pedro',
      apellido: 'Gómez Rojas',
      passwordHash: 'dummy-hash',
      tipo: TipoPersona.NATURAL,
      telefono: '77888888',
      estado: 'ACTIVO',
      emailVerified: true,
    },
  });
  console.log('✅ Ciudadano:', ciudadano.email);

  // 2. Empresa de prueba
  const empresa = await prisma.empresas.upsert({
    where: { nit: '9876543210' },
    update: {},
    create: {
      razonSocial: 'Comercial La Paz S.R.L.',
      nit: '9876543210',
      representanteLegal: 'Ana Quispe',
      email: 'contacto@comerciallapaz.com',
    },
  });
  console.log('✅ Empresa:', empresa.razonSocial);

  // 3. Solicitudes Natural
  const solicitudesNatural = [
    {
      codigoFormulario: 'SIPPCI-NAT-2026-001',
      estado: 'ENVIADA' as EstadoSolicitud,
      datosJson: {
        nombreCompleto: 'Pedro Gómez Rojas',
        ci: '7788888',
        telefono: '77888888',
        email: 'ciudadano.cumplimiento@sippci.gob.bo',
        nombreEstablecimiento: 'Taller Mecánico El Rápido',
        direccion: 'Av. 6 de Agosto #123',
        zona: 'Sopocachi',
        ciudad: 'La Paz',
        actividadEconomica: 'Taller mecánico automotriz',
        superficieM2: 120,
        nivelRiesgo: 'MEDIO',
        sistemasContraIncendios: ['Extintores', 'Luces de emergencia'],
      },
    },
    {
      codigoFormulario: 'SIPPCI-NAT-2026-002',
      estado: 'EN_REVISION' as EstadoSolicitud,
      datosJson: {
        nombreCompleto: 'Pedro Gómez Rojas',
        ci: '7788888',
        telefono: '77888888',
        nombreEstablecimiento: 'Panadería Doña Rosa',
        direccion: 'Calle Comercio #45',
        zona: 'Centro',
        ciudad: 'La Paz',
        actividadEconomica: 'Panadería y pastelería',
        superficieM2: 80,
        nivelRiesgo: 'ALTO',
        sistemasContraIncendios: ['Extintores', 'Detectores de humo'],
      },
    },
    {
      codigoFormulario: 'SIPPCI-NAT-2026-003',
      estado: 'APROBADA' as EstadoSolicitud,
      datosJson: {
        nombreCompleto: 'Pedro Gómez Rojas',
        ci: '7788888',
        telefono: '77888888',
        nombreEstablecimiento: 'Librería Central',
        direccion: 'Av. Arce #789',
        zona: 'San Jorge',
        ciudad: 'La Paz',
        actividadEconomica: 'Venta de libros y papelería',
        superficieM2: 60,
        nivelRiesgo: 'BAJO',
        sistemasContraIncendios: ['Extintores'],
      },
    },
  ];

  for (const sol of solicitudesNatural) {
    await prisma.solicitudes.upsert({
      where: { codigoFormulario: sol.codigoFormulario },
      update: {},
      create: {
        codigoFormulario: sol.codigoFormulario,
        tipoTramite: TipoTramite.CERTIFICACION_SIPPCI,
        subtipoTramite: SubtipoTramite.NATURAL,
        estado: sol.estado,
        datosJson: sol.datosJson,
        usuarioId: ciudadano.id,
      },
    });
    console.log('✅ Solicitud Natural:', sol.codigoFormulario, `(${sol.estado})`);
  }

  // 4. Solicitudes Jurídica
  const solicitudesJuridica = [
    {
      codigoFormulario: 'SIPPCI-JUR-2026-001',
      estado: 'ENVIADA' as EstadoSolicitud,
      datosJson: {
        razonSocial: 'Comercial La Paz S.R.L.',
        nit: '9876543210',
        representanteLegal: 'Ana Quispe',
        telefono: '2222222',
        email: 'contacto@comerciallapaz.com',
        nombreEstablecimiento: 'Supermercado Central',
        direccion: 'Av. Camacho #456',
        zona: 'Centro',
        ciudad: 'La Paz',
        actividadEconomica: 'Supermercado',
        superficieM2: 350,
        nivelRiesgo: 'ALTO',
        sistemasContraIncendios: ['Extintores', 'Rociadores', 'Detectores'],
      },
    },
    {
      codigoFormulario: 'SIPPCI-JUR-2026-002',
      estado: 'APROBADA' as EstadoSolicitud,
      datosJson: {
        razonSocial: 'Comercial La Paz S.R.L.',
        nit: '9876543210',
        representanteLegal: 'Ana Quispe',
        nombreEstablecimiento: 'Farmacia San José',
        direccion: 'Calle Bolívar #789',
        zona: 'Centro',
        ciudad: 'La Paz',
        actividadEconomica: 'Farmacia',
        superficieM2: 90,
        nivelRiesgo: 'MEDIO',
        sistemasContraIncendios: ['Extintores'],
      },
    },
  ];

  for (const sol of solicitudesJuridica) {
    await prisma.solicitudes.upsert({
      where: { codigoFormulario: sol.codigoFormulario },
      update: {},
      create: {
        codigoFormulario: sol.codigoFormulario,
        tipoTramite: TipoTramite.CERTIFICACION_SIPPCI,
        subtipoTramite: SubtipoTramite.JURIDICA,
        estado: sol.estado,
        datosJson: sol.datosJson,
        usuarioId: ciudadano.id,
        empresaId: empresa.id,
      },
    });
    console.log('✅ Solicitud Jurídica:', sol.codigoFormulario, `(${sol.estado})`);
  }

  // 5. Crear 1 certificado de prueba para SIPPCI-NAT-2026-003 (APROBADA)
  const solicitudAprobada = await prisma.solicitudes.findFirst({
    where: { codigoFormulario: 'SIPPCI-NAT-2026-003' },
  });

  if (solicitudAprobada) {
    const fechaEmision = new Date();
    const fechaVigencia = new Date(fechaEmision);
    fechaVigencia.setFullYear(fechaVigencia.getFullYear() + 2);

    await prisma.certificados.upsert({
      where: { codigoCertificado: 'CERT-SIPPCI-2026-0001' },
      update: {},
      create: {
        solicitudId: solicitudAprobada.id,
        tipo: 'SIPPCI' as any,
        codigoCertificado: 'CERT-SIPPCI-2026-0001',
        emitidoPorId: 5, // ID de usuario interno admin (ajustar si es necesario)
        fechaEmision,
        fechaVigencia,
        activo: true,
      },
    });
    console.log('✅ Certificado:', 'CERT-SIPPCI-2026-0001');

    // Actualizar estado de la solicitud
    await prisma.solicitudes.update({
      where: { id: solicitudAprobada.id },
      data: { estado: 'CERTIFICADO_EMITIDO', fechaVigencia },
    });
  }

  console.log('\n🎉 Seed Cumplimiento completado');
  console.log('\n📋 Datos de prueba:');
  console.log('  • 3 solicitudes Natural (ENVIADA, EN_REVISION, APROBADA)');
  console.log('  • 2 solicitudes Jurídica (ENVIADA, APROBADA)');
  console.log('  • 1 ciudadano: ciudadano.cumplimiento@sippci.gob.bo');
  console.log('  • 1 empresa: Comercial La Paz S.R.L. (NIT 9876543210)');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
