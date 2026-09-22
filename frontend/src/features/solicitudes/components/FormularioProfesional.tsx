import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { Input, Select, Button, FileUpload } from '@/components/ui';
import { useAuthStore } from '@/stores/auth.store';
import { solicitudesService } from '@/services/solicitudes.service';
import { tramiteService, type TipoDocumentoBackend } from '@/services/tramite.service';
import { EXPEDIDOS, DEPARTAMENTOS, BANCOS, EDUCACION } from './wizardOptions';
import styles from './FormularioProfesional.module.scss';

const schema = z
  .object({
    tipoPersona: z.enum(['NATURAL', 'JURIDICA']),
    nombreCompleto: z.string().min(2).optional(),
    ci: z.string().min(4).optional(),
    nombrerz: z.string().min(2).optional(),
    nit: z.string().min(5).optional(),
    oficina: z.string().optional(),
    legal: z.string().min(2).optional(),
    cedula: z.string().min(4).optional(),
    expedido: z.string().min(1, 'Selecciona expedido'),
    email: z.string().email('Email invalido'),
    telefono: z.string().optional(),
    ciudad: z.string().min(2, 'Ciudad requerida'),
    departamento: z.string().min(1, 'Selecciona departamento'),
    provincia: z.string().min(2, 'Provincia requerida'),
    municipio: z.string().min(2, 'Municipio requerido'),
    ncprofesional: z.string().min(2, 'Requerido'),
    ciprofesional: z.string().min(2, 'Requerido'),
    carrera: z.string().min(2, 'Requerido'),
    educacion: z.string().min(1, 'Selecciona nivel'),
    tituloProfesional: z.string().min(1, 'Adjunta titulo'),
    cedulaIdentidad: z.string().optional(),
    boletaDeposito: z.string().optional(),
    escrituraPublica: z.string().optional(),
    poderRepresentante: z.string().optional(),
    licenciaFuncionamiento: z.string().optional(),
    registroComercio: z.string().optional(),
    certificadoNit: z.string().optional(),
    numeroOperacion: z.string().min(1, 'Requerido'),
    monto: z.coerce.number().positive('Monto valido'),
    fechaDeposito: z.string().min(1, 'Requerido'),
    banco: z.string().min(1, 'Selecciona banco'),
    comprobante: z.string().min(1, 'Adjunta comprobante'),
  })
  .superRefine((data, ctx) => {
    if (data.tipoPersona === 'NATURAL') {
      if (!data.nombreCompleto)
        ctx.addIssue({ code: 'custom', path: ['nombreCompleto'], message: 'Requerido' });
      if (!data.ci) ctx.addIssue({ code: 'custom', path: ['ci'], message: 'Requerido' });
      if (!data.cedulaIdentidad)
        ctx.addIssue({ code: 'custom', path: ['cedulaIdentidad'], message: 'Adjunta carnet' });
      if (!data.boletaDeposito)
        ctx.addIssue({ code: 'custom', path: ['boletaDeposito'], message: 'Adjunta boleta' });
    } else {
      if (!data.nombrerz)
        ctx.addIssue({ code: 'custom', path: ['nombrerz'], message: 'Requerido' });
      if (!data.nit) ctx.addIssue({ code: 'custom', path: ['nit'], message: 'Requerido' });
      if (!data.legal) ctx.addIssue({ code: 'custom', path: ['legal'], message: 'Requerido' });
      if (!data.cedula) ctx.addIssue({ code: 'custom', path: ['cedula'], message: 'Requerido' });
      if (!data.escrituraPublica)
        ctx.addIssue({ code: 'custom', path: ['escrituraPublica'], message: 'Adjunta escritura' });
      if (!data.poderRepresentante)
        ctx.addIssue({ code: 'custom', path: ['poderRepresentante'], message: 'Adjunta poder' });
      if (!data.licenciaFuncionamiento)
        ctx.addIssue({
          code: 'custom',
          path: ['licenciaFuncionamiento'],
          message: 'Adjunta licencia',
        });
      if (!data.registroComercio)
        ctx.addIssue({ code: 'custom', path: ['registroComercio'], message: 'Adjunta registro' });
      if (!data.certificadoNit)
        ctx.addIssue({ code: 'custom', path: ['certificadoNit'], message: 'Adjunta cert. NIT' });
      if (!data.boletaDeposito)
        ctx.addIssue({ code: 'custom', path: ['boletaDeposito'], message: 'Adjunta boleta' });
    }
  });

type FormData = z.infer<typeof schema>;
const PASOS = ['Datos solicitante', 'Datos profesionales', 'Documentos', 'Pago'];
const STORAGE_KEY = 'sippci_wizard_profesional';

export function FormularioProfesional() {
  console.log('FormularioProfesional montado');
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [paso, setPaso] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [archivos, setArchivos] = useState<Record<string, File | null>>({});
  const esJuridica = user?.tipoPersona === 'JURIDICA';
  const nombreCompleto = user ? `${user.nombre} ${user.apellido}`.trim() : '';

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData & { tipoPersona: 'NATURAL' | 'JURIDICA' }>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: user?.email || '',
      telefono: '',
      tipoPersona: user?.tipoPersona || 'NATURAL',
      monto: user?.tipoPersona === 'JURIDICA' ? 400 : 200,
      nombreCompleto,
    },
  });

  const tipoPersona = watch('tipoPersona');

  useEffect(() => {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado) {
      try {
        reset({ ...JSON.parse(guardado), email: user?.email || '' });
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    const sub = watch((val) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
    });
    return () => sub.unsubscribe();
  }, [watch]);

  const pasoSchema = (step: number): (keyof FormData)[] => {
    if (step === 0) {
      return esJuridica
        ? [
            'nombrerz',
            'nit',
            'oficina',
            'legal',
            'cedula',
            'expedido',
            'email',
            'telefono',
            'ciudad',
            'departamento',
            'provincia',
            'municipio',
          ]
        : [
            'nombreCompleto',
            'ci',
            'expedido',
            'email',
            'telefono',
            'ciudad',
            'departamento',
            'provincia',
            'municipio',
          ];
    }
    if (step === 1)
      return ['ncprofesional', 'ciprofesional', 'carrera', 'educacion', 'tituloProfesional'];
    if (step === 2) {
      return esJuridica
        ? [
            'escrituraPublica',
            'poderRepresentante',
            'licenciaFuncionamiento',
            'registroComercio',
            'certificadoNit',
            'boletaDeposito',
          ]
        : ['cedulaIdentidad', 'boletaDeposito'];
    }
    if (step === 3) return ['numeroOperacion', 'monto', 'fechaDeposito', 'banco', 'comprobante'];
    return [];
  };

  const archivosInfo = (
    esJuridica
      ? [
          {
            campo: 'tituloProfesional',
            tipo: 'TITULO_PROFESIONAL' as TipoDocumentoBackend,
            requerido: true,
          },
          {
            campo: 'escrituraPublica',
            tipo: 'ESCRITURA_PUBLICA' as TipoDocumentoBackend,
            requerido: true,
          },
          {
            campo: 'poderRepresentante',
            tipo: 'PODER_REPRESENTANTE' as TipoDocumentoBackend,
            requerido: true,
          },
          {
            campo: 'licenciaFuncionamiento',
            tipo: 'LICENCIA_FUNCIONAMIENTO' as TipoDocumentoBackend,
            requerido: true,
          },
          {
            campo: 'registroComercio',
            tipo: 'REGISTRO_COMERCIO' as TipoDocumentoBackend,
            requerido: true,
          },
          {
            campo: 'certificadoNit',
            tipo: 'CERTIFICADO_NIT' as TipoDocumentoBackend,
            requerido: true,
          },
          {
            campo: 'boletaDeposito',
            tipo: 'BOLETA_DEPOSITO' as TipoDocumentoBackend,
            requerido: true,
          },
        ]
      : [
          {
            campo: 'tituloProfesional',
            tipo: 'TITULO_PROFESIONAL' as TipoDocumentoBackend,
            requerido: true,
          },
          { campo: 'cedulaIdentidad', tipo: 'CI' as TipoDocumentoBackend, requerido: true },
          {
            campo: 'boletaDeposito',
            tipo: 'BOLETA_DEPOSITO' as TipoDocumentoBackend,
            requerido: true,
          },
        ]
  ).concat([
    { campo: 'comprobante', tipo: 'COMPROBANTE_PAGO' as TipoDocumentoBackend, requerido: true },
  ]);

  const avanzar = async () => {
    const ok = await trigger(pasoSchema(paso));
    if (ok) setPaso((p) => p + 1);
  };

  const enviarSolicitud = handleSubmit(async (data) => {
    setEnviando(true);
    try {
      const tipo = (data.tipoPersona as string) || user?.tipoPersona || 'NATURAL';
      const sol = await solicitudesService.create({
        tipoTramite: 'REGISTRO_PROFESIONAL',
        subtipoTramite: tipo,
        datosJson: { ...data, tipoPersona: tipo },
      });
      console.log('solicitud creada', sol.codigoFormulario);
      for (const { campo, tipo: tipoDoc, requerido } of archivosInfo) {
        const file = archivos[campo as string];
        if (!file) {
          if (requerido) throw new Error(`Falta archivo requerido: ${String(campo)}`);
          continue;
        }
        const doc = await tramiteService.subirDocumento(sol.codigoFormulario, tipoDoc, file);
        console.log(`documento subido ${tipoDoc}`, doc.id);
      }
      const pago = await tramiteService.registrarPago(sol.codigoFormulario, {
        numeroOperacion: data.numeroOperacion,
        monto: data.monto,
        fechaDeposito: data.fechaDeposito,
        banco: data.banco,
      });
      console.log('pago registrado', pago.id);
      const enviada = await solicitudesService.enviar(sol.codigoFormulario);
      console.log('solicitud enviada', enviada.codigoFormulario);
      toast.success(`Solicitud ${enviada.codigoFormulario} enviada`);
      localStorage.removeItem(STORAGE_KEY);
      navigate('/mis-solicitudes');
    } catch (e) {
      console.log('error wizard profesional', e);
      toast.error('No se pudo enviar la solicitud');
    } finally {
      setEnviando(false);
    }
  });

  const setFile = (name: keyof FormData) => (file: File) => {
    setValue(name as 'ci', file.name as never);
    setArchivos((prev) => ({ ...prev, [name as string]: file }));
  };

  return (
    <div className={styles['wrap']}>
      <div className={styles['steps']}>
        {PASOS.map((p, i) => (
          <span key={p} className={`${styles['step']} ${i === paso ? styles['active'] : ''}`}>
            {i + 1}. {p}
          </span>
        ))}
      </div>
      <div className={styles['badge']}>
        {tipoPersona === 'JURIDICA' ? 'Persona Juridica' : 'Persona Natural'}
      </div>
      <form onSubmit={enviarSolicitud} style={{ display: 'grid', gap: 14 }}>
        {paso === 0 && (
          <>
            {esJuridica ? (
              <>
                <Input
                  label="Razon social"
                  error={errors.nombrerz?.message}
                  {...register('nombrerz')}
                />
                <Input label="NIT" error={errors.nit?.message} {...register('nit')} />
                <Input label="Oficina" error={errors.oficina?.message} {...register('oficina')} />
                <Input
                  label="Representante legal"
                  error={errors.legal?.message}
                  {...register('legal')}
                />
                <Input
                  label="CI del representante"
                  error={errors.cedula?.message}
                  {...register('cedula')}
                />
              </>
            ) : (
              <>
                <Input
                  label="Nombre completo"
                  error={errors.nombreCompleto?.message}
                  {...register('nombreCompleto')}
                />
                <Input label="CI" error={errors.ci?.message} {...register('ci')} />
              </>
            )}
            <Select
              label="Expedido"
              options={EXPEDIDOS}
              error={errors.expedido?.message}
              {...register('expedido')}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Input
                label="Email"
                type="email"
                error={errors.email?.message}
                {...register('email')}
              />
              <Input label="Telefono" error={errors.telefono?.message} {...register('telefono')} />
            </div>
            <Input label="Ciudad" error={errors.ciudad?.message} {...register('ciudad')} />
            <Select
              label="Departamento"
              options={DEPARTAMENTOS}
              error={errors.departamento?.message}
              {...register('departamento')}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Input
                label="Provincia"
                error={errors.provincia?.message}
                {...register('provincia')}
              />
              <Input
                label="Municipio"
                error={errors.municipio?.message}
                {...register('municipio')}
              />
            </div>
          </>
        )}
        {paso === 1 && (
          <>
            <Input
              label="Nro de colegiatura"
              error={errors.ncprofesional?.message}
              {...register('ncprofesional')}
            />
            <Input
              label="CI profesional"
              error={errors.ciprofesional?.message}
              {...register('ciprofesional')}
            />
            <Input label="Carrera" error={errors.carrera?.message} {...register('carrera')} />
            <Select
              label="Nivel de educacion"
              options={EDUCACION}
              error={errors.educacion?.message}
              {...register('educacion')}
            />
            <FileUpload
              label="Titulo profesional"
              accept=".pdf"
              onFileSelect={setFile('tituloProfesional')}
            />
            {errors.tituloProfesional && (
              <span className={styles['error']}>{errors.tituloProfesional.message}</span>
            )}
          </>
        )}
        {paso === 2 && (
          <>
            {esJuridica ? (
              <>
                <FileUpload
                  label="Escritura publica"
                  accept=".pdf"
                  onFileSelect={setFile('escrituraPublica')}
                />
                {errors.escrituraPublica && (
                  <span className={styles['error']}>{errors.escrituraPublica.message}</span>
                )}
                <FileUpload
                  label="Poder del representante"
                  accept=".pdf"
                  onFileSelect={setFile('poderRepresentante')}
                />
                {errors.poderRepresentante && (
                  <span className={styles['error']}>{errors.poderRepresentante.message}</span>
                )}
                <FileUpload
                  label="Licencia de funcionamiento"
                  accept=".pdf"
                  onFileSelect={setFile('licenciaFuncionamiento')}
                />
                {errors.licenciaFuncionamiento && (
                  <span className={styles['error']}>{errors.licenciaFuncionamiento.message}</span>
                )}
                <FileUpload
                  label="Registro de comercio"
                  accept=".pdf"
                  onFileSelect={setFile('registroComercio')}
                />
                {errors.registroComercio && (
                  <span className={styles['error']}>{errors.registroComercio.message}</span>
                )}
                <FileUpload
                  label="Certificado NIT"
                  accept=".pdf"
                  onFileSelect={setFile('certificadoNit')}
                />
                {errors.certificadoNit && (
                  <span className={styles['error']}>{errors.certificadoNit.message}</span>
                )}
                <FileUpload
                  label="Boleta de deposito"
                  accept=".pdf"
                  onFileSelect={setFile('boletaDeposito')}
                />
                {errors.boletaDeposito && (
                  <span className={styles['error']}>{errors.boletaDeposito.message}</span>
                )}
              </>
            ) : (
              <>
                <FileUpload
                  label="Cedula de identidad"
                  accept=".pdf"
                  onFileSelect={setFile('cedulaIdentidad')}
                />
                {errors.cedulaIdentidad && (
                  <span className={styles['error']}>{errors.cedulaIdentidad.message}</span>
                )}
                <FileUpload
                  label="Boleta de deposito"
                  accept=".pdf"
                  onFileSelect={setFile('boletaDeposito')}
                />
                {errors.boletaDeposito && (
                  <span className={styles['error']}>{errors.boletaDeposito.message}</span>
                )}
              </>
            )}
          </>
        )}
        {paso === 3 && (
          <>
            <Input
              label="Numero de operacion"
              error={errors.numeroOperacion?.message}
              {...register('numeroOperacion')}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Input
                label="Monto (Bs)"
                type="number"
                error={errors.monto?.message}
                {...register('monto')}
              />
              <Input
                label="Fecha deposito"
                type="date"
                error={errors.fechaDeposito?.message}
                {...register('fechaDeposito')}
              />
            </div>
            <Select
              label="Banco"
              options={BANCOS}
              error={errors.banco?.message}
              {...register('banco')}
            />
            <FileUpload
              label="Comprobante"
              accept=".pdf,.jpg,.png"
              onFileSelect={setFile('comprobante')}
            />
            {errors.comprobante && (
              <span className={styles['error']}>{errors.comprobante.message}</span>
            )}
          </>
        )}
        <div className={styles['nav']}>
          {paso > 0 && (
            <Button type="button" variant="ghost" onClick={() => setPaso(paso - 1)}>
              Anterior
            </Button>
          )}
          {paso < 3 && (
            <Button type="button" variant="primary" onClick={avanzar}>
              Siguiente
            </Button>
          )}
          {paso === 3 && (
            <Button type="submit" variant="secondary" loading={enviando}>
              Enviar
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
