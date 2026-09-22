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
import { formatMoney } from '@/lib/format';
import { CURSOS_CAPACITACION, EXPEDIDOS, BANCOS } from './wizardOptions';
import styles from './FormularioCapacitacion.module.scss';

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
    cursos: z.array(z.string()).min(1, 'Selecciona al menos un curso'),
    cantidadParticipantes: z.coerce.number().positive('Cantidad valida').int('Entero'),
    archivoExcel: z.string().optional(),
    numeroOperacion: z.string().min(1, 'Requerido'),
    fechaDeposito: z.string().min(1, 'Requerido'),
    banco: z.string().min(1, 'Selecciona banco'),
    comprobante: z.string().min(1, 'Adjunta comprobante'),
  })
  .superRefine((data, ctx) => {
    if (data.tipoPersona === 'JURIDICA') {
      if (!data.nombrerz)
        ctx.addIssue({ code: 'custom', path: ['nombrerz'], message: 'Requerido' });
      if (!data.legal) ctx.addIssue({ code: 'custom', path: ['legal'], message: 'Requerido' });
      if (!data.cedula) ctx.addIssue({ code: 'custom', path: ['cedula'], message: 'Requerido' });
      if (!data.archivoExcel)
        ctx.addIssue({ code: 'custom', path: ['archivoExcel'], message: 'Adjunta lista Excel' });
    } else if (!data.nombreCompleto) {
      ctx.addIssue({ code: 'custom', path: ['nombreCompleto'], message: 'Requerido' });
    }
  });

type FormData = z.infer<typeof schema>;
const PASOS = ['Solicitante', 'Cursos', 'Participantes', 'Pago'];
const STORAGE_KEY = 'sippci_wizard_capacitacion';

export function FormularioCapacitacion() {
  console.log('FormularioCapacitacion montado');
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [paso, setPaso] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [archivos, setArchivos] = useState<Record<string, File | null>>({});
  const esJuridica = user?.tipoPersona === 'JURIDICA';
  const nombreCompleto = user ? `${user.nombre} ${user.apellido}`.trim() : '';
  const archivosInfo = (
    esJuridica
      ? [{ campo: 'archivoExcel', tipo: 'PLANILLA_EXCEL' as TipoDocumentoBackend, requerido: true }]
      : []
  ).concat([
    { campo: 'comprobante', tipo: 'COMPROBANTE_PAGO' as TipoDocumentoBackend, requerido: true },
  ]);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      tipoPersona: user?.tipoPersona || 'NATURAL',
      email: user?.email || '',
      telefono: '',
      nombreCompleto,
      cursos: [],
      cantidadParticipantes: 1,
    },
  });

  const cursosWatch = watch('cursos');
  const cantidadWatch = watch('cantidadParticipantes');
  const montoTotal =
    CURSOS_CAPACITACION.filter((c) => cursosWatch?.includes(c.value)).reduce(
      (acc, c) => acc + c.costo,
      0,
    ) * (Number(cantidadWatch) || 1);

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
        ? ['nombrerz', 'nit', 'oficina', 'legal', 'cedula', 'expedido', 'email', 'telefono']
        : ['nombreCompleto', 'ci', 'expedido', 'email', 'telefono'];
    }
    if (step === 1) return ['cursos', 'cantidadParticipantes'];
    if (step === 2) return esJuridica ? ['archivoExcel'] : ['ci', 'email'];
    return ['numeroOperacion', 'fechaDeposito', 'banco', 'comprobante'];
  };

  const avanzar = async () => {
    const ok = await trigger(pasoSchema(paso));
    if (ok) setPaso((p) => p + 1);
  };

  const enviarSolicitud = handleSubmit(async (data) => {
    setEnviando(true);
    try {
      const dataFinal = {
        ...data,
        monto: montoTotal,
        cantidadParticipantes: Number(data.cantidadParticipantes),
      };
      const sol = await solicitudesService.create({
        tipoTramite: 'CAPACITACION',
        subtipoTramite: data.tipoPersona ?? user?.tipoPersona ?? 'NATURAL',
        datosJson: {
          ...dataFinal,
          tipoPersona: data.tipoPersona ?? user?.tipoPersona ?? 'NATURAL',
        },
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
        monto: montoTotal,
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
      console.log('error wizard capacitacion', e);
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
      <div className={styles['badge']}>{esJuridica ? 'Persona Juridica' : 'Persona Natural'}</div>
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
          </>
        )}
        {paso === 1 && (
          <>
            <div style={{ display: 'grid', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600 }}>Cursos</label>
              {CURSOS_CAPACITACION.map((c) => (
                <label key={c.value} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="checkbox" value={c.value} {...register('cursos')} />
                  <span>
                    {c.label} - {formatMoney(c.costo)}
                  </span>
                </label>
              ))}
              {errors.cursos && <span className={styles['error']}>{errors.cursos.message}</span>}
            </div>
            <Input
              label="Cantidad de participantes"
              type="number"
              error={errors.cantidadParticipantes?.message}
              {...register('cantidadParticipantes')}
            />
          </>
        )}
        {paso === 2 && (
          <>
            {esJuridica ? (
              <>
                <FileUpload
                  label="Lista Excel de participantes"
                  accept=".xlsx,.xls"
                  onFileSelect={setFile('archivoExcel')}
                />
                {errors.archivoExcel && (
                  <span className={styles['error']}>{errors.archivoExcel.message}</span>
                )}
                <p style={{ fontSize: 13, color: '#757575' }}>
                  Columnas: Nombre, Carnet, Expedido, Curso(s), Email, Telefono
                </p>
              </>
            ) : (
              <p style={{ fontSize: 13, color: '#555' }}>
                Como persona natural, los datos del participante se toman de tu cuenta registrada.
              </p>
            )}
            <div className={styles['total']}>
              Total a pagar ({cursosWatch?.length || 0} curso(s) x {cantidadWatch || 1}{' '}
              participante(s)): <strong>{formatMoney(montoTotal)}</strong>
            </div>
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
                label="Monto total (Bs)"
                type="number"
                value={montoTotal}
                onChange={() => undefined}
                style={{ background: '#f5f5f5' }}
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
