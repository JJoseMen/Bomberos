/**
 * 🌱 Seed Profesionales — datos de prueba
 *
 * NO ejecutar como parte del seed principal. Correr manualmente:
 *   npx ts-node prisma/seed-profesionales.ts
 *
 * Verificación schema.prisma:
 * - usuarios: nombre, apellido, email, passwordHash, tipo (TipoPersona), telefono
 *   → usa `tipo` no `tipoPersona`, y separado nombre/apellido
 * - empresas: razonSocial, nit, representanteLegal, email
 * - solicitudes: usuarioId (requerido) + empresaId (opcional) + tipoTramite/subtipoTramite/estado/datosJson
 *   → JURIDICA también requiere usuarioId (representante)
 * - Enums: TipoTramite, SubtipoTramite, EstadoSolicitud, TipoPersona (NATURAL)
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed Profesionales — iniciando...');

  // 1. Usuario ciudadano de prueba
  const ciudadano = await prisma.usuarios.upsert({
    where: { email: 'ciudadano.test@sippci.gob.bo' },
    update: {},
    create: {
      email: 'ciudadano.test@sippci.gob.bo',
      nombre: 'Juan',
      apellido: 'Pérez Mamani',
      passwordHash: '$2b$10$dummyhashdummyhashdummyhashdummyha',
      tipo: 'NATURAL',
      telefono: '77777777',
      estado: 'ACTIVO',
      emailVerified: true,
    },
  });
  console.log('✅ Ciudadano:', ciudadano.email);

  // 2. Empresa de prueba
  const empresa = await prisma.empresas.upsert({
    where: { nit: '1234567890' },
    update: {},
    create: {
      razonSocial: 'Equipetrol S.A.',
      nit: '1234567890',
      representanteLegal: 'Carlos Rojas',
      email: 'contacto@equipetrol.com',
    },
  });
  console.log('✅ Empresa:', empresa.razonSocial);

  // 3. Solicitudes Natural en distintos estados
  const solicitudesNatural = [
    {
      codigoFormulario: 'SOL-NAT-2026-001',
      estado: 'ENVIADA' as const,
      datosJson: {
        nombreCompleto: 'Juan Pérez Mamani',
        ci: '12345678',
        profesion: 'Ingeniero en Seguridad',
        matricula: 'MAT-001',
        especialidad: 'Prevención de Incendios',
        aniosExperiencia: 5,
        institucionTitulo: 'UMSA',
      },
    },
    {
      codigoFormulario: 'SOL-NAT-2026-002',
      estado: 'EN_REVISION' as const,
      datosJson: {
        nombreCompleto: 'Ana Flores Choque',
        ci: '87654321',
        profesion: 'Técnico en Bomberos',
        matricula: 'MAT-002',
        especialidad: 'Rescate',
        aniosExperiencia: 8,
        institucionTitulo: 'ITB',
      },
    },
    {
      codigoFormulario: 'SOL-NAT-2026-003',
      estado: 'APROBADA' as const,
      datosJson: {
        nombreCompleto: 'Luis García López',
        ci: '11223344',
        profesion: 'Ingeniero Civil',
        matricula: 'MAT-003',
        especialidad: 'Estructuras',
        aniosExperiencia: 10,
        institucionTitulo: 'UCB',
      },
    },
  ];

  for (const sol of solicitudesNatural) {
    await prisma.solicitudes.upsert({
      where: { codigoFormulario: sol.codigoFormulario },
      update: {},
      create: {
        codigoFormulario: sol.codigoFormulario,
        tipoTramite: 'REGISTRO_PROFESIONAL',
        subtipoTramite: 'NATURAL',
        estado: sol.estado as any,
        datosJson: sol.datosJson as any,
        usuarioId: ciudadano.id,
      },
    });
    console.log('✅ Solicitud Natural:', sol.codigoFormulario, `(${sol.estado})`);
  }

  // 4. Solicitudes Jurídica (requieren usuarioId + empresaId)
  const solicitudesJuridica = [
    {
      codigoFormulario: 'SOL-JUR-2026-001',
      estado: 'ENVIADA' as const,
      datosJson: {
        razonSocial: 'Equipetrol S.A.',
        nit: '1234567890',
        representanteLegal: 'Carlos Rojas',
        tipoEmpresa: 'S.R.L.',
        actividadEconomica: 'Venta de equipos contra incendios',
        numeroProfesionales: 15,
        direccionComercial: 'Av. Cristo Redentor #123',
      },
    },
    {
      codigoFormulario: 'SOL-JUR-2026-002',
      estado: 'APROBADA' as const,
      datosJson: {
        razonSocial: 'Seguridad Total S.A.',
        nit: '0987654321',
        representanteLegal: 'María López',
        tipoEmpresa: 'S.A.',
        actividadEconomica: 'Consultoría en seguridad',
        numeroProfesionales: 30,
        direccionComercial: 'Calle 21 de Calacoto #456',
      },
    },
  ];

  for (const sol of solicitudesJuridica) {
    // Para la segunda, crea empresa si no existe (nit distinto)
    let empresaId = empresa.id;
    if (sol.datosJson.nit !== empresa.nit) {
      const emp2 = await prisma.empresas.upsert({
        where: { nit: sol.datosJson.nit as string },
        update: {},
        create: {
          razonSocial: sol.datosJson.razonSocial as string,
          nit: sol.datosJson.nit as string,
          representanteLegal: sol.datosJson.representanteLegal as string,
          email: `contacto-${sol.datosJson.nit}@test.bo`,
        },
      });
      empresaId = emp2.id;
    }
    await prisma.solicitudes.upsert({
      where: { codigoFormulario: sol.codigoFormulario },
      update: {},
      create: {
        codigoFormulario: sol.codigoFormulario,
        tipoTramite: 'REGISTRO_PROFESIONAL',
        subtipoTramite: 'JURIDICA',
        estado: sol.estado as any,
        datosJson: sol.datosJson as any,
        usuarioId: ciudadano.id,
        empresaId,
      },
    });
    console.log('✅ Solicitud Jurídica:', sol.codigoFormulario, `(${sol.estado})`);
  }

  console.log('\n🎉 Seed Profesionales completado');
  console.log('\n📋 Datos de prueba:');
  console.log('  • 3 solicitudes Natural (ENVIADA, EN_REVISION, APROBADA)');
  console.log('  • 2 solicitudes Jurídica (ENVIADA, APROBADA)');
  console.log('  • 1 ciudadano: ciudadano.test@sippci.gob.bo');
  console.log('  • 1 empresa: Equipetrol S.A. (NIT 1234567890) + Seguridad Total S.A.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
